"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  GitBranch,
  Layers,
  Zap,
  Shield,
  Terminal,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// ============================================================================
// DATA
// ============================================================================

const keyMetrics = [
  {
    label: "Table Score",
    before: "0.49",
    after: "0.93",
    change: "+90%",
    badge: "#1",
    icon: Target,
  },
  {
    label: "Reading Order",
    before: "0.91",
    after: "0.93",
    change: "+2%",
    badge: "#1",
    icon: TrendingUp,
  },
  {
    label: "Speed",
    value: "0.45s",
    subtitle: "/page",
    badge: "38% faster",
    icon: Clock,
  },
];

const signalPriority = [
  { priority: 1, signal: "hasTableBorder", confidence: 1.0, description: "TableBorder detection" },
  { priority: 2, signal: "hasVectorTableSignal", confidence: 0.95, description: "Grid/Border lines" },
  { priority: 3, signal: "hasTextTablePattern", confidence: 0.9, description: "Text pattern analysis" },
  { priority: 4, signal: "hasLargeImage", confidence: 0.85, description: "11%+ area, 1.75+ ratio" },
];

const triageResults = [
  { metric: "Precision", initial: "27.15%", final: "43.30%", change: "+16.15%" },
  { metric: "Recall", initial: "97.62%", final: "100%", change: "+2.38%", highlight: true },
  { metric: "F1 Score", initial: "42.49%", final: "60.43%", change: "+17.94%" },
  { metric: "False Positives", initial: "110", final: "55", change: "-55" },
  { metric: "False Negatives", initial: "1", final: "0", change: "-1", highlight: true },
];

const speedComparison = [
  { approach: "docling-serve", description: "baseline", avgTime: "2.283s", speedup: "—", isBaseline: true },
  { approach: "FastAPI + SDK", description: "singleton", avgTime: "0.685s", speedup: "3.3×", selected: true },
  { approach: "Subprocess", description: "persistent", avgTime: "0.661s", speedup: "3.5×" },
];

const backends = [
  { name: "off", status: "default", description: "Java-only, no external deps", icon: CheckCircle, color: "emerald" },
  { name: "docling-fast", status: "implemented", description: "FastAPI server (3.3× faster)", icon: Zap, color: "cyan" },
  { name: "docling-vlm", status: "planned", description: "VLM-based document understanding", icon: Clock, color: "violet" },
  { name: "hancom", status: "in progress", description: "Hancom Document AI", icon: Clock, color: "amber" },
];

const cliExamples = [
  { cmd: "opendataloader-pdf input.pdf", desc: "Default: Java-only" },
  { cmd: "opendataloader-pdf --hybrid docling-fast input.pdf", desc: "Fast server (recommended)" },
  { cmd: "opendataloader-pdf --hybrid docling-fast --hybrid-url http://localhost:5002 input.pdf", desc: "Custom URL" },
];

