import React from 'react';
import { BlockMath } from 'react-katex';
import { ArrowRight, BookOpen, Bookmark, BookmarkCheck, Check, Copy, FlaskConical, Play, Printer, Search, X } from 'lucide-react';
import { conceptMap } from '../data/concepts.js';
import { exampleTasks } from '../data/exampleTasks.js';
import { mathLinks, mlUsesOf } from '../data/mathLinks.js';
import { quizzes } from '../data/quizzes.js';
import { reviewTree } from '../data/quickReview.js';
import { workedExampleMath } from '../data/workedExampleMath.js';
import { tracksContaining } from '../data/learningTracks.js';
import { FormulaDefinition } from './FormulaDefinition.jsx';

// Formula cheat sheet: every page's key formulas in one searchable, printable reference, grouped by
// the Quick Review categories. Each card shows the formulas (typeset), what the symbols mean, where the
// math is used in ML (or which math an ML page uses), and a "derivation inspector" with the page's
// worked example and a self-test question. Pins are kept per browser.

const CODES = {
  foundations: 'FND', 'linear-algebra': 'LA', 'analytic-geometry': 'GEO', 'eigenvalues-and-matrix-decompositions': 'EIG',
  calculus: 'CALC', 'probability-and-statistics': 'PROB', 'the-learning-problem': 'LRN', classification: 'CLS',
  'losses-and-optimization': 'OPT', 'regression-and-generalization': 'REG', 'support-vector-machines-and-kernels': 'SVM', 'data-and-production': 'DATA',
};
const codeFor = (category) => CODES[category.id] ?? category.title.split(/\s+/).map((word) => word[0]).join('').toUpperCase();

// Cards in reading order within each category.
const categories = reviewTree.map((category) => {
  const ids = [...new Set(category.subcategories.flatMap((sub) => sub.concepts))];
  return {
    id: category.id,
    title: category.title,
    subject: category.subject,
    code: codeFor(category),
    cards: ids.map((id, index) => ({ id, code: `${codeFor(category)}-${String(index + 1).padStart(2, '0')}`, category: category.id, subject: category.subject })),
  };
});
const allCards = categories.flatMap((category) => category.cards);
const formulaCount = (cards) => cards.reduce((sum, card) => sum + conceptMap[card.id].formulas.length, 0);
const searchText = Object.fromEntries(allCards.map((card) => {
  const concept = conceptMap[card.id];
  return [card.id, [card.code, concept.title, concept.problem, ...concept.formulas.flatMap((formula) => [formula.tex, ...formula.definitions])].join(' ').toLowerCase()];
}));

const SYMBOLS = ['\\nabla', '\\partial', '\\Sigma', '\\Lambda', '\\lambda', '\\theta', '\\sigma(\\cdot)', '\\odot', '\\otimes', '\\mathbb{E}[\\cdot]', '\\operatorname{tr}', '\\lVert x\\rVert', '\\mathbb{R}^{n \\times d}', 'x^{(t)}', '\\hat{y}', '\\arg\\min'];

const PIN_KEY = 'mathml-study:cheatsheet-pins';
const MODE_KEY = 'mathml-study:cheatsheet-mode';
function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* not remembered */ }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function useToast() {
  const [message, setMessage] = React.useState('');
  const timer = React.useRef(null);
  const show = React.useCallback((text) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), 2000);
  }, []);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return [message, show];
}

