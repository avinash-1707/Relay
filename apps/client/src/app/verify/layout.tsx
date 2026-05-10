import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Enter your 6-digit verification code to complete your Relay account setup.",
  openGraph: {
    title: "Verify Email | Relay",
    description: "Complete your Relay account setup.",
  },
  robots: { index: false, follow: false },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
