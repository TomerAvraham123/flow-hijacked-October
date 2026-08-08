import { type Href, Redirect, useLocalSearchParams } from 'expo-router';

import { readingDocuments } from '@/content/explore';

export default function LectureAlias() {
  const { slug: routeSlug } = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(routeSlug) ? routeSlug[0] : routeSlug;
  if (!slug) return <Redirect href='/(tabs)/explore' />;

  const canonicalPath = `/lectures/${slug}`;
  const native = Object.values(readingDocuments).find((document) => document.canonicalPath === canonicalPath);
  if (native) return <Redirect href={`/reading/${native.slug}` as Href} />;

  const title = slug.replace(/^\d+-/, '').replaceAll('-', ' ');
  const target = `/reading/canonical-${encodeURIComponent(slug)}?href=${encodeURIComponent(canonicalPath)}&title=${encodeURIComponent(title)}`;
  return <Redirect href={target as Href} />;
}

