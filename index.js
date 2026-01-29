const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

/* =========================
   MIDDLEWARE JWT
========================= */
function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, rol }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: "Sin permisos" });
    }
    next();
  };
}

/* =========================
   AUTH
========================= */
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = String(email || "").toLowerCase().trim();

    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [cleanEmail]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(String(password || ""), user.contrasenia))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en login");
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const { nombre, email, password, edad } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "nombre, email y password son obligatorios" });
    }

    if (edad !== undefined && Number(edad) < 18) {
      return res.status(400).json({ message: "Debes ser mayor de 18 años" });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const exists = await pool.query("SELECT id FROM usuarios WHERE email=$1", [cleanEmail]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(String(password), 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, contrasenia, rol)
       VALUES ($1, $2, $3, 'CLIENTE')
       RETURNING id, nombre, email, rol`,
      [String(nombre).trim(), cleanEmail, hash]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registrando usuario" });
  }
});

/* =========================
   PERFIL
========================= */
app.get("/me", authRequired, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE id=$1", [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo perfil" });
  }
});

app.put("/me", authRequired, async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || String(nombre).trim().length < 3) {
      return res.status(400).json({ message: "El nombre debe tener al menos 3 caracteres" });
    }

    // Si viene password, la actualizamos con bcrypt
    if (password && String(password).trim().length > 0) {
      if (String(password).length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      }

      const hash = await bcrypt.hash(String(password), 10);

      const result = await pool.query(
        "UPDATE usuarios SET nombre=$1, contrasenia=$2 WHERE id=$3 RETURNING id, nombre, email, rol",
        [String(nombre).trim(), hash, req.user.id]
      );

      return res.json({ message: "Perfil actualizado", user: result.rows[0] });
    }

    // Si no viene password, solo nombre
    const result = await pool.query(
      "UPDATE usuarios SET nombre=$1 WHERE id=$2 RETURNING id, nombre, email, rol",
      [String(nombre).trim(), req.user.id]
    );

    res.json({ message: "Perfil actualizado", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando perfil" });
  }
});

/* =========================
   PRODUCTOS
========================= */
app.get("/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error de conexión");
  }
});

app.get("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM productos WHERE id=$1", [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: "No encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
});

app.post("/productos", authRequired, requireRole("ADMIN"), async (req, res) => {
  try {
    const { nombre, precio, categoria_id } = req.body;

    if (!nombre || precio === undefined || precio === null) {
      return res.status(400).json({ message: "nombre y precio son obligatorios" });
    }

    const result = await pool.query(
      "INSERT INTO productos (nombre, precio, categoria_id) VALUES ($1, $2, $3) RETURNING *",
      [nombre, precio, categoria_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando producto" });
  }
});

app.put("/productos/:id", authRequired, requireRole("ADMIN"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria_id } = req.body;

    if (!nombre || precio === undefined || precio === null) {
      return res.status(400).json({ message: "nombre y precio son obligatorios" });
    }

    const result = await pool.query(
      "UPDATE productos SET nombre=$1, precio=$2, categoria_id=$3 WHERE id=$4 RETURNING *",
      [nombre, precio, categoria_id || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "No encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error editando producto" });
  }
});

app.delete("/productos/:id", authRequired, requireRole("ADMIN"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM productos WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "No encontrado" });

    res.json({ message: "Producto eliminado", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando producto" });
  }
});

/* =========================
   BOLETAS
========================= */
app.post("/boletas", authRequired, requireRole("CLIENTE"), async (req, res) => {
  const client = await pool.connect();

  try {
    const usuario_id = req.user.id;
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (items.length === 0) {
      return res.status(400).json({ message: "items requerido" });
    }

    await client.query("BEGIN");

    let total = 0;
    const detalles = [];

    for (const it of items) {
      const producto_id = Number(it.producto_id);
      const cantidad = Number(it.cantidad);

      if (!producto_id || !cantidad || cantidad <= 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "producto_id/cantidad inválidos" });
      }

      const prodRes = await client.query("SELECT id, precio FROM productos WHERE id=$1", [producto_id]);
      if (prodRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: `Producto ${producto_id} no existe` });
      }

      const precio_unitario = Number(prodRes.rows[0].precio);
      const subtotal = precio_unitario * cantidad;
      total += subtotal;

      detalles.push({ producto_id, cantidad, precio_unitario, subtotal });
    }

    const boletaRes = await client.query(
      "INSERT INTO boletas (usuario_id, total) VALUES ($1, $2) RETURNING *",
      [usuario_id, total]
    );
    const boleta = boletaRes.rows[0];

    for (const d of detalles) {
      await client.query(
        `INSERT INTO detalle_boleta (boleta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [boleta.id, d.producto_id, d.cantidad, d.precio_unitario, d.subtotal]
      );
    }

    await client.query("COMMIT");

    // ✅ Detalle con nombre del producto (JOIN)
    const detRes = await pool.query(
      `SELECT d.id,
              d.boleta_id,
              d.producto_id,
              p.nombre AS producto_nombre,
              d.cantidad,
              d.precio_unitario,
              d.subtotal
       FROM detalle_boleta d
       JOIN productos p ON p.id = d.producto_id
       WHERE d.boleta_id = $1
       ORDER BY d.id ASC`,
      [boleta.id]
    );

    // ✅ Email del cliente
    const userRes = await pool.query("SELECT email FROM usuarios WHERE id=$1", [usuario_id]);
    const cliente_email = userRes.rows[0]?.email || null;

    res.status(201).json({ boleta, cliente_email, detalles: detRes.rows });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Error creando boleta" });
  } finally {
    client.release();
  }
});

// ADMIN / VENDEDOR: ver todas las boletas (órdenes)
app.get("/boletas", authRequired, requireRole("ADMIN", "VENDEDOR"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.fecha, b.total, u.email
       FROM boletas b
       JOIN usuarios u ON u.id = b.usuario_id
       ORDER BY b.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando boletas" });
  }
});

// CLIENTE: ver sus boletas
app.get("/boletas/mias", authRequired, requireRole("CLIENTE"), async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const result = await pool.query(
      "SELECT * FROM boletas WHERE usuario_id=$1 ORDER BY id DESC",
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando boletas del cliente" });
  }
});

/* =========================
   START
========================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API cargada en http://0.0.0.0:${PORT}`);
});
