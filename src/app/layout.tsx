import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Kidus Amanuel | Full-Stack AI Engineer",
  description: "Full-stack engineer who ships SaaS products fast, now building AI-powered systems.",
  keywords: ["Next.js", "AI Engineer", "Software Engineer", "React", "TypeScript", "Ethiopia"],
  openGraph: {
    title: "Kidus Amanuel | Full-Stack AI Engineer",
    description: "Full-stack engineer who ships SaaS products fast, now building AI-powered systems.",
    url: 'https://kidus-portfolio-gray.vercel.app/',
    siteName: 'Kidus Amanuel',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kidus Amanuel | Full-Stack AI Engineer',
    description: 'Full-stack engineer who ships SaaS products fast, now building AI-powered systems.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.variable, playfair.variable, "font-sans antialiased bg-black text-white selection:bg-white selection:text-black")}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
