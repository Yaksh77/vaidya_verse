import AuthForm from "@/components/auth/AuthForm";
import DoctorOnboardingForm from "@/components/dcotor/DoctorOnboardingForm";
import React from "react";

export const metadata = {
  title: "Complete Your Doctor Profile - HealthTap",
  description: "Set up your doctor profile to start offering consultations.",
};

function DoctorOnboardingPage() {
  return <DoctorOnboardingForm />;
}

export default DoctorOnboardingPage;
