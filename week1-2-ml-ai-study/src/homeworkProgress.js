import React from 'react';

// Homework progress, kept in this browser only. For each part: how many answers were checked, whether
// it is solved, whether it was solved before the full solution was opened, and how many clues were shown.
// For each problem: whether the full solution has been opened.
const KEY = 'mathml-study:homework:v1';
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

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === KEY) {
      state = read();
      listeners.forEach((listener) => listener());
    }
  });
}

function save(next) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Progress still shows for this visit; it just will not survive a reload.
  }
  listeners.forEach((listener) => listener());
}

const problemKey = (setKey, problemId) => `${setKey}#${problemId}`;
const emptyPart = { tries: 0, solved: false, own: false, clues: 0 };

export function partState(setKey, problemId, index) {
  return state[problemKey(setKey, problemId)]?.parts?.[index] ?? emptyPart;
}

export function solutionOpened(setKey, problemId) {
  return Boolean(state[problemKey(setKey, problemId)]?.solution);
}

function updateProblem(setKey, problemId, change) {
  const key = problemKey(setKey, problemId);
  const current = state[key] ?? { parts: {}, solution: false };
  save({ ...state, [key]: change(current) });
}

export function recordAttempt(setKey, problemId, index, correct) {
  updateProblem(setKey, problemId, (current) => {
    const part = current.parts[index] ?? emptyPart;
    const solved = part.solved || correct;
    return { ...current, parts: { ...current.parts, [index]: { ...part, tries: part.tries + 1, solved, own: part.own || (correct && !current.solution) } } };
  });
}

export function recordClue(setKey, problemId, index) {
  updateProblem(setKey, problemId, (current) => {
    const part = current.parts[index] ?? emptyPart;
    return { ...current, parts: { ...current.parts, [index]: { ...part, clues: part.clues + 1 } } };
  });
}

export function recordSolutionOpened(setKey, problemId) {
  updateProblem(setKey, problemId, (current) => ({ ...current, solution: true }));
}

export function resetProblem(setKey, problemId) {
  const next = { ...state };
  delete next[problemKey(setKey, problemId)];
  save(next);
}

// Totals for a homework set: parts solved, parts solved without the full solution, and all parts.
export function setSummary(setKey, set) {
  let solved = 0;
  let own = 0;
  let total = 0;
  for (const problem of set.problems) {
    problem.parts.forEach((_, index) => {
      const part = partState(setKey, problem.id, index);
      total += 1;
      if (part.solved) solved += 1;
      if (part.own) own += 1;
    });
  }
  return { solved, own, total };
}

export function useHomeworkProgress() {
  const [, force] = React.useReducer((count) => count + 1, 0);
  React.useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
}
