"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { FaUserCircle } from "react-icons/fa";
import { TbMoneybagHeart } from "react-icons/tb";
import { FaDroplet } from "react-icons/fa6";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [stats, setStats] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const user = session?.user;
  const userRole = user?.role;
  const [profileName, setProfileName] = useState("");

  const roleLabel =
    userRole === "admin"
      ? "Admin Dashboard"
      : userRole === "volunteer"
        ? "Volunteer Dashboard"
        : "Donor Dashboard";

  // =========================
  // GET DASHBOARD STATS
  // Admin + Volunteer only
  // =========================

  const getDashboardStats = async () => {
    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${API_URL}/dashboard/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard statistics");
      }

      setStats({
        totalDonors: data.totalDonors ?? 0,
        totalFunding: data.totalFunding ?? 0,
        totalRequests: data.totalRequests ?? 0,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);

      toast.error(error.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET DONOR RECENT REQUESTS
  // Donor only
  // =========================

  const getRecentRequests = async () => {
    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${API_URL}/my-donation-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch donation requests");
      }

      // Backend already sorts by createdAt.
      // We only need the latest 3 requests.
      setRecentRequests(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (error) {
      console.error("Recent donation requests error:", error);

      toast.error(error.message || "Failed to load recent donation requests");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) return;
    const loadProfileName = async () => {
      try {
        const tokenResult = await authClient.token();

        if (!tokenResult.data?.token) return;

        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.name) {
          setProfileName(data.name);
        }
      } catch (error) {
        console.error("Dashboard profile fetch error:", error);
      }
    };

    loadProfileName();

    if (userRole === "admin" || userRole === "volunteer") {
      getDashboardStats();
    } else if (userRole === "donor") {
      getRecentRequests();
    }
  }, [sessionLoading, session?.user?.id, userRole, profileName]);

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

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-red-600 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-red-100">{roleLabel}</p>

            <h1 className="text-2xl font-bold sm:text-3xl">
             Welcome back, {profileName || user?.name || "User"}!
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100 sm:text-base">
              Manage blood donation activities, monitor donors, and help connect
              people with the blood they need.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
            <FaDroplet/>
          </div>
        </div>
      </section>

      {(userRole === "admin" || userRole === "volunteer") && (
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Overview</h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick overview of the blood donation platform
            </p>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-slate-200" />

                    <div className="mt-5 h-4 w-28 rounded bg-slate-200" />

                    <div className="mt-3 h-7 w-20 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Donors */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Donors
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {stats.totalDonors}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      Registered blood donors
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
                    <FaUserCircle/>
                  </div>
                </div>
              </div>

              {/* Total Funding */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Funding
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      ৳{stats.totalFunding}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      Total platform funding
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                    <TbMoneybagHeart/>

                  </div>
                </div>
              </div>

              {/* Total Requests */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Blood Donation Requests
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {stats.totalRequests}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      Total donation requests
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    <FaDroplet/>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================================================== */}
      {/* DONOR RECENT REQUESTS                                */}
      {/* ===================================================== */}

      {userRole === "donor" && (
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Donation Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest blood donation requests
              </p>
            </div>

            <Link
              href="/dashboard/my-donation-requests"
              className="text-sm font-semibold text-red-500 transition hover:text-red-600"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
                />
              ))}
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
                <FaDroplet/>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No donation requests yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                You have not created any blood donation requests yet.
              </p>

              <Link
                href="/donation-requests/create"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                + Create Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Request Info */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-500">
                        {request.bloodGroup || "N/A"}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {request.recipientName || "N/A"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {request.hospitalName || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {request.district || "N/A"}
                          {request.upazila ? `, ${request.upazila}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Date + Status + View */}
                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <div className="text-sm text-slate-500">
                        <span className="font-medium">
                          {request.donationDate || "N/A"}
                        </span>

                        {request.donationTime && (
                          <span className="ml-2 text-slate-400">
                            {request.donationTime}
                          </span>
                        )}
                      </div>

                      <StatusBadge status={request.status} />

                      <Link
                        href={`/donation-requests/${request._id}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// =========================
// STATUS BADGE
// =========================

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
