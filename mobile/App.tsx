import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
// RN WebView types can lag RN major versions; runtime API is stable.
import { WebView } from "react-native-webview";
import type {
  WebViewNavigation,
  WebViewHttpErrorEvent,
  WebViewErrorEvent,
  ShouldStartLoadRequest,
  WebViewMessageEvent,
  WebViewProgressEvent,
} from "react-native-webview/lib/WebViewTypes";
import * as Linking from "expo-linking";
import * as Network from "expo-network";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";

/** Live website — same product as the PC browser version */
const SITE_URL =
  (Constants.expoConfig?.extra?.siteUrl as string | undefined) ||
  "https://www.thevillageseverythingapp.com";

const BRAND_BLUE = "#0c4a6e";
const BRAND_GOLD = "#f59e0b";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebViewRef = any;

SplashScreen.preventAutoHideAsync().catch(() => {
  /* already prevented or unavailable in some environments */
});

function isPrivateLanHost(host: string): boolean {
  if (host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1") {
    return true;
  }
  // Common home/office private ranges (for Expo Go local testing)
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return false;
}

function isDangerousUrl(url: string): boolean {
  const lower = url.trim().toLowerCase();
  return (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("file:") ||
    lower.startsWith("blob:") ||
    lower.startsWith("intent:")
  );
}

function isOurSite(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    let configuredHost = "";
    try {
      configuredHost = new URL(SITE_URL).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      /* ignore bad SITE_URL */
    }
    if (host === "thevillageseverythingapp.com") return true;
    if (configuredHost !== "" && host === configuredHost) return true;
    if (__DEV__) {
      return (
        host === "localhost" ||
        host.endsWith(".vercel.app") ||
        isPrivateLanHost(host)
      );
    }
    return false;
  } catch {
    return false;
  }
}

function isExternalAppUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.startsWith("tel:") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("sms:") ||
    lower.startsWith("geo:") ||
    lower.startsWith("maps:") ||
    lower.startsWith("comgooglemaps:") ||
    lower.startsWith("itms-apps:") ||
    lower.startsWith("market:")
  );
}

