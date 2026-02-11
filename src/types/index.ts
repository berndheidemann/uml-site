// === Diagram Types ===

export type DiagramType =
  | 'klassendiagramm'
  | 'sequenzdiagramm'
  | 'zustandsdiagramm'
  | 'aktivitaetsdiagramm'
  | 'usecasediagramm'
  | 'uebergreifend'

export type ExerciseLevel = 1 | 2 | 3

// === Exercise Types (Discriminated Union) ===

export type ExerciseType =
  | 'drag-drop-zuordnung'
  | 'drag-drop-sortierung'
  | 'drag-drop-connector'
  | 'multiple-choice'
  | 'decision'
  | 'timed-challenge'
  | 'simulator'
  | 'hotspot'
  | 'paintbrush'
  | 'text-extraction'
  | 'lueckentext'
  | 'diagram-builder'
  | 'debugger'
  | 'guard-evaluator'
  | 'custom'

// === Exercise Base ===

export interface ExerciseBase {
  id: string
  version: number
  title: string
  description: string
  diagramType: DiagramType
  exerciseType: ExerciseType
  level: ExerciseLevel
  maxPoints: number
  hints?: string[]
}

// === Drag & Drop Exercises ===

export interface DragItem {
  id: string
  content: string
  category?: string
}

export interface DropZone {
  id: string
  label: string
  accepts?: string[]
}

export interface DragDropZuordnungExercise extends ExerciseBase {
  exerciseType: 'drag-drop-zuordnung'
  items: DragItem[]
  zones: DropZone[]
  correctMapping: Record<string, string> // itemId -> zoneId
}

export interface DragDropSortierungExercise extends ExerciseBase {
  exerciseType: 'drag-drop-sortierung'
  items: DragItem[]
  correctOrder: string[] // itemIds in correct order
}

export interface ConnectorPosition {
  id: string
  label: string
  x: number
  y: number
}

export interface DragDropConnectorExercise extends ExerciseBase {
  exerciseType: 'drag-drop-connector'
  items: DragItem[]
  positions: ConnectorPosition[]
  correctMapping: Record<string, string> // itemId -> positionId
  diagramCode?: string // PlantUML code for background diagram
  svgContent?: string // Inline SVG content for background diagram
}

// === Multiple Choice & Decision ===

export interface MCOption {
  id: string
  text: string
  explanation?: string
}

export interface MultipleChoiceExercise extends ExerciseBase {
  exerciseType: 'multiple-choice'
  question: string
  options: MCOption[]
  correctOptionIds: string[]
  multiSelect: boolean
}

export interface DecisionScenario {
  id: string
  description: string
  options: MCOption[]
  correctOptionId: string
  criteria?: { id: string; label: string; correctId: string }[]
}

export interface DecisionExercise extends ExerciseBase {
  exerciseType: 'decision'
  scenarios: DecisionScenario[]
}

// === Timed Challenge ===

export interface TimedQuestion {
  id: string
  visual?: React.ReactNode
  svgContent?: string
  question: string
  options: MCOption[]
  correctOptionId: string
}

export interface TimedChallengeExercise extends ExerciseBase {
  exerciseType: 'timed-challenge'
  timePerQuestion: number // seconds
  questions: TimedQuestion[]
}

// === Hotspot ===

export interface HotspotRegion {
  id: string
  shape: 'rect' | 'circle' | 'polygon'
  coords: number[]
  label: string
  isCorrect: boolean
  feedback?: string
}

export interface HotspotExerciseData extends ExerciseBase {
  exerciseType: 'hotspot'
  question: string
  svgContent: string
  regions: HotspotRegion[]
  multiSelect: boolean
}

// === Paintbrush ===

export type LineStyle = 'solid' | 'dashed'
export type ArrowHead = 'open' | 'closed' | 'filled' | 'none'
export type DiamondStyle = 'empty' | 'filled' | 'none'

export interface PaintbrushLine {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  correctLineStyle: LineStyle
  correctArrowHead: ArrowHead
  correctDiamond: DiamondStyle
  label?: string
}

export interface PaintbrushExerciseData extends ExerciseBase {
  exerciseType: 'paintbrush'
  svgWidth: number
  svgHeight: number
  lines: PaintbrushLine[]
  classes?: { x: number; y: number; width: number; height: number; name: string }[]
}

// === Text Extraction ===

export interface TextPhrase {
  id: string
  text: string
  startIndex: number
  endIndex: number
  correctCategory: string
}

export interface TextExtractionExerciseData extends ExerciseBase {
  exerciseType: 'text-extraction'
  sourceText: string
  phrases: TextPhrase[]
  categories: { id: string; label: string; color: string }[]
}

// === Lückentext ===

export interface LueckentextGap {
  id: string
  correctAnswers: string[] // multiple accepted answers
  placeholder?: string
}

export interface LueckentextExerciseData extends ExerciseBase {
  exerciseType: 'lueckentext'
  // Template uses {{gapId}} for gaps
  template: string
  gaps: LueckentextGap[]
}

