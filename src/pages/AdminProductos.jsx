import { useEffect, useState } from "react";
import { getProductos, eliminarProducto } from "../services/api.js";

export default function AdminProductos() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    getProductos().then(setProducts);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar?")) {
      await eliminarProducto(id);
      cargarProductos(); // Recarga la tabla
    }
  };

  return (
    <div className="container bg-white p-4 mt-5 rounded">
      <h2 className="text-center mb-4">Inventario</h2>
      <button className="btn btn-primary mb-3">Agregar Producto</button>
      
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>
                <button className="btn btn-info btn-sm me-2">Editar</button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleEliminar(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}