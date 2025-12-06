import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { AI } from "./actions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SII-ERP-AI",
  description: "Sistema ERP contable chileno con IA integrada",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AI>{children}</AI>
        </Providers>
      </body>
    </html>
  );
}
