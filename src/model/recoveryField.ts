import { interventionLibrary } from '@/content/interventions';
import type {
  ChangeSignal,
  CheckIn,
  FieldDimensionId,
  FieldDimensions,
  FieldRelationship,
  FieldSnapshot,
  FieldState,
  Intervention,
  InterventionRoute,
  Locale,
  WeeklyReflection,
} from '@/types/recovery';

export const dimensionIds: FieldDimensionId[] = ['body', 'mind', 'control', 'relationships', 'world', 'future'];

export const dimensionLabels: Record<FieldDimensionId, { en: string; he: string }> = {
  body: { en: 'Body', he: 'גוף' },
  mind: { en: 'Mental room', he: 'מרחב נפשי' },
  control: { en: 'Choice room', he: 'מרחב בחירה' },
  relationships: { en: 'Connection', he: 'קשר' },
  world: { en: 'World & structure', he: 'עולם ומבנה' },
  future: { en: 'Future & meaning', he: 'עתיד ומשמעות' },
};

export const signalLabels: Record<ChangeSignal, { en: string; he: string }> = {
  sleep: { en: 'Sleep changed', he: 'השינה השתנתה' },
  stress: { en: 'Stress is higher', he: 'הלחץ עלה' },
  craving: { en: 'Craving is closer', he: 'הדחף קרוב יותר' },
  shame: { en: 'Shame is louder', he: 'הבושה חזקה יותר' },
  conflict: { en: 'There was conflict', he: 'היה עימות' },
  isolation: { en: 'Connection is thinner', he: 'הקשר הצטמצם' },
  flatness: { en: 'Ordinary reward feels flat', he: 'התגמול היומיומי מרגיש שטוח' },
  structure: { en: 'Structure loosened', he: 'המבנה היומי התרופף' },
};

function clamp(value: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, value));
}