// === Diagram Builder ===

export interface BuilderStep {
  id: string
  instruction: string
  expectedCode: string
  hints?: string[]
}

export interface DiagramBuilderExercise extends ExerciseBase {
  exerciseType: 'diagram-builder'
  steps: BuilderStep[]
  finalDiagramCode: string
}

// === Debugger (Fehlersuche) ===

export interface DiagramError {
  id: string
  regionId: string
  description: string
  explanation: string
  correctedSvgContent?: string
}

export interface DebuggerExerciseData extends ExerciseBase {
  exerciseType: 'debugger'
  svgContent: string
  errors: DiagramError[]
  clickableRegions: HotspotRegion[]
  penaltyPerFalseAlarm: number
}

// === Guard Evaluator ===

export interface GuardVariable {
  name: string
  type: 'number' | 'boolean'
  min?: number
  max?: number
  defaultValue: number | boolean
}

export interface GuardTransition {
  id: string
  from: string
  to: string
  event: string
  guard: string
  guardExpression: string // parseable expression
  action?: string
}

export interface GuardEvaluatorExercise extends ExerciseBase {
  exerciseType: 'guard-evaluator'
  states: { id: string; label: string; x: number; y: number }[]
  transitions: GuardTransition[]
  variables: GuardVariable[]
  scenarios: { variableValues: Record<string, number | boolean>; currentState: string; correctTransitionId: string | null }[]
}

// === Simulator ===

export interface SimulatorState {
  id: string
  label: string
  x: number
  y: number
  isInitial?: boolean
  isFinal?: boolean
  entryAction?: string
  doAction?: string
  exitAction?: string
}

export interface SimulatorTransition {
  id: string
  from: string
  to: string
  event: string
  guard?: string
  guardExpression?: string
  action?: string
  variableUpdates?: Record<string, string> // variable name -> expression
}

export interface SimulatorExercise extends ExerciseBase {
  exerciseType: 'simulator'
  states: SimulatorState[]
  transitions: SimulatorTransition[]
  variables: GuardVariable[]
  expectedSequence?: { event: string; expectedState: string }[]
}

// === Union Type for all Exercises ===

export type Exercise =
  | DragDropZuordnungExercise
  | DragDropSortierungExercise
  | DragDropConnectorExercise
  | MultipleChoiceExercise
  | DecisionExercise
  | TimedChallengeExercise
  | HotspotExerciseData
  | PaintbrushExerciseData
  | TextExtractionExerciseData
  | LueckentextExerciseData
  | DiagramBuilderExercise
  | DebuggerExerciseData
  | GuardEvaluatorExercise
  | SimulatorExercise

// === Progress ===

export interface ExerciseProgress {
  exerciseId: string
  version: number
  completed: boolean
  score: number
  maxScore: number
  attempts: number
  lastAttempt?: string // ISO date string
}

export interface ChapterProgress {
  diagramType: DiagramType
  theoryRead: boolean
  exercises: Record<string, ExerciseProgress>
}

// === Validation ===

export interface ValidationDetail {
  itemId: string
  correct: boolean
  feedback?: string
}

export interface ValidationResult {
  correct: boolean
  score: number
  maxScore: number
  feedback: string
  details?: ValidationDetail[]
}

// === Content Block Types ===

export interface TextBlock {
  type: 'text'
  html: string
}

export interface InfoBlock {
  type: 'info'
  title?: string
  html: string
}

export interface TipBlock {
  type: 'tip'
  title?: string
  html: string
}

export interface WarningBlock {
  type: 'warning'
  title?: string
  html: string
}

export interface ImportantBlock {
  type: 'important'
  title?: string
  html: string
}

export interface ComparisonSide {
  title: string
  color: string
  points: string[]
}

export interface ComparisonBlock {
  type: 'comparison'
  left: ComparisonSide
  right: ComparisonSide
}

export interface TableBlock {
  type: 'table'
  headers: string[]
  rows: string[][]
}

export interface CodeBlock {
  type: 'code'
  language?: string
  label?: string
  code: string
}

export interface DiagramBlock {
  type: 'diagram'
  code: string
  alt: string
  caption?: string
}

export interface SummaryBlock {
  type: 'summary'
  title?: string
  points: string[]
}

export type ContentBlock =
  | TextBlock
  | InfoBlock
  | TipBlock
  | WarningBlock
  | ImportantBlock
  | ComparisonBlock
  | TableBlock
  | CodeBlock
  | DiagramBlock
  | SummaryBlock

// === Theory Content ===

export interface TheorySection {
  id: string
  title: string
  content: ContentBlock[]
  subsections?: TheorySection[]
}

export interface ChapterContent {
  diagramType: DiagramType
  title: string
  introduction: string
  sections: TheorySection[]
  interactiveExample?: {
    title: string
    description: string
    steps: {
      label: string
      diagramCode: string
      explanation: string
    }[]
  }
}
