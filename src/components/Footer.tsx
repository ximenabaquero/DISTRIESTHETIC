"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <h3 className="text-xl font-bold">DISTRIESTHETIC</h3>
          <p className="text-gray-400">Distribución de productos estéticos</p>
        </div>
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/" className="text-gray-400 hover:text-white">
            Inicio
          </Link>
          <Link href="/productos" className="text-gray-400 hover:text-white">
            Productos
          </Link>
          <Link href="/contacto" className="text-gray-400 hover:text-white">
            Contacto
          </Link>
        </div>
        <div className="flex justify-center space-x-6 mb-6 text-sm">
          <Link href="/legal/politica-privacidad" className="text-gray-400 hover:text-white">
            Política de Privacidad
          </Link>
          <Link href="/legal/terminos-condiciones" className="text-gray-400 hover:text-white">
            Términos y Condiciones
          </Link>
        </div>
        <p className="text-gray-400 text-sm">
          © 2024 DISTRIESTHETIC. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
