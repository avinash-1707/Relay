import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Relay — Encrypted Messaging for Tech Teams",
    template: "%s | Relay",
  },
  description:
    "Sub-200ms global delivery, end-to-end encryption, 99.99% uptime. Secure real-time messaging built for distributed engineering teams.",
  keywords: [
    "encrypted messaging",
    "real-time chat",
    "secure communication",
    "team messaging",
    "end-to-end encryption",
  ],
  openGraph: {
    type: "website",
    siteName: "Relay",
    title: "Relay — Encrypted Messaging for Tech Teams",
    description:
      "Sub-200ms global delivery, end-to-end encryption, 99.99% uptime. Built for distributed tech teams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relay — Encrypted Messaging for Tech Teams",
    description:
      "Sub-200ms global delivery, end-to-end encryption, 99.99% uptime.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
