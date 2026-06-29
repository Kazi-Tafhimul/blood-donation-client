"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Calendar, MapPin, Clock } from "lucide-react";
import { Card, Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function PublicBloodRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const limit = 6;

 const fetchRequests = (pageNumber, append = false) => {
  if (pageNumber === 1) setIsLoading(true);
  else setIsLoadMoreLoading(true);

  
  fetch(`http://localhost:5000/api/requests?status=pending&page=${pageNumber}&limit=${limit}`)
    .then((res) => res.json())
    .then((data) => {
      const newRequests = Array.isArray(data) ? data : [];
      
      if (append) {
        setRequests((prev) => [...prev, ...newRequests]);
      } else {
        setRequests(newRequests);
      }

     
      if (newRequests.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    })
    .catch((err) => {
      console.error("Error loading public requests:", err);
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    });
};

useEffect(() => {
  fetchRequests(1, false);
}, []);

const handleLoadMore = () => {
  const nextPage = page + 1;
  setPage(nextPage);
  fetchRequests(nextPage, true); 
};

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-800 tracking-tight">Active Blood Requests</h1>
        <p className="text-sm text-zinc-400">Immediate, pending donation opportunities near you</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 font-medium bg-zinc-50 border rounded-xl">
          No pending blood requests at this moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {requests.map((item) => (
            <Card key={item._id} className="p-5 border border-zinc-100 shadow-sm rounded-2xl flex flex-col justify-between">
              <div>
               
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-black text-lg tracking-tight border border-red-100">
                    {item.bloodGroup}
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    Pending
                  </span>
                </div>

             
                <div className="mb-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Recipient</span>
                  <h3 className="text-lg font-black text-zinc-800 leading-snug">{item.recipientName}</h3>
                </div>

                
                <div className="space-y-2.5 text-sm text-zinc-500 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="truncate">{item.recipientDistrict || item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{item.donationDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{item.donationTime || "N/A"}</span>
                  </div>
                </div>
              </div>

              
              <Button
                color="danger"
                className="w-full font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
                onClick={() => router.push(`/donation-requests/${item._id}`)}
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
      {hasMore && requests.length > 0 && (
        <div className="flex justify-center pt-8">
          <Button
            variant="flat"
            color="default"
            className="font-bold border border-zinc-200 text-zinc-600 bg-zinc-50 px-6"
            isLoading={isLoadMoreLoading}
            onClick={handleLoadMore}
          >
            Load More Requests
          </Button>
        </div>
      )}
    
  

    </div>
  );
}