"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Camera, ShoppingBag, Sparkles, ExternalLink } from "lucide-react";
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

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function FormattedBotText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="flex flex-col gap-1.5 text-xs text-gray-800 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Chemical Composition Callout Box
        if (trimmed.includes('🧪 PRESCRIBED') || trimmed.includes('🧪 **PRESCRIBED')) {
          const content = trimmed.replace(/^.*(?:🧪|\*\*PRESCRIBED CHEMICAL FORMULA\*\*|\*\*PRESCRIBED FORMULA\*\*):?\s*/i, '');
          return (
            <div key={idx} className="my-1.5 p-3 bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-lg shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#d4af37] text-[10px] font-extrabold uppercase tracking-widest mb-1">
                🧪 Prescribed Chemical Composition Formula
              </div>
              <p className="text-gray-900 font-mono font-bold text-xs">{content || trimmed}</p>
            </div>
          );
        }

        // Safety Warning Box
        if (trimmed.includes('⚠️ SAFETY') || trimmed.includes('⚠️ **SAFETY')) {
          const content = trimmed.replace(/^.*(?:⚠️|\*\*SAFETY NOTE\*\*):?\s*/i, '');
          return (
            <div key={idx} className="my-1 p-2.5 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs font-medium">
              <div className="font-bold text-[10px] uppercase tracking-wider text-red-700 mb-0.5 flex items-center gap-1">
                ⚠️ Layering & Safety Warning
              </div>
              <span>{content || trimmed}</span>
            </div>
          );
        }

        // Section Headers (🔬, 💡, 📋, 👨‍⚕️, ###)
        if (trimmed.startsWith('🔬') || trimmed.startsWith('💡') || trimmed.startsWith('📋') || trimmed.startsWith('👨‍⚕️') || trimmed.startsWith('###')) {
          const cleanHeader = trimmed.replace(/^###\s*/, '').replace(/\*\*/g, '');
          return (
            <div key={idx} className="mt-2 mb-0.5 pt-1.5 border-t border-gray-100 font-bold text-[11px] uppercase tracking-wider text-[#d4af37] flex items-center gap-1">
              {cleanHeader}
            </div>
          );
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || /^\d+\.\s/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^[-•\d+\.]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-[#d4af37] font-bold text-xs shrink-0">•</span>
              <div>{renderBoldText(bulletContent)}</div>
            </div>
          );
        }

        return <div key={idx}>{renderBoldText(trimmed)}</div>;
      })}
    </div>
  );
}

