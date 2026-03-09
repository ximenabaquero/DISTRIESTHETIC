"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

// Paleta: azul #1a6cf6 | teal #00c8a0 Ú dos colores máximo
const BLUE  = "#1a6cf6";
const TEAL  = "#00c8a0";

interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  accent: string;   // BLUE o TEAL
  featured?: boolean;
}

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const CertificateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const UserMdIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const benefits: BenefitCard[] = [
  { icon: <ShieldCheckIcon />,    title: "Pago al recibir",           description: "Sin anticipos. Pagas cuando tienes el pedido en tus manos.",                         badge: "Sin Riesgo",         accent: TEAL,  featured: true  },
  { icon: <TruckIcon />,          title: "Entrega en menos de 24h",  description: "Envío gratuito en Bogotá con seguimiento en tiempo real.",                            badge: "Gratis en Bogotá",   accent: BLUE                    },
  { icon: <CertificateIcon />,    title: "Registro INVIMA vigente",  description: "Cada producto con registro sanitario activo y trazabilidad completa.",                badge: "Garantía Total",     accent: TEAL,  featured: true  },
  { icon: <ClipboardCheckIcon />, title: "Control de calidad ISO",   description: "Proveedores certificados con auditoría por lote de producción.",                      badge: "ISO 9001",            accent: BLUE                    },
  { icon: <ClockIcon />,          title: "Pedidos 24/7",             description: "Plataforma siempre disponible. Soporte prioritario para profesionales.",              badge: "Siempre Disponible", accent: TEAL                    },
  { icon: <UserMdIcon />,         title: "Asesoría especializada",   description: "Expertos en insumos médicos disponibles para orientarte sin costo.",                  badge: "Consultoría Gratuita",accent: BLUE                   },
];

const certifications = [
  { label: 'INVIMA', sublabel: 'Reg. Sanitario' },
  { label: 'ISO',    sublabel: 'ISO 9001:2015'  },
  { label: 'BPM',    sublabel: 'Buenas Prácticas'},
  { label: 'GMP',    sublabel: 'Good Manufacturing' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function BenefitsSection() {
  return (
    <section
      className="overflow-hidden py-24"
      style={{ background: "#07091C" }}
    >
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="max-w-xl mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: BLUE }}>
            Por qué elegirnos
          </p>
          {/* H2 más compacto: clamp para máx 2 líneas */}
          <h2
            className="font-syne font-extrabold text-white leading-[1.12] mb-4"
            style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.25rem)" }}
          >
            Insumos médicos con la garantía
            que tu práctica necesita
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Más de{" "}
            <span className="text-white font-semibold">500 clínicas y consultorios</span>{" "}
            en Colombia confían en nuestra cadena de suministro certificada.
          </p>
        </motion.div>

        {/* Grid de cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {benefits.map((b, i) => {
            const isTeal    = b.accent === TEAL;
            const iconBg    = isTeal ? "rgba(0,200,160,0.12)"  : "rgba(26,108,246,0.10)";
            const badgeBg   = isTeal ? "rgba(0,200,160,0.08)"  : "rgba(26,108,246,0.07)";
            const borderCol = isTeal ? "rgba(0,200,160,0.22)"  : "rgba(26,108,246,0.18)";
            const featBorderCol = isTeal ? "rgba(0,200,160,0.35)" : "rgba(26,108,246,0.35)";

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: `0 16px 40px -8px ${b.accent}22` }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="relative bg-white rounded-2xl p-7 border cursor-default"
                style={{
                  border: b.featured ? `1.5px solid ${featBorderCol}` : "1px solid #e9edf2",
                  boxShadow: b.featured ? `0 4px 20px -4px ${b.accent}18` : "0 1px 6px rgba(0,0,0,0.04)",
                }}
              >
                {b.featured && (
                  <span
                    className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: badgeBg, color: b.accent, border: `1px solid ${borderCol}` }}
                  >
                    Destacado
                  </span>
                )}

                {/* Icono Ú solo azul o teal */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: iconBg, color: b.accent }}
                >
                  {b.icon}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{b.description}</p>

                <span
                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: badgeBg, color: b.accent, border: `1px solid ${borderCol}` }}
                >
                  {b.badge}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Certifications footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-14 pt-10 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.22em] mb-2">Certificaciones activas</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Operamos bajo los más altos estándares regulatorios del sector salud en Colombia.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center w-26 h-18 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#1a6cf6]/40 hover:shadow-md transition-all duration-200 px-5 py-4"
                >
                  <span className="font-extrabold text-sm tracking-tight" style={{ color: BLUE }}>{cert.label}</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold text-center mt-1">{cert.sublabel}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA integrado Ú flota sobre el fondo que ya vuelve a navy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 pb-12"
        >
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 px-8 md:px-12 py-8 rounded-2xl" style={{ background: "rgba(26,108,246,0.08)", border: "1px solid rgba(26,108,246,0.18)" }}>
            {/* glow sutil */}
            <div className="absolute right-0 top-0 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,200,160,0.07)" }} />
            <div className="relative text-center lg:text-left">
              <h3 className="font-syne text-white text-xl md:text-2xl font-bold mb-1.5 tracking-tight">
                ¿Listo para optimizar tus compras de insumos?
              </h3>
              <p className="text-slate-400 text-sm max-w-lg">
                Únete a los profesionales que ya ahorran tiempo y dinero con nuestro sistema de entrega prioritaria.
              </p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
                style={{ background: BLUE, boxShadow: `0 0 20px rgba(26,108,246,0.35)` }}
              >
                Ver catálogo
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center text-white font-bold px-7 py-3 rounded-xl border border-white/15 hover:bg-white/10 transition-colors text-sm whitespace-nowrap"
              >
                Hablar con un asesor
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
