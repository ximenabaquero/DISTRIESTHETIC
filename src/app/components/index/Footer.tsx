"use client";

import Link from "next/link";
import Image from "next/image";
import { useContactInfo } from "@/hooks/useContactInfo";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Catálogo" },
  { href: "/categorias", label: "Categorías" },
  { href: "/contacto", label: "Contacto" },
];

const phoneIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
  </svg>
);

const emailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const locationIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    hover: "hover:bg-blue-600",
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    hover: "hover:bg-pink-600",
  },
  {
    label: "WhatsApp",
    href: null as string | null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
    hover: "hover:bg-green-600",
  },
];

export default function Footer() {
  const { telefono, whatsapp } = useContactInfo();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-12">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/logodistsin.png" alt="DISTRIESTHETIC" width={40} height={40} className="rounded-lg" />
              <div>
                <p className="font-bold text-white tracking-tight">DISTRIESTHETIC</p>
                <p className="text-xs text-gray-500">Distribución Especializada</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Proveedor autorizado de insumos médicos con certificación INVIMA. Calidad garantizada en cada entrega.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.label === "WhatsApp" ? `https://wa.me/${whatsapp}` : s.href ?? "#"}
                  aria-label={s.label}
                  className={`w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-150 ${s.hover}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Navegación</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Contacto</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:+57${whatsapp.replace(/\D/g, "").replace(/^57/, "")}`}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-150 group"
                >
                  <span className="text-gray-600 group-hover:text-cyan-400 transition-colors">{phoneIcon}</span>
                  +57 {telefono}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@distriesthetic.com"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors duration-150 group"
                >
                  <span className="text-gray-600 group-hover:text-cyan-400 transition-colors">{emailIcon}</span>
                  info@distriesthetic.com
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="text-gray-600">{locationIcon}</span>
                  Bogotá, Colombia
                </div>
              </li>
            </ul>

            {/* Certs */}
            <div className="flex gap-2 mt-5">
              {["INVIMA", "ISO 9001", "GMP"].map((cert) => (
                <span key={cert} className="px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-xs font-semibold text-gray-400">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} DISTRIESTHETIC · Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/terminos" className="hover:text-gray-300 transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-gray-300 transition-colors">Privacidad</Link>
            <Link href="/cookies" className="hover:text-gray-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}