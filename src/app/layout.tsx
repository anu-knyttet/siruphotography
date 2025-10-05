import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Socials from "../components/Socials";
import NavbarMobile from "../components/NavbarMobile";
import Footer from "../components/Footer";
import PageTransitions from "@/components/PageTransitions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Siru Photography",
  description: "This website depicts the photography portfolio of Siru Bhurtel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
