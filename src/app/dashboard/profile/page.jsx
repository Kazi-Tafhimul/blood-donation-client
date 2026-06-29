"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Save } from "lucide-react";

export default function ProfilePage() {
  const [isEditable, setIsEditable] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "nabila",
    email: "nabila@gmail.com",
    district: "Dhaka",
    upazila: "Keraniganj",
    bloodGroup: "O+"
  });

  
  useEffect(() => {
    const savedName = localStorage.getItem("updated_user_name");
    const savedDistrict = localStorage.getItem("updated_user_district");
    const savedUpazila = localStorage.getItem("updated_user_upazila");
    const savedBloodGroup = localStorage.getItem("updated_user_blood");

    setFormData((prev) => ({
      ...prev,
      name: savedName || prev.name,
      district: savedDistrict || prev.district,
      upazila: savedUpazila || prev.upazila,
      bloodGroup: savedBloodGroup || prev.bloodGroup,
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setIsEditable(false); 
        
       
        localStorage.setItem("updated_user_name", formData.name);
        localStorage.setItem("updated_user_district", formData.district);
        localStorage.setItem("updated_user_upazila", formData.upazila);
        localStorage.setItem("updated_user_blood", formData.bloodGroup);
        
        alert("Saved successfully!");
        window.location.reload(); 
      } else {
        alert(result.message || "Failed to save.");
      }
    } catch (error) {
      alert("Network error connecting to backend.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-100 mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-800">{formData.name}</h1>
          <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Member</p>
        </div>
        <div>
          {!isEditable ? (
            <button type="button" onClick={() => setIsEditable(true)} className="flex items-center gap-1 bg-red-50 text-[#D62828] text-xs font-bold px-4 py-2 rounded-lg">
              <Edit2 className="h-3.5 w-3.5" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsEditable(false)} className="text-zinc-500 text-xs font-bold px-3 py-2">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex items-center gap-1 bg-[#D62828] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-zinc-600 block mb-1">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditable} className="w-full text-sm p-2.5 border rounded-lg disabled:bg-zinc-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-600 block mb-1">Email (Locked)</label>
          <input type="email" name="email" value={formData.email} disabled className="w-full text-sm p-2.5 border rounded-lg bg-zinc-50 text-zinc-400 cursor-not-allowed" />
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-600 block mb-1">District</label>
          <input type="text" name="district" value={formData.district} onChange={handleChange} disabled={!isEditable} className="w-full text-sm p-2.5 border rounded-lg disabled:bg-zinc-50" />
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-600 block mb-1">Upazila</label>
          <input type="text" name="upazila" value={formData.upazila} onChange={handleChange} disabled={!isEditable} className="w-full text-sm p-2.5 border rounded-lg disabled:bg-zinc-50" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-zinc-600 block mb-1">Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditable} className="w-full text-sm p-2.5 border rounded-lg bg-white disabled:bg-zinc-50">
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </form>
    </div>
  );
}