"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
  { href: "/admin", label: "Panel" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo — siempre con pill blanco para legibilidad sobre cualquier fondo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={close}>
            <div className="flex items-center gap-3 transition-all duration-300 rounded-2xl">
              <Image
                src="/logodistsin.png"
                alt="DISTRIESTHETIC Logo"
                width={160}
                height={60}
                className="h-8 w-auto object-contain"
                priority
              />
              <div className="hidden sm:block w-px h-5 bg-gray-200" />
              <span className="hidden sm:block text-sm font-bold text-slate-700 tracking-tight">
                DISTRIESTHETIC
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              const isAdmin = link.href === "/admin";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-200"
                      : isAdmin
                      ? "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500 mr-1.5 mb-0.5" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
            onClick={() => setOpen(prev => !prev)}
            aria-expanded={open}
            aria-label="Abrir menú de navegación"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white py-3 pb-4">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}