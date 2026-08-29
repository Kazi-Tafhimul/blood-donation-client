"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [stats, setStats] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // GET DASHBOARD STATS
  // =========================

  const getDashboardStats = async () => {
    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

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
        throw new Error(
          data.message || "Failed to fetch dashboard statistics"
        );
      }

      setStats({
        totalDonors: data.totalDonors ?? 0,
        totalFunding: data.totalFunding ?? 0,
        totalRequests: data.totalRequests ?? 0,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);

      toast.error(
        error.message || "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD STATS
  // =========================

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) return;

    getDashboardStats();
  }, [sessionLoading, session?.user?.id]);

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

  const userRole = user?.role;

  const roleLabel =
    userRole === "admin"
      ? "Admin Dashboard"
      : userRole === "volunteer"
        ? "Volunteer Dashboard"
        : "Dashboard";

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-red-600 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-red-100">
              {roleLabel}
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {user?.name || "User"}!
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100 sm:text-base">
              Manage blood donation activities, monitor donors, and
              help connect people with the blood they need.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
            🩸
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Overview
          </h2>

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
                  👥
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
                  💰
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
                  🩸
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}