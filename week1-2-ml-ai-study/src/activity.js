import React from 'react';
import { localChanged, registerStore } from './sync/registry.js';

// Study activity for the dashboard: what the student did on each day, and the last page they opened.
// Kept in this browser and, when signed in, in their account (see sync/).
//   'YYYY-MM-DD' -> { v: pages opened, d: pages ticked done, q: quiz answers, h: homework checks, p: practice answers }
//   'last'       -> { id, track, at }   the last concept page opened (track may be null)
// Only counts are stored, never answers. Days older than a year are dropped when saving.
const KEY = 'mathml-study:activity:v1';
const FIELDS = ['v', 'd', 'q', 'h', 'p'];
const listeners = new Set();

function read() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

let state = typeof window === 'undefined' ? {} : read();

export function dayKey(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function prune(entries) {
  const cutoff = dayKey(new Date(Date.now() - 366 * 86400000));
  return Object.fromEntries(Object.entries(entries).filter(([key]) => key === 'last' || key >= cutoff));
}

function save(next, fromSync = false) {
  state = fromSync ? next : prune(next);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Activity still shows for this visit.
  }
  listeners.forEach((listener) => listener());
  if (!fromSync) localChanged('activity');
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) {
      state = read();
      listeners.forEach((listener) => listener());
    }
  });
}

registerStore('activity', {
  read: () => state,
  write: (entries) => save(entries, true),
  // A day used on two devices keeps the larger count of each kind; the later "last page" wins.
  merge: (mine, theirs) => {
    if (mine && 'at' in mine) return (theirs?.at ?? 0) > mine.at ? theirs : mine;
    return Object.fromEntries(FIELDS.map((field) => [field, Math.max(mine?.[field] ?? 0, theirs?.[field] ?? 0)]).filter(([, value]) => value > 0));
  },
  // Older rules may not list this store yet; its sync then fails quietly instead of stopping the rest.
  optional: true,
});

export function bumpActivity(field) {
  const today = dayKey();
  const day = state[today] ?? {};
  save({ ...state, [today]: { ...day, [field]: (day[field] ?? 0) + 1 } });
}

export function recordVisit(id, track) {
  const today = dayKey();
  const day = state[today] ?? {};
  save({ ...state, last: { id, track: track ?? null, at: Date.now() }, [today]: { ...day, v: (day.v ?? 0) + 1 } });
}

// Days in a row with any activity, ending today (or yesterday, so the streak is not lost before
// the student has studied today).
export function streakOf(entries, today = new Date()) {
  const active = (date) => {
    const day = entries[dayKey(date)];
    return Boolean(day && FIELDS.some((field) => day[field] > 0));
  };
  const cursor = new Date(today);
  if (!active(cursor)) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (active(cursor)) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

// Total actions on each of the last n days, oldest first.
export function lastDays(entries, n = 7, today = new Date()) {
  return Array.from({ length: n }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (n - 1 - index));
    const day = entries[dayKey(date)] ?? {};
    return { key: dayKey(date), label: date.toLocaleDateString(undefined, { weekday: 'narrow' }), total: FIELDS.reduce((sum, field) => sum + (day[field] ?? 0), 0) };
  });
}

export function useActivity() {
  const [, force] = React.useReducer((count) => count + 1, 0);
  React.useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
  return state;
}
