import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; 
import Sidebar from "./components/Sidebar";

export default async function DashboardLayout({ children }) {
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 font-[family-name:var(--font-inter)]">
      <Sidebar user={session.user} />
      <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}