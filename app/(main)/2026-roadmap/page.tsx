"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Star,
  Handshake,
  FileText,
  Check,
  Clock,
  Loader2,
  Bot,
  Users,
  Target,
  Mail,
  Slack,
  Calendar,
  Building2,
  GraduationCap,
  Rocket,
  ArrowRight,
} from "lucide-react";

// ============================================================================
// DATA
// ============================================================================

const goals = [
  {
    id: "benchmark",
    title: "벤치마크 1등",
    icon: Trophy,
    color: "emerald",
    progress: 100,
    description: "Document AI 벤치마크 1위 달성",
  },
  {
    id: "stars",
    title: "Star 10,000",
    icon: Star,
    color: "amber",
    current: 815,
    target: 10000,
    description: "GitHub Star 10,000개 달성",
  },
  {
    id: "business",
    title: "비즈니스 레퍼런스",
    icon: Handshake,
    color: "violet",
    current: 0,
    target: 1,
    description: "실제 비즈니스 레퍼런스 확보",
  },
];

const benchmarkTasks = {
  docAI: [
    { name: "Docling Doc AI", status: "completed" as const },
    { name: "Docling Formular/Picture AI", status: "pending" as const },
  ],
  vlm: [
    { name: "Docling VLM", status: "pending" as const },
  ],
  paid: [
    { name: "Hancom Doc AI", status: "in_progress" as const },
  ],
};

const starTasks = {
  agent: [
    { name: "AI Framework 연동", description: "LangFlow, LlamaIndex, Haystack, CrewAI" },
    { name: "컨텐츠 AI 생성 및 SNS 등록", description: "LinkedIn, Reddit, HackerNews" },
    { name: "온라인 데모앱 개발", description: "인터랙티브 데모" },
    { name: "성공 사례 확보", description: "특정 문제 해결 케이스" },
  ],
  human: [
    { name: "유튜버/인플루언서 콜라보", description: "기술 유튜버 협업" },
    { name: "오프라인 컨퍼런스 참여", description: "기술 컨퍼런스 발표" },
  ],
};

const pocConditions = [
  { icon: Calendar, text: "2~3주 분석 + 코드 수정" },
  { icon: Slack, text: "Slack에 상주" },
  { icon: Users, text: "월 1회 미팅 수준" },
];

