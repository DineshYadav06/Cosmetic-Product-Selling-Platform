"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkinQuiz from "@/components/ai/SkinQuiz";
import CameraScanner from "@/components/ai/CameraScanner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Camera, BrainCircuit, Star, ArrowRight, Loader2, Clock, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";

export default function AIConsultantPage() {
  const { addManyToCart } = useStore();
  const [phase, setPhase] = useState<"landing" | "quiz" | "upload" | "analyzing" | "results">("landing");
  const [showCamera, setShowCamera] = useState(false);
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
                <span className="text-xs font-bold uppercase tracking-[0.4em]">Advanced Skincare AI</span>
                <Sparkles size={20} className="animate-pulse" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Your Personal <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#d4af37]">AI Dermatologist</span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed font-light">
                Using cutting-edge computer vision and medical-grade AI models, we analyze your skin profile to recommend the perfect Glowmart regimen.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full">
                {[
                  { icon: BrainCircuit, title: "AI Analysis", desc: "Trained on 10,000+ skin profiles" },
                  { icon: Camera, title: "Instant Scan", desc: "Live camera or photo upload" },
                  { icon: Star, title: "Verified", desc: "Products chosen by experts" }
                ].map((feat, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 hover:border-[#d4af37]/40 transition-colors group">
                    <feat.icon size={32} className="text-[#d4af37] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-2">{feat.title}</h3>
                    <p className="text-gray-500 text-xs font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={startQuiz}
                className="group relative bg-[#d4af37] text-black px-12 py-5 font-bold uppercase tracking-[0.3em] text-sm hover:bg-white transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Analysis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
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
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                <Camera size={48} className="mx-auto text-[#d4af37] mb-6" />
                <h2 className="text-3xl font-serif font-bold text-white mb-4">Visual Skin Scan</h2>
                <p className="text-gray-500 text-sm mb-10 uppercase tracking-widest leading-relaxed">
                  Analyze your skin texture, tone, and hydration using your camera or a photo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="flex flex-col items-center justify-center border border-[#d4af37] p-8 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 transition-all group"
                  >
                    <RefreshCw className="text-[#d4af37] mb-2 group-hover:rotate-180 transition-transform duration-700" size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Use Live Camera</p>
                  </button>

                  <div className="relative group border border-[#333] p-8 hover:border-white transition-all bg-black flex flex-col items-center justify-center">
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#666] group-hover:text-white">Upload File</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => startAnalysis(null)}
                  className="mt-6 text-[9px] uppercase tracking-[0.2em] text-gray-600 hover:text-[#d4af37] transition-colors"
                >
                  Skip visual analysis
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
              <div className="relative mb-12 w-64 h-80 overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]">
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
                {/* HUD Elements */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                   <div className="flex justify-between">
                     <div className="w-4 h-4 border-t-2 border-l-2 border-[#d4af37]/50" />
                     <div className="w-4 h-4 border-t-2 border-r-2 border-[#d4af37]/50" />
                   </div>
                   <div className="flex justify-between">
                     <div className="w-4 h-4 border-b-2 border-l-2 border-[#d4af37]/50" />
                     <div className="w-4 h-4 border-b-2 border-r-2 border-[#d4af37]/50" />
                   </div>
                </div>
              </div>

              <h2 className="text-3xl font-serif font-bold tracking-widest mb-4">Analyzing Biometrics...</h2>
              <div className="space-y-3 text-center">
                <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest animate-pulse">Deep Learning Match in progress</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest">Optimizing routine for {results?.skinType || 'your profile'}</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Summary */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 sticky top-32 space-y-8">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#d4af37] mb-6 pb-4 border-b border-[#1a1a1a]">Your Skin Profile</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Diagnosis</p>
                          <p className="text-lg font-bold uppercase tracking-widest">{results.diagnosis}</p>
                        </div>

                        {/* Health Score */}
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-2">
                             <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Health Score</p>
                             <span className="text-[#d4af37] font-bold text-xs">82%</span>
                          </div>
                          <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: "82%" }} 
                               transition={{ duration: 1.5, delay: 0.5 }}
                               className="h-full bg-gradient-to-r from-[#d4af37]/40 to-[#d4af37]" 
                             />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Type</p>
                            <p className="text-sm font-bold text-white/80">{results.profile.skinType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Sensitivity</p>
                            <p className="text-sm font-bold text-white/80">{results.profile.sensitivity}</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed italic">
                          "{results.aiNote}"
                        </p>
                      </div>
                    </div>

                    {/* Regimen Schedule */}
                    <div className="bg-black/40 p-6 border border-[#1a1a1a] space-y-6">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-[#111] pb-4 flex items-center gap-2">
                         <Clock size={12} className="text-[#d4af37]" /> Regimen Schedule
                       </h4>
                       <div className="space-y-4">
                          <div>
                            <p className="text-[#d4af37] text-[9px] font-bold uppercase tracking-widest mb-2">Morning (AM)</p>
                            <div className="flex flex-wrap gap-2">
                               {results.schedule?.am.map((s: string) => (
                                 <span key={s} className="text-[8px] bg-white/5 border border-white/10 px-2 py-1 uppercase font-bold tracking-widest">{s}</span>
                               ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[#d4af37] text-[9px] font-bold uppercase tracking-widest mb-2">Evening (PM)</p>
                            <div className="flex flex-wrap gap-2">
                               {results.schedule?.pm.map((s: string) => (
                                 <span key={s} className="text-[8px] bg-white/5 border border-white/10 px-2 py-1 uppercase font-bold tracking-widest">{s}</span>
                               ))}
                            </div>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => setPhase("quiz")}
                      className="w-full border border-[#1a1a1a] text-xs font-bold uppercase py-3 hover:bg-white hover:text-black transition-all tracking-[0.2em]"
                    >
                      Retake Analysis
                    </button>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="lg:col-span-2 space-y-10">
                   <div className="flex items-center gap-4">
                      <h2 className="text-4xl font-serif font-bold">Recommended Regimen</h2>
                      <div className="h-[1px] flex-1 bg-[#1a1a1a]" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {results.recommendations.map((product: any, idx: number) => (
                        <motion.div 
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-[#0a0a0a] border border-[#1a1a1a] group overflow-hidden"
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
                          </div>
                          <div className="p-6">
                            <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.2em] mb-1">{product.brand}</p>
                            <h4 className="text-lg font-serif font-bold text-white mb-2 line-clamp-1">{product.name}</h4>
                            <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">{product.reason}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-[#111]">
                              <span className="text-lg font-serif font-bold">₹{product.price}</span>
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

                   <div className="bg-[#d4af37] p-10 text-black flex flex-col md:flex-row items-center gap-8 justify-between mt-12">
                      <div className="text-center md:text-left">
                        <h3 className="text-2xl font-serif font-bold mb-2">Buy the Full Regimen</h3>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-70">Save 10% on your first AI-recommended routine</p>
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
                        className="bg-black text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all"
                      >
                        Add All to Bag
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
