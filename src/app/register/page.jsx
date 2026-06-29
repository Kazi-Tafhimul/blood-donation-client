"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Upload, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


import {
  Form,
  Fieldset,
  TextField,
  Label,
  Input,
  Select,
  ListBox,
  Button,
  RadioGroup,
  Radio,
  Description,
} from "@heroui/react";

import districtsList from "../../data/districts.json";
import upazilasList from "../../data/upazilas.json";

export default function Register() {
  const router = useRouter();
  

  const [selectedDistrict, setSelectedDistrict] = useState("Dhaka");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

 
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };



const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataInstance = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formDataInstance.entries());

    if (rawData.password !== rawData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    console.log(" Form submission started...");

    try {
      let avatarUrl = "";

      if (avatarFile) {
        console.log(" Image file detected, starting ImgBB upload...");
        
        const imgBbFormData = new FormData();
        imgBbFormData.append("image", avatarFile);

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!apiKey) {
          throw new Error("API Key is missing! Check your .env.local file.");
        }

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: imgBbFormData,
        });

        const imgData = await response.json();
        console.log("ImgBB Response:", imgData);

        if (imgData.success) {
          avatarUrl = imgData.data.url;
          console.log(" Image URL received:", avatarUrl);
        } else {
          throw new Error("Image upload failed: " + (imgData.error?.message || "Unknown error"));
        }
      } else {
        console.log(" No image uploaded, proceeding with empty string.");
      }

      console.log(" Sending data to authClient...", { ...rawData, image: avatarUrl });

      const { data, error } = await authClient.signUp.email({
        email: rawData.email,
        password: rawData.password,
        name: rawData.fullName,
        image: avatarUrl,
        role: rawData.role || "donor",
        bloodGroup: rawData.bloodGroup,
        district: rawData.district,
        upazila: rawData.upazila,
      });

      if (error) throw new Error(error.message);

      console.log(" Registration successful!");
      alert("Registration Successful!");
      router.push("/login");
      
    } catch (err) {
      console.error(" Error during registration:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-12 md:py-20 font-[family-name:var(--font-inter)]">
      <div className="mx-auto max-w-2xl px-6">
        
       
        <Form onSubmit={handleSubmit} className="space-y-6">
          <Fieldset className="w-full space-y-6">
            
            <div className="text-center mb-4 flex flex-col items-center w-full">
              <Fieldset.Legend className="text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-plus-jakarta-sans)] text-zinc-900 mb-2">
                Create Account
              </Fieldset.Legend>
              <Description className="text-sm md:text-base text-zinc-500 font-medium">
                Join the BloodLink donor community
              </Description>
            </div>

            <Fieldset.Group className="grid grid-cols-1 gap-5 w-full">
              
             
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <TextField isRequired name="fullName">
                  <Label className="text-[14px] font-bold text-zinc-800">Full Name</Label>
                  <Input placeholder="Your name" className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>

                <TextField isRequired name="email" type="email">
                  <Label className="text-[14px] font-bold text-zinc-800">Email Address</Label>
                  <Input placeholder="Your email" className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>
              </div>

            
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-[14px] font-bold text-zinc-800">Profile Photo</Label>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
                
             
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


<Select 
  isRequired 
  name="district" 
  placeholder="Select District"
  value={selectedDistrict}
  onChange={(key) => setSelectedDistrict(String(key))}
>
  <Label className="text-[14px] font-bold text-zinc-800">District</Label>
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
  name="upazila" 
  placeholder="Select Upazila"
  isDisabled={filteredUpazilas.length === 0}
>
  <Label className="text-[14px] font-bold text-zinc-800">Upazila</Label>
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
                <TextField isRequired name="password">
                  <Label className="text-[14px] font-bold text-zinc-800">Password</Label>
                  <div className="relative w-full">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full bg-zinc-50/50 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 z-20"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </TextField>

                <TextField isRequired name="confirmPassword">
                  <Label className="text-[14px] font-bold text-zinc-800">Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" className="w-full bg-zinc-50/50 rounded-xl" />
                </TextField>
              </div>

            
              <div className="flex flex-col gap-2 w-full">
                <Label className="text-[14px] font-bold text-zinc-800">Register As</Label>
                <RadioGroup name="role" defaultValue="donor" orientation="horizontal">
                  <Radio value="donor">
                    <Radio.Content>
                      <Radio.Control><Radio.Indicator /></Radio.Control>
                      <span className="text-sm font-medium text-zinc-700 ml-1">Donor</span>
                    </Radio.Content>
                  </Radio>
                  <Radio value="volunteer">
                    <Radio.Content>
                      <Radio.Control><Radio.Indicator /></Radio.Control>
                      <span className="text-sm font-medium text-zinc-700 ml-1">Volunteer</span>
                    </Radio.Content>
                  </Radio>
                </RadioGroup>
              </div>

            </Fieldset.Group>

           
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D62828] hover:bg-[#b21e1e] disabled:bg-zinc-400 text-white text-[15px] font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-center text-sm text-zinc-500 font-medium pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#14B8A6] hover:underline font-bold">
                Sign In
              </Link>
            </p>

          </Fieldset>
        </Form>
      </div>
    </div>
  );
}