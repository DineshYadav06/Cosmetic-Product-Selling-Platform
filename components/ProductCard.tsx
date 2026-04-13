"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useStore } from "../lib/context/StoreContext";

interface ProductCardProps {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}

export default function ProductCard({
  id,
  brand,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
}: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart({ id, brand, name, price, originalPrice, image });
  };

  return (
    <div className="group flex flex-col min-w-[200px] sm:min-w-[240px] max-w-[280px] p-5 bg-[#0a0a0a] border border-[#222] hover:border-[#d4af37] transition-all duration-300 relative">
      <Link href={`/product/${id}`} className="block relative w-full aspect-square bg-gradient-to-t from-[#000] to-[#111] overflow-hidden flex items-center justify-center rounded-sm">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100 drop-shadow-2xl"
        />
        {originalPrice && (
          <span className="absolute top-2 left-2 bg-[#d4af37] text-black text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
            Sale
          </span>
        )}
      </Link>
      
      <div className="mt-5 flex flex-col flex-grow">
        <h3 className="font-bold uppercase tracking-[0.1em] text-xs text-[#d4af37]">{brand}</h3>
        <p className="text-[13px] font-light text-[#ccc] mt-2 line-clamp-2 min-h-[40px] leading-relaxed">{name}</p>
        
        <div className="flex items-center gap-1 mt-3">
          <div className="flex text-[#d4af37]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                className={i < Math.floor(rating) ? "text-[#d4af37]" : "text-[#333]"}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#888] tracking-widest">({reviews})</span>
        </div>
        
        <div className="mt-4 flex flex-col justify-end gap-1 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg text-white font-serif">₹{price}</span>
            {originalPrice && (
              <span className="text-xs text-[#666] line-through font-serif">₹{originalPrice}</span>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className="w-full mt-5 bg-[#111] border border-[#d4af37] text-[#d4af37] text-[11px] font-bold uppercase tracking-[0.2em] py-3 opacity-0 group-hover:opacity-100 group-hover:bg-[#d4af37] group-hover:text-black transition-all transform translate-y-2 group-hover:translate-y-0 absolute bottom-5 left-0 right-0 max-w-[calc(100%-2.5rem)] mx-auto cursor-pointer shadow-[0_5px_15px_rgba(212,175,55,0.15)] z-10"
      >
        Add to Bag
      </button>
    </div>
  );
}
