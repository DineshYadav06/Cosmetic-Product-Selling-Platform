"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, User, Mail, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SellerRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/auth"), 3000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-[#d4af37]/30 p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-[#d4af37]" size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-widest uppercase">Welcome, Creator</h2>
            <p className="text-[#666] text-sm uppercase tracking-widest leading-loose">
              Your application for <span className="text-white font-bold">{formData.storeName}</span> has been received. 
              Please verify your email to access your dashboard.
            </p>
            <div className="pt-4">
              <div className="h-1 w-full bg-[#111] overflow-hidden">
                <div className="h-full bg-[#d4af37] animate-progress" />
              </div>
              <p className="text-[10px] text-[#444] mt-2 uppercase tracking-[0.2em]">Redirecting to verification...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left: Branding & Value Prop */}
        <div className="hidden lg:flex flex-col justify-center p-20 bg-gradient-to-br from-[#0d0d0d] to-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4af37] blur-[120px] rounded-full" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full">
              <Sparkles size={16} className="text-[#d4af37]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">Join the Elite</span>
            </div>
            
            <h1 className="text-6xl font-serif font-bold tracking-tight leading-tight">
              Turn your Passion <br /> 
              into a <span className="text-[#d4af37]">Luxury Brand</span>
            </h1>
            
            <p className="text-[#888] text-lg max-w-lg leading-relaxed">
              GLOWMART provides the world's most sophisticated platform for independent cosmetic creators. 
              Reach millions of luxury seekers worldwide.
            </p>
            
            <div className="space-y-6 pt-10">
              {[
                { icon: ShieldCheck, title: "Secure Payments", desc: "Global payouts in your local currency." },
                { icon: Store, title: "Premium Storefront", desc: "Fully customizable high-end digital boutique." },
                { icon: Sparkles, title: "AI Marketing", desc: "Automated recommendations for your products." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-sm bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest text-sm text-white">{item.title}</h3>
                    <p className="text-xs text-[#555] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="flex items-center justify-center p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-serif font-bold tracking-widest uppercase">Start Your Store</h2>
              <p className="text-[#555] text-xs uppercase tracking-[0.2em] mt-2">Become a GLOWMART Partner</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-500 text-xs font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#666]">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                    <input
                      required
                      type="text"
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="Dinesh Yadav"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#666]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                    <input
                      required
                      type="email"
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="dinesh@glowmart.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#666]">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                    <input
                      required
                      type="tel"
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="+91 95552XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#666]">Store Name</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                    <input
                      required
                      type="text"
                      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="Luxe Bloom"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#666]">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                  <input
                    required
                    type="password"
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#666]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                  <input
                    required
                    type="password"
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-[#d4af37] text-black p-4 font-bold uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? "Processing..." : "Establish Your Store"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-[#444] text-center uppercase tracking-widest mt-6">
                By registering, you agree to our <Link href="/terms" className="text-[#666] hover:text-[#d4af37]">Terms of Service</Link> and <Link href="/policy" className="text-[#666] hover:text-[#d4af37]">Luxury Partner Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      
      <style jsx>{`
        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  );
}
