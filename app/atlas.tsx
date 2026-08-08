import { StyleSheet, View } from 'react-native';

import { HybridContent } from '@/components/HybridContent';
import { ReadingShell } from '@/components/ReadingShell';
import { Eyebrow, FlowText } from '@/components/Typography';
import { useLocale } from '@/hooks/useLocale';
import { colors, spacing } from '@/theme/tokens';
import type { ContentDestination } from '@/types/content';

const destination: ContentDestination = {
  id: 'brain-atlas',
  kind: 'concept',
  title: { en: 'Recovery Brain Atlas', he: 'אטלס המוח של ההחלמה' },
  subtitle: {
    en: 'Anatomy, circuits, addiction and recovery—revealed one relationship at a time',
    he: 'אנטומיה, מעגלים, התמכרות והחלמה — קשר אחד בכל פעם',
  },
  canonicalPath: '/atlas',
  readingMinutes: 12,
};

const copy = {
  eyebrow: { en: 'Interactive anatomy', he: 'אנטומיה אינטראקטיבית' },
  instruction: {
    en: 'Select one structure. Unrelated anatomy will recede while its most relevant pathways and explanation come forward.',
    he: 'בחרו מבנה אחד. שאר האנטומיה תיסוג מעט, והמסלולים וההסבר הרלוונטיים ביותר יעברו לקדמת הבמה.',
  },
  boundaryTitle: { en: 'What this image is—and is not', he: 'מהי ההמחשה הזאת — ומה היא אינה' },
  boundary: {
    en: 'The atlas is an educational model of established anatomy and selected functional relationships. It is not a scan of your brain, a diagnostic result or a claim that one region causes a whole human experience.',
    he: 'האטלס הוא מודל לימודי של אנטומיה מוכרת ושל קשרים תפקודיים נבחרים. הוא אינו צילום של המוח שלכם, תוצאה אבחונית או טענה שאזור יחיד גורם לחוויה אנושית שלמה.',
  },
} as const;

export default function AtlasScreen() {
  const { locale } = useLocale();
  return (
    <ReadingShell
      destination={destination}
      eyebrow={copy.eyebrow[locale]}
      questionPrompt={locale === 'he' ? 'כיצד המעגל שבחרתי באטלס קשור לדחף, ללמידה ולהחלמה?' : 'How does the circuit I selected in the atlas relate to craving, learning and recovery?'}
    >
      <View style={styles.instruction}>
        <Eyebrow>{copy.eyebrow[locale]}</Eyebrow>
        <FlowText>{copy.instruction[locale]}</FlowText>
      </View>

      <HybridContent canonicalPath='/atlas' title={destination.title[locale]} minimumHeight={620} />

      <View style={styles.boundary}>
        <Eyebrow tone='gold'>{copy.boundaryTitle[locale]}</Eyebrow>
        <FlowText tone='secondary'>{copy.boundary[locale]}</FlowText>
      </View>
    </ReadingShell>
  );
}

const styles = StyleSheet.create({
  instruction: { gap: spacing.sm },
  boundary: {
    paddingStart: spacing.lg,
    paddingVertical: spacing.md,
    borderStartWidth: 2,
    borderStartColor: colors.gold,
    gap: spacing.xs,
  },
});
