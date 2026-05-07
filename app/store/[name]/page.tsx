"use client";

import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductCard from "../../../components/ProductCard";
import { 
  Store, 
  MapPin, 
  Calendar, 
  Star, 
  ShieldCheck, 
  MessageSquare,
  Loader2,
  Package,
  Award,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function StorePage({ params }: { params: { name: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`/api/store/${params.name}`);
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load store.");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [params.name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[#d4af37]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <Store size={64} className="text-[#1a1a1a] mb-6" />
          <h1 className="text-2xl font-serif font-bold uppercase tracking-widest text-white mb-2">Boutique Not Found</h1>
          <p className="text-[#666] text-sm uppercase tracking-widest">This artisan store might have changed its name or moved.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const { seller, products } = data;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="bg-[#0a0a0a] px-4 md:px-8 py-4 border-b border-[#1a1a1a]">
        <Link href="/" className="inline-flex items-center gap-2 text-[#666] hover:text-[#d4af37] transition-colors text-[10px] font-bold uppercase tracking-[0.3em]">
          <ChevronLeft size={14} /> Back to Marketplace
        </Link>
      </div>

      {/* Store Hero */}
      <div className="relative h-80 w-full overflow-hidden border-b border-[#1a1a1a]">
        <div className="absolute inset-0 bg-[#0d0d0d]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512496015851-a1c869237a17?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 grayscale" />
        </div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 pb-12">
            <div className="flex flex-col md:flex-row items-end gap-8">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-[#0a0a0a] border border-[#d4af37]/30 p-2 shadow-2xl relative">
                <div className="w-full h-full bg-[#111] flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-serif font-bold text-[#d4af37]">{seller.sellerDetails.storeName.charAt(0)}</span>
                </div>
                {seller.sellerDetails.plan === 'premium' && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center border-4 border-black text-black">
                    <Award size={20} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-widest uppercase">{seller.sellerDetails.storeName}</h1>
                  {seller.sellerDetails.plan !== 'basic' && (
                    <span className={`inline-flex self-center md:self-auto items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${seller.sellerDetails.plan === 'premium' ? 'bg-white text-black border-white' : 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30'}`}>
                      <ShieldCheck size={12} /> {seller.sellerDetails.plan} Partner
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[#666] text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-[#d4af37]" /> Mumbai, India</div>
                  <div className="flex items-center gap-2"><Package size={14} className="text-[#d4af37]" /> {products.length} Products</div>
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-[#d4af37]" /> Joined {new Date(seller.sellerDetails.joinedAt).getFullYear()}</div>
                  <div className="flex items-center gap-2"><Star size={14} className="text-[#d4af37]" /> 4.9 Rating</div>
                </div>
              </div>

              <button className="hidden lg:flex items-center gap-3 bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#d4af37] transition-all group">
                <MessageSquare size={16} /> Contact Artisan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 border-b border-[#1a1a1a] pb-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold tracking-widest uppercase">The Collection</h2>
            <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-bold">Curated Artisanal Masterpieces</p>
          </div>
          
          <div className="flex gap-4">
             <div className="text-right hidden md:block">
               <p className="text-[10px] text-[#444] font-bold uppercase tracking-widest mb-1">Store Owner</p>
               <p className="text-sm font-bold text-white uppercase tracking-widest">{seller.name}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#111] border border-[#1a1a1a] flex items-center justify-center text-[#d4af37] font-bold">
               {seller.name.charAt(0)}
             </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
            {products.map((product: any) => (
              <ProductCard 
                key={product._id} 
                {...product} 
                id={product._id}
                sellerPlan={seller.sellerDetails.plan} 
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-[#1a1a1a]">
            <Package size={48} className="text-[#1a1a1a] mx-auto mb-6" />
            <p className="text-[#666] text-sm uppercase tracking-widest">This artisan hasn't listed any products yet.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
