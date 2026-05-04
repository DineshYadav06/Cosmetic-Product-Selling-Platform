"use client";

import { useState } from "react";
import { Check, ArrowRight, Star, Shield, Zap, Sparkles } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function SellerPricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      name: "Basic",
      tagline: "For Emerging Creators",
      price: "0",
      features: [
        "Up to 10 Product Listings",
        "Standard Visibility",
        "10% Sales Commission",
        "Community Support",
        "Basic Analytics"
      ],
      icon: Zap,
      button: "Start Free",
      color: "#888"
    },
    {
      name: "Pro",
      tagline: "The Artisan Choice",
      price: "499",
      recommended: true,
      features: [
        "Unlimited Product Listings",
        "Featured in Categories",
        "5% Sales Commission",
        "Email Support",
        "Sales Insights Dashboard",
        "Marketing Badge (Pro)"
      ],
      icon: Star,
      button: "Go Pro Now",
      color: "#d4af37"
    },
    {
      name: "Premium",
      tagline: "Empire Builders",
      price: "999",
      features: [
        "Priority Search Ranking",
        "Featured on Homepage",
        "2% Sales Commission",
        "24/7 Dedicated Support",
        "Advanced AI Analytics",
        "Premium Verification Badge"
      ],
      icon: Shield,
      button: "Master GLOWMART",
      color: "#fff"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-4">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">Accelerate Your Growth</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Choose Your Store Tier</h1>
          <p className="text-[#666] text-sm uppercase tracking-widest leading-loose">
            Flexible plans designed to scale with your business. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col bg-[#0a0a0a] border ${plan.recommended ? 'border-[#d4af37]' : 'border-[#1a1a1a]'} p-8 transition-all hover:-translate-y-2 group`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className="w-12 h-12 rounded-sm bg-[#111] border border-[#222] flex items-center justify-center mb-6">
                  <plan.icon size={24} style={{ color: plan.color }} />
                </div>
                <h3 className="text-2xl font-serif font-bold tracking-widest uppercase mb-1">{plan.name}</h3>
                <p className="text-[#444] text-[10px] font-bold uppercase tracking-widest">{plan.tagline}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-serif font-bold">₹{plan.price}</span>
                  <span className="text-[#555] text-xs font-bold uppercase tracking-widest">/ Month</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-[#d4af37]" />
                    </div>
                    <span className="text-sm text-[#888]">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                  ${plan.recommended 
                    ? 'bg-[#d4af37] text-black hover:bg-white' 
                    : 'bg-[#111] text-white border border-[#222] hover:border-white'}`}
              >
                {plan.button}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-serif font-bold tracking-widest uppercase mb-4">Enterprise Solutions</h2>
            <p className="text-[#666] text-sm leading-relaxed">
              Managing a high-volume cosmetic brand? We offer custom solutions with dedicated account managers, 
              custom API access, and logistics support.
            </p>
          </div>
          <Link href="/contact" className="px-10 py-4 border border-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Contact Concierge
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
