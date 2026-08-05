"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Camera, Image as ImageIcon } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string; image?: string }[]>([
    { role: "bot", text: "Hello! I am your Glowmart AI Assistant. You can even upload your photo for a skin analysis! How can I help you? & Solve the any doubts " }
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("glowmart_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if 1 week has passed since last update
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

  // Save to local storage whenever messages change
  useEffect(() => {
    // Only save if we have more than the default greeting
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

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage = input.trim();
    const currentImg = selectedImage;
    
    const newMessages = [...messages, { role: "user" as const, text: userMessage, image: currentImg || undefined }];
    setMessages(newMessages);
    setInput("");
    clearImage();
    setIsLoading(true);

    try {
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Expanded to pass entire history for ChatGPT-like memory
        body: JSON.stringify({ history: newMessages })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting right now. " + (data.error || "") }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "Network error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all z-50 flex items-center justify-center border border-gray-700 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={28} />
      </button>

      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[580px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <Bot size={24} className="text-[#d4af37]" />
            <div>
              <h3 className="font-bold uppercase tracking-widest text-sm">Glowmart AI</h3>
              <p className="text-[10px] text-gray-400">Beauty & Skincare Assistant</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm flex gap-2 items-start ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-gray-200 text-black rounded-tl-none'}`}>
                {msg.role === 'bot' && <Bot size={16} className="text-[#d4af37] mt-0.5 shrink-0" />}
                <div className="flex flex-col gap-2 w-full">
                  {msg.image && (
                      <img src={msg.image} alt="User upload" className="rounded-md w-full object-cover max-h-[150px] border border-gray-600" />
                  )}
                  {(msg.text || !msg.image) && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                </div>
                {msg.role === 'user' && <User size={16} className="text-gray-400 mt-0.5 shrink-0" />}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="max-w-[80%] rounded-2xl p-3 text-sm bg-white border border-gray-200 text-black rounded-tl-none flex items-center gap-2">
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

        {/* Input Area */}
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
              title="Upload your photo for Skin Analysis"
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
