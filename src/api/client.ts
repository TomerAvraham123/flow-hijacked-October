import { z } from 'zod';

import { API_BASE_URL } from './config';
import { askResponseSchema, type AskAnswer, type AskDepth, type AskKnowledgeMemory, type AskStyle, type RecoveryContextGrant } from '@/types/ask';
import type { Locale } from '@/types/recovery';

export const MAX_ASK_QUESTION_CHARS = 1600;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function requestJson<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'omit',
    headers: {
      accept: 'application/json',
      'x-flow-client': 'android-v1',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError('Flow Hijacked service is unavailable', response.status);
  }

  const data: unknown = await response.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError('The server returned an unexpected response');
  }
  return parsed.data;
}

export interface AskRequest {
  question: string;
  language: Locale;
  depth: AskDepth;
  style: AskStyle;
  memory: AskKnowledgeMemory | null;
  sessionContext?: {
    previousQuestion: string;
    previousTopic: string;
    previousAnswerSummary: string;
  };
  recoveryContext?: RecoveryContextGrant;
}

export async function askFlowHijacked(request: AskRequest, signal?: AbortSignal): Promise<AskAnswer> {
  if (request.question.length > MAX_ASK_QUESTION_CHARS) {
    throw new ApiError('The question is longer than the supported Ask limit');
  }
  // The deployed web endpoint predates the mobile structured-context field. Until the
  // server façade accepts a first-class context grant, encode only the explicitly
  // consented, whitelisted categorical facts in a bounded compatibility line. Raw
  // Recovery history and free text never enter this adapter.
  const contextFacts = request.recoveryContext
    ? Object.entries(request.recoveryContext).map(([dimension, state]) => `${dimension} ${state}`)
    : [];
  const serverQuestion = contextFacts.length
    ? `${request.question}\n\n[Optional Recovery Field context explicitly shared for this answer only: ${contextFacts.join('; ')}.]`
    : request.question;
  const { recoveryContext: _recoveryContext, ...rest } = request;
  const payload = await requestJson(
    '/api/ask',
    {
      method: 'POST',
      ...(signal ? { signal } : {}),
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...rest, question: serverQuestion }),
    },
    askResponseSchema,
  );
  return { ...payload.answer, question: request.question };
}

export async function sendAskFeedback(
  answer: Pick<AskAnswer, 'confidenceLabel'>,
  result: 'yes' | 'partly' | 'not_quite',
  language: Locale,
): Promise<void> {
  await fetch(`${API_BASE_URL}/api/ask/feedback`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-flow-client': 'android-v1' },
    body: JSON.stringify({
      event: result === 'yes' ? 'feedback_yes' : result === 'partly' ? 'feedback_partly' : 'feedback_not_quite',
      confidence: answer.confidenceLabel,
      destination: 'none',
      language,
    }),
  });
}
