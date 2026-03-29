import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sistema de Inventario y Bodegas Costa Rica | ZonaSur Tech',
  description: 'Gestione su cadena de suministros, existencias, traslado entre bodegas y costeo de forma centralizada con nuestro sistema de inventario cloud.',
};

export default function SistemaInventarioPage() {
  return (
    <div className="container mx-auto px-4 py-32 relative z-10 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8">
        Sistema de <span className="text-zs-violet">Inventario Costa Rica</span>
      </h1>
      
      <div className="prose prose-invert prose-lg max-w-none">
        
        <p className="text-zs-text-secondary text-xl leading-relaxed">
          Un <strong>sistema de inventario en Costa Rica</strong> moderno no solo se trata de contar mercancía. Es el núcleo de la rentabilidad comercial. Al poseer información precisa sobre qué se vende, qué caduca o qué escasea, usted tiene la capacidad de tomar decisiones de importación y compra en el momento indicado, y evitar inmovilizar capital valioso de su negocio.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">El Peligro del Inventario Oculto (Mermas)</h2>
        <p className="text-zs-text-secondary leading-relaxed">
          Cuantos más artículos comercializa, más vulnerable es a la pérdida no trazable, caducidad en el almacén, oa desvíos intencionales (robo hormiga). Tradicionalmente, las auditorías de almacén son extenuantes, requiriendo cierres completos del negocio durante fines de semana, y aún así, un error humano en el Excel corrompe toda la precisión contable y financiera anual de su PyME.
        </p>
        <p className="text-zs-text-secondary leading-relaxed">
          Nuestra suite logística se diseñó precisamente para eliminar este caos. Como módulo intrínsecamente vinculado a nuestra <Link href="/facturacion-electronica-costa-rica" className="text-zs-blue hover:text-zs-cyan underline">Facturación Electrónica</Link>, toda venta resta stock en tiempo real y todo gasto de compra añade material a la bodega indicada al instante, calculando el costo unitario de forma automática.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">Bodegas Ilimitadas y Trazabilidad Multi-Sucursal</h2>
        
        <h3 className="text-2xl font-bold text-white mt-8 mb-4">Transferencias Internas Documentadas</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          ¿Necesita mover mercadería de la &quot;Bodega Principal Alajuela&quot; a la &quot;Bodega Tienda Curridabat&quot;? 
          Emita un formulario interno de Movimiento de Inventario. El empleado receptor aprueba digitalmente cuando recibe los bultos (recepción ciega o con escaneo), y el software consolida ambos almacenes descontando al emisor e ingresando al receptor. Nada se traslada sin quedar documentado bajo un usuario logístico.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">Reglas de Reorden (Stock Mínimo)</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Nunca vuelva a perder una venta por falta de existencias. Dentro de la ficha de cada producto (SKU), determine su cantidad mínima operativa. En cuanto la plataforma detecta que dicho hilo llega a 10 unidades, le enviará alertas visuales o por correo para que contacte a su proveedor con el requerimiento de importación.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">Lotes y Fechas de Vencimiento</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Esencial si su empresa distribuye alimentos, industria farmacéutica, químicos o equipo perecedero regulado en Costa Rica. Despache su mercadería usando las lógicas FIFO/FEFO (el primero en expirar o el primero en entrar, debe ser el primero en salir). El sistema no permitirá la facturación de un lote bloqueado o vencido.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">Clasificación, Categorías y Atributos (Cabys)</h2>
        <ul className="list-none space-y-4 pl-0">
          <li className="flex items-start">
            <span className="text-zs-violet mr-3 font-bold">1. Atributos Configurables:</span>
            <span className="text-zs-text-secondary">Si vende textiles, usted no necesita crear 20 códigos Cabys aislados para &quot;Camisa Polo Roja&quot;. Solo crea el ítem matriz &quot;Camisa Polo&quot; y adjunta variables: Talla (S,M,L,XL) y Color. El stock es monitoreado de manera microscópica por cada variante individual generando sus códigos SKU en escalera.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-violet mr-3 font-bold">2. Lectura de Código de Barras Bidi (EAN/UPC):</span>
            <span className="text-zs-text-secondary">Transforme su tablet, smartphone o pistola Bluetooth/USB en un terminal completo. Al presionar el láser durante una venta POS o en un conteo cíclico de almacén, el producto se selecciona automáticamente y es descontado evitando errores tipográficos.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-violet mr-3 font-bold">3. Actualización Masiva Tarifaria e Impuesto IVA:</span>
            <span className="text-zs-text-secondary">Ajuste el porcentaje general del Margen de Ganancia de todo un departamento en 3 clics o exporte la base a Excel, edite sus precios o actualice gravámenes al 13%, 4% o exenciones, y reimporte al ecosistema. Perfecto para el constante cambio de costos operativos de Costa Rica.</span>
          </li>
        </ul>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">Módulo de Compras (Gestión Proveedores)</h2>
        <p className="text-zs-text-secondary leading-relaxed">
          Un inventario que requiere ser llenado manualmente producto por producto está obsoleto. Reciba las órdenes de sus proveedores internacionales o locales, asigne los Gastos de Importación, Fletes (Costeo Landing) e indique en el software que dicha Orden de Compra ha sido Recibida en su totalidad o de manera Parcial. El algoritmo promedia (PPP - Precio Promedio Ponderado) el último costo frente al nuevo y le actualiza sus precios de venta calculados hacia arriba.
        </p>
        <p className="text-zs-text-secondary leading-relaxed mt-4">
          Con esto interconectado, su <Link href="/software-para-pymes-costa-rica" className="text-zs-blue hover:text-zs-cyan underline">Software PYME Integral</Link> dictamina la salud de las Cuentas por Pagar (CXP), sabiendo perfectamente cuánto le adeuda a su proveedor con base a cada factura de mercancía introducida a la bóveda (bodega).
        </p>
        
        <div className="mt-20 flex flex-col items-center bg-zs-violet/10 p-12 rounded-3xl border border-zs-violet/30 overflow-hidden text-center relative">
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-zs-violet/20 blur-[120px] rounded-full mix-blend-screen" />
          <h3 className="text-3xl font-black text-white relative z-10 mb-6">
            Obtenga Visibilidad Absoluta Hoy
          </h3>
          <p className="text-zs-text-secondary text-xl mb-10 relative z-10 max-w-2xl">
            Pare de intentar gobernar los hilos logísticos en su memoria o en software caduco. Instale infraestructura modular tecnológica.
          </p>
          <div className="relative z-10">
            <Link href="/contact" className="px-12 py-6 bg-white text-zs-bg-primary font-black uppercase tracking-widest rounded-2xl hover:bg-zs-violet hover:text-white transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)]">
              Agendar Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
