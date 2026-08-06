import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCarousel from "../components/ProductCarousel";
import Footer from "../components/Footer";
import LiveSalesFeed from "../components/LiveSalesFeed";
import Image from "next/image";
import Link from "next/link";
import connectToDatabase from "../lib/mongodb";
import Product from "../lib/models/Product";
import { Sparkles, Camera, FileText, ShoppingBag, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic"; // Ensure newly added products show up instantly

export default async function Home() {
  let allProducts: any[] = [];
  
  try {
    await connectToDatabase();
    allProducts = await Product.find({}).sort({ createdAt: -1 }).lean(); // Sort to get latest products
    
    if (!allProducts || allProducts.length === 0) {
      throw new Error("No products found in DB");
    }
  } catch (e) {
    console.warn("DB not connected or empty, showing beautiful fallback mock products");
    allProducts = [
      {
        _id: "csv1", category: "Fragrance", name: "Carlton London Incense Eau da parfum", brand: "Carlton London", price: 599, originalPrice: 999, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600", rating: 3.9, reviews: 19
      },
      {
         _id: "csv2", category: "Fragrance", name: "Denver Black Code Perfume", brand: "Denver", price: 245, originalPrice: 499, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600", rating: 4.2, reviews: 61
      },
      {
         _id: "csv3", category: "Skincare", name: "Deadsea Mud Purifying Mud Soap", brand: "Ahava", price: 980, originalPrice: 1500, image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=600", rating: 4.7, reviews: 28
      },
      {
         _id: "csv4", category: "Skincare", name: "Natural Dead Sea Bath Salts", brand: "Ahava", price: 980, originalPrice: 1500, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600", rating: 4.0, reviews: 1
      }
    ];
  }
  
  // Transform _id to strings for client components to avoid serialization errors
  const parseProducts = allProducts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    id: p._id.toString() 
  }));
  
  // Optionally filter by category
  const bestsellers = parseProducts.filter((p: any) => p.category === "Bestsellers");
  const newArrivals = parseProducts.filter((p: any) => p.category === "Just Dropped");

  // Fallback to allProducts if no specific category items
  const displayBestsellers = bestsellers.length ? bestsellers : parseProducts.slice(0, 5);
  const displayNewArrivals = newArrivals.length ? newArrivals : parseProducts.slice(0, 5);
  
  // Use latest real database products for mid-page promotional banners
  const promo1 = parseProducts[0] || { name: 'Daily Glow', brand: 'Skincare', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000' };
  const promo2 = parseProducts[1] || { name: 'Party Ready', brand: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a1c869237a17?auto=format&fit=crop&q=80&w=1000' };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Brands Banner Strip */}
      <div className="w-full bg-black text-white py-4 overflow-hidden shadow-inner">
        <div className="max-w-[1920px] mx-auto px-4 flex justify-between uppercase text-xs sm:text-sm font-bold tracking-[0.3em] opacity-80 whitespace-nowrap overflow-x-auto hide-scrollbar gap-8">
          <span>Rare Beauty</span>
          <span>Dior</span>
          <span>Fenty Beauty</span>
          <span>Charlotte Tilbury</span>
          <span>MAC</span>
          <span>Huda Beauty</span>
          <span>GlowRecipe</span>
        </div>
      </div>

      <div className="pt-8 pb-4">
        <ProductCarousel title="Bestsellers" products={displayBestsellers} />
      </div>

      {/* High-End AI Skin Vision Scanner & Sample Prescription Showcase */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 py-16">
        <div className="relative bg-[#0a0a0a] border-2 border-[#d4af37]/40 overflow-hidden p-8 md:p-20 flex flex-col md:flex-row items-center gap-12 group rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)]">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#d4af37]/10 blur-[100px] rounded-full group-hover:bg-[#d4af37]/20 transition-colors duration-700" />
          
          <div className="flex-1 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-[#d4af37] mb-6 px-4 py-1.5 border border-[#d4af37]/40 bg-[#d4af37]/10 rounded-full">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em]">AI Clinical Skin Scanner & Rx Prescription</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Scan Your Skin & Get <br />
              An Official <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#d4af37]">Rx Prescription</span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 max-w-xl leading-relaxed font-light">
              Experience board-certified AI dermatology. Real-time vision scanning generates a printable sample prescription certificate paired directly with active products available in our store.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
              <div className="bg-black/60 p-4 border border-[#d4af37]/20 rounded-lg">
                <Camera size={20} className="text-[#d4af37] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">HUD Camera Scan</h4>
                <p className="text-[10px] text-gray-500 mt-1">Live face mesh, TEWL & redness analysis</p>
              </div>

              <div className="bg-black/60 p-4 border border-[#d4af37]/20 rounded-lg">
                <FileText size={20} className="text-[#d4af37] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sample Rx Certificate</h4>
                <p className="text-[10px] text-gray-500 mt-1">Printable active chemical prescription</p>
              </div>

              <div className="bg-black/60 p-4 border border-[#d4af37]/20 rounded-lg">
                <ShoppingBag size={20} className="text-[#d4af37] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">1-Click Store Match</h4>
                <p className="text-[10px] text-gray-500 mt-1">Buy prescribed catalog bundle instantly</p>
              </div>
            </div>

            <Link 
              href="/ai-consultant"
              className="inline-flex items-center gap-4 bg-[#d4af37] text-black px-10 py-4 font-extrabold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] rounded-lg"
            >
              <Camera size={18} /> Launch AI Skin Scanner & Rx Certificate <div className="w-6 h-[1px] bg-black" />
            </Link>
          </div>

          <div className="flex-1 relative aspect-[4/5] w-full max-w-md z-10 rounded-xl overflow-hidden border-2 border-[#d4af37]/30 shadow-2xl">
             <Image 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800" 
                alt="AI Skin Scanner & Rx Prescription" 
                fill 
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
             
             {/* HUD Overlay Preview Card */}
             <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-[#d4af37]/40">
               <div className="flex items-center justify-between text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mb-1">
                 <span>Rx #GLOW-8942</span>
                 <span className="bg-[#d4af37] text-black px-1.5 py-0.5 rounded text-[8px] font-black">PRESCRIBED</span>
               </div>
               <p className="text-white text-xs font-mono font-bold line-clamp-1 mb-1">🧪 2% Salicylic Acid + 10% Niacinamide + 5% Caffeine</p>
               <p className="text-gray-400 text-[10px]">Pairs with 4 Store Products • 1-Click Regimen</p>
             </div>
          </div>
        </div>
      </section>
      
      {/* Mid-page promotional banner layout matching Sephora */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[4/3] group overflow-hidden shadow-lg bg-gray-100 rounded-xl">
            <a href={`/product/${promo1.id || ''}`} className="block w-full h-full">
              <Image
                src={promo1.image}
                alt={promo1.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.6]"
              />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
             <div className="absolute bottom-8 left-8 text-white z-10 w-3/4">
               <h3 className="text-3xl font-serif font-bold tracking-wider mb-2 drop-shadow-md">{promo1.name}</h3>
               <p className="font-light tracking-wide mb-4 drop-shadow-md text-sm">{promo1.brand}</p>
               <span className="border-b-2 border-white pb-1 font-bold uppercase tracking-widest text-xs hover:text-gray-300">Shop Now</span>
             </div>
            </a>
          </div>
          
          <div className="relative aspect-[4/3] group overflow-hidden shadow-lg bg-gray-100 rounded-xl">
            <a href={`/product/${promo2.id || ''}`} className="block w-full h-full">
              <Image
                src={promo2.image}
                alt={promo2.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
              />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
             <div className="absolute bottom-8 right-8 text-white z-10 text-right w-3/4">
               <h3 className="text-3xl font-serif font-bold tracking-wider mb-2 drop-shadow-md">{promo2.name}</h3>
               <p className="font-light tracking-wide mb-4 drop-shadow-md text-sm">{promo2.brand}</p>
               <span className="border-b-2 border-white pb-1 font-bold uppercase tracking-widest text-xs hover:text-gray-300">Shop Now</span>
             </div>
            </a>
          </div>
        </div>
      </section>

      <div className="pt-4 pb-8">
        <ProductCarousel title="Just Dropped" products={displayNewArrivals} />
      </div>

      <Footer />
      <LiveSalesFeed />
    </main>
  );
}
