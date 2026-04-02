import React, { useRef } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function VideoPlayerModal({ visible, videoUri, onClose }) {
  const videoRef = useRef(null);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Downloaded Video</Text>
        {videoUri ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
        ) : (
          <Text style={styles.errorText}>No video loaded.</Text>
        )}

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    color: '#00FF9C',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '700',
  },
  video: {
    width: '100%',
    height: 260,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#00FF9C',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  closeText: {
    color: '#0A0A0A',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});
