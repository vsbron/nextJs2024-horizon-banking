import { ReactNode } from "react";
import type { Metadata } from "next";
// eslint-disable-next-line
import { Inter, IBM_Plex_Serif } from "next/font/google";

import "./globals.css";

// Importing fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

// Meta data
export const metadata: Metadata = {
  title: "Horizon — Banking system",
  description: "Horizon is a modern banking platform for everyone",
  icons: { icon: "/icons/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Returned JSX
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
