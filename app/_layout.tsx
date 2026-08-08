import 'react-native-reanimated';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { router, Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NetworkBanner } from '@/components/NetworkBanner';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSettingsStore } from '@/state/settingsStore';
import { colors } from '@/theme/tokens';
import { configureNotificationHandling } from '@/utils/notifications';

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  const locale = useSettingsStore((state) => state.locale);
  const he = locale === 'he';

  return (
    <SafeAreaView style={errorStyles.safe}>
      <View style={errorStyles.content} accessibilityRole="alert">
        <Text style={errorStyles.eyebrow}>{he ? 'אפשר להתחיל שוב בבטחה' : 'A SAFE WAY BACK'}</Text>
        <Text style={errorStyles.title}>{he ? 'המסך הזה לא הצליח להיפתח.' : 'This screen could not open.'}</Text>
        <Text style={errorStyles.body}>
          {he
            ? 'המידע המקומי לא נמחק. אפשר לנסות לפתוח שוב; פרטי השגיאה אינם נשלחים לשירות חיצוני.'
            : 'Your local information was not deleted. You can try again; error details are not sent to an external service.'}
        </Text>
        <Pressable accessibilityRole="button" onPress={() => void retry()} style={errorStyles.action}>
          <Text style={errorStyles.actionLabel}>{he ? 'לנסות שוב' : 'Try again'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const reducedMotion = useReducedMotion();
  const quietPresentation = useSettingsStore((state) => state.quietMode);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 60_000, gcTime: 1000 * 60 * 30 },
          mutations: { retry: 0 },
        },
      }),
  );

  useEffect(() => {
    configureNotificationHandling();
    const open = (response: Notifications.NotificationResponse | null) => {
      if (response?.notification.request.content.data?.route === '/(tabs)/now') {
        router.push('/(tabs)/now');
        void Notifications.clearLastNotificationResponseAsync();
      }
    };
    void Notifications.getLastNotificationResponseAsync().then(open);
    const subscription = Notifications.addNotificationResponseReceivedListener(open);
    return () => subscription.remove();
  }, []);

  const motionQuiet = reducedMotion || quietPresentation;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <NetworkBanner />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.canvas },
              animation: motionQuiet ? 'none' : 'fade_from_bottom',
              animationDuration: motionQuiet ? 0 : 220,
              gestureEnabled: true,
            }}
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const errorStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: { flex: 1, justifyContent: 'center', gap: 16, padding: 28 },
  eyebrow: { color: colors.tealSoft, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  title: { color: colors.text, fontSize: 30, lineHeight: 38, fontWeight: '600' },
  body: { color: colors.textSecondary, fontSize: 17, lineHeight: 27 },
  action: {
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.paper,
    borderRadius: 14,
  },
  actionLabel: { color: colors.ink, fontSize: 17, fontWeight: '600' },
});
