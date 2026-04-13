import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCarousel from "../components/ProductCarousel";
import Footer from "../components/Footer";
import Image from "next/image";
import connectToDatabase from "../lib/mongodb";
import Product from "../lib/models/Product";

export default async function Home() {
  let allProducts: any[] = [];
  
  try {
    await connectToDatabase();
    allProducts = await Product.find({}).lean();
  } catch (e) {
    console.warn("DB not connected, showing empty state");
  }
  
  // Transform _id to strings for client components to avoid serialization errors
  const parseProducts = allProducts.map(p => ({
    ...p,
    _id: p._id.toString(),
    id: p._id.toString() 
  }));
  
  // Optionally filter by category
  const bestsellers = parseProducts.filter(p => p.category === "Bestsellers");
  const newArrivals = parseProducts.filter(p => p.category === "Just Dropped");

  // Fallback to allProducts if no specific category items
  const displayBestsellers = bestsellers.length ? bestsellers : parseProducts.slice(0, 5);
  const displayNewArrivals = newArrivals.length ? newArrivals : parseProducts.slice(0, 5);
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
      
      {/* Mid-page promotional banner layout matching Sephora */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[4/3] group overflow-hidden cursor-pointer shadow-lg bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1000"
                alt="Latest Designer Fragrances"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.6]"
              />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
             <div className="absolute bottom-8 left-8 text-white z-10">
               <h3 className="text-3xl font-serif font-bold tracking-wider mb-2 drop-shadow-md">Daily Glow</h3>
               <p className="font-light tracking-wide mb-4 drop-shadow-md text-sm">Elevate your skincare regimen</p>
               <span className="border-b-2 border-white pb-1 font-bold uppercase tracking-widest text-xs hover:text-gray-300">Shop Skincare</span>
             </div>
          </div>
          
          <div className="relative aspect-[4/3] group overflow-hidden cursor-pointer shadow-lg bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1523293111662-bf24f2225900?auto=format&fit=crop&q=80&w=1000"
                alt="Virtual Fragrance Consultation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
              />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
             <div className="absolute bottom-8 right-8 text-white z-10 text-right">
               <h3 className="text-3xl font-serif font-bold tracking-wider mb-2 drop-shadow-md">Party Ready</h3>
               <p className="font-light tracking-wide mb-4 drop-shadow-md text-sm">Glam up with ultimate Pigments</p>
               <span className="border-b-2 border-white pb-1 font-bold uppercase tracking-widest text-xs hover:text-gray-300">Shop Makeup</span>
             </div>
          </div>
        </div>
      </section>

      <div className="py-8 bg-gray-50 border-y border-gray-100">
        <ProductCarousel title="Just Dropped" products={displayNewArrivals} />
      </div>

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
