"use client";

import { useStore } from "@/lib/context/StoreContext";
import AuthPage from "../auth/page";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Package, Heart, MapPin, LogOut, Store, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, logout } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // If user is not logged in, display the entire Login/Signup section here!
  if (!user) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="py-12 bg-[#f1f3f6]">
           {/* Reusing the exact same authentication page logic! */}
           <AuthPage />
        </div>
        <Footer />
      </main>
    );
  }

  // If user is logged in, show their Account details
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Back to Store</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wider">My Account</h1>
            <p className="text-gray-500 mt-2">Welcome back, {user.name || user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 text-sm uppercase tracking-widest font-bold hover:bg-red-600 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-1">
            <div className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col gap-2">
               <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Navigation</h3>
               <Link href="/account" className="text-[#d4af37] font-semibold py-2">Dashboard</Link>
               <Link href="/orders" className="text-gray-600 hover:text-black py-2 transition-colors">My Orders</Link>
               <Link href="/wishlist" className="text-gray-600 hover:text-black py-2 transition-colors">Wishlist</Link>
               <Link href="/addresses" className="text-gray-600 hover:text-black py-2 transition-colors">Saved Addresses</Link>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <Link href="/orders" className="bg-white p-6 border border-gray-200 shadow-sm hover:border-[#d4af37] transition-colors cursor-pointer group">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-gray-800 mb-4 group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                     <Package size={20} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Orders</h3>
                  <p className="text-sm text-gray-500">Track, return, or buy things again</p>
               </Link>
               
               <Link href="/addresses" className="bg-white p-6 border border-gray-200 shadow-sm hover:border-[#d4af37] transition-colors cursor-pointer group">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-gray-800 mb-4 group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                     <MapPin size={20} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Addresses</h3>
                  <p className="text-sm text-gray-500">Edit addresses for orders</p>
               </Link>

                {/* GlowPass Premium Section */}
                <div className={`col-span-1 sm:col-span-2 p-8 border-2 relative overflow-hidden transition-all
                  ${user.glowPass?.isActive 
                    ? 'bg-gradient-to-br from-[#000] to-[#111] border-[#d4af37]' 
                    : 'bg-white border-dashed border-gray-300 hover:border-[#d4af37]'}`}>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest
                                ${user.glowPass?.isActive ? 'bg-[#d4af37] text-black' : 'bg-gray-100 text-gray-400'}`}>
                                {user.glowPass?.isActive ? `GlowPass ${user.glowPass.tier}` : 'Not Active'}
                             </div>
                             {user.glowPass?.isActive && (
                               <span className="text-[#d4af37] animate-pulse">✦</span>
                             )}
                          </div>
                          <h3 className={`text-2xl font-serif font-bold mb-2 ${user.glowPass?.isActive ? 'text-white' : 'text-gray-900'}`}>
                             {user.glowPass?.isActive ? 'Elite Membership Active' : 'Upgrade to GlowPass Premium'}
                          </h3>
                          <p className={`text-sm max-w-md ${user.glowPass?.isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                             {user.glowPass?.isActive 
                               ? `Your benefits are active until ${new Date(user.glowPass.expiresAt).toLocaleDateString()}. Enjoy free express shipping and early access to drops.`
                               : 'Get free shipping, exclusive niche fragrance samples, and early access to new arrivals with our elite membership.'}
                          </p>
                       </div>
                       
                       {!user.glowPass?.isActive ? (
                         <button 
                           onClick={async () => {
                             const res = await fetch('/api/user/glowpass', {
                               method: 'POST',
                               headers: { 
                                 'Content-Type': 'application/json',
                                 'Authorization': `Bearer ${user.token}`
                               },
                               body: JSON.stringify({ tier: 'platinum' })
                             });
                             if(res.ok) window.location.reload();
                           }}
                           className="bg-[#d4af37] text-black px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                         >
                           Join Now — ₹499/yr
                         </button>
                       ) : (
                         <div className="text-right">
                            <span className="block text-[10px] text-[#d4af37] font-bold uppercase tracking-[0.2em] mb-1">Status</span>
                            <span className="text-white font-bold text-lg">VIP GOLD</span>
                         </div>
                       )}
                    </div>
                    
                    {/* Background Graphic */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                       <Store size={150} className={user.glowPass?.isActive ? "text-[#d4af37]" : "text-gray-200"} />
                    </div>
                </div>

                {user.role !== 'seller' && (
                  <Link href="/seller/register" className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-6 border border-[#d4af37]/30 shadow-lg hover:border-[#d4af37] transition-all cursor-pointer group col-span-1 sm:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Store size={80} className="text-[#d4af37]" />
                    </div>
                    <div className="relative z-10">
                      <div className="bg-[#d4af37]/10 w-12 h-12 rounded-full flex items-center justify-center text-[#d4af37] mb-4 group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
                         <Store size={20} />
                      </div>
                      <h3 className="font-bold text-xl mb-1 text-white">Become a Seller</h3>
                      <p className="text-sm text-gray-400 max-w-md">Start your luxury beauty business on GLOWMART. Reach millions of customers and grow your brand with our premium platform.</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-[#d4af37] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                        Establish Your Store <ArrowRight size={14} />
                      </div>
                    </div>
                 </Link>
               )}
            </div>

            <div className="bg-white p-8 border border-gray-200 shadow-sm mt-4">
              <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-4">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                 <div>
                    <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Full Name</span>
                    <span className="text-gray-800 font-medium">{user.name || "N/A"}</span>
                 </div>
                 <div>
                    <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Email Address</span>
                    <span className="text-gray-800 font-medium">{user.email}</span>
                 </div>
                 {/* Placeholder for future extended user data */}
                 <div>
                    <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Phone Number</span>
                    <span className="text-gray-800 font-medium">+91 - Add Phone</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
