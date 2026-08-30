"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";
import { authClient } from "@/lib/auth-client";
import { FaHandHoldingHeart, FaUserCircle } from "react-icons/fa";
import { MdOutlineMedicalInformation } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import toast from "react-hot-toast";

export default function EditDonationRequestPage() {
  const params = useParams();
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
  const [pageError, setPageError] = useState("");

  const selectedDistrict = districts.find(
    (district) => district.name === formData.district,
  );

  const filteredUpazilas = selectedDistrict
    ? upazilas.filter((upazila) => upazila.district_id === selectedDistrict.id)
    : [];

  useEffect(() => {
    const fetchRequest = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        setPageError("");

        const tokenResult = await authClient.token();

        if (tokenResult.error || !tokenResult.data?.token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/donation-requests/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResult.data.token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load donation request.");
        }

        if (data.status === "done" || data.status === "canceled") {
          setPageError(
            "Completed or canceled donation requests cannot be edited.",
          );
          return;
        }

        setFormData({
          recipientName: data.recipientName || "",
          bloodGroup: data.bloodGroup || "A+",
          district: data.district || "",
          upazila: data.upazila || "",
          hospitalName: data.hospitalName || "",
          fullAddress: data.fullAddress || "",
          donationDate: data.donationDate || "",
          donationTime: data.donationTime || "",
          requestMessage: data.requestMessage || "",
        });
      } catch (error) {
        console.error("Fetch donation request error:", error);
        setPageError(error.message || "Failed to load donation request.");
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      fetchRequest();
    }
  }, [params?.id, sessionLoading, router]);

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

  const validateForm = () => {
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

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const tokenResult = await authClient.token();

      if (tokenResult.error || !tokenResult.data?.token) {
        alert("Authentication token could not be found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/donation-requests/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResult.data.token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update donation request.");
        return;
      }

     // alert("Donation request updated successfully!");
     toast.success("Donation request updated successfully!")

      router.push("/dashboard/my-donation-requests");
    } catch (error) {
      console.error("Update donation request error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 animate-pulse">
            <div className="h-8 w-64 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-96 rounded bg-gray-200" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 h-6 w-48 rounded bg-gray-200" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.29 3.86 1.82 18a2.25 2.25 0 0 0 1.93 3.375h16.5A2.25 2.25 0 0 0 22.18 18L13.71 3.86a2.25 2.25 0 0 0-3.42 0Z"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Unable to edit donation request
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {pageError}
            </p>

            <button
              type="button"
              onClick={() => router.push("/dashboard/my-donation-requests")}
              className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to My Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
      
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard/my-donation-requests")}
            className="mb-4 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
          >
            ← Back to My Donation Requests
          </button>

          <h1 className="text-2xl font-bold text-slate-800">
            Edit Donation Request
          </h1>

          <p className="text-sm text-slate-500">
            Update the information of your blood donation request.
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
                  value={session?.user?.name || ""}
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
                  value={session?.user?.email || ""}
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
                  disabled={!formData.district}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 focus:border-red-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
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
                rows={5}
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

     
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/dashboard/my-donation-requests")}
              disabled={submitting}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-medium text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-medium text-white shadow-md transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Z"
                    />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <span>
                    <GrUpdate />
                  </span>
                  <span>Update Donation Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
