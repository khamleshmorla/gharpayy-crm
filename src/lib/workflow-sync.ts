// Supabase persistence for next actions, closing signals, and workflow events.
// Mirrors the existing pushCallRecord() pattern from callengine/sync.ts.
import { supabase } from "@/integrations/supabase/client";

/* ────────────── Next Actions ────────────── */

export interface NextActionRow {
  id: string;
  customer_id: string;
  canonical_id: string | null;
  customer_name: string | null;
  owner_id: string;
  owner_name: string | null;
  kind: string;
  due_at: string;
  note: string | null;
  completed_at: string | null;
  source: string | null;
  module: string | null;
  client_id: string | null;
}

export async function pushNextAction(input: {
  clientId: string;
  customerId: string;
  canonicalId?: string;
  customerName?: string;
  ownerId: string;
  ownerName?: string;
  kind: string;
  dueAt: string;
  note?: string;
  source?: string;
  module?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const row = {
    client_id: input.clientId,
    customer_id: input.customerId,
    canonical_id: input.canonicalId ?? null,
    customer_name: input.customerName ?? null,
    owner_id: input.ownerId,
    owner_name: input.ownerName ?? null,
    kind: input.kind,
    due_at: input.dueAt,
    note: input.note ?? null,
    source: input.source ?? "operator",
    module: input.module ?? "movement-os",
  };
  const { error } = await supabase.from("next_actions").insert(row);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function completeNextAction(clientId: string, completedBy?: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("next_actions")
    .update({ completed_at: new Date().toISOString(), completed_by: completedBy ?? null })
    .eq("client_id", clientId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function fetchOpenNextActions(limit = 100) {
  const { data, error } = await supabase
    .from("next_actions")
    .select("*")
    .is("completed_at", null)
    .order("due_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/* ────────────── Workflow Events ────────────── */

export async function pushWorkflowEvent(input: {
  customerId: string;
  canonicalId?: string;
  customerName?: string;
  actorId?: string;
  actorName?: string;
  action: string;
  module: string;
  beforeState?: unknown;
  afterState?: unknown;
  summary: string;
}): Promise<{ ok: boolean; error?: string }> {
  const clientId = `wf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const row = {
    client_id: clientId,
    customer_id: input.customerId,
    canonical_id: input.canonicalId ?? null,
    customer_name: input.customerName ?? null,
    actor_id: input.actorId ?? null,
    actor_name: input.actorName ?? null,
    action: input.action,
    module: input.module,
    before_state: input.beforeState ?? null,
    after_state: input.afterState ?? null,
    summary: input.summary,
  };
  const { error } = await supabase.from("workflow_events").insert(row);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function fetchWorkflowEvents(customerId?: string, limit = 100) {
  let query = supabase
    .from("workflow_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (customerId) query = query.eq("customer_id", customerId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/* ────────────── Closing Signals ────────────── */

export async function pushClosingSignal(input: {
  customerId: string;
  canonicalId?: string;
  customerName?: string;
  signalType: string;
  severity: string;
  detail?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const row = {
    customer_id: input.customerId,
    canonical_id: input.canonicalId ?? null,
    customer_name: input.customerName ?? null,
    signal_type: input.signalType,
    severity: input.severity,
    detail: input.detail ?? null,
    module: "closing",
  };
  const { error } = await supabase.from("closing_signals").insert(row);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function acknowledgeClosingSignal(id: string, by?: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from("closing_signals")
    .update({ acknowledged_at: new Date().toISOString(), acknowledged_by: by ?? null })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
