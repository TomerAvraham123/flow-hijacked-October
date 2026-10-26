import NetInfo from '@react-native-community/netinfo';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { Action } from '@/components/Actions';
import { ChoiceGroup } from '@/components/ChoiceGroup';
import { Screen, Section } from '@/components/Screen';
import { ToggleRow } from '@/components/ToggleRow';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { askFlowHijacked, MAX_ASK_QUESTION_CHARS } from '@/api/client';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, fontFamilies, radii, spacing, typography } from '@/theme/tokens';
import type { AskDepth, AskStyle, RecoveryContextGrant } from '@/types/ask';
import { needsImmediateSupport } from '@/utils/safety';

const starters = {
  en: [
    'Why does craving feel stronger at night?',
    'Why do I feel flat after stopping?',
    'What is dopamine actually doing here?',
    'What kind of therapy might fit this difficulty?',
  ],
  he: [
    'למה הדחף מתחזק דווקא בלילה?',
    'למה אני מרגיש שטוח אחרי שהפסקתי?',
    'מה דופמין בעצם עושה כאן?',
    'איזה סוג טיפול עשוי להתאים לקושי הזה?',
  ],
};

export default function AskEntryScreen() {
  useSensitiveScreenProtection('ask-entry');
  const { locale, rtl } = useLocale();
  const params = useLocalSearchParams<{ q?: string }>();
  const input = useRef<TextInput>(null);
  const memory = useAskStore((state) => state.memory);
  const previous = useAskStore((state) => state.currentAnswer);
  const setPreferences = useAskStore((state) => state.setPreferences);
  const setAnswer = useAskStore((state) => state.setCurrentAnswer);
  const useField = useAskStore((state) => state.useRecoveryContext);
  const setUseField = useAskStore((state) => state.setUseRecoveryContext);
  const latest = useRecoveryStore((state) => state.checkIns[0]);
  const [draft, setDraft] = useState<{ seed: string | undefined; value: string }>(() => ({ seed: params.q, value: params.q ?? '' }));
  const question = draft.seed === params.q ? draft.value : params.q ?? '';
  const setQuestion = (value: string) => setDraft({ seed: params.q, value });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (memory.language !== locale) setPreferences(locale, memory.depth, memory.style);
  }, [locale, memory.depth, memory.language, memory.style, setPreferences]);

  const recoveryContext = useMemo<RecoveryContextGrant | undefined>(() => {
    if (!useField || !latest) return undefined;
    const context: RecoveryContextGrant = {};
    if (latest.signals.includes('sleep') || latest.dimensions.body < 4.5) context.sleep = 'low';
    if (latest.signals.includes('stress') || latest.dimensions.mind < 4.5) context.stress = 'high';
    if (latest.signals.includes('isolation') || latest.dimensions.relationships < 4.5) context.connection = 'low';
    return Object.keys(context).length ? context : undefined;
  }, [latest, useField]);

  async function submit(nextQuestion = question) {
    const trimmed = nextQuestion.trim();
    if (trimmed.length < 3) {
      setError(locale === 'he' ? 'כתבו שאלה שלמה, גם אם היא עדיין לא מסודרת.' : 'Write the whole question, even if it is not neatly formed yet.');
      input.current?.focus();
      return;
    }
    if (trimmed.length > MAX_ASK_QUESTION_CHARS) {
      setError(
        locale === 'he'
          ? 'השאלה ארוכה מכדי לשלוח בבקשה אחת. אפשר לקצר אותה לנקודה המרכזית, ואחר כך להמשיך בשאלת המשך.'
          : 'This is too long for one request. Keep the central question, then continue with a follow-up.',
      );
      input.current?.focus();
      return;
    }
    if (needsImmediateSupport(trimmed)) {
      setError('');
      setUseField(false);
      router.push({ pathname: '/support', params: { source: 'ask' } });
      return;
    }
    const network = await NetInfo.fetch();
    if (network.isConnected === false) {
      setError(tr('networkNeeded', locale));
      return;
    }
    setLoading(true);
    setError('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const answer = await askFlowHijacked(
        {
          question: trimmed,
          language: locale,
          depth: memory.depth,
          style: memory.style,
          memory: memory.enabled ? memory : null,
          ...(previous
            ? {
                sessionContext: {
                  previousQuestion: previous.question,
                  previousTopic: previous.topic,
                  previousAnswerSummary: previous.directAnswer.body,
                },
              }
            : {}),
          ...(recoveryContext ? { recoveryContext } : {}),
        },
        controller.signal,
      );
      setAnswer(answer);
      setUseField(false);
      router.push('/ask/answer');
    } catch (caught) {
      const aborted = caught instanceof Error && caught.name === 'AbortError';
      setError(
        locale === 'he'
          ? aborted
            ? 'בניית התשובה ארכה יותר מדי. השאלה לא נשמרה; אפשר לנסות שוב.'
            : 'לא הצלחתי לבנות תשובה כרגע. השאלה לא נשמרה. אפשר לנסות שוב בעוד רגע.'
          : aborted
            ? 'The answer took too long. Your question was not saved; you can try again.'
            : 'I could not build the answer just now. Your question was not saved. Please try again in a moment.',
      );
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <Wordmark />
        <Section style={styles.heading}>
          <Eyebrow>{locale === 'he' ? 'ASK FLOW HIJACKED · קודם עזרה, אחר כך דיוק' : 'ASK FLOW HIJACKED · HELP FIRST, REFINE SECOND'}</Eyebrow>
          <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('askTitle', locale)}</FlowText>
          <FlowText tone="secondary">{tr('askBoundary', locale)}</FlowText>
        </Section>

        <Section style={styles.form}>
          <TextInput
            ref={input}
            accessibilityLabel={locale === 'he' ? 'השאלה שלכם' : 'Your question'}
            value={question}
            onChangeText={setQuestion}
            placeholder={tr('askPlaceholder', locale)}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={MAX_ASK_QUESTION_CHARS}
            textAlignVertical="top"
            style={[styles.input, { textAlign: rtl ? 'right' : 'left', writingDirection: rtl ? 'rtl' : 'ltr' }]}
          />
          <View style={styles.preference}>
            <FlowText variant="metadata" tone="muted">{locale === 'he' ? 'עומק התשובה' : 'ANSWER DEPTH'}</FlowText>
            <ChoiceGroup<AskDepth>
              label={locale === 'he' ? 'עומק התשובה' : 'Answer depth'}
              options={locale === 'he' ? [
                { value: 'concise', label: 'קצר קודם' }, { value: 'balanced', label: 'מאוזן' }, { value: 'deep', label: 'עמוק' },
              ] : [
                { value: 'concise', label: 'Concise first' }, { value: 'balanced', label: 'Balanced' }, { value: 'deep', label: 'Deep' },
              ]}
              value={memory.depth}
              onChange={(depth) => setPreferences(locale, depth, memory.style)}
            />
          </View>
          <View style={styles.preference}>
            <FlowText variant="metadata" tone="muted">{locale === 'he' ? 'סגנון הסבר' : 'EXPLANATION STYLE'}</FlowText>
            <ChoiceGroup<AskStyle>
              label={locale === 'he' ? 'סגנון הסבר' : 'Explanation style'}
              options={locale === 'he' ? [
                { value: 'mixed', label: 'משולב' }, { value: 'intuitive', label: 'אינטואיטיבי' }, { value: 'scientific', label: 'מדעי' }, { value: 'clinical', label: 'קליני' },
              ] : [
                { value: 'mixed', label: 'Mixed' }, { value: 'intuitive', label: 'Intuitive' }, { value: 'scientific', label: 'Scientific' }, { value: 'clinical', label: 'Clinical' },
              ]}
              value={memory.style}
              onChange={(style) => setPreferences(locale, memory.depth, style)}
            />
          </View>
          {latest ? (
            <ToggleRow label={tr('useFieldContext', locale)} detail={tr('fieldContextDetail', locale)} value={useField} onValueChange={setUseField} />
          ) : null}
          {error ? <FlowText accessibilityRole="alert" tone="gold">{error}</FlowText> : null}
          <Action label={loading ? tr('searching', locale) : tr('askButton', locale)} disabled={loading} onPress={() => void submit()} />
          <FlowText variant="bodySmall" tone="teal" onPress={() => router.push('/ask/memory')} style={styles.memoryLink}>
            {tr('askMemory', locale)} →
          </FlowText>
        </Section>

        {!previous && !loading ? (
          <Section style={styles.starters}>
            <Eyebrow>{locale === 'he' ? 'שאלות שאפשר להתחיל מהן' : 'QUESTIONS YOU CAN BEGIN WITH'}</Eyebrow>
            {starters[locale].map((starter) => (
              <Action key={starter} label={starter} variant="quiet" onPress={() => { setQuestion(starter); void submit(starter); }} />
            ))}
          </Section>
        ) : null}

        {previous ? (
          <Section>
            <Action label={previous.question} detail={locale === 'he' ? 'לפתוח את התשובה האחרונה' : 'Open your latest answer'} variant="quiet" onPress={() => router.push('/ask/answer')} />
          </Section>
        ) : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.canvas },
  heading: { gap: spacing.md },
  form: { gap: spacing.lg },
  input: {
    minHeight: 148,
    padding: spacing.lg,
    borderRadius: radii.sheet,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: fontFamilies.sans,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  preference: { gap: spacing.sm },
  memoryLink: { minHeight: 48, paddingVertical: spacing.md },
  starters: { gap: spacing.sm },
});
