-- Migration: next_actions + closing_signals + workflow_events
-- Supports: Smart Next Action persistence, Closing Risk Signals, unified audit

-- 1. Next Actions — persisted per-customer actions with owner + deadline
CREATE TABLE IF NOT EXISTS public.next_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_id text NOT NULL,
  canonical_id text,
  customer_name text,
  owner_id text NOT NULL,
  owner_name text,
  kind text NOT NULL,       -- 'call' | 'whatsapp' | 'send-property' | 'confirm-tour' | ...
  due_at timestamptz NOT NULL,
  note text,
  completed_at timestamptz,
  completed_by text,
  source text,              -- 'smart-engine' | 'operator' | 'call-engine'
  module text,              -- 'movement-os' | 'call-engine' | 'closing'
  client_id text
);

CREATE INDEX next_actions_customer_idx ON public.next_actions (customer_id);
CREATE INDEX next_actions_canonical_idx ON public.next_actions (canonical_id);
CREATE INDEX next_actions_due_idx ON public.next_actions (due_at) WHERE completed_at IS NULL;
CREATE UNIQUE INDEX next_actions_client_id_idx ON public.next_actions (client_id) WHERE client_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE ON public.next_actions TO authenticated;
GRANT ALL ON public.next_actions TO service_role;

ALTER TABLE public.next_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can read next actions"
  ON public.next_actions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Operators insert next actions"
  ON public.next_actions FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Operators update next actions"
  ON public.next_actions FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Closing Signals — risk/priority signals for post-tour customers
CREATE TABLE IF NOT EXISTS public.closing_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_id text NOT NULL,
  canonical_id text,
  customer_name text,
  signal_type text NOT NULL,   -- 'overdue-deadline' | 'no-next-action' | 'payment-pending' | 'decision-pending' | 'missed-commitment'
  severity text NOT NULL DEFAULT 'medium',  -- 'low' | 'medium' | 'high' | 'critical'
  detail text,
  acknowledged_at timestamptz,
  acknowledged_by text,
  resolved_at timestamptz,
  module text DEFAULT 'closing'
);

CREATE INDEX closing_signals_customer_idx ON public.closing_signals (customer_id);
CREATE INDEX closing_signals_open_idx ON public.closing_signals (created_at DESC) WHERE resolved_at IS NULL;

GRANT SELECT, INSERT, UPDATE ON public.closing_signals TO authenticated;
GRANT ALL ON public.closing_signals TO service_role;

ALTER TABLE public.closing_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can read closing signals"
  ON public.closing_signals FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Operators insert closing signals"
  ON public.closing_signals FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Operators update closing signals"
  ON public.closing_signals FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Workflow Events — unified audit trail across all modules
CREATE TABLE IF NOT EXISTS public.workflow_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_id text NOT NULL,
  canonical_id text,
  customer_name text,
  actor_id text,
  actor_name text,
  action text NOT NULL,
  module text NOT NULL,         -- 'movement-os' | 'call-engine' | 'closing' | 'booking-flow'
  before_state jsonb,
  after_state jsonb,
  summary text NOT NULL,        -- human-readable one-liner
  client_id text
);

CREATE INDEX workflow_events_customer_idx ON public.workflow_events (customer_id);
CREATE INDEX workflow_events_created_idx ON public.workflow_events (created_at DESC);
CREATE UNIQUE INDEX workflow_events_client_id_idx ON public.workflow_events (client_id) WHERE client_id IS NOT NULL;

GRANT SELECT, INSERT ON public.workflow_events TO authenticated;
GRANT ALL ON public.workflow_events TO service_role;

ALTER TABLE public.workflow_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can read workflow events"
  ON public.workflow_events FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Operators insert workflow events"
  ON public.workflow_events FOR INSERT TO authenticated
  WITH CHECK (true);
