import Link from "next/link";

function AppBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold text-white transition-colors hover:text-emerald-400"
        >
          opendataloader
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/hybrid-architecture"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Architecture
          </Link>
          <Link
            href="/multiagents-design"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Multi-Agent
          </Link>
          <Link
            href="/bench-hybrid"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Benchmark
          </Link>
          <Link
            href="/bench-hybrid-table"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Benchmark (TEDS)
          </Link>
          <Link
            href="/2026-roadmap"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            2026 Roadmap
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBar />
      {children}
    </>
  );
}
