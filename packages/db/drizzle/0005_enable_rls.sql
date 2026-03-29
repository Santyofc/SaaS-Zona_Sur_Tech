-- Enable Row Level Security (RLS) on all tenant-scoped tables

DO $$ 
DECLARE
    t text;
    tables_to_enable text[] := ARRAY[
        'memberships',
        'org_invitations',
        'org_activity_logs',
        'products',
        'inventory_movements',
        'inventory_balances',
        'sales',
        'sale_items',
        'crm_leads',
        'crm_opportunities',
        'suppliers',
        'purchases',
        'purchase_items',
        'invoices',
        'invoice_items',
        'payments',
        'accounts',
        'journal_entries',
        'journal_items',
        'notifications'
    ];
BEGIN
    FOREACH t IN ARRAY tables_to_enable LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
        
        -- Drop existing policy if it exists to make it idempotent
        EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I', t);
        
        -- Create the isolation policy
        EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I FOR ALL TO public USING (organization_id = current_setting(''app.current_organization_id'', true)::uuid)', t);
        
        -- Force RLS even for table owners (optional but safer for dev)
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;
