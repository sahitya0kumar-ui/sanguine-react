/* Each validator returns '' when valid, or an error message. */
export const V = {
  required: (v) => (v && String(v).trim().length ? '' : 'This field is required.'),
  minLen: (n) => (v) => (String(v || '').trim().length >= n ? '' : `Must be at least ${n} characters.`),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '') ? '' : 'Enter a valid email address.'),
  phone: (v) => (/^[6-9]\d{9}$/.test(String(v || '').trim()) ? '' : 'Enter a valid 10-digit phone number.'),
  range: (min, max) => (v) => {
    const n = Number(v);
    if (v === '' || Number.isNaN(n)) return 'Enter a valid number.';
    return n < min || n > max ? `Must be between ${min} and ${max}.` : '';
  },
  match: (other, label = 'fields') => (v, all) => (all[other] === v ? '' : `The ${label} must match.`),
  checked: (msg = 'You must accept this to continue.') => (v) => (v ? '' : msg)
};
