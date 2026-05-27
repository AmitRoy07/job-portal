import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Job Portal",
  description: "Sign in to your Job Portal account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
