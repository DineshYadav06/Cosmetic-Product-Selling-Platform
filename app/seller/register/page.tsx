"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Store, User, Mail, Phone, Lock, ArrowRight, CheckCircle2, 
  ShieldCheck, Sparkles, Building2, CreditCard, Landmark, 
  MapPin, Briefcase, ChevronLeft, ChevronRight 
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/lib/context/StoreContext";

export default function SellerRegister() {
  const router = useRouter();
  const { user, login } = useStore();
  const [step, setStep] = useState(1);
  const [isUpgrade, setIsUpgrade] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Account
    name: "",
    email: "",
    phone: "",
    storeName: "",
    password: "",
    confirmPassword: "",
    // Step 2: Business
    businessType: "Individual",
    gstNumber: "",
    panNumber: "",
    businessAddress: "",
    // Step 3: Bank
    bankAccountHolder: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankName: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if user is already logged in to skip Step 1
  useEffect(() => {
    if (user) {
      if (user.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        setIsUpgrade(true);
        setStep(2); // Skip Step 1 for logged-in users
        setFormData(prev => ({
          ...prev,
          name: user.name,
          email: user.email
        }));
      }
    }
  }, [user, router]);

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.storeName || !formData.password) {
        setError("Please fill all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    if (isUpgrade && step === 2) return; // Can't go back to Step 1 if upgrading
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    setLoading(true);
    try {
      const endpoint = isUpgrade ? "/api/seller/upgrade" : "/api/seller/register";
      const headers: any = { "Content-Type": "application/json" };
      if (isUpgrade && user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        if (isUpgrade) {
          // Update context with new role
          login({ ...user!, role: 'seller' });
          setSuccess(true);
          setTimeout(() => router.push("/seller/dashboard"), 5000);
        } else {
          setSuccess(true);
          setTimeout(() => router.push("/auth"), 5000);
        }
      } else {
        setError(data.error || "Action failed");
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
          <div className="max-w-md w-full bg-[#0a0a0a] border border-[#d4af37]/30 p-10 text-center space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-[#d4af37]/30">
              <CheckCircle2 className="text-[#d4af37]" size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-widest uppercase text-gradient">
              {isUpgrade ? "Account Upgraded" : "Application Received"}
            </h2>
            <p className="text-[#888] text-sm uppercase tracking-widest leading-loose">
              {isUpgrade 
                ? `Congratulations! Your account has been upgraded. Welcome to the elite circle of merchants.`
                : `Welcome to the elite circle. Your application for ${formData.storeName} is being processed. Please check your email.`
              }
            </p>
            <div className="pt-4">
              <div className="h-1 w-full bg-[#111] overflow-hidden rounded-full">
                <div className="h-full bg-[#d4af37] animate-progress" />
              </div>
              <p className="text-[10px] text-[#444] mt-3 uppercase tracking-[0.3em]">
                Redirecting to {isUpgrade ? "Seller Dashboard" : "Verification Gateway"}...
              </p>
            </div>
          </div>
        </main>
        <Footer />
        <style jsx>{`
          .text-gradient {
            background: linear-gradient(135deg, #fff 0%, #d4af37 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          @keyframes progress {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-progress {
            animation: progress 5s linear forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 grid lg:grid-cols-2 overflow-hidden">
        {/* Left: Luxury Branding */}
        <div className="hidden lg:flex flex-col justify-center p-20 bg-[url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          <div className="relative z-10 space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full backdrop-blur-md">
              <Sparkles size={18} className="text-[#d4af37] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">The Merchant Elite</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl font-serif font-bold tracking-tight leading-[1.1]">
                {isUpgrade ? "Level Up" : "Elevate"} <br /> 
                Your <span className="italic text-[#d4af37]">Legacy</span>
              </h1>
              <p className="text-[#aaa] text-xl max-w-lg leading-relaxed font-light">
                {isUpgrade 
                  ? "Upgrade your existing account to unlock the full potential of GLOWMART's merchant ecosystem."
                  : "Join the world's most sophisticated marketplace for high-end cosmetic artisans."}
              </p>
            </div>
            
            <div className="grid gap-8 pt-10">
              {[
                { icon: ShieldCheck, title: "Global Payouts", desc: "Automated settlements in 20+ currencies with institutional security." },
                { icon: Store, title: "Digital Boutique", desc: "Custom-curated storefronts that mirror your brand's luxury identity." },
                { icon: Sparkles, title: "Precision Analytics", desc: "AI-driven insights to scale your reach to the top 1% of global buyers." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0 group-hover:border-[#d4af37]/50 transition-all duration-500">
                    <item.icon size={24} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-[0.2em] text-sm text-white group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
                    <p className="text-sm text-[#666] mt-1 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Multi-step Form */}
        <div className="flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-[#050505]">
          <div className="w-full max-w-lg space-y-12">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between w-full relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#1a1a1a] -translate-y-1/2 z-0" />
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border ${
                    step >= s ? "bg-[#d4af37] text-black border-[#d4af37]" : "bg-black text-[#444] border-[#1a1a1a]"
                  } ${step === s ? "ring-4 ring-[#d4af37]/20 scale-110" : ""}`}
                >
                  {step > s ? <CheckCircle2 size={18} /> : s}
                </div>
              ))}
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-serif font-bold tracking-widest uppercase">
                {step === 1 && "Account Access"}
                {step === 2 && "Business Identity"}
                {step === 3 && "Financial Gateway"}
              </h2>
              <p className="text-[#555] text-[10px] uppercase tracking-[0.4em] mt-3">
                {isUpgrade ? `Step ${step} of 3 — Upgrade Current Account` : `Step ${step} of 3 — Secure Registration`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-900/10 border border-red-900/30 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
                  {error}
                </div>
              )}

              {/* STEP 1: Account Information */}
              {step === 1 && !isUpgrade && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Legal Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="text"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="Dinesh Yadav"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="email"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="merchant@glowmart.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="tel"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="+91 98XXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Store Brand Name</label>
                      <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="text"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="Aura Cosmetics"
                          value={formData.storeName}
                          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Security Key</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="password"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Confirm Key</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="password"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Business Identity (Visible if Step 2 OR Upgrade) */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {isUpgrade && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Contact Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                          <input
                            required
                            type="tel"
                            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all"
                            placeholder="+91 98XXX XXXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Store Brand Name</label>
                        <div className="relative">
                          <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                          <input
                            required
                            type="text"
                            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all"
                            placeholder="Aura Cosmetics"
                            value={formData.storeName}
                            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Business Structure</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                      <select
                        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all appearance-none"
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      >
                        <option value="Individual">Individual / Proprietorship</option>
                        <option value="Partnership">Partnership Firm</option>
                        <option value="Private Limited">Private Limited Company</option>
                        <option value="LLP">Limited Liability Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">GST Identification (GSTIN)</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          type="text"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="22AAAAA0000A1Z5"
                          value={formData.gstNumber}
                          onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Permanent Account (PAN)</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="text"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="ABCDE1234F"
                          value={formData.panNumber}
                          onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Registered Business Office</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-[#333]" size={16} />
                      <textarea
                        required
                        rows={3}
                        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222] resize-none"
                        placeholder="Floor, Building, Street, City, State, PIN"
                        value={formData.businessAddress}
                        onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Financial Gateway */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Account Holder Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                      <input
                        required
                        type="text"
                        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                        placeholder="Dinesh Yadav"
                        value={formData.bankAccountHolder}
                        onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Account Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                      <input
                        required
                        type="text"
                        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={formData.bankAccountNumber}
                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">IFSC Code</label>
                      <div className="relative">
                        <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="text"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="HDFC0001234"
                          value={formData.ifscCode}
                          onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#666]">Bank Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
                        <input
                          required
                          type="text"
                          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 pl-12 text-sm focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#222]"
                          placeholder="HDFC Bank"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {step > 1 && (!isUpgrade || step > 2) && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-transparent border border-[#333] text-white p-5 font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] bg-[#d4af37] text-black p-5 font-bold uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2 group"
                  >
                    Continue Journey <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    disabled={loading}
                    type="submit"
                    className="flex-[2] bg-[#d4af37] text-black p-5 font-bold uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? "Authenticating..." : (isUpgrade ? "Upgrade Account" : "Establish Empire")}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              <p className="text-[9px] text-[#444] text-center uppercase tracking-[0.3em] mt-10 leading-loose">
                By establishing your store, you agree to GLOWMART's <Link href="/terms" className="text-[#666] hover:text-[#d4af37]">Imperial Terms</Link> and <Link href="/policy" className="text-[#666] hover:text-[#d4af37]">Merchant Codes</Link>.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
