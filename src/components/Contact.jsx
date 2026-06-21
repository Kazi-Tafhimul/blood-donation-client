"use client";


import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section className="w-full bg-zinc-50/60 dark:bg-zinc-900/20 py-16 lg:py-24 border-t border-zinc-100 dark:border-zinc-900/60">
      <div className="mx-auto max-w-4xl px-6">
        
        
        <div className="flex flex-col items-start gap-4 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
            CONTACT US
          </span>
          <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl font-[family-name:var(--font-plus-jakarta-sans)]">
            Get in touch
          </h2>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">
            Have questions or need emergency support? Our team is available 24/7.
          </p>
        </div>

       
        <div className="w-full flex flex-col gap-6 max-w-xl">
          
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100/50 dark:border-red-900/30 text-[#D62828] flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-200 tracking-tight">
              +880 1234-567890
            </span>
          </div>

          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100/50 dark:border-red-900/30 text-[#D62828] flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-200 tracking-tight">
              hello@bloodlink.org
            </span>
          </div>

          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100/50 dark:border-red-900/30 text-[#D62828] flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[15px] font-bold text-zinc-700 dark:text-zinc-200 tracking-tight leading-relaxed">
              House 42, Road 11, Dhanmondi, Dhaka-1205
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}