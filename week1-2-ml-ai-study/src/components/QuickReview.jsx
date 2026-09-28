import React from 'react';
import { BlockMath } from 'react-katex';
import { ArrowLeft, ArrowRight, Check, ExternalLink, Eye, Maximize2, PenLine, RotateCcw, X } from 'lucide-react';
import { conceptMap } from '../data/concepts.js';
import { intuitionDetails } from '../data/intuitionDetails.js';
import { exampleTasks } from '../data/exampleTasks.js';
import { reviewSubjects, reviewTree } from '../data/quickReview.js';
import { rate, useReviewRatings } from '../reviewProgress.js';
import { practiceHref } from './PracticeLinks.jsx';

// Quick review: every page as a short card (what it solves, its key formula, its key ideas), grouped
// subject -> category -> subcategory. "Test yourself" hides each card until the student has tried to
// recall it (retrieval practice), then asks for an honest self-rating.
const FILTERS = { all: 'All pages', again: 'Marked "review again"', unrated: 'Not rated yet' };

function ReviewCard({ id, testMode, rating, onOpen, onFocus }) {
  const concept = conceptMap[id];
  const [revealed, setRevealed] = React.useState(false);
  const hidden = testMode && !revealed;
  const ideas = (intuitionDetails[id]?.keyIdeas ?? []).slice(0, 3);
  const formula = concept.formulas[0];

  return (
    // Clicking anywhere on the card except its buttons and links opens it in focus.
    <article className={`review-card${rating ? ` rated-${rating}` : ''}`} id={`review-${id}`}
      onClick={(event) => { if (!event.target.closest('button, a, input, select')) onFocus(id); }}>
      <header className="review-card-head">
        <button className="review-title" onClick={() => onOpen(id)}>{concept.title}</button>
        <button className="review-expand" onClick={() => onFocus(id)} aria-label={`Focus on ${concept.title}`} title="Focus on this card"><Maximize2 size={14} /></button>
        {rating === 'known' && <span className="review-badge known"><Check size={13} /> Got it</span>}
        {rating === 'again' && <span className="review-badge again"><RotateCcw size={13} /> Review again</span>}
      </header>
      {hidden ? (
        <div className="review-prompt">
          <p>Before revealing: what problem does it solve, and what is its key formula? Say it or jot it down.</p>
          <button className="review-reveal" onClick={() => setRevealed(true)}><Eye size={15} /> Reveal</button>
        </div>
      ) : (
        <div className="review-body">
          <p className="review-problem">{concept.problem}</p>
          {formula && <div className="review-formula"><BlockMath math={formula.tex} /></div>}
          {ideas.length > 0 && (
            <ul className="review-ideas">
              {ideas.map((idea) => <li key={idea.label}><strong>{idea.label}.</strong> {idea.text}</li>)}
            </ul>
          )}
          <footer className="review-card-foot">
            <div className="review-rate" role="group" aria-label={`How well do you know ${concept.title}?`}>
              <button className={rating === 'known' ? 'active known' : ''} aria-pressed={rating === 'known'} onClick={() => rate(id, rating === 'known' ? null : 'known')}><Check size={14} /> Got it</button>
              <button className={rating === 'again' ? 'active again' : ''} aria-pressed={rating === 'again'} onClick={() => rate(id, rating === 'again' ? null : 'again')}><RotateCcw size={14} /> Review again</button>
            </div>
            <a className="review-practice" href={practiceHref(id)}><PenLine size={14} /> Practise the worked example</a>
          </footer>
        </div>
      )}
    </article>
  );
}

