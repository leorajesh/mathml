import React from 'react';
import { ArrowRight, Check, ClipboardList } from 'lucide-react';
import { conceptMap } from '../data/concepts.js';
import { homework } from '../data/homework.js';
import { sectionKey, trackIds, trackOrder, tracks } from '../data/learningTracks.js';
import { useProgress } from '../progress.js';

// The landing overview: both tracks as numbered section cards with their pages, what is done, and
// where to continue. Replaces the free-form concept map with the same structure the tracks use, so
// the picture a student remembers is the order they actually study in.
export function CourseOverview({ onOpen, onShowTrack, onOpenHomework }) {
  const { isDone } = useProgress();
  return (
    <section className="course-overview" aria-label="Course overview">
      <header className="overview-intro">
        <h2>Course Overview</h2>
        <p>Two tracks, each a numbered sequence of sections. Every page builds only on the pages before it. Tick pages off as you finish them, and use <strong>Quick Review</strong> to revise.</p>
      </header>
      <div className="overview-tracks">
        {trackIds.map((trackId) => {
          const track = tracks[trackId];
          const order = trackOrder(trackId);
          const done = order.filter(isDone).length;
          const next = order.find((id) => !isDone(id));
          return (
            <section className="overview-track" key={trackId} aria-label={track.title}>
              <header className="overview-track-head">
                <div>
                  <h3>{track.title}</h3>
                  <p className="overview-track-count">{done} of {order.length} pages done · {track.sections.length} sections</p>
                </div>
                <div className="overview-track-actions">
                  {next ? (
                    <button className="overview-continue" onClick={() => onOpen(next, trackId)}>{done ? 'Continue' : 'Start'}: {conceptMap[next].title} <ArrowRight size={15} /></button>
                  ) : (
                    <span className="overview-complete"><Check size={15} /> Track complete</span>
                  )}
                  <button className="overview-open-track" onClick={() => onShowTrack(trackId)}>Step-by-step list</button>
                </div>
                <div className="overview-meter" aria-hidden="true"><span style={{ width: `${(100 * done) / order.length}%` }} /></div>
              </header>
              <ol className="overview-sections">
                {track.sections.map((section, index) => {
                  const sectionDone = section.concepts.filter(isDone).length;
                  const key = sectionKey(trackId, section);
                  return (
                    <li className={`overview-section${sectionDone === section.concepts.length ? ' complete' : ''}`} key={section.title}>
                      <div className="overview-section-head">
                        <span className="overview-section-number">{index + 1}</span>
                        <h4>{section.title}</h4>
                        <span className="overview-section-count">{sectionDone}/{section.concepts.length}</span>
                      </div>
                      <ul className="overview-pages">
                        {section.concepts.map((id) => (
                          <li key={id}>
                            <button className={isDone(id) ? 'done' : ''} onClick={() => onOpen(id, trackId)}>
                              <span className="overview-check" aria-hidden="true">{isDone(id) && <Check size={12} />}</span>
                              {conceptMap[id].title}
                              {isDone(id) && <span className="sr-only"> (done)</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                      {homework[key] && (
                        <button className="overview-homework" onClick={() => onOpenHomework(key)}><ClipboardList size={14} /> Homework: {homework[key].problems.length} problems</button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </section>
  );
}
