import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';

import { sendAskFeedback } from '@/api/client';
import { canonicalUrl } from '@/api/config';
import { Action, InlineActions } from '@/components/Actions';
import { AskAnswerSection } from '@/components/AskAnswerSection';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { colors, radii, spacing } from '@/theme/tokens';
import type { AskDestination } from '@/types/ask';
import { openFlowDestination } from '@/utils/handoff';

export default function AskAnswerScreen() {
  useSensitiveScreenProtection('ask-answer');
  const { locale } = useLocale();
  const answer = useAskStore((state) => state.currentAnswer);
  const save = useAskStore((state) => state.saveCurrentAnswer);
  const recordDestination = useAskStore((state) => state.recordDestination);
  const [showSources, setShowSources] = useState(false);
  const [feedback, setFeedback] = useState<'yes' | 'partly' | 'not_quite' | null>(null);
  const [saved, setSaved] = useState(false);

  if (!answer) {
    return (
      <Screen>
        <Wordmark />
        <Section><FlowText>{locale === 'he' ? 'אין תשובה פתוחה. אפשר להתחיל בשאלה.' : 'There is no open answer. You can begin with a question.'}</FlowText></Section>
        <Section><Action label={tr('askButton', locale)} onPress={() => router.replace('/(tabs)/ask')} /></Section>
      </Screen>
    );
  }

  function open(destination: AskDestination) {
    recordDestination(destination.href, destination.label, destination.type);
    openFlowDestination(destination);
  }

  async function respond(value: 'yes' | 'partly' | 'not_quite') {
    setFeedback(value);
    await sendAskFeedback(answer!, value, locale).catch(() => undefined);
  }

  async function shareAnswer() {
    await Share.share({ message: `${answer!.question}\n\n${answer!.directAnswer.body}\n\nFlow Hijacked — ${canonicalUrl('/ask')}` });
  }

  const confidence =
    answer.confidenceLabel === 'high'
      ? locale === 'he' ? 'תמיכה חזקה במקורות' : 'Strong source support'
      : answer.confidenceLabel === 'moderate'
        ? locale === 'he' ? 'תמיכה סבירה במקורות' : 'Moderate source support'
        : locale === 'he' ? 'הראיות בספרייה מוגבלות' : 'Limited library support';

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.questionHeader}>
        <View style={styles.questionMark}><FlowText variant="sectionTitle" tone="gold">?</FlowText></View>
        <View style={styles.questionCopy}>
          <Eyebrow>{locale === 'he' ? 'השאלה' : 'THE QUESTION'}</Eyebrow>
          <FlowText variant="screenTitle" serif accessibilityRole="header">{answer.question}</FlowText>
          <View style={styles.grounding}>
            <FlowText variant="metadata" tone={answer.confidenceLabel === 'limited' ? 'gold' : 'teal'}>{confidence}</FlowText>
            <FlowText variant="metadata" tone="muted">{tr('grounded', locale)}</FlowText>
          </View>
        </View>
      </Section>

      {answer.ambiguity.interpretation ? (
        <View style={styles.interpretation}><FlowText variant="bodySmall" tone="secondary">{answer.ambiguity.interpretation}</FlowText></View>
      ) : null}
      {answer.conceptualCorrection ? (
        <View style={styles.correction}>
          <Eyebrow tone="gold">{locale === 'he' ? 'דיוק קטן במודל' : 'A SMALL CORRECTION TO THE MODEL'}</Eyebrow>
          <FlowText>{answer.conceptualCorrection}</FlowText>
        </View>
      ) : null}

      <Section style={styles.answerPage}>
        <AskAnswerSection index="01" section={answer.directAnswer} direct />
        {answer.ambiguity.clarificationQuestion ? (
          <View style={styles.clarification}>
            <Eyebrow tone="gold">{locale === 'he' ? 'פרט אחד שמשנה את התשובה' : 'ONE DETAIL THAT CHANGES THE ANSWER'}</Eyebrow>
            <FlowText>{answer.ambiguity.clarificationQuestion}</FlowText>
            <Action
              label={locale === 'he' ? 'להוסיף את הפרט' : 'Add that detail'}
              variant="quiet"
              onPress={() => router.push({ pathname: '/(tabs)/ask', params: { q: `${answer.question} ` } })}
            />
          </View>
        ) : null}
        <AskAnswerSection index="02" section={answer.mechanisms} />
        <AskAnswerSection index="03" section={answer.flowLens} />
        <AskAnswerSection index="04" section={answer.whatMightHelp} />
      </Section>

      {!answer.ambiguity.clarificationQuestion ? (
        <Section style={styles.nextStep}>
          <View style={styles.nextPath} />
          <View style={styles.nextCopy}>
            <Eyebrow tone="gold">{tr('bestNext', locale)}</Eyebrow>
            <FlowText variant="sectionTitle">{answer.bestNextStep.label}</FlowText>
            <FlowText tone="secondary">{answer.bestNextStep.description}</FlowText>
            <Action label={locale === 'he' ? 'להמשיך מכאן' : 'Continue here'} onPress={() => open(answer.bestNextStep)} />
          </View>
        </Section>
      ) : null}

      {answer.exploreFurther.length ? (
        <Section style={styles.explore}>
          <Eyebrow>{tr('exploreFurther', locale)}</Eyebrow>
          {answer.exploreFurther.map((destination) => (
            <Action key={`${destination.type}-${destination.href}`} label={destination.label} detail={destination.description} variant="quiet" onPress={() => open(destination)} />
          ))}
        </Section>
      ) : null}

      {answer.citations.length ? (
        <Section style={styles.sources}>
          <Action
            label={`${tr('sources', locale)} · ${answer.citations.length}`}
            detail={locale === 'he' ? 'מקורות, מיקומים וקישורים מדויקים' : 'Exact sources, locators and links'}
            variant="quiet"
            onPress={() => setShowSources((value) => !value)}
          />
          {showSources ? answer.citations.map((citation, index) => (
            <View key={citation.id} style={styles.source}>
              <FlowText variant="metadata" tone="muted">{String(index + 1).padStart(2, '0')} · {citation.evidenceType.replaceAll('_', ' ')}</FlowText>
              <FlowText style={styles.sourceTitle}>{citation.title}</FlowText>
              {citation.locator ? <FlowText variant="bodySmall" tone="muted">{citation.locator}</FlowText> : null}
              <Pressable
                accessibilityRole="link"
                onPress={() => void WebBrowser.openBrowserAsync(citation.href.startsWith('/') ? canonicalUrl(citation.href) : citation.href)}
                style={({ pressed }) => [styles.sourceLink, pressed && styles.pressed]}
              >
                <FlowText variant="bodySmall" tone="teal">{locale === 'he' ? 'לפתוח מקור ↗' : 'Open source ↗'}</FlowText>
              </Pressable>
            </View>
          )) : null}
        </Section>
      ) : null}

      <Section style={styles.feedback}>
        <FlowText variant="subheading">{tr('answerUseful', locale)}</FlowText>
        <InlineActions>
          {(['yes', 'partly', 'not_quite'] as const).map((value) => (
            <Action
              key={value}
              label={tr(value === 'yes' ? 'yes' : value === 'partly' ? 'partly' : 'notQuite', locale)}
              variant={feedback === value ? 'secondary' : 'quiet'}
              onPress={() => void respond(value)}
              style={styles.feedbackAction}
            />
          ))}
        </InlineActions>
        {(feedback === 'partly' || feedback === 'not_quite') && answer.refinementOptions.length ? (
          <View style={styles.refinements}>
            <FlowText variant="bodySmall" tone="muted">{locale === 'he' ? 'אולי רציתם להתמקד יותר ב־' : 'Maybe you meant more about:'}</FlowText>
            {answer.refinementOptions.map((option) => (
              <Action key={option} label={option} variant="quiet" onPress={() => router.push({ pathname: '/(tabs)/ask', params: { q: `${answer.question} ${locale === 'he' ? 'בבקשה להתמקד ב־' : 'Please focus on '}${option}.` } })} />
            ))}
          </View>
        ) : null}
      </Section>

      <Section style={styles.utility}>
        <Action
          label={saved ? (locale === 'he' ? 'התשובה נשמרה' : 'Answer saved') : locale === 'he' ? 'לשמור את התשובה' : 'Save this answer'}
          variant="secondary"
          disabled={saved}
          onPress={() => { save(); setSaved(true); }}
        />
        <Action label={locale === 'he' ? 'לשתף את התשובה הישירה' : 'Share the direct answer'} variant="quiet" onPress={() => void shareAnswer()} />
        <Action label={locale === 'he' ? 'לשאול שאלה נוספת' : 'Ask a follow-up'} variant="quiet" onPress={() => router.push('/(tabs)/ask')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  questionHeader: { flexDirection: 'row', gap: spacing.lg },
  questionMark: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.gold },
  questionCopy: { flex: 1, gap: spacing.md },
  grounding: { gap: spacing.xxs },
  interpretation: { marginTop: spacing.xl, paddingStart: spacing.lg, borderStartWidth: 2, borderStartColor: colors.blue },
  correction: { marginTop: spacing.xl, gap: spacing.sm, padding: spacing.lg, borderRadius: radii.control, backgroundColor: 'rgba(199,154,59,0.08)', borderWidth: 1, borderColor: colors.gold },
  answerPage: { gap: 0 },
  clarification: { gap: spacing.md, paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.line },
  nextStep: { flexDirection: 'row', gap: spacing.lg },
  nextPath: { width: 4, borderRadius: 2, backgroundColor: colors.gold },
  nextCopy: { flex: 1, gap: spacing.md },
  explore: { gap: spacing.sm },
  sources: { gap: spacing.sm },
  source: { gap: spacing.xs, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  sourceTitle: { fontWeight: '600' },
  sourceLink: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' },
  pressed: { opacity: 0.72 },
  feedback: { gap: spacing.md },
  feedbackAction: { flexGrow: 1 },
  refinements: { gap: spacing.sm, marginTop: spacing.sm },
  utility: { gap: spacing.sm },
});
