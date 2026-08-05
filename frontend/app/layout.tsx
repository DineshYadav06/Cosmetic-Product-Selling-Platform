import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/context/StoreContext";
import Chatbot from "@/components/Chatbot";
import CustomCursor from "@/components/CustomCursor";

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
    default: "GLOWMART INDIA - Premium Beauty & Cosmetics",
    template: "%s | GLOWMART"
  },
  description: "Experience the ultimate destination for luxury skincare, premium makeup, and artisan fragrances in India. AI-powered regimens tailored for you.",
  keywords: ["cosmetics", "skincare", "luxury beauty", "india cosmetics", "glowmart", "ai beauty consultant"],
  authors: [{ name: "Dinesh Yadav" }],
  creator: "Dinesh Yadav",
  publisher: "GlowMart India",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://glowmart-india.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GLOWMART INDIA - Premium Beauty & Cosmetics",
    description: "Your ultimate destination for premium beauty brands and AI-powered skincare in India.",
    url: "https://glowmart-india.vercel.app",
    siteName: "GlowMart",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GlowMart Luxury Beauty",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLOWMART INDIA",
    description: "Premium Beauty & Cosmetics Destination",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <CustomCursor />
          {children}
          <Chatbot />
        </StoreProvider>
      </body>
    </html>
  );
}
