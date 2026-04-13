import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-40">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif tracking-widest uppercase mb-4 text-[#d4af37]">Reach Out To Us</h1>
          <p className="text-[#888] max-w-2xl mx-auto text-sm leading-relaxed">
            Our luxury beauty conciliaries are here to assist with product inquiries, corporate gifting, or order support. Average response time is under 4 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div className="md:col-span-2 bg-[#111] border border-[#222] p-8">
            <h3 className="font-serif font-bold tracking-widest uppercase text-lg mb-8 border-b-2 border-[#222] pb-4">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">First Name</label>
                  <input required className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Last Name</label>
                  <input required className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Email Address</label>
                <input required type="email" className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white" />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Subject</label>
                <select className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-[#ccc]">
                  <option>Order Inquiry</option>
                  <option>Product Question</option>
                  <option>Returns/Refunds</option>
                  <option>Corporate Gifting</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Message</label>
                <textarea required rows={5} className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white"></textarea>
              </div>

              <button className="w-full bg-[#d4af37] text-black py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-[#111] border border-[#222] p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <Mail size={32} className="mx-auto mb-4 text-[#d4af37]" strokeWidth={1.5} />
              <h4 className="font-serif font-bold uppercase tracking-widest text-sm mb-2">Email</h4>
              <p className="text-[#888] text-xs">dineshkumaryadav12651@gmail.com</p>
            </div>

            <div className="bg-[#111] border border-[#222] p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <Phone size={32} className="mx-auto mb-4 text-[#d4af37]" strokeWidth={1.5} />
              <h4 className="font-serif font-bold uppercase tracking-widest text-sm mb-2">Call</h4>
              <p className="text-[#888] text-xs">+91 (800) 123-4567<br/>Mon-Sat: 10AM - 6PM</p>
            </div>

            <div className="bg-[#111] border border-[#222] p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
              <MapPin size={32} className="mx-auto mb-4 text-[#d4af37]" strokeWidth={1.5} />
              <h4 className="font-serif font-bold uppercase tracking-widest text-sm mb-2">Headquarters</h4>
              <p className="text-[#888] text-xs">GLOWMART Towers, BKC<br/>Mumbai, India 400051</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
