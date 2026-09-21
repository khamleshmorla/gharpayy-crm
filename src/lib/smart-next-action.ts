// Smart Next Action Engine — deterministic rules engine that suggests the
// next action + deadline + WhatsApp message after any meaningful event.
// No AI needed: reliable rules based on customer stage, call outcome, and time.
import type { MovementState, NextActionKind, CallResult, FunnelStage } from "@/movement/types";

export interface SmartSuggestion {
  kind: NextActionKind;
  dueInMins: number;
  label: string;
  message: string;     // auto-generated WhatsApp message for the customer
  reason: string;      // why this was suggested (for audit)
}

/** The customer's first name for message personalization. */
function firstName(name?: string): string {
  return name?.split(/\s+/)[0] ?? "there";
}

function dueAt(mins: number): string {
  return new Date(Date.now() + mins * 60_000).toISOString();
}

/* ────────────── AFTER CALL ────────────── */

export function suggestAfterCall(
  customer: MovementState,
  callResult: CallResult,
  noAnswerStreak: number,
): SmartSuggestion {
  const name = firstName(customer.name);
  const stage = customer.stage;

  // ─── No answer paths ───
  if (callResult === "no-answer" || callResult === "busy") {
    if (noAnswerStreak >= 3) {
      return {
        kind: "whatsapp",
        dueInMins: 30,
        label: `WhatsApp ${name} — 3+ missed calls`,
        message: `Hi ${name}, I tried calling you a few times regarding your room search. Whenever you're free, please give me a call back or reply here — I have some great options for you! 🏠`,
        reason: `No answer streak ${noAnswerStreak} — switching to WhatsApp`,
      };
    }
    return {
      kind: "call",
      dueInMins: noAnswerStreak >= 2 ? 240 : 120,
      label: `Retry call — attempt ${noAnswerStreak + 1}`,
      message: `Hi ${name}, I tried reaching you just now. Will try again in a bit — we have some perfect rooms matching your needs! 🏡`,
      reason: `No answer attempt ${noAnswerStreak} — retry scheduled`,
    };
  }

  if (callResult === "wrong-number" || callResult === "rejected") {
    return {
      kind: "whatsapp",
      dueInMins: 1440,
      label: "Send WhatsApp intro",
      message: `Hi ${name}, this is Gharpayy. We help people find the best PG rooms in Bangalore. Let me know if you're looking for a room — I can share some options! 🏠`,
      reason: `${callResult} — WhatsApp fallback`,
    };
  }

  // ─── Connected call paths (by stage) ───
  if (stage === "new" || stage === "qualified") {
    return {
      kind: "send-property",
      dueInMins: 60,
      label: "Send property options",
      message: `Hi ${name}! Great talking to you. As discussed, I'm sharing some room options that match your requirements. Please check and let me know which ones interest you! 📸`,
      reason: "Qualification done — send property options",
    };
  }

  if (stage === "matched") {
    return {
      kind: "confirm-tour",
      dueInMins: 120,
      label: "Schedule or confirm tour",
      message: `Hi ${name}, I've shortlisted the best options for you. Would you like to visit and see the rooms? I can schedule a tour at your convenience! 🗓️`,
      reason: "Properties shared — push for tour",
    };
  }

  if (stage === "tour-scheduled") {
    return {
      kind: "confirm-tour",
      dueInMins: customer.tourAt
        ? Math.max(30, Math.round((new Date(customer.tourAt).getTime() - Date.now()) / 60_000 - 120))
        : 120,
      label: "Confirm tour attendance",
      message: `Hi ${name}, just confirming your visit${customer.tourProperty ? ` to ${customer.tourProperty}` : ""}. Looking forward to showing you around! See you there 🙂`,
      reason: "Tour scheduled — confirm attendance",
    };
  }

  if (stage === "tour-done") {
    return {
      kind: "post-tour-call",
      dueInMins: 60,
      label: "Post-tour follow-up",
      message: `Hi ${name}! Thank you for visiting today. How did you find the place? I'd love to hear your thoughts and help you with the next steps. 🏠`,
      reason: "Tour completed — capture decision",
    };
  }

  if (stage === "quotation" || stage === "negotiation") {
    return {
      kind: "collect-payment",
      dueInMins: 120,
      label: "Follow up on decision",
      message: `Hi ${name}, just checking in on the room. The availability might change soon — would you like to go ahead and secure it? Happy to help with any questions! 🔑`,
      reason: "In negotiation — push for closure",
    };
  }

  if (stage === "payment") {
    return {
      kind: "collect-payment",
      dueInMins: 30,
      label: "Collect payment",
      message: `Hi ${name}, your room is ready! Once we receive the payment, we'll get everything set up for your move-in. Shall I share the payment details? 💰`,
      reason: "Payment stage — collect now",
    };
  }

  // Default
  return {
    kind: "call",
    dueInMins: 240,
    label: "Follow-up call",
    message: `Hi ${name}, just checking in. Let me know if you have any questions about the rooms — I'm here to help! 🏠`,
    reason: "General follow-up",
  };
}

/* ────────────── AFTER STAGE CHANGE ────────────── */

