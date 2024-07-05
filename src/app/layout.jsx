import { Inter } from "next/font/google";
import "./globals.css";
import { Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "CryptoDash",
  description: "CryptoCurrency Tracker",
};

export default function RootLayout({children}) {
  return (
    <>
      <html
        lang="en">
        <body className={roboto.className} suppressHydrationWarning={true}>
          <div className="p-0 m-0  min-h-screen">
          <Navbar />
          {children}
          </div>
        </body>
      </html>

    </>
  );
}