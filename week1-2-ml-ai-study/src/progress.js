import React from 'react';

// Which concepts the student has marked as done, kept in this browser only. One list is shared by
// both tracks, so a concept in both (feature vectors) is ticked once.
const KEY = 'mathml-study:done:v1';
const listeners = new Set();

function readDone() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

let done = readDone();

function setDone(next) {
  done = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // Progress still works for this visit; it just will not survive a reload.
  }
  listeners.forEach((listener) => listener());
}

// Keep several open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) {
      done = readDone();
      listeners.forEach((listener) => listener());
    }
  });
}

export function useProgress() {
  const [, force] = React.useReducer((count) => count + 1, 0);
  React.useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
  return {
    isDone: (id) => done.has(id),
    toggleDone: (id) => {
      const next = new Set(done);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setDone(next);
    },
  };
}
