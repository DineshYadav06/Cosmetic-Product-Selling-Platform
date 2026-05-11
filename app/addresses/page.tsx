"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useStore } from "../../lib/context/StoreContext";
import { useEffect, useState } from "react";
import { MapPin, Plus, ChevronLeft, Home, Briefcase, Trash2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddressesPage() {
  const { user } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && !user) {
        router.push('/auth');
    }
  }, [user, mounted]);

  if (!mounted) return null;

  const savedAddresses = [
    {
      id: "1",
      type: "Home",
      icon: <Home size={18} />,
      name: "Dinesh Yadav",
      address: "123, Luxury Heights, Palm Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 9876543210",
      isDefault: true
    },
    {
        id: "2",
        type: "Work",
        icon: <Briefcase size={18} />,
        name: "Dinesh Yadav",
        address: "GlowMart Corporate Center, BKC",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400051",
        phone: "+91 9876543210",
        isDefault: false
      }
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black flex flex-col">
      <Header />

      <div className="max-w-[1000px] mx-auto w-full px-4 md:px-8 py-6 flex-1">
        {/* Navigation */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/account')}
            className="flex items-center gap-2 text-[#555] hover:text-[#d4af37] transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Back to Account</span>
          </button>
        </div>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-[#1a1a1a] pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center rounded-full text-[#d4af37]">
                <MapPin size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-serif font-bold tracking-widest uppercase">Saved Addresses</h1>
                <p className="text-[#555] text-[10px] uppercase tracking-[0.2em] mt-1">Manage your delivery locations</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 uppercase font-bold tracking-widest text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Plus size={14} /> Add New Address
          </button>
        </div>

        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedAddresses.map((addr) => (
            <div key={addr.id} className={`p-6 border transition-all relative group ${addr.isDefault ? 'bg-[#0a0a0a] border-[#d4af37]/30' : 'bg-transparent border-[#1a1a1a] hover:border-[#333]'}`}>
               {addr.isDefault && (
                 <span className="absolute top-0 right-0 bg-[#d4af37] text-black text-[8px] font-bold uppercase tracking-widest px-3 py-1">
                   Default
                 </span>
               )}
               
               <div className="flex items-center gap-3 mb-4 text-[#d4af37]">
                 {addr.icon}
                 <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{addr.type}</span>
               </div>

               <div className="space-y-1 mb-6">
                 <h4 className="text-white font-bold text-sm mb-2">{addr.name}</h4>
                 <p className="text-[#888] text-xs leading-relaxed">{addr.address}</p>
                 <p className="text-[#888] text-xs">{addr.city}, {addr.state} - {addr.pincode}</p>
                 <p className="text-[#555] text-xs mt-3 pt-3 border-t border-[#1a1a1a]">Phone: {addr.phone}</p>
               </div>

               <div className="flex items-center gap-4 pt-2">
                 <button className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
                   <Edit3 size={12} /> Edit
                 </button>
                 <button className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 hover:text-red-500 transition-colors">
                   <Trash2 size={12} /> Remove
                 </button>
               </div>
            </div>
          ))}
        </div>

        {/* Empty State Hint */}
        <p className="mt-12 text-center text-[#333] text-[10px] uppercase tracking-[0.3em] font-bold">
            Securely saved for your next checkout
        </p>
      </div>

      <Footer />
    </main>
  );
}
