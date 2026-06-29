import React from "react";
import { MongoClient } from "mongodb";
import { Card } from "@heroui/react";
import { Users, HeartPulse, DollarSign } from "lucide-react";
import NameSync from "./NameSync"; 

async function getManagementStatistics() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME || "bloodlink_new");
    const totalUsers = await db.collection("user").countDocuments({ role: "donor" });
    const totalRequests = await db.collection("requests").countDocuments();
    const fundingAggregation = await db.collection("fundings").aggregate([
      { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } },
    ]).toArray();
    const totalFunding = fundingAggregation.length > 0 ? fundingAggregation[0].total : 0;
    return { totalUsers, totalRequests, totalFunding };
  } catch (e) {
    return { totalUsers: 0, totalRequests: 0, totalFunding: 0 };
  } finally {
    await client.close();
  }
}

export default async function AdminVolunteerDashboardHome({ user }) {
  const { totalUsers, totalRequests, totalFunding } = await getManagementStatistics();
  const role = user?.role || "volunteer";

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-r from-[#D62828] to-[#9B1C1C] rounded-2xl p-8 text-white shadow-xl overflow-hidden flex justify-between items-center">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full capitalize">
            Welcome back, {role}
          </span>
        
          <NameSync initialName={user?.name} />
          <p className="text-sm text-red-100">System Monitoring Overview Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     
        <Card className="p-6"><h3>{totalUsers}</h3></Card>
        <Card className="p-6"><h3>${totalFunding}</h3></Card>
        <Card className="p-6"><h3>{totalRequests}</h3></Card>
      </div>
    </div>
  );
}