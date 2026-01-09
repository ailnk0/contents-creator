"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bot,
  FlaskConical,
  Target,
  TrendingUp,
  Scissors,
  MessageSquare,
  CheckCircle2,
  Square,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Zap,
  GitBranch,
  GitCommitHorizontal,
  Layers,
  CircleCheck,
  Terminal,
  Brain,
  FileJson2,
} from "lucide-react";

// Types
type TaskStatus = "completed" | "pending" | "in-progress";

interface Task {
  id: string;
  name: string;
  shortName: string;
  status: TaskStatus;
  phase: number;
  dependencies: string[];
  isParallelizable?: boolean;
}

interface Phase {
  id: number;
  name: string;
  description: string;
}

interface ExperimentIteration {
  iteration: number;
  change: string;
  changeKorean: string;
  precision: number;
  recall?: number;
  falsePositives: number;
  isBreakthrough: boolean;
}

interface ChecklistCategory {
  id: string;
  title: string;
  titleKorean: string;
  icon: React.ReactNode;
  accentColor: "emerald" | "cyan" | "violet";
  items: { text: string; textKorean: string }[];
}

interface TaskDetail {
  id: number;
  name: string;
  nameKorean: string;
  goal: string;
  goalKorean: string;
  inputs: string[];
  outputs: string[];
  agentActions: string[];
  successCriteria: string[];
  testMethod: string;
}

// Long-Term Memory Types
interface MemoryCard {
  id: string;
  title: string;
  titleKorean: string;
  description: string;
  descriptionKorean: string;
  icon: React.ReactNode;
  color: "cyan" | "amber" | "emerald" | "orange" | "violet";
  examples: string[];
}

interface PhaseDetail {
  phase: number;
  name: string;
  nameKorean: string;
  description: string;
  descriptionKorean: string;
  tasks: TaskDetail[];
  parallelizable: boolean;
}

// Workflow Data
const phases: Phase[] = [
  { id: -1, name: "Phase -1", description: "Pre-research" },
  { id: 0, name: "Phase 0", description: "Tool Setup" },
  { id: 1, name: "Phase 1", description: "Infrastructure" },
  { id: 2, name: "Phase 2", description: "Core Components" },
  { id: 3, name: "Phase 3", description: "Integration" },
  { id: 4, name: "Phase 4", description: "Evaluation" },
];

const tasks: Task[] = [
  {
    id: "task-1",
    name: "Pre-research & Data Collection",
    shortName: "Data Collection",
    status: "completed",
    phase: -1,
    dependencies: [],
  },
  {
    id: "task0",
    name: "docling-api skill",
    shortName: "docling-api",
    status: "completed",
    phase: 0,
    dependencies: ["task-1"],
    isParallelizable: true,
  },
  {
    id: "task1",
    name: "schema-mapping skill",
    shortName: "schema-mapping",
    status: "completed",
    phase: 0,
    dependencies: ["task-1"],
    isParallelizable: true,
  },
  {
    id: "task2",
    name: "triage-criteria skill",
    shortName: "triage-criteria",
    status: "completed",
    phase: 0,
    dependencies: ["task-1"],
    isParallelizable: true,
  },
  {
    id: "task3",
    name: "HybridConfig",
    shortName: "HybridConfig",
    status: "completed",
    phase: 1,
    dependencies: ["task0", "task1", "task2"],
  },
  {
    id: "task4",
    name: "CLI Options",
    shortName: "CLI Options",
    status: "completed",
    phase: 1,
    dependencies: ["task3"],
  },
  {
    id: "task5",
    name: "TriageProcessor",
    shortName: "TriageProcessor",
    status: "completed",
    phase: 2,
    dependencies: ["task3"],
    isParallelizable: true,
  },
  {
    id: "task6",
    name: "DoclingClient",
    shortName: "DoclingClient",
    status: "completed",
    phase: 2,
    dependencies: ["task3"],
    isParallelizable: true,
  },
  {
    id: "task7",
    name: "SchemaTransformer",
    shortName: "SchemaTransformer",
    status: "completed",
    phase: 2,
    dependencies: ["task3"],
    isParallelizable: true,
  },
  {
    id: "task8",
    name: "HybridDocumentProcessor",
    shortName: "HybridDocProcessor",
    status: "completed",
    phase: 3,
    dependencies: ["task5", "task6", "task7"],
  },
  {
    id: "task9",
    name: "Triage Logging",
    shortName: "Triage Logging",
    status: "completed",
    phase: 3,
    dependencies: ["task8"],
  },
  {
    id: "task10",
    name: "Triage Evaluator",
    shortName: "Triage Evaluator",
    status: "completed",
    phase: 4,
    dependencies: ["task9"],
  },
  {
    id: "task11",
    name: "Triage Analyzer Agent",
    shortName: "Analyzer Agent",
    status: "completed",
    phase: 4,
    dependencies: ["task10", "task2"],
  },
];

