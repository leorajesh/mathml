import React from 'react';
import { ArrowLeft, ArrowRight, Check, Lightbulb, Lock, RotateCcw, X } from 'lucide-react';
import { BlockMath } from 'react-katex';
import { conceptMap } from '../data/concepts.js';
import { homework } from '../data/homework.js';
import { sectionKey, tracks } from '../data/learningTracks.js';
import { checkAnswer } from '../utils/answerCheck.js';
import { partState, recordAttempt, recordClue, recordSolutionOpened, resetProblem, setSummary, solutionOpened, stuckNote, useHomeworkProgress } from '../homeworkProgress.js';

// The full solution of a problem unlocks once at least half of its parts have been tried.
export const unlockCount = (problem) => Math.ceil(problem.parts.length / 2);

// All homework sets in track order, for "next homework" links.
const setOrder = Object.values(tracks).flatMap((track) => track.sections.map((section) => sectionKey(track.id, section)));

// Stable option order for multiple-choice parts, so the answer is not always first.
function shuffled(options, seedText) {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) seed = Math.imul(seed ^ seedText.charCodeAt(index), 16777619);
  const random = () => {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507);
    seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
    seed ^= seed >>> 16;
    return (seed >>> 0) / 4294967296;
  };
  const result = [...options];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function PageLinks({ ids, onSelect }) {
  return ids.map((id, index) => (
    <React.Fragment key={id}>
      {index > 0 && ', '}
      <button className="inline-link" onClick={() => onSelect(id)}>{conceptMap[id].title}</button>
    </React.Fragment>
  ));
}

