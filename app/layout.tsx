import type { Metadata, Viewport } from "next";
import { Oswald, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./subpage.css";

const oswald = Oswald({
  variable: "--font-oswald",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonny Hayes — APXGP Racing Team",
  description: "Sonny Hayes, car 7 for APXGP, on his Formula 1 comeback — from the film F1.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7fafb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${oswald.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
