"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Sparkles,
  ChevronLeft
} from "lucide-react";
import SellerSidebar from "@/components/seller/Sidebar";
import { useStore } from "@/lib/context/StoreContext";

const CATEGORIES = ["Bestsellers", "Just Dropped", "Makeup", "Skincare", "Fragrance", "Haircare", "Gift Sets"];
const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal", "Mature"];
const SKIN_CONCERNS = ["Acne", "Aging", "Dark Spots", "Dryness", "Dullness", "Large Pores", "Redness", "Fine Lines"];

function SellerAddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useStore();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [form, setForm] = useState({
    brand: "", name: "", price: "", originalPrice: "", image: "", description: "", category: "Makeup", stock: true,
    stockCount: "20",
    skinType: [] as string[], concerns: [] as string[], benefits: ""
  });

  useEffect(() => {
    if (isEditing && editId) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${editId}`);
          if (res.ok) {
            const data = await res.json();
            // Security check: ensure seller owns this product
            if (data.sellerId !== user?.id && user?.role !== 'admin') {
              alert("Access Denied");
              router.push("/seller/products");
              return;
            }
            setForm({
              brand: data.brand || "",
              name: data.name,
              price: data.price.toString(),
              originalPrice: data.originalPrice ? data.originalPrice.toString() : "",
              image: data.image,
              description: data.description || "",
              category: data.category || "General",
              stock: data.inStock !== false,
              stockCount: (data.stockCount || 20).toString(),
              skinType: data.skinType || [],
              concerns: data.concerns || [],
              benefits: data.benefits || ""
            });
          }
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [isEditing, editId, router, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stockCount: Number(form.stockCount),
        inStock: form.stock,
        sellerId: user.id // Crucial: Link to seller
      };

      const url = isEditing ? `/api/products/${editId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccess(true);
      setTimeout(() => router.push("/seller/products"), 1500);
    } catch (err) {
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <Link
            href="/seller/products"
            className="w-10 h-10 border border-[#222] flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-sm"
            title="Back to Products"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">{isEditing ? "Update Masterpiece" : "New Creation"}</h1>
            <p className="text-[#444] text-[9px] uppercase tracking-[0.4em] font-bold mt-1">Marketplace Artisan Portal</p>
          </div>
        </div>
        {user?.sellerDetails?.plan === 'premium' && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#d4af37]">Premium Visibility Active</span>
          </div>
        )}
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full">
        {success ? (
          <div className="bg-[#0a0a0a] border border-[#d4af37]/30 p-20 flex flex-col items-center justify-center text-center animate-fadeIn shadow-2xl">
            <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-[#d4af37]" />
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-widest text-white mb-4">
              Creation {isEditing ? "Refined" : "Published"}
            </h2>
            <p className="text-[#666] text-xs uppercase tracking-[0.3em] font-bold">Your boutique is being updated...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Product Essence */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-8 flex items-center gap-2">
                  <ShoppingBag size={14} /> Product Essence
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Collection</label>
                      <select
                        className="w-full bg-[#0d0d0d] border border-[#1a1a1a] p-4 text-xs font-bold uppercase tracking-widest focus:border-[#d4af37] outline-none"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Boutique / Brand Name</label>
                      <input required placeholder="Your Brand"
                        value={form.brand}
                        className="w-full bg-[#0d0d0d] border border-[#1a1a1a] p-4 text-xs font-bold tracking-widest focus:border-[#d4af37] outline-none text-white"
                        onChange={e => setForm({ ...form, brand: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Creation Name</label>
                    <input required placeholder="Full name of your product"
                      value={form.name}
                      className="w-full bg-[#0d0d0d] border border-[#1a1a1a] p-4 text-sm font-bold tracking-widest focus:border-[#d4af37] outline-none text-white"
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">The Story (Description)</label>
                    <textarea required placeholder="Describe the ingredients, the process, and the result..."
                      value={form.description}
                      rows={5}
                      className="w-full bg-[#0d0d0d] border border-[#1a1a1a] p-4 text-xs tracking-widest focus:border-[#d4af37] outline-none text-white leading-relaxed"
                      onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* AI Categorization */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-8">AI Matching Data</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Target Skin Type</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {SKIN_TYPES.map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={form.skinType.includes(type)} className="accent-[#d4af37]"
                            onChange={e => {
                              const updated = e.target.checked ? [...form.skinType, type] : form.skinType.filter(t => t !== type);
                              setForm({ ...form, skinType: updated });
                            }} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] group-hover:text-white transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Dermal Concerns</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      {SKIN_CONCERNS.map(c => (
                        <label key={c} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={form.concerns.includes(c)} className="accent-[#d4af37]"
                            onChange={e => {
                              const updated = e.target.checked ? [...form.concerns, c] : form.concerns.filter(tc => tc !== c);
                              setForm({ ...form, concerns: updated });
                            }} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] group-hover:text-white transition-colors">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Image Preview */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-6">Gallery</h3>
                <div className="aspect-square bg-[#0d0d0d] border border-dashed border-[#1a1a1a] mb-6 flex items-center justify-center overflow-hidden relative group">
                  {form.image ? (
                    <img src={form.image} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="text-center opacity-20">
                      <ImageIcon size={48} className="mx-auto mb-4" />
                      <p className="text-[9px] font-bold uppercase tracking-widest">Select Product Imagery</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" id="product-img"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setForm({ ...form, image: reader.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} />
                <label htmlFor="product-img" className="block w-full border border-[#1a1a1a] py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-white hover:text-black transition-all">
                  Upload Asset
                </label>
              </div>

              {/* Pricing */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37]">Valuation & Stock</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Listed Price (₹)</label>
                    <input required type="number" value={form.price}
                      className="w-full bg-[#0d0d0d] border border-[#1a1a1a] p-4 text-lg font-serif font-bold text-[#d4af37] focus:border-[#d4af37] outline-none"
                      onChange={e => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#444]">Batch Size (Stock)</label>
                    <input required type="number" value={form.stockCount}
                      className={`w-full bg-[#0d0d0d] border p-4 text-sm font-bold focus:border-[#d4af37] outline-none ${Number(form.stockCount) < 5 ? 'border-red-900' : 'border-[#1a1a1a]'}`}
                      onChange={e => setForm({ ...form, stockCount: e.target.value })} />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer group pt-2">
                  <input type="checkbox" checked={form.stock} className="accent-[#d4af37]" onChange={e => setForm({ ...form, stock: e.target.checked })} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#444] group-hover:text-white">Activate on Marketplace</span>
                </label>
              </div>

              {/* Action */}
              <div className="space-y-4 pt-4">
                <button type="submit" disabled={loading || !form.image}
                  className="w-full bg-[#d4af37] text-black py-5 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-2xl disabled:opacity-50">
                  {loading ? "Publishing..." : (isEditing ? "Save Changes" : "List Product Now")}
                </button>
                <button type="button" onClick={() => router.push("/seller/products")}
                  className="w-full border border-[#1a1a1a] py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] hover:text-white transition-all">
                  Discard
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SellerAddProduct() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <SellerSidebar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#d4af37]" /></div>}>
        <SellerAddProductForm />
      </Suspense>
    </div>
  );
}
