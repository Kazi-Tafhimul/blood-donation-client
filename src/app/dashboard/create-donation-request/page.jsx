"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client"; 

import {
  Form,
  Fieldset,
  TextField,
  Label,
  Input,
  Select,
  ListBox,
  Button,
  Description,
} from "@heroui/react";

import districtsList from "@/data/districts.json";
import upazilasList from "@/data/upazilas.json";

export default function CreateDonationRequestPage() {
  const session = authClient.useSession ? authClient.useSession() : { data: null };
  
  const [activeUser, setActiveUser] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("Dhaka");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  useEffect(() => {
   
    if (session?.data?.user) {
      setActiveUser(session.data.user);
    } else {
      
      const fetchUserSession = async () => {
        const res = await authClient.getSession();
        if (res?.data?.user) {
          setActiveUser(res.data.user);
        }
      };
      fetchUserSession();
    }
  }, [session]);

 
  useEffect(() => {
    const selectedDistrictObj = districtsList.find(
      (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
    );

    if (selectedDistrictObj) {
      const matches = upazilasList.filter(
        (u) => String(u.district_id) === String(selectedDistrictObj.id)
      );
      setFilteredUpazilas(matches);
    }
  }, [selectedDistrict]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const targetForm = e.currentTarget;

    const formDataInstance = new FormData(targetForm);
    const rawData = Object.fromEntries(formDataInstance.entries());

    const fullPayload = {
      requesterName: activeUser?.name || "",
      requesterEmail: activeUser?.email || "",
      recipientName: rawData.recipientName,
      recipientDistrict: rawData.recipientDistrict,
      recipientUpazila: rawData.recipientUpazila,
      hospitalName: rawData.hospitalName,
      fullAddressLine: rawData.fullAddressLine,
      bloodGroup: rawData.bloodGroup,
      donationDate: rawData.donationDate,
      donationTime: rawData.donationTime,
      requestMessage: rawData.requestMessage,
    };

    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullPayload),
      });

      if (response.ok) {
        toast.success("Donation request created successfully!");
        targetForm.reset();
      } else {
        toast.error("Failed to submit donation request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network interface error. Ensure port 5000 server is active.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 py-6 font-[family-name:var(--font-inter)]">
      <div className="mx-auto max-w-4xl px-4">
        
        <Form onSubmit={handleSubmit} className="space-y-8">
          <Fieldset className="w-full space-y-8">
            
           
            <div>
              <Fieldset.Legend className="text-2xl font-bold text-slate-800 tracking-tight font-[family-name:var(--font-plus-jakarta-sans)] mb-1">
                Create Donation Request
              </Fieldset.Legend>
              <Description className="text-sm text-slate-500 font-medium">
                Submit a blood donation request and connect with available donors
              </Description>
            </div>

         
            <div className="space-y-4">
              <h3 className="text-[14px] uppercase tracking-wider font-extrabold text-zinc-400 border-b pb-2">
                 Requester Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
               
                <TextField isReadOnly name="requesterName" value={activeUser?.name || ""}>
                  <Label className="text-[14px] font-bold text-zinc-800">Requester Name</Label>
                  <Input className="w-full bg-zinc-100/70 rounded-xl cursor-not-allowed" />
                </TextField>

                <TextField isReadOnly name="requesterEmail" value={activeUser?.email || ""}>
                  <Label className="text-[14px] font-bold text-zinc-800">Requester Email</Label>
                  <Input className="w-full bg-zinc-100/70 rounded-xl cursor-not-allowed" />
                </TextField>
              </div>
            </div>

          
            <div className="space-y-4">
              <h3 className="text-[14px] uppercase tracking-wider font-extrabold text-zinc-400 border-b pb-2">
                 Recipient & Location Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <TextField isRequired name="recipientName">
                  <Label className="text-[14px] font-bold text-zinc-800">Recipient Name</Label>
                  <Input placeholder="Patient full name" className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>

                <Select isRequired name="bloodGroup" placeholder="Select Group">
                  <Label className="text-[14px] font-bold text-zinc-800">Blood Group</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <ListBox.Item id={bg} key={bg} textValue={bg}>
                          {bg}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <Select 
                  isRequired 
                  name="recipientDistrict" 
                  placeholder="Select District"
                  value={selectedDistrict}
                  onChange={(key) => setSelectedDistrict(String(key))}
                >
                  <Label className="text-[14px] font-bold text-zinc-800">Recipient District</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {districtsList.map((dist) => (
                        <ListBox.Item id={dist.name} key={dist.id} textValue={dist.name}>
                          {dist.name}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select 
                  isRequired 
                  name="recipientUpazila" 
                  placeholder="Select Upazila"
                  isDisabled={filteredUpazilas.length === 0}
                >
                  <Label className="text-[14px] font-bold text-zinc-800">Recipient Upazila</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {filteredUpazilas.map((upz) => (
                        <ListBox.Item id={upz.name} key={upz.id} textValue={upz.name}>
                          {upz.name}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <TextField isRequired name="hospitalName">
                  <Label className="text-[14px] font-bold text-zinc-800">Hospital Name</Label>
                  <Input placeholder="e.g. Dhaka Medical College Hospital" className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>

                <TextField isRequired name="fullAddressLine">
                  <Label className="text-[14px] font-bold text-zinc-800">Full Address Line</Label>
                  <Input placeholder="e.g. Zahir Raihan Rd, Dhaka" className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <TextField isRequired name="donationDate" type="date">
                  <Label className="text-[14px] font-bold text-zinc-800">Donation Date</Label>
                  <Input className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>

                <TextField isRequired name="donationTime" type="time">
                  <Label className="text-[14px] font-bold text-zinc-800">Donation Time</Label>
                  <Input className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>
              </div>
            </div>

            
            <div className="space-y-4">
              <h3 className="text-[14px] uppercase tracking-wider font-extrabold text-zinc-400 border-b pb-2">
                 Additional Overview
              </h3>
              <TextField isRequired name="requestMessage">
                <Label className="text-[14px] font-bold text-zinc-800">Request Message</Label>
                <textarea 
                  name="requestMessage"
                  rows={4}
                  placeholder="Write in detail why you need blood..." 
                  className="w-full bg-zinc-50/50 rounded-xl border border-zinc-200/80 p-3 text-sm text-zinc-800 outline-none focus:border-zinc-400 transition-colors"
                  required
                />
              </TextField>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-auto bg-[#E11D48] hover:bg-[#BE123C] disabled:bg-zinc-400 text-white text-[15px] font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                " Create Donation Request"
              )}
            </Button>

          </Fieldset>
        </Form>
      </div>
    </div>
  );
}