"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Camera, ShoppingBag, Sparkles, ExternalLink, RotateCcw, ShieldAlert, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { useStore } from "../lib/context/StoreContext";

interface ProductRec {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  offerBadge?: string;
  chemicalComposition?: string;
  image: string;
  reason?: string;
}

interface Message {
  role: "user" | "bot";
  text: string;
  image?: string;
  products?: ProductRec[];
  quickQuestions?: string[];
  askForImage?: boolean;
}

const INITIAL_WELCOME_MESSAGE: Message = { 
  role: "bot", 
  text: "🌿 **Welcome to GLOWMART Skin Care**\nHello! I'm your dedicated AI Dermatology Advisor. I'm here to understand your skin's unique needs, diagnose concerns, and prescribe the gentlest, most effective chemical formulations.\n\nTell me what your skin is experiencing today, or select an option below:",
  quickQuestions: ["📷 Scan Face Photo", "Acne & Redness", "Dry & Sensitive Skin", "Dark Circles & Eyes"],
  askForImage: true
};

function renderCleanText(text: string) {
  if (!text) return null;
  // Strip excess raw markdown formatting clutter
  const cleaned = text.replace(/\*\*/g, '').trim();
  return <span className="text-gray-200">{cleaned}</span>;
}

function FormattedBotText({ text }: { text: string }) {
  if (!text) return null;

  // Split into paragraphs / sections
  const sections = text.split('\n\n');

  return (
    <div className="flex flex-col gap-3 text-xs leading-relaxed font-sans text-gray-200 w-full overflow-hidden break-words">
      {sections.map((section, sIdx) => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return null;

        // 1. Prescribed Chemical Formula Box
        if (trimmedSection.includes('PRESCRIBED') || trimmedSection.includes('🧪')) {
          // Extract content after header lines
          const lines = trimmedSection.split('\n');
          const formulaLines = lines.filter(l => !l.toLowerCase().includes('prescribed') && !l.includes('🧪')).join(' ').trim();
          const displayFormula = formulaLines || lines[lines.length - 1].replace(/^[🧪\*\s:]+/, '').trim();

          return (
            <div key={sIdx} className="my-1 p-3 bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-xl w-full overflow-hidden">
              <div className="flex items-center gap-1.5 text-[#d4af37] text-[10px] font-extrabold uppercase tracking-widest mb-1">
                🧪 Prescribed Active Formula
              </div>
              <p className="text-white font-mono font-bold text-xs break-words">
                {displayFormula.replace(/\*\*/g, '')}
              </p>
            </div>
          );
        }

        // 2. Safety Warning Box
        if (trimmedSection.includes('SAFETY') || trimmedSection.includes('⚠️')) {
          const lines = trimmedSection.split('\n');
          const warningContent = lines.filter(l => !l.toLowerCase().includes('safety') && !l.includes('⚠️')).join(' ').trim() || lines[lines.length - 1].replace(/^[⚠️\*\s:]+/, '');

          return (
            <div key={sIdx} className="my-1 p-3 bg-amber-950/40 border border-amber-500/30 text-amber-200 rounded-xl text-xs w-full overflow-hidden">
              <div className="font-bold text-[10px] uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                <ShieldAlert size={13} /> Skincare Care Note
              </div>
              <p className="text-amber-100/90 font-medium leading-relaxed break-words">
                {warningContent.replace(/\*\*/g, '')}
              </p>
            </div>
          );
        }

        // 3. Section Headers (Clinical Diagnosis, Mechanism, Routine)
        const lines = trimmedSection.split('\n');
        return (
          <div key={sIdx} className="space-y-1.5 w-full overflow-hidden">
            {lines.map((line, lIdx) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;

              // Header lines (🔬, 💡, 📋, 🌿, 👨‍⚕️, ###)
              if (
                trimmedLine.startsWith('🔬') || 
                trimmedLine.startsWith('💡') || 
                trimmedLine.startsWith('📋') || 
                trimmedLine.startsWith('🌿') || 
                trimmedLine.startsWith('👨‍⚕️') || 
                trimmedLine.startsWith('###')
              ) {
                const cleanHeader = trimmedLine.replace(/^###\s*/, '').replace(/\*\*/g, '');
                return (
                  <div key={lIdx} className="pt-2 font-serif font-bold text-[12px] tracking-wide text-[#d4af37] flex items-center gap-1.5 border-t border-white/5">
                    {cleanHeader}
                  </div>
                );
              }

              // Bullet Routine lines (- or •)
              if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ') || /^\d+\.\s/.test(trimmedLine)) {
                const bulletText = trimmedLine.replace(/^[-•\d+\.]\s*/, '').replace(/\*\*/g, '');
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1 w-full overflow-hidden">
                    <span className="text-[#d4af37] font-bold text-xs shrink-0 mt-0.5">•</span>
                    <span className="text-gray-300 text-xs font-light leading-relaxed break-words">{bulletText}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="text-gray-300 text-xs leading-relaxed break-words">
                  {trimmedLine.replace(/\*\*/g, '')}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function Chatbot() {
  const { addToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetSession = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setSelectedImage(null);
    setInput("");
    try {
      localStorage.removeItem("glowmart_chat_history");
      sessionStorage.removeItem("glowmart_chat_history");
    } catch (e) {
      console.error("Failed to clear chat storage", e);
    }
  };

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("glowmart_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load chat session history", e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      try {
        sessionStorage.setItem("glowmart_chat_history", JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat session", e);
      }
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessageText = async (userText: string, imageBase64?: string | null) => {
    if ((!userText.trim() && !imageBase64) || isLoading) return;

    const newMsg: Message = { 
      role: "user", 
      text: userText,
      image: imageBase64 || undefined
    };

    const updatedHistory = [...messages, newMsg];
    setMessages(updatedHistory);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const apiHistory = updatedHistory.map(m => ({
        role: m.role,
        text: m.text,
        image: m.image
      }));

      const response = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: apiHistory })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: "bot", 
          text: data.reply,
          products: data.products && data.products.length > 0 ? data.products : undefined,
          quickQuestions: data.quickQuestions && data.quickQuestions.length > 0 ? data.quickQuestions : undefined,
          askForImage: data.askForImage
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "bot", 
          text: "I am having trouble connecting to AI services right now. " + (data.error || "") 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "Network error. Please check your internet connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessageText(input, selectedImage);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-[#d4af37] text-black p-4 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:bg-white transition-all z-50 flex items-center justify-center border-2 border-black ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Skincare Chatbot"
      >
        <MessageCircle size={26} className="fill-black" />
      </button>

      <div
        className={`fixed bottom-6 right-6 w-[360px] sm:w-[440px] h-[640px] max-h-[85vh] bg-[#0c0c0c] border-2 border-[#d4af37]/40 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center shrink-0 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="bg-[#d4af37]/20 p-2 rounded-xl border border-[#d4af37]/40">
              <Bot size={20} className="text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-serif font-bold uppercase tracking-widest text-sm text-[#d4af37] flex items-center gap-1.5">
                GLOWMART AI <Sparkles size={14} className="text-[#d4af37] animate-pulse" />
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">Skin Care Dermatology Advisor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleResetSession} 
              className="text-gray-400 hover:text-[#d4af37] transition-colors p-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded-lg"
              title="Reset Consultation Session"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#0a0a0a] flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
              <div className={`max-w-[90%] rounded-2xl p-3.5 text-xs flex gap-2.5 items-start overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-[#d4af37] text-black font-medium rounded-tr-none shadow-md' 
                  : 'bg-[#141414] border border-[#242424] text-white rounded-tl-none shadow-inner'
              }`}>
                {msg.role === 'bot' && <Bot size={18} className="text-[#d4af37] mt-0.5 shrink-0" />}
                <div className="flex flex-col gap-3 w-full overflow-hidden">
                  {msg.image && (
                    <img src={msg.image} alt="User skin scan" className="rounded-lg w-full object-cover max-h-[160px] border border-white/10" />
                  )}
                  
                  {msg.role === 'bot' ? (
                    <FormattedBotText text={msg.text} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-xs font-medium break-words text-black">{msg.text}</p>
                  )}

                  {/* Recommended Products Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-white/10 w-full overflow-hidden">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#d4af37] mb-2 flex items-center gap-1">
                        <ShoppingBag size={12} /> Prescribed Product Matches
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {msg.products.map(p => (
                          <div key={p.id} className="w-[140px] shrink-0 bg-black border border-[#262626] rounded-xl p-2.5 flex flex-col justify-between group">
                            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2 bg-gray-900 border border-white/10">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              {p.offerBadge && (
                                <span className="absolute top-1 right-1 bg-[#d4af37] text-black font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase">
                                  {p.offerBadge}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-[#d4af37] uppercase line-clamp-1">{p.brand}</span>
                            <h4 className="text-[11px] font-serif font-bold text-white line-clamp-1 mb-1">{p.name}</h4>
                            <div className="flex items-baseline gap-1 mt-1 mb-2">
                              <span className="text-xs font-bold text-white">₹{p.price}</span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <span className="text-[9px] text-gray-500 line-through">₹{p.originalPrice}</span>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart({ id: p.id, brand: p.brand, name: p.name, price: p.price, image: p.image })}
                              className="w-full bg-[#d4af37] text-black hover:bg-white transition-colors text-[9px] font-extrabold py-1.5 rounded-lg uppercase tracking-wider"
                            >
                              Add to Bag
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Diagnostic Suggestions */}
                  {msg.quickQuestions && msg.quickQuestions.length > 0 && i === messages.length - 1 && !isLoading && (
                    <div className="mt-2 pt-2 flex flex-wrap gap-1.5 w-full">
                      {msg.quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (q.includes("Attach Photo") || q.includes("Scan Face Photo") || q.includes("Upload Photo")) {
                              fileInputRef.current?.click();
                            } else {
                              sendMessageText(q);
                            }
                          }}
                          className="text-[10px] bg-[#1a1a1a] hover:bg-[#d4af37] hover:text-black border border-[#333] text-gray-300 font-bold px-3 py-1.5 rounded-full transition-all text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#141414] border border-[#242424] rounded-2xl rounded-tl-none p-3 shadow-inner flex items-center gap-2 text-xs text-[#d4af37] font-medium">
                <Bot size={18} className="animate-spin text-[#d4af37]" />
                <span>Formulating skin care analysis...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Selected Image Preview before send */}
        {selectedImage && (
          <div className="px-4 py-2 bg-black border-t border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={selectedImage} alt="Selected attachment" className="w-8 h-8 rounded object-cover border border-[#d4af37]/40" />
              <span className="text-[10px] text-gray-300 font-bold uppercase">Face photo attached</span>
            </div>
            <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-400">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-black border-t border-[#222] flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl border transition-colors ${selectedImage ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'bg-[#141414] border-[#262626] text-gray-400 hover:text-white'}`}
            title="Attach face photo for visual scan"
          >
            <Camera size={18} />
          </button>

          <input
            type="text"
            placeholder="Ask about your skin, acne, dark spots..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 text-xs bg-[#141414] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
          />

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="bg-[#d4af37] text-black p-2.5 rounded-xl hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
