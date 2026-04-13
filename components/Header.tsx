"use client";

import { Search, MapPin, Heart, ShoppingBag, User, Menu, X, ChevronRight, UserCircle } from "lucide-react";
import Link from "next/link";
import { useStore } from "../lib/context/StoreContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { cartCount, wishlist, user, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Amazon-style drawer categories for GLOWMART
  const drawerSections = [
    {
      title: "Trending",
      items: ["Best Sellers", "New Releases", "Movers and Shakers"]
    },
    {
      title: "Shop By Category",
      items: ["Makeup", "Skincare", "Fragrances", "Haircare", "Bath & Body", "Mens Grooming"]
    },
    {
      title: "Top Brands",
      items: ["Dior", "Fenty Beauty", "Rare Beauty", "Lakmé", "MAC", "The Ordinary"]
    },
    {
      title: "Programs & Features",
      items: ["GLOWMART Premium", "Gift Cards", "Find a Store"]
    }
  ];

  return (
    <>
      <header className="w-full border-b border-[#222] bg-black text-white sticky top-0 z-50">
        {/* Top Utility Bar */}
        <div className="bg-[#111] text-[#a0a0a0] text-xs py-2 px-4 md:px-8 border-b border-[#222]">
          <div className="max-w-full mx-auto flex justify-between md:justify-end gap-6 items-center uppercase tracking-wider font-semibold">
            <Link href="/track" className="hidden sm:flex hover:text-[#d4af37] transition-colors">Track Order</Link>
            <div className="flex gap-6">
              {mounted && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-[#d4af37]">Hi, {user.name.split(" ")[0]}</span>
                  <button onClick={logout} className="hover:text-red-400 transition-colors uppercase">Logout</button>
                </div>
              ) : (
                <Link href="/auth" className="flex items-center gap-1 hover:text-[#d4af37] transition-colors">
                  <User size={14} /> Account
                </Link>
              )}
              <Link href="/stores" className="flex items-center gap-1 hover:text-[#d4af37] transition-colors">
                <MapPin size={14} /> Boutiques
              </Link>
            </div>
          </div>
        </div>

        {/* Main Logo and Search */}
        <div className="max-w-full mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
              <input 
                type="text" 
                placeholder="Search fragrances, brands..." 
                className="w-full bg-[#111] border border-[#333] rounded-sm py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#666]"
              />
            </div>
          </div>

          <div className="text-center flex-1 leading-tight">
            <Link href="/" className="hover:opacity-90 transition-opacity inline-block mt-2 md:mt-0">
              {/* Decorative top line */}
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="block w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]"></span>
                <span className="text-[#d4af37] text-[8px] tracking-[0.4em] font-semibold uppercase">est. 2026</span>
                <span className="block w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]"></span>
              </div>
              {/* Main brand name */}
              <div
                className="text-[28px] font-serif tracking-[0.4em] font-bold"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #f5e6c8 40%, #d4af37 60%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                GLOWMART
              </div>
              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 my-[2px]">
                <span className="block w-5 h-[0.5px] bg-[#d4af37] opacity-60"></span>
                <span className="text-[#d4af37] text-[6px]">✦</span>
                <span className="block w-5 h-[0.5px] bg-[#d4af37] opacity-60"></span>
              </div>
              {/* INDIA subtitle */}
              <div className="text-[9px] tracking-[0.6em] text-[#d4af37] font-semibold uppercase">
                INDIA
              </div>
            </Link>
          </div>

          <div className="flex-1 flex justify-end gap-6 items-center w-full md:w-auto mt-2 md:mt-0">
              <Link href="/wishlist" className="hover:text-[#d4af37] transition-colors relative flex items-center">
                <Heart size={22} className="stroke-[1.5]" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="hover:text-[#d4af37] transition-colors relative flex items-center">
                <ShoppingBag size={22} className="stroke-[1.5]" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
          </div>
        </div>

        {/* Amazon-Style Secondary Navigation */}
        <div className="bg-[#1f1f1f] border-t border-[#333]">
          <nav className="max-w-[1920px] mx-auto px-2 md:px-6 flex items-center h-10 overflow-x-auto hide-scrollbar">
            {/* Hamburger "All" */}
            <button 
              onClick={() => setMenuOpen(true)} 
              className="flex items-center gap-1 hover:outline outline-1 outline-white px-2 py-1 text-sm font-bold tracking-wider mr-2 flex-shrink-0"
            >
              <Menu size={20} /> All
            </button>
            
            {/* Nav Links */}
            <ul className="flex items-center gap-2 text-[13px] font-semibold tracking-wider text-[#eee] whitespace-nowrap">
              <li>
                <Link href="/" className="hover:outline outline-1 outline-white px-2 py-1 inline-block">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:outline outline-1 outline-white px-2 py-1 inline-block">About</Link>
              </li>
              {["New Arrivals", "Bestsellers", "Niche Fragrances", "Designer", "Gift Sets", "Sale"].map((cat) => (
                <li key={cat}>
                  <Link 
                    href={`/collection?category=${cat}`} 
                    className={`hover:outline outline-1 outline-white px-2 py-1 inline-block ${cat === 'Sale' ? 'text-red-400' : ''}`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Slide-out Drawer & Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black/70 transition-opacity" 
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-[320px] sm:w-[365px] h-full bg-white text-black shadow-2xl flex flex-col overflow-y-auto animate-slideRight">
            {/* Close Button Next to Drawer (Desktop style) */}
            <button 
              onClick={() => setMenuOpen(false)} 
              className="absolute top-4 -right-12 text-white hover:text-[#d4af37] p-1 flex items-center justify-center z-[110]"
            >
              <X size={32} />
            </button>

            {/* User Greeting Section (Matches Amazon Dark Top) */}
            <div className="bg-[#232f3e] text-white py-4 px-8 flex items-center gap-3">
              <UserCircle size={28} className="text-white" />
              <div className="font-bold text-lg tracking-wider font-serif">
                Hello, {mounted && user ? user.name.split(" ")[0] : "Sign in"}
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-4">
              {drawerSections.map((section, idx) => (
                <div key={section.title} className={`py-2 ${idx !== 0 ? 'border-t border-gray-300 mt-2' : ''}`}>
                  <h3 className="px-8 py-2 font-bold text-sm tracking-widest text-[#222]">
                    {section.title}
                  </h3>
                  <ul className="mt-1">
                    {section.items.map(item => (
                      <li key={item}>
                        <Link 
                          href={`/collection?category=${item}`} 
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-8 py-3 text-sm text-[#444] hover:bg-gray-100 transition-colors"
                        >
                          {item}
                          <ChevronRight size={16} className="text-gray-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tailwind Slide Right Animation if not available globally */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideRight {
          animation: slideRight 0.3s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  );
}
