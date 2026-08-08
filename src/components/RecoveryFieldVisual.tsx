import { Canvas, Circle, DashPathEffect, Group, Line, Path, Skia, vec } from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { FlowText } from './Typography';
import { dimensionLabels, fieldSummary } from '@/model/recoveryField';
import { fieldBoundary, scaledDomainPosition, type Point } from '@/model/fieldGeometry';
import { colors, radii, spacing, touch } from '@/theme/tokens';
import type { FieldDimensionId, FieldSnapshot, Locale } from '@/types/recovery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function closedCurve(points: Point[]) {
  const path = Skia.Path.Make();
  const first = points[0];
  if (!first) return path;
  path.moveTo(first.x, first.y);
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index] ?? first;
    const next = points[(index + 1) % points.length] ?? first;
    const before = points[(index - 1 + points.length) % points.length] ?? current;
    const after = points[(index + 2) % points.length] ?? next;
    path.cubicTo(
      current.x + (next.x - before.x) / 6,
      current.y + (next.y - before.y) / 6,
      next.x - (after.x - current.x) / 6,
      next.y - (after.y - current.y) / 6,
      next.x,
      next.y,
    );
  }
  path.close();
  return path;
}

function stateWord(state: string, locale: Locale): string {
  const words: Record<string, { en: string; he: string }> = {
    very_low: { en: 'strongly constrained', he: 'מצומצם מאוד' },
    low: { en: 'more constrained', he: 'מצומצם יותר' },
    available: { en: 'available', he: 'זמין' },
    high: { en: 'more available', he: 'זמין יותר' },
    uncertain: { en: 'not enough information', he: 'אין מספיק מידע' },
  };
  return words[state]?.[locale] ?? state;
}

