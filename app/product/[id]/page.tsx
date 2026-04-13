import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Product from "../../../lib/models/Product";
import connectToDatabase from "../../../lib/mongodb";
import Image from "next/image";
import { Star, Truck, ShieldCheck, Heart } from "lucide-react";
import { notFound } from "next/navigation";
import ProductActions from "../../../components/ProductActions";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  
  const resolvedParams = await params;

  // Validate if id is valid MongoDB ObjectId
  if (!resolvedParams.id.match(/^[0-9a-fA-F]{24}$/)) {
    return notFound();
  }

  const product = await Product.findById(resolvedParams.id).lean();
  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black">
      <Header />
      
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Left Column - Product Image */}
          <div className="w-full md:w-1/2 flex justify-center sticky top-28 h-fit">
            <div className="relative w-full aspect-[4/5] bg-gradient-to-t from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center p-10 border border-[#222]">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-contain p-8 drop-shadow-[0_20px_30px_rgba(212,175,55,0.15)]"
              />
              {/* Floating element for luxury aesthetic */}
               <button className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-[#d4af37] transition-colors rounded-full text-white hover:text-black border border-[#333]">
                 <Heart size={20} />
               </button>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="w-full md:w-1/2 flex flex-col pt-8">
            <h2 className="text-[#d4af37] tracking-[0.3em] font-bold uppercase text-sm mb-4">
              {product.brand}
            </h2>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide mb-6 leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-8 border-b border-[#222] pb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating) ? "#d4af37" : "none"} 
                    className={i < Math.floor(product.rating) ? "text-[#d4af37]" : "text-[#444]"} 
                  />
                ))}
              </div>
              <span className="text-[#888] text-sm tracking-widest uppercase">
                {product.rating} / 5 <span className="text-[#555] ml-1">({product.reviews} reviews)</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-10">
              <span className="text-4xl font-serif">₹{product.price}</span>
              {product.originalPrice && (
                 <>
                   <span className="text-xl text-[#666] line-through font-serif mb-1">₹{product.originalPrice}</span>
                   <span className="bg-[#d4af37] text-black text-[10px] uppercase font-bold px-2 py-1 mb-2 tracking-widest">Sale</span>
                 </>
              )}
            </div>

            {/* Actions (Client Component) */}
            <ProductActions 
              product={{
                id: product._id.toString(),
                brand: product.brand,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image
              }} 
            />

            {/* Description */}
            <div className="space-y-6">
              <div className="border-t border-[#222] pt-6">
                 <h3 className="uppercase tracking-[0.2em] font-bold text-white mb-4 text-sm">The Story</h3>
                 <p className="text-[#999] font-light leading-relaxed text-sm">
                   {product.description}
                 </p>
              </div>

              <div className="border-y border-[#222] py-6 flex flex-col gap-4">
                 <div className="flex items-center gap-4 text-[#bbb]">
                    <Truck size={20} className="text-[#d4af37]" />
                    <span className="text-sm tracking-wide font-light">Complimentary Next-Day Shipping on orders over ₹2000</span>
                 </div>
                 <div className="flex items-center gap-4 text-[#bbb]">
                    <ShieldCheck size={20} className="text-[#d4af37]" />
                    <span className="text-sm tracking-wide font-light">100% Authentic Products Sourced Directly</span>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- EXTRA SECTIONS --- */}
        
        {/* Frequently Bought Together  */}
        <div className="mt-32 border-t border-[#222] pt-16">
          <h2 className="text-2xl font-serif font-bold tracking-widest uppercase mb-10 text-center">
            Frequently Bought Together
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
             <div className="flex items-center gap-6">
               <div className="w-32 h-40 bg-[#0a0a0a] border border-[#d4af37] p-4 flex items-center shadow-[0_0_15px_rgba(212,175,55,0.15)] relative">
                 <Image src={product.image} alt="This item" fill className="object-contain p-4" />
               </div>
               <span className="text-3xl font-light text-[#444]">+</span>
               <div className="w-32 h-40 bg-[#0a0a0a] border border-[#222] p-4 flex items-center relative opacity-70 hover:opacity-100 transition-opacity">
                 <Image src="https://images.unsplash.com/photo-1596704017234-0b761be5b269?auto=format&fit=crop&q=80&w=200" alt="Pair item" fill className="object-contain p-4" />
               </div>
               <span className="text-3xl font-light text-[#444]">+</span>
               <div className="w-32 h-40 bg-[#0a0a0a] border border-[#222] p-4 flex items-center relative opacity-70 hover:opacity-100 transition-opacity">
                 <Image src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200" alt="Pair item 2" fill className="object-contain p-4" />
               </div>
             </div>

             <div className="bg-[#111] border border-[#222] p-8 md:ml-12 min-w-[300px]">
                <p className="text-[#888] text-xs uppercase tracking-widest font-bold mb-2">Total price:</p>
                <p className="text-3xl font-serif text-[#d4af37] mb-6">₹{(product.price + 2900 + 650).toLocaleString('en-IN')}</p>
                <button className="w-full bg-[#d4af37] text-black py-4 uppercase font-bold tracking-[0.2em] text-[10px] hover:bg-white shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  Add all 3 to Bag
                </button>
             </div>
          </div>
        </div>

        {/* Customer Reviews Summary */}
        <div className="mt-32 border-t border-[#222] pt-16">
          <h2 className="text-2xl font-serif font-bold tracking-widest uppercase mb-10">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="col-span-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl font-serif font-bold text-[#d4af37]">{product.rating.toFixed(1)}</span>
                <div className="flex flex-col">
                  <div className="flex text-[#d4af37]">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                  </div>
                  <span className="text-[#888] text-xs mt-1">Based on {product.reviews} reviews</span>
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-3 mt-8">
                {[
                  { stars: 5, pct: 82 },
                  { stars: 4, pct: 12 },
                  { stars: 3, pct: 4 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 1 },
                ].map(r => (
                  <div key={r.stars} className="flex items-center gap-3 text-xs text-[#888]">
                    <span className="w-12 text-right">{r.stars} star</span>
                    <div className="flex-1 h-1.5 bg-[#111] overflow-hidden">
                      <div className="h-full bg-[#d4af37]" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="w-8">{r.pct}%</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full border border-[#333] text-white py-4 uppercase font-bold tracking-widest text-xs mt-10 hover:border-[#d4af37] transition-colors">
                Write a Review
              </button>
            </div>

            <div className="col-span-2 space-y-10">
               {[
                 { title: "Absolutely love it!", text: "This is easily one of my favorite purchases. The packaging is pure luxury and the product itself feels amazing.", author: "Priya S.", date: "March 20, 2026", rating: 5 },
                 { title: "Worth every penny", text: "I was hesitant because of the price but after using it for a week, I can say it's 100% worth the hype.", author: "Ananya M.", date: "March 15, 2026", rating: 5 },
                 { title: "Good, but heavily fragranced", text: "Performance is stellar but the scent is a bit too strong for my sensitive nose. Still a great product overall.", author: "Neha K.", date: "February 28, 2026", rating: 4 },
               ].map((review, i) => (
                 <div key={i} className="border-b border-[#111] pb-10">
                   <div className="flex items-center gap-3 mb-3">
                     <div className="flex text-[#d4af37]">
                       {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} />)}
                     </div>
                     <span className="text-white font-bold tracking-wide text-sm">{review.title}</span>
                   </div>
                   <p className="text-[#888] font-light text-sm leading-relaxed mb-4">{review.text}</p>
                   <div className="text-[#555] text-xs uppercase tracking-widest font-bold">
                     {review.author} <span className="mx-2 font-normal">|</span> <span className="font-normal">{review.date}</span>
                   </div>
                 </div>
               ))}
               <button className="text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                 Read All {product.reviews} Reviews →
               </button>
            </div>
          </div>
        </div>

      </div>
      
      <Footer />
    </main>
  );
}