function average(...values: number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function normalizeDimensions(input: FieldDimensions): FieldDimensions {
  return Object.fromEntries(
    dimensionIds.map((id) => [id, Number(clamp(input[id]).toFixed(2))]),
  ) as unknown as FieldDimensions;
}

interface Degree {
  id: string;
  active: boolean;
}

function deriveDegrees(values: FieldDimensions): { available: number; total: number; state: FieldState; degrees: Degree[] } {
  const degrees: Degree[] = [
    { id: 'pause', active: values.control >= 3 || values.mind >= 3 },
    { id: 'body-floor', active: values.body >= 3 || values.world >= 3 },
    { id: 'contact', active: values.relationships >= 3 || values.control >= 3 },
    { id: 'boundary', active: values.world >= 3 || values.control >= 4 },
    { id: 'next-hour', active: values.future >= 2 || values.world >= 3 },
    { id: 'urge-distance', active: values.control >= 3 || values.relationships >= 3 },
    { id: 'sleep-protection', active: values.body + values.world >= 11 },
    { id: 'regulate', active: values.mind + values.body >= 11 },
    { id: 'ordinary-reward', active: values.body + values.future >= 11 },
    { id: 'repair', active: values.relationships + values.mind >= 13 },
    { id: 'structure', active: values.world + values.future >= 12 },
    { id: 'longer-horizon', active: values.future >= 7 && values.control >= 6 },
  ];
  const available = Math.max(1, degrees.filter((degree) => degree.active).length);
  const state: FieldState =
    available <= 3
      ? 'compressed'
      : available <= 5
        ? 'narrow'
        : available <= 8
          ? 'reorganizing'
          : available <= 10
            ? 'widening'
            : 'supported';
  return { available, total: degrees.length, state, degrees };
}

function dimensionState(value: number) {
  if (value < 2.5) return 'very_low' as const;
  if (value < 4.5) return 'low' as const;
  if (value < 7.5) return 'available' as const;
  return 'high' as const;
}

function relationshipsFor(signals: ChangeSignal[]): FieldRelationship[] {
  const relationships: FieldRelationship[] = [
    { from: 'body', to: 'mind', strength: signals.includes('sleep') ? 'strong' : 'moderate', status: 'established' },
    { from: 'mind', to: 'control', strength: signals.includes('stress') ? 'strong' : 'moderate', status: 'established' },
    { from: 'relationships', to: 'mind', strength: signals.some((signal) => signal === 'isolation' || signal === 'conflict') ? 'strong' : 'subtle', status: 'established' },
    { from: 'world', to: 'future', strength: signals.includes('structure') ? 'strong' : 'moderate', status: 'established' },
    { from: 'control', to: 'future', strength: signals.some((signal) => signal === 'craving' || signal === 'flatness') ? 'strong' : 'subtle', status: 'possible' },
  ];
  return relationships;
}

export function deriveSnapshot(checkIn: CheckIn, previous?: CheckIn): FieldSnapshot {
  const observed = new Set(checkIn.observedDimensions ?? dimensionIds);
  const previousObserved = new Set(previous?.observedDimensions ?? dimensionIds);
  const values = normalizeDimensions(
    Object.fromEntries(
      dimensionIds.map((id) => [id, observed.has(id) ? checkIn.dimensions[id] : 5]),
    ) as unknown as FieldDimensions,
  );
  const degrees = deriveDegrees(values);
  const bottlenecks = [...observed].sort((left, right) => values[left] - values[right]).slice(0, 2);

  return {
    id: checkIn.id,
    createdAt: checkIn.createdAt,
    dimensions: dimensionIds.map((id) => {
      const delta = previous ? values[id] - previous.dimensions[id] : 0;
      const isObserved = observed.has(id);
      const comparable = isObserved && Boolean(previous) && previousObserved.has(id);
      return {
        id,
        value: values[id],
        state: isObserved ? dimensionState(values[id]) : 'uncertain',
        change: comparable ? (delta > 0.65 ? 'opening' : delta < -0.65 ? 'compressing' : 'stable') : 'unknown',
        observed: isObserved,
      };
    }),
    relationships: relationshipsFor(checkIn.signals),
    state: degrees.state,
    availableDegrees: degrees.available,
    totalDegrees: degrees.total,
    bottlenecks,
    pressure: checkIn.signals,
  };
}

function chooseInterventions(
  domains: Intervention['domain'][],
  preferredGoals: string[],
  used: Set<string>,
  count: number,
): Intervention[] {
  const ranked = interventionLibrary
    .filter((item) => domains.includes(item.domain) && !used.has(item.id))
    .map((item) => ({
      item,
      score:
        item.goals.filter((goal) => preferredGoals.includes(goal)).length * 4 +
        (item.evidenceTier === 'A' ? 2 : item.evidenceTier === 'B' ? 1 : 0) -
        Math.min(...item.doses) / 30,
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, count)
    .map(({ item }) => item);
  ranked.forEach((item) => used.add(item.id));
  return ranked;
}

function routeDuration(steps: Intervention[], quiet: boolean): number {
  if (quiet) return Math.max(1, Math.min(...(steps[0]?.doses ?? [2])));
  return Math.max(2, Math.min(30, steps.reduce((total, step) => total + Math.min(...step.doses), 0)));
}

export function buildRoutes(snapshot: FieldSnapshot, quiet = false): InterventionRoute[] {
  const values = Object.fromEntries(snapshot.dimensions.map((dimension) => [dimension.id, dimension.value])) as FieldDimensions;
  const used = new Set<string>();
  const signal = (value: ChangeSignal) => snapshot.pressure.includes(value);
  const stepCount = quiet ? 1 : 2;

  const bodyGoal = signal('sleep') ? 'sleep-tonight' : values.body < 5 ? 'restore-energy' : 'steady-today';
  const loadGoal = signal('craving') ? 'protect-recovery' : 'reduce-pressure';
  const connectionGoal = signal('isolation') || signal('conflict') || values.relationships < 5 ? 'reconnect' : 'meaningful-progress';

  const definitions = [
    {
      id: 'stabilize-body',
      kind: 'body' as const,
      title: { en: 'Stabilize the body', he: 'לתת לגוף רצפה יציבה' },
      subtitle: { en: 'Begin below language and motivation', he: 'להתחיל מתחת לשפה ולמוטיבציה' },
      rationale: {
        en: signal('sleep') ? 'Sleep has shifted, so this route lowers the cost of the next decision.' : 'A steadier physical floor may make several other routes less expensive.',
        he: signal('sleep') ? 'השינה השתנתה, ולכן המסלול הזה מנסה להוזיל את ההחלטה הבאה.' : 'רצפה גופנית יציבה יותר עשויה להוזיל כמה מסלולים נוספים.',
      },
      steps: chooseInterventions(['body'], [bodyGoal, 'steady-today'], used, stepCount),
      accessibility: values.body + (signal('sleep') ? 2 : 0),
    },
    {
      id: 'reduce-load',
      kind: 'load' as const,
      title: { en: 'Reduce internal load', he: 'להפחית עומס פנימי' },
      subtitle: { en: 'Make the next interval smaller', he: 'להקטין את המרווח הבא' },
      rationale: {
        en: signal('craving') ? 'Craving is closer, so the priority is preserving one safer branch—not winning an argument with the urge.' : 'Mental room is carrying more load; one bounded regulation step may reopen choice.',
        he: signal('craving') ? 'הדחף קרוב יותר, ולכן המטרה היא להשאיר ענף בטוח אחד פתוח — לא לנצח בוויכוח עם הדחף.' : 'המרחב הנפשי נושא יותר עומס; צעד ויסות תחום עשוי לפתוח מחדש בחירה.',
      },
      steps: chooseInterventions(signal('craving') ? ['mind', 'recovery-support'] : ['mind', 'structure'], [loadGoal], used, stepCount),
      accessibility: average(values.mind, values.control) + (signal('stress') || signal('craving') ? 2.5 : 0),
    },
    {
      id: 'reconnect-world',
      kind: 'connection' as const,
      title: { en: 'Reconnect with the world', he: 'להתחבר מחדש לעולם' },
      subtitle: { en: 'Recruit a person, place or ordinary task', he: 'לגייס אדם, מקום או פעולה יומיומית' },
      rationale: {
        en: signal('isolation') ? 'Connection has thinned. This route asks for proximity before it asks for a deep conversation.' : 'A small movement in the world can give intention somewhere concrete to land.',
        he: signal('isolation') ? 'הקשר הצטמצם. המסלול הזה מבקש קודם קרבה, עוד לפני שיחה עמוקה.' : 'תנועה קטנה בעולם יכולה לתת לכוונה מקום ממשי לנחות בו.',
      },
      steps: chooseInterventions(['relationships', 'recovery-support', 'meaning'], [connectionGoal, 'reconnect'], used, stepCount),
      accessibility: average(values.relationships, values.world, values.future) + (signal('isolation') || signal('conflict') ? 2 : 0),
    },
  ];

  const best = [...definitions].sort((left, right) => right.accessibility - left.accessibility)[0]?.id;
  return definitions.map(({ accessibility: _accessibility, ...route }) => {
    const durationMinutes = routeDuration(route.steps, quiet);
    return {
      ...route,
      durationMinutes,
      effort: durationMinutes <= 3 ? 'very_low' : durationMinutes <= 12 ? 'low' : 'moderate',
      isBestNextStep: route.id === best,
    };
  });
}

function averages(checkIns: CheckIn[]): FieldDimensions {
  const result = {} as FieldDimensions;
  for (const id of dimensionIds) {
    result[id] = average(...checkIns.map((entry) => entry.dimensions[id]));
  }
  return result;
}

export function buildWeeklyReflection(checkIns: CheckIn[]): WeeklyReflection {
  const weekId = new Date().toISOString().slice(0, 10);
  if (checkIns.length < 2) {
    return {
      weekId,
      entryCount: checkIns.length,
      observation: { en: 'There is not enough information yet to name a recurring pattern.', he: 'עדיין אין מספיק מידע כדי לתת שם לדפוס חוזר.' },
      availableAnchor: { en: 'The act of returning remains available.', he: 'עצם החזרה עדיין זמינה.' },
      change: { en: 'No change is being inferred from a single moment.', he: 'לא מסיקים שינוי מרגע אחד.' },
      question: { en: 'What would make one small return easier next time?', he: 'מה יקל על חזרה קטנה אחת בפעם הבאה?' },
      experiment: { en: 'Keep one low-cost support visible rather than adding a whole plan.', he: 'השאירו תמיכה אחת בעלת עלות נמוכה גלויה, במקום להוסיף תוכנית שלמה.' },
      evidenceBoundary: { en: 'Observation only. No association or cause can be estimated yet.', he: 'זו תצפית בלבד. עדיין אי אפשר להעריך קשר או סיבה.' },
    };
  }

  const current = checkIns[0];
  const oldest = checkIns.at(-1);
  if (!current || !oldest) return buildWeeklyReflection([]);
  const mean = averages(checkIns);
  const anchor = [...dimensionIds].sort((left, right) => mean[right] - mean[left])[0] ?? 'body';
  const moving = [...dimensionIds].sort(
    (left, right) => Math.abs(current.dimensions[right] - oldest.dimensions[right]) - Math.abs(current.dimensions[left] - oldest.dimensions[left]),
  )[0] ?? 'mind';
  const delta = current.dimensions[moving] - oldest.dimensions[moving];
  const anchorName = dimensionLabels[anchor];
  const movingName = dimensionLabels[moving];

  return {
    weekId,
    entryCount: checkIns.length,
    observation: {
      en: `${movingName.en} showed the clearest movement across the entries available this week.`,
      he: `${movingName.he} הראה את התנועה הברורה ביותר בין הרשומות הזמינות השבוע.`,
    },
    availableAnchor: {
      en: `${anchorName.en} remained the most available part of the field on average.`,
      he: `${anchorName.he} נשאר בממוצע החלק הזמין ביותר בשדה.`,
    },
    change: {
      en: `${movingName.en} was ${Math.abs(delta).toFixed(1)} points ${delta >= 0 ? 'more available' : 'less available'} in the latest entry than in the earliest one.`,
      he: `ברשומה האחרונה, ${movingName.he} היה ${delta >= 0 ? 'זמין יותר' : 'זמין פחות'} ב־${Math.abs(delta).toFixed(1)} נקודות לעומת הרשומה המוקדמת ביותר.`,
    },
    question: {
      en: `What conditions helped ${anchorName.en.toLowerCase()} remain reachable?`,
      he: `אילו תנאים עזרו ל${anchorName.he} להישאר נגיש?`,
    },
    experiment: {
      en: `Keep one support for ${anchorName.en.toLowerCase()} stable while changing only one other condition.`,
      he: `השאירו תמיכה אחת ב${anchorName.he} יציבה, ושנו רק תנאי אחד נוסף.`,
    },
    evidenceBoundary: {
      en: 'The first two statements are observations. The experiment tests an association; it does not assume causality.',
      he: 'שני המשפטים הראשונים הם תצפיות. הניסוי בודק קשר אפשרי; הוא אינו מניח סיבתיות.',
    },
  };
}

export function fieldSummary(snapshot: FieldSnapshot, locale: Locale): string {
  const bottlenecks = snapshot.bottlenecks.map((id) => dimensionLabels[id][locale]).join(locale === 'he' ? ' ו' : ' and ');
  if (locale === 'he') {
    return `שדה החלמה מהרשומה האחרונה. ${bottlenecks} נראים כרגע מצומצמים יותר מבין התחומים שעודכנו. נשארו ${snapshot.availableDegrees} מתוך ${snapshot.totalDegrees} ענפי פעולה אפשריים במודל. זו מפה של דיווח סובייקטיבי, לא הערכה קלינית.`;
  }
  return `Recovery field from the latest entry. ${bottlenecks} currently look more constrained among the domains you updated. ${snapshot.availableDegrees} of ${snapshot.totalDegrees} modeled action branches remain reachable. This is a map of a subjective report, not a clinical assessment.`;
}
