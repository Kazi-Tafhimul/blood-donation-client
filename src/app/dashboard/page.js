"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    request: null,
  });

  // =========================
  // GET MY REQUESTS
  // =========================

  const getMyRequests = async () => {
    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/my-donation-requests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch donation requests"
        );
      }

      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch my requests error:", error);
      toast.error(
        error.message || "Failed to load donation requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD REQUESTS
  // =========================

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) return;

    const timer = setTimeout(() => {
      getMyRequests();
    }, 0);

    return () => clearTimeout(timer);
  }, [sessionLoading, session?.user?.id]);

  // =========================
  // STATUS CHANGE
  // =========================

  const handleStatusChange = async (requestId, status) => {
    try {
      setActionLoading(`${requestId}-${status}`);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/donation-requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update donation status"
        );
      }

      toast.success(
        status === "done"
          ? "Donation marked as completed"
          : "Donation request canceled"
      );

      setRequests((prev) =>
        prev.map((request) =>
          request._id === requestId
            ? {
                ...request,
                ...data.donationRequest,
                status,
              }
            : request
        )
      );
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error.message || "Failed to update status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // DELETE REQUEST
  // =========================

  const handleDelete = async () => {
    const request = deleteModal.request;

    if (!request?._id) return;

    try {
      setActionLoading(`delete-${request._id}`);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/donation-requests/${request._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete donation request"
        );
      }

      setRequests((prev) =>
        prev.filter((item) => item._id !== request._id)
      );

      setDeleteModal({
        open: false,
        request: null,
      });

      toast.success(
        "Donation request deleted successfully"
      );
    } catch (error) {
      console.error("Delete request error:", error);

      toast.error(
        error.message || "Failed to delete request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // HELPERS
  // =========================

  const recentRequests = requests.slice(0, 3);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "inprogress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "canceled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const formatStatus = (status) => {
    if (status === "inprogress") {
      return "In Progress";
    }

    return (
      status?.charAt(0).toUpperCase() +
      status?.slice(1)
    );
  };

  // =========================
  // SESSION LOADING
  // =========================

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />
      </div>
    );
  }

  const user = session?.user;

  // =========================
  // DASHBOARD
  // =========================

  return (
    <>
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* Welcome */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-red-600 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-red-100">
                Donor Dashboard
              </p>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome back, {user?.name || "Donor"}!
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100 sm:text-base">
                Thank you for being part of BloodLink. Your willingness
                to donate blood can help save someone&apos;s life.
              </p>
            </div>

            <Link
              href="/donation-requests/create"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <span className="text-lg">+</span>
              Create Request
            </Link>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-center py-10">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />
            </div>
          </section>
        )}

        {/* Recent Requests */}
        {!loading && recentRequests.length > 0 && (
          <section>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Donation Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest donation requests
                </p>
              </div>

              <Link
                href="/dashboard/my-donation-requests"
                className="text-sm font-bold text-red-600 hover:text-red-700"
              >
                View all requests →
              </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Recipient
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Location
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Date & Time
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Blood
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Donor
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentRequests.map((request) => (
                      <tr
                        key={request._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-5">
                          <p className="font-semibold text-slate-900">
                            {request.recipientName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {request.hospitalName}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium text-slate-700">
                            {request.district}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {request.upazila}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium text-slate-700">
                            {request.donationDate}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {request.donationTime}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-red-50 px-3 text-sm font-bold text-red-600">
                            {request.bloodGroup}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                                request.status
                              )}`}
                            >
                              {formatStatus(request.status)}
                            </span>

                            {request.status === "inprogress" && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  disabled={
                                    actionLoading ===
                                    `${request._id}-done`
                                  }
                                  onClick={() =>
                                    handleStatusChange(
                                      request._id,
                                      "done"
                                    )
                                  }
                                  className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  {actionLoading ===
                                  `${request._id}-done`
                                    ? "..."
                                    : "Done"}
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    actionLoading ===
                                    `${request._id}-canceled`
                                  }
                                  onClick={() =>
                                    handleStatusChange(
                                      request._id,
                                      "canceled"
                                    )
                                  }
                                  className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                >
                                  {actionLoading ===
                                  `${request._id}-canceled`
                                    ? "..."
                                    : "Cancel"}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          {request.status === "inprogress" ? (
                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {request.donorName || "Not available"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {request.donorEmail || "No email"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/donation-requests/${request._id}`}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                            >
                              View
                            </Link>

                            {request.status !== "done" &&
                              request.status !== "canceled" && (
                                <Link
                                  href={`/donation-requests/${request._id}/edit`}
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                                >
                                  Edit
                                </Link>
                              )}

                            {request.status !== "done" &&
                              request.status !== "canceled" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteModal({
                                      open: true,
                                      request,
                                    })
                                  }
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid gap-4 lg:hidden">
              {recentRequests.map((request) => (
                <article
                  key={request._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {request.recipientName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {request.hospitalName}
                      </p>
                    </div>

                    <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-red-50 px-3 text-sm font-bold text-red-600">
                      {request.bloodGroup}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {request.district}, {request.upazila}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Donation
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {request.donationDate}
                      </p>

                      <p className="text-xs text-slate-400">
                        {request.donationTime}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Status
                    </p>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {formatStatus(request.status)}
                    </span>

                    {request.status === "inprogress" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            `${request._id}-done`
                          }
                          onClick={() =>
                            handleStatusChange(
                              request._id,
                              "done"
                            )
                          }
                          className="flex-1 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                        >
                          {actionLoading ===
                          `${request._id}-done`
                            ? "Updating..."
                            : "Mark Done"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            `${request._id}-canceled`
                          }
                          onClick={() =>
                            handleStatusChange(
                              request._id,
                              "canceled"
                            )
                          }
                          className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          {actionLoading ===
                          `${request._id}-canceled`
                            ? "Updating..."
                            : "Cancel"}
                        </button>
                      </div>
                    )}
                  </div>

                  {request.status === "inprogress" && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Donor Information
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-800">
                        {request.donorName || "Not available"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {request.donorEmail || "No email"}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/donation-requests/${request._id}`}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      View
                    </Link>

                    {request.status !== "done" &&
                      request.status !== "canceled" && (
                        <>
                          <Link
                            href={`/donation-requests/${request._id}/edit`}
                            className="flex-1 rounded-xl bg-blue-50 px-4 py-2.5 text-center text-sm font-bold text-blue-600 hover:bg-blue-100"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                request,
                              })
                            }
                            className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </>
                      )}
                  </div>
                </article>
              ))}
            </div>

            {/* View All */}
            <div className="mt-6 flex justify-center">
              <Link
                href="/dashboard/my-donation-requests"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                View My All Requests →
              </Link>
            </div>
          </section>
        )}

        {/* No Requests */}
        {!loading && recentRequests.length === 0 && (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
              ❤️
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No donation requests yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven&apos;t created any donation requests yet.
              Create your first request and help connect patients
              with blood donors.
            </p>

            <Link
              href="/donation-requests/create"
              className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              Create Donation Request
            </Link>
          </section>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Delete donation request?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete the donation request
              for{" "}
              <span className="font-semibold text-slate-700">
                {deleteModal.request?.recipientName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    request: null,
                  })
                }
                disabled={actionLoading?.startsWith("delete-")}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading?.startsWith("delete-")}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading?.startsWith("delete-")
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}