// One card, large and alone: more detail than the grid card, previous/next through the cards on
// screen, and Esc, the close button or a click outside to return to the overview.
function FocusCard({ ids, index, testMode, ratings, onMove, onClose, onOpen }) {
  const id = ids[index];
  const concept = conceptMap[id];
  const rating = ratings[id];
  const [revealed, setRevealed] = React.useState(!testMode);
  const closeButton = React.useRef(null);
  const ideas = intuitionDetails[id]?.keyIdeas ?? [];

  React.useEffect(() => { setRevealed(!testMode); }, [id, testMode]);
  React.useEffect(() => { closeButton.current?.focus(); }, [id]);
  React.useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight' && index < ids.length - 1) onMove(index + 1);
      else if (event.key === 'ArrowLeft' && index > 0) onMove(index - 1);
    }
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = previous; };
  }, [index, ids.length, onClose, onMove]);

  return (
    <div className="focus-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="focus-card" role="dialog" aria-modal="true" aria-labelledby="focus-title">
        <header className="focus-head">
          <span className="focus-position">{index + 1} of {ids.length}</span>
          <div className="focus-nav">
            <button onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="Previous card"><ArrowLeft size={16} /></button>
            <button onClick={() => onMove(index + 1)} disabled={index === ids.length - 1} aria-label="Next card"><ArrowRight size={16} /></button>
            <button ref={closeButton} className="focus-close" onClick={onClose} aria-label="Close and return to the overview"><X size={18} /></button>
          </div>
        </header>
        <h2 id="focus-title">{concept.title}</h2>
        {!revealed ? (
          <div className="review-prompt focus-prompt">
            <p>Before revealing: what problem does it solve, what is its key formula, and how would you use it? Say it or write it down.</p>
            <button className="review-reveal" onClick={() => setRevealed(true)}><Eye size={15} /> Reveal</button>
          </div>
        ) : (
          <div className="focus-body">
            <p className="focus-problem">{concept.problem}</p>
            <div className="focus-formulas">
              {concept.formulas.slice(0, 3).map((formula) => <div className="review-formula" key={formula.tex}><BlockMath math={formula.tex} /></div>)}
            </div>
            {ideas.length > 0 && (
              <ul className="review-ideas focus-ideas">
                {ideas.map((idea) => <li key={idea.label}><strong>{idea.label}.</strong> {idea.text}</li>)}
              </ul>
            )}
            {exampleTasks[id] && <p className="focus-task"><strong>Practice task:</strong> {exampleTasks[id]}</p>}
          </div>
        )}
        <footer className="focus-foot">
          <div className="review-rate" role="group" aria-label={`How well do you know ${concept.title}?`}>
            <button className={rating === 'known' ? 'active known' : ''} aria-pressed={rating === 'known'} onClick={() => rate(id, rating === 'known' ? null : 'known')}><Check size={14} /> Got it</button>
            <button className={rating === 'again' ? 'active again' : ''} aria-pressed={rating === 'again'} onClick={() => rate(id, rating === 'again' ? null : 'again')}><RotateCcw size={14} /> Review again</button>
          </div>
          <div className="focus-links">
            <a className="review-practice" href={practiceHref(id)}><PenLine size={14} /> Practise the worked example</a>
            <button className="focus-open" onClick={() => onOpen(id)}><ExternalLink size={14} /> Open the full page</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function QuickReview({ onOpen }) {
  const ratings = useReviewRatings();
  const [subject, setSubject] = React.useState('all');
  const [filter, setFilter] = React.useState('all');
  const [testMode, setTestMode] = React.useState(false);
  const [focused, setFocused] = React.useState(null); // index into visibleIds, or null

  const keep = (id) => (filter === 'all' ? true : filter === 'again' ? ratings[id] === 'again' : !ratings[id]);
  const categories = reviewTree
    .filter((category) => subject === 'all' || category.subject === subject)
    .map((category) => ({ ...category, subcategories: category.subcategories.map((sub) => ({ ...sub, concepts: sub.concepts.filter(keep) })).filter((sub) => sub.concepts.length) }))
    .filter((category) => category.subcategories.length);
  const allIds = reviewTree.flatMap((category) => category.subcategories.flatMap((sub) => sub.concepts));
  const known = allIds.filter((id) => ratings[id] === 'known').length;
  const again = allIds.filter((id) => ratings[id] === 'again').length;
  const visibleIds = categories.flatMap((category) => category.subcategories.flatMap((sub) => sub.concepts));
  const trackOf = Object.fromEntries(categories.flatMap((category) => category.subcategories.flatMap((sub) => sub.concepts.map((id) => [id, sub.trackId]))));
  const focusOn = (id) => setFocused(visibleIds.indexOf(id));
  const closeFocus = React.useCallback(() => {
    setFocused((index) => {
      const id = visibleIds[index];
      // Return keyboard focus to the card the student was looking at.
      if (id) setTimeout(() => document.querySelector(`#review-${CSS.escape(id)} .review-expand`)?.focus({ preventScroll: false }), 0);
      return null;
    });
  }, [visibleIds]);
  const shown = categories.reduce((sum, category) => sum + category.subcategories.reduce((n, sub) => n + sub.concepts.length, 0), 0);

  return (
    <section className="quick-review" aria-label="Quick review">
      <header className="review-intro">
        <h2>Quick Review</h2>
        <p>Every page in one place, grouped by subject, category and subcategory. For revision, switch on <strong>Test yourself</strong>: try to recall each idea before revealing it. Recalling beats re-reading for long-term memory.</p>
        <div className="review-stats">
          <span className="review-stat known"><Check size={14} /> {known} got it</span>
          <span className="review-stat again"><RotateCcw size={14} /> {again} to review again</span>
          <span className="review-stat">{allIds.length - known - again} not rated</span>
          <div className="review-meter" aria-hidden="true"><span style={{ width: `${(100 * known) / allIds.length}%` }} /></div>
        </div>
      </header>

      <div className="review-controls">
        <div className="segmented" role="group" aria-label="Subject">
          {['all', ...reviewSubjects].map((value) => (
            <button key={value} className={subject === value ? 'active' : ''} aria-pressed={subject === value} onClick={() => setSubject(value)}>{value === 'all' ? 'Both subjects' : value}</button>
          ))}
        </div>
        <select className="review-filter" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Which pages to show">
          {Object.entries(FILTERS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label className="review-mode">
          <input type="checkbox" checked={testMode} onChange={(event) => setTestMode(event.target.checked)} />
          <span>Test yourself (hide until revealed)</span>
        </label>
      </div>

      <nav className="review-jump" aria-label="Jump to a category">
        {categories.map((category) => <a key={category.id} href={`#review`} onClick={(event) => { event.preventDefault(); document.getElementById(`cat-${category.id}`)?.scrollIntoView({ block: 'start' }); }}>{category.title}</a>)}
      </nav>

      {shown === 0 && <p className="review-empty">No pages match this filter yet.</p>}

      {categories.map((category) => (
        <section className="review-category" key={category.id} id={`cat-${category.id}`}>
          <h3 className="review-category-title"><span className="review-subject">{category.subject}</span>{category.title}</h3>
          {category.subcategories.map((sub) => (
            <div className="review-subcategory" key={`${sub.trackId}:${sub.title}`}>
              <h4>{sub.title} <span>{sub.concepts.length} {sub.concepts.length === 1 ? 'page' : 'pages'}</span></h4>
              <div className="review-grid">
                {sub.concepts.map((id) => <ReviewCard key={`${id}:${testMode}`} id={id} testMode={testMode} rating={ratings[id]} onOpen={(pageId) => onOpen(pageId, sub.trackId)} onFocus={focusOn} />)}
              </div>
            </div>
          ))}
        </section>
      ))}

      {focused !== null && visibleIds[focused] && (
        <FocusCard ids={visibleIds} index={focused} testMode={testMode} ratings={ratings}
          onMove={setFocused} onClose={closeFocus} onOpen={(id) => { setFocused(null); onOpen(id, trackOf[id]); }} />
      )}
    </section>
  );
}
