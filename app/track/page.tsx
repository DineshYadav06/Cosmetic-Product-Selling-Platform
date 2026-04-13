"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, RotateCcw } from "lucide-react";
import { useStore } from "../../lib/context/StoreContext";

const MOCK_ORDER = {
  id: "ORD-GWM-2024001",
  date: "March 25, 2026",
  estimatedDelivery: "April 1, 2026",
  status: "shipped",
  customer: "Priya Sharma",
  address: "123, Rose Apartments, Bandra West, Mumbai, 400050",
  items: [
    {
      brand: "Rare Beauty",
      name: "Soft Pinch Liquid Blush - Joy",
      qty: 1,
      price: 1850,
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=200",
    },
    {
      brand: "Fenty Beauty",
      name: "Pro Filt'r Soft Matte Foundation",
      qty: 1,
      price: 3200,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=200",
    },
  ],
  total: 5050,
  timeline: [
    { label: "Order Placed", desc: "Your order has been confirmed", date: "Mar 25, 10:30 AM", done: true },
    { label: "Processing", desc: "Items are being packed & quality-checked", date: "Mar 26, 2:00 PM", done: true },
    { label: "Shipped", desc: "Your order is on its way via BlueDart", date: "Mar 27, 9:15 AM", done: true },
    { label: "Out for Delivery", desc: "Expected delivery between 10 AM - 6 PM", date: "April 1", done: false },
    { label: "Delivered", desc: "Package delivered to your address", date: "—", done: false },
  ],
};

