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
      // Evitamos que el click afecte a elementos padre si los hubiera
      e.stopPropagation();
      onClick?.();
    }}
    className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 active:scale-90 ${
      inverted 
        ? "text-white hover:bg-white/20" 
        : isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100"
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      isScrolled ? "bg-white/90 backdrop-blur-lg shadow-sm py-3" : "bg-white py-5"
    }`}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 shrink-0 transition-transform active:scale-95" onClick={close}>
            <Image src="/logodistsin.png" alt="Logo" width={140} height={50} className="h-9 w-auto object-contain" priority />
            <span className="hidden lg:block text-xs font-black text-slate-800 tracking-widest uppercase">Distriesthetic</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 ${
                    isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex">
              <CartIcon count={itemCount} isActive={pathname === "/carrito"} />
            </div>

            <button className="md:hidden p-2 rounded-xl bg-slate-50 text-slate-600 active:scale-90 transition-transform" onClick={() => setOpen(!open)}>
              <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${open ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - CORREGIDO */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="flex flex-col gap-2 pb-4">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.href}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={`flex items-center justify-between px-5 rounded-2xl transition-all duration-300 ${
                    isActive ? "bg-blue-600 text-white shadow-lg translate-x-1" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {/* Link del texto ocupa el espacio restante */}
                  <Link 
                    href={link.href} 
                    onClick={close}
                    className="flex-grow py-4 text-base font-bold active:scale-[0.98] transition-transform"
                  >
                    {link.label}
                  </Link>
                  
                  {/* CartIcon ahora es un hermano, no un hijo del Link anterior */}
                  <div className="py-2">
                    <CartIcon 
                      count={itemCount} 
                      isActive={pathname === "/carrito"} 
                      inverted={isActive} 
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