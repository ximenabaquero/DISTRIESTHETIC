import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/logodistsin.png"
                alt="DISTRIESTHETIC Logo"
                width={200}
                height={80}
                className="h-16 w-auto"
              />
              <span className="text-2xl font-bold text-blue-600 ml-3">
                DISTRIESTHETIC
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-700 hover:text-blue-600">
                Productos
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-blue-600">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-300 to-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {/* TODO: Replace with actual hero title */}
            DISTRIESTHETIC
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Medicamentos e insumos médicos de calidad. Todos los productos con registro INVIMA y garantía.
            Pago contraentrega y entrega a domicilio sin costo adicional.
          </p>
          <Link
            href="/productos"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ver Productos
          </Link>
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

      {/* Products Catalog */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nuestro Catálogo de Productos
          </h2>
          
          {/* Medicamentos e insumos médicos */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-3 rounded-full mr-4 shadow-lg">
                <span className="text-3xl">💉</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Medicamentos e insumos médicos
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💊</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">NUEVO</span>
                </div>
                <p className="text-gray-800 font-semibold">Lidocaína 50 ml</p>
                <p className="text-gray-600 text-sm">(unidad | caja x20)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🧻</span>
                  <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full font-semibold">STOCK</span>
                </div>
                <p className="text-gray-800 font-semibold">Wypall Yumbo</p>
                <p className="text-gray-600 text-sm">(890 paños)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💉</span>
                  <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full font-semibold">DISPONIBLE</span>
                </div>
                <p className="text-gray-800 font-semibold">Adrenalina</p>
                <p className="text-gray-600 text-sm">(ampolla)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">⚗️</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">STOCK</span>
                </div>
                <p className="text-gray-800 font-semibold">Bicarbonato</p>
                <p className="text-gray-600 text-sm">(ampolla)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💊</span>
                  <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full font-semibold">600mg</span>
                </div>
                <p className="text-gray-800 font-semibold">Clindamicina</p>
                <p className="text-gray-600 text-sm">(ampolla)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💉</span>
                  <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full font-semibold">80mg</span>
                </div>
                <p className="text-gray-800 font-semibold">Gentamicina</p>
                <p className="text-gray-600 text-sm">(ampolla)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💊</span>
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">40mg</span>
                </div>
                <p className="text-gray-800 font-semibold">Enoxaparina sódica</p>
                <p className="text-gray-600 text-sm">(40 mg)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💊</span>
                  <span className="bg-sky-50 text-sky-700 text-xs px-2 py-1 rounded-full font-semibold">x10</span>
                </div>
                <p className="text-gray-800 font-semibold">Cefalexina 500 mg</p>
                <p className="text-gray-600 text-sm">(caja x10)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🧪</span>
                  <span className="bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded-full font-semibold">20ml</span>
                </div>
                <p className="text-gray-800 font-semibold">Propofol</p>
                <p className="text-gray-600 text-sm">(20 ml)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💊</span>
                  <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">50mg</span>
                </div>
                <p className="text-gray-800 font-semibold">Tramadol clorhidrato</p>
                <p className="text-gray-600 text-sm">(50 mg/ml)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💉</span>
                  <span className="bg-sky-50 text-sky-800 text-xs px-2 py-1 rounded-full font-semibold">x100</span>
                </div>
                <p className="text-gray-800 font-semibold">Dexametazona 8 mg</p>
                <p className="text-gray-600 text-sm">(caja x100)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">💊</span>
                  <span className="bg-cyan-50 text-cyan-800 text-xs px-2 py-1 rounded-full font-semibold">x100</span>
                </div>
                <p className="text-gray-800 font-semibold">Diclofenaco 75 mg</p>
                <p className="text-gray-600 text-sm">(caja x100)</p>
              </div>
            </div>
          </div>

          {/* Soluciones y líquidos */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-300 to-blue-400 p-3 rounded-full mr-4 shadow-lg">
                <span className="text-3xl">🧴</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Soluciones y líquidos
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🍶</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">2.5L</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Frasco 2.5 L</p>
                <p className="text-gray-600 text-sm">(sin tapa | con tapa)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">💧</span>
                  <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full font-semibold">500ml</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Solución salina</p>
                <p className="text-gray-600 text-sm">(500 ml)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">💧</span>
                  <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full font-semibold">1L</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Solución salina</p>
                <p className="text-gray-600 text-sm">(1.000 ml)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-400">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🧪</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">500ml</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Lactato de Ringer</p>
                <p className="text-gray-600 text-sm">(500 ml)</p>
              </div>
            </div>
          </div>

          {/* Insumos médicos */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-200 to-blue-300 p-3 rounded-full mr-4 shadow-lg">
                <span className="text-3xl">🧰</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                Insumos médicos
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🪥</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">x100</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Microbrush</p>
                <p className="text-gray-600 text-sm">(x100 unidades)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">💉</span>
                  <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full font-semibold">3ml</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Jeringas 3 ml</p>
                <p className="text-gray-600 text-sm">(caja x100)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">💉</span>
                  <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full font-semibold">5ml</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Jeringas 5 ml</p>
                <p className="text-gray-600 text-sm">(caja x100)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">💉</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">10ml</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Jeringas 10 ml</p>
                <p className="text-gray-600 text-sm">(caja x100)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">💉</span>
                  <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full font-semibold">20ml</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Jeringas 20 ml</p>
                <p className="text-gray-600 text-sm">(caja x50)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">📍</span>
                  <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full font-semibold">30G</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Agujas 30G x ½</p>
                <p className="text-gray-600 text-sm">(caja completa)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-400 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🔌</span>
                  <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">#22</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Yelcos #22</p>
                <p className="text-gray-600 text-sm">(caja x50)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-400 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧪</span>
                  <span className="bg-sky-50 text-sky-800 text-xs px-2 py-1 rounded-full font-semibold">x100</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Tubos para plasma</p>
                <p className="text-gray-600 text-sm">(100 unid., tapa azul)</p>
              </div>
            </div>
          </div>

          {/* Desinfectantes y químicos */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-sky-300 to-sky-400 p-3 rounded-full mr-4 shadow-lg">
                <span className="text-3xl">🧪</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">
                Desinfectantes y químicos
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-300 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">🧴</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">4L</span>
                </div>
                <p className="text-gray-800 font-bold text-lg mb-2">Glutamida</p>
                <p className="text-gray-600">(galón 4.000 ml)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-300 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform">🧴</span>
                  <span className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full font-semibold">4L</span>
                </div>
                <p className="text-gray-800 font-bold text-lg mb-2">Benzaldina</p>
                <p className="text-gray-600">(galón 4.000 ml)</p>
              </div>
            </div>
          </div>

          {/* Ropa e indumentaria médica */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-cyan-300 to-cyan-400 p-3 rounded-full mr-4 shadow-lg">
                <span className="text-3xl">👕</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
                Ropa e indumentaria médica
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧦</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">PAR</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Medias antiembólicas</p>
                <p className="text-gray-600 text-sm">(par)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🥼</span>
                  <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full font-semibold">CIRUJANO</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Bata cirujano</p>
                <p className="text-gray-600 text-sm">(manga larga)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">👔</span>
                  <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full font-semibold">PACIENTE</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Bata paciente</p>
                <p className="text-gray-600 text-sm">(manga sisa)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🦵</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">x50</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Polainas</p>
                <p className="text-gray-600 text-sm">(50 pares)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🎩</span>
                  <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full font-semibold">x100</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Gorros tipo oruga</p>
                <p className="text-gray-600 text-sm">(100 unidades)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🛏️</span>
                  <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full font-semibold">DESECHABLE</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Sábana desechable</p>
                <p className="text-gray-600 text-sm">(para camilla)</p>
              </div>
            </div>
          </div>

          {/* Protección personal */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-full mr-4 shadow-lg">
                <span className="text-3xl">🧤</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-blue-300 bg-clip-text text-transparent">
                Protección personal
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">😷</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">x50</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Tapabocas individual</p>
                <p className="text-gray-600 text-sm">(empaque x50)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧤</span>
                  <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full font-semibold">NITRILO</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Guantes de nitrilo</p>
                <p className="text-gray-600 text-sm">(caja x50 pares)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-cyan-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧤</span>
                  <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full font-semibold">ESTÉRIL</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Guantes estériles</p>
                <p className="text-gray-600 text-sm">(caja x50 pares)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧤</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">LÁTEX</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Guantes de látex</p>
                <p className="text-gray-600 text-sm">(caja completa)</p>
              </div>
              <div className="bg-gradient-to-br from-white to-sky-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-sky-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">🟦</span>
                  <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full font-semibold">1x1</span>
                </div>
                <p className="text-gray-800 font-semibold mb-1">Campo estéril</p>
                <p className="text-gray-600 text-sm">(1x1 metro)</p>
              </div>
            </div>
          </div>

          {/* Contact and Order Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white p-10 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <span className="text-4xl">📞</span>
                </div>
                <h3 className="text-4xl font-bold mb-2">¡Haz tu pedido ahora!</h3>
                <p className="text-blue-100 text-lg">Contáctanos por WhatsApp y recibe tu pedido en casa</p>
              </div>
              
              <div className="text-center mb-8">
                <a href="https://wa.me/573246614270" 
                   className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="text-2xl mr-3">📱</span>
                  WhatsApp: 324 6614270
                </a>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h4 className="font-bold text-lg">Pago contraentrega</h4>
                  </div>
                  <p className="text-blue-100">Paga cuando recibas tu pedido, total seguridad</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">🚚</span>
                    </div>
                    <h4 className="font-bold text-lg">Entrega gratis</h4>
                  </div>
                  <p className="text-blue-100">Domicilio sin costo adicional en Bogotá</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <h4 className="font-bold text-lg">100% Garantía</h4>
                  </div>
                  <p className="text-blue-100">Productos con registro INVIMA</p>
                </div>
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
