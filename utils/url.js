export function normalizeInputToUrl(rawInput) {
  const input = String(rawInput || '').trim();
  if (!input) {
    return '';
  }

  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }

  if (input.includes('.')) {
    return `https://${input}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}

export function createTab(idOverride) {
  const id = idOverride || `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  return {
    id,
    title: 'New Tab',
    url: '',
    videoUrl: '',
  };
}
