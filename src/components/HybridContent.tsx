import { type Href, router } from 'expo-router';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest, WebViewHttpErrorEvent } from 'react-native-webview/lib/WebViewTypes';

import { canonicalUrl } from '@/api/config';
import { useLocale } from '@/hooks/useLocale';
import { colors, radii, spacing, touch } from '@/theme/tokens';
import { localePath } from '@/utils/bilingual';

import { FlowText } from './Typography';

const copy = {
  loading: { en: 'Preparing the canonical Flow Hijacked surface…', he: 'מכין את תצוגת התוכן של Flow Hijacked…' },
  label: { en: 'Interactive canonical surface', he: 'תצוגה אינטראקטיבית מהמקור' },
  boundary: {
    en: 'This is the only embedded canonical surface on this screen. Navigation, saving and handoffs remain native.',
    he: 'זהו המשטח היחיד במסך שמציג תוכן אינטראקטיבי מן האתר. הניווט, השמירה והמעברים נשארים נייטיביים.',
  },
  unavailable: { en: 'The interactive surface could not be loaded.', he: 'לא הצלחנו לטעון את התצוגה האינטראקטיבית.' },
  retry: { en: 'Try again', he: 'לנסות שוב' },
} as const;

interface HybridContentProps {
  canonicalPath: string;
  title: string;
  minimumHeight?: number;
}

export function HybridContent({ canonicalPath, title, minimumHeight = 560 }: HybridContentProps) {
  const { locale } = useLocale();
  const { height: windowHeight } = useWindowDimensions();
  const webRef = useRef<WebView<Record<never, never>>>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const sourceUrl = useMemo(() => canonicalUrl(localePath(canonicalPath, locale)), [canonicalPath, locale]);
  const sourcePathname = useMemo(() => new URL(sourceUrl).pathname, [sourceUrl]);
  const frameHeight = Math.max(minimumHeight, Math.min(760, windowHeight - 178));

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webRef.current?.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  const handleNavigation = useCallback((event: WebViewNavigation) => {
    setCanGoBack(event.canGoBack);
  }, []);

  const shouldStart = useCallback((request: ShouldStartLoadRequest) => {
    let next: URL;
    try {
      next = new URL(request.url);
    } catch {
      return false;
    }

    if (next.protocol !== 'https:') return false;
    if (next.hostname !== 'flowhijacked.com') {
      void Linking.openURL(next.toString());
      return false;
    }

    if (next.pathname === sourcePathname) return true;
    if (next.pathname.startsWith('/signin-with-chatgpt') || next.pathname.startsWith('/callback')) {
      void Linking.openURL(next.toString());
      return false;
    }

    const normalizedPath = next.pathname.replace(/^\/he(?=\/|$)/, '') || '/';
    if (normalizedPath.startsWith('/ask')) {
      router.push('/(tabs)/ask' as Href);
      return false;
    }
    if (normalizedPath.startsWith('/field')) {
      router.push('/(tabs)/field' as Href);
      return false;
    }
    if (normalizedPath.startsWith('/today')) {
      router.push('/here-now' as Href);
      return false;
    }
    router.push(`${next.pathname}${next.search}${next.hash}` as Href);
    return false;
  }, [sourcePathname]);

  const injectedStyle = `
    (function () {
      var style = document.createElement('style');
      style.textContent = [
        ':root{color-scheme:dark!important;background:#06131E!important}',
        'html,body{background:#06131E!important;color:#F5F0E6!important;overscroll-behavior:none!important}',
        'body{margin:0!important;padding:0!important}',
        'header,[data-site-header],footer,[data-site-footer],[data-cookie-banner],.cookie-banner,.site-nav,.site-footer{display:none!important}',
        'main{margin:0!important;max-width:none!important;padding:0!important}',
        'button,a,[role="button"]{min-height:44px}',
        '*{scrollbar-color:#2AA6A1 #0B1D2B}',
        '@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}'
      ].join('');
      document.documentElement.appendChild(style);
      var viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) { viewport = document.createElement('meta'); viewport.name = 'viewport'; document.head.appendChild(viewport); }
      viewport.content = 'width=device-width,initial-scale=1,maximum-scale=5,user-scalable=yes,viewport-fit=cover';
    })();
    true;
  `;

  return (
    <View style={styles.wrapper}>
      <View style={styles.caption}>
        <FlowText variant='metadata' tone='teal'>{copy.label[locale]}</FlowText>
        <FlowText variant='bodySmall' tone='muted'>{copy.boundary[locale]}</FlowText>
      </View>
      <View style={[styles.frame, { height: frameHeight }]} accessibilityLabel={title}>
        {failed ? (
          <View style={styles.fallback} accessibilityRole='alert'>
            <FlowText align='center'>{copy.unavailable[locale]}</FlowText>
            <Pressable
              accessibilityRole='button'
              onPress={() => {
                setFailed(false);
                setReloadKey((value) => value + 1);
              }}
              style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
            >
              <FlowText style={styles.retryLabel}>{copy.retry[locale]}</FlowText>
            </Pressable>
          </View>
        ) : (
          <WebView<Record<never, never>>
            key={`${sourceUrl}-${reloadKey}`}
            ref={webRef}
            source={{ uri: sourceUrl }}
            style={styles.webview}
            originWhitelist={['https://flowhijacked.com']}
            onShouldStartLoadWithRequest={shouldStart}
            onNavigationStateChange={handleNavigation}
            onError={() => setFailed(true)}
            onHttpError={(event: WebViewHttpErrorEvent) => {
              if (event.nativeEvent.statusCode >= 400) setFailed(true);
            }}
            renderLoading={() => (
              <View style={styles.loading}>
                <FlowText tone='secondary' align='center'>{copy.loading[locale]}</FlowText>
              </View>
            )}
            startInLoadingState
            injectedJavaScriptBeforeContentLoaded={injectedStyle}
            injectedJavaScript={injectedStyle}
            javaScriptEnabled
            domStorageEnabled
            cacheEnabled
            cacheMode='LOAD_CACHE_ELSE_NETWORK'
            thirdPartyCookiesEnabled={false}
            sharedCookiesEnabled={false}
            mixedContentMode='never'
            setSupportMultipleWindows={false}
            javaScriptCanOpenWindowsAutomatically={false}
            mediaPlaybackRequiresUserAction
            allowsFullscreenVideo={false}
            nestedScrollEnabled
            overScrollMode='never'
            applicationNameForUserAgent='FlowHijackedAndroid/1'
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  caption: { gap: spacing.xs, paddingHorizontal: spacing.xxs },
  frame: {
    overflow: 'hidden',
    borderRadius: radii.sheet,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.canvasDeep,
  },
  webview: { flex: 1, backgroundColor: colors.canvasDeep },
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.canvasDeep,
  },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl, padding: spacing.xl },
  retry: {
    minHeight: touch.primaryHeight,
    minWidth: 160,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.action,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  retryLabel: { color: colors.ink, fontWeight: '600' },
  pressed: { opacity: 0.74 },
});
