"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const checkProfileAndRedirect = async () => {
    try {
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        console.error("Token error:", tokenError);

        router.push("/");
        router.refresh();
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
        console.error("Profile fetch failed:", response.status);

        router.push("/");
        router.refresh();
        return;
      }

      const user = await response.json();

      console.log("Logged-in user profile:", user);

      const profileIncomplete =
        !user.bloodGroup || !user.district || !user.upazila;

      if (profileIncomplete) {
        router.push("/complete-profile");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (error) {
      console.error("Profile check failed:", error);

      router.push("/");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
      });
    } catch (error) {
      console.error("Google login failed:", error);

      toast.error("Google login failed. Please try again.");

      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Login error:", error);

        toast.error(error.message || "Invalid email or password");

        return;
      }

      console.log("Login successful:", data);

      toast.success("Signed in successfully!");

      await checkProfileAndRedirect();
    } catch (error) {
      console.error("Login failed:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="text-sm text-slate-500">
            Sign in to your BloodLink account
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-3.5 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.57-5.17 3.57-8.64Z"
            />

            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.11-6.7-4.95H1.3v3.09A12 12 0 0 0 12 24Z"
            />

            <path
              fill="#FBBC05"
              d="M5.3 14.29A7.2 7.2 0 0 1 4.92 12c0-.79.14-1.56.38-2.29V6.62H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.38l4-3.09Z"
            />

            <path
              fill="#EA4335"
              d="M12 4.77c1.76 0 3.34.61 4.59 1.82l3.44-3.44C17.95 1.17 15.24 0 12 0A12 12 0 0 0 1.3 6.62l4 3.09 4 3.09c.94-2.84 3.58-4.94 6.7-4.94Z"
            />
          </svg>

          {loading ? "Signing In..." : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs font-medium text-gray-400">OR</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="donor@bloodlink.org"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-sm text-slate-500">
              No account yet?{" "}
              <Link
                href="/register"
                className="font-semibold text-red-600 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
