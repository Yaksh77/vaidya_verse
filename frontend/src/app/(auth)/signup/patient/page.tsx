import AuthForm from "@/components/auth/AuthForm";
import React from "react";

export const metadata = {
  title: "Create Patient Account - Vaidya Verse+",
  description:
    "Join Vaidya Verse+ to access quality healthcare consultations from certified doctors.",
};
function PatientSignUpPage() {
  return <AuthForm type="signup" userRole="patient" />;
}

export default PatientSignUpPage;
