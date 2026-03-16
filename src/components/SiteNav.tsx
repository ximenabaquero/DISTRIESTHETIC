"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
  { href: "/admin", label: "Panel" },
];

interface CartIconProps {
  count: number;
  isActive: boolean;
  inverted?: boolean;
  onClick?: () => void;
}

const CartIcon = ({ count, isActive, inverted, onClick }: CartIconProps) => (
  <Link
    href="/carrito"
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 active:scale-90 ${
      inverted
        ? "text-white hover:bg-white/15"
        : isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-500 hover:bg-slate-100"
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
    {count > 0 && (
      <span className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 animate-in zoom-in duration-300 ${
        inverted || isActive ? "bg-white text-blue-600 border-blue-600" : "bg-red-500 text-white border-white"
      }`}>
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll del body cuando el overlay está abierto
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  // Cerrar al cambiar de ruta
  useEffect(() => { setOpen(false); }, [pathname]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          height: 64,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: isScrolled ? "rgba(255,255,255,0.95)" : "#07091C",
          borderBottom: isScrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(240,244,255,0.06)",
          boxShadow: isScrolled ? "0 1px 12px rgba(0,0,0,0.07)" : "none",
        }}
      >
        <nav className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">

{/* Logo */}
<Link href="/" className="flex items-center gap-2 shrink-0 transition-transform active:scale-95" onClick={close}>
  <Image 
    src="/logodistsin.png" 
    alt="Logo" 
    width={160} 
    height={58} 
    className={`h-8 w-auto sm:h-11 object-contain transition-all duration-300 ${
      isScrolled ? "brightness-100" : "brightness-0 invert"
    }`} 
    priority 
  />
  
  <span className="text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.12em] sm:tracking-[0.28em] uppercase leading-none whitespace-nowrap">
    <span className={isScrolled ? "text-slate-800" : "text-white"}>DISTRI</span>
    <span className={isScrolled ? "text-blue-600" : "text-sky-400"}>ESTHETIC</span>
  </span>
</Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                    isScrolled
                      ? isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                      : isActive ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
            <div className={`ml-2 pl-3 border-l ${isScrolled ? "border-slate-200" : "border-white/15"}`}>
              <CartIcon count={itemCount} isActive={pathname === "/carrito"} inverted={!isScrolled} />
            </div>
          </div>

          {/* Botón hamburguesa — solo móvil */}
          <button
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className={`md:hidden p-2 rounded-xl active:scale-90 transition-transform ${
              isScrolled ? "bg-slate-50 text-slate-600" : "bg-white/10 text-white"
            }`}
            onClick={() => setOpen(!open)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </nav>
      </header>

      {/* ── Overlay full-screen móvil ── */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(7,9,28,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Fila superior: logo + botón X */}
        <div
          className="flex items-center justify-between px-4 flex-shrink-0"
          style={{ height: 64, borderBottom: "1px solid rgba(240,244,255,0.07)" }}
        >
          <Link href="/" onClick={close} className="flex items-center gap-3">
            <Image src="/logodistsin.png" alt="Logo" width={120} height={44} className="h-10 w-auto object-contain" />
          </Link>
          <button
            aria-label="Cerrar menú"
            onClick={close}
            className="p-2 rounded-xl bg-white/10 text-white active:scale-90 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links de navegación centrados */}
        <div className="flex-1 flex flex-col justify-center px-6 gap-2">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-xl font-bold transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-200 hover:bg-white/[0.07] hover:text-white"
                }`}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Footer overlay: acceso al carrito */}
        <div
          className="px-6 pb-10 pt-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(240,244,255,0.07)" }}
        >
          <Link
            href="/carrito"
            onClick={close}
            className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-white/[0.06] text-slate-300 hover:bg-white/[0.10] transition-colors active:scale-[0.98]"
          >
            <span className="font-semibold">Ver carrito</span>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center px-1 bg-red-500 text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
