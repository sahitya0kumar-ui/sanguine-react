/* localStorage data layer. Every "table" is a JSON array under its own key.
   Writes dispatch a custom event so React components (useStored) re-render. */
export const KEYS = {
  DONORS: 'bc_donors',
  REQUESTS: 'bc_requests',
  CAMPS: 'bc_camps',
  BANKS: 'bc_banks',
  USER: 'bc_current_user',
  USERS: 'bc_users',
  PREFS: 'bc_prefs',
  MY_CAMPS: 'bc_my_camps'
};

const EVENT = 'bc:storage';
const cache = new Map(); // key -> { raw, parsed } so snapshots stay referentially stable

export function read(key) {
  try {
    const raw = localStorage.getItem(key);
    if (cache.has(key) && cache.get(key).raw === raw) return cache.get(key).parsed;
    const parsed = raw ? JSON.parse(raw) : null;
    cache.set(key, { raw, parsed });
    return parsed;
  } catch (e) {
    console.error('read failed', key, e);
    return null;
  }
}

export function write(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch (e) {
    console.error('write failed', key, e);
    return false;
  }
}

export const all = (key) => read(key) || [];

export function insert(key, record) {
  const rec = {
    ...record,
    id: record.id || `${key}_${Date.now()}_${Math.floor(Math.random() * 999)}`,
    createdAt: record.createdAt || new Date().toISOString()
  };
  write(key, [rec, ...all(key)]);
  return rec;
}

export const update = (key, id, patch) =>
  write(key, all(key).map((r) => (r.id === id ? { ...r, ...(typeof patch === 'function' ? patch(r) : patch) } : r)));

export const remove = (key, id) => write(key, all(key).filter((r) => r.id !== id));

export function subscribe(cb) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb); // other tabs
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

const dayOffset = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function seedIfEmpty() {
  if (!read(KEYS.DONORS)) {
    const cities = ['Chandigarh', 'Mohali', 'Delhi', 'Mumbai', 'Pune', 'Bengaluru'];
    const groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const names = ['Aarav Sharma', 'Isha Verma', 'Rohan Mehta', 'Priya Nair', 'Karan Singh', 'Ananya Gupta',
      'Vikram Rao', 'Sneha Kapoor', 'Aditya Joshi', 'Meera Iyer', 'Farhan Khan', 'Neha Reddy'];
    write(KEYS.DONORS, names.map((name, i) => ({
      id: `seed_donor_${i}`,
      name,
      age: 20 + (i % 15),
      gender: i % 2 === 0 ? 'Male' : 'Female',
      bloodGroup: groups[i % groups.length],
      weight: 55 + (i % 20),
      phone: `9${(800000000 + i * 1234).toString().slice(0, 9)}`,
      email: `${name.split(' ')[0].toLowerCase()}@example.com`,
      city: cities[i % cities.length],
      lastDonation: i % 3 === 0 ? '2025-11-02' : '2026-05-14',
      available: i % 4 !== 0,
      donationsCount: (i * 3) % 12,
      history: [],
      createdAt: new Date().toISOString()
    })));
  }
  if (!read(KEYS.BANKS)) {
    write(KEYS.BANKS, [
      { id: 'bank_1', name: 'City Life Blood Bank', address: 'Sector 34, Chandigarh', phone: '0172-2345678', hours: '24/7 Emergency', groups: ['O+', 'O-', 'A+', 'B+', 'AB+'] },
      { id: 'bank_2', name: 'Red Cross Blood Centre', address: 'Phase 7, Mohali', phone: '0172-3456789', hours: '8:00 AM – 8:00 PM', groups: ['O+', 'A-', 'B-', 'AB-'] },
      { id: 'bank_3', name: 'Fortis Blood Bank', address: 'Sector 62, Mohali', phone: '0172-4567890', hours: '24/7 Emergency', groups: ['O-', 'A+', 'B+', 'AB+', 'AB-'] },
      { id: 'bank_4', name: 'Government Hospital Blood Bank', address: 'Sector 16, Chandigarh', phone: '0172-5678901', hours: '9:00 AM – 6:00 PM', groups: ['O+', 'A+', 'B+'] }
    ]);
  }
  if (!read(KEYS.CAMPS)) {
    write(KEYS.CAMPS, [
      { id: 'camp_1', title: 'Corporate Donor Drive', date: dayOffset(7), venue: 'Tech Park, Mohali', organizer: 'Sanguine x TechPark', seats: 60, registered: 41 },
      { id: 'camp_2', title: 'University Blood Camp', date: dayOffset(21), venue: 'Panjab University Ground', organizer: 'Rotary Club', seats: 120, registered: 88 },
      { id: 'camp_3', title: 'Community Health Drive', date: dayOffset(35), venue: 'Sector 21 Community Hall', organizer: 'City Life Blood Bank', seats: 80, registered: 30 }
    ]);
  }
  if (!read(KEYS.REQUESTS)) {
    write(KEYS.REQUESTS, [
      { id: 'req_1', patient: 'Ramesh Kumar', bloodGroup: 'B+', hospital: 'City Life Hospital', units: 2, contact: '9812345670', city: 'Chandigarh', urgency: 'Critical', createdAt: new Date().toISOString() },
      { id: 'req_2', patient: 'Simran Kaur', bloodGroup: 'O-', hospital: 'Fortis Mohali', units: 1, contact: '9876543210', city: 'Mohali', urgency: 'Moderate', createdAt: new Date().toISOString() }
    ]);
  }
  if (!read(KEYS.USERS)) {
    write(KEYS.USERS, [{ id: 'user_demo', name: 'Demo Donor', email: 'demo@sanguine.app', password: 'demo1234', role: 'donor' }]);
  }
}

export function resetDemoData() {
  Object.values(KEYS).filter((k) => k !== KEYS.PREFS).forEach((k) => localStorage.removeItem(k));
  seedIfEmpty();
  window.dispatchEvent(new Event(EVENT));
}
