"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "¿Hacen envíos a todo Colombia?",
    a: "Sí, despachamos a todo el territorio nacional. Bogotá: 1–2 días hábiles. Principales ciudades: 2–3 días. Resto del país: 3–5 días hábiles.",
    gradient: "from-[#1a6cf6] to-[#00c8a0]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m0-10L4 7m8 10V7" />
      </svg>
    ),
    tag: "Envíos",
  },
  {
    q: "¿Cuál es el pedido mínimo?",
    a: "No manejamos mínimo de pedido. Puedes solicitar desde una unidad. Para pedidos al por mayor contáctanos por WhatsApp para condiciones especiales.",
    gradient: "from-[#00c8a0] to-[#1a6cf6]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
      </svg>
    ),
    tag: "Pedidos",
  },
  {
    q: "¿Trabajan con centros estéticos pequeños?",
    a: "¡Sí! Atendemos tanto a centros estéticos independientes como a grandes cadenas y clínicas. Nos adaptamos al volumen de cada cliente.",
    gradient: "from-[#1a6cf6] to-[#6366f1]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    tag: "Clientes",
  },
  {
    q: "¿Los productos tienen certificación INVIMA?",
    a: "Todos nuestros productos cuentan con registro INVIMA vigente. Puedes solicitar las fichas técnicas y certificados al momento de tu pedido.",
    gradient: "from-[#00c8a0] to-[#059669]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    tag: "Certificación",
  },
  {
    q: "¿Cómo puedo pagar?",
    a: "Aceptamos pagos en línea a través de Wompi (tarjeta débito/crédito, PSE, Nequi) y también coordinamos pedidos directamente por WhatsApp.",
    gradient: "from-[#6366f1] to-[#1a6cf6]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    tag: "Pagos",
  },
];

export default function ContactFaq() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section className="mt-16">
      {/* Flip card CSS */}
      <style>{`
        .dstfaq-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 1.1s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .dstfaq-card:hover .dstfaq-inner,
        .dstfaq-card:focus-within .dstfaq-inner,
        .dstfaq-card.flipped .dstfaq-inner {
          transform: rotateY(180deg);
        }
        .dstfaq-front,
        .dstfaq-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .dstfaq-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-semibold tracking-wide" style={{ background: "rgba(26,108,246,0.12)", border: "1px solid rgba(26,108,246,0.25)", color: "#1a6cf6" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Preguntas frecuentes
          </div>
          <h2 className="text-2xl font-bold text-[#f0f4ff]">Todo lo que necesitas saber</h2>
          <p className="text-sm text-[#8899bb] mt-2 hidden sm:block">Pasa el cursor sobre cada tarjeta para ver la respuesta</p>
          <p className="text-sm text-[#8899bb] mt-2 sm:hidden">Toca cada tarjeta para ver la respuesta</p>
        </div>

        {/* Flip cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`dstfaq-card h-[200px] ${flipped === i ? "flipped" : ""}`}
              style={{ perspective: "1500px" }}
              tabIndex={0}
              onClick={() => setFlipped(flipped === i ? null : i)}
            >
              <div className="dstfaq-inner">
                {/* Front */}
                <div className="dstfaq-front rounded-2xl flex flex-col p-6" style={{ background: "#111c30", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* gradient top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${faq.gradient}`} />

                  {/* tag */}
                  <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider mb-4" style={{ background: "rgba(255,255,255,0.06)", color: "#8899bb" }}>
                    {faq.tag}
                  </span>

                  {/* icon + question */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${faq.gradient} flex items-center justify-center shadow-lg`}>
                      {faq.icon}
                    </div>
                    <p className="text-sm font-semibold text-[#f0f4ff] leading-snug">{faq.q}</p>
                  </div>

                  {/* hint */}
                  <p className="text-[11px] text-[#8899bb] mt-3 flex items-center gap-1">
                    Ver respuesta
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>

                {/* Back */}
                <div className="dstfaq-back rounded-2xl flex flex-col justify-center p-6" style={{ background: "#0d1a2e", border: "1px solid rgba(26,108,246,0.30)" }}>
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${faq.gradient}`} />
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#8899bb" }}>Respuesta</p>
                  <p className="text-sm text-[#f0f4ff] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#8899bb] mt-8">
          ¿Otra pregunta?{" "}
          <Link href="#" className="text-[#1a6cf6] hover:underline">
            Escríbenos por WhatsApp
          </Link>
        </p>
      </div>
    </section>
  );
}
