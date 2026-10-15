import { useState } from 'react';
import { KEYS } from '../lib/storage';
import { useCollection } from '../lib/hooks';
import { Empty, GROUPS, PageHero, Reveal } from '../components/ui.jsx';

export default function BloodBanks() {
  const banks = useCollection(KEYS.BANKS);
  const [group, setGroup] = useState('');
  const [q, setQ] = useState('');
  const list = banks.filter((b) => (!group || b.groups.includes(group)) &&
    (!q.trim() || `${b.name} ${b.address}`.toLowerCase().includes(q.trim().toLowerCase())));

  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Blood Banks" title="Partner blood banks near you" lead="Contact details, hours, and current available groups." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="filter-bar card" style={{ marginBottom: '1.5rem' }}>
            <div className="field"><label htmlFor="bq">Search</label>
              <input id="bq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or area" /></div>
            <div className="field"><label htmlFor="bg">Has blood group</label>
              <select id="bg" value={group} onChange={(e) => setGroup(e.target.value)}>
                <option value="">Any</option>{GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select></div>
          </div>
          <div className="grid grid-2">
            {list.map((b) => (
              <Reveal key={b.id} className="card bank-card">
                <div className="flex items-center justify-between" style={{ gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h3 className="mb-0">{b.name}</h3>
                  <span className={`badge ${b.hours.includes('24/7') ? 'badge-success' : ''}`}>{b.hours}</span>
                </div>
                <p className="muted mb-0">📍 {b.address}</p>
                <p className="muted mb-0">📞 <a href={`tel:${b.phone}`}>{b.phone}</a></p>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginTop: '0.4rem' }}>
                  {b.groups.map((g) => <span key={g} className={`badge ${g === group ? 'badge-success' : ''}`}>{g}</span>)}
                </div>
              </Reveal>
            ))}
          </div>
          {!list.length && <Empty title="No blood banks found">Try a different search or blood group.</Empty>}
        </div>
      </section>
    </main>
  );
}
