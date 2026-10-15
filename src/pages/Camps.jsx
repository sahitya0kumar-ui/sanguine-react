import { KEYS, update, write } from '../lib/storage';
import { useCollection, useStored } from '../lib/hooks';
import { useApp } from '../context.jsx';
import { Empty, PageHero, Reveal, fmtDate } from '../components/ui.jsx';

export default function Camps() {
  const { toast } = useApp();
  const camps = useCollection(KEYS.CAMPS);
  const mine = useStored(KEYS.MY_CAMPS) || [];

  const toggle = (c) => {
    if (mine.includes(c.id)) {
      update(KEYS.CAMPS, c.id, { registered: Math.max(0, c.registered - 1) });
      write(KEYS.MY_CAMPS, mine.filter((id) => id !== c.id));
      toast(`Registration cancelled for ${c.title}.`, 'info');
    } else if (c.registered < c.seats) {
      update(KEYS.CAMPS, c.id, { registered: c.registered + 1 });
      write(KEYS.MY_CAMPS, [...mine, c.id]);
      toast(`You're registered for ${c.title}!`);
    }
  };

  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Donation Camps" title="Upcoming blood donation camps"
        lead="Register your seat ahead of time — walk-ins are welcome where space allows." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid grid-3">
          {camps.map((c) => {
            const joined = mine.includes(c.id);
            const full = c.registered >= c.seats && !joined;
            return (
              <Reveal key={c.id} className="card camp-card">
                <span className="badge">{fmtDate(c.date)}</span>
                <h3>{c.title}</h3>
                <p className="muted mb-0">📍 {c.venue}</p>
                <p className="muted mb-0">Organized by {c.organizer}</p>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.round((c.registered / c.seats) * 100)}%` }} /></div>
                <p className="muted" style={{ margin: '0.4rem 0' }}>{c.registered}/{c.seats} seats filled</p>
                <button className={`btn ${joined || full ? 'btn-ghost' : 'btn-primary'} btn-sm`} disabled={full} onClick={() => toggle(c)}>
                  {full ? 'Camp Full' : joined ? '✓ Registered — cancel' : 'Register for Camp'}
                </button>
              </Reveal>
            );
          })}
        </div>
        {!camps.length && <div className="container"><Empty title="No camps scheduled">New donation camps will appear here.</Empty></div>}
      </section>
    </main>
  );
}
