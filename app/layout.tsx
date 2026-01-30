import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import your WhatsApp component
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Updated Metadata with Title Template for dynamic tab names
export const metadata: Metadata = {
  title: {
    template: '%s | EventEssentials',
    default: 'EventEssentials - Your Partner in Every Celebration',
  },
  description: 'Professional decor designing, event shopping, catering, and ritual planning services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* 3. The WhatsApp button is placed here so it appears on every page */}
        <WhatsAppButton onUpload={undefined} />
      </body>
    </html>
  );
}