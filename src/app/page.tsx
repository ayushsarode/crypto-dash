import Image from "next/image";
import Navbar from "@/components/Navbar";
import RootLayout from "./layout";
import Home from "./home/page";
import CryptoTracker from "@/components/CryptoList"
import './globals.css'

export default function Page() {
  return (
    <main className=" min-h-screen">
      <Home />
    </main>
  );
}
