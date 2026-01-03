import AuthForm from "@/components/auth/AuthForm";
import React from "react";

export const metadata = {
  title: "Doctor Login - Vaidya Verse+",
  description:
    "Healthcare provider sign in to Vaidya Verse+ platform. Manage your practice and consultations.",
};

function DoctorLoginPage() {
  return <AuthForm type="login" userRole="doctor" />;
}

export default DoctorLoginPage;
