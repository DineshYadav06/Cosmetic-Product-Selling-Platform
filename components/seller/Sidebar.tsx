"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  ExternalLink,
  Store,
  LogOut,
  Zap,
  User
} from "lucide-react";
import { useStore } from "../../lib/context/StoreContext";

export default function SellerSidebar() {
  const pathname = usePathname();
  const { logout, user } = useStore();

  const menuItems = [
    { name: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
    { name: "My Products", href: "/seller/products", icon: Package },
    { name: "Orders", href: "/seller/orders", icon: ShoppingBag },
    { name: "Analytics", href: "/seller/analytics", icon: BarChart3 },
    { name: "Subscription", href: "/seller/pricing", icon: Zap },
    { name: "Settings", href: "/seller/settings", icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col sticky top-0">
      {/* Brand */}
      <div className="p-8 border-b border-[#1a1a1a]">
        <Link href="/" className="group block">
          <h2 className="text-xl font-serif font-bold tracking-[0.2em] group-hover:text-[#d4af37] transition-colors uppercase">GLOWMART</h2>
          <p className="text-[9px] text-[#444] uppercase tracking-[0.3em] font-bold mt-1 group-hover:text-[#666]">Seller Central</p>
        </Link>
      </div>

      {/* Seller Identity */}
      <div className="p-6 bg-[#0d0d0d] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#111] border border-[#d4af37]/30 flex items-center justify-center">
            <User size={18} className="text-[#d4af37]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate uppercase tracking-widest">{user?.name || "Artisan"}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] text-[#555] uppercase font-bold tracking-widest">Store Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all
                ${isActive 
                  ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                  : 'text-[#666] hover:text-white hover:bg-[#111]'}`}
            >
              <item.icon size={18} className={isActive ? 'text-black' : ''} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#1a1a1a] space-y-2">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#666] hover:text-white transition-colors"
        >
          <ExternalLink size={18} />
          View Storefront
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-900/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