const iterations: ExperimentIteration[] = [
  {
    iteration: 1,
    change: "Initial baseline",
    changeKorean: "초기 기준선",
    precision: 27,
    falsePositives: 110,
    isBreakthrough: false,
  },
  {
    iteration: 2,
    change: "Removed Y-overlap",
    changeKorean: "Y-overlap 제거",
    precision: 36,
    falsePositives: 72,
    isBreakthrough: false,
  },
  {
    iteration: 3,
    change: "Threshold tuning",
    changeKorean: "임계값 조정",
    precision: 58,
    falsePositives: 45,
    isBreakthrough: false,
  },
  {
    iteration: 4,
    change: "Boundary check",
    changeKorean: "경계 검사 추가",
    precision: 82,
    falsePositives: 18,
    isBreakthrough: false,
  },
  {
    iteration: 5,
    change: "Aspect ratio filter",
    changeKorean: "이미지 비율 조건",
    precision: 100,
    recall: 100,
    falsePositives: 0,
    isBreakthrough: true,
  },
];

const phaseDetails: PhaseDetail[] = [
  {
    phase: -1,
    name: "Pre-research",
    nameKorean: "사전 조사",
    description: "Collect data and specifications before implementation",
    descriptionKorean: "구현 전 필요한 데이터와 스펙 수집",
    parallelizable: false,
    tasks: [
      {
        id: -1,
        name: "Data Collection",
        nameKorean: "데이터 수집",
        goal: "Collect all required data and specifications",
        goalKorean: "모든 필요 데이터 및 스펙 수집",
        inputs: ["Docker environment", "Test PDFs"],
        outputs: [
          "docling-openapi.json",
          "docling-sample-response.json",
          "opendataloader-sample-response.json",
          "documents-with-tables.txt",
        ],
        agentActions: [
          "docling-serve 컨테이너 실행",
          "OpenAPI 스펙 수집 (curl /openapi.json)",
          "샘플 PDF 변환 및 응답 저장",
          "Java CLI로 동일 PDF 파싱",
          "테이블 포함 문서 목록 추출",
        ],
        successCriteria: [
          "docling-serve running and accessible",
          "OpenAPI spec saved",
          "Docling sample response JSON saved",
          "OpenDataLoader sample response JSON saved",
          "Documents with tables list extracted (~42 docs)",
        ],
        testMethod: "ls -la docs/hybrid/research/",
      },
    ],
  },
  {
    phase: 0,
    name: "Tool Setup",
    nameKorean: "도구 설정",
    description: "Create Claude skills for API specs and mappings",
    descriptionKorean: "API 스펙 및 매핑 규칙을 Claude 스킬로 생성",
    parallelizable: true,
    tasks: [
      {
        id: 0,
        name: "docling-api Skill",
        nameKorean: "docling API 스킬",
        goal: "Document docling-serve API for code generation",
        goalKorean: "코드 생성을 위한 docling-serve API 문서화",
        inputs: ["docling-openapi.json", "docling-sample-response.json"],
        outputs: [".claude/skills/docling-api/SKILL.md"],
        agentActions: [
          "OpenAPI 스펙에서 엔드포인트 추출",
          "요청/응답 스키마 문서화",
          "사용 예제 작성",
          "SKILL.md 파일 생성",
        ],
        successCriteria: [
          "API endpoints documented with examples",
          "Response JSON schema captured",
          "Skill auto-applies for docling tasks",
          "New session can generate correct DoclingClient",
        ],
        testMethod: 'claude "Write a Java method to call docling-serve API"',
      },
      {
        id: 1,
        name: "schema-mapping Skill",
        nameKorean: "스키마 매핑 스킬",
        goal: "Document mapping between docling and IObject",
        goalKorean: "docling 출력과 IObject 간 매핑 규칙 문서화",
        inputs: ["docling-sample-response.json", "Java IObject 클래스"],
        outputs: [".claude/skills/schema-mapping/SKILL.md"],
        agentActions: [
          "docling 요소 타입 분석",
          "IObject 타입 구조 분석",
          "필드별 매핑 규칙 정의",
          "좌표계 변환 공식 문서화",
        ],
        successCriteria: [
          "All docling element types mapped",
          "Field-level mapping documented",
          "Coordinate system conversion documented",
          "Skill auto-applies for transformer impl",
        ],
        testMethod: 'claude "Transform this docling table JSON to TableBorder"',
      },
      {
        id: 2,
        name: "triage-criteria Skill",
        nameKorean: "트리아지 기준 스킬",
        goal: "Document page triage decision rules",
        goalKorean: "페이지 트리아지 결정 규칙 문서화",
        inputs: ["Codebase analysis", "Table detection patterns"],
        outputs: [".claude/skills/triage-criteria/SKILL.md"],
        agentActions: [
          "LineChunk/TextChunk 신호 분석",
          "테이블 감지 패턴 추출",
          "임계값 및 규칙 정의",
          "튜닝 가이드라인 작성",
        ],
        successCriteria: [
          "All triage signals documented",
          "Threshold values specified with rationale",
          "Tuning guidelines included",
          "Skill auto-applies for TriageProcessor",
        ],
        testMethod: 'claude "The triage FN is too high, how should I adjust?"',
      },
    ],
  },
  {
    phase: 1,
    name: "Infrastructure",
    nameKorean: "인프라",
    description: "Add configuration and CLI options",
    descriptionKorean: "설정 클래스 및 CLI 옵션 추가",
    parallelizable: false,
    tasks: [
      {
        id: 3,
        name: "HybridConfig",
        nameKorean: "하이브리드 설정",
        goal: "Add configuration classes for hybrid processing",
        goalKorean: "하이브리드 처리용 설정 클래스 추가",
        inputs: ["Config.java"],
        outputs: ["HybridConfig.java", "Config.java (수정)"],
        agentActions: [
          "HybridConfig 클래스 생성 (URL, timeout, fallback)",
          "Config.java에 hybrid 필드 추가",
          "백엔드별 기본 URL 정의",
          "isHybridEnabled() 헬퍼 메서드 추가",
        ],
        successCriteria: [
          "HybridConfig class created with all fields",
          "Config.java has hybrid field with validation",
          "isHybridEnabled() helper method works",
          "Existing tests pass",
        ],
        testMethod: "./scripts/test-java.sh",
      },
      {
        id: 4,
        name: "CLI Options",
        nameKorean: "CLI 옵션",
        goal: "Add CLI options for hybrid mode",
        goalKorean: "하이브리드 모드용 CLI 옵션 추가",
        inputs: ["CLIOptions.java", "HybridConfig"],
        outputs: ["CLIOptions.java (수정)"],
        agentActions: [
          "--hybrid 옵션 추가",
          "--hybrid-url 옵션 추가",
          "--hybrid-timeout 옵션 추가",
          "--help 출력 업데이트",
        ],
        successCriteria: [
          "--hybrid option parsing works",
          "--hybrid-url option parsing works",
          "--help shows new options",
          "Options exported to JSON (--export-options)",
        ],
        testMethod: "java -jar opendataloader-pdf-cli-*.jar --help",
      },
    ],
  },
  {
    phase: 2,
    name: "Core Components",
    nameKorean: "핵심 컴포넌트",
    description: "Implement triage, client, and transformer",
    descriptionKorean: "트리아지, 클라이언트, 변환기 구현",
    parallelizable: true,
    tasks: [
      {
        id: 5,
        name: "TriageProcessor",
        nameKorean: "트리아지 프로세서",
        goal: "Implement page-level triage logic",
        goalKorean: "페이지 수준 트리아지 로직 구현",
        inputs: ["triage-criteria skill", "HybridConfig"],
        outputs: ["TriageProcessor.java"],
        agentActions: [
          "TriageResult, TriageSignals 레코드 정의",
          "신호 추출 로직 구현 (line/text 비율)",
          "classifyPage() 메서드 구현",
          "보수적 임계값 설정 (FN 최소화)",
        ],
        successCriteria: [
          "TriageProcessor class created",
          "TriageResult, TriageSignals records defined",
          "classifyPage() method implemented",
          "Unit tests written and passing",
        ],
        testMethod: "cd java && mvn test -Dtest=TriageProcessorTest",
      },
      {
        id: 6,
        name: "DoclingClient",
        nameKorean: "Docling 클라이언트",
        goal: "Implement REST client for docling-serve",
        goalKorean: "docling-serve REST 클라이언트 구현",
        inputs: ["docling-api skill", "HybridConfig"],
        outputs: ["HybridClient.java (인터페이스)", "DoclingClient.java"],
        agentActions: [
          "HybridClient 인터페이스 정의",
          "HTTP 요청/응답 처리 구현",
          "convertAsync() 비동기 메서드 구현",
          "타임아웃 및 에러 처리",
        ],
        successCriteria: [
          "HybridClient interface created",
          "DoclingClient implements interface",
          "convert() and convertAsync() work",
          "Integration test passes with real server",
        ],
        testMethod: "cd java && mvn test -Dtest=DoclingClientIntegrationTest",
      },
      {
        id: 7,
        name: "SchemaTransformer",
        nameKorean: "스키마 변환기",
        goal: "Transform docling JSON to IObject",
        goalKorean: "docling JSON을 IObject로 변환",
        inputs: ["schema-mapping skill", "DoclingClient response"],
        outputs: ["DoclingSchemaTransformer.java"],
        agentActions: [
          "타입별 변환 메서드 구현 (Table, Paragraph, Heading)",
          "좌표계 변환 로직 구현",
          "TableBorder 셀 구조 매핑",
          "transformAll() 배치 메서드 구현",
        ],
        successCriteria: [
          "HybridSchemaTransformer interface created",
          "Table transformation works (TableBorder)",
          "Bounding box coordinate conversion works",
          "Unit tests with sample JSON pass",
        ],
        testMethod: "cd java && mvn test -Dtest=DoclingSchemaTransformerTest",
      },
    ],
  },
  {
    phase: 3,
    name: "Integration",
    nameKorean: "통합",
    description: "Wire components and add logging",
    descriptionKorean: "컴포넌트 연결 및 로깅 추가",
    parallelizable: false,
    tasks: [
      {
        id: 8,
        name: "HybridDocumentProcessor",
        nameKorean: "하이브리드 문서 프로세서",
        goal: "Orchestrate hybrid processing pipeline",
        goalKorean: "하이브리드 처리 파이프라인 오케스트레이션",
        inputs: ["TriageProcessor", "DoclingClient", "SchemaTransformer"],
        outputs: ["HybridDocumentProcessor.java", "DocumentProcessor.java (수정)"],
        agentActions: [
          "전체 페이지 트리아지 실행",
          "Java/Hybrid 경로 분기",
          "CompletableFuture로 병렬 처리",
          "결과 병합 및 페이지 순서 보존",
        ],
        successCriteria: [
          "HybridDocumentProcessor class created",
          "Parallel Java + Hybrid processing works",
          "Result merge preserves page order",
          "Fallback handling on hybrid failure",
        ],
        testMethod: "java -jar ... --hybrid docling input.pdf",
      },
      {
        id: 9,
        name: "Triage Logging",
        nameKorean: "트리아지 로깅",
        goal: "Log triage decisions to JSON",
        goalKorean: "트리아지 결정을 JSON으로 로깅",
        inputs: ["HybridDocumentProcessor"],
        outputs: ["triage.json (출력 파일)"],
        agentActions: [
          "TriageResult JSON 직렬화",
          "페이지별 신호 기록",
          "요약 통계 계산",
          "파일 출력 구현",
        ],
        successCriteria: [
          "Triage results JSON serialization works",
          "File output to prediction directory",
          "All pages recorded with signals",
          "Summary statistics included",
        ],
        testMethod: "cat output/triage.json | jq '.summary'",
      },
    ],
  },
  {
    phase: 4,
    name: "Evaluation",
    nameKorean: "평가",
    description: "Measure triage accuracy and analyze results",
    descriptionKorean: "트리아지 정확도 측정 및 결과 분석",
    parallelizable: false,
    tasks: [
      {
        id: 10,
        name: "Triage Evaluator",
        nameKorean: "트리아지 평가기",
        goal: "Measure triage accuracy against ground truth",
        goalKorean: "정답 대비 트리아지 정확도 측정",
        inputs: ["reference.json (정답)", "triage.json (예측)"],
        outputs: ["evaluator_triage.py", "thresholds.json (수정)"],
        agentActions: [
          "정답에서 테이블 포함 페이지 추출",
          "트리아지 결정과 비교",
          "Recall, Precision, FN, FP 계산",
          "벤치마크 통합",
        ],
        successCriteria: [
          "evaluator_triage.py created",
          "Page-level table extraction works",
          "triage_recall, triage_fn calculated",
          "Integration with run.py complete",
        ],
        testMethod: "./scripts/bench.sh --hybrid docling",
      },
      {
        id: 11,
        name: "Triage Analyzer",
        nameKorean: "트리아지 분석기",
        goal: "Analyze FN cases and suggest improvements",
        goalKorean: "FN 케이스 분석 및 개선안 제안",
        inputs: ["evaluator results", "triage-criteria skill"],
        outputs: [".claude/agents/triage-analyzer.md"],
        agentActions: [
          "FN 케이스 목록 추출",
          "신호 패턴 분석",
          "공통 패턴 식별",
          "임계값 조정 제안",
        ],
        successCriteria: [
          "Agent file created with proper frontmatter",
          "Clear capability description",
          "Workflow documented",
          "Can be invoked in Claude Code session",
        ],
        testMethod: 'claude "Analyze triage results and find why FN is high"',
      },
    ],
  },
];

