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
} from "drizzle-orm/pg-core";

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

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

/**
 * public.users — profile mirror for auth.users.
 *
 * IMPORTANT:
 * - The `id` column mirrors auth.users.id (UUID from Supabase Auth).
 * - This table is NOT the identity source. Always use auth.users for identity.
 * - password_hash is kept for schema backward-compat only. Supabase manages auth.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  /** Sentinel value "SUPABASE_MANAGED" — not used for authentication. */
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * public.organizations — the tenant entity.
 * Every resource in the system must be scoped to an organization.
 */
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  /** Optional URL-safe identifier for vanity URLs. */
  slug: text("slug").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * public.memberships — the tenant membership record.
 *
 * Design decisions:
 * - user_id references auth.users(id) directly (NOT public.users.id)
 *   to prevent orphaned memberships when public.users records don't exist.
 * - The unique index on (user_id, organization_id) prevents double membership.
 * - status tracks the membership lifecycle (active/invited/suspended).
 */
export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    /** References auth.users(id). Do NOT reference public.users.id. */
    userId: uuid("user_id").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default("member"),
    /** active | invited | suspended */
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
    userOrgCompositeIdx: index("idx_memberships_user_id_org_id").on(
      table.userId,
      table.organizationId,
    ),
  }),
);

/**
 * public.org_invitations — tenant invitation records.
 *
 * Replaces the legacy `invitations` table which was tied to integer team_id.
 * Tokens are 64-char hex strings (32 bytes of crypto random).
 * A partial unique index prevents duplicate pending invites for (org, email).
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
    /** auth.users.id of inviter — nullable in case the inviter is deleted. */
    invitedBy: uuid("invited_by"),
    /** 64-char hex token — UNIQUE globally. */
    token: text("token").notNull().unique(),
    status: invitationStatusEnum("status").notNull().default("pending"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_org_invitations_org_id").on(table.organizationId),
    emailIdx: index("idx_org_invitations_email").on(table.email),
    statusIdx: index("idx_org_invitations_status").on(table.status),
    tokenIdx: index("idx_org_invitations_token").on(table.token),
    expiresAtIdx: index("idx_org_invitations_expires_at").on(table.expiresAt),
    // NOTE: partial unique index (pending) is managed in SQL migration only;
    // Drizzle doesn't support partial indexes in the table builder yet.
  }),
);

/**
 * public.org_activity_logs — tenant activity audit trail.
 *
 * Replaces the legacy `activity_logs` table which was tied to integer team_id.
 * All writes go through the log_org_activity RPC for atomicity.
 */
export const orgActivityLogs = pgTable(
  "org_activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    /** auth.users.id of the actor — nullable in case the actor is deleted. */
    actorId: uuid("actor_id"),
    /** Dot-separated action string: <entity>.<verb> */
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdIdx: index("idx_org_activity_logs_org_id").on(table.organizationId),
    actorIdIdx: index("idx_org_activity_logs_actor_id").on(table.actorId),
    actionIdx: index("idx_org_activity_logs_action").on(table.action),
    createdAtDescIdx: index("idx_org_activity_logs_created_at_desc").on(
      table.createdAt,
    ),
    orgCreatedIdx: index("idx_org_activity_logs_org_created").on(
      table.organizationId,
      table.createdAt,
    ),
  }),
);
