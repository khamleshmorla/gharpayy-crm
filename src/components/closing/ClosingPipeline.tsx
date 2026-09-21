// Closing Pipeline — actionable customer list for the post-tour closing workflow.
// Each customer shows: stage, owner, deadline, overdue state, next action, and
// one-click promise/payment recording. This replaces the "0/40 gap" with work.
import { useMemo, useState, useCallback } from "react";
import {
  AlertTriangle, CheckCircle2, Clock, ClipboardCopy, Phone,
  Target, Zap, DollarSign, Calendar, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMovement } from "@/movement/store";
import { useMovementSync } from "@/movement/bridge";
import { seedMovement } from "@/movement/seed";
import { NEXT_ACTION_LABEL, STAGE_LABEL, type FunnelStage, type MovementState } from "@/movement/types";
import { computeRiskSignals, suggestAfterStageChange, type RiskSignal } from "@/lib/smart-next-action";
import { pushNextAction, pushWorkflowEvent } from "@/lib/workflow-sync";
import { useAuditLog } from "@/lib/audit-log";
import { useEffect } from "react";

const CLOSING_STAGES: FunnelStage[] = ["tour-done", "quotation", "negotiation", "payment"];

const SEVERITY_STYLE: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-destructive/80 text-destructive-foreground",
  medium: "bg-warning/80 text-warning-foreground",
  low: "bg-muted text-muted-foreground",
};

const STAGE_STYLE: Record<string, string> = {
  "tour-done": "bg-blue-100 text-blue-800",
  quotation: "bg-amber-100 text-amber-800",
  negotiation: "bg-orange-100 text-orange-800",
  payment: "bg-green-100 text-green-800",
};

