/**
 * Escape special regex characters in user-supplied search strings so MongoDB $regex queries never throw.
 */
const escapeRegex = (str = '') => {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Return a trimmed string if value is a primitive string, otherwise fallback.
 * Prevents NoSQL operator injection (e.g. { $ne: ... }) from request bodies or query strings.
 */
const asString = (value, fallback = '') => {
  return typeof value === 'string' ? value : fallback;
};

/**
 * Validate and sanitize external HTTP/HTTPS URLs (blocks javascript:, data:, vbscript:, etc.).
 * Returns { valid: true, url: string } or { valid: false, url: '' }.
 */
const sanitizeHttpUrl = (value) => {
  if (value === undefined || value === null || value === '') {
    return { valid: true, url: '' };
  }
  if (typeof value !== 'string') {
    return { valid: false, url: '' };
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: true, url: '' };
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return { valid: true, url: trimmed };
    }
  } catch {
    // Invalid URL
  }
  return { valid: false, url: '' };
};

/**
 * Normalize a date input (e.g. YYYY-MM-DD) to the end of that UTC day (23:59:59.999Z)
 * so listings remain open throughout their entire stated deadline date.
 */
const normalizeDeadlineEndOfDay = (dateInput) => {
  if (!dateInput) {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  if (typeof dateInput !== 'string' && !(dateInput instanceof Date)) {
    return null;
  }
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
    parsed.setUTCHours(23, 59, 59, 999);
  }
  return parsed;
};

/**
 * Normalize comma- or newline-separated strings or arrays into clean trimmed string arrays.
 */
const normalizeStringArray = (value, separator = ',') => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(separator).map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

module.exports = {
  escapeRegex,
  asString,
  sanitizeHttpUrl,
  normalizeDeadlineEndOfDay,
  normalizeStringArray
};
