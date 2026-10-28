import { AuthForm } from "@/components/auth/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Subscription Tracker account.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
