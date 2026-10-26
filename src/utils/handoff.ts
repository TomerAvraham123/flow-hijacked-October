import { router, type Href } from 'expo-router';

import type { AskDestination } from '@/types/ask';

export function openFlowDestination(destination: AskDestination): void {
  const cleanPath = destination.href.split('#')[0]?.split('?')[0] ?? destination.href;
  const slug = cleanPath.split('/').filter(Boolean).at(-1) ?? 'flow-hijacked';

  switch (destination.type) {
    case 'recovery_field':
      router.push('/(tabs)/field');
      return;
    case 'brain_atlas':
      router.push({ pathname: '/atlas', params: { source: 'ask', href: destination.href } });
      return;
    case 'neuromodulation':
      router.push({ pathname: '/neuromodulation', params: { href: destination.href } });
      return;
    case 'therapy_routes':
      router.push({ pathname: '/therapy/[slug]', params: { slug, href: destination.href } });
      return;
    case 'research':
      router.push({ pathname: '/research', params: { href: destination.href } });
      return;
    case 'here_and_now':
      router.push('/here-now');
      return;
    case 'urgent_support':
      router.push({ pathname: '/support', params: { href: destination.href } });
      return;
    case 'professional_support':
    case 'toolkit':
    case 'lecture':
    case 'concept':
      router.push({ pathname: '/reading/[slug]', params: { slug, href: destination.href, title: destination.label } });
      return;
    default:
      router.push(destination.href as Href);
  }
}
