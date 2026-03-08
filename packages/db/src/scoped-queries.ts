import { db } from "./index";
import { and, eq } from "drizzle-orm";

export const withOrganization = <T extends { organizationId: any }>(
  table: any,
  organizationId: string,
) => {
  return {
    where: eq(table.organizationId, organizationId),
  };
};

// Example usage:
// const projects = await db.select().from(projectsTable).where(eq(projectsTable.organizationId, session.organizationId));
