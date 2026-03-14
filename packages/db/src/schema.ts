/**
 * @repo/db — Drizzle ORM schema for vm-platform.
 *
 * This schema mirrors the Supabase public schema. Identity always comes from
 * auth.users (Supabase manages it). public.users is a profile mirror only.
 *
 * Naming conventions:
 * - JS property names: camelCase
 * - DB column names: snake_case (Drizzle maps them automatically)
 */

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
 * Must stay in sync with packages/auth/src/roles.ts (ROLES constant).
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
  "expired",
]);

/**
 * ERP Inventory Movement Types
 */
export const movementTypeEnum = pgEnum("movement_type", [
  "initial_stock",
  "manual_adjustment",
  "sale_out",
  "sale_cancel_revert",
  "purchase_in",
  "internal_transfer",
]);

/**
 * ERP Sale Status
 */
export const saleStatusEnum = pgEnum("sale_status", [
  "draft",
  "completed",
  "cancelled",
]);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

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
    /** Sale price using high precision numeric for currency. */
    salePrice: numeric("sale_price", { precision: 12, scale: 2 }).notNull().default("0"),
    /** Cost price using high precision numeric for currency. */
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
    /** Quantity can be decimal (e.g., kilograms). */
    quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull(),
    /** Optional unit cost at the time of movement. */
    unitCost: numeric("unit_cost", { precision: 12, scale: 2 }),
    /** Optional reference to related entities (Sale, Purchase). */
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
    orgSaleNumUniqueIndex: uniqueIndex("idx_sales_org_num").on(
      table.organizationId,
      table.saleNumber,
    ),
  }),
);

/**
 * public.sale_items — Sales line items.
 */
export const saleItems = pgTable(
  "sale_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    saleId: uuid("sale_id")
      .notNull()
      .references(() => sales.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => ({
    saleIdIdx: index("idx_sale_items_sale_id").on(table.saleId),
    prodIdIdx: index("idx_sale_items_prod_id").on(table.productId),
  }),
);


