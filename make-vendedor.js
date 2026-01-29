const pool = require("./db");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    const email = "vendedor@test.cl";
    const password = "Vendedor123";
    const nombre = "Vendedor";

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO usuarios (nombre, email, contrasenia, rol)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email)
      DO UPDATE SET rol = 'VENDEDOR'
      `,
      [nombre, email, hash, "VENDEDOR"]
    );

    const check = await pool.query(
      "SELECT id, email, rol FROM usuarios WHERE email=$1",
      [email]
    );

    console.log("✅ RESULTADO:", check.rows);
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
})();
