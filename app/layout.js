"use client";

import "./globals.css";
import Navbar from "@/app/components/Navbar/Navbar";
import { Providers } from "./providers";
export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
