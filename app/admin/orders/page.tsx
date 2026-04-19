"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft, LayoutDashboard, Package, ClipboardList, ShoppingBag, Settings,
  CheckCircle2, Clock, Search, Loader2
} from "lucide-react";

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
    const matchesSearch = o._id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : (filter === "Delivered" ? o.isDelivered : !o.isDelivered);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col sticky top-0 h-screen flex-shrink-0">
        <div className="p-6 border-b border-[#1a1a1a]">
           <div className="text-[10px] tracking-[0.4em] text-[#d4af37] font-semibold mb-1">ADMIN PANEL</div>
           <div className="text-xl font-serif tracking-[0.3em] font-bold" style={{
             background: "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
           }}>GLOWMART</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
            { icon: Package, label: "Products", href: "/admin/products" },
            { icon: ClipboardList, label: "Orders", href: "/admin/orders", active: true },
            { icon: ShoppingBag, label: "Add Product", href: "/admin/add-product" },
            { icon: Settings, label: "Settings", href: "/admin/settings" },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all ${
                item.active ? "bg-[#d4af37] text-black" : "text-[#666] hover:text-white hover:bg-[#111]"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1a1a1a]">
          <Link href="/" className="flex items-center gap-2 text-xs text-[#444] hover:text-white transition-colors font-bold uppercase tracking-widest">
            <ChevronLeft size={14} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest">Orders Management</h1>
            <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{filteredOrders.length} orders found</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#111] border-b border-[#1a1a1a] px-8 py-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
            <input
              type="text"
              placeholder="Search by ID or Customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] text-white pl-9 pr-4 py-2 text-sm focus:border-[#d4af37] outline-none placeholder:text-[#444]"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Delivered"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === f ? "bg-[#d4af37] text-black border-[#d4af37]" : "border-[#222] text-[#666] hover:border-[#444] hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden shadow-2xl relative">
            {loading && (
              <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#d4af37]" />
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#111] border-b border-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold">
                  <th className="p-5 w-[100px]">Order ID</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Products</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Payment</th>
                  <th className="p-5 text-center">Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <ClipboardList size={48} className="mx-auto mb-4 text-[#222]" />
                      <p className="text-[#444] text-sm uppercase tracking-widest font-bold">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, idx) => (
                    <tr key={order._id} className={`border-b border-[#111] hover:bg-[#111] transition-colors ${idx % 2 === 0 ? "" : "bg-[#0c0c0c]"}`}>
                      <td className="p-5">
                        <span className="text-[10px] text-[#888] font-mono break-all">{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-semibold text-white">{order.customer}</p>
                        <p className="text-[10px] text-[#555]">{order.email}</p>
                        <p className="text-[10px] text-[#555] truncate max-w-[150px]">{order.address}</p>
                      </td>
                      <td className="p-5 text-xs text-[#888]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5 text-xs">
                        <span className="px-2 py-1 bg-[#1a1a1a] rounded text-[#ccc] border border-[#333]">
                           {order.productsCount} items
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-white font-bold font-serif">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="p-5">
                         {order.isPaid ? (
                            <span className="flex items-center gap-1 text-[10px] text-green-400 uppercase tracking-wider font-bold">
                              <CheckCircle2 size={12}/> Paid
                            </span>
                         ) : (
                            <span className="flex items-center gap-1 text-[10px] text-yellow-500 uppercase tracking-wider font-bold">
                              <Clock size={12}/> Unpaid
                            </span>
                         )}
                         <span className="text-[9px] text-[#555] mt-1 block uppercase">{order.paymentMethod}</span>
                      </td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => toggleDeliveryStatus(order._id, order.isDelivered)}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                            order.isDelivered
                              ? "bg-green-900/30 text-green-400 border-green-800 hover:bg-[#111] hover:text-[#888]"
                              : "bg-[#1a1a1a] text-[#888] border-[#333] hover:bg-green-900/30 hover:text-green-400 hover:border-green-800"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Mark Delivered"}
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
