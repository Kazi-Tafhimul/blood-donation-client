"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";
import { authClient } from "@/lib/auth-client";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CompleteProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          toast.error("Please login first");
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const user = await response.json();

        setFormData({
          name: user.name || "",
          bloodGroup: user.bloodGroup || "",
          district: user.district || "",
          upazila: user.upazila || "",
        });
      } catch (error) {
        console.error("Load profile failed:", error);
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Your session has expired. Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            bloodGroup: formData.bloodGroup,
            district: formData.district,
            upazila: formData.upazila,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update profile");
        return;
      }

      toast.success("Profile completed successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Update profile failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-gray-500">
          Loading your profile...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Complete Your Profile
          </h1>

          <p className="text-sm leading-6 text-slate-500">
            Please provide your blood group and location to continue using
            BloodLink.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-700 outline-none focus:border-red-400"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

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
              <option value="">Select Blood Group</option>

              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            {errors.bloodGroup && (
              <p className="mt-1 text-sm text-red-500">{errors.bloodGroup}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <p className="mt-1 text-sm text-red-500">{errors.district}</p>
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

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-red-600 py-3.5 font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Profile..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
