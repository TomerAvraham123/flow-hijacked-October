import { z } from 'zod';

const answerSectionSchema = z.object({
  title: z.string(),
  body: z.string(),
  sourceIds: z.array(z.string()),
});

export const askDestinationTypeSchema = z.enum([
  'recovery_field',
  'lecture',
  'brain_atlas',
  'neuromodulation',
  'therapy_routes',
  'research',
  'here_and_now',
  'concept',
  'toolkit',
  'professional_support',
  'urgent_support',
]);

const internalHrefSchema = z.string().refine(
  (value) => value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') && !/[\u0000-\u001F]/.test(value),
  'Expected a canonical internal path',
);

const destinationSchema = z.object({
  type: askDestinationTypeSchema,
  label: z.string(),
  description: z.string(),
  href: internalHrefSchema,
  sourceId: z.string().optional(),
});

const citationSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  sourceIds: z.array(z.string()).optional(),
  title: z.string(),
  locator: z.string().optional(),
  href: z.string().refine((value) => {
    if (internalHrefSchema.safeParse(value).success) return true;
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Expected an HTTPS or canonical internal citation'),
  evidenceType: z.enum([
    'established_research',
    'flow_hijacked_synthesis',
    'lived_experience_interpretation',
    'practical_guidance',
  ]),
  publication: z.string().optional(),
});

export const askAnswerSchema = z.object({
  question: z.string(),
  language: z.enum(['en', 'he']),
  intent: z.string(),
  topic: z.string(),
  confidence: z.number().min(0).max(1),
  confidenceLabel: z.enum(['high', 'moderate', 'limited']),
  retrievalMode: z.string(),
  grounded: z.boolean(),
  ambiguity: z.object({
    level: z.number(),
    interpretation: z.string().optional(),
    clarificationQuestion: z.string().optional(),
  }),
  conceptualCorrection: z.string().optional(),
  directAnswer: answerSectionSchema,
  mechanisms: answerSectionSchema,
  flowLens: answerSectionSchema.optional(),
  whatMightHelp: answerSectionSchema.optional(),
  bestNextStep: destinationSchema,
  exploreFurther: z.array(destinationSchema),
  citations: z.array(citationSchema),
  refinementOptions: z.array(z.string()),
  memoryUpdate: z.object({
    concepts: z.array(z.string()),
    interests: z.array(z.string()),
  }),
  generatedBy: z.string(),
});

export const askResponseSchema = z.object({ answer: askAnswerSchema });

export type AskAnswer = z.infer<typeof askAnswerSchema>;
export type AskDestination = z.infer<typeof destinationSchema>;
export type AskCitation = z.infer<typeof citationSchema>;
export type AskDepth = 'concise' | 'balanced' | 'deep';
export type AskStyle = 'mixed' | 'intuitive' | 'scientific' | 'clinical' | 'mathematical';

export interface AskKnowledgeMemory {
  version: 1;
  enabled: boolean;
  language: 'en' | 'he';
  depth: AskDepth;
  style: AskStyle;
  conceptsExplored: string[];
  resourcesExplored: { href: string; title: string; type: string }[];
  usefulDestinationTypes: string[];
  recurringInterests: string[];
  updatedAt: string;
}

export interface RecoveryContextGrant {
  sleep?: 'low' | 'available';
  stress?: 'high' | 'moderate';
  connection?: 'low' | 'available';
}
