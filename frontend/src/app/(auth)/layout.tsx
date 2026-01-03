"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function layout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = false;
  const router = useRouter();
  const user = {
    type: "doctor",
    name: "Yaksh",
    profileImage:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    email: "yaksh847@gmail.com",
  };

  useEffect(() => {
    if (isAuthenticated && user.type === "doctor") {
      router.push("/doctor/dashboard");
    } else if (isAuthenticated && user.type === "patient") {
      router.push("/patient/dashboard");
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        {children}
      </div>

      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/20 to-transparent z-10"></div>
        <div className="w-full h-full bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-md">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop:blur-sm">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Vaidya Verse+
            </h2>
            <p className="text-xl opacity-90 mb-4">Your health, our priority</p>
            <p className="text-lg opacity-70">
              Connecting patients with compassionate doctors and online
              consultations, anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
