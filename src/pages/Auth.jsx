import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KEYS, all, insert } from '../lib/storage';
import { useForm } from '../lib/hooks';
import { V } from '../lib/validation';
import { useApp } from '../context.jsx';
import { Field } from '../components/ui.jsx';

const invalid = (toast) => () => toast('Please fix the highlighted fields.', 'error');

export function Login() {
  const { login, toast } = useApp();
  const nav = useNavigate();
  const [forgot, setForgot] = useState(false);

  const f = useForm({ email: '', password: '' }, { email: [V.required, V.email], password: [V.required, V.minLen(6)] }, (v) => {
    const match = all(KEYS.USERS).find((u) => u.email === v.email.trim() && u.password === v.password);
    if (!match) return toast('No account matches those details. Try the demo account or sign up.', 'error');
    login({ name: match.name, email: match.email, role: match.role, donorId: match.donorId });
    toast(`Welcome back, ${match.name.split(' ')[0]}!`);
    setTimeout(() => nav('/dashboard'), 700);
  });
  const g = useForm({ email: '' }, { email: [V.required, V.email] }, (v, reset) => {
    toast(`If ${v.email} is registered, a reset link has been sent.`);
    reset();
  });

  return (
    <main id="main" tabIndex={-1} className="auth-shell">
      <div className="container" style={{ maxWidth: 460 }}>
        {!forgot ? (
          <form className="form-card" noValidate onSubmit={f.handleSubmit(invalid(toast))}>
            <div className="text-center" style={{ marginBottom: '1.5rem' }}>
              <span className="eyebrow">Welcome back</span><h1 style={{ fontSize: '1.8rem' }}>Log in to Sanguine</h1>
            </div>
            <Field f={f} name="email" label="Email" type="email" placeholder="demo@sanguine.app" autoComplete="email" />
            <div className={`field${f.errors.password ? ' error' : ''}`}>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={f.values.password} onChange={f.handleChange}
                onBlur={f.handleBlur} placeholder="demo1234" autoComplete="current-password" />
              <div className="error-msg">{f.errors.password}</div>
              <div className="hint"><a href="#/login" onClick={(e) => { e.preventDefault(); setForgot(true); }}>Forgot password?</a></div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Log In</button>
            <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: '0.6rem' }}
              onClick={() => f.reset({ email: 'demo@sanguine.app', password: 'demo1234' })}>Fill demo credentials</button>
            <p className="muted text-center" style={{ marginTop: '1rem' }}>New here? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create an account</Link></p>
          </form>
        ) : (
          <form className="form-card" noValidate onSubmit={g.handleSubmit(invalid(toast))}>
            <h3>Reset your password</h3>
            <p className="muted">Enter your email and we'll simulate sending a reset link.</p>
            <Field f={g} name="email" label="Email" type="email" placeholder="you@example.com" />
            <button type="submit" className="btn btn-primary btn-block">Send Reset Link</button>
            <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: '0.6rem' }} onClick={() => setForgot(false)}>Back to log in</button>
          </form>
        )}
      </div>
    </main>
  );
}

export function Signup() {
  const { login, toast } = useApp();
  const nav = useNavigate();
  const f = useForm({ name: '', email: '', password: '', confirmPassword: '' }, {
    name: [V.required, V.minLen(3)], email: [V.required, V.email], password: [V.required, V.minLen(6)],
    confirmPassword: [V.required, V.match('password', 'passwords')]
  }, (v) => {
    const email = v.email.trim();
    if (all(KEYS.USERS).some((u) => u.email === email)) return toast('An account with that email already exists.', 'error');
    const user = insert(KEYS.USERS, { name: v.name.trim(), email, password: v.password, role: 'donor' });
    login({ name: user.name, email: user.email, role: 'donor' });
    toast("Account created! Let's finish your donor profile.");
    setTimeout(() => nav('/donor'), 700);
  });
  const p = f.values.password;
  const score = [p.length >= 6, /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;

  return (
    <main id="main" tabIndex={-1} className="auth-shell">
      <div className="container" style={{ maxWidth: 460 }}>
        <form className="form-card" noValidate onSubmit={f.handleSubmit(invalid(toast))}>
          <div className="text-center" style={{ marginBottom: '1.5rem' }}>
            <span className="eyebrow">Join the network</span><h1 style={{ fontSize: '1.8rem' }}>Create your account</h1>
          </div>
          <Field f={f} name="name" label="Full name" placeholder="e.g. Isha Verma" autoComplete="name" />
          <Field f={f} name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
          <div className={`field${f.errors.password ? ' error' : ''}`}>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={p} onChange={f.handleChange} onBlur={f.handleBlur}
              placeholder="At least 6 characters" autoComplete="new-password" />
            <div className="strength-meter">{[0, 1, 2, 3].map((i) => <span key={i} className={i < score ? 'on' : ''} />)}</div>
            <div className="error-msg">{f.errors.password}</div>
          </div>
          <Field f={f} name="confirmPassword" label="Confirm password" type="password" placeholder="Re-enter password" autoComplete="new-password" />
          <button type="submit" className="btn btn-primary btn-block">Create Account</button>
          <p className="muted text-center" style={{ marginTop: '1rem' }}>Already registered? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Log in</Link></p>
        </form>
      </div>
    </main>
  );
}
