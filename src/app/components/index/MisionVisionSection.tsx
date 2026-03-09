"use client";

import { motion, Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const valores = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    titulo: "Productos garantizados",
    desc: "Trabajamos únicamente con productos que cuentan con registro sanitario del INVIMA.",
    color: "#00c8a0",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    titulo: "Entrega inmediata",
    desc: "Distribuimos en el menor tiempo posible para que tus procedimientos no se detengan.",
    color: "#1a6cf6",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
    ),
    titulo: "Satisfacción del cliente",
    desc: "Cada pedido es atendido con dedicación para superar las expectativas de nuestros clientes.",
    color: "#00c8a0",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525" />
      </svg>
    ),
    titulo: "Compromiso ambiental",
    desc: "Usamos bolsas biodegradables y solo trabajamos con productos que cumplen normas sanitarias vigentes.",
    color: "#1a6cf6",
  },
];

export default function MisionVisionSection() {
  return (
    <section className="py-24 overflow-hidden" style={{ background: "#0b1221" }}>
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#1a6cf6" }}>
            Quiénes somos
          </p>
          <h2
            className="font-syne font-extrabold text-white leading-[1.12]"
            style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.25rem)" }}
          >
            Nuestra razón de ser
          </h2>
        </motion.div>

        {/* Misión + Visión */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid md:grid-cols-2 gap-6 mb-14"
        >
          {/* Misión */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl p-8 overflow-hidden card-sheen"
            style={{ background: "rgba(26,108,246,0.07)", border: "1px solid rgba(26,108,246,0.20)" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: "linear-gradient(90deg, #1a6cf6, #00c8a0)" }} />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(26,108,246,0.06)" }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-5" style={{ background: "rgba(26,108,246,0.12)", color: "#1a6cf6", border: "1px solid rgba(26,108,246,0.22)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Misión
              </div>
              <p className="text-[#c8d8f0] text-base leading-relaxed">
                Suplir las necesidades de los médicos esteticistas a nivel nacional mediante la{" "}
                <span className="text-white font-semibold">distribución de productos de calidad</span>{" "}
                que faciliten la realización de sus procedimientos.
              </p>
            </div>
          </motion.div>

          {/* Visión */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl p-8 overflow-hidden card-sheen"
            style={{ background: "rgba(0,200,160,0.06)", border: "1px solid rgba(0,200,160,0.18)" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl" style={{ background: "linear-gradient(90deg, #00c8a0, #1a6cf6)" }} />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,200,160,0.05)" }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-5" style={{ background: "rgba(0,200,160,0.10)", color: "#00c8a0", border: "1px solid rgba(0,200,160,0.20)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Visión
              </div>
              <p className="text-[#c8d8f0] text-base leading-relaxed">
                Lograr un{" "}
                <span className="text-white font-semibold">crecimiento exponencial</span>{" "}
                dentro del mercado nacional, consolidándonos como el distribuidor de referencia en insumos médicos y estéticos de Colombia.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] mb-6" style={{ color: "rgba(240,244,255,0.35)" }}>
            Nuestros valores
          </p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {valores.map((v, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex flex-col gap-3 p-5 rounded-xl overflow-hidden card-sheen"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${v.color}18`, color: v.color }}
                >
                  {v.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{v.titulo}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
