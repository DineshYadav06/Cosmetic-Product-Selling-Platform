"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle } from "lucide-react";

export default function ReviewSection({ productId, existingReviews = [] }: { productId: string, existingReviews: any[] }) {
  const [reviews, setReviews] = useState(existingReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment || !name) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment })
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviewItems || []);
        setSubmitted(true);
        setComment("");
        setName("");
        setRating(0);
      }
    } catch (err) {
      console.error("Review error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-32 border-t border-[#222] pt-16">
      <h2 className="text-2xl font-serif font-bold tracking-widest uppercase mb-10">
        Customer Reviews
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="col-span-1">
          {submitted ? (
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 p-8 text-center animate-pulse">
              <CheckCircle size={40} className="text-[#d4af37] mx-auto mb-4" />
              <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Thank You!</h3>
              <p className="text-[#888] text-[10px] uppercase tracking-widest leading-relaxed">Your review has been submitted and helps our artisan community.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Write another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-2">Write a Review</h3>
              
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-[#444] mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star 
                        size={24} 
                        fill={(hoverRating || rating) >= s ? "#d4af37" : "none"} 
                        className={(hoverRating || rating) >= s ? "text-[#d4af37]" : "text-[#222]"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-xs focus:border-[#d4af37] focus:outline-none transition-all uppercase tracking-widest text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  placeholder="Share your experience with this product..."
                  required
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-xs focus:border-[#d4af37] focus:outline-none transition-all uppercase tracking-widest text-white resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                disabled={loading || !rating}
                className="w-full bg-[#d4af37] text-black py-4 uppercase font-bold tracking-[0.2em] text-[10px] hover:bg-white shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Submit Review"}
              </button>
            </form>
          )}

          {/* Stats Bar (Simplified for now) */}
          <div className="mt-12 pt-12 border-t border-[#111]">
             <p className="text-[10px] text-[#444] uppercase tracking-widest font-bold mb-4">Marketplace Standards</p>
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-[#666]">
                  <CheckCircle size={12} className="text-[#d4af37]" /> Verified Purchase Only
                </div>
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-[#666]">
                  <CheckCircle size={12} className="text-[#d4af37]" /> Authenticity Guaranteed
                </div>
             </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex justify-between items-end mb-10 border-b border-[#111] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#444]">Community Feedback</h3>
            <span className="text-[10px] text-[#444] uppercase tracking-widest font-bold">{reviews.length} Reviews Found</span>
          </div>
          
          <div className="space-y-10 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {reviews.length > 0 ? (
              [...reviews].reverse().map((review: any, i: number) => (
                <div key={i} className="border-b border-[#0f0f0f] pb-10 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex text-[#d4af37]">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-white font-bold tracking-wide text-sm">{review.rating >= 4 ? "Exceptional" : "Genuine Review"}</span>
                    </div>
                    <span className="text-[9px] text-[#333] uppercase tracking-widest font-bold">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#888] font-light text-sm leading-relaxed mb-4 italic">"{review.comment}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center text-[#d4af37] text-[10px] font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <span className="text-[#555] text-[10px] uppercase tracking-widest font-bold">{review.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-30">
                <Star size={40} className="mx-auto mb-4" />
                <p className="text-xs uppercase tracking-[0.2em]">No reviews yet. Be the first to share your thoughts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
