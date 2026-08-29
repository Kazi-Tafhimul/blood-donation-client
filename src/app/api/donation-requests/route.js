import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          message: "Unauthorized. Please login first.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const {
      recipientName,
      bloodGroup,
      district,
      upazila,
      hospitalName,
      fullAddress,
      donationDate,
      donationTime,
      requestMessage,
    } = body;

    if (
      !recipientName?.trim() ||
      !bloodGroup ||
      !district ||
      !upazila ||
      !hospitalName?.trim() ||
      !fullAddress?.trim() ||
      !donationDate ||
      !donationTime ||
      !requestMessage?.trim()
    ) {
      return NextResponse.json(
        {
          message: "All fields are required.",
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("blood-donation-db");

    const donationRequests = db.collection("donationRequests");

    const newRequest = {
      requesterId: session.user.id,
      requesterName: session.user.name,
      requesterEmail: session.user.email,

      recipientName: recipientName.trim(),
      bloodGroup,
      district,
      upazila,
      hospitalName: hospitalName.trim(),
      fullAddress: fullAddress.trim(),
      donationDate,
      donationTime,
      requestMessage: requestMessage.trim(),

      status: "pending",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await donationRequests.insertOne(newRequest);

    return NextResponse.json(
      {
        message: "Donation request created successfully.",
        donationRequest: {
          ...newRequest,
          _id: result.insertedId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create donation request error:", error);

    return NextResponse.json(
      {
        message: "Internal server error.",
      },
      { status: 500 },
    );
  }
}