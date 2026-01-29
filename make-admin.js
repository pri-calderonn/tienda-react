const pool = require("./db");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    const email = "admin@test.cl";
    const nuevaPassword = "Admin123"; // <- contraseña que vas a usar para loguearte

    // 1) Verificar que exista
    const before = await pool.query(
      "SELECT id, email, rol FROM usuarios WHERE email=$1",
      [email]
    );

    if (before.rows.length === 0) {
      console.log("❌ No existe el usuario:", email);
      console.log("👉 Debes crearlo primero (o cambiar el email aquí).");
      process.exit(0);
    }

    // 2) Hashear contraseña con bcrypt
    const hash = await bcrypt.hash(nuevaPassword, 10);

    // 3) Actualizar rol + contraseña
    await pool.query(
      "UPDATE usuarios SET rol='ADMIN', contrasenia=$2 WHERE email=$1",
      [email, hash]
    );

    // 4) Confirmar
    const after = await pool.query(
      "SELECT id, email, rol FROM usuarios WHERE email=$1",
      [email]
    );

    console.log("✅ ADMIN actualizado:", after.rows);
    console.log("✅ Password seteada a:", nuevaPassword);
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
})();
