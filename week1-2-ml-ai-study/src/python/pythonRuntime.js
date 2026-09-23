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
  if (message.type === 'status' && message.status !== 'loading') loaded = true;
  // Messages from a stopped or released run are ignored.
  if (!active || message.id !== active.id) return;
  if (message.type === 'status') {
    active.phase = message.status;
    active.onStatus?.(message.status);
  } else if (message.type === 'output') {
    active.onOutput?.(message.chunks);
  } else if (message.type === 'done') {
    if (message.fatal) resetWorker();
    finish(message);
  }
}

export function isPythonLoaded() {
  return loaded;
}

// Resolves with { error, images, elapsedMs }. Batches of { stream, text } chunks arrive through onOutput.
export function runPython(code, { onOutput, onStatus } = {}) {
  if (active) stopPython();
  return new Promise((resolve) => {
    const id = nextId++;
    active = { id, resolve, onOutput, onStatus, phase: 'queued' };
    getWorker().postMessage({ type: 'run', id, code, baseUrl: pyodideBase });
  });
}

// Python cannot be interrupted mid-statement, so stopping discards the worker; the next run reloads it.
export function stopPython() {
  if (!active) return;
  resetWorker();
  finish({ error: 'Stopped. (Python restarts on the next run.)', images: [], elapsedMs: 0, stopped: true });
}

// Called when the page that started a run goes away. Student code that is already running is
// stopped; a run still loading Python or packages is only cancelled, so the download is kept.
export function releasePython() {
  if (!active) return;
  if (active.phase === 'running') {
    stopPython();
    return;
  }
  worker?.postMessage({ type: 'cancel', id: active.id });
  active = null;
}
