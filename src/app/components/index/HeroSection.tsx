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

// Panel visual médico — solo visible en desktop (lg+)
function MedicalIllustration() {
  return (
    <div className="hidden lg:flex items-center justify-center relative" style={{ minHeight: "420px" }}>
      {/* Anillos concéntricos decorativos */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[200, 158, 118, 78].map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: r * 2,
              height: r * 2,
              borderColor: i < 2
                ? `rgba(26,108,246,${0.06 + i * 0.04})`
                : `rgba(0,200,160,${0.08 + i * 0.04})`,
            }}
          />
        ))}
      </div>

      {/* Cruz médica central con glow */}
      <div
        className="relative z-10"
        style={{ filter: "drop-shadow(0 0 28px rgba(26,108,246,0.55)) drop-shadow(0 0 8px rgba(0,200,160,0.3))" }}
      >
        <svg width="108" height="108" viewBox="0 0 108 108" fill="none">
          <defs>
            <linearGradient id="crossGrad" x1="0" y1="0" x2="108" y2="108" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1a6cf6" />
              <stop offset="1" stopColor="#00c8a0" />
            </linearGradient>
          </defs>
          <rect x="37" y="6" width="34" height="96" rx="9" fill="url(#crossGrad)" />
          <rect x="6" y="37" width="96" height="34" rx="9" fill="url(#crossGrad)" />
        </svg>
      </div>

      {/* Icono 1: Jeringa — arriba derecha */}
      <div
        className="med-float-1 absolute top-[16%] right-[14%] bg-white/[0.06] border border-white/[0.13] backdrop-blur-sm rounded-xl p-3"
        style={{ boxShadow: "0 0 16px rgba(26,108,246,0.18)" }}
      >
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-4m0 0l4 4m-4-4v-8m0 0l-4-4m4 4l4-4M3 9l4 4M17 5l2-2 2 2-2 2-2-2z" />
        </svg>
      </div>

      {/* Icono 2: Pastilla / cápsula — abajo derecha */}
      <div
        className="med-float-2 absolute bottom-[18%] right-[10%] bg-white/[0.06] border border-white/[0.13] backdrop-blur-sm rounded-xl p-3"
        style={{ boxShadow: "0 0 16px rgba(0,200,160,0.15)" }}
      >
        <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5S4.5 16.142 4.5 12 7.858 4.5 12 4.5s7.5 3.358 7.5 7.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15" />
        </svg>
      </div>

      {/* Icono 3: Molécula / átomo — arriba izquierda */}
      <div
        className="med-float-3 absolute top-[20%] left-[12%] bg-white/[0.06] border border-white/[0.13] backdrop-blur-sm rounded-xl p-3"
        style={{ boxShadow: "0 0 16px rgba(139,92,246,0.18)" }}
      >
        <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c4.97 0 9 4.03 9 9m-9 9c-4.97 0-9-4.03-9-9m9-9C7.03 3 3 7.03 3 12m9 9c4.97 0 9-4.03 9-9" />
        </svg>
      </div>

      {/* Icono 4: Corazón / pulso — abajo izquierda */}
      <div
        className="med-float-4 absolute bottom-[22%] left-[16%] bg-white/[0.06] border border-white/[0.13] backdrop-blur-sm rounded-xl p-3"
        style={{ boxShadow: "0 0 16px rgba(16,185,129,0.18)" }}
      >
        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </div>
    </div>
  );
}

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

      {/* Patrón de cruces médicas — sutil, funciona en cualquier pantalla */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='19' y='9' width='6' height='26' rx='2' fill='%23ffffff'/%3E%3Crect x='9' y='19' width='26' height='6' rx='2' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: "44px 44px",
          opacity: 0.032,
        }}
      />

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
        {/* Split layout: contenido a la izquierda, visual médico a la derecha en desktop */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">

          {/* Columna izquierda — contenido principal */}
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8"
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

            {/* Main title */}
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

            {/* Feature chips */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-3">
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
              className="w-full pt-4 border-t flex flex-col items-center lg:items-start gap-4"
              style={{ borderColor: "rgba(240,244,255,0.07)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.38em]" style={{ color: "rgba(240,244,255,0.28)" }}>
                Estándares de Calidad
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-8">
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

          {/* Columna derecha — ilustración médica SVG (solo desktop) */}
          <MedicalIllustration />
        </div>
      </div>

      {/* Línea EKG separadora al fondo del hero */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: "44px" }}>
        <svg
          viewBox="0 0 1440 44"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ekgGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="15%" stopColor="#1a6cf6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#00c8a0" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#1a6cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M0,22 L360,22 L400,22 L418,5 L432,39 L448,2 L462,39 L478,22 L520,22 L1440,22"
            stroke="url(#ekgGrad)"
            strokeWidth="1.5"
            fill="none"
            className="ekg-line"
          />
        </svg>
      </div>
    </section>
  );
}
