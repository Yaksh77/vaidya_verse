import AuthForm from "@/components/auth/AuthForm";
import React from "react";

export const metadata = {
  title: "Join Vaidy Verse+ as Healthcare Provider",
  description:
    "Register as a healthcare provider on Vaidya Verse+ to offer online consultations.",
};

function DoctorSignUpPage() {
  return <AuthForm type="signup" userRole="doctor" />;
}

export default DoctorSignUpPage;
