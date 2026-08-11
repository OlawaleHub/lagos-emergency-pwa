// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "HelpmeNG — One-Tap Police, Fire & Medical Emergency Reporting",
  description:
    "One-tap emergency reporting for Lagos. Connect to the nearest police, fire, and medical services. Works offline with auto-sync.",
  manifest: "/manifest.json",
  applicationName: "HelpmeNG",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HelpmeNG",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.svg" }],
  },
  openGraph: {
    title: "HelpmeNG",
    description: "One-tap emergency reporting for Lagos. Works offline.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#dc2626",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 pb-24 pt-20">
          {children}
        </main>
        <Footer />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
