"use client";

import "./globals.css";
import Navbar from "@/app/components/organisms/Navbar/Navbar";
import { Providers } from "./providers";
import ComingSoon from "./components/ComingSoon/ComingSoon";
export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <ComingSoon />
        </Providers>
      </body>
    </html>
  );
}
