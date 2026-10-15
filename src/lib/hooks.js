import { useEffect, useRef, useState, useSyncExternalStore, useCallback } from 'react';
import { read, subscribe } from './storage';

const EMPTY = [];

/** Live view of a localStorage key — re-renders whenever it changes. */
export function useStored(key) {
  return useSyncExternalStore(subscribe, () => read(key));
}
export const useCollection = (key) => useStored(key) || EMPTY;

/** Reveal-on-scroll: returns a ref + whether the element has entered the viewport. */
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

/** Controlled-form helper with per-field validators (see lib/validation.js). */
export function useForm(initial, rules, onValid) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const check = useCallback((name, vals) => {
    for (const rule of rules[name] || []) {
      const msg = rule(vals[name], vals);
      if (msg) return msg;
    }
    return '';
  }, [rules]);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const next = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(next);
    if (errors[name]) setErrors((er) => ({ ...er, [name]: check(name, next) }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    if (rules[name]) setErrors((er) => ({ ...er, [name]: check(name, values) }));
  };
  const reset = (vals = initial) => { setValues(vals); setErrors({}); };

  const handleSubmit = (onInvalid) => (e) => {
    e.preventDefault();
    const next = {};
    Object.keys(rules).forEach((n) => { next[n] = check(n, values); });
    setErrors(next);
    const firstBad = Object.keys(next).find((n) => next[n]);
    if (firstBad) {
      onInvalid?.();
      document.getElementById(firstBad)?.focus();
      return;
    }
    onValid(values, reset);
  };

  return { values, errors, set, handleChange, handleBlur, handleSubmit, reset };
}
