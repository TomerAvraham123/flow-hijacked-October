import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
import { useRecoveryStore } from '@/state/recoveryStore';
import { colors, spacing } from '@/theme/tokens';
import { localize } from '@/utils/bilingual';

export default function RoutesScreen() {
  useSensitiveScreenProtection('field-routes');
  const { locale } = useLocale();
  const { checkInId } = useLocalSearchParams<{ checkInId: string }>();
  const checkIns = useRecoveryStore((state) => state.checkIns);
  const checkIn = checkIns.find((entry) => entry.id === checkInId) ?? checkIns[0];
  const previous = checkIns.find((entry) => entry.createdAt < (checkIn?.createdAt ?? ''));
  const [showOthers, setShowOthers] = useState(false);

  if (!checkIn) {
    return (
      <Screen>
        <Wordmark />
        <Section><FlowText>{locale === 'he' ? 'לא נמצאה רשומת שדה. אפשר להתחיל בעדכון קצר.' : 'No field entry was found. You can begin with a short check-in.'}</FlowText></Section>
        <Section><Action label={tr('checkIn', locale)} onPress={() => router.replace('/field/check-in')} /></Section>
      </Screen>
    );
  }

  const snapshot = deriveSnapshot(checkIn, previous);
  const routes = buildRoutes(snapshot, checkIn.capacityMode === 'quiet');
  const best = routes.find((route) => route.isBestNextStep) ?? routes[0];
  const others = routes.filter((route) => route.id !== best?.id);

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.heading}>
        <Eyebrow>{locale === 'he' ? 'תמונת מצב של ההחלמה · מבוססת על הרגע הזה' : 'RECOVERY BRIEF · BASED ON THIS MOMENT'}</Eyebrow>
        <FlowText variant="screenTitle" serif accessibilityRole="header">{tr('routesTitle', locale)}</FlowText>
        <FlowText tone="secondary">{tr('routesLead', locale)}</FlowText>
      </Section>

      <Section>
        <RecoveryFieldVisual snapshot={snapshot} locale={locale} quiet={checkIn.capacityMode === 'quiet'} />
      </Section>

      {best ? (
        <Section style={styles.bestPath}>
          <View style={styles.path} />
          <View style={styles.routeCopy}>
            <Eyebrow tone="gold">{tr('mostAccessible', locale)}</Eyebrow>
            <FlowText variant="sectionTitle">{localize(best.title, locale)}</FlowText>
            <FlowText tone="secondary">{localize(best.subtitle, locale)}</FlowText>
            <FlowText>{localize(best.rationale, locale)}</FlowText>
            <FlowText variant="bodySmall" tone="muted">
              {best.durationMinutes} {locale === 'he' ? 'דקות בקירוב' : 'minutes approximately'} · {tr(best.effort === 'very_low' ? 'effortVeryLow' : best.effort === 'low' ? 'effortLow' : 'effortModerate', locale)}
            </FlowText>
            <Action
              label={tr('startNow', locale)}
              onPress={() => router.push({ pathname: '/field/action', params: { checkInId: checkIn.id, routeId: best.id } })}
            />
          </View>
        </Section>
      ) : null}

      {checkIn.capacityMode === 'quiet' && !showOthers ? (
        <Section><Action label={tr('otherRoutes', locale)} variant="quiet" onPress={() => setShowOthers(true)} /></Section>
      ) : (
        <Section style={styles.others}>
          <Eyebrow>{tr('otherRoutes', locale)}</Eyebrow>
          {others.map((route, index) => (
            <View key={route.id} style={styles.otherRoute}>
              <FlowText variant="metadata" tone="muted">{String(index + 2).padStart(2, '0')}</FlowText>
              <View style={styles.routeCopy}>
                <FlowText variant="subheading">{localize(route.title, locale)}</FlowText>
                <FlowText tone="secondary">{localize(route.rationale, locale)}</FlowText>
                <FlowText variant="bodySmall" tone="muted">{route.durationMinutes} {locale === 'he' ? 'דקות בקירוב' : 'minutes approximately'}</FlowText>
                <Action
                  label={locale === 'he' ? 'לבחור במסלול הזה' : 'Choose this route'}
                  variant="quiet"
                  onPress={() => router.push({ pathname: '/field/action', params: { checkInId: checkIn.id, routeId: route.id } })}
                />
              </View>
            </View>
          ))}
        </Section>
      )}

      <Section>
        <FlowText variant="bodySmall" tone="muted">
          {locale === 'he'
            ? 'זו התאמה חינוכית ודינמית, לא קביעה קלינית. בחירה במסלול קטן יותר אינה כישלון.'
            : 'This is a dynamic educational fit, not a clinical determination. Choosing a smaller route is not failure.'}
        </FlowText>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: spacing.md },
  bestPath: { flexDirection: 'row', gap: spacing.lg },
  path: { width: 4, borderRadius: 2, backgroundColor: colors.gold },
  routeCopy: { flex: 1, gap: spacing.md },
  others: { gap: spacing.lg },
  otherRoute: { flexDirection: 'row', gap: spacing.md, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.line },
});
