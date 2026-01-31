import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductoService from "../ProductoService";
import AuthService from "../services/AuthService";

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const user = AuthService.getCurrentUser();
  const isAdmin = user?.rol === "ADMIN";
  const isVendedor = user?.rol === "VENDEDOR";

  useEffect(() => {
    listarProductos();
  }, []);

  const listarProductos = () => {
    ProductoService.getAllProductos()
      .then((res) => setProductos(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.log("Error inventario:", err));
  };

  const eliminar = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("¿Eliminar producto?")) return;

    try {
      await ProductoService.deleteProducto(id);
      listarProductos();
    } catch (e) {
      alert("No se pudo eliminar (revisa permisos/token).");
    }
  };

  return (
    <div className="container p-4">
      <h2 className="text-center mb-4 text-white">Inventario</h2>

      {/* SOLO ADMIN puede agregar */}
      {isAdmin && (
        <Link to="/add-producto" className="btn btn-primary mb-3">
          Agregar Producto
        </Link>
      )}

      {/* VENDEDOR: solo ver */}
      {isVendedor && (
        <div className="alert alert-info">
          Sesión VENDEDOR: solo puedes visualizar productos.
        </div>
      )}

      <table className="table table-dark table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th style={{ width: 230 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>
                {/* SOLO ADMIN puede editar */}
                {isAdmin ? (
                  <>
                    <Link className="btn btn-info btn-sm me-2" to={`/edit-producto/${p.id}`}>
                      Editar
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>
                      Eliminar
                    </button>
                  </>
                ) : (
                  <span className="text-secondary">Sin permisos</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProductos;
