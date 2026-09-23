// Per-concept code edits and saved versions, kept in this browser only.
// Storage can be unavailable (private windows, blocked site data), so every access is guarded.

const PREFIX = 'mathml-study:code:v1:';
const MAX_VERSIONS = 10;

function read(conceptId) {
  try {
    const raw = window.localStorage.getItem(PREFIX + conceptId);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && (parsed.current === null || typeof parsed.current === 'string') && Array.isArray(parsed.versions)) return parsed;
  } catch {
    // Fall through to the empty state.
  }
  return null;
}

function write(conceptId, state) {
  try {
    window.localStorage.setItem(PREFIX + conceptId, JSON.stringify(state));
  } catch {
    // Edits still work for this visit; they just will not survive a reload.
  }
}

export function loadCode(conceptId, original) {
  const saved = read(conceptId);
  return { code: saved?.current ?? original, versions: saved?.versions ?? [] };
}

// `code` is null when the student has not edited the example.
export function saveCurrent(conceptId, code, versions) {
  if (code === null && versions.length === 0) {
    try {
      window.localStorage.removeItem(PREFIX + conceptId);
    } catch {
      // Nothing stored or storage unavailable; either way there is nothing to clear.
    }
    return;
  }
  write(conceptId, { current: code, versions });
}

// Returns the new version list; identical consecutive snapshots are not duplicated.
export function addVersion(versions, code, label) {
  if (versions[0]?.code === code) return versions;
  return [{ code, label, savedAt: Date.now() }, ...versions].slice(0, MAX_VERSIONS);
}
