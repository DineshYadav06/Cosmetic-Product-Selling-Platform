import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Star, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const WISHLIST_ITEMS = [
  {
    id: "1",
    brand: "Fenty Beauty",
    name: "Pro Filt'r Soft Matte Longwear Foundation - 145N",
    price: 3200,
    originalPrice: 3800,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=500",
    rating: 4.8,
    reviews: 1240,
    badge: "Bestseller",
    inStock: true,
  },
  {
    id: "2",
    brand: "Charlotte Tilbury",
    name: "Pillow Talk Lipstick - Original Pink Nude",
    price: 2900,
    originalPrice: 3400,
    image: "https://images.unsplash.com/photo-1596704017234-0b761be5b269?auto=format&fit=crop&q=80&w=500",
    rating: 4.7,
    reviews: 890,
    badge: null,
    inStock: true,
  },
  {
    id: "3",
    brand: "Tom Ford",
    name: "Ombré Leather All Over Body Spray 150ml",
    price: 18500,
    originalPrice: 21000,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500",
    rating: 4.9,
    reviews: 560,
    badge: "Luxury Pick",
    inStock: false,
  },
  {
    id: "4",
    brand: "Rare Beauty",
    name: "Soft Pinch Liquid Blush - Joy (Coral)",
    price: 1850,
    originalPrice: 2200,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=500",
    rating: 4.9,
    reviews: 3120,
    badge: "New",
    inStock: true,
  },
];

export default function WishlistPage() {
  const router = useRouter();
  const savings = WISHLIST_ITEMS.reduce((acc, item) => acc + (item.originalPrice - item.price), 0);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Header />

      <div className="max-w-[1920px] mx-auto w-full px-4 md:px-8 py-6 flex-1">
        {/* Navigation / Breadcrumb */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#555] hover:text-[#d4af37] transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Back</span>
          </button>
        </div>
        {/* Title */}
        <div className="flex items-center justify-between mb-10 border-b border-[#222] pb-6">
          <div className="flex items-center gap-4">
            <Heart size={28} className="text-[#d4af37] fill-[#d4af37]" />
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-widest uppercase">My Wishlist</h1>
              <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{WISHLIST_ITEMS.length} saved items</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[#d4af37] font-bold font-serif text-xl">₹{savings.toLocaleString('en-IN')}</p>
            <p className="text-[#555] text-xs uppercase tracking-widest">Total Savings</p>
          </div>
        </div>

        {WISHLIST_ITEMS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart size={56} className="text-[#222] mb-6" />
            <h2 className="text-2xl font-serif font-bold tracking-widest mb-3">Your wishlist is empty</h2>
            <p className="text-[#555] text-sm mb-8">Start adding your favourite products.</p>
            <Link href="/collection" className="bg-[#d4af37] text-black px-8 py-3 uppercase font-bold tracking-widest text-xs hover:bg-white transition-all">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
              <button className="text-xs text-[#666] uppercase font-bold tracking-widest hover:text-red-400 transition-colors">
                Clear All
              </button>
              <Link
                href="/cart"
                className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <ShoppingBag size={14} /> Move All to Bag
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WISHLIST_ITEMS.map(item => {
                const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                return (
                  <div key={item.id} className="group bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] transition-all overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-square bg-gradient-to-b from-[#111] to-[#000] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.badge && (
                          <span className="bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                            {item.badge}
                          </span>
                        )}
                        {!item.inStock && (
                          <span className="bg-black/80 text-[#888] border border-[#333] text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                            Out of Stock
                          </span>
                        )}
                        <span className="bg-green-800 text-green-300 text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                          -{discount}%
                        </span>
                      </div>

                      {/* Remove button */}
                      <button className="absolute top-3 right-3 bg-black/60 border border-[#333] p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-700 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{item.brand}</p>
                      <h3 className="text-sm font-light leading-snug text-[#ddd] mb-3 line-clamp-2">{item.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < Math.floor(item.rating) ? "text-[#d4af37] fill-[#d4af37]" : "text-[#333]"} />
                        ))}
                        <span className="text-[#555] text-[10px]">({item.reviews.toLocaleString('en-IN')})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-xl font-serif font-bold text-white">₹{item.price.toLocaleString('en-IN')}</span>
                        <span className="text-[#444] text-xs line-through mb-0.5">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Add to Bag */}
                      <button
                        disabled={!item.inStock}
                        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all border disabled:opacity-30 disabled:cursor-not-allowed bg-[#111] border-[#333] hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37]"
                      >
                        <ShoppingBag size={14} />
                        {item.inStock ? "Move to Bag" : "Notify Me"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations CTA */}
            <div className="mt-16 text-center border-t border-[#1a1a1a] pt-12">
              <p className="text-[#555] text-xs uppercase tracking-widest font-bold mb-4">You might also like</p>
              <Link href="/collection" className="inline-block border border-[#333] text-white px-8 py-3 uppercase font-bold tracking-widest text-xs hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                Browse Collection
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
