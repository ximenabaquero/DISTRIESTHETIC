import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartToastNotification } from "@/components/CartToastNotification";
import { SiteNav } from "@/components/SiteNav";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne-var",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DISTRIESTHETIC - Distribución de Productos Estéticos",
  description: "Distribución de medicamentos, soluciones, insumos, químicos, ropa y protección para centros estéticos",
  icons: {
    icon: "/logodistsin.ico",
    shortcut: "/logodistsin.ico",
    apple: "/logodistsin.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} antialiased font-sans bg-[#07091C] min-h-screen`}>
        <CartProvider>
          <SiteNav />
          <main>{children}</main>
          <CartToastNotification />
        </CartProvider>
      </body>
    </html>
  );
}