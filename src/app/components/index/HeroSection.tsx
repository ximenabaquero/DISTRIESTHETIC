import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-16 md:py-28">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-5 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-10 right-5 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Distribuidores Certificados
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              <span className="block text-gray-900">Productos Médicos</span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
                de Alta Calidad
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Suministramos <span className="font-semibold text-blue-600">medicamentos e insumos médicos</span> con 
              registro INVIMA, garantía total y entrega inmediata. Tu salud es nuestra prioridad.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-sm font-medium">INVIMA Certificado</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full">
                  <span className="text-blue-600 text-sm">🚚</span>
                </div>
                <span className="text-sm font-medium">Entrega Gratis</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full">
                  <span className="text-purple-600 text-sm">💳</span>
                </div>
                <span className="text-sm font-medium">Pago Seguro</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center lg:justify-start">
              <Link
                href="/productos"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <span>Explorar Catálogo</span>
                <svg 
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div className="absolute inset-0 rounded-xl border-2 border-white/20"></div>
              </Link>
              
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <span>Contactar Asesor</span>
                <svg 
                  className="w-5 h-5 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Confían en nosotros:</p>
              <div className="flex items-center justify-center lg:justify-start gap-6 opacity-75">
                <div className="text-gray-700 font-bold text-lg tracking-wider">INVIMA</div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-gray-700 font-bold text-lg">ISO 9001</div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-gray-700 font-bold text-lg">GMP</div>
              </div>
            </div>
          </div>

          {/* Image Container */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-xl">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/imagenpanelpa.png"
                  alt="Catálogo profesional de productos médicos y estéticos DISTRIESTHETIC con certificaciones INVIMA"
                  width={800}
                  height={450}
                  priority
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={95}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">+500</div>
                    <div className="text-sm text-gray-600">Productos</div>
                  </div>
                </div>
              </div>

              {/* Floating Element 2 */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-600">Calificación</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}