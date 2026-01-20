import { Link } from 'react-router-dom';

export default function ProductCard({ id, nombre, precio, imagen }) {
  return (
    <Link to={`/producto/${id}`} className="text-decoration-none">
      <div className="card h-100">
        <img
          src={imagen}
          alt={nombre}
          className="card-img-top img-fluid"
          style={{ maxHeight: '180px', objectFit: 'contain' }}
        />
        <div className="card-body text-center">
          <h5 className="card-title text-dark">{nombre}</h5>
          <p className="card-text text-dark">{precio}</p>
          <span className="btn btn-primary">Ver detalles</span>
        </div>
      </div>
    </Link>
  );
}
