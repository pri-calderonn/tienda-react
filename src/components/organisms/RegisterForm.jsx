import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    edad: "",
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const esDuoc = useMemo(() => {
    const email = form.email.trim().toLowerCase();
    return email.endsWith("@duoc.cl") || email.endsWith("@duocuc.cl");
  }, [form.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const erroresTemp = {};

    if (!form.nombre.trim()) erroresTemp.nombre = "El nombre es obligatorio";
    else if (form.nombre.trim().length < 3) erroresTemp.nombre = "El nombre debe tener al menos 3 caracteres";

    if (!form.edad) erroresTemp.edad = "La edad es obligatoria";
    else if (Number(form.edad) < 18) erroresTemp.edad = "Debes ser mayor de 18 años para registrarte";

    if (!form.email.trim()) erroresTemp.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) erroresTemp.email = "Email no válido";

    if (!form.password.trim()) erroresTemp.password = "La contraseña es obligatoria";
    else if (form.password.length < 6) erroresTemp.password = "Debe tener al menos 6 caracteres";

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setLoading(true);

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          edad: Number(form.edad),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error registrando");
      }

      // ✅ Mensaje correcto: solo DUOC menciona descuento
      const msg = esDuoc
        ? "✅ Registro exitoso.\n\n🎓 Correo DUOC detectado.\nSe aplicará descuento en la compra.\n\nAhora inicia sesión."
        : "✅ Registro exitoso.\n\nAhora inicia sesión.";

      alert(msg);
      navigate("/login");

      setForm({ nombre: "", email: "", password: "", edad: "" });
      setErrores({});
    } catch (err) {
      alert(`❌ No se pudo registrar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-primary rounded bg-dark text-white">
      <h3 className="mb-3 text-success" style={{ fontFamily: "Orbitron, sans-serif" }}>
        Registro de Guerrero
      </h3>

      <div className="mb-3 text-start">
        <label className="form-label">Nombre Completo</label>
        <input
          type="text"
          name="nombre"
          className="form-control bg-secondary text-white border-0"
          value={form.nombre}
          onChange={handleChange}
        />
        {errores.nombre && <small className="text-warning fw-bold">{errores.nombre}</small>}
      </div>

      <div className="mb-3 text-start">
        <label className="form-label">Edad</label>
        <input
          type="number"
          name="edad"
          className="form-control bg-secondary text-white border-0"
          value={form.edad}
          onChange={handleChange}
        />
        {errores.edad && <small className="text-warning fw-bold">{errores.edad}</small>}
      </div>

      <div className="mb-2 text-start">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control bg-secondary text-white border-0"
          value={form.email}
          onChange={handleChange}
        />
        {errores.email && <small className="text-warning fw-bold">{errores.email}</small>}
      </div>

      {/* Mensaje DUOC en vivo (esto está bien que siempre muestre tip o confirmación) */}
      {form.email.trim().length > 0 && (
        <div className={`alert py-2 mt-2 ${esDuoc ? "alert-success" : "alert-info"}`} role="alert">
          {esDuoc
            ? "🎉 Correo DUOC detectado: puedes aplicar descuento en la compra."
            : "Tip: usa un correo DUOC para obtener descuento."}
        </div>
      )}

      <div className="mb-3 text-start">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          name="password"
          className="form-control bg-secondary text-white border-0"
          value={form.password}
          onChange={handleChange}
        />
        {errores.password && <small className="text-warning fw-bold">{errores.password}</small>}
      </div>

      <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm" disabled={loading}>
        {loading ? "REGISTRANDO..." : "UNIRSE A LA COMUNIDAD"}
      </button>
    </form>
  );
}
