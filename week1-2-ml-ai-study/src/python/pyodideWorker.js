// Runs student Python in a Web Worker so long computations never freeze the page.
// Pyodide (CPython compiled to WebAssembly) is fetched from the jsDelivr CDN on the first run.

const DEFAULT_PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';

let pyodideReady = null;

// Executed once after Pyodide boots: runs a snippet in a fresh namespace and, if matplotlib
// was used, returns every open figure as a base64 PNG.
const RUNNER_SOURCE = `
import base64, io, linecache, os, sys, traceback
os.environ.setdefault("MPLBACKEND", "AGG")

def __study_run(code):
    namespace = {"__name__": "__main__"}
    # Lets tracebacks quote the student's source line.
    linecache.cache["<your code>"] = (len(code), None, code.splitlines(True), "<your code>")
    error = None
    try:
        exec(compile(code, "<your code>", "exec"), namespace)
    except BaseException as exc:
        frames = traceback.extract_tb(exc.__traceback__)
        user_frames = [frame for frame in frames if frame.filename == "<your code>"]
        lines = traceback.format_list(user_frames) if user_frames else []
        error = "Traceback (most recent call last):\\n" + "".join(lines) if lines else ""
        error += "".join(traceback.format_exception_only(type(exc), exc))
    images = []
    if "matplotlib.pyplot" in sys.modules:
        import matplotlib.pyplot as plt
        for number in plt.get_fignums():
            buffer = io.BytesIO()
            plt.figure(number).savefig(buffer, format="png", dpi=110, bbox_inches="tight")
            images.append(base64.b64encode(buffer.getvalue()).decode("ascii"))
        plt.close("all")
    sys.stdout.flush()
    sys.stderr.flush()
    return error, images
`;

const DOWNLOAD_HINT = 'Python and its packages load from cdn.jsdelivr.net, so check your internet connection or any network filter, then press Run again.';
// Output is sent in batches (a message per printed line would flood the page) and capped per run.
const FLUSH_MS = 50;
const MAX_OUTPUT_CHARS = 200000;

let currentId = null;
const cancelled = new Set();
let pending = [];
let pendingChars = 0;
let lastFlush = 0;
let sentChars = 0;
let truncated = false;

function post(type, payload = {}) {
  self.postMessage({ type, ...payload });
}

function flushOutput() {
  if (pending.length) post('output', { id: currentId, chunks: pending });
  pending = [];
  pendingChars = 0;
  lastFlush = performance.now();
}

function queueOutput(stream, text) {
  if (truncated) return;
  const line = `${text}\n`;
  if (sentChars + line.length > MAX_OUTPUT_CHARS) {
    truncated = true;
    pending.push({ stream: 'stderr', text: `\n[Output truncated after ${MAX_OUTPUT_CHARS.toLocaleString()} characters.]\n` });
    flushOutput();
    return;
  }
  sentChars += line.length;
  const last = pending[pending.length - 1];
  if (last && last.stream === stream) last.text += line;
  else pending.push({ stream, text: line });
  pendingChars += line.length;
  if (pendingChars > 16384 || performance.now() - lastFlush > FLUSH_MS) flushOutput();
}

async function boot(baseUrl) {
  const { loadPyodide } = await import(/* @vite-ignore */ `${baseUrl}pyodide.mjs`);
  const pyodide = await loadPyodide({ indexURL: baseUrl });
  pyodide.setStdout({ batched: (text) => queueOutput('stdout', text) });
  pyodide.setStderr({ batched: (text) => queueOutput('stderr', text) });
  await pyodide.runPythonAsync(RUNNER_SOURCE);
  return pyodide;
}

self.onmessage = async (event) => {
  const { type, id, code, baseUrl } = event.data;
  if (type === 'cancel') {
    cancelled.add(id);
    return;
  }
  if (type !== 'run') return;

  let pyodide;
  try {
    if (!pyodideReady) {
      post('status', { id, status: 'loading' });
      // A failed download is not cached, so the next Run retries it.
      pyodideReady = boot(baseUrl || DEFAULT_PYODIDE_BASE).catch((error) => {
        pyodideReady = null;
        throw error;
      });
    }
    pyodide = await pyodideReady;
  } catch (error) {
    post('done', { id, error: `Could not start Python: ${error?.message ?? error}\n${DOWNLOAD_HINT}`, images: [], elapsedMs: 0, fatal: true });
    return;
  }

  // A run whose page was closed while Python was still loading is skipped.
  if (cancelled.delete(id)) return;

  currentId = id;
  pending = [];
  pendingChars = 0;
  sentChars = 0;
  truncated = false;
  lastFlush = performance.now();
  try {
    post('status', { id, status: 'installing' });
    let packageFailed = false;
    try {
      await pyodide.loadPackagesFromImports(code, {
        messageCallback: () => {},
        errorCallback: (text) => { packageFailed = true; queueOutput('stderr', text); },
      });
    } catch (error) {
      packageFailed = true;
      queueOutput('stderr', `Could not load a package: ${error?.message ?? error}`);
    }
    if (cancelled.delete(id)) return;

    post('status', { id, status: 'running' });
    const started = performance.now();
    const run = pyodide.globals.get('__study_run');
    const result = run(code);
    const [error, images] = result.toJs();
    result.destroy();
    run.destroy();
    flushOutput();
    const hint = error && packageFailed ? `\nA package could not be downloaded. ${DOWNLOAD_HINT}` : '';
    post('done', { id, error: error ? error + hint : null, images: Array.from(images ?? []), elapsedMs: performance.now() - started });
  } catch (error) {
    // Python itself is still loaded, so the worker is kept.
    flushOutput();
    post('done', { id, error: `Unexpected error while running: ${error?.message ?? error}`, images: [], elapsedMs: 0 });
  }
};
