"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings, LayoutDashboard, Package, ClipboardList, ShoppingBag, ChevronLeft,
  Save, Store, Mail, MessageSquare, Truck, Loader2, CheckCircle2
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    storeName: "",
    supportEmail: "",
    announcementText: "",
    heroOffer: "",
    freeShippingThreshold: 999
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setForm({
            storeName: data.storeName || "",
            supportEmail: data.supportEmail || "",
            announcementText: data.announcementText || "",
            heroOffer: data.heroOffer || "",
            freeShippingThreshold: data.freeShippingThreshold || 999
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch(err) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col sticky top-0 h-screen flex-shrink-0">
        <div className="p-6 border-b border-[#1a1a1a]">
           <div className="text-[10px] tracking-[0.4em] text-[#d4af37] font-semibold mb-1">ADMIN PANEL</div>
           <div className="text-xl font-serif tracking-[0.3em] font-bold" style={{
             background: "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
           }}>GLOWMART</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
            { icon: Package, label: "Products", href: "/admin/products" },
            { icon: ClipboardList, label: "Orders", href: "/admin/orders" },
            { icon: ShoppingBag, label: "Add Product", href: "/admin/add-product" },
            { icon: Settings, label: "Settings", href: "/admin/settings", active: true },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all ${
                item.active ? "bg-[#d4af37] text-black" : "text-[#666] hover:text-white hover:bg-[#111]"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1a1a1a]">
          <Link href="/" className="flex items-center gap-2 text-xs text-[#444] hover:text-white transition-colors font-bold uppercase tracking-widest">
            <ChevronLeft size={14} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#0d0d0d] flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#d4af37]" />
          </div>
        )}

        {/* Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest">Store Configuration</h1>
            <p className="text-[#555] text-xs uppercase tracking-widest mt-1">Manage global website settings</p>
          </div>
          {success && (
            <span className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest">
              <CheckCircle2 size={16} /> Defaults Saved
            </span>
          )}
        </div>

        <div className="p-8 max-w-4xl mx-auto">
          <form className="space-y-8" onSubmit={handleSave}>
            
            {/* General Settings */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
               <h2 className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest uppercase mb-6 pb-4 border-b border-[#1a1a1a]">
                 <Store size={18} className="text-[#d4af37]"/> General Data
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Store Brand Name</label>
                   <input required value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})}
                      className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm font-bold" />
                 </div>
                 
                 <div>
                   <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Support Email</label>
                   <div className="relative">
                     <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                     <input required type="email" value={form.supportEmail} onChange={e => setForm({...form, supportEmail: e.target.value})}
                        className="w-full bg-[#111] border border-[#333] pl-10 p-3 text-white focus:border-[#d4af37] outline-none text-sm" />
                   </div>
                 </div>
               </div>
            </div>

            {/* Display / Frontend Overrides */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 shadow-xl">
               <h2 className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest uppercase mb-6 pb-4 border-b border-[#1a1a1a]">
                 <MessageSquare size={18} className="text-[#d4af37]"/> Website Content Overrides
               </h2>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Top Banner Announcement (Ticker)</label>
                   <input value={form.announcementText} onChange={e => setForm({...form, announcementText: e.target.value})}
                      className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm font-bold tracking-wider" 
                      placeholder="e.g. FLAT 50% OFF ON ALL ORDERS" />
                   <p className="text-[#444] text-[10px] mt-2 uppercase tracking-widest">This text scrolls across the top black banner of the homepage.</p>
                 </div>

                 <div>
                   <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Hero Main Catchphrase</label>
                   <input value={form.heroOffer} onChange={e => setForm({...form, heroOffer: e.target.value})}
                      className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm font-bold tracking-wider" 
                      placeholder="e.g. LUXURY BEAUTY REFINED" />
                   <p className="text-[#444] text-[10px] mt-2 uppercase tracking-widest">This overrides the big text over the homepage video/image hero.</p>
                 </div>
               </div>
            </div>

            {/* Constraints */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 shadow-xl">
               <h2 className="flex items-center gap-2 text-sm font-serif font-bold tracking-widest uppercase mb-6 pb-4 border-b border-[#1a1a1a]">
                 <Truck size={18} className="text-[#d4af37]"/> Logistics Config
               </h2>
               
               <div>
                 <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Free Delivery Threshold (₹)</label>
                 <input type="number" required value={form.freeShippingThreshold} onChange={e => setForm({...form, freeShippingThreshold: Number(e.target.value)})}
                    className="w-full max-w-[200px] bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-lg font-serif font-bold" />
                 <p className="text-[#444] text-[10px] mt-2 uppercase tracking-widest">Cart amounts above this value will not be charged shipping fees.</p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4">
               <button 
                 type="submit" 
                 disabled={saving}
                 className="flex items-center gap-2 bg-[#d4af37] text-black px-8 py-4 text-xs uppercase font-bold tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
               >
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                 {saving ? "Saving Configuration..." : "Save Configuration"}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
