"use client";

import React, { useState, useEffect } from "react";
import { Loader2, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Button,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Input,
} from "@heroui/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function FundingPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [fundings, setFundings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    if (!sessionLoading && !session) window.location.href = "/login";
  }, [session, sessionLoading]);

  const fetchFundingHistory = () => {
    fetch("http://localhost:5000/api/fundings")
      .then((res) => res.json())
      .then((data) => {
        setFundings(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    if (session) fetchFundingHistory();
  }, [session]);

  if (sessionLoading || isLoading) {
    return (
      <div className="flex justify-center pt-12">
        <Loader2 className="animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-zinc-800 tracking-tight">
            Funding History
          </h1>
          <p className="text-xs text-zinc-400">
            Manage and track your contributions to the community
          </p>
        </div>
        <Button
          color="danger"
          className="bg-red-500 text-white font-bold rounded-xl shadow-md px-6"
          onClick={() => setIsModalOpen(true)}
          startContent={<DollarSign className="w-4 h-4" />}
        >
          Give Fund
        </Button>
      </div>

      <div className="bg-white border border-zinc-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm font-medium text-zinc-700">
              {fundings.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-zinc-400 italic"
                  >
                    No funding contributions recorded yet.
                  </td>
                </tr>
              ) : (
                fundings.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-800">
                        {item.userName}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-normal">
                        {item.userEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 uppercase tracking-wider">
                      {item.transactionId}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-normal">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      ${parseFloat(item.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[420px]">
              <Modal.CloseTrigger onClick={() => setIsModalOpen(false)} />
              <Modal.Header>
                <Modal.Heading className="font-black text-zinc-800 text-lg">
                  Support Our Mission
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                    Amount (USD)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-zinc-400 font-bold text-sm pointer-events-none"></span>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="1"
                      step="any"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 text-sm bg-zinc-100 focus:bg-zinc-200/60 border-none rounded-xl text-zinc-800 outline-none font-bold transition-colors"
                      required
                    />
                  </div>
                </div>

                {parseFloat(donationAmount) > 0 ? (
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm
                      amount={donationAmount}
                      user={session?.user}
                      onSuccess={() => {
                        setIsModalOpen(false);
                        setDonationAmount("");
                        fetchFundingHistory();
                      }}
                    />
                  </Elements>
                ) : (
                  <p className="text-center text-xs text-zinc-400 py-3 italic">
                    Enter an amount above to reveal card fields.
                  </p>
                )}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

function StripeCheckoutForm({ amount, user, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const intentRes = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await intentRes.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: user?.name, email: user?.email },
          },
        },
      );

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        await fetch("http://localhost:5000/api/fundings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: user?.name,
            userEmail: user?.email,
            amount: amount,
            date: new Date().toISOString(),
            transactionId: paymentIntent.id,
          }),
        });

        toast.success("Funding payment processed successfully! Thank you.");
        onSuccess();
      }
    } catch (err) {
      toast.error(
        err.message || "An operational error occurred during processing.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmitPayment} className="space-y-4 pt-2">
      <div className="p-4 border rounded-xl bg-zinc-50/50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                color: "#27272a",
                "::placeholder": { color: "#a1a1aa" },
              },
            },
          }}
        />
      </div>
      <Button
        type="submit"
        color="danger"
        className="w-full font-bold bg-red-500 text-white"
        isLoading={isProcessing}
        disabled={!stripe || isProcessing}
      >
        Confirm & Pay ${parseFloat(amount).toFixed(2)}
      </Button>
    </form>
  );
}