const rel = (iso?: string | null) => {
  if (!iso) return "—";
  const m = Math.round((Date.now() - +new Date(iso)) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.round(m / 60)}h`;
  return `${Math.round(m / 1440)}d`;
};

export function ClosingPipeline() {
  useEffect(() => { seedMovement(); }, []);
  const { list, nameOf, me } = useMovementSync();
  const mv = useMovement();
  const audit = useAuditLog();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<FunnelStage | "all">("all");
  const [query, setQuery] = useState("");
  const [closingNote, setClosingNote] = useState("");
  const [generatedMsg, setGeneratedMsg] = useState("");

  // Filter to closing-eligible customers
  const closingCustomers = useMemo(() => {
    return list.filter((c) => CLOSING_STAGES.includes(c.stage))
      .filter((c) => filter === "all" || c.stage === filter)
      .filter((c) => {
        if (!query) return true;
        const q = query.toLowerCase();
        const info = nameOf.get(c.ulid);
        return (c.name?.toLowerCase().includes(q) ?? false)
          || (info?.name?.toLowerCase().includes(q) ?? false)
          || (info?.phone?.includes(q) ?? false);
      })
      .sort((a, b) => {
        // Priority: payment > negotiation > quotation > tour-done
        const stageOrder: Record<string, number> = { payment: 0, negotiation: 1, quotation: 2, "tour-done": 3 };
        const sa = stageOrder[a.stage] ?? 4;
        const sb = stageOrder[b.stage] ?? 4;
        if (sa !== sb) return sa - sb;
        // Then by overdue status
        const aOverdue = a.nextAction && new Date(a.nextAction.dueAt).getTime() < Date.now();
        const bOverdue = b.nextAction && new Date(b.nextAction.dueAt).getTime() < Date.now();
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        return 0;
      });
  }, [list, filter, query, nameOf]);

  // Risk signals
  const signals = useMemo(() => computeRiskSignals(list), [list]);

  const selectedCustomer = selected ? list.find((c) => c.ulid === selected) : null;
  const selectedInfo = selected ? nameOf.get(selected) : undefined;

  const handleAction = useCallback((action: "send-quote" | "collect-payment" | "book" | "set-promise") => {
    if (!selected || !selectedCustomer) return;

    if (action === "send-quote") {
      mv.sendQuote(selected);
      const sug = suggestAfterStageChange(selectedCustomer, "quotation");
      setGeneratedMsg(sug.message);
    } else if (action === "collect-payment") {
      mv.collectPayment(selected);
      const sug = suggestAfterStageChange(selectedCustomer, "payment");
      setGeneratedMsg(sug.message);
    } else if (action === "book") {
      mv.book(selected);
      const sug = suggestAfterStageChange(selectedCustomer, "booked");
      setGeneratedMsg(sug.message);
    } else if (action === "set-promise") {
      const dueAt = new Date(Date.now() + 4 * 3600_000).toISOString();
      mv.setNextAction(selected, {
        kind: "collect-payment",
        dueAt,
        ownerId: me.id,
        ownerName: me.name,
        note: closingNote || "Closing promise set",
      });
      const clientId = `na-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      void pushNextAction({
        clientId,
        customerId: selected,
        canonicalId: selectedCustomer.canonicalId,
        customerName: selectedCustomer.name,
        ownerId: me.id,
        ownerName: me.name,
        kind: "collect-payment",
        dueAt,
        note: closingNote || "Closing promise set",
        source: "operator",
        module: "closing",
      });
    }

    // Audit
    audit.log({
      actorId: me.id,
      actorName: me.name,
      entityType: "lead",
      entityId: selected,
      action: `CLOSING_${action.toUpperCase().replace("-", "_")}`,
      after: { stage: selectedCustomer.stage },
      summary: `${me.name} executed ${action} for ${selectedCustomer.name ?? selected} on closing desk`,
    });

    void pushWorkflowEvent({
      customerId: selected,
      canonicalId: selectedCustomer.canonicalId,
      customerName: selectedCustomer.name,
      actorId: me.id,
      actorName: me.name,
      action: `CLOSING_${action.toUpperCase().replace("-", "_")}`,
      module: "closing",
      summary: `${me.name} executed ${action} for ${selectedCustomer.name ?? selected}`,
    });

    toast.success(`${action} executed for ${selectedCustomer.name ?? "customer"}`);
  }, [selected, selectedCustomer, mv, me, closingNote, audit]);

  const copyMessage = useCallback(async () => {
    if (!generatedMsg) return;
    await navigator.clipboard.writeText(generatedMsg);
    if (selected) mv.sendMessage(selected, generatedMsg);
    toast.success("Message copied — paste into WhatsApp");
  }, [generatedMsg, selected, mv]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of CLOSING_STAGES) {
      counts[s] = list.filter((c) => c.stage === s).length;
    }
    return counts;
  }, [list]);

  return (
    <div className="space-y-4">
      {/* Risk Signals Banner (New Product Idea #2) */}
      {signals.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive">
              {signals.length} customer{signals.length !== 1 ? "s" : ""} need immediate attention
            </span>
          </div>
          <div className="space-y-1 max-h-[120px] overflow-auto">
            {signals.slice(0, 8).map((s, i) => (
              <button
                key={`${s.customerId}-${s.signalType}-${i}`}
                onClick={() => setSelected(s.customerId)}
                className="w-full flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-destructive/10 transition text-left"
              >
                <Badge className={cn("text-[9px] shrink-0", SEVERITY_STYLE[s.severity])}>{s.severity}</Badge>
                <span className="font-medium truncate">{s.customerName}</span>
                <span className="text-muted-foreground truncate flex-1">{s.detail}</span>
                <span className="text-muted-foreground shrink-0">{s.ownerName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <button onClick={() => setFilter("all")}
          className={cn("rounded-lg border p-3 text-left transition hover:border-primary",
            filter === "all" ? "border-primary bg-primary/5" : "border-border")}>
          <div className="text-[10px] uppercase text-muted-foreground">Total closing</div>
          <div className="text-xl font-semibold">{closingCustomers.length}</div>
        </button>
        {CLOSING_STAGES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("rounded-lg border p-3 text-left transition hover:border-primary",
              filter === s ? "border-primary bg-primary/5" : "border-border")}>
            <div className="text-[10px] uppercase text-muted-foreground">{STAGE_LABEL[s]}</div>
            <div className="text-xl font-semibold">{stageCounts[s] ?? 0}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search customer name or phone…"
        className="h-9 text-sm"
      />

      {/* Customer List + Work Panel (split layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-3">
        {/* Customer List */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Closing pipeline — work top to bottom
            </span>
            <Badge variant="outline" className="text-[10px]">{closingCustomers.length}</Badge>
          </div>
          <div className="divide-y divide-border max-h-[55vh] overflow-auto">
            {closingCustomers.map((c) => {
              const info = nameOf.get(c.ulid);
              const isOverdue = c.nextAction && new Date(c.nextAction.dueAt).getTime() < Date.now();
              const hasSignal = signals.some((s) => s.customerId === c.ulid);
              return (
                <button key={c.ulid} onClick={() => setSelected(c.ulid)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 flex items-start gap-2 hover:bg-muted/50 transition",
                    selected === c.ulid && "bg-primary/5",
                    isOverdue && "border-l-2 border-l-destructive",
                  )}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm truncate">{info?.name ?? c.name ?? c.ulid}</span>
                      <Badge className={cn("text-[9px]", STAGE_STYLE[c.stage] ?? "bg-muted")}>{STAGE_LABEL[c.stage]}</Badge>
                      {isOverdue && (
                        <span className="text-[9px] text-destructive font-semibold flex items-center gap-0.5">
                          <AlertTriangle className="h-2.5 w-2.5" />OVERDUE
                        </span>
                      )}
                      {hasSignal && !isOverdue && (
                        <Zap className="h-3 w-3 text-warning" />
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                      <User className="h-2.5 w-2.5 inline mr-0.5" />{c.primaryOwnerName}
                      {c.nextAction && (
                        <span className={cn("ml-2", isOverdue && "text-destructive font-medium")}>
                          <Clock className="h-2.5 w-2.5 inline mr-0.5" />{NEXT_ACTION_LABEL[c.nextAction.kind]} · {new Date(c.nextAction.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            {closingCustomers.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No customers in the closing pipeline yet. Tour-done, quotation, negotiation, and payment stages will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Work Panel */}
        {selectedCustomer ? (
          <div className={cn("rounded-lg border bg-card p-4 space-y-4",
            selectedCustomer.nextAction && new Date(selectedCustomer.nextAction.dueAt).getTime() < Date.now()
              ? "border-destructive/50" : "border-border"
          )}>
            {/* Header */}
            <div>
              <div className="text-lg font-semibold">{selectedInfo?.name ?? selectedCustomer.name ?? selected}</div>
              <div className="text-xs text-muted-foreground">
                {selectedInfo?.phone} · {selectedInfo?.area} · Owner: <strong>{selectedCustomer.primaryOwnerName}</strong>
              </div>
              {selectedCustomer.nextAction && new Date(selectedCustomer.nextAction.dueAt).getTime() < Date.now() && (
                <div className="text-xs text-destructive font-semibold flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  OVERDUE: {NEXT_ACTION_LABEL[selectedCustomer.nextAction.kind]} was due {rel(selectedCustomer.nextAction.dueAt)} ago
                </div>
              )}
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div className="rounded border border-border px-2 py-1.5">
                <div className="text-[10px] uppercase text-muted-foreground">Stage</div>
                <div className="text-xs font-medium">
                  <Badge className={cn("text-[10px]", STAGE_STYLE[selectedCustomer.stage] ?? "bg-muted")}>
                    {STAGE_LABEL[selectedCustomer.stage]}
                  </Badge>
                </div>
              </div>
              <div className="rounded border border-border px-2 py-1.5">
                <div className="text-[10px] uppercase text-muted-foreground">Owner</div>
                <div className="text-xs font-medium">{selectedCustomer.primaryOwnerName}</div>
              </div>
              <div className="rounded border border-border px-2 py-1.5">
                <div className="text-[10px] uppercase text-muted-foreground">Next Action</div>
                <div className={cn("text-xs font-medium",
                  selectedCustomer.nextAction && new Date(selectedCustomer.nextAction.dueAt).getTime() < Date.now() && "text-destructive"
                )}>
                  {selectedCustomer.nextAction
                    ? `${NEXT_ACTION_LABEL[selectedCustomer.nextAction.kind]} · ${new Date(selectedCustomer.nextAction.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : "—"}
                </div>
              </div>
              <div className="rounded border border-border px-2 py-1.5">
                <div className="text-[10px] uppercase text-muted-foreground">Deadline</div>
                <div className={cn("text-xs font-medium",
                  selectedCustomer.nextAction && new Date(selectedCustomer.nextAction.dueAt).getTime() < Date.now() && "text-destructive font-semibold"
                )}>
                  {selectedCustomer.nextAction
                    ? new Date(selectedCustomer.nextAction.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "No deadline set"}
                  {selectedCustomer.nextAction && new Date(selectedCustomer.nextAction.dueAt).getTime() < Date.now() && " ⚠️"}
                </div>
              </div>
            </div>

            {/* Closing Actions */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Closing actions</div>
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleAction("send-quote")}>
                  <DollarSign className="h-3 w-3 mr-1" />Send Quote
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleAction("collect-payment")}>
                  <DollarSign className="h-3 w-3 mr-1" />Collect Payment
                </Button>
                <Button size="sm" className="h-7 text-[11px]" onClick={() => handleAction("book")}>
                  <CheckCircle2 className="h-3 w-3 mr-1" />Book Now
                </Button>
                <Button size="sm" variant="destructive" className="h-7 text-[11px]"
                  onClick={() => { if (selected) { mv.exit(selected, "budget", closingNote); toast.success("Exited"); } }}>
                  Exit
                </Button>
              </div>
            </div>

            {/* Promise Setting */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Set closing promise</div>
              <Input value={closingNote} onChange={(e) => setClosingNote(e.target.value)}
                placeholder="Promise note (e.g. 'Payment by 6PM today')…" className="h-8 text-xs"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAction("set-promise"); } }}
              />
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleAction("set-promise")}>
                  <Target className="h-3 w-3 mr-1" />Set Promise (4h)
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => {
                  if (!selected || !selectedCustomer) return;
                  mv.setNextAction(selected, {
                    kind: "call", dueAt: new Date(Date.now() + 30 * 60_000).toISOString(),
                    ownerId: me.id, ownerName: me.name, note: closingNote || "Follow-up call",
                  });
                  toast.success("Call scheduled in 30m");
                }}>
                  <Phone className="h-3 w-3 mr-1" />Call in 30m
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => {
                  if (!selected || !selectedCustomer) return;
                  mv.setNextAction(selected, {
                    kind: "collect-payment", dueAt: new Date(Date.now() + 24 * 3600_000).toISOString(),
                    ownerId: me.id, ownerName: me.name, note: closingNote || "Re-promise tomorrow",
                  });
                  toast.success("Re-promised for tomorrow");
                }}>
                  <Calendar className="h-3 w-3 mr-1" />Re-promise Tomorrow
                </Button>
              </div>
            </div>

            {/* Generated Message */}
            {generatedMsg && (
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">WhatsApp message (edit & copy)</div>
                <Textarea
                  value={generatedMsg}
                  onChange={(e) => setGeneratedMsg(e.target.value)}
                  className="text-xs min-h-[60px] resize-none"
                />
                <Button size="sm" variant="outline" onClick={copyMessage}>
                  <ClipboardCopy className="h-3.5 w-3.5 mr-1" /> Copy Message
                </Button>
              </div>
            )}

            {/* Relevant Signals for this customer */}
            {signals.filter((s) => s.customerId === selected).length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk signals</div>
                {signals.filter((s) => s.customerId === selected).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs py-1">
                    <Badge className={cn("text-[9px]", SEVERITY_STYLE[s.severity])}>{s.severity}</Badge>
                    <span>{s.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Select a customer from the closing pipeline to work on their closing journey.
          </div>
        )}
      </div>
    </div>
  );
}
