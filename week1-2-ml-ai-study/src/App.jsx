import React from 'react';
import { ArrowLeft, Network, Sigma } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { ConceptGraph } from './components/ConceptGraph.jsx';
import { MindMap } from './components/MindMap.jsx';
import { codeExamples } from './data/codeExamples.js';
import { concepts, conceptMap, notCovered } from './data/concepts.js';
import { learningObjectives, selfChecksByConcept } from './data/learningObjectives.js';
import { conceptLevel, guidedSelfChecks } from './data/studyGuidance.js';
import { workedExampleMath } from './data/workedExampleMath.js';
import { normalizeDefinitionSymbol } from './utils/mathText.js';
import { PythonRunner } from './python/PythonRunner.jsx';
import { TrackBar, TrackMembership, TrackView } from './components/LearningTrack.jsx';
import { isTrackId, trackIds, trackOrder, tracks } from './data/learningTracks.js';

// Routes live in the URL hash so Back/Forward and shared links work:
//   #<concept-id>              concept page (as before)
//   #<concept-id>?track=math   concept page inside the Math or ML track, with previous / next
//   #track=ml                  the ML track's step-by-step list
function routeFromHash() {
  let raw;
  try {
    raw = decodeURIComponent(window.location.hash.replace('#', ''));
  } catch {
    return {}; // Malformed escapes such as "#%E0" fall back to the landing page.
  }
  const [path, query = ''] = raw.split('?');
  const params = new URLSearchParams(path.startsWith('track=') ? path : query);
  const trackId = isTrackId(params.get('track')) ? params.get('track') : null;
  // Own-property check so hashes like "#constructor" are not mistaken for concepts.
  const conceptId = Object.hasOwn(conceptMap, path) ? path : null;
  return {
    conceptId,
    // A concept keeps its track only if the track actually contains it.
    trackId: conceptId ? (trackId && trackOrder(trackId).includes(conceptId) ? trackId : null) : trackId,
  };
}

