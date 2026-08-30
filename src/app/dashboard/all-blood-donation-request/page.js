"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const ITEMS_PER_PAGE = 5;

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "inprogress" },
  { label: "Done", value: "done" },
  { label: "Canceled", value: "canceled" },
];

export default function AllBloodDonationRequestPage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [actionLoading, setActionLoading] = useState(null);

 
  useEffect(() => {
    const fetchAllRequests = async () => {
      if (sessionLoading) return;

      if (!session?.user) {
        router.push("/login");
        return;
      }

      
      if (session.user.role !== "admin" && session.user.role !== "volunteer") {
        toast.error("You are not authorized to access this page.");
        router.push("/dashboard");
        return;
      }

      try {
        setLoading(true);

        const tokenResult = await authClient.token();

        if (tokenResult.error || !tokenResult.data?.token) {
          toast.error("Authentication token not found. Please login again.");
          router.push("/login");
          return;
        }

     
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/donation-requests`,
          {
            headers: {
              Authorization: `Bearer ${tokenResult.data.token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch donation requests");
        }

        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch all donation requests error:", error);

        toast.error(error.message || "Failed to load donation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, [session, sessionLoading, router]);


  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") {
      return requests;
    }

    return requests.filter((request) => request.status === activeFilter);
  }, [requests, activeFilter]);


  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);


  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  
  const handleDelete = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this donation request?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(requestId);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/donation-requests/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete donation request.");
        return;
      }

      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId),
      );

      toast.success("Donation request deleted successfully.");
    } catch (error) {
      console.error("Delete request error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

 
  const handleStatusChange = async (requestId, status) => {
    const statusText = status === "done" ? "done" : "canceled";

    const confirmed = window.confirm(
      `Are you sure you want to mark this request as ${statusText}?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(`${requestId}-${status}`);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/donation-requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Failed to update donation request status.",
        );
        return;
      }

      const updatedRequest = data.donationRequest;

      setRequests((prev) =>
        prev.map((request) =>
          request._id === requestId ? updatedRequest : request,
        ),
      );

      toast.success(`Donation request marked as ${statusText}.`);
    } catch (error) {
      console.error("Update status error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };


  if (sessionLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-9 w-72 animate-pulse rounded-lg bg-gray-200" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="animate-pulse p-6">
              <div className="mb-6 h-10 w-full rounded-xl bg-gray-200" />

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="h-16 rounded-xl bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

 
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
     
        <section className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-red-500">
                Admin Dashboard
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                All Blood Donation Requests
              </h1>

              <p className="mt-2 text-sm text-gray-500 md:text-base">
                Manage all users' blood donation requests from one place.
              </p>
            </div>

            <Link
              href="/donation-requests/create"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
            >
              + Create Request
            </Link>
          </div>
        </section>

        
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleFilterChange(filter.value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

       
        {filteredRequests.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-7.5-4.35-7.5-10.125A4.875 4.875 0 0 1 12 7.5a4.875 4.875 0 0 1 7.5 3.375C19.5 16.65 12 21 12 21Z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No donation requests found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {activeFilter === "all"
                ? "There are no donation requests yet."
                : `There are no ${
                    activeFilter === "inprogress" ? "in-progress" : activeFilter
                  } donation requests.`}
            </p>

            <Link
              href="/donation-requests/create"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Create Donation Request
            </Link>
          </div>
        )}

        
        {filteredRequests.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          
            <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  All Donation Requests
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Showing {paginatedRequests.length} of{" "}
                  {filteredRequests.length} requests
                </p>
              </div>
            </div>

            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                   
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Requester
                    </th>

                    
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Recipient
                    </th>

                   
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Blood Group
                    </th>

                   
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Location
                    </th>

                  
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                   
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Time
                    </th>

                    
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                
                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70"
                    >
                      
                      <td className="px-5 py-4">
                        <div className="max-w-[220px]">
                          <p className="font-semibold text-gray-900">
                            {request.requesterName || "N/A"}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-400">
                            {request.requesterEmail || "N/A"}
                          </p>
                        </div>
                      </td>

                      
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {request.recipientName || "N/A"}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-gray-400">
                            {request.hospitalName || "N/A"}
                          </p>
                        </div>
                      </td>

                    
                      <td className="px-5 py-4">
                        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 px-2 text-sm font-bold text-red-500">
                          {request.bloodGroup || "N/A"}
                        </span>
                      </td>

                     
                      <td className="px-5 py-4">
                        <div className="max-w-[200px]">
                          <p className="text-sm font-medium text-gray-700">
                            {request.district || "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {request.upazila || ""}
                          </p>
                        </div>
                      </td>

                    
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {request.donationDate || "N/A"}
                      </td>

                      
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {request.donationTime || "N/A"}
                      </td>

                     
                      <td className="px-5 py-4">
                        <StatusBadge status={request.status} />
                      </td>

                     
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                        
                          <Link
                            href={`/donation-requests/${request._id}`}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                          >
                            View
                          </Link>

                        
                          {session.user.role === "admin" &&
                            request.status !== "done" &&
                            request.status !== "canceled" && (
                              <Link
                                href={`/dashboard/my-donation-requests/${request._id}/edit`}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                              >
                                Edit
                              </Link>
                            )}

                      
                          {session.user.role === "admin" &&
                            request.status !== "done" &&
                            request.status !== "canceled" && (
                              <button
                                type="button"
                                onClick={() => handleDelete(request._id)}
                                disabled={actionLoading === request._id}
                                className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {actionLoading === request._id
                                  ? "..."
                                  : "Delete"}
                              </button>
                            )}

                          
                          {request.status === "inprogress" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(request._id, "done")
                                }
                                disabled={
                                  actionLoading === `${request._id}-done`
                                }
                                className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:opacity-50"
                              >
                                {actionLoading === `${request._id}-done`
                                  ? "..."
                                  : "Done"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(request._id, "canceled")
                                }
                                disabled={
                                  actionLoading === `${request._id}-canceled`
                                }
                                className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 disabled:opacity-50"
                              >
                                {actionLoading === `${request._id}-canceled`
                                  ? "..."
                                  : "Cancel"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

           
            {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                 
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`hidden h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold sm:flex ${
                        currentPage === page
                          ? "bg-gray-900 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}


function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },

    inprogress: {
      label: "In Progress",
      className: "bg-blue-100 text-blue-700",
    },

    done: {
      label: "Done",
      className: "bg-green-100 text-green-700",
    },

    canceled: {
      label: "Canceled",
      className: "bg-red-100 text-red-600",
    },
  };

  const current = config[status] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}
