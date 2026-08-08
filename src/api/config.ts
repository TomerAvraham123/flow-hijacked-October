import Constants from 'expo-constants';

const configuredApi = process.env.EXPO_PUBLIC_FLOW_API_BASE_URL;
const configuredCanonical = process.env.EXPO_PUBLIC_FLOW_CANONICAL_URL;
const extras = Constants.expoConfig?.extra as Record<string, unknown> | undefined;
const PRODUCTION_ORIGIN = 'https://flowhijacked.com';

/**
 * Public Expo environment variables are configuration, not secrets. Production
 * networking is nevertheless fail-closed: malformed or non-HTTPS values cannot
 * redirect Ask or canonical content to an untrusted origin.
 */
export function trustedProductionBase(value: unknown): string {
  if (typeof value !== 'string') return PRODUCTION_ORIGIN;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.origin === PRODUCTION_ORIGIN ? url.origin : PRODUCTION_ORIGIN;
  } catch {
    return PRODUCTION_ORIGIN;
  }
}

export const API_BASE_URL = trustedProductionBase(configuredApi ?? extras?.apiBaseUrl);

export const CANONICAL_BASE_URL = trustedProductionBase(configuredCanonical ?? extras?.canonicalBaseUrl);

export function isCanonicalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') && !/[\u0000-\u001F]/.test(path);
}

export function canonicalUrl(path: string): string {
  const base = new URL(CANONICAL_BASE_URL);
  if (!isCanonicalPath(path)) return new URL('/', base).toString();
  const resolved = new URL(path, base);
  return resolved.origin === base.origin ? resolved.toString() : new URL('/', base).toString();
}
