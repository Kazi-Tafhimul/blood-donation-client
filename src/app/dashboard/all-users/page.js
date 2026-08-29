"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function AllUsersPage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    if (sessionLoading) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const tokenResult = await authClient.token();

        if (tokenResult.error || !tokenResult.data?.token) {
          router.push("/login");
          return;
        }

        if (session?.user?.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (statusFilter !== "all") {
          query.set("status", statusFilter);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${query.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResult.data.token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Fetch users error:", error);
        toast.error(error.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [sessionLoading, session, page, statusFilter, router]);

  const handleStatusChange = async (userId, status) => {
    try {
      setActionLoading(userId);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/status`,
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
        throw new Error(data.message || "Failed to update status");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                status,
              }
            : user,
        ),
      );

      toast.success(
        status === "blocked"
          ? "User blocked successfully"
          : "User unblocked successfully",
      );
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setActionLoading("");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      setActionLoading(userId);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
          body: JSON.stringify({
            role,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role,
              }
            : user,
        ),
      );

      toast.success(
        role === "admin" ? "User is now an admin" : "User is now a volunteer",
      );
    } catch (error) {
      console.error("Role update error:", error);
      toast.error(error.message || "Failed to update role");
    } finally {
      setActionLoading("");
    }
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">All Users</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage users, roles and account status.
            </p>
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-red-400"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {loading ? (
            <div className="p-8">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl">👥</div>

              <h2 className="mt-4 font-semibold text-slate-800">
                No users found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                There are no users matching this filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="transition hover:bg-gray-50">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 font-bold text-red-500">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-800">
                              {user.name || "Unknown User"}
                            </p>

                            <p className="text-xs text-slate-400">
                              {user.bloodGroup || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-600"
                              : user.role === "volunteer"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.status === "blocked"
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {user.status === "blocked" ? (
                            <button
                              type="button"
                              disabled={actionLoading === user._id}
                              onClick={() =>
                                handleStatusChange(user._id, "active")
                              }
                              className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:opacity-50"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={actionLoading === user._id}
                              onClick={() =>
                                handleStatusChange(user._id, "blocked")
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              Block
                            </button>
                          )}

                          {user.role === "donor" && (
                            <>
                              <button
                                type="button"
                                disabled={actionLoading === user._id}
                                onClick={() =>
                                  handleRoleChange(user._id, "volunteer")
                                }
                                className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                              >
                                Volunteer
                              </button>

                              <button
                                type="button"
                                disabled={actionLoading === user._id}
                                onClick={() =>
                                  handleRoleChange(user._id, "admin")
                                }
                                className="rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-600 transition hover:bg-purple-100 disabled:opacity-50"
                              >
                                Admin
                              </button>
                            </>
                          )}

                          {user.role === "volunteer" && (
                            <button
                              type="button"
                              disabled={actionLoading === user._id}
                              onClick={() =>
                                handleRoleChange(user._id, "admin")
                              }
                              className="rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-600 transition hover:bg-purple-100 disabled:opacity-50"
                            >
                              Admin
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
