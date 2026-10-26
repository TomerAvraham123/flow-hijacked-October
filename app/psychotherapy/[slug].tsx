import { type Href, Redirect, useLocalSearchParams } from 'expo-router';

const nativeRoutes: Record<string, string> = {
  'acceptance-commitment-therapy': 'act',
  'dialectical-behavior-therapy': 'dbt',
  'motivational-relapse-contingency': 'motivational-interviewing',
};

export default function PsychotherapyAlias() {
  const { slug: routeSlug } = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
  if (!slug) return <Redirect href='/therapy/act' />;
  const native = nativeRoutes[slug];
  if (native) return <Redirect href={`/therapy/${native}` as Href} />;

  const canonicalPath = `/psychotherapy/${slug}`;
  const title = slug.replaceAll('-', ' ');
  const target = `/reading/therapy-${encodeURIComponent(slug)}?href=${encodeURIComponent(canonicalPath)}&title=${encodeURIComponent(title)}`;
  return <Redirect href={target as Href} />;
}

