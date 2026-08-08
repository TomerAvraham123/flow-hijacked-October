import { colors, touch } from '@/theme/tokens';

function relativeLuminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g)?.map((value) => Number.parseInt(value, 16) / 255) ?? [];
  const linear = channels.map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (linear[0] ?? 0) + 0.7152 * (linear[1] ?? 0) + 0.0722 * (linear[2] ?? 0);
}

function contrast(left: string, right: string): number {
  const a = relativeLuminance(left);
  const b = relativeLuminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('accessibility design tokens', () => {
  it('keeps all standard touch targets at least 48 dp', () => {
    expect(touch.minimum).toBeGreaterThanOrEqual(48);
    expect(touch.primaryHeight).toBeGreaterThanOrEqual(touch.minimum);
    expect(touch.minimumGap).toBeGreaterThanOrEqual(8);
  });

  it.each([
    ['primary text', colors.text],
    ['secondary text', colors.textSecondary],
    ['muted text', colors.textMuted],
    ['teal information', colors.tealSoft],
    ['gold action', colors.goldSoft],
  ])('%s remains AA-readable on the primary dark canvas', (_name, foreground) => {
    expect(contrast(foreground, colors.canvas)).toBeGreaterThanOrEqual(4.5);
  });
});
