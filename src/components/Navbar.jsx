"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplet, User, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null);
  
  const { data: sessionData, isPending } = useSession();
  const pathname = usePathname();
  const session = sessionData;

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
       
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-zinc-600 hover:text-[#E11D48] p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <Link href="/" className="flex items-center gap-2 cursor-pointer select-none">
            <div className="bg-[#E11D48] p-2 rounded-full flex items-center justify-center shadow-sm">
              <Droplet className="text-white fill-current h-4 w-4" />
            </div>
            <p className="font-bold text-xl text-zinc-900 tracking-tight">
              Blood<span className="text-[#E11D48]">Link</span>
            </p>
          </Link>
        </div>

        
        <ul className="hidden items-center gap-6 md:flex">
          <li>
            <Link 
              href="/donation-requests" 
              className={`text-[15px] font-semibold transition-colors ${
                isActive("/donation-requests") ? "text-[#E11D48]" : "text-zinc-600 hover:text-[#E11D48]"
              }`}
            >
              Donation Requests
            </Link>
          </li>
          <li>
            <Link 
              href="/search" 
              className={`text-[15px] font-semibold transition-colors ${
                isActive("/search") ? "text-[#E11D48]" : "text-zinc-600 hover:text-[#E11D48]"
              }`}
            >
              Find Donors
            </Link>
          </li>
          {session && (
            <li>
              <Link 
                href="/dashboard/funding" 
                className={`text-[15px] font-semibold transition-colors ${
                  isActive("/dashboard/funding") ? "text-[#E11D48]" : "text-zinc-600 hover:text-[#E11D48]"
                }`}
              >
                Funding
              </Link>
            </li>
          )}
        </ul>

       
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-9 w-9 rounded-full bg-zinc-200 animate-pulse" />
          ) : !session ? (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:inline text-[15px] font-semibold text-zinc-700 hover:text-[#E11D48]">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#E11D48] text-white font-semibold text-[14px] px-5 py-2 rounded-full shadow-sm hover:opacity-90 transition-opacity"
              >
                Join as Donor
              </Link>
            </div>
          ) : (
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                {session.user?.image || session.user?.avatar ? (
                  <img
                    src={session.user?.image || session.user?.avatar}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border-2 border-[#E11D48] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-zinc-200 border-2 border-[#E11D48] flex items-center justify-center font-bold text-zinc-700">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

             
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl border border-zinc-100 focus:outline-none z-50">
                  <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                    <p className="text-xs font-medium text-zinc-400">Signed in as</p>
                    <p className="text-sm font-bold text-zinc-800 truncate">{session.user?.email}</p>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors font-medium"
                  >
                    <User className="h-4 w-4 text-zinc-400" />
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold text-left border-t border-zinc-100 mt-1"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      
      {isMenuOpen && (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <Link 
                href="/donation-requests" 
                className={`block py-2 text-[15px] font-medium ${isActive("/donation-requests") ? "text-[#E11D48] font-bold" : "text-zinc-700"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Donation Requests
              </Link>
            </li>
            <li>
              <Link 
                href="/search" 
                className={`block py-2 text-[15px] font-medium ${isActive("/search") ? "text-[#E11D48] font-bold" : "text-zinc-700"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Find Donors
              </Link>
            </li>
            {session && (
              <li>
                <Link 
                  href="/dashboard/funding" 
                  className={`block py-2 text-[15px] font-medium ${isActive("/dashboard/funding") ? "text-[#E11D48] font-bold" : "text-zinc-700"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Funding
                </Link>
              </li>
            )}
            {!session && !isPending && (
              <li className="mt-2 border-t border-zinc-100 pt-2">
                <Link 
                  href="/login" 
                  className="block py-2 text-[15px] font-semibold text-zinc-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}