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

export function App() {
  const initialId = window.location.hash.replace('#', '') || '';
  const [selectedId, setSelectedId] = React.useState(conceptMap[initialId] ? initialId : null);
  const selectedConcept = selectedId ? conceptMap[selectedId] : null;

  function selectConcept(id) {
    setSelectedId(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showLanding() {
    setSelectedId(null);
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={showLanding} aria-label="Open mind map">
          <Network size={22} />
          <span>ML + Math Study Map</span>
        </button>
        <nav className="top-actions" aria-label="Concept shortcuts">
          <button onClick={() => selectConcept('linear-classifier')}>Classification</button>
          <button onClick={() => selectConcept('linear-regression')}>Regression</button>
          <button onClick={() => selectConcept('logistic-regression')}>Logistic</button>
        </nav>
      </header>

      {selectedConcept ? (
        <ConceptPage concept={selectedConcept} onBack={showLanding} onSelect={selectConcept} />
      ) : (
        <Landing onSelect={selectConcept} />
      )}
    </div>
  );
}

function Landing({ onSelect }) {
  const [activeTab, setActiveTab] = React.useState('map');

  return (
    <main className="landing landing-full">
      <nav className="landing-tabs" aria-label="Landing views">
        <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>Concept Map</button>
        <button className={activeTab === 'objectives' ? 'active' : ''} onClick={() => setActiveTab('objectives')}>Learning Objectives</button>
        <button className={activeTab === 'concepts' ? 'active' : ''} onClick={() => setActiveTab('concepts')}>All Concepts</button>
      </nav>

      {activeTab === 'map' && <MindMap onSelect={onSelect} />}
      {activeTab === 'objectives' && <LearningObjectives onSelect={onSelect} />}
      {activeTab === 'concepts' && <ConceptIndex onSelect={onSelect} />}
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

function ConceptPage({ concept, onBack, onSelect }) {
  return (
    <main className="concept-page">
      <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Back to mind map</button>
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

      <OrderedSection number="6" title="Python Implementation Sketch">
        <CodeExample conceptId={concept.id} />
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
    </main>
  );
}

function CodeExample({ conceptId }) {
  const code = codeExamples[conceptId] ?? '# No code example available yet.';
  const [copied, setCopied] = React.useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="code-example">
      <div className="code-toolbar">
        <span>Python</span>
        <button onClick={copyCode} aria-label="Copy Python code">
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
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
