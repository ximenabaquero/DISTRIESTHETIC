import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/SiteNav";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <h1 className="text-5xl font-bold text-blue-700">
                DISTRIESTHETIC
              </h1>
              <p className="text-xl text-gray-700">
                Medicamentos e insumos médicos de calidad. Todos los productos con registro INVIMA y garantía.
                Pago contraentrega y entrega a domicilio sin costo adicional.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  href="/productos"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Ver Productos
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <Image
                src="/imagenpanelpa.PNG"
                alt="Panel principal DISTRIESTHETIC"
                width={700}
                height={300}
                priority
                className="w-full max-w-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos tu mejor aliado para el suministro de productos médicos de calidad
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border-t-4 border-blue-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-500 transition-colors">Pago Seguro</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Paga cuando recibas tu pedido. Sin anticipos, sin riesgos. Tu tranquilidad es nuestra prioridad.</p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">100% Seguro</span>
              </div>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border-t-4 border-sky-300">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-300 to-sky-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-sky-500 transition-colors">Entrega Gratis</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Envío gratuito en Bogotá y tarifas preferenciales a nivel nacional. Recibe tus productos en la puerta de tu consultorio.</p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold">Sin Costo Adicional</span>
              </div>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border-t-4 border-cyan-300">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-cyan-500 transition-colors">Calidad Garantizada</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Todos nuestros productos cuentan con registro INVIMA y certificaciones de calidad. Garantía total en cada compra.</p>
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold">INVIMA Certificado</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold">DISTRIESTHETIC</h3>
            <p className="text-gray-400">Distribución de productos estéticos</p>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-400 hover:text-white">
              Productos
            </Link>
            <Link href="/contacto" className="text-gray-400 hover:text-white">
              Contacto
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 DISTRIESTHETIC. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
