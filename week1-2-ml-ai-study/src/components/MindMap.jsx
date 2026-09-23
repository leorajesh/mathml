import { useMemo, useState } from 'react';
import { conceptMap, mindMapEdges } from '../data/concepts.js';
import { conceptLevel, recommendedPaths } from '../data/studyGuidance.js';

const groupColors = {
  Problem: '#d95d39',
  Representation: '#2f7d80',
  Model: '#3268a8',
  Loss: '#b23a48',
  Optimization: '#6d5a9c',
  Complexity: '#99722b',
  Generalization: '#3f7a3b',
};

const domains = [
  {
    id: 'overview-foundations',
    title: 'Introduction to ML Modelling',
    group: 'Problem',
    summary: 'Input-output pairs, feature representations, hypothesis classes, error functions, learning algorithms, and generalization.',
    concepts: ['ml-workflow', 'sets-functions', 'feature-vectors'],
  },
  {
    id: 'overview-linear-algebra',
    title: 'Matrices, Linear Systems, and Vector Spaces',
    group: 'Representation',
    summary: 'Matrix operations, linear systems, REF/RREF, vector spaces, bases, dimension, subspaces, and change of basis.',
    concepts: ['matrix-operations', 'matrix-multiplication-outer-product', 'matrix-systems', 'gaussian-elimination', 'solution-structure', 'vector-spaces-bases', 'linear-independence-subspaces', 'linear-transformations', 'transformation-matrix', 'composition-of-transformations', 'change-of-basis', 'invertible-transformations', 'rank-inverse-determinant', 'determinants-cofactor-row-ops'],
  },
  {
    id: 'overview-classification',
    title: 'Linear Classification: Perceptron and Hinge Loss',
    group: 'Model',
    summary: 'Linear classifiers through origin, linearly separable examples, perceptron learning, zero-one loss, and hinge loss.',
    concepts: ['linear-classifier', 'linear-classifier-through-origin', 'linear-separability', 'perceptron', 'perceptron-convergence', 'empirical-risk-zero-one', 'hinge-loss'],
  },
  {
    id: 'overview-optimization',
    title: 'Gradient Descent and Stochastic Sub-Gradient Descent',
    group: 'Optimization',
    summary: 'Convex surrogate criteria, gradients, sub-gradients, learning rates, and stochastic training updates.',
    concepts: ['convexity-surrogate-losses', 'gradient-descent', 'stochastic-subgradient-descent'],
  },
  {
    id: 'overview-regression',
    title: 'Linear Regression and Ridge Regression',
    group: 'Loss',
    summary: 'Linear regression models, least-squares criteria, gradient descent training, polynomial features, ridge regression, and regularization.',
    concepts: ['linear-regression', 'least-squares-normal-equation', 'gradient-descent', 'polynomial-regression', 'ridge-regularization', 'lasso-elastic-net'],
  },
  {
    id: 'overview-generalization',
    title: 'Generalization and Logistic Regression',
    group: 'Generalization',
    summary: 'Overfitting, generalization, train-test evaluation, logistic regression, logistic cost, prediction, and classification metrics.',
    concepts: ['model-complexity-generalization', 'validation-cross-validation', 'logistic-regression', 'logistic-loss', 'classification-metrics'],
  },
  {
    id: 'overview-advanced-math',
    title: 'Matrix Decompositions Preview',
    group: 'Complexity',
    summary: 'Eigenvalues, eigenvectors, diagonalization, spectral theorem, Cholesky, LU, and singular value decomposition as later-course structure.',
    concepts: ['affine-dimensionality-reduction', 'eigenvalues-eigenvectors', 'diagonalization-pagerank', 'orthogonality-spectral-theorem', 'matrix-decompositions'],
  },
];

const overviewEdges = [
  ['overview-foundations', 'overview-linear-algebra'],
  ['overview-foundations', 'overview-classification'],
  ['overview-foundations', 'overview-regression'],
  ['overview-linear-algebra', 'overview-regression'],
  ['overview-classification', 'overview-optimization'],
  ['overview-optimization', 'overview-regression'],
  ['overview-regression', 'overview-generalization'],
  ['overview-generalization', 'overview-advanced-math'],
  ['overview-linear-algebra', 'overview-advanced-math'],
];

