import React from 'react';
import { ArrowRight, BookOpen, Brain, Check, ChevronDown, ClipboardList, Columns2, Flame, Grid3x3, Play, RotateCcw, Search, Sigma, Sparkles, Waypoints } from 'lucide-react';
import { bonusExamples } from '../data/bonusExamples.js';
import { conceptMap } from '../data/concepts.js';
import { homework } from '../data/homework.js';
import { mathLinks, mlUsesOf } from '../data/mathLinks.js';
import { quizzes } from '../data/quizzes.js';
import { sectionKey, trackIds, trackOrder, tracks, tracksContaining } from '../data/learningTracks.js';
import { bumpActivity, lastDays, streakOf, useActivity } from '../activity.js';
import { setSummary, useHomeworkProgress } from '../homeworkProgress.js';
import { useProgress } from '../progress.js';
import { useQuizScores } from '../quizScores.js';
import { useReviewRatings } from '../reviewProgress.js';

// The landing dashboard. Everything on it is computed from the student's own progress (pages ticked
// done, quiz scores, homework, quick-review ratings, and the activity log); nothing is invented.
// Layout: resume strip, four summary cards, three views of the curriculum (both tracks side by side,
// the math behind each ML section, a page-by-page matrix), and one practice question.

const TRACK_META = {
  math: { code: 'MATH', symbol: 'Σ', accent: 'math', Icon: Sigma, label: 'Math Foundations' },
  ml: { code: 'ML', symbol: 'λ', accent: 'ml', Icon: Brain, label: 'Machine Learning' },
};
const pad2 = (n) => String(n).padStart(2, '0');
const sectionCode = (trackId, index) => `${TRACK_META[trackId].code}-${pad2(index + 1)}`;
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);

// Where each page sits: track -> section index.
const sectionIndexOf = Object.fromEntries(trackIds.map((trackId) => [trackId, Object.fromEntries(tracks[trackId].sections.flatMap((section, index) => section.concepts.map((id) => [id, index])))]));

// The page to continue with: the last page opened if it is not done yet, else the next page not done
// in that track, else the first page not done anywhere.
function resumeTarget(activity, isDone) {
  const last = activity.last && conceptMap[activity.last.id] ? activity.last : null;
  const lastTrack = last ? (last.track && tracks[last.track] ? last.track : tracksContaining(last.id)[0]) : null;
  const order = (trackId) => trackOrder(trackId);
  if (last && lastTrack) {
    if (!isDone(last.id)) return { id: last.id, trackId: lastTrack, resumed: true };
    const list = order(lastTrack);
    const from = list.indexOf(last.id);
    const after = [...list.slice(from + 1), ...list.slice(0, from)].find((id) => !isDone(id));
    if (after) return { id: after, trackId: lastTrack, resumed: false };
  }
  for (const trackId of trackIds) {
    const next = order(trackId).find((id) => !isDone(id));
    if (next) return { id: next, trackId, resumed: false };
  }
  return null;
}

function sectionStatus(section, isDone, targetId, previousComplete) {
  const done = section.concepts.filter(isDone).length;
  if (done === section.concepts.length) return 'complete';
  if (done > 0 || section.concepts.includes(targetId)) return 'active';
  return previousComplete ? 'next' : 'upcoming';
}
const STATUS_LABEL = { complete: 'Done', active: 'In progress', next: 'Up next', upcoming: 'Not started' };

function Ring({ value, total, accent, label }) {
  const share = total ? value / total : 0;
  return (
    <svg className={`dash-ring ${accent}`} viewBox="0 0 36 36" role="img" aria-label={label}>
      <circle className="dash-ring-track" cx="18" cy="18" r="15.9155" />
      <circle className="dash-ring-fill" cx="18" cy="18" r="15.9155" strokeDasharray={`${(100 * share).toFixed(1)} 100`} />
      <text x="18" y="21.5" textAnchor="middle">{value}</text>
    </svg>
  );
}