function Shell() {
  const insets = useSafeAreaInsets();
  const webRef = useRef<WebViewRef>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [offline, setOffline] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showNativeChrome, setShowNativeChrome] = useState(false);

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const checkNetwork = useCallback(async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setOffline(!online);
      return online;
    } catch {
      setOffline(false);
      return true;
    }
  }, []);

  useEffect(() => {
    checkNetwork();
  }, [checkNetwork]);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webRef.current) {
        webRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  const reload = useCallback(async () => {
    setLoadError(null);
    const online = await checkNetwork();
    if (!online) return;
    setLoading(true);
    webRef.current?.reload();
  }, [checkNetwork]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setTimeout(() => setRefreshing(false), 600);
  }, [reload]);

  const openExternal = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {
      /* ignore */
    }
  }, []);

  const onShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest) => {
      const { url } = request;
      if (!url || url === "about:blank") return true;
      if (isDangerousUrl(url)) return false;

      if (isExternalAppUrl(url)) {
        openExternal(url);
        return false;
      }

      if (isOurSite(url)) return true;

      openExternal(url);
      return false;
    },
    [openExternal],
  );

  const onNavChange = useCallback((nav: WebViewNavigation) => {
    setCanGoBack(nav.canGoBack);
  }, []);

  if (offline) {
    return (
      <View style={[styles.safe, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />
        <ScrollView
          contentContainerStyle={styles.centered}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND_GOLD} />
          }
        >
          <Text style={styles.emoji}>📡</Text>
          <Text style={styles.title}>You&apos;re offline</Text>
          <Text style={styles.body}>
            The Villages Everything App needs a connection for villages, dining, calendar, and
            member features. Connect to Wi‑Fi or cellular, then try again.
          </Text>
          <Pressable style={styles.button} onPress={reload}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
          <Text style={styles.hint}>Pull down to refresh</Text>
        </ScrollView>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={[styles.safe, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />
        <View style={styles.centered}>
          <Text style={styles.emoji}>🛠️</Text>
          <Text style={styles.title}>Couldn&apos;t load the app</Text>
          <Text style={styles.body}>{loadError}</Text>
          <Pressable style={styles.button} onPress={reload}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
          <Pressable style={styles.linkBtn} onPress={() => openExternal(SITE_URL)}>
            <Text style={styles.linkText}>Open in browser instead</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Cast avoids brittle WebView prop types across RN versions.
  const AppWebView = WebView as React.ComponentType<Record<string, unknown>>;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {showNativeChrome ? (
        <View style={[styles.chrome, { paddingTop: Math.max(insets.top, 8) }]}>
          <Text style={styles.chromeTitle} numberOfLines={1}>
            The Villages Everything App
          </Text>
          <View style={styles.chromeActions}>
            {canGoBack ? (
              <Pressable onPress={() => webRef.current?.goBack()} hitSlop={10}>
                <Text style={styles.chromeBtn}>‹ Back</Text>
              </Pressable>
            ) : (
              <View style={{ width: 52 }} />
            )}
            <Pressable onPress={reload} hitSlop={10}>
              <Text style={styles.chromeBtn}>Refresh</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={{ height: insets.top, backgroundColor: "#ffffff" }} />
      )}

      <AppWebView
        ref={webRef}
        source={{ uri: SITE_URL }}
        style={styles.webview}
        originWhitelist={[
          "https://www.thevillageseverythingapp.com",
          "https://thevillageseverythingapp.com",
          "about:blank",
        ]}
        mixedContentMode="never"
        allowFileAccess={false}
        allowFileAccessFromFileURLs={false}
        allowUniversalAccessFromFileURLs={false}
        onLoadStart={() => {
          setLoading(true);
          setLoadError(null);
        }}
        onLoadEnd={() => {
          setLoading(false);
          setRefreshing(false);
          hideSplash();
        }}
        onLoadProgress={({ nativeEvent }: WebViewProgressEvent) => {
          if (nativeEvent.progress > 0.7) hideSplash();
        }}
        onError={(e: WebViewErrorEvent) => {
          setLoading(false);
          hideSplash();
          const desc = e.nativeEvent.description || "Network error while loading the site.";
          const code = e.nativeEvent.code != null ? ` (code ${e.nativeEvent.code})` : "";
          setLoadError(`${desc}${code}\n\nTrying to open:\n${SITE_URL}`);
        }}
        onHttpError={(e: WebViewHttpErrorEvent) => {
          if (e.nativeEvent.statusCode >= 500) {
            setLoading(false);
            hideSplash();
            setLoadError(`Server error (${e.nativeEvent.statusCode}). Please try again shortly.`);
          }
        }}
        onNavigationStateChange={onNavChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        incognito={false}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        geolocationEnabled={false}
        startInLoadingState
        applicationNameForUserAgent=" VillagesEverythingApp/1.1"
        onMessage={(event: WebViewMessageEvent) => {
          if (event.nativeEvent.data === "toggle-chrome") {
            setShowNativeChrome((v) => !v);
          }
        }}
        injectedJavaScript={`
          (function () {
            document.documentElement.style.webkitTouchCallout = 'default';
            // Hide site floats that clutter the phone app (Quips + theme music)
            if (!document.getElementById('vea-hide-floats')) {
              var s = document.createElement('style');
              s.id = 'vea-hide-floats';
              s.textContent = '.mascot-quip-toggle,.mascot-quip-popup,.theme-music{display:none!important;visibility:hidden!important;pointer-events:none!important;}';
              document.head.appendChild(s);
            }
            true;
          })();
        `}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={BRAND_BLUE} />
            <Text style={styles.loadingText}>Loading The Villages…</Text>
          </View>
        )}
      />

      {loading ? (
        <View style={styles.loadingBanner} pointerEvents="none">
          <ActivityIndicator size="small" color={BRAND_BLUE} />
        </View>
      ) : null}

      <View style={{ height: Math.max(insets.bottom, 0), backgroundColor: "#ffffff" }} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Shell />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safe: {
    flex: 1,
    backgroundColor: BRAND_BLUE,
  },
  webview: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  chrome: {
    backgroundColor: BRAND_BLUE,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  chromeTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  chromeActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chromeBtn: {
    color: BRAND_GOLD,
    fontSize: 15,
    fontWeight: "600",
    minWidth: 52,
  },
  centered: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
    backgroundColor: BRAND_BLUE,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  body: {
    color: "#e0f2fe",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 22,
  },
  button: {
    backgroundColor: BRAND_GOLD,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
  },
  buttonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16,
  },
  linkBtn: {
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: "#bae6fd",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  hint: {
    marginTop: 18,
    color: "#7dd3fc",
    fontSize: 13,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: BRAND_BLUE,
    fontSize: 15,
    fontWeight: "600",
  },
  loadingBanner: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 12,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
});