function wrapTitle(title, maxLength = 22) {
  const words = title.split(' ');
  const lines = [];
  let current = '';
  words.forEach((word) => {
    const next = `${current} ${word}`.trim();
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function makeClusterLayout(concepts) {
  const columns = concepts.length > 10 ? 4 : 3;
  const nodeWidth = 210;
  const nodeHeight = 88;
  const gapX = 250;
  const gapY = 135;
  const left = 60;
  const top = 58;
  const nodes = concepts.map((id, index) => ({
    id,
    x: left + (index % columns) * gapX,
    y: top + Math.floor(index / columns) * gapY,
    width: nodeWidth,
    height: nodeHeight,
  }));
  const rows = Math.ceil(concepts.length / columns);
  return { nodes, width: left * 2 + columns * nodeWidth + (columns - 1) * (gapX - nodeWidth), height: top * 2 + rows * nodeHeight + Math.max(0, rows - 1) * (gapY - nodeHeight) };
}

function connectionPoint(node, side) {
  const offset = 6;
  const centerX = node.x + node.width / 2;
  const centerY = node.y + node.height / 2;
  const points = {
    left: { x: node.x - offset, y: centerY, vx: -1, vy: 0 },
    right: { x: node.x + node.width + offset, y: centerY, vx: 1, vy: 0 },
    top: { x: centerX, y: node.y - offset, vx: 0, vy: -1 },
    bottom: { x: centerX, y: node.y + node.height + offset, vx: 0, vy: 1 },
  };
  return points[side];
}

function edgePath(a, b) {
  const aCenter = { x: a.x + a.width / 2, y: a.y + a.height / 2 };
  const bCenter = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  const dx = bCenter.x - aCenter.x;
  const dy = bCenter.y - aCenter.y;
  const horizontal = Math.abs(dx) >= Math.abs(dy) * 0.8;
  const sourceSide = horizontal ? (dx >= 0 ? 'right' : 'left') : (dy >= 0 ? 'bottom' : 'top');
  const targetSide = horizontal ? (dx >= 0 ? 'left' : 'right') : (dy >= 0 ? 'top' : 'bottom');
  const start = connectionPoint(a, sourceSide);
  const end = connectionPoint(b, targetSide);
  const mainDistance = horizontal ? Math.abs(end.x - start.x) : Math.abs(end.y - start.y);
  const curve = Math.max(12, Math.min(130, mainDistance * 0.5));
  const c1 = { x: start.x + start.vx * curve, y: start.y + start.vy * curve };
  const c2 = { x: end.x + end.vx * curve, y: end.y + end.vy * curve };
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

export function MindMap({ onSelect }) {
  const [domainId, setDomainId] = useState(null);
  const selectedDomain = domains.find((domain) => domain.id === domainId);
  const layout = useMemo(() => selectedDomain ? makeClusterLayout(selectedDomain.concepts) : null, [selectedDomain]);
  const nodeMap = useMemo(() => layout ? Object.fromEntries(layout.nodes.map((node) => [node.id, node])) : {}, [layout]);
  const visibleEdges = selectedDomain
    ? mindMapEdges.filter(([from, to]) => nodeMap[from] && nodeMap[to])
    : [];

  return (
    <section className="map-section map-fullscreen" aria-label="Drill-down concept mind map">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Drill-down concept map</p>
          <h2>{selectedDomain ? selectedDomain.title : 'Overall Learning Map'}</h2>
        </div>
        <div className="legend">
          {Object.entries(groupColors).map(([group, color]) => <span key={group}><i style={{ backgroundColor: color }} />{group}</span>)}
        </div>
      </div>

      {!selectedDomain ? (
        <OverviewMap onOpenDomain={setDomainId} onSelect={onSelect} />
      ) : (
        <FocusedMap domain={selectedDomain} layout={layout} nodeMap={nodeMap} edges={visibleEdges} onBack={() => setDomainId(null)} onSelect={onSelect} />
      )}
    </section>
  );
}

function OverviewMap({ onOpenDomain, onSelect }) {
  const domainMap = Object.fromEntries(domains.map((domain, index) => [domain.id, {
    ...domain,
    x: 74 + (index % 4) * 255,
    y: 80 + Math.floor(index / 4) * 210,
    width: 220,
    height: 148,
  }]));

  return (
    <div className="overview-map">
      <svg className="overview-svg" viewBox="0 0 1080 480" role="img" aria-label="Overall concept domains">
        <defs>
          <marker id="overviewArrow" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="10" markerHeight="10" orient="auto">
            <path d="M 1 1 L 11 6 L 1 11 z" fill="#2f3436" />
          </marker>
        </defs>
        {overviewEdges.map(([from, to]) => {
          const a = domainMap[from];
          const b = domainMap[to];
          return <path key={`${from}-${to}`} className="map-edge overview-edge" d={edgePath(a, b)} markerEnd="url(#overviewArrow)" />;
        })}
        {domains.map((domain) => {
          const node = domainMap[domain.id];
          const lines = wrapTitle(domain.title, 20);
          const fundamentalCount = domain.concepts.filter((id) => conceptLevel(id) === 'Fundamental').length;
          return (
            <g key={domain.id} className="overview-node" transform={`translate(${node.x}, ${node.y})`} onClick={() => onOpenDomain(domain.id)} role="button" tabIndex="0">
              <rect width={node.width} height={node.height} rx="10" fill="#fffdf8" stroke={groupColors[domain.group]} strokeWidth="3" />
              <text x="16" y="26" className="node-group" fill={groupColors[domain.group]}>{domain.group}</text>
              {lines.map((line, index) => <text key={line} x="16" y={58 + index * 18} className="overview-title">{line}</text>)}
              <text x="16" y="126" className="overview-count">{fundamentalCount} fundamental / {domain.concepts.length - fundamentalCount} advanced</text>
            </g>
          );
        })}
      </svg>
      <div className="overview-panel">
        <h3>Start Here</h3>
          <p>Open an outline area to see its concept sequence. From there, choose any concept to study it in detail.</p>
        <div className="overview-actions">
          <button onClick={() => onSelect('ml-workflow')}>Open ML Workflow</button>
          <button onClick={() => onSelect('linear-classifier')}>Open Classification</button>
          <button onClick={() => onSelect('matrix-systems')}>Open Linear Systems</button>
        </div>
      </div>
    </div>
  );
}

function FocusedMap({ domain, layout, nodeMap, edges, onBack, onSelect }) {
  const path = recommendedPaths[domain.id] ?? domain.concepts;

  return (
    <div className="focused-map-shell">
      <div className="cluster-toolbar">
        <button onClick={onBack}>Back to overall map</button>
        <p>{domain.summary}</p>
      </div>
      <div className="study-path">
        <h3>Concept Sequence</h3>
        <ol>
          {path.map((id) => <li key={id}><button onClick={() => onSelect(id)}>{conceptMap[id]?.title ?? id}</button><span>{conceptLevel(id)}</span></li>)}
        </ol>
      </div>
      <div className="map-scroll">
        <svg className="mind-map cluster-map" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={`${domain.title} sub-map`}>
          <defs>
            <marker id="clusterArrow" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="10" markerHeight="10" orient="auto">
              <path d="M 1 1 L 11 6 L 1 11 z" fill="#2f3436" />
            </marker>
          </defs>
          {edges.map(([from, to]) => <path key={`${from}-${to}`} className="map-edge" d={edgePath(nodeMap[from], nodeMap[to])} markerEnd="url(#clusterArrow)" />)}
          {layout.nodes.map((node) => {
            const concept = conceptMap[node.id];
            const lines = wrapTitle(concept.title, 24);
            const level = conceptLevel(node.id);
            const levelLabel = level === 'Fundamental' ? 'Base' : 'Adv';
            return (
              <g key={node.id} className="cluster-node" transform={`translate(${node.x}, ${node.y})`} onClick={() => onSelect(node.id)} role="button" tabIndex="0">
                <rect width={node.width} height={node.height} rx="9" fill="#fffdf8" stroke={groupColors[concept.group]} strokeWidth="3" />
                <text x="14" y="22" className="node-group" fill={groupColors[concept.group]}>{concept.group}</text>
                <g className={`level-pill ${level.toLowerCase()}`} transform={`translate(${node.width - 58}, 10)`}>
                  <rect width="44" height="18" rx="9" />
                  <text x="22" y="12" textAnchor="middle">{levelLabel}</text>
                </g>
                {lines.map((line, index) => <text key={line} x="14" y={48 + index * 16} className="cluster-title">{line}</text>)}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
