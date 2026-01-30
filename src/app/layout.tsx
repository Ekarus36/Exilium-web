import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/auth-context";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=IM+Fell+English:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased vignette">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
