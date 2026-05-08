import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Product from "../../../lib/models/Product";
import connectToDatabase from "../../../lib/mongodb";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, Heart, ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ProductActions from "../../../components/ProductActions";
import ReviewSection from "../../../components/ReviewSection";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  if (!resolvedParams.id.match(/^[0-9a-fA-F]{24}$/)) return { title: "Product Not Found" };
  
  await connectToDatabase();
  const product = await Product.findById(resolvedParams.id).lean();
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | ${product.brand}`,
    description: product.description.slice(0, 160),
    openGraph: {
      images: [product.image],
    },
  };
}

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

  // Fetch seller info
  let seller: any = null;
  if (product.sellerId) {
    const User = (await import("../../../lib/models/User")).default;
    seller = await User.findById(product.sellerId).select('name sellerDetails').lean();
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black">
      <Header />
      
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#666] hover:text-[#d4af37] transition-colors text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
        >
          <ChevronLeft size={14} /> Back to Collection
        </Link>
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
              {seller && seller.sellerDetails && (
                <div className="border-t border-[#222] pt-6 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mb-1">Curated by Artisan</p>
                      <h4 className="text-white font-serif text-xl group-hover:text-[#d4af37] transition-colors">{seller.sellerDetails.storeName}</h4>
                    </div>
                    <a 
                      href={`/store/${encodeURIComponent(seller.sellerDetails.storeName)}`}
                      className="px-6 py-2 border border-[#333] text-[10px] font-bold uppercase tracking-widest hover:border-[#d4af37] transition-all"
                    >
                      Visit Boutique
                    </a>
                  </div>
                </div>
              )}

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

        {/* Dynamic Reviews Section */}
        <ReviewSection 
          productId={product._id.toString()} 
          existingReviews={JSON.parse(JSON.stringify(product.reviewItems || []))} 
        />

      </div>
      
      <Footer />
    </main>
  );
}
