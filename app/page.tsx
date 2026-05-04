import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCarousel from "../components/ProductCarousel";
import Footer from "../components/Footer";
import Image from "next/image";
import connectToDatabase from "../lib/mongodb";
import Product from "../lib/models/Product";

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
        _id: "mock1", category: "Bestsellers", name: "Luminous Night Serum", brand: "GlowRecipe", price: 1599, originalPrice: 2499, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", rating: 4.8, reviews: 124
      },
      {
         _id: "mock2", category: "Bestsellers", name: "Velvet Matte Lipstick", brand: "MAC", price: 899, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600", rating: 4.5, reviews: 56
      },
      {
         _id: "mock3", category: "Just Dropped", name: "Golden Aura Perfume", brand: "Dior", price: 4500, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600", rating: 5.0, reviews: 312
      },
      {
         _id: "mock4", category: "Just Dropped", name: "Hydrating Face Cream", brand: "Rare Beauty", price: 1250, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600", rating: 4.2, reviews: 89
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
  const promo1 = parseProducts[0] || { name: 'Daily Glow', brand: 'Skincare', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=1000' };
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

      {/* AI Consultant CTA */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 py-16">
        <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden p-8 md:p-20 flex flex-col md:flex-row items-center gap-12 group">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#d4af37]/10 blur-[100px] rounded-full group-hover:bg-[#d4af37]/20 transition-colors duration-700" />
          
          <div className="flex-1 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-[#d4af37] mb-6 px-4 py-1.5 border border-[#d4af37]/30 bg-[#d4af37]/5">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">AI-Powered Skincare</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Analyze Your Skin <br /> with <span className="italic text-[#d4af37]">Glowmart AI</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
              Skip the guesswork. Our advanced AI scans your skin profile to recommend the perfect premium regimen tailored just for you.
            </p>
            <a 
              href="/ai-consultant"
              className="inline-flex items-center gap-4 bg-[#d4af37] text-black px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_25px_rgba(212,175,55,0.2)]"
            >
              Start Free Analysis <div className="w-6 h-[1px] bg-black" />
            </a>
          </div>

          <div className="flex-1 relative aspect-square w-full max-w-md z-10">
             <div className="absolute inset-0 border border-[#d4af37]/20 translate-x-4 translate-y-4" />
             <div className="absolute inset-0 border border-white/10 -translate-x-4 -translate-y-4" />
             <Image 
                src="https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=800" 
                alt="AI Skin Analysis" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        </div>
      </section>
      
      {/* Mid-page promotional banner layout matching Sephora */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[4/3] group overflow-hidden shadow-lg bg-gray-100">
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
          
          <div className="relative aspect-[4/3] group overflow-hidden shadow-lg bg-gray-100">
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

      <div className="py-8 bg-gray-50 border-y border-gray-100">
        <ProductCarousel title="Just Dropped" products={displayNewArrivals} />
      </div>

      {/* Become a Seller CTA */}
      <section className="bg-black py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-[#d4af37] mb-8">
            <span className="h-[1px] w-8 bg-[#d4af37]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Partner with Excellence</span>
            <span className="h-[1px] w-8 bg-[#d4af37]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 tracking-tight leading-tight">
            Creators. Artisans. <br /> <span className="text-[#d4af37]">Global Entrepreneurs.</span>
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the most sophisticated beauty network. List your products, reach elite customers, 
            and scale your cosmetic boutique with our advanced AI tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="/seller/register"
              className="w-full sm:w-auto bg-[#d4af37] text-black px-12 py-5 font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
              Apply to Sell
            </a>
            <a 
              href="/seller/pricing"
              className="w-full sm:w-auto border border-white/20 text-white px-12 py-5 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
            >
              View Tiers
            </a>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
             {[
               { val: "10M+", label: "Luxury Seekers" },
               { val: "2%", label: "Lowest Commission" },
               { val: "24/7", label: "Concierge Support" },
               { val: "AI", label: "Marketing Suite" }
             ].map((stat, i) => (
               <div key={i} className="text-center">
                 <p className="text-2xl font-serif font-bold text-white">{stat.val}</p>
                 <p className="text-[9px] uppercase tracking-widest text-[#d4af37] mt-1">{stat.label}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      <Footer />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}} />
    </main>
  );
}
