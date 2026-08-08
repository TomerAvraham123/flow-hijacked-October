import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { useAskStore } from '@/state/askStore';
import { colors, radii, spacing, touch } from '@/theme/tokens';

export default function AskMemoryScreen() {
  useSensitiveScreenProtection('ask-memory');
  const { locale } = useLocale();
  const memory = useAskStore((state) => state.memory);
  const enable = useAskStore((state) => state.enableMemory);
  const forgetConcept = useAskStore((state) => state.forgetConcept);
  const forgetAll = useAskStore((state) => state.forgetAskMemory);

  function confirmForget() {
    Alert.alert(
      locale === 'he' ? 'לשכוח את מסלול הידע?' : 'Forget the knowledge path?',
      locale === 'he' ? 'הפעולה תמחק העדפות, מושגים ותשובות Ask שנשמרו. זיכרון ההחלמה לא יושפע.' : 'This removes preferences, concepts and saved Ask answers. Recovery memory is not affected.',
      [
        { text: locale === 'he' ? 'ביטול' : 'Cancel', style: 'cancel' },
        { text: locale === 'he' ? 'למחוק' : 'Delete', style: 'destructive', onPress: () => forgetAll(locale) },
      ],
    );
  }

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{locale === 'he' ? 'זיכרון ASK · ידע בלבד' : 'ASK MEMORY · KNOWLEDGE ONLY'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('askMemory', locale)}</FlowText>
        <FlowText tone="secondary">{tr('memoryBoundary', locale)}</FlowText>
      </Section>

      {!memory.enabled ? (
        <Section style={styles.enablePanel}>
          <FlowText>{locale === 'he' ? 'אם תפעילו רצף ידע, Ask יוכל לזכור שלא צריך להתחיל כל מושג מאפס.' : 'If enabled, Ask can remember that it need not begin every concept from zero.'}</FlowText>
          <Action label={locale === 'he' ? 'לזכור את מסלול הידע במכשיר הזה' : 'Remember my knowledge path on this device'} onPress={() => enable(locale)} />
        </Section>
      ) : (
        <>
          <Section style={styles.summary}>
            <View style={styles.metric}>
              <FlowText variant="metadata" tone="muted">{locale === 'he' ? 'עומק מועדף' : 'PREFERRED DEPTH'}</FlowText>
              <FlowText variant="subheading">{memory.depth}</FlowText>
            </View>
            <View style={styles.metric}>
              <FlowText variant="metadata" tone="muted">{locale === 'he' ? 'מושגים שנחקרו' : 'CONCEPTS EXPLORED'}</FlowText>
              <FlowText variant="subheading">{memory.conceptsExplored.length}</FlowText>
            </View>
            <View style={styles.metric}>
              <FlowText variant="metadata" tone="muted">{locale === 'he' ? 'משאבים שנפתחו' : 'RESOURCES OPENED'}</FlowText>
              <FlowText variant="subheading">{memory.resourcesExplored.length}</FlowText>
            </View>
          </Section>

          {memory.conceptsExplored.length ? (
            <Section style={styles.concepts}>
              <Eyebrow>{locale === 'he' ? 'ASK יודע שלא צריך להתחיל כאן מאפס' : 'ASK KNOWS IT NEED NOT START HERE FROM ZERO'}</Eyebrow>
              <View style={styles.chips}>
                {memory.conceptsExplored.slice(0, 24).map((concept) => (
                  <Pressable key={concept} accessibilityRole="button" accessibilityLabel={`${locale === 'he' ? 'לשכוח' : 'Forget'} ${concept}`} onPress={() => forgetConcept(concept)} style={styles.chip}>
                    <FlowText variant="bodySmall">{concept}</FlowText><FlowText tone="muted">×</FlowText>
                  </Pressable>
                ))}
              </View>
            </Section>
          ) : null}

          <Section style={styles.separation}>
            <Eyebrow tone="gold">{locale === 'he' ? 'מאגרים נפרדים' : 'SEPARATE STORES'}</Eyebrow>
            <FlowText variant="bodySmall">
              {locale === 'he' ? 'Recovery OS נשאר במאגר מוצפן ונפרד. הפעלת זיכרון Ask אינה מחברת בין המאגרים.' : 'Recovery OS remains in a separate encrypted store. Enabling Ask memory does not connect them.'}
            </FlowText>
          </Section>

          <Section><Action label={tr('deleteAsk', locale)} variant="danger" onPress={confirmForget} /></Section>
        </>
      )}

      <Section><Action label={tr('close', locale)} variant="quiet" onPress={() => router.back()} /></Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  enablePanel: { gap: spacing.lg, padding: spacing.lg, borderRadius: radii.sheet, backgroundColor: colors.surface },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: { flexGrow: 1, minWidth: 120, gap: spacing.xs, padding: spacing.md, borderStartWidth: 2, borderStartColor: colors.teal },
  concepts: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { minHeight: touch.minimum, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.lineStrong },
  separation: { gap: spacing.sm, padding: spacing.lg, borderRadius: radii.control, backgroundColor: colors.surface },
});