const targetSegments = [
  { name: "AI 스타트업", traits: "빠름, 레퍼런스 쉬움", priority: "high" as const, icon: Rocket },
  { name: "엔터프라이즈 팀", traits: "느림, 무게감 큼", priority: "medium" as const, icon: Building2 },
  { name: "연구기관/공공", traits: "정치적 안전, 스토리 좋음", priority: "medium" as const, icon: GraduationCap },
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

function GoalCard({
  goal,
  delay,
}: {
  goal: (typeof goals)[0];
  delay: number;
}) {
  const [mounted, setMounted] = useState(false);
  const Icon = goal.icon;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorClasses = {
    emerald: {
      bg: "from-emerald-500/20 to-emerald-600/10",
      ring: "ring-emerald-500/30",
      text: "text-emerald-400",
      bar: "bg-emerald-500",
    },
    amber: {
      bg: "from-amber-500/20 to-amber-600/10",
      ring: "ring-amber-500/30",
      text: "text-amber-400",
      bar: "bg-amber-500",
    },
    violet: {
      bg: "from-violet-500/20 to-violet-600/10",
      ring: "ring-violet-500/30",
      text: "text-violet-400",
      bar: "bg-violet-500",
    },
  };

  const colors = colorClasses[goal.color as keyof typeof colorClasses];

  return (
    <GlassCard hover className="p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors.bg} ring-1 ${colors.ring}`}
        >
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
          <p className="mt-1 text-sm text-gray-400">{goal.description}</p>

          {"progress" in goal && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>진행률</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full ${colors.bar} transition-all duration-1000 ease-out`}
                  style={{ width: mounted ? `${goal.progress}%` : "0%" }}
                />
              </div>
            </div>
          )}

          {"current" in goal && "target" in goal && goal.current !== undefined && goal.target !== undefined && (
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {goal.current.toLocaleString()}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400">{goal.target.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

function StatusBadge({ status }: { status: "completed" | "in_progress" | "pending" }) {
  const config = {
    completed: { icon: Check, text: "완료", className: "bg-emerald-500/20 text-emerald-400" },
    in_progress: { icon: Loader2, text: "진행중", className: "bg-amber-500/20 text-amber-400" },
    pending: { icon: Clock, text: "예정", className: "bg-gray-500/20 text-gray-400" },
  };

  const { icon: Icon, text, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      <Icon className={`h-3 w-3 ${status === "in_progress" ? "animate-spin" : ""}`} />
      {text}
    </span>
  );
}

function TaskItem({ name, status }: { name: string; status: "completed" | "in_progress" | "pending" }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
      <span className="text-sm text-gray-300">{name}</span>
      <StatusBadge status={status} />
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  color = "emerald",
}: {
  icon: React.ElementType;
  title: string;
  color?: string;
}) {
  const colorClasses = {
    emerald: { bg: "from-emerald-500/20 to-cyan-500/20", text: "text-emerald-400" },
    amber: { bg: "from-amber-500/20 to-orange-500/20", text: "text-amber-400" },
    violet: { bg: "from-violet-500/20 to-purple-500/20", text: "text-violet-400" },
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald;

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors.bg} ring-1 ring-white/10`}>
        <Icon className={`h-5 w-5 ${colors.text}`} />
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
  );
}

function GroupCard({
  title,
  icon: Icon,
  children,
  color = "gray",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  color?: string;
}) {
  const colorClasses = {
    gray: "text-gray-400",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.gray}`} />
        <h4 className="text-sm font-medium text-gray-300">{title}</h4>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[80px]" />
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-24">
        {/* Hero Section */}
        <AnimatedSection delay={0}>
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              2026 <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-violet-400 bg-clip-text text-transparent">Roadmap</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              OpenDataLoader Project - 3대 목표
            </p>
          </div>
        </AnimatedSection>

        {/* Goals Section */}
        <AnimatedSection delay={100}>
          <div className="grid gap-6 sm:grid-cols-3 mb-12">
            {goals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} delay={200 + index * 100} />
            ))}
          </div>
        </AnimatedSection>

        {/* Core Task Section */}
        <AnimatedSection delay={400}>
          <GlassCard className="p-6 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-500/30">
                <FileText className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">핵심 작업</h3>
                <p className="text-gray-400">라이선스 전환</p>
              </div>
            </div>

            {/* License Change Highlight */}
            <div className="flex items-center justify-center gap-6 py-6 mb-6 rounded-xl bg-gradient-to-r from-rose-500/10 via-transparent to-emerald-500/10 border border-white/10">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">현재</p>
                <span className="text-2xl font-bold text-rose-400">MPLv2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-[2px] bg-gradient-to-r from-rose-400 to-gray-500"></div>
                <ArrowRight className="h-6 w-6 text-cyan-400" />
                <div className="w-12 h-[2px] bg-gradient-to-r from-gray-500 to-emerald-400"></div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">목표</p>
                <span className="text-2xl font-bold text-emerald-400">MIT</span>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <h4 className="text-sm font-medium text-amber-400 mb-3">왜 MIT 전환이 중요한가?</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">Star 확보 가속화</p>
                      <p className="text-xs text-gray-500">MPL의 파일별 공개 의무가 기업 도입을 막음. MIT는 제약 없이 자유롭게 사용 가능</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Handshake className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">비즈니스 레퍼런스 확보</p>
                      <p className="text-xs text-gray-500">엔터프라이즈 법무팀이 MIT를 선호. 라이선스 검토 없이 즉시 PoC 가능</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">AI 프레임워크 연동</p>
                      <p className="text-xs text-gray-500">LangChain, LlamaIndex 등 MIT 기반 생태계와 자연스러운 통합</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Trophy className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">경쟁사 대비 우위</p>
                      <p className="text-xs text-gray-500">Docling, Marker 등 경쟁 프로젝트 모두 MIT. 동일 조건에서 경쟁 필요</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Benchmark Section */}
        <AnimatedSection delay={500}>
          <GlassCard className="p-6 mb-8">
            <SectionTitle icon={Trophy} title="벤치마크 1등 상세" color="emerald" />
            <p className="text-sm text-gray-400 mb-6">
              전략: Claude Code 멀티 에이전트로 구축
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <GroupCard title="Doc AI 모듈" icon={FileText} color="cyan">
                {benchmarkTasks.docAI.map((task) => (
                  <TaskItem key={task.name} name={task.name} status={task.status} />
                ))}
              </GroupCard>
              <GroupCard title="VLM 모듈" icon={Target} color="violet">
                {benchmarkTasks.vlm.map((task) => (
                  <TaskItem key={task.name} name={task.name} status={task.status} />
                ))}
              </GroupCard>
              <GroupCard title="유료 Doc AI 모듈" icon={Building2} color="amber">
                {benchmarkTasks.paid.map((task) => (
                  <TaskItem key={task.name} name={task.name} status={task.status} />
                ))}
              </GroupCard>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Star 10K Section */}
        <AnimatedSection delay={600}>
          <GlassCard className="p-6 mb-8">
            <SectionTitle icon={Star} title="Star 10,000 상세" color="amber" />
            <div className="grid gap-4 sm:grid-cols-2">
              <GroupCard title="에이전트 파트 (자동화)" icon={Bot} color="amber">
                {starTasks.agent.map((task) => (
                  <div key={task.name} className="py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-sm text-gray-300">{task.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  </div>
                ))}
              </GroupCard>
              <GroupCard title="사람 파트 (수동)" icon={Users} color="gray">
                {starTasks.human.map((task) => (
                  <div key={task.name} className="py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-sm text-gray-300">{task.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                  </div>
                ))}
              </GroupCard>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Business Reference Section */}
        <AnimatedSection delay={700}>
          <GlassCard className="p-6">
            <SectionTitle icon={Handshake} title="비즈니스 레퍼런스 상세" color="violet" />
            <div className="grid gap-4 sm:grid-cols-2">
              <GroupCard title="PoC 서포트 조건" icon={Mail} color="violet">
                {pocConditions.map((condition) => (
                  <div key={condition.text} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <condition.icon className="h-4 w-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-gray-300">{condition.text}</span>
                  </div>
                ))}
              </GroupCard>
              <GroupCard title="타겟 세그먼트" icon={Target} color="emerald">
                {targetSegments.map((segment) => (
                  <div key={segment.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2">
                      <segment.icon className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-300">{segment.name}</p>
                        <p className="text-xs text-gray-500">{segment.traits}</p>
                      </div>
                    </div>
                    {segment.priority === "high" && (
                      <span className="text-xs font-medium text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">
                        🔥 높음
                      </span>
                    )}
                  </div>
                ))}
              </GroupCard>
            </div>
          </GlassCard>
        </AnimatedSection>
      </main>
    </div>
  );
}