const risks = [
  { risk: "Backend unavailable", mitigation: "--hybrid-fallback (default: true)" },
  { risk: "Triage FN", mitigation: "Conservative threshold, 100% recall" },
  { risk: "Schema mismatch", mitigation: "Step-by-step validation" },
  { risk: "Slow processing", mitigation: "3.3× speedup achieved" },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl ${
        hover ? "transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 ring-1 ring-white/10">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-300">{subtitle}</p>}
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Node dimensions
  const nodeW = 100;
  const nodeH = 44;

  // Node positions (center points) - 3-way split layout
  const nodes = [
    { id: "input", label: "PDF Input", x: 80, y: 190, type: "input" },
    { id: "filter", label: "ContentFilter", x: 220, y: 190, type: "process" },
    { id: "triage", label: "Triage", x: 360, y: 190, type: "decision", isNew: true },
    { id: "heuristic", label: "Heuristic", x: 550, y: 90, type: "heuristic", subtitle: "Java" },
    { id: "docai", label: "DocAI", x: 550, y: 190, type: "docai", isNew: true, subtitle: "docling · hancom" },
    { id: "vlm", label: "VLM", x: 550, y: 290, type: "vlm", isPlanned: true, subtitle: "smoldocling" },
    { id: "merger", label: "Merger", x: 740, y: 190, type: "process", isNew: true },
    { id: "output", label: "Output", x: 880, y: 190, type: "output" },
  ];

  const getNodeStyle = (type: string) => {
    switch (type) {
      case "input":
      case "output":
        return "fill-blue-500/30 stroke-blue-400/50";
      case "decision":
        return "fill-amber-500/30 stroke-amber-400/50";
      case "heuristic":
        return "fill-violet-500/30 stroke-violet-400/50";
      case "docai":
        return "fill-cyan-500/30 stroke-cyan-400/50";
      case "vlm":
        return "fill-rose-500/30 stroke-rose-400/50";
      default:
        return "fill-emerald-500/30 stroke-emerald-400/50";
    }
  };

  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 950 360" className="w-full min-w-[750px]" style={{ height: "340px" }}>
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concurrent processing box */}
        <rect
          x="485"
          y="30"
          width="130"
          height="290"
          rx="12"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className={`transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
        />
        <text
          x="550"
          y="50"
          textAnchor="middle"
          className="fill-gray-300 text-[10px] font-medium uppercase tracking-widest"
        >
          Concurrent
        </text>

        {/* Connections - 3-way split */}
        <g className={`transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          {/* Input to Filter */}
          <line x1="130" y1="190" x2="170" y2="190" stroke="#10b981" strokeWidth="3" strokeDasharray="6 3" className="animate-dash" />
          {/* Filter to Triage */}
          <line x1="270" y1="190" x2="310" y2="190" stroke="#10b981" strokeWidth="3" strokeDasharray="6 3" className="animate-dash" />

          {/* Triage to Heuristic (top) */}
          <path d="M 410 190 C 450 190, 450 90, 500 90" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6 3" className="animate-dash" />
          {/* Triage to DocAI (middle) */}
          <line x1="410" y1="190" x2="500" y2="190" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 3" className="animate-dash" />
          {/* Triage to VLM (bottom) */}
          <path d="M 410 190 C 450 190, 450 290, 500 290" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 3" strokeOpacity="0.5" className="animate-dash" />

          {/* Heuristic to Merger */}
          <path d="M 600 90 C 650 90, 650 190, 690 190" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6 3" className="animate-dash" />
          {/* DocAI to Merger */}
          <line x1="600" y1="190" x2="690" y2="190" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 3" className="animate-dash" />
          {/* VLM to Merger */}
          <path d="M 600 290 C 650 290, 650 190, 690 190" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 3" strokeOpacity="0.5" className="animate-dash" />

          {/* Merger to Output */}
          <line x1="790" y1="190" x2="830" y2="190" stroke="#10b981" strokeWidth="3" strokeDasharray="6 3" className="animate-dash" />
        </g>

        {/* Labels for branches - positioned between triage and nodes */}
        <text x="445" y="125" className="fill-violet-400 text-[10px] font-medium">Simple</text>
        <text x="445" y="180" className="fill-cyan-400 text-[10px] font-medium">Complex</text>
        <text x="445" y="262" className="fill-rose-400/70 text-[10px] font-medium">Super</text>
        <text x="439" y="274" className="fill-rose-400/70 text-[10px] font-medium">Complex</text>

        {/* Nodes */}
        {nodes.map((node, index) => (
          <g
            key={node.id}
            className={`transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <rect
              x={node.x - nodeW/2}
              y={node.y - nodeH/2}
              width={nodeW}
              height={nodeH}
              rx="10"
              className={getNodeStyle(node.type)}
              strokeWidth="1.5"
              filter="url(#glow)"
              opacity={"isPlanned" in node && node.isPlanned ? 0.5 : 1}
            />
            <text
              x={node.x}
              y={"subtitle" in node ? node.y : node.y + 5}
              textAnchor="middle"
              className="fill-white text-xs font-medium"
              opacity={"isPlanned" in node && node.isPlanned ? 0.7 : 1}
            >
              {node.label}
            </text>
            {/* Subtitle for backends */}
            {"subtitle" in node && (
              <text
                x={node.x}
                y={node.y + 14}
                textAnchor="middle"
                className="fill-gray-200 text-[9px]"
                opacity={"isPlanned" in node && node.isPlanned ? 0.7 : 1}
              >
                {node.subtitle}
              </text>
            )}
            {/* New badge */}
            {"isNew" in node && node.isNew && (
              <>
                <rect
                  x={node.x + nodeW/2 - 8}
                  y={node.y - nodeH/2 - 8}
                  width="28"
                  height="16"
                  rx="8"
                  fill="#10b981"
                />
                <text
                  x={node.x + nodeW/2 + 6}
                  y={node.y - nodeH/2 + 3}
                  textAnchor="middle"
                  className="fill-white text-[8px] font-bold uppercase"
                >
                  New
                </text>
              </>
            )}
            {/* Planned badge */}
            {"isPlanned" in node && node.isPlanned && (
              <>
                <rect
                  x={node.x + nodeW/2 - 8}
                  y={node.y - nodeH/2 - 8}
                  width="42"
                  height="16"
                  rx="8"
                  fill="#f43f5e"
                  opacity="0.8"
                />
                <text
                  x={node.x + nodeW/2 + 13}
                  y={node.y - nodeH/2 + 3}
                  textAnchor="middle"
                  className="fill-white text-[8px] font-bold uppercase"
                >
                  Planned
                </text>
              </>
            )}
          </g>
        ))}

        <style>{`
          @keyframes dashFlow {
            to { stroke-dashoffset: -18; }
          }
          .animate-dash {
            animation: dashFlow 1s linear infinite;
          }
        `}</style>
      </svg>
    </div>
  );
}

function MetricCard({
  metric,
  index,
}: {
  metric: (typeof keyMetrics)[0];
  index: number;
}) {
  const [mounted, setMounted] = useState(false);
  const Icon = metric.icon;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5 transition-all duration-500 hover:border-emerald-500/30 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/10" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
            {metric.label}
          </span>
          <Icon className="h-4 w-4 text-emerald-400" />
        </div>

        {"before" in metric ? (
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-gray-300 line-through">{metric.before}</span>
            <ArrowRight className="h-3 w-3 text-gray-400" />
            <span className="font-mono text-2xl font-bold text-white">{metric.after}</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
              {metric.change}
            </span>
            {"badge" in metric && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-xs font-semibold text-amber-400">
                {metric.badge}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white">{metric.value}</span>
            {"subtitle" in metric && (
              <span className="text-sm text-gray-300">{metric.subtitle}</span>
            )}
            {"badge" in metric && (
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-400">
                {metric.badge}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/80 p-4">
      <pre className="font-mono text-sm text-gray-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function HybridArchitecturePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.03] blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-violet-500/[0.02] blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
        {/* Hero Section */}
        <AnimatedSection className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Adaptive Processing</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Hybrid PDF Processing System
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
            Java heuristics + External AI backends with intelligent page-level triage
          </p>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            {keyMetrics.map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index} />
            ))}
          </div>

          <Link
            href="/bench-hybrid"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-emerald-400"
          >
            View detailed benchmark
            <ExternalLink className="h-4 w-4" />
          </Link>
        </AnimatedSection>

        {/* Architecture Overview */}
        <AnimatedSection delay={200} className="mb-12">
          <GlassCard className="p-6">
            <SectionHeader icon={GitBranch} title="Architecture Overview" subtitle="Processing pipeline flow" />
            <ArchitectureDiagram />

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-6 md:grid-cols-3">
              {[
                { label: "Per-page Triage", desc: "Individual page complexity analysis" },
                { label: "Concurrent Processing", desc: "Java & Backend paths run in parallel" },
                { label: "Conservative Strategy", desc: "Minimize FN, route uncertain to Backend" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-gray-300">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Two Column Layout */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          {/* Triage System */}
          <AnimatedSection delay={300}>
            <GlassCard className="h-full p-6">
              <SectionHeader icon={Layers} title="Triage System" subtitle="Signal detection priority" />

              {/* Signal Priority */}
              <div className="mb-6 space-y-2">
                {signalPriority.map((signal) => (
                  <div
                    key={signal.signal}
                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 font-mono text-xs font-bold text-emerald-400">
                      {signal.priority}
                    </div>
                    <div className="flex-1">
                      <code className="text-xs text-cyan-400">{signal.signal}</code>
                      <div className="text-xs text-gray-300">{signal.description}</div>
                    </div>
                    <div className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-gray-300">
                      {signal.confidence}
                    </div>
                  </div>
                ))}
              </div>

              {/* Experiment Results - Table */}
              <div className="border-t border-white/10 pt-4">
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-300">
                  Optimization Results (5 iterations)
                </div>
                <div className="overflow-hidden rounded-lg border border-white/10">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03]">
                        <th className="px-3 py-2 text-left font-medium text-gray-300">Metric</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-300">Initial</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-300">Final</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-300">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {triageResults.map((result) => (
                        <tr
                          key={result.metric}
                          className={`border-b border-white/5 last:border-0 ${
                            result.highlight ? "bg-emerald-500/10" : ""
                          }`}
                        >
                          <td className="px-3 py-2 text-gray-300">{result.metric}</td>
                          <td className="px-3 py-2 text-right font-mono text-gray-300">{result.initial}</td>
                          <td className={`px-3 py-2 text-right font-mono font-semibold ${result.highlight ? "text-emerald-400" : "text-white"}`}>
                            {result.final}
                          </td>
                          <td className={`px-3 py-2 text-right font-mono ${result.change.startsWith("+") ? "text-emerald-400" : "text-cyan-400"}`}>
                            {result.change}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Speed Optimization */}
          <AnimatedSection delay={400}>
            <GlassCard className="h-full p-6">
              <SectionHeader icon={Zap} title="Speed Optimization" subtitle="Backend performance comparison" />

              <div className="mb-6 space-y-2">
                {speedComparison.map((item) => (
                  <div
                    key={item.approach}
                    className={`relative overflow-hidden rounded-lg border p-4 ${
                      item.selected
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{item.approach}</span>
                          {item.selected && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-300">{item.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg font-bold text-white">{item.avgTime}</div>
                        <div className={`font-mono text-xs ${item.isBaseline ? "text-gray-400" : "text-cyan-400"}`}>
                          {item.speedup}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Backends */}
              <div className="border-t border-white/10 pt-4">
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-300">
                  Supported Backends
                </div>
                <div className="grid gap-2">
                  {backends.map((backend) => {
                    const Icon = backend.icon;
                    const colorClass = {
                      emerald: "text-emerald-400",
                      cyan: "text-cyan-400",
                      violet: "text-violet-400",
                      amber: "text-amber-400",
                    }[backend.color];

                    return (
                      <div
                        key={backend.name}
                        className="flex items-center gap-3 rounded-md bg-white/[0.02] px-3 py-2"
                      >
                        <Icon className={`h-4 w-4 ${colorClass}`} />
                        <code className="font-mono text-xs text-white">{backend.name}</code>
                        <span className="flex-1 text-xs text-gray-300">{backend.description}</span>
                        <span className={`text-[10px] uppercase tracking-wider ${colorClass}`}>
                          {backend.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        {/* Output Schema */}
        <AnimatedSection delay={500} className="mb-12">
          <GlassCard className="p-6">
            <SectionHeader icon={FileText} title="Output Schema" subtitle="IObject structure specification" />

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="mb-3 text-sm font-medium text-white">Element Types</div>
                <div className="flex flex-wrap gap-2">
                  {["Paragraph", "Heading", "Table", "Image", "List"].map((type) => (
                    <span
                      key={type}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-gray-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="mb-2 text-sm font-medium text-white">Bounding Box</div>
                  <div className="rounded-lg bg-white/[0.02] p-3">
                    <code className="text-xs text-cyan-400">[left, bottom, right, top]</code>
                    <div className="mt-1 text-xs text-gray-400">Origin: BOTTOMLEFT (PDF standard)</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 text-sm font-medium text-white">Table Structure</div>
                <CodeBlock>{`{
  "type": "table",
  "rows": [{
    "cells": [{
      "row_span": 1,
      "column_span": 1,
      "kids": [{ "type": "paragraph", "content": "..." }]
    }]
  }]
}`}</CodeBlock>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* CLI Usage & Risk Mitigation */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AnimatedSection delay={600}>
            <GlassCard className="h-full p-6">
              <SectionHeader icon={Terminal} title="CLI Usage" subtitle="Command examples" />

              <div className="space-y-3">
                {cliExamples.map((example, index) => (
                  <div key={index} className="rounded-lg border border-white/5 bg-zinc-950/50 p-3">
                    <div className="mb-1 text-xs text-gray-300"># {example.desc}</div>
                    <code className="text-xs text-emerald-400">{example.cmd}</code>
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection delay={700}>
            <GlassCard className="h-full p-6">
              <SectionHeader icon={Shield} title="Risk Mitigation" subtitle="Failure handling strategies" />

              <div className="space-y-2">
                {risks.map((item) => (
                  <div
                    key={item.risk}
                    className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{item.risk}</div>
                      <div className="text-xs text-gray-300">{item.mitigation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
