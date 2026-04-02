import * as FileSystem from 'expo-file-system';

export async function downloadVideoToDocumentDirectory(videoUrl) {
  const safeUrl = String(videoUrl || '').trim();
  if (!safeUrl) {
    throw new Error('Video URL is empty');
  }

  const hasExtension = /\.[a-zA-Z0-9]{2,5}(\?|$)/.test(safeUrl);
  const extension = hasExtension ? safeUrl.split('.').pop()?.split('?')[0] || 'mp4' : 'mp4';
  const fileName = `twit-video-${Date.now()}.${extension}`;
  const destination = `${FileSystem.documentDirectory}${fileName}`;

  const result = await FileSystem.downloadAsync(safeUrl, destination);
  if (result.status !== 200) {
    throw new Error(`Download failed with status ${result.status}`);
  }

  return result.uri;
}
