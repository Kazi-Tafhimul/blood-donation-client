"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, MoreVertical, Shield, UserCheck, Ban, Unlock } from "lucide-react";
import { toast } from "react-hot-toast";
import { Table, Button, Chip } from "@heroui/react";

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
        toast.error("Failed to load users profiles.");
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
        toast.success("User configuration updated successfully!");
        fetchUsers(); 
      } else {
        toast.error("Failed to perform user update operations.");
      }
    } catch {
      toast.error("Network connection failure occurred.");
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
          <p className="text-sm text-zinc-400">Manage user authorization roles and access status permissions</p>
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

      <Table aria-label="System Users Ledger">
        <Table.ScrollContainer>
          <Table.Content aria-label="User grid" className="w-full shadow-none">
            <Table.Header>
              <Table.Column isRowHeader>AVATAR</Table.Column>
              <Table.Column>NAME</Table.Column>
              <Table.Column>EMAIL ADDRESS</Table.Column>
              <Table.Column>ROLE</Table.Column>
              <Table.Column>STATUS</Table.Column>
              <Table.Column className="text-center">ACTIONS</Table.Column>
            </Table.Header>

            <Table.Body>
              {items.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="text-center py-8 text-zinc-400">No matching user accounts register profiles found.</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ) : (
                items.map((item) => (
                  <Table.Row key={item._id} className="border-b border-zinc-50 relative">
                    
                  
                    <Table.Cell>
  {item.image ? (
    <img 
      src={item.image} 
      alt={`${item.name || "User"}'s profile`} 
      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-black flex items-center justify-center text-sm font-black tracking-wider uppercase border border-red-100 shadow-sm">
      {item.name ? item.name.charAt(0) : item.email ? item.email.charAt(0) : "U"}
    </div>
  )}
</Table.Cell>
                    
                    <Table.Cell className="font-bold text-zinc-800">{item.name || "Anonymous"}</Table.Cell>
                    <Table.Cell className="text-zinc-500 font-medium">{item.email}</Table.Cell>
                    
                  
                    <Table.Cell>
                      <Chip size="sm" variant="flat" color={item.role === "admin" ? "danger" : item.role === "volunteer" ? "secondary" : "default"} className="capitalize font-bold">
                        {item.role || "Donor"}
                      </Chip>
                    </Table.Cell>

                   
                    <Table.Cell>
                      <Chip size="sm" variant="dot" color={item.status === "blocked" ? "danger" : "success"} className="capitalize font-semibold">
                        {item.status || "active"}
                      </Chip>
                    </Table.Cell>

                  
                    <Table.Cell className="text-center overflow-visible">
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
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-zinc-100 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                            
                            
                            {(item.status || "active") === "active" ? (
                              <button 
                                onClick={() => updateUserFields(item._id, { status: "blocked" })}
                                className="w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Ban className="w-3.5 h-3.5" /> Block Account
                              </button>
                            ) : (
                              <button 
                                onClick={() => updateUserFields(item._id, { status: "active" })}
                                className="w-full px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                              >
                                <Unlock className="w-3.5 h-3.5" /> Unblock Account
                              </button>
                            )}

                            
                            {item.role !== "volunteer" && item.role !== "admin" && (
                              <button 
                                onClick={() => updateUserFields(item._id, { role: "volunteer" })}
                                className="w-full px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 border-t border-zinc-100"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-purple-500" /> Make Volunteer
                              </button>
                            )}

                            {item.role !== "admin" && (
                              <button 
                                onClick={() => updateUserFields(item._id, { role: "admin" })}
                                className="w-full px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 border-t border-zinc-100"
                              >
                                <Shield className="w-3.5 h-3.5 text-red-500" /> Make Admin
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </Table.Cell>

                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

     
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