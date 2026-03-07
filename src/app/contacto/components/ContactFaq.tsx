import Link from "next/link";

const faqs = [
  {
    q: "¿Hacen envíos a todo Colombia?",
    a: "Sí, despachamos a todo el territorio nacional. Bogotá: 1–2 días hábiles. Principales ciudades: 2–3 días. Resto del país: 3–5 días hábiles.",
  },
  {
    q: "¿Cuál es el pedido mínimo?",
    a: "No manejamos mínimo de pedido. Puedes solicitar desde una unidad. Para pedidos al por mayor contáctanos por WhatsApp para condiciones especiales.",
  },
  {
    q: "¿Trabajan con centros estéticos pequeños?",
    a: "¡Sí! Atendemos tanto a centros estéticos independientes como a grandes cadenas y clínicas. Nos adaptamos al volumen de cada cliente.",
  },
  {
    q: "¿Los productos tienen certificación INVIMA?",
    a: "Todos nuestros productos cuentan con registro INVIMA vigente. Puedes solicitar las fichas técnicas y certificados al momento de tu pedido.",
  },
  {
    q: "¿Cómo puedo pagar?",
    a: "Aceptamos pagos en línea a través de Wompi (tarjeta débito/crédito, PSE, Nequi) y también coordinamos pedidos directamente por WhatsApp.",
  },
];

export default function ContactFaq() {
  return (
    <section className="mt-14">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Preguntas frecuentes</h2>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none font-medium text-gray-800 text-sm hover:bg-gray-50 transition-colors">
                {faq.q}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                >
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          ¿Otra pregunta?{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            Escríbenos por WhatsApp
          </Link>
        </p>
      </div>
    </section>
  );
}
