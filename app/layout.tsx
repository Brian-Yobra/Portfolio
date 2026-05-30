import type { Metadata } from "next";
import "./globals.scss";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Brian Kihara | Portfolio",
  description: "A fullstack developer specializing in modern web technologies",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
