"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50 px-6 py-16">
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
              d="M12 2.25c-5.25 6.75-8.25 10.5-8.25 14.25a8.25 8.25 0 0 0 16.5 0c0-3.75-3-7.5-8.25-14.25Z"
            />{" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h.01M15 12h.01M9.75 16.25a3.75 3.75 0 0 1 4.5 0"
            />{" "}
          </svg>{" "}
        </div>
        
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
          Error 404
        </p>
       
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved, deleted, or the address might be incorrect.
        </p>
       
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            Back to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Go Back
          </button>
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
