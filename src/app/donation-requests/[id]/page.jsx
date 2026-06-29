"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Heart, Calendar, MapPin, Clock, User, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button, Modal, Chip, Card } from "@heroui/react";

export default function BloodRequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  useEffect(() => {
    if (!sessionLoading && !session) {
      toast.error("Please log in to view request details.");
      router.push("/login");
    }
  }, [session, sessionLoading, router]);

  
  useEffect(() => {
    if (session && id) {
      fetch(`http://localhost:5000/api/requests/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setRequest(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error retrieving request data.");
          setIsLoading(false);
        });
    }
  }, [id, session]);

  const handleConfirmDonation = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "inprogress",
          donorName: session?.user?.name,
          donorEmail: session?.user?.email 
        }),
      });

      if (res.ok) {
        toast.success("Thank you! Status updated to In Progress.");
        setIsModalOpen(false);
        router.push("/donation-requests"); 
      } else {
        toast.error("Could not complete the donation request action.");
      }
    } catch (error) {
      toast.error("Network error submitting donation choice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="flex justify-center pt-12">
        <Loader2 className="animate-spin text-rose-500" />
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      
      
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-black text-zinc-800 tracking-tight">Request Details</h1>
        <p className="text-sm text-zinc-400">View urgency, location, and requirements</p>
      </div>

      <Card className="p-8 border border-zinc-100 shadow-xl rounded-3xl space-y-8 bg-white">
        
        
        <div className="flex justify-between items-center border-b pb-6 border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-800">{request.recipientName}</h2>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Recipient • Patient</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Chip color="danger" variant="solid" className="font-black px-4 py-4 text-md bg-red-500">
              {request.bloodGroup} Required
            </Chip>
            <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-100">
              {request.status || "Pending"}
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
         
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Location Details</h3>
            
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-zinc-400 font-bold">Hospital/District</p>
                <p className="text-sm font-semibold text-zinc-700">{request.recipientDistrict || request.location}</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-zinc-400 font-bold">Full Address Details</p>
                <p className="text-sm text-zinc-600 font-medium">{request.fullAddress || "Hospital Premises Area Specified"}</p>
              </div>
            </div>
          </div>

         
          <div className="space-y-4">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Timing & Urgency</h3>
            
            <div className="flex gap-6">
              <div className="flex gap-2 items-center">
                <Calendar className="w-4 h-4 text-red-400" />
                <div className="text-sm">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Required Date</p>
                  <p className="font-bold text-zinc-700">{request.donationDate}</p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-zinc-400" />
                <div className="text-sm">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">Time</p>
                  <p className="font-bold text-zinc-700">{request.donationTime || "Immediate"}</p>
                </div>
              </div>
            </div>

            {request.message && (
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Message</span>
                </div>
                <p className="text-xs text-zinc-600 italic">"{request.message}"</p>
              </div>
            )}
          </div>
        </div>

       
        {request.status?.toLowerCase() === "pending" || !request.status ? (
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full font-black text-white bg-red-500 hover:bg-red-600 transition-colors rounded-xl shadow-lg shadow-red-100"
              startContent={<Heart className="fill-current w-5 h-5" />}
              onClick={() => setIsModalOpen(true)}
            >
              Donate Now
            </Button>
          </div>
        ) : (
          <div className="text-center p-3 bg-zinc-50 border text-zinc-500 font-semibold rounded-xl capitalize text-sm">
            This request is currently: <span className="font-bold text-zinc-700">{request.status}</span>
          </div>
        )}
      </Card>

     
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[400px]">
              <Modal.CloseTrigger onClick={() => setIsModalOpen(false)} />
              <Modal.Header>
                <Modal.Heading className="font-black text-zinc-800 text-lg">Confirm Your Donation</Modal.Heading>
              </Modal.Header>
              
              <Modal.Body className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Please review your details below. Confirming flags this active request as <strong>In Progress</strong> and assigns you as the scheduled donor.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Donor Name</label>
                    <input
                      type="text"
                      value={session?.user?.name || ""}
                      readOnly
                      className="w-full px-3 py-2 text-sm bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-500 outline-none cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Donor Email</label>
                    <input
                      type="text"
                      value={session?.user?.email || ""}
                      readOnly
                      className="w-full px-3 py-2 text-sm bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-500 outline-none cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <div className="flex w-full justify-end gap-2">
                  <Button variant="flat" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    color="danger" 
                    size="sm" 
                    className="font-bold bg-red-500 text-white" 
                    isLoading={isSubmitting} 
                    onClick={handleConfirmDonation}
                  >
                    Confirm Donation
                  </Button>
                </div>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}