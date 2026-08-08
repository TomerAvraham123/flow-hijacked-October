import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Action, InlineActions } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSettingsStore } from '@/state/settingsStore';
import { colors, radii, spacing } from '@/theme/tokens';

const principles = {
  en: [
    ['20 seconds can be enough', 'Notice one change and stop there.'],
    ['No recovery score', 'Your field is state, trajectory and interaction—not a grade.'],
    ['Ask is bounded', 'It searches Flow Hijacked and its approved research base; it is not an AI therapist.'],
    ['Local first', 'Recovery memory stays on this device unless you deliberately enable future sync.'],
  ],
  he: [
    ['גם עשרים שניות יכולות להספיק', 'שימו לב לשינוי אחד, ואפשר לעצור שם.'],
    ['אין ציון החלמה', 'השדה מתאר מצב, תנועה ויחסים — לא ציון.'],
    ['Ask הוא מערכת תחומה', 'הוא מחפש ב־Flow Hijacked ובבסיס המחקר המאושר; הוא אינו מטפל מבוסס בינה מלאכותית.'],
    ['קודם כול במכשיר', 'זיכרון ההחלמה נשאר במכשיר אלא אם תבחרו בעתיד לסנכרן אותו.'],
  ],
} as const;

export default function OnboardingScreen() {
  const { locale } = useLocale();
  const setLocale = useSettingsStore((state) => state.setLocale);
  const complete = useSettingsStore((state) => state.completeOnboarding);
  const he = locale === 'he';

  function begin() {
    complete();
    router.replace('/(tabs)/now');
  }

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.hero}>
        <Eyebrow>{he ? 'ליווי להחלמה · מהרגע אל העומק' : 'RECOVERY COMPANION · MOMENT → DEPTH'}</Eyebrow>
        <FlowText variant="display" serif accessibilityRole="header">
          {he ? 'עומק מדעי שנשאר שימושי גם כשאין הרבה מרחב.' : 'Scientific depth that remains usable when there is very little room.'}
        </FlowText>
        <FlowText tone="secondary">
          {he
            ? 'ה־Companion מטפל ברגע. Explore פותח את העומק. Ask מחבר ביניהם, והשדה שומר על רצף בתוך מצבים משתנים.'
            : 'The Companion owns the moment. Explore owns the depth. Ask connects them, and the field preserves continuity through changing states.'}
        </FlowText>
      </Section>

      <Section style={styles.principles}>
        {principles[locale].map(([title, body], index) => (
          <View key={title} style={styles.principle}>
            <FlowText variant="metadata" tone="teal">{String(index + 1).padStart(2, '0')}</FlowText>
            <View style={styles.principleCopy}>
              <FlowText style={styles.principleTitle}>{title}</FlowText>
              <FlowText variant="bodySmall" tone="secondary">{body}</FlowText>
            </View>
          </View>
        ))}
      </Section>

      <Section style={styles.actions}>
        <InlineActions>
          <Action label="English" variant={locale === 'en' ? 'secondary' : 'quiet'} onPress={() => setLocale('en')} style={styles.language} />
          <Action label="עברית" variant={locale === 'he' ? 'secondary' : 'quiet'} onPress={() => setLocale('he')} style={styles.language} />
        </InlineActions>
        <Action
          label={he ? 'להיכנס ל־Flow Hijacked' : 'Enter Flow Hijacked'}
          detail={he ? 'אין צורך לפתוח חשבון' : 'No account required'}
          onPress={begin}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.lg },
  principles: { gap: 0, borderTopWidth: 1, borderTopColor: colors.line },
  principle: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  principleCopy: { flex: 1, gap: spacing.xxs },
  principleTitle: { fontWeight: '600' },
  actions: { gap: spacing.md, padding: spacing.lg, borderRadius: radii.sheet, backgroundColor: colors.surface },
  language: { flex: 1 },
});