export function RecoveryFieldVisual({ snapshot, locale, quiet = false }: { snapshot: FieldSnapshot; locale: Locale; quiet?: boolean }) {
  const { width: windowWidth, fontScale } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const width = Math.min(520, Math.max(240, windowWidth - 40));
  const height = quiet ? 236 : 306;
  const [selected, setSelected] = useState<FieldDimensionId>(snapshot.bottlenecks[0] ?? 'control');
  const points = useMemo(() => fieldBoundary(snapshot, width, height), [snapshot, width, height]);
  const boundary = useMemo(() => closedCurve(points), [points]);
  const selectedPosition = scaledDomainPosition(selected, width, height);
  const motionReduced = reducedMotion || quiet;
  const haloOpacity = useSharedValue(motionReduced ? 0.18 : 0.12);

  useEffect(() => {
    if (motionReduced) {
      haloOpacity.value = 0.18;
      return;
    }
    haloOpacity.value = withRepeat(
      withSequence(withTiming(0.42, { duration: 1100 }), withTiming(0.12, { duration: 1100 })),
      2,
      false,
    );
  }, [haloOpacity, motionReduced, selected]);

  const selectedDimension = snapshot.dimensions.find((dimension) => dimension.id === selected);
  const showFullList = !quiet || fontScale > 1.25;

  return (
    <View style={styles.wrapper}>
      <FlowText accessibilityRole="summary" tone="secondary" style={styles.semanticSummary}>
        {fieldSummary(snapshot, locale)}
      </FlowText>
      <View style={[styles.canvasFrame, { width, height }]}>
        <Canvas style={StyleSheet.absoluteFill} accessible={false}>
          <Path path={boundary} color="rgba(42,166,161,0.08)" style="fill" />
          <Path path={boundary} color={colors.tealSoft} style="stroke" strokeWidth={1.6} />
          <Path path={boundary} color="rgba(111,159,200,0.36)" style="stroke" strokeWidth={7} opacity={0.18} />
          {!quiet ? (
            <Group>
              {snapshot.relationships.map((relationship) => {
                const from = scaledDomainPosition(relationship.from, width, height);
                const to = scaledDomainPosition(relationship.to, width, height);
                return (
                  <Line
                    key={`${relationship.from}-${relationship.to}`}
                    p1={vec(from.x, from.y)}
                    p2={vec(to.x, to.y)}
                    color={relationship.status === 'established' ? 'rgba(245,240,230,0.35)' : 'rgba(199,154,59,0.48)'}
                    strokeWidth={relationship.strength === 'strong' ? 2 : relationship.strength === 'moderate' ? 1.4 : 1}
                  >
                    {relationship.status === 'possible' ? <DashPathEffect intervals={[7, 7]} /> : null}
                  </Line>
                );
              })}
            </Group>
          ) : null}
          <Circle cx={selectedPosition.x} cy={selectedPosition.y} r={29} color={colors.goldSoft} opacity={haloOpacity} />
          {snapshot.dimensions.map((dimension) => {
            const position = scaledDomainPosition(dimension.id, width, height);
            const chosen = dimension.id === selected;
            return (
              <Group key={dimension.id}>
                <Circle
                  cx={position.x}
                  cy={position.y}
                  r={chosen ? 10 : 7}
                  color={chosen ? colors.goldSoft : dimension.change === 'compressing' ? colors.constraint : colors.blue}
                />
                <Circle cx={position.x} cy={position.y} r={chosen ? 15 : 11} color={colors.paper} style="stroke" strokeWidth={1} opacity={0.5} />
              </Group>
            );
          })}
        </Canvas>
        {snapshot.dimensions.map((dimension) => {
          const position = scaledDomainPosition(dimension.id, width, height);
          return (
            <Pressable
              key={dimension.id}
              accessible={!showFullList}
              importantForAccessibility={showFullList ? 'no' : 'yes'}
              accessibilityRole="button"
              accessibilityLabel={`${dimensionLabels[dimension.id][locale]}, ${stateWord(dimension.state, locale)}`}
              accessibilityState={{ selected: selected === dimension.id }}
              onPress={() => setSelected(dimension.id)}
              style={[
                styles.nodeTouch,
                { left: position.x - touch.minimum / 2, top: position.y - touch.minimum / 2 },
              ]}
            />
          );
        })}
        <View accessible={false} importantForAccessibility="no-hide-descendants" pointerEvents="none" style={styles.currentLabel}>
          <FlowText variant="metadata" tone="gold">{dimensionLabels[selected][locale]}</FlowText>
          <FlowText variant="bodySmall">{stateWord(selectedDimension?.state ?? 'uncertain', locale)}</FlowText>
        </View>
      </View>
      {showFullList ? (
        <View style={styles.domainGrid} accessibilityRole="list">
          {snapshot.dimensions.map((dimension) => (
            <Pressable
              key={dimension.id}
              accessibilityRole="button"
              accessibilityLabel={`${dimensionLabels[dimension.id][locale]}, ${stateWord(dimension.state, locale)}`}
              accessibilityState={{ selected: selected === dimension.id }}
              onPress={() => setSelected(dimension.id)}
              style={[styles.domainRow, selected === dimension.id && styles.domainSelected]}
            >
              <FlowText variant="bodySmall" style={styles.domainLabel}>{dimensionLabels[dimension.id][locale]}</FlowText>
              <FlowText variant="bodySmall" tone="muted">{stateWord(dimension.state, locale)}</FlowText>
            </Pressable>
          ))}
        </View>
      ) : null}
      <FlowText variant="bodySmall" tone="muted">
        {locale === 'he'
          ? 'גבול = מרחב פעולה · קו מלא = קשר במסגרת · קו מקווקו = קשר לבדיקה'
          : 'Boundary = action space · solid = framework relationship · dashed = relationship to explore'}
      </FlowText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md, alignItems: 'center' },
  semanticSummary: { alignSelf: 'stretch' },
  canvasFrame: {
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: radii.sheet,
    backgroundColor: colors.canvasDeep,
    borderWidth: 1,
    borderColor: colors.line,
  },
  nodeTouch: { position: 'absolute', width: touch.minimum, height: touch.minimum, borderRadius: touch.minimum / 2 },
  currentLabel: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    alignItems: 'center',
  },
  domainGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  domainRow: {
    width: '48%',
    minHeight: touch.minimum,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderStartWidth: 2,
    borderStartColor: colors.lineStrong,
  },
  domainSelected: { borderStartColor: colors.goldSoft, backgroundColor: 'rgba(199,154,59,0.06)' },
  domainLabel: { fontWeight: '600' },
});
