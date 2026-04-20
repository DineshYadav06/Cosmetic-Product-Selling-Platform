"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token || !email) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Link</h2>
        <p className="text-gray-500 mb-6">The password reset link is missing required information.</p>
        <Link href="/auth/forgot" className="bg-[#fb641b] text-white px-6 py-2 rounded font-semibold inline-block">
          Request New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to reset password. The link might be expired.");
      }
    } catch {
      setError("Network error. Please make sure you are connected.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#e6f4ea] text-[#137333] rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Password Updated!</h2>
        <p className="text-[14px] text-gray-500 mb-8 leading-relaxed">
          Your password has been successfully reset. You can now use your new password to sign in to your account.
        </p>
        <button
          onClick={() => router.push("/auth")}
          className="w-full bg-[#fb641b] hover:bg-[#e45a18] text-white font-bold py-3.5 rounded shadow-sm transition-colors"
        >
          LOGIN NOW
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-gray-800">Create New Password</h2>
      <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
        Your new password must be different from previous used passwords and at least 6 characters long.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="New Password"
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#2874f0] transition-colors"
            required
            autoFocus
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            placeholder="Confirm New Password"
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#2874f0] transition-colors"
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
             <><Loader2 size={18} className="animate-spin" /> UPDATING PASSWORD...</>
          ) : (
            "RESET PASSWORD"
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6] p-4 text-[#111]">
      <div className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)] rounded-md w-full max-w-md overflow-hidden">
        
        {/* Header Block */}
        <div className="bg-[#2874f0] p-8 text-center text-white pb-10">
           <h1 className="text-2xl font-serif font-bold tracking-widest uppercase mb-2">Glowmart</h1>
           <p className="text-sm text-blue-100 opacity-90">Secure Password Reset</p>
        </div>

        {/* Content Block overlaying header slightly */}
        <div className="px-8 pb-8 pt-6 relative bg-white -mt-4 rounded-t-xl z-10">
           <Suspense fallback={<div className="text-center py-10"><Loader2 className="animate-spin text-[#2874f0] mx-auto" size={32} /></div>}>
              <ResetPasswordForm />
           </Suspense>
        </div>
        
      </div>
    </div>
  );
}
