import type { ChangeSignal, FieldDimensionId, FieldSnapshot } from '@/types/recovery';

export interface Point {
  x: number;
  y: number;
}

export const domainPositions: Record<FieldDimensionId, Point> = {
  body: { x: 0.48, y: 0.76 },
  mind: { x: 0.25, y: 0.31 },
  control: { x: 0.49, y: 0.49 },
  relationships: { x: 0.18, y: 0.67 },
  world: { x: 0.81, y: 0.63 },
  future: { x: 0.76, y: 0.25 },
};

const domainAngles: Record<FieldDimensionId, number> = {
  body: Math.PI / 2,
  mind: Math.PI * 1.2,
  control: Math.PI * 1.72,
  relationships: Math.PI * 0.88,
  world: Math.PI * 0.08,
  future: Math.PI * 1.74,
};

const pressureAngles: Record<ChangeSignal, number> = {
  sleep: Math.PI / 2,
  stress: Math.PI * 1.25,
  craving: Math.PI * 1.52,
  shame: Math.PI * 1.78,
  conflict: Math.PI * 0.93,
  isolation: Math.PI * 0.78,
  flatness: Math.PI * 1.9,
  structure: Math.PI * 0.12,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function angularDistance(left: number, right: number): number {
  const distance = Math.abs(left - right) % (Math.PI * 2);
  return Math.min(distance, Math.PI * 2 - distance);
}

function gaussianAngular(theta: number, center: number, sigma: number): number {
  const distance = angularDistance(theta, center);
  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

function smooth(values: number[], passes = 2): number[] {
  let result = values;
  for (let pass = 0; pass < passes; pass += 1) {
    result = result.map((value, index) => {
      const before = result[(index - 1 + result.length) % result.length] ?? value;
      const after = result[(index + 1) % result.length] ?? value;
      return before * 0.22 + value * 0.56 + after * 0.22;
    });
  }
  return result;
}

export function fieldBoundary(snapshot: FieldSnapshot, width: number, height: number): Point[] {
  const count = 24;
  const center = { x: width / 2, y: height / 2 };
  const baseRadius = Math.min(width, height) * 0.36;
  const averageAvailability = snapshot.dimensions.reduce((sum, item) => sum + item.value, 0) / snapshot.dimensions.length / 10;
  const globalBreadth = 0.68 + (0.92 - 0.68) * averageAvailability;
  const radii: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const theta = (Math.PI * 2 * index) / count;
    const localShape = snapshot.dimensions.reduce(
      (sum, dimension) =>
        sum + 0.11 * (dimension.value / 10 - 0.5) * gaussianAngular(theta, domainAngles[dimension.id], 0.55),
      0,
    );
    const pressureIndent = snapshot.pressure.reduce(
      (sum, signal) => sum + 0.055 * gaussianAngular(theta, pressureAngles[signal], 0.42),
      0,
    );
    const stableAsymmetry = 0.02 * Math.sin(3 * theta + 0.7) + 0.012 * Math.sin(5 * theta + 1.8);
    radii.push(clamp(globalBreadth + localShape - pressureIndent + stableAsymmetry, 0.54, 1.03));
  }

  return smooth(radii).map((radius, index) => {
    const theta = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: center.x + Math.cos(theta) * baseRadius * radius,
      y: center.y + Math.sin(theta) * baseRadius * radius * 0.86,
    };
  });
}

export function scaledDomainPosition(id: FieldDimensionId, width: number, height: number): Point {
  const position = domainPositions[id];
  return { x: position.x * width, y: position.y * height };
}
