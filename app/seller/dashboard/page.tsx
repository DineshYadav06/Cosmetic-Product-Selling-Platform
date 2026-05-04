"use client";

import { useState, useEffect } from "react";
import SellerSidebar from "../../../components/seller/Sidebar";
import { 
  ShoppingBag, 
  Package, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function SellerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - in real app, fetch from /api/seller/dashboard
    setTimeout(() => {
      setData({
        stats: [
          { label: "Total Revenue", value: "₹45,800", icon: IndianRupee, color: "#d4af37", change: "+12.5%" },
          { label: "Active Orders", value: "18", icon: ShoppingBag, color: "#4ade80", change: "4 pending" },
          { label: "Product Inventory", value: "124", icon: Package, color: "#60a5fa", change: "3 low stock" },
          { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, color: "#f472b6", change: "+0.4%" },
        ],
        recentOrders: [
          { id: "ORD-9821", customer: "Aria Sharma", status: "Paid", amount: "₹2,499", time: "2 hours ago" },
          { id: "ORD-9818", customer: "Vikram Malhotra", status: "Processing", amount: "₹4,120", time: "5 hours ago" },
          { id: "ORD-9815", customer: "Priya Das", status: "Shipped", amount: "₹1,850", time: "1 day ago" },
        ],
        topProducts: [
          { name: "Golden Aura Serum", sales: 42, revenue: "₹14,658" },
          { name: "Midnight Rose EDP", sales: 31, revenue: "₹9,269" },
          { name: "Velvet Matte Lipstick", sales: 28, revenue: "₹4,172" },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <SellerSidebar />
      
      <main className="flex-1 overflow-auto relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#d4af37]" />
          </div>
        )}

        {/* Top Header */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Commerce Overview</h1>
            <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Management Suite v2.0</p>
          </div>
          <div className="flex gap-4">
            <Link href="/seller/products/add" className="px-6 py-2.5 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
              Add New Product
            </Link>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {data?.stats.map((stat: any, i: number) => (
              <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 hover:border-[#333] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }} />
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-sm bg-[#111] border border-[#1a1a1a]">
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                  <span className="text-[10px] font-bold text-green-400 bg-green-950/30 px-2 py-0.5 border border-green-900">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-[#444] text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="px-6 py-4 border-b border-[#1a1a1a] flex justify-between items-center">
                  <h2 className="font-serif font-bold tracking-widest text-sm uppercase">Recent Sales</h2>
                  <Link href="/seller/orders" className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest hover:underline">Full Report</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[9px] uppercase tracking-[0.2em] text-[#444] border-b border-[#111]">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0f0f0f]">
                      {data?.recentOrders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-[#111] transition-colors group">
                          <td className="px-6 py-4 text-xs font-mono text-[#d4af37]">{order.id}</td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-white uppercase tracking-widest">{order.customer}</p>
                            <p className="text-[9px] text-[#444] flex items-center gap-1 mt-1"><Clock size={10} /> {order.time}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-serif font-bold text-white">{order.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border 
                              ${order.status === 'Paid' ? 'text-green-400 bg-green-950/20 border-green-900' : 'text-yellow-400 bg-yellow-950/20 border-yellow-900'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Performance Widget */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 space-y-8">
              <h2 className="font-serif font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#d4af37]" /> Best Sellers
              </h2>
              <div className="space-y-6">
                {data?.topProducts.map((prod: any, i: number) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white uppercase tracking-widest truncate group-hover:text-[#d4af37] transition-colors">{prod.name}</p>
                      <p className="text-[10px] text-[#444] uppercase tracking-widest mt-1">{prod.sales} Units Sold</p>
                    </div>
                    <p className="text-sm font-serif font-bold text-[#d4af37]">{prod.revenue}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-[#111]">
                <div className="bg-[#111] p-4 border-l-2 border-[#d4af37]">
                  <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mb-2">Store Health</p>
                  <p className="text-sm font-bold text-white">Your store is in the top 15% of cosmetic boutiques.</p>
                  <Link href="/seller/pricing" className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest mt-2 flex items-center gap-1 hover:gap-2 transition-all">
                    Upgrade for Priority <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
