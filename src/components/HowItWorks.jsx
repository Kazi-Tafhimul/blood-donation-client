"use client";



export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Register",
      description: "Create your account and complete your donor profile with blood group and location.",
    },
    {
      number: "02",
      title: "Search",
      description: "Find donors or post a request. Our matching connects the right people instantly.",
    },
    {
      number: "03",
      title: "Donate",
      description: "Coordinate with the requester and donate at the specified hospital or blood bank.",
    },
    {
      number: "04",
      title: "Save a Life",
      description: "One donation can save up to 3 lives. Track your impact and inspire others.",
    },
  ];

  return (
    <section className="w-full bg-zinc-50/60 dark:bg-zinc-900/20 py-16 lg:py-24 border-t border-zinc-100 dark:border-zinc-900/60">
      <div className="mx-auto max-w-7xl px-6">
        
        
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
            SIMPLE PROCESS
          </span>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl font-[family-name:var(--font-plus-jakarta-sans)]">
            How BloodLink works
          </h2>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative flex flex-col items-center text-center p-8 pt-12 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60 shadow-sm transition-all hover:shadow-md min-h-[250px]"
            >
              
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-2xl bg-[#D62828] text-white flex items-center justify-center font-bold text-base shadow-lg shadow-red-600/20 select-none">
                {step.number}
              </div>

           
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 mt-2 tracking-tight">
                {step.title}
              </h3>
              
             
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-[14px] leading-relaxed max-w-[210px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}