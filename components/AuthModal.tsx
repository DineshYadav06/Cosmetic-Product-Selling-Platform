"use client";

import { useState } from "react";
import { X, ArrowRight, UserCircle2 } from "lucide-react";
import { useStore } from "../lib/context/StoreContext";

type AuthMode = "login" | "register" | "otp_send" | "otp_verify";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  if (!isOpen) return null;

  const FASTAPI_URL = "http://localhost:8000";

  const handleApiCall = async (endpoint: string, payload: any) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${FASTAPI_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication Failed");
      return data;
    } catch (err: any) {
      setErrorMsg(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === "register") {
      const data = await handleApiCall("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (data) {
        setAuthMode("login");
        setErrorMsg("Account created! Please sign in.");
      }
    } else if (authMode === "login") {
      const data = await handleApiCall("/auth/login", {
        email: form.email,
        password: form.password,
      });
      if (data && data.access_token) {
        login({ name: form.email.split("@")[0], email: form.email, token: data.access_token });
        onClose();
      }
    } else if (authMode === "otp_send") {
      const data = await handleApiCall("/auth/send-otp", { email: form.email });
      if (data) setAuthMode("otp_verify");
    } else if (authMode === "otp_verify") {
      const data = await handleApiCall("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      if (data && data.access_token) {
        login({ name: form.email.split("@")[0], email: form.email, token: data.access_token });
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-out Panel */}
      <div className="relative w-[340px] sm:w-[400px] h-full bg-[#0a0a0a] border-l border-[#222] shadow-2xl flex flex-col overflow-y-auto animate-slideRight">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222]">
          <h2 className="text-xl font-serif text-[#d4af37] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
            <UserCircle2 size={24} /> 
            {authMode === "login" ? "Sign In" : authMode === "register" ? "Create Account" : "Secure OTP"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 flex flex-col gap-8">
          <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest border-l-2 border-[#d4af37] pl-3">
            {authMode === "login" && "Access your premium GLOWMART profile"}
            {authMode === "register" && "Join the luxury cosmetics club"}
            {authMode === "otp_send" && "We will send a 6-digit code to your email"}
            {authMode === "otp_verify" && "Enter the 6-digit OTP sent to your email (Check terminal)"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Conditional Input Rendering based on AuthMode */}
            {authMode === "register" && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Full Name</label>
                <input 
                  type="text" required 
                  className="bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-sm"
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
            )}

            {authMode !== "otp_verify" && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Email Address</label>
                <input 
                  type="email" required 
                  disabled={authMode === "otp_send" && loading}
                  className="bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-sm disabled:opacity-50"
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
            )}

            {(authMode === "login" || authMode === "register") && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">Password</label>
                </div>
                <input 
                  type="password" required 
                  className="bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-sm"
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
            )}

            {authMode === "otp_verify" && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold">6-Digit Code</label>
                <input 
                  type="text" required maxLength={6}
                  className="bg-transparent border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none transition-colors text-center text-2xl tracking-[0.5em]"
                  onChange={e => setForm({...form, otp: e.target.value})}
                />
              </div>
            )}

            {errorMsg && <div className="text-red-400 text-xs font-semibold">{errorMsg}</div>}

            <button 
              disabled={loading}
              className="mt-2 bg-[#d4af37] text-black py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : authMode === "login" ? "Sign In" : authMode === "register" ? "Create Account" : authMode === "otp_send" ? "Request OTP" : "Verify & Login"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          {/* Toggle Alternate Methods */}
          <div className="mt-4 pt-6 border-t border-[#222]">
            <div className="flex flex-col gap-3 text-center text-[10px] tracking-widest text-[#888] uppercase font-bold">
              
              {authMode === "login" && (
                <>
                  <button onClick={() => { setAuthMode("otp_send"); setErrorMsg(""); }} className="hover:text-[#d4af37] transition-colors">
                    Log in with OTP instead
                  </button>
                  <button onClick={() => { setAuthMode("register"); setErrorMsg(""); }} className="hover:text-[#d4af37] py-2 transition-colors">
                    New User? Create an Account
                  </button>
                </>
              )}

              {authMode === "register" && (
                <button onClick={() => { setAuthMode("login"); setErrorMsg(""); }} className="hover:text-[#d4af37] transition-colors">
                  Already have an account? Sign in
                </button>
              )}

              {(authMode === "otp_send" || authMode === "otp_verify") && (
                <button onClick={() => { setAuthMode("login"); setErrorMsg(""); }} className="hover:text-[#d4af37] transition-colors">
                  Back to Password Login
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
