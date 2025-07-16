import { createContext, useContext, useState, type ReactNode } from "react";
import toast from 'react-hot-toast';
import { useEffect } from "react";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  img : string;
}
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id:number, quantity:number) => void;
  clearCart: () => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }:{children:ReactNode}) => {

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
});

  useEffect(() => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}, [cartItems]);

  const addToCart = (item: CartItem) => {
  setCartItems((prev) => {
    const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        toast.success("Đã cập nhật số lượng trong giỏ hàng!");
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        toast.success("Đã thêm vào giỏ hàng!");
        return [...prev, item];
      }
    });
  };
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity,clearCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
