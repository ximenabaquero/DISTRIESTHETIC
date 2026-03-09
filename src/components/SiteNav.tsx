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

  const close = () => setOpen(false);

  return (
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
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo — más grande, letra-spacing, acento de color */}
          <Link href="/" className="flex items-center gap-3 shrink-0 transition-transform active:scale-95" onClick={close}>
            <Image src="/logodistsin.png" alt="Logo" width={160} height={58} className="h-11 w-auto object-contain" priority />
            <span className="hidden lg:block text-sm font-black tracking-[0.28em] uppercase leading-none">
              <span className={isScrolled ? "text-slate-800" : "text-white"}>DISTRI</span>
              <span className={isScrolled ? "text-blue-600" : "text-sky-400"}>ESTHETIC</span>
            </span>
          </Link>

          {/* Desktop Nav — subrayado activo + carrito dentro del grupo */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                    isScrolled
                      ? isActive
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-900"
                      : isActive
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Carrito dentro del navbar con separador */}
            <div className={`ml-2 pl-3 border-l ${isScrolled ? "border-slate-200" : "border-white/15"}`}>
              <CartIcon count={itemCount} isActive={pathname === "/carrito"} inverted={!isScrolled} />
            </div>
          </div>

          {/* Hamburger móvil */}
          <button
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
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="flex flex-col gap-2 pb-4">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.href}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={`flex items-center justify-between px-5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg translate-x-1"
                      : isScrolled
                        ? "bg-slate-50 text-slate-600"
                        : "bg-white/[0.08] text-slate-200 border border-white/10"
                  }`}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex-grow py-4 text-base font-bold active:scale-[0.98] transition-transform"
                  >
                    {link.label}
                  </Link>
                  <div className="py-2">
                    <CartIcon
                      count={itemCount}
                      isActive={pathname === "/carrito"}
                      inverted={isActive || !isScrolled}
                      onClick={close}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}