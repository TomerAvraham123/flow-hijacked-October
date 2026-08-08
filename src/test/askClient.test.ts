import { askFlowHijacked, MAX_ASK_QUESTION_CHARS, sendAskFeedback } from '@/api/client';
import { askResponseSchema, type AskKnowledgeMemory } from '@/types/ask';

const answer = {
  question: 'server question',
  language: 'en' as const,
  intent: 'understand',
  topic: 'sleep and craving',
  confidence: 0.8,
  confidenceLabel: 'high' as const,
  retrievalMode: 'corpus',
  grounded: true,
  ambiguity: { level: 0 },
  directAnswer: { title: 'Direct answer', body: 'A grounded answer.', sourceIds: ['s1'] },
  mechanisms: { title: 'What may be happening', body: 'A mechanism.', sourceIds: ['s1'] },
  bestNextStep: { type: 'brain_atlas' as const, label: 'Inspect a circuit', description: 'Continue', href: '/atlas?region=insula' },
  exploreFurther: [],
  citations: [],
  refinementOptions: [],
  memoryUpdate: { concepts: [], interests: [] },
  generatedBy: 'flow-hijacked',
};

const memory: AskKnowledgeMemory = {
  version: 1,
  enabled: true,
  language: 'en',
  depth: 'balanced',
  style: 'mixed',
  conceptsExplored: [],
  resourcesExplored: [],
  usefulDestinationTypes: [],
  recurringInterests: [],
  updatedAt: '2026-08-08T00:00:00.000Z',
};

describe('Ask native client boundary', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ answer }),
    })) as jest.Mock;
  });

  it('shares only opted-in categorical Recovery context and restores the visible question', async () => {
    const result = await askFlowHijacked({
      question: 'Why is tonight harder?',
      language: 'en',
      depth: 'balanced',
      style: 'mixed',
      memory,
      recoveryContext: { sleep: 'low', stress: 'high' },
    });

    const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] ?? [];
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(payload.question).toContain('sleep low; stress high');
    expect(payload).not.toHaveProperty('recoveryContext');
    expect(payload.question).not.toContain('history');
    expect(result.question).toBe('Why is tonight harder?');
  });

  it('does not add Recovery context without an explicit grant', async () => {
    await askFlowHijacked({
      question: 'What does craving do to attention?',
      language: 'en',
      depth: 'concise',
      style: 'scientific',
      memory: null,
    });
    const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] ?? [];
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(payload.question).toBe('What does craving do to attention?');
  });

  it('rejects protocol-relative destinations while allowing external citations', () => {
    const invalid = {
      answer: {
        ...answer,
        bestNextStep: { ...answer.bestNextStep, href: '//outside.example/path' },
        citations: [{
          id: 'doi',
          sourceId: 'doi',
          title: 'External paper',
          href: 'https://doi.org/10.1000/example',
          evidenceType: 'established_research',
        }],
      },
    };
    expect(askResponseSchema.safeParse(invalid).success).toBe(false);
    expect(askResponseSchema.safeParse({
      answer: {
        ...answer,
        citations: invalid.answer.citations,
      },
    }).success).toBe(true);
  });

  it('rejects unsafe citation schemes and overlong questions before networking', async () => {
    expect(askResponseSchema.safeParse({
      answer: {
        ...answer,
        citations: [{
          id: 'unsafe',
          sourceId: 'unsafe',
          title: 'Unsafe source',
          href: 'javascript:alert(1)',
          evidenceType: 'established_research',
        }],
      },
    }).success).toBe(false);

    await expect(askFlowHijacked({
      question: 'x'.repeat(MAX_ASK_QUESTION_CHARS + 1),
      language: 'en',
      depth: 'balanced',
      style: 'mixed',
      memory: null,
    })).rejects.toThrow('supported Ask limit');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('sends useful-answer feedback without question or topic content', async () => {
    await sendAskFeedback(answer, 'partly', 'en');
    const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] ?? [];
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(payload).toEqual({
      event: 'feedback_partly',
      confidence: 'high',
      destination: 'none',
      language: 'en',
    });
    expect(payload).not.toHaveProperty('question');
    expect(payload).not.toHaveProperty('topic');
  });
});
