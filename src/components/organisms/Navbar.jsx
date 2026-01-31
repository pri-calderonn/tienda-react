import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const orbitronStyle = { fontFamily: "Orbitron, sans-serif" };

  useEffect(() => {
    const sync = () => setUser(AuthService.getCurrentUser());

  
    sync();


    const onAuthChanged = () => sync();
    window.addEventListener("auth_changed", onAuthChanged);

  
    const onStorage = () => sync();
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("auth_changed", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  const isStaff = user?.rol === "ADMIN" || user?.rol === "VENDEDOR";

  return (
    <>
      {/* NAVBAR SUPERIOR */}
      <nav
        className="navbar navbar-expand-lg border-bottom border-primary"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/img/logo.png" alt="logo" width="50" className="me-2" />
            <span className="text-success fw-bold" style={orbitronStyle}>
              LEVEL-UP <span className="text-primary">GAMER</span>
            </span>
          </Link>

          <div className="d-flex align-items-center">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary ms-2"
                  style={orbitronStyle}
                >
                  Iniciar Sesión
                </Link>

                <Link
                  to="/registro"
                  className="btn btn-primary ms-2"
                  style={orbitronStyle}
                >
                  Crear Cuenta
                </Link>
              </>
            )}

            {user && (
              <>
                {isStaff && (
                  <Link
                    to="/productos"
                    className="btn btn-outline-warning me-2"
                    style={orbitronStyle}
                  >
                    Inventario
                  </Link>
                )}

                <span className="text-white me-3">
                   <strong>{user.nombre || "Usuario"}</strong> ({user.rol})
                </span>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                  style={orbitronStyle}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* NAVBAR INFERIOR */}
      <nav
        className="navbar navbar-expand-lg border-bottom border-dark"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="container-fluid">
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-white px-3" to="/">
                  <strong>Home</strong>
                </Link>
              </li>

              <li className="nav-item ms-lg-5 mt-2 mt-lg-0">
                <Link
                  className="btn btn-success fw-bold px-4"
                  to="/carrito"
                  style={orbitronStyle}
                >
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
