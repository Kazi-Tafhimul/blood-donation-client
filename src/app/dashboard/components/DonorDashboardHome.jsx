import React from "react";
import Link from "next/link";
import { MongoClient } from "mongodb";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import { Eye, Edit2, Trash2, ArrowRight, CheckCircle, XCircle } from "lucide-react";

async function getRecentDonorRequests(email) {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME);
    const requests = await db.collection("requests")
      .find({ requesterEmail: email })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    return JSON.parse(JSON.stringify(requests));
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    await client.close();
  }
}

export default async function DonorDashboardHome({ user }) {
  const recentRequests = await getRecentDonorRequests(user.email);

  const statusColorMap = {
    pending: "warning",
    inprogress: "primary",
    done: "success",
    canceled: "danger",
  };

  return (
    <div className="space-y-8">
      
      <div className="relative bg-gradient-to-r from-[#D62828] to-[#9B1C1C] rounded-2xl p-8 text-white shadow-xl overflow-hidden flex justify-between items-center">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full">
            Welcome back,
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-plus-jakarta-sans)]">
            {user.name}
          </h1>
          <p className="text-sm text-red-100">Donor Profile Dashboard Active</p>
        </div>
        
      </div>

      
      {recentRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-zinc-800 font-[family-name:var(--font-plus-jakarta-sans)] tracking-tight">
              Recent Donation Requests
            </h2>
            <Link href="/dashboard/my-donation-requests">
              <Button 
                size="sm" 
                variant="light" 
                className="text-[#D62828] font-bold gap-1 text-[13px] p-0" 
                endContent={<ArrowRight className="h-3.5 w-3.5" />}
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRequests.map((request) => (
              <div
                key={request._id}
                className="border border-zinc-100 rounded-2xl bg-white p-5 space-y-4 hover:border-zinc-200 transition-all shadow-sm"
              >
               
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Recipient
                    </p>
                    <h3 className="font-bold text-zinc-800 text-base mt-0.5">
                      {request.recipientName}
                    </h3>
                  </div>
                  <Chip
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="font-black text-xs px-2"
                  >
                    {request.bloodGroup}
                  </Chip>
                </div>

               
                <div className="space-y-1 text-[13px] text-zinc-600 font-medium">
                  <div>
                    <span className="text-zinc-400">Location:</span>{" "}
                    {`${request.recipientDistrict}, ${request.recipientUpazila}`}
                  </div>
                  <div>
                    <span className="text-zinc-400">Date:</span> {request.donationDate}
                  </div>
                  <div>
                    <span className="text-zinc-400">Time:</span> {request.donationTime}
                  </div>
                </div>

               
                <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
                  <Chip
                    size="sm"
                    variant="flat"
                    color={statusColorMap[request.donationStatus] || "default"}
                    className="font-bold text-xs uppercase px-2"
                  >
                    {request.donationStatus}
                  </Chip>

                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/donation-details/${request._id}`}>
                      <Button isIconOnly size="sm" variant="light" className="text-zinc-400 hover:text-zinc-600 w-7 h-7 min-w-7">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/edit-donation-request/${request._id}`}>
                      <Button isIconOnly size="sm" variant="light" className="text-zinc-400 hover:text-zinc-600 w-7 h-7 min-w-7">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      purse="delete-target"
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-zinc-400 hover:text-red-600 w-7 h-7 min-w-7"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <Link href="/dashboard/my-donation-requests">
              <Button className="bg-[#D62828] text-white font-bold rounded-xl px-6 shadow-sm">
                View My All Requests
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}