"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const selectedDistrict = districts.find(
    (district) => district.name === formData.district,
  );

  const filteredUpazilas = selectedDistrict
    ? upazilas.filter(
        (upazila) =>
          String(upazila.district_id) === String(selectedDistrict.id),
      )
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG and JPG images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (!formData.upazila) {
      newErrors.upazila = "Upazila is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    console.log("Register form:", formData);
    toast.success("Form validation successful");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Create Account
          </h1>

          <p className="text-sm text-slate-500">
            Join the BloodLink donor community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Arjun Chowdhury"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="arjun@email.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Profile Photo
            </label>

            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center transition-colors hover:border-red-300">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  {formData.photo
                    ? formData.photo.name
                    : "Click to upload or drag & drop"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  PNG, JPG up to 5MB
                </p>
              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Blood Group, District & Upazila */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Blood Group
              </label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-red-400"
              >
                <option value="">Select</option>

                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>

              {errors.bloodGroup && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.bloodGroup}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                District
              </label>

              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-red-400"
              >
                <option value="">Select District</option>

                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>

              {errors.district && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.district}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Upazila
              </label>

              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                disabled={!formData.district}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-gray-50 focus:border-red-400"
              >
                <option value="">
                  {formData.district
                    ? "Select Upazila"
                    : "Select District First"}
                </option>

                {filteredUpazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.name}>
                    {upazila.name}
                  </option>
                ))}
              </select>

              {errors.upazila && (
                <p className="mt-1 text-sm text-red-500">{errors.upazila}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400"
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-2xl bg-red-600 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:bg-red-700"
            >
              Create Account
            </button>
          </div>

          {/* Login Link */}
          <div className="pt-2 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-red-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}