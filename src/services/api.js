const BASE_URL = import.meta.env.VITE_API_URL;

export async function getProductos() {
  const res = await fetch(`${BASE_URL}/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function eliminarProducto(id) {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar");
  return res.json();
}
