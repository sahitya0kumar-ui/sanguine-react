import { useState } from 'react';
import { PageHero } from '../components/ui.jsx';

const COMPAT = {
  'O-': { to: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], from: ['O-'] },
  'O+': { to: ['O+', 'A+', 'B+', 'AB+'], from: ['O-', 'O+'] },
  'A-': { to: ['A-', 'A+', 'AB-', 'AB+'], from: ['O-', 'A-'] },
  'A+': { to: ['A+', 'AB+'], from: ['O-', 'O+', 'A-', 'A+'] },
  'B-': { to: ['B-', 'B+', 'AB-', 'AB+'], from: ['O-', 'B-'] },
  'B+': { to: ['B+', 'AB+'], from: ['O-', 'O+', 'B-', 'B+'] },
  'AB-': { to: ['AB-', 'AB+'], from: ['O-', 'A-', 'B-', 'AB-'] },
  'AB+': { to: ['AB+'], from: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] }
};

export default function Compatibility() {
  const [sel, setSel] = useState(null);
  return (
    <main id="main" tabIndex={-1}>
      <PageHero eyebrow="Blood Compatibility" title="Who can donate to whom" lead="Click any blood group to highlight its donation and recipient matches." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="compat-table-wrap">
            <table className="compat">
              <thead><tr><th>Blood group</th><th>Can donate to</th><th>Can receive from</th></tr></thead>
              <tbody>
                {Object.entries(COMPAT).map(([g, c]) => (
                  <tr key={g} className={sel === g ? 'active-row' : ''}>
                    <td className="bg-select" tabIndex={0} role="button" aria-pressed={sel === g}
                      onClick={() => setSel(sel === g ? null : g)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(sel === g ? null : g))}>
                      <span className="badge">{g}</span>
                    </td>
                    <td>{c.to.join(', ')}</td><td>{c.from.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sel && (
            <div className="grid grid-2 mt-lg">
              <div className="card"><h3>{sel} can donate to</h3>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>{COMPAT[sel].to.map((x) => <span key={x} className="badge badge-success">{x}</span>)}</div></div>
              <div className="card"><h3>{sel} can receive from</h3>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>{COMPAT[sel].from.map((x) => <span key={x} className="badge">{x}</span>)}</div></div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
