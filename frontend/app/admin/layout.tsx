"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Dinesh2006" && password === "9555240369") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      setError("");
    } else {
      setError("Invalid Owner Credentials");
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#0d0d0d]" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 selection:bg-[#d4af37] selection:text-black">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#1a1a1a] p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#111] border border-[#222] rounded-full flex items-center justify-center mb-4">
              <Lock size={20} className="text-[#d4af37]" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-widest text-white uppercase text-center">Owner Access</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#555] mt-2">Restricted Area</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{error}</p>}
            
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#888] mb-2">Login ID</label>
              <input 
                required 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#111] border border-[#333] p-3 text-white text-sm focus:border-[#d4af37] outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#888] mb-2">Password</label>
              <input 
                required 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#333] p-3 text-white text-sm focus:border-[#d4af37] outline-none" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#d4af37] text-black py-3 mt-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
