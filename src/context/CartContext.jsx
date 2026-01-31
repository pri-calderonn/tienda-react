import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from "../AxiosConfig"; 

const CartContext = createContext(null);
const CART_KEY = 'lug_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const setQty = (id, qty) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const itemsCount = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.qty, 0),
    [cartItems]
  );

  const total = useMemo(() => {
    const toNumber = (precioStr) =>
      Number(String(precioStr).replace(/[^0-9]/g, '') || 0);

    return cartItems.reduce((acc, i) => acc + toNumber(i.precio) * i.qty, 0);
  }, [cartItems]);

  // 2. FUNCIÓN DE COMPRA (Conectada al Backend)
  const checkout = async () => {
    if (cartItems.length === 0) return alert("El carrito está vacío");

    try {
      const response = await api.post("/comprar", {
        total: total,
        items: cartItems.map(i => ({
          producto_id: i.id,
          cantidad: i.qty,
          precio: i.precio
        }))
      });
      
      if (response.status === 200 || response.status === 201) {
        clearCart();
        alert("¡Compra realizada con éxito! Revisa tu perfil.");
      }
    } catch (error) {
      console.error("Error al finalizar compra", error);
      alert("Error: Debes iniciar sesión como CLIENTE para comprar.");
    }
  };

 
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    itemsCount,
    total,
    checkout, 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}