ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "name" text,
  ADD COLUMN IF NOT EXISTS "image" text;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "org_invitations_pending_email_idx"
  ON "org_invitations" ("organization_id", lower("email"))
  WHERE "status" = 'pending';
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.log_org_activity(
  p_organization_id uuid,
  p_actor_id uuid,
  p_action text,
  p_entity_type text DEFAULT NULL,
  p_entity_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.org_activity_logs (
    organization_id,
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  VALUES (
    p_organization_id,
    p_actor_id,
    p_action,
    p_entity_type,
    p_entity_id,
    COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.expire_org_invitations()
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
BEGIN
  UPDATE public.org_invitations
  SET status = 'expired',
      updated_at = now()
  WHERE status = 'pending'
    AND expires_at < now();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN COALESCE(v_count, 0);
END;
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.create_organization_with_owner(
  org_name text,
  owner_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_org_id uuid;
BEGIN
  INSERT INTO public.organizations (name)
  VALUES (trim(org_name))
  RETURNING id INTO v_org_id;

  INSERT INTO public.memberships (
    user_id,
    organization_id,
    role,
    status
  )
  VALUES (
    owner_id,
    v_org_id,
    'owner',
    'active'
  );

  RETURN v_org_id;
END;
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.accept_org_invitation(
  p_token text,
  p_user_id uuid,
  p_email text
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_invitation public.org_invitations%ROWTYPE;
BEGIN
  SELECT *
  INTO v_invitation
  FROM public.org_invitations
  WHERE token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVITATION_NOT_FOUND';
  END IF;

  IF v_invitation.status <> 'pending' THEN
    RAISE EXCEPTION 'INVITATION_INVALID';
  END IF;

  IF v_invitation.expires_at < now() THEN
    UPDATE public.org_invitations
    SET status = 'expired',
        updated_at = now()
    WHERE id = v_invitation.id;
    RAISE EXCEPTION 'INVITATION_EXPIRED';
  END IF;

  IF lower(trim(v_invitation.email)) <> lower(trim(p_email)) THEN
    RAISE EXCEPTION 'INVITATION_EMAIL_MISMATCH';
  END IF;

  INSERT INTO public.memberships (
    user_id,
    organization_id,
    role,
    status,
    joined_at,
    updated_at
  )
  VALUES (
    p_user_id,
    v_invitation.organization_id,
    v_invitation.role,
    'active',
    now(),
    now()
  )
  ON CONFLICT (user_id, organization_id)
  DO UPDATE
    SET role = EXCLUDED.role,
        status = 'active',
        updated_at = now();

  UPDATE public.org_invitations
  SET status = 'accepted',
      accepted_at = now(),
      updated_at = now()
  WHERE id = v_invitation.id;

  RETURN v_invitation.organization_id;
END;
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.transfer_org_ownership(
  p_organization_id uuid,
  p_from_user_id uuid,
  p_to_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_from_membership_id uuid;
  v_to_membership_id uuid;
BEGIN
  IF p_from_user_id = p_to_user_id THEN
    RAISE EXCEPTION 'TRANSFER_SELF';
  END IF;

  SELECT id
  INTO v_from_membership_id
  FROM public.memberships
  WHERE organization_id = p_organization_id
    AND user_id = p_from_user_id
    AND role = 'owner'
    AND status = 'active'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'TRANSFER_NOT_OWNER';
  END IF;

  SELECT id
  INTO v_to_membership_id
  FROM public.memberships
  WHERE organization_id = p_organization_id
    AND user_id = p_to_user_id
    AND status = 'active'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'TRANSFER_NO_TO_MEMBERSHIP';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.memberships
    WHERE id = v_to_membership_id
      AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'TRANSFER_ALREADY_OWNER';
  END IF;

  UPDATE public.memberships
  SET role = 'admin',
      updated_at = now()
  WHERE id = v_from_membership_id;

  UPDATE public.memberships
  SET role = 'owner',
      updated_at = now()
  WHERE id = v_to_membership_id;
END;
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.remove_org_member(
  p_organization_id uuid,
  p_membership_id uuid,
  p_actor_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_target public.memberships%ROWTYPE;
  v_owner_count integer;
BEGIN
  SELECT *
  INTO v_target
  FROM public.memberships
  WHERE id = p_membership_id
    AND organization_id = p_organization_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REMOVE_NOT_FOUND';
  END IF;

  IF v_target.role = 'owner' AND v_target.status = 'active' THEN
    SELECT count(*)
    INTO v_owner_count
    FROM public.memberships
    WHERE organization_id = p_organization_id
      AND role = 'owner'
      AND status = 'active';

    IF v_owner_count <= 1 THEN
      RAISE EXCEPTION 'REMOVE_LAST_OWNER';
    END IF;
  END IF;

  DELETE FROM public.memberships
  WHERE id = p_membership_id
    AND organization_id = p_organization_id;
END;
$$;
