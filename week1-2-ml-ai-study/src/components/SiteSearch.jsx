import React from 'react';
import { Search } from 'lucide-react';
import { concepts, topics } from '../data/concepts.js';
import { homework } from '../data/homework.js';
import { tracks } from '../data/learningTracks.js';
import { intuitionDetails } from '../data/intuitionDetails.js';
import { bonusExamples } from '../data/bonusExamples.js';
import { sectionForKey } from './BonusExamples.jsx';

// Search box in the top bar: type part of a topic ("eigen", "svd", "hinge loss") and jump to the
// page. Titles count most, then short descriptions, then the page's words (key ideas, formula
// symbols, example text). Every word typed must appear somewhere in an entry.
const normalize = (text) => String(text).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const entries = [
  ...concepts.map((concept) => ({
    kind: 'page',
    id: concept.id,
    title: concept.title,
    context: `${concept.group} page · ${concept.week}`,
    blurb: concept.problem,
    title_: normalize(concept.title),
    summary_: normalize(`${concept.problem} ${concept.intuition}`),
    body_: normalize([
      ...(intuitionDetails[concept.id]?.keyIdeas ?? []).map((idea) => `${idea.label} ${idea.text}`),
      ...concept.formulas.flatMap((formula) => formula.definitions),
      ...concept.example,
      concept.misconception ?? '',
    ].join(' ')),
  })),
  ...topics.map((topic) => ({
    kind: 'topic',
    id: topic.id,
    title: topic.title,
    context: `Topic overview · ${topic.children.length} pages`,
    blurb: topic.summary,
    title_: normalize(topic.title),
    summary_: normalize(`${topic.summary} ${topic.overview}`),
    body_: '',
  })),
  ...Object.entries(homework).map(([key, set]) => ({
    kind: 'homework',
    id: key,
    title: `Homework: ${set.section}`,
    context: `${tracks[set.track].title} · ${set.problems.length} problems`,
    blurb: set.intro,
    title_: normalize(`homework practice exercises ${set.section}`),
    summary_: normalize(`${set.intro} ${set.problems.map((problem) => problem.title).join(' ')}`),
    body_: '',
  })),
  ...Object.entries(bonusExamples).map(([key, list]) => ({
    kind: 'bonus',
    id: key,
    title: `Bonus examples: ${sectionForKey(key)?.section.title ?? key}`,
    context: `${list.length} extra worked examples from the book`,
    blurb: list.map((example) => example.title).join(' · '),
    title_: normalize(`bonus examples extra practice ${sectionForKey(key)?.section.title ?? ''}`),
    summary_: normalize(list.map((example) => `${example.title} ${example.task}`).join(' ')),
    body_: normalize(list.map((example) => `${example.source.label} ${example.source.title} ${example.steps.join(' ')}`).join(' ')),
  })),
];

function score(entry, words, phrase) {
  let total = 0;
  for (const word of words) {
    const inTitle = entry.title_.split(' ').some((token) => token.startsWith(word));
    if (inTitle) total += 10;
    else if (entry.title_.includes(word)) total += 6;
    else if (entry.summary_.includes(word)) total += 3;
    else if (entry.body_.includes(word)) total += 1;
    else return 0; // every word must match somewhere
  }
  if (entry.title_.startsWith(phrase)) total += 8;
  else if (entry.title_.includes(phrase)) total += 4;
  if (entry.kind === 'page') total += 0.5; // pages before topics and homework on ties
  return total;
}

export function searchSite(query, limit = 8) {
  const phrase = normalize(query);
  if (!phrase) return [];
  const words = phrase.split(' ');
  return entries
    .map((entry) => ({ entry, value: score(entry, words, phrase) }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value || a.entry.title.length - b.entry.title.length)
    .slice(0, limit)
    .map((item) => item.entry);
}

export function SiteSearch({ onOpenPage, onOpenTopic, onOpenHomework }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const input = React.useRef(null);
  const box = React.useRef(null);
  const results = React.useMemo(() => searchSite(query), [query]);

  // "/" focuses the search from anywhere, unless the student is typing in another field.
  React.useEffect(() => {
    function onKey(event) {
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.current?.focus();
        input.current?.select();
      } else if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        input.current?.focus();
      }
    }
    function onClick(event) {
      if (box.current && !box.current.contains(event.target)) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  function choose(entry) {
    setQuery('');
    setOpen(false);
    input.current?.blur();
    if (entry.kind === 'page') onOpenPage(entry.id);
    else if (entry.kind === 'topic') onOpenTopic(entry.id);
    else if (entry.kind === 'bonus') window.location.hash = `bonus=${entry.id}`;
    else onOpenHomework(entry.id);
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActive((index) => Math.min(index + 1, results.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(index - 1, 0)); }
    else if (event.key === 'Enter' && results[active]) { event.preventDefault(); choose(results[active]); }
    else if (event.key === 'Escape') { setOpen(false); input.current?.blur(); }
  }

  const showList = open && query.trim() !== '';
  return (
    <div className="site-search" ref={box} role="search">
      <Search size={16} className="site-search-icon" aria-hidden="true" />
      <input
        ref={input}
        type="search"
        value={query}
        placeholder="Search topics  ( / or Ctrl K )"
        aria-label="Search topics, pages and homework"
        aria-expanded={showList}
        aria-controls="site-search-results"
        aria-activedescendant={showList && results[active] ? `search-result-${active}` : undefined}
        role="combobox"
        aria-autocomplete="list"
        onChange={(event) => { setQuery(event.target.value); setActive(0); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul className="site-search-results" id="site-search-results" role="listbox">
          {results.length === 0 && <li className="site-search-empty">No page matches "{query.trim()}". Try a shorter word, such as "eigen" or "loss".</li>}
          {results.map((entry, index) => (
            <li
              key={`${entry.kind}:${entry.id}`}
              id={`search-result-${index}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? 'active' : ''}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => { event.preventDefault(); choose(entry); }}
            >
              <span className="site-search-title">{entry.title}</span>
              <span className="site-search-context">{entry.context}</span>
              <span className="site-search-blurb">{entry.blurb}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