// ---------- Header pills (shown in the top bar on every page) ----------
export function HeaderStats() {
  const { isDone } = useProgress();
  const activity = useActivity();
  const all = [...new Set(trackIds.flatMap(trackOrder))];
  const done = all.filter(isDone).length;
  const streak = streakOf(activity);
  return (
    <div className="header-stats" aria-label="Your progress">
      {streak > 0 && <span className="header-pill streak" title="Days in a row with study activity"><Flame size={14} aria-hidden="true" /> {streak} day{streak === 1 ? '' : 's'}</span>}
      <span className="header-pill progress" title={`${done} of ${all.length} pages done`}>
        <span className="header-pill-text"><span className="header-pill-label">Progress</span> {pct(done, all.length)}% <span className="header-pill-count">({done}/{all.length})</span></span>
        <span className="header-meter" aria-hidden="true"><span style={{ width: `${pct(done, all.length)}%` }} /></span>
      </span>
    </div>
  );
}

// ---------- Resume strip ----------
function ResumeStrip({ target, isDone, reviewAgain, onOpen, onShowReview }) {
  if (!target) {
    return (
      <section className="dash-resume" aria-label="Continue studying">
        <div className="dash-resume-main">
          <span className="dash-resume-icon"><Check size={22} /></span>
          <div><p className="dash-kicker">All pages done</p><h1>Every page in both tracks is ticked off.</h1><p className="dash-resume-sub">Use Quick Review to keep it fresh.</p></div>
        </div>
        <button className="dash-btn primary" onClick={onShowReview}>Quick Review <ArrowRight size={16} /></button>
      </section>
    );
  }
  const { id, trackId } = target;
  const concept = conceptMap[id];
  const sectionIndex = sectionIndexOf[trackId][id];
  const section = tracks[trackId].sections[sectionIndex];
  const sectionDone = section.concepts.filter(isDone).length;
  const order = trackOrder(trackId);
  const bridges = trackId === 'ml' ? (mathLinks[id] ?? []).map((link) => ({ id: link.id, title: conceptMap[link.id]?.title })) : mlUsesOf(id).map((use) => ({ id: use.mlId ?? use.id, title: conceptMap[use.mlId ?? use.id]?.title })).filter((item) => item.title);
  const share = pct(sectionDone, section.concepts.length);
  return (
    <section className="dash-resume" aria-label="Continue studying">
      <div className="dash-resume-glow" aria-hidden="true" />
      <div className="dash-resume-main">
        <span className={`dash-resume-icon ${TRACK_META[trackId].accent}`}><BookOpen size={22} /><span className="dash-live-dot" aria-hidden="true" /></span>
        <div className="dash-resume-text">
          <p className="dash-meta-row">
            <span className={`dash-chip ${TRACK_META[trackId].accent}`}>{tracks[trackId].title}</span>
            <span className="dash-mono">{sectionCode(trackId, sectionIndex)} · step {order.indexOf(id) + 1} of {order.length}</span>
            <span className="dash-mono subtle">{section.concepts.length - sectionDone} page{section.concepts.length - sectionDone === 1 ? '' : 's'} left in this section</span>
          </p>
          <h1><span className="dash-h1-lead">{target.resumed ? 'Continue' : 'Next up'}:</span> {concept.title}</h1>
          <p className="dash-resume-sub">{section.title}{bridges.length > 0 && <> · {trackId === 'ml' ? 'uses' : 'used in'} {bridges.slice(0, 3).map((item, index) => (
            <React.Fragment key={item.id}>{index > 0 && ', '}<button className={`dash-inline ${isDone(item.id) ? 'done' : ''}`} onClick={() => onOpen(item.id)}>{item.title}</button></React.Fragment>
          ))}</>}</p>
        </div>
      </div>
      <div className="dash-resume-side">
        <div className="dash-mini-progress">
          <div className="dash-mini-progress-row"><span>Section progress</span><strong>{share}%</strong></div>
          <div className="dash-bar"><span style={{ width: `${share}%` }} /></div>
        </div>
        <div className="dash-resume-actions">
          <button className="dash-btn" onClick={onShowReview}><RotateCcw size={15} /> {reviewAgain ? `Review (${reviewAgain} to revisit)` : 'Quick Review'}</button>
          <button className="dash-btn primary" onClick={() => onOpen(id, trackId)}>{target.resumed ? 'Resume' : 'Start'} <Play size={15} /></button>
        </div>
      </div>
    </section>
  );
}

