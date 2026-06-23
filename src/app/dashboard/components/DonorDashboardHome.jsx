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
    const requests = await db.collection("donation_requests")
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
        <div className="absolute -right-10 -bottom-10 text-white/5 font-black text-9xl pointer-events-none">🩸</div>
      </div>

     
      {recentRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-zinc-800 font-[family-name:var(--font-plus-jakarta-sans)] tracking-tight">
              Recent Donation Requests
            </h2>
            <Button 
              as={Link} 
              href="/dashboard/my-donation-requests" 
              size="sm" 
              variant="light" 
              className="text-[#D62828] font-bold gap-1 text-[13px] p-0" 
              endContent={<ArrowRight className="h-3.5 w-3.5" />}
            >
              View All
            </Button>
          </div>

          <Table aria-label="Recent donor donation requests table" shadow="none" className="border border-zinc-100 rounded-2xl bg-white p-2">
            <TableHeader>
              <TableColumn className="font-bold text-zinc-500 bg-zinc-50/50">RECIPIENT</TableColumn>
              <TableColumn className="font-bold text-zinc-500 bg-zinc-50/50">LOCATION</TableColumn>
              <TableColumn className="font-bold text-zinc-500 bg-zinc-50/50 text-center">BLOOD GROUP</TableColumn>
              <TableColumn className="font-bold text-zinc-500 bg-zinc-50/50">DATE & TIME</TableColumn>
              <TableColumn className="font-bold text-zinc-500 bg-zinc-50/50">STATUS/DONOR</TableColumn>
              <TableColumn className="font-bold text-zinc-500 bg-zinc-50/50 text-center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {recentRequests.map((request) => (
                <TableRow key={request._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40 transition-colors">
                  <TableCell className="font-bold text-zinc-800 text-[14px]">{request.recipientName}</TableCell>
                  <TableCell className="text-zinc-500 font-medium text-[13px]">{`${request.recipientDistrict}, ${request.recipientUpazila}`}</TableCell>
                  <TableCell className="text-center">
                    <Chip size="sm" variant="dot" color="danger" className="font-extrabold text-xs">{request.bloodGroup}</Chip>
                  </TableCell>
                  <TableCell className="text-zinc-500 font-medium text-[13px]">
                    <div>{request.donationDate}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{request.donationTime}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <Chip size="sm" variant="flat" color={statusColorMap[request.donationStatus]} className="font-bold text-xs uppercase px-2">
                        {request.donationStatus}
                      </Chip>
                      {request.donationStatus === "inprogress" && request.donorName && (
                        <div className="text-[11px] text-zinc-500 leading-tight">
                          <p className="font-semibold text-zinc-700">{request.donorName}</p>
                          <p className="text-zinc-400">{request.donorEmail}</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Direct status alteration context blocks if inprogress */}
                      {request.donationStatus === "inprogress" && (
                        <div className="flex gap-1 border-r border-zinc-200 pr-1.5">
                          <Button isIconOnly size="sm" color="success" variant="flat" className="w-7 h-7 min-w-7" title="Mark Done"><CheckCircle className="h-3.5 w-3.5" /></Button>
                          <Button isIconOnly size="sm" color="danger" variant="flat" className="w-7 h-7 min-w-7" title="Cancel Request"><XCircle className="h-3.5 w-3.5" /></Button>
                        </div>
                      )}
                      <Button as={Link} href={`/dashboard/donation-details/${request._id}`} isIconOnly size="sm" variant="light" className="text-zinc-400 hover:text-zinc-600 min-w-8 w-8 h-8"><Eye className="h-4 w-4" /></Button>
                      <Button as={Link} href={`/dashboard/edit-donation-request/${request._id}`} isIconOnly size="sm" variant="light" className="text-zinc-400 hover:text-zinc-600 min-w-8 w-8 h-8"><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button purse="delete-target" isIconOnly size="sm" variant="light" className="text-zinc-400 hover:text-red-600 min-w-8 w-8 h-8"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="pt-2 flex justify-center">
            <Button as={Link} href="/dashboard/my-donation-requests" className="bg-[#D62828] text-white font-bold rounded-xl px-6 shadow-sm">
              View My All Requests
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}