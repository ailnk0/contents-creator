"use client";

import { useEffect, useState } from "react";

const benchmarkData = [
  { engine: "opendataloader (after)", score: 0.93, isHighlight: true },
  { engine: "docling", score: 0.89, isHighlight: false },
  { engine: "opendataloader (before)", score: 0.49, isHighlight: false, isBefore: true },
  { engine: "pymupdf4llm", score: 0.4, isHighlight: false },
  { engine: "markitdown", score: 0, isHighlight: false },
];

export default function BenchHybridTable() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setStarted(true));
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 p-8 pt-20">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Glass Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Table Score Benchmark
            </h1>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            {benchmarkData.map((item) => {
              const barColorClass = item.isHighlight
                ? "bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 border-emerald-400/30"
                : item.isBefore
                  ? "bg-white/10 border-white/5"
                  : "bg-gradient-to-r from-blue-500/60 to-indigo-500/60 border-blue-400/20";

              const textColorClass = item.isHighlight
                ? "text-emerald-400"
                : item.isBefore
                  ? "text-gray-500"
                  : "text-gray-300";

              const barWidth = started ? Math.max(item.score * 100, 3) : 3;

              return (
                <div
                  key={item.engine}
                  className="flex items-center gap-4"
                >
                  {/* Engine name */}
                  <div className="w-44 shrink-0">
                    <span className={`text-sm font-medium ${textColorClass}`}>
                      {item.engine}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="relative h-9 flex-1 overflow-hidden rounded-lg border border-white/5 bg-white/5 backdrop-blur-sm">
                    <div
                      className={`absolute inset-y-0 left-0 flex items-center justify-end rounded-lg border-r pr-3 transition-all duration-500 ease-out ${barColorClass}`}
                      style={{ width: `${barWidth}%` }}
                    >
                      {item.score > 0 && (
                        <span
                          className={`font-mono text-sm font-semibold text-white drop-shadow-md transition-opacity duration-300 delay-300 ${
                            started ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {item.score.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.score === 0 && (
                      <span
                        className={`absolute inset-y-0 flex items-center font-mono text-sm font-semibold text-gray-400 transition-opacity duration-300 delay-300 ${
                          started ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ left: `calc(${barWidth}% + 8px)` }}
                      >
                        {item.score.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-500" />
                <span>Best</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-blue-500 to-indigo-500" />
                <span>Others</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Score: 0.00 – 1.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