export function suggestAfterStageChange(
  customer: MovementState,
  newStage: FunnelStage,
): SmartSuggestion {
  const name = firstName(customer.name);

  switch (newStage) {
    case "qualified":
      return {
        kind: "send-property",
        dueInMins: 30,
        label: "Share property options",
        message: `Hi ${name}! Based on what we discussed, I have some great options for you. Sharing them now — please have a look! 📸`,
        reason: "Just qualified — share options immediately",
      };
    case "matched":
      return {
        kind: "confirm-tour",
        dueInMins: 120,
        label: "Propose tour",
        message: `Hi ${name}, I've found rooms that match your requirements. Would you like to come visit? I can set up a tour at your convenience! 🗓️`,
        reason: "Matched to property — schedule tour",
      };
    case "tour-done":
      return {
        kind: "post-tour-call",
        dueInMins: 60,
        label: "Post-tour call",
        message: `Hi ${name}! Hope you liked what you saw today. I'd love to discuss the next steps with you — shall I call you? 🏠`,
        reason: "Tour completed — get feedback",
      };
    case "quotation":
      return {
        kind: "collect-payment",
        dueInMins: 180,
        label: "Follow up on quote",
        message: `Hi ${name}, here's the pricing as discussed. Let me know if you have any questions — I can help clarify! 💰`,
        reason: "Quote sent — follow up on decision",
      };
    case "payment":
      return {
        kind: "collect-payment",
        dueInMins: 30,
        label: "Collect payment NOW",
        message: `Hi ${name}, your room is being held for you! To confirm the booking, please complete the payment at your earliest. Happy to help! 🔑`,
        reason: "Payment intent — collect immediately",
      };
    case "booked":
      return {
        kind: "whatsapp",
        dueInMins: 1440,
        label: "Share check-in details",
        message: `Hi ${name}! 🎉 Congratulations on booking your room! I'll be sharing the check-in details and documents needed shortly. Welcome to Gharpayy! 🏠`,
        reason: "Booked — send check-in info",
      };
    default:
      return {
        kind: "call",
        dueInMins: 240,
        label: "Follow-up call",
        message: `Hi ${name}, just following up. How can I help with your room search? 🏠`,
        reason: "Default follow-up",
      };
  }
}

/* ────────────── CLOSING RISK SIGNALS ────────────── */

export type RiskSignalType =
  | "overdue-deadline"
  | "no-next-action"
  | "payment-pending"
  | "decision-pending"
  | "missed-commitment";

export interface RiskSignal {
  customerId: string;
  canonicalId: string;
  customerName: string;
  signalType: RiskSignalType;
  severity: "low" | "medium" | "high" | "critical";
  detail: string;
  stage: FunnelStage;
  ownerName: string;
}

/** Scan all customers and return those needing immediate attention. */
export function computeRiskSignals(customers: MovementState[]): RiskSignal[] {
  const signals: RiskSignal[] = [];
  const now = Date.now();

  for (const c of customers) {
    // Skip non-active stages
    if (c.stage === "booked" || c.stage === "check-in" || c.stage === "lost" || c.stage === "new") continue;

    // 1. Overdue deadline
    if (c.nextAction && new Date(c.nextAction.dueAt).getTime() < now) {
      const overdueMins = Math.round((now - new Date(c.nextAction.dueAt).getTime()) / 60_000);
      signals.push({
        customerId: c.ulid,
        canonicalId: c.canonicalId,
        customerName: c.name ?? c.ulid,
        signalType: "overdue-deadline",
        severity: overdueMins > 480 ? "critical" : overdueMins > 120 ? "high" : "medium",
        detail: `${c.nextAction.kind} overdue by ${overdueMins < 60 ? `${overdueMins}m` : `${Math.round(overdueMins / 60)}h`}`,
        stage: c.stage,
        ownerName: c.primaryOwnerName,
      });
    }

    // 2. No next action at all (for active leads past qualification)
    if (!c.nextAction && ["qualified", "matched", "tour-scheduled", "tour-done", "quotation", "negotiation", "payment"].includes(c.stage)) {
      signals.push({
        customerId: c.ulid,
        canonicalId: c.canonicalId,
        customerName: c.name ?? c.ulid,
        signalType: "no-next-action",
        severity: c.stage === "payment" ? "critical" : c.stage === "negotiation" || c.stage === "quotation" ? "high" : "medium",
        detail: `No next action set — customer is in ${c.stage}`,
        stage: c.stage,
        ownerName: c.primaryOwnerName,
      });
    }

    // 3. Payment pending (in payment stage, no action for 2+ hours)
    if (c.stage === "payment" && c.lastOutboundAt) {
      const sinceLastAction = (now - new Date(c.lastOutboundAt).getTime()) / 60_000;
      if (sinceLastAction > 120) {
        signals.push({
          customerId: c.ulid,
          canonicalId: c.canonicalId,
          customerName: c.name ?? c.ulid,
          signalType: "payment-pending",
          severity: sinceLastAction > 480 ? "critical" : "high",
          detail: `Payment pending — no operator action for ${Math.round(sinceLastAction / 60)}h`,
          stage: c.stage,
          ownerName: c.primaryOwnerName,
        });
      }
    }

    // 4. Decision pending (tour-done, no movement for 4+ hours)
    if (c.stage === "tour-done" && c.tourDoneAt) {
      const sinceTour = (now - new Date(c.tourDoneAt).getTime()) / 60_000;
      if (sinceTour > 240) {
        signals.push({
          customerId: c.ulid,
          canonicalId: c.canonicalId,
          customerName: c.name ?? c.ulid,
          signalType: "decision-pending",
          severity: sinceTour > 1440 ? "critical" : sinceTour > 480 ? "high" : "medium",
          detail: `Tour done ${Math.round(sinceTour / 60)}h ago — no decision captured`,
          stage: c.stage,
          ownerName: c.primaryOwnerName,
        });
      }
    }
  }

  // Sort: critical first, then high, then by type
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  signals.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return signals;
}
