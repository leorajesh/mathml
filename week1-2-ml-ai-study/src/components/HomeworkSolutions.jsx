import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { AlertTriangle, ArrowLeft, Check, GraduationCap, Lightbulb, ListChecks, Lock, ShieldCheck } from 'lucide-react';
import { homeworkSolutions } from '../data/homeworkSolutions.js';
import { conceptMap } from '../data/concepts.js';

// Worked solutions for a course homework sheet, laid out like a professor's review session: the idea,
// the steps (revealed one at a time), a self-check, and the slips seen in a graded attempt. The page
// asks for an own attempt first; the choice is remembered per browser.

// Text with inline math between $...$.
export function MathText({ text }) {
  const parts = text.split('$');
  return parts.map((part, index) => (index % 2 ? <InlineMath key={index} math={part} /> : <React.Fragment key={index}>{part}</React.Fragment>));
}

const storageKey = (setId) => `mathml-study:solutions-unlocked:${setId}`;

function readUnlocked(setId) {
  try { return window.localStorage.getItem(storageKey(setId)) === '1'; } catch { return false; }
}

function Problem({ problem, onOpen }) {
  const [shown, setShown] = React.useState(0);
  const done = shown >= problem.steps.length;
  return (
    <article className="sol-problem" id={`sol-${problem.id}`}>
      <header className="sol-head">
        <span className="sol-number">{problem.number}</span>
        <h3>{problem.title}</h3>
        {problem.optional && <span className="sol-optional">optional</span>}
      </header>
      <div className="example-task">
        <span className="example-task-label">The problem</span>
        <p><MathText text={problem.statement} /></p>
      </div>
      <p className="sol-idea"><Lightbulb size={16} aria-hidden="true" /> <span><strong>Method in one line.</strong> <MathText text={problem.idea} /></span></p>

      {shown > 0 && (
        <ol className="sol-steps">
          {problem.steps.slice(0, shown).map((step, index) => (
            <li key={index}>
              <p><MathText text={step.text} /></p>
              {step.tex && <div className="sol-display"><BlockMath math={step.tex} /></div>}
            </li>
          ))}
        </ol>
      )}

      {done ? (
        <>
          <p className="bonus-answer"><Check size={16} aria-hidden="true" /> <span><strong>Answer:</strong> <MathText text={problem.answer} /></span></p>
          <p className="sol-check"><ListChecks size={16} aria-hidden="true" /> <span><strong>Check it yourself:</strong> <MathText text={problem.check} /></span></p>
        </>
      ) : (
        <div className="practice-actions">
          <button className="practice-next" onClick={() => setShown((count) => count + 1)}>{shown === 0 ? 'Show step 1' : `Show step ${shown + 1}`}</button>
          <button className="practice-all" onClick={() => setShown(problem.steps.length)}>Show the whole solution</button>
          <span className="practice-count">{shown} of {problem.steps.length} steps shown. Try each step before you reveal it.</span>
        </div>
      )}

      <div className="sol-slips">
        <p className="sol-slips-title"><AlertTriangle size={15} aria-hidden="true" /> From the graded attempt</p>
        <ul>{problem.slips.map((slip) => <li key={slip}><MathText text={slip} /></li>)}</ul>
      </div>

      <p className="bonus-pages">Review: {problem.pages.map((id, index) => (
        <React.Fragment key={id}>{index > 0 && ', '}<button className="inline-link" onClick={() => onOpen(id)}>{conceptMap[id]?.title ?? id}</button></React.Fragment>
      ))}</p>
    </article>
  );
}

export function HomeworkSolutions({ setId, onOpen, onBack }) {
  const set = homeworkSolutions[setId];
  const [unlocked, setUnlocked] = React.useState(() => readUnlocked(setId));
  if (!set) return null;

  function unlock() {
    setUnlocked(true);
    try { window.localStorage.setItem(storageKey(setId), '1'); } catch { /* not remembered */ }
  }

  return (
    <main className="solutions-page">
      <div className="concept-page-top">
        <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Back to the Math track</button>
      </div>
      <header className="sol-header">
        <p className="ip-kicker"><GraduationCap size={15} aria-hidden="true" /> {set.course}</p>
        <h1>{set.title}</h1>
        <p className="ip-lede">{set.intro}</p>
      </header>

      {!unlocked ? (
        <section className="sol-gate">
          <p><Lock size={18} aria-hidden="true" /> <strong>Do your own attempt first.</strong> These are full solutions. Reading them before trying the sheet feels like learning but is not: you would recognise the steps and still be unable to produce them in the quiz.</p>
          <p>If you have not started yet, use the reading guide on the Math track instead: it lists which pages teach each problem.</p>
          <button className="track-primary" onClick={unlock}><ShieldCheck size={16} aria-hidden="true" /> I have made my own attempt: show the solutions</button>
        </section>
      ) : (
        <>
          <section className="sol-general">
            <h2>The professor's four general remarks</h2>
            <ol>{set.general.map((item) => <li key={item}>{item}</li>)}</ol>
          </section>

          <nav className="sol-toc" aria-label="Problems">
            {set.problems.map((problem) => (
              <a key={problem.id} href={`#sol-${problem.id}`} onClick={(event) => { event.preventDefault(); document.getElementById(`sol-${problem.id}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
                {problem.number}{problem.optional ? '*' : ''}
              </a>
            ))}
            <span className="practice-count">* optional on the sheet</span>
          </nav>

          {set.problems.map((problem) => <Problem key={problem.id} problem={problem} onOpen={onOpen} />)}
        </>
      )}
    </main>
  );
}
