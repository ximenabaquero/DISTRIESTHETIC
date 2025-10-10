"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
  { href: "/admin", label: "Panel" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(prev => !prev);
  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={close}>
            <Image
              src="/logodistsin.png"
              alt="DISTRIESTHETIC Logo"
              width={160}
              height={60}
              className="h-14 w-auto"
              priority
            />
            <span className="text-xl md:text-2xl font-bold text-blue-600 tracking-wide">
              DISTRIESTHETIC
            </span>
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md border border-blue-200 px-3 py-2 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={toggle}
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

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {open && (
          <div className="mt-4 space-y-2 rounded-2xl border border-blue-50 bg-white p-4 shadow-lg md:hidden">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={`block rounded-lg px-4 py-2 text-base font-semibold transition-colors ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