export default function TrackOrderPage() {
  const { user } = useStore();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<typeof MOCK_ORDER | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If user is logged in, show their recent order automatically
    if (user) {
      setOrder({...MOCK_ORDER, customer: user.name});
    }
  }, [user]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    setTimeout(() => {
      if (orderId.trim().toLowerCase() === "ord-gwm-2024001" || orderId.trim() !== "") {
        setOrder(MOCK_ORDER);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 1200);
  };

  const completedSteps = order ? order.timeline.filter(t => t.done).length : 0;
  const progress = order ? Math.round((completedSteps / order.timeline.length) * 100) : 0;

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Header />

      <div className="max-w-[900px] mx-auto w-full px-4 md:px-8 py-12 flex-1">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#0a0a0a] border border-[#222] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={28} className="text-[#d4af37]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-widest uppercase mb-3">
            {user ? "Your Orders & Tracking" : "Track Your Order"}
          </h1>
          <p className="text-[#555] text-sm uppercase tracking-widest">
            {user ? "View your recent orders and live status" : "Enter your Order ID to see live status"}
          </p>
        </div>

        {/* Search Form (Only show if no active order is pre-loaded or user wants to search) */}
        {!user && (
          <form onSubmit={handleTrack} className="relative bg-[#0a0a0a] border border-[#222] p-8 mb-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[#888] font-bold mb-3">Order ID</label>
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={18} />
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-GWM-2024001"
                  className="w-full bg-transparent border border-[#333] pl-12 pr-4 py-4 text-white focus:border-[#d4af37] outline-none placeholder:text-[#444] text-sm tracking-wider"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#d4af37] text-black px-8 py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
              >
                {loading ? (
                  <><RotateCcw size={16} className="animate-spin" /> Tracking...</>
                ) : (
                  <>Track Order <ChevronRight size={16} /></>
                )}
              </button>
            </div>
            <p className="text-[#444] text-xs mt-4 uppercase tracking-widest">
              💡 Tip: Try entering any order ID to see a demo
            </p>
          </form>
        )}

        {/* Not Found */}
        {notFound && (
          <div className="text-center bg-[#0a0a0a] border border-red-900/50 p-10 mb-10">
            <p className="text-red-400 font-bold uppercase tracking-widest mb-2">Order Not Found</p>
            <p className="text-[#555] text-sm">Please check your Order ID and try again.</p>
          </div>
        )}

        {/* Order Tracking Result */}
        {order && (
          <div className="space-y-6 animate-fadeIn pb-10">
            {/* Order Header */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-mono font-bold text-lg">{order.id}</p>
                  <p className="text-[#555] text-xs mt-1">Placed on {order.date}</p>
                </div>
                <div className="text-right">
                  <span className="bg-blue-900/30 text-blue-400 border border-blue-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                    {order.status.toUpperCase()}
                  </span>
                  <p className="text-[#555] text-xs mt-2 flex items-center gap-1 justify-end">
                    <Truck size={12} /> Est. delivery: {order.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#555] font-bold mb-3">
                <span>Progress</span>
                <span className="text-[#d4af37]">{completedSteps} of {order.timeline.length} steps</span>
              </div>
              <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#f5e6c8] rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 md:p-8">
              <h2 className="font-serif font-bold tracking-widest uppercase text-sm mb-8 flex items-center gap-3">
                <Clock size={16} className="text-[#d4af37]" /> Order Timeline
              </h2>
              <div className="space-y-0">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-4 md:gap-6 relative">
                    {/* Line connector */}
                    {idx < order.timeline.length - 1 && (
                      <div className={`absolute left-[19px] top-10 w-[2px] h-[calc(100%-8px)] ${step.done ? "bg-[#d4af37]" : "bg-[#1a1a1a]"}`} />
                    )}
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                      step.done
                        ? "bg-[#d4af37] border-[#d4af37]"
                        : "bg-[#0d0d0d] border-[#222]"
                    }`}>
                      {step.done ? (
                        <CheckCircle2 size={18} className="text-black" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#333]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-8 flex-1 ${idx === order.timeline.length - 1 ? "pb-0" : ""}`}>
                      <p className={`font-bold text-sm uppercase tracking-wider ${step.done ? "text-white" : "text-[#333]"}`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-1 ${step.done ? "text-[#888]" : "text-[#333]"}`}>{step.desc}</p>
                      <p className={`text-[10px] mt-1 font-bold tracking-widest ${step.done ? "text-[#d4af37]" : "text-[#222]"}`}>
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items + Address */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                <h2 className="font-serif font-bold tracking-widest uppercase text-sm mb-6 border-b border-[#1a1a1a] pb-4">
                  Items Ordered
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-16 h-16 sm:w-14 sm:h-14 bg-[#111] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0 p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider">{item.brand}</p>
                        <p className="text-xs text-[#888] truncate">{item.name}</p>
                        <p className="text-xs text-[#555] mt-0.5">Qty: {item.qty}</p>
                      </div>
                      <p className="font-serif font-bold text-sm flex-shrink-0 sm:ml-auto">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#1a1a1a]">
                  <span className="text-[10px] uppercase tracking-widest text-[#555] font-bold">Order Total</span>
                  <span className="text-xl font-serif text-[#d4af37]">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                <h2 className="font-serif font-bold tracking-widest uppercase text-sm mb-6 border-b border-[#1a1a1a] pb-4">
                  Delivery Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#555] font-bold mb-1">Recipient</p>
                    <p className="text-sm font-semibold">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#555] font-bold mb-1">Address</p>
                    <p className="text-sm text-[#888] leading-relaxed flex gap-2">
                      <MapPin size={14} className="text-[#d4af37] mt-0.5 flex-shrink-0" />
                      {order.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#555] font-bold mb-1">Courier</p>
                    <p className="text-sm text-[#888]">BlueDart Express • <span className="text-[#d4af37] font-bold">BD24601887</span></p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1a1a1a] space-y-3">
                  <button className="w-full border border-[#333] text-[#888] py-3 text-xs font-bold uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-all">
                    Need Help?
                  </button>
                  <button className="w-full border border-[#333] text-[#888] py-3 text-xs font-bold uppercase tracking-widest hover:border-red-700 hover:text-red-400 transition-all">
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
