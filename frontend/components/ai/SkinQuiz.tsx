"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Sparkles, AlertCircle } from "lucide-react";

interface QuizData {
  skinType: string;
  concerns: string[];
  sensitivity: string;
  ageRange: string;
}

export default function SkinQuiz({ onComplete }: { onComplete: (data: QuizData) => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>({
    skinType: "",
    concerns: [],
    sensitivity: "",
    ageRange: ""
  });

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const toggleConcern = (concern: string) => {
    setData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const steps = [
    {
      title: "What is your skin type?",
      subtitle: "This helps us understand your skin's natural behavior.",
      field: "skinType",
      options: ["Oily", "Dry", "Combination", "Normal"]
    },
    {
      title: "Any specific concerns?",
      subtitle: "Select all that apply to your skin journey.",
      field: "concerns",
      options: ["Acne", "Aging", "Dark Spots", "Dullness", "Large Pores", "Redness", "Fine Lines"]
    },
    {
      title: "How sensitive is your skin?",
      subtitle: "Safety first! We'll avoid harsh ingredients if needed.",
      field: "sensitivity",
      options: ["Very Sensitive", "Occasionally", "Not at all"]
    },
    {
      title: "Your age range?",
      subtitle: "Skin needs change as we grow wiser.",
      field: "ageRange",
      options: ["Under 20", "20-30", "30-45", "45+"]
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-12 flex justify-between items-center px-2">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
              step > i + 1 ? "bg-[#d4af37] border-[#d4af37] text-black" : 
              step === i + 1 ? "border-[#d4af37] text-[#d4af37] scale-110 shadow-[0_0_15px_rgba(212,175,55,0.3)]" : 
              "border-gray-800 text-gray-800"
            }`}>
              {step > i + 1 ? <Check size={16} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-[2px] w-12 md:w-24 mx-2 transition-all duration-700 ${step > i + 1 ? "bg-[#d4af37]" : "bg-gray-800"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 md:p-12 relative overflow-hidden"
        >
          {/* Glassmorphism accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">{currentStep.title}</h2>
            <p className="text-gray-500 text-sm mb-10 uppercase tracking-widest">{currentStep.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStep.options.map((option) => {
                const isSelected = currentStep.field === "concerns" 
                  ? data.concerns.includes(option)
                  : (data as any)[currentStep.field] === option;

                return (
                  <button
                    key={option}
                    onClick={() => {
                      if (currentStep.field === "concerns") {
                        toggleConcern(option);
                      } else {
                        setData({ ...data, [currentStep.field]: option });
                        if (step < steps.length) setTimeout(next, 300);
                      }
                    }}
                    className={`p-5 text-left border transition-all duration-300 relative group ${
                      isSelected 
                        ? "border-[#d4af37] bg-[#d4af37]/5 text-white" 
                        : "border-[#1a1a1a] bg-black/40 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold uppercase tracking-widest">{option}</span>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Sparkles size={16} className="text-[#d4af37]" />
                        </motion.div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex justify-between items-center pt-8 border-t border-[#1a1a1a]">
              <button
                onClick={back}
                disabled={step === 1}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  step === 1 ? "text-gray-800 cursor-not-allowed" : "text-gray-500 hover:text-white"
                }`}
              >
                <ChevronLeft size={16} /> Back
              </button>
              
              {step === steps.length ? (
                <button
                  onClick={() => onComplete(data)}
                  disabled={!data.skinType || !data.sensitivity || !data.ageRange}
                  className="bg-[#d4af37] text-black px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-30"
                >
                  Analyze My Skin
                </button>
              ) : currentStep.field === "concerns" ? (
                <button
                  onClick={next}
                  className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center gap-3 justify-center text-[#444] text-[10px] uppercase tracking-[0.2em] font-bold">
        <AlertCircle size={12} /> 
        <span>All data is encrypted and used exclusively for your personalization</span>
      </div>
    </div>
  );
}
