"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
     
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/", 
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
        return;
      }
      

      alert("Login Successful!");
      
      
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 py-12 md:py-24 font-[family-name:var(--font-inter)] flex items-center justify-center">
      <div className="w-full max-w-md px-6 mx-auto">
        
       
        <div className="text-center mb-10 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-plus-jakarta-sans)] text-zinc-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-zinc-500 font-medium">
            Sign in to manage your BloodLink profile
          </p>
        </div>

        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
         
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-zinc-800">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-medium placeholder-zinc-400 focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-all"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 stroke-[2.2]" />
            </div>
          </div>

          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[14px] font-bold text-zinc-800">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#14B8A6] hover:underline font-bold">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
               
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-11 pr-12 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-[15px] font-medium placeholder-zinc-300 focus:outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-all"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 stroke-[2.2]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

         
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#D62828] hover:bg-[#b21e1e] disabled:bg-zinc-400 text-white text-[15px] font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/15 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

         
          <p className="text-center text-sm text-zinc-500 font-medium pt-2">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-[#14B8A6] hover:underline font-bold">
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}