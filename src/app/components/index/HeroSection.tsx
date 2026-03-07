import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-gray-100 min-h-[560px] md:min-h-[640px] flex items-center">

      {/* Background image */}
      <Image
        src="/bannersinlogo.png"
        alt="Productos médicos y estéticos DISTRIESTHETIC"
        fill
        priority
        quality={95}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay suave en el centro para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-white/55" />

      {/* Content — centrado */}
      <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-7 max-w-2xl mx-auto">

          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">
              Distribuidores Certificados INVIMA
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            <span className="block text-blue-950">Insumos médicos</span>
            <span className="block text-blue-800 mt-1">en tu puerta en 24h</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
            Suministramos <span className="font-semibold text-slate-700">medicamentos e insumos médicos</span> con
            registro INVIMA, garantía total y entrega inmediata.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-green-100 rounded-xl shadow-sm">
              <div className="w-5 h-5 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">INVIMA Certificado</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-blue-100 rounded-xl shadow-sm">
              <div className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-blue-600">
                  <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 0 0 2 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 0 0 6.5 3ZM2 12v2.5A1.5 1.5 0 0 0 3.5 16h.041a3 3 0 0 1 5.918 0h.791a.75.75 0 0 0 .75-.75V12H2Z" />
                  <path d="M6.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM13.25 5a.75.75 0 0 0-.75.75v8.514a3.001 3.001 0 0 1 4.893 1.44c.37-.275.607-.714.607-1.204v-1a3.75 3.75 0 0 0-3.75-3.75h-.25V5.75a.75.75 0 0 0-.75-.75ZM14.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Entrega en 24h · Bogotá</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-cyan-100 rounded-xl shadow-sm">
              <div className="w-5 h-5 flex items-center justify-center bg-cyan-100 rounded-full flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-cyan-600">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Pago al recibir</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/productos"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors shadow-sm"
            >
              Explorar Catálogo
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Pedir por WhatsApp
            </Link>
          </div>

          {/* Certifications */}
          <div className="pt-4 border-t border-gray-200/60 w-full">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Respaldado por</p>
            <div className="flex items-center justify-center gap-5">
              {["INVIMA", "ISO 9001", "GMP"].map((cert, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <div className="h-4 w-px bg-gray-300" />}
                  <span className="text-sm font-bold text-gray-600 tracking-wide">{cert}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}