import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Playfair_Display } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "Hemanshu Boppana - Academic Tutor",
  description: "Personal academic tutoring services by Hemanshu Boppana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} font-poppins antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
