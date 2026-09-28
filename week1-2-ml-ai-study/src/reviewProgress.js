import React from 'react';
import { localChanged, registerStore } from './sync/registry.js';

// Quick-review self-ratings per page: 'known' (got it) or 'again' (review again). Kept in this browser
// and, when signed in, in the student's account (see sync/).
const KEY = 'mathml-study:review:v1';
const listeners = new Set();

function read() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

let ratings = typeof window === 'undefined' ? {} : read();

function save(next, fromSync = false) {
  ratings = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ratings));
  } catch {
    // Ratings still work for this visit.
  }
  listeners.forEach((listener) => listener());
  if (!fromSync) localChanged('review');
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) {
      ratings = read();
      listeners.forEach((listener) => listener());
    }
  });
}

registerStore('review', {
  read: () => ratings,
  write: (entries) => save(entries, true),
});

export function rate(id, value) {
  const next = { ...ratings };
  if (value) next[id] = value;
  else delete next[id];
  save(next);
}

export function useReviewRatings() {
  const [, force] = React.useReducer((count) => count + 1, 0);
  React.useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
  return ratings;
}
