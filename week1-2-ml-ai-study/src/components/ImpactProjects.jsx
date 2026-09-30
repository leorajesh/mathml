import React from 'react';
import { BookOpen, CalendarDays, Database, Flag, HeartHandshake, Scale, ShieldAlert, Sparkles, Target, Users } from 'lucide-react';
import { impactProjects } from '../data/impactProjects.js';
import { conceptMap } from '../data/concepts.js';
import { PythonRunner } from '../python/PythonRunner.jsx';

// Social-impact capstone projects: one full project brief per track, with a week-by-week plan
// linked to the pages that teach each step, an ethics section, and runnable starter code.
const TRACK = { math: { label: 'Math Track', cls: 'math' }, ml: { label: 'ML Track', cls: 'ml' } };

function PageChips({ pages, onOpen }) {
  if (!pages.length) return null;
  return (
    <span className="ip-chips">
      {pages.map((id) => <button key={id} className="ip-chip" onClick={() => onOpen(id)}>{conceptMap[id]?.title ?? id}</button>)}
    </span>
  );
}

function Section({ icon: Icon, title, children, id }) {
  return (
    <section className="ip-section" id={id}>
      <h3><Icon size={17} aria-hidden="true" /> {title}</h3>
      {children}
    </section>
  );
}

export function ImpactProjects({ onOpen }) {
  const [active, setActive] = React.useState(() => {
    try {
      const saved = window.localStorage.getItem('mathml-study:impact-project');
      return impactProjects.some((p) => p.id === saved) ? saved : impactProjects[0].id;
    } catch {
      return impactProjects[0].id;
    }
  });
  function choose(id) {
    setActive(id);
    try { window.localStorage.setItem('mathml-study:impact-project', id); } catch { /* not remembered */ }
  }
  const project = impactProjects.find((p) => p.id === active);
  const track = TRACK[project.track];
  return (
    <div className="impact">
      <header className="ip-header">
        <p className="ip-kicker">Projects with social impact · beyond the first three weeks</p>
        <h1>Impact Projects</h1>
        <p className="ip-lede">Two full projects that use what you learn in the course to help real people: one built on mathematics, one on machine learning. Each has a week-by-week plan linked to the pages that teach each step, an ethics section, and a starter program you can run right here.</p>
      </header>

      <div className="ip-picker" role="tablist" aria-label="Choose a project">
        {impactProjects.map((p) => (
          <button key={p.id} role="tab" aria-selected={p.id === active} className={`ip-pick ${TRACK[p.track].cls}${p.id === active ? ' active' : ''}`} onClick={() => choose(p.id)}>
            <span className={`ip-track ${TRACK[p.track].cls}`}>{TRACK[p.track].label}</span>
            <span className="ip-pick-title">{p.title}</span>
            <span className="ip-pick-tag">{p.tagline}</span>
          </button>
        ))}
      </div>

      <article className={`ip-project ${track.cls}`} aria-label={project.title}>
        <header className="ip-project-head">
          <span className={`ip-track ${track.cls}`}>{track.label}</span>
          <h2>{project.title}</h2>
          <p className="ip-meta"><CalendarDays size={15} aria-hidden="true" /> {project.duration}</p>
          <p className="ip-sdgs">{project.sdgs.map((sdg) => <span key={sdg} className="ip-sdg">{sdg}</span>)}</p>
        </header>

        <div className="ip-question"><Target size={18} aria-hidden="true" /><div><p className="ip-label">The question</p><p>{project.question}</p></div></div>

        <div className="ip-grid">
          <Section icon={HeartHandshake} title="Why it matters"><p>{project.why}</p></Section>
          <Section icon={Users} title="Who benefits"><ul>{project.whoBenefits.map((item) => <li key={item}>{item}</li>)}</ul></Section>
        </div>

        <Section icon={Database} title="Data you can use">
          <ul className="ip-data">{project.data.map((item) => <li key={item.name}><strong>{item.name}.</strong> {item.detail}</li>)}</ul>
        </Section>

        <Section icon={BookOpen} title="What you will use from the course">
          <ul className="ip-skills">
            {project.skills.map((item) => (
              <li key={item.page}><button className="ip-chip" onClick={() => onOpen(item.page)}>{conceptMap[item.page]?.title ?? item.page}</button><span>{item.use}</span></li>
            ))}
          </ul>
        </Section>

        <Section icon={CalendarDays} title="Week-by-week plan">
          <ol className="ip-plan">
            {project.milestones.map((m) => (
              <li key={m.week}>
                <span className="ip-week">Week {m.week}</span>
                <div className="ip-step">
                  <h4>{m.title}</h4>
                  <ul>{m.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
                  <p className="ip-deliverable"><Flag size={14} aria-hidden="true" /> <span><strong>Deliverable:</strong> {m.deliverable}</span></p>
                  {m.pages.length > 0 && <p className="ip-study">Study: <PageChips pages={m.pages} onOpen={onOpen} /></p>}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <div className="ip-grid">
          <Section icon={Flag} title="What you hand in"><ul>{project.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></Section>
          <Section icon={Scale} title="How to judge success">
            <dl className="ip-rubric">{project.evaluation.map((row) => <React.Fragment key={row.criterion}><dt>{row.criterion}</dt><dd>{row.good}</dd></React.Fragment>)}</dl>
          </Section>
        </div>

        <Section icon={ShieldAlert} title="Risks and how to handle them">
          <div className="ip-ethics">
            {project.ethics.map((row) => (
              <div key={row.risk} className="ip-ethic"><p className="ip-risk"><strong>Risk:</strong> {row.risk}</p><p><strong>What to do:</strong> {row.mitigation}</p></div>
            ))}
          </div>
        </Section>

        <Section icon={Sparkles} title="Going further"><ul>{project.stretch.map((item) => <li key={item}>{item}</li>)}</ul></Section>

        <Section icon={BookOpen} title="Starter program" id={`starter-${project.id}`}>
          <p className="ip-note">{project.starterNote}</p>
          <PythonRunner key={project.id} conceptId={`impact-${project.id}`} original={project.code} />
          <details className="ip-expected">
            <summary>What the starter program prints</summary>
            <pre>{project.expected}</pre>
          </details>
        </Section>
      </article>
    </div>
  );
}
