import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "flatJSON — JSON & YAML Parser",
  description: "Fast, client-side JSON & YAML parser with Vim keybindings, tree view, and format conversion. No signup, no tracking.",
  metadataBase: new URL("https://flatjson.dev"),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "flatJSON — JSON & YAML Parser",
    description: "Fast, client-side JSON & YAML parser with Vim keybindings, tree view, and format conversion.",
    url: "https://flatjson.dev",
    siteName: "flatJSON",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "flatJSON — JSON & YAML Parser",
    description: "Fast, client-side JSON & YAML parser with Vim keybindings. No signup, no tracking.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans font-light">{children}</body>
    </html>
  );
}
