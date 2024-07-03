import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoDash",
  description: "CryptoCurrency Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="en">
        <body className={roboto.className}>
          <div className="p-0 m-0 bg-gradient-to-b from-custom1 via-custom2 to-custom3 min-h-screen">
            
          <Navbar />



          {children}
          </div>
        </body>
      </html>
    </>
  );
}
