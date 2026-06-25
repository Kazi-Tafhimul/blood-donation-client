import React from "react";
import { MongoClient } from "mongodb";
import { Card } from "@heroui/react";
import { Users, HeartPulse, DollarSign } from "lucide-react";

async function getManagementStatistics() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME);

    const totalUsers = await db.collection("user").countDocuments();
    const totalRequests = await db
      .collection("donation_requests")
      .countDocuments();

    const totalFunding = 1250;

    return { totalUsers, totalRequests, totalFunding };
  } catch (e) {
    console.error(e);
    return { totalUsers: 0, totalRequests: 0, totalFunding: 0 };
  } finally {
    await client.close();
  }
}

export default async function AdminVolunteerDashboardHome({ user }) {
  const { totalUsers, totalRequests, totalFunding } =
    await getManagementStatistics();
  const role = user.role || "volunteer";

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-[#D62828] to-[#9B1C1C] rounded-2xl p-8 text-white shadow-xl overflow-hidden flex justify-between items-center">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full capitalize">
            Welcome back, {role}
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-plus-jakarta-sans)]">
            {user.name}
          </h1>
          <p className="text-sm text-red-100">
            System Monitoring Overview Active
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 text-white/5 font-black text-9xl pointer-events-none">
          📊
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-zinc-100 shadow-sm flex flex-row items-center justify-between gap-4 bg-white rounded-2xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Total Donors
            </span>
            <h3 className="text-3xl font-black text-zinc-800 font-[family-name:var(--font-plus-jakarta-sans)]">
              {totalUsers}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 text-[#D62828] flex items-center justify-center">
            <Users className="h-6 w-6 stroke-[2.2]" />
          </div>
        </Card>

        <Card className="p-6 border border-zinc-100 shadow-sm flex flex-row items-center justify-between gap-4 bg-white rounded-2xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Total Funding
            </span>
            <h3 className="text-3xl font-black text-zinc-800 font-[family-name:var(--font-plus-jakarta-sans)]">
              ${totalFunding}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="h-6 w-6 stroke-[2.2]" />
          </div>
        </Card>

        <Card className="p-6 border border-zinc-100 shadow-sm flex flex-row items-center justify-between gap-4 bg-white rounded-2xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Total Requests
            </span>
            <h3 className="text-3xl font-black text-zinc-800 font-[family-name:var(--font-plus-jakarta-sans)]">
              {totalRequests}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <HeartPulse className="h-6 w-6 stroke-[2.2]" />
          </div>
        </Card>
      </div>
    </div>
  );
}
