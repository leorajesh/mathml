import React from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { Compartment, Prec } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { currentTheme, onThemeChange } from '../theme.js';

// Light mode: an IDE-like light theme whose syntax colours all keep at least 4.5:1 contrast on the
// editor background. Dark mode: One Dark, as in VS Code and Jupyter.
const lightHighlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword, tags.definitionKeyword, tags.moduleKeyword], color: '#7a2fb8' },
  { tag: [tags.string, tags.special(tags.string)], color: '#0b6b36' },
  { tag: [tags.number, tags.bool, tags.null], color: '#9a4f00' },
  { tag: [tags.comment, tags.lineComment], color: '#5f6b7c', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName), tags.definition(tags.function(tags.variableName))], color: '#1f5fae' },
  { tag: [tags.className, tags.definition(tags.className)], color: '#0b6a69' },
  { tag: [tags.propertyName, tags.attributeName], color: '#1a4f8a' },
  { tag: [tags.operator, tags.punctuation, tags.bracket], color: '#3b4556' },
  { tag: tags.variableName, color: '#1a2230' },
]);
const lightTheme = [
  EditorView.theme({
    '&': { backgroundColor: '#f7f8fa', color: '#1a2230' },
    '.cm-content': { caretColor: '#1f5fae' },
    '.cm-gutters': { backgroundColor: '#eef1f5', color: '#6b7789', border: 'none' },
    '.cm-activeLine': { backgroundColor: '#eaf0f8' },
    '.cm-activeLineGutter': { backgroundColor: '#e3e8ef' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: '#cfe0f7' },
    '.cm-cursor': { borderLeftColor: '#1f5fae' },
  }, { dark: false }),
  syntaxHighlighting(lightHighlight),
];
const themeFor = (theme) => (theme === 'dark' ? oneDark : lightTheme);

// Thin React wrapper around CodeMirror 6. `value` is controlled: outside changes (reset, restoring a
// version) replace the document, while typing reports back through onChange.
export function CodeEditor({ value, onChange, onRun, label }) {
  const hostRef = React.useRef(null);
  const viewRef = React.useRef(null);
  const callbacks = React.useRef({ onChange, onRun });
  const themeSlot = React.useRef(new Compartment());
  callbacks.current = { onChange, onRun };

  React.useEffect(() => {
    const view = new EditorView({
      doc: value,
      parent: hostRef.current,
      extensions: [
        basicSetup,
        python(),
        themeSlot.current.of(themeFor(currentTheme())),
        Prec.highest(keymap.of([{ key: 'Mod-Enter', run: () => { callbacks.current.onRun?.(); return true; } }])),
        keymap.of([indentWithTab]),
        EditorView.contentAttributes.of({ 'aria-label': label }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) callbacks.current.onChange(update.state.doc.toString());
        }),
      ],
    });
    viewRef.current = view;
    const stopWatching = onThemeChange((theme) => view.dispatch({ effects: themeSlot.current.reconfigure(themeFor(theme)) }));
    return () => { stopWatching(); view.destroy(); };
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
