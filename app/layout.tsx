import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Marcellus, DM_Sans } from "next/font/google";
import { Della_Respira, Julius_Sans_One } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dellaRespira = Della_Respira({
  variable: "--font-della-respira",
  subsets: ["latin"],
  weight: "400",
});

const juliusSansOne = Julius_Sans_One({
  variable: "--font-julius-sans-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ojasen Healing Arts",
  description: "Wellness and healing services",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <Analytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${marcellus.variable} ${dmSans.variable} ${dellaRespira.variable} ${juliusSansOne.variable} antialiased bg-[#f7faf6]`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
