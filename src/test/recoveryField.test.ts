import { interventionLibrary } from '@/content/interventions';
import { fieldBoundary, scaledDomainPosition } from '@/model/fieldGeometry';
import { buildRoutes, buildWeeklyReflection, deriveSnapshot, dimensionIds } from '@/model/recoveryField';
import type { CheckIn, FieldDimensions } from '@/types/recovery';

const dimensions = (value: number): FieldDimensions => ({
  body: value,
  mind: value,
  control: value,
  relationships: value,
  world: value,
  future: value,
});

const entry = (id: string, value: number, createdAt = '2026-08-08T10:00:00.000Z'): CheckIn => ({
  id,
  createdAt,
  smallestReturn: value < 5 ? 'harder' : 'same',
  dimensions: dimensions(value),
  signals: value < 5 ? ['sleep', 'stress', 'craving', 'isolation'] : [],
  capacityMode: value < 4 ? 'quiet' : 'standard',
});

describe('Recovery Field model', () => {
  it('describes a multidimensional state and never produces a recovery score', () => {
    const snapshot = deriveSnapshot(entry('compressed', 2));
    expect(snapshot.state).toBe('compressed');
    expect(snapshot.dimensions).toHaveLength(dimensionIds.length);
    expect(snapshot.availableDegrees).toBeGreaterThanOrEqual(1);
    expect(snapshot).not.toHaveProperty('score');
    expect(snapshot).not.toHaveProperty('percentage');
  });

  it('offers three genuinely different routes, exactly one best next step', () => {
    const routes = buildRoutes(deriveSnapshot(entry('current', 4)));
    expect(routes).toHaveLength(3);
    expect(new Set(routes.map((route) => route.kind))).toEqual(new Set(['body', 'load', 'connection']));
    expect(routes.filter((route) => route.isBestNextStep)).toHaveLength(1);
    expect(routes.every((route) => route.steps.length > 0 && route.steps.length <= 2)).toBe(true);
  });

  it('reduces each route to one low-cost step in quiet presentation', () => {
    const routes = buildRoutes(deriveSnapshot(entry('quiet', 2)), true);
    expect(routes.every((route) => route.steps.length === 1)).toBe(true);
    expect(routes.every((route) => route.effort === 'very_low' || route.effort === 'low')).toBe(true);
  });

  it('does not present hidden low-capacity dimensions as newly observed', () => {
    const quietEntry: CheckIn = {
      ...entry('quiet-observed', 9),
      dimensions: { body: 2, mind: 9, control: 2, relationships: 2, world: 9, future: 9 },
      observedDimensions: ['body', 'control', 'relationships'],
      signals: ['stress', 'isolation'],
      capacityMode: 'quiet',
    };
    const snapshot = deriveSnapshot(quietEntry);
    expect(snapshot.dimensions.filter((dimension) => dimension.observed).map((dimension) => dimension.id)).toEqual([
      'body',
      'control',
      'relationships',
    ]);
    expect(snapshot.dimensions.find((dimension) => dimension.id === 'future')).toMatchObject({
      value: 5,
      state: 'uncertain',
      change: 'unknown',
      observed: false,
    });
    expect(snapshot.bottlenecks.every((id) => quietEntry.observedDimensions?.includes(id))).toBe(true);
  });

  it('keeps route rationale and steps responsive across pressure states', () => {
    const sleepRoutes = buildRoutes(deriveSnapshot({ ...entry('sleep', 5), signals: ['sleep'] }));
    const cravingRoutes = buildRoutes(deriveSnapshot({ ...entry('craving', 5), signals: ['craving'] }));
    const isolationRoutes = buildRoutes(deriveSnapshot({ ...entry('isolation', 5), signals: ['isolation'] }));
    expect(sleepRoutes.find((route) => route.kind === 'body')?.rationale.en).toMatch(/Sleep has shifted/);
    expect(cravingRoutes.find((route) => route.kind === 'load')?.rationale.en).toMatch(/Craving is closer/);
    expect(isolationRoutes.find((route) => route.kind === 'connection')?.rationale.en).toMatch(/Connection has thinned/);
    for (const routes of [sleepRoutes, cravingRoutes, isolationRoutes]) {
      expect(routes).toHaveLength(3);
      expect(routes.filter((route) => route.isBestNextStep)).toHaveLength(1);
      expect(new Set(routes.flatMap((route) => route.steps.map((step) => step.id))).size).toBe(
        routes.reduce((total, route) => total + route.steps.length, 0),
      );
    }
  });

  it('uses the full bilingual intervention foundation', () => {
    expect(interventionLibrary.length).toBeGreaterThanOrEqual(40);
    expect(new Set(interventionLibrary.map((item) => item.family)).size).toBeGreaterThanOrEqual(15);
    expect(interventionLibrary.every((item) => item.title.en && item.title.he && item.instruction.en && item.instruction.he)).toBe(true);
  });

  it('builds bounded, deterministic visual geometry', () => {
    const snapshot = deriveSnapshot(entry('geometry', 5));
    const first = fieldBoundary(snapshot, 360, 300);
    const second = fieldBoundary(snapshot, 360, 300);
    expect(first).toEqual(second);
    expect(first).toHaveLength(24);
    expect(first.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 360 && y >= 0 && y <= 300)).toBe(true);
    expect(dimensionIds.every((id) => {
      const point = scaledDomainPosition(id, 360, 300);
      return point.x >= 0 && point.x <= 360 && point.y >= 0 && point.y <= 300;
    })).toBe(true);
    const narrow = fieldBoundary(snapshot, 240, 236);
    expect(narrow.every(({ x, y }) => x >= 0 && x <= 240 && y >= 0 && y <= 236)).toBe(true);
  });

  it('labels weekly claims as observations and associations, not causality', () => {
    const reflection = buildWeeklyReflection([
      entry('latest', 6, '2026-08-08T10:00:00.000Z'),
      entry('earliest', 3, '2026-08-02T10:00:00.000Z'),
    ]);
    expect(reflection.entryCount).toBe(2);
    expect(reflection.evidenceBoundary.en).toMatch(/observations/i);
    expect(reflection.evidenceBoundary.en).toMatch(/does not assume causality/i);
    expect(reflection.evidenceBoundary.he).toMatch(/אינו מניח סיבתיות/);
  });
});
