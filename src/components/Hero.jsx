"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { Heart, Search, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 py-12 md:py-20 lg:py-24">
    
      <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-l from-red-50/50 to-transparent blur-3xl dark:from-red-950/10" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          
          
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#D62828] dark:bg-red-950/30 dark:text-red-400 border border-red-100/50 dark:border-red-900/30">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>Bangladesh&apos;s #1 Blood Donation Platform</span>
          </div>

         
          <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl font-[family-name:var(--font-plus-jakarta-sans)] leading-[1.1]">
            Donate Blood.
            <span className="block text-[#D62828] mt-1">Save Lives.</span>
          </h1>

          
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            BloodLink connects voluntary blood donors with patients in critical need. 
            Every donation is a chance to be someone&apos;s hero — join our growing community.
          </p>

         
          <div className="mt-4 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Button
              as={Link}
              href="/register"
              size="lg"
              className="bg-[#D62828] text-white font-bold px-7 rounded-xl shadow-lg shadow-red-600/10 hover:opacity-90 transition-all flex items-center gap-2 h-14 text-[15px]"
            >
              Join as Donor
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Button>

            <Button
              as={Link}
              href="/search"
              size="lg"
              variant="bordered"
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-bold px-7 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 h-14 border-2 text-[15px]"
            >
              <Search className="h-4 w-4 stroke-[2.5] text-zinc-500" />
              Search Donors
            </Button>
          </div>

          
          <div className="mt-12 md:mt-16 grid grid-cols-3 gap-8 md:gap-16 border-t border-zinc-100 dark:border-zinc-900 pt-8 w-full max-w-xl">
            <div>
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight sm:text-4xl">
                12,450+
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Active Donors
              </p>
            </div>
            
            <div>
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight sm:text-4xl">
                3,200+
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Lives Saved
              </p>
            </div>

            <div>
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight sm:text-4xl">
                64
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Districts
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}