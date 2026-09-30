import React from 'react';
import { Globe2, Lightbulb, MousePointerClick } from 'lucide-react';
import { plainGuide } from '../data/plainGuide.js';

// "Start here": the page's idea in plain words before any formula, in the style of the hands-on
// demos: the everyday question, the idea in one sentence, one thing to try with the graph, and
// where you meet it in real life.
export function StartHere({ conceptId }) {
  const guide = plainGuide[conceptId];
  if (!guide) return null;
  function jumpToGraph() {
    const graph = document.querySelector('.concept-page .graph-card');
    if (!graph) return;
    graph.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    graph.classList.add('graph-flash');
    setTimeout(() => graph.classList.remove('graph-flash'), 1600);
  }
  return (
    <section className="start-here" aria-label="Start here">
      <p className="start-here-kicker">Start here · in plain words</p>
      <h2 className="start-here-question">{guide.question}</h2>
      <div className="start-here-grid">
        <div className="start-here-item idea">
          <p className="start-here-label"><Lightbulb size={15} aria-hidden="true" /> The idea</p>
          <p>{guide.idea}</p>
        </div>
        <div className="start-here-item try">
          <p className="start-here-label"><MousePointerClick size={15} aria-hidden="true" /> Try this</p>
          <p>{guide.tryIt}</p>
          <button className="start-here-jump" onClick={jumpToGraph}>Go to the graph</button>
        </div>
        <div className="start-here-item world">
          <p className="start-here-label"><Globe2 size={15} aria-hidden="true" /> In real life</p>
          <p>{guide.realWorld}</p>
        </div>
      </div>
    </section>
  );
}
