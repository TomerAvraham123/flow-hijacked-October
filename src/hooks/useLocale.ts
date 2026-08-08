import { useSettingsStore } from '@/state/settingsStore';
import { isRtl } from '@/utils/bilingual';

export function useLocale() {
  const locale = useSettingsStore((state) => state.locale);
  return { locale, rtl: isRtl(locale) };
}
