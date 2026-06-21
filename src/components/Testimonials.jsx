"use client";


import { Star } from "lucide-react";

export default function Testimonials() {
  const stories = [
    {
      quote: "BloodLink has revolutionized how we source emergency blood. Response times dropped from hours to minutes.",
      author: "Dr. Rafiq Ahmed",
      role: "Emergency Physician, DMCH",
      initials: "DR",
    },
    {
      quote: "When my daughter needed O- blood urgently, BloodLink connected us with a donor in 20 minutes. They saved her life.",
      author: "Sabina Yasmin",
      role: "Blood Recipient",
      initials: "SY",
    },
    {
      quote: "The platform makes it incredibly easy to find where my blood type is most needed. I feel like a real hero.",
      author: "Mehedi Hassan",
      role: "Regular Donor, 8 donations",
      initials: "MH",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-16 lg:py-24 border-t border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header Layout */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D62828]">
            STORIES
          </span>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl font-[family-name:var(--font-plus-jakarta-sans)]">
            Lives changed by BloodLink
          </h2>
        </div>

        {/* 3-Column Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {stories.map((story, index) => (
            <div 
              key={index}
              className="flex flex-col justify-between p-8 rounded-3xl bg-zinc-50/40 dark:bg-zinc-900/40 border border-zinc-100/80 dark:border-zinc-800/60 shadow-sm min-h-[260px]"
            >
              <div>
                {/* 5-Star Row Rating Indicator */}
                <div className="flex items-center gap-1 mb-5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current stroke-none" />
                  ))}
                </div>

                {/* Review Text Body */}
                <p className="text-zinc-600 dark:text-zinc-300 font-medium text-[15px] leading-relaxed italic">
                  {story.quote}
                </p>
              </div>

              {/* Author Info Block */}
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/40">
                {/* Fallback Letter Avatar Container */}
                <div className="h-10 w-10 rounded-full bg-[#D62828] text-white flex items-center justify-center text-xs font-bold shadow-sm select-none shrink-0">
                  {story.initials}
                </div>
                
                <div className="overflow-hidden">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-[15px] tracking-tight truncate">
                    {story.author}
                  </h4>
                  <p className="text-zinc-400 dark:text-zinc-500 font-semibold text-xs truncate mt-0.5">
                    {story.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}