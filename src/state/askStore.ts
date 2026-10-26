import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createEncryptedStorage } from '@/storage/encryptedStorage';
import type { AskAnswer, AskDepth, AskKnowledgeMemory, AskStyle } from '@/types/ask';
import type { Locale } from '@/types/recovery';

function defaultMemory(locale: Locale): AskKnowledgeMemory {
  return {
    version: 1,
    enabled: false,
    language: locale,
    depth: 'balanced',
    style: 'mixed',
    conceptsExplored: [],
    resourcesExplored: [],
    usefulDestinationTypes: [],
    recurringInterests: [],
    updatedAt: new Date(0).toISOString(),
  };
}

interface AskState {
  hydrated: boolean;
  memory: AskKnowledgeMemory;
  currentAnswer: AskAnswer | null;
  previousAnswer: AskAnswer | null;
  savedAnswers: AskAnswer[];
  useRecoveryContext: boolean;
  setHydrated: (value: boolean) => void;
  setPreferences: (locale: Locale, depth: AskDepth, style: AskStyle) => void;
  enableMemory: (locale: Locale) => void;
  setCurrentAnswer: (answer: AskAnswer) => void;
  saveCurrentAnswer: () => void;
  openSavedAnswer: (answer: AskAnswer) => void;
  recordDestination: (href: string, title: string, type: string) => void;
  forgetConcept: (concept: string) => void;
  setUseRecoveryContext: (value: boolean) => void;
  forgetAskMemory: (locale: Locale) => void;
}

export const useAskStore = create<AskState>()(
  persist(
    (set) => ({
      hydrated: false,
      memory: defaultMemory('en'),
      currentAnswer: null,
      previousAnswer: null,
      savedAnswers: [],
      useRecoveryContext: false,
      setHydrated: (hydrated) => set({ hydrated }),
      setPreferences: (language, depth, style) =>
        set((state) => ({ memory: { ...state.memory, language, depth, style, updatedAt: new Date().toISOString() } })),
      enableMemory: (language) =>
        set((state) => ({ memory: { ...state.memory, enabled: true, language, updatedAt: new Date().toISOString() } })),
      setCurrentAnswer: (answer) =>
        set((state) => ({
          previousAnswer: state.currentAnswer,
          currentAnswer: answer,
          memory: state.memory.enabled
            ? {
                ...state.memory,
                language: answer.language,
                conceptsExplored: [...new Set([...state.memory.conceptsExplored, ...answer.memoryUpdate.concepts])].slice(0, 80),
                recurringInterests: [...new Set([...state.memory.recurringInterests, ...answer.memoryUpdate.interests])].slice(0, 24),
                updatedAt: new Date().toISOString(),
              }
            : state.memory,
        })),
      saveCurrentAnswer: () =>
        set((state) =>
          state.currentAnswer
            ? {
                savedAnswers: [state.currentAnswer, ...state.savedAnswers.filter((answer) => answer.question !== state.currentAnswer?.question)].slice(0, 40),
              }
            : state,
        ),
      openSavedAnswer: (answer) =>
        set((state) => ({ previousAnswer: state.currentAnswer, currentAnswer: answer })),
      recordDestination: (href, title, type) =>
        set((state) => ({
          memory: state.memory.enabled
            ? {
                ...state.memory,
                resourcesExplored: [{ href, title, type }, ...state.memory.resourcesExplored.filter((item) => item.href !== href)].slice(0, 80),
                usefulDestinationTypes: [...new Set([type, ...state.memory.usefulDestinationTypes])].slice(0, 12),
                updatedAt: new Date().toISOString(),
              }
            : state.memory,
        })),
      forgetConcept: (concept) =>
        set((state) => ({
          memory: {
            ...state.memory,
            conceptsExplored: state.memory.conceptsExplored.filter((item) => item !== concept),
            updatedAt: new Date().toISOString(),
          },
        })),
      setUseRecoveryContext: (useRecoveryContext) => set({ useRecoveryContext }),
      forgetAskMemory: (locale) => set({ memory: defaultMemory(locale), savedAnswers: [], currentAnswer: null, previousAnswer: null }),
    }),
    {
      name: 'flow-hijacked-knowledge-v1',
      storage: createJSONStorage(() => createEncryptedStorage('knowledge')),
      partialize: ({ memory, savedAnswers }) => ({ memory, savedAnswers }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
