import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../AxiosConfig";
import { useCart } from "../context/CartContext.jsx";
import { products as localProducts } from "../data/products.js";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const isNumericId = useMemo(() => /^\d+$/.test(String(id)), [id]);

  const [producto, setProducto] = useState(null);
  const [source, setSource] = useState(null); 
  const [error, setError] = useState("");

  useEffect(() => {
    setProducto(null);
    setError("");
    setSource(null);

    
    if (isNumericId) {
      api
        .get(`/productos/${id}`)
        .then((res) => {
          setProducto(res.data);
          setSource("api");
        })
        .catch(() => {
          
          const local = localProducts.find((p) => String(p.id) === String(id));
          if (local) {
            setProducto(local);
            setSource("local");
          } else {
            setError("Producto no encontrado");
          }
        });

      return;
    }

    
    const local = localProducts.find((p) => String(p.id) === String(id));
    if (local) {
      setProducto(local);
      setSource("local");
    } else {
      setError("Producto no encontrado");
    }
  }, [id, isNumericId]);

  if (error) {
    return (
      <div className="container text-center text-white py-5">
        <h2>{error}</h2>
        <Link to="/" className="btn btn-outline-success mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container text-center text-white py-5">
        <h3>Cargando...</h3>
      </div>
    );
  }

  const nombre = producto.nombre;
  const precio = producto.precio;
  const imagen = producto.imagen || "/img/logo.png";
  const descripcion = producto.descripcion || "";

  const agregar = () => {

    addToCart(
      {
        id: producto.id,
        nombre,
        precio,
        imagen,
      },
      1
    );

    alert("Producto agregado al carrito ");
  };

  return (
    <div className="container py-5 text-white">
      <Link to="/" className="btn btn-outline-success mb-4">
        ← Volver
      </Link>

      <div className="row align-items-center g-4">
        <div className="col-md-6">
          <div className="card p-3">
            <img
              src={imagen}
              alt={nombre}
              className="img-fluid"
              style={{ maxHeight: "420px", objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <h1 className="text-success" style={{ fontFamily: "Orbitron, sans-serif" }}>
            {nombre}
          </h1>

          <h3 className="text-primary">
            {typeof precio === "number" ? `$${precio}` : String(precio)}
          </h3>

          {descripcion && (
            <p className="mt-3" style={{ color: "rgba(255,255,255,0.85)" }}>
              {descripcion}
            </p>
          )}

          
          <div className="small text-secondary mb-2">
            Fuente: {source === "api" ? "API" : "Catálogo local"}
          </div>

          <button className="btn btn-success fw-bold mt-2" onClick={agregar}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
