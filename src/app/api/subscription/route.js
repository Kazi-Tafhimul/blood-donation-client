import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe'; 

export async function POST(request) {
  try {
   
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid dynamic funding amount" },
        { status: 400 }
      );
    }

   
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
    });

    
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    console.error("Stripe payment intent failure:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}