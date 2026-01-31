import { useEffect, useState } from "react";
import api from "../AxiosConfig";
import AuthService from "../services/AuthService";

export default function Profile() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ nombre: "", password: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/me")
      .then((res) => {
        setPerfil(res.data);
        setForm({ nombre: res.data.nombre || "", password: "" });
      })
      .catch((err) => {
        console.log(err);
        setError("No se pudo cargar el perfil (¿sesión expirada?)");
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
    setError("");
  };

  const guardar = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const payload = { nombre: form.nombre };
      if (form.password.trim().length > 0) payload.password = form.password;

      const res = await api.put("/me", payload);

      setMsg(" Perfil actualizado");
      setPerfil(res.data.user);

      // actualizar localStorage para que el Navbar muestre nombre nuevo
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth_changed"));

      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Error actualizando perfil");
    }
  };

  if (!AuthService.getCurrentUser()) {
    return (
      <div className="container py-5 text-white">
        <h2>Debes iniciar sesión</h2>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="container py-5 text-white">
        <h2>Cargando perfil...</h2>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    );
  }

  return (
    <div className="container py-5 text-white" style={{ maxWidth: 700 }}>
      <h2 className="text-success mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
        Mi Perfil
      </h2>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="p-4 border border-primary rounded bg-dark">
        <p className="mb-1">
          <strong>Email:</strong> {perfil.email}
        </p>
        <p className="mb-3">
          <strong>Rol:</strong> {perfil.rol}
        </p>

        <form onSubmit={guardar}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control bg-secondary text-white border-0"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nueva contraseña (opcional)</label>
            <input
              type="password"
              name="password"
              className="form-control bg-secondary text-white border-0"
              value={form.password}
              onChange={handleChange}
              placeholder="Deja vacío para no cambiar"
            />
          </div>

          <button className="btn btn-success w-100 fw-bold">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}
