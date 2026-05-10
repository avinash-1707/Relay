import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Relay account or create a new one to get started.",
  openGraph: {
    title: "Sign In | Relay",
    description: "Sign in to your Relay account or create a new one.",
  },
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
