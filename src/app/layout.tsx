import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Socials from "../components/Socials";
import NavbarMobile from "../components/NavbarMobile";
import Footer from "../components/Footer";
import PageTransitions from "@/components/PageTransitions";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home - Siru Photography",
  description: "This website depicts the photography portfolio of Siru Bhurtel.",
  openGraph: {
    title: "Siru Photography",
    description: "This website depicts the photography portfolio of Siru Bhurtel.",
    url: "https://sirubhurtel.com",
    siteName: "Siru Photography",
    images: [
      {
        url: "https://sirubhurtel.com/embedlogo.png", // <-- put your nice 1200x630 image here
        width: 1200,
        height: 630,
        alt: "Siru Photography Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siru Photography",
    description: "This website depicts the photography portfolio of Siru Bhurtel.",
    images: ["https://sirubhurtel.com/embedlogo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="KY6hdo-osuhZqgMOiPwDpSu_DyAmoLmn8A9uJ7gdl5E" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DY0VDFQGXL" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DY0VDFQGXL');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}  antialiased`}>
        <div className="relative bg-background w-full min-h-[100svh]">
          <PageTransitions>{children}</PageTransitions>

          <div className="hidden md:block">
            {/* Desktop navbar: hidden on small, block on md+ */}
            <Navbar />
          </div>
          <div className="md:hidden block">
            {/* Mobile navbar: block on small, hidden on md+ */}
            <NavbarMobile />
          </div>
          <Socials />
          <Footer />
        </div>
      </body>
    </html>
  );
}
