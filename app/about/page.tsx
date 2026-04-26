import { CheckCircle2, ShieldCheck, HeartHandshake, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const VALUES = [
    {
      icon: ShieldCheck,
      title: "100% Authentic",
      desc: "Every product is sourced directly from brands or authorized distributors."
    },
    {
      icon: Leaf,
      title: "Clean & Conscious",
      desc: "We curate brands that prioritize sustainable, cruelty-free practices."
    },
    {
      icon: HeartHandshake,
      title: "Expert Curation",
      desc: "Our beauty experts handpick only the most effective, premium formulas."
    },
    {
      icon: CheckCircle2,
      title: "Luxury Experience",
      desc: "From unpacking to application, we deliver an unmatched premium feel."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full flex flex-col justify-center text-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=2000" 
            alt="About GLOWMART INDIA" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 mt-16">
          <h1 className="text-[10px] tracking-[0.5em] text-[#d4af37] font-bold uppercase mb-4">Our Story</h1>
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-widest mb-6 leading-tight">
            Redefining <br/>Indian Beauty
          </h2>
          <p className="text-[#aaa] text-sm md:text-base leading-relaxed tracking-wider">
            Founded in 2026, GLOWMART INDIA was born from a singular vision: to bring the world's most coveted luxury beauty and fragrance brands to the Indian consumer with absolute authenticity and uncompromising elegance.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#d4af37] opacity-50"></div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#d4af37] opacity-50"></div>
             <img 
                src="https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=1000" 
                alt="Luxury Cosmetics" 
                className="w-full grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl relative block" 
              />
          </div>
          <div>
            <h3 className="text-3xl font-serif tracking-widest uppercase mb-8 border-b-2 border-[#222] pb-4 text-[#d4af37]">Our Philosophy</h3>
            <div className="space-y-6 text-[#999] leading-loose text-sm font-light">
              <p>
                At GLOWMART, we believe that beauty is an intricate mix of science, art, and personal expression. We are not just a retailer; we are curators of the finest olfactory and cosmetic experiences.
              </p>
              <p>
                For years, Indian consumers faced challenges in accessing genuine international luxury brands. We bridge that gap by building direct partnerships with maisons spanning from Paris to Seoul. 
              </p>
              <p>
                Every serum, every palette, and every parfum on our platform has passed our rigorous standards for quality, efficacy, and ethical production.
              </p>
            </div>
            <Link href="/collection" className="mt-10 inline-block bg-[#d4af37] text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:bg-white hover:shadow-none transition-all">
              Explore The Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-[#111] py-24 border-y border-[#222]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h3 className="text-2xl font-serif text-center uppercase tracking-[0.3em] font-bold mb-16 text-white text-shadow-sm">The GLOWMART INDIA Promise</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(v => (
              <div key={v.title} className="bg-[#0a0a0a] border border-[#222] p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
                <v.icon size={40} className="mx-auto mb-6 text-[#d4af37] opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                <h4 className="font-serif font-bold tracking-widest uppercase text-sm mb-4">{v.title}</h4>
                <p className="text-[#666] text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
