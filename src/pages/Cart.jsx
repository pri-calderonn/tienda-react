import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function formatCLP(n) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n);
}

function getUserDiscount() {
  try {
    const raw = localStorage.getItem('lug_user');
    if (!raw) return 0;

    const user = JSON.parse(raw);

    // Preferimos el campo guardado en registro
    if (typeof user.descuentoDuoc === 'number') return user.descuentoDuoc;

    // Fallback por si no lo guardaste: detectamos por email
    const email = String(user.email || '').toLowerCase().trim();
    if (email.endsWith('@duoc.cl') || email.endsWith('@duocuc.cl')) return 0.2;

    return 0;
  } catch {
    return 0;
  }
}

export default function Cart() {
  const { cartItems, removeFromCart, setQty, clearCart, total } = useCart();

  const discountRate = getUserDiscount(); // 0 o 0.2
  const discountAmount = Math.round(total * discountRate);
  const finalTotal = Math.max(0, total - discountAmount);

  return (
    <div className="container py-5 text-white">
      <h2 className="text-success mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        Carrito de compras
      </h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Tu carrito está vacío.{' '}
          <Link to="/" className="alert-link">
            Ir a productos
          </Link>
        </div>
      ) : (
        <>
          {/* Tabla */}
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
                  const precioNum = Number(String(item.precio).replace(/[^0-9]/g, '') || 0);
                  const subtotal = precioNum * item.qty;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            style={{ width: 60, height: 60, objectFit: 'contain' }}
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

          {/* Resumen */}
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
                  <strong className={discountRate > 0 ? 'text-success' : 'text-muted'}>
                    {discountRate > 0 ? `- ${formatCLP(discountAmount)} (20%)` : formatCLP(0)}
                  </strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between text-dark fs-5">
                  <span>Total a pagar</span>
                  <strong className="text-primary">{formatCLP(finalTotal)}</strong>
                </div>

                {discountRate > 0 ? (
                  <div className="alert alert-success mt-3 py-2 mb-0">
                    🎉 Descuento DUOC aplicado de por vida (20%).
                  </div>
                ) : (
                  <div className="alert alert-info mt-3 py-2 mb-0">
                    Tip: regístrate con correo DUOC para obtener 20% de por vida.
                  </div>
                )}

                <button className="btn btn-success fw-bold mt-3 px-4">
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
