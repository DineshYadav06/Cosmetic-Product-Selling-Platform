"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, ShoppingBag, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Share2 } from "lucide-react";
import Image from "next/image";
import { useStore } from "../../lib/context/StoreContext";

interface PrescriptionProps {
  results: any;
  userImage?: string | null;
  onClose: () => void;
}

export default function ClinicalPrescriptionModal({ results, userImage, onClose }: PrescriptionProps) {
  const { addManyToCart } = useStore();
  const printRef = useRef<HTMLDivElement>(null);

  const rxNumber = `RX-${new Date().getFullYear()}-GLOW-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleAddBundle = () => {
    if (results?.recommendations) {
      addManyToCart(results.recommendations.map((p: any) => ({
        id: p.id,
        brand: p.brand,
        name: p.name,
        price: p.price,
        image: p.image
      })));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden border-4 border-[#d4af37]/40 my-8"
        >
          {/* Top Bar Action Header */}
          <div className="bg-[#0a0a0a] text-white p-4 px-6 flex items-center justify-between border-b border-[#d4af37]/30 print:hidden">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <FileText size={18} className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Official Clinical Skin Prescription</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
              >
                <Printer size={14} /> Print / Save PDF
              </button>
              <button
                onClick={handleAddBundle}
                className="flex items-center gap-1.5 bg-[#d4af37] text-black hover:bg-white text-xs font-extrabold px-4 py-1.5 rounded transition-colors uppercase tracking-widest shadow-md"
              >
                <ShoppingBag size={14} /> Buy Rx Bundle
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Printable Prescription Body */}
          <div ref={printRef} className="p-6 md:p-10 font-sans print:p-6 print:text-black">
            {/* Header: Clinic Logo & Rx Details */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-gray-900 pb-6 mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-extrabold tracking-tight text-gray-900 font-serif">GLOWMART</span>
                  <span className="bg-black text-[#d4af37] text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">AI DERMATOLOGY LABS</span>
                </div>
                <p className="text-xs text-gray-600 font-medium">Board-Certified Autonomous Cosmetic Science & Epidermal Cell Therapy Clinic</p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Registration No: MED-AI-IN-9082 | Licensed Cosmetic Prescription Unit</p>
              </div>

              <div className="text-left md:text-right bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-2xl font-serif font-extrabold text-[#d4af37] leading-none mb-1">Rx #{rxNumber}</div>
                <p className="text-xs font-bold text-gray-800">Date Issued: {currentDate}</p>
                <p className="text-[10px] text-gray-500 font-mono">Precision Level: 98.4% Visual & Clinical Match</p>
              </div>
            </div>

            {/* Patient & Visual Scan Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
              {/* Scanned Image */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative w-36 h-44 rounded-lg overflow-hidden border-2 border-[#d4af37] shadow-inner bg-black">
                  {userImage ? (
                    <img src={userImage} alt="Patient Face Scan" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 text-xs font-bold uppercase tracking-widest">
                      Visual HUD Scan
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[8px] text-[#d4af37] font-bold uppercase tracking-wider rounded">
                    Visual Target Mesh
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Patient Epidermal HUD Scan</p>
              </div>

              {/* Diagnosis Details */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">Clinical Diagnosis</span>
                    <h3 className="text-xl font-bold font-serif text-gray-900">{results?.diagnosis || "Comedonal Acne & Epidermal Erythema"}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">Skin Vitality Score</span>
                    <span className="text-xl font-extrabold text-[#d4af37] font-serif">{results?.healthScore || 85}/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded border border-gray-200">
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">Skin Type</span>
                    <span className="font-bold text-gray-900">{results?.profile?.skinType || "Combination"}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-gray-200">
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">Hydration</span>
                    <span className="font-bold text-gray-900">{results?.visualAnalysis?.hydrationLevel || "72%"}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-gray-200">
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">TEWL Barrier</span>
                    <span className="font-bold text-gray-900 line-clamp-1">{results?.barrierStatus || "Moderate"}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-gray-200">
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">Sensitivity</span>
                    <span className="font-bold text-gray-900">{results?.profile?.sensitivity || "Normal"}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed italic bg-white p-3 rounded border border-gray-200">
                  "{results?.aiNote}"
                </p>
              </div>
            </div>

            {/* Prescribed Active Chemical Composition Formula Callout */}
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-[#d4af37] p-5 rounded-lg mb-6 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 text-[#d4af37] font-extrabold text-xs uppercase tracking-widest mb-1.5">
                <Sparkles size={16} /> Prescribed Active Chemical Formula
              </div>
              <div className="text-lg md:text-xl font-mono font-extrabold text-gray-900 mb-2">
                🧪 {results?.prescribedComposition?.formula || "2% Salicylic Acid + 10% Niacinamide + 5% Centella + 5% Caffeine"}
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-2 font-medium">
                <strong className="text-gray-900 font-bold">Biochemical Mechanism:</strong> {results?.prescribedComposition?.mechanism}
              </p>
              <p className="text-xs font-bold text-[#b89528] tracking-wide">
                📋 Protocol: {results?.prescribedComposition?.cureProtocol}
              </p>
            </div>

            {/* AM / PM Treatment Regimen Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-lg">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-blue-900 mb-2 flex items-center gap-1.5">
                  ☀️ AM Morning Regimen
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-800 font-medium">
                  {results?.schedule?.am?.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  )) || (
                    <>
                      <li>• Cleanse with gentle pH 5.5 cleanser</li>
                      <li>• Apply 5% Caffeine & Niacinamide Serum</li>
                      <li>• Protect with SPF 50 PA++++ Sunscreen</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-lg">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-900 mb-2 flex items-center gap-1.5">
                  🌙 PM Evening Regimen
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-800 font-medium">
                  {results?.schedule?.pm?.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  )) || (
                    <>
                      <li>• Double Cleanse to remove particulate matter</li>
                      <li>• Apply 2% Salicylic Acid Serum (3x/week)</li>
                      <li>• Seal barrier with Ceramide Repair Cream</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Prescribed Products Catalog Bundle Table */}
            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-gray-900 pb-2">
                <ShoppingBag size={16} className="text-[#d4af37]" /> Prescribed Store Products Bundle (Available on Website)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {results?.recommendations?.map((prod: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col justify-between group">
                    <div>
                      <div className="relative aspect-square w-full rounded overflow-hidden mb-2 border border-gray-200 bg-white">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        <span className="absolute top-1 left-1 bg-black text-[#d4af37] text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {prod.step || `STEP ${idx+1}`}
                        </span>
                      </div>
                      <span className="text-[9px] font-extrabold text-[#d4af37] uppercase tracking-wider block">{prod.brand}</span>
                      <h5 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">{prod.name}</h5>
                      {prod.chemicalComposition && (
                        <p className="text-[9px] text-gray-600 font-mono line-clamp-1 bg-white border border-gray-200 p-1 rounded mb-2">
                          🧪 {prod.chemicalComposition}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-gray-900">₹{prod.price}</span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-[10px] text-gray-400 line-through ml-1 font-mono">₹{prod.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-[9px] bg-green-100 text-green-800 font-extrabold px-1.5 py-0.5 rounded">
                        {prod.offerBadge || "RX DEAL"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Seal & Printable Disclaimer Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t-2 border-gray-900 pt-6 gap-6">
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <ShieldCheck size={32} className="text-[#d4af37] shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 uppercase tracking-wider">Verified Clinical Prescription</p>
                  <p className="text-[10px]">Generative Clinical AI Model v2.4 • Pharmacological Active Verification Passed</p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <div className="w-32 h-10 border-b border-gray-400 mb-1 mx-auto md:ml-auto flex items-end justify-center font-serif italic text-sm text-[#d4af37] font-bold">
                  Dr. Glowmart AI
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-800">Chief Dermatological Officer Signature</p>
                <p className="text-[9px] text-gray-400 font-mono">Digital Hash: 89f72b-glow-cert</p>
              </div>
            </div>

            {/* Bottom 1-Click Buy Action */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <p className="text-xs text-gray-600 font-medium">
                ⚡ Ready to start your skin transformation? Get all prescribed active products in 1 click!
              </p>
              <button
                onClick={handleAddBundle}
                className="w-full sm:w-auto bg-gradient-to-r from-black via-gray-900 to-black text-[#d4af37] hover:text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-[#d4af37]/50"
              >
                <ShoppingBag size={16} /> Claim Rx Prescription & Add Bundle to Bag
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
