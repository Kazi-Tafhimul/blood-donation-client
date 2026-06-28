"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Table, Button, Chip, Modal } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function AllBloodDonationRequestsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const userRole = session?.user?.role?.toLowerCase() || "";
  const isAdmin = userRole === "admin";

  const fetchRequests = () => {
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
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const pages = Math.ceil(requests.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return requests.slice(start, end);
  }, [page, requests]);

  const handleStatusChange = async (requestId, newStatus) => {
    if (!requestId) return;

    try {
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
        toast.error("Backend rejected the status update.");
      }
    } catch (error) {
      toast.error("Network error updating status.");
    }
  };

  const openDeleteModal = (requestId) => {
    setTargetDeleteId(requestId);
    setIsModalOpen(true);
  };

  const confirmDeleteRequest = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${targetDeleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Request deleted successfully");
        setIsModalOpen(false);
        fetchRequests();
      } else {
        toast.error(data.message || "Failed to delete request");
      }
    } catch (error) {
      toast.error("Network error deleting request.");
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
              {isAdmin && <Table.Column className="text-center">MANAGEMENT</Table.Column>}
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
                  {isAdmin && <Table.Cell></Table.Cell>}
                </Table.Row>
              ) : (
                items.map((item) => (
                  <Table.Row key={item._id} className="border-b border-zinc-50 last:border-none">
                    <Table.Cell className="font-bold text-zinc-800">{item.recipientName}</Table.Cell>
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

                    {isAdmin && (
                      <Table.Cell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="warning"
                            onClick={() => router.push(`/dashboard/edit-request/${item._id}`)}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            onClick={() => openDeleteModal(item._id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Table.Cell>
                    )}
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

      
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[380px]">
              <Modal.CloseTrigger onClick={() => setIsModalOpen(false)} />
              <Modal.Header>
                <Modal.Heading className="font-black text-zinc-800 text-lg">Delete Request</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-zinc-500">
                  Are you sure you want to permanently delete this donation request? This action cannot be reversed.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex w-full justify-end gap-2">
                  <Button variant="flat" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button color="danger" size="sm" className="font-bold" onClick={confirmDeleteRequest}>
                    Delete
                  </Button>
                </div>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

function CustomPaginationLayout({ page, totalPages, setPage }) {
  return (
    <div className="flex w-full justify-center pt-4 border-t border-zinc-100">
      <div className="flex gap-4 items-center">
        <Button size="sm" variant="flat" isDisabled={page === 1} onClick={() => setPage((p) => p - 1)} className="font-medium text-zinc-600">
          Previous
        </Button>
        <div className="flex gap-1 text-sm font-semibold text-zinc-700">
          Page <span>{page}</span> of <span>{totalPages}</span>
        </div>
        <Button size="sm" variant="flat" isDisabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="font-medium text-zinc-600">
          Next
        </Button>
      </div>
    </div>
  );
}