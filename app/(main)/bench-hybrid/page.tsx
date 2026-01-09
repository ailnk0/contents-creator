"use client";

import { useEffect, useState } from "react";

interface EngineData {
  engine: string;
  value: number;
}

interface Metric {
  key: string;
  title: string;
  subtitle: string;
  lowerIsBetter: boolean;
  data: EngineData[];
}

const metrics: Metric[] = [
  {
    key: "average",
    title: "Average Score",
    subtitle: "(NID + TEDS + MHS) / 3 · Higher is better",
    lowerIsBetter: false,
    data: [
      { engine: "opendataloader (before)", value: (0.91 + 0.49 + 0.65) / 3 },
      { engine: "opendataloader (after)", value: (0.93 + 0.93 + 0.78) / 3 },
      { engine: "docling", value: (0.9 + 0.89 + 0.8) / 3 },
      { engine: "marker", value: (0.89 + 0.81 + 0.8) / 3 },
      { engine: "mineru", value: (0.86 + 0.87 + 0.74) / 3 },
      { engine: "pymupdf4llm", value: (0.89 + 0.4 + 0.41) / 3 },
      { engine: "markitdown", value: (0.88 + 0 + 0) / 3 },
    ],
  },
  {
    key: "readingOrder",
    title: "Reading Order (NID)",
    subtitle: "Higher is better",
    lowerIsBetter: false,
    data: [
      { engine: "opendataloader (before)", value: 0.91 },
      { engine: "opendataloader (after)", value: 0.93 },
      { engine: "docling", value: 0.9 },
      { engine: "marker", value: 0.89 },
      { engine: "mineru", value: 0.86 },
      { engine: "pymupdf4llm", value: 0.89 },
      { engine: "markitdown", value: 0.88 },
    ],
  },
  {
    key: "table",
    title: "Table Score (TEDS)",
    subtitle: "Higher is better",
    lowerIsBetter: false,
    data: [
      { engine: "opendataloader (before)", value: 0.49 },
      { engine: "opendataloader (after)", value: 0.93 },
      { engine: "docling", value: 0.89 },
      { engine: "marker", value: 0.81 },
      { engine: "mineru", value: 0.87 },
      { engine: "pymupdf4llm", value: 0.4 },
      { engine: "markitdown", value: 0 },
    ],
  },
  {
    key: "heading",
    title: "Heading Score (MHS)",
    subtitle: "Higher is better",
    lowerIsBetter: false,
    data: [
      { engine: "opendataloader (before)", value: 0.65 },
      { engine: "opendataloader (after)", value: 0.78 },
      { engine: "docling", value: 0.8 },
      { engine: "marker", value: 0.8 },
      { engine: "mineru", value: 0.74 },
      { engine: "pymupdf4llm", value: 0.41 },
      { engine: "markitdown", value: 0 },
    ],
  },
  {
    key: "speed",
    title: "Speed",
    subtitle: "s/page · Lower is better",
    lowerIsBetter: true,
    data: [
      { engine: "opendataloader (before)", value: 0.0499 },
      { engine: "opendataloader (after)", value: 0.4784 },
      { engine: "docling", value: 0.7251 },
      { engine: "marker", value: 53.93 },
      { engine: "mineru", value: 5.96 },
      { engine: "pymupdf4llm", value: 0.0909 },
      { engine: "markitdown", value: 0.041 },
    ],
  },
  {
    key: "throughput",
    title: "Throughput",
    subtitle: "docs/min · Higher is better",
    lowerIsBetter: false,
    data: [
      { engine: "opendataloader (before)", value: 60 / 0.0499 },
      { engine: "opendataloader (after)", value: 60 / 0.4784 },
      { engine: "docling", value: 60 / 0.7251 },
      { engine: "marker", value: 60 / 53.93 },
      { engine: "mineru", value: 60 / 5.96 },
      { engine: "pymupdf4llm", value: 60 / 0.0909 },
      { engine: "markitdown", value: 60 / 0.041 },
    ],
  },
];

function MetricCard({ metric }: { readonly metric: Metric }) {
  const [started, setStarted] = useState(false);

  const maxValue = Math.max(...metric.data.map((d) => d.value));

  useEffect(() => {
    // 즉시 애니메이션 시작
    requestAnimationFrame(() => setStarted(true));
  }, []);

  const getBarWidth = (value: number) => {
    if (!started) return 3;
    if (maxValue === 0) return 3;
    return Math.max((value / maxValue) * 100, 3);
  };

  const formatValue = (value: number) => {
    if (metric.lowerIsBetter) {
      return value.toFixed(2);
    }
    return value.toFixed(2);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Card Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{metric.title}</h2>
        <p className="text-xs text-gray-400">{metric.subtitle}</p>
      </div>

      {/* Bars */}
      <div className="space-y-2.5">
        {metric.data.map((item) => {
          const isBefore = item.engine.includes("(before)");
          const isAfter = item.engine.includes("(after)");

          let barColorClass: string;
          let textColorClass: string;

          if (isAfter) {
            barColorClass = "bg-gradient-to-r from-emerald-500/80 to-cyan-500/80";
            textColorClass = "text-emerald-400";
          } else if (isBefore) {
            barColorClass = "bg-white/10";
            textColorClass = "text-gray-500";
          } else {
            barColorClass = "bg-gradient-to-r from-blue-500/50 to-indigo-500/50";
            textColorClass = "text-gray-400";
          }

          const barWidth = getBarWidth(item.value);

          return (
            <div key={item.engine} className="flex items-center gap-3">
              {/* Engine name */}
              <div className="w-36 shrink-0">
                <span
                  className={`text-xs font-medium ${textColorClass} truncate block`}
                  title={item.engine}
                >
                  {item.engine}
                </span>
              </div>

              {/* Bar */}
              <div className="relative h-7 flex-1 overflow-hidden rounded-md border border-white/5 bg-white/5">
                <div
                  className={`absolute inset-y-0 left-0 flex items-center justify-end rounded-md pr-2 transition-all duration-500 ease-out ${barColorClass}`}
                  style={{ width: `${barWidth}%` }}
                >
                  {item.value > 0 && barWidth > 15 && (
                    <span
                      className={`font-mono text-xs font-semibold text-white drop-shadow-md transition-opacity duration-300 delay-300 ${
                        started ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {formatValue(item.value)}
                    </span>
                  )}
                </div>
                {(item.value === 0 || barWidth <= 15) && (
                  <span
                    className={`absolute inset-y-0 flex items-center font-mono text-xs font-semibold text-gray-400 transition-opacity duration-300 delay-300 ${
                      started ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ left: `calc(${barWidth}% + 6px)` }}
                  >
                    {formatValue(item.value)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Legend */}
      <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-500" />
          <span>after</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-white/20" />
          <span>before</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-sm bg-gradient-to-r from-blue-500/70 to-indigo-500/70" />
          <span>Others</span>
        </div>
      </div>

    </div>
  );
}

export default function BenchHybrid() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 p-6 pt-20">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            PDF Engine Benchmark
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Performance comparison across key metrics
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {metrics.map((metric) => (
            <MetricCard key={metric.key} metric={metric} />
          ))}
        </div>

      </div>
    </div>
  );
}
