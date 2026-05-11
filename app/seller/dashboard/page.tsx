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
import AnalyticsChart from "../../../components/seller/AnalyticsChart";

export default function SellerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const iconMap: any = {
    IndianRupee,
    ShoppingBag,
    Package,
    TrendingUp
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/seller/dashboard");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
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
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="w-10 h-10 border border-[#222] flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-sm"
              title="Back to Store"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Commerce Overview</h1>
              <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Management Suite v2.0</p>
            </div>
            
            {/* Membership Card */}
            <div className="hidden md:flex items-center bg-gradient-to-br from-[#1a1a1a] to-black border border-[#d4af37]/20 p-3 px-6 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.1)] group hover:border-[#d4af37]/50 transition-all">
               <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-[#d4af37] uppercase tracking-[0.3em]">Artisan Tier</span>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Premium Gold</span>
               </div>
               <div className="h-8 w-[1px] bg-[#1a1a1a] mx-4" />
               <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center bg-black overflow-hidden relative">
                  <TrendingUp size={16} className="text-[#d4af37] animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/10 to-transparent" />
               </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/seller/add-product" className="px-6 py-2.5 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
              Add New Product
            </Link>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Revenue Trend */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-serif font-bold tracking-widest text-sm uppercase">Revenue Growth</h2>
                <p className="text-[#444] text-[8px] uppercase tracking-widest font-bold mt-1">7-Day Performance Insight</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full" />
                  <span className="text-[9px] uppercase font-bold text-white tracking-widest">Revenue</span>
                </div>
              </div>
            </div>
            {data?.trendData && <AnalyticsChart data={data.trendData} />}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {data?.stats.map((stat: any, i: number) => {
              const Icon = iconMap[stat.icon] || Package;
              return (
                <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 hover:border-[#333] transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }} />
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-sm bg-[#111] border border-[#1a1a1a]">
                      <Icon size={20} style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] font-bold text-green-400 bg-green-950/30 px-2 py-0.5 border border-green-900">{stat.change}</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-[#444] text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              );
            })}
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
                          <td className="px-6 py-4 text-xs font-mono text-[#d4af37] truncate max-w-[100px]">{order.id}</td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-white uppercase tracking-widest">{order.customer}</p>
                            <p className="text-[9px] text-[#444] flex items-center gap-1 mt-1">
                              <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm font-serif font-bold text-white">₹{order.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border 
                              ${order.status === 'Paid' || order.status === 'Completed' ? 'text-green-400 bg-green-950/20 border-green-900' : 'text-yellow-400 bg-yellow-950/20 border-yellow-900'}`}>
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
