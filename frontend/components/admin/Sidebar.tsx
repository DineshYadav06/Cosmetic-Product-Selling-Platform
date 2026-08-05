"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ClipboardList, ShoppingBag, Settings, Users, ChevronLeft, BarChart3
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: ClipboardList, label: "Orders", href: "/admin/orders" },
    { icon: Users, label: "Customers", href: "/admin/users" },
    { icon: ShoppingBag, label: "Add Product", href: "/admin/add-product" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col sticky top-0 h-screen flex-shrink-0 z-50">
      <div className="p-6 border-b border-[#1a1a1a]">
        <div className="text-[10px] tracking-[0.4em] text-[#d4af37] font-semibold mb-1 uppercase">ADMIN PANEL</div>
        <div className="text-xl font-serif tracking-[0.3em] font-bold" style={{
          background: "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
        }}>GLOWMART</div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${
                isActive
                  ? "bg-[#d4af37] text-black shadow-[0_5px_15px_rgba(212,175,55,0.2)]"
                  : "text-[#555] hover:text-white hover:bg-[#111]"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <Link href="/" className="flex items-center gap-2 text-[10px] text-[#333] hover:text-white transition-colors font-bold uppercase tracking-widest">
          <ChevronLeft size={14} /> Back to Store
        </Link>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4af37; }
      `}</style>
    </aside>
  );
}
