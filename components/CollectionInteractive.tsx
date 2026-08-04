"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Filter, SlidersHorizontal, ChevronDown, Check, ChevronLeft } from "lucide-react";

interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

export default function CollectionInteractive({ products }: { products: Product[] }) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique brands and categories
  const allBrands = Array.from(new Set(products.map(p => p.brand)));
  const allCategories = Array.from(new Set(products.map(p => p.category)));

  // Toggle handlers
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategory(prev => prev === cat ? null : cat);
  };

  // Filter & Sort Logic
  let filtered = products.filter(p => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

  if (sortBy === "Price: Low to High") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "Price: High to Low") filtered.sort((a, b) => b.price - a.price);

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/" 
          className="md:hidden w-8 h-8 border border-[#222] flex items-center justify-center text-[#555] hover:text-[#d4af37] transition-all"
        >
          <ChevronLeft size={16} />
        </Link>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] font-bold">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link> / 
          <span className="ml-2">Collection</span> / 
          <span className="text-[#d4af37] ml-2 font-black">All Products</span>
        </p>
      </div>

      {/* Mobile Top Category Scroller - Amazon Style */}
      <div className="md:hidden flex gap-3 overflow-x-auto pb-4 mb-4 custom-scrollbar whitespace-nowrap">
         <button 
           onClick={() => setSelectedCategory(null)}
           className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${!selectedCategory ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-[#333] text-[#ccc]'}`}
         >
           All
         </button>
         {allCategories.map(cat => (
           <button 
             key={cat}
             onClick={() => toggleCategory(cat)}
             className={`px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${selectedCategory === cat ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-[#333] text-[#ccc]'}`}
           >
             {cat}
           </button>
         ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 border-b border-[#222] pb-6">
        <h1 className="text-2xl md:text-4xl font-serif font-bold tracking-widest uppercase mb-4 md:mb-0">
          Collection <span className="text-sm font-sans tracking-widest text-[#666] ml-2 block md:inline mt-1 md:mt-0">({filtered.length} items)</span>
        </h1>

        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 text-xs font-bold uppercase tracking-widest text-[#aaa]">
           <button 
             onClick={() => setMobileFilterOpen(true)}
             className="md:hidden flex items-center gap-2 border border-[#333] px-4 py-2 text-white"
           >
             <Filter size={14} /> Filters
           </button>

           <div className="flex items-center gap-2">
             <span className="hidden md:inline">Sort By:</span>
             <select 
               value={sortBy} 
               onChange={(e) => setSortBy(e.target.value)} 
               className="bg-black border border-[#333] text-white p-2 outline-none focus:border-[#d4af37] cursor-pointer"
             >
               <option>Recommended</option>
               <option>Price: Low to High</option>
               <option>Price: High to Low</option>
             </select>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        {/* Left Sidebar - Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-40 h-fit">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold uppercase tracking-widest text-sm text-[#d4af37] flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </h2>
              <button 
                onClick={() => { setSelectedBrands([]); setSelectedCategory(null); }}
                className="text-[10px] text-[#666] hover:text-white uppercase font-bold tracking-widest underline"
              >
                Clear All
              </button>
           </div>
           
           {/* Categories */}
           <div className="border-t border-[#222] py-6">
             <h3 className="font-bold uppercase tracking-widest text-xs mb-4 flex justify-between cursor-pointer group">
               Category <ChevronDown size={14} className="text-[#555] group-hover:text-white transition-colors" />
             </h3>
             <div className="space-y-3">
                {allCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 text-sm font-light text-[#ccc] cursor-pointer hover:text-white">
                    <div className={`w-4 h-4 border flex items-center justify-center ${selectedCategory === cat ? 'bg-[#d4af37] border-[#d4af37]' : 'border-[#444] bg-transparent'}`}>
                      {selectedCategory === cat && <Check size={12} className="text-black" strokeWidth={3} />}
                    </div>
                    {cat}
                  </label>
                ))}
             </div>
           </div>

           {/* Brands Filter */}
           <div className="border-t border-b border-[#222] py-6 mb-8">
             <h3 className="font-bold uppercase tracking-widest text-xs mb-4 flex justify-between cursor-pointer group">
               Brands <ChevronDown size={14} className="text-[#555] group-hover:text-white transition-colors" />
             </h3>
             <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
               {allBrands.map(brand => (
                 <label key={brand} className="flex items-center gap-3 text-sm font-light text-[#ccc] cursor-pointer hover:text-white" onClick={() => toggleBrand(brand)}>
                   <div className={`w-4 h-4 border flex items-center justify-center ${selectedBrands.includes(brand) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-[#444] bg-transparent'}`}>
                      {selectedBrands.includes(brand) && <Check size={12} className="text-black" strokeWidth={3} />}
                   </div>
                   {brand}
                 </label>
               ))}
             </div>
           </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full py-20 text-center border border-[#222] bg-[#0a0a0a]">
                 <p className="text-[#888] font-bold tracking-widest uppercase">No products match your filters.</p>
                 <button onClick={() => { setSelectedBrands([]); setSelectedCategory(null); }} className="mt-4 text-[#d4af37] underline text-sm">Clear Filters</button>
              </div>
            ) : (
              filtered.map((product) => (
                <div key={product.id} className="relative">
                   {/* Amazon Style Badge (e.g. GLOWMART's Choice for top rated) */}
                   {product.rating >= 4.8 && (
                      <div className="absolute top-0 left-0 z-10 bg-[#111] border border-[#d4af37] text-white text-[9px] uppercase tracking-widest font-bold px-2 py-1 flex items-center gap-1 shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
                        Choice
                      </div>
                   )}
                   <ProductCard 
                     id={product.id}
                     brand={product.brand}
                     name={product.name}
                     price={product.price}
                     originalPrice={product.originalPrice}
                     image={product.image}
                     rating={product.rating}
                     reviews={product.reviews}
                   />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Filters */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="w-[85%] max-w-sm h-full bg-[#0a0a0a] border-r border-[#222] p-6 relative z-10 flex flex-col overflow-y-auto">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#222]">
                <h2 className="font-serif font-bold tracking-widest text-[#d4af37] text-xl">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="text-[#888] text-2xl leading-none">&times;</button>
             </div>

             <div className="flex-1 space-y-8">
                <div>
                  <h3 className="uppercase tracking-[0.2em] font-bold text-xs text-white mb-4">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map(cat => (
                      <button 
                        key={cat} onClick={() => toggleCategory(cat)}
                        className={`px-3 py-2 border text-[10px] uppercase tracking-widest ${selectedCategory === cat ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-[#333] text-[#aaa]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="uppercase tracking-[0.2em] font-bold text-xs text-white mb-4">Brands</h3>
                  <div className="space-y-4">
                     {allBrands.map(brand => (
                       <label key={brand} className="flex items-center gap-4 text-sm font-bold text-[#ccc]" onClick={() => toggleBrand(brand)}>
                         <div className={`w-5 h-5 flex items-center justify-center border ${selectedBrands.includes(brand) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-[#444]'}`}>
                            {selectedBrands.includes(brand) && <Check size={14} className="text-black" strokeWidth={3} />}
                         </div>
                         {brand}
                       </label>
                     ))}
                  </div>
                </div>
             </div>

             <div className="mt-8 pt-4 border-t border-[#222] flex gap-4">
                <button onClick={() => { setSelectedBrands([]); setSelectedCategory(null); }} className="flex-1 py-4 border border-[#333] text-xs font-bold uppercase tracking-widest text-[#888]">
                  Clear
                </button>
                <button onClick={() => setMobileFilterOpen(false)} className="flex-1 py-4 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest">
                  View {filtered.length}
                </button>
             </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4af37; }
      `}} />
    </div>
  );
}
