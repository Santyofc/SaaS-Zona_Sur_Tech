import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Software para PYMES en Costa Rica | ZonaSur Tech',
  description: 'Soluciones de software personalizadas y escalables para pequeñas y medianas empresas en Costa Rica.',
};

export default function SoftwarePymesPage() {
  return (
    <div className="container mx-auto px-4 py-32 relative z-10 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8">
        Software para PYMES en <span className="text-zs-blue">Costa Rica</span>
      </h1>
      <div className="prose prose-invert prose-lg">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Potencie el crecimiento de su negocio</h2>
        <p className="text-zs-text-secondary">
          Entendemos los retos de las PYMES en el mercado actual. Por eso, diseñamos soluciones de software ágiles, modernas y adaptadas a las necesidades específicas de Costa Rica, permitiendo la automatización de flujos de trabajo clave.
        </p>
        
        <h3 className="text-xl font-bold text-white mt-12 mb-4">Beneficios de nuestro ecosistema SaaS:</h3>
        <ul className="list-disc pl-5">
          <li className="text-zs-text-secondary mb-2">Centralización de la información: todos sus datos en un solo lugar.</li>
          <li className="text-zs-text-secondary mb-2">Acceso seguro en la nube 24/7 desde cualquier dispositivo.</li>
          <li className="text-zs-text-secondary mb-2">Costos operativos reducidos gracias a la automatización.</li>
          <li className="text-zs-text-secondary mb-2">Integraciones con redes sociales, WhatsApp y métodos de pago.</li>
        </ul>

        <div className="mt-16 bg-zs-bg-secondary/30 p-8 rounded-2xl border border-zs-border/50">
          <h3 className="text-2xl font-bold text-white mb-4">Descubra una mejor manera de trabajar</h3>
          <p className="text-zs-text-secondary mb-6">Nuestros consultores le ayudarán a identificar la solución exacta para llevar su negocio al siguiente nivel.</p>
          <Link href="/contact" className="px-8 py-4 bg-zs-blue text-white font-bold rounded-xl inline-block hover:bg-zs-blue/80 transition-all text-center">
            Agendar Asesoría
          </Link>
        </div>
      </div>
    </div>
  );
}
