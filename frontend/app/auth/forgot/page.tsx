"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to process request. Please try again.");
      }
    } catch {
      setError("Network error. Please make sure you are connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6] p-4 text-[#111]">
      <div className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)] rounded-md w-full max-w-md overflow-hidden">
        
        {/* Header Block */}
        <div className="bg-[#2874f0] p-8 text-center text-white pb-10">
           <h1 className="text-2xl font-serif font-bold tracking-widest uppercase mb-2">Glowmart</h1>
           <p className="text-sm text-blue-100 opacity-90">Account Recovery</p>
        </div>

        {/* Content Block overlaying header slightly */}
        <div className="px-8 pb-8 pt-6 relative bg-white -mt-4 rounded-t-xl z-10">
          {!success ? (
            <>
              <h2 className="text-xl font-bold mb-2 text-gray-800">Forgot Password?</h2>
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                Enter the email address associated with your account, and we will send you a secure link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#2874f0] transition-colors"
                    required
                  />
                </div>

                {error && <div className="text-red-500 text-xs font-semibold">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#fb641b] hover:bg-[#e45a18] text-white font-bold py-3.5 rounded shadow-sm flex justify-center items-center gap-2 transition-colors mt-2"
                >
                  {loading ? (
                     <><Loader2 size={18} className="animate-spin" /> SENDING LINK...</>
                  ) : (
                    "SEND RESET LINK"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">Check Your Email</h2>
              <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                A password reset link has been sent to <strong className="text-gray-800 font-semibold">{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <Link href="/auth" className="flex items-center justify-center gap-2 text-sm text-[#2874f0] hover:underline font-semibold">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
