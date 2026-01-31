import type { Metadata } from "next";
import { Great_Vibes, Montserrat } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const greatVibes = Great_Vibes({ weight: '400', subsets: ["latin"], variable: "--font-great-vibes" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: { template: '%s | EventEssentials', default: 'EventEssentials' },
  description: 'Your Partner in Every Celebration',
  icons: { icon: '/logo.png' }, // Replaces Vercel arrow with your logo
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} ${montserrat.variable} antialiased font-[family-name:var(--font-montserrat)]`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}