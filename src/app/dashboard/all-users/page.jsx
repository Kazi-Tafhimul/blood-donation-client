"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, MoreVertical, Shield, UserCheck, User, Ban, Unlock } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, Chip } from "@heroui/react";

export default function AllUsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const fetchUsers = () => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/users?status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setPage(1);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load user profiles.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const pages = Math.ceil(users.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return users.slice(start, start + rowsPerPage);
  }, [page, users]);

  const updateUserFields = async (userId, payload) => {
    setActiveDropdown(null);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("User updated successfully!");
        fetchUsers();
      } else {
        toast.error("Failed to update user.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center pt-12">
        <Loader2 className="animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-white rounded-xl shadow-sm border border-zinc-100">
      
   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-800 tracking-tight">User Management</h1>
          <p className="text-sm text-zinc-400">Manage user authorization roles and status</p>
        </div>

        <div className="flex gap-2">
          {["all", "active", "blocked"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "solid" : "flat"}
              color={statusFilter === status ? "danger" : "default"}
              onClick={() => setStatusFilter(status)}
              className="capitalize font-semibold"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      
      <div className="w-full rounded-xl border border-zinc-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">Avatar</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-zinc-400 text-sm">
                  No user profiles found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const currentRole = item.role || "donor";
                const currentStatus = item.status || "active";

                return (
                  <tr key={item._id} className="border-b border-zinc-100 last:border-0 text-sm text-zinc-700 hover:bg-zinc-50/50 transition-colors">
                   
                    <td className="p-4">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-blue flex items-center justify-center text-sm font-black uppercase shadow-sm">
                          {item.name ? item.name.charAt(0) : item.email.charAt(0)}
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4 font-bold text-zinc-800">{item.name || "Anonymous"}</td>
                    <td className="p-4 text-zinc-500 font-medium">{item.email}</td>
                    
                   
                    <td className="p-4">
                      <Chip size="sm" variant="flat" color={currentRole === "admin" ? "danger" : currentRole === "volunteer" ? "secondary" : "default"} className="capitalize font-bold">
                        {currentRole}
                      </Chip>
                    </td>

                  
                    <td className="p-4">
                      <Chip size="sm" variant="dot" color={currentStatus === "blocked" ? "danger" : "success"} className="capitalize font-semibold">
                        {currentStatus}
                      </Chip>
                    </td>

                    
                    <td className="p-4 text-center">
                      <div className="relative inline-block text-left">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onClick={() => setActiveDropdown(activeDropdown === item._id ? null : item._id)}
                        >
                          <MoreVertical className="w-4 h-4 text-zinc-500" />
                        </Button>

                        {activeDropdown === item._id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 py-1.5 ring-1 ring-black ring-opacity-5">
                            
                           
                            {currentStatus === "active" ? (
                              <button 
                                onClick={() => updateUserFields(item._id, { status: "blocked" })}
                                className="w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 text-left"
                              >
                                <Ban className="w-3.5 h-3.5" /> Block Account
                              </button>
                            ) : (
                              <button 
                                onClick={() => updateUserFields(item._id, { status: "active" })}
                                className="w-full px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 text-left"
                              >
                                <Unlock className="w-3.5 h-3.5" /> Unblock Account
                              </button>
                            )}

                            
                            {currentRole !== "donor" && (
                              <button 
                                onClick={() => updateUserFields(item._id, { role: "donor" })}
                                className="w-full px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 border-t border-zinc-100 text-left"
                              >
                                <User className="w-3.5 h-3.5 text-blue-500" /> Make Donor
                              </button>
                            )}

                            
                            {currentRole !== "volunteer" && (
                              <button 
                                onClick={() => updateUserFields(item._id, { role: "volunteer" })}
                                className="w-full px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 border-t border-zinc-100 text-left"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-purple-500" /> Make Volunteer
                              </button>
                            )}

                            {currentRole !== "admin" && (
                              <button 
                                onClick={() => updateUserFields(item._id, { role: "admin" })}
                                className="w-full px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 border-t border-zinc-100 text-left"
                              >
                                <Shield className="w-3.5 h-3.5 text-red-500" /> Make Admin
                              </button>
                            )}
                          </div>
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

      
      {pages > 1 && (
        <div className="flex w-full justify-center pt-4 border-t border-zinc-100">
          <div className="flex gap-4 items-center">
            <Button size="sm" variant="flat" isDisabled={page === 1} onClick={() => setPage((p) => p - 1)} className="font-medium text-zinc-600">
              Previous
            </Button>
            <div className="flex gap-1 text-sm font-semibold text-zinc-700">
              Page <span>{page}</span> of <span>{pages}</span>
            </div>
            <Button size="sm" variant="flat" isDisabled={page === pages} onClick={() => setPage((p) => p + 1)} className="font-medium text-zinc-600">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}