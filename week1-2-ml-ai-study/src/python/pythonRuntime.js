// One shared Python worker for the whole app, so Pyodide downloads once and is reused on every page.

const pyodideBase = import.meta.env.VITE_PYODIDE_BASE || undefined;

let worker = null;
let nextId = 1;
let active = null;
let loaded = false;

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('./pyodideWorker.js', import.meta.url), { type: 'module' });
    worker.onmessage = handleMessage;
    worker.onerror = (event) => {
      finish({ error: `Python worker failed: ${event.message ?? 'unknown error'}`, images: [], elapsedMs: 0 });
      resetWorker();
    };
  }
  return worker;
}

function resetWorker() {
  worker?.terminate();
  worker = null;
  loaded = false;
}

function finish(result) {
  if (!active) return;
  const { resolve } = active;
  active = null;
  resolve(result);
}

function handleMessage(event) {
  const message = event.data;
  // Output lines carry no id and always belong to the active run; status/done from a stopped run are ignored.
  if (!active || (message.id !== undefined && message.id !== active.id)) return;
  if (message.type === 'status') {
    if (message.status !== 'loading') loaded = true;
    active.onStatus?.(message.status);
  } else if (message.type === 'stdout') {
    active.onOutput?.({ stream: 'stdout', text: `${message.text}\n` });
  } else if (message.type === 'stderr') {
    active.onOutput?.({ stream: 'stderr', text: `${message.text}\n` });
  } else if (message.type === 'done') {
    if (message.fatal) resetWorker();
    finish(message);
  }
}

export function isPythonLoaded() {
  return loaded;
}

export function isPythonBusy() {
  return active !== null;
}

// Resolves with { error, images, elapsedMs }. Output lines stream through onOutput while the code runs.
export function runPython(code, { onOutput, onStatus } = {}) {
  if (active) stopPython();
  return new Promise((resolve) => {
    const id = nextId++;
    active = { id, resolve, onOutput, onStatus };
    getWorker().postMessage({ type: 'run', id, code, baseUrl: pyodideBase });
  });
}

// Python cannot be interrupted mid-statement, so stopping discards the worker; the next run reloads it.
export function stopPython() {
  if (!active) return;
  resetWorker();
  finish({ error: 'Stopped. (Python restarts on the next run.)', images: [], elapsedMs: 0, stopped: true });
}
