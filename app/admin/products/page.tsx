"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Plus, Pencil, Trash2, Package, ChevronLeft,
  LayoutDashboard, ShoppingBag, ClipboardList, Settings, Star, Loader2
} from "lucide-react";

import AdminSidebar from "../../../components/admin/Sidebar";
import { AlertCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProducts(data);
      }
    } catch(err) {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const CATEGORIES = ["All", "Makeup", "Skincare", "Fragrance", "Haircare", "Gift Sets"];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = category === "All" || p.category === category;
    return matchesSearch && matchesCat;
  });

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch(e) {
      alert("Error talking to server.");
    }
    setDeleteConfirm(null);
  };

  const toggleStock = async (id: string, currentStock: boolean | undefined) => {
    const newStock = currentStock !== undefined ? !currentStock : false;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStock })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p._id === id ? { ...p, inStock: newStock } : p));
      }
    } catch(err) {
      console.log('Stock toggle failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin" 
              className="w-10 h-10 border border-[#222] flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-sm"
              title="Back to Dashboard"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Product Catalog</h1>
              <p className="text-[#555] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">
                {filtered.length} products found in the database
              </p>
            </div>
          </div>
          <Link
            href="/admin/add-product"
            className="flex items-center gap-2 bg-[#d4af37] text-black px-5 py-2.5 uppercase tracking-widest text-xs font-bold hover:bg-white transition-all shadow-[0_5px_15px_rgba(212,175,55,0.2)]"
          >
            <Plus size={16} /> Add New Item
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#111] border-b border-[#1a1a1a] px-8 py-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
            <input
              type="text"
              placeholder="Search by name, brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] text-white pl-9 pr-4 py-2.5 text-xs font-bold tracking-wider focus:border-[#d4af37] outline-none placeholder:text-[#444] uppercase"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  category === cat
                    ? "bg-[#d4af37] text-black border-[#d4af37]"
                    : "border-[#222] text-[#666] hover:border-[#444] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#d4af37]" />
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#111] border-b border-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold">
                  <th className="p-5">Product Details</th>
                  <th className="p-5">Brand</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Inventory</th>
                  <th className="p-5">Visibility</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Package size={48} className="mx-auto mb-4 text-[#1a1a1a]" />
                      <p className="text-[#444] text-[10px] uppercase tracking-widest font-bold">No results found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product, idx) => {
                    const lowStock = (product.stockCount || 0) < 10;
                    return (
                      <tr
                        key={product._id}
                        className={`border-b border-[#111] hover:bg-[#111] transition-colors group ${idx % 2 === 0 ? "" : "bg-[#0c0c0c]"}`}
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#111] border border-[#1a1a1a] flex-shrink-0 overflow-hidden relative group-hover:border-[#d4af37] transition-colors">
                              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] text-[#555] font-bold uppercase tracking-widest block mb-1">{product.category}</span>
                              <p className="text-sm font-semibold text-white leading-tight line-clamp-1 max-w-[250px] group-hover:text-[#d4af37] transition-colors">{product.name}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-5">
                          <span className="text-[10px] text-[#888] font-bold uppercase tracking-widest">{product.brand || "---"}</span>
                        </td>

                        <td className="p-5">
                          <div>
                            <p className="text-white font-bold font-serif">₹{product.price?.toLocaleString('en-IN')}</p>
                            {product.originalPrice && (
                              <p className="text-[#444] text-[10px] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                            )}
                          </div>
                        </td>

                        <td className="p-5">
                          <div className="flex items-center gap-2">
                             <span className={`text-xs font-bold ${lowStock ? 'text-red-500' : 'text-[#888]'}`}>
                               {product.stockCount || 0} Units
                             </span>
                             {lowStock && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                          </div>
                          {lowStock && <p className="text-[9px] text-red-900 font-bold uppercase tracking-tighter">Critically Low</p>}
                        </td>

                        <td className="p-5">
                          <button
                            onClick={() => toggleStock(product._id, product.inStock)}
                            className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all ${
                              product.inStock !== false 
                                ? "text-green-500 border-green-900/30 bg-green-950/20 hover:border-green-500"
                                : "text-red-500 border-red-900/30 bg-red-950/20 hover:border-red-500"
                            }`}
                          >
                            {product.inStock !== false ? "Live" : "Hidden"}
                          </button>
                        </td>

                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/add-product?edit=${product._id}`}
                              className="text-[#555] hover:text-[#d4af37] transition-colors p-2 border border-transparent hover:border-[#d4af37]/20"
                              title="Edit Product"
                            >
                              <Pencil size={14} />
                            </Link>
                            {deleteConfirm === product._id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="text-[9px] font-bold uppercase tracking-widest bg-red-700 text-white px-3 py-1.5 hover:bg-red-600"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-[9px] font-bold uppercase tracking-widest text-[#555] hover:text-white"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(product._id)}
                                className="text-[#555] hover:text-red-500 transition-colors p-2 border border-transparent hover:border-red-500/20"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

      {/* Delete confirmation overlay */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-[#0a0a0a] border border-[#222] p-8 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-700 to-transparent" />
            <Trash2 size={32} className="text-red-500 mb-4 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-center mb-2 tracking-widest">Delete Product?</h3>
            <p className="text-[#666] text-sm text-center mb-8">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-[#333] py-3 text-xs uppercase font-bold tracking-widest hover:border-white hover:text-white transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-700 text-white py-3 text-xs uppercase font-bold tracking-widest hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
