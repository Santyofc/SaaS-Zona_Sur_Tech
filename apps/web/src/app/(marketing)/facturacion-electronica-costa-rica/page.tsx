import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Facturación Electrónica en Costa Rica | ZonaSur Tech',
  description: 'Software de facturación electrónica validado por el Ministerio de Hacienda en Costa Rica. Alta disponibilidad y fácil integración.',
};

export default function FacturacionElectronicaPage() {
  return (
    <div className="container mx-auto px-4 py-32 relative z-10 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8">
        Facturación Electrónica <span className="text-zs-blue">Costa Rica</span>
      </h1>
      <div className="prose prose-invert prose-lg">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cumplimiento del Ministerio de Hacienda</h2>
        <p className="text-zs-text-secondary">
          Nuestra solución de Facturación Electrónica asegura que su empresa cumpla con todos los requisitos fiscales de Costa Rica de forma sencilla, automática y segura. Ideal para profesionales independientes y empresas en crecimiento.
        </p>
        
        <h3 className="text-xl font-bold text-white mt-12 mb-4">Características de nuestro software:</h3>
        <ul className="list-disc pl-5">
          <li className="text-zs-text-secondary mb-2">Integración directa y en tiempo real con Hacienda.</li>
          <li className="text-zs-text-secondary mb-2">Envío y recepción automática de documentos electrónicos.</li>
          <li className="text-zs-text-secondary mb-2">Emisión de Tiquetes Electrónicos y Facturas de Exportación.</li>
          <li className="text-zs-text-secondary mb-2">Diseños de facturas personalizables con su marca.</li>
        </ul>

        <div className="mt-16 bg-zs-bg-secondary/30 p-8 rounded-2xl border border-zs-border/50">
          <h3 className="text-2xl font-bold text-white mb-4">¿Listo para modernizar su facturación?</h3>
          <p className="text-zs-text-secondary mb-6">Contáctenos para una demostración gratuita o pruebe nuestro sistema de inmediato.</p>
          <Link href="/contact" className="px-8 py-4 bg-zs-blue text-white font-bold rounded-xl inline-block hover:bg-zs-blue/80 transition-all text-center">
            Solicitar Información
          </Link>
        </div>
      </div>
    </div>
  );
}
