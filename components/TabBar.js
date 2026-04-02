import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabBar({ tabs, activeTabId, onAddTab, onSwitchTab, onCloseTab }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onSwitchTab(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]} numberOfLines={1}>
                {tab.title || `Tab ${index + 1}`}
              </Text>
              <TouchableOpacity onPress={() => onCloseTab(tab.id)} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.addTabButton} onPress={onAddTab}>
        <Text style={styles.addTabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#191919',
    paddingBottom: 8,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    gap: 8,
  },
  tab: {
    minWidth: 130,
    maxWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#242424',
  },
  activeTab: {
    borderColor: '#00FF9C',
  },
  tabText: {
    flex: 1,
    color: '#ccc',
    fontSize: 12,
  },
  activeTabText: {
    color: '#00FF9C',
    fontWeight: '700',
  },
  closeButton: {
    marginLeft: 6,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#0a0a0a',
  },
  closeText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 16,
  },
  addTabButton: {
    marginRight: 8,
    marginLeft: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00FF9C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTabText: {
    color: '#00FF9C',
    fontSize: 20,
    lineHeight: 22,
    marginTop: -1,
  },
});
