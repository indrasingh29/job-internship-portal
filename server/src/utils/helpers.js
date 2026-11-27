/**
 * Escape special regex characters in user-supplied search strings so MongoDB $regex queries never throw.
 */
const escapeRegex = (str = '') => {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Normalize a date input (e.g. YYYY-MM-DD) to the end of that UTC day (23:59:59.999Z)
 * so listings remain open throughout their entire stated deadline date.
 */
const normalizeDeadlineEndOfDay = (dateInput) => {
  if (!dateInput) {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
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
  normalizeDeadlineEndOfDay,
  normalizeStringArray
};
