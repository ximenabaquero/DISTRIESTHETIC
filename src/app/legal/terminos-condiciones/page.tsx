import React from 'react';

export const metadata = {
  title: 'Términos y Condiciones - DISTRIESTHETIC',
  description: 'Términos y condiciones de uso de DISTRIESTHETIC',
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Aceptación de Términos</h2>
            <p>
              Al acceder y utilizar este sitio web, usted acepta estar vinculado por estos Términos y Condiciones 
              y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, 
              se le prohíbe utilizar o acceder a este sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Licencia de Uso</h2>
            <p>
              Se le otorga una licencia no exclusiva, revocable y limitada para acceder y utilizar este sitio web 
              únicamente para fines personales y no comerciales. Está prohibido:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reproducir o copiar contenido sin permiso</li>
              <li>Utilizar el sitio para fines ilícitos</li>
              <li>Interferir con la seguridad o funcionalidad del sitio</li>
              <li>Acceder no autorizado a sistemas de la empresa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Productos y Precios</h2>
            <p>
              Los productos, descripciones y precios están sujetos a cambio sin previo aviso. 
              Nos reservamos el derecho de rechazar, cancelar o limitar cualquier pedido. 
              Aunque intentamos mostrar los colores con precisión, no garantizamos que la visualización 
              en su pantalla sea completamente precisa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Proceso de Compra</h2>
            <p>
              Al realizar un pedido, usted declara que:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tiene al menos 18 años</li>
              <li>Los datos proporcionados son correctos y completos</li>
              <li>Está autorizado a realizar la compra</li>
              <li>Aceptar todos los cargos y dinámicas asociados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Pago</h2>
            <p>
              Aceptamos múltiples métodos de pago. El procesamiento de pagos es realizado por terceros autorizados. 
              Usted es responsable de mantener la confidencialidad de su información de pago. 
              No vendemos información de tarjetas de crédito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Envíos y Entregas</h2>
            <p>
              Los tiempos de envío son estimaciones y no garantías. DISTRIESTHETIC no será responsable de retrasos 
              ocasionados por transportistas o circunstancias fuera de nuestro control. El riesgo de pérdida o daño 
              pasa al cliente cuando el artículo se entrega al transportista.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Devoluciones y Reembolsos</h2>
            <p>
              Consulte nuestra política de devoluciones específica para términos detallados. 
              En general, los artículos pueden devolverse dentro de un período especificado si están en condición original. 
              Los reembolsos se procesarán dentro del plazo indicado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Limitación de Responsabilidad</h2>
            <p>
              EN NINGÚN CASO DISTRIESTHETIC SERÁ RESPONSABLE POR DAÑOS DIRECTOS, INDIRECTOS, INCIDENTALES, 
              ESPECIALES O CONSECUENTES QUE RESULTEN DE USAR O NO PODER USAR ESTE SITIO O LOS PRODUCTOS, 
              INCLUSO SI SE HA INFORMADO DE LA POSIBILIDAD DE TALES DAÑOS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Propiedad Intelectual</h2>
            <p>
              Todo el contenido del sitio web, incluyendo texto, gráficos, logos, imágenes y software, 
              es propiedad de DISTRIESTHETIC o sus proveedores de contenido y está protegido por leyes 
              internacionales de derechos de autor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Modificación de Términos</h2>
            <p>
              DISTRIESTHETIC se reserva el derecho de revisar estos términos y condiciones en cualquier momento 
              sin previo aviso. Su uso continuo del sitio significa que acepta los cambios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Ley Aplicable</h2>
            <p>
              Estos términos y condiciones están regidos por las leyes del país donde opera DISTRIESTHETIC 
              y los usuarios aceptan la jurisdicción exclusiva de los tribunales en ese país.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos Términos y Condiciones, por favor contáctenos a través de 
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