export default function Chatbot() {
  const { addToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "bot", 
      text: "👨‍⚕️ **GLOWMART AI CLINICAL DERMATOLOGIST**\nWelcome to your personalized skin consultation! I prescribe exact chemical composition formulas and scan site product offers for your skin.\n\nTo begin your diagnostic evaluation, describe your skin issue or tap a choice below:",
      quickQuestions: ["📷 Attach Photo for 98% Scan", "Oily & Acne-Prone", "Dry & Sensitive", "Dark Spots & PIH"],
      askForImage: true
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("glowmart_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setMessages(parsed.messages);
        } else {
          localStorage.removeItem("glowmart_chat_history");
        }
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("glowmart_chat_history", JSON.stringify({
        messages,
        timestamp: Date.now()
      }));
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessageText = async (textToSend: string, imageToSend?: string | null) => {
    if (!textToSend.trim() && !imageToSend) return;

    const userMessage = textToSend.trim();
    const currentImg = imageToSend || undefined;

    const newMessages: Message[] = [...messages, { role: "user", text: userMessage, image: currentImg }];
    setMessages(newMessages);
    setInput("");
    clearImage();
    setIsLoading(true);

    try {
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newMessages })
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
          text: "Sorry, I am having trouble connecting to AI services right now. " + (data.error || "") 
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
        className={`fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all z-50 flex items-center justify-center border border-gray-700 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Skincare Chatbot"
      >
        <MessageCircle size={28} />
      </button>

      <div
        className={`fixed bottom-6 right-6 w-[360px] sm:w-[430px] h-[620px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#d4af37]/20 p-2 rounded-lg border border-[#d4af37]/40">
              <Bot size={22} className="text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm flex items-center gap-1.5">
                Glowmart AI <Sparkles size={14} className="text-[#d4af37]" />
              </h3>
              <p className="text-[10px] text-gray-400">Clinical Dermatologist Assistant</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[92%] rounded-2xl p-3.5 text-sm flex gap-2.5 items-start ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-gray-200 text-black rounded-tl-none shadow-sm'}`}>
                {msg.role === 'bot' && <Bot size={18} className="text-[#d4af37] mt-0.5 shrink-0" />}
                <div className="flex flex-col gap-3 w-full">
                  {msg.image && (
                    <img src={msg.image} alt="User skin scan" className="rounded-lg w-full object-cover max-h-[160px] border border-gray-300" />
                  )}
                  
                  {msg.role === 'bot' ? (
                    <FormattedBotText text={msg.text} />
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Photo Upload CTA Box inside bot bubble */}
                  {msg.askForImage && msg.role === 'bot' && (
                    <div className="bg-[#d4af37]/10 border border-[#d4af37]/40 p-3 rounded-lg flex items-center justify-between gap-3 my-1">
                      <div className="flex items-center gap-2">
                        <Camera size={18} className="text-[#d4af37] shrink-0 animate-pulse" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-900 uppercase">98%+ Clinical Precision</p>
                          <p className="text-[9px] text-gray-600">Attach skin photo for visual scan</p>
                        </div>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-black text-[#d4af37] border border-[#d4af37] px-3 py-1.5 rounded text-[9px] font-bold uppercase hover:bg-[#d4af37] hover:text-black transition-colors shrink-0"
                      >
                        📷 Scan Photo
                      </button>
                    </div>
                  )}

                  {/* Interactive Diagnostic Option Chips */}
                  {msg.quickQuestions && msg.quickQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (q.includes("Photo") || q.includes("Scan")) {
                              fileInputRef.current?.click();
                            } else {
                              sendMessageText(q);
                            }
                          }}
                          className="text-left text-[11px] bg-gray-100 hover:bg-black hover:text-white text-gray-800 border border-gray-300 font-semibold px-2.5 py-1 rounded-full transition-all shadow-2xs"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Recommended Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">Recommended Products & Catalog Offers</p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.products.map((prod) => (
                          <div key={prod.id} className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-center gap-3 relative overflow-hidden">
                            <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <p className="text-[9px] font-bold text-gray-500 uppercase line-clamp-1">{prod.brand}</p>
                                {prod.offerBadge && (
                                  <span className="text-[8px] bg-[#d4af37] text-black font-extrabold px-1 rounded uppercase">
                                    {prod.offerBadge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                              {prod.chemicalComposition && (
                                <p className="text-[8px] text-gray-500 font-mono line-clamp-1">🧪 {prod.chemicalComposition}</p>
                              )}
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xs font-bold text-[#d4af37]">₹{prod.price}</span>
                                {prod.originalPrice && prod.originalPrice > prod.price && (
                                  <span className="text-[10px] text-gray-400 line-through">₹{prod.originalPrice}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => addToCart({ id: prod.id, brand: prod.brand, name: prod.name, price: prod.price, image: prod.image })}
                                className="bg-black text-white p-1.5 rounded hover:bg-gray-800 transition-colors flex items-center gap-1 text-[9px] font-bold uppercase"
                                title="Add to Bag"
                              >
                                <ShoppingBag size={12} /> Add
                              </button>
                              <Link
                                href={`/product/${prod.id}`}
                                className="text-[9px] text-gray-600 hover:text-black flex items-center gap-0.5 font-semibold justify-center"
                              >
                                View <ExternalLink size={10} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && <User size={16} className="text-gray-400 mt-0.5 shrink-0" />}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-3 text-sm bg-white border border-gray-200 text-black rounded-tl-none flex items-center gap-2 shadow-sm">
                <Bot size={16} className="text-[#d4af37]" />
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2 shrink-0">
          {selectedImage && (
            <div className="relative inline-block w-fit mb-1">
              <img src={selectedImage} alt="Preview" className="h-16 rounded-md border border-gray-300" />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors shrink-0"
              title="Upload your face photo for AI Skin Analysis"
            >
              <Camera size={20} />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question or share skin photo..."
              className="flex-1 text-black bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="bg-black text-white p-2.5 rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-400 shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
