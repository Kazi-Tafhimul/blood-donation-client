"use client";

import React, { useState } from "react";
import { Search, MapPin, Droplet, Phone, User, Loader2 } from "lucide-react";


import districtsData from "@/data/districts.json";
import upazilasData from "@/data/upazilas.json";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function FindDonorsPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedUpazilaName, setSelectedUpazilaName] = useState("");
  
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const filteredUpazilas = upazilasData.filter(
    (upz) => String(upz.district_id).trim() === String(selectedDistrictId).trim()
  );

  const handleDistrictChange = (e) => {
    setSelectedDistrictId(e.target.value);
    setSelectedUpazilaName("");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    
    const districtObj = districtsData.find((d) => String(d.id) === String(selectedDistrictId));
    const districtName = districtObj ? districtObj.name : "";

    try {
      const queryParams = new URLSearchParams({
        bloodGroup: bloodGroup.trim(),
        district: districtName.trim(),
        upazila: selectedUpazilaName.trim(),
      }).toString();

      const res = await fetch(`http://localhost:5000/api/donors/search?${queryParams}`);
      if (!res.ok) throw new Error("Server responded with an error status");
      
      const data = await res.json();
      setDonors(data);
    } catch (err) {
      console.error("Error executing donor fetch lookup:", err);
      setDonors([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-zinc-800 tracking-tight sm:text-5xl">
            Find a <span className="text-red-500">Blood Donor</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto font-medium">
            Connecting heroes with those in need. Search by group and location.
          </p>
        </div>

        <form 
          onSubmit={handleSearchSubmit} 
          className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-100 shadow-xl shadow-zinc-200/50"
        >
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            
           
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl outline-none font-bold text-sm focus:border-red-400 focus:bg-white transition-all appearance-none"
                required
              >
                <option value="">Select Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

         
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">District</label>
              <select
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                className="w-full px-3 py-2.5 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl outline-none font-bold text-sm focus:border-red-400 focus:bg-white transition-all"
                required
              >
                <option value="">Select District</option>
                {districtsData.map((dist) => (
                  <option key={dist.id} value={dist.id}>{dist.name}</option>
                ))}
              </select>
            </div>

           
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Upazila</label>
              <select
                value={selectedUpazilaName}
                onChange={(e) => setSelectedUpazilaName(e.target.value)}
                disabled={!selectedDistrictId}
                className="w-full px-3 py-2.5 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl outline-none font-bold text-sm focus:border-red-400 focus:bg-white transition-all disabled:opacity-50"
                required
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((upz) => (
                  <option key={upz.id} value={upz.name}>{upz.name}</option>
                ))}
              </select>
            </div>

           
            <div className="w-full lg:w-auto pt-2 lg:pt-0">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full lg:px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-[0.98] text-blue-500 font-black py-3 rounded-xl shadow-md shadow-red-500/10 flex items-center justify-center gap-2 transition-all disabled:bg-zinc-300"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Donors</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

  
        <div className="space-y-4">
          {!hasSearched ? (
            <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <Droplet className="w-10 h-10 text-zinc-300 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-medium text-zinc-400 italic">
                Fill out the form above to search for active blood donors.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <p className="text-sm font-bold text-zinc-500">No matching donors found.</p>
              <p className="text-xs text-zinc-400 mt-1">Try a different location or blood type combination.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
                Matching Active Donors ({donors.length})
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <div 
                    key={donor._id} 
                    className="bg-white border border-zinc-100 p-5 rounded-2xl shadow-md hover:shadow-xl hover:border-zinc-200/60 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                   
                    <div className="absolute top-0 right-0 bg-red-50 text-red-600 px-4 py-2 font-black text-sm rounded-bl-2xl border-l border-b border-red-100/40">
                      {donor.bloodGroup}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200/60 flex items-center justify-center text-zinc-600 font-bold uppercase tracking-wider text-sm shrink-0 border border-white shadow-sm">
                          {donor.name ? donor.name.substring(0, 2) : "UN"}
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-extrabold text-zinc-800 text-base leading-tight capitalize truncate">{donor.name}</h3>
                          <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">{donor.email}</p>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-zinc-100">
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-xl w-fit">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="truncate">{donor.upazila}, {donor.district}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={``}
                      className="mt-5 w-full bg-zinc-50 hover:bg-red-50 hover:text-red-600 border border-zinc-200/50 text-zinc-700 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>Call Donor</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}