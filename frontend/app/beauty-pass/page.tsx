"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Star, Zap, Crown, Gift, ShoppingBag, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

/* ─────────────── TIER DATA ─────────────── */
const TIERS = [
  {
    name: "Glow Starter",
    icon: <Star size={28} />,
    color: "#b0b0b0",
    gradient: "linear-gradient(135deg, #3a3a3a 0%, #222 100%)",
    border: "#3a3a3a",
    points: "0 – 999 points",
    perks: [
      "1 Glow Point per ₹100 spent",
      "Birthday surprise gift",
      "Early sale access (24 hrs)",
      "Free standard shipping on ₹5,000+",
      "Member-only newsletter",
    ],
    badge: "Free to join",
  },
  {
    name: "Glow Gold",
    icon: <Zap size={28} />,
    color: "#d4af37",
    gradient: "linear-gradient(135deg, #3a2e10 0%, #1a1500 100%)",
    border: "#d4af37",
    points: "1,000 – 4,999 points",
    perks: [
      "1.5× Glow Points on all orders",
      "Free express shipping always",
      "Quarterly luxury deluxe sample kit",
      "Birthday gift upgrade (₹1,000 value)",
      "Early access to new launches (48 hrs)",
      "Exclusive Gold members sale events",
    ],
    badge: "Most Popular",
  },
  {
    name: "Glow Platinum",
    icon: <Crown size={28} />,
    color: "#e8d5ff",
    gradient: "linear-gradient(135deg, #1a0f2e 0%, #0a0014 100%)",
    border: "#9b72cf",
    points: "5,000+ points",
    perks: [
      "2× Glow Points on every purchase",
      "Free priority express shipping always",
      "Monthly curated luxury gift box",
      "Dedicated personal beauty concierge",
      "Invitations to exclusive brand events",
      "First access to limited-edition launches",
      "Points never expire",
      "VIP-only sale: up to 40% off",
    ],
    badge: "VIP",
  },
];

/* ─────────────── HOW IT WORKS ─────────────── */
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: <ShoppingBag size={22} />,
    title: "Shop & Earn",
    desc: "Earn Glow Points on every purchase. Points are credited within 24 hours of delivery.",
  },
  {
    step: "02",
    icon: <Star size={22} />,
    title: "Level Up",
    desc: "Accumulate points to unlock Gold and Platinum tiers automatically — no manual upgrades needed.",
  },
  {
    step: "03",
    icon: <Gift size={22} />,
    title: "Redeem & Enjoy",
    desc: "100 Glow Points = ₹10 off. Apply at checkout instantly. No cap on redemption.",
  },
  {
    step: "04",
    icon: <Sparkles size={22} />,
    title: "Unlock Perks",
    desc: "Every tier unlocks exclusive benefits — gifts, early access, free shipping and more.",
  },
];

