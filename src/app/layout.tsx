import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subscription Tracker",
  description: "Manage recurring subscriptions and understand your spending.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
