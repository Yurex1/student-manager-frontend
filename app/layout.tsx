// app/layout.tsx

import type { Metadata } from "next"; // This is for server-side
import localFont from "next/font/local";
// import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "./components/NavBar";

// Fonts (can remain here as well)
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Server-side metadata export
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// RootLayout for wrapping the app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppNavbar />
        {children}
      </body>
    </html>
  );
}
