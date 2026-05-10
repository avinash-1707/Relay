import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your secure Relay messaging workspace.",
  openGraph: {
    title: "Messages | Relay",
    description: "Your secure Relay messaging workspace.",
  },
  robots: { index: false, follow: false },
};

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
