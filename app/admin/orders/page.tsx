"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, LayoutDashboard, Package, ClipboardList, ShoppingBag, Settings,
  CheckCircle2, Clock, Search, Loader2
} from "lucide-react";

import AdminSidebar from "../../../components/admin/Sidebar";
import { Truck } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All, Pending, Delivered

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch(err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleDeliveryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDelivered: !currentStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, isDelivered: !currentStatus } : o));
      } else {
        alert("Failed to update status");
      }
    } catch(err) {
      alert("Error updating order status");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o._id.includes(search) || (o.customer && o.customer.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === "All" ? true : (filter === "Delivered" ? o.isDelivered : !o.isDelivered);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin" 
              className="w-10 h-10 border border-[#222] flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-sm"
              title="Back to Dashboard"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Order Fulfillment</h1>
              <p className="text-[#555] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
                {filteredOrders.length} active orders requiring attention
              </p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#111] border-b border-[#1a1a1a] px-8 py-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
            <input
              type="text"
              placeholder="Search by Order ID, Customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] text-white pl-9 pr-4 py-2.5 text-xs font-bold tracking-wider focus:border-[#d4af37] outline-none placeholder:text-[#444] uppercase"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Delivered"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  filter === f ? "bg-[#d4af37] text-black border-[#d4af37]" : "border-[#222] text-[#666] hover:border-[#444] hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#d4af37]" />
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#111] border-b border-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold">
                  <th className="p-5">Order ID</th>
                  <th className="p-5">Customer Details</th>
                  <th className="p-5">Order Info</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Payment Status</th>
                  <th className="p-5 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <ClipboardList size={48} className="mx-auto mb-4 text-[#1a1a1a]" />
                      <p className="text-[#444] text-[10px] uppercase tracking-widest font-bold">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <tr key={order._id} className={`border-b border-[#111] hover:bg-[#111] transition-colors group ${idx % 2 === 0 ? "" : "bg-[#0c0c0c]"}`}>
                      <td className="p-5">
                        <span className="text-[10px] text-[#d4af37] font-mono font-bold tracking-tighter">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                        <p className="text-[9px] text-[#444] mt-1 uppercase font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-semibold text-white group-hover:text-[#d4af37] transition-colors">{order.customer || 'Guest User'}</p>
                        <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest">{order.email}</p>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest flex items-center gap-1">
                            <Package size={12} /> {order.productsCount || 0} Items
                          </span>
                          <p className="text-[9px] text-[#444] truncate max-w-[200px] italic">{order.address}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-white font-bold font-serif text-base">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="p-5">
                         <div className="flex flex-col gap-1">
                            {order.isPaid ? (
                               <span className="inline-flex items-center gap-1.5 text-[9px] text-green-500 uppercase tracking-widest font-bold bg-green-950/20 px-2 py-1 border border-green-900/30 w-fit">
                                 <CheckCircle2 size={10}/> Paid
                               </span>
                            ) : (
                               <span className="inline-flex items-center gap-1.5 text-[9px] text-yellow-500 uppercase tracking-widest font-bold bg-yellow-950/20 px-2 py-1 border border-yellow-900/30 w-fit">
                                 <Clock size={10}/> Pending
                               </span>
                            )}
                            <span className="text-[9px] text-[#555] uppercase font-bold tracking-widest">{order.paymentMethod}</span>
                         </div>
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => toggleDeliveryStatus(order._id, order.isDelivered)}
                          className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${
                            order.isDelivered
                              ? "bg-green-950/30 text-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                              : "bg-[#111] text-[#666] border-[#222] hover:border-[#d4af37] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                             {order.isDelivered ? <CheckCircle2 size={12} /> : <Truck size={12} />}
                             {order.isDelivered ? "Delivered" : "Mark Delivered"}
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
