"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useStore } from "../lib/context/StoreContext";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id?: string;
  brand?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviews?: number;
  isAI?: boolean;
  sellerPlan?: 'basic' | 'pro' | 'premium';
  product?: any;
}

export default function ProductCard(props: ProductCardProps) {
  const p = props.product || props;
  const id = p._id || p.id || "";
  const brand = p.brand || "";
  const name = p.name || "";
  const price = p.price || 0;
  const originalPrice = p.originalPrice;
  const image = p.image || "";
  const rating = p.rating || 0;
  const reviews = p.reviews || 0;
  const isAI = props.isAI || p.isAI;
  const sellerPlan = props.sellerPlan || p.sellerPlan;

  const { addToCart } = useStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart({ id, brand, name, price, originalPrice, image });
  };

  const handleBuyNow = () => {
    addToCart({ id, brand, name, price, originalPrice, image });
    router.push("/checkout");
  };

  return (
    <div className="group flex flex-col min-w-[200px] sm:min-w-[240px] max-w-[280px] p-5 bg-[#0a0a0a] border border-[#222] hover:border-[#d4af37] transition-all duration-300 relative">
      <Link href={`/product/${id}`} className="block relative w-full aspect-square bg-gradient-to-t from-[#000] to-[#111] overflow-hidden flex items-center justify-center rounded-sm">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100 drop-shadow-2xl"
        />
        {originalPrice && (
          <span className="absolute top-2 left-2 bg-[#d4af37] text-black text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
            Sale
          </span>
        )}
        {isAI && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-[#d4af37]/50 text-[#d4af37] text-[8px] uppercase font-bold px-2 py-1 tracking-[0.2em] animate-pulse">
            AI Recommended
          </div>
        )}
        {sellerPlan && sellerPlan !== 'basic' && (
          <div className={`absolute bottom-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border ${sellerPlan === 'premium' ? 'bg-white text-black border-white' : 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30'}`}>
            {sellerPlan} Partner
          </div>
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

      <div className="w-full flex gap-2 absolute bottom-5 left-0 right-0 max-w-[calc(100%-2.5rem)] mx-auto opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 z-10">
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-[0.1em] py-3 hover:bg-white transition-colors shadow-[0_5px_15px_rgba(212,175,55,0.15)]"
        >
          Buy Now
        </button>
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-[#111] border border-[#d4af37] text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.1em] py-3 hover:bg-[#d4af37] hover:text-black transition-colors"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
}
