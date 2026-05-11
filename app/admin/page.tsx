"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/context/StoreContext";
import {
  Package, ShoppingBag, IndianRupee, Users, ArrowUpRight, Loader2, BarChart3, TrendingUp
} from "lucide-react";
import AdminSidebar from "../../components/admin/Sidebar";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useStore();
  const [data, setData] = useState({
    stats: { totalProducts: 0, totalOrders: 0, totalRevenue: 0, activeCustomers: 0 },
    recentOrders: [] as any[],
    recentProducts: [] as any[],
    lowStockProducts: [] as any[],
    chartData: [] as { name: string, revenue: number }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push("/auth");
      return;
    }

    fetch('/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then(res => res.json())
      .then(val => {
        setData(val);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  const stats = [
    { label: "Total Products", value: data.stats.totalProducts, icon: Package, color: "#d4af37", bg: "rgba(212,175,55,0.08)", change: "Live data" },
    { label: "Total Orders", value: data.stats.totalOrders, icon: ShoppingBag, color: "#4ade80", bg: "rgba(74,222,128,0.08)", change: "Live data" },
    { label: "Revenue", value: `₹${(data.stats.totalRevenue).toLocaleString('en-IN')}`, icon: IndianRupee, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", change: "Paid Orders" },
    { label: "Active Customers", value: data.stats.activeCustomers, icon: Users, color: "#f472b6", bg: "rgba(244,114,182,0.08)", change: "Registered users" },
  ];

  const maxRevenue = Math.max(...data.chartData.map(d => d.revenue), 1);

  const statusColor: Record<string, string> = {
    delivered: "text-green-400 bg-green-900/30 border-green-800",
    processing: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
    pending: "text-[#888] bg-[#111] border-[#222]",
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <AdminSidebar />

      {/* Main */}
      <div className="flex-1 overflow-auto relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#d4af37]" />
          </div>
        )}

        {/* Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Overview</h1>
            <p className="text-[#555] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Management Center Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
                <p className="text-white text-xs font-bold uppercase tracking-widest">Dinesh Yadav</p>
                <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest">Owner</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#111] border border-[#d4af37]/30 flex items-center justify-center">
                <span className="text-[#d4af37] font-bold">DY</span>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative overflow-hidden hover:border-[#333] transition-colors group">
                <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-sm" style={{ background: stat.bg }}>
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                  <ArrowUpRight size={16} className="text-[#333] group-hover:text-[#555] transition-colors" />
                </div>
                <p className="text-3xl font-serif font-bold text-white mb-1">{loading ? "..." : stat.value}</p>
                <p className="text-[#555] text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                <p className="text-xs mt-2" style={{ color: stat.color }}>{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             {/* Revenue Chart */}
             <div className="xl:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] p-8">
                <div className="flex items-center justify-between mb-10">
                   <h2 className="font-serif font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                     <BarChart3 size={18} className="text-[#d4af37]" /> Revenue Performance
                   </h2>
                   <span className="text-[10px] text-[#444] font-bold uppercase tracking-widest">Last 6 Months</span>
                </div>
                
                <div className="flex items-end justify-between h-64 gap-2 px-4">
                   {data.chartData.map((d, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center group">
                        <div className="w-full relative bg-[#111] h-full flex flex-col justify-end overflow-hidden group-hover:bg-[#1a1a1a] transition-colors">
                           <div 
                              className="w-full bg-gradient-to-t from-[#d4af37] to-[#f5e6c8] group-hover:from-[#fff] group-hover:to-[#d4af37] transition-all duration-700" 
                              style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                           />
                           <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-bold bg-black px-2 py-1 border border-[#d4af37]">₹{d.revenue}</span>
                           </div>
                        </div>
                        <span className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#555] group-hover:text-white">{d.name}</span>
                     </div>
                   ))}
                </div>
             </div>

             {/* AI Insights / System Alerts */}
             <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 flex flex-col">
                <h2 className="font-serif font-bold tracking-widest text-sm uppercase mb-8 pb-4 border-b border-[#111] flex items-center gap-2">
                   <TrendingUp size={18} className="text-[#d4af37]" /> Platform Insights
                </h2>
                
                <div className="space-y-6">
                   <div className="p-4 bg-[#111] border-l-2 border-[#d4af37]">
                      <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Trending Concern</p>
                      <p className="text-sm font-bold text-white">Acne & Blemishes</p>
                      <p className="text-[9px] text-green-400 mt-1">↑ 12% increase this week</p>
                   </div>
                   
                   <div className="p-4 bg-[#111] border-l-2 border-red-800">
                      <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">Inventory Alert</p>
                      {data.lowStockProducts.length > 0 ? (
                        <>
                          <p className="text-sm font-bold text-white">{data.lowStockProducts.length} Items Low Stock</p>
                          <div className="mt-2 space-y-1">
                            {data.lowStockProducts.slice(0, 2).map((p: any) => (
                              <p key={p._id} className="text-[9px] text-[#888] truncate">
                                <span className="text-red-500 font-bold">{p.stockCount} left:</span> {p.name}
                              </p>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm font-bold text-white">Stock levels healthy</p>
                      )}
                      <Link href="/admin/products" className="text-[9px] text-red-500 mt-2 block hover:underline">Manage Stock Now →</Link>
                   </div>

                   <div className="p-4 bg-[#111] border-l-2 border-blue-500">
                      <p className="text-[10px] text-[#555] uppercase tracking-widest font-bold mb-1">New Registrations</p>
                      <p className="text-sm font-bold text-white">+14 Users today</p>
                      <p className="text-[9px] text-blue-400 mt-1">Check User activity</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             {/* Recent Orders */}
            <div className="xl:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
                <h2 className="font-serif font-bold tracking-widest text-sm uppercase">Recent Transactions</h2>
                <Link href="/admin/orders" className="text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">View All Orders →</Link>
              </div>
              <div className="overflow-auto min-h-[300px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#111] text-[10px] uppercase tracking-widest text-[#444] font-bold">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.length === 0 && !loading && (
                      <tr><td colSpan={4} className="p-8 text-center text-[#555] text-xs">No Recent Orders</td></tr>
                    )}
                    {data.recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-[#0f0f0f] hover:bg-[#111] transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-[#d4af37]">{order.id.slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm font-bold">{order.customer}</td>
                        <td className="px-6 py-4 text-sm font-serif font-bold">₹{order.amount.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${statusColor[order.status] || statusColor.pending}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
                <h2 className="font-serif font-bold tracking-widest text-sm uppercase">New Additions</h2>
                <Link href="/admin/products" className="text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Manage →</Link>
              </div>
              <div className="divide-y divide-[#0f0f0f] flex-1">
                {data.recentProducts.map((p: any) => (
                  <div key={p._id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#111] transition-colors">
                    <div className="w-10 h-10 bg-[#111] border border-[#1a1a1a] flex-shrink-0 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-[#d4af37] uppercase tracking-wider">{p.brand}</p>
                      <p className="text-xs text-[#888] truncate">{p.name}</p>
                    </div>
                    <p className="text-sm font-serif font-bold flex-shrink-0">₹{Number(p.price).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
