import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/auth-context";

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
    default: "Exilium",
    template: "%s | Exilium",
  },
  description: "A D&D 5e campaign setting and DM toolkit",
  keywords: ["D&D", "5e", "campaign setting", "DM tools", "initiative tracker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-stone-100`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
