import React from 'react';

// Light or dark theme, kept on <html data-theme="...">. The first choice follows the system setting
// (index.html sets it before the page paints, so there is no flash); a choice made with the toggle is
// remembered in this browser.
const KEY = 'mathml-study:theme';
const listeners = new Set();

export function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  listeners.forEach((listener) => listener(theme));
}

export function setTheme(theme) {
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // Without storage the choice lasts for this visit only.
  }
  apply(theme);
}

export function onThemeChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Follow the system setting until the student picks a theme themselves.
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (event) => {
    let stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch { /* ignore */ }
    if (!stored) apply(event.matches ? 'dark' : 'light');
  });
}

export function useTheme() {
  const [theme, setLocal] = React.useState(currentTheme);
  React.useEffect(() => onThemeChange(setLocal), []);
  return theme;
}
