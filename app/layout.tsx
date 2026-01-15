import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

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
                <footer>@2026 All rights Reserved</footer>
            </body>
        </html>
    );
}
