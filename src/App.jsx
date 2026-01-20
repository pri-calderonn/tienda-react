import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/organisms/Navbar.jsx';
import ProductList from './components/organisms/ProductList.jsx';
import RegisterSection from './components/organisms/RegisterSection.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', paddingBottom: '40px' }}>
        <Routes>
          <Route path="/carrito" element={<Cart />} />
          <Route path="/perfil" element={<Profile />} />


          
          <Route
            path="/"
            element={
              <div>
                <section className="hero-gamer">
                  <div className="container py-5 text-center">
                    <img src="/img/logo.png" alt="Level-Up Gamer" className="hero-logo mb-3" />
                    <h1 className="hero-title">LEVEL-UP GAMER</h1>
                    <p className="hero-subtitle">
                      Tu tienda gamer con consolas, accesorios y mucho más.
                    </p>
                    <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
                      <a className="btn btn-success fw-bold px-4" href="#productos">
                        VER PRODUCTOS
                      </a>
                      <a className="btn btn-outline-primary fw-bold px-4" href="/registro">
                        CREAR CUENTA
                      </a>
                    </div>
                  </div>
                </section>

                <section id="productos" className="py-5">
                  <div className="container">
                    <h2
                      className="text-center text-success mb-4"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      Productos destacados
                    </h2>
                    <ProductList />
                  </div>
                </section>
              </div>
            }
          />

          {/* REGISTRO */}
          <Route path="/registro" element={<RegisterSection />} />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* DETALLE PRODUCTO */}
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
