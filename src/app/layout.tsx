import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DISTRIESTHETIC - Distribución de Productos Estéticos",
  description: "Distribución de medicamentos, soluciones, insumos, químicos, ropa y protección para centros estéticos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
