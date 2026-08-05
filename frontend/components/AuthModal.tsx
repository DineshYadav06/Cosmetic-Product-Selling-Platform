"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, UserCircle2, MapPin, Mail, Lock, Phone, Calendar, User, ShieldCheck, Fingerprint, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../lib/context/StoreContext";

type AuthMode = "login" | "register" | "otp_send" | "otp_verify";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { login } = useStore();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    phoneNumber: "",
    location: "",
    email: "",
    password: "",
    otp: "",
  });

  const [timer, setTimer] = useState(120);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authMode === "otp_verify" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, timer]);

  // Framer Motion Variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden: { x: "100%", opacity: 0.5 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const handleApiCall = async (endpoint: string, payload: any) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await fetch(`/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication Failed");
      return data;
    } catch (err: any) {
      setErrorMsg(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    setErrorMsg("");
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const cityArea = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown Area";
          const stateArea = data.address.state || "";
          setForm({ ...form, location: `${cityArea}, ${stateArea}` });
        } catch (err) {
          setErrorMsg("Failed to auto-detect location. Please enter manually.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setErrorMsg("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const data = await handleApiCall("/auth/send-otp", { email: form.email });
    if (data) {
      setAuthMode("otp_verify");
      setTimer(120);
      setSuccessMsg(data.message || "OTP sent successfully!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === "register") {
      if (registerStep === 1) {
        // Validate Step 1 before moving to Step 2
        if (!form.name || !form.email || !form.password) {
           setErrorMsg("Please fill all fields to continue.");
           return;
        }
        setRegisterStep(2);
        return;
      }

      const data = await handleApiCall("/auth/register", {
        name: form.name,
        dob: form.dob,
        phoneNumber: form.phoneNumber,
        location: form.location,
        email: form.email,
        password: form.password,
      });
      if (data) {
        setAuthMode("otp_verify");
        setRegisterStep(1); // reset for future
        setTimer(120);
        setSuccessMsg("Account registered! We've sent an OTP to your email.");
      }
    } else if (authMode === "login") {
      const data = await handleApiCall("/auth/login", {
        email: form.email,
        password: form.password,
      });
      
      if (data && data.requiresVerification) {
        setAuthMode("otp_send");
        setErrorMsg(data.error);
        return;
      }

      if (data && data.token) {
        login({ id: data.user?.id, name: data.user?.name || form.email.split("@")[0], email: form.email, role: data.user?.role || 'user', token: data.token });
        onClose();
      }
    } else if (authMode === "otp_send") {
      await handleSendOTP();
    } else if (authMode === "otp_verify") {
      const data = await handleApiCall("/auth/verify", {
        email: form.email,
        otp: form.otp,
      });
      if (data && data.token) {
        login({ id: data.user?.id, name: data.user?.name || form.email.split("@")[0], email: form.email, role: data.user?.role || 'user', token: data.token });
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div 
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full sm:w-[500px] h-full bg-[#050505] border-l border-[#222]/50 shadow-[0_0_50px_rgba(212,175,55,0.05)] flex flex-col overflow-x-hidden premium-scrollbar"
            style={{
              backgroundImage: "radial-gradient(ellipse at top right, rgba(212,175,55,0.05) 0%, transparent 60%)"
            }}
          >
            <div className="flex items-center justify-between p-8 border-b border-white/5 bg-gradient-to-b from-[#111] to-transparent sticky top-0 z-10 backdrop-blur-xl">
              <h2 className="text-xl font-serif text-[#d4af37] tracking-[0.2em] uppercase font-bold flex items-center gap-3 drop-shadow-md">
                {authMode === "login" ? <Fingerprint size={24} className="opacity-80" /> : authMode === "register" ? <UserCircle2 size={24} className="opacity-80" /> : <ShieldCheck size={24} className="opacity-80" />} 
                <span style={{
                  background: "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {authMode === "login" ? "Sign In" : authMode === "register" ? "Create Account" : "Secure Auth"}
                </span>
              </h2>
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-[#a0a0a0] leading-relaxed uppercase tracking-[0.15em] border-l-[3px] border-[#d4af37] pl-4 font-medium"
              >
                {authMode === "login" && "Access your premium GLOWMART profile"}
                {authMode === "register" && registerStep === 1 && "Step 1/2: Essential Details"}
                {authMode === "register" && registerStep === 2 && "Step 2/2: Personalize Your Profile"}
                {authMode === "otp_send" && "We will route a secure 6-digit code to your inbox"}
                {authMode === "otp_verify" && "Verify the 6-digit access code sent to your email"}
              </motion.p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* --- REGISTER VIEW --- */}
                {authMode === "register" && (
                  <AnimatePresence mode="wait">
                    {registerStep === 1 ? (
                       <motion.div 
                          key="step1" 
                          variants={containerVariants} 
                          initial="hidden" animate="visible" exit="exit" 
                          className="flex flex-col gap-6"
                       >
                          <motion.div variants={itemVariants} className="group relative">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                              <User size={12} className="text-[#d4af37]" /> Full Name
                            </label>
                            <input 
                              type="text" required value={form.name}
                              className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                              onChange={e => setForm({...form, name: e.target.value})}
                            />
                          </motion.div>

                          <motion.div variants={itemVariants} className="group relative">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                              <Mail size={12} className="text-[#d4af37]" /> Email Address
                            </label>
                            <input 
                              type="email" required value={form.email}
                              className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                              onChange={e => setForm({...form, email: e.target.value})}
                            />
                          </motion.div>

                          <motion.div variants={itemVariants} className="group relative">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                              <Lock size={12} className="text-[#d4af37]" /> Password
                            </label>
                            <input 
                              type="password" required value={form.password}
                              className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                              onChange={e => setForm({...form, password: e.target.value})}
                            />
                          </motion.div>
                       </motion.div>
                    ) : (
                       <motion.div 
                          key="step2" 
                          variants={containerVariants} 
                          initial="hidden" animate="visible" exit="exit" 
                          className="flex flex-col gap-6"
                       >
                          <motion.div variants={itemVariants} className="flex gap-4">
                             <div className="flex-1 group relative">
                               <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                                 <Calendar size={12} className="text-[#d4af37]" /> Date of Birth
                               </label>
                               <input 
                                 type="date" required value={form.dob}
                                 className="w-full bg-[#111]/50 border border-white/10 p-4 text-[#ccc] focus:text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                                 style={{ colorScheme: "dark" }}
                                 onChange={e => setForm({...form, dob: e.target.value})}
                               />
                             </div>
                             <div className="flex-1 group relative">
                               <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                                 <Phone size={12} className="text-[#d4af37]" /> Phone No
                               </label>
                               <input 
                                 type="tel" required placeholder="+91" value={form.phoneNumber}
                                 className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                                 onChange={e => setForm({...form, phoneNumber: e.target.value})}
                               />
                             </div>
                          </motion.div>

                          <motion.div variants={itemVariants} className="group relative">
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold flex items-center gap-2">
                                <MapPin size={12} className="text-[#d4af37]" /> Location
                              </label>
                              <button 
                                type="button" onClick={detectLocation} disabled={loading}
                                className="text-[9px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-[4px] uppercase tracking-wider font-bold hover:bg-[#d4af37] hover:text-black flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                <MapPin size={10} /> {loading ? "Detecting..." : "Auto Detect"}
                              </button>
                            </div>
                            <input 
                              type="text" required placeholder="City, State" value={form.location}
                              className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                              onChange={e => setForm({...form, location: e.target.value})}
                            />
                          </motion.div>
                       </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* --- LOGIN / OTP VIEWS --- */}
                {authMode === "login" && (
                   <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
                      <motion.div variants={itemVariants} className="group relative">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                          <Mail size={12} className="text-[#d4af37]" /> Email Address
                        </label>
                        <input 
                          type="email" required value={form.email}
                          className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                          onChange={e => setForm({...form, email: e.target.value})}
                        />
                      </motion.div>
                      <motion.div variants={itemVariants} className="group relative">
                         <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                            <Lock size={12} className="text-[#d4af37]" /> Password
                         </label>
                        <input 
                          type="password" required value={form.password}
                          className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm rounded-sm"
                          onChange={e => setForm({...form, password: e.target.value})}
                        />
                      </motion.div>
                   </motion.div>
                )}

                {authMode === "otp_send" && (
                   <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
                      <motion.div variants={itemVariants} className="group relative">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2 flex items-center gap-2">
                          <Mail size={12} className="text-[#d4af37]" /> Email Address
                        </label>
                        <input 
                          type="email" required disabled={loading} value={form.email}
                          className="w-full bg-[#111]/50 border border-white/10 p-4 text-white focus:border-[#d4af37] focus:bg-[#1a1a1a] outline-none transition-all text-sm disabled:opacity-50 rounded-sm"
                          onChange={e => setForm({...form, email: e.target.value})}
                        />
                      </motion.div>
                   </motion.div>
                )}

                {authMode === "otp_verify" && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold flex items-center gap-2">
                         <ShieldCheck size={14} /> 6-Digit Code
                      </label>
                      <span className={`text-[10px] font-mono tracking-widest px-3 py-1.5 rounded-[4px] border ${timer === 0 ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-[#d4af37]/30 text-[#d4af37] bg-[#d4af37]/10"}`}>
                        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 to-transparent blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <input 
                        type="text" required maxLength={6} value={form.otp}
                        className="relative w-full bg-[#0a0a0a] border-2 border-white/10 p-6 text-[#d4af37] focus:border-[#d4af37] focus:shadow-[0_0_30px_rgba(212,175,55,0.15)] outline-none transition-all text-center text-4xl tracking-[0.8em] font-serif rounded-sm"
                        style={{ textShadow: "0 0 10px rgba(212,175,55,0.3)" }}
                        onChange={e => setForm({...form, otp: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Notifications */}
                <AnimatePresence>
                  {timer === 0 && authMode === "otp_verify" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                      <button type="button" onClick={handleSendOTP} disabled={loading} className="w-full text-xs text-white border border-[#333] hover:bg-white/5 py-4 uppercase tracking-[0.1em] transition-colors rounded-sm shadow-lg">
                        {loading ? "Re-Routing..." : "Code Expired — Resend Latest OTP"}
                      </button>
                    </motion.div>
                  )}
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-red-500/10 border-l-[3px] border-red-500 text-red-400 p-4 text-[10px] tracking-wider uppercase flex items-center gap-2">
                      {errorMsg}
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-green-500/10 border-l-[3px] border-green-500 text-green-400 p-4 text-[10px] tracking-wider uppercase">
                      {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Action */}
                <div className="flex items-center gap-3 mt-4">
                  {authMode === "register" && registerStep === 2 && (
                    <button 
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="bg-white/5 text-white p-4 hover:bg-white/10 transition-colors rounded-sm flex items-center justify-center border border-white/10"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <motion.button 
                    variants={itemVariants}
                    disabled={loading || (authMode === "otp_verify" && timer === 0)}
                    className="flex-1 relative overflow-hidden group bg-gradient-to-r from-[#d4af37] to-[#e6c875] text-black py-4 uppercase tracking-[0.2em] font-bold text-xs hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 rounded-sm"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[800ms] pointer-events-none" />
                    {loading ? "Processing Encryption..." : 
                      authMode === "login" ? "Secure Sign In" : 
                      authMode === "register" ? (registerStep === 1 ? "Continue Step 2" : "Create Profile & Get OTP") : 
                      authMode === "otp_send" ? "Request Secure Code" : 
                      "Verify & Authorize"}
                    {!loading && <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />}
                  </motion.button>
                </div>

              </form>

              {/* Toggle Alternate Methods */}
              <motion.div variants={itemVariants} className="mt-auto pt-8 border-t border-white/5">
                <div className="flex flex-col gap-4 text-center text-[9px] tracking-[0.15em] text-[#666] uppercase font-bold">
                  {authMode === "login" && (
                    <>
                      <button onClick={() => { setAuthMode("otp_send"); setErrorMsg(""); }} className="hover:text-[#d4af37] transition-colors py-1">
                        Access via Email OTP Instead
                      </button>
                      <button onClick={() => { setAuthMode("register"); setRegisterStep(1); setErrorMsg(""); }} className="hover:text-[#d4af37] hover:border-[#d4af37] transition-colors py-4 border border-white/10 w-full rounded-sm bg-[#111]/30">
                        New Patron? Create a Premium Account
                      </button>
                    </>
                  )}

                  {authMode === "register" && (
                    <button onClick={() => { setAuthMode("login"); setErrorMsg(""); }} className="hover:text-[#d4af37] transition-colors flex items-center justify-center gap-2 py-2">
                       Already a member? Sign in here
                    </button>
                  )}

                  {(authMode === "otp_send" || authMode === "otp_verify") && (
                    <button onClick={() => { setAuthMode("login"); setErrorMsg(""); }} className="hover:text-[#d4af37] transition-colors py-2 flex items-center justify-center gap-2">
                      ← Back to Classic Password Login
                    </button>
                  )}
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
