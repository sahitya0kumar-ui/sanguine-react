import { useState } from 'react';
import { KEYS } from '../lib/storage';
import { useCollection } from '../lib/hooks';
import { GROUPS, PageHero, Reveal } from '../components/ui.jsx';

export default function Donors() {
  const donors = useCollection(KEYS.DONORS);
  const [group, setGroup] = useState('');
  const [city, setCity] = useState('');
  const [onlyAvail, setOnlyAvail] = useState(false);

  const list = donors.filter((d) =>
    (!group || d.bloodGroup === group) &&
    (!city.trim() || d.city.toLowerCase().includes(city.trim().toLowerCase())) &&
    (!onlyAvail || d.available));

  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Find a Donor" title="Search the donor network" lead="Filter by blood group, city, and current availability." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="filter-bar card">
            <div className="field">
              <label htmlFor="filterGroup">Blood group</label>
              <select id="filterGroup" value={group} onChange={(e) => setGroup(e.target.value)}>
                <option value="">All groups</option>{GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="filterCity">City</label>
              <input id="filterCity" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mohali" />
            </div>
            <div className="field field-checkbox">
              <div className="checkbox-row">
                <input type="checkbox" id="filterAvailable" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} />
                <label htmlFor="filterAvailable" style={{ margin: 0 }}>Available only</label>
              </div>
            </div>
          </div>

          <p className="muted" aria-live="polite">{list.length} donor{list.length === 1 ? '' : 's'} found</p>
          {!list.length && <p className="muted">No donors match those filters yet — try widening your search.</p>}
          <div className="grid grid-3">
            {list.map((d) => (
              <Reveal key={d.id} className="card donor-card">
                <span className="badge bg-tag">{d.bloodGroup}</span>
                <h3>{d.name}</h3>
                <div className="meta"><span>📍 {d.city}</span><span>🩸 {d.donationsCount || 0} donations</span></div>
                <p className="muted mb-0">Last donation: {d.lastDonation || 'No record yet'}</p>
                <div className="flex gap-sm" style={{ marginTop: '0.4rem' }}>
                  <span className={`badge ${d.available ? 'badge-success' : ''}`}>{d.available ? 'Available now' : 'Currently unavailable'}</span>
                </div>
                <a href={`tel:+91${d.phone}`} className="btn btn-ghost btn-sm mt-lg" style={{ alignSelf: 'flex-start' }}>Contact donor</a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
