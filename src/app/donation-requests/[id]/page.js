"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function DonationRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [request, setRequest] = useState(null);
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Check logged-in user
        const sessionResult = await authClient.getSession();

        if (sessionResult.error || !sessionResult.data?.user) {
          toast.error("Please login to view donation request details.");
          router.push("/login");
          return;
        }

        setSession(sessionResult.data);

        // Fetch donation request
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donation-requests/${params.id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load donation request",
          );
        }

        setRequest(data);
      } catch (error) {
        console.error("Load donation request error:", error);

        toast.error(
          error.message || "Failed to load donation request.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      loadData();
    }
  }, [params?.id, router]);

  // Confirm donation
  const handleConfirmDonation = async () => {
    if (!session?.user) {
      toast.error("Please login first.");
      router.push("/login");
      return;
    }

    try {
      setDonating(true);

      // Get Better Auth JWT
      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        toast.error("Authentication token could not be created.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/donation-requests/${params.id}/donate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Failed to confirm donation.",
        );
        return;
      }

      setRequest(data.donationRequest);
      setIsModalOpen(false);

      toast.success("Donation confirmed successfully!");
    } catch (error) {
      console.error("Confirm donation error:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setDonating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="h-1.5 bg-red-500" />

            <div className="animate-pulse p-6 md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div className="space-y-3">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-9 w-64 rounded-lg bg-gray-200" />
                  <div className="h-7 w-24 rounded-full bg-gray-200" />
                </div>

                <div className="h-16 w-16 rounded-full bg-gray-200" />
              </div>

              <div className="my-8 h-px bg-gray-200" />

              <div className="space-y-5">
                <div className="h-6 w-48 rounded bg-gray-200" />

                <div className="grid gap-5 md:grid-cols-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      key={item}
                      className="h-20 rounded-2xl bg-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Not found
  if (!request) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
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
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.29 3.86 1.82 18a2.25 2.25 0 0 0 1.93 3.375h16.5A2.25 2.25 0 0 0 22.18 18L13.71 3.86a2.25 2.25 0 0 0-3.42 0Z"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Donation request not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              The donation request may have been removed or no
              longer exists.
            </p>

            <Link
              href="/donation-requests"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to Requests
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isPending = request.status === "pending";

  return (
    <>
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link
            href="/donation-requests"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
          >
            <span className="text-lg">←</span>
            Back to Donation Requests
          </Link>

          {/* Main Card */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* Top Red Border */}
            <div className="h-1.5 bg-red-500" />

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-500">
                    Blood Donation Request
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                    {request.recipientName}
                  </h1>

                  {/* Status */}
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      isPending
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isPending ? "Pending" : "In Progress"}
                  </span>
                </div>

                {/* Blood Group */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-xl font-bold text-red-500">
                  {request.bloodGroup}
                </div>
              </div>

              <div className="my-7 h-px bg-gray-200" />

              {/* Recipient Information */}
              <section>
                <h2 className="text-lg font-bold text-gray-900">
                  Recipient Information
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoItem
                    label="Recipient Name"
                    value={request.recipientName}
                  />

                  <InfoItem
                    label="Blood Group"
                    value={request.bloodGroup}
                  />

                  <InfoItem
                    label="District"
                    value={request.district}
                  />

                  <InfoItem
                    label="Upazila"
                    value={request.upazila}
                  />

                  <InfoItem
                    label="Hospital Name"
                    value={request.hospitalName}
                  />

                  <InfoItem
                    label="Full Address"
                    value={request.fullAddress}
                  />

                  <InfoItem
                    label="Required Date"
                    value={request.donationDate}
                  />

                  <InfoItem
                    label="Required Time"
                    value={request.donationTime}
                  />
                </div>
              </section>

              <div className="my-7 h-px bg-gray-200" />

              {/* Request Message */}
              <section>
                <h2 className="text-lg font-bold text-gray-900">
                  Request Message
                </h2>

                <div className="mt-4 rounded-2xl bg-gray-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                    {request.requestMessage || "No message provided."}
                  </p>
                </div>
              </section>

              <div className="my-7 h-px bg-gray-200" />

              {/* Requester Information */}
              <section>
                <h2 className="text-lg font-bold text-gray-900">
                  Requester Information
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoItem
                    label="Requester Name"
                    value={request.requesterName}
                  />

                  <InfoItem
                    label="Requester Email"
                    value={request.requesterEmail}
                  />
                </div>
              </section>

              {/* Donate Section */}
              {isPending && (
                <section className="mt-8 rounded-2xl border border-red-100 bg-red-50/70 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Want to help?
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Confirm that you are available to donate
                        blood for this request.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Donate Blood
                    </button>
                  </div>
                </section>
              )}

              {/* In Progress */}
              {!isPending && (
                <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                  <p className="font-semibold text-blue-700">
                    This donation request is already in progress.
                  </p>

                  {request.donorName && (
                    <p className="mt-1 text-sm text-blue-600">
                      Donor: {request.donorName}
                    </p>
                  )}

                  {request.donorEmail && (
                    <p className="mt-1 text-sm text-blue-600">
                      Email: {request.donorEmail}
                    </p>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Custom Tailwind Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !donating) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Confirm Blood Donation
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Please confirm your information before donating.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={donating}
                  className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 px-6 py-6">
              {/* Donor Name */}
              <div>
                <label
                  htmlFor="donorName"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Donor Name
                </label>

                <input
                  id="donorName"
                  type="text"
                  value={session?.user?.name || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600 outline-none"
                />
              </div>

              {/* Donor Email */}
              <div>
                <label
                  htmlFor="donorEmail"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Donor Email
                </label>

                <input
                  id="donorEmail"
                  type="email"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600 outline-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={donating}
                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDonation}
                disabled={donating}
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {donating ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Z"
                      />
                    </svg>

                    Confirming...
                  </>
                ) : (
                  "Confirm Donation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-gray-800">
        {value || "N/A"}
      </p>
    </div>
  );
}