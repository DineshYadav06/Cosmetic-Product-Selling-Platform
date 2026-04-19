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
