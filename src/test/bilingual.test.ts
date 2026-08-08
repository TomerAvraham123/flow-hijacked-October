import { copyKeys, tr } from '@/i18n/strings';
import { canonicalUrl, isCanonicalPath, trustedProductionBase } from '@/api/config';
import { localePath } from '@/utils/bilingual';

describe('bilingual parity and routing', () => {
  it('has non-empty English and Hebrew copy for every shared key', () => {
    expect(copyKeys.length).toBeGreaterThan(80);
    for (const key of copyKeys) {
      expect(tr(key, 'en').trim()).not.toBe('');
      expect(tr(key, 'he').trim()).not.toBe('');
    }
  });

  it('maps standard pages and the canonical Hebrew lecture exception correctly', () => {
    expect(localePath('/research', 'he')).toBe('/he/research');
    expect(localePath('/lectures/37-recovery-social-ecology', 'he')).toBe('/he/37-recovery-social-ecology');
    expect(localePath('/lectures/37-recovery-social-ecology#references', 'he')).toBe('/he/37-recovery-social-ecology#references');
    expect(localePath('/he/research', 'he')).toBe('/he/research');
    expect(localePath('/research', 'en')).toBe('/research');
  });

  it('keeps canonical paths on the configured first-party origin', () => {
    expect(isCanonicalPath('/atlas?region=insula')).toBe(true);
    expect(isCanonicalPath('//outside.example/path')).toBe(false);
    expect(isCanonicalPath('/\\outside.example/path')).toBe(false);
    expect(canonicalUrl('//outside.example/path')).toBe('https://flowhijacked.com/');
  });

  it('fails closed when a public production endpoint is malformed or untrusted', () => {
    expect(trustedProductionBase('https://flowhijacked.com/api')).toBe('https://flowhijacked.com');
    expect(trustedProductionBase('http://flowhijacked.com')).toBe('https://flowhijacked.com');
    expect(trustedProductionBase('https://lookalike.example')).toBe('https://flowhijacked.com');
    expect(trustedProductionBase('not a URL')).toBe('https://flowhijacked.com');
  });
});