// Long-Term Memory Data
const memoryCards: MemoryCard[] = [
  {
    id: "skill",
    title: "Skill",
    titleKorean: "Skill",
    description: "Reusable coding patterns and API knowledge that agents can apply across sessions",
    descriptionKorean: "Reusable coding patterns and API knowledge",
    icon: <Brain className="h-5 w-5" />,
    color: "cyan",
    examples: ["docling-api/", "schema-mapping/", "triage-criteria/"],
  },
  {
    id: "task",
    title: "Task",
    titleKorean: "Task",
    description: "Completed work units with inputs, outputs, and success criteria for reference",
    descriptionKorean: "Completed work with I/O and success criteria",
    icon: <Layers className="h-5 w-5" />,
    color: "amber",
    examples: ["HybridConfig", "DoclingClient", "TriageProcessor"],
  },
  {
    id: "research",
    title: "Research",
    titleKorean: "Research",
    description: "Pre-collected data, API specs, and domain analysis for informed decisions",
    descriptionKorean: "Pre-collected data and domain analysis",
    icon: <FileJson2 className="h-5 w-5" />,
    color: "emerald",
    examples: ["docling-openapi.json", "sample-response.json", "iobject-structure.md"],
  },
  {
    id: "experiment",
    title: "Experiments",
    titleKorean: "Experiments",
    description: "Iterative tuning results and benchmarks that inform optimization strategies",
    descriptionKorean: "Tuning results and benchmarks",
    icon: <FlaskConical className="h-5 w-5" />,
    color: "orange",
    examples: ["triage-tuning/", "speed-benchmark/", "threshold-analysis/"],
  },
  {
    id: "design",
    title: "Design",
    titleKorean: "Design",
    description: "Architectural decisions, system diagrams, and design rationale documentation",
    descriptionKorean: "Architecture decisions and diagrams",
    icon: <GitBranch className="h-5 w-5" />,
    color: "violet",
    examples: ["hybrid-architecture.md", "data-flow.md", "api-design.md"],
  },
];

