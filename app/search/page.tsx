"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { Search, Loader2, SlidersHorizontal, PackageX } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (res.ok) {
            setProducts(data);
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
              {loading ? "Searching..." : `${products.length} Items Found`}
            </p>
          </div>
          
          <button className="flex items-center gap-2 border border-[#222] px-6 py-3 text-[10px] uppercase font-bold tracking-[0.2em] hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
            <SlidersHorizontal size={14} /> Filter & Sort
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 size={40} className="animate-spin text-[#d4af37] mb-4" />
            <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-bold">Browsing the vault...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
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
