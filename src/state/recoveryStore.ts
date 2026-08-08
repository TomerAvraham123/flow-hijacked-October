import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createEncryptedStorage } from '@/storage/encryptedStorage';
import type { ActionFeedback, ChangeSignal, CheckIn, FieldDimensions, SmallestReturn } from '@/types/recovery';

export const defaultDimensions: FieldDimensions = {
  body: 6,
  mind: 5,
  control: 6,
  relationships: 6,
  world: 5,
  future: 5,
};

interface MinimalReturn {
  id: string;
  createdAt: string;
  value: SmallestReturn;
}

interface RecoveryState {
  hydrated: boolean;
  minimalReturns: MinimalReturn[];
  checkIns: CheckIn[];
  feedback: ActionFeedback[];
  currentCheckInId: string | null;
  recordMinimalReturn: (value: SmallestReturn) => string;
  saveCheckIn: (input: Omit<CheckIn, 'id' | 'createdAt'>) => CheckIn;
  addFeedback: (feedback: ActionFeedback) => void;
  clearRecoveryMemory: () => void;
  setHydrated: (value: boolean) => void;
}

export const useRecoveryStore = create<RecoveryState>()(
  persist(
    (set) => ({
      hydrated: false,
      minimalReturns: [],
      checkIns: [],
      feedback: [],
      currentCheckInId: null,
      recordMinimalReturn: (value) => {
        const id = randomUUID();
        set((state) => ({
          minimalReturns: [{ id, createdAt: new Date().toISOString(), value }, ...state.minimalReturns].slice(0, 180),
        }));
        return id;
      },
      saveCheckIn: (input) => {
        const checkIn: CheckIn = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
        set((state) => ({
          checkIns: [checkIn, ...state.checkIns].slice(0, 365),
          currentCheckInId: checkIn.id,
        }));
        return checkIn;
      },
      addFeedback: (entry) => set((state) => ({ feedback: [entry, ...state.feedback].slice(0, 500) })),
      clearRecoveryMemory: () => set({ minimalReturns: [], checkIns: [], feedback: [], currentCheckInId: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'flow-hijacked-recovery-v1',
      storage: createJSONStorage(() => createEncryptedStorage('recovery')),
      partialize: ({ minimalReturns, checkIns, feedback, currentCheckInId }) => ({
        minimalReturns,
        checkIns,
        feedback,
        currentCheckInId,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export const pressureSignals: ChangeSignal[] = [
  'sleep',
  'stress',
  'craving',
  'shame',
  'conflict',
  'isolation',
  'flatness',
  'structure',
];
