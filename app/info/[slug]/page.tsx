import { notFound } from "next/navigation";

const CONTENT: Record<string, { title: string, content: string[] }> = {
  "delivery": {
    title: "Delivery Information",
    content: [
      "GLOWMART INDIA provides premium, climate-controlled shipping for all fragrance and cosmetic orders to preserve their integrity.",
      "Standard Delivery: 3-5 business days across major metro cities.",
      "Express Delivery: Next day delivery available in Mumbai, Delhi NCR, and Bengaluru for orders placed before 2 PM.",
      "All orders above ₹5,000 qualify for complimentary secured shipping."
    ]
  },
  "returns": {
    title: "Returns & Refunds",
    content: [
      "We accept returns within 14 days of delivery for unopened products in their original packaging with all seals intact.",
      "Due to hygiene and safety standards, opened cosmetics or fragrances cannot be returned.",
      "If you receive a damaged product, please contact our concierge within 48 hours with photographic evidence for an immediate replacement."
    ]
  },
  "faq": {
    title: "Frequently Asked Questions",
    content: [
      "Q: Are your products authentic? A: Yes, 100%. We source directly from official brand distributors.",
      "Q: How can I track my order? A: Use the 'Track Order' link in the top menu with your Order ID.",
      "Q: Do you offer gift wrapping? A: Yes, luxury gift wrapping is available at checkout for ₹250."
    ]
  },
  "careers": {
    title: "Careers",
    content: [
      "Join the team revolutionizing luxury beauty in India.",
      "We are currently hiring for: Beauty Advisors (Mumbai, Delhi), E-commerce Operations Manager (Bengaluru), and Customer Experience Concierge (Remote).",
      "Send your resume to careers@glowmart.co.in"
    ]
  },
  "privacy": {
    title: "Privacy Policy",
    content: [
      "Your privacy is critically important to us.",
      "GLOWMART INDIA encrypts all personal and payment data using industry-standard AES-256.",
      "We do not sell your personal data to third parties. Information is only used to fulfill orders and improve your shopping experience."
    ]
  },
  "terms": {
    title: "Terms of Service",
    content: [
      "By using GLOWMART INDIA, you agree to these terms.",
      "Prices are subject to change without notice.",
      "We reserve the right to limit order quantities on exclusive or limited-edition releases."
    ]
  },
  "corporate": {
    title: "Corporate Responsibility",
    content: [
      "We believe luxury shouldn't cost the earth.",
      "All our shipping materials are 100% recyclable.",
      "We partner with NGOs to support education for girls across India, donating 1% of annual profits."
    ]
  }
};

export default function InfoPage({ params }: { params: { slug: string } }) {
  const data = CONTENT[params.slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-40">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-serif tracking-widest uppercase mb-12" style={{
            background: "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          {data.title}
        </h1>
        <div className="space-y-8">
          {data.content.map((paragraph, idx) => (
            <p key={idx} className="text-[#aaa] leading-loose text-sm tracking-wider">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
