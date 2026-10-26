import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createEncryptedStorage } from '@/storage/encryptedStorage';
import type { ContentDestination, SavedItem } from '@/types/content';

interface ContinuityState {
  saved: SavedItem[];
  recent: SavedItem[];
  save: (item: ContentDestination) => void;
  remove: (id: string) => void;
  markOpened: (item: ContentDestination, progress?: number) => void;
  updateProgress: (id: string, progress: number) => void;
  clear: () => void;
}

export const useContinuityStore = create<ContinuityState>()(
  persist(
    (set) => ({
      saved: [],
      recent: [],
      save: (item) =>
        set((state) => ({
          saved: [{ ...item, savedAt: new Date().toISOString() }, ...state.saved.filter((entry) => entry.id !== item.id)],
        })),
      remove: (id) => set((state) => ({ saved: state.saved.filter((item) => item.id !== id) })),
      markOpened: (item, progress = 0) =>
        set((state) => ({
          recent: [
            { ...item, savedAt: state.saved.find((entry) => entry.id === item.id)?.savedAt ?? new Date().toISOString(), lastOpenedAt: new Date().toISOString(), progress },
            ...state.recent.filter((entry) => entry.id !== item.id),
          ].slice(0, 24),
        })),
      updateProgress: (id, progress) =>
        set((state) => ({
          recent: state.recent.map((item) => (item.id === id ? { ...item, progress, lastOpenedAt: new Date().toISOString() } : item)),
          saved: state.saved.map((item) => (item.id === id ? { ...item, progress, lastOpenedAt: new Date().toISOString() } : item)),
        })),
      clear: () => set({ saved: [], recent: [] }),
    }),
    {
      name: 'flow-hijacked-continuity-v1',
      storage: createJSONStorage(() => createEncryptedStorage('continuity')),
    },
  ),
);
