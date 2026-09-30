import React from 'react';
import { ArrowLeft, BookOpen, Library, Network, Sigma, Sparkles } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { ConceptGraph } from './components/ConceptGraph.jsx';
import { ConceptFigure } from './components/Figures.jsx';
import { Dashboard, HeaderStats } from './components/Dashboard.jsx';
import { CheatSheet } from './components/CheatSheet.jsx';
import { ImpactProjects } from './components/ImpactProjects.jsx';
import { QuickReview } from './components/QuickReview.jsx';
import { codeExamples } from './data/codeExamples.js';
import { conceptMap, entryFor, topicMap, topicOf } from './data/concepts.js';
import { learningObjectives, selfChecksByConcept } from './data/learningObjectives.js';
import { conceptLevel, guidedSelfChecks } from './data/studyGuidance.js';
import { workedExampleMath } from './data/workedExampleMath.js';
import { intuitionDetails } from './data/intuitionDetails.js';
import { stories } from './data/stories.js';
import { exampleTasks } from './data/exampleTasks.js';
import { bonusExamples } from './data/bonusExamples.js';
import { BonusPage } from './components/BonusExamples.jsx';
import { codingGuides } from './data/codingGuides.js';
import { projects } from './data/projects.js';
import { MML_BOOK, mmlLink, mmlReferences, mmlReferencesFor } from './data/mmlReferences.js';
import { caseStudies, courseBooks, courseLink, courseReferences, courseReferencesFor } from './data/courseReferences.js';
import { mathLinks, mlUsesOf } from './data/mathLinks.js';
import { FormulaDefinition } from './components/FormulaDefinition.jsx';
import { StartHere } from './components/StartHere.jsx';
import { PythonRunner } from './python/PythonRunner.jsx';
import { DoneToggle, TrackBar, TrackMembership, TrackView } from './components/LearningTrack.jsx';
import { Quiz, QuizBadge } from './components/Quiz.jsx';
import { quizzes } from './data/quizzes.js';
import { homework } from './data/homework.js';
import { HomeworkForPage, HomeworkPage } from './components/Homework.jsx';
import { AccountMenu } from './components/AccountMenu.jsx';
import { SiteSearch } from './components/SiteSearch.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { isTrackId, trackIds, trackOrder, tracks } from './data/learningTracks.js';
import { recordVisit } from './activity.js';

// Routes live in the URL hash so Back/Forward and shared links work:
//   #<concept-id>              concept page (as before)
//   #<concept-id>?track=math   concept page inside the Math or ML track, with previous / next
//   #track=ml                  the ML track's step-by-step list
//   #review                    quick review of every page, grouped by category
//   #homework=ml/regression    the homework of one track section (optionally ?problem=<id>)
//   #<concept-id>?section=example&practice=1   jump to the worked example, steps hidden for practice
function routeFromHash() {
  let raw;
  try {
    raw = decodeURIComponent(window.location.hash.replace('#', ''));
  } catch {
    return {}; // Malformed escapes such as "#%E0" fall back to the landing page.
  }
  const [path, query = ''] = raw.split('?');
  if (path === 'review') return { view: 'review' };
  if (path === 'cheatsheet') return { view: 'cheatsheet' };
  if (path === 'projects') return { view: 'projects' };
  if (path.startsWith('bonus=')) {
    const bonusKey = path.slice('bonus='.length);
    if (Object.hasOwn(bonusExamples, bonusKey)) return { bonusKey, trackId: bonusKey.slice(0, bonusKey.indexOf('/')) };
    return {};
  }
  if (path.startsWith('homework=')) {
    const homeworkKey = path.slice('homework='.length);
    if (Object.hasOwn(homework, homeworkKey)) return { homeworkKey, problemId: new URLSearchParams(query).get('problem'), trackId: homework[homeworkKey].track };
    return {};
  }
  const params = new URLSearchParams(path.startsWith('track=') ? path : query);
  const trackId = isTrackId(params.get('track')) ? params.get('track') : null;
  // Own-property checks so hashes like "#constructor" are not mistaken for concepts or topics.
  const conceptId = Object.hasOwn(conceptMap, path) ? path : null;
  if (!conceptId && Object.hasOwn(topicMap, path)) return { topicId: path };
  return {
    conceptId,
    // A concept keeps its track only if the track actually contains it.
    trackId: conceptId ? (trackId && trackOrder(trackId).includes(conceptId) ? trackId : null) : trackId,
    section: conceptId && params.get('section') === 'example' ? 'example' : null,
    practice: Boolean(conceptId) && params.get('practice') === '1',
  };
}

