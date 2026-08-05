"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Search, Loader2, SlidersHorizontal, PackageX } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (res.ok) {
            setProducts(data);
            setFilteredProducts(data);
          }
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    let result = [...products];
    
    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Sort
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(result);
  }, [sortBy, priceRange, products]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-[#d4af37] mb-2">
              <Search size={20} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Search Results</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-widest text-white">
              "{query}"
            </h1>
            <p className="text-[#666] text-sm mt-2 uppercase tracking-widest font-bold">
              {loading ? "Searching..." : `${filteredProducts.length} Items Found`}
            </p>
          </div>
          
          <div className="flex gap-4">
             <select 
               className="bg-black border border-[#222] px-4 py-3 text-[10px] uppercase font-bold tracking-[0.2em] outline-none hover:border-[#d4af37]"
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
             >
               <option value="relevance">Relevance</option>
               <option value="price-low">Price: Low to High</option>
               <option value="price-high">Price: High to Low</option>
               <option value="rating">Top Rated</option>
             </select>
             
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center gap-2 border px-6 py-3 text-[10px] uppercase font-bold tracking-[0.2em] transition-all
                 ${showFilters ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-[#222] text-white hover:border-[#d4af37]'}`}
             >
               <SlidersHorizontal size={14} /> {showFilters ? 'Hide Filters' : 'Filters'}
             </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-12 p-8 bg-[#0a0a0a] border border-[#1a1a1a] flex flex-wrap gap-12 animate-in slide-in-from-top duration-500">
             <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#d4af37] mb-6">Price Range (₹)</p>
                <div className="flex items-center gap-4">
                   <input 
                     type="number" 
                     className="bg-black border border-[#222] p-2 text-xs w-24 outline-none" 
                     value={priceRange[0]}
                     onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                   />
                   <span className="text-[#444]">—</span>
                   <input 
                     type="number" 
                     className="bg-black border border-[#222] p-2 text-xs w-24 outline-none" 
                     value={priceRange[1]}
                     onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                   />
                </div>
             </div>
             
             <div className="flex-1 flex items-end justify-end">
                <button 
                  onClick={() => { setPriceRange([0, 10000]); setSortBy("relevance"); }}
                  className="text-[9px] uppercase tracking-widest text-[#666] hover:text-white"
                >
                  Clear All Filters
                </button>
             </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 size={40} className="animate-spin text-[#d4af37] mb-4" />
            <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-bold">Browsing the vault...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard 
              key={product._id.toString()} 
              id={product._id.toString()} 
              brand={product.brand} 
              name={product.name} 
              price={product.price} 
              originalPrice={product.originalPrice} 
              image={product.image} 
              rating={product.rating} 
              reviews={product.reviews} 
            />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-[#1a1a1a]">
            <PackageX size={48} className="text-[#222] mb-6" />
            <h2 className="text-xl font-serif font-bold tracking-widest mb-2">No Matching Treasures</h2>
            <p className="text-[#666] text-sm max-w-md text-center uppercase tracking-widest leading-loose">
              We couldn't find any products matching your search. Try different keywords or browse our categories.
            </p>
            <div className="mt-10 flex gap-4">
               {["Makeup", "Skincare", "Fragrance"].map(cat => (
                 <a key={cat} href={`/collection?category=${cat}`} className="text-[10px] font-bold uppercase tracking-widest border border-[#222] px-6 py-3 hover:border-white transition-all">
                   {cat}
                 </a>
               ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-[#d4af37]" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
