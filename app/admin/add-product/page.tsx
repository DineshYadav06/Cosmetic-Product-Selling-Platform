"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, LayoutDashboard, Package, ClipboardList, ShoppingBag, Settings, Image as ImageIcon, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["Makeup", "Skincare", "Fragrance", "Haircare", "Gift Sets"];

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [form, setForm] = useState({
    brand: "", name: "", price: "", originalPrice: "", image: "", category: "Makeup", stock: true
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
              category: data.category || "General",
              stock: data.inStock !== false // default true
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
        category: form.category,
        inStock: form.stock
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
          <h1 className="text-2xl font-serif font-bold tracking-widest">{isEditing ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-[#555] text-xs uppercase tracking-widest mt-1">
            {isEditing ? "Update existing product details" : "Add a new item to the store catalog"}
          </p>
        </div>
      </div>

      <div className="p-8 max-w-4xl w-full">
        {success ? (
          <div className="bg-[#0a0a0a] border border-green-800 p-10 flex flex-col items-center justify-center text-center animate-fadeIn">
            <CheckCircle2 size={48} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-serif font-bold tracking-widest text-white mb-2">
              Product {isEditing ? "Updated" : "Added"}
            </h2>
            <p className="text-[#888] text-sm uppercase tracking-widest">Redirecting to products list...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              {/* Basic Info */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative">
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                 <h3 className="font-serif font-bold tracking-widest uppercase text-sm mb-6 pb-4 border-b border-[#1a1a1a]">Basic Information</h3>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Brand Name*</label>
                     <input required placeholder="e.g. Fenty Beauty" 
                        value={form.brand}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm font-bold tracking-wider"
                        onChange={e => setForm({...form, brand: e.target.value})}/>
                   </div>
                   
                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Product Name*</label>
                     <input required placeholder="e.g. Pro Filt'r Foundation" 
                        value={form.name}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm"
                        onChange={e => setForm({...form, name: e.target.value})}/>
                   </div>

                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Category*</label>
                     <select 
                       className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm"
                       value={form.category}
                       onChange={e => setForm({...form, category: e.target.value})}
                     >
                       {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                     </select>
                   </div>
                 </div>
              </div>

              {/* Pricing */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                 <h3 className="font-serif font-bold tracking-widest uppercase text-sm mb-6 pb-4 border-b border-[#1a1a1a]">Pricing & Stock</h3>
                 
                 <div className="flex gap-4 mb-4">
                   <div className="flex-1">
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Selling Price (₹)*</label>
                     <input required type="number" placeholder="e.g. 3200" 
                        value={form.price}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm font-serif font-bold"
                        onChange={e => setForm({...form, price: e.target.value})}/>
                   </div>
                   <div className="flex-1">
                     <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Original Price (₹)</label>
                     <input type="number" placeholder="e.g. 3800" 
                        value={form.originalPrice}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-sm font-serif text-[#888]"
                        onChange={e => setForm({...form, originalPrice: e.target.value})}/>
                   </div>
                 </div>

                 <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                   <input type="checkbox" checked={form.stock} onChange={e => setForm({...form, stock: e.target.checked})} className="accent-[#d4af37] w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest text-[#888] group-hover:text-white transition-colors">Product is currently in stock</span>
                 </label>
              </div>
            </div>

            {/* Media & Actions */}
            <div className="w-full md:w-80 space-y-6">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                 <h3 className="font-serif font-bold tracking-widest uppercase text-sm mb-6 pb-4 border-b border-[#1a1a1a]">Media</h3>
                 
                 <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">Image URL*</label>
                 <input required placeholder="https://..." 
                    value={form.image}
                    className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#d4af37] outline-none text-xs mb-4"
                    onChange={e => setForm({...form, image: e.target.value})}/>

                 <div className="w-full aspect-square bg-[#111] border border-[#333] flex items-center justify-center overflow-hidden">
                   {form.image ? (
                     <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                   ) : (
                     <div className="text-center text-[#444]">
                       <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                       <span className="text-[10px] uppercase tracking-widest font-bold">Image Preview</span>
                     </div>
                   )}
                 </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 flex flex-col gap-3">
                <button 
                   type="submit"
                   disabled={loading}
                   className="w-full bg-[#d4af37] text-black py-4 uppercase font-bold tracking-widest text-[10px] hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish Product')}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/products")}
                  className="w-full border border-[#333] text-[#888] py-4 uppercase font-bold tracking-widest text-[10px] hover:text-white hover:border-[#666] transition-all"
                >
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

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col sticky top-0 h-screen flex-shrink-0">
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="text-[10px] tracking-[0.4em] text-[#d4af37] font-semibold mb-1">ADMIN PANEL</div>
          <div className="text-xl font-serif tracking-[0.3em] font-bold" style={{
            background: "linear-gradient(135deg, #fff 0%, #f5e6c8 40%, #d4af37 60%, #fff 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>GLOWMART</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
            { icon: Package, label: "Products", href: "/admin/products" },
            { icon: ClipboardList, label: "Orders", href: "/admin/orders" },
            { icon: ShoppingBag, label: "Add Product", href: "/admin/add-product", active: true },
            { icon: Settings, label: "Settings", href: "/admin/settings" },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all ${
                item.active
                  ? "bg-[#d4af37] text-black"
                  : "text-[#666] hover:text-white hover:bg-[#111]"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1a1a1a]">
          <Link href="/" className="flex items-center gap-2 text-xs text-[#444] hover:text-white transition-colors font-bold uppercase tracking-widest">
            <ChevronLeft size={14} /> Back to Store
          </Link>
        </div>
      </aside>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div></div>}>
        <AddProductForm />
      </Suspense>
    </div>
  );
}
