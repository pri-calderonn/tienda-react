import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const producto = products.find((p) => p.id === id);

  if (!producto) {
    return (
      <div className="container text-center text-white py-5">
        <h2>Producto no encontrado</h2>
        <Link to="/" className="btn btn-outline-success mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 text-white">
      <Link to="/" className="btn btn-outline-success mb-4">
        ← Volver
      </Link>

      <div className="row align-items-center g-4">
        <div className="col-md-6">
          <div className="card p-3">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid"
              style={{ maxHeight: '420px', objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <h1
            className="text-success"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {producto.nombre}
          </h1>

          <h3 className="text-primary">{producto.precio}</h3>

          <p
            className="mt-3"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {producto.descripcion}
          </p>

          <button
            className="btn btn-success fw-bold mt-3"
            onClick={() => {
              addToCart(
                {
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  imagen: producto.imagen,
                },
                1
              );
              alert('Producto agregado al carrito ✅');
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
