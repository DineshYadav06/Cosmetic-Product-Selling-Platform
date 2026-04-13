import { MapPin, ArrowRight, Clock, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const STORES = [
  {
    city: "Mumbai",
    name: "Palladium Mall Boutique",
    address: "Level 1, Palladium Shopping Mall, Lower Parel",
    hours: "11:00 AM - 10:00 PM (Mon-Sun)",
    phone: "+91 22 2498 0000",
    image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?auto=format&fit=crop&q=80&w=800"
  },
  {
    city: "New Delhi",
    name: "DLF Promenade Exclusive",
    address: "Ground Floor, DLF Promenade, Vasant Kunj",
    hours: "10:30 AM - 9:30 PM (Mon-Sun)",
    phone: "+91 11 4610 4466",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800"
  },
  {
    city: "Bengaluru",
    name: "UB City Flagship",
    address: "UB City, Vittal Mallya Road",
    hours: "10:30 AM - 9:00 PM (Mon-Sun)",
    phone: "+91 80 4173 8989",
    image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&q=80&w=800"
  }
];

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-widest uppercase mb-6" style={{
            background: "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Our Boutiques
          </h1>
          <p className="text-[#888] leading-relaxed tracking-wider text-sm">
            Experience the luxury of GLOWMART INDIA in person. Discover exclusive in-store services, personalized beauty consultations, and our complete curation of world-class fragrances and cosmetics.
          </p>
        </div>

        {/* Search/Filter Bar */}
        <div className="bg-[#111] border border-[#222] p-4 flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex items-center gap-3 text-[#d4af37] font-bold tracking-widest text-xs uppercase w-full sm:w-auto">
            <MapPin size={18} />
            <span>Find a Store Near You</span>
          </div>
          <div className="flex w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Enter Pincode or City..." 
              className="bg-[#0f0f0f] border border-[#333] px-4 py-2 text-sm text-white focus:border-[#d4af37] outline-none flex-1"
            />
            <button className="bg-[#d4af37] text-black px-6 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {STORES.map(store => (
            <div key={store.name} className="bg-[#111] border border-[#222] group hover:border-[#444] transition-colors relative h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              
              {/* Image */}
              <div className="w-full aspect-[16/10] overflow-hidden relative">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37] border border-[#d4af37]">
                  {store.city}
                </div>
              </div>

              {/* Details */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-serif font-bold tracking-wider mb-2">{store.name}</h3>
                <p className="text-[#888] text-sm mb-6 flex-1">{store.address}</p>
                
                <div className="space-y-3 pt-6 border-t border-[#222]">
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-[#d4af37] mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Hours</p>
                      <p className="text-sm text-white">{store.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-[#d4af37] mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Phone</p>
                      <p className="text-sm text-white">{store.phone}</p>
                    </div>
                  </div>
                </div>

                <button className="mt-8 w-full border border-white px-4 py-3 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors">
                  Get Directions <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className="mt-20 bg-[url('https://images.unsplash.com/photo-1610128087995-1811ee85bb03?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center border border-[#333] p-12 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-widest uppercase mb-4 text-[#d4af37]">Book a Masterclass</h2>
            <p className="text-[#aaa] text-sm leading-relaxed mb-8">
              Visit any GLOWMART boutique to receive complimentary 30-minute makeup and skincare consultations with our certified beauty experts. No purchase necessary.
            </p>
            <Link href="/contact" className="bg-[#d4af37] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-white transition-all">
              Book Appointment
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
