"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

const CITIES = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
const PRODUCTS = [
  "Luminous Night Serum",
  "Velvet Matte Lipstick",
  "Golden Aura Perfume",
  "Hydrating Face Cream",
  "Saffron Glow Oil",
  "Pearl Radiance Mask"
];

export default function LiveSalesFeed() {
  const [currentSale, setCurrentSale] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showRandomSale = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const time = Math.floor(Math.random() * 5) + 1;

      setCurrentSale({ city, product, time });
      setIsVisible(true);

      setTimeout(() => setIsVisible(false), 5000);
    };

    const interval = setInterval(showRandomSale, 15000);
    // Initial delay
    const initialTimeout = setTimeout(showRandomSale, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[100] pointer-events-none">
      <AnimatePresence>
        {isVisible && currentSale && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="bg-black/90 backdrop-blur-xl border border-[#d4af37]/30 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 max-w-sm pointer-events-auto group"
          >
            <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20 relative overflow-hidden">
               <ShoppingBag size={20} className="text-[#d4af37]" />
               <motion.div 
                 className="absolute inset-0 bg-[#d4af37]/20"
                 initial={{ y: "100%" }}
                 animate={{ y: "-100%" }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               />
            </div>
            
            <div className="flex-1">
              <p className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-0.5">Live Order Activity</p>
              <p className="text-white text-xs font-medium leading-tight">
                Someone in <span className="text-[#d4af37] font-bold">{currentSale.city}</span> <br /> 
                just purchased <span className="italic font-serif">{currentSale.product}</span>
              </p>
              <p className="text-[8px] text-gray-500 uppercase tracking-tighter mt-1 font-bold">{currentSale.time} minutes ago</p>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-700 hover:text-white transition-colors p-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
