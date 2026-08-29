"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Card, Chip, Input } from "@heroui/react";
import toast from "react-hot-toast";

const INITIAL_VISIBLE_COUNT = 4;

export default function DonationRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donation-requests`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch donation requests");
        }

        const pendingRequests = Array.isArray(data)
          ? data.filter((request) => request.status === "pending")
          : [];

        setRequests(pendingRequests);
      } catch (error) {
        console.error("Fetch donation requests error:", error);
        toast.error("Failed to load donation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return requests;
    }

    return requests.filter((request) => {
      const recipientName = request.recipientName?.toLowerCase() || "";
      const bloodGroup = request.bloodGroup?.toLowerCase() || "";

      return (
        recipientName.includes(searchText) || bloodGroup.includes(searchText)
      );
    });
  }, [requests, search]);

  const visibleRequests = showAll
    ? filteredRequests
    : filteredRequests.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <main className="min-h-screen bg-gray-50/50 pb-16">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Blood Donation Requests
          </h1>

          <p className="mt-2 text-sm text-gray-500 md:text-base">
            Browse active requests and help save a life today.
          </p>
        </section>

        {/* Search */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search by name or blood group..."
            variant="bordered"
            size="lg"
            className="w-full sm:max-w-md"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            }
          />

          <Chip color="danger" variant="flat" size="lg" className="w-fit">
            {filteredRequests.length} Pending
          </Chip>
        </section>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Card
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm"
              >
                <div className="h-1.5 w-full bg-gray-200" />

                <Card.Content className="p-6">
                  <div className="animate-pulse space-y-5">
                    <div className="h-6 w-40 rounded bg-gray-200" />
                    <div className="h-5 w-20 rounded bg-gray-200" />
                    <div className="h-4 w-56 rounded bg-gray-200" />
                    <div className="h-4 w-48 rounded bg-gray-200" />
                    <div className="h-10 w-full rounded-xl bg-gray-200" />
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRequests.length === 0 && (
          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <Card.Content className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
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

              <h2 className="text-xl font-bold text-gray-900">
                No pending requests found
              </h2>

              <p className="mt-2 max-w-md text-sm text-gray-500">
                {search
                  ? "Try searching with a different recipient name or blood group."
                  : "There are no active blood donation requests at the moment."}
              </p>
            </Card.Content>
          </Card>
        )}

        {/* Requests */}
        {!loading && visibleRequests.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {visibleRequests.map((request) => (
                <Card
                  key={request._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Red top border */}
                  <div className="h-1.5 w-full bg-red-500" />

                  <Card.Content className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {request.recipientName}
                        </h2>

                        <Chip
                          color="warning"
                          variant="flat"
                          size="sm"
                          className="mt-2"
                        >
                          Pending
                        </Chip>
                      </div>

                      {/* Blood Group */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50 text-sm font-bold text-red-500">
                        {request.bloodGroup}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 space-y-3 text-sm text-gray-500">
                      {/* Location */}
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.8"
                          stroke="currentColor"
                          className="h-5 w-5 shrink-0 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>

                        <span>
                          {request.district}, {request.upazila}
                        </span>
                      </div>

                      {/* Hospital */}
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.8"
                          stroke="currentColor"
                          className="h-5 w-5 shrink-0 text-gray-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5A2.25 2.25 0 0 0 18 8.25H6A2.25 2.25 0 0 0 3.75 10.5V21"
                          />
                        </svg>

                        <span>{request.hospitalName}</span>
                      </div>

                      {/* Date & Time */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="h-5 w-5 shrink-0 text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                            />
                          </svg>

                          <span>{request.donationDate}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="h-5 w-5 shrink-0 text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>

                          <span>{request.donationTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Button */}
                    <Button
                      as={Link}
                      href={`/donation-requests/${request._id}`}
                      variant="secondary"
                      className="mt-6 w-full rounded-xl font-semibold"
                    >
                      View Details
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </div>

            {/* See More */}
            {filteredRequests.length > INITIAL_VISIBLE_COUNT && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onPress={() => setShowAll((prev) => !prev)}
                  className="rounded-full px-8 font-semibold"
                >
                  {showAll ? "Show Less" : "See More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
