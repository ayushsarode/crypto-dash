import { Inter } from "next/font/google";
import "./globals.css";
import { Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "CryptoDash",
  description: "CryptoCurrency Tracker",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" className="bg-black">
        <body className={roboto.className} suppressHydrationWarning={true}>
          <div className="p-0 m-0 min-h-screen">
            <Navbar />
            {children}
          </div>
        </body>
      </html>
    </>
  );
}
