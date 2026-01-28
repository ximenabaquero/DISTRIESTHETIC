import React from 'react';

interface BenefitCard {
  icon: string;
  title: string;
  description: string;
  badge: string;
  color: 'blue' | 'emerald' | 'violet' | 'amber' | 'sky' | 'rose';
}

const benefits: BenefitCard[] = [
  {
    icon: '💰',
    title: "Pago 100% Seguro",
    description: "Paga al recibir tu pedido sin anticipos. Transacciones protegidas con encriptación bancaria.",
    badge: "Sin Riesgos",
    color: 'emerald',
  },
  {
    icon: '🚚',
    title: "Entrega Inmediata",
    description: "Envío gratuito en Bogotá en menos de 24h. Cobertura nacional con seguimiento en tiempo real.",
    badge: "Gratis en Bogotá",
    color: 'blue',
  },
  {
    icon: '🛡️',
    title: "Certificación INVIMA",
    description: "Todos nuestros productos cuentan con registro sanitario vigente y certificaciones de calidad.",
    badge: "Garantía Total",
    color: 'violet',
  },
  {
    icon: '📋',
    title: "Calidad Verificada",
    description: "Proveedores autorizados y certificados ISO. Control de calidad en cada lote de productos.",
    badge: "ISO 9001",
    color: 'amber',
  },
  {
    icon: '⏰',
    title: "Disponibilidad 24/7",
    description: "Pedidos en línea disponibles todo el día. Soporte telefónico prioritario para profesionales.",
    badge: "Atención Inmediata",
    color: 'sky',
  },
  {
    icon: '👨‍⚕️',
    title: "Asesoría Profesional",
    description: "Equipo de expertos en productos médicos. Consultoría gratuita para selección de insumos.",
    badge: "Soporte Especializado",
    color: 'rose',
  },
];

export default function BenefitsSection() {
  // Mapeo de color a clases Tailwind
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'from-blue-500 to-blue-400', text: 'text-blue-700' },
    emerald: { bg: 'from-emerald-500 to-emerald-400', text: 'text-emerald-700' },
    violet: { bg: 'from-violet-500 to-violet-400', text: 'text-violet-700' },
    amber: { bg: 'from-amber-500 to-amber-400', text: 'text-amber-700' },
    sky: { bg: 'from-sky-500 to-sky-400', text: 'text-sky-700' },
    rose: { bg: 'from-rose-500 to-rose-400', text: 'text-rose-700' },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            <span className="block">¿Por qué profesionales</span>
            <span className="block text-blue-600 mt-2">confían en nosotros?</span>
          </h2>
          <p className="text-lg text-gray-600">
            Más de 500 clínicas y consultorios nos eligen por nuestro compromiso con la calidad,
            seguridad y servicio excepcional.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const color = colorMap[benefit.color] || colorMap.blue;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 benefit-card"
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${color.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl text-white">{benefit.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Badge */}
                <span className={`inline-block bg-blue-50 px-3 py-1.5 rounded-full text-sm font-semibold ${color.text}`}>
                  {benefit.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-6">
            Respaldado por certificaciones
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <span className="text-gray-700 font-bold">INVIMA</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold">ISO</span>
              </div>
              <span className="text-gray-700 font-bold">ISO 9001</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold">BPM</span>
              </div>
              <span className="text-gray-700 font-bold">Buenas Prácticas</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold">GMP</span>
              </div>
              <span className="text-gray-700 font-bold">GMP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}