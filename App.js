import React, { useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import HomeScreen from './components/HomeScreen';
import TabBar from './components/TabBar';
import BrowserControls from './components/BrowserControls';
import VideoPlayerModal from './components/VideoPlayerModal';
import { createTab, normalizeInputToUrl } from './utils/url';
import { downloadVideoToDocumentDirectory } from './utils/downloader';

const ADBLOCK_JS = `
(function() {
  const removeAds = () => {
    try {
      document.querySelectorAll('iframe').forEach((node) => node.remove());
      document.querySelectorAll('[class*="ad"], [id*="ad"]').forEach((node) => node.remove());
    } catch (e) {}
  };

  const findVideo = () => {
    try {
      const videos = Array.from(document.querySelectorAll('video'));
      const video = videos.find((v) => v.currentSrc || v.src || v.querySelector('source')?.src);
      if (!video) {
        return;
      }

      const src =
        video.currentSrc ||
        video.src ||
        video.querySelector('source')?.src ||
        '';

      if (src) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIDEO_FOUND', url: src }));
      }
    } catch (e) {}
  };

  removeAds();
  findVideo();

  const observer = new MutationObserver(() => {
    removeAds();
    findVideo();
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
})();
true;
`;

export default function App() {
  const [tabs, setTabs] = useState([createTab('home')]);
  const [activeTabId, setActiveTabId] = useState('home');
  const [isHomeVisible, setIsHomeVisible] = useState(true);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerUri, setPlayerUri] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const webViewRefs = useRef({});

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

  const updateTab = (tabId, changes) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, ...changes } : tab)));
  };

  const openUrlInActiveTab = (rawInput) => {
    const nextUrl = normalizeInputToUrl(rawInput);
    if (!nextUrl || !activeTab) {
      return;
    }

    setIsHomeVisible(false);
    updateTab(activeTab.id, { url: nextUrl, title: nextUrl });
  };

  const openQuickLink = (url) => {
    if (!activeTab) {
      return;
    }

    setIsHomeVisible(false);
    updateTab(activeTab.id, { url, title: url });
  };

  const addTab = () => {
    const tab = createTab();
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
    setIsHomeVisible(true);
  };

  const switchTab = (tabId) => {
    setActiveTabId(tabId);
    const targetTab = tabs.find((tab) => tab.id === tabId);
    setIsHomeVisible(!targetTab?.url);
  };

  const closeTab = (tabId) => {
    if (tabs.length === 1) {
      const resetTab = createTab('home');
      setTabs([resetTab]);
      setActiveTabId(resetTab.id);
      setIsHomeVisible(true);
      return;
    }

    const remaining = tabs.filter((tab) => tab.id !== tabId);
    setTabs(remaining);

    if (activeTabId === tabId) {
      const fallback = remaining[remaining.length - 1];
      setActiveTabId(fallback.id);
      setIsHomeVisible(!fallback.url);
    }
  };

  const handleWebMessage = async (event) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);
      if (payload.type === 'VIDEO_FOUND' && payload.url) {
        updateTab(activeTab.id, { videoUrl: payload.url });
      }
    } catch (error) {
      // Ignore non-JSON messages
    }
  };

  const onDownloadVideo = async () => {
    if (!activeTab?.videoUrl || isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      const downloadedPath = await downloadVideoToDocumentDirectory(activeTab.videoUrl);
      setPlayerUri(downloadedPath);
      setPlayerVisible(true);
    } catch (error) {
      console.warn('Video download failed', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const goBack = () => {
    if (!activeTab) {
      return;
    }
    webViewRefs.current[activeTab.id]?.goBack();
  };

  const reload = () => {
    if (!activeTab) {
      return;
    }
    webViewRefs.current[activeTab.id]?.reload();
  };

  const goHome = () => {
    setIsHomeVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <View style={styles.container}>
        <Text style={styles.header}>Twit Browser</Text>

        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onAddTab={addTab}
          onSwitchTab={switchTab}
          onCloseTab={closeTab}
        />

        {isHomeVisible || !activeTab?.url ? (
          <HomeScreen onSearch={openUrlInActiveTab} onQuickLinkPress={openQuickLink} />
        ) : (
          <View style={styles.webViewContainer}>
            <WebView
              ref={(ref) => {
                webViewRefs.current[activeTab.id] = ref;
              }}
              source={{ uri: activeTab.url }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              originWhitelist={['*']}
              startInLoadingState={true}
              injectedJavaScript={ADBLOCK_JS}
              onMessage={handleWebMessage}
              onNavigationStateChange={(navState) => {
                updateTab(activeTab.id, {
                  url: navState.url,
                  title: navState.title || navState.url,
                });
              }}
            />
          </View>
        )}

        <BrowserControls
          onGoBack={goBack}
          onReload={reload}
          onHome={goHome}
          onDownload={onDownloadVideo}
          canDownload={Boolean(activeTab?.videoUrl)}
          isDownloading={isDownloading}
        />

        <VideoPlayerModal
          visible={playerVisible}
          videoUri={playerUri}
          onClose={() => setPlayerVisible(false)}
        />

        <TouchableOpacity
          style={styles.floatingSearchButton}
          onPress={() => setIsHomeVisible(true)}
        >
          <Text style={styles.floatingSearchText}>Search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    color: '#00FF9C',
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '700',
  },
  webViewContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#1c1c1c',
  },
  floatingSearchButton: {
    position: 'absolute',
    right: 12,
    top: 52,
    backgroundColor: '#121212',
    borderColor: '#00FF9C',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  floatingSearchText: {
    color: '#00FF9C',
    fontWeight: '600',
    fontSize: 12,
  },
});
