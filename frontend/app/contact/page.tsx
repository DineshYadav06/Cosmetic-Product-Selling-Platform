"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import PageNav from "@/components/PageNav"; // Using relative path based on app structure

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "Order Inquiry",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setIsSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "Order Inquiry",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageNav label="Contact" />
      
      <div className="pt-20 pb-40">
        <div className="max-w-6xl mx-auto px-6">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-serif tracking-widest uppercase mb-4 text-[#d4af37]">Reach Out To Us</h1>
            <p className="text-[#888] max-w-2xl mx-auto text-sm leading-relaxed">
              Our luxury beauty conciliaries are here to assist with product inquiries, corporate gifting, or order support. Average response time is under 4 hours.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
          >
            {/* Form */}
            <motion.div variants={itemVariants} className="md:col-span-2 bg-[#111] border border-[#222] p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />
              <h3 className="font-serif font-bold tracking-widest uppercase text-lg mb-8 border-b-2 border-[#222] pb-4">
                Send a Message
              </h3>
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <CheckCircle size={64} className="text-[#d4af37] mb-4" />
                  <h4 className="font-serif text-2xl tracking-widest uppercase mb-2">Message Received</h4>
                  <p className="text-[#888] text-sm">Thank you for reaching out. A conciliary will be in touch shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs px-4 py-3 uppercase tracking-wider text-center">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">First Name</label>
                      <input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required 
                        className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Last Name</label>
                      <input 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required 
                        className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Email Address</label>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      type="email" 
                      className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Subject</label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-[#ccc] appearance-none"
                    >
                      <option value="Order Inquiry">Order Inquiry</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Returns/Refunds">Returns/Refunds</option>
                      <option value="Corporate Gifting">Corporate Gifting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-[#888] mb-2">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      rows={5} 
                      className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-sm focus:border-[#d4af37] outline-none transition-colors text-white resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#d4af37] text-black py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                      />
                    ) : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>

            <div className="space-y-8 flex flex-col justify-between">
              <motion.div variants={cardVariants} className="bg-[#111] border border-[#222] p-8 text-center group hover:-translate-y-2 hover:border-[#d4af37]/30 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Mail size={32} className="mx-auto mb-4 text-[#d4af37] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h4 className="font-serif font-bold uppercase tracking-widest text-sm mb-2">Email</h4>
                <p className="text-[#888] text-xs">dineshkumaryadav12651@gmail.com</p>
              </motion.div>

              <motion.div variants={cardVariants} className="bg-[#111] border border-[#222] p-8 text-center group hover:-translate-y-2 hover:border-[#d4af37]/30 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Phone size={32} className="mx-auto mb-4 text-[#d4af37] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h4 className="font-serif font-bold uppercase tracking-widest text-sm mb-2">Call</h4>
                <p className="text-[#888] text-xs">+91 955524XXX<br/>Mon-Sat: 10AM - 6PM</p>
              </motion.div>

              <motion.div variants={cardVariants} className="bg-[#111] border border-[#222] p-8 text-center group hover:-translate-y-2 hover:border-[#d4af37]/30 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <MapPin size={32} className="mx-auto mb-4 text-[#d4af37] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h4 className="font-serif font-bold uppercase tracking-widest text-sm mb-2">Headquarters</h4>
                <p className="text-[#888] text-xs">GLOWMART INDIA PVT LTD<br/>Varanasi, Uttar Pradesh, India </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
