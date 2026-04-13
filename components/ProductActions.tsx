"use client";

import { useState } from "react";
import { useStore } from "../lib/context/StoreContext";
import { CheckCircle2, ShoppingBag, Heart } from "lucide-react";

interface ProductActionsProps {
  product: {
    id: string;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [added, setAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  return (
    <div className="flex flex-col gap-4 mb-12">
      <div className="flex gap-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-[#d4af37] text-black py-5 uppercase tracking-[0.2em] font-bold text-sm hover:bg-white transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          {added ? <><CheckCircle2 size={18} /> Added to Bag</> : <><ShoppingBag size={18} /> Add to Bag</>}
        </button>
        <button 
          onClick={handleToggleWishlist}
          className={`px-6 border transition-colors flex items-center justify-center ${
            isWishlisted 
            ? "border-red-500 bg-red-500/10 text-red-500" 
            : "border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37]"
          }`}
        >
          <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
        </button>
      </div>
      
      <button className="w-full flex items-center justify-center gap-2 bg-black border border-[#d4af37] text-[#d4af37] py-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-[#111] transition-colors">
        Find in Boutique
      </button>
    </div>
  );
}
