import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const QUICK_LINKS = [
  { label: 'YouTube', url: 'https://www.youtube.com' },
  { label: 'Google', url: 'https://www.google.com' },
  { label: 'Telegram', url: 'https://web.telegram.org' },
];

export default function HomeScreen({ onSearch, onQuickLinkPress }) {
  const [input, setInput] = useState('');

  const submit = () => {
    onSearch(input);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.subtitle}>Fast, clean, and private browsing start page</Text>

      <View style={styles.searchBarContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Twit Search"
          placeholderTextColor="#999"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={submit}
          returnKeyType="go"
        />
        <TouchableOpacity onPress={submit} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickLinksRow}>
        {QUICK_LINKS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickLinkButton}
            onPress={() => onQuickLinkPress(item.url)}
          >
            <Text style={styles.quickLinkText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#0A0A0A',
  },
  subtitle: {
    color: '#b6b6b6',
    textAlign: 'center',
    marginBottom: 18,
    fontSize: 13,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    padding: 6,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchBtn: {
    backgroundColor: '#00FF9C',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  searchBtnText: {
    color: '#0A0A0A',
    fontWeight: '700',
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    gap: 10,
  },
  quickLinkButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#00FF9C',
    borderRadius: 12,
    paddingVertical: 12,
  },
  quickLinkText: {
    color: '#00FF9C',
    fontWeight: '600',
  },
});