// ---------- Summary cards ----------
function TrackCard({ trackId, isDone, onOpen }) {
  const order = trackOrder(trackId);
  const done = order.filter(isDone).length;
  const next = order.find((id) => !isDone(id));
  const { Icon, accent } = TRACK_META[trackId];
  return (
    <article className="dash-card">
      <header className="dash-card-head">
        <div><p className="dash-kicker">{tracks[trackId].sections.length} sections</p><h3>{tracks[trackId].title}</h3></div>
        <span className={`dash-card-icon ${accent}`}><Icon size={17} /></span>
      </header>
      <div className="dash-card-body">
        <div>
          <p className="dash-big"><span className={accent}>{pct(done, order.length)}%</span> <span className="dash-mono subtle">{done}/{order.length} pages</span></p>
          {next ? <button className={`dash-card-link ${accent}`} onClick={() => onOpen(next, trackId)}>Next: {conceptMap[next].title}</button> : <p className={`dash-card-note ${accent}`}><Check size={13} /> Track complete</p>}
        </div>
        <Ring value={done} total={order.length} accent={accent} label={`${done} of ${order.length} pages done`} />
      </div>
    </article>
  );
}

function BridgeCard({ isDone, onOpen }) {
  const mlOrder = trackOrder('ml');
  const linked = mlOrder.filter((id) => (mathLinks[id] ?? []).length > 0);
  const ready = linked.filter((id) => mathLinks[id].every((link) => isDone(link.id)));
  const startable = linked.filter((id) => !isDone(id) && mathLinks[id].every((link) => isDone(link.id)));
  return (
    <article className="dash-card">
      <header className="dash-card-head">
        <div><p className="dash-kicker">Math behind the ML</p><h3>Cross-track bridges</h3></div>
        <span className="dash-card-icon bridge"><Waypoints size={17} /></span>
      </header>
      <div className="dash-card-body">
        <div>
          <p className="dash-big"><span className="bridge">{ready.length}</span> <span className="dash-mono subtle">/ {linked.length} ML pages with their math done</span></p>
          {startable.length > 0
            ? <button className="dash-card-link bridge" onClick={() => onOpen(startable[0], 'ml')}>{startable.length} ready to start · {conceptMap[startable[0]].title}</button>
            : <p className="dash-card-note subtle">Finish math pages to unlock more bridges</p>}
        </div>
        <div className="dash-bridge-dots" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className={i < Math.round((3 * ready.length) / Math.max(linked.length, 1)) ? 'on' : ''} />)}</div>
      </div>
    </article>
  );
}

function ConsistencyCard({ activity }) {
  const scores = useQuizScores();
  useHomeworkProgress();
  const streak = streakOf(activity);
  const days = lastDays(activity, 7);
  const peak = Math.max(1, ...days.map((day) => day.total));
  let best = 0;
  let total = 0;
  for (const id of Object.keys(quizzes)) {
    const saved = scores(id);
    if (saved) { best += saved.best; total += saved.total; }
  }
  const solved = Object.entries(homework).reduce((sum, [key, set]) => sum + setSummary(key, set).solved, 0);
  return (
    <article className="dash-card">
      <header className="dash-card-head">
        <div><p className="dash-kicker">Consistency</p><h3>Study streak</h3></div>
        <span className="dash-card-icon streak"><Flame size={17} /></span>
      </header>
      <div className="dash-card-body">
        <div>
          <p className="dash-big"><span>{streak}</span> <span className="dash-streak-unit">day{streak === 1 ? '' : 's'}</span></p>
          <p className="dash-mono subtle">{total ? `quizzes ${pct(best, total)}% correct` : 'no quizzes yet'} · {solved} homework part{solved === 1 ? '' : 's'} solved</p>
        </div>
        <div className="dash-spark" role="img" aria-label={`Activity over the last 7 days: ${days.map((day) => day.total).join(', ')}`}>
          {days.map((day, index) => <span key={day.key} className={index === days.length - 1 ? 'today' : ''} style={{ height: `${day.total ? 18 + (82 * day.total) / peak : 8}%` }} title={`${day.key}: ${day.total}`} data-empty={day.total ? undefined : ''} />)}
        </div>
      </div>
    </article>
  );
}

