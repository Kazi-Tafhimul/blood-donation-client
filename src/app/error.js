"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16">
      {" "}
      <div className="w-full max-w-xl text-center">
        {" "}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.6"
            stroke="currentColor"
            className="h-10 w-10 text-red-500"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.008v.008H12v-.008Z"
            />{" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.29 3.86 2.82 17a2.25 2.25 0 0 0 1.95 3.375h14.46A2.25 2.25 0 0 0 21.18 17L13.71 3.86a1.95 1.95 0 0 0-3.42 0Z"
            />{" "}
          </svg>{" "}
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
          Something went wrong
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          We hit a problem
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          Something unexpected happened while loading this page. Please try
          again, or return to the homepage.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-sm font-bold tracking-tight text-gray-900">
            Blood<span className="text-red-500">Link</span>
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Connecting donors. Saving lives.
          </p>
        </div>
      </div>
    </main>
  );
}
