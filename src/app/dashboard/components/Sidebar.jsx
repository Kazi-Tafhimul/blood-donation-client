"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, User, FileText, PlusCircle, Users, LogOut, Globe } from "lucide-react";

export default function Sidebar({ user }) {
  const role = user.role || "donor";
  
  
  const [displayName, setDisplayName] = useState(user.name || "nabila");

 
  useEffect(() => {
    const savedName = localStorage.getItem("updated_user_name");
    if (savedName) {
      setDisplayName(savedName);
    }
  }, []);

  const allLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["donor", "volunteer", "admin"] },
    { label: "My Profile", href: "/dashboard/profile", icon: User, roles: ["donor", "volunteer", "admin"] },
    { label: "My Requests", href: "/dashboard/my-donation-requests", icon: FileText, roles: ["donor", "volunteer", "admin"] },
    { label: "Create Request", href: "/dashboard/create-donation-request", icon: PlusCircle, roles: ["donor", "volunteer", "admin"] },
    { label: "All Users", href: "/dashboard/all-users", icon: Users, roles: ["admin"] },
    { label: "Public Requests", href: "/dashboard/all-blood-donation-request", icon: FileText, roles: ["admin", "volunteer"] },
  ];

  const allowedLinks = allLinks.filter((link) => link.roles.includes(role));

  return (
    <aside className="w-64 bg-[#0B132B] text-zinc-100 flex flex-col justify-between p-5 border-r border-zinc-800 shrink-0 min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-7 w-7 rounded-full bg-[#D62828] flex items-center justify-center text-white font-black text-sm"></div>
          <span className="text-xl font-black tracking-tight text-white font-[family-name:var(--font-plus-jakarta-sans)]">
            Blood<span className="text-[#D62828]">Link</span>
          </span>
        </div>

        <div className="bg-[#1C2541] rounded-xl p-3 flex items-center gap-3 border border-zinc-800">
          <div className="h-10 w-10 rounded-full bg-[#D62828] text-white flex items-center justify-center font-bold uppercase shrink-0">
            {displayName.slice(0, 2)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{displayName}</h4>
            <span className="text-xs font-semibold text-zinc-400 capitalize">{role}</span>
          </div>
        </div>

        <nav className="space-y-1.5 pt-2">
          {allowedLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-all group"
              >
                <Icon className="h-4 w-4 text-zinc-400 group-hover:text-[#D62828] transition-colors" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 border-t border-zinc-800 pt-4">
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-bold text-zinc-400 hover:text-white transition-all">
          <Globe className="h-4 w-4" />
          Visit Website
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-bold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}