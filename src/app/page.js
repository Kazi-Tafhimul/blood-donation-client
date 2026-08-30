"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const features = [
  {
    number: "01",
    title: "Find Blood Easily",
    description:
      "Search for available donors and blood donation requests based on your needs.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Become a Donor",
    description:
      "Register as a donor and be ready to help someone when they need blood the most.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s8-4.35 8-10.5A4.5 4.5 0 0 0 15.5 6c-1.5 0-2.8.75-3.5 1.9A4.02 4.02 0 0 0 8.5 6 4.5 4.5 0 0 0 4 10.5C4 16.65 12 21 12 21Z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Help Save Lives",
    description:
      "One donation can make a meaningful difference for patients, families, and communities.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s8-4.35 8-10.5A4.5 4.5 0 0 0 15.5 6c-1.5 0-2.8.75-3.5 1.9A4.02 4.02 0 0 0 8.5 6 4.5 4.5 0 0 0 4 10.5C4 16.65 12 21 12 21Z"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [sending, setSending] = useState(false);
  useEffect(() => {
    const checkProfile = async () => {
      try {
        
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          console.log("No JWT found");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          },
        );

        if (!response.ok) {
          console.log("Profile fetch failed");
          return;
        }

        const user = await response.json();

        console.log("CURRENT USER PROFILE:", user);
      } catch (error) {
        console.error("Profile check failed:", error);
      }
    };

    checkProfile();
  }, []);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalFunding: 0,
    totalBloodRequests: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public-stats`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();

        setStats({
          activeUsers: data.activeUsers || 0,
          totalFunding: data.totalFunding || 0,
          totalBloodRequests: data.totalBloodRequests || 0,
        });
      } catch (error) {
        console.error("Fetch homepage stats failed:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    setSending(true);

    
    await new Promise((resolve) => setTimeout(resolve, 700));

    toast.success("Thanks! Your message has been received.");

    event.target.reset();
    setSending(false);
  };

  return (
    <main className="bg-white text-gray-900">
      
      <section className="relative overflow-hidden bg-gray-950">
       
        <Image
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1800&q=85"
          alt="Blood donation"
          fill
          priority
          className="object-cover opacity-40"
        />

      
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-red-950/50" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-32 lg:px-10">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Every drop can make a difference
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Give Blood.
              <br />
              <span className="text-red-400">Save a Life.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
              BloodLink connects blood donors with people who need blood. Join
              our community and help make blood available when it matters most.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
              >
                Join as a Donor
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/find-donors"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Search Donors
              </Link>
            </div>
          </div>
        </div>
      </section>

     
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-100 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
          <Stat
            value={statsLoading ? "..." : stats.activeUsers.toLocaleString()}
            label="Active Donors"
          />

          <Stat
            value={
              statsLoading ? "..." : `৳${stats.totalFunding.toLocaleString()}`
            }
            label="Total Funding"
          />

          <Stat
            value={
              statsLoading ? "..." : stats.totalBloodRequests.toLocaleString()
            }
            label="Blood Requests"
          />
        </div>
      </section>

    
      <section className="bg-gray-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              Why BloodLink
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Making blood donation simpler
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-500">
              A simple platform designed to bring donors and recipients together
              quickly and responsibly.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition group-hover:bg-red-500 group-hover:text-white">
                    {feature.icon}
                  </div>

                  <span className="text-sm font-bold text-gray-300">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] bg-red-600 px-6 py-12 sm:px-10 md:px-14 md:py-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-red-800/20" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-widest text-red-100">
                  Be someone&apos;s reason to hope
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Your blood could be the connection someone needs.
                </h2>

                <p className="mt-4 leading-7 text-red-100">
                  Become a donor and make yourself available to people looking
                  for blood in their time of need.
                </p>
              </div>

              <Link
                href="/register"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                Become a Donor
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

     
      <section
        id="contact"
        className="border-t border-gray-100 bg-gray-50 py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                Contact Us
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Need help?
                <br />
                We are here for you.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-gray-500">
                Have a question about BloodLink, blood requests, or donor
                registration? Send us a message and our team will get back to
                you.
              </p>

              <div className="mt-8 space-y-5">
                <ContactInfo
                  icon="phone"
                  title="Call Us"
                  value="+880 1700-000000"
                />

                <ContactInfo
                  icon="email"
                  title="Email"
                  value="support@bloodlink.com"
                />

                <ContactInfo
                  icon="location"
                  title="Location"
                  value="Dhaka, Bangladesh"
                />
              </div>
            </div>

          
            <form
              onSubmit={handleContactSubmit}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h3 className="text-xl font-bold text-gray-900">
                Send us a message
              </h3>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    placeholder="How can we help you?"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl bg-red-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      
      <footer className="bg-gray-950 text-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
           
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-2xl font-extrabold text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white">
                  +
                </span>
                Blood<span className="text-red-400">Link</span>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
                Connecting blood donors with people in need and building a
                stronger, more caring community.
              </p>
            </div>

            
            <div>
              <h3 className="font-bold text-white">Quick Links</h3>

              <div className="mt-5 flex flex-col gap-3 text-sm">
                <FooterLink href="/" label="Home" />
                <FooterLink
                  href="/donation-requests"
                  label="Donation Requests"
                />
                <FooterLink href="/search" label="Search Donors" />
                <FooterLink href="/register" label="Become a Donor" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white">Support</h3>

              <div className="mt-5 flex flex-col gap-3 text-sm">
                <FooterLink href="#contact" label="Contact Us" />
                <FooterLink href="/funding" label="Funding" />
                <FooterLink href="/login" label="Login" />
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-7 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} BloodLink. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}



function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ContactInfo({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
        {icon === "phone" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293c-.112.15-.29.24-.478.24a11.25 11.25 0 0 1-8.717-8.717c0-.188.09-.366.24-.478l1.293-.97c.407-.305.58-.837.417-1.173L6.025 2.352A1.125 1.125 0 0 0 4.934 1.5H3.562A2.25 2.25 0 0 0 1.312 3.75v3Z"
            />
          </svg>
        )}

        {icon === "email" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.69 5.793a2.25 2.25 0 0 1-2.12 0L2.25 6.75"
            />
          </svg>
        )}

        {icon === "location" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {title}
        </p>

        <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link href={href} className="text-gray-400 transition hover:text-white">
      {label}
    </Link>
  );
}
