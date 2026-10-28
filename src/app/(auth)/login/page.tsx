import { AuthForm } from "@/components/auth/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Subscription Tracker account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
