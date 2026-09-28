import React from 'react';
import { ArrowLeft, BookOpen, Check, ClipboardList } from 'lucide-react';
import { bonusExamples } from '../data/bonusExamples.js';
import { conceptMap } from '../data/concepts.js';
import { courseBooks } from '../data/courseReferences.js';
import { MML_BOOK, mmlLink } from '../data/mmlReferences.js';
import { sectionKey, tracks } from '../data/learningTracks.js';

// Bonus examples for one track section: extra worked examples, modelled on examples in the course
// book, for students who want to go further. Each starts with its task; the steps are revealed one at
// a time so the student can try each step first.
export function sectionForKey(key) {
  const trackId = key.slice(0, key.indexOf('/'));
  const section = tracks[trackId]?.sections.find((item) => sectionKey(trackId, item) === key);
  return section ? { trackId, section } : null;
}

function SourceLine({ source }) {
  if (source.book === 'mml') {
    return (
      <p className="bonus-source">
        <BookOpen size={14} aria-hidden="true" /> Adapted from{' '}
        <a href={mmlLink(source.page)} target="_blank" rel="noreferrer">{MML_BOOK.title}, {source.label}{source.title ? `: ${source.title}` : ''} (p. {source.page})</a>
        . Same idea, our own numbers.
      </p>
    );
  }
  const book = courseBooks[source.book];
  return (
    <p className="bonus-source">
      <BookOpen size={14} aria-hidden="true" /> Based on{' '}
      <a href={book.url} target="_blank" rel="noreferrer">{book.short}, {source.label}: {source.title}</a>.
    </p>
  );
}

function BonusExample({ example, number, onOpen }) {
  const [shown, setShown] = React.useState(0);
  const done = shown >= example.steps.length;
  return (
    <article className="bonus-example" id={`bonus-${example.id}`}>
      <header className="bonus-head">
        <span className="bonus-number">{number}</span>
        <h3>{example.title}</h3>
      </header>
      <SourceLine source={example.source} />
      <div className="example-task">
        <span className="example-task-label">The task</span>
        <p>{example.task}</p>
      </div>
      {shown > 0 && (
        <ol className="worked-example bonus-steps">
          {example.steps.slice(0, shown).map((step) => <li key={step}><p>{step}</p></li>)}
        </ol>
      )}
      {done ? (
        <p className="bonus-answer"><Check size={16} aria-hidden="true" /> <strong>Answer:</strong> {example.answer}</p>
      ) : (
        <div className="practice-actions">
          <button className="practice-next" onClick={() => setShown((count) => count + 1)}>{shown === 0 ? 'Show step 1' : `Check step ${shown + 1}`}</button>
          <button className="practice-all" onClick={() => setShown(example.steps.length)}>Show the whole solution</button>
          <span className="practice-count">Try the task first; reveal one step at a time.</span>
        </div>
      )}
      <p className="bonus-pages">Review: {example.pages.map((id, index) => (
        <React.Fragment key={id}>{index > 0 && ', '}<button className="inline-link" onClick={() => onOpen(id)}>{conceptMap[id]?.title ?? id}</button></React.Fragment>
      ))}</p>
    </article>
  );
}

export function BonusPage({ sectionKeyValue, onOpen, onShowTrack, onOpenHomework }) {
  const found = sectionForKey(sectionKeyValue);
  const examples = bonusExamples[sectionKeyValue] ?? [];
  if (!found) return null;
  const { trackId, section } = found;
  return (
    <main className="bonus-page">
      <div className="concept-page-top">
        <button className="back-button" onClick={() => onShowTrack(trackId)}><ArrowLeft size={18} /> Back to the {tracks[trackId].title}</button>
        <button className="back-button" onClick={() => onOpenHomework(sectionKeyValue)}><ClipboardList size={17} /> Homework for this section</button>
      </div>
      <p className="eyebrow">{tracks[trackId].title} / Bonus examples</p>
      <h1>{section.title}: bonus examples</h1>
      <p className="bonus-intro">Extra worked examples for going deeper. Each one follows an example in the course book, so you can compare with the original, but uses its own numbers. Read the task, try it on paper, then reveal the steps one at a time.</p>
      {examples.map((example, index) => <BonusExample key={example.id} example={example} number={index + 1} onOpen={(id) => onOpen(id, trackId)} />)}
    </main>
  );
}
