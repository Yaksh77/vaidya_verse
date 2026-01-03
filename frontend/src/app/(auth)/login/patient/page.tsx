import AuthForm from "@/components/auth/AuthForm";
import React from "react";

export const metadata = {
  title: "Patient Login - Vaidya Verse+",
  description:
    "Healthcare provider sign in to Vaidya Verse+ platform. Manage your practice and consultations.",
};

function PatientLoginPage() {
  return <AuthForm type="login" userRole="patient" />;
}

export default PatientLoginPage;