function Bridges({ id, onOpen }) {
  const math = (mathLinks[id] ?? []).map((link) => link.id);
  const uses = mlUsesOf(id).map((use) => use.id);
  const tracks = tracksContaining(id);
  if (!math.length && !uses.length) return <span className={`cs-chip ${tracks.includes('ml') ? 'ml' : 'math'}`}>{tracks.includes('ml') ? 'ML track' : 'Math track'}</span>;
  const [label, list, cls] = uses.length ? ['Used in', uses, 'ml'] : ['Uses', math, 'math'];
  return (
    <span className="cs-bridges">
      <span className={`cs-chip ${uses.length ? 'math' : 'ml'}`}>{uses.length ? 'Math track' : 'ML track'}</span>
      <ArrowRight size={12} aria-hidden="true" />
      <span className="cs-bridge-list">{label}{' '}
        {list.slice(0, 2).map((target, index) => (
          <React.Fragment key={target}>{index > 0 && ', '}<button className={`cs-chip-link ${cls}`} onClick={() => onOpen(target)}>{conceptMap[target]?.title}</button></React.Fragment>
        ))}
        {list.length > 2 && <span className="cs-more"> +{list.length - 2}</span>}
      </span>
    </span>
  );
}

function FormulaCard({ card, detailed, pinned, selected, onPin, onInspect, onOpen, onCopied }) {
  const concept = conceptMap[card.id];
  return (
    <article className={`cs-card${selected ? ' selected' : ''}`} id={`cs-${card.id}`}>
      <header className="cs-card-head">
        <div className="cs-card-title">
          <span className={`cs-code ${card.subject === 'Mathematics' ? 'math' : 'ml'}`}>{card.code}</span>
          <h2><button className="cs-title-button" onClick={() => onInspect(card.id)}>{concept.title}</button></h2>
        </div>
        <div className="cs-card-tools">
          <Bridges id={card.id} onOpen={onOpen} />
          <button className={`cs-icon-button${pinned ? ' on' : ''}`} onClick={() => onPin(card.id)} aria-pressed={pinned} aria-label={pinned ? `Unpin ${concept.title}` : `Pin ${concept.title}`} title={pinned ? 'Unpin' : 'Pin'}>
            {pinned ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </header>
      <div className="cs-formulas">
        {concept.formulas.map((formula) => (
          <div className="cs-formula" key={formula.tex}>
            <div className="cs-formula-math"><BlockMath math={formula.tex} /></div>
            <button className="cs-copy" onClick={async () => onCopied(await copyText(formula.tex) ? 'LaTeX copied' : 'Copy failed: select the formula instead')} aria-label="Copy LaTeX"><Copy size={13} /> LaTeX</button>
            {detailed && formula.definitions.length > 0 && <ul className="cs-defs">{formula.definitions.map((definition) => <FormulaDefinition key={definition} definition={definition} />)}</ul>}
          </div>
        ))}
      </div>
      {detailed && (
        <div className="cs-card-foot">
          <p><span className="cs-label">What it solves</span> {concept.problem}</p>
          <div className="cs-foot-actions">
            <button className="cs-link" onClick={() => onInspect(card.id)}><FlaskConical size={14} /> Inspect derivation</button>
            <button className="cs-link" onClick={() => onOpen(card.id)}><BookOpen size={14} /> Open page</button>
          </div>
        </div>
      )}
    </article>
  );
}

function Inspector({ id, onOpen, onClose }) {
  const concept = conceptMap[id];
  const math = workedExampleMath[id] ?? [];
  const question = (quizzes[id] ?? [])[0];
  const [picked, setPicked] = React.useState(null);
  React.useEffect(() => setPicked(null), [id]);
  // A fixed shuffle per page, so the answer is not always first.
  const hash = (text) => [...text].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261);
  const options = question ? [question.answer, ...question.wrong].map((option) => [hash(id + option), option]).sort((a, b) => a[0] - b[0]).map(([, option]) => option) : [];
  return (
    <aside className="cs-inspector" aria-label="Derivation inspector">
      <header className="cs-inspector-head">
        <span className="cs-inspector-kicker"><FlaskConical size={15} /> Derivation inspector</span>
        <button className="cs-icon-button" onClick={onClose} aria-label="Close the inspector"><X size={16} /></button>
      </header>
      <div className="cs-inspector-title">
        <p className="cs-label">Worked example</p>
        <h3>{concept.title}</h3>
        {exampleTasks[id] && <p className="cs-task">{exampleTasks[id]}</p>}
      </div>
      <ol className="cs-steps">
        {concept.example.map((step, index) => (
          <li key={step}>
            <span className="cs-step-num">Step {String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
            {math[index] && <div className="cs-step-math"><BlockMath math={math[index]} /></div>}
          </li>
        ))}
      </ol>
      {question && (
        <div className="cs-selftest">
          <p className="cs-selftest-head"><span>Self-test</span></p>
          <p>{question.question}</p>
          <div className="cs-selftest-options">
            {options.map((option) => (
              <button key={option} className={`${picked && option === question.answer ? 'right' : ''}${picked === option && option !== question.answer ? ' wrong' : ''}`} onClick={() => setPicked(option)} disabled={Boolean(picked)}>
                <span>{option}</span>{picked && option === question.answer && <Check size={14} />}
              </button>
            ))}
          </div>
          {picked && <p className="cs-selftest-why" role="status">{question.why}</p>}
        </div>
      )}
      <div className="cs-inspector-actions">
        <a className="cs-btn" href={`#${id}?section=example&practice=1`}><Play size={14} /> Practise the example</a>
        <button className="cs-btn primary" onClick={() => onOpen(id)}><BookOpen size={14} /> Open page</button>
      </div>
    </aside>
  );
}

export function CheatSheet({ onOpen }) {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all'); // all | math | ml | pinned | <category id>
  const [pins, setPins] = React.useState(() => new Set(readJson(PIN_KEY, [])));
  const [detailed, setDetailed] = React.useState(() => readJson(MODE_KEY, 'detailed') !== 'compact');
  const [inspected, setInspected] = React.useState(null);
  const [toast, showToast] = useToast();
  const searchRef = React.useRef(null);

  React.useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape' && inspected) setInspected(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inspected]);

  function togglePin(id) {
    setPins((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeJson(PIN_KEY, [...next]);
      return next;
    });
  }
  function setMode(isDetailed) {
    setDetailed(isDetailed);
    writeJson(MODE_KEY, isDetailed ? 'detailed' : 'compact');
  }
  function inspect(id) {
    setInspected(id);
    if (window.matchMedia?.('(max-width: 1180px)').matches) setTimeout(() => document.querySelector('.cs-inspector')?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 30);
  }

  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const inFilter = (card) => filter === 'all' || (filter === 'math' ? card.subject === 'Mathematics' : filter === 'ml' ? card.subject === 'Machine Learning' : filter === 'pinned' ? pins.has(card.id) : card.category === filter);
  const shown = allCards.filter((card) => inFilter(card) && words.every((word) => searchText[card.id].includes(word)));
  const groups = categories.map((category) => ({ ...category, cards: shown.filter((card) => card.category === category.id) })).filter((category) => category.cards.length);
  const pills = [['all', 'All', allCards], ['math', 'Math', allCards.filter((card) => card.subject === 'Mathematics')], ['ml', 'ML', allCards.filter((card) => card.subject === 'Machine Learning')]];

  return (
    <div className="cheatsheet">
      <section className="cs-header">
        <div className="cs-header-top">
          <div>
            <p className="cs-meta"><span className="cs-accent">Formula reference</span><span>//</span><span>{allCards.length} pages</span><span className="cs-chip math">KaTeX</span></p>
            <h1>Formula Cheat Sheet <span className="cs-count">{formulaCount(allCards)} formulas</span></h1>
          </div>
          <div className="cs-header-actions">
            <div className="cs-segment" role="group" aria-label="Detail level">
              <button className={!detailed ? 'active' : ''} aria-pressed={!detailed} onClick={() => setMode(false)}>Compact</button>
              <button className={detailed ? 'active' : ''} aria-pressed={detailed} onClick={() => setMode(true)}>Detailed</button>
            </div>
            <button className={`cs-btn${filter === 'pinned' ? ' on' : ''}`} onClick={() => setFilter(filter === 'pinned' ? 'all' : 'pinned')} aria-pressed={filter === 'pinned'}><Bookmark size={14} /> Pinned ({pins.size})</button>
            <button className="cs-btn primary" onClick={() => window.print()}><Printer size={14} /> Print / save as PDF</button>
          </div>
        </div>
        <div className="cs-filter-bar">
          <label className="cs-search">
            <Search size={16} aria-hidden="true" />
            <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter by name, symbol or LaTeX: eigen, \nabla, hinge, SVD..." aria-label="Filter formulas" />
          </label>
          <div className="cs-pills" role="group" aria-label="Show">
            {pills.map(([key, label, cards]) => (
              <button key={key} className={filter === key ? 'active' : ''} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label} ({cards.length})</button>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-tiles" aria-label="Categories">
        {categories.map((category) => {
          const first = conceptMap[category.cards[0].id].formulas[0];
          const active = filter === category.id;
          return (
            <button key={category.id} className={`cs-tile ${category.subject === 'Mathematics' ? 'math' : 'ml'}${active ? ' active' : ''}`} aria-pressed={active} onClick={() => setFilter(active ? 'all' : category.id)}>
              <span className="cs-tile-top"><span className="cs-tile-kicker">{category.subject === 'Mathematics' ? 'Math' : 'ML'} · {category.code}</span><span className="cs-tile-count">{formulaCount(category.cards)}</span></span>
              <span className="cs-tile-title">{category.title}</span>
              <span className="cs-tile-sub">{category.cards.length} pages · {category.cards.slice(0, 3).map((card) => conceptMap[card.id].title.split(/[:(,]/)[0]).join(', ')}{category.cards.length > 3 ? '…' : ''}</span>
              <span className="cs-tile-tex">{first.tex.length > 46 ? `${first.tex.slice(0, 45)}…` : first.tex}</span>
            </button>
          );
        })}
      </section>

      <div className={`cs-workbench${inspected ? ' with-inspector' : ''}`}>
        <div className="cs-main">
          <p className="cs-showing"><span className="cs-dot" aria-hidden="true" /> Showing {shown.length} of {allCards.length} pages · {formulaCount(shown)} formulas{filter !== 'all' && <button className="cs-clear" onClick={() => setFilter('all')}>show all</button>}</p>
          {groups.length === 0 && <p className="cs-empty">{filter === 'pinned' && !pins.size ? 'Nothing pinned yet: use the bookmark on a card to keep it here.' : 'No formula matches. Try a shorter word or another category.'}</p>}
          {groups.map((category) => (
            <section key={category.id} className="cs-group" aria-label={category.title}>
              <h2 className="cs-group-title"><span className={`cs-code ${category.subject === 'Mathematics' ? 'math' : 'ml'}`}>{category.code}</span> {category.title}</h2>
              {category.cards.map((card) => (
                <FormulaCard key={card.id} card={card} detailed={detailed} pinned={pins.has(card.id)} selected={inspected === card.id} onPin={togglePin} onInspect={inspect} onOpen={onOpen} onCopied={showToast} />
              ))}
            </section>
          ))}
        </div>
        {inspected && <Inspector id={inspected} onOpen={onOpen} onClose={() => setInspected(null)} />}
      </div>

      <section className="cs-tray" aria-label="Quick LaTeX symbols">
        <span className="cs-tray-label">Quick LaTeX</span>
        <div className="cs-tray-symbols">
          {SYMBOLS.map((symbol) => (
            <button key={symbol} onClick={async () => showToast(await copyText(symbol) ? `Copied ${symbol}` : 'Copy failed')} title={`Copy ${symbol}`}>{symbol}</button>
          ))}
        </div>
        <span className="cs-toast" role="status" aria-live="polite">{toast && <><Check size={14} /> {toast}</>}</span>
      </section>
    </div>
  );
}
