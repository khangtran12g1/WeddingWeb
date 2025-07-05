import { createContext, useContext, useState, type ReactNode } from "react";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }:{children:ReactNode}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
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
