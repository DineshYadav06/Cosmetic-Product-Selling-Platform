"use client";

import { useState, useEffect } from "react";
import SellerSidebar from "@/components/seller/Sidebar";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Loader2,
  AlertTriangle,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function SellerProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/seller/products");
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      alert("An error occurred while deleting the product");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <SellerSidebar />
      
      <main className="flex-1 overflow-auto relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#d4af37]" />
          </div>
        )}

        {/* Header */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link 
              href="/seller/dashboard" 
              className="w-10 h-10 border border-[#222] flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-sm"
              title="Back to Dashboard"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">My Inventory</h1>
              <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Product Catalog Management</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/seller/add-product" className="px-6 py-2.5 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
              <Plus size={14} /> New Product
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
              <input
                type="text"
                placeholder="Search your collection..."
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-xs focus:border-[#d4af37] focus:outline-none transition-colors uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto px-6 py-3 border border-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#111] transition-colors">
              <Filter size={14} /> Filter Categories
            </button>
          </div>

          {/* Table */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-[#444] border-b border-[#111] bg-[#0d0d0d]">
                    <th className="px-6 py-5">Product</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Price</th>
                    <th className="px-6 py-5">Inventory</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0f0f0f]">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-[#111] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#111] border border-[#1a1a1a] flex-shrink-0 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest group-hover:text-[#d4af37] transition-colors">{p.name}</p>
                            <p className="text-[9px] text-[#444] uppercase tracking-widest mt-1">ID: {p._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">{p.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-serif font-bold text-white">₹{p.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${p.stockCount < 10 ? 'text-red-500' : 'text-white'}`}>
                            {p.stockCount} Units
                          </span>
                          {p.stockCount < 10 && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {p.isFeatured ? (
                          <span className="px-2 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[9px] font-bold uppercase tracking-widest">Featured</span>
                        ) : (
                          <span className="px-2 py-1 bg-[#111] border border-[#1a1a1a] text-[#444] text-[9px] font-bold uppercase tracking-widest">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/seller/add-product?edit=${p._id}`} className="p-2 text-[#444] hover:text-[#d4af37] transition-colors" title="Edit">
                            <Edit size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(p._id)}
                            className="p-2 text-[#444] hover:text-red-500 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <Link href={`/product/${p._id}`} target="_blank" className="p-2 text-[#444] hover:text-white transition-colors" title="View Storefront">
                            <ExternalLink size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-[#444] text-xs uppercase tracking-widest">
                        No products found in your inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
