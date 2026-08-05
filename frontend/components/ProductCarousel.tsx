import React from "react";
import ProductCard from "./ProductCard";
import { ChevronRight } from "lucide-react";

interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  return (
    <section className="py-12 px-4 md:px-8 max-w-[1920px] mx-auto bg-white border-y border-gray-100">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-widest text-[#151515]">
          {title}
        </h2>
        <a href="#all" className="uppercase font-bold text-xs tracking-widest text-black underline flex items-center hover:text-red-600 transition-colors">
          View All <ChevronRight size={14} className="ml-1" />
        </a>
      </div>
      
      {/* Scroll Container */}
      <div className="flex overflow-x-auto gap-4 md:gap-8 pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="snap-start flex-shrink-0">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}} />
    </section>
  );
}
