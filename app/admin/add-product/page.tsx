"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, LayoutDashboard, Package, ClipboardList, ShoppingBag, Settings, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import AdminSidebar from "../../../components/admin/Sidebar";

const CATEGORIES = ["Bestsellers", "Just Dropped", "Makeup", "Skincare", "Fragrance", "Haircare", "Gift Sets"];
const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal", "Mature"];
const SKIN_CONCERNS = ["Acne", "Aging", "Dark Spots", "Dryness", "Dullness", "Large Pores", "Redness", "Fine Lines"];

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [form, setForm] = useState({
    brand: "", name: "", price: "", originalPrice: "", image: "", description: "", category: "Bestsellers", stock: true,
    stockCount: "50",
    skinType: [] as string[], concerns: [] as string[], benefits: ""
  });

  // Fetch product if editing
  useEffect(() => {
    if (isEditing && editId) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${editId}`);
          if (res.ok) {
            const data = await res.json();
            setForm({
              brand: data.brand || "",
              name: data.name,
              price: data.price.toString(),
              originalPrice: data.originalPrice ? data.originalPrice.toString() : "",
              image: data.image,
              description: data.description || "",
              category: data.category || "General",
              stock: data.inStock !== false, // default true
              stockCount: (data.stockCount || 50).toString(),
              skinType: data.skinType || [],
              concerns: data.concerns || [],
              benefits: data.benefits || ""
            });
          } else {
            alert("Failed to load product for editing");
            router.push("/admin/products");
          }
        } catch(err) {
          alert("Error fetching product");
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [isEditing, editId, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        brand: form.brand,
        name: form.name,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        image: form.image,
        description: form.description,
        category: form.category,
        inStock: form.stock,
        stockCount: Number(form.stockCount),
        skinType: form.skinType,
        concerns: form.concerns,
        benefits: form.benefits
      };

      const url = isEditing && editId ? `/api/products/${editId}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch(err) {
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-1 flex flex-col overflow-auto relative items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      {/* Top Bar */}
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">{isEditing ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-[#555] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
            {isEditing ? "Update existing product details" : "Add a new item to the store catalog"}
          </p>
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        {success ? (
          <div className="bg-[#0a0a0a] border border-green-800 p-10 flex flex-col items-center justify-center text-center animate-fadeIn">
            <CheckCircle2 size={48} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-serif font-bold tracking-widest text-white mb-2">
              Product {isEditing ? "Updated" : "Added"}
            </h2>
            <p className="text-[#888] text-sm uppercase tracking-widest">Redirecting to products list...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              {/* Basic Info */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative">
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                 <h3 className="font-serif font-bold tracking-widest uppercase text-xs mb-6 pb-4 border-b border-[#1a1a1a]">Basic Information</h3>
                 
                 <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Brand Name*</label>
                       <input required placeholder="e.g. Fenty Beauty" 
                          value={form.brand}
                          className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-xs font-bold tracking-wider"
                          onChange={e => setForm({...form, brand: e.target.value})}/>
                     </div>
                     <div>
                       <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Category*</label>
                       <select 
                         className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-xs uppercase tracking-widest font-bold"
                         value={form.category}
                         onChange={e => setForm({...form, category: e.target.value})}
                       >
                         {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Product Name*</label>
                     <input required placeholder="e.g. Pro Filt'r Foundation" 
                        value={form.name}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-xs"
                        onChange={e => setForm({...form, name: e.target.value})}/>
                   </div>
                   
                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Description</label>
                     <textarea placeholder="Product description" 
                        value={form.description}
                        rows={3}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-xs"
                        onChange={e => setForm({...form, description: e.target.value})}></textarea>
                   </div>

                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Product Benefits (AI Insights)</label>
                     <textarea placeholder="e.g. Instantly hydrates and brightens dull skin..." 
                        value={form.benefits}
                        rows={2}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-xs italic"
                        onChange={e => setForm({...form, benefits: e.target.value})}></textarea>
                   </div>
                 </div>
              </div>

              {/* AI Categorization */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative">
                 <h3 className="font-serif font-bold tracking-widest uppercase text-xs mb-6 pb-4 border-b border-[#1a1a1a]">AI Targeting (Skincare Only)</h3>
                 
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-3">Skin Types</label>
                     <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                       {SKIN_TYPES.map(type => (
                         <label key={type} className="flex items-center gap-2 cursor-pointer group">
                           <input 
                             type="checkbox" 
                             checked={form.skinType.includes(type)}
                             onChange={(e) => {
                               const updated = e.target.checked 
                                 ? [...form.skinType, type]
                                 : form.skinType.filter(t => t !== type);
                               setForm({...form, skinType: updated});
                             }}
                             className="accent-[#d4af37] w-3 h-3" 
                           />
                           <span className="text-[10px] text-[#666] uppercase tracking-widest font-bold group-hover:text-white transition-colors">{type}</span>
                         </label>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-3">Skin Concerns</label>
                     <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                       {SKIN_CONCERNS.map(concern => (
                         <label key={concern} className="flex items-center gap-2 cursor-pointer group">
                           <input 
                             type="checkbox" 
                             checked={form.concerns.includes(concern)}
                             onChange={(e) => {
                               const updated = e.target.checked 
                                 ? [...form.concerns, concern]
                                 : form.concerns.filter(c => c !== concern);
                               setForm({...form, concerns: updated});
                             }}
                             className="accent-[#d4af37] w-3 h-3" 
                           />
                           <span className="text-[10px] text-[#666] uppercase tracking-widest font-bold group-hover:text-white transition-colors">{concern}</span>
                         </label>
                       ))}
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Side Column */}
            <div className="w-full lg:w-80 space-y-6">
              {/* Media */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                 <h3 className="font-serif font-bold tracking-widest uppercase text-xs mb-6 pb-4 border-b border-[#1a1a1a]">Media</h3>
                 <div className="w-full aspect-square bg-[#111] border border-[#333] flex items-center justify-center overflow-hidden mb-4 relative group">
                   {form.image ? (
                     <img src={form.image} alt="Preview" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110" />
                   ) : (
                     <div className="text-center text-[#444]">
                       <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                       <span className="text-[10px] uppercase tracking-widest font-bold">No Image</span>
                     </div>
                   )}
                 </div>
                 <input type="file" accept="image/*" 
                    className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-[10px] font-bold uppercase tracking-widest"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setForm({...form, image: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }}/>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 space-y-6">
                 <h3 className="font-serif font-bold tracking-widest uppercase text-xs mb-6 pb-4 border-b border-[#1a1a1a]">Inventory</h3>
                 
                 <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Price (₹)*</label>
                      <input required type="number" placeholder="3200" 
                         value={form.price}
                         className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm font-serif font-bold"
                         onChange={e => setForm({...form, price: e.target.value})}/>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Stock Count*</label>
                      <input required type="number" placeholder="50" 
                         value={form.stockCount}
                         className={`w-full bg-[#111] border p-3 text-white focus:border-[#d4af37] outline-none text-sm font-bold ${Number(form.stockCount) < 10 ? 'border-red-900 text-red-500' : 'border-[#333]'}`}
                         onChange={e => setForm({...form, stockCount: e.target.value})}/>
                      {Number(form.stockCount) < 10 && <p className="text-[9px] text-red-500 font-bold uppercase mt-1 tracking-widest">Low Stock Alert</p>}
                    </div>
                 </div>

                 <label className="flex items-center gap-3 cursor-pointer group pt-2">
                   <input type="checkbox" checked={form.stock} onChange={e => setForm({...form, stock: e.target.checked})} className="accent-[#d4af37] w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[#888] group-hover:text-white transition-colors">Visible in Store</span>
                 </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button 
                   type="submit"
                   disabled={loading}
                   className="w-full bg-[#d4af37] text-black py-4 uppercase font-bold tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-[0_5px_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (isEditing ? 'Update Product' : 'Publish to Catalog')}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/products")}
                  className="w-full border border-[#1a1a1a] text-[#555] py-4 uppercase font-bold tracking-[0.2em] text-[10px] hover:text-white hover:border-[#333] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <AdminSidebar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[#d4af37]" /></div>}>
        <AddProductForm />
      </Suspense>
    </div>
  );
}
