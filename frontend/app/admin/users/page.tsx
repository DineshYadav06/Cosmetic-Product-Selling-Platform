"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/Sidebar";
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Shield, 
  Store, 
  Mail, 
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronLeft,
  Clock
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isApproved: !currentStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, sellerDetails: { ...u.sellerDetails, isApproved: !currentStatus } } : u));
      }
    } catch (err) {
      console.error("Update approval error:", err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex">
      <AdminSidebar />
      
      <main className="flex-1 overflow-auto relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#d4af37]" />
          </div>
        )}

        <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin" 
              className="w-10 h-10 border border-[#222] flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-sm"
              title="Back to Dashboard"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">User Directory</h1>
              <p className="text-[#444] text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Customers & Partners Management</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-[#111] px-4 py-2 border border-[#1a1a1a] flex items-center gap-2">
                <Users size={16} className="text-[#d4af37]" />
                <span className="text-xs font-bold uppercase tracking-widest">{users.length} Total</span>
             </div>
          </div>
        </div>

        <div className="p-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-3 pl-10 text-xs focus:border-[#d4af37] focus:outline-none transition-colors uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {['all', 'user', 'seller', 'admin'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`flex-1 md:flex-none px-6 py-3 border text-[10px] font-bold uppercase tracking-widest transition-all
                    ${filterRole === role ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'border-[#1a1a1a] text-[#444] hover:border-white'}`}
                >
                  {role}s
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-[#444] border-b border-[#111] bg-[#0d0d0d]">
                    <th className="px-6 py-5">Identity</th>
                    <th className="px-6 py-5">Role / Tier</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Joined</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0f0f0f]">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-[#111] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#111] border border-[#1a1a1a] flex items-center justify-center text-[#d4af37] font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest">{user.name}</p>
                            <p className="text-[9px] text-[#444] uppercase tracking-widest mt-1 flex items-center gap-1">
                              <Mail size={10} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' ? (
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-900/20 border border-purple-800 text-purple-400 text-[9px] font-bold uppercase tracking-widest">
                              <Shield size={10} /> Administrator
                            </span>
                          ) : user.role === 'seller' ? (
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[9px] font-bold uppercase tracking-widest">
                              <Store size={10} /> {user.sellerDetails?.plan || 'basic'} Seller
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-[#111] border border-[#1a1a1a] text-[#444] text-[9px] font-bold uppercase tracking-widest">
                              Customer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'seller' ? (
                          <div className="flex items-center gap-2">
                            {user.sellerDetails?.isApproved ? (
                              <span className="text-green-500 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                                <CheckCircle2 size={12} /> Approved
                              </span>
                            ) : (
                              <span className="text-yellow-500 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                                <Clock size={12} /> Pending Approval
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-green-600 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-50">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] text-[#444] uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={12} /> {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.role === 'seller' && !user.sellerDetails?.isApproved && (
                            <button 
                              onClick={() => handleToggleApproval(user._id, false)}
                              className="px-3 py-1 bg-green-900/20 border border-green-800 text-green-400 text-[9px] font-bold uppercase tracking-widest hover:bg-green-800 hover:text-white transition-all"
                            >
                              Approve Store
                            </button>
                          )}
                          {user.role === 'seller' && user.sellerDetails?.isApproved && (
                            <button 
                              onClick={() => handleToggleApproval(user._id, true)}
                              className="px-3 py-1 bg-red-900/20 border border-red-800 text-red-400 text-[9px] font-bold uppercase tracking-widest hover:bg-red-800 hover:text-white transition-all"
                            >
                              Suspend Store
                            </button>
                          )}
                          <button className="p-2 text-[#444] hover:text-white transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-[#444] text-xs uppercase tracking-widest">
                        No users found in the system.
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
