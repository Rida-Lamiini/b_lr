import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0ea5e9",
};

export const metadata: Metadata = {
  title: {
    default: "Brain / Locus | Personal Operating System",
    template: "%s | Brain / Locus",
  },
  description: "Your personal operating system for cognitive productivity. Manage projects, tasks, knowledge, and deep work in one unified system.",
  keywords: ["productivity", "cognitive", "task management", "knowledge management", "focus", "organization"],
  authors: [{ name: "Brain / Locus" }],
  creator: "Brain / Locus",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brain-locus.vercel.app",
    title: "Brain / Locus | Personal Operating System",
    description: "Your personal operating system for cognitive productivity.",
    siteName: "Brain / Locus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain / Locus",
    description: "Your personal operating system for cognitive productivity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", geistSans.variable, geistMono.variable, jetbrainsMono.variable)}>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
