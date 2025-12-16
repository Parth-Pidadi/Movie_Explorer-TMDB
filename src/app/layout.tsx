import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Explorer - Search & Save Your Favorite Movies",
  description: "Search movies, view details, and save your favorites with personal ratings and notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.node;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