// ---------- View 1: both tracks side by side ----------
function PageRow({ id, trackId, isDone, toggleDone, isTarget, onOpen }) {
  const scores = useQuizScores();
  const saved = scores(id);
  return (
    <li className={`dash-page${isDone(id) ? ' done' : ''}${isTarget ? ' current' : ''}`}>
      <input type="checkbox" checked={isDone(id)} onChange={() => toggleDone(id)} aria-label={`Mark ${conceptMap[id].title} as done`} />
      <button className="dash-page-title" onClick={() => onOpen(id, trackId)}>{conceptMap[id].title}</button>
      <span className="dash-page-meta">
        {isTarget && <span className="dash-chip bridge">Current</span>}
        {saved && <span className={`dash-mono ${saved.best === saved.total ? 'good' : 'subtle'}`}>quiz {saved.best}/{saved.total}</span>}
      </span>
    </li>
  );
}

function TrackColumn({ trackId, isDone, toggleDone, target, onOpen, onOpenHomework }) {
  useHomeworkProgress();
  const { accent, symbol } = TRACK_META[trackId];
  const order = trackOrder(trackId);
  const done = order.filter(isDone).length;
  const [filter, setFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');
  // Open the section holding the current page (in either track), or the first section not yet done.
  const targetSection = (target && sectionIndexOf[trackId][target.id]) ?? tracks[trackId].sections.findIndex((section) => !section.concepts.every(isDone));
  const [open, setOpen] = React.useState(() => new Set(targetSection === undefined ? [] : [targetSection]));
  const rows = tracks[trackId].sections.map((section, index, all) => {
    const previousComplete = index === 0 || all[index - 1].concepts.every(isDone);
    return { section, index, status: sectionStatus(section, isDone, target?.id, previousComplete) };
  });
  const counts = { all: rows.length, active: rows.filter((row) => row.status === 'active').length, complete: rows.filter((row) => row.status === 'complete').length, todo: rows.filter((row) => row.status === 'next' || row.status === 'upcoming').length };
  const words = query.trim().toLowerCase();
  const shown = rows.filter((row) => (filter === 'all' || (filter === 'todo' ? ['next', 'upcoming'].includes(row.status) : row.status === filter))
    && (!words || row.section.title.toLowerCase().includes(words) || row.section.concepts.some((id) => conceptMap[id].title.toLowerCase().includes(words))));
  const toggle = (index) => setOpen((current) => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    return next;
  });
  return (
    <section className={`dash-track ${accent}`} aria-label={tracks[trackId].title}>
      <header className="dash-track-head">
        <span className={`dash-track-symbol ${accent}`} aria-hidden="true">{symbol}</span>
        <div className="dash-track-title">
          <h3>{tracks[trackId].title} <span className={`dash-chip ${accent}`}>{rows.length} sections</span></h3>
          <p className="dash-mono subtle">{order.length} pages</p>
        </div>
        <span className={`dash-track-count ${accent}`}>{done} / {order.length} done</span>
      </header>
      <div className="dash-filter-row">
        <label className="dash-filter">
          <Search size={14} aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Filter ${TRACK_META[trackId].code === 'ML' ? 'ML' : 'math'} pages...`} aria-label={`Filter ${tracks[trackId].title} pages`} />
        </label>
        <div className="dash-filter-chips" role="group" aria-label="Show sections">
          {[['all', 'All'], ['active', 'In progress'], ['complete', 'Done'], ['todo', 'To do']].map(([key, label]) => (
            <button key={key} className={filter === key ? `active ${accent}` : ''} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label} ({counts[key]})</button>
          ))}
        </div>
      </div>
      <ol className="dash-sections">
        {shown.length === 0 && <li className="dash-empty">No section matches.</li>}
        {shown.map(({ section, index, status }) => {
          const key = sectionKey(trackId, section);
          const sectionDone = section.concepts.filter(isDone).length;
          const expanded = open.has(index) || Boolean(words);
          const hw = homework[key];
          const hwSummary = hw ? setSummary(key, hw) : null;
          const pages = words ? section.concepts.filter((id) => conceptMap[id].title.toLowerCase().includes(words) || section.title.toLowerCase().includes(words)) : section.concepts;
          return (
            <li key={section.title} className={`dash-section ${status}${expanded ? ' open' : ''}`}>
              <button className="dash-section-head" aria-expanded={expanded} onClick={() => toggle(index)}>
                <span className={`dash-section-num ${status}`} aria-hidden="true">{status === 'complete' ? <Check size={14} /> : index + 1}</span>
                <span className="dash-section-text">
                  <span className="dash-meta-row">
                    <span className="dash-mono">{sectionCode(trackId, index)}</span>
                    <span className={`dash-status ${status}`}>{STATUS_LABEL[status]}</span>
                  </span>
                  <span className="dash-section-title">{section.title}</span>
                </span>
                <span className="dash-section-count">{sectionDone}/{section.concepts.length}</span>
                <ChevronDown size={17} className="dash-chevron" aria-hidden="true" />
              </button>
              <div className="dash-section-bar" aria-hidden="true"><span style={{ width: `${pct(sectionDone, section.concepts.length)}%` }} /></div>
              {expanded && (
                <div className="dash-section-body">
                  <ul className="dash-pages">
                    {pages.map((id) => <PageRow key={id} id={id} trackId={trackId} isDone={isDone} toggleDone={toggleDone} isTarget={target?.id === id} onOpen={onOpen} />)}
                  </ul>
                  <div className="dash-section-extras">
                    {hw && <button className="dash-extra" onClick={() => onOpenHomework(key)}><ClipboardList size={14} /> Homework · {hwSummary.solved}/{hwSummary.total} parts</button>}
                    {bonusExamples[key] && <a className="dash-extra" href={`#bonus=${key}`}><Sparkles size={14} /> {bonusExamples[key].length} bonus examples</a>}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ---------- View 2: which math sections each ML section builds on ----------
const bridgeEdges = (() => {
  const edges = new Map();
  trackOrder('ml').forEach((mlId) => {
    const mlSection = sectionIndexOf.ml[mlId];
    for (const link of mathLinks[mlId] ?? []) {
      const mathSection = sectionIndexOf.math[link.id];
      if (mathSection === undefined) continue;
      const key = `${mathSection}|${mlSection}`;
      if (!edges.has(key)) edges.set(key, { mathSection, mlSection, pairs: [] });
      edges.get(key).pairs.push({ mlId, mathId: link.id, why: link.why });
    }
  });
  return [...edges.values()];
})();

function BridgeMap({ isDone, onOpen }) {
  const math = tracks.math.sections;
  const ml = tracks.ml.sections;
  const [selected, setSelected] = React.useState({ side: 'ml', index: ml.findIndex((section) => !section.concepts.every(isDone)) });
  const rowH = 46;
  const height = Math.max(math.length, ml.length) * rowH + 16;
  const width = 900;
  const nodeW = 300;
  const y = (index, count) => 8 + index * rowH + ((Math.max(math.length, ml.length) - count) * rowH) / 2;
  const isSelectedEdge = (edge) => (selected.side === 'ml' ? edge.mlSection === selected.index : edge.mathSection === selected.index);
  const edgeState = (edge) => (edge.pairs.every((pair) => isDone(pair.mathId)) ? 'synced' : edge.pairs.some((pair) => isDone(pair.mathId)) ? 'partial' : 'open');
  const node = (side, section, index, count) => {
    const sectionDone = section.concepts.filter(isDone).length;
    const state = sectionDone === section.concepts.length ? 'complete' : sectionDone ? 'active' : 'upcoming';
    const x = side === 'math' ? 0 : width - nodeW;
    const top = y(index, count);
    const isSel = selected.side === side && selected.index === index;
    const title = section.title.length > 34 ? `${section.title.slice(0, 33)}…` : section.title;
    return (
      <g key={`${side}${index}`} className={`bridge-node ${side} ${state}${isSel ? ' selected' : ''}`} transform={`translate(${x}, ${top})`} role="button" tabIndex={0} aria-pressed={isSel}
        aria-label={`${sectionCode(side, index)} ${section.title}: ${sectionDone} of ${section.concepts.length} pages done`}
        onClick={() => setSelected({ side, index })} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected({ side, index }); } }}>
        <rect width={nodeW} height={rowH - 10} rx="7" />
        <rect className="bridge-node-accent" width="3" height={rowH - 10} rx="1.5" />
        <text className="bridge-node-code" x="14" y="15">{sectionCode(side, index)}</text>
        <text className="bridge-node-title" x="14" y="30">{title}</text>
        <text className="bridge-node-count" x={nodeW - 12} y="23" textAnchor="end">{sectionDone}/{section.concepts.length}</text>
      </g>
    );
  };
  const selectedEdges = bridgeEdges.filter(isSelectedEdge);
  const selSection = selected.index >= 0 ? (selected.side === 'ml' ? ml : math)[selected.index] : null;
  return (
    <section className="dash-panel" aria-label="Cross-track bridge map">
      <header className="dash-panel-head">
        <div><p className="dash-meta-row"><span className="dash-chip bridge">Bridge map</span><span className="dash-mono subtle">from the "math behind this page" links</span></p><h2>Which math each ML section builds on</h2></div>
        <div className="dash-legend">
          <span><i className="lg synced" /> math done</span><span><i className="lg partial" /> partly done</span><span><i className="lg open" /> not started</span>
        </div>
      </header>
      <div className="bridge-canvas">
        <svg viewBox={`0 0 ${width} ${height}`} className="bridge-svg" role="group" aria-label="Math sections on the left, ML sections on the right; lines show which math each ML section uses">
          {bridgeEdges.map((edge) => {
            const y1 = y(edge.mathSection, math.length) + (rowH - 10) / 2;
            const y2 = y(edge.mlSection, ml.length) + (rowH - 10) / 2;
            const x1 = nodeW;
            const x2 = width - nodeW;
            const mid = (x1 + x2) / 2;
            return <path key={`${edge.mathSection}-${edge.mlSection}`} className={`bridge-edge ${edgeState(edge)}${isSelectedEdge(edge) ? ' selected' : selected.index >= 0 ? ' dim' : ''}`} d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`} strokeWidth={1 + Math.min(edge.pairs.length, 4) * 0.6} />;
          })}
          {math.map((section, index) => node('math', section, index, math.length))}
          {ml.map((section, index) => node('ml', section, index, ml.length))}
        </svg>
      </div>
      {selSection && (
        <div className="bridge-detail">
          <h3><span className="dash-mono">{sectionCode(selected.side, selected.index)}</span> {selSection.title}</h3>
          {selectedEdges.length === 0 ? <p className="dash-mono subtle">No math links recorded for this section.</p> : (
            <ul>
              {selectedEdges.flatMap((edge) => edge.pairs).map((pair) => (
                <li key={`${pair.mlId}-${pair.mathId}`}>
                  <button className={`dash-inline ${isDone(pair.mlId) ? 'done' : ''}`} onClick={() => onOpen(pair.mlId, 'ml')}>{conceptMap[pair.mlId].title}</button>
                  <span className="bridge-arrow" aria-hidden="true">←</span>
                  <button className={`dash-inline math ${isDone(pair.mathId) ? 'done' : ''}`} onClick={() => onOpen(pair.mathId, 'math')}>{conceptMap[pair.mathId].title}</button>
                  {isDone(pair.mathId) ? <span className="dash-status complete">math done</span> : <span className="dash-status upcoming">math to do</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

// ---------- View 3: every page as a cell ----------
function SectionMatrix({ isDone, target, onOpen }) {
  const scores = useQuizScores();
  return (
    <section className="dash-panel" aria-label="Page matrix">
      <header className="dash-panel-head">
        <div><p className="dash-meta-row"><span className="dash-chip">Matrix</span><span className="dash-mono subtle">one square per page</span></p><h2>Every page at a glance</h2></div>
        <div className="dash-legend"><span><i className="lg cell-done" /> done</span><span><i className="lg cell-quiz" /> quiz taken</span><span><i className="lg cell-current" /> current</span><span><i className="lg cell-todo" /> to do</span></div>
      </header>
      <div className="matrix-grid">
        {trackIds.map((trackId) => (
          <div key={trackId} className={`matrix-track ${TRACK_META[trackId].accent}`}>
            <h3>{tracks[trackId].title}</h3>
            {tracks[trackId].sections.map((section, index) => (
              <div key={section.title} className="matrix-row">
                <span className="matrix-label"><span className="dash-mono">{sectionCode(trackId, index)}</span> {section.title}</span>
                <span className="matrix-cells">
                  {section.concepts.map((id) => {
                    const state = isDone(id) ? 'done' : target?.id === id ? 'current' : scores(id) ? 'quiz' : 'todo';
                    return <button key={id} className={`matrix-cell ${state}`} title={`${conceptMap[id].title} (${state === 'todo' ? 'to do' : state})`} aria-label={`${conceptMap[id].title}: ${state === 'todo' ? 'to do' : state}`} onClick={() => onOpen(id, trackId)} />;
                  })}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Practice question ----------
function shuffled(list, seed) {
  const out = [...list];
  let a = seed >>> 0;
  for (let i = out.length - 1; i > 0; i -= 1) {
    a = (a * 1664525 + 1013904223) >>> 0;
    const j = a % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function PracticeCard({ isDone, target, onOpen }) {
  const donePages = Object.keys(quizzes).filter((id) => conceptMap[id] && isDone(id));
  const pool = donePages.length ? donePages : (target ? tracks[target.trackId].sections[sectionIndexOf[target.trackId][target.id]].concepts.filter((id) => quizzes[id]) : []);
  const [seed, setSeed] = React.useState(() => Math.floor(Math.random() * 1e9));
  const [picked, setPicked] = React.useState(null);
  if (!pool.length) return null;
  const pageId = pool[seed % pool.length];
  const questions = quizzes[pageId];
  const question = questions[Math.floor(seed / pool.length) % questions.length];
  const options = shuffled([question.answer, ...question.wrong], seed);
  const answered = picked !== null;
  const correct = picked === question.answer;
  function choose(option) {
    if (answered) return;
    setPicked(option);
    bumpActivity('p');
  }
  return (
    <section className="dash-practice" aria-label="Practice question">
      <div className="dash-practice-head">
        <span className="dash-card-icon bridge"><Brain size={18} /></span>
        <div>
          <p className="dash-meta-row"><span className="dash-chip bridge">{donePages.length ? 'Retrieval practice' : 'Warm-up'}</span><span className="dash-mono subtle">from {conceptMap[pageId].title}</span></p>
          <h3>{question.question}</h3>
        </div>
      </div>
      <div className="dash-options" role="group" aria-label="Answer options">
        {options.map((option) => (
          <button key={option} className={`dash-option${answered && option === question.answer ? ' right' : ''}${answered && option === picked && !correct ? ' wrong' : ''}`} onClick={() => choose(option)} disabled={answered && option !== picked && option !== question.answer}>{option}</button>
        ))}
      </div>
      {answered && <p className={`dash-practice-why ${correct ? 'right' : 'wrong'}`} role="status"><strong>{correct ? 'Correct.' : 'Not quite.'}</strong> {question.why}</p>}
      <div className="dash-practice-actions">
        <button className="dash-btn" onClick={() => onOpen(pageId)}><BookOpen size={15} /> Open the page</button>
        <button className="dash-btn primary" onClick={() => { setSeed((value) => (value * 7919 + 104729) % 1e9); setPicked(null); }}>{answered ? 'Next question' : 'Skip'} <ArrowRight size={15} /></button>
      </div>
    </section>
  );
}

// ---------- The dashboard ----------
const VIEW_KEY = 'mathml-study:dashboard-view';
const VIEWS = [['dual', 'Both tracks', Columns2], ['bridges', 'Bridge map', Waypoints], ['matrix', 'Page matrix', Grid3x3]];

export function Dashboard({ onOpen, onOpenHomework, onShowReview }) {
  const { isDone, toggleDone } = useProgress();
  const activity = useActivity();
  const ratings = useReviewRatings();
  const target = resumeTarget(activity, isDone);
  const reviewAgain = Object.values(ratings).filter((value) => value === 'again').length;
  const [view, setView] = React.useState(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_KEY);
      return VIEWS.some(([key]) => key === saved) ? saved : 'dual';
    } catch {
      return 'dual';
    }
  });
  function pick(next) {
    setView(next);
    try { window.localStorage.setItem(VIEW_KEY, next); } catch { /* the choice just is not remembered */ }
  }
  return (
    <div className="dashboard">
      <ResumeStrip target={target} isDone={isDone} reviewAgain={reviewAgain} onOpen={onOpen} onShowReview={onShowReview} />
      <a className="dash-intro" href="hands-on.html">
        <span className="dash-intro-icon" aria-hidden="true"><Play size={18} /></span>
        <span className="dash-intro-text"><strong>New here, or want the big picture?</strong> Four hands-on demos in about 20 minutes: teach a machine, build an autocomplete, memorise vs learn, and whose data a model learns from.</span>
        <span className="dash-intro-go">Open the demos <ArrowRight size={15} /></span>
      </a>
      <section className="dash-kpis" aria-label="Summary">
        {trackIds.map((trackId) => <TrackCard key={trackId} trackId={trackId} isDone={isDone} onOpen={onOpen} />)}
        <BridgeCard isDone={isDone} onOpen={onOpen} />
        <ConsistencyCard activity={activity} />
      </section>
      <div className="dash-views">
        <div className="dash-view-tabs" role="tablist" aria-label="Curriculum views">
          {VIEWS.map(([key, label, Icon]) => (
            <button key={key} role="tab" aria-selected={view === key} className={view === key ? 'active' : ''} onClick={() => pick(key)}><Icon size={15} aria-hidden="true" /> {label}</button>
          ))}
        </div>
        <div className="dash-legend">
          <span><i className="lg math" /> Math</span><span><i className="lg ml" /> ML</span><span><i className="lg bridge" /> Bridges</span>
        </div>
      </div>
      {view === 'dual' && (
        <div className="dash-dual">
          {trackIds.map((trackId) => <TrackColumn key={trackId} trackId={trackId} isDone={isDone} toggleDone={toggleDone} target={target} onOpen={onOpen} onOpenHomework={onOpenHomework} />)}
        </div>
      )}
      {view === 'bridges' && <BridgeMap isDone={isDone} onOpen={onOpen} />}
      {view === 'matrix' && <SectionMatrix isDone={isDone} target={target} onOpen={onOpen} />}
      <PracticeCard isDone={isDone} target={target} onOpen={onOpen} />
    </div>
  );
}
