import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  jsonb,
  uniqueIndex,
  index,
  integer,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/**
 * Membership roles — ordered from highest to lowest privilege.
 */
export const roleEnum = pgEnum("organization_role", [
  "owner",
  "admin",
  "member",
  "viewer",
  "billing",
]);

/**
 * Invitation lifecycle states.
 */
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "revoked",
]);

/**
 * Inventory movement types.
 */
export const movementTypeEnum = pgEnum("movement_type", [
  "in",     // Purchase, Return from customer
  "out",    // Sale, Return to supplier
  "adj_up", // Manual audit increase
  "adj_down", // Manual audit decrease, waste, loss
]);

/**
 * Sale status lifecycle.
 */
export const saleStatusEnum = pgEnum("sale_status", [
  "draft",
  "pending",
  "completed",
  "cancelled",
]);

/**
 * public.users — profile mirror for auth.users.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * public.organizations — the tenant entity.
 */
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * public.memberships — the tenant membership record.
 */
export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default("member"),
    status: text("status").notNull().default("active"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userOrgUniqueIndex: uniqueIndex("user_org_unique_idx").on(
      table.userId,
      table.organizationId,
    ),
    userIdIdx: index("idx_memberships_user_id").on(table.userId),
    orgIdIdx: index("idx_memberships_org_id").on(table.organizationId),
  }),
);

/**
 * public.org_invitations — tenant invitation records.
 */
export const orgInvitations = pgTable(
  "org_invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: roleEnum("role").notNull().default("member"),
    invitedBy: uuid("invited_by"),
    token: text("token").notNull().unique(),
    status: invitationStatusEnum("status").notNull().default("pending"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_org_invitations_org_id").on(table.organizationId),
    tokenIdx: index("idx_org_invitations_token").on(table.token),
  }),
);

/**
 * public.org_activity_logs — tenant activity audit trail.
 */
export const orgActivityLogs = pgTable(
  "org_activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id"),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_org_activity_logs_org_id").on(table.organizationId),
    createdAtDescIdx: index("idx_org_activity_logs_created_at_desc").on(
      table.createdAt,
    ),
  }),
);

// ---------------------------------------------------------------------------
// ERP Module Tables
// ---------------------------------------------------------------------------

/**
 * public.products — ERP Product Catalog.
 */
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    sku: text("sku"),
    name: text("name").notNull(),
    description: text("description"),
    salePrice: numeric("sale_price", { precision: 12, scale: 2 }).notNull().default("0"),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }).notNull().default("0"),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").references(() => users.id),
    updatedBy: uuid("updated_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_products_org_id").on(table.organizationId),
    orgSkuUniqueIndex: uniqueIndex("idx_products_org_sku")
      .on(table.organizationId, table.sku)
      .where(sql`sku IS NOT NULL`),
  }),
);

/**
 * public.inventory_movements — Stock ledger (Source of Truth).
 */
export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    movementType: movementTypeEnum("movement_type").notNull(),
    quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull(),
    unitCost: numeric("unit_cost", { precision: 12, scale: 2 }),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    note: text("note"),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_inv_mov_org_id").on(table.organizationId),
    prodIdIdx: index("idx_inv_mov_prod_id").on(table.productId),
    compositeIdx: index("idx_inv_mov_org_prod").on(
      table.organizationId,
      table.productId,
    ),
    refIdx: index("idx_inv_mov_reference").on(table.referenceType, table.referenceId),
  }),
);

/**
 * public.inventory_balances — Materialized stock levels.
 */
export const inventoryBalances = pgTable(
  "inventory_balances",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    currentQuantity: numeric("current_quantity", { precision: 12, scale: 4 })
      .notNull()
      .default("0"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgProdUniqueIndex: uniqueIndex("idx_inv_bal_org_prod").on(
      table.organizationId,
      table.productId,
    ),
  }),
);

/**
 * public.sales — ERP Sales transactions.
 */
export const sales = pgTable(
  "sales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    saleNumber: text("sale_number").notNull(),
    status: saleStatusEnum("status").notNull().default("completed"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
    tax: numeric("tax", { precision: 12, scale: 2 }).notNull().default("0"),
    discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    paymentMethod: text("payment_method"),
    createdBy: uuid("created_by").references(() => users.id),
    cancelledBy: uuid("cancelled_by").references(() => users.id),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_sales_org_id").on(table.organizationId),
    orgSaleNumUniqueIndex: uniqueIndex("idx_sales_org_num").on(table.organizationId, table.saleNumber),
  }),
);

/**
 * public.sale_items — Sales line items.
 */
