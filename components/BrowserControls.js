import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function ControlButton({ label, onPress, disabled, rightIcon }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{label}</Text>
      {rightIcon}
    </TouchableOpacity>
  );
}

export default function BrowserControls({
  onGoBack,
  onReload,
  onHome,
  onDownload,
  canDownload,
  isDownloading,
}) {
  return (
    <View style={styles.container}>
      <ControlButton label="Back" onPress={onGoBack} />
      <ControlButton label="Reload" onPress={onReload} />
      <ControlButton label="Home" onPress={onHome} />
      <ControlButton
        label="Video"
        onPress={onDownload}
        disabled={!canDownload || isDownloading}
        rightIcon={isDownloading ? <ActivityIndicator size="small" color="#0A0A0A" /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: '#0E0E0E',
    borderTopWidth: 1,
    borderTopColor: '#1D1D1D',
  },
  button: {
    minWidth: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#00FF9C',
  },
  disabledButton: {
    backgroundColor: '#5a5a5a',
  },
  buttonText: {
    color: '#0A0A0A',
    fontWeight: '700',
    fontSize: 13,
  },
});
