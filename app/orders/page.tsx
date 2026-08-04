"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/lib/context/StoreContext";
import { useEffect, useState } from "react";
import { Package, ChevronRight, ChevronLeft, Loader2, Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserOrdersPage() {
  const { user, token } = useStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user && token) {
      fetchOrders();
    } else if (mounted && !user) {
        router.push('/auth');
    }
  }, [user, token, mounted]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Header />

      <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-6 flex-1">
        {/* Navigation */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/account')}
            className="flex items-center gap-2 text-[#555] hover:text-[#d4af37] transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Back to Account</span>
          </button>
        </div>

        {/* Title Section */}
        <div className="flex items-center gap-4 mb-10 border-b border-[#1a1a1a] pb-8">
          <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center rounded-full text-[#d4af37]">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-widest uppercase">Order History</h1>
            <p className="text-[#555] text-[10px] uppercase tracking-[0.2em] mt-1">Manage and track your luxury purchases</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#d4af37] mb-4" size={40} />
            <p className="text-[#555] text-xs uppercase tracking-widest">Retrieving your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={48} className="text-[#1a1a1a] mb-6" />
            <h2 className="text-xl font-serif font-bold tracking-widest mb-2 uppercase">No Orders Found</h2>
            <p className="text-[#555] text-sm mb-8 max-w-md">You haven&apos;t placed any orders yet. Discover our premium collection and start your journey.</p>
            <Link href="/collection" className="bg-[#d4af37] text-black px-10 py-4 uppercase font-bold tracking-widest text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] transition-all overflow-hidden group">
                {/* Order Header */}
                <div className="p-6 border-b border-[#1a1a1a] flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-[#0d0d0d] to-[#0a0a0a]">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[#555] text-[9px] uppercase font-bold tracking-widest mb-1">Order Date</p>
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Calendar size={12} className="text-[#d4af37]" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#555] text-[9px] uppercase font-bold tracking-widest mb-1">Order ID</p>
                      <p className="text-xs font-mono text-white/80">#{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[#555] text-[9px] uppercase font-bold tracking-widest mb-1">Total Amount</p>
                      <p className="text-sm font-serif font-bold text-[#d4af37]">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <span className={`text-[9px] uppercase font-bold tracking-[0.2em] px-3 py-1 border rounded-full
                        ${order.isDelivered ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          order.isPaid ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Payment Pending'}
                     </span>
                     <Link href={`/account/orders/${order.id}`} className="text-[#d4af37] text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Details <ChevronRight size={14} />
                     </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    {order.products.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-[#111] border border-[#1a1a1a] p-2 flex-shrink-0 relative">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[#d4af37] text-[8px] uppercase font-bold tracking-[0.2em] mb-0.5">{item.brand}</p>
                          <h4 className="text-xs font-light text-white/90 line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-[#555] mt-1">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-serif font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-16 p-8 border border-dashed border-[#1a1a1a] rounded-lg text-center bg-[#050505]">
          <p className="text-[#555] text-xs uppercase tracking-widest font-bold mb-4">Need help with an order?</p>
          <div className="flex flex-wrap justify-center gap-6">
             <Link href="/support" className="text-[10px] uppercase font-bold tracking-widest hover:text-[#d4af37] transition-colors">Customer Service</Link>
             <Link href="/shipping-policy" className="text-[10px] uppercase font-bold tracking-widest hover:text-[#d4af37] transition-colors">Shipping Policy</Link>
             <Link href="/returns" className="text-[10px] uppercase font-bold tracking-widest hover:text-[#d4af37] transition-colors">Returns & Exchanges</Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
