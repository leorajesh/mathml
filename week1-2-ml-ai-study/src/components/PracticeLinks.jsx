import React from 'react';
import { PenLine } from 'lucide-react';
import { conceptMap } from '../data/concepts.js';

// Links from a homework problem to the worked examples that practise the same method. Each opens the
// page at its worked example with the steps hidden, so the student works through a solved example
// before trying the homework's own numbers.
const PREVIEW = 90;

function preview(line) {
  return line.length > PREVIEW ? `${line.slice(0, PREVIEW).replace(/\s+\S*$/, '')}…` : line;
}

export function practiceHref(id) {
  return `#${id}?section=example&practice=1`;
}

export function PracticeLinks({ ids, compact = false }) {
  const pages = ids.filter((id) => conceptMap[id]?.example?.length);
  if (!pages.length) return null;
  if (compact) {
    return (
      <span className="practice-inline">
        <PenLine size={14} aria-hidden="true" /> Practise first:{' '}
        {pages.map((id, index) => (
          <React.Fragment key={id}>
            {index > 0 && ', '}
            <a className="inline-link" href={practiceHref(id)}>{conceptMap[id].title} worked example</a>
          </React.Fragment>
        ))}
      </span>
    );
  }
  return (
    <div className="practice-links">
      <p className="practice-links-title"><PenLine size={15} aria-hidden="true" /> Practise first with a worked example (same method, different numbers):</p>
      <ul>
        {pages.map((id) => (
          <li key={id}>
            <a href={practiceHref(id)}>{conceptMap[id].title}</a>
            <span className="practice-preview"> ({conceptMap[id].example.length} steps) {preview(conceptMap[id].example[0])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