export const saleItems = pgTable(
  "sale_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    saleId: uuid("sale_id")
      .notNull()
      .references(() => sales.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_sale_items_org_id").on(table.organizationId),
    saleIdIdx: index("idx_sale_items_sale_id").on(table.saleId),
    prodIdIdx: index("idx_sale_items_prod_id").on(table.productId),
  }),
);

// ---------------------------------------------------------------------------
// CRM Module
// ---------------------------------------------------------------------------

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "lost",
  "converted",
]);

export const crmLeads = pgTable(
  "crm_leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    source: text("source"),
    status: leadStatusEnum("status").notNull().default("new"),
    assignedTo: uuid("assigned_to").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_crm_leads_org_id").on(table.organizationId),
    statusIdx: index("idx_crm_leads_status").on(table.status),
  })
);

export const crmOpportunities = pgTable(
  "crm_opportunities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => crmLeads.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    value: numeric("value", { precision: 12, scale: 2 }).default("0"),
    probability: integer("probability").default(0),
    expectedCloseDate: timestamp("expected_close_date", { withTimezone: true }),
    stage: text("stage").notNull().default("discovery"),
    assignedTo: uuid("assigned_to").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_crm_opp_org_id").on(table.organizationId),
  })
);

// ---------------------------------------------------------------------------
// Purchases Module
// ---------------------------------------------------------------------------

export const purchaseStatusEnum = pgEnum("purchase_status", [
  "draft",
  "ordered",
  "received",
  "cancelled",
]);

export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    contactName: text("contact_name"),
    email: text("email"),
    phone: text("phone"),
    taxId: text("tax_id"),
    address: text("address"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_suppliers_org_id").on(table.organizationId),
  })
);

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    supplierId: uuid("supplier_id").notNull().references(() => suppliers.id),
    purchaseNumber: text("purchase_number").notNull(),
    status: purchaseStatusEnum("status").notNull().default("draft"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    receivedAt: timestamp("received_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_purchases_org_id").on(table.organizationId),
    orgNumUniqueIdx: uniqueIndex("idx_purchases_org_num").on(table.organizationId, table.purchaseNumber),
  })
);

export const purchaseItems = pgTable(
  "purchase_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    purchaseId: uuid("purchase_id").notNull().references(() => purchases.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id),
    quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_purchase_items_org_id").on(table.organizationId),
    purchaseIdIdx: index("idx_purchase_items_purchase_id").on(table.purchaseId),
  })
);

// ---------------------------------------------------------------------------
// Invoicing & Payments
// ---------------------------------------------------------------------------

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "open",
  "paid",
  "void",
  "overdue",
]);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull(),
    saleId: uuid("sale_id").references(() => sales.id),
    customerId: uuid("customer_id"),
    status: invoiceStatusEnum("status").notNull().default("draft"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
    tax: numeric("tax", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_invoices_org_id").on(table.organizationId),
    orgNumUniqueIdx: uniqueIndex("idx_invoices_org_num").on(table.organizationId, table.invoiceNumber),
  })
);

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id),
    quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_invoice_items_org_id").on(table.organizationId),
    invoiceIdIdx: index("idx_invoice_items_invoice_id").on(table.invoiceId),
  })
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id").references(() => invoices.id),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    method: text("method").notNull(),
    reference: text("reference"),
    paymentDate: timestamp("payment_date", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_payments_org_id").on(table.organizationId),
  })
);

// ---------------------------------------------------------------------------
// Accounting (Double-Entry Ledger)
// ---------------------------------------------------------------------------

export const accountTypeEnum = pgEnum("account_type", [
  "asset",
  "liability",
  "equity",
  "revenue",
  "expense",
]);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    type: accountTypeEnum("type").notNull(),
    parentAccountId: uuid("parent_account_id"),
    balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_accounts_org_id").on(table.organizationId),
    orgCodeUniqueIdx: uniqueIndex("idx_accounts_org_code").on(table.organizationId, table.code),
  })
);

export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    documentReference: text("document_reference"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_journal_org_id").on(table.organizationId),
  })
);

export const journalItems = pgTable(
  "journal_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    entryId: uuid("entry_id").notNull().references(() => journalEntries.id, { onDelete: "cascade" }),
    accountId: uuid("account_id").notNull().references(() => accounts.id),
    debit: numeric("debit", { precision: 12, scale: 2 }).notNull().default("0"),
    credit: numeric("credit", { precision: 12, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_journal_items_org_id").on(table.organizationId),
  })
);

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type").default("info"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgUserIdx: index("idx_notif_org_user").on(table.organizationId, table.userId),
  })
);
