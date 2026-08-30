"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Better Auth reactive session
  const { data: session, isPending: loading } = authClient.useSession();
  const [profileName, setProfileName] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(0);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (!session?.user) return;

    const loadProfileName = async () => {
      try {
        const tokenResult = await authClient.token();

        if (!tokenResult.data?.token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${tokenResult.data.token}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok && data.name) {
          setProfileName(data.name);
          setProfileImage(data.image || "");
        }
      } catch (error) {
        console.error("Navbar profile fetch error:", error);
      }
    };

    loadProfileName();

    const handleProfileUpdate = () => {
      loadProfileName();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [session]);

  // console.log("NAVBAR SESSION:", session);
  // console.log("NAVBAR RENDER USER:", session?.user?.name);

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      setIsMenuOpen(false);

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

  // Loading state
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
      <nav className="border-b border-gray-200 bg-white px-6 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
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
          <div className="hidden items-center gap-8 md:flex ">
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
          <div className="flex items-center gap-3 md:gap-6">
            <Link
              href="/login"
              className="font-semibold text-slate-600 transition-colors hover:text-gray-900"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-red-500 px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-red-600 md:px-6"
            >
              Join as Donor
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Logged in user
  const user = session.user;

  const displayName = profileName || user.name || "User";
  // console.log("NAVBAR DISPLAY NAME:", displayName);

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
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
                  d="M12 2.25c-5.25 6.75-8.25 10.5-8.25 14.25a8.25 8.25 0 0 0 16.5 0c0-3.75-3-7.5-8.25-14.25Z"
                />
              </svg>
            </div>

            <span className="text-lg font-bold tracking-tight text-gray-900">
              Blood<span className="text-red-500">Link</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
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

            <Link
              href="/funding"
              className="font-semibold text-slate-600 transition-colors hover:text-red-500"
            >
              Funding
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 hover:bg-gray-100"
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

            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          </button>

          {/* User */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-red-500 text-sm font-bold text-white hover:bg-red-600"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(displayName)
              )}
            </button>

            {isMenuOpen && (
              <>
                {/* Overlay */}
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Dropdown */}
                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  {/* User info */}
                  <div className="border-b border-gray-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-500 text-sm font-bold text-white">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(displayName)
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">
                          {displayName}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown menu */}
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/my-donation-requests"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      My Donation Requests
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50 hover:text-red-500"
                    >
                      My Profile
                    </Link>

                    <div className="my-2 border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
