"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { cart, cartTotal, user, clearCart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute final price
  const tax = Math.floor(cartTotal * 0.18);
  const totalAmount = cartTotal + tax;

  useEffect(() => {
    if (mounted && !user) {
      router.push("/auth?redirect=/checkout");
    }
  }, [user, mounted, router]);

  const handleRazorpay = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      // Get JWT token from state
      const token = user?.token;
      if (!token) {
        alert("Please login first to checkout!");
        router.push("/auth?redirect=/checkout");
        return;
      }

      // Generate Order on Server
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems: cart.map(c => ({ product: c.id, quantity: c.quantity, price: c.price })),
          totalPrice: totalAmount,
          shippingAddress: {
            firstName: user?.name.split(" ")[0] || "User",
            lastName: user?.name.split(" ")[1] || "Name",
            address: "123 Local",
            city: "Mumbai",
            postalCode: "400001"
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to initialize order");
        setLoading(false);
        return;
      }

      // Launch Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyId", 
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "GLOWMART INDIA",
        description: "Secure Checkout",
        order_id: data.razorpayOrder.id,
        handler: async function (response: any) {
          // Verify Signature on backend
          const verifyRes = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: data.orderId
            })
          });
          
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clearCart();
            alert("Payment Successful! Order Placed.");
            router.push("/track");
          } else {
            alert(verifyData.error || "Verification failed");
          }
        },
        theme: {
          color: "#d4af37" // Luxury Gold theme
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
    } catch (err) {
      alert("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Header />
      
      <div className="flex-1 max-w-[1920px] w-full mx-auto px-4 md:px-8 py-10">
        <h1 className="text-3xl font-serif font-bold tracking-widest uppercase mb-10 text-center border-b border-[#222] pb-6">
          Secure Checkout
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Shipping Details */}
          <div className="w-full md:w-2/3 bg-[#0a0a0a] border border-[#222] p-8 shadow-2xl relative overflow-hidden">
             {/* Decorative gold line */}
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
             
             <h2 className="text-lg font-serif font-bold tracking-widest uppercase mb-8 flex items-center gap-3">
               <Truck size={20} className="text-[#d4af37]" /> Shipping Details
             </h2>

             <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">First Name</label>
                   <input defaultValue={user?.name.split(" ")[0]} required className="bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Last Name</label>
                   <input defaultValue={user?.name.split(" ")[1] || ""} required className="bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none" />
                 </div>
               </div>

               <div className="flex flex-col gap-2">
                 <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Email</label>
                 <input disabled value={user?.email} required className="bg-transparent border border-[#333] p-3 text-[#666] outline-none" />
               </div>

               <div className="flex flex-col gap-2">
                 <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Street Address</label>
                 <input required className="bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">City</label>
                   <input required className="bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Postal Code</label>
                   <input required className="bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none" />
                 </div>
               </div>
             </form>
          </div>

          {/* Payment Section */}
          <div className="w-full md:w-1/3">
             <div className="bg-[#0a0a0a] border border-[#222] p-8 shadow-2xl sticky top-28">
                <h2 className="text-sm font-serif font-bold tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-[#222] pb-6">
                  <CreditCard size={18} className="text-[#d4af37]" /> Payment
                </h2>
                
                <p className="text-[#999] text-sm font-light leading-relaxed mb-6">
                  All transactions are secure and encrypted. GLOWMART INDIA uses Razorpay for premium payment handling.
                </p>

                <div className="flex items-center gap-4 mb-8 text-[#d4af37]">
                   <ShieldCheck size={28} />
                   <div className="flex flex-col">
                     <span className="text-xs uppercase tracking-[0.2em] font-bold">100% Secure</span>
                     <span className="text-[10px] text-[#666] tracking-widest">256-bit Encryption</span>
                   </div>
                </div>

                <div className="flex justify-between items-end border-t border-[#222] pt-6 mb-8">
                   <span className="uppercase tracking-[0.2em] font-bold text-xs text-[#888]">Total To Pay ({cart.length} items)</span>
                   <span className="text-2xl font-serif text-[#d4af37]">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <button 
                  onClick={handleRazorpay}
                  disabled={loading || cart.length === 0}
                  className="w-full bg-[#111] border border-[#d4af37] text-white py-4 flex items-center justify-center gap-3 uppercase tracking-[0.2em] font-bold text-xs hover:bg-[#d4af37] hover:text-black transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay via Razorpay"}
                </button>
             </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
