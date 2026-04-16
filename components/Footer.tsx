import { Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-gray-900 mt-20">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Top Feature row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-gray-800">

          <div className="flex flex-col">
            <h3 className="uppercase font-bold tracking-[0.2em] mb-6 text-sm">Need Help?</h3>
            <ul className="space-y-4 text-xs tracking-wider text-gray-400 font-light uppercase">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/info/delivery" className="hover:text-white transition-colors">Delivery Information</Link></li>
              <li><Link href="/info/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/info/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="uppercase font-bold tracking-[0.2em] mb-6 text-sm">About GLOWMART INDIA</h3>
            <ul className="space-y-4 text-xs tracking-wider text-gray-400 font-light uppercase">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/info/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/info/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/info/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/info/responsibility" className="hover:text-white transition-colors">Corporate Responsibility</Link></li>
              <li className="pt-2"><Link href="/admin" className="text-[#d4af37] font-bold hover:text-white transition-colors flex items-center gap-2">Owner Section 🔐</Link></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="uppercase font-bold tracking-[0.2em] mb-6 text-sm">GLOWMART INDIA Beauty Pass</h3>
            <p className="text-gray-400 font-light text-sm mb-4 leading-relaxed">
              Join our exclusive rewards program and earn points on every purchase. Unlock premium tiers for VIP gifts and early access to sales.
            </p>
            <button className="bg-white text-black font-bold uppercase tracking-widest text-xs py-3 px-6 hover:bg-gray-300 transition-colors self-start">
              Join For Free
            </button>
          </div>

          <div className="flex flex-col">
            <h3 className="uppercase font-bold tracking-[0.2em] mb-6 text-sm">Stay In Touch</h3>
            <div className="flex gap-4 mb-8 text-xs font-bold uppercase tracking-widest text-gray-400">
              <a href="https://www.instagram.com/dineshkumaryadav_dk/" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.instagram.com/dineshkumaryadav_dk/" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">X</a>
              <a href="https://www.youtube.com/@dineshkumaryadav306" className="hover:text-white transition-colors">YouTube</a>
            </div>
            <p className="text-xs text-gray-400 mb-2">
              Created by Dinesh Yadav
            </p>

            <h3 className="uppercase font-bold tracking-[0.2em] mb-4 text-[10px] text-gray-500">Subscribe for updates</h3>
            <div className="flex w-full">
              <input type="email" placeholder="Email Address" className="bg-transparent border-b border-gray-600 px-0 py-2 w-full text-sm outline-none focus:border-white placeholder:text-gray-700 transition-colors" />
              <button className="border-b border-gray-600 px-2 hover:text-gray-300">
                <Mail size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase text-gray-600 tracking-widest font-bold">
          <p>© 2026 GLOWMART INDIA. All Rights Reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 mt-4 md:mt-0">

              <span>📧</span>

              <a
                href="mailto:dineshkumaryadav12651@gmail.com"
                className="hover:text-white transition-colors"
              >
                Contact Developer
              </a>

            </div>
            <span>Visa</span>
            <span>MasterCard</span>
            <span>Amex</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
