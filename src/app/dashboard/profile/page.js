"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // =========================
  // DISTRICT OPTIONS
  // =========================

  const districtOptions = useMemo(() => {
    return Array.isArray(districts) ? districts : [];
  }, []);

  // =========================
  // FIND SELECTED DISTRICT
  // =========================

  const selectedDistrict = useMemo(() => {
    return districtOptions.find(
      (district) =>
        district.name === formData.district ||
        district.id === formData.district,
    );
  }, [districtOptions, formData.district]);

  // =========================
  // UPAZILA OPTIONS
  // =========================

  const upazilaOptions = useMemo(() => {
    if (!selectedDistrict) return [];

    return upazilas.filter(
      (upazila) => String(upazila.district_id) === String(selectedDistrict.id),
    );
  }, [selectedDistrict]);

  // =========================
  // GET PROFILE
  // =========================

  const getProfile = async () => {
    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      // =========================
      // API: GET PROFILE
      // =========================
      console.log("PROFILE API URL:", `${API_URL}/profile`);

      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      const profileData = {
        name: data.name || "",
        email: data.email || "",
        image: data.image || data.photo || "",
        bloodGroup: data.bloodGroup || "",
        district: data.district || "",
        upazila: data.upazila || "",
      };

      setProfile(profileData);
      setFormData(profileData);
    } catch (error) {
      console.error("Get profile error:", error);

      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    getProfile();
  }, [sessionLoading, session?.user?.id]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE DISTRICT CHANGE
  // =========================

  const handleDistrictChange = (event) => {
    const districtName = event.target.value;

    setFormData((prev) => ({
      ...prev,
      district: districtName,
      upazila: "",
    }));
  };

  // =========================
  // EDIT PROFILE
  // =========================

  const handleEdit = () => {
    setFormData(profile);
    setEditing(true);
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.bloodGroup) {
      toast.error("Blood group is required");
      return;
    }

    if (!formData.district) {
      toast.error("District is required");
      return;
    }

    if (!formData.upazila) {
      toast.error("Upazila is required");
      return;
    }

    try {
      setSaving(true);

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      // =========================
      // API: UPDATE PROFILE
      // =========================

      const response = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          bloodGroup: formData.bloodGroup,
          district: formData.district,
          upazila: formData.upazila,
          image: formData.image.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      if (!data.user) {
        throw new Error(
          "Profile updated but updated user data was not returned",
        );
      }

      const updatedUser = data.user;

      const updatedProfile = {
        name: updatedUser.name || "",
        email: updatedUser.email || profile.email || "",
        image: updatedUser.image || updatedUser.photo || "",
        bloodGroup: updatedUser.bloodGroup || "",
        district: updatedUser.district || "",
        upazila: updatedUser.upazila || "",
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);

      // Return to initial non-editable state
      setEditing(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (sessionLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="animate-pulse p-6 sm:p-8">
              <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-8 sm:flex-row">
                <div className="h-24 w-24 rounded-full bg-gray-200" />

                <div className="flex-1">
                  <div className="h-6 w-40 rounded bg-gray-200" />
                  <div className="mt-3 h-4 w-56 rounded bg-gray-200" />
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item}>
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="mt-2 h-12 rounded-xl bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // PROFILE PAGE
  // =========================

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 md:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <section className="mb-8">
          <p className="text-sm font-semibold text-red-500">Dashboard</p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-gray-500 md:text-base">
                View and manage your personal profile information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 15.47a4.5 4.5 0 0 1-1.897 1.13l-2.685.896.896-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487ZM19.5 7.5 16.5 4.5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 13.5V19.5A1.5 1.5 0 0 1 18 21H4.5A1.5 1.5 0 0 1 3 19.5V6A1.5 1.5 0 0 1 4.5 4.5h6"
                  />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </section>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Profile Top */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-white px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* Avatar */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-red-100 shadow-sm">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.name || "Profile"}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-3xl font-bold text-red-500">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.email || "No email available"}
                </p>

                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold capitalize text-red-600">
                    {session?.user?.role || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Personal Information
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your profile information is shown below.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    editing
                      ? "border-gray-300 bg-white text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Email address cannot be changed.
                </p>
              </div>

              {/* Blood Group */}
              <div>
                <label
                  htmlFor="bloodGroup"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Blood Group
                </label>

                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    editing
                      ? "border-gray-300 bg-white text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <option value="">Select blood group</option>

                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label
                  htmlFor="district"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  District
                </label>

                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  disabled={!editing || saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    editing
                      ? "border-gray-300 bg-white text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <option value="">Select district</option>

                  {districtOptions.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila */}
              <div>
                <label
                  htmlFor="upazila"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Upazila
                </label>

                <select
                  id="upazila"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleChange}
                  disabled={!editing || saving || !formData.district}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    editing
                      ? "border-gray-300 bg-white text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <option value="">
                    {formData.district
                      ? "Select upazila"
                      : "Select district first"}
                  </option>

                  {upazilaOptions.map((upazila) => (
                    <option key={upazila.id} value={upazila.name}>
                      {upazila.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar URL */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Avatar URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  disabled={!editing || saving}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    editing
                      ? "border-gray-300 bg-white text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            {/* Buttons */}
            {editing && (
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
