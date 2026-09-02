"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { IoMdCloudDone } from "react-icons/io";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function FundingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        toast.error("Payment session not found");
        return;
      }

      try {
        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/fundings/verify-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            sessionId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to verify payment");
        }

        setVerified(true);
      } catch (error) {
        console.error("Payment verification error:", error);

        toast.error(error?.message || "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-500" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-500">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Payment Verification Failed
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We could not verify your payment. Please try again or contact
            support if the amount was charged.
          </p>

          <Link
            href="/funding"
            className="mt-6 inline-flex rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Back to Funding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          <IoMdCloudDone />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Payment Successful
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Thank you for supporting our organization. Your funding has been
          received successfully.
        </p>

        <Link
          href="/funding"
          className="mt-6 inline-flex rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Back to Funding
        </Link>
      </div>
    </div>
  );
}

export default function FundingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm font-medium text-slate-600">
            Verifying your payment...
          </p>
        </div>
      }
    >
      <FundingSuccessContent />
    </Suspense>
  );
}
