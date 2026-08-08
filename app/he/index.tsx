import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { useSettingsStore } from '@/state/settingsStore';

export default function HebrewHomeAlias() {
  const setLocale = useSettingsStore((state) => state.setLocale);
  useEffect(() => setLocale('he'), [setLocale]);
  return <Redirect href='/(tabs)/now' />;
}
