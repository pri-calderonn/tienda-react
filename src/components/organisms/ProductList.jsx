import { useMemo, useState } from "react";
import ProductCard from "../molecules/productCard.jsx";
import { products } from "../../data/products.js";

const ALL_CATEGORIES = [
  "Todos",
  "Juegos de Mesa",
  "Accesorios",
  "Consolas",
  "Computadores Gamers",
  "Sillas Gamers",
  "Mouse",
  "Mousepad",
  "Poleras Personalizadas",
  "Polerones Gamers Personalizados",
  "Servicio Técnico",
];

export default function ProductList() {
  const [categoria, setCategoria] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return products.filter((p) => {
      const cat = p.categoria || "Todos";
      const name = String(p.nombre || "").toLowerCase();

      const matchCategory = categoria === "Todos" ? true : cat === categoria;
      const matchSearch = s.length === 0 ? true : name.includes(s);

      return matchCategory && matchSearch;
    });
  }, [categoria, search]);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-12 text-center">
          <h2 className="text-white mb-3">Nuestros Productos</h2>

          <input
            type="text"
            className="form-control mb-3 w-50 mx-auto"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="d-flex flex-wrap justify-content-center gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`btn ${categoria === cat ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <div className="col-md-4 col-lg-3" key={p.id}>
              <ProductCard
                id={p.id}
                nombre={p.nombre}
                precio={p.precio}
                imagen={p.imagen}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-white">
            <p>No se encontraron productos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
