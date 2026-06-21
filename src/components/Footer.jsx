"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Droplet } from "lucide-react";
import { LogoTelegram, LogoFacebook, LogoLinkedin, HeartFill } from "@gravity-ui/icons";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F172A] text-zinc-400 pt-16 pb-8 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-6">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-zinc-800">
          
         
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#D62828] flex items-center justify-center text-white shadow-md shadow-red-900/30">
                <Droplet className="h-4.5 w-4.5 fill-current" />
              </div>
              <span className="text-xl font-black text-white font-[family-name:var(--font-plus-jakarta-sans)] tracking-tight">
                Blood<span className="text-[#D62828]">Link</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-xs mt-2">
              Connecting voluntary blood donors with patients in critical need. Every drop counts.
            </p>
            
            
            <div className="flex items-center gap-2.5 mt-4">
              
              <a 
                href="#" 
                aria-label="X (formerly Twitter)" 
                className="h-9 w-9 rounded-full bg-zinc-800/40 border border-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <LogoTelegram className="h-4 w-4" />
              </a>
              
             
              <a 
                href="#" 
                aria-label="Facebook" 
                className="h-9 w-9 rounded-full bg-zinc-800/40 border border-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <LogoFacebook className="h-4 w-4" />
              </a>
              
             
              <a 
                href="#" 
                aria-label="Linkedin" 
                className="h-9 w-9 rounded-full bg-zinc-800/40 border border-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <LogoLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

         
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/requests" className="hover:text-white transition-colors">Donation Requests</Link></li>
              <li><Link href="/donors" className="hover:text-white transition-colors">Find Donors</Link></li>
              <li><Link href="/funding" className="hover:text-white transition-colors">Funding</Link></li>
            </ul>
          </div>

        
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              About
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li><Link href="/mission" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/guide" className="hover:text-white transition-colors">Blood Types Guide</Link></li>
              <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

         
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Contact
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm font-medium text-zinc-300">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#D62828] shrink-0" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#D62828] shrink-0" />
                <span>hello@bloodlink.org</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#D62828] shrink-0" />
                <span className="text-zinc-400">Dhanmondi, Dhaka-1205</span>
              </li>
            </ul>
          </div>

        </div>

       
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500">
          <p>© 2026 BloodLink. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500"><HeartFill></HeartFill></span> for a healthier humanity
          </p>
        </div>

      </div>
    </footer>
  );
}