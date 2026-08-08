export type Locale = 'en' | 'he';

export type Bilingual = Readonly<{ en: string; he: string }>;

export type FieldDimensionId =
  | 'body'
  | 'mind'
  | 'control'
  | 'relationships'
  | 'world'
  | 'future';

export type FieldDimensions = Record<FieldDimensionId, number>;

export type SmallestReturn = 'better' | 'same' | 'harder' | 'unsure';

export type ChangeSignal =
  | 'sleep'
  | 'stress'
  | 'craving'
  | 'shame'
  | 'conflict'
  | 'isolation'
  | 'flatness'
  | 'structure';

export type FieldState = 'compressed' | 'narrow' | 'reorganizing' | 'widening' | 'supported';

export type DimensionState = 'very_low' | 'low' | 'available' | 'high' | 'uncertain';
export type DimensionChange = 'opening' | 'stable' | 'compressing' | 'unknown';

export interface CheckIn {
  id: string;
  createdAt: string;
  smallestReturn: SmallestReturn;
  dimensions: FieldDimensions;
  observedDimensions?: FieldDimensionId[];
  signals: ChangeSignal[];
  capacityMode: 'quiet' | 'standard';
  note?: string;
}

export interface FieldDimensionView {
  id: FieldDimensionId;
  value: number;
  state: DimensionState;
  change: DimensionChange;
  observed: boolean;
}

export interface FieldRelationship {
  from: FieldDimensionId;
  to: FieldDimensionId;
  strength: 'subtle' | 'moderate' | 'strong';
  status: 'established' | 'possible';
}

export interface FieldSnapshot {
  id: string;
  createdAt: string;
  dimensions: FieldDimensionView[];
  relationships: FieldRelationship[];
  state: FieldState;
  availableDegrees: number;
  totalDegrees: number;
  bottlenecks: FieldDimensionId[];
  pressure: ChangeSignal[];
}

export type InterventionDomain =
  | 'body'
  | 'mind'
  | 'relationships'
  | 'recovery-support'
  | 'structure'
  | 'meaning';

export interface Intervention {
  id: string;
  domain: InterventionDomain;
  role: 'anchor' | 'build' | 'close' | 'future' | 'bridge';
  family: string;
  title: Bilingual;
  instruction: Bilingual;
  why: Bilingual;
  doses: number[];
  goals: string[];
  targets: string[];
  evidenceTier: 'A' | 'B' | 'C';
}

export interface InterventionGoal {
  id: string;
  label: Bilingual;
}

export interface InterventionRoute {
  id: string;
  kind: 'body' | 'load' | 'connection';
  title: Bilingual;
  subtitle: Bilingual;
  rationale: Bilingual;
  durationMinutes: number;
  effort: 'very_low' | 'low' | 'moderate';
  steps: Intervention[];
  isBestNextStep: boolean;
}

export interface ActionFeedback {
  checkInId: string;
  routeId: string;
  startedAt: string;
  completedAt?: string;
  feasibility?: 'not_possible' | 'hard' | 'possible';
  outcome?: 'worse' | 'same' | 'little' | 'clear';
}

export interface WeeklyReflection {
  weekId: string;
  entryCount: number;
  observation: Bilingual;
  availableAnchor: Bilingual;
  change: Bilingual;
  question: Bilingual;
  experiment: Bilingual;
  evidenceBoundary: Bilingual;
}
