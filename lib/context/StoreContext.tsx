"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
};

type UserState = {
  name: string;
  email: string;
  token: string | null;
} | null;

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  addManyToCart: (items: Omit<CartItem, "quantity">[]) => void;

  // Wishlist
  wishlist: string[]; // array of product IDs
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;

  // Auth
  user: UserState;
  login: (userData: UserState) => void;
  logout: () => void;
  
  // UI States
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<UserState>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("glowmart_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("glowmart_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const token = localStorage.getItem("glowmart_token");
      if (token) {
        setUser({ name: "Demo User", email: "user@example.com", token }); // Mock user recovery
      }
    } catch (e) {
      console.error("Failed to load local state", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("glowmart_cart", JSON.stringify(cart));
      localStorage.setItem("glowmart_wishlist", JSON.stringify(wishlist));
    }
  }, [cart, wishlist, isInitialized]);

  // Cart Actions
  const addToCart = (product: Omit<CartItem, "quantity">, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setCartOpen(true); // Auto-open cart on add
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const clearCart = () => setCart([]);

  const addManyToCart = (items: Omit<CartItem, "quantity">[]) => {
    setCart((prev) => {
      let next = [...prev];
      items.forEach(product => {
        const existing = next.find((item) => item.id === product.id);
        if (existing) {
          next = next.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          next.push({ ...product, quantity: 1 });
        }
      });
      return next;
    });
    setCartOpen(true);
  };

  // Computed Cart
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist Actions
  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  // Auth Actions
  const login = (userData: UserState) => {
    setUser(userData);
    if (userData?.token) localStorage.setItem("glowmart_token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("glowmart_token");
    router.push("/auth");
  };

  return (
    <StoreContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, addManyToCart,
        wishlist, toggleWishlist, isInWishlist,
        user, login, logout,
        cartOpen, setCartOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
