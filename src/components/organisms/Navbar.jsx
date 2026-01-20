import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const orbitronStyle = { fontFamily: 'Orbitron, sans-serif' };

  useEffect(() => {
    const savedUser = localStorage.getItem('lug_user');
    const session = localStorage.getItem('lug_session');

    if (savedUser && session === 'true') {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lug_session');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      {/* NAVBAR SUPERIOR */}
      <nav className="navbar navbar-expand-lg border-bottom border-primary" style={{ backgroundColor: '#000000' }}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/img/logo.png"
              alt="Level-Up Gamer logo"
              width="50"
              className="d-inline-block align-text-top me-2"
            />
            <span className="text-success fw-bold" style={orbitronStyle}>
              LEVEL-UP <span className="text-primary">GAMER</span>
            </span>
          </Link>

          <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex">
            <form className="d-flex w-50" role="search">
              <input
                className="form-control me-2 bg-dark text-white border-secondary"
                type="search"
                placeholder="Busca tu equipo gamer..."
              />
              <button className="btn btn-outline-success" type="submit" style={orbitronStyle}>
                BUSCAR
              </button>
            </form>
          </div>

          <div className="d-flex align-items-center">
            {/* SIN SESIÓN */}
            {!user && (
              <>
                <Link to="/login" className="btn btn-outline-primary ms-2" style={orbitronStyle}>
                  Iniciar Sesión
                </Link>

                <Link to="/registro" className="btn btn-primary ms-2" style={orbitronStyle}>
                  Crear Cuenta
                </Link>
              </>
            )}

            {/* CON SESIÓN */}
            {user && (
              <>
                <Link to="/perfil" className="btn btn-outline-info me-2" style={orbitronStyle}>
                  Mi Perfil
                </Link>

                <span className="text-white me-3">
                  👋 Hola, <strong>{user.nombre}</strong>
                </span>

                <button onClick={handleLogout} className="btn btn-outline-danger ms-2" style={orbitronStyle}>
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* NAVBAR INFERIOR */}
      <nav className="navbar navbar-expand-lg border-bottom border-dark" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="container-fluid">
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-white px-3" to="/"><strong>Home</strong></Link>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white px-3" href="#" role="button" data-bs-toggle="dropdown">
                  Categorías
                </a>
                <ul className="dropdown-menu dropdown-menu-dark border-primary">
                  <li><Link className="dropdown-item" to="/categoria/consolas">Consolas</Link></li>
                  <li><Link className="dropdown-item" to="/categoria/juegos-mesa">Juegos de Mesa</Link></li>
                  <li><Link className="dropdown-item" to="/categoria/accesorios">Accesorios</Link></li>
                  <li><Link className="dropdown-item" to="/categoria/pc-gamer">Computadores Gamers</Link></li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li><Link className="dropdown-item text-success" to="/categoria/servicio-tecnico">Servicio Técnico</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white px-3" to="/ofertas">Ofertas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white px-3" to="/nosotros">Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white px-3" to="/blog">Blog</Link>
              </li>

              <li className="nav-item ms-lg-5 mt-2 mt-lg-0">
                <Link className="btn btn-success fw-bold px-4" to="/carrito" style={orbitronStyle}>
                  CARRITO 🛒
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
