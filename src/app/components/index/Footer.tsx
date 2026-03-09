"use client";

import Link from "next/link";
import Image from "next/image";
import { useContactInfo } from "@/hooks/useContactInfo";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Catálogo" },
  { href: "/categorias", label: "Categorías" },
  { href: "/contacto", label: "Contacto" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    hover: "hover:text-blue-500",
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    hover: "hover:text-pink-500",
  },
  {
    label: "WhatsApp",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
    hover: "hover:text-green-500",
  },
];

export default function Footer() {
  const { telefono, whatsapp, email } = useContactInfo();

  return (
    <footer className="relative bg-[#0B0F1A] text-white overflow-hidden">
      {/* Sutil gradiente de profundidad */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Columna 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <Image 
                  src="/logodistsin.png" 
                  alt="DISTRIESTHETIC" 
                  width={48} 
                  height={48} 
                  className="rounded-xl transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tighter text-white">
                  DISTRI<span className="text-blue-500">ESTHETIC</span>
                </h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                  Distribución certificada Colombia
                </p>
              </div>
            </Link>

            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Líderes en la distribución de insumos médicos de alta precisión. 
              Comprometidos con la seguridad clínica y la innovación en el sector salud colombiano.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.label === "WhatsApp" ? `https://wa.me/${whatsapp}` : s.href ?? "#"}
                  aria-label={s.label}
                  className={`p-2 text-slate-500 transition-all duration-300 transform hover:-translate-y-1 ${s.hover}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Links Rápidos */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-8 border-l-2 border-blue-600 pl-4">
              Explorar
            </h3>
            <ul className="grid grid-cols-1 gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-all duration-200 flex items-center gap-2 group text-sm"
                  >
                    <span className="h-[1px] w-0 bg-blue-500 group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Información Crítica */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-8 border-l-2 border-blue-600 pl-4">
                Soporte Directo
              </h3>
              <div className="space-y-6">
                <a 
                  href={`tel:+57${whatsapp.replace(/\D/g, "").replace(/^57/, "")}`}
                  className="flex flex-col group"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 group-hover:text-blue-500 transition-colors">Línea de atención</span>
                  <span className="text-lg font-medium text-slate-200">+57 {telefono}</span>
                </a>
                
                {email && (
                  <a 
                    href={`mailto:${email}`}
                    className="flex flex-col group"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase mb-1 group-hover:text-blue-500 transition-colors">Correo oficial</span>
                    <span className="text-lg font-medium text-slate-200">{email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                Sistema Operativo • Despachos 24h
              </span>
            </div>
          </div>
        </div>

        {/* Certificaciones y Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center gap-3">
              {["INVIMA VIGENTE", "SGC ISO 9001", "GAMP 5 COMPLIANT"].map((cert) => (
                <span key={cert} className="px-3 py-1 text-[9px] font-black tracking-widest text-slate-500 border border-slate-800 rounded-md bg-slate-900/50">
                  {cert}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-[11px] text-slate-500 font-medium">
                © {new Date().getFullYear()} <span className="text-slate-300">DISTRIESTHETIC S.A.S.</span>
              </p>
              <p className="text-[10px] text-slate-600">
                Hecho con{" "}
                <svg className="inline w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>{" "}
                para Distriesthetic
              </p>
              <div className="flex gap-6 text-[10px] font-bold uppercase tracking-tighter text-slate-600">
                <Link href="/terminos" className="hover:text-blue-500 transition-colors">Términos</Link>
                <Link href="/privacidad" className="hover:text-blue-500 transition-colors">Privacidad</Link>
                <Link href="/cookies" className="hover:text-blue-500 transition-colors">Políticas</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}