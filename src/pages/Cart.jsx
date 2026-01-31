import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import api from "../AxiosConfig";
import AuthService from "../services/AuthService";

function formatCLP(n) {
  const num = Number(n) || 0;
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(num);
}

function getJwtUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getUserDiscountRate() {
  const user = getJwtUser();
  if (!user) return 0;

  const email = String(user.email || "").toLowerCase().trim();
  const esDuoc = email.endsWith("@duoc.cl") || email.endsWith("@duocuc.cl");
  return esDuoc ? 0.2 : 0;
}


const isNumeric = (v) => /^\d+$/.test(String(v));

const normName = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

async function resolveProductoId(item, apiProductsCache) {
 
  if (isNumeric(item.id)) return Number(item.id);

  
  const targetName = normName(item.nombre);


  if (!apiProductsCache.list) {
    const res = await api.get("/productos"); // público
    apiProductsCache.list = Array.isArray(res.data) ? res.data : [];
  }

  const found = apiProductsCache.list.find((p) => normName(p.nombre) === targetName);

  if (!found) return null;
  return Number(found.id);
}

export default function Cart() {
  const { cartItems, removeFromCart, setQty, clearCart, total } = useCart();
  const [boletaUI, setBoletaUI] = useState(null); // ✅ aquí guardamos la boleta creada

  const user = getJwtUser();
  const discountRate = getUserDiscountRate();
  const discountAmount = Math.round(total * discountRate);
  const finalTotal = Math.max(0, total - discountAmount);

  const finalizarCompra = async () => {
    const current = AuthService.getCurrentUser();

    if (!current) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }
    if (current.rol !== "CLIENTE") {
      alert("Solo los CLIENTES pueden comprar.");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const apiProductsCache = { list: null };

    try {
      const items = [];

      for (const it of cartItems) {
        const cantidad = Number(it.qty);
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
          alert(`Cantidad inválida en: ${it.nombre}`);
          return;
        }

        const producto_id = await resolveProductoId(it, apiProductsCache);
        if (!producto_id || !Number.isInteger(producto_id) || producto_id <= 0) {
          alert(
            `❌ El producto "${it.nombre}" no existe en la BD/API.\n\n` +
              `Crea ese producto en Inventario (Admin) con el mismo nombre o elimínalo del carrito.`
          );
          return;
        }

        items.push({ producto_id, cantidad });
      }

      const res = await api.post("/boletas", { items });

      setBoletaUI(res.data);
      clearCart();
    } catch (e) {
      console.log(e);
      alert(e?.response?.data?.message || "Error creando boleta");
    }
  };

  return (
    <div className="container py-5 text-white">
      <h2 className="text-success mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
        Carrito de compras
      </h2>

     
      {boletaUI && (
        <div className="mb-4">
          <div className="card p-4 shadow-lg">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h4 className="mb-1">Boleta #{boletaUI.boleta?.id}</h4>
                <div className="text-muted">
                  Fecha:{" "}
                  {boletaUI.boleta?.fecha
                    ? new Date(boletaUI.boleta.fecha).toLocaleString()
                    : "—"}
                </div>
                <div className="text-muted">
                  Cliente: {boletaUI.cliente_email || user?.email || "—"}
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={() => window.print()}>
                  Imprimir
                </button>
                <button className="btn btn-danger" onClick={() => setBoletaUI(null)}>
                  Cerrar
                </button>
              </div>
            </div>

            <hr />

            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(boletaUI.detalles || []).map((d, idx) => (
                    <tr key={d.id ?? idx}>
                      <td>{idx + 1}</td>
                      <td>
                        {d.producto_nombre}{" "}
                        <span className="text-muted">(#{d.producto_id})</span>
                      </td>
                      <td>{d.cantidad}</td>
                      <td>{formatCLP(d.precio_unitario)}</td>
                      <td className="fw-bold">{formatCLP(d.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end">
              <div style={{ minWidth: 320 }}>
                <div className="d-flex justify-content-between">
                  <span>Total boleta (BD)</span>
                  <strong>{formatCLP(boletaUI.boleta?.total)}</strong>
                </div>

                <div className="d-flex justify-content-between mt-1">
                  <span>Descuento DUOC (frontend)</span>
                  <strong className={discountRate > 0 ? "text-success" : "text-muted"}>
                    {discountRate > 0 ? `- ${formatCLP(discountAmount)} (20%)` : formatCLP(0)}
                  </strong>
                </div>

                <hr className="my-2" />

                
                <div className="d-flex justify-content-between fs-5">
                  <span>Total a pagar</span>
                  <strong className="text-primary">{formatCLP(boletaUI.boleta?.total)}</strong>
                </div>

                {discountRate > 0 && (
                  <div className="alert alert-success mt-3 py-2 mb-0">
                    🎉 Descuento DUOC aplicado (20%).
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Tu carrito está vacío.{" "}
          <Link to="/" className="alert-link">
            Ir a productos
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th style={{ width: 180 }}>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => {
                  const precioNum = Number(String(item.precio).replace(/[^0-9]/g, "") || 0);
                  const subtotal = precioNum * item.qty;

                  return (
                    <tr key={`${item.id}-${item.nombre}`}>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            style={{ width: 60, height: 60, objectFit: "contain" }}
                          />
                          <div>
                            <div className="fw-bold">{item.nombre}</div>
                            <Link to={`/producto/${item.id}`} className="small text-info">
                              Ver detalle
                            </Link>
                          </div>
                        </div>
                      </td>

                      <td>{item.precio}</td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => setQty(item.id, item.qty - 1)}
                          >
                            −
                          </button>

                          <span className="fw-bold">{item.qty}</span>

                          <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => setQty(item.id, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="fw-bold">{formatCLP(subtotal)}</td>

                      <td className="text-end">
                        <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row mt-4 g-3">
            <div className="col-md-7">
              <button className="btn btn-outline-warning" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>

            <div className="col-md-5">
              <div className="card p-3">
                <h5 className="text-dark mb-3">Resumen</h5>

                <div className="d-flex justify-content-between text-dark">
                  <span>Subtotal</span>
                  <strong>{formatCLP(total)}</strong>
                </div>

                <div className="d-flex justify-content-between text-dark mt-2">
                  <span>Descuento DUOC</span>
                  <strong className={discountRate > 0 ? "text-success" : "text-muted"}>
                    {discountRate > 0 ? `- ${formatCLP(discountAmount)} (20%)` : formatCLP(0)}
                  </strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between text-dark fs-5">
                  <span>Total a pagar</span>
                  <strong className="text-primary">{formatCLP(finalTotal)}</strong>
                </div>

                <button className="btn btn-success fw-bold mt-3 px-4" onClick={finalizarCompra}>
                  Finalizar compra
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
