"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await authClient.getSession();

        if (error) {
          console.error("Session error:", error);
          setSession(null);
          return;
        }

        setSession(data);
      } catch (error) {
        console.error("Failed to get session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      setSession(null);
      toast.success("Logged out successfully");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong");
    }
  };

  const getInitials = (name = "") => {
    return (
      name
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  // Prevent navbar flickering while session is loading
  if (loading) {
    return (
      <nav className="flex h-[73px] items-center justify-between border-b border-gray-200 bg-white px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2.25c-5.25 6.75-8.25 10.5-8.25 14.25a8.25 8.25 0 0 0 16.5 0c0-3.75-3-7.5-8.25-14.25Z"
              />
            </svg>
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Blood<span className="text-red-500">Link</span>
          </span>
        </Link>
      </nav>
    );
  }

  // Logged out navbar
  if (!session?.user) {
    return (
      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2.25c-5.25 6.75-8.25 10.5-8.25 14.25a8.25 8.25 0 0 0 16.5 0c0-3.75-3-7.5-8.25-14.25Z"
              />
            </svg>
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Blood<span className="text-red-500">Link</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/donation-requests"
            className="font-semibold text-slate-600 transition-colors hover:text-red-500"
          >
            Donation Requests
          </Link>

          <Link
            href="/find-donors"
            className="font-semibold text-slate-600 transition-colors hover:text-red-500"
          >
            Find Donors
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="font-semibold text-slate-600 transition-colors hover:text-gray-900"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-red-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-red-600"
          >
            Join as Donor
          </Link>
        </div>
      </nav>
    );
  }

  // Logged in navbar
  const user = session.user;

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      {/* Hamburger */}
      <button
        type="button"
        className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-gray-100 focus:outline-none"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button
          type="button"
          className="relative p-1 text-slate-600 transition-colors hover:text-slate-900 focus:outline-none"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>

          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
        </button>

        {/* Avatar */}
        <button
          type="button"
          onClick={handleLogout}
          title={`${user.name || user.email} — Click to logout`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-sm font-bold tracking-wider text-white shadow-sm transition-colors hover:bg-red-600"
        >
          {getInitials(user.name)}
        </button>
      </div>
    </nav>
  );
}