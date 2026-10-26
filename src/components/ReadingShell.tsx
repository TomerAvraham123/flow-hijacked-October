import { type Href, router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { canonicalUrl } from '@/api/config';
import { useLocale } from '@/hooks/useLocale';
import { useContinuityStore } from '@/state/continuityStore';
import { colors, maxReadingWidth, radii, screenGutter, spacing, touch } from '@/theme/tokens';
import type { ContentDestination } from '@/types/content';
import { localize } from '@/utils/bilingual';

import { Eyebrow, FlowText } from './Typography';

const shellCopy = {
  back: { en: 'Back', he: 'חזרה' },
  save: { en: 'Save', he: 'שמירה' },
  saved: { en: 'Saved', he: 'נשמר' },
  share: { en: 'Share', he: 'שיתוף' },
  ask: { en: 'Open in Ask', he: 'לפתוח ב־Ask' },
  field: { en: 'Take into My Field', he: 'לקחת אל השדה שלי' },
  minutes: { en: 'min read', he: 'דקות קריאה' },
  continueLabel: { en: 'Continue the idea', he: 'להמשיך עם הרעיון' },
  continueBody: {
    en: 'Understanding can move into a question or a practical next step without losing context.',
    he: 'אפשר להעביר את ההבנה לשאלה או לצעד מעשי בלי לאבד את ההקשר.',
  },
} as const;

interface ReadingShellProps {
  destination: ContentDestination;
  eyebrow?: string;
  warm?: boolean;
  questionPrompt?: string;
  fieldPrompt?: string;
}

export function ReadingShell({
  destination,
  eyebrow,
  warm = false,
  questionPrompt,
  fieldPrompt,
  children,
}: PropsWithChildren<ReadingShellProps>) {
  const { locale, rtl } = useLocale();
  const scrollRef = useRef<ScrollView>(null);
  const didRestore = useRef(false);
  const persistedProgress = useRef(0);
  const viewportHeight = useRef(0);
  const contentHeight = useRef(0);

  const savedItem = useContinuityStore((state) => state.saved.find((item) => item.id === destination.id));
  const recentItem = useContinuityStore((state) => state.recent.find((item) => item.id === destination.id));
  const save = useContinuityStore((state) => state.save);
  const remove = useContinuityStore((state) => state.remove);
  const markOpened = useContinuityStore((state) => state.markOpened);
  const updateProgress = useContinuityStore((state) => state.updateProgress);

  const initialProgress = useMemo(
    () => Math.max(savedItem?.progress ?? 0, recentItem?.progress ?? 0),
    // This value deliberately becomes the restore point only on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [destination.id],
  );
  const [progress, setProgress] = useState(initialProgress);
  const title = localize(destination.title, locale);
  const subtitle = localize(destination.subtitle, locale);

  useEffect(() => {
    persistedProgress.current = initialProgress;
    markOpened(destination, initialProgress);
    // Opening is a route-level continuity event. Several route components build
    // the destination object inline, so depending on its object identity would
    // record the same opening again after every store-driven render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination.id, initialProgress, markOpened]);

  const restorePosition = useCallback(() => {
    if (didRestore.current || initialProgress < 0.02 || initialProgress > 0.96) return;
    const scrollable = contentHeight.current - viewportHeight.current;
    if (scrollable <= 0) return;
    didRestore.current = true;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: scrollable * initialProgress, animated: false });
    });
  }, [initialProgress]);

  const recordProgress = useCallback(
    (next: number, force = false) => {
      const bounded = Math.max(0, Math.min(1, next));
      setProgress(bounded);
      if (force || Math.abs(bounded - persistedProgress.current) >= 0.03) {
        persistedProgress.current = bounded;
        updateProgress(destination.id, bounded);
      }
    },
    [destination.id, updateProgress],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const available = Math.max(1, contentSize.height - layoutMeasurement.height);
      recordProgress(contentOffset.y / available);
    },
    [recordProgress],
  );

  const handleEndScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const available = Math.max(1, contentSize.height - layoutMeasurement.height);
      recordProgress(contentOffset.y / available, true);
    },
    [recordProgress],
  );

  const share = useCallback(async () => {
    const url = canonicalUrl(destination.canonicalPath);
    await Share.share({ title, message: `${title}\n${url}`, url });
  }, [destination.canonicalPath, title]);

  const ask = useCallback(() => {
    const prompt = questionPrompt ??
      (locale === 'he'
        ? `עזור לי להבין את הרעיון המרכזי ב“${title}” ואיך הוא מתחבר למסגרת של Flow Hijacked.`
        : `Help me understand the central idea in “${title}” and how it connects to the Flow Hijacked framework.`);
    router.push(`/(tabs)/ask?q=${encodeURIComponent(prompt)}&sourcePath=${encodeURIComponent(destination.canonicalPath)}` as Href);
  }, [destination.canonicalPath, locale, questionPrompt, title]);

  const takeToField = useCallback(() => {
    const prompt = fieldPrompt ??
      (locale === 'he'
        ? `איך הרעיון מתוך “${title}” עשוי להיות רלוונטי לרגע הנוכחי?`
        : `How might the idea from “${title}” be relevant to the present moment?`);
    router.push(`/(tabs)/field?intent=apply&sourceTitle=${encodeURIComponent(title)}&sourcePath=${encodeURIComponent(destination.canonicalPath)}&prompt=${encodeURIComponent(prompt)}` as Href);
  }, [destination.canonicalPath, fieldPrompt, locale, title]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/explore' as Href);
  }, []);

  const isSaved = Boolean(savedItem);
  const background = warm ? colors.warmCanvas : colors.canvas;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={[styles.topBar, { direction: rtl ? 'rtl' : 'ltr' }]}>
        <ToolButton label={localize(shellCopy.back, locale)} symbol={rtl ? '→' : '←'} onPress={goBack} />
        <View style={styles.topBarActions}>
          <ToolButton
            label={localize(isSaved ? shellCopy.saved : shellCopy.save, locale)}
            symbol={isSaved ? '✓' : '+'}
            onPress={() => (isSaved ? remove(destination.id) : save(destination))}
            selected={isSaved}
          />
          <ToolButton label={localize(shellCopy.share, locale)} symbol='↗' onPress={share} />
        </View>
      </View>

      <View style={styles.progressTrack} accessibilityLabel={`${Math.round(progress * 100)}%`} accessibilityRole='progressbar'>
        <View style={[styles.progressFill, { width: `${Math.max(1, progress * 100)}%`, alignSelf: rtl ? 'flex-end' : 'flex-start' }]} />
      </View>

      <ScrollView
        ref={scrollRef}
        onLayout={(event) => {
          viewportHeight.current = event.nativeEvent.layout.height;
          restorePosition();
        }}
        onContentSizeChange={(_, height) => {
          contentHeight.current = height;
          restorePosition();
        }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleEndScroll}
        onScrollEndDrag={handleEndScroll}
        scrollEventThrottle={64}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.readingColumn, { direction: rtl ? 'rtl' : 'ltr' }]}>
          <View style={styles.masthead}>
            {eyebrow ? <Eyebrow tone={warm ? 'gold' : 'teal'}>{eyebrow}</Eyebrow> : null}
            <FlowText variant='display' serif accessibilityRole='header'>
              {title}
            </FlowText>
            <FlowText variant='subheading' tone='secondary' serif>
              {subtitle}
            </FlowText>
            {destination.readingMinutes ? (
              <FlowText variant='metadata' tone='muted'>
                {destination.readingMinutes} {localize(shellCopy.minutes, locale)}
              </FlowText>
            ) : null}
          </View>

          <View style={styles.content}>{children}</View>

          <View style={[styles.handoff, warm && styles.handoffWarm]}>
            <Eyebrow tone={warm ? 'gold' : 'teal'}>{localize(shellCopy.continueLabel, locale)}</Eyebrow>
            <FlowText variant='sectionTitle'>{localize(shellCopy.continueLabel, locale)}</FlowText>
            <FlowText tone='secondary'>{localize(shellCopy.continueBody, locale)}</FlowText>
            <View style={styles.handoffActions}>
              <Pressable accessibilityRole='button' onPress={ask} style={({ pressed }) => [styles.handoffAction, pressed && styles.pressed]}>
                <FlowText style={styles.actionLabel}>{localize(shellCopy.ask, locale)}</FlowText>
                <FlowText tone='teal' accessibilityElementsHidden>↗</FlowText>
              </Pressable>
              <Pressable accessibilityRole='button' onPress={takeToField} style={({ pressed }) => [styles.handoffAction, pressed && styles.pressed]}>
                <FlowText style={styles.actionLabel}>{localize(shellCopy.field, locale)}</FlowText>
                <FlowText tone='teal' accessibilityElementsHidden>↓</FlowText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToolButton({
  label,
  symbol,
  onPress,
  selected = false,
}: {
  label: string;
  symbol: string;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.toolButton, selected && styles.toolButtonSelected, pressed && styles.pressed]}
    >
      <FlowText tone={selected ? 'gold' : 'secondary'} accessibilityElementsHidden>{symbol}</FlowText>
      <FlowText variant='bodySmall' tone={selected ? 'gold' : 'secondary'} numberOfLines={1}>{label}</FlowText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    minHeight: 58,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  topBarActions: { flexDirection: 'row', gap: spacing.xxs },
  toolButton: {
    minHeight: touch.minimum,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.control,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.transparent,
  },
  toolButtonSelected: { backgroundColor: 'rgba(199,154,59,0.10)' },
  progressTrack: { height: 2, backgroundColor: colors.line },
  progressFill: { height: 2, backgroundColor: colors.tealSoft },
  scrollContent: { paddingBottom: spacing.hero },
  readingColumn: {
    width: '100%',
    maxWidth: maxReadingWidth,
    alignSelf: 'center',
    paddingHorizontal: screenGutter,
  },
  masthead: { paddingTop: spacing.xxxl, paddingBottom: spacing.xxl, gap: spacing.md },
  content: { gap: spacing.section },
  handoff: {
    marginTop: spacing.hero,
    paddingTop: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.teal,
    gap: spacing.md,
  },
  handoffWarm: { borderTopColor: colors.warm },
  handoffActions: { gap: spacing.xs, marginTop: spacing.sm },
  handoffAction: {
    minHeight: touch.primaryHeight,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionLabel: { fontWeight: '600', flex: 1 },
  pressed: { opacity: 0.72 },
});
