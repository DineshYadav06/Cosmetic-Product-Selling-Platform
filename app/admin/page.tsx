import Link from "next/link";
import connectToDatabase from "../../lib/mongodb";
import Product from "../../lib/models/Product";
import {
  Package, ShoppingBag, TrendingUp, Users, IndianRupee,
  LayoutDashboard, ClipboardList, Settings, ChevronLeft, Plus, ArrowUpRight
} from "lucide-react";

export default async function AdminDashboard() {
  let products: any[] = [];
  let totalProducts = 0;
  let totalRevenue = 0;

  try {
    await connectToDatabase();
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    totalProducts = await Product.countDocuments();
  } catch (e) {
    // DB not available
  }

  const stats = [
    { label: "Total Products", value: totalProducts || 10, icon: Package, color: "#d4af37", bg: "rgba(212,175,55,0.08)", change: "+3 this week" },
    { label: "Orders Today", value: 24, icon: ShoppingBag, color: "#4ade80", bg: "rgba(74,222,128,0.08)", change: "+12% vs yesterday" },
    { label: "Revenue (Month)", value: "₹2.4L", icon: IndianRupee, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", change: "+8.2% vs last month" },
    { label: "Active Customers", value: 1240, icon: Users, color: "#f472b6", bg: "rgba(244,114,182,0.08)", change: "+45 new this week" },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "Priya Sharma", product: "Fenty Beauty Foundation", amount: 3200, status: "delivered" },
    { id: "#ORD-002", customer: "Ananya Singh", product: "Dior Sauvage EDP", amount: 11500, status: "processing" },
    { id: "#ORD-003", customer: "Rahul Verma", product: "Charlotte Tilbury Lipstick", amount: 2900, status: "shipped" },
    { id: "#ORD-004", customer: "Meena Patel", product: "The Ordinary Serum", amount: 650, status: "pending" },
    { id: "#ORD-005", customer: "Sunita Rao", product: "MAC Ruby Woo Lipstick", amount: 1600, status: "delivered" },
  ];

  const statusColor: Record<string, string> = {
    delivered: "text-green-400 bg-green-900/30 border-green-800",
    processing: "text-yellow-400 bg-yellow-900/30 border-yellow-800",
    shipped: "text-blue-400 bg-blue-900/30 border-blue-800",
    pending: "text-[#888] bg-[#111] border-[#222]",
  };

  const MOCK_PRODUCTS = [
    { id: "1", brand: "Fenty Beauty", name: "Pro Filt'r Soft Matte Foundation", price: 3200, category: "Makeup", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=100", inStock: true },
    { id: "2", brand: "Rare Beauty", name: "Soft Pinch Liquid Blush", price: 1850, category: "Makeup", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=100", inStock: true },
    { id: "3", brand: "The Ordinary", name: "Hyaluronic Acid 2% + B5", price: 650, category: "Skincare", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100", inStock: true },
    { id: "4", brand: "Dior", name: "Sauvage EDP 100ml", price: 11500, category: "Fragrance", image: "https://images.unsplash.com/photo-1523293111662-bf24f2225900?auto=format&fit=crop&q=80&w=100", inStock: false },
    { id: "5", brand: "MAC", name: "Ruby Woo Lipstick", price: 1600, category: "Makeup", image: "https://images.unsplash.com/photo-1561711589-b9cb8a3d2e1c?auto=format&fit=crop&q=80&w=100", inStock: true },
  ];

  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;

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
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
            { icon: Package, label: "Products", href: "/admin/products" },
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

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-widest">Dashboard</h1>
            <p className="text-[#555] text-xs uppercase tracking-widest mt-1">Welcome back, Dinesh 👋</p>
          </div>
          <Link href="/admin/add-product" className="flex items-center gap-2 bg-[#d4af37] text-black px-5 py-2.5 uppercase tracking-widest text-xs font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        <div className="p-8 space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 relative overflow-hidden hover:border-[#333] transition-colors group">
                <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-sm" style={{ background: stat.bg }}>
                    <stat.icon size={20} style={{ color: stat.color }} />
                  </div>
                  <ArrowUpRight size={16} className="text-[#333] group-hover:text-[#555] transition-colors" />
                </div>
                <p className="text-3xl font-serif font-bold text-white mb-1">{stat.value}</p>
                <p className="text-[#555] text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                <p className="text-xs mt-2" style={{ color: stat.color }}>{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Recent Products */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
                <h2 className="font-serif font-bold tracking-widest text-sm uppercase">Recent Orders</h2>
                <Link href="/admin/orders" className="text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">View All →</Link>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#111] text-[10px] uppercase tracking-widest text-[#444] font-bold">
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} className="border-b border-[#0f0f0f] hover:bg-[#111] transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-[#d4af37]">{order.id}</td>
                        <td className="px-6 py-4 text-sm">{order.customer}</td>
                        <td className="px-6 py-4 text-xs text-[#888] max-w-[140px] truncate">{order.product}</td>
                        <td className="px-6 py-4 text-sm font-serif font-bold">₹{order.amount.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${statusColor[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
                <h2 className="font-serif font-bold tracking-widest text-sm uppercase">Products</h2>
                <Link href="/admin/products" className="text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Manage →</Link>
              </div>
              <div className="divide-y divide-[#0f0f0f]">
                {displayProducts.slice(0, 5).map((p: any) => (
                  <div key={p.id || p._id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#111] transition-colors">
                    <div className="w-10 h-10 bg-[#111] border border-[#1a1a1a] flex-shrink-0 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate text-[#d4af37] uppercase tracking-wider">{p.brand}</p>
                      <p className="text-xs text-[#888] truncate">{p.name}</p>
                    </div>
                    <p className="text-sm font-serif font-bold flex-shrink-0">₹{Number(p.price).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#1a1a1a]">
                <Link href="/admin/products" className="block text-center text-[10px] font-bold uppercase tracking-widest text-[#444] hover:text-[#d4af37] transition-colors">
                  View All Products →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
            <h2 className="font-serif font-bold tracking-widest text-sm uppercase mb-6 border-b border-[#1a1a1a] pb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Add Product", icon: Plus, href: "/admin/add-product", color: "#d4af37" },
                { label: "View Products", icon: Package, href: "/admin/products", color: "#60a5fa" },
                { label: "View Orders", icon: ClipboardList, href: "/admin/orders", color: "#4ade80" },
                { label: "Go to Store", icon: TrendingUp, href: "/", color: "#f472b6" },
              ].map(action => (
                <Link key={action.label} href={action.href} className="flex flex-col items-center gap-3 p-5 border border-[#1a1a1a] hover:border-[#333] hover:bg-[#111] transition-all group text-center">
                  <action.icon size={24} style={{ color: action.color }} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#666] group-hover:text-white transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
