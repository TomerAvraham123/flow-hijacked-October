import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Action } from '@/components/Actions';
import { RecoveryFieldVisual } from '@/components/RecoveryFieldVisual';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { tr } from '@/i18n/strings';
import { buildRoutes, deriveSnapshot } from '@/model/recoveryField';
import { defaultDimensions, useRecoveryStore } from '@/state/recoveryStore';
import { useSettingsStore } from '@/state/settingsStore';
import { colors, radii, spacing } from '@/theme/tokens';
import type { CheckIn } from '@/types/recovery';
import { localize } from '@/utils/bilingual';

function illustration(): CheckIn {
  return {
    id: 'illustration',
    createdAt: new Date(0).toISOString(),
    smallestReturn: 'unsure',
    dimensions: defaultDimensions,
    signals: [],
    capacityMode: 'standard',
  };
}

export default function FieldHomeScreen() {
  useSensitiveScreenProtection('field-home');
  const { locale } = useLocale();
  const params = useLocalSearchParams<{ intent?: string; sourceTitle?: string; sourcePath?: string; prompt?: string }>();
  const checkIns = useRecoveryStore((state) => state.checkIns);
  const quietPresentation = useSettingsStore((state) => state.quietMode);
  const latest = checkIns[0];
  const previous = checkIns[1];
  const snapshot = deriveSnapshot(latest ?? illustration(), previous);
  const quiet = quietPresentation || latest?.capacityMode === 'quiet';
  const routes = buildRoutes(snapshot, quiet);
  const best = routes.find((route) => route.isBestNextStep) ?? routes[0];

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{locale === 'he' ? 'השדה שלי · מצב + תנועה + יחסי גומלין' : 'MY FIELD · STATE + TRAJECTORY + INTERACTION'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('recoveryField', locale)}</FlowText>
        <FlowText tone="secondary">{tr('fieldNotScore', locale)}</FlowText>
      </Section>

      {params.intent === 'apply' && params.prompt ? (
        <Section style={styles.handoff}>
          <Eyebrow tone="gold">{locale === 'he' ? 'רעיון שהובא אל השדה' : 'AN IDEA BROUGHT INTO THE FIELD'}</Eyebrow>
          {params.sourceTitle ? <FlowText variant="subheading">{params.sourceTitle}</FlowText> : null}
          <FlowText tone="secondary">{params.prompt}</FlowText>
          <Action
            label={locale === 'he' ? 'לעדכן את השדה דרך העדשה הזאת' : 'Update the field through this lens'}
            variant="secondary"
            onPress={() => router.push('/field/check-in')}
          />
          <Action
            label={locale === 'he' ? 'להשאיר את הרעיון בצד כרגע' : 'Set this idea aside for now'}
            variant="quiet"
            onPress={() => router.replace('/(tabs)/field')}
          />
        </Section>
      ) : null}

      <Section style={styles.visualSection}>
        {!latest ? (
          <View style={styles.illustrationLabel}>
            <FlowText variant="metadata" tone="gold">
              {locale === 'he' ? 'המחשה בלבד · עדיין לא הנתונים שלכם' : 'ILLUSTRATION ONLY · NOT YOUR DATA YET'}
            </FlowText>
          </View>
        ) : null}
        <RecoveryFieldVisual snapshot={snapshot} locale={locale} quiet={quiet} />
      </Section>

      <Section style={styles.actions}>
        <Action label={tr('checkIn', locale)} detail={tr('checkInLead', locale)} onPress={() => router.push('/field/check-in')} />
        {latest ? (
          <>
            <Action label={tr('history', locale)} detail={tr('historyBoundary', locale)} variant="quiet" onPress={() => router.push('/field/history')} />
            <Action label={tr('weekly', locale)} variant="quiet" onPress={() => router.push('/field/weekly')} />
          </>
        ) : null}
      </Section>

      {latest && best ? (
        <Section style={styles.pathSection}>
          <View style={styles.pathLine} />
          <View style={styles.pathCopy}>
            <Eyebrow tone="gold">{tr('mostAccessible', locale)}</Eyebrow>
            <FlowText variant="sectionTitle">{localize(best.title, locale)}</FlowText>
            <FlowText tone="secondary">{localize(best.rationale, locale)}</FlowText>
            <FlowText variant="bodySmall" tone="muted">
              {best.durationMinutes} {locale === 'he' ? 'דקות בקירוב' : 'minutes approximately'}
            </FlowText>
            <Action
              label={locale === 'he' ? 'לפתוח את שלושת המסלולים' : 'Open the three routes'}
              variant="secondary"
              onPress={() => router.push({ pathname: '/field/routes', params: { checkInId: latest.id } })}
            />
          </View>
        </Section>
      ) : null}

      {latest ? (
        <Section>
          <Action
            label={locale === 'he' ? 'למה הדפוס הזה אולי מתרחש?' : 'Why might this pattern be happening?'}
            detail={locale === 'he' ? 'להעביר ל־Ask רק את השאלה, בלי ההיסטוריה שלכם' : 'Hand the question to Ask without your history'}
            variant="quiet"
            onPress={() =>
              router.push({
                pathname: '/(tabs)/ask',
                params: { q: locale === 'he' ? 'למה המרחב שלי עשוי להצטמצם כך ברגעים של לחץ?' : 'Why might my available action space narrow this way under pressure?' },
              })
            }
          />
        </Section>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  visualSection: { gap: spacing.sm },
  illustrationLabel: { padding: spacing.sm, borderRadius: radii.control, backgroundColor: colors.surface },
  actions: { gap: spacing.sm },
  pathSection: { flexDirection: 'row', gap: spacing.lg },
  pathLine: { width: 3, borderRadius: 2, backgroundColor: colors.gold },
  pathCopy: { flex: 1, gap: spacing.md },
  handoff: { gap: spacing.md, paddingStart: spacing.lg, borderStartWidth: 2, borderStartColor: colors.gold },
});
