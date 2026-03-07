import { SiteNav } from "@/components/SiteNav";
import Footer from "@/app/components/index/Footer";
import { getContactInfo } from "@/lib/contactInfoStore";
import ContactForm from "./components/ContactForm";
import WhatsAppCard from "./components/WhatsAppCard";
import ContactInfoCard from "./components/ContactInfoCard";
import ContactFaq from "./components/ContactFaq";

export const metadata = {
  title: "Contacto – DISTRIESTHETIC",
  description:
    "Contáctanos por WhatsApp o formulario. Distribución de productos estéticos en Colombia.",
};

export default async function ContactoPage() {
  const contacto = await getContactInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Contáctanos</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario — único componente client */}
          <ContactForm />

          {/* Columna derecha — server components */}
          <div className="space-y-5">
            <WhatsAppCard whatsapp={contacto.whatsapp} telefono={contacto.telefono} />
            <ContactInfoCard telefono={contacto.telefono} email="charliegil2704@gmail.com" />
          </div>
        </div>

        <ContactFaq />
      </main>

      <Footer />
    </div>
  );
}
