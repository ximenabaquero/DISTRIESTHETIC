"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

const features = [
  {
    label: "INVIMA Certificado",
    border: "border-[#00c8a0]/25",
    icon: (
      <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "#00c8a0" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: "Entrega 24h · Bogotá",
    border: "border-[#1a6cf6]/30",
    icon: (
      <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "#6aa3ff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Pago al recibir",
    border: "border-violet-400/25",
    icon: (
      <svg className="w-3.5 h-3.5 text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

const certs = [
  { name: "INVIMA",   dot: "#00c8a0" },
  { name: "ISO 9001", dot: "#1a6cf6" },
  { name: "GMP",      dot: "#a78bfa" },
];

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[720px] flex items-center">
      {/* Deep navy base */}
      <div className="absolute inset-0 bg-[#07091C]" />

      {/* Gradient mesh — azul/teal desde arriba */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 55% at 50% -10%, rgba(56,189,248,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 55% 40% at 85% 10%, rgba(45,212,191,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 15% 30%, rgba(99,102,241,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="container relative mx-auto px-4 md:px-6 py-20">
        <motion.div
          className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">
              Distribuidores Certificados INVIMA
            </span>
          </motion.div>

          {/* Main title — Syne */}
          <motion.h1
            variants={itemVariants}
            className="font-syne font-extrabold tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 5.5vw, 3.6rem)", lineHeight: 1.08 }}
          >
            Insumos médicos{" "}
            <br className="hidden sm:block" />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(95deg, #6aa3ff 0%, #4dd9c0 100%)" }}
            >
              en tu puerta en 24h
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl"
          >
            Suministramos medicamentos e insumos médicos de alta calidad con{" "}
            <span className="text-white font-medium">garantía total y entrega inmediata</span>.
          </motion.p>

          {/* Feature chips con íconos */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
            {features.map((f, i) => (
              <div
                key={i}
                className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] backdrop-blur-sm border ${f.border} rounded-xl`}
              >
                {f.icon}
                <span className="text-sm font-semibold text-white/90">{f.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/productos"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.35)]"
            >
              Explorar Catálogo
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white rounded-xl transition-colors"
              style={{ background: "#00a882", boxShadow: "0 0 28px rgba(0,200,160,0.22)" }}
            >
              Pedir por WhatsApp
            </Link>
          </motion.div>

          {/* Cert strip */}
          <motion.div
            variants={itemVariants}
            className="w-full pt-4 border-t flex flex-col items-center gap-4"
            style={{ borderColor: "rgba(240,244,255,0.07)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.38em]" style={{ color: "rgba(240,244,255,0.28)" }}>
              Estándares de Calidad
            </p>
            <div className="flex items-center justify-center gap-8">
              {certs.map((cert, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full" style={{ background: cert.dot }} />
                  <span
                    className="text-[12px] font-black tracking-[0.18em] italic"
                    style={{ color: "rgba(240,244,255,0.45)" }}
                  >
                    {cert.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}