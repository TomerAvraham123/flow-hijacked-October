import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { NotificationContext } from '@/state/settingsStore';
import type { Locale } from '@/types/recovery';

const CHANNEL_ID = 'gentle-return';
const STORAGE_KEY = 'flow-hijacked-gentle-return-identifiers-v1';
const OWNER = 'flow-hijacked-gentle-return';

type SchedulableContext = Exclude<NotificationContext, 'never'>;

export type GentleReturnResult =
  | { status: 'scheduled'; identifier: string }
  | { status: 'denied' }
  | { status: 'unsupported' }
  | { status: 'failed' };

export interface GentleReturnPlan {
  body: string;
  context: SchedulableContext;
  hour: number;
  trigger:
    | {
        type: Notifications.SchedulableTriggerInputTypes.DAILY;
        hour: number;
        minute: number;
        channelId: string;
      }
    | {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY;
        weekday: number;
        hour: number;
        minute: number;
        channelId: string;
      };
}

const bodies: Record<Locale, Record<SchedulableContext, string>> = {
  en: {
    morning: 'You do not need a full check-in. One thing may have moved.',
    evening: 'Something may have changed since your last return.',
    after_work: 'The day may have changed the field. A brief return is enough.',
    before_weekend: 'Before the weekend opens, one small thing may be worth noticing.',
    weekly: 'If it fits, this may be a useful moment to notice how the week moved.',
  },
  he: {
    morning: 'לא צריך לעשות בדיקה מלאה. אולי רק דבר אחד השתנה.',
    evening: 'יכול להיות שמשהו השתנה מאז הפעם האחרונה שנכנסתם.',
    after_work: 'היום אולי שינה מעט את השדה. גם חזרה קצרה מספיקה.',
    before_weekend: 'לפני שסוף השבוע מתחיל, אולי כדאי לשים לב לדבר קטן אחד.',
    weekly: 'אם זה מתאים עכשיו, אפשר לעצור לרגע ולראות איך השבוע נע.',
  },
};

let handlerConfigured = false;

export function configureNotificationHandling(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

function normalizeHour(hour: number): number {
  if (!Number.isFinite(hour)) return 19;
  return Math.max(0, Math.min(23, Math.round(hour)));
}

export function buildGentleReturnPlan(
  context: SchedulableContext,
  hour: number,
  locale: Locale,
): GentleReturnPlan {
  const safeHour = normalizeHour(hour);
  const common = { hour: safeHour, minute: 0, channelId: CHANNEL_ID };

  if (context === 'before_weekend' || context === 'weekly') {
    return {
      body: bodies[locale][context],
      context,
      hour: safeHour,
      trigger: {
        ...common,
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        // Expo weekdays are 1–7, starting on Sunday. Friday is 6.
        weekday: context === 'before_weekend' ? 6 : 1,
      },
    };
  }

  return {
    body: bodies[locale][context],
    context,
    hour: safeHour,
    trigger: {
      ...common,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    },
  };
}

async function readOwnedIdentifiers(): Promise<string[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

async function ensureChannel(locale: Locale): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: locale === 'he' ? 'חזרות עדינות' : 'Gentle returns',
    description:
      locale === 'he'
        ? 'רק תזמון החזרה השקט שבחרתם בתוך Flow Hijacked.'
        : 'Only the quiet return schedule you choose inside Flow Hijacked.',
    importance: Notifications.AndroidImportance.DEFAULT,
    enableVibrate: false,
    showBadge: false,
    sound: null,
  });
}

async function permissionGrantedAfterExplicitRequest(locale: Locale): Promise<boolean> {
  await ensureChannel(locale);
  const current = await Notifications.getPermissionsAsync();
  if (current.status === Notifications.PermissionStatus.GRANTED) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === Notifications.PermissionStatus.GRANTED;
}

async function ownedScheduledIdentifiers(): Promise<string[]> {
  const identifiers = new Set(await readOwnedIdentifiers());
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  scheduled.forEach((request) => {
    if (request.content.data?.owner === OWNER) identifiers.add(request.identifier);
  });
  return [...identifiers];
}

export async function cancelGentleReturnNotifications(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return;
  }

  const identifiers = await ownedScheduledIdentifiers();
  await Promise.all(identifiers.map((identifier) => Notifications.cancelScheduledNotificationAsync(identifier)));
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * Called only from an explicit user action. It never requests notification
 * permission during launch, onboarding or passive navigation.
 */
export async function scheduleGentleReturnNotification(
  context: NotificationContext,
  hour: number,
  locale: Locale,
): Promise<GentleReturnResult> {
  if (context === 'never') {
    await cancelGentleReturnNotifications();
    return { status: 'unsupported' };
  }
  if (Platform.OS === 'web') return { status: 'unsupported' };

  let newIdentifier: string | undefined;
  try {
    if (!(await permissionGrantedAfterExplicitRequest(locale))) return { status: 'denied' };

    const previousIdentifiers = await ownedScheduledIdentifiers();
    const plan = buildGentleReturnPlan(context, hour, locale);
    newIdentifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Flow Hijacked',
        body: plan.body,
        sound: false,
        data: {
          owner: OWNER,
          route: '/(tabs)/now',
          context,
        },
      },
      trigger: plan.trigger,
    });

    await Promise.all(
      previousIdentifiers
        .filter((previousIdentifier) => previousIdentifier !== newIdentifier)
        .map((previousIdentifier) => Notifications.cancelScheduledNotificationAsync(previousIdentifier)),
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newIdentifier]));
    return { status: 'scheduled', identifier: newIdentifier };
  } catch {
    if (newIdentifier) {
      try {
        await Notifications.cancelScheduledNotificationAsync(newIdentifier);
      } catch {
        // A later ownership scan will still discover and remove this request.
      }
    }
    return { status: 'failed' };
  }
}
