/**
 * Validate that external links in UI only use http:// or https:// protocols.
 */
export const safeExternalUrl = (value) => {
  if (!value || typeof value !== 'string') return null;
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // ignore invalid URL
  }
  return null;
};
