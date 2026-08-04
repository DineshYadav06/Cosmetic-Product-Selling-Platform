import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-black flex items-center justify-center">
      {/* Background Dark Luxury Cosmetic Image */}
      <Image
        src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=2000"
        alt="GLOWMART Luxury Cosmetic Selection"
        fill
        sizes="100vw"
        className="object-cover object-center brightness-[0.4]"
        priority
      />

      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 z-10 text-center animate-fade-in">
        <h3 className="text-[#d4af37] tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-bold drop-shadow-lg">
          Exclusive Collection
        </h3>
        <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-widest uppercase mb-6 shadow-sm drop-shadow-2xl max-w-4xl leading-tight">
          Define Your <span className="text-[#d4af37]">Aura</span>
        </h2>
        <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide max-w-2xl mb-10 drop-shadow-md">
          Discover handpicked luxury fragrances, designer colognes, and rare niche scents crafted for the modern gentleman.
        </p>
        <Link 
          href="/collection" 
          className="bg-[#d4af37] text-black px-12 py-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-white hover:text-black transition-all duration-500 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
