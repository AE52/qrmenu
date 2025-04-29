import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./components/ThemeRegistry";
import NavbarLayout from "./components/NavbarLayout";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Menü Uygulaması",
  description: "Restoranlar için dijital QR menü platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          <NavbarLayout hideNavbarOnPath="/menu">
            {children}
            <Footer />
          </NavbarLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