const checklistData: ChecklistCategory[] = [
  {
    id: "task-division",
    title: "Task Division",
    titleKorean: "작업 분할",
    icon: <Scissors className="h-5 w-5" />,
    accentColor: "emerald",
    items: [
      {
        text: "Can one agent complete within context?",
        textKorean: "한 에이전트가 컨텍스트 안에서 완결할 수 있는 크기인가?",
      },
      {
        text: "Are task dependencies clear?",
        textKorean: "Task 간 의존관계가 명확한가?",
      },
    ],
  },
  {
    id: "knowledge-transfer",
    title: "Knowledge Transfer",
    titleKorean: "지식 전달",
    icon: <MessageSquare className="h-5 w-5" />,
    accentColor: "cyan",
    items: [
      {
        text: "Are previous results documented?",
        textKorean: "이전 에이전트의 작업 결과가 기록되어 있는가?",
      },
      {
        text: "Are specs/docs in context?",
        textKorean: "필요한 스펙/문서가 컨텍스트에 들어가 있는가?",
      },
    ],
  },
  {
    id: "completion-criteria",
    title: "Completion Criteria",
    titleKorean: "완료 조건",
    icon: <CheckCircle2 className="h-5 w-5" />,
    accentColor: "violet",
    items: [
      {
        text: "Can agent determine success?",
        textKorean: "에이전트가 스스로 성공 여부를 판단할 수 있는가?",
      },
      {
        text: "Is verification method clear?",
        textKorean: "검증 방법(테스트, 명령어)이 명확한가?",
      },
    ],
  },
];

