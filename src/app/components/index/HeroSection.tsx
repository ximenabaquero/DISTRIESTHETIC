import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-16 md:py-28">

      {/* Background blobs */}
      <div className="absolute top-10 left-5 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-10 right-5 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">

          {/* ── Text Content ── */}
          <div className="w-full lg:w-1/2 space-y-7 text-center lg:text-left">

            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                Distribuidores Certificados
              </span>
            </div>

            {/* Main title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="block text-gray-900">Insumos médicos</span>
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mt-1">
                en tu puerta en 24h
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Suministramos <span className="font-semibold text-blue-600">medicamentos e insumos médicos</span> con
              registro INVIMA, garantía total y entrega inmediata.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">

              {/* INVIMA */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-100 rounded-xl">
                <div className="w-5 h-5 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">INVIMA Certificado</span>
              </div>

              {/* Entrega */}
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-blue-600">
                    <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 0 0 2 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 0 0 6.5 3ZM2 12v2.5A1.5 1.5 0 0 0 3.5 16h.041a3 3 0 0 1 5.918 0h.791a.75.75 0 0 0 .75-.75V12H2Z" />
                    <path d="M6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM13.25 5a.75.75 0 0 0-.75.75v8.514a3.001 3.001 0 0 1 4.893 1.44c.37-.275.607-.714.607-1.204v-1a3.75 3.75 0 0 0-3.75-3.75h-.25V5.75a.75.75 0 0 0-.75-.75ZM14.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Entrega en 24h · Bogotá</span>
              </div>

              {/* Pago */}
              <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-100 rounded-xl">
                <div className="w-5 h-5 flex items-center justify-center bg-cyan-100 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-cyan-600">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Pago al recibir</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center lg:justify-start">
              <Link
                href="/productos"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
              >
                Explorar Catálogo
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-blue-600 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                Contactar Asesor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>

            {/* Certifications */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Respaldado por</p>
              <div className="flex items-center justify-center lg:justify-start gap-5">
                {["INVIMA", "ISO 9001", "GMP"].map((cert, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <div className="h-4 w-px bg-gray-300" />}
                    <span className="text-sm font-bold text-gray-600 tracking-wide">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Image Container ── */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-xl">

              {/* Glow accents */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full opacity-20 blur-xl" />

              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/imagenpanelpa.png"
                  alt="Catálogo profesional de productos médicos y estéticos DISTRIESTHETIC"
                  width={800}
                  height={450}
                  priority
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              </div>

              {/* Floating card — productos */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-600">
                      <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                      <path fillRule="evenodd" d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 leading-none">+500</div>
                    <div className="text-xs text-gray-500 mt-0.5">Productos</div>
                  </div>
                </div>
              </div>

              {/* Floating card — rating */}
              <div className="absolute -top-5 -left-5 bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-400">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 leading-none">4.9/5</div>
                    <div className="text-xs text-gray-500 mt-0.5">Calificación</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-9 border-2 border-gray-300 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-blue-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}