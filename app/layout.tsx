import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaperPlane from "@/components/PaperPlane";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaime Rabazo — Computer Science × Business",
  description:
    "Portfolio of Jaime Rabazo Fernández — dual-degree candidate in Computer Science and Business Administration, working at the intersection of data engineering and business strategy.",
  metadataBase: new URL("https://jaime-rabazo.github.io"),
  openGraph: {
    title: "Jaime Rabazo — Computer Science × Business",
    description:
      "Dual-degree candidate building at the intersection of data engineering and business strategy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="bg-bone-100 text-ink-900 font-sans antialiased grain">
        <SmoothScroll />
        <Navbar />
        <PaperPlane />
        <main className="relative z-[2]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
