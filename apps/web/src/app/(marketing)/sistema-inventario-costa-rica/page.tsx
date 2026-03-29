import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sistema de Inventario en Costa Rica | ZonaSur Tech',
  description: 'Control de inventarios y bodega inteligente. Software en la nube para el manejo eficiente de existencias en Costa Rica.',
};

export default function SistemaInventarioPage() {
  return (
    <div className="container mx-auto px-4 py-32 relative z-10 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8">
        Sistema de Inventario <span className="text-zs-blue">Costa Rica</span>
      </h1>
      <div className="prose prose-invert prose-lg">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Gestione sus productos en tiempo real</h2>
        <p className="text-zs-text-secondary">
          No pierda más ventas por falta de stock ni desperdicie capital en productos sin rotación. Nuestro sistema de inventario le brinda visibilidad total sobre sus niveles de existencias, ubicaciones y valores.
        </p>
        
        <h3 className="text-xl font-bold text-white mt-12 mb-4">Funciones clave de gestión y logística:</h3>
        <ul className="list-disc pl-5">
          <li className="text-zs-text-secondary mb-2">Alertas de stock mínimo y reabastecimiento recomendado.</li>
          <li className="text-zs-text-secondary mb-2">Control por códigos de barras o SKU personalizables.</li>
          <li className="text-zs-text-secondary mb-2">Trazabilidad de entradas, salidas y mermas con histórico.</li>
          <li className="text-zs-text-secondary mb-2">Manejo multi-bodega con opciones de traslados internos.</li>
          <li className="text-zs-text-secondary mb-2">Cierre de caja y reportes diarios, semanales y mensuales.</li>
        </ul>

        <div className="mt-16 bg-zs-bg-secondary/30 p-8 rounded-2xl border border-zs-border/50">
          <h3 className="text-2xl font-bold text-white mb-4">Optimice las operaciones de su negocio</h3>
          <p className="text-zs-text-secondary mb-6">Controle sus costos y aumente su rentabilidad con nuestra suite de gestión logística en la nube.</p>
          <Link href="/contact" className="px-8 py-4 bg-zs-blue text-white font-bold rounded-xl inline-block hover:bg-zs-blue/80 transition-all text-center">
            Pida una prueba gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
