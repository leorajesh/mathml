import React from 'react';

// Best quiz score per concept or topic, kept in this browser only.
const KEY = 'mathml-study:quiz:v1';
const listeners = new Set();

function read() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

let scores = read();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) {
      scores = read();
      listeners.forEach((listener) => listener());
    }
  });
}

export function recordQuizScore(quizId, correct, total) {
  const previous = scores[quizId];
  const best = previous && previous.total === total ? Math.max(previous.best, correct) : correct;
  scores = { ...scores, [quizId]: { best, total, last: correct } };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(scores));
  } catch {
    // Scores still show for this visit; they just will not survive a reload.
  }
  listeners.forEach((listener) => listener());
}

export function useQuizScores() {
  const [, force] = React.useReducer((count) => count + 1, 0);
  React.useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
  return (quizId) => scores[quizId] ?? null;
}
