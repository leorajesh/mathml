import React from 'react';
import { figures } from '../data/figures.js';
import { MML_BOOK } from '../data/mmlReferences.js';

// Static explanatory figures, drawn for this site as SVG. Each panel maps its own math
// coordinates to pixels, with the same scale on both axes so right angles look right.

function panel(originX, originY, unit) {
  return {
    x: (value) => originX + value * unit,
    y: (value) => originY - value * unit,
    p: (point) => `${originX + point[0] * unit},${originY - point[1] * unit}`,
    unit,
  };
}

const arrowColors = { blue: '#3268a8', rust: '#d95d39', teal: '#2f7d80', ink: '#2f3436' };

function Arrow({ from, to, color = 'ink', variant = '' }) {
  return <line className={`fig-vector ${color} ${variant}`} x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} markerEnd={`url(#fig-arrow-${color})`} />;
}

function Axes({ view, xMin, xMax, yMin, yMax, xLabel, yLabel }) {
  return (
    <g className="fig-axes">
      <line x1={view.x(xMin)} y1={view.y(0)} x2={view.x(xMax)} y2={view.y(0)} />
      <line x1={view.x(0)} y1={view.y(yMin)} x2={view.x(0)} y2={view.y(yMax)} />
      {xLabel && <text x={view.x(xMax) - 4} y={view.y(0) + 16} textAnchor="end">{xLabel}</text>}
      {yLabel && <text x={view.x(0) + 6} y={view.y(yMax) + 12}>{yLabel}</text>}
    </g>
  );
}

