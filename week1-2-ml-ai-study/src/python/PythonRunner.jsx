import React from 'react';
import { Copy, History, Play, RotateCcw, Square, Trash2 } from 'lucide-react';
import { CodeEditor } from './CodeEditor.jsx';
import { addVersion, loadCode, saveCurrent } from './codeStore.js';
import { isPythonLoaded, releasePython, runPython, stopPython } from './pythonRuntime.js';

const statusText = {
  loading: 'Starting Python in your browser. The first run downloads about 10 MB, then it is cached.',
  installing: 'Loading packages used by this code (numpy, sympy, ...).',
  running: 'Running...',
};

// Consecutive chunks from the same stream are merged so long output stays a handful of elements.
function appendChunks(current, chunks) {
  const next = current.slice();
  chunks.forEach((chunk) => {
    const last = next[next.length - 1];
    if (last && last.stream === chunk.stream) next[next.length - 1] = { ...last, text: last.text + chunk.text };
    else next.push(chunk);
  });
  return next;
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function PythonRunner({ conceptId, original }) {
  const [initial] = React.useState(() => loadCode(conceptId, original));
  const [code, setCode] = React.useState(initial.code);
  const [versions, setVersions] = React.useState(initial.versions);
  const [output, setOutput] = React.useState([]);
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState('idle');
  const [copied, setCopied] = React.useState(false);
  const isEdited = code !== original;
  const isBusy = status === 'loading' || status === 'installing' || status === 'running';

  // Saved on every change so nothing is lost if the tab closes right after an edit. Unedited code
  // is not stored, so students who never edited a page always get the latest example.
  React.useEffect(() => {
    saveCurrent(conceptId, code === original ? null : code, versions);
  }, [conceptId, code, original, versions]);

  // Leaving the page stops running code but keeps a Python download in progress.
  React.useEffect(() => () => releasePython(), []);

  async function run() {
    if (isBusy) return;
    if (isEdited) setVersions((current) => addVersion(current, code, 'Ran'));
    setOutput([]);
    setResult(null);
    setStatus(isPythonLoaded() ? 'running' : 'loading');
    const finished = await runPython(code, {
      onStatus: setStatus,
      onOutput: (chunks) => setOutput((current) => appendChunks(current, chunks)),
    });
    setResult(finished);
    setStatus('idle');
  }

  function stop() {
    stopPython();
  }

  function reset() {
    if (!isEdited) return;
    setVersions((current) => addVersion(current, code, 'Before reset'));
    setCode(original);
  }

  function restoreVersion(event) {
    const index = Number(event.target.value);
    event.target.value = '';
    const version = versions[index];
    if (!version) return;
    if (code !== version.code && code !== original) setVersions((current) => addVersion(current, code, 'Before restore'));
    setCode(version.code);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="python-runner">
      <div className="code-toolbar">
        <div className="toolbar-group">
          {isBusy ? (
            <button className="run-button" onClick={stop}><Square size={14} /> Stop</button>
          ) : (
            <button className="run-button" onClick={run} title="Run (Ctrl+Enter / Cmd+Enter)"><Play size={14} /> Run</button>
          )}
          <button onClick={reset} disabled={!isEdited} title="Restore the original example (your current code is kept under Versions)"><RotateCcw size={14} /> Reset</button>
          <label className="version-picker" title="Restore an earlier version of your code">
            <History size={14} />
            <select aria-label="Restore a saved version" defaultValue="" onChange={restoreVersion} disabled={!versions.length}>
              <option value="" disabled>{versions.length ? `Versions (${versions.length})` : 'No versions yet'}</option>
              {versions.map((version, index) => (
                <option key={version.savedAt + version.label} value={index}>{version.label} at {formatTime(version.savedAt)}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="toolbar-group">
          {isEdited && <span className="edited-badge">Edited</span>}
          <button onClick={copyCode} aria-label="Copy Python code"><Copy size={14} /> {copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>

      <CodeEditor value={code} onChange={setCode} onRun={run} label="Python code editor" />

      <div className="runner-hint">
        Edit the code and press Run (Ctrl+Enter / Cmd+Enter). Your edits are saved in this browser. Reset brings back the original example; earlier code is kept under Versions. Press Esc then Tab to leave the editor.
      </div>

      <RunOutput status={status} output={output} result={result} onClear={() => { setOutput([]); setResult(null); }} />
    </div>
  );
}

function RunOutput({ status, output, result, onClear }) {
  const hasContent = output.length > 0 || result?.error || result?.images?.length;
  if (status === 'idle' && !result) {
    return <div className="run-output empty">Output appears here after you press Run.</div>;
  }

  return (
    <div className="run-output" aria-live="polite">
      <div className="run-output-header">
        <span>{status !== 'idle' ? statusText[status] : result?.error ? 'Finished with an error' : `Finished in ${Math.max(1, Math.round(result?.elapsedMs ?? 0))} ms`}</span>
        {hasContent && status === 'idle' && <button onClick={onClear}><Trash2 size={13} /> Clear</button>}
      </div>
      {output.length > 0 && (
        <pre>{output.map((chunk, index) => <span key={index} className={chunk.stream === 'stderr' ? 'stderr' : undefined}>{chunk.text}</span>)}</pre>
      )}
      {result?.error && <pre className="run-error">{result.error}</pre>}
      {result?.images?.map((image, index) => <img key={index} src={`data:image/png;base64,${image}`} alt={`Plot ${index + 1} produced by the code`} />)}
      {status === 'idle' && result && !result.error && output.length === 0 && !result.images?.length && (
        <p className="run-empty">The code ran but printed nothing. Add print(...) to see values.</p>
      )}
    </div>
  );
}
