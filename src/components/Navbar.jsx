"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar 
} from "@heroui/react";
import { Droplet } from "lucide-react";

export default function Navbar({ session = null, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper to determine active link status
  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Left Side: Mobile Menu Button & Brand Identity */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-zinc-600 dark:text-zinc-300 hover:text-[#E11D48] p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          
          {/* BloodLink Branding Logo block */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer select-none">
            <div className="bg-[#E11D48] p-2 rounded-full flex items-center justify-center shadow-sm">
              <Droplet className="text-white fill-current h-4 w-4" />
            </div>
            <p className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight">
              Blood<span className="text-[#E11D48]">Link</span>
            </p>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (md:flex) */}
        <ul className="hidden items-center gap-6 md:flex">
          <li>
            <Link 
              href="/donation-requests" 
              className={`text-[15px] font-semibold transition-colors ${
                isActive("/donation-requests") 
                  ? "text-[#E11D48]" 
                  : "text-zinc-600 dark:text-zinc-300 hover:text-[#E11D48]"
              }`}
            >
              Donation Requests
            </Link>
          </li>
          <li>
            <Link 
              href="/search" 
              className={`text-[15px] font-semibold transition-colors ${
                isActive("/search") 
                  ? "text-[#E11D48]" 
                  : "text-zinc-600 dark:text-zinc-300 hover:text-[#E11D48]"
              }`}
            >
              Find Donors
            </Link>
          </li>
          
          {/* Conditional Funding Route Link for Active Sessions */}
          {session && (
            <li>
              <Link 
                href="/dashboard/funding" 
                className={`text-[15px] font-semibold transition-colors ${
                  isActive("/dashboard/funding") 
                    ? "text-[#E11D48]" 
                    : "text-zinc-600 dark:text-zinc-300 hover:text-[#E11D48]"
                }`}
              >
                Funding
              </Link>
            </li>
          )}
        </ul>

        {/* Right Side: Desktop Action Elements Context Toggle */}
        <div className="hidden items-center gap-4 md:flex">
          {!session ? (
            <>
              <Link 
                href="/login" 
                className="text-[15px] font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#E11D48] transition-colors"
              >
                Login
              </Link>
              <Button
                as={Link}
                href="/register"
                className="bg-[#E11D48] text-white font-semibold text-[14px] px-5 rounded-full shadow-sm hover:opacity-90 transition-opacity animate-none"
              >
                Join as Donor
              </Button>
            </>
          ) : (
            /* User Dropdown Action Panel */
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform border-[#E11D48] cursor-pointer"
                  color="danger"
                  name={session.user.name}
                  size="sm"
                  src={session.user.avatar} 
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Navigation Dropdown" variant="flat">
                <DropdownItem key="user-header" className="h-14 gap-2" textValue="Logged in status">
                  <p className="font-semibold text-xs text-zinc-500">Signed in as</p>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{session.user.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" as={Link} href="/dashboard" textValue="Dashboard">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="profile-settings" as={Link} href="/dashboard/profile" textValue="My Profile">
                  My Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  onClick={onLogout}
                  textValue="Log Out"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        {/* Mobile View Right-side fallback CTA button wrapper */}
        {!session && (
          <div className="flex items-center md:hidden">
            <Button
              as={Link}
              href="/register"
              className="bg-[#E11D48] text-white font-semibold text-[13px] h-9 px-4 rounded-full shadow-sm hover:opacity-90 transition-opacity"
            >
              Join as Donor
            </Button>
          </div>
        )}

        {/* Mobile View Profile Avatar Fallback Shortcut */}
        {session && (
          <div className="flex items-center md:hidden">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform border-[#E11D48] h-8 w-8 cursor-pointer"
                  color="danger"
                  name={session.user.name}
                  src={session.user.avatar} 
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Mobile User Dropdown" variant="flat">
                <DropdownItem key="dashboard" as={Link} href="/dashboard" textValue="Dashboard">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={onLogout} textValue="Log Out">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </header>

      {/* Mobile Context Overlay Menu Drawer Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 md:hidden animate-none">
          <ul className="flex flex-col gap-2 p-4">
            <li>
              <Link 
                href="/donation-requests" 
                className={`block py-2 text-[15px] font-medium ${
                  isActive("/donation-requests") ? "text-[#E11D48] font-bold" : "text-zinc-700 dark:text-zinc-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Donation Requests
              </Link>
            </li>
            <li>
              <Link 
                href="/search" 
                className={`block py-2 text-[15px] font-medium ${
                  isActive("/search") ? "text-[#E11D48] font-bold" : "text-zinc-700 dark:text-zinc-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Find Donors
              </Link>
            </li>
            
            {session && (
              <li>
                <Link 
                  href="/dashboard/funding" 
                  className={`block py-2 text-[15px] font-medium ${
                    isActive("/dashboard/funding") ? "text-[#E11D48] font-bold" : "text-zinc-700 dark:text-zinc-200"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Funding
                </Link>
              </li>
            )}

            {!session && (
              <li className="mt-4 flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <Link 
                  href="/login" 
                  className="block py-2 text-[15px] font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#E11D48]"
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