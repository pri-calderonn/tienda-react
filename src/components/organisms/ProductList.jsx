import { useMemo, useState } from 'react';
import ProductCard from '../molecules/ProductCard.jsx';
import { products } from '../../data/products.js'; // cambia a product.js si corresponde

const ALL_CATEGORIES = [
  'Todos',
  'Juegos de Mesa',
  'Accesorios',
  'Consolas',
  'Computadores Gamers',
  'Sillas Gamers',
  'Mouse',
  'Mousepad',
  'Poleras Personalizadas',
  'Polerones Gamers Personalizados',
  'Servicio Técnico',
];

export default function ProductList() {
  const [categoria, setCategoria] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return products.filter((p) => {
      const matchCategory = categoria === 'Todos' ? true : p.categoria === categoria;
      const matchSearch = s.length === 0 ? true : p.nombre.toLowerCase().includes(s);
      return matchCategory && matchSearch;
    });
  }, [categoria, search]);

  return (
    <div className="container mt-4">
      {/* FILTROS */}
      <div className="row g-3 align-items-end mb-3">
        <div className="col-md-6">
          <label className="form-label text-white">Buscar producto</label>
          <input
            className="form-control bg-dark text-white border-primary"
            placeholder="Ej: Catan, PS5, Mouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label text-white">Categoría</label>
          <select
            className="form-select bg-dark text-white border-primary"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-outline-warning w-100"
            onClick={() => {
              setSearch('');
              setCategoria('Todos');
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <small className="text-secondary">
          Mostrando <strong>{filtered.length}</strong> producto(s)
        </small>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-info">
          No hay productos para esa búsqueda/categoría.
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((p) => (
            <div className="col-md-4" key={p.id}>
              <ProductCard id={p.id} nombre={p.nombre} precio={p.precio} imagen={p.imagen} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
