import React from 'react';
import { ArrowLeft, ArrowRight, Check, ListOrdered } from 'lucide-react';
import { conceptMap } from '../data/concepts.js';
import { conceptLevel } from '../data/studyGuidance.js';
import { trackIds, trackOrder, tracks, tracksContaining } from '../data/learningTracks.js';
import { useProgress } from '../progress.js';
import { QuizBadge } from './Quiz.jsx';
import { projects } from '../data/projects.js';

function otherTrack(trackId) {
  return trackIds.find((id) => id !== trackId);
}

// Prerequisites that live only in the other track, e.g. the math a machine-learning page relies on.
function crossTrackPrerequisites(conceptId, trackId) {
  const inTrack = new Set(trackOrder(trackId));
  return conceptMap[conceptId].prerequisites.filter((id) => !inTrack.has(id));
}

export function DoneToggle({ conceptId, compact = false }) {
  const { isDone, toggleDone } = useProgress();
  const done = isDone(conceptId);
  return (
    <button type="button" className={`done-toggle${done ? ' is-done' : ''}${compact ? ' compact' : ''}`} onClick={() => toggleDone(conceptId)} aria-pressed={done}>
      <Check size={compact ? 14 : 16} /> {done ? 'Done' : compact ? 'Mark done' : 'Mark as done'}
    </button>
  );
}

// Landing view: one track as a numbered, sectioned list with progress.
export function TrackView({ trackId, onOpen, onShowTrack }) {
  const track = tracks[trackId];
  const order = trackOrder(trackId);
  const { isDone } = useProgress();
  const doneCount = order.filter(isDone).length;
  const next = order.find((id) => !isDone(id));
  const other = tracks[otherTrack(trackId)];
  let step = 0;

  return (
    <section className="track-view" aria-label={track.title}>
      <div className="track-header">
        <div>
          <p className="eyebrow">Learn step by step</p>
          <h2>{track.title}</h2>
          <p className="track-description">{track.description}</p>
        </div>
        <div className="track-summary">
          <div className="track-progress" role="progressbar" aria-valuemin={0} aria-valuemax={order.length} aria-valuenow={doneCount} aria-label={`${doneCount} of ${order.length} done`}>
            <span style={{ width: `${(100 * doneCount) / order.length}%` }} />
          </div>
          <p>{doneCount} of {order.length} done</p>
          <button className="track-primary" onClick={() => onOpen(next ?? order[0], trackId)}>
            {doneCount === 0 ? 'Start' : next ? 'Continue' : 'Review'}: {conceptMap[next ?? order[0]].title} <ArrowRight size={16} />
          </button>
          <button className="track-switch" onClick={() => onShowTrack(other.id)}>Switch to the {other.title}</button>
        </div>
      </div>

      {track.sections.map((section) => (
        <div className="track-section" key={section.title}>
          <h3>{section.title}</h3>
          <ol>
            {section.concepts.map((id) => {
              step += 1;
              const concept = conceptMap[id];
              const needs = crossTrackPrerequisites(id, trackId);
              const shared = tracksContaining(id).length > 1;
              return (
                <li key={id} className={isDone(id) ? 'is-done' : ''}>
                  <span className="track-step" aria-hidden="true">{isDone(id) ? <Check size={16} /> : step}</span>
                  <div className="track-item-body">
                    <button className="track-item-title" onClick={() => onOpen(id, trackId)}>{concept.title}</button>
                    <p>{concept.problem}</p>
                    <div className="track-item-meta">
                      <span className={`level-tag ${conceptLevel(id).toLowerCase()}`}>{conceptLevel(id)}</span>
                      <QuizBadge quizId={id} />
                      {shared && <span className="shared-tag">In both tracks</span>}
                      {needs.length > 0 && (
                        <span className="uses-from">
                          Also uses from the {other.short} track:{' '}
                          {needs.map((need, index) => (
                            <React.Fragment key={need}>
                              {index > 0 && ', '}
                              <button onClick={() => onOpen(need, other.id)}>{conceptMap[need].title}</button>
                            </React.Fragment>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  <DoneToggle conceptId={id} compact />
                </li>
              );
            })}
          </ol>
          {Object.values(projects).filter((project) => section.concepts.includes(project.anchor)).map((project) => (
            <button className="track-project" key={project.anchor} onClick={() => onOpen(project.anchor, trackId)}>
              End-to-end project: {project.title} <span>(on the page {conceptMap[project.anchor].title})</span>
            </button>
          ))}
        </div>
      ))}
    </section>
  );
}

// Concept page, track mode: where you are in the track, with previous / next.
export function TrackBar({ trackId, conceptId, onOpen, onShowTrack, position = 'top' }) {
  const track = tracks[trackId];
  const order = trackOrder(trackId);
  const index = order.indexOf(conceptId);
  const previous = order[index - 1];
  const next = order[index + 1];
  const section = track.sections.find((candidate) => candidate.concepts.includes(conceptId));

  return (
    <nav className={`track-bar ${position}`} aria-label={`${track.title} navigation`}>
      <div className="track-bar-where">
        <button className="track-bar-home" onClick={() => onShowTrack(trackId)}><ListOrdered size={16} /> {track.title}</button>
        <span>Step {index + 1} of {order.length} · {section.title}</span>
      </div>
      <div className="track-bar-buttons">
        <button onClick={() => onOpen(previous, trackId)} disabled={!previous} title={previous ? conceptMap[previous].title : undefined}>
          <ArrowLeft size={16} /> {position === 'bottom' && previous ? conceptMap[previous].title : 'Previous'}
        </button>
        {position === 'bottom' && <DoneToggle conceptId={conceptId} />}
        {next ? (
          <button className="track-next" onClick={() => onOpen(next, trackId)} title={conceptMap[next].title}>
            {position === 'bottom' ? `Next: ${conceptMap[next].title}` : 'Next'} <ArrowRight size={16} />
          </button>
        ) : (
          <button className="track-next" onClick={() => onShowTrack(trackId)}>Finish: back to the track <ArrowRight size={16} /></button>
        )}
      </div>
    </nav>
  );
}

// Concept page opened from the map or a link: offer to continue it as part of a track.
export function TrackMembership({ conceptId, onOpen }) {
  const memberships = tracksContaining(conceptId);
  return (
    <div className="track-membership">
      <span>Study in order:</span>
      {memberships.map((trackId) => (
        <button key={trackId} onClick={() => onOpen(conceptId, trackId)}>
          {tracks[trackId].title}, step {trackOrder(trackId).indexOf(conceptId) + 1} of {trackOrder(trackId).length}
        </button>
      ))}
      <DoneToggle conceptId={conceptId} compact />
    </div>
  );
}
