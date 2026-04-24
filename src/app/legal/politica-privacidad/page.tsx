import React from 'react';

export const metadata = {
  title: 'Política de Privacidad - DISTRIESTHETIC',
  description: 'Política de privacidad de DISTRIESTHETIC',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introducción</h2>
            <p>
              DISTRIESTHETIC ("nosotros", "nuestro" o "nos") se compromete a proteger su privacidad. 
              Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y salvaguardamos 
              su información cuando utiliza nuestro sitio web y servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Información que Recopilamos</h2>
            <p>Recopilamos información de varias maneras:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Información que proporciona:</strong> Nombre, correo electrónico, número de teléfono, dirección y detalles de pago cuando realiza pedidos o se comunica con nosotros.</li>
              <li><strong>Información automática:</strong> Datos sobre su dispositivo, navegador, dirección IP, páginas visitadas y tiempo de permanencia.</li>
              <li><strong>Cookies:</strong> Utilizamos cookies para mejorar su experiencia de navegación.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Uso de la Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar y completar sus pedidos</li>
              <li>Enviar comunicaciones relacionadas con pedidos y actualizaciones</li>
              <li>Responder a sus consultas y solicitudes de servicio</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Enviar información de marketing (con su consentimiento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger 
              su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Compartir Información</h2>
            <p>
              No vendemos, comerciamos ni transferimos a terceros su información de identificación personal. 
              Esto no incluye terceros de confianza que nos ayudan a operar nuestro sitio web, siempre que 
              acepten mantener la confidencialidad de esta información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Sus Derechos</h2>
            <p>Tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a los datos personales que tenemos sobre usted</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Retirar el consentimiento para el marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Cambios a esta Política</h2>
            <p>
              Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. 
              Los cambios serán efectivos cuando se publiquen en el sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Contacto</h2>
            <p>
              Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos a través de 
              nuestro formulario de contacto o por WhatsApp.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