function Markers() {
  return (
    <defs>
      {Object.entries(arrowColors).map(([name, color]) => (
        <marker key={name} id={`fig-arrow-${name}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      ))}
    </defs>
  );
}

function RowColumnPicture() {
  const left = panel(70, 230, 36);
  const right = panel(400, 200, 36);
  const line = (view, f, from, to) => `M ${view.x(from)} ${view.y(f(from))} L ${view.x(to)} ${view.y(f(to))}`;
  return (
    <>
      <text className="fig-heading" x="150" y="24" textAnchor="middle">Row picture</text>
      <Axes view={left} xMin={-1} xMax={4.6} yMin={-1.4} yMax={5.4} xLabel="a" yLabel="b" />
      <path className="fig-line-a" d={line(left, (a) => 5 - 2 * a, 0, 3.2)} />
      <path className="fig-line-b" d={line(left, (a) => a - 1, 0, 4.5)} />
      <text className="fig-label blue" x={left.x(0.75)} y={left.y(4.2)}>2a + b = 5</text>
      <text className="fig-label rust" x={left.x(3.4)} y={left.y(2.9)}>a - b = 1</text>
      <circle className="fig-dot" cx={left.x(2)} cy={left.y(1)} r="6" />
      <text className="fig-label" x={left.x(2) + 10} y={left.y(1) + 20}>(2, 1)</text>

      <text className="fig-heading" x="490" y="24" textAnchor="middle">Column picture</text>
      <Axes view={right} xMin={-0.6} xMax={6} yMin={-1.4} yMax={3.6} />
      <Arrow from={[right.x(0), right.y(0)]} to={[right.x(4), right.y(2)]} color="blue" />
      <Arrow from={[right.x(4), right.y(2)]} to={[right.x(5), right.y(1)]} color="rust" />
      <Arrow from={[right.x(0), right.y(0)]} to={[right.x(5), right.y(1)]} color="ink" variant="thin" />
      <text className="fig-label blue" x={right.x(1.2)} y={right.y(1.5)}>2 × [2, 1]</text>
      <text className="fig-label rust" x={right.x(4.7)} y={right.y(2.1)}>1 × [1, -1]</text>
      <text className="fig-label" x={right.x(2.6)} y={right.y(0.1) + 22}>b = [5, 1]</text>
    </>
  );
}

// Point on the boundary of a set where the quadratic loss (p - c)^T H (p - c) is smallest.
function closestOnBoundary(boundary, center, h) {
  let best = null;
  for (let index = 0; index <= 3600; index += 1) {
    const point = boundary((index / 3600) * 2 * Math.PI);
    const dx = point[0] - center[0];
    const dy = point[1] - center[1];
    const loss = h[0] * dx * dx + h[1] * dy * dy;
    if (!best || loss < best.loss) best = { point, loss };
  }
  return best;
}

function L1L2Balls() {
  const center = [0.4, 2.3];
  const h = [1, 0.35];
  const diamond = (t) => {
    const c = Math.cos(t);
    const s = Math.sin(t);
    const scale = 1 / (Math.abs(c) + Math.abs(s));
    return [c * scale, s * scale];
  };
  const circle = (t) => [Math.cos(t), Math.sin(t)];
  const views = [
    { view: panel(160, 238, 40), title: 'L1 ball (lasso)', boundary: diamond, shape: (v) => <polygon className="fig-region" points={[[1, 0], [0, 1], [-1, 0], [0, -1]].map(v.p).join(' ')} />, note: 'touches at a corner: weight 1 = 0' },
    { view: panel(480, 238, 40), title: 'L2 ball (ridge)', boundary: circle, shape: (v) => <circle className="fig-region" cx={v.x(0)} cy={v.y(0)} r={v.unit} />, note: 'touches off the axes: both weights nonzero' },
  ];
  return (
    <>
      {views.map(({ view, title, boundary, shape, note }) => {
        const touch = closestOnBoundary(boundary, center, h);
        const levels = [touch.loss, touch.loss * 0.45, touch.loss * 0.12];
        return (
          <g key={title}>
            <text className="fig-heading" x={view.x(-2.2)} y="24">{title}</text>
            <Axes view={view} xMin={-1.8} xMax={2.6} yMin={-1.2} yMax={4.2} xLabel="weight 1" yLabel="weight 2" />
            {shape(view)}
            {levels.map((level, index) => <ellipse key={level} className={index === 0 ? 'fig-contour strong' : 'fig-contour'} cx={view.x(center[0])} cy={view.y(center[1])} rx={Math.sqrt(level / h[0]) * view.unit} ry={Math.sqrt(level / h[1]) * view.unit} />)}
            <circle className="fig-dot small" cx={view.x(center[0])} cy={view.y(center[1])} r="4" />
            <text className="fig-label" x={view.x(center[0]) + 8} y={view.y(center[1]) - 6}>least squares</text>
            <circle className="fig-dot" cx={view.x(touch.point[0])} cy={view.y(touch.point[1])} r="6" />
            <text className="fig-label rust" x={view.x(0.3)} y="304" textAnchor="middle">{note}</text>
          </g>
        );
      })}
    </>
  );
}

function ProjectionPlane() {
  // Orthographic view: the plane's normal points almost straight up the page, and the camera looks
  // down on the plane at a shallow angle, so the plane shows as a flat parallelogram.
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const unitVector = (v) => v.map((x) => x / Math.sqrt(dot(v, v)));
  const n = unitVector([-1, -1, 1]);
  const q1 = unitVector([1, 0, 1]);
  const q2 = [n[1] * q1[2] - n[2] * q1[1], n[2] * q1[0] - n[0] * q1[2], n[0] * q1[1] - n[1] * q1[0]];
  const tilt = (38 * Math.PI) / 180;
  const up = [0, 1, 2].map((k) => Math.cos(tilt) * n[k] + Math.sin(tilt) * q2[k]);
  const raw = (p) => [dot(p, q1), dot(p, up)];
  const combo = (a, b) => [a, b, a + b];
  const corners3 = [combo(-0.6, -0.6), combo(2.8, -0.6), combo(2.8, 3.6), combo(-0.6, 3.6)];
  const all = [...corners3, [1, 2, 6], [0, 0, 0]].map(raw);
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const unit = Math.min(420 / (maxX - minX), 250 / (maxY - minY));
  const to2d = (p) => { const [x, y] = raw(p); return [60 + (x - minX) * unit, 290 - (y - minY) * unit]; };
  const corners = corners3.map(to2d);
  const target = to2d([1, 2, 6]);
  const foot = to2d([2, 3, 5]);
  const zero = to2d([0, 0, 0]);
  const e = [-1, -1, 1].map((v) => v / Math.sqrt(3));
  const back = unitVector([-2, -3, -5]);
  const s = 0.5;
  const corner = [[2 + s * e[0], 3 + s * e[1], 5 + s * e[2]], [2 + s * (e[0] + back[0]), 3 + s * (e[1] + back[1]), 5 + s * (e[2] + back[2])], [2 + s * back[0], 3 + s * back[1], 5 + s * back[2]]].map(to2d);
  return (
    <>
      <polygon className="fig-region" points={corners.map((p) => p.join(',')).join(' ')} />
      <text className="fig-label teal" x={Math.max(...corners.map((c) => c[0])) - 16} y={Math.min(...corners.map((c) => c[1])) + 20} textAnchor="end">subspace U</text>
      <Arrow from={zero} to={to2d([1, 0, 1])} color="ink" variant="thin" /><Arrow from={zero} to={to2d([0, 1, 1])} color="ink" variant="thin" />
      <text className="fig-label" x={to2d([1, 0, 1])[0] + 4} y={to2d([1, 0, 1])[1] + 16}>b1</text>
      <text className="fig-label" x={to2d([0, 1, 1])[0] - 6} y={to2d([0, 1, 1])[1] - 6} textAnchor="end">b2</text>
      <Arrow from={zero} to={target} color="blue" />
      <Arrow from={zero} to={foot} color="rust" />
      <line className="fig-error" x1={foot[0]} y1={foot[1]} x2={target[0]} y2={target[1]} />
      <polyline className="fig-right-angle" points={corner.map((p) => p.join(',')).join(' ')} />
      <circle className="fig-dot small" cx={zero[0]} cy={zero[1]} r="4" />
      <text className="fig-label" x={zero[0] - 8} y={zero[1] + 4} textAnchor="end">0</text>
      <text className="fig-label blue" x={target[0] + 10} y={target[1] - 4}>x (target)</text>
      <text className="fig-label rust" x={foot[0] + 14} y={foot[1] + 18}>projection: closest point in U</text>
      <text className="fig-label berry" x={Math.max(foot[0], target[0]) + 12} y={(foot[1] + target[1]) / 2}>error, perpendicular to U</text>
    </>
  );
}

function SvdCircleEllipse() {
  const sigma = [2, 0.7];
  const vAngle = (35 * Math.PI) / 180;
  const wAngle = (60 * Math.PI) / 180;
  const rotate = ([x, y], angle) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
  const v1 = [Math.cos(vAngle), Math.sin(vAngle)];
  const v2 = [-Math.sin(vAngle), Math.cos(vAngle)];
  const stages = [
    { title: 'unit circle', a: v1, b: v2, labels: ['v1', 'v2'], rx: 1, ry: 1, angle: 0 },
    { title: 'after V^T', a: [1, 0], b: [0, 1], labels: ['e1', 'e2'], rx: 1, ry: 1, angle: 0 },
    { title: 'after Sigma', a: [sigma[0], 0], b: [0, sigma[1]], labels: ['σ1 e1', 'σ2 e2'], rx: sigma[0], ry: sigma[1], angle: 0 },
    { title: 'after W', a: rotate([sigma[0], 0], wAngle), b: rotate([0, sigma[1]], wAngle), labels: ['σ1 w1', 'σ2 w2'], rx: sigma[0], ry: sigma[1], angle: wAngle },
  ];
  const steps = ['V^T: rotate', 'Sigma: stretch', 'W: rotate'];
  return (
    <>
      {stages.map((stage, index) => {
        const view = panel(80 + index * 160, 160, 36);
        return (
          <g key={stage.title}>
            <text className="fig-heading" x={view.x(0)} y="40" textAnchor="middle">{stage.title}</text>
            <Axes view={view} xMin={-2.1} xMax={2.1} yMin={-2.6} yMax={2.6} />
            <ellipse className="fig-region" cx={view.x(0)} cy={view.y(0)} rx={stage.rx * view.unit} ry={stage.ry * view.unit} transform={`rotate(${(-stage.angle * 180) / Math.PI} ${view.x(0)} ${view.y(0)})`} />
            <Arrow from={[view.x(0), view.y(0)]} to={[view.x(stage.a[0]), view.y(stage.a[1])]} color="blue" />
            <Arrow from={[view.x(0), view.y(0)]} to={[view.x(stage.b[0]), view.y(stage.b[1])]} color="rust" />
            <text className="fig-label blue" x={view.x(stage.a[0]) + 4} y={view.y(stage.a[1]) - 6}>{stage.labels[0]}</text>
            <text className="fig-label rust" x={view.x(stage.b[0]) + 4} y={view.y(stage.b[1]) - 6}>{stage.labels[1]}</text>
            {index < 3 && <text className="fig-step" x={view.x(0) + 80} y="290" textAnchor="middle">{steps[index]} →</text>}
          </g>
        );
      })}
    </>
  );
}

function FourSubspaces() {
  const box = (x, title) => <g><rect className="fig-box" x={x} y="40" width="240" height="250" rx="14" /><text className="fig-heading" x={x + 120} y="30" textAnchor="middle">{title}</text></g>;
  return (
    <>
      {box(20, 'inputs: R^n')}
      {box(380, 'outputs: R^m')}
      <g transform="translate(140 165)">
        <rect className="fig-space teal" x="-10" y="-100" width="110" height="100" rx="6" />
        <rect className="fig-space grey" x="-100" y="0" width="90" height="100" rx="6" />
        <text className="fig-label" x="45" y="-60" textAnchor="middle">row space</text>
        <text className="fig-label" x="45" y="-42" textAnchor="middle">dim r</text>
        <text className="fig-label" x="-55" y="40" textAnchor="middle">null space</text>
        <text className="fig-label" x="-55" y="58" textAnchor="middle">dim n - r</text>
        <polyline className="fig-right-angle" points="-10,-16 6,-16 6,0" />
      </g>
      <g transform="translate(500 165)">
        <rect className="fig-space teal" x="-100" y="-100" width="110" height="100" rx="6" />
        <rect className="fig-space grey" x="10" y="0" width="90" height="100" rx="6" />
        <text className="fig-label" x="-45" y="-60" textAnchor="middle">column space</text>
        <text className="fig-label" x="-45" y="-42" textAnchor="middle">dim r</text>
        <text className="fig-label" x="55" y="40" textAnchor="middle">left null space</text>
        <text className="fig-label" x="55" y="58" textAnchor="middle">dim m - r</text>
        <polyline className="fig-right-angle" points="-6,-16 10,-16 10,0" />
        <circle className="fig-dot" cx="10" cy="0" r="5" />
        <text className="fig-label" x="18" y="-6">0</text>
      </g>
      <Arrow from={[245, 105]} to={[400, 105]} color="teal" />
      <text className="fig-label teal" x="322" y="95" textAnchor="middle">A: one-to-one</text>
      <Arrow from={[95, 250]} to={[505, 170]} color="ink" variant="dashed" />
      <text className="fig-label" x="300" y="232" textAnchor="middle">A x = 0</text>
    </>
  );
}

function descentPath(momentum, gamma, steps) {
  const kappa = 20;
  let point = [-8, 2];
  let previous = point;
  const path = [point];
  for (let step = 0; step < steps; step += 1) {
    const next = [point[0] - gamma * point[0] + momentum * (point[0] - previous[0]), point[1] - gamma * kappa * point[1] + momentum * (point[1] - previous[1])];
    previous = point;
    point = next;
    path.push(point);
  }
  return path;
}

function GdZigzag() {
  const view = panel(320, 160, 32);
  const kappa = 20;
  const plain = descentPath(0, 0.09, 25);
  const heavy = descentPath(0.5, 0.09, 25);
  const toPath = (path) => path.map((point, index) => `${index ? 'L' : 'M'} ${view.x(point[0])} ${view.y(point[1])}`).join(' ');
  return (
    <>
      {[1, 2.5, 5, 8].map((level) => <ellipse key={level} className="fig-contour" cx={view.x(0)} cy={view.y(0)} rx={level * view.unit} ry={(level / Math.sqrt(kappa)) * view.unit} />)}
      <path className="fig-path plain" d={toPath(plain)} />
      <path className="fig-path momentum" d={toPath(heavy)} />
      <circle className="fig-dot small" cx={view.x(-8)} cy={view.y(2)} r="5" />
      <text className="fig-label" x={view.x(-8) - 8} y={view.y(2) - 8} textAnchor="end">start</text>
      <circle className="fig-dot" cx={view.x(0)} cy={view.y(0)} r="5" />
      <text className="fig-label" x={view.x(0) + 8} y={view.y(0) + 20}>minimum</text>
      <text className="fig-label" x="30" y="296">grey: gradient descent</text>
      <text className="fig-label rust" x="250" y="296">orange: with momentum (alpha = 0.5)</text>
    </>
  );
}

function LagrangeTangent() {
  const view = panel(300, 210, 110);
  const good = [0.5, 0.5];
  const bad = [1.25, -0.25];
  const gradient = (point, scale) => [view.x(point[0] + scale * point[0]), view.y(point[1] + scale * point[1])];
  return (
    <>
      <Axes view={view} xMin={-1.3} xMax={1.9} yMin={-0.8} yMax={1.6} xLabel="x" yLabel="y" />
      {[0.35, Math.SQRT1_2, Math.hypot(1.25, 0.25)].map((radius) => <circle key={radius} className={Math.abs(radius - Math.SQRT1_2) < 1e-9 ? 'fig-contour strong' : 'fig-contour'} cx={view.x(0)} cy={view.y(0)} r={radius * view.unit} />)}
      <line className="fig-constraint" x1={view.x(-0.5)} y1={view.y(1.5)} x2={view.x(1.75)} y2={view.y(-0.75)} />
      <text className="fig-label teal" x={view.x(1.62)} y={view.y(-0.62)}>x + y = 1</text>
      <Arrow from={[view.x(good[0]), view.y(good[1])]} to={gradient(good, 0.6)} color="blue" />
      <Arrow from={[view.x(good[0]), view.y(good[1])]} to={[view.x(good[0] + 0.3), view.y(good[1] + 0.3)]} color="rust" variant="thin" />
      <circle className="fig-dot" cx={view.x(good[0])} cy={view.y(good[1])} r="6" />
      <text className="fig-label" x={view.x(good[0]) - 12} y={view.y(good[1]) - 12} textAnchor="end">minimum (1/2, 1/2)</text>
      <text className="fig-label" x={view.x(bad[0]) - 12} y={view.y(bad[1]) + 20} textAnchor="end">not optimal</text>
      <Arrow from={[view.x(bad[0]), view.y(bad[1])]} to={gradient(bad, 0.35)} color="blue" />
      <Arrow from={[view.x(bad[0]), view.y(bad[1])]} to={[view.x(bad[0] + 0.3), view.y(bad[1] + 0.3)]} color="rust" variant="thin" />
      <circle className="fig-dot grey" cx={view.x(bad[0])} cy={view.y(bad[1])} r="6" />
      <text className="fig-label blue" x="440" y="40">blue: grad f</text>
      <text className="fig-label rust" x="440" y="60">orange: grad h</text>
    </>
  );
}

function ComputationGraphFigure() {
  const boxes = [
    { label: 'x', sub: 'input', back: null },
    { label: 'z1 = W1x + b1', sub: 'pre-activation', back: "dL/dz1 = dL/dh ⊙ σ'(z1)" },
    { label: 'h = σ(z1)', sub: 'hidden layer', back: 'dL/dh = W2ᵀ dL/dŷ' },
    { label: 'ŷ = W2h + b2', sub: 'output', back: 'dL/dŷ' },
    { label: 'L(ŷ, y)', sub: 'loss', back: 'dL/dL = 1' },
  ];
  const width = 104;
  const gap = 26;
  const left = (index) => 8 + index * (width + gap);
  const top = 64;
  const height = 56;
  return (
    <>
      <text className="fig-label blue" x="8" y="40">forward: compute and store each value →</text>
      {boxes.map((box, index) => (
        <g key={box.label}>
          <rect className="fig-box" x={left(index)} y={top} width={width} height={height} rx="10" />
          <text className="fig-label" x={left(index) + width / 2} y={top + 24} textAnchor="middle">{box.label}</text>
          <text className="fig-step" x={left(index) + width / 2} y={top + 43} textAnchor="middle">{box.sub}</text>
          {index < boxes.length - 1 && <Arrow from={[left(index) + width + 2, top + 16]} to={[left(index + 1) - 3, top + 16]} color="blue" variant="small" />}
          {index < boxes.length - 1 && <Arrow from={[left(index + 1) - 2, top + 42]} to={[left(index) + width + 3, top + 42]} color="rust" variant="small" />}
          {box.back && <text className="fig-label rust" x={left(index) + width / 2} y={index % 2 ? 150 : 170} textAnchor="middle">{box.back}</text>}
        </g>
      ))}
      <Arrow from={[left(1) + width / 2, 178]} to={[left(1) + width / 2, 222]} color="rust" variant="small" />
      <Arrow from={[left(3) + width / 2, 178]} to={[left(3) + width / 2, 222]} color="rust" variant="small" />
      <text className="fig-label rust" x={left(1) + width / 2} y="242" textAnchor="middle">dL/dW1 = (dL/dz1) xᵀ</text>
      <text className="fig-label rust" x={left(3) + width / 2} y="242" textAnchor="middle">dL/dW2 = (dL/dŷ) hᵀ</text>
      <text className="fig-label rust" x="8" y="288">← backward: multiply by local derivatives, from the loss toward the input</text>
    </>
  );
}

const drawings = {
  'computation-graph': ComputationGraphFigure,
  'row-column-picture': RowColumnPicture,
  'l1-l2-balls': L1L2Balls,
  'projection-plane': ProjectionPlane,
  'svd-circle-ellipse': SvdCircleEllipse,
  'four-subspaces': FourSubspaces,
  'gd-zigzag': GdZigzag,
  'lagrange-tangent': LagrangeTangent,
};

export function ConceptFigure({ id }) {
  const meta = figures[id];
  const Drawing = drawings[id];
  if (!meta || !Drawing) return null;
  const titleId = `figure-${id}-title`;
  return (
    <figure className="concept-figure">
      <svg viewBox="0 0 640 310" role="img" aria-labelledby={titleId}>
        <title id={titleId}>{meta.alt}</title>
        <Markers />
        <Drawing />
      </svg>
      <figcaption>
        <strong>{meta.title}.</strong> {meta.caption}
        {meta.mml && <span className="figure-compare"> Compare with the book: {MML_BOOK.title}, {meta.mml}.</span>}
      </figcaption>
    </figure>
  );
}
