import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Zap,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
  Sparkles,
  Users,
  Activity,
  Calendar,
  IndianRupee,
  Clock,
  ChevronRight,
  Split,
  MessageSquare,
  AlertTriangle,
  Sliders,
  ExternalLink,
  Target,
  BarChart3,
  Bot,
  Database,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gharpayy — High-Velocity Rental CRM & Living OS" },
      {
        name: "description",
        content:
          "Official platform for Gharpayy. Unified operating system for tenant acquisition, AI-assisted calling, tour scheduling, split-screen workflows, and automated deal closing.",
      },
      { property: "og:title", content: "Gharpayy — High-Velocity Rental CRM & Living OS" },
      {
        property: "og:description",
        content:
          "Unified rental CRM and command center powering high-conversion tenant journeys, instant deal closing, and zero-leakage operations.",
      },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const [activeTab, setActiveTab] = useState<"all" | "closing" | "calling" | "operations">("all");
  const [simulatedStage, setSimulatedStage] = useState("tour_completed");

  const coreModules = [
    {
      id: "closing",
      title: "Closing Desk",
      tagline: "Tour-to-Deposit Pipeline & Deal Velocity",
      href: "/closing",
      category: "closing",
      icon: Target,
      badge: "High Impact · 2 Clicks",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      description:
        "Dedicated post-tour command desk. Tracks promised move-in dates, flags cold risk signals with auto-retargeting, and locks token deposits in just 2 clicks.",
      metrics: [
        { label: "Click Reduction", value: "66%" },
        { label: "Pipeline Stage", value: "Post-Tour → Booked" },
        { label: "Action", value: "Auto-Draft Offer" },
      ],
      features: [
        "Risk Signal Detection & Stalled Deal Alerts",
        "1-Click Pre-filled WhatsApp Token Offers",
        "Unified Canonical Customer History",
        "Instant Supabase Workflow Persistence",
      ],
    },
    {
      id: "movement",
      title: "Movement OS",
      tagline: "End-to-End Customer Journey Command",
      href: "/movement",
      category: "operations",
      icon: Layers,
      badge: "Flagship OS · 67% Click Reduction",
      badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
      description:
        "The central nervous system for tenant journeys. Complete lifecycle view from new inquiry to active resident with Smart Next Action engine and zero-scroll sidebar.",
      metrics: [
        { label: "Click Reduction", value: "67% (9 → 3)" },
        { label: "Next Action", value: "AI Engine" },
        { label: "View Modes", value: "Kanban & Pipeline" },
      ],
      features: [
        "Embedded Smart Next Action Engine",
        "1-Click 'Record & Send' WhatsApp Updates",
        "Customer Timeline & Persistent Audit Log",
        "Live SLA Overdue & Urgency Indicators",
      ],
    },
    {
      id: "leads",
      title: "M-POWER CALL",
      tagline: "AI Call Briefing & Live Conversation Engine",
      href: "/leads",
      category: "calling",
      icon: PhoneCall,
      badge: "Speed-to-Call · 62% Click Reduction",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      description:
        "Single-screen call console. Pre-call briefing reveals lead intent and historical context, while quick-outcome chips automatically trigger follow-ups.",
      metrics: [
        { label: "Click Reduction", value: "62% (13 → 5)" },
        { label: "Call Screen", value: "Zero-Scroll View" },
        { label: "Outcome Speed", value: "1-Tap Logging" },
      ],
      features: [
        "Pre-Call Intent & Budget Intelligence",
        "Instant Objection Handling Script Playbooks",
        "1-Click Outcome Buttons with Auto-Followups",
        "Direct Call Duration & Audit Trail Sync",
      ],
    },
    {
      id: "booking-flow-split",
      title: "Booking Flow Split",
      tagline: "Dual-Screen WhatsApp + CRM Workspace",
      href: "/booking-flow-split",
      category: "operations",
      icon: Split,
      badge: "High Operator Velocity",
      badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
      description:
        "Split workspace designed for fast operations. Live WhatsApp chat on the left paired with full CRM customer details, property cards, and closing agreements on the right.",
      metrics: [
        { label: "Interface", value: "Dual Screen" },
        { label: "Context Switching", value: "Zero" },
        { label: "Closing Agreement", value: "Instant PDF / WA" },
      ],
      features: [
        "Side-by-side WhatsApp conversation feed",
        "Instant property availability & price cards",
        "Real-time customer status & booking generator",
        "No browser tab juggling required",
      ],
    },
    {
      id: "admin",
      title: "Admin Command Center",
      tagline: "Founder & Leadership War Room",
      href: "/admin",
      category: "operations",
      icon: ShieldCheck,
      badge: "Executive Cockpit",
      badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
      description:
        "Comprehensive operational surveillance. Identifies revenue leakage, monitors team SLAs, audits unhandled leads, and displays live property occupancy across all zones.",
      metrics: [
        { label: "Leak Detection", value: "Automated" },
        { label: "Team SLA", value: "Real-Time Tracking" },
        { label: "Audit Logs", value: "Full Postgres Trail" },
      ],
      features: [
        "Live pipeline revenue tracking",
        "Agent response time & conversion scorecards",
        "Stalled lead alerts & escalation triggers",
        "Full audit log inspection by customer",
      ],
    },
    {
      id: "supply-hub",
      title: "Supply Hub & Property 360",
      tagline: "Live Inventory & Bed Matchmaking",
      href: "/supply-hub",
      category: "all",
      icon: Building2,
      badge: "Live Inventory",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      description:
        "Complete catalog of properties, rooms, and available beds. Instant matching against incoming tenant requirements, pricing tiers, and move-in schedules.",
      metrics: [
        { label: "Search Engine", value: "Area & Budget" },
        { label: "Inventory", value: "Real-Time Beds" },
        { label: "Sharing Types", value: "Single, Double, Triple" },
      ],
      features: [
        "Dynamic bed inventory with occupancy status",
        "Proximity search to IT hubs & universities",
        "Amenity badges & high-res room showcases",
        "Direct link into tour booking schedule",
      ],
    },
  ];

  const filteredModules =
    activeTab === "all"
      ? coreModules
      : coreModules.filter((m) => m.category === activeTab || m.id === activeTab);

  return (
    <div className="min-h-screen bg-[#090b10] text-[#f1f5f9] selection:bg-orange-500 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-orange-500/15 via-orange-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090b10]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <span className="font-display font-black text-white text-xl">G</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-lg tracking-tight text-white">Gharpayy</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Living OS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">Rental CRM & Velocity Engine</p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1 border-l border-white/10 pl-6">
                <Link
                  to="/closing"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Closing Desk
                </Link>
                <Link
                  to="/movement"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Movement OS
                </Link>
                <Link
                  to="/leads"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  M-POWER CALL
                </Link>
                <Link
                  to="/booking-flow-split"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Split Screen
                </Link>
                <Link
                  to="/admin"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Command Center
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live DB Connected
              </div>
              <Link
                to="/closing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1">
          <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Next-Generation High-Velocity Rental CRM</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.15]">
                Accelerate Rental Closings. <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  Zero Leakage. Single-Screen Velocity.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                The all-in-one operating system for modern co-living and accommodation managers.
                Triage incoming leads, execute guided calls, schedule tours, and close deposits in
                under 3 clicks.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/closing"
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-xl shadow-orange-500/25 flex items-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer transition-all duration-200"
                >
                  <Target className="w-4 h-4" />
                  <span>Open Closing Desk</span>
                </Link>
                <Link
                  to="/movement"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 hover:border-orange-500/40 flex items-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer transition-all duration-200"
                >
                  <Layers className="w-4 h-4" />
                  <span>Explore Movement OS</span>
                </Link>
                <Link
                  to="/leads"
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm border border-white/10 hover:border-orange-500/40 flex items-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer transition-all duration-200"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>M-POWER CALL</span>
                </Link>
              </div>
            </div>

            {/* Live Operational Metrics Banner */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Click Efficiency</span>
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-white">67% Less</span>
                  <span className="text-xs text-emerald-400">9 → 3 Clicks</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Pre-filled smart workflows</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Closing Velocity</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-white">&lt; 2 Clicks</span>
                  <span className="text-xs text-emerald-400">Instant Offer</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Direct token collection flow</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Risk Signal Radar</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-white">Automated</span>
                  <span className="text-xs text-amber-400">High / Med / Low</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Flags stalled tour dropoffs</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Backend Persistence</span>
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display text-white">Supabase</span>
                  <span className="text-xs text-blue-400">Real-Time Sync</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Canonical tenant identity</p>
              </div>
            </div>
          </section>

          {/* Module Grid Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Core Operational Modules
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Purpose-built single-screen interfaces tailored to each stage of the tenant lifecycle.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 active:scale-95 ${
                    activeTab === "all" ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  All Modules
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("closing")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 active:scale-95 ${
                    activeTab === "closing" ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Closing
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("calling")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 active:scale-95 ${
                    activeTab === "calling" ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Call Ladder
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("operations")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 active:scale-95 ${
                    activeTab === "operations" ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Operations
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <div
                    key={module.id}
                    className="group rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-orange-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                          <IconComponent className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${module.badgeColor}`}>
                          {module.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-white group-hover:text-orange-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs text-orange-400/90 font-medium mt-0.5">{module.tagline}</p>

                      <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                        {module.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mt-4 py-3 px-3 rounded-xl bg-black/30 border border-white/5">
                        {module.metrics.map((metric, i) => (
                          <div key={i} className="text-center">
                            <div className="text-[10px] text-slate-500 font-medium">{metric.label}</div>
                            <div className="text-xs font-semibold text-white mt-0.5 truncate">{metric.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-1.5">
                        {module.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5">
                      <Link
                        to={module.href}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-orange-500 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-sm hover:shadow-orange-500/20"
                      >
                        <span>Launch {module.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Interactive Smart Next Action & Risk Intelligence Preview */}
          <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-4">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Engine Intelligence</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
                    Smart Next Action Engine & Risk Radar
                  </h2>

                  <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                    Eliminate hesitation and agent decision fatigue. Our recommendation engine analyzes
                    lead lifecycle position, tour attendance, budget, and time elapsed to propose the
                    exact best next action with pre-written WhatsApp templates.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Dynamic Urgency Scoring</h4>
                        <p className="text-[11px] text-slate-400">
                          Prioritizes hot tour-completed leads before interest cools off.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Pre-written WhatsApp Action Cards</h4>
                        <p className="text-[11px] text-slate-400">
                          One click copies or sends the exact personalized follow-up with room & rent details.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Closing Dropoff Signals</h4>
                        <p className="text-[11px] text-slate-400">
                          Flags deals stalled past 24 hours with custom counter-offer strategies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Simulator Card */}
                <div className="lg:col-span-6">
                  <div className="rounded-2xl bg-[#0e121b] border border-white/10 p-5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
                        <span className="text-xs font-semibold text-white">Next Action Simulator</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Select Lead Status:</span>
                    </div>

                      {/* Stage Selector */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { id: "new_lead", label: "New Inquiry" },
                          { id: "tour_scheduled", label: "Tour Booked" },
                          { id: "tour_completed", label: "Tour Finished" },
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSimulatedStage(st.id)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border cursor-pointer active:scale-95 transition-all duration-150 ${
                              simulatedStage === st.id
                                ? "bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/25 font-semibold"
                                : "bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>

                      {/* Dynamic Simulated Output */}
                      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                        {simulatedStage === "new_lead" && (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-orange-400">Recommended Action: Call Qualification</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Urgency: High</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-2 font-medium">
                              &quot;Lead came in 12m ago looking for 2-sharing in Koramangala. Trigger M-POWER CALL briefing.&quot;
                            </p>
                            <div className="mt-3 p-2.5 rounded-lg bg-black/40 text-[11px] text-slate-400 font-mono">
                              WhatsApp: &quot;Hi Rohan, noticed your interest in Gharpayy Koramangala! Have 2 rooms available for immediate check-in...&quot;
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Link
                                to="/leads"
                                className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold cursor-pointer shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-95 transition-all"
                              >
                                Launch Call Console →
                              </Link>
                            </div>
                          </div>
                        )}

                        {simulatedStage === "tour_scheduled" && (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-400">Recommended Action: Tour Confirmation Lock</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Urgency: Medium</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-2 font-medium">
                              &quot;Tour set for today 5:30 PM at HSR Layout. Send Google Maps location & manager contact.&quot;
                            </p>
                            <div className="mt-3 p-2.5 rounded-lg bg-black/40 text-[11px] text-slate-400 font-mono">
                              WhatsApp: &quot;Hi Rohan, confirming your visit today at 5:30 PM. Location: maps.google.com/... Property manager Suresh is expecting you!&quot;
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Link
                                to="/movement"
                                className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold cursor-pointer shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-95 transition-all"
                              >
                                Open Movement OS →
                              </Link>
                            </div>
                          </div>
                        )}

                        {simulatedStage === "tour_completed" && (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-400">Recommended Action: Send 1-Click Closing Offer</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400">Closing Window: Active</span>
                            </div>
                            <p className="text-xs text-slate-300 mt-2 font-medium">
                              &quot;Tour finished 2h ago. Liked Room 204. Send pre-filled ₹2,000 token payment link to lock bed before weekend surge.&quot;
                            </p>
                            <div className="mt-3 p-2.5 rounded-lg bg-black/40 text-[11px] text-slate-400 font-mono">
                              WhatsApp: &quot;Hi Rohan, great meeting you at Gharpayy HSR! Holding Bed 204-B until 9 PM tonight. Pay ₹2,000 token here: pay.gharpayy.com/...&quot;
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Link
                                to="/closing"
                                className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 active:scale-95 transition-all"
                              >
                                Open Closing Desk →
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          {/* Quick Route Directory */}
          <section className="py-12 border-t border-white/10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-6">
              Complete Platform Route Index
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: "Closing Desk", path: "/closing", icon: Target },
                { name: "Movement OS", path: "/movement", icon: Layers },
                { name: "M-POWER CALL", path: "/leads", icon: PhoneCall },
                { name: "Split Screen", path: "/booking-flow-split", icon: Split },
                { name: "Command Center", path: "/admin", icon: ShieldCheck },
                { name: "Supply Hub", path: "/supply-hub", icon: Building2 },
              ].map((route) => {
                const RouteIcon = route.icon;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-orange-500/40 flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer hover:-translate-y-0.5 active:scale-95 transition-all group"
                  >
                    <RouteIcon className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="font-medium truncate">{route.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#07090d] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-xs">
                G
              </div>
              <span className="text-xs font-semibold text-white">Gharpayy Living OS</span>
              <span className="text-slate-500 text-xs">· Production Release</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link to="/closing" className="hover:text-white transition-colors">Closing</Link>
              <Link to="/movement" className="hover:text-white transition-colors">Movement OS</Link>
              <Link to="/leads" className="hover:text-white transition-colors">Call Ladder</Link>
              <Link to="/admin" className="hover:text-white transition-colors">Admin Control</Link>
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                All Systems Operational
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
