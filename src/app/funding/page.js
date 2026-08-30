"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { TbMoneybagHeart } from "react-icons/tb";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FundingPage() {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [amount, setAmount] = useState("");

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const getFundings = async () => {
    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(`${API_URL}/fundings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch fundings");
      }

      setFundings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Funding fetch error:", error);
      toast.error(error.message || "Failed to load fundings");
    } finally {
      setLoading(false);
    }
  };
  const handleContinueToPayment = async () => {
    try {
      const fundAmount = Number(amount);

      if (!fundAmount || fundAmount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/fundings/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            amount: fundAmount,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment session");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL not found");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Funding payment error:", error);

      toast.error(error.message || "Failed to continue to payment");
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) return;

    getFundings();
  }, [sessionLoading, session?.user?.id]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Funding
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View all successful funds given to the organization.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFundModal(true)}
          className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Give Fund
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6">
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-lg bg-slate-100" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        ) : fundings.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
              <TbMoneybagHeart />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No funding yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are no successful funding payments yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    #
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Fund Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Funding Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {fundings.map((funding, index) => (
                  <tr
                    key={funding._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {funding.userName || "Unknown User"}
                        </p>

                        {funding.userEmail && (
                          <p className="mt-1 text-xs text-slate-400">
                            {funding.userEmail}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-600">
                        ৳{Number(funding.amount || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {funding.createdAt
                        ? new Date(funding.createdAt).toLocaleDateString(
                            "en-BD",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Give Fund</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the amount you want to donate to the organization.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowFundModal(false);
                  setAmount("");
                }}
                className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="fundAmount"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Fund Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                  ৳
                </span>

                <input
                  id="fundAmount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowFundModal(false);
                  setAmount("");
                }}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleContinueToPayment}
                disabled={!amount || Number(amount) <= 0}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
