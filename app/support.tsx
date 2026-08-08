import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { canonicalUrl } from '@/api/config';
import { Action } from '@/components/Actions';
import { Screen, Section } from '@/components/Screen';
import { Eyebrow, FlowText } from '@/components/Typography';
import { Wordmark } from '@/components/Wordmark';
import { useLocale } from '@/hooks/useLocale';
import { useSensitiveScreenProtection } from '@/hooks/useSensitiveScreenProtection';
import { colors, radii, spacing } from '@/theme/tokens';

const copy = {
  eyebrow: { en: 'Human support first', he: 'קודם כול, תמיכה אנושית' },
  title: { en: 'This moment may need more than an answer.', he: 'ייתכן שהרגע הזה צריך יותר מתשובה.' },
  body: {
    en: 'Ask Flow Hijacked is educational. It is not emergency care and cannot see what is happening around you.',
    he: 'Ask Flow Hijacked נועד להבנה וללמידה. הוא אינו שירות חירום ואינו יכול לראות מה קורה סביבכם.',
  },
  urgentTitle: { en: 'If there is immediate danger', he: 'אם קיימת סכנה מיידית' },
  urgentBody: {
    en: 'Contact your local emergency services now or go to the nearest emergency department. If you can, move away from anything you could use to harm yourself or someone else and stay with a trusted person.',
    he: 'פנו עכשיו לשירותי החירום במקום שבו אתם נמצאים, או הגיעו לחדר המיון הקרוב. אם אפשר, התרחקו מכל דבר שעלול לשמש לפגיעה בכם או באדם אחר והישארו לצד אדם שאתם סומכים עליו.',
  },
  bridgeTitle: { en: 'One bridge for the next few minutes', he: 'גשר אחד לדקות הקרובות' },
  bridgeBody: {
    en: 'Call or message one reachable person and say plainly: “I need you to stay with me while I get support.” You do not need to explain everything first.',
    he: 'התקשרו או כתבו לאדם אחד שיכול להיות זמין, ואמרו בפשטות: „אני צריך עזרה עכשיו. בבקשה הישארו איתי בזמן שאני פונה לעזרה.” אין צורך להסביר הכול לפני כן.',
  },
  resources: { en: 'Find a verified helpline near me', he: 'למצוא קו סיוע מאומת באזור שלי' },
  resourcesBoundary: {
    en: 'This opens Find A Helpline, an external directory. Flow Hijacked does not send your question or Recovery Field.',
    he: 'הקישור פותח את Find A Helpline, מאגר חיצוני. Flow Hijacked אינו שולח אליו את השאלה או את שדה ההחלמה שלכם.',
  },
  back: { en: 'Return to Now', he: 'לחזור לעכשיו' },
} as const;

export default function SupportScreen() {
  useSensitiveScreenProtection('support');
  const { locale } = useLocale();
  const { href } = useLocalSearchParams<{ href?: string | string[] }>();
  const requestedPath = Array.isArray(href) ? href[0] : href;
  const safePath = requestedPath?.startsWith('/') ? requestedPath : '/disclaimer';
  const text = <K extends keyof typeof copy>(key: K) => copy[key][locale];

  return (
    <Screen>
      <Wordmark />
      <Section style={styles.intro}>
        <Eyebrow tone='gold'>{text('eyebrow')}</Eyebrow>
        <FlowText variant='display' serif accessibilityRole='header'>{text('title')}</FlowText>
        <FlowText variant='subheading' tone='secondary'>{text('body')}</FlowText>
      </Section>

      <Section style={styles.urgent}>
        <View style={styles.marker} accessibilityElementsHidden />
        <View style={styles.copy}>
          <FlowText variant='sectionTitle'>{text('urgentTitle')}</FlowText>
          <FlowText>{text('urgentBody')}</FlowText>
        </View>
      </Section>

      <Section style={styles.bridge}>
        <FlowText variant='sectionTitle'>{text('bridgeTitle')}</FlowText>
        <FlowText tone='secondary'>{text('bridgeBody')}</FlowText>
      </Section>

      <Section style={styles.actions}>
        <Action label={text('resources')} onPress={() => void WebBrowser.openBrowserAsync('https://findahelpline.com/')} />
        <FlowText variant='bodySmall' tone='muted'>{text('resourcesBoundary')}</FlowText>
        {requestedPath ? (
          <Action label={locale === 'he' ? 'לפתוח את חומר התמיכה של Flow Hijacked' : 'Open Flow Hijacked support material'} variant='quiet' onPress={() => void WebBrowser.openBrowserAsync(canonicalUrl(safePath))} />
        ) : null}
        <Action label={text('back')} variant='quiet' onPress={() => router.replace('/(tabs)/now')} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.md },
  urgent: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.destructive,
    borderRadius: radii.action,
    backgroundColor: 'rgba(199,130,119,0.08)',
  },
  marker: { width: 4, borderRadius: 2, backgroundColor: colors.destructive },
  copy: { flex: 1, gap: spacing.md },
  bridge: { gap: spacing.md, paddingStart: spacing.lg, borderStartWidth: 2, borderStartColor: colors.gold },
  actions: { gap: spacing.sm },
});
