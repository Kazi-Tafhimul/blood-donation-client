"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkGoogleUser = async () => {
      try {
        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          console.error("Token error:", tokenError);

          toast.error("Authentication failed. Please try again.");

          router.replace("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          },
        );

        if (!response.ok) {
          console.error(
            "Profile fetch failed:",
            response.status,
          );

          router.replace("/");
          return;
        }

        const user = await response.json();

        console.log("Google user profile:", user);

        const profileIncomplete =
          !user.bloodGroup ||
          !user.district ||
          !user.upazila;

        if (profileIncomplete) {
          toast.success("Please complete your profile.");

          router.replace("/complete-profile");
        } else {
          toast.success("Signed in successfully!");

          router.replace("/");
        }
      } catch (error) {
        console.error(
          "Google authentication callback failed:",
          error,
        );

        toast.error(
          "Something went wrong. Please try again.",
        );

        router.replace("/login");
      }
    };

    checkGoogleUser();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />

        <h1 className="text-xl font-bold text-slate-900">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Please wait while we set up your account.
        </p>
      </div>
    </main>
  );
}