export function App() {
  const [route, setRoute] = React.useState(routeFromHash);
  const selectedConcept = route.conceptId ? conceptMap[route.conceptId] : null;

  React.useEffect(() => {
    function syncFromUrl() {
      setRoute(routeFromHash());
      window.scrollTo({ top: 0 });
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
    document.title = selectedConcept
      ? `${selectedConcept.title} | ML + Math Study Map`
      : trackTitle ? `${trackTitle} | ML + Math Study Map` : 'ML & Mathematics for AI Study Map';
  }, [selectedConcept, route.trackId]);

  function go(hash) {
    window.location.hash = hash;
    setRoute(routeFromHash());
    window.scrollTo({ top: 0 });
  }

  // Opening a concept keeps the current track when the concept belongs to it, so prerequisite and
  // follow-on links still work as before inside a track.
  function selectConcept(id, trackId = route.trackId) {
    const keepTrack = trackId && trackOrder(trackId).includes(id);
    go(keepTrack ? `${id}?track=${trackId}` : id);
  }

  function showTrack(trackId) {
    go(`track=${trackId}`);
  }

  function showLanding() {
    setRoute({});
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={showLanding} aria-label="Open mind map">
          <Network size={22} />
          <span>ML + Math Study Map</span>
        </button>
        <nav className="top-actions" aria-label="Learning tracks">
          {trackIds.map((trackId) => (
            <button key={trackId} className={route.trackId === trackId ? 'active' : ''} onClick={() => showTrack(trackId)}>{tracks[trackId].title}</button>
          ))}
        </nav>
      </header>

      {selectedConcept ? (
        <ConceptPage key={`${selectedConcept.id}:${route.trackId ?? ''}`} concept={selectedConcept} trackId={route.trackId} onBack={showLanding} onSelect={selectConcept} onShowTrack={showTrack} />
      ) : (
        <Landing trackId={route.trackId} onSelect={selectConcept} onShowTrack={showTrack} onShowLanding={showLanding} />
      )}
    </div>
  );
}

function Landing({ trackId, onSelect, onShowTrack, onShowLanding }) {
  const [localTab, setLocalTab] = React.useState('map');
  const activeTab = trackId ? `track-${trackId}` : localTab;

  function openLocalTab(tab) {
    setLocalTab(tab);
    if (trackId) onShowLanding();
  }

  return (
    <main className="landing landing-full">
      <nav className="landing-tabs" aria-label="Landing views">
        <button className={activeTab === 'map' ? 'active' : ''} onClick={() => openLocalTab('map')}>Concept Map</button>
        {trackIds.map((id) => (
          <button key={id} className={activeTab === `track-${id}` ? 'active' : ''} onClick={() => onShowTrack(id)}>{tracks[id].title}</button>
        ))}
        <button className={activeTab === 'objectives' ? 'active' : ''} onClick={() => openLocalTab('objectives')}>Learning Objectives</button>
        <button className={activeTab === 'concepts' ? 'active' : ''} onClick={() => openLocalTab('concepts')}>All Concepts</button>
      </nav>

      {activeTab === 'map' && <MindMap onSelect={(id) => onSelect(id, null)} />}
      {trackId && <TrackView trackId={trackId} onOpen={onSelect} onShowTrack={onShowTrack} />}
      {activeTab === 'objectives' && <LearningObjectives onSelect={(id) => onSelect(id, null)} />}
      {activeTab === 'concepts' && <ConceptIndex onSelect={(id) => onSelect(id, null)} />}
    </main>
  );
}

function ConceptIndex({ onSelect }) {
  return (
    <section className="coverage-grid concept-index" aria-label="Concept index">
      <div>
        <h2>All Concepts</h2>
        <div className="concept-list">
          {concepts.map((concept) => (
            <button key={concept.id} onClick={() => onSelect(concept.id)}>
              <span>{concept.group} / {conceptLevel(concept.id)}</span>
              {concept.title}
            </button>
          ))}
        </div>
      </div>
      <div className="not-covered">
        <h2>Not Covered</h2>
        {notCovered.map((item) => <p key={item}>{item}</p>)}
      </div>
    </section>
  );
}

function ConceptPage({ concept, trackId, onBack, onSelect, onShowTrack }) {
  return (
    <main className="concept-page">
      {trackId ? (
        <TrackBar trackId={trackId} conceptId={concept.id} onOpen={onSelect} onShowTrack={onShowTrack} />
      ) : (
        <div className="concept-page-top">
          <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Back to mind map</button>
          <TrackMembership conceptId={concept.id} onOpen={onSelect} />
        </div>
      )}
      <section className="concept-hero">
        <p className="eyebrow">{concept.group} / {conceptLevel(concept.id)} / Source context: {concept.week}</p>
        <h1>{concept.title}</h1>
      </section>

      <OrderedSection number="1" title="What Problem Does This Solve?">
        <p className="problem-sentence">{concept.problem}</p>
      </OrderedSection>

      <OrderedSection number="2" title="Plain-Language Intuition">
        <p>{concept.intuition}</p>
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

      <OrderedSection number="4" title="Fully Worked Numeric Example">
        <ol className="worked-example">
          {concept.example.map((line, index) => (
            <li key={line}>
              <p>{line}</p>
              {workedExampleMath[concept.id]?.[index] && <BlockMath math={workedExampleMath[concept.id][index]} />}
            </li>
          ))}
        </ol>
      </OrderedSection>

      <OrderedSection number="5" title="Interactive Graph">
        <ConceptGraph graph={concept.graph} />
      </OrderedSection>

      <OrderedSection number="6" title="Try It in Python">
        <PythonRunner conceptId={concept.id} original={codeExamples[concept.id] ?? '# No code example available yet.\nprint("Hello from Python")'} />
      </OrderedSection>

      <OrderedSection number="7" title="Common Misconception">
        <div className="misconception">{concept.misconception}</div>
      </OrderedSection>

      <OrderedSection number="8" title="Self-Check Questions">
        <SelfChecks conceptId={concept.id} />
      </OrderedSection>

      <OrderedSection number="9" title="Prerequisites and Follow-On Concepts">
        <LinkGroup label="Prerequisites" ids={concept.prerequisites} onSelect={onSelect} fallback="This is an entry concept." />
        <LinkGroup label="Follow-on" ids={concept.followOns} onSelect={onSelect} fallback="This is the end of this concept path." />
        <div className="sources"><Sigma size={18} /> Sources: {concept.sources.join(', ')}</div>
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
                  {item.concepts.map((id) => <button key={id} onClick={() => onSelect(id)}>{conceptMap[id]?.title ?? id}</button>)}
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

function FormulaDefinition({ definition }) {
  const separatorIndex = definition.indexOf(':');

  if (separatorIndex === -1) {
    return <li>{definition}</li>;
  }

  const symbol = definition.slice(0, separatorIndex).trim();
  const explanation = definition.slice(separatorIndex + 1).trim();
  const symbolMath = normalizeDefinitionSymbol(symbol);

  return (
    <li>
      <span className="definition-symbol"><InlineMath math={symbolMath} /></span>
      <span className="definition-explanation">{explanation}</span>
    </li>
  );
}

function OrderedSection({ number, title, children }) {
  return (
    <section className="ordered-section">
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
          {ids.map((id) => <button key={id} onClick={() => onSelect(id)}>{conceptMap[id].title}</button>)}
        </div>
      ) : <p>{fallback}</p>}
    </div>
  );
}
