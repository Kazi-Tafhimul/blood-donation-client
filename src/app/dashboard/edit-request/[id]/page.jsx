"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button, Card, Input } from "@heroui/react";

export default function EditRequestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    upazila: "",
    hospitalName: "",
    fullAddress: "",
  });
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (!sessionLoading && !session) {
      toast.error("Unauthorized access.");
      router.push("/login");
    }
  }, [session, sessionLoading, router]);

  
  useEffect(() => {
    if (session && id) {
      fetch(`http://localhost:5000/api/requests/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        })
        .then((data) => {
          if (data) {
            setFormData({
              recipientName: data.recipientName || "",
              recipientDistrict: data.recipientDistrict || data.location || "",
              upazila: data.upazila || "",
              hospitalName: data.hospitalName || "",
              fullAddress: data.fullAddress || "",
            });
            setCurrentStatus(data.status || "pending");
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch request information.");
          setIsLoading(false);
        });
    }
  }, [id, session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Blood request updated successfully!");
      
     
      if (session?.user?.role === "admin") {
        router.push("/dashboard/all-blood-donation-request");
      } else {
        router.push("/dashboard/my-donation-requests"); 
      }
    } else {
      toast.error("Failed to update data.");
    }
  } catch (error) {
    toast.error("An error occurred during submission.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (sessionLoading || isLoading) {
    return (
      <div className="flex justify-center pt-12">
        <Loader2 className="animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
     
      <div className="flex items-center justify-between">
        <Button
          variant="light"
          size="sm"
          startContent={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.back()}
          className="font-medium text-zinc-500"
        >
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Current Status:</span>
          <span className="text-xs bg-amber-50 border border-amber-200 text-amber-600 px-2.5 py-1 rounded-full font-black uppercase">
            {currentStatus}
          </span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-zinc-800 tracking-tight">Edit Request</h1>
        <p className="text-sm text-zinc-400">Update the details for this blood requirement</p>
      </div>

      <Card className="p-8 border border-zinc-100 shadow-xl rounded-3xl bg-white">
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-black text-zinc-500 uppercase tracking-wider block mb-2">Recipient Name</label>
              <Input
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Patient Name"
                variant="flat"
                className="font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-zinc-500 uppercase tracking-wider block mb-2">District</label>
              <Input
                name="recipientDistrict"
                value={formData.recipientDistrict}
                onChange={handleChange}
                placeholder="e.g. Noakhali"
                variant="flat"
                className="font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-zinc-500 uppercase tracking-wider block mb-2">Upazila</label>
              <Input
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                placeholder="e.g. Companiganj"
                variant="flat"
                className="font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-black text-zinc-500 uppercase tracking-wider block mb-2">Hospital Name</label>
              <Input
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="e.g. Hospital 1"
                variant="flat"
                className="font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider block mb-2">Full Detailed Address</label>
            
            <textarea
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleChange}
              placeholder="Provide clear local signs or block directions..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-zinc-100 focus:bg-zinc-200/70 border-none rounded-xl text-zinc-800 outline-none font-medium transition-colors resize-none"
              required
            />
          </div>

          
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-50">
            <Button 
              variant="flat" 
              type="button"
              onClick={() => router.back()}
              className="font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="danger"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Save className="w-4 h-4" />}
              className="bg-red-500 font-bold text-white shadow-md shadow-red-100 px-6"
            >
              Update Request
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}