function getTasksByPhase(phaseId: number): Task[] {
  return tasks.filter((t) => t.phase === phaseId);
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Animated counter hook
function useAnimatedCounter(
  targetValue: number,
  duration: number = 800,
  delay: number = 0,
  mounted: boolean = true
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!mounted) return;

    const startTime = Date.now() + delay;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(targetValue * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration, delay, mounted]);

  return value;
}

// Experiment Stepper Component
function ExperimentStepper({ mounted }: { mounted: boolean }) {
  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 ring-1 ring-amber-500/30">
          <FlaskConical className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Experiment Iterations
          </h2>
          <p className="text-sm text-gray-400">
            Task 10 → Task 11 Triage Optimization
          </p>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="relative">
        {/* SVG Connection Lines with Animation */}
        <svg
          className="absolute left-0 right-0 top-6 h-2 w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="stepperGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {/* Background line */}
          <line
            x1="24"
            y1="4"
            x2="calc(100% - 24px)"
            y2="4"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Animated dashed line */}
          <line
            x1="24"
            y1="4"
            x2="calc(100% - 24px)"
            y2="4"
            stroke="url(#stepperGradient)"
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
            className={`transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
            style={{
              animation: mounted ? "stepperDash 1.5s linear infinite" : "none",
              transitionDelay: "500ms",
            }}
          />
        </svg>

        {/* Steps */}
        <div className="relative flex justify-between">
          {iterations.map((iter, index) => (
            <IterationStep
              key={iter.iteration}
              iteration={iter}
              index={index}
              mounted={mounted}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function IterationStep({
  iteration,
  index,
  mounted,
}: {
  iteration: ExperimentIteration;
  index: number;
  mounted: boolean;
}) {
  const animatedPrecision = useAnimatedCounter(
    iteration.precision,
    800,
    600 + index * 150,
    mounted
  );
  const animatedFP = useAnimatedCounter(
    iteration.falsePositives,
    800,
    600 + index * 150,
    mounted
  );
  const animatedRecall = useAnimatedCounter(
    iteration.recall || 0,
    800,
    600 + index * 150,
    mounted
  );

  const getStepColor = (precision: number) => {
    if (precision >= 100) return "from-emerald-500 to-cyan-500";
    if (precision >= 70) return "from-amber-500 to-yellow-500";
    if (precision >= 40) return "from-orange-500 to-amber-500";
    return "from-rose-500 to-orange-500";
  };

  return (
    <div
      className={`flex flex-col items-center transition-all duration-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${400 + index * 100}ms` }}
    >
      {/* Step Circle */}
      <div
        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${getStepColor(
          iteration.precision
        )} text-white font-bold text-lg shadow-lg ${
          iteration.isBreakthrough
            ? "ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-zinc-900"
            : ""
        }`}
      >
        {iteration.iteration}
        {iteration.isBreakthrough && (
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-yellow-400 animate-pulse" />
        )}
      </div>

      {/* Metric Card */}
      <div
        className={`mt-4 w-28 rounded-xl border p-3 text-center backdrop-blur-sm transition-all ${
          iteration.isBreakthrough
            ? "border-emerald-400/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
            : "border-white/10 bg-white/5"
        }`}
      >
        {/* Precision */}
        <div className="flex items-center justify-center gap-1">
          <Target className="h-3 w-3 text-cyan-400" />
          <span className="font-mono text-sm font-bold text-white">
            {animatedPrecision}%
          </span>
        </div>

        {/* Recall or FP */}
        {iteration.recall !== undefined ? (
          <div className="mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="font-mono text-xs font-semibold text-emerald-400">
              R: {animatedRecall}%
            </span>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-center gap-1 text-xs">
            <span className="text-gray-400">FP:</span>
            <span className="font-mono font-medium text-orange-400">{animatedFP}</span>
          </div>
        )}

        {/* Change Label */}
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="text-[10px] font-medium leading-tight text-gray-300">
            {iteration.changeKorean}
          </p>
        </div>
      </div>
    </div>
  );
}

