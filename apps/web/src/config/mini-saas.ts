
export type MiniSaasStatus = "live" | "beta" | "priority" | "planned";

export interface MiniSaasItem {
  slug: string;
  name: string;
  description: string;
  status: MiniSaasStatus;
  href: string;
}

export const miniSaasCatalog: MiniSaasItem[] = [
  {
    slug: "erp",
    name: "Mini ERP",
    description: "Productos, inventario y ventas",
    status: "priority",
    href: "/dashboard/erp"
  },
  {
    slug: "inventory",
    name: "Inventario",
    description: "Control de stock y movimientos",
    status: "planned",
    href: "/dashboard/inventory"
  },
  {
    slug: "crm",
    name: "CRM",
    description: "Gestión de clientes y leads",
    status: "planned",
    href: "/dashboard/crm"
  },
  {
    slug: "bookings",
    name: "Reservas",
    description: "Agenda para barberías y salones",
    status: "planned",
    href: "/dashboard/bookings"
  },
  {
    slug: "quotes",
    name: "Cotizaciones",
    description: "Generador de cotizaciones PDF",
    status: "planned",
    href: "/dashboard/quotes"
  },
  {
    slug: "tickets",
    name: "Sistema de Tickets",
    description: "Soporte técnico para clientes",
    status: "planned",
    href: "/dashboard/tickets"
  }
];
