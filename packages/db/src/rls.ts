import { sql } from "drizzle-orm";

/**
 * Sets the organization context for the current Postgres session.
 * This is used by Row Level Security (RLS) to restrict data access.
 * 
 * @param tx Drizzle transaction or database instance
 * @param organizationId The organization ID to lock the session to
 */
export async function setTenantContext(tx: any, organizationId: string) {
  // Use SET LOCAL so it only lasts for the duration of the transaction
  await tx.execute(sql`SELECT set_config('app.current_organization_id', ${organizationId}, true)`);
}

/**
 * Resets the tenant context.
 */
export async function resetTenantContext(tx: any) {
  await tx.execute(sql`SELECT set_config('app.current_organization_id', '', true)`);
}

/**
 * Wraps a transaction with tenant context.
 * 
 * @param db Drizzle database instance
 * @param organizationId The organization ID
 * @param callback The transactional logic
 */
export async function withTenantContext<T>(
  db: any,
  organizationId: string,
  callback: (tx: any) => Promise<T>
): Promise<T> {
  return await db.transaction(async (tx: any) => {
    await setTenantContext(tx, organizationId);
    try {
      return await callback(tx);
    } finally {
      // SET LOCAL automatically resets at end of transaction, 
      // but explicit reset doesn't hurt if we reuse connection.
      // However, SET LOCAL is usually sufficient.
    }
  });
}
