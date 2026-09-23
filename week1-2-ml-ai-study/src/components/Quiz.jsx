import React from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { recordQuizScore, useQuizScores } from '../quizScores.js';

// Deterministic shuffle so options stay put while answering, but the correct answer is not always
// first. The attempt number is part of the seed, so "Try again" reorders the options.
function seededRandom(text) {
  let seed = 2166136261;
  for (let index = 0; index < text.length; index += 1) seed = Math.imul(seed ^ text.charCodeAt(index), 16777619);
  return () => {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507);
    seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
    seed ^= seed >>> 16;
    return (seed >>> 0) / 4294967296;
  };
}

function shuffledOptions(question, seed) {
  const random = seededRandom(seed);
  const options = [question.answer, ...question.wrong];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [options[index], options[swap]] = [options[swap], options[index]];
  }
  return options;
}

function verdict(correct, total) {
  if (correct === total) return 'Excellent: you have the key ideas. Ready for the next concept.';
  if (correct / total >= 0.6) return 'Good progress. Review the explanations above for the ones you missed.';
  return 'Worth another look: reread the intuition and worked example, then try again.';
}

export function Quiz({ quizId, questions, children }) {
  const [attempt, setAttempt] = React.useState(0);
  const [chosen, setChosen] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const scoreFor = useQuizScores();
  const saved = scoreFor(quizId);
  const options = React.useMemo(() => questions.map((question, index) => shuffledOptions(question, `${quizId}|${index}|${attempt}`)), [questions, quizId, attempt]);
  const answeredCount = Object.keys(chosen).length;
  const correctCount = questions.filter((question, index) => chosen[index] === question.answer).length;

  function submit(event) {
    event.preventDefault();
    if (answeredCount < questions.length) return;
    setSubmitted(true);
    recordQuizScore(quizId, correctCount, questions.length);
  }

  function retry() {
    setChosen({});
    setSubmitted(false);
    setAttempt((current) => current + 1);
  }

  return (
    <form className="quiz" onSubmit={submit}>
      <div className="quiz-header">
        <span>{questions.length} multiple-choice questions</span>
        {saved && <span className={`quiz-best${saved.best === saved.total ? ' full' : ''}`}>Best score: {saved.best} / {saved.total}</span>}
      </div>
      {questions.map((question, index) => {
        const picked = chosen[index];
        const isRight = picked === question.answer;
        return (
          <fieldset key={`${attempt}-${index}`} className={`quiz-question${submitted ? (isRight ? ' right' : ' wrong') : ''}`} disabled={submitted}>
            <legend><span className="quiz-number">{index + 1}</span> {question.question}</legend>
            <div className="quiz-options">
              {options[index].map((option) => {
                const state = submitted ? (option === question.answer ? 'is-answer' : option === picked ? 'is-picked-wrong' : '') : '';
                return (
                  <label key={option} className={`quiz-option ${picked === option ? 'selected' : ''} ${state}`}>
                    <input type="radio" name={`${quizId}-${attempt}-${index}`} value={option} checked={picked === option} onChange={() => setChosen((current) => ({ ...current, [index]: option }))} />
                    <span>{option}</span>
                    {state === 'is-answer' && <Check size={16} aria-label="correct answer" />}
                    {state === 'is-picked-wrong' && <X size={16} aria-label="your answer, incorrect" />}
                  </label>
                );
              })}
            </div>
            {submitted && (
              <p className="quiz-feedback">
                <strong>{isRight ? 'Correct.' : `Not quite. The answer is: ${question.answer}.`}</strong> {question.why}
              </p>
            )}
          </fieldset>
        );
      })}
      {submitted ? (
        <div className="quiz-result" role="status">
          <div>
            <p className="quiz-score">You scored {correctCount} / {questions.length} ({Math.round((100 * correctCount) / questions.length)}%)</p>
            <p>{verdict(correctCount, questions.length)}</p>
          </div>
          <div className="quiz-actions">
            <button type="button" onClick={retry}><RotateCcw size={16} /> Try again</button>
            {children}
          </div>
        </div>
      ) : (
        <div className="quiz-actions">
          <button type="submit" className="quiz-submit" disabled={answeredCount < questions.length}>Check answers</button>
          {answeredCount < questions.length && <span className="quiz-hint">{answeredCount} of {questions.length} answered</span>}
        </div>
      )}
    </form>
  );
}

// Small badge for lists: best score so far, if the quiz has been taken.
export function QuizBadge({ quizId }) {
  const saved = useQuizScores()(quizId);
  if (!saved) return null;
  return <span className={`quiz-badge${saved.best === saved.total ? ' full' : ''}`}>Quiz {saved.best}/{saved.total}</span>;
}