export function App() {
  const [route, setRoute] = React.useState(routeFromHash);
  const selectedConcept = route.conceptId ? conceptMap[route.conceptId] : null;
  const selectedTopic = route.topicId ? topicMap[route.topicId] : null;

  React.useEffect(() => {
    function syncFromUrl() {
      const next = routeFromHash();
      setRoute(next);
      if (!next.section) window.scrollTo({ top: 0 }); // a section link scrolls to that section instead
    }
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  React.useEffect(() => {
    const trackTitle = route.trackId ? tracks[route.trackId].title : null;
    document.title = route.bonusKey ? `Bonus examples | ML + Math Study Map` : route.homeworkKey ? `Homework: ${homework[route.homeworkKey].section} | ML + Math Study Map` : selectedConcept || selectedTopic
      ? `${(selectedConcept ?? selectedTopic).title} | ML + Math Study Map`
      : trackTitle ? `${trackTitle} | ML + Math Study Map` : route.view === 'review' ? 'Quick Review | ML + Math Study Map' : route.view === 'cheatsheet' ? 'Formula Cheat Sheet | ML + Math Study Map' : route.view === 'projects' ? 'Impact Projects | ML + Math Study Map' : 'ML & Mathematics for AI Study Map';
  }, [selectedConcept, selectedTopic, route.trackId, route.homeworkKey, route.view, route.bonusKey]);

  function go(hash) {
    window.location.hash = hash;
    const next = routeFromHash();
    setRoute(next);
    if (!next.section) window.scrollTo({ top: 0 });
  }

  // Opening a concept keeps the current track when the concept belongs to it, so prerequisite and
  // follow-on links still work as before inside a track.
  function selectConcept(id, trackId = route.trackId) {
    const keepTrack = trackId && conceptMap[id] && trackOrder(trackId).includes(id);
    go(keepTrack ? `${id}?track=${trackId}` : id);
  }

  function showTrack(trackId) {
    go(`track=${trackId}`);
  }

  function openHomework(key, problemId) {
    go(problemId ? `homework=${key}?problem=${problemId}` : `homework=${key}`);
  }

  function showLanding() {
    setRoute({});
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={showLanding} aria-label="Open the course overview">
          <Network size={22} />
          <span>ML + Math Study Map</span>
        </button>
        <nav className="top-actions" aria-label="Learning tracks">
          {trackIds.map((trackId) => (
            <button key={trackId} className={route.trackId === trackId ? 'active' : ''} onClick={() => showTrack(trackId)}>{tracks[trackId].title}</button>
          ))}
          <button className={route.view === 'review' ? 'active' : ''} onClick={() => go('review')}>Quick Review</button>
          <button className={route.view === 'cheatsheet' ? 'active' : ''} onClick={() => go('cheatsheet')}>Cheat Sheet</button>
        </nav>
        <HeaderStats />
        <SiteSearch onOpenPage={(id) => selectConcept(id)} onOpenTopic={(id) => go(id)} onOpenHomework={(key) => openHomework(key)} />
        <ThemeToggle />
        <AccountMenu />
      </header>

      {route.bonusKey ? (
        <BonusPage key={route.bonusKey} sectionKeyValue={route.bonusKey} onOpen={selectConcept} onShowTrack={showTrack} onOpenHomework={openHomework} />
      ) : route.homeworkKey ? (
        <HomeworkPage key={route.homeworkKey} setKey={route.homeworkKey} problemId={route.problemId} onSelect={(id) => selectConcept(id, null)} onShowTrack={showTrack} onOpenHomework={openHomework} />
      ) : selectedConcept ? (
        <ConceptPage key={`${selectedConcept.id}:${route.trackId ?? ''}`} concept={selectedConcept} trackId={route.trackId} section={route.section} practice={route.practice} onBack={showLanding} onSelect={selectConcept} onShowTrack={showTrack} onOpenHomework={openHomework} />
      ) : selectedTopic ? (
        <TopicPage key={selectedTopic.id} topic={selectedTopic} onBack={showLanding} onSelect={selectConcept} />
      ) : (
        <Landing trackId={route.trackId} view={route.view} onSelect={selectConcept} onShowTrack={showTrack} onShowLanding={showLanding} onShowReview={() => go('review')} onShowCheatSheet={() => go('cheatsheet')} onShowProjects={() => go('projects')} onOpenHomework={openHomework} />
      )}
    </div>
  );
}

function Landing({ trackId, view, onSelect, onShowTrack, onShowLanding, onShowReview, onShowCheatSheet, onShowProjects, onOpenHomework }) {
  const [localTab, setLocalTab] = React.useState('overview');
  const activeTab = trackId ? `track-${trackId}` : view === 'review' || view === 'cheatsheet' || view === 'projects' ? view : localTab;

  function openLocalTab(tab) {
    setLocalTab(tab);
    if (trackId || view) onShowLanding();
  }

  return (
    <main className="landing landing-full">
      <nav className="landing-tabs" aria-label="Landing views">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => openLocalTab('overview')}>Dashboard</button>
        {trackIds.map((id) => (
          <button key={id} className={activeTab === `track-${id}` ? 'active' : ''} onClick={() => onShowTrack(id)}>{tracks[id].title}</button>
        ))}
        <button className={activeTab === 'review' ? 'active' : ''} onClick={onShowReview}>Quick Review</button>
        <button className={activeTab === 'cheatsheet' ? 'active' : ''} onClick={onShowCheatSheet}>Cheat Sheet</button>
        <button className={activeTab === 'projects' ? 'active' : ''} onClick={onShowProjects}>Impact Projects</button>
        <button className={activeTab === 'objectives' ? 'active' : ''} onClick={() => openLocalTab('objectives')}>Learning Objectives</button>
      </nav>

      {activeTab === 'overview' && <Dashboard onOpen={onSelect} onOpenHomework={onOpenHomework} onShowReview={onShowReview} />}
      {activeTab === 'review' && <QuickReview onOpen={onSelect} />}
      {activeTab === 'cheatsheet' && <CheatSheet onOpen={(id) => onSelect(id, null)} />}
      {activeTab === 'projects' && <ImpactProjects onOpen={(id) => onSelect(id, null)} />}
      {trackId && <TrackView trackId={trackId} onOpen={onSelect} onShowTrack={onShowTrack} onOpenHomework={onOpenHomework} />}
      {activeTab === 'objectives' && <LearningObjectives onSelect={(id) => onSelect(id, null)} />}
    </main>
  );
}

function ConceptPage({ concept, trackId, section, practice, onBack, onSelect, onShowTrack, onOpenHomework }) {
  React.useEffect(() => { recordVisit(concept.id, trackId); }, [concept.id, trackId]);
  React.useEffect(() => {
    if (section === 'example') document.getElementById('worked-example')?.scrollIntoView({ block: 'start' });
  }, [section, practice]);

  return (
    <main className="concept-page">
      {trackId ? (
        <TrackBar trackId={trackId} conceptId={concept.id} onOpen={onSelect} onShowTrack={onShowTrack} />
      ) : (
        <div className="concept-page-top">
          <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Back to overview</button>
          <TrackMembership conceptId={concept.id} onOpen={onSelect} />
        </div>
      )}
      <TopicBreadcrumb conceptId={concept.id} onSelect={onSelect} />
      <section className="concept-hero">
        <p className="eyebrow">{concept.group} / {conceptLevel(concept.id)} / Source context: {concept.week}</p>
        <h1>{concept.title}</h1>
      </section>

      <StartHere conceptId={concept.id} />

      <PageSections />

      <OrderedSection number="1" title="What Problem Does This Solve?">
        <p className="problem-sentence">{concept.problem}</p>
        {stories[concept.id] && (
          <aside className="invent-story">
            <h3>Why would you invent this?</h3>
            <p>{stories[concept.id]}</p>
          </aside>
        )}
      </OrderedSection>

      <OrderedSection number="2" title="Plain-Language Intuition">
        <IntuitionBody concept={concept} />
        {concept.figure && (
          <div className="picture-it">
            <h3>Picture it</h3>
            <ConceptFigure id={concept.figure} />
          </div>
        )}
        <MathBridge conceptId={concept.id} onSelect={onSelect} />
      </OrderedSection>

      <OrderedSection number="3" title="Key Formulas and Symbols">
        <div className="formula-stack">
          {concept.formulas.map((formula) => (
            <article className="formula-card" key={formula.tex}>
              <BlockMath math={formula.tex} />
              <ul>
                {formula.definitions.map((definition) => <FormulaDefinition key={definition} definition={definition} />)}
              </ul>
            </article>
          ))}
        </div>
      </OrderedSection>

      <OrderedSection number="4" title="Fully Worked Numeric Example" id="worked-example">
        <WorkedExample key={`${concept.id}:${practice}`} concept={concept} startInPractice={practice} />
      </OrderedSection>

      <OrderedSection number="5" title="Interactive Graph">
        <ConceptGraph graph={concept.graph} />
        {concept.graph2 && <ConceptGraph graph={concept.graph2} />}
      </OrderedSection>

      <OrderedSection number="6" title="Try It in Python">
        <CodingGuide steps={codingGuides[concept.id]} />
        <PythonRunner conceptId={concept.id} original={codeExamples[concept.id] ?? '# No code example available yet.\nprint("Hello from Python")'} />
        <EndToEndProjects conceptId={concept.id} onSelect={onSelect} />
      </OrderedSection>

      <OrderedSection number="7" title="Common Misconception">
        <div className="misconception">{concept.misconception}</div>
      </OrderedSection>

      <OrderedSection number="8" title="Quiz: Check Your Understanding">
        <Quiz quizId={concept.id} questions={quizzes[concept.id] ?? []}>
          <DoneToggle conceptId={concept.id} />
        </Quiz>
        <HomeworkForPage conceptId={concept.id} onOpenHomework={onOpenHomework} />
        <details className="more-questions">
          <summary>More questions to think about</summary>
          <SelfChecks conceptId={concept.id} />
        </details>
      </OrderedSection>

      <OrderedSection number="9" title="Prerequisites and Follow-On Concepts">
        <LinkGroup label="Prerequisites" ids={concept.prerequisites} onSelect={onSelect} fallback="This is an entry concept." />
        <LinkGroup label="Follow-on" ids={concept.followOns} onSelect={onSelect} fallback="This is the end of this concept path." />
        <div className="sources"><Sigma size={18} /> Sources: {concept.sources.join(', ')}</div>
        <BookReferences references={mmlReferences[concept.id] ?? []} />
        <CourseBookReferences references={courseReferences[concept.id] ?? []} cases={caseStudies[concept.id] ?? []} />
      </OrderedSection>

      {trackId && <TrackBar trackId={trackId} conceptId={concept.id} onOpen={onSelect} onShowTrack={onShowTrack} position="bottom" />}
    </main>
  );
}

function LearningObjectives({ onSelect }) {
  return (
    <section className="objective-section" aria-label="Learning objectives coverage">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Course-aligned checklist</p>
          <h2>Learning Objectives / Learning Outcomes</h2>
        </div>
        <p className="objective-note">Each item links to the concept pages that establish it. Use the self-check prompt before moving on.</p>
      </div>
      <div className="objective-grid">
        {learningObjectives.map((section) => (
          <article className="objective-card" key={section.area}>
            <h3>{section.area}</h3>
            {section.items.map((item) => (
              <div className="objective-item" key={item.objective}>
                <p>{item.objective}</p>
                <div className="objective-links">
                  {item.concepts.map((id) => <button key={id} onClick={() => onSelect(id)}>{entryFor(id)?.title ?? id}</button>)}
                </div>
                <small>{item.check}</small>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

function SelfChecks({ conceptId }) {
  const guided = guidedSelfChecks[conceptId];

  if (guided?.length) {
    return (
      <div className="self-checks answered">
        {guided.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    );
  }

  return (
    <ul className="self-checks">
      {(selfChecksByConcept[conceptId] ?? ['Can you explain this concept without using the formula first?']).map((check) => <li key={check}>{check}</li>)}
    </ul>
  );
}


// ML pages: the math pages they build on, and why. Math pages: the ML pages that use them.
// The end-to-end project anchored on this page: stages with links, a runnable program, and its output.
function EndToEndProjects({ conceptId, onSelect }) {
  const anchored = Object.entries(projects).filter(([, project]) => project.anchor === conceptId);
  return anchored.map(([key, project]) => (
    <div className="end-to-end" id={`project-${key}`} key={key}>
      <h3>End-to-end project: {project.title}</h3>
      <p>{project.intro}</p>
      <ol>
        {project.steps.map((item) => (
          <li key={item.label}>
            <strong>{item.label}.</strong> {item.text}{' '}
            <span className="end-to-end-pages">
              ({item.pages.map((id, index) => (
                <React.Fragment key={id}>
                  {index > 0 && ', '}
                  {id === conceptId ? <span>this page</span> : <button onClick={() => onSelect(id)}>{conceptMap[id]?.title ?? id}</button>}
                </React.Fragment>
              ))})
            </span>
          </li>
        ))}
      </ol>
      <PythonRunner conceptId={`project-${key}`} original={project.code} />
      <details className="course-notes">
        <summary>Output you should see</summary>
        <pre>{project.expected}</pre>
      </details>
    </div>
  ));
}

// Practical steps from the formulas to a working program, shown above the runnable example.
function CodingGuide({ steps }) {
  if (!steps) return null;
  return (
    <div className="coding-guide">
      <h3>From formula to code</h3>
      <ol>
        {steps.map((item) => (
          <li key={item.label}>
            <strong>{item.label}.</strong> {item.text}
            {item.code && <pre><code>{item.code}</code></pre>}
          </li>
        ))}
      </ol>
    </div>
  );
}

// A short hook, then labelled key ideas, then (collapsed) notes tied to the course materials.
function IntuitionBody({ concept }) {
  const details = intuitionDetails[concept.id];
  if (!details) return <p>{concept.intuition}</p>;
  return (
    <>
      <p className="intuition-hook">{concept.intuition}</p>
      <ul className="key-ideas">
        {details.keyIdeas.map((item) => (
          <li key={item.label}><strong>{/[?!.]$/.test(item.label) ? item.label : `${item.label}.`}</strong> {item.text}</li>
        ))}
      </ul>
      {details.courseNotes && (
        <details className="course-notes">
          <summary>{details.notesTitle ?? 'From the course notes and slides'} ({details.courseNotes.length})</summary>
          <ul>
            {details.courseNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </details>
      )}
    </>
  );
}

function MathBridge({ conceptId, onSelect }) {
  const uses = mathLinks[conceptId] ?? [];
  const usedBy = mlUsesOf(conceptId);
  if (!uses.length && !usedBy.length) return null;
  const items = uses.length ? uses : usedBy;
  return (
    <aside className={`math-bridge ${uses.length ? 'to-math' : 'to-ml'}`} aria-label={uses.length ? 'The math behind this page' : 'Where machine learning uses this'}>
      <h3><Sparkles size={18} /> {uses.length ? 'The math behind this page' : 'Where machine learning uses this'}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button className="inline-link" onClick={() => onSelect(item.id)}>{entryFor(item.id).title}</button>: {item.why}
          </li>
        ))}
      </ul>
    </aside>
  );
}

// The machine learning course's reading list: sections to read for this page, and case studies.
function CourseBookReferences({ references, cases }) {
  if (!references.length && !cases.length) return null;
  const books = [...new Set(references.map((item) => item.book))];
  return (
    <aside className="course-references" aria-label="Read more in the course books">
      <h3><Library size={18} /> Read more in the course books</h3>
      <ul>
        {references.map((item) => {
          const link = courseLink(item);
          const label = `${courseBooks[item.book].short}${item.section ? `, ${item.section.startsWith('Ch') || item.section.startsWith('App') ? '' : '§'}${item.section}` : ''}: ${item.title}`;
          return (
            <li key={`${item.book}-${item.section}-${item.title}`}>
              {link ? <a href={link} target="_blank" rel="noreferrer">{label}</a> : label}{item.page ? ` (p. ${item.page})` : ''}
            </li>
          );
        })}
        {cases.map((item) => <li key={item.url}>Case study: <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></li>)}
      </ul>
      {books.length > 0 && <p>{books.map((id) => courseBooks[id].citation).join(' ')}</p>}
    </aside>
  );
}

// Links into the course reference book, opening the free PDF at the right page.
function BookReferences({ references }) {
  if (!references.length) return null;
  return (
    <aside className="mml-references" aria-label="Read more in the reference book">
      <h3><BookOpen size={18} /> Read more in the MML book</h3>
      <ul>
        {references.map((item) => (
          <li key={`${item.section}-${item.page}`}>
            <a href={mmlLink(item.page)} target="_blank" rel="noreferrer">§{item.section} {item.title}</a> (p. {item.page})
          </li>
        ))}
      </ul>
      <p>{MML_BOOK.authors}, <a href={MML_BOOK.home} target="_blank" rel="noreferrer"><em>{MML_BOOK.title}</em></a>, free PDF from the authors.</p>
    </aside>
  );
}

// "On this page": a slim bar that stays in view on concept pages, shows where the reader is (current
// section and reading progress) and jumps to any section, so a long page never feels like a maze.
const PAGE_SECTIONS = [
  ['section-1', 'Problem'], ['section-2', 'Intuition'], ['section-3', 'Formulas'], ['worked-example', 'Example'],
  ['section-5', 'Graph'], ['section-6', 'Python'], ['section-7', 'Misconception'], ['section-8', 'Quiz'], ['section-9', 'Connections'],
];

function PageSections() {
  const [active, setActive] = React.useState(PAGE_SECTIONS[0][0]);
  const [progress, setProgress] = React.useState(0);
  const bar = React.useRef(null);

  React.useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      // The current section is the last one whose top has passed just under the bars.
      const line = (bar.current?.getBoundingClientRect().bottom ?? 0) + 24;
      let current = PAGE_SECTIONS[0][0];
      for (const [id] of PAGE_SECTIONS) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Keep the active chip visible when the bar scrolls sideways (phones).
  React.useEffect(() => {
    bar.current?.querySelector('.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [active]);

  return (
    <nav className="page-sections" ref={bar} aria-label="On this page">
      <div className="page-sections-list">
        {PAGE_SECTIONS.map(([id, label]) => (
          <button key={id} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}
            onClick={() => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'smooth' })}>{label}</button>
        ))}
      </div>
      <div className="page-sections-progress" aria-hidden="true"><span style={{ width: `${progress * 100}%` }} /></div>
    </nav>
  );
}

// The worked example, readable in full or practised: the first step (the setup) shows, and each
// later step stays hidden until the student has tried it and asks to see it.
function WorkedExample({ concept, startInPractice }) {
  const [practice, setPractice] = React.useState(startInPractice);
  const [shown, setShown] = React.useState(1);
  const steps = concept.example;
  const visible = practice ? steps.slice(0, shown) : steps;
  const math = workedExampleMath[concept.id] ?? [];

  function togglePractice() {
    setPractice((current) => !current);
    setShown(1);
  }

  const task = exampleTasks[concept.id];

  return (
    <div className={`worked-example-box${practice ? ' practising' : ''}`}>
      {task && (
        <div className="example-task">
          <span className="example-task-label">The task</span>
          <p>{task}</p>
        </div>
      )}
      <div className="worked-example-bar">
        <button className="practice-toggle" onClick={togglePractice} aria-pressed={practice}>
          {practice ? 'Show all steps' : 'Practise: hide the steps'}
        </button>
        {practice && <span className="practice-count">Step {Math.min(shown, steps.length)} of {steps.length}. Try the next step of the task yourself, then check it.</span>}
      </div>
      <ol className="worked-example">
        {visible.map((line, index) => (
          <li key={line}>
            <p>{line}</p>
            {math[index] && <BlockMath math={math[index]} />}
          </li>
        ))}
      </ol>
      {practice && shown < steps.length && (
        <div className="practice-actions">
          <button className="practice-next" onClick={() => setShown((count) => count + 1)}>Check step {shown + 1}</button>
          <button className="practice-all" onClick={() => setShown(steps.length)}>Show the rest</button>
        </div>
      )}
      {practice && shown >= steps.length && <p className="practice-done">That completes the task. Now try the homework with its own numbers.</p>}
    </div>
  );
}

function OrderedSection({ number, title, id, children }) {
  return (
    <section className="ordered-section" id={id ?? `section-${number}`}>
      <div className="section-number">{number}</div>
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function LinkGroup({ label, ids, onSelect, fallback }) {
  return (
    <div className="link-group">
      <h3>{label}</h3>
      {ids.length ? (
        <div className="pill-row">
          {ids.map((id) => <button key={id} onClick={() => onSelect(id)}>{entryFor(id).title}</button>)}
        </div>
      ) : <p>{fallback}</p>}
    </div>
  );
}

// A subtopic page shows which topic it belongs to and its neighbours within that topic.
function TopicBreadcrumb({ conceptId, onSelect }) {
  const topic = topicOf(conceptId);
  if (!topic) return null;
  const index = topic.children.indexOf(conceptId);
  return (
    <nav className="topic-breadcrumb" aria-label={`${topic.title} subtopics`}>
      <span>Part of</span>
      <button className="topic-link" onClick={() => onSelect(topic.id, null)}>{topic.title}</button>
      <span>· subtopic {index + 1} of {topic.children.length}:</span>
      <div className="topic-siblings">
        {topic.children.map((id, position) => (
          <button key={id} className={id === conceptId ? 'current' : ''} aria-current={id === conceptId ? 'page' : undefined} onClick={() => onSelect(id)}>{position + 1}. {conceptMap[id].title}</button>
        ))}
      </div>
    </nav>
  );
}

// Overview page for a topic that was split into subtopics.
function TopicPage({ topic, onBack, onSelect }) {
  return (
    <main className="concept-page topic-page">
      <div className="concept-page-top">
        <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Back to overview</button>
      </div>
      <section className="concept-hero">
        <p className="eyebrow">{topic.group} / Topic overview / Source context: {topic.week}</p>
        <h1>{topic.title}</h1>
      </section>
      <section className="ordered-section topic-summary">
        <div className="section-number">i</div>
        <div>
          <h2>What this topic covers</h2>
          <p className="problem-sentence">{topic.summary}</p>
          <p>{topic.overview}</p>
          <button className="track-primary" onClick={() => onSelect(topic.children[0])}>Start with {conceptMap[topic.children[0]].title}</button>
        </div>
      </section>
      <section className="topic-children" aria-label="Subtopics">
        <h2>Subtopics, in order</h2>
        <ol>
          {topic.children.map((id, index) => (
            <li key={id}>
              <span className="track-step" aria-hidden="true">{index + 1}</span>
              <div>
                <button className="track-item-title" onClick={() => onSelect(id)}>{conceptMap[id].title}</button> <QuizBadge quizId={id} />
                <p>{conceptMap[id].problem}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="ordered-section topic-quiz">
        <div className="section-number">?</div>
        <div>
          <h2>Topic Quiz</h2>
          <p>All {topic.children.reduce((count, id) => count + (quizzes[id]?.length ?? 0), 0)} questions from the {topic.children.length} subtopics, to check the whole topic at once.</p>
          <Quiz quizId={`topic:${topic.id}`} questions={topic.children.flatMap((id) => quizzes[id] ?? [])} />
        </div>
      </section>
      <BookReferences references={mmlReferencesFor(topic.children)} />
      <CourseBookReferences references={courseReferencesFor(topic.children)} cases={[]} />
    </main>
  );
}