/* ─────────────── FAQs ─────────────── */
const FAQS = [
  {
    q: "Is the Beauty Pass free to join?",
    a: "Yes, completely free. Create a GLOWMART account and you're automatically enrolled as a Glow Starter.",
  },
  {
    q: "When do my points expire?",
    a: "Starter and Gold points are valid for 12 months from the date earned. Platinum members enjoy lifetime point validity.",
  },
  {
    q: "How do I redeem my points?",
    a: "At checkout, you'll see a 'Use Glow Points' option. Select the amount to redeem — 100 points = ₹10 off your order.",
  },
  {
    q: "Can I earn points on sale items?",
    a: "Yes! Points are earned on the final paid amount for all orders including sale items.",
  },
  {
    q: "What happens to my tier if my points drop?",
    a: "Tier status is evaluated annually. Your tier will be retained for 12 months once achieved, giving you time to maintain it.",
  },
  {
    q: "Can I earn points in-store?",
    a: "Absolutely. Give your registered mobile number at any GLOWMART boutique, and points are added to your account instantly.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function BeautyPassPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_100%,rgba(155,114,207,0.08)_0%,transparent_70%)]" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#d4af37]/5 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#9b72cf]/5 blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 px-5 py-2 text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-bold mb-8">
            <Sparkles size={12} />
            Exclusive Loyalty Programme
          </div>

          <h1 className="text-5xl md:text-8xl font-serif tracking-widest uppercase mb-6 leading-none" style={{
            background: "linear-gradient(135deg, #fff 0%, #f5e6c8 30%, #d4af37 55%, #9b72cf 75%, #fff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Beauty Pass
          </h1>

          <p className="text-[#aaa] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
            Shop. Earn. Glow. India's most rewarding luxury beauty programme — crafted for those who demand the best.
          </p>
          <p className="text-[#666] text-sm tracking-widest uppercase mb-12">
            Earn points · Unlock tiers · Claim exclusive VIP perks
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { value: "50,000+", label: "Active Members" },
              { value: "3 Tiers", label: "Of Rewards" },
              { value: "₹10", label: "Per 100 Points" },
              { value: "100%", label: "Free to Join" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#111] border border-[#222] px-6 py-3 text-center min-w-[130px]">
                <p className="text-[#d4af37] font-bold text-xl font-serif">{stat.value}</p>
                <p className="text-[#666] text-[10px] uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <a
            href="#join"
            className="inline-block bg-[#d4af37] text-black px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)]"
          >
            Join For Free
          </a>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-bold mb-3">Simple & Rewarding</p>
            <h2 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative group">
                {/* connector line */}
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-full h-[1px] bg-gradient-to-r from-[#d4af37]/30 to-transparent" style={{ width: "calc(100% - 20px)" }} />

                <div className="bg-[#111] border border-[#1e1e1e] p-8 text-center group-hover:border-[#d4af37]/30 transition-all duration-300 h-full">
                  <div className="text-[#d4af37]/20 font-serif font-bold text-5xl mb-4 leading-none">{step.step}</div>
                  <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] mx-auto mb-5">
                    {step.icon}
                  </div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">{step.title}</h3>
                  <p className="text-[#777] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TIERS ══════════ */}
      <section className="py-24 px-6 border-t border-[#1a1a1a] bg-[#060606]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-bold mb-3">Loyalty Tiers</p>
            <h2 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-white mb-4">Choose Your Glow Level</h2>
            <p className="text-[#666] text-sm max-w-xl mx-auto">Tiers are awarded automatically based on your Glow Points balance. Upgrade happens instantly when you cross the threshold.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className="relative border flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group"
                style={{ borderColor: i === 1 ? tier.border : "#222", background: tier.gradient }}
              >
                {/* Badge */}
                <div
                  className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 border"
                  style={{
                    color: tier.color,
                    borderColor: `${tier.color}50`,
                    background: `${tier.color}10`,
                  }}
                >
                  {tier.badge}
                </div>

                {/* Top glow on hover */}
                <div
                  className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}
                />

                <div className="p-8 flex flex-col flex-1">
                  {/* Icon & Name */}
                  <div className="mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
                      style={{ color: tier.color, borderColor: `${tier.color}30`, background: `${tier.color}10` }}
                    >
                      {tier.icon}
                    </div>
                    <h3 className="text-2xl font-serif font-bold tracking-wider" style={{ color: tier.color }}>
                      {tier.name}
                    </h3>
                    <p className="text-[#555] text-[10px] uppercase tracking-widest mt-1">{tier.points}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] mb-6" style={{ background: `linear-gradient(90deg, ${tier.color}40, transparent)` }} />

                  {/* Perks */}
                  <ul className="space-y-3 flex-1">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-sm text-[#bbb]">
                        <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="#join"
                    className="mt-8 block text-center py-3 text-xs font-bold uppercase tracking-[0.3em] border transition-all duration-300"
                    style={{
                      borderColor: tier.color,
                      color: tier.color,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = tier.color;
                      (e.currentTarget as HTMLElement).style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = tier.color;
                    }}
                  >
                    {i === 0 ? "Join Free" : `Unlock ${tier.name}`}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ EARN POINTS WAYS ══════════ */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-bold mb-3">Bonus Earn Opportunities</p>
            <h2 className="text-3xl font-serif tracking-widest uppercase text-white">More Ways to Earn</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🛍️", title: "Every Purchase", pts: "+1 pt / ₹100", desc: "Earn on every order, always." },
              { icon: "🎂", title: "Birthday Bonus", pts: "+500 pts", desc: "We celebrate you with extra points on your birthday month." },
              { icon: "⭐", title: "Write a Review", pts: "+50 pts", desc: "Share your experience and earn points for every approved review." },
              { icon: "👥", title: "Refer a Friend", pts: "+200 pts", desc: "Both you and your friend earn when they make their first purchase." },
              { icon: "📱", title: "Download the App", pts: "+100 pts", desc: "One-time bonus for downloading the GLOWMART app." },
              { icon: "📷", title: "Social Share", pts: "+30 pts", desc: "Tag @glowmart.india on Instagram and earn on every approved post." },
            ].map((item) => (
              <div key={item.title} className="bg-[#111] border border-[#1e1e1e] p-6 hover:border-[#d4af37]/20 transition-colors group">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wider">{item.title}</h4>
                      <span className="text-[#d4af37] text-xs font-bold bg-[#d4af37]/10 px-2 py-0.5 border border-[#d4af37]/20">{item.pts}</span>
                    </div>
                    <p className="text-[#666] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ JOIN FORM ══════════ */}
      <section id="join" className="py-24 px-6 border-t border-[#1a1a1a] bg-[#060606]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-bold mb-3">Start Glowing Today</p>
            <h2 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-white mb-4">Join For Free</h2>
            <p className="text-[#666] text-sm">Already have an account? <Link href="/auth" className="text-[#d4af37] hover:underline">Sign in here</Link> — you're automatically enrolled.</p>
          </div>

          {submitted ? (
            <div className="bg-[#0f1a0a] border border-[#2a4a1a] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles size={28} className="text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Welcome to Beauty Pass! ✨</h3>
              <p className="text-[#888] text-sm mb-6">
                You're now a <span className="text-[#b0b0b0] font-bold">Glow Starter</span>. Check your email for your welcome gift — 200 bonus Glow Points!
              </p>
              <Link
                href="/"
                className="inline-block bg-[#d4af37] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-[#111] border border-[#1e1e1e] p-8 md:p-12">
              {/* Welcome bonus badge */}
              <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 p-4 mb-8 flex items-center gap-4">
                <Gift size={20} className="text-[#d4af37] flex-shrink-0" />
                <p className="text-sm text-[#aaa]">
                  <span className="text-[#d4af37] font-bold">Welcome Gift: </span>
                  Earn <strong className="text-white">200 Glow Points</strong> (worth ₹20) when you sign up today.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#666] mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-4 text-sm text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#444]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#666] mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-4 text-sm text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#444]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#666] mb-2">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-4 text-sm text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#444]"
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" id="consent" required className="mt-1 accent-[#d4af37]" />
                  <label htmlFor="consent" className="text-[#666] text-xs leading-relaxed">
                    I agree to receive personalised offers, rewards updates, and exclusive member communications from GLOWMART INDIA. You can unsubscribe anytime.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#d4af37] text-black py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] mt-4"
                >
                  Join Beauty Pass — It's Free
                </button>

                <p className="text-[#444] text-[10px] text-center tracking-wider">
                  No credit card required. No subscription fees. Ever.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-bold mb-3">Got Questions?</p>
            <h2 className="text-3xl font-serif tracking-widest uppercase text-white">FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#111] border border-[#1e1e1e] overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#161616] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="text-[#d4af37] flex-shrink-0" />
                    : <ChevronDown size={16} className="text-[#666] flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-[#1a1a1a]">
                    <p className="text-[#888] text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BOTTOM CTA ══════════ */}
      <section className="py-20 px-6 border-t border-[#1a1a1a] bg-[#060606] text-center">
        <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-bold mb-4">Ready to Glow?</p>
        <h2 className="text-3xl md:text-5xl font-serif tracking-widest uppercase text-white mb-6">Your Rewards, Your Way.</h2>
        <p className="text-[#666] text-sm max-w-md mx-auto mb-10">Join over 50,000 beauty lovers already earning on every purchase. It takes less than 60 seconds to sign up.</p>
        <a
          href="#join"
          className="inline-block bg-[#d4af37] text-black px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)]"
        >
          Join For Free
        </a>
      </section>
    </div>
  );
}
