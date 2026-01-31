import api from "./AxiosConfig";

class ProductoService {
  getAllProductos() {
    return api.get("/productos");
  }

  createProducto(producto) {
    return api.post("/productos", producto);
  }

  getProductoById(id) {
    return api.get(`/productos/${id}`);
  }

  updateProducto(id, producto) {
    return api.put(`/productos/${id}`, producto);
  }

  deleteProducto(id) {
    return api.delete(`/productos/${id}`);
  }
}

export default new ProductoService();
