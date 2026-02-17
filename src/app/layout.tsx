import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlatJSON — JSON Parser & Formatter",
  description: "Fast client-side JSON parser, formatter, and tree viewer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
