import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PREFS = [
  'Juegos de Mesa',
  'Accesorios',
  'Consolas',
  'Computadores Gamers',
  'Sillas Gamers',
  'Mouse',
  'Mousepad',
  'Poleras Personalizadas',
  'Polerones Gamers Personalizados',
  'Servicio Técnico',
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState('');
  const [prefs, setPrefs] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('lug_user');
    if (!raw) return;

    const u = JSON.parse(raw);
    setUser(u);
    setNombre(u.nombre || '');
    setPrefs(Array.isArray(u.preferencias) ? u.preferencias : []);
  }, []);

  const togglePref = (cat) => {
    setPrefs((prev) => (prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]));
  };

  const guardar = () => {
    if (!user) return;

    if (!nombre.trim() || nombre.trim().length < 2) {
      setMsg('❌ El nombre debe tener al menos 2 caracteres.');
      setTimeout(() => setMsg(''), 2500);
      return;
    }

    const updated = {
      ...user,
      nombre: nombre.trim(),
      preferencias: prefs,
    };

    localStorage.setItem('lug_user', JSON.stringify(updated));
    setUser(updated);

    setMsg('✅ Perfil actualizado correctamente');
    setTimeout(() => setMsg(''), 2500);
  };

  if (!user) {
    return (
      <div className="container py-5 text-white">
        <h2 className="text-success mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Mi Perfil
        </h2>

        <div className="alert alert-warning">
          No hay usuario registrado o sesión activa.{' '}
          <Link to="/login" className="alert-link">
            Inicia sesión
          </Link>{' '}
          o{' '}
          <Link to="/registro" className="alert-link">
            crea una cuenta
          </Link>
          .
        </div>
      </div>
    );
  }

  const discountRate =
    typeof user.descuentoDuoc === 'number'
      ? user.descuentoDuoc
      : String(user.email || '').toLowerCase().endsWith('@duoc.cl')
      ? 0.2
      : 0;

  const esDuoc = discountRate > 0;

  return (
    <div className="container py-5 text-white" style={{ maxWidth: 900 }}>
      <h2 className="text-success mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        Mi Perfil
      </h2>

      {msg && (
        <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
          {msg}
        </div>
      )}

      <div className="card p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-dark">Nombre</label>
            <input
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />
            <small className="text-muted">Puedes actualizar tu nombre aquí.</small>
          </div>

          <div className="col-md-6">
            <label className="form-label text-dark">Email</label>
            <input className="form-control" value={user.email} disabled />
            <small className={esDuoc ? 'text-success' : 'text-muted'}>
              {esDuoc ? '🎉 Descuento DUOC 20% activo de por vida' : 'Sin descuento DUOC'}
            </small>
          </div>

          <div className="col-md-3">
            <label className="form-label text-dark">Edad</label>
            <input className="form-control" value={user.edad ?? ''} disabled />
          </div>
        </div>

        <hr />

        <h5 className="text-dark mb-2">Preferencias de compra</h5>
        <p className="text-muted mb-3">
          Marca las categorías que más te interesan (esto cumple “gestión de preferencias”).
        </p>

        <div className="row">
          {PREFS.map((cat) => (
            <div className="col-md-6 mb-2" key={cat}>
              <label className="d-flex gap-2 align-items-center text-dark">
                <input
                  type="checkbox"
                  checked={prefs.includes(cat)}
                  onChange={() => togglePref(cat)}
                />
                {cat}
              </label>
            </div>
          ))}
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
          <button className="btn btn-primary fw-bold" onClick={guardar}>
            Guardar cambios
          </button>

          <Link to="/" className="btn btn-outline-secondary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
