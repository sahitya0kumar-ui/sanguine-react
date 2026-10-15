import { useEffect, useState } from 'react';
import { useReveal } from '../lib/hooks';

export const GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

/** Fades/slides in once scrolled into view. */
export function Reveal({ className = '', children, as: Tag = 'div', ...rest }) {
  const [ref, shown] = useReveal();
  return <Tag ref={ref} className={`${className} reveal${shown ? ' in' : ''}`} {...rest}>{children}</Tag>;
}

/** Animated count-up number. */
export function Counter({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1200, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n.toLocaleString()}</>;
}

export function PageHero({ eyebrow, title, lead, center, children }) {
  return (
    <section className="page-hero">
      <div className={`container${center ? ' text-center' : ''}`}>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {lead && <p className="lead" style={center ? { maxWidth: '52ch', marginInline: 'auto' } : { maxWidth: '60ch' }}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/** Label + input wrapper that shows validation errors. `f` is the object returned by useForm. */
export function Field({ f, name, label, hint, type = 'text', as = 'input', children, ...props }) {
  const Tag = as;
  const err = f.errors[name];
  return (
    <div className={`field${err ? ' error' : ''}`}>
      <label htmlFor={name}>{label} {hint && <span className="hint">{hint}</span>}</label>
      <Tag id={name} name={name} type={as === 'input' ? type : undefined} value={f.values[name]}
        onChange={f.handleChange} onBlur={f.handleBlur} aria-invalid={!!err} {...props}>{children}</Tag>
      <div className="error-msg">{err}</div>
    </div>
  );
}

/** Radio pill group (blood group / urgency). */
export function Picker({ name, label, options, value, onChange, className = 'bg-picker' }) {
  return (
    <div className={className} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <span key={o} style={{ display: 'contents' }}>
          <input type="radio" id={`${name}-${o}`} name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
          <label htmlFor={`${name}-${o}`}>{o}</label>
        </span>
      ))}
    </div>
  );
}

export const fmtDate = (d, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Date(d).toLocaleDateString('en-IN', opts);

export function Empty({ title, children }) {
  return <div className="empty-state"><strong>{title}</strong>{children}</div>;
}
