import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fira_Code, Inter, Sora } from "next/font/google";
import "./globals.css";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "BondhOn",
  description: "BondhOn — Civic Action & Emergency Coordination Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        inter.variable,
        sora.variable,
        fira.variable,
        "h-full",
        "antialiased",
      )}
    >
      <body className="min-h-screen flex flex-col ">{children}</body>
    </html>
  );
}
