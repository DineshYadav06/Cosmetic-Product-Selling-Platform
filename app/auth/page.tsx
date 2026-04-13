"use client";

import { useState, Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../../lib/context/StoreContext";
import { Mail, Phone, ArrowRight } from "lucide-react";

function AuthForm() {
  const [authMode, setAuthMode] = useState<"login" | "register" | "verify">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { login } = useStore();
  
  const [form, setForm] = useState({ name: "", emailOrPhone: "", password: "", otp: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (authMode === "verify") {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Send as email even if phone for backend compat right now
          body: JSON.stringify({ email: form.emailOrPhone, otp: form.otp })
        });
        const data = await res.json();
        if (res.ok) {
          alert("Phone/Email Verified! You can now log in.");
          setAuthMode("login");
        } else {
          alert(data.error || "Verification failed");
        }
      } catch (err) {
        alert("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Treat as email for the existing legacy backend endpoint
    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.emailOrPhone, password: form.password })
      });
      
      const data = await res.json();
      if (res.ok) {
        if (authMode === "login") {
          login({ name: form.emailOrPhone.split('@')[0] || "User", email: form.emailOrPhone, token: data.token });
          router.push(redirectTo);
        } else {
          alert("Registration successful. Please check for the OTP.");
          setAuthMode("verify");
        }
      } else {
        if (data.requiresVerification) {
           alert(data.error);
           setAuthMode("verify");
        } else {
           alert(data.error || "Authentication failed");
        }
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // For demo purposes, we will mock social login
    alert(`${provider} Login integration is coming soon!`);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-[420px] bg-[#0a0a0a] border border-[#222] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        
        <h1 className="text-2xl font-serif font-bold text-center mb-2 tracking-widest text-[#d4af37]">
          {authMode === "login" ? "SIGN IN" : authMode === "register" ? "CREATE ACCOUNT" : "VERIFY ACCOUNT"}
        </h1>
        <p className="text-center text-[#666] text-xs uppercase tracking-widest mb-10">
          {authMode === "login" ? "Access your GLOWMART Profile" : authMode === "register" ? "Join the luxury club" : "Enter the 6-digit OTP sent to you"}
        </p>

        {authMode !== "verify" && (
          <>
            {/* Social Logins */}
            <div className="flex flex-col gap-3 mb-8">
              <button type="button" onClick={() => handleSocialLogin("Google")} className="w-full border border-[#333] bg-[#111] hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3 py-3 text-xs font-bold uppercase tracking-widest">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </button>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => handleSocialLogin("Apple")} className="flex-1 border border-[#333] bg-[#111] hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest">
                  <svg className="w-4 h-4" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  Apple
                </button>
                <button type="button" onClick={() => handleSocialLogin("Facebook")} className="flex-1 border border-[#333] bg-[#111] hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-colors flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest">
                  <svg className="w-4 h-4" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                  Facebook
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-[#222]"></div>
              <span className="text-[#444] text-[10px] uppercase font-bold tracking-widest">Or Continue With</span>
              <div className="flex-1 h-[1px] bg-[#222]"></div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {authMode === "verify" ? (
             <>
               <div className="flex flex-col gap-2 mb-2">
                 <label className="text-xs uppercase tracking-[0.2em] text-[#888] font-bold">Email / Phone</label>
                 <input 
                   type="text" 
                   required 
                   disabled
                   value={form.emailOrPhone}
                   className="bg-[#0a0a0a] border border-[#333] p-3 text-[#555] focus:border-[#d4af37] outline-none transition-colors"
                 />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-xs uppercase tracking-[0.2em] text-[#888] font-bold">6-Digit OTP</label>
                 <input 
                   type="text" 
                   required 
                   maxLength={6}
                   value={form.otp}
                   className="bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-center text-2xl tracking-[0.5em]"
                   onChange={e => setForm({...form, otp: e.target.value})}
                 />
               </div>
             </>
          ) : (
             <>
              {authMode === "register" && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="First and last name"
                    className="bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-sm"
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Email or mobile phone number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-sm"
                    onChange={e => setForm({...form, emailOrPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Password</label>
                  {authMode === "login" && <span className="text-[9px] text-[#666] hover:text-[#d4af37] cursor-pointer tracking-widest uppercase">Forgot Password?</span>}
                </div>
                <input 
                  type="password" 
                  required 
                  placeholder={authMode === "register" ? "At least 6 characters" : ""}
                  className="bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-sm"
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
             </>
          )}

          <button 
            disabled={loading}
            className="mt-4 bg-[#d4af37] text-black py-3.5 uppercase tracking-[0.2em] font-bold text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : (authMode === "login" ? "Sign In" : authMode === "register" ? "Register" : "Verify OTP")}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        {authMode !== "verify" && (
          <div className="mt-8 pt-6 border-t border-[#222]">
            <p className="text-center text-[#888] text-[10px] leading-relaxed mb-4">
              By continuing, you agree to GLOWMART's <span className="text-white underline cursor-pointer hover:text-[#d4af37]">Conditions of Use</span> and <span className="text-white underline cursor-pointer hover:text-[#d4af37]">Privacy Notice</span>.
            </p>
            <div className="text-center text-xs text-[#666]">
              {authMode === "login" ? "New to GLOWMART? " : "Already have an account? "}
              <button 
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")} 
                className="text-white underline uppercase tracking-widest font-bold hover:text-[#d4af37] transition-colors mt-2"
              >
                {authMode === "login" ? "Create your GLOWMART account" : "Sign in here"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div></div>}>
        <AuthForm />
      </Suspense>
      <Footer />
    </main>
  );
}
