import RegistrationForm from "@/components/auth/register-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Job Portal",
  description: "Create your Job Portal account and get started.",
};

export default function RegisterRoute() {
  return <RegistrationForm />;
}
