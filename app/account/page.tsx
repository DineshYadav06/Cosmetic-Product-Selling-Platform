"use client";

import { useStore } from "../../lib/context/StoreContext";
import AuthPage from "../auth/page";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Package, Heart, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { user, logout } = useStore();
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
      
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
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
               <div className="bg-white p-6 border border-gray-200 shadow-sm hover:border-[#d4af37] transition-colors cursor-pointer group">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-gray-800 mb-4 group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                     <Package size={20} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Orders</h3>
                  <p className="text-sm text-gray-500">Track, return, or buy things again</p>
               </div>
               
               <div className="bg-white p-6 border border-gray-200 shadow-sm hover:border-[#d4af37] transition-colors cursor-pointer group">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-gray-800 mb-4 group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                     <MapPin size={20} />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Addresses</h3>
                  <p className="text-sm text-gray-500">Edit addresses for orders</p>
               </div>
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
