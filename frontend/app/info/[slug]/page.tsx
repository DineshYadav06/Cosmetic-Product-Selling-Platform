"use client";

import { notFound } from "next/navigation";
import PageNav from "@/components/PageNav";
import { use } from "react";

/* ─────────────────────────────────────────────────────────────────
   CONTENT DATA
───────────────────────────────────────────────────────────────── */
const CONTENT: Record<
  string,
  {
    title: string;
    subtitle?: string;
    sections: { heading?: string; icon?: string; body: string | string[] }[];
  }
> = {
  /* ── DELIVERY ── */
  delivery: {
    title: "Delivery Information",
    subtitle:
      "Every GLOWMART INDIA order is handled with the same care we invest in curating your beauty experience.",
    sections: [
      {
        heading: "Standard Delivery",
        icon: "📦",
        body: [
          "Estimated 3–5 business days across all major Indian cities and tier-2 towns.",
          "Orders placed before 12:00 PM IST on weekdays are dispatched the same day.",
          "Tracking information is sent via email and SMS within 2 hours of dispatch.",
        ],
      },
      {
        heading: "Express Delivery",
        icon: "⚡",
        body: [
          "Next-day delivery available in Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, and Pune.",
          "Orders must be placed before 2:00 PM IST on weekdays.",
          "Express shipping fee: ₹149. Free for orders above ₹5,000.",
        ],
      },
      {
        heading: "Free Shipping",
        icon: "🎁",
        body: [
          "Complimentary standard shipping on all orders above ₹5,000.",
          "Beauty Pass Gold & Platinum members enjoy free express shipping on every order.",
        ],
      },
      {
        heading: "Climate-Controlled Packaging",
        icon: "🌡️",
        body: [
          "Fragrances, serums, and temperature-sensitive products are shipped in our signature insulated packaging to preserve their integrity during transit.",
          "Each order includes a quality-check seal to ensure your products arrive in perfect condition.",
        ],
      },
      {
        heading: "Shipping Partners",
        icon: "🚚",
        body: [
          "We partner with BlueDart, Delhivery, and FedEx to ensure reliable, pan-India coverage.",
          "Signature-on-delivery is required for orders above ₹10,000 for your security.",
        ],
      },
      {
        heading: "International Shipping",
        icon: "✈️",
        body: [
          "Currently available to UAE, Singapore, UK, and the USA.",
          "International delivery: 7–12 business days. Customs duties are the responsibility of the recipient.",
          "Contact us at support@glowmart.co.in for international order assistance.",
        ],
      },
    ],
  },

  /* ── RETURNS ── */
  returns: {
    title: "Returns & Refunds",
    subtitle:
      "Your satisfaction is our priority. We've made our returns process as effortless as possible.",
    sections: [
      {
        heading: "Eligibility Window",
        icon: "📅",
        body: [
          "Returns are accepted within 14 days of the delivery date.",
          "Products must be unopened, in their original packaging, with all seals, tags, and authenticity cards intact.",
          "Gift sets and limited-edition collections are non-returnable once the outer seal is broken.",
        ],
      },
      {
        heading: "Non-Returnable Items",
        icon: "🚫",
        body: [
          "Opened fragrances, cosmetics, and skincare products cannot be returned due to hygiene and safety regulations.",
          "Personalised, engraved, or monogrammed products.",
          "Products purchased during clearance or final-sale events.",
        ],
      },
      {
        heading: "Damaged or Incorrect Orders",
        icon: "⚠️",
        body: [
          "If your order arrives damaged, incorrect, or tampered with, contact our concierge within 48 hours of delivery.",
          "Email support@glowmart.co.in with your Order ID and clear photographs.",
          "We will arrange an immediate replacement or full refund — no questions asked.",
        ],
      },
      {
        heading: "Refund Process",
        icon: "💳",
        body: [
          "Once your return is received and inspected (2–3 business days), we will notify you via email.",
          "Approved refunds are credited to the original payment method within 5–7 business days.",
          "UPI and wallet refunds are typically processed within 24–48 hours.",
          "Shipping charges are non-refundable unless the return is due to our error.",
        ],
      },
      {
        heading: "How to Initiate a Return",
        icon: "↩️",
        body: [
          "Step 1 — Log in to your GLOWMART account and go to 'My Orders'.",
          "Step 2 — Select the order and click 'Request Return'.",
          "Step 3 — Choose your reason, select items, and submit.",
          "Step 4 — Our team will schedule a free pickup from your address within 24 hours.",
        ],
      },
    ],
  },

  /* ── FAQS ── */
  faqs: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know, answered by our concierge team.",
    sections: [
      {
        heading: "Orders & Delivery",
        icon: "🛍️",
        body: [
          "Q: How do I track my order?\nA: Use the 'Track Order' link in the header with your Order ID and registered email.",
          "Q: Can I modify or cancel my order?\nA: Orders can be cancelled within 30 minutes of placement. After that, please wait for delivery and initiate a return.",
          "Q: Why hasn't my order shipped yet?\nA: If your order hasn't shipped within 2 business days, please contact support@glowmart.co.in with your Order ID.",
          "Q: Do you deliver to rural areas?\nA: We ship to 22,000+ pincodes across India. Enter your pincode at checkout to confirm availability.",
        ],
      },
      {
        heading: "Products & Authenticity",
        icon: "✅",
        body: [
          "Q: Are all products 100% authentic?\nA: Yes. We source directly from official brand distributors and authorized importers. Every product carries an authenticity guarantee.",
          "Q: Where are your products sourced from?\nA: We work with official brand distributors in France, USA, UK, South Korea, and India.",
          "Q: Do you sell testers or refurbished products?\nA: Never. Every product sold is brand-new, sealed, and fresh stock.",
          "Q: How do I know if a fragrance suits me?\nA: Visit any GLOWMART boutique for a complimentary sampling session. Online, you can refer to our detailed scent profiles on each product page.",
        ],
      },
      {
        heading: "Payments & Security",
        icon: "🔒",
        body: [
          "Q: What payment methods do you accept?\nA: We accept Visa, Mastercard, Amex, UPI, Net Banking, Paytm, PhonePe, and EMI (via HDFC, ICICI, Axis).",
          "Q: Is my payment information safe?\nA: Yes. All transactions are secured with 256-bit SSL encryption. We never store your card details.",
          "Q: Can I pay on delivery?\nA: Cash on Delivery (COD) is available for orders up to ₹3,000 with a ₹50 convenience fee.",
          "Q: Do you offer EMI?\nA: Yes, no-cost EMI is available on orders above ₹3,000 via select Bajaj, HDFC, and ICICI credit cards.",
        ],
      },
      {
        heading: "Account & Beauty Pass",
        icon: "👤",
        body: [
          "Q: How do I join the Beauty Pass?\nA: Click 'Join For Free' in the footer. Registration is instant and you start earning points on your very first order.",
          "Q: Do my Beauty Pass points expire?\nA: Points are valid for 12 months from the date of earning. Beauty Pass Platinum members enjoy lifetime validity.",
          "Q: How do I redeem my points?\nA: During checkout, you'll see an option to apply your Glow Points. 100 points = ₹10 discount.",
          "Q: Can I transfer my points to a friend?\nA: Points are non-transferable but you can gift products using our Gift Card feature.",
        ],
      },
      {
        heading: "Gift Services",
        icon: "🎀",
        body: [
          "Q: Do you offer gift wrapping?\nA: Yes, luxury gift wrapping in our signature black-and-gold packaging is available at checkout for ₹250.",
          "Q: Can I add a personalised message?\nA: Yes, a handwritten gift card (up to 200 characters) can be added at checkout at no extra cost.",
          "Q: Do you have gift cards?\nA: Yes, digital gift cards are available in denominations of ₹500, ₹1,000, ₹2,500, and ₹5,000.",
        ],
      },
    ],
  },

  /* ── CAREERS ── */
  careers: {
    title: "Careers",
    subtitle:
      "Join the team redefining luxury beauty in India. We're building something extraordinary.",
    sections: [
      {
        heading: "Why Work at GLOWMART INDIA?",
        icon: "🌟",
        body: [
          "We are a fast-growing luxury beauty platform that blends world-class curation with cutting-edge technology.",
          "Our culture is built on passion, creativity, and a deep respect for craftsmanship.",
          "We offer competitive salaries, beauty product allowances, remote-friendly roles, and clear growth paths.",
        ],
      },
      {
        heading: "Current Openings",
        icon: "💼",
        body: [
          "Beauty Advisor — Mumbai (Full-time, In-store)",
          "Beauty Advisor — Delhi NCR (Full-time, In-store)",
          "Senior E-commerce Operations Manager — Bengaluru (Full-time, Hybrid)",
          "Customer Experience Concierge — Remote (Full-time)",
          "Digital Marketing Specialist — Mumbai (Full-time, Hybrid)",
          "Fragrance Buyer — Mumbai (Full-time)",
          "Full-Stack Developer (Next.js / Python) — Remote (Contract)",
        ],
      },
      {
        heading: "Application Process",
        icon: "📝",
        body: [
          "Step 1 — Send your CV and a short cover letter to careers@glowmart.co.in.",
          "Step 2 — Our talent team will respond within 5 business days.",
          "Step 3 — Video interview with the hiring manager.",
          "Step 4 — Final round with senior leadership.",
          "We aim to complete hiring within 3 weeks of your first application.",
        ],
      },
      {
        heading: "Internships",
        icon: "🎓",
        body: [
          "We offer 3-month internship programs in Marketing, Operations, and Technology for final-year students.",
          "Stipend: ₹15,000–₹25,000/month. High performers are offered full-time roles.",
          "Applications open every January and July. Email internships@glowmart.co.in.",
        ],
      },
    ],
  },

  /* ── PRIVACY ── */
  privacy: {
    title: "Privacy Policy",
    subtitle:
      "Your privacy is a fundamental right. Here's exactly how we protect it.",
    sections: [
      {
        heading: "Information We Collect",
        icon: "📋",
        body: [
          "Personal details you provide: name, email address, phone number, delivery address, and date of birth (for Beauty Pass birthday perks).",
          "Transaction data: order history, payment method type (we never store full card numbers), and wishlist items.",
          "Usage data: pages visited, products viewed, and search queries — to personalise your experience.",
          "Device data: IP address, browser type, and device OS for security and compatibility.",
        ],
      },
      {
        heading: "How We Use Your Data",
        icon: "🔍",
        body: [
          "To process, fulfill, and communicate about your orders.",
          "To personalise product recommendations and on-site experience.",
          "To send promotional emails and offers — only if you've opted in.",
          "To prevent fraud and ensure platform security.",
          "We do NOT sell, rent, or trade your personal data to any third party.",
        ],
      },
      {
        heading: "Data Security",
        icon: "🔐",
        body: [
          "All data is encrypted in transit using TLS 1.3 and at rest using AES-256.",
          "Payments are processed through PCI-DSS compliant gateways (Razorpay / Stripe).",
          "We conduct regular security audits and penetration testing.",
          "Our servers are hosted on ISO 27001-certified infrastructure.",
        ],
      },
      {
        heading: "Cookies",
        icon: "🍪",
        body: [
          "We use essential cookies for session management and security.",
          "Analytics cookies (Google Analytics) help us understand how you use our site — these can be disabled.",
          "Marketing cookies are used only with your explicit consent via our cookie banner.",
        ],
      },
      {
        heading: "Your Rights",
        icon: "⚖️",
        body: [
          "Right to Access — Request a copy of all personal data we hold about you.",
          "Right to Erasure — Request deletion of your account and all associated data.",
          "Right to Correction — Update any incorrect information in your account settings.",
          "Right to Opt-Out — Unsubscribe from marketing communications at any time.",
          "To exercise these rights, email privacy@glowmart.co.in or call +91 1800 000 2580.",
        ],
      },
      {
        heading: "Policy Updates",
        icon: "📅",
        body: [
          "We may update this policy periodically. All changes will be communicated via email (if material) and noted here with a revised date.",
          "Last updated: April 2026.",
        ],
      },
    ],
  },

  /* ── TERMS ── */
  terms: {
    title: "Terms of Service",
    subtitle:
      "By using GLOWMART INDIA, you agree to these terms. Please read them carefully.",
    sections: [
      {
        heading: "Acceptance of Terms",
        icon: "🤝",
        body: [
          "By accessing or placing an order on GLOWMART INDIA, you confirm that you are at least 18 years of age and agree to these Terms of Service.",
          "These terms apply to all users including browsers, vendors, and customers.",
        ],
      },
      {
        heading: "Product Availability & Pricing",
        icon: "💰",
        body: [
          "All prices are in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise.",
          "Prices and product availability are subject to change without prior notice.",
          "We reserve the right to limit order quantities on exclusive, limited-edition, or high-demand releases.",
          "In the event of a pricing error, GLOWMART INDIA reserves the right to cancel the affected order and issue a full refund.",
        ],
      },
      {
        heading: "Account Responsibility",
        icon: "👤",
        body: [
          "You are responsible for maintaining the confidentiality of your account credentials.",
          "Any activity under your account is your responsibility.",
          "GLOWMART INDIA reserves the right to suspend or terminate accounts that violate these terms.",
        ],
      },
      {
        heading: "Intellectual Property",
        icon: "©️",
        body: [
          "All content on this website — including images, text, logos, and design — is the property of GLOWMART INDIA and is protected by applicable copyright and trademark laws.",
          "Unauthorised reproduction, distribution, or modification of any content is strictly prohibited.",
        ],
      },
      {
        heading: "Limitation of Liability",
        icon: "⚠️",
        body: [
          "GLOWMART INDIA shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or products.",
          "Our maximum liability to any customer shall not exceed the value of the order in question.",
        ],
      },
      {
        heading: "Governing Law",
        icon: "⚖️",
        body: [
          "These terms are governed by the laws of India.",
          "Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.",
          "For concerns, contact legal@glowmart.co.in.",
        ],
      },
    ],
  },

  /* ── CORPORATE RESPONSIBILITY ── */
  responsibility: {
    title: "Corporate Responsibility",
    subtitle:
      "Luxury with a conscience. We believe beauty and sustainability are not mutually exclusive.",
    sections: [
      {
        heading: "Our Commitment to the Planet",
        icon: "🌍",
        body: [
          "We are committed to achieving carbon-neutral shipping by 2027 through investments in reforestation and renewable energy credits.",
          "100% of our packaging materials — boxes, tissue paper, and void fill — are either recycled or FSC-certified.",
          "We are eliminating single-use plastics from all our packaging by December 2026.",
        ],
      },
      {
        heading: "Cruelty-Free & Ethical Sourcing",
        icon: "🐇",
        body: [
          "Every product on GLOWMART INDIA is cruelty-free — we do not stock any brand that tests on animals.",
          "We actively vet our brand partners for ethical labour practices and fair-trade compliance.",
          "20% of our portfolio features certified vegan formulations.",
        ],
      },
      {
        heading: "Social Impact — Glow Forward",
        icon: "💛",
        body: [
          "Through our 'Glow Forward' initiative, 1% of annual profits are donated to organisations supporting education and vocational training for young women across India.",
          "In 2025, we supported 3 NGOs — Educate Girls, Nanhi Kali, and Teach For India — impacting over 8,000 girls.",
        ],
      },
      {
        heading: "Diversity & Inclusion",
        icon: "🌈",
        body: [
          "We are proud that 62% of our leadership team are women.",
          "Our product curation actively champions South Asian and indie beauty founders.",
          "We have a zero-tolerance policy for discrimination of any kind within our team and supply chain.",
        ],
      },
      {
        heading: "Reduce, Reuse, Recycle — Our Programme",
        icon: "♻️",
        body: [
          "Return your empty GLOWMART packaging at any of our boutiques and receive 50 Glow Points per item.",
          "We partner with TerraCycle India to responsibly recycle cosmetic waste that cannot be processed conventionally.",
        ],
      },
      {
        heading: "Annual Responsibility Report",
        icon: "📊",
        body: [
          "We publish an annual Corporate Responsibility Report every March detailing our environmental and social impact metrics.",
          "Download the 2025 report or contact csr@glowmart.co.in for more information.",
        ],
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────── */
type Props = { params: Promise<{ slug: string }> };

export default function InfoPage({ params }: Props) {
  const { slug } = use(params);
  const data = CONTENT[slug];

  if (!data) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <PageNav label={data.title} />
      {/* ── Hero Banner ── */}
      <div className="relative py-24 px-6 text-center overflow-hidden border-b border-[#1a1a1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.07)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-4 font-bold">
            Glowmart India
          </p>
          <h1
            className="text-4xl md:text-6xl font-serif tracking-widest uppercase mb-6"
            style={{
              background:
                "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-[#888] text-sm md:text-base leading-relaxed tracking-wider max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-10">
          {data.sections.map((section, si) => (
            <div
              key={si}
              className="bg-[#111] border border-[#1e1e1e] p-8 relative group hover:border-[#2a2a2a] transition-colors"
            >
              {/* Gold top accent */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {section.heading && (
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-white mb-5 flex items-center gap-3">
                  {section.icon && (
                    <span className="text-base">{section.icon}</span>
                  )}
                  {section.heading}
                </h2>
              )}

              <div className="space-y-3 pl-0">
                {Array.isArray(section.body) ? (
                  section.body.map((line, li) => {
                    const isQA = line.startsWith("Q:");
                    const isStep = line.toLowerCase().startsWith("step ");
                    if (isQA) {
                      const [q, ...aParts] = line.split("\nA:");
                      return (
                        <div
                          key={li}
                          className="border-l-2 border-[#d4af37]/30 pl-4 py-1"
                        >
                          <p className="text-white text-sm font-semibold mb-1">
                            {q}
                          </p>
                          <p className="text-[#aaa] text-sm leading-relaxed">
                            {aParts.join("")}
                          </p>
                        </div>
                      );
                    }
                    if (isStep) {
                      return (
                        <div key={li} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[10px] font-bold text-[#d4af37] flex-shrink-0 mt-0.5">
                            {li + 1}
                          </span>
                          <p className="text-[#aaa] text-sm leading-relaxed">
                            {line.replace(/^Step \d+ — /, "")}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p
                        key={li}
                        className="text-[#aaa] text-sm leading-loose flex items-start gap-2"
                      >
                        <span className="text-[#d4af37] mt-1.5 flex-shrink-0">
                          ▸
                        </span>
                        {line}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-[#aaa] text-sm leading-loose">
                    {section.body}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Contact CTA ── */}
        <div className="mt-16 text-center border border-[#1a1a1a] bg-[#0f0f0f] p-10">
          <p className="text-[#666] text-xs uppercase tracking-[0.3em] mb-3">
            Still have questions?
          </p>
          <p className="text-white font-serif text-xl mb-6">
            Our concierge team is here to help
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#d4af37] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
