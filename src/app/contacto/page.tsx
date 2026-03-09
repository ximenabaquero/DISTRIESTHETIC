import { SiteNav } from "@/components/SiteNav";
import Footer from "@/app/components/index/Footer";
import { getContactInfo } from "@/lib/contactInfoStore";
import ContactForm from "./components/ContactForm";
import WhatsAppCard from "./components/WhatsAppCard";
import ContactInfoCard from "./components/ContactInfoCard";
import ContactFaq from "./components/ContactFaq";
import EkgDivider from "@/components/EkgDivider";

export const metadata = {
  title: "Contacto – DISTRIESTHETIC",
  description:
    "Contáctanos por WhatsApp o formulario. Distribución de productos estéticos en Colombia.",
};

export default async function ContactoPage() {
  const contacto = await getContactInfo();

  return (
    <div className="min-h-screen bg-[#0b1221] relative overflow-hidden">
      {/* Atmospheric background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(26,108,246,0.13) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(0,200,160,0.07) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(26,108,246,0.06) 0%, transparent 70%)" }} />

      <SiteNav />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-6xl relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold" style={{ background: "rgba(0,200,160,0.10)", border: "1px solid rgba(0,200,160,0.20)", color: "#00c8a0" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c8a0] animate-pulse" />
            Respondemos en menos de 2 horas
          </div>
          <h1 className="text-3xl font-bold text-[#f0f4ff]">Contáctanos</h1>
          <p className="text-[#8899bb] mt-2 max-w-lg">¿Tu empresa necesita insumos médicos o estéticos? Cuéntanos qué productos necesitas y te asesoramos. Envíanos un mensaje con el nombre de tu empresa o tu nombre, email, teléfono y consulta.</p>
        </div>

        <EkgDivider className="mb-8" />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario — único componente client */}
          <ContactForm />

          {/* Columna derecha — server components */}
          <div className="space-y-5">
            <WhatsAppCard whatsapp={contacto.whatsapp} telefono={contacto.telefono} />
            <ContactInfoCard telefono={contacto.telefono} email="charliegil2704@gmail.com" />
          </div>
        </div>

        <EkgDivider className="mt-8" />

        <ContactFaq />
      </main>

      <Footer />
    </div>
  );
}
