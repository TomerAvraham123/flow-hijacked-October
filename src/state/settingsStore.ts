import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Locale } from '@/types/recovery';

export type NotificationContext = 'morning' | 'evening' | 'after_work' | 'before_weekend' | 'weekly' | 'never';

interface SettingsState {
  hydrated: boolean;
  onboardingComplete: boolean;
  locale: Locale;
  quietMode: boolean;
  notificationsEnabled: boolean;
  notificationContext: NotificationContext;
  notificationHour: number;
  setHydrated: (value: boolean) => void;
  completeOnboarding: () => void;
  setLocale: (locale: Locale) => void;
  setQuietMode: (value: boolean) => void;
  setNotificationPreference: (enabled: boolean, context: NotificationContext, hour: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hydrated: false,
      onboardingComplete: false,
      locale: 'en',
      quietMode: false,
      notificationsEnabled: false,
      notificationContext: 'never',
      notificationHour: 19,
      setHydrated: (hydrated) => set({ hydrated }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setLocale: (locale) => set({ locale }),
      setQuietMode: (quietMode) => set({ quietMode }),
      setNotificationPreference: (notificationsEnabled, notificationContext, notificationHour) =>
        set({ notificationsEnabled, notificationContext, notificationHour }),
    }),
    {
      name: 'flow-hijacked-settings-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ onboardingComplete, locale, quietMode, notificationsEnabled, notificationContext, notificationHour }) => ({
        onboardingComplete,
        locale,
        quietMode,
        notificationsEnabled,
        notificationContext,
        notificationHour,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
