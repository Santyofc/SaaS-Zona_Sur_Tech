import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Facturación Electrónica en Costa Rica | ZonaSur Tech',
  description: 'Software de facturación electrónica validado por el Ministerio de Hacienda en Costa Rica. Alta disponibilidad, fácil integración y cumplimiento tributario total.',
};

export default function FacturacionElectronicaPage() {
  return (
    <div className="container mx-auto px-4 py-32 relative z-10 max-w-4xl">
      <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-8">
        Facturación Electrónica <span className="text-zs-blue">Costa Rica</span>
      </h1>
      
      <div className="prose prose-invert prose-lg max-w-none">
        
        <p className="text-zs-text-secondary text-xl leading-relaxed">
          En un mercado cada vez más digitalizado y estrictamente regulado por el Ministerio de Hacienda, contar con un sistema de <strong>facturación electrónica en Costa Rica</strong> dejó de ser una opción para convertirse en una necesidad crítica para el éxito operativo de cualquier pyme, profesional independiente o gran empresa.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">El Desafío del Cumplimiento Tributario en Costa Rica</h2>
        <p className="text-zs-text-secondary leading-relaxed">
          Las regulaciones tributarias en Costa Rica son dinámicas. El Ministerio de Hacienda realiza actualizaciones constantes a las versiones XML (como el salto de la versión 4.2 a la 4.3), incorpora nuevos códigos Cabys, y refuerza los mecanismos de validación. Las empresas que operan con sistemas desactualizados o ineficientes se enfrentan a rechazos de comprobantes, multas, cierres temporales e ineficiencia administrativa.
        </p>
        <p className="text-zs-text-secondary leading-relaxed">
          Nuestro <Link href="/software-para-pymes-costa-rica" className="text-zs-blue hover:text-zs-cyan underline">Software para PYMES especializado</Link> resuelve la totalidad de la carga operativa. A través de automatización extrema, su equipo dejará de preocuparse por la burocracia técnica, pudiendo facturar desde cualquier dispositivo con conexión a internet y obteniendo la validación inmediata por parte de las entidades tributarias.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">¿Por qué Elegir nuestro Sistema de Facturación Electrónica?</h2>
        
        <h3 className="text-2xl font-bold text-white mt-8 mb-4">1. Integración Directa y en Tiempo Real (API Hacienda)</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          La velocidad es esencial en el punto de venta y en la emisión de facturas empresariales. Hemos diseñado un túnel de conexión directo (API-to-API) con los servidores del Ministerio de Hacienda. Esto significa que cuando emite un tiquete, factura, nota de crédito o nota de débito, el sistema cifra el XML, firma el comprobante de forma criptográfica y recibe el estado procesado en fracciones de segundo.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">2. Búsqueda Integrada de Códigos Cabys</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Uno de los aspectos más complejos del catálogo de bienes y servicios (Cabys) es la actualización y asignación a sus productos. Nuestra plataforma cuenta con un buscador inteligente interno e integración con nuestro <Link href="/sistema-inventario-costa-rica" className="text-zs-blue hover:text-zs-cyan underline">Sistema de Inventario</Link>, permitiéndole vincular todo su catálogo a nivel Cabys de forma rápida y masiva.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">3. Aceptación Automática de Gastos (Recepción)</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          La facturación no es solo emitir. Recibir facturas de sus proveedores y confirmarlas ante Hacienda (Mensaje Receptor) es vital para deducir el impuesto sobre la renta y el IVA. ZonaSur Tech dispone de un buzón automatizado: un algoritmo que sube o lee por correo sus XML recibidos y los procesa ante Hacienda sin que usted tenga que revisar cada archivo manualmente.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">4. Alta Disponibilidad (SLA 99.9%) y Respaldos</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Sabemos que si la plataforma no responde, su negocio no vende. Trabajamos con servidores alojados en ecosistemas tolerantes a fallos (Cloud escalable). Todo comprobante electrónico se archiva de manera redundante por más de los 5 años exigidos legalmente, asegurando su información ante cualquier auditoría.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">La Operación Simplificada para Facturadores y Contadores</h2>
        <p className="text-zs-text-secondary leading-relaxed">
          Tener un programa intuitivo es clave. Mientras que muchos sistemas de facturación en el mercado son confusos, con decenas de menús redundantes, el nuestro sigue un patrón de diseño UX de vanguardia. Las métricas de ingresos, gráficos de cuentas por cobrar, estados de comprobantes (Aceptado, Rechazado, Procesando) están centralizados en un Dashboard accionable. 
          Además, su contador puede disponer de un usuario específico para exportar todos los comprobantes y reportes de IVA en formato Excel al cierre del mes, facilitando inmensamente el cierre fiscal de su declaración D-104.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">Tipos de Documentos Electrónicos Soportados</h2>
        <ul className="list-none space-y-4 pl-0">
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">✓</span>
            <span className="text-zs-text-secondary"><strong>Facturas Electrónicas (FE):</strong> Formato estándar de venta a otra empresa o entidad con cédula jurídica/física.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">✓</span>
            <span className="text-zs-text-secondary"><strong>Tiquetes Electrónicos (TE):</strong> Orientado al consumidor final que no requiere comprobante para deducción del IVA. Ideales en punto de venta (POS).</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">✓</span>
            <span className="text-zs-text-secondary"><strong>Notas de Crédito (NC):</strong> Para anulación total o parcial de transacciones previamente generadas de forma trazable.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">✓</span>
            <span className="text-zs-text-secondary"><strong>Facturas de Exportación (FEE):</strong> Facture exento a clientes fuera de Costa Rica sin afectar sus responsabilidades fiscales interconectadas con el Banco Central.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">✓</span>
            <span className="text-zs-text-secondary"><strong>Facturas de Compra (FEC):</strong> Herramienta útil para respaldar gastos con personas inscritas en régimen tradicional que requieran factura de comprador voluntario u obligado.</span>
          </li>
        </ul>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">Seguridad y Encriptación</h2>
        <p className="text-zs-text-secondary leading-relaxed">
          Su llave criptográfica (.p12) y el NIP proporcionado por el ATV se almacenan mediante Vaults de máxima seguridad (AWS KMS/HashiCorp). Todas transacciones hacia Hacienda están cifradas (TLS 1.2+). Nadie, ni siquiera nuestro equipo, tiene manera de sustraer o leer sus claves tributarias privadas. Así de seguros estamos del blindaje de infraestructura con el que diseñamos el sistema.
        </p>
        <p className="text-zs-text-secondary leading-relaxed mt-4">
          Con ZonaSur Tech, usted está invirtiendo en infraestructura sólida. La combinación de velocidad corporativa y un bajo modelo de suscripción permite a micro, pequeñas y medianas empresas acceder al mismo nivel de herramientas contables que poseen las megacorporaciones, emparejando la curva tecnológica en Costa Rica.
        </p>
        
        <div className="mt-16 bg-gradient-to-br from-zs-bg-secondary to-[#0F172A] p-10 rounded-3xl border border-zs-border overflow-hidden relative group">
          <div className="absolute inset-0 bg-zs-blue/5 group-hover:bg-zs-blue/10 transition-colors duration-500" />
          <h3 className="text-3xl font-black text-white mb-4 relative z-10 italic uppercase tracking-tight">
            Transfiera su Facturación Hoy
          </h3>
          <p className="text-zs-text-secondary mb-8 text-lg relative z-10 max-w-2xl">
            La migración desde su proveedor actual es totalmente gratuita. Le asistimos configurando el ATV, enlazando sus llaves y cargando el catálogo de clientes al software para que empiece a facturar en menos de 24 horas.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="px-10 py-5 bg-zs-blue text-white font-black uppercase tracking-widest rounded-xl hover:bg-zs-blue/80 transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-center">
              Quiero Iniciar
            </Link>
            <Link href="/pricing" className="px-10 py-5 border border-zs-border/80 text-white font-bold rounded-xl hover:bg-zs-text-muted transition-colors text-center backdrop-blur-sm">
              Ver Planes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
