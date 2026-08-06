"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SkinQuiz from "../../components/ai/SkinQuiz";
import CameraScanner from "../../components/ai/CameraScanner";
import ClinicalPrescriptionModal from "../../components/ai/ClinicalPrescriptionModal";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Camera, BrainCircuit, Star, ArrowRight, Loader2, Clock, RefreshCw, FileText, ShoppingBag, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "../../lib/context/StoreContext";

export default function AIConsultantPage() {
  const { addManyToCart } = useStore();
  const [phase, setPhase] = useState<"landing" | "quiz" | "upload" | "analyzing" | "results">("landing");
  const [showCamera, setShowCamera] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [userImage, setUserImage] = useState<string | null>(null);

  const startQuiz = () => setPhase("quiz");

  const handleQuizComplete = (data: any) => {
    setPhase("upload");
    setResults(data); 
  };

  const startAnalysis = async (imageData: string | null) => {
    setUserImage(imageData);
    setShowCamera(false);
    setPhase("analyzing");
    
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...results, image: imageData })
      });
      
      const result = await res.json();
      setResults(result);
      setPhase("results");
    } catch (error) {
      console.error("Analysis failed", error);
      setTimeout(() => setPhase("results"), 2000); 
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      {showCamera && (
        <CameraScanner 
          onCapture={(img) => startAnalysis(img)} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      {showPrescriptionModal && results && (
        <ClinicalPrescriptionModal
          results={results}
          userImage={userImage}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-2 text-[#d4af37] mb-6">
                <Sparkles size={20} className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.4em]">High-End Clinical AI Dermatologist</span>
                <Sparkles size={20} className="animate-pulse" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                AI Skin Vision Scanner <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#d4af37]">& Rx Prescription Lab</span>
              </h1>
              
              <p className="text-gray-400 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed font-light px-4">
                Scan your skin in real time using camera vision or photo upload. Receive a personalized active chemical prescription paired directly with our store inventory.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full">
                {[
                  { icon: BrainCircuit, title: "AI Vision Scan", desc: "Epidermal pore, TEWL & erythema target mesh" },
                  { icon: FileText, title: "Sample Rx Prescription", desc: "Printable official active chemical certificate" },
                  { icon: ShoppingBag, title: "1-Click Store Match", desc: "Direct store product regimen with offer discounts" }
                ].map((feat, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 hover:border-[#d4af37]/40 transition-colors group rounded-lg">
                    <feat.icon size={32} className="text-[#d4af37] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-2">{feat.title}</h3>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowCamera(true)}
                  className="bg-[#d4af37] text-black px-10 py-4 font-extrabold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Camera size={18} /> Launch Live Camera Scanner
                </button>
                <button 
                  onClick={startQuiz}
                  className="border border-[#d4af37]/60 text-[#d4af37] px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#d4af37]/10 transition-all flex items-center justify-center gap-2"
                >
                  Start Diagnostic Quiz <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkinQuiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {phase === "upload" && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-12 relative overflow-hidden rounded-xl">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                <Camera size={48} className="mx-auto text-[#d4af37] mb-6" />
                <h2 className="text-3xl font-serif font-bold text-white mb-4">Visual HUD Skin Scan</h2>
                <p className="text-gray-500 text-sm mb-10 uppercase tracking-widest leading-relaxed">
                  Analyze your skin texture, tone, erythema, and hydration using camera vision or photo upload.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="flex flex-col items-center justify-center border border-[#d4af37] p-8 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 transition-all group rounded-lg"
                  >
                    <RefreshCw className="text-[#d4af37] mb-2 group-hover:rotate-180 transition-transform duration-700" size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Use Live Camera HUD</p>
                  </button>

                  <div className="relative group border border-[#333] p-8 hover:border-white transition-all bg-black flex flex-col items-center justify-center rounded-lg">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => startAnalysis(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#666] group-hover:text-white">Upload Face Selfie</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => startAnalysis(null)}
                  className="mt-6 text-[9px] uppercase tracking-[0.2em] text-gray-600 hover:text-[#d4af37] transition-colors"
                >
                  Skip visual analysis & proceed to Quiz Diagnosis
                </button>
              </div>
            </motion.div>
          )}

          {phase === "analyzing" && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-12 w-64 h-80 overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a] rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                {userImage ? (
                  <img src={userImage} className="w-full h-full object-cover grayscale opacity-50" alt="Scanning" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]">
                    <BrainCircuit size={64} />
                  </div>
                )}
                {/* Laser Scan Line */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-[2px] bg-[#d4af37] shadow-[0_0_15px_#d4af37] z-20"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {/* HUD Reticle */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                   <div className="flex justify-between">
                     <div className="w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
                     <div className="w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
                   </div>
                   <div className="flex justify-between">
                     <div className="w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
                     <div className="w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />
                   </div>
                </div>
              </div>

              <h2 className="text-3xl font-serif font-bold tracking-widest mb-4">Generating Sample Rx Prescription...</h2>
              <div className="space-y-3 text-center">
                <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest animate-pulse">Scanning Active Chemical Formulations</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest">Optimizing Rx regimen for {results?.skinType || 'your skin profile'}</p>
              </div>
            </motion.div>
          )}

          {phase === "results" && results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              {/* Prescribed Certificate Trigger Header Banner */}
              <div className="bg-gradient-to-r from-[#0a0a0a] via-black to-[#0a0a0a] border-2 border-[#d4af37]/60 p-6 md:p-8 rounded-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                <div>
                  <div className="flex items-center gap-2 text-[#d4af37] text-xs font-extrabold uppercase tracking-widest mb-2">
                    <ShieldCheck size={18} /> Official Sample Clinical Prescription Ready
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                    Rx Prescription #{`RX-${new Date().getFullYear()}-GLOW-8942`}
                  </h2>
                  <p className="text-gray-400 text-xs font-light max-w-2xl leading-relaxed">
                    Prescribed Formula: <strong className="text-white font-mono">{results.prescribedComposition?.formula || "Active Clinical Formula"}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="bg-[#d4af37] text-black hover:bg-white text-xs font-extrabold px-8 py-4 rounded-lg uppercase tracking-widest shadow-xl transition-all shrink-0 flex items-center gap-2"
                >
                  <FileText size={16} /> View & Print Prescription Certificate
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Summary */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 sticky top-32 space-y-8 rounded-xl">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#d4af37] mb-6 pb-4 border-b border-[#1a1a1a]">Your Skin Profile</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Diagnosis</p>
                          <p className="text-lg font-bold uppercase tracking-widest">{results.diagnosis}</p>
                        </div>

                        {/* User Photo Preview if present */}
                        {userImage && (
                          <div className="mb-4">
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Scanned Image</p>
                            <div className="relative w-full h-36 rounded border border-[#1a1a1a] overflow-hidden">
                              <img src={userImage} alt="User Skin Scan" className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-[#d4af37] font-bold uppercase tracking-wider">
                                Visual Analyzed
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Health Score */}
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-2">
                             <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Skin Vitality Score</p>
                             <span className="text-[#d4af37] font-bold text-xs">{results.healthScore || 85}%</span>
                          </div>
                          <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${results.healthScore || 85}%` }} 
                               transition={{ duration: 1.5, delay: 0.5 }}
                               className="h-full bg-gradient-to-r from-[#d4af37]/40 to-[#d4af37]" 
                             />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Type</p>
                            <p className="text-sm font-bold text-white/80">{results.profile?.skinType || 'Combination'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Sensitivity</p>
                            <p className="text-sm font-bold text-white/80">{results.profile?.sensitivity || 'Normal'}</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed italic">
                          "{results.aiNote}"
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowPrescriptionModal(true)}
                      className="w-full bg-[#d4af37]/10 border border-[#d4af37] text-[#d4af37] text-xs font-bold uppercase py-3 hover:bg-[#d4af37] hover:text-black transition-all tracking-[0.2em] rounded"
                    >
                      📄 Official Rx Certificate
                    </button>

                    <button 
                      onClick={() => setPhase("quiz")}
                      className="w-full border border-[#1a1a1a] text-xs font-bold uppercase py-3 hover:bg-white hover:text-black transition-all tracking-[0.2em] rounded"
                    >
                      Retake Scan
                    </button>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="lg:col-span-2 space-y-10">
                   {/* Prescribed Chemical Composition Formula Header Banner */}
                   {results.prescribedComposition && (
                     <div className="bg-[#d4af37]/10 border border-[#d4af37]/40 p-6 rounded-xl relative overflow-hidden">
                       <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                         <Sparkles size={16} /> Prescribed Clinical Composition Formula
                       </div>
                       <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">
                         {results.prescribedComposition.formula}
                       </h3>
                       <p className="text-gray-300 text-xs leading-relaxed mb-3 font-light">
                         <strong className="text-white">Mechanism:</strong> {results.prescribedComposition.mechanism}
                       </p>
                       <p className="text-[#d4af37] text-[11px] font-bold uppercase tracking-wider">
                         Cure Protocol: {results.prescribedComposition.cureProtocol}
                       </p>
                     </div>
                   )}

                   <div className="flex items-center gap-4">
                      <h2 className="text-4xl font-serif font-bold">Prescribed Store Products</h2>
                      <div className="h-[1px] flex-1 bg-[#1a1a1a]" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {results.recommendations.map((product: any, idx: number) => (
                        <motion.div 
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-[#0a0a0a] border border-[#1a1a1a] group overflow-hidden relative rounded-xl"
                        >
                          <div className="aspect-[4/5] relative overflow-hidden bg-gray-900">
                             <Image 
                                src={product.image} 
                                alt={product.name} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                             />
                             <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                             <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-[#d4af37]/30">
                                <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">{product.step}</p>
                             </div>
                             {product.offerBadge && (
                               <div className="absolute top-4 right-4 bg-[#d4af37] text-black font-extrabold text-[9px] uppercase px-2 py-1 tracking-wider">
                                 {product.offerBadge}
                               </div>
                             )}
                          </div>
                          <div className="p-6">
                            <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.2em] mb-1">{product.brand}</p>
                            <h4 className="text-lg font-serif font-bold text-white mb-1 line-clamp-1">{product.name}</h4>
                            
                            {product.chemicalComposition && (
                              <p className="text-[10px] text-gray-400 font-mono mb-3 line-clamp-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded w-fit">
                                🧪 {product.chemicalComposition}
                              </p>
                            )}

                            <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">{product.reason}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-[#111]">
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-serif font-bold text-white">₹{product.price}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-xs text-gray-500 line-through font-serif">₹{product.originalPrice}</span>
                                )}
                              </div>
                              <Link 
                                href={`/product/${product.id}`}
                                className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors flex items-center gap-2"
                              >
                                View Product <ArrowRight size={14} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                   </div>

                   <div className="bg-[#d4af37] p-10 text-black flex flex-col md:flex-row items-center gap-8 justify-between mt-12 rounded-xl shadow-xl">
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-serif font-bold mb-2">Buy the Full Prescribed Rx Regimen</h3>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-70">Save 10% on your full clinical active routine</p>
                      </div>
                      <button 
                        onClick={() => {
                          addManyToCart(results.recommendations.map((p: any) => ({
                            id: p.id,
                            brand: p.brand,
                            name: p.name,
                            price: p.price,
                            image: p.image
                          })));
                        }}
                        className="bg-black text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all rounded"
                      >
                        Add Rx Bundle to Bag
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
