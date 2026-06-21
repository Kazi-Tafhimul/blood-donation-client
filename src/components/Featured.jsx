"use client";

import React from "react";
import { AlertCircle, ShieldCheck, Heart } from "lucide-react";

export default function Featured() {
  const features = [
    {
      title: "Emergency Blood Support",
      description: "24/7 emergency request system connecting critical patients with available donors in minutes, not hours.",
      icon: AlertCircle,
      iconColor: "text-red-500 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50",
    },
    {
      title: "Verified Donors",
      description: "All donors are health-screened and verified to ensure safe, reliable donations for every recipient.",
      icon: ShieldCheck,
      iconColor: "text-[#14B8A6] bg-teal-50 dark:bg-teal-950/30 border-teal-100 dark:border-teal-900/50",
    },
    {
      title: "Community Impact",
      description: "Join thousands of heroes. Every donation creates ripple effects of hope and healing across Bangladesh.",
      icon: Heart,
      iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-16 lg:py-24 border-t border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        
       
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D62828]">
            Why BloodLink
          </span>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl font-[family-name:var(--font-plus-jakarta-sans)]">
            Built for impact, designed for speed
          </h2>
          <p className="mt-2 text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl">
            Every feature reduces the time between a blood request and a life-saving donation.
          </p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-start p-8 md:p-10 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 shadow-sm transition-all hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 min-h-[280px]"
              >
               
                <div className={`p-3 rounded-2xl border flex items-center justify-center mb-6 ${item.iconColor}`}>
                  <IconComponent className="h-6 w-6 stroke-[2.2]" />
                </div>

                
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-[15px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}