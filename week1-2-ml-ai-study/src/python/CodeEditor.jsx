import React from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

// Thin React wrapper around CodeMirror 6. `value` is controlled: outside changes (reset, restoring a
// version) replace the document, while typing reports back through onChange.
export function CodeEditor({ value, onChange, onRun, label }) {
  const hostRef = React.useRef(null);
  const viewRef = React.useRef(null);
  const callbacks = React.useRef({ onChange, onRun });
  callbacks.current = { onChange, onRun };

  React.useEffect(() => {
    const view = new EditorView({
      doc: value,
      parent: hostRef.current,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => { callbacks.current.onRun?.(); return true; } }])),
        keymap.of([indentWithTab]),
        EditorView.contentAttributes.of({ 'aria-label': label }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) callbacks.current.onChange(update.state.doc.toString());
        }),
      ],
    });
    viewRef.current = view;
    return () => view.destroy();
    // The editor is created once; later value changes are applied by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== value) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div className="code-editor" ref={hostRef} />;
}
