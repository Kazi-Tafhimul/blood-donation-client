"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import districts from "@/data/districts.json";
import upazilas from "@/data/upazilas.json";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function FindDonorsPage() {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [donors, setDonors] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // =========================
  // SELECTED DISTRICT
  // =========================

  const selectedDistrict = useMemo(() => {
    return districts.find((district) => district.name === formData.district);
  }, [formData.district]);

  // =========================
  // FILTER UPAZILAS
  // =========================

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];

    return upazilas.filter(
      (upazila) => String(upazila.district_id) === String(selectedDistrict.id),
    );
  }, [selectedDistrict]);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));
  };

  // =========================
  // SEARCH DONORS
  // =========================

  const handleSearch = async (event) => {
    event.preventDefault();

    // -------------------------
    // Validation
    // -------------------------

    if (!formData.bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }

    if (!formData.district) {
      toast.error("Please select a district");
      return;
    }

    if (!formData.upazila) {
      toast.error("Please select an upazila");
      return;
    }

    try {
      setSearching(true);
      setHasSearched(false);
      setDonors([]);

      // -------------------------
      // Build API URL
      // -------------------------

      const params = new URLSearchParams({
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      });

      const response = await fetch(`${API_URL}/donors?${params.toString()}`, {
        method: "GET",
      });

      const data = await response.json();

      // -------------------------
      // API Error
      // -------------------------

      if (!response.ok) {
        throw new Error(data.message || "Failed to find donors");
      }

      // -------------------------
      // Store Results
      // -------------------------

      setDonors(Array.isArray(data.donors) ? data.donors : []);
      setHasSearched(true);
    } catch (error) {
      console.error("Find donors error:", error);

      toast.error(error.message || "Failed to find donors");

      setDonors([]);
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        {/* =========================
            HEADER
        ========================= */}

        <section className="text-center">
          <p className="text-sm font-semibold text-red-500">BloodLink</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Blood Donors
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Search for active blood donors by blood group and location.
          </p>
        </section>

        {/* =========================
            SEARCH FORM
        ========================= */}

        <section className="mx-auto mt-10 max-w-5xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSearch}>
            <div className="grid gap-5 md:grid-cols-3">
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
                  disabled={searching}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50"
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
                  onChange={handleChange}
                  disabled={searching}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  <option value="">Select district</option>

                  {districts.map((district) => (
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
                  disabled={!formData.district || searching}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {formData.district
                      ? "Select upazila"
                      : "Select district first"}
                  </option>

                  {filteredUpazilas.map((upazila) => (
                    <option key={upazila.id} value={upazila.name}>
                      {upazila.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={searching}
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {searching ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Searching...
                  </>
                ) : (
                  <>
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
                        d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                    Search Donors
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* =========================
            SEARCH RESULTS
        ========================= */}

        {hasSearched && (
          <section className="mx-auto mt-10 max-w-5xl">
            {/* Result Header */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Search Results
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {donors.length} {donors.length === 1 ? "donor" : "donors"}{" "}
                  found
                </p>
              </div>
            </div>

            {/* No Results */}

            {donors.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="h-8 w-8 text-red-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  No donors found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  We couldn&apos;t find any active donor matching your selected blood
                  group and location.
                </p>
              </div>
            ) : (
              /* Donor Results */

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {donors.map((donor) => (
                  <div
                    key={donor._id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-100">
                        {donor.image ? (
                          <img
                            src={donor.image}
                            alt={donor.name || "Donor"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-red-500">
                            {donor.name
                              ? donor.name.charAt(0).toUpperCase()
                              : "U"}
                          </span>
                        )}
                      </div>

                      {/* Name */}

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-gray-900">
                          {donor.name || "Unknown Donor"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Active Donor
                        </p>
                      </div>
                    </div>

                    {/* Blood Group */}

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
                      <span className="text-sm font-medium text-gray-600">
                        Blood Group
                      </span>

                      <span className="text-lg font-bold text-red-500">
                        {donor.bloodGroup}
                      </span>
                    </div>

                    {/* Location */}

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">District:</span>
                        <span>{donor.district}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Upazila:</span>
                        <span>{donor.upazila}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================
            INITIAL EMPTY STATE
        ========================= */}

        {!hasSearched && (
          <section className="mx-auto mt-8 max-w-5xl rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.7"
                stroke="currentColor"
                className="h-8 w-8 text-red-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-bold text-gray-900">
              Search for a donor
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Select a blood group, district, and upazila, then click Search
              Donors to find matching donors.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
