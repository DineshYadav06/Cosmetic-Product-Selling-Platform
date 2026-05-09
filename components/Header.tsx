"use client";

import { Search, MapPin, Heart, ShoppingBag, User, Menu, X, ChevronRight, UserCircle } from "lucide-react";
import Link from "next/link";
import { useStore } from "../lib/context/StoreContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { cartCount, wishlist, user, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcement, setAnnouncement] = useState("FREE SHIPPING ON ALL ORDERS OVER ₹999");

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetch('/api/admin/settings').then(res => res.json()).then(data => {
      if(data && data.announcementText) setAnnouncement(data.announcementText);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

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
        {/* Dynamic Top Banner */}
        <div className="bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-[0.2em] py-1.5 px-4 text-center">
          {announcement}
        </div>
        
        {/* Top Utility Bar — hidden on mobile */}
        <div className="hidden sm:block bg-[#111] text-[#a0a0a0] text-xs py-2 px-4 md:px-8 border-b border-[#222]">
          <div className="max-w-full mx-auto flex justify-end gap-6 items-center uppercase tracking-wider font-semibold">
            {(!user || user.role !== 'admin') && (
              <Link href="/seller/register" className="text-[#d4af37] hover:text-white transition-colors border-r border-[#333] pr-6">Sell on GLOWMART</Link>
            )}
            <Link href="/track" className="hover:text-[#d4af37] transition-colors">Track Order</Link>
            <div className="flex gap-6">
              {mounted && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-[#d4af37]">Hi, {user.name.split(" ")[0]}</span>
                  <button onClick={logout} className="hover:text-red-400 transition-colors uppercase">Logout</button>
                </div>
              ) : (
                <Link href="/account" className="flex items-center gap-1 hover:text-[#d4af37] transition-colors">
                  <User size={14} /> Account
                </Link>
              )}
              <Link href="/stores" className="flex items-center gap-1 hover:text-[#d4af37] transition-colors">
                <MapPin size={14} /> Boutiques
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-full mx-auto px-3 md:px-8 py-3 flex items-center justify-between gap-3">
          
          {/* Left: Hamburger + Search (desktop only search here) */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-1 text-white hover:text-[#d4af37] transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Search bar - visible on desktop, hidden on mobile */}
            <form onSubmit={handleSearch} className="relative hidden md:block max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={16} />
              <input
                type="text"
                placeholder="Search fragrances, brands..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#333] rounded-sm py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#666]"
              />
            </form>
          </div>

          {/* Center: Logo */}
          <div className="text-center leading-tight flex-shrink-0">
            <Link href="/" className="hover:opacity-90 transition-opacity inline-block">
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <span className="block w-5 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]"></span>
                <span className="text-[#d4af37] text-[7px] tracking-[0.3em] font-semibold uppercase">est. 2026</span>
                <span className="block w-5 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]"></span>
              </div>
              <div
                className="text-[22px] md:text-[28px] font-serif tracking-[0.35em] font-bold"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #f5e6c8 40%, #d4af37 60%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                GLOWMART
              </div>
              <div className="flex items-center justify-center gap-2 my-[1px]">
                <span className="block w-4 h-[0.5px] bg-[#d4af37] opacity-60"></span>
                <span className="text-[#d4af37] text-[6px]">✦</span>
                <span className="block w-4 h-[0.5px] bg-[#d4af37] opacity-60"></span>
              </div>
              <div className="text-[8px] tracking-[0.5em] text-[#d4af37] font-semibold uppercase">INDIA</div>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 md:gap-5 flex-1 justify-end">
            {/* Search icon on mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden text-white hover:text-[#d4af37] transition-colors"
              aria-label="Search"
            >
              <Search size={21} />
            </button>

            {/* Login button on mobile (icon only) */}
            {!user && mounted && (
              <Link
                href="/auth"
                className="md:hidden text-white hover:text-[#d4af37] transition-colors"
                aria-label="Login"
              >
                <User size={21} />
              </Link>
            )}

            <Link href="/wishlist" className="hover:text-[#d4af37] transition-colors relative flex items-center">
              <Heart size={21} className="stroke-[1.5]" />
              {mounted && wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="hover:text-[#d4af37] transition-colors relative flex items-center">
              <ShoppingBag size={21} className="stroke-[1.5]" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login button desktop */}
            {!user && mounted && (
              <Link
                href="/auth"
                className="hidden md:flex items-center gap-2 bg-[#d4af37] text-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                <User size={14} /> Login / Sign Up
              </Link>
            )}
            {user && mounted && (
              <div className="hidden md:flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link href="/admin" className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-red-800 hover:text-white transition-all">
                    Admin
                  </Link>
                )}
                {user.role === 'seller' && (
                  <Link href="/seller/dashboard" className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-all">
                    Seller
                  </Link>
                )}
                <div className="flex items-center gap-3 bg-[#111] border border-[#222] px-4 py-1.5 transition-all">
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Elite Status</span>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${user.glowPass?.isActive ? 'text-[#d4af37]' : 'text-white'}`}>
                      {user.name.split(" ")[0]} {user.glowPass?.isActive && "✦"}
                    </span>
                  </div>
                  {user.glowPass?.isActive && (
                    <div className="bg-[#d4af37] text-black text-[7px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                      GLOWPASS
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar — shown when search icon clicked */}
        {searchOpen && (
          <div className="md:hidden px-3 pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={16} />
              <input
                type="text"
                placeholder="Search fragrances, brands..."
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#d4af37] rounded-sm py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none placeholder:text-[#666]"
              />
            </form>
          </div>
        )}

        {/* Secondary Nav */}
        <div className="bg-[#1f1f1f] border-t border-[#333]">
          <nav className="max-w-[1920px] mx-auto px-2 md:px-4 flex items-center h-9 overflow-x-auto hide-scrollbar gap-1">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "New Arrivals", href: "/collection?category=New Arrivals" },
              { label: "AI Skin Analysis", href: "/ai-consultant", premium: true },
              { label: "Bestsellers", href: "/collection?category=Bestsellers" },
              { label: "Niche Fragrances", href: "/collection?category=Niche Fragrances" },
              { label: "Designer", href: "/collection?category=Designer" },
              { label: "Gift Sets", href: "/collection?category=Gift Sets" },
              { label: "Sale", href: "/collection?category=Sale", red: true },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[12px] font-semibold tracking-wide whitespace-nowrap px-2.5 py-1 hover:outline outline-1 outline-white flex-shrink-0 ${(item as any).red ? "text-red-400" : (item as any).premium ? "text-[#d4af37] border border-[#d4af37]/30 bg-[#d4af37]/5 animate-pulse" : "text-[#eee]"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Slide-out Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div
            className="fixed inset-0 bg-black/70 transition-opacity"
            onClick={() => setMenuOpen(false)}
          ></div>

          <div className="relative w-[85vw] max-w-[340px] h-full bg-white text-black shadow-2xl flex flex-col overflow-y-auto animate-slideRight">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-3 right-3 text-black hover:text-[#d4af37] p-1 z-[110]"
            >
              <X size={24} />
            </button>

            <div className="bg-[#232f3e] text-white py-4 px-6 flex items-center gap-3">
              <UserCircle size={26} className="text-white" />
              <div className="font-bold text-base tracking-wider font-serif">
                Hello, {mounted && user ? user.name.split(" ")[0] : "Sign in"}
              </div>
            </div>

            <div className="flex-1 py-4">
              {drawerSections.map((section, idx) => (
                <div key={section.title} className={`py-2 ${idx !== 0 ? "border-t border-gray-200 mt-2" : ""}`}>
                  <h3 className="px-6 py-2 font-bold text-sm tracking-widest text-[#222]">{section.title}</h3>
                  <ul>
                    {section.items.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/collection?category=${item}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-6 py-3 text-sm text-[#444] hover:bg-gray-100 transition-colors"
                        >
                          {item}
                          <ChevronRight size={15} className="text-gray-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Mobile-only quick links */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <h3 className="px-6 py-2 font-bold text-sm tracking-widest text-[#222]">Account</h3>
                {user && user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-6 py-3 text-sm text-red-600 font-bold hover:bg-gray-100">
                    Admin Panel <ChevronRight size={15} />
                  </Link>
                )}
                {user && user.role === 'seller' && (
                  <Link href="/seller/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-6 py-3 text-sm text-[#d4af37] font-bold hover:bg-gray-100">
                    Seller Dashboard <ChevronRight size={15} />
                  </Link>
                )}
                <Link href="/track" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-6 py-3 text-sm text-[#444] hover:bg-gray-100">
                  Track Order <ChevronRight size={15} className="text-gray-400" />
                </Link>
                <Link href="/stores" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-6 py-3 text-sm text-[#444] hover:bg-gray-100">
                  Boutiques / Stores <ChevronRight size={15} className="text-gray-400" />
                </Link>
                {!user && (
                  <Link
                    href="/auth"
                    onClick={() => { setMenuOpen(false); }}
                    className="flex items-center justify-between w-full px-6 py-3 text-sm text-[#d4af37] font-bold hover:bg-gray-100"
                  >
                    Login / Sign Up <ChevronRight size={15} />
                  </Link>
                )}
                {user && (
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="flex items-center justify-between w-full px-6 py-3 text-sm text-red-500 font-bold hover:bg-gray-100"
                  >
                    Logout <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideRight {
          animation: slideRight 0.3s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </>
  );
}