// Phase Details Component
function PhaseDetailsSection({ mounted }: { mounted: boolean }) {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());

  const togglePhase = (phaseId: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-500/30">
          <Layers className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Phase Details</h2>
          <p className="text-sm text-gray-400">
            What each agent does in every phase
          </p>
        </div>
      </div>

      {/* Phase Accordion */}
      <div className="space-y-3">
        {phaseDetails.map((phase, phaseIndex) => {
          const isExpanded = expandedPhases.has(phase.phase);

          return (
            <div
              key={phase.phase}
              className={`overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${600 + phaseIndex * 80}ms` }}
            >
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.phase)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      phase.parallelizable
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {phase.parallelizable ? (
                      <GitBranch className="h-4 w-4" />
                    ) : (
                      <GitCommitHorizontal className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        Phase {phase.phase}: {phase.name}
                      </span>
                      {phase.parallelizable && (
                        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                          Parallel
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {phase.descriptionKorean}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {phase.tasks.length} Task{phase.tasks.length > 1 ? "s" : ""}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Phase Content */}
              <div
                className={`grid transition-all duration-300 ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 border-t border-white/10 p-4">
                    {phase.tasks.map((task) => (
                      <TaskDetailCard
                        key={task.id}
                        task={task}
                        phaseColor={phase.parallelizable ? "cyan" : "amber"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Task Detail Card Component
function TaskDetailCard({
  task,
  phaseColor,
}: {
  task: TaskDetail;
  phaseColor: "cyan" | "amber";
}) {
  const colorStyles = {
    cyan: {
      border: "border-cyan-400/30",
      bg: "bg-cyan-500/5",
      accent: "text-cyan-400",
      badge: "bg-cyan-500/20 text-cyan-400",
    },
    amber: {
      border: "border-amber-400/30",
      bg: "bg-amber-500/5",
      accent: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-400",
    },
  };

  const styles = colorStyles[phaseColor];

  return (
    <div
      className={`rounded-lg border ${styles.border} ${styles.bg} p-4 transition-all hover:border-white/20`}
    >
      {/* Task Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md ${styles.badge} text-xs font-bold`}
          >
            {task.id >= 0 ? task.id : "-1"}
          </span>
          <div>
            <h4 className="text-sm font-semibold text-white">{task.name}</h4>
            <p className="text-xs text-gray-400">{task.nameKorean}</p>
          </div>
        </div>
        <Bot className={`h-4 w-4 ${styles.accent}`} />
      </div>

      {/* Goal */}
      <p className="mb-3 text-sm text-gray-300">{task.goalKorean}</p>

      {/* Inputs & Outputs */}
      <div className="mb-3 grid gap-2 md:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-md border border-white/5 bg-white/[0.02] p-2">
          <div className="mb-1.5 flex items-center gap-1.5">
            <ArrowDownToLine className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              Inputs
            </span>
          </div>
          <div className="space-y-1">
            {task.inputs.map((input, i) => (
              <div key={i} className="font-mono text-xs text-gray-400">
                {input}
              </div>
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div className="rounded-md border border-white/5 bg-white/[0.02] p-2">
          <div className="mb-1.5 flex items-center gap-1.5">
            <ArrowUpFromLine className="h-3 w-3 text-violet-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-violet-400">
              Outputs
            </span>
          </div>
          <div className="space-y-1">
            {task.outputs.map((output, i) => (
              <div key={i} className="font-mono text-xs text-gray-400">
                {output}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Actions */}
      <div className="rounded-md border border-white/5 bg-white/[0.02] p-2">
        <div className="mb-2 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-yellow-400" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-yellow-400">
            Agent Actions
          </span>
        </div>
        <div className="space-y-1.5">
          {task.agentActions.map((action, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
              <span className="text-xs text-gray-300">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success Criteria & Test Method */}
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {/* Success Criteria */}
        <div className="rounded-md border border-white/5 bg-white/[0.02] p-2">
          <div className="mb-2 flex items-center gap-1.5">
            <CircleCheck className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              Success Criteria
            </span>
          </div>
          <div className="space-y-1.5">
            {task.successCriteria.map((criteria, i) => (
              <div key={i} className="flex items-start gap-2">
                <Square className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500/50" />
                <span className="text-xs text-gray-300">{criteria}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Method */}
        <div className="rounded-md border border-white/5 bg-white/[0.02] p-2">
          <div className="mb-2 flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-pink-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-pink-400">
              Test Method
            </span>
          </div>
          <code className="block rounded bg-black/30 px-2 py-1.5 font-mono text-[11px] text-gray-300">
            {task.testMethod}
          </code>
        </div>
      </div>
    </div>
  );
}

// Checklist Component
function ChecklistSection({ mounted }: { mounted: boolean }) {
  const accentStyles = {
    emerald: {
      border: "border-t-emerald-400",
      icon: "text-emerald-400",
      bg: "bg-emerald-500/10",
      checkbox: "text-emerald-500",
    },
    cyan: {
      border: "border-t-cyan-400",
      icon: "text-cyan-400",
      bg: "bg-cyan-500/10",
      checkbox: "text-cyan-500",
    },
    violet: {
      border: "border-t-violet-400",
      icon: "text-violet-400",
      bg: "bg-violet-500/10",
      checkbox: "text-violet-500",
    },
  };

  return (
    <div className="space-y-6">
      {/* Checklist Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 ring-1 ring-violet-500/30">
          <CheckCircle2 className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Multi-Agent Checklist
          </h2>
          <p className="text-sm text-gray-400">
            Preventing agents from repeating mistakes
          </p>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {checklistData.map((category, catIndex) => {
          const styles = accentStyles[category.accentColor];

          return (
            <div
              key={category.id}
              className={`rounded-xl border border-t-2 border-white/10 ${styles.border} ${styles.bg} p-4 backdrop-blur-sm transition-all duration-500 hover:border-white/20 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${800 + catIndex * 100}ms` }}
            >
              {/* Category Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.bg}`}>
                  <span className={styles.icon}>{category.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {category.title}
                  </h3>
                  <p className="text-xs text-gray-400">{category.titleKorean}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/5"
                  >
                    <Square className={`mt-0.5 h-4 w-4 shrink-0 ${styles.checkbox} transition-colors`} />
                    <div>
                      <p className="text-sm leading-snug text-gray-200">
                        {item.textKorean}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MultiAgentsDesignPage() {
  const [mounted, setMounted] = useState(false);
  const [nodePositions, setNodePositions] = useState<
    Record<string, NodePosition>
  >({});
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const calculatePositions = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const positions: Record<string, NodePosition> = {};

    Object.entries(nodeRefs.current).forEach(([id, ref]) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        positions[id] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        };
      }
    });

    setNodePositions(positions);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      calculatePositions();
    }, 100);

    window.addEventListener("resize", calculatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePositions);
    };
  }, [calculatePositions]);

  const renderConnections = () => {
    const paths: React.ReactNode[] = [];

    const phaseConnections = [
      { fromPhase: -1, toPhase: 0 },
      { fromPhase: 0, toPhase: 1 },
      { fromPhase: 1, toPhase: 2 },
      { fromPhase: 2, toPhase: 3 },
      { fromPhase: 3, toPhase: 4 },
    ];

    phaseConnections.forEach(({ fromPhase, toPhase }) => {
      const fromTasks = tasks.filter((t) => t.phase === fromPhase);
      const toTasks = tasks.filter((t) => t.phase === toPhase);

      if (fromTasks.length === 0 || toTasks.length === 0) return;

      const fromPositions = fromTasks
        .map((t) => nodePositions[t.id])
        .filter(Boolean);
      const toPositions = toTasks
        .map((t) => nodePositions[t.id])
        .filter(Boolean);

      if (fromPositions.length === 0 || toPositions.length === 0) return;

      const fromCenterY =
        fromPositions.reduce((sum, p) => sum + p.y, 0) / fromPositions.length;
      const toCenterY =
        toPositions.reduce((sum, p) => sum + p.y, 0) / toPositions.length;

      const fromX = Math.max(...fromPositions.map((p) => p.x + p.width / 2));
      const toX = Math.min(...toPositions.map((p) => p.x - p.width / 2));

      const deltaX = toX - fromX;
      const controlOffset = Math.min(Math.abs(deltaX) * 0.4, 40);
      const path = `M ${fromX} ${fromCenterY} C ${fromX + controlOffset} ${fromCenterY}, ${toX - controlOffset} ${toCenterY}, ${toX} ${toCenterY}`;

      paths.push(
        <path
          key={`phase-${fromPhase}-${toPhase}`}
          d={path}
          stroke="rgba(16, 185, 129, 0.5)"
          strokeWidth={2}
          fill="none"
          strokeDasharray="6 4"
          className="animate-flow-dash"
        />
      );
    });

    return paths;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 p-4 pt-20 md:p-8 md:pt-24">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8">
        {/* Section 1: DAG Workflow */}
        <section
          className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 ring-1 ring-emerald-500/30">
              <Bot className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Multi-Agent Pipeline
              </h1>
              <p className="text-sm text-gray-400">
                Hybrid mode implementation workflow with parallel task execution
              </p>
            </div>
          </div>

          {/* Diagram Container */}
          <div ref={containerRef} className="relative overflow-x-auto pb-4">
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {mounted && renderConnections()}
            </svg>

            {/* Phase Columns */}
            <div className="flex min-w-max justify-center gap-2">
              {phases.map((phase, phaseIndex) => {
                const phaseTasks = getTasksByPhase(phase.id);
                const hasParallelTasks = phaseTasks.some(
                  (t) => t.isParallelizable
                );

                return (
                  <div
                    key={phase.id}
                    className={`flex w-40 flex-col transition-opacity duration-500 ${
                      mounted ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ transitionDelay: `${phaseIndex * 80}ms` }}
                  >
                    <div className="mb-3 text-center">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        {phase.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {phase.description}
                      </div>
                    </div>

                    <div
                      className={`flex flex-1 flex-col justify-center gap-2 rounded-lg border p-2 ${
                        hasParallelTasks
                          ? "border-dashed border-white/30"
                          : "border-transparent"
                      }`}
                    >
                      <div className="mb-1 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        {hasParallelTasks ? "Parallel" : "Sequential"}
                      </div>
                      {phaseTasks.map((task) => {
                        const globalIndex = tasks.findIndex(
                          (t) => t.id === task.id
                        );

                        return (
                          <div
                            key={task.id}
                            ref={(el) => {
                              nodeRefs.current[task.id] = el;
                            }}
                            className={`group relative flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 px-3 py-2 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 ${
                              mounted ? "opacity-100" : "opacity-0"
                            }`}
                            style={{
                              transitionDelay: `${200 + globalIndex * 60}ms`,
                            }}
                          >
                            <Bot className="h-3.5 w-3.5 shrink-0 text-white" />
                            <span className="truncate text-xs font-medium text-white">
                              {task.shortName}
                            </span>

                            <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              {task.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Long-Term Memory Section */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Long-Term Memory</span>
            </div>

            {/* 5-column memory cards - unified purple/violet tone */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {memoryCards.map((card, cardIndex) => (
                <div
                  key={card.id}
                  className={`group rounded-lg border border-purple-400/20 bg-purple-500/10 p-3 transition-all duration-500 hover:border-purple-400/40 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                  style={{ transitionDelay: `${600 + cardIndex * 60}ms` }}
                >
                  {/* Header with icon */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20">
                      <span className="text-purple-400">{card.icon}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-purple-300">{card.title}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-2 text-[10px] leading-relaxed text-gray-400">
                    {card.descriptionKorean}
                  </p>

                  {/* Examples */}
                  <div className="space-y-1">
                    {card.examples.slice(0, 2).map((example, i) => (
                      <div key={i} className="truncate font-mono text-[9px] text-gray-500">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-emerald-500 to-cyan-500" />
                <span>Task</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-5 rounded border border-dashed border-white/20" />
                <span>Parallel</span>
              </div>
              <div className="mx-1 h-3 w-px bg-white/20" />
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-purple-500/60" />
                <span>Memory</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">12 Tasks · 5 Memory Types</div>
          </div>
        </section>

        {/* Section 2: Experiment Iterations */}
        <section
          className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <ExperimentStepper mounted={mounted} />
        </section>

        {/* Section 3: Phase Details */}
        <section
          className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <PhaseDetailsSection mounted={mounted} />
        </section>

        {/* Section 4: Checklist Guide */}
        <section
          className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <ChecklistSection mounted={mounted} />
        </section>
      </div>
    </div>
  );
}