function Part({ setKey, problemId, index, part }) {
  const saved = partState(setKey, problemId, index);
  const [input, setInput] = React.useState('');
  const [feedback, setFeedback] = React.useState(null);
  const options = React.useMemo(() => (part.type === 'choice' ? shuffled([part.answer, ...part.wrong], `${setKey}|${problemId}|${index}`) : []), [part, setKey, problemId, index]);
  const clueCount = part.hints.length;
  const shown = Math.min(saved.clues, clueCount);
  // The last clue is the most detailed step: it opens only after one attempt at this part.
  const nextIsLast = clueCount >= 1 && shown === clueCount - 1;
  const lastLocked = nextIsLast && saved.tries === 0 && !saved.solved;
  const name = `${setKey}-${problemId}-${index}`;

  function check(event) {
    event.preventDefault();
    const result = checkAnswer(part, input);
    if (!result.valid) {
      setFeedback({ kind: 'invalid', message: result.message });
      return;
    }
    if (!recordAttempt(setKey, problemId, index, result.correct, result.key)) {
      setFeedback({ kind: 'invalid', message: 'You already tried this answer. Rethink a step, or open a clue.' });
      return;
    }
    if (result.correct) setFeedback({ kind: 'right' });
    else setFeedback({ kind: 'wrong', message: result.message ?? (shown < clueCount ? 'Not yet. Check your working, or open the next clue.' : 'Not yet. Compare your working with the clues step by step.') });
  }

  return (
    <li className={`hw-part${saved.solved ? ' solved' : ''}`}>
      <p className="hw-prompt">{part.prompt}</p>
      {saved.solved ? (
        <div className="hw-feedback right" role="status">
          <strong><Check size={16} /> Correct.</strong> {part.why}
          {saved.tier && saved.tier !== 'own' && <span className="hw-tier"> ({saved.tier === 'help' ? 'solved with help' : 'solved after the solution'})</span>}
        </div>
      ) : (
        <form className="hw-answer" onSubmit={check}>
          {part.type === 'choice' ? (
            <div className="hw-options">
              {options.map((option) => (
                <label key={option} className={`quiz-option${input === option ? ' selected' : ''}`}>
                  <input type="radio" name={name} value={option} checked={input === option} onChange={() => setInput(option)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <input className="hw-input" type="text" inputMode="text" autoComplete="off" spellCheck="false" value={input}
              placeholder={part.type === 'vector' ? `${part.answer.length} numbers, separated by commas` : 'a number or expression, e.g. 8/5 or sqrt(2)'}
              aria-label={`Answer to part ${index + 1}`} onChange={(event) => setInput(event.target.value)} />
          )}
          <button type="submit" className="quiz-submit" disabled={!input}>Check</button>
          {saved.tries > 0 && <span className="hw-tries">{saved.tries} {saved.tries === 1 ? 'try' : 'tries'}</span>}
        </form>
      )}
      {!saved.solved && feedback && (
        <p className={`hw-feedback ${feedback.kind}`} role="status">
          {feedback.kind === 'wrong' && <X size={16} aria-hidden="true" />} {feedback.message}
        </p>
      )}
      {clueCount > 0 && (
        <div className="hw-clues">
          {part.hints.slice(0, shown).map((hint, hintIndex) => (
            <p key={hint} className="hw-clue"><Lightbulb size={15} aria-hidden="true" /> <span><strong>Clue {hintIndex + 1}.</strong> {hint}</span></p>
          ))}
          {shown < clueCount && !saved.solved && (
            <button type="button" className="hw-clue-button" disabled={lastLocked} onClick={() => recordClue(setKey, problemId, index)}>
              {lastLocked ? <><Lock size={14} /> Try an answer first to unlock {clueCount === 1 ? 'the clue' : 'the last clue'}</> : `Show clue ${shown + 1} of ${clueCount}`}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function Problem({ setKey, problem, number, onSelect }) {
  const [stuck, setStuck] = React.useState('');
  const states = problem.parts.map((_, index) => partState(setKey, problem.id, index));
  const tried = states.filter((item) => item.tries > 0).length;
  const solved = states.filter((item) => item.solved).length;
  const need = unlockCount(problem);
  const open = solutionOpened(setKey, problem.id);
  const unlocked = tried >= need;
  const allSolved = solved === problem.parts.length;

  return (
    <article className="hw-problem" id={`problem-${problem.id}`}>
      <header className="hw-problem-head">
        <h3><span className="quiz-number">{number}</span> {problem.title}</h3>
        <span className={`hw-count${allSolved ? ' full' : ''}`}>{solved} / {problem.parts.length} parts</span>
      </header>
      <p className="hw-uses">Pages to review: <PageLinks ids={problem.pages} onSelect={onSelect} /></p>
      <p className="hw-statement">{problem.statement}</p>
      {problem.tex && <BlockMath math={problem.tex} />}
      <ol className="hw-parts" type="a">
        {problem.parts.map((part, index) => <Part key={index} setKey={setKey} problemId={problem.id} index={index} part={part} />)}
      </ol>
      <div className="hw-solution">
        {open ? (
          <>
            {stuckNote(setKey, problem.id) && <p className="hw-note"><strong>Where you said you were stuck:</strong> {stuckNote(setKey, problem.id)}. Find that step in the solution below.</p>}
            <h4>Full solution</h4>
            <ol>
              {problem.solution.map((item, index) => (
                <li key={index}>{item.text}{item.tex && <BlockMath math={item.tex} />}</li>
              ))}
            </ol>
            <p className="hw-takeaway"><strong>Why this matters.</strong> {problem.takeaway}</p>
            {!allSolved && <p className="hw-note">Now try the remaining parts without looking back at the solution: they still count once you check them.</p>}
          </>
        ) : unlocked ? (
          allSolved ? (
            <>
              <p className="hw-takeaway"><strong>Well done. Why this matters:</strong> {problem.takeaway}</p>
              <button type="button" className="hw-solution-button" onClick={() => recordSolutionOpened(setKey, problem.id)}>Compare with the model solution</button>
            </>
          ) : (
            <form className="hw-stuck" onSubmit={(event) => { event.preventDefault(); if (stuck.trim().length >= 10) recordSolutionOpened(setKey, problem.id, stuck.trim()); }}>
              <label htmlFor={`stuck-${problem.id}`}>Before the solution opens: in one line, where exactly are you stuck?</label>
              <input id={`stuck-${problem.id}`} className="hw-input" type="text" value={stuck} maxLength={200} placeholder="e.g. I do not know which formula gives the distance" onChange={(event) => setStuck(event.target.value)} />
              <button type="submit" className="hw-solution-button" disabled={stuck.trim().length < 10}>Show the full solution</button>
              <span className="hw-note"> Parts you solve after opening it count as "after the solution".</span>
            </form>
          )
        ) : (
          <p className="hw-locked"><Lock size={16} aria-hidden="true" /> The full solution unlocks after you have tried at least {need} of the {problem.parts.length} parts ({tried} so far). Use the clues to get unstuck.</p>
        )}
      </div>
      {(tried > 0 || open) && (
        <button type="button" className="hw-reset" onClick={() => resetProblem(setKey, problem.id)}><RotateCcw size={14} /> Start this problem again</button>
      )}
    </article>
  );
}

export function HomeworkPage({ setKey, problemId, onSelect, onShowTrack, onOpenHomework }) {
  useHomeworkProgress();
  const set = homework[setKey];
  const track = tracks[set.track];
  const section = track.sections.find((item) => sectionKey(track.id, item) === setKey);
  const summary = setSummary(setKey, set);
  const next = setOrder[setOrder.indexOf(setKey) + 1];

  React.useEffect(() => {
    if (problemId) document.getElementById(`problem-${problemId}`)?.scrollIntoView({ block: 'start' });
  }, [problemId]);

  return (
    <main className="concept-page homework-page">
      <button className="back-button" onClick={() => onShowTrack(track.id)}><ArrowLeft size={18} /> {track.title}</button>
      <section className="concept-hero">
        <p className="eyebrow">Homework · {track.title}</p>
        <h1>{set.section}</h1>
        <p className="lede">{set.intro}</p>
        <p className="hw-covers">Covers: <PageLinks ids={section.concepts} onSelect={onSelect} /></p>
      </section>

      <div className="hw-howto">
        <h2>How this homework works</h2>
        <ul>
          <li>Work each part on paper or in the Python editor of a page, then type your answer and press <strong>Check</strong>. You can type expressions such as <code>8/5</code>, <code>sqrt(13/3)</code> or <code>ln 3</code>; for several numbers, separate them with commas.</li>
          <li>Stuck? Open the clues one at a time. The last clue of a part is a worked step, and it opens only after you have tried that part once. Repeating an answer you already tried does not count as a new attempt.</li>
          <li>The full solution of a problem unlocks after you have tried at least half of its parts; if some parts are still unsolved, you first write one line about where you are stuck.</li>
          <li>A part counts as solved <strong>on your own</strong> when it is right on your first try without a clue; after a clue or a wrong try it counts as solved <strong>with help</strong>, and after opening the solution as <strong>after the solution</strong>. Wrong tries cost nothing else: the feedback is there to learn from.</li>
          <li>Progress is saved in this browser only.</li>
        </ul>
        <div className="hw-summary">
          <div className="track-progress" role="progressbar" aria-valuemin={0} aria-valuemax={summary.total} aria-valuenow={summary.solved} aria-label={`${summary.solved} of ${summary.total} parts solved`}>
            <span style={{ width: `${(100 * summary.solved) / summary.total}%` }} />
          </div>
          <p>{summary.solved} of {summary.total} parts solved: {summary.own} on your own, {summary.help} with help, {summary.solution} after the solution.</p>
        </div>
      </div>

      {set.problems.map((problem, index) => <Problem key={problem.id} setKey={setKey} problem={problem} number={index + 1} onSelect={onSelect} />)}

      <nav className="hw-footer">
        <button onClick={() => onShowTrack(track.id)}><ArrowLeft size={16} /> Back to the {track.title}</button>
        {next && homework[next].track === track.id && (
          <button className="track-next" onClick={() => onOpenHomework(next)}>Next homework: {homework[next].section} <ArrowRight size={16} /></button>
        )}
      </nav>
    </main>
  );
}

// Button under a track section.
export function HomeworkButton({ setKey, onOpen }) {
  useHomeworkProgress();
  const set = homework[setKey];
  if (!set) return null;
  const summary = setSummary(setKey, set);
  return (
    <button className="track-project homework-link" onClick={() => onOpen(setKey)}>
      Homework: {set.problems.length} problems, {summary.total} parts <span>({summary.solved === 0 ? 'not started' : `${summary.solved} of ${summary.total} solved, ${summary.own} on your own`})</span>
    </button>
  );
}

// On a concept page: the homework problems that practise it.
export function HomeworkForPage({ conceptId, onOpenHomework }) {
  const matches = Object.entries(homework).flatMap(([key, set]) => set.problems.filter((problem) => problem.pages.includes(conceptId)).map((problem) => ({ key, set, problem })));
  if (!matches.length) return null;
  return (
    <p className="hw-for-page">
      <strong>Practise it in this site's homework:</strong>{' '}
      {matches.map(({ key, set, problem }, index) => (
        <React.Fragment key={`${key}-${problem.id}`}>
          {index > 0 && ' · '}
          <button className="inline-link" onClick={() => onOpenHomework(key, problem.id)}>{set.section}: {problem.title}</button>
        </React.Fragment>
      ))}
    </p>
  );
}
