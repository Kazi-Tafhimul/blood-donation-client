"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Table, Button, Chip } from "@heroui/react";

export default function AllBloodDonationRequestsPage() {
  const { data: session } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    setIsLoading(true);
    
    
    fetch(`http://localhost:5000/api/requests?status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setPage(1);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to load blood requests.");
        setIsLoading(false);
      });
  }, [statusFilter]);

  const pages = Math.ceil(requests.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return requests.slice(start, end);
  }, [page, requests]);

  
// Handle status update functionality for volunteers safely
  const handleStatusChange = async (requestId, newStatus) => {
    if (!requestId) {
      toast.error("Invalid Request ID");
      return;
    }

    try {
      // Try calling the standard endpoint with PATCH
      const res = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        setRequests((prev) =>
          prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
        );
      } else {
        // Fallback: If your backend uses PUT instead of PATCH, try running a PUT fallback
        const fallbackRes = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (fallbackRes.ok) {
          toast.success(`Status updated to ${newStatus}`);
          setRequests((prev) =>
            prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
          );
        } else {
          toast.error("Backend rejected the status update.");
        }
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Network error updating status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center pt-12">
        <Loader2 className="animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-white rounded-xl shadow-sm border border-zinc-100">
      
      
      <div>
        <h1 className="text-2xl font-black text-zinc-800 tracking-tight">All Blood Requests</h1>
        <p className="text-sm text-zinc-400">Monitor and manage all blood donation requests</p>
      </div>

     
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "solid" : "flat"}
            color={statusFilter === status ? "danger" : "default"}
            onClick={() => setStatusFilter(status)}
            className="capitalize font-semibold"
          >
            {status === "inprogress" ? "In Progress" : status}
          </Button>
        ))}
      </div>

     
      <Table aria-label="All Public Requests Table">
        <Table.ScrollContainer>
          <Table.Content aria-label="Requests container" className="w-full shadow-none">
            <Table.Header>
              <Table.Column isRowHeader>RECIPIENT</Table.Column>
              <Table.Column>BLOOD GROUP</Table.Column>
              <Table.Column>LOCATION</Table.Column>
              <Table.Column>DATE</Table.Column>
              <Table.Column>STATUS</Table.Column>
              <Table.Column>ACTIONS (UPDATE STATUS)</Table.Column>
            </Table.Header>

            <Table.Body>
              {items.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="text-center py-8 text-zinc-400">No public requests found matching this filter.</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ) : (
                items.map((item) => (
                  <Table.Row key={item._id} className="border-b border-zinc-50 last:border-none">
                    <Table.Cell className="font-bold text-zinc-800">
                      {item.recipientName}
                    </Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" color="danger" variant="flat" className="font-bold">
                        {item.bloodGroup}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-zinc-600">{item.recipientDistrict}</Table.Cell>
                    <Table.Cell className="text-zinc-500">{item.donationDate}</Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="flat" color={item.status === "done" ? "success" : "warning"} className="capitalize font-bold">
                        {item.status || "Pending"}
                      </Chip>
                    </Table.Cell>
                    
                   
                    <Table.Cell>
                      <select
                        value={item.status?.toLowerCase() || "pending"}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="w-40 px-3 py-1.5 text-sm bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

     
      {pages > 1 && (
        <CustomPaginationLayout page={page} totalPages={pages} setPage={setPage} />
      )}
    </div>
  );
}

function CustomPaginationLayout({ page, totalPages, setPage }) {
  return (
    <div className="flex w-full justify-center pt-4 border-t border-zinc-100">
      <div className="flex gap-4 items-center">
        <Button
          size="sm"
          variant="flat"
          isDisabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="font-medium text-zinc-600"
        >
          Previous
        </Button>
        
        <div className="flex gap-1 text-sm font-semibold text-zinc-700">
          Page <span>{page}</span> of <span>{totalPages}</span>
        </div>

        <Button
          size="sm"
          variant="flat"
          isDisabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="font-medium text-zinc-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
}