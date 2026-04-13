"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "../../lib/context/StoreContext";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Header />
      
      <div className="max-w-[1920px] mx-auto w-full px-4 md:px-8 py-10 flex-1">
        <h1 className="text-3xl font-serif font-bold tracking-widest uppercase mb-10 text-center border-b border-[#222] pb-6">
          Your Luxury Bag <span className="text-sm font-sans tracking-widest text-[#666] ml-2">({cartCount} items)</span>
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={56} className="text-[#222] mb-6" />
            <h2 className="text-2xl font-serif font-bold tracking-widest mb-3">Your bag is empty</h2>
            <p className="text-[#555] text-sm mb-8">Sign in to save or access already saved items in your bag.</p>
            <div className="flex gap-4">
               <Link href="/auth" className="bg-[#111] border border-[#333] text-white px-8 py-3 uppercase font-bold tracking-widest text-xs hover:border-[#d4af37] transition-all">
                 Sign In
               </Link>
               <Link href="/collection" className="bg-[#d4af37] text-black px-8 py-3 uppercase font-bold tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                 Shop Now
               </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 bg-[#0a0a0a] border border-[#222] p-6 items-center shadow-lg relative h-[180px]">
                   <div className="w-32 h-full relative bg-gradient-to-t from-[#000] to-[#111] border border-[#333] flex-shrink-0 flex items-center justify-center p-2">
                     <Image src={item.image} alt={item.name} fill className="object-contain drop-shadow-lg p-2" />
                   </div>
                   
                   <div className="flex-1 flex flex-col justify-center h-full">
                      <h3 className="text-[#d4af37] uppercase tracking-[0.2em] font-bold text-[10px] mb-2">{item.brand}</h3>
                      <h2 className="text-sm font-light leading-relaxed mb-4 max-w-[80%]">{item.name}</h2>
                      
                      <div className="flex items-center gap-4 mt-auto">
                         <label className="text-[10px] uppercase text-[#666] font-bold tracking-widest">Qty</label>
                         <select 
                           value={item.quantity} 
                           onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                           className="bg-black border border-[#333] text-white outline-none p-1 text-xs focus:border-[#d4af37] w-16"
                         >
                           {[1,2,3,4,5,6,7,8,9,10].map(num => (
                             <option key={num} value={num}>{num}</option>
                           ))}
                         </select>
                      </div>
                   </div>

                   <div className="flex flex-col justify-between items-end h-full">
                      <button onClick={() => removeFromCart(item.id)} className="text-[#555] hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <div className="text-xl font-serif text-white">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="w-full lg:w-1/3">
               <div className="bg-[#0a0a0a] border border-[#222] p-8 sticky top-28 shadow-2xl">
                  <h2 className="text-lg font-serif font-bold tracking-widest uppercase mb-6 border-b border-[#222] pb-4">Order Summary</h2>
                  
                  <div className="flex flex-col gap-4 text-sm font-light text-[#ccc] border-b border-[#222] pb-6 mb-6">
                     <div className="flex justify-between">
                       <span>Subtotal</span>
                       <span className="font-serif">₹{cartTotal.toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Shipping</span>
                       <span className="text-[#d4af37] uppercase text-[10px] font-bold tracking-widest mt-1">Free</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Estimated Tax (18%)</span>
                       <span className="font-serif">₹{Math.floor(cartTotal * 0.18).toLocaleString('en-IN')}</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-end mb-8">
                     <span className="uppercase tracking-[0.2em] font-bold text-sm">Total</span>
                     <span className="text-3xl font-serif text-[#d4af37]">₹{(cartTotal + Math.floor(cartTotal * 0.18)).toLocaleString('en-IN')}</span>
                  </div>

                  <Link href="/checkout" className="block w-full bg-[#d4af37] text-black py-4 uppercase tracking-[0.2em] font-bold text-center text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-white hover:text-black transition-all">
                    Secure Checkout
                  </Link>
                  
                  <p className="text-center text-[#666] text-[10px] uppercase font-bold tracking-widest mt-6">
                    SSL Encrypted Payment
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
