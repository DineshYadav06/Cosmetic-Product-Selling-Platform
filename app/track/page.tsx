"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Loader2,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Shield
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      // For demo, we'll try to fetch from real API if it exists, otherwise mock
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      
      if (res.ok) {
        setOrder(data);
      } else {
        setError("Order not found. Please check your ID and try again.");
      }
    } catch (err) {
      setError("Unable to retrieve order details at this time.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Order Placed", icon: ShoppingBag, completed: true, date: "Oct 24, 2026" },
    { label: "Processing", icon: Clock, completed: order?.isPaid || false, date: "Oct 25, 2026" },
    { label: "Shipped", icon: Truck, completed: order?.isShipped || false, date: "Oct 26, 2026" },
    { label: "Delivered", icon: CheckCircle2, completed: order?.isDelivered || false, date: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <div className="bg-[#0a0a0a] px-4 md:px-8 py-4 border-b border-[#1a1a1a]">
        <Link href="/" className="inline-flex items-center gap-2 text-[#666] hover:text-[#d4af37] transition-colors text-[10px] font-bold uppercase tracking-[0.3em]">
          <ChevronLeft size={14} /> Return to Shop
        </Link>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">Track Your Shipment</h1>
          <p className="text-[#666] text-sm uppercase tracking-widest font-bold">Enter your order ID to see real-time updates</p>
        </div>

        <form onSubmit={handleTrack} className="max-w-md mx-auto mb-20">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333] group-hover:text-[#d4af37] transition-colors" size={20} />
            <input
              type="text"
              placeholder="e.g. 672772..."
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all uppercase tracking-widest"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button 
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#d4af37] text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Track"}
            </button>
          </div>
          {error && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest mt-4 text-center">{error}</p>}
        </form>

        {order && (
          <div className="animate-fadeIn space-y-12">
            {/* Summary Card */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-[#111] pb-8 mb-8">
                <div>
                  <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mb-1">Tracking ID</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-serif font-bold text-[#d4af37]">{order._id.toUpperCase()}</h2>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(order._id);
                        alert("ID Copied to clipboard");
                      }}
                      className="text-[9px] uppercase tracking-widest text-[#666] hover:text-white border border-[#222] px-2 py-1 transition-all"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div>
                    <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mb-1">Status</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-white">
                      {order.isDelivered ? "Delivered" : "In Transit"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mb-1">Est. Arrival</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-white">Oct 30, 2026</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative pt-8">
                {/* Horizontal Progress Bar Background */}
                <div className="absolute top-[3.25rem] left-[12.5%] w-[75%] h-[2px] bg-[#111] hidden md:block" />
                {/* Active Progress Bar */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: order?.isDelivered ? "75%" : order?.isShipped ? "50%" : order?.isPaid ? "25%" : "0%" 
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute top-[3.25rem] left-[12.5%] h-[2px] bg-[#d4af37] hidden md:block shadow-[0_0_10px_#d4af37]"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {steps.map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-1000 
                        ${step.completed ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-110' : 'bg-[#111] text-[#333] border border-[#1a1a1a]'}`}>
                        <step.icon size={20} />
                      </div>
                      <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${step.completed ? 'text-white' : 'text-[#333]'}`}>{step.label}</h3>
                      <p className="text-[9px] text-[#444] uppercase tracking-widest">{step.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-6 flex items-center gap-2">
                    <MapPin size={14} /> Delivery Address
                  </h3>
                  <div className="text-sm text-[#888] space-y-1">
                    <p className="text-white font-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-6 flex items-center gap-2">
                    <Package size={14} /> Order Items
                  </h3>
                  <div className="space-y-4">
                    {order.products.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-[#888]">{p.name} <span className="text-[#444] ml-2">x{p.quantity}</span></span>
                        <span className="font-bold text-white">₹{p.price}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-[#111] flex justify-between items-center">
                      <span className="uppercase tracking-widest text-[10px] font-bold text-[#444]">Total Paid</span>
                      <span className="text-[#d4af37] font-bold">₹{order.totalPrice}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {!order && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 opacity-30">
             {[
               { icon: Shield, title: "Secure Tracking" },
               { icon: Truck, title: "Real-time Fleet" },
               { icon: CheckCircle2, title: "Verified Delivery" }
             ].map((f, i) => (
               <div key={i} className="text-center p-8 border border-[#1a1a1a]">
                 <f.icon className="mx-auto mb-4" size={24} />
                 <p className="text-[10px] font-bold uppercase tracking-widest">{f.title}</p>
               </div>
             ))}
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
