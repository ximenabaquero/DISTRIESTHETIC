"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function HeroSection() {

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.215, 0.61, 0.355, 1] as const 
      },
    },
  };

  return (
    <section className="relative overflow-hidden min-h-[600px] md:min-h-[720px] flex items-center bg-slate-900">
      {/* Background image con overlay oscuro */}
      <Image
        src="/bannersinlogo.png"
        alt="Productos médicos y estéticos DISTRIESTHETIC"
        fill
        priority
        quality={95}
        className="object-cover object-center opacity-40"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-slate-950/60" />

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
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">
              Distribuidores Certificados INVIMA
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Insumos médicos <br />
            <span className="text-blue-400">en tu puerta en 24h</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl"
          >
            Suministramos medicamentos e insumos médicos de alta calidad con 
            <span className="text-white font-medium"> garantía total y entrega inmediata</span>.
          </motion.p>

          {/* Feature chips */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { label: "INVIMA Certificado", color: "border-emerald-500/30" },
              { label: "Entrega 24h · Bogotá", color: "border-blue-500/30" },
              { label: "Pago al recibir", color: "border-slate-500/30" }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className={`px-4 py-2 bg-white/5 backdrop-blur-md border ${feature.color} rounded-lg shadow-xl`}
              >
                <span className="text-sm font-medium text-white/90">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link
              href="/productos"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Explorar Catálogo
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Pedir por WhatsApp
            </Link>
          </motion.div>

          {/* Certifications Footer */}
          <motion.div 
            variants={itemVariants}
            className="pt-10 w-full"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mb-4">Estándares de Calidad</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {["INVIMA", "ISO 9001", "GMP"].map((cert, i) => (
                <span key={i} className="text-sm font-black text-slate-400 tracking-tighter italic">
                  {cert}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}