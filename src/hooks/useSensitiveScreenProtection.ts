import * as ScreenCapture from 'expo-screen-capture';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * Keeps recovery and Ask content out of screenshots, recordings and Android's
 * recent-app preview while a sensitive route is focused. A focus effect is
 * important here: Expo Router may keep earlier stack screens mounted.
 */
export function useSensitiveScreenProtection(routeKey: string): void {
  const approvedStoreCapture =
    process.env.EXPO_PUBLIC_STORE_SCREENSHOT_MODE === 'approved-non-sensitive-fixtures';
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web' || approvedStoreCapture) return undefined;

      const key = `flow-hijacked-sensitive-${routeKey}`;
      void ScreenCapture.preventScreenCaptureAsync(key).catch(() => undefined);

      return () => {
        void ScreenCapture.allowScreenCaptureAsync(key).catch(() => undefined);
      };
    }, [approvedStoreCapture, routeKey]),
  );
}
