"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Eye, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Table, Button, Chip, Pagination } from "@heroui/react";

export default function MyDonationRequestsPage() {
  const { data: session } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination States
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const userEmail = session?.user?.email || session?.data?.user?.email;

    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    fetch(
      `http://localhost:5000/api/requests?email=${userEmail}&status=${statusFilter}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setPage(1);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to load requests.");
        setIsLoading(false);
      });
  }, [session, statusFilter]);

  const pages = Math.ceil(requests.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return requests.slice(start, end);
  }, [page, requests]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this request?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Deleted successfully!");
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        toast.error("Failed to delete request.");
      }
    } catch {
      toast.error("Error deleting request.");
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
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-white rounded-xl">
      
      <div className="flex gap-2 border-b pb-4">
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

    
      <Table aria-label="Requests Table">
        <Table.ScrollContainer>
          <Table.Content aria-label="Donation requests container" className="w-full shadow-none border border-zinc-100 rounded-xl">
            <Table.Header>
              <Table.Column isRowHeader>RECIPIENT</Table.Column>
              <Table.Column>LOCATION</Table.Column>
              <Table.Column>BLOOD GROUP</Table.Column>
              <Table.Column>DATE</Table.Column>
              <Table.Column>STATUS</Table.Column>
              <Table.Column>ACTIONS</Table.Column>
            </Table.Header>

            <Table.Body>
              {items.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="text-center py-8 text-zinc-400">No requests found matching your criteria.</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              ) : (
                items.map((item) => (
                  <Table.Row key={item._id}>
                    <Table.Cell className="font-bold text-zinc-800">
                      {item.recipientName}
                    </Table.Cell>
                    <Table.Cell>{item.recipientDistrict}</Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" color="danger" variant="flat" className="font-bold">
                        {item.bloodGroup}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>{item.donationDate}</Table.Cell>
                    <Table.Cell>
                      <Chip size="sm" variant="flat" className="capitalize font-bold">
                        {item.status || "Pending"}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button isIconOnly size="sm" variant="light" className="text-blue-500">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" className="text-amber-500">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" className="text-rose-500" onClick={() => handleDelete(item._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
    <div className="flex w-full justify-center pt-2">
      <Pagination className="justify-center">
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
              <Pagination.PreviousIcon />
              <span>Previous</span>
            </Pagination.Previous>
          </Pagination.Item>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ))}

          <Pagination.Item>
            <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage((p) => p + 1)}>
              <span>Next</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}