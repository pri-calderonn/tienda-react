import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const saved = localStorage.getItem('lug_user');
    if (!saved) {
      setError('No hay usuario registrado. Crea una cuenta primero.');
      return;
    }

    const user = JSON.parse(saved);

    if (user.email === form.email.trim().toLowerCase() && user.password === form.password) {
      localStorage.setItem('lug_session', 'true');
      navigate('/');
      return;
    }

    setError('Correo o contraseña incorrectos.');
  };

  return (
    <div className="container py-5 text-white" style={{ maxWidth: 520 }}>
      <h2 className="text-success mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        Iniciar Sesión
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4 border border-primary rounded bg-dark">
        <div className="mb-3 text-start">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control bg-secondary text-white border-0"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 text-start">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control bg-secondary text-white border-0"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary w-100 fw-bold">ENTRAR</button>
      </form>
    </div>
  );
}
