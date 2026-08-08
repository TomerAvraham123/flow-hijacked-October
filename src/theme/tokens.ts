import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  canvas: '#06131E',
  canvasDeep: '#020C15',
  surface: '#0B1D2B',
  surfaceRaised: '#102A3D',
  surfaceQuiet: '#142735',
  warmCanvas: '#171511',
  warmSurface: '#211D17',
  paper: '#F5F0E6',
  paperBright: '#FBF8F1',
  text: '#F5F0E6',
  textStrong: '#FBF8F1',
  textSecondary: '#BAC5CA',
  textMuted: '#8998A0',
  ink: '#24323B',
  line: 'rgba(245,240,230,0.16)',
  lineStrong: 'rgba(245,240,230,0.28)',
  teal: '#2AA6A1',
  tealSoft: '#67D5D0',
  blue: '#6F9FC8',
  gold: '#C79A3B',
  goldSoft: '#E0C58F',
  warm: '#D4B48A',
  constraint: '#AF9EAB',
  destructive: '#C78277',
  transparent: 'transparent',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  section: 48,
  hero: 64,
} as const;

export const radii = {
  inline: 6,
  control: 10,
  action: 14,
  sheet: 18,
  modal: 24,
  pill: 999,
} as const;

export const touch = {
  minimum: 48,
  primaryHeight: 56,
  minimumGap: 8,
} as const;

export const typography = {
  display: { fontSize: 36, lineHeight: 43, fontWeight: '600' },
  screenTitle: { fontSize: 30, lineHeight: 38, fontWeight: '600' },
  sectionTitle: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  subheading: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 27, fontWeight: '400' },
  bodySmall: { fontSize: 15, lineHeight: 23, fontWeight: '400' },
  metadata: { fontSize: 13, lineHeight: 19, fontWeight: '500', letterSpacing: 0.45 },
} satisfies Record<string, TextStyle>;

export const fontFamilies = {
  sans: Platform.select({ android: 'sans-serif', ios: 'System', default: 'system-ui' }),
  sansMedium: Platform.select({ android: 'sans-serif-medium', ios: 'System', default: 'system-ui' }),
  serif: Platform.select({ android: 'serif', ios: 'Georgia', default: 'Georgia' }),
  mono: Platform.select({ android: 'monospace', ios: 'Menlo', default: 'monospace' }),
} as const;

export const screenGutter = 20;
export const maxReadingWidth = 720;

export const focusRing: ViewStyle = {
  borderColor: colors.goldSoft,
  borderWidth: 2,
};
