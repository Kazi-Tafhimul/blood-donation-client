"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Upload, Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react";


import districtsList from "../../data/districts.json";
import upazilasList from "../../data/upazilas.json";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bloodGroup: "A+",
    district: "Dhaka", 
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  
  useEffect(() => {
   
    const selectedDistrictObj = districtsList.find(
      (d) => d.name.toLowerCase() === formData.district.toLowerCase()
    );

    if (selectedDistrictObj) {
      
      const matches = upazilasList.filter(
        (u) => String(u.district_id) === String(selectedDistrictObj.id)
      );
      
      setFilteredUpazilas(matches);
      
     
      setFormData((prev) => ({ ...prev, upazila: matches[0] ? matches[0].name : "" }));
    }
  }, [formData.district]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    try {
      let avatarUrl = "";

      // Upload image to ImgBB
      if (avatarFile) {
        const imgBbFormData = new FormData();
        imgBbFormData.append("image", avatarFile);

        const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY_HERE"; // Replace with your free key
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: imgBbFormData,
        });

        const imgData = await response.json();
        if (imgData.success) {
          avatarUrl = imgData.data.url;
        }
      }

      
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        image: "", 
      });
      if (error) {
        alert(error.message || "Registration failed.");
        return;
      }

      console.log("Submitting to your backend:", finalUserData);
      alert("Registration Successful!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 py-12 md:py-20 font-[family-name:var(--font-inter)]">
      <div className="mx-auto max-w-2xl px-6">
        
        <div className="text-center mb-10 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-plus-jakarta-sans)] text-zinc-900 mb-2">
            Create Account
          </h1>
          <p className="text-sm md:text-base text-zinc-500 font-medium">
            Join the BloodLink donor community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-zinc-800">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Your name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-medium placeholder-zinc-400 focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-zinc-800">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-medium placeholder-zinc-400 focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-all"
                required
              />
            </div>
          </div>

          
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-zinc-800">Profile Photo</label>
            <div className="relative border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl bg-zinc-50/30 p-8 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                
              />
              
              {imagePreview ? (
                <div className="relative h-20 w-20 rounded-full overflow-hidden border border-zinc-200">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 group-hover:bg-zinc-200/70 text-zinc-500 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <p className="text-[14px] font-bold text-zinc-700">Click to upload or drag & drop</p>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Selectors Form Row (Blood, District, Upazila) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Blood Group Option Selector */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[14px] font-bold text-zinc-800">Blood Group</label>
              <div className="relative">
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full appearance-none px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-bold text-zinc-700 focus:outline-none focus:border-[#14B8A6] transition-all cursor-pointer"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none stroke-[2.5]" />
              </div>
            </div>

            {/* Dynamic District Option Selector */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[14px] font-bold text-zinc-800">District</label>
              <div className="relative">
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full appearance-none px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-bold text-zinc-700 focus:outline-none focus:border-[#14B8A6] transition-all cursor-pointer"
                >
                  {districtsList.map((dist) => (
                    <option key={dist.id} value={dist.name}>
                      {dist.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none stroke-[2.5]" />
              </div>
            </div>

            {/* Filtered Upazila Option Selector */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[14px] font-bold text-zinc-800">Upazila</label>
              <div className="relative">
                <select
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleInputChange}
                  disabled={filteredUpazilas.length === 0}
                  className="w-full appearance-none px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-bold text-zinc-700 focus:outline-none focus:border-[#14B8A6] transition-all cursor-pointer disabled:opacity-60"
                >
                  {filteredUpazilas.map((upz) => (
                    <option key={upz.id} value={upz.name}>
                      {upz.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Secure Password Setup Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[14px] font-bold text-zinc-800">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-medium placeholder-zinc-300 focus:outline-none focus:border-[#14B8A6] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-zinc-800">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder=""
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-medium placeholder-zinc-300 focus:outline-none focus:border-[#14B8A6] transition-all"
                required
              />
            </div>
          </div>

          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-[#D62828] hover:bg-[#b21e1e] disabled:bg-zinc-400 text-white text-[15px] font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/15 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-zinc-500 font-medium pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-[#14B8A6] hover:underline font-bold">
              Sign In
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}