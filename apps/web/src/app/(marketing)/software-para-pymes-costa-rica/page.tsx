import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Software para PYMES en Costa Rica | ZonaSur Tech',
  description: 'Descubra el software definitivo en la nube para gestionar facturación, inventario y cuentas por cobrar de pequeñas y medianas empresas en Costa Rica.',
};

export default function SoftwarePymesPage() {
  return (
    <div className="container mx-auto px-4 py-32 relative z-10 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8">
        Software para <span className="text-zs-blue">PYMES Costa Rica</span>
      </h1>
      
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-zs-text-secondary text-xl leading-relaxed">
          Las Pequeñas y Medianas Empresas (PYMES) enfrentan un entorno altamente competitivo donde la eficiencia operativa dicta quién se expande y quién se estanca. En el contexto nacional, un <strong>software para PYMES en Costa Rica</strong> debe estar adaptado a las dinámicas locales, y permitir centralizar las tres áreas vitales de cualquier comercio: gestión de clientes (CRM), administración de productos e inventarios, y facturación homologada ante Hacienda.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">El Problema de Utilizar Múltiples Soluciones Desarticuladas</h2>
        <p className="text-zs-text-secondary leading-relaxed">
          Históricamente, los dueños de PYMES han resuelto su administración mezclando herramientas separadas. Tienen su control de inventario en Excel, realizan cotizaciones en Word o un programa genérico, y finalmente transcriben todo nuevamente a un emisor básico gratuito del Ministerio de Hacienda. Esto incrementa de forma drástica los errores humanos, agota recursos de tiempo invaluables y ralentiza los cierres de caja a fin de día.
        </p>
        <p className="text-zs-text-secondary leading-relaxed">
          Con una solución <Link href="/facturacion-electronica-costa-rica" className="text-zs-blue hover:text-zs-cyan underline">integrada de Facturación Electrónica</Link>, todo sucede en una única plataforma de alto rendimiento. Las cotizaciones se envían por correo, y al ser aprobadas, se convierten en órdenes de compra y facturas con un solo clic. El inventario rebaja sus existencias en la nube (Cloud-Native), e inmediatamente el IVA es registrado de manera contable.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">Módulos Especializados para el Éxito de PYMES</h2>
        
        <h3 className="text-2xl font-bold text-white mt-8 mb-4">Módulo de Cotizaciones y Ventas B2B / B2C</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Usted necesita generar propuestas comerciales profesionales que reflejen la calidad de su servicio. Nuestro software permite diseñar proformas y cotizaciones con el logo de su empresa. Estas se envían de manera ágil al correo del cliente. Además, implementamos un ecosistema de seguimiento de ventas donde puede conocer qué presupuestos están pendientes (En Proceso), aprobados (Ganados) o rechazados (Perdidos). La conversión de una proforma ganada a una venta real dura 2 segundos.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">Gestión Inteligente de Cuentas por Cobrar (CXC)</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Un flujo de caja saludable es oxígeno para cualquier pequeña empresa. Nuestro panel de CXC descompone su cartera vencida y por vencer en intervalos (a 30 días, 60 días, +90 días). Puede programar envíos automáticos de estado de cuenta vía e-mail a sus clientes morosos. Con cada recibo electrónico emitido, la cuenta rebaja mágicamente el saldo pendiente, permitiéndole liquidar facturas a crédito mediante pagos parciales o abonos.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">Control Analítico e Informes Tributarios</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Un software en la nube no solo guarda datos, debe hacerle descubrir oportunidades de negocio. Integramos Business Intelligence en nuestros tableros. Podrá ver qué vendedor (usuario) logra el mayor cierre de caja diario, cuáles son los productos estrella más rentables (integrando el <Link href="/sistema-inventario-costa-rica" className="text-zs-blue hover:text-zs-cyan underline">módulo de Inventario avanzado</Link>) y cuáles consumen mayor costo. Para su contabilidad, generamos reportes de facturación de ingresos gravados, exentos y retenidos listos para llenar sus formularios D-104 en el Portal ATV de Costa Rica.
        </p>

        <h3 className="text-2xl font-bold text-white mt-8 mb-4">Multi-Empresa y Multi-Sucursal</h3>
        <p className="text-zs-text-secondary leading-relaxed">
          Diseñado para empresarios en crecimiento. Si usted administra varios locales (una sucursal en San José, otra en Alajuela) o incluso varias razones sociales diferentes con cédulas independientes, el sistema maneja espacios multi-inquilino. Un solo inicio de sesión le da control jerárquico. Asigne administradores globales, cajeros básicos o gerentes de sucursal.
        </p>

        <h2 className="text-3xl font-bold text-white mt-12 mb-6">Ventajas Competitivas de Migrar a ZonaSur Tech</h2>
        <ul className="list-none space-y-4 pl-0 mt-8 mb-12">
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">1. Diseño &quot;Hacker-Tech&quot; y Responsive:</span>
            <span className="text-zs-text-secondary">Trabaje desde su smartphone iOS o Android, Mac o PC. No requiere instalaciones locales vulnerables a virus o daños en discos duros. El diseño es ultra-rápido, pensado para usuarios modernos.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">2. Precios Honestos (Sin cláusulas ocultas):</span>
            <span className="text-zs-text-secondary">A diferencia del software corporativo pesado, aquí obtiene todo el arsenal corporativo por una tarifa plana mensual que puede cancelar en cualquier momento. Las PYMES merecen tecnología Premium escalable.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">3. Soporte Nacional:</span>
            <span className="text-zs-text-secondary">¿Dudas con la nueva resolución tributaria de Hacienda? Nuestro soporte, basado en Costa Rica, entiende los pormenores y le asistirá con tickets y chat integrado en la plataforma.</span>
          </li>
          <li className="flex items-start">
            <span className="text-zs-blue mr-3 font-bold">4. Copias de Seguridad Invisibles:</span>
            <span className="text-zs-text-secondary">Usted céntrese en vender y atender a su clientela. Por detrás, nuestro motor de réplica de bases de datos almacena toda su data sensible en servidores globales con estándares encriptados a nivel bancario.</span>
          </li>
        </ul>

        <div className="bg-zs-bg-secondary w-full h-[1px] my-10" />

        <div className="flex flex-col md:flex-row gap-8 items-center bg-zs-bg-secondary/40 p-8 rounded-3xl border border-zs-border">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-4">¿Preparado para impulsar la productividad de su comercio?</h3>
            <p className="text-zs-text-secondary">Acelere sus operaciones y libere de horas contables manuales a todo su equipo de trabajo. Adopte un software que trabaje tan duro como usted.</p>
          </div>
          <div className="w-full md:w-auto">
            <Link href="/contact" className="px-10 py-5 w-full md:w-auto block bg-white text-zs-bg-primary font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors shadow-lg text-center">
              Coordinar Reunión
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
