import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { KEYS, all, insert, update, write } from '../lib/storage';
import { useCollection } from '../lib/hooks';
import { useForm } from '../lib/hooks';
import { V } from '../lib/validation';
import { useApp } from '../context.jsx';
import { Field, GROUPS, PageHero, Picker, fmtDate } from '../components/ui.jsx';

const BLANK = { fullName: '', age: '', gender: 'Female', weight: '', bloodGroup: 'O+', phone: '', email: '', address: '', city: '', lastDonation: '', consent: false };
const RULES = {
  fullName: [V.required, V.minLen(3)],
  age: [V.required, V.range(18, 65)],
  weight: [V.required, V.range(45, 200)],
  phone: [V.required, V.phone],
  email: [V.required, V.email],
  address: [V.required],
  city: [V.required],
  consent: [V.checked('Please confirm and consent to continue.')]
};

export default function Donor() {
  const { user, login, toast } = useApp();
  const nav = useNavigate();
  const donors = useCollection(KEYS.DONORS);
  const me = user?.donorId ? donors.find((d) => d.id === user.donorId) : null;

  const initial = useMemo(() => me ? {
    fullName: me.name, age: me.age, gender: me.gender, weight: me.weight, bloodGroup: me.bloodGroup, phone: me.phone,
    email: me.email, address: me.address || '', city: me.city, lastDonation: me.lastDonation || '', consent: true
  } : { ...BLANK, fullName: user?.name || '', email: user?.email || '' }, [me?.id, user?.email]); // eslint-disable-line

  const f = useForm(initial, RULES, (v) => {
    const record = {
      name: v.fullName.trim(), age: Number(v.age), gender: v.gender, bloodGroup: v.bloodGroup, weight: Number(v.weight),
      phone: v.phone.trim(), email: v.email.trim(), address: v.address.trim(), city: v.city.trim(), lastDonation: v.lastDonation || null
    };
    if (me) {
      update(KEYS.DONORS, me.id, record);
      toast('Profile updated.');
      return;
    }
    const created = insert(KEYS.DONORS, { ...record, available: true, donationsCount: 0, history: [] });
    login({ name: created.name, email: created.email, role: 'donor', donorId: created.id });
    // link donor to a logged-in account so it persists across logins
    const users = all(KEYS.USERS).map((u) => (u.email === created.email ? { ...u, donorId: created.id } : u));
    write(KEYS.USERS, users);
    toast(`Thanks, ${created.name.split(' ')[0]}! You're registered as a donor.`);
    setTimeout(() => nav('/dashboard'), 900);
  });

  const logDonation = () => {
    const today = new Date().toISOString().slice(0, 10);
    update(KEYS.DONORS, me.id, (d) => ({
      lastDonation: today, donationsCount: (d.donationsCount || 0) + 1,
      history: [{ date: today, venue: 'Self-reported donation', units: 1 }, ...(d.history || [])]
    }));
    toast('Donation logged. Thank you!');
  };

  const history = me ? [...(me.history || []), ...(me.lastDonation && !(me.history || []).length ? [{ date: me.lastDonation, venue: 'City Life Blood Bank', units: 1 }] : [])] : [];

  return (
    <main id="main" tabIndex={-1}>
      <PageHero center eyebrow="Donor Registration" title={me ? 'Your donor profile' : 'Register as a blood donor'}
        lead="Takes about two minutes. Your details stay on this device via local storage for this demo." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <form className="form-card" noValidate onSubmit={f.handleSubmit(() => toast('Please fix the highlighted fields.', 'error'))}>
            <div className="form-row">
              <Field f={f} name="fullName" label="Full name" placeholder="e.g. Aarav Sharma" />
              <Field f={f} name="age" label="Age" type="number" min="18" max="65" placeholder="18–65" />
            </div>
            <div className="form-row">
              <Field f={f} name="gender" label="Gender" as="select">
                <option>Female</option><option>Male</option><option>Other</option>
              </Field>
              <Field f={f} name="weight" label="Weight (kg)" type="number" min="45" max="200" placeholder="Minimum 45kg" />
            </div>
            <div className="field">
              <label>Blood group</label>
              <Picker name="bg" label="Blood group" options={GROUPS} value={f.values.bloodGroup} onChange={(v) => f.set('bloodGroup', v)} />
            </div>
            <div className="form-row">
              <Field f={f} name="phone" label="Phone number" type="tel" placeholder="10-digit mobile number" />
              <Field f={f} name="email" label="Email address" type="email" placeholder="you@example.com" />
            </div>
            <Field f={f} name="address" label="Address" placeholder="House / street / area" />
            <div className="form-row">
              <Field f={f} name="city" label="City" placeholder="e.g. Mohali" />
              <Field f={f} name="lastDonation" label="Last donation date" hint="(optional)" type="date" />
            </div>
            <div className={`field${f.errors.consent ? ' error' : ''}`}>
              <div className="checkbox-row" style={{ marginBottom: 'var(--space-md)' }}>
                <input type="checkbox" id="consent" name="consent" checked={f.values.consent} onChange={f.handleChange} />
                <label htmlFor="consent" style={{ margin: 0 }}>I confirm the information above is accurate and I consent to being contacted for donation requests.</label>
              </div>
              <div className="error-msg">{f.errors.consent}</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">{me ? 'Save Changes' : 'Complete Registration'}</button>
          </form>

          <div className="form-card mt-lg">
            <h3>My donation history</h3>
            {!me ? <p className="muted">Register or log in to see your personal donation history here.</p> : (
              <>
                <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div><strong>{me.name}</strong><div className="muted">{me.bloodGroup} · {me.city} · {me.donationsCount || 0} donation(s)</div></div>
                  <button className="btn btn-primary btn-sm" onClick={logDonation}>+ Log a donation today</button>
                </div>
                {history.length ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="dash-table">
                      <thead><tr><th>Date</th><th>Venue</th><th>Units</th></tr></thead>
                      <tbody>{history.map((r, i) => <tr key={i}><td>{fmtDate(r.date, { day: 'numeric', month: 'short', year: 'numeric' })}</td><td>{r.venue}</td><td>{r.units}</td></tr>)}</tbody>
                    </table>
                  </div>
                ) : <p className="muted mb-0">No donations recorded yet.</p>}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
