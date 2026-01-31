import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await AuthService.login(email, password);
      const rol = data?.user?.rol;

      if (rol === "ADMIN" || rol === "VENDEDOR") {
        navigate("/productos");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="container py-5 text-white" style={{ maxWidth: 520 }}>
      <h2 className="text-success mb-3">Iniciar Sesión</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4 border border-primary rounded bg-dark">
        <div className="mb-3">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="form-control bg-secondary text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            className="form-control bg-secondary text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-success w-100 fw-bold">ENTRAR</button>
      </form>
    </div>
  );
}
