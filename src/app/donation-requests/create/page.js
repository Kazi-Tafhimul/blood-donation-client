"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FaHandHoldingHeart, FaUserCircle } from "react-icons/fa";
import { MdOutlineMedicalInformation } from "react-icons/md";

export default function CreateDonationRequestPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState({
    recipientName: "",
    bloodGroup: "A+",
    district: "",
    upazila: "",
    hospitalName: "",
    fullAddress: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const selectedDistrict = districts.find(
    (district) => district.name === formData.district,
  );

  const filteredUpazilas = selectedDistrict
    ? upazilas.filter((upazila) => upazila.district_id === selectedDistrict.id)
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required";
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

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = "Hospital name is required";
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = "Full address is required";
    }

    if (!formData.donationDate) {
      newErrors.donationDate = "Required date is required";
    }

    if (!formData.donationTime) {
      newErrors.donationTime = "Required time is required";
    }

    if (!formData.requestMessage.trim()) {
      newErrors.requestMessage = "Request message is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      if (!session?.user) {
        alert("Please login first.");
        router.push("/login");
        return;
      }

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/donation-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          "Your account is blocked. You cannot create donation requests.",
        );
        return;
      }
      toast.success("Donation request created successfully!") 

     // alert("Donation request created successfully!");

      router.push("/donation-requests");
    } catch (error) {
      console.error("Create donation request error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Create Donation Request
          </h1>

          <p className="text-sm text-slate-500">
            Submit a blood donation request and connect with available donors
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-red-500">
              <span className="text-xl">
                <FaUserCircle />
              </span>
              <span>Requester Information</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Requester Name
                </label>

                <input
                  type="text"
                  value={isPending ? "Loading..." : session?.user?.name || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Requester Email
                </label>

                <input
                  type="email"
                  value={isPending ? "Loading..." : session?.user?.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-transparent bg-gray-50 px-4 py-3 text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-red-500">
              <span className="text-xl">
                <FaHandHoldingHeart />
              </span>
              <span>Recipient Information</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Recipient Name
                </label>

                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Patient full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none"
                />

                {errors.recipientName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.recipientName}
                  </p>
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
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 focus:border-red-400 focus:outline-none"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
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
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 focus:border-red-400 focus:outline-none"
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
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 focus:border-red-400 focus:outline-none"
                >
                  <option value="">Select Upazila</option>

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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Hospital Name
                </label>

                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="Dhaka Medical College Hospital"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none"
                />

                {errors.hospitalName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.hospitalName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Address
                </label>

                <input
                  type="text"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  placeholder="Hospital address"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none"
                />

                {errors.fullAddress && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fullAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Required Date
                </label>

                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-700 focus:border-red-400 focus:outline-none"
                />

                {errors.donationDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.donationDate}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Required Time
                </label>

                <input
                  type="time"
                  name="donationTime"
                  value={formData.donationTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-700 focus:border-red-400 focus:outline-none"
                />

                {errors.donationTime && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.donationTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-red-500">
              <span className="text-xl">
                <MdOutlineMedicalInformation />
              </span>
              <span>Medical Information</span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Request Message
              </label>

              <textarea
                name="requestMessage"
                value={formData.requestMessage}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the medical situation, urgency, and any additional information for potential donors..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:border-red-400 focus:outline-none"
              />

              {errors.requestMessage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.requestMessage}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting || isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-medium text-white shadow-md transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                <FaHandHoldingHeart />
              </span>

              <span>
                {submitting ? "Creating..." : "Create Donation Request"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
