"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Plus, Pencil, Trash2, Package, ChevronLeft,
  LayoutDashboard, ShoppingBag, ClipboardList, Settings, Star, Loader2
} from "lucide-react";

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
    // Optimistic UI update could go here, but doing sync DB update:
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
            { icon: Package, label: "Products", href: "/admin/products", active: true },
            { icon: ClipboardList, label: "Orders", href: "/admin/orders" },
            { icon: ShoppingBag, label: "Add Product", href: "/admin/add-product" },
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest">Product Listing</h1>
            <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{filtered.length} products found</p>
          </div>
          <Link
            href="/admin/add-product"
            className="flex items-center gap-2 bg-[#d4af37] text-black px-5 py-2.5 uppercase tracking-widest text-xs font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#111] border-b border-[#1a1a1a] px-8 py-4 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#222] text-white pl-9 pr-4 py-2 text-sm focus:border-[#d4af37] outline-none placeholder:text-[#444]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all border ${
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

        {/* Table */}
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden shadow-2xl relative">
            
            {loading && (
              <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#d4af37]" />
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#111] border-b border-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] text-[#555] font-bold">
                  <th className="p-5">Product</th>
                  <th className="p-5">Brand</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Rating</th>
                  <th className="p-5">Stock</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <Package size={48} className="mx-auto mb-4 text-[#222]" />
                      <p className="text-[#444] text-sm uppercase tracking-widest font-bold">No products found</p>
                      <p className="text-[#333] text-xs mt-2">Try adjusting your search or filter</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product, idx) => (
                    <tr
                      key={product._id}
                      className={`border-b border-[#111] hover:bg-[#111] transition-colors ${idx % 2 === 0 ? "" : "bg-[#0c0c0c]"}`}
                    >
                      {/* Product */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-[#111] border border-[#1a1a1a] flex-shrink-0 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white leading-tight line-clamp-2 max-w-[220px]">{product.name}</p>
                            <p className="text-[10px] text-[#555] mt-1">ID: {product._id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="p-5">
                        <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider">{product.brand || "Brand"}</span>
                      </td>

                      {/* Category */}
                      <td className="p-5">
                        <span className="px-3 py-1 bg-[#111] border border-[#222] text-[#888] text-[10px] uppercase font-bold tracking-widest rounded-sm">
                          {product.category || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-5">
                        <div>
                          <p className="text-white font-bold font-serif">₹{product.price?.toLocaleString('en-IN')}</p>
                          {product.originalPrice && (
                            <p className="text-[#444] text-xs line-through mt-0.5">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="p-5">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-[#d4af37] fill-[#d4af37]" />
                          <span className="text-sm font-bold text-white">{product.rating || "4.5"}</span>
                          <span className="text-[#444] text-xs">({(product.reviews || 10).toLocaleString('en-IN')})</span>
                        </div>
                      </td>

                      {/* Stock Toggle */}
                      <td className="p-5">
                        <button
                          onClick={() => toggleStock(product._id, product.inStock)}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                            product.inStock !== false // default true
                              ? "bg-green-900/30 text-green-400 border-green-800 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800"
                              : "bg-red-900/30 text-red-400 border-red-800 hover:bg-green-900/30 hover:text-green-400 hover:border-green-800"
                          }`}
                        >
                          {product.inStock !== false ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/add-product?edit=${product._id}`}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#888] hover:text-[#d4af37] transition-colors border border-[#222] hover:border-[#d4af37] px-3 py-1.5"
                          >
                            <Pencil size={12} /> Edit
                          </Link>
                          {deleteConfirm === product._id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-[10px] font-bold uppercase tracking-widest bg-red-700 text-white px-3 py-1.5 hover:bg-red-600"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-[10px] font-bold uppercase tracking-widest text-[#555] hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product._id)}
                              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#888] hover:text-red-500 transition-colors border border-[#222] hover:border-red-800 px-3 py-1.5"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <p className="text-center text-[#333] text-xs uppercase tracking-widest font-bold mt-8">
            Showing {filtered.length} of {products.length} products
          </p>
        </div>
      </div>

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
