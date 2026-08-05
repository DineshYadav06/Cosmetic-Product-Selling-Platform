"use client";

import { motion } from "framer-motion";

export default function AnalyticsChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 100);
  
  return (
    <div className="h-64 flex items-end gap-2 px-2 pb-6 pt-10 relative">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 border-b border-[#333]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-px bg-white" />
        ))}
      </div>

      {data.map((val, i) => {
        const height = (val / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full relative">
               <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="w-full bg-gradient-to-t from-[#d4af37]/20 to-[#d4af37] border-t border-[#d4af37]/50 relative group-hover:brightness-125 transition-all"
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₹{val.toLocaleString()}
                </div>
              </motion.div>
            </div>
            <span className="text-[8px] font-bold text-[#333] uppercase tracking-tighter">Day {i + 1}</span>
          </div>
        );
      })}
    </div>
  );
}
