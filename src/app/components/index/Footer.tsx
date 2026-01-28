import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logodistsin.png"
                  alt="Logo DISTRIESTHETIC"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  DISTRIESTHETIC
                </h3>
                <p className="text-gray-400 text-sm mt-1">Distribución Especializada</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Proveedor autorizado de productos médicos y estéticos con certificaciones INVIMA. 
              Calidad garantizada en cada entrega.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="pt-4">
              <p className="text-sm font-medium text-gray-300 mb-3">Recibe nuestras ofertas</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-grow px-4 py-2 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                >
                  Suscribirse
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  href="/productos" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Productos
                </Link>
              </li>
              <li>
                <Link 
                  href="/categorias" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Categorías
                </Link>
              </li>
              <li>
                <Link 
                  href="/contacto" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contacto
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">📞</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Teléfono</p>
                  <a 
                    href="tel:+573046831493" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    +57 304 683 1493
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✉️</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <a 
                    href="mailto:info@distriesthetic.com" 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    info@distriesthetic.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">📍</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Ubicación</p>
                  <p className="text-gray-400 text-sm">
                    Bogotá, Colombia
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Certifications Column */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-gray-800 pb-2">
              Certificaciones
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">INVIMA Certificado</p>
                    <p className="text-gray-400 text-xs">Registro sanitario vigente</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">ISO</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">ISO 9001:2015</p>
                    <p className="text-gray-400 text-xs">Sistema de calidad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">Síguenos:</p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-lg">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <span className="text-lg">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <span className="text-lg">💬</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <span className="text-lg">🐦</span>
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <p className="text-gray-400 text-sm">Aceptamos:</p>
              <div className="flex space-x-2">
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">💳</div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">💵</div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">🏦</div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">📱</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} DISTRIESTHETIC. Todos los derechos reservados.
              <span className="hidden md:inline"> • </span>
              <span className="block md:inline mt-1 md:mt-0">NIT: 900.000.000-0</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/terminos" className="hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/privacidad" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
          
          {/* Made with love */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Hecho con ❤️ para profesionales de la salud • 
              <span className="ml-2">Versión 2.0.1</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}