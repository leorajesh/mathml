import React from 'react';

const width = 640;
const height = 360;
const padding = 38;
const yMin = -5;
const yMax = 5;
// Geometric graphs (angles, rotations, perpendicular lines) use the same pixel scale on both axes,
// so the x range is widened to match the canvas shape; the others keep x in [-5, 5].
const EQUAL_X_HALF = (5 * (width - padding * 2)) / (height - padding * 2);
const EQUAL_ASPECT = new Set(['dotProduct', 'basis', 'transform', 'determinant', 'perceptron', 'eigen', 'spectral', 'decomposition', 'lineProjection', 'basisCoords', 'span', 'subspaceTest', 'linearBoundary', 'linearSystem', 'rowOpLines']);
// Set by ConceptGraph just before a graph is drawn; every sx() call happens synchronously inside that draw.
let xHalf = 5;

function sx(x) { return padding + ((x + xHalf) / (2 * xHalf)) * (width - padding * 2); }
function sy(y) { return height - padding - ((y - yMin) / (yMax - yMin)) * (height - padding * 2); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function linePath(points) { return points.map((point, index) => `${index ? 'L' : 'M'} ${sx(point.x)} ${sy(point.y)}`).join(' '); }
function circlePoint(point, className, label) { return <g><circle className={className} cx={sx(point.x)} cy={sy(point.y)} r="6" />{label && <text x={sx(point.x) + 8} y={sy(point.y) - 8}>{label}</text>}</g>; }

export function ConceptGraph({ graph }) {
  const initial = { ...graph.fixed, ...Object.fromEntries(graph.sliders.map((slider) => [slider.key, slider.value])) };
  const [values, setValues] = React.useState(initial);

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: Number(value) }));
  }

  function reset() {
    setValues(initial);
  }

  xHalf = EQUAL_ASPECT.has(graph.type) ? EQUAL_X_HALF : 5;
  const rendered = getGraphRender(graph.type, values);
  const canvas = renderCanvas(rendered.content, plotAxes[graph.type]);

  return (
    <div className="graph-card">
      <div className="graph-title-row">
        <h3>{graph.title}</h3>
      </div>
      <div className="graph-body">
        {canvas}
        <div className="graph-controls">
          <div className="slider-grid">
            {graph.sliders.map((slider) => (
              <label key={slider.key}>
                <span>{slider.label}: <strong>{values[slider.key].toFixed(slider.step < 1 ? 2 : 0)}</strong></span>
                <input type="range" min={slider.min} max={slider.max} step={slider.step} value={values[slider.key]} onChange={(event) => update(slider.key, event.target.value)} />
              </label>
            ))}
          </div>
          <button className="graph-reset" onClick={reset}>reset sliders</button>
          {rendered.readout.length > 0 && (
            <div className="graph-readout">
              {rendered.readout.map((line) => <p key={line}>{line}</p>)}
            </div>
          )}
        </div>
      </div>
      {graph.caption && <p className="graph-caption">{graph.caption}</p>}
    </div>
  );
}

// Graphs whose curves are rescaled to fit the canvas hide the default -4..4 ticks (they would show
// the wrong units) and label their axes in words instead.
const plotAxes = {
  sigmoid: { x: 'score s', y: 'probability (0 to 1)' },
  logLoss: { x: 'predicted probability h (0 to 1)', y: 'loss' },
  gradient: { x: 'theta', y: 'loss J(theta)' },
  stochasticGradient: { x: 'theta', y: 'loss J(theta)' },
  generalization: { x: 'model complexity', y: 'loss' },
  diagonalization: { x: '', y: 'size after k steps' },
  shrinkage: { x: 'penalty strength lambda (0 to 5)', y: 'fitted weight' },
  threshold: { x: 'predicted probability (0 to 1)', y: '' },
  workflow: { x: '', y: '' },
  venn: { x: '', y: '' },
  functionMap: { x: '', y: '' },
  kfold: { x: '', y: '' },
  pagerank: { x: '', y: 'probability of each page' },
  matrixFactors: { x: '', y: '' },
  convexChord: { x: 'x', y: 'f(x) (rescaled to fit)' },
  subgradient: { x: 'x', y: 'f(x) = |x|' },
};

function renderCanvas(content, axes) {
  const xTicks = xHalf > 5 ? [-8, -6, -4, -2, 2, 4, 6, 8] : [-4, -2, 2, 4];
  return (
    <svg className="plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Interactive concept graph">
      <rect className="plot-bg" x="0" y="0" width={width} height={height} rx="10" />
      {!axes && (
        <>
          <path className="axis" d={`M ${sx(-xHalf)} ${sy(0)} L ${sx(xHalf)} ${sy(0)}`} />
          <path className="axis" d={`M ${sx(0)} ${sy(yMin)} L ${sx(0)} ${sy(yMax)}`} />
          {xTicks.map((tick) => <g key={`x-${tick}`}><path className="tick" d={`M ${sx(tick)} ${sy(-0.12)} L ${sx(tick)} ${sy(0.12)}`} /><text x={sx(tick)} y={sy(0) + 18}>{tick}</text></g>)}
          {[-4, -2, 2, 4].map((tick) => <g key={`y-${tick}`}><path className="tick" d={`M ${sx(-0.12)} ${sy(tick)} L ${sx(0.12)} ${sy(tick)}`} /><text x={sx(0) + 8} y={sy(tick) + 4}>{tick}</text></g>)}
        </>
      )}
      {axes?.x && <text className="axis-label" x={width - padding} y={height - 12} textAnchor="end">{axes.x}</text>}
      {axes?.y && <text className="axis-label" x={14} y={padding - 14}>{axes.y}</text>}
      {content}
    </svg>
  );
}

function getGraphRender(type, values) {
  const rendered = renderGraph(type, values);
  if (rendered && typeof rendered === 'object' && 'content' in rendered) {
    return { content: rendered.content, readout: rendered.readout ?? [] };
  }
  return { content: rendered, readout: [] };
}

function renderGraph(type, values) {
  switch (type) {
    case 'workflow': return WorkflowGraph({ values });
    case 'dotProduct': return DotProductGraph({ values });
    case 'linearSystem': return LinearSystemGraph({ values });
    case 'basis': return BasisGraph({ values });
    case 'transform': return TransformGraph({ values });
    case 'determinant': return DeterminantGraph({ values });
    case 'linearBoundary': return LinearBoundaryGraph({ values });
    case 'perceptron': return PerceptronGraph({ values });
    case 'zeroOne': return LossCurveGraph({ values, mode: 'zeroOne' });
    case 'hinge': return LossCurveGraph({ values, mode: 'hinge' });
    case 'gradient': return GradientGraph({ values });
    case 'linearRegression': return LinearRegressionGraph({ values });
    case 'squaredLoss': return SquaredLossGraph({ values });
    case 'ridge': return RidgeGraph({ values });
    case 'generalization': return GeneralizationGraph({ values });
    case 'sigmoid': return SigmoidGraph({ values });
    case 'logLoss': return LogLossGraph({ values });
    case 'eigen': return EigenGraph({ values });
    case 'diagonalization': return DiagonalizationGraph({ values });
    case 'spectral': return SpectralGraph({ values });
    case 'decomposition': return DecompositionGraph({ values });
    case 'stochasticGradient': return StochasticGradientGraph({ values });
    case 'shrinkage': return ShrinkageGraph({ values });
    case 'threshold': return ThresholdGraph({ values });
    case 'venn': return VennGraph({ values });
    case 'functionMap': return FunctionMapGraph({ values });
    case 'span': return SpanGraph({ values });
    case 'subspaceTest': return SubspaceTestGraph({ values });
    case 'convexChord': return ConvexChordGraph({ values });
    case 'subgradient': return SubgradientGraph({ values });
    case 'kfold': return KFoldGraph({ values });
    case 'pagerank': return PageRankGraph({ values });
    case 'matrixFactors': return MatrixFactorsGraph({ values });
    case 'outerProduct': return OuterProductGraph({ values });
    case 'rowOpLines': return RowOpLinesGraph({ values });
    case 'lineProjection': return LineProjectionGraph({ values });
    case 'basisCoords': return BasisCoordsGraph({ values });
    case 'fitLine': return FitLineGraph({ values });
    default: return null;
  }
}

function WorkflowGraph({ values }) {
  const stages = ['Problem', 'Features', 'Model', 'Loss', 'Optimize', 'Generalize'];
  return <g>{stages.map((stage, index) => { const x = -4.5 + index * 1.8; const active = index <= values.stage; return <g key={stage}>{index > 0 && <path className="flow-line" d={`M ${sx(x - 1.2)} ${sy(0)} L ${sx(x - 0.55)} ${sy(0)}`} />}<circle className={active ? 'active-dot' : 'muted-dot'} cx={sx(x)} cy={sy(0)} r="18" /><text x={sx(x)} y={sy(-0.7)} textAnchor="middle">{stage}</text></g>; })}</g>;
}

function DotProductGraph({ values }) {
  const theta = { x: values.theta1, y: values.theta2 };
  const point = { x: values.x1, y: values.x2 };
  const score = values.theta1 * values.x1 + values.theta2 * values.x2;
  const nameA = values.labelA ?? 'theta';
  const nameB = values.labelB ?? 'x';
  const lengths = Math.hypot(theta.x, theta.y) * Math.hypot(point.x, point.y);
  const angle = lengths > 0 ? (Math.acos(clamp(score / lengths, -1, 1)) * 180) / Math.PI : null;
  return {
    content: <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(theta.x)} ${sy(theta.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(point.x)} ${sy(point.y)}`} />{circlePoint(point, 'point-b', nameB)}{circlePoint(theta, 'point-a', nameA)}<text className="graph-note" x="44" y="48">{nameA} dot {nameB} = {score.toFixed(2)}</text></g>,
    readout: [`|${nameA}| = ${Math.hypot(theta.x, theta.y).toFixed(2)}, |${nameB}| = ${Math.hypot(point.x, point.y).toFixed(2)}`, angle === null ? 'angle undefined (a zero vector)' : `angle = ${angle.toFixed(1)} degrees: ${Math.abs(score) < 1e-9 ? 'perpendicular' : score > 0 ? 'under 90, positive' : 'over 90, negative'}`],
  };
}

function LinearSystemGraph({ values }) {
  const line1 = [{ x: -xHalf, y: values.m1 * -xHalf + values.b1 }, { x: xHalf, y: values.m1 * xHalf + values.b1 }];
  const line2 = [{ x: -xHalf, y: values.m2 * -xHalf + values.b2 }, { x: xHalf, y: values.m2 * xHalf + values.b2 }];
  const parallel = values.m1 === values.m2;
  const x = parallel ? NaN : (values.b2 - values.b1) / (values.m1 - values.m2);
  const y = values.m1 * x + values.b1;
  const note = parallel ? (values.b1 === values.b2 ? 'same line: infinitely many solutions' : 'parallel lines: no solution') : `intersection (${x.toFixed(2)}, ${y.toFixed(2)})`;
  return { content: <g><path className="line-a" d={linePath(line1)} /><path className="line-b" d={linePath(line2)} />{!parallel && Math.abs(x) < 5 && Math.abs(y) < 5 && circlePoint({ x, y }, 'active-dot', 'solution')}<text className="graph-note" x="44" y="48">{note}</text></g>, readout: [] };
}

function BasisGraph({ values }) {
  const e1 = { x: 1, y: 0 };
  const e2 = { x: values.tilt, y: 1 };
  const v = { x: values.c1 * e1.x + values.c2 * e2.x, y: values.c1 * e1.y + values.c2 * e2.y };
  return <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(e1.x * values.c1)} ${sy(e1.y * values.c1)}`} /><path className="vector-b" d={`M ${sx(values.c1)} ${sy(0)} L ${sx(v.x)} ${sy(v.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(v.x)} ${sy(v.y)}`} />{circlePoint(v, 'active-dot', 'v')}</g>;
}

function TransformGraph({ values }) {
  const square = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
  // Optional shift (tx, ty) turns the linear map into an affine one.
  const tx = values.tx ?? 0;
  const ty = values.ty ?? 0;
  const transformed = square.map((p) => ({ x: values.scaleX * p.x + values.shear * p.y + tx, y: values.scaleY * p.y + ty }));
  const shifted = tx !== 0 || ty !== 0;
  return <g><path className="shape-original" d={linePath(square)} /><path className="shape-result" d={linePath(transformed)} />{('tx' in values) && circlePoint({ x: tx, y: ty }, 'active-dot', 'image of origin')}<text className="graph-note" x="44" y="48">A = [[{values.scaleX.toFixed(1)}, {values.shear.toFixed(1)}], [0, {values.scaleY.toFixed(1)}]]{('tx' in values) ? `, b = [${tx.toFixed(2)}, ${ty.toFixed(2)}]${shifted ? ' (affine)' : ' (linear)'}` : ''}</text></g>;
}

function DeterminantGraph({ values }) {
  const v1 = { x: values.a, y: values.c };
  const v2 = { x: values.b, y: values.d };
  const det = values.a * values.d - values.b * values.c;
  const poly = [{ x: 0, y: 0 }, v1, { x: v1.x + v2.x, y: v1.y + v2.y }, v2, { x: 0, y: 0 }];
  const nonzero = [values.a, values.b, values.c, values.d].some((entry) => entry !== 0);
  const rank = Math.abs(det) > 1e-9 ? 2 : nonzero ? 1 : 0;
  return {
    content: <g><path className="area-shape" d={linePath(poly)} /><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(v1.x)} ${sy(v1.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(v2.x)} ${sy(v2.y)}`} /><text className="graph-note" x="44" y="48">det = {det.toFixed(2)}</text></g>,
    readout: [`columns: [${values.a}, ${values.c}] and [${values.b}, ${values.d}]`, `rank ${rank}, nullity ${2 - rank}${rank < 2 ? ': a direction is flattened, not invertible' : ': invertible'}`],
  };
}

function LinearBoundaryGraph({ values }) {
  const basePoints = [{ x: -3, y: 2, yLabel: 1 }, { x: -1, y: 1, yLabel: 1 }, { x: 2, y: -2, yLabel: -1 }, { x: 3, y: 1, yLabel: -1 }, { x: 1, y: 3, yLabel: 1 }];
  // The extra negative point sits between positives, so no line can classify every point.
  const points = values.overlap ? [...basePoints, { x: -1.5, y: 2, yLabel: -1 }] : basePoints;
  const { theta1, theta2, bias } = values;
  const score = (p) => theta1 * p.x + theta2 * p.y + bias;
  const mistakes = points.filter((p) => p.yLabel * score(p) <= 0).length;
  const cells = [];
  for (let gx = -Math.ceil(xHalf); gx < Math.ceil(xHalf); gx += 0.5) {
    for (let gy = yMin; gy < yMax; gy += 0.5) {
      if (score({ x: gx + 0.25, y: gy + 0.25 }) > 0) cells.push(<rect key={`${gx},${gy}`} className="positive-region" x={sx(gx)} y={sy(gy + 0.5)} width={sx(gx + 0.5) - sx(gx)} height={sy(gy) - sy(gy + 0.5)} />);
    }
  }
  const norm = Math.hypot(theta1, theta2);
  let boundary = null;
  let arrow = null;
  if (norm > 0) {
    const foot = { x: (-bias * theta1) / (norm * norm), y: (-bias * theta2) / (norm * norm) };
    const along = { x: -theta2 / norm, y: theta1 / norm };
    boundary = [{ x: foot.x - 12 * along.x, y: foot.y - 12 * along.y }, { x: foot.x + 12 * along.x, y: foot.y + 12 * along.y }];
    arrow = { from: foot, to: { x: foot.x + (1.5 * theta1) / norm, y: foot.y + (1.5 * theta2) / norm } };
  }
  return {
    content: <g>{cells}{boundary && <path className="boundary" d={linePath(boundary)} />}{arrow && <path className="theta-arrow" d={`M ${sx(arrow.from.x)} ${sy(arrow.from.y)} L ${sx(arrow.to.x)} ${sy(arrow.to.y)}`} />}{arrow && <text x={sx(arrow.to.x) + 6} y={sy(arrow.to.y) - 6}>theta</text>}{points.map((p, index) => <circle key={index} className={`${p.yLabel > 0 ? 'class-pos' : 'class-neg'}${p.yLabel * score(p) <= 0 ? ' misclassified' : ''}`} cx={sx(p.x)} cy={sy(p.y)} r="7" />)}</g>,
    readout: [`mistakes: ${mistakes} of ${points.length}${mistakes ? ' (ringed points)' : ''}`, 'green = +1, red = -1; shaded side is predicted +1'],
  };
}

function PerceptronGraph({ values }) {
  const before = { x: values.theta1, y: values.theta2 };
  const after = { x: values.theta1 + values.x1, y: values.theta2 + values.x2 };
  const x = { x: values.x1, y: values.x2 };
  return <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(before.x)} ${sy(before.y)}`} /><path className="vector-b" d={`M ${sx(before.x)} ${sy(before.y)} L ${sx(after.x)} ${sy(after.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(after.x)} ${sy(after.y)}`} />{circlePoint(x, 'point-b', 'x')}{circlePoint(after, 'active-dot', 'theta new')}</g>;
}

function LossCurveGraph({ values, mode }) {
  const points = Array.from({ length: 121 }, (_, index) => { const z = -3 + index * 0.05; const loss = mode === 'hinge' ? Math.max(0, 1 - z) : z <= 0 ? 1 : 0; return { x: z, y: clamp(loss, 0, 4) }; });
  const loss = mode === 'hinge' ? Math.max(0, 1 - values.margin) : values.margin <= 0 ? 1 : 0;
  const zeroOne = [{ x: -3, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 3, y: 0 }];
  return <g>{mode === 'hinge' && <path className="zero-one-line" d={linePath(zeroOne)} />}<path className="loss-line" d={linePath(points)} />{circlePoint({ x: values.margin, y: clamp(loss, 0, 4) }, 'active-dot', `loss ${loss.toFixed(2)}`)}</g>;
}

// For J(theta) = (theta - 3)^2 each step multiplies the distance to 3 by (1 - 2 alpha), so alpha > 1 diverges.
function descentPlot(path, theta, alpha) {
  const curve = Array.from({ length: 121 }, (_, index) => { const x = -4 + index * 0.1; return { x: x - 3, y: bowl(x) }; });
  const visible = path.filter((p) => Math.abs(p.x - 3) <= 5 && bowl(p.x) <= 5);
  return <g><path className="loss-line" d={linePath(curve)} /><path className="descent-path" d={linePath(visible.map((p) => ({ x: p.x - 3, y: bowl(p.x) })))} />{visible.map((p, index) => <circle key={index} className={p === path[path.length - 1] ? 'active-dot' : 'muted-dot'} cx={sx(p.x - 3)} cy={sy(bowl(p.x))} r="5" />)}<text className="graph-note" x="44" y="48">{alpha > 1 + 1e-9 ? `diverging: each step overshoots further (final theta ${theta.toFixed(1)})` : Math.abs(alpha - 1) < 1e-9 ? 'alpha = 1: bounces between two points forever' : `final theta ${theta.toFixed(2)} (minimum at 3)${Math.abs(theta - 3) > 5 ? ', off the chart' : ''}`}</text></g>;
}

function GradientGraph({ values }) {
  let theta = values.start;
  const path = [{ x: theta }];
  for (let step = 0; step < values.steps; step += 1) { theta = theta - values.alpha * 2 * (theta - 3); path.push({ x: theta }); }
  return { content: descentPlot(path, theta, values.alpha), readout: [`J(theta) = (theta - 3)^2 after ${values.steps} steps: ${((theta - 3) ** 2).toPrecision(3)}`] };
}
// Loss J(theta) = (theta - 3)^2 drawn centered on its minimum and scaled to fit the canvas.
function bowl(theta) { return ((theta - 3) ** 2) / 4 - 3; }

function StochasticGradientGraph({ values }) {
  // Fixed pseudo-random noise so the path only changes when a slider changes.
  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  let theta = -1;
  const path = [{ x: theta }];
  for (let step = 0; step < values.steps; step += 1) {
    const noisyGradient = 2 * (theta - 3) + values.noise * 2 * random();
    theta -= values.alpha * noisyGradient;
    path.push({ x: theta });
  }
  return { content: descentPlot(path, theta, values.alpha), readout: ['start theta = -1', 'Each step = true gradient + random noise'] };
}

function LinearRegressionGraph({ values }) {
  const data = [{ x: -3, y: -2.5 }, { x: -1, y: -0.4 }, { x: 1, y: 2 }, { x: 3, y: 3.2 }];
  const line = [{ x: -5, y: values.slope * -5 + values.intercept }, { x: 5, y: values.slope * 5 + values.intercept }];
  return <g><path className="line-a" d={linePath(line)} />{data.map((p, index) => <circle key={index} className="point-b" cx={sx(p.x)} cy={sy(p.y)} r="7" />)}</g>;
}

function SquaredLossGraph({ values }) {
  const data = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
  const loss = data.reduce((sum, p) => sum + (p.y - values.slope * p.x) ** 2, 0) / data.length;
  const line = [{ x: -1, y: values.slope * -1 }, { x: 3, y: values.slope * 3 }];
  return <g><path className="line-a" d={linePath(line)} />{data.map((p, index) => <g key={index}><circle className="point-b" cx={sx(p.x)} cy={sy(p.y)} r="7" /><path className="residual" d={`M ${sx(p.x)} ${sy(p.y)} L ${sx(p.x)} ${sy(values.slope * p.x)}`} /></g>)}<text className="graph-note" x="44" y="48">MSE = {loss.toFixed(2)}</text></g>;
}

function RidgeGraph({ values }) {
  const theta = 8 / (5 + 2 * values.lambda);
  const data = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
  const line = [{ x: -1, y: theta * -1 }, { x: 3, y: theta * 3 }];
  return <g><path className="line-a" d={linePath(line)} />{data.map((p, index) => <circle key={index} className="point-b" cx={sx(p.x)} cy={sy(p.y)} r="7" />)}<text className="graph-note" x="44" y="48">theta = 8 / (5 + 2lambda) = {theta.toFixed(2)}</text></g>;
}

function GeneralizationGraph({ values }) {
  // Illustrative curves: training loss keeps falling, test loss is U-shaped and never below training loss.
  const trainAt = (c) => 0.3 + 3 * Math.exp(-0.45 * c);
  const testAt = (c) => trainAt(c) + 0.2 + 0.035 * c * c;
  const toY = (loss) => loss * 1.6 - 4.5;
  const train = Array.from({ length: 101 }, (_, index) => { const c = index / 10; return { x: c - 5, y: toY(trainAt(c)) }; });
  const test = Array.from({ length: 101 }, (_, index) => { const c = index / 10; return { x: c - 5, y: toY(clamp(testAt(c), 0, 5.8)) }; });
  const c = values.complexity;
  let best = 0;
  for (let k = 0; k <= 100; k += 1) if (testAt(k / 10) < testAt(best)) best = k / 10;
  return {
    content: <g><path className="line-a" d={linePath(train)} /><path className="line-b" d={linePath(test)} /><path className="tick" strokeDasharray="4 4" d={`M ${sx(best - 5)} ${sy(-4.6)} L ${sx(best - 5)} ${sy(4.6)}`} />{circlePoint({ x: c - 5, y: toY(trainAt(c)) }, 'point-a', 'train')}{circlePoint({ x: c - 5, y: toY(clamp(testAt(c), 0, 5.8)) }, 'point-b', 'test')}</g>,
    readout: [`train loss ${trainAt(c).toFixed(2)}, test loss ${testAt(c).toFixed(2)}, gap ${(testAt(c) - trainAt(c)).toFixed(2)}`, c < best - 0.5 ? 'underfitting: both losses are high' : c > best + 0.5 ? 'overfitting: the gap keeps growing' : 'near the best complexity (dashed line)'],
  };
}

function SigmoidGraph({ values }) {
  const points = Array.from({ length: 161 }, (_, index) => { const s = -8 + index * 0.1; return { x: s / 1.6, y: 4 / (1 + Math.exp(-values.steepness * s)) - 2 }; });
  const probability = 1 / (1 + Math.exp(-values.steepness * values.score));
  return <g><path className="tick" strokeDasharray="4 4" d={`M ${sx(-5)} ${sy(0)} L ${sx(5)} ${sy(0)}`} /><text x={sx(-5) + 4} y={sy(0) - 6}>p = 0.5</text><text x={sx(-5) + 4} y={sy(2) - 6}>p = 1</text><text x={sx(-5) + 4} y={sy(-2) - 6}>p = 0</text><path className="loss-line" d={linePath(points)} />{circlePoint({ x: values.score / 1.6, y: probability * 4 - 2 }, 'active-dot', `p=${probability.toFixed(2)}`)}</g>;
}

function LogLossGraph({ values }) {
  const points = Array.from({ length: 97 }, (_, index) => { const p = 0.02 + index * 0.01; return { x: p * 10 - 5, y: clamp(-Math.log(p), 0, 5) - 2.5 }; });
  const loss = -Math.log(values.prob);
  return <g><path className="loss-line" d={linePath(points)} />{circlePoint({ x: values.prob * 10 - 5, y: clamp(loss, 0, 5) - 2.5 }, 'active-dot', `loss=${loss.toFixed(2)}`)}</g>;
}

function EigenGraph({ values }) {
  const radians = values.angle * Math.PI / 180;
  const v = { x: Math.cos(radians) * 2, y: Math.sin(radians) * 2 };
  const av = { x: values.lambda1 * v.x, y: values.lambda2 * v.y };
  const e1 = { x: values.lambda1 * 1.8, y: 0 };
  const e2 = { x: 0, y: values.lambda2 * 1.8 };
  return <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(v.x)} ${sy(v.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(av.x)} ${sy(av.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(e1.x)} ${sy(e1.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(e2.x)} ${sy(e2.y)}`} />{circlePoint(av, 'active-dot', 'Av')}<text className="graph-note" x="44" y="48">axis directions stay eigen-directions</text></g>;
}

function DiagonalizationGraph({ values }) {
  const first = values.lambda1 ** values.power;
  const second = values.lambda2 ** values.power;
  const barBase = sy(-4);
  const firstHeight = clamp(first, 0, 5);
  const secondHeight = clamp(second, 0, 5);
  return <g><rect className="bar-a" x={sx(-2.2)} y={sy(firstHeight - 4)} width="90" height={barBase - sy(firstHeight - 4)} rx="6" /><rect className="bar-b" x={sx(0.7)} y={sy(secondHeight - 4)} width="90" height={barBase - sy(secondHeight - 4)} rx="6" /><text x={sx(-1.5)} y={barBase + 20} textAnchor="middle">lambda_1^k</text><text x={sx(1.4)} y={barBase + 20} textAnchor="middle">lambda_2^k</text><text className="graph-note" x="44" y="48">values: {first.toFixed(3)} and {second.toFixed(3)}{first > 0 ? `, ratio ${(second / first).toFixed(3)}` : ''}</text></g>;
}

function SpectralGraph({ values }) {
  const radians = values.rotation * Math.PI / 180;
  const q1 = { x: Math.cos(radians), y: Math.sin(radians) };
  const q2 = { x: -Math.sin(radians), y: Math.cos(radians) };
  const axis1 = { x: values.lambda1 * q1.x, y: values.lambda1 * q1.y };
  const axis2 = { x: values.lambda2 * q2.x, y: values.lambda2 * q2.y };
  return <g><path className="vector-a" d={`M ${sx(-axis1.x)} ${sy(-axis1.y)} L ${sx(axis1.x)} ${sy(axis1.y)}`} /><path className="vector-b" d={`M ${sx(-axis2.x)} ${sy(-axis2.y)} L ${sx(axis2.x)} ${sy(axis2.y)}`} /><ellipse className="spectral-ellipse" cx={sx(0)} cy={sy(0)} rx={sx(values.lambda1) - sx(0)} ry={sy(0) - sy(values.lambda2)} transform={`rotate(${-values.rotation} ${sx(0)} ${sy(0)})`} /><text className="graph-note" x="44" y="48">orthogonal axes, independent scaling</text></g>;
}

function DecompositionGraph({ values }) {
  const radians = values.rotation * Math.PI / 180;
  const first = -(values.rotationV ?? 0) * Math.PI / 180;
  const unit = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
  const transformed = unit.map((p) => {
    const turned = { x: p.x * Math.cos(first) - p.y * Math.sin(first), y: p.x * Math.sin(first) + p.y * Math.cos(first) };
    const scaled = { x: values.sigma1 * turned.x, y: values.sigma2 * turned.y };
    return {
      x: scaled.x * Math.cos(radians) - scaled.y * Math.sin(radians),
      y: scaled.x * Math.sin(radians) + scaled.y * Math.cos(radians),
    };
  });
  return <g><path className="shape-original" d={linePath(unit)} /><path className="shape-result" d={linePath(transformed)} /><text className="graph-note" x="44" y="48">rotate (V^T), scale (Sigma), rotate (W)</text></g>;
}

function MatrixCells({ x, y, values, title }) {
  const cell = 44;
  const max = Math.max(1, ...values.flat().map((value) => Math.abs(value)));
  return (
    <g>
      <text className="matrix-title" x={x + (values[0].length * cell) / 2} y={y - 12} textAnchor="middle">{title}</text>
      {values.map((row, rowIndex) => row.map((value, columnIndex) => {
        const tone = 96 - 42 * Math.abs(value / max);
        const hue = value >= 0 ? 200 : 12;
        return (
          <g key={`${rowIndex}-${columnIndex}`}>
            <rect x={x + columnIndex * cell} y={y + rowIndex * cell} width={cell - 4} height={cell - 4} rx="6" fill={`hsl(${hue}, 72%, ${tone}%)`} stroke="#cdbfae" />
            <text x={x + columnIndex * cell + 20} y={y + rowIndex * cell + 25} textAnchor="middle">{value.toFixed(1)}</text>
          </g>
        );
      }))}
    </g>
  );
}

function OuterProductGraph({ values }) {
  const a = [values.a1, values.a2, values.a3];
  const b = [values.b1, values.b2];
  const product = a.map((entry) => b.map((other) => entry * other));
  return {
    content: <g><MatrixCells x={58} y={105} values={a.map((entry) => [entry])} title="a" /><MatrixCells x={180} y={105} values={[b]} title="b^T" /><MatrixCells x={330} y={105} values={product} title="a b^T" /></g>,
    readout: ['Each product row is a_i times the row vector b^T.', 'If a and b are nonzero, this matrix carries one rank-one direction.'],
  };
}

function RowOpLinesGraph({ values }) {
  const eq1 = { a: 2, b: -1, c: 3 };
  const eq2 = { a: 1, b: 1, c: 3 };
  const next = { a: eq2.a + values.k * eq1.a, b: eq2.b + values.k * eq1.b, c: eq2.c + values.k * eq1.c };
  const det = eq1.a * eq2.b - eq1.b * eq2.a;
  const solution = { x: (eq1.c * eq2.b - eq1.b * eq2.c) / det, y: (eq1.a * eq2.c - eq1.c * eq2.a) / det };
  // A row with no y term (b = 0) is the vertical line x = c / a.
  const line = (eq) => (Math.abs(eq.b) < 1e-9
    ? [{ x: eq.c / eq.a, y: -5 }, { x: eq.c / eq.a, y: 5 }]
    : [{ x: -xHalf, y: (eq.c + eq.a * xHalf) / eq.b }, { x: xHalf, y: (eq.c - eq.a * xHalf) / eq.b }]);
  return {
    content: <g><path className="line-a" d={linePath(line(eq1))} /><path className="shape-original" d={linePath(line(eq2))} /><path className="line-b" d={linePath(line(next))} />{circlePoint(solution, 'active-dot', 'fixed solution')}</g>,
    readout: [`new row: ${next.a.toFixed(2)}x + ${next.b.toFixed(2)}y = ${next.c.toFixed(2)}`, 'The replacement row pivots around the same solution point.'],
  };
}

function LineProjectionGraph({ values }) {
  const radians = values.theta * Math.PI / 180;
  const unit = { x: Math.cos(radians), y: Math.sin(radians) };
  const point = { x: values.px, y: values.py };
  const coefficient = point.x * unit.x + point.y * unit.y;
  const projection = { x: coefficient * unit.x, y: coefficient * unit.y };
  const error = { x: point.x - projection.x, y: point.y - projection.y };
  const axis = [{ x: -6 * unit.x, y: -6 * unit.y }, { x: 6 * unit.x, y: 6 * unit.y }];
  return {
    content: <g><path className="shape-original" d={linePath(axis)} /><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(point.x)} ${sy(point.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(projection.x)} ${sy(projection.y)}`} /><path className="residual" d={`M ${sx(projection.x)} ${sy(projection.y)} L ${sx(point.x)} ${sy(point.y)}`} />{circlePoint(point, 'point-a', 'x')}{circlePoint(projection, 'active-dot', 'x hat')}</g>,
    readout: [`compressed coordinate z = ${coefficient.toFixed(3)}`, `squared reconstruction error = ${(error.x ** 2 + error.y ** 2).toFixed(3)}`],
  };
}

function BasisCoordsGraph({ values }) {
  const b1 = { x: 1, y: 1 };
  const b2 = { x: 1, y: -1 };
  const vector = { x: values.vx, y: values.vy };
  const determinant = b1.x * b2.y - b2.x * b1.y;
  const alpha = (vector.x * b2.y - b2.x * vector.y) / determinant;
  const beta = (b1.x * vector.y - vector.x * b1.y) / determinant;
  const alphaB1 = { x: alpha * b1.x, y: alpha * b1.y };
  return {
    content: <g><path className="shape-original" d={linePath([{ x: -5, y: -5 }, { x: 5, y: 5 }])} /><path className="shape-original" d={linePath([{ x: -5, y: 5 }, { x: 5, y: -5 }])} /><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(b1.x)} ${sy(b1.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(b2.x)} ${sy(b2.y)}`} /><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(alphaB1.x)} ${sy(alphaB1.y)}`} /><path className="vector-b" d={`M ${sx(alphaB1.x)} ${sy(alphaB1.y)} L ${sx(vector.x)} ${sy(vector.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(vector.x)} ${sy(vector.y)}`} />{circlePoint(vector, 'active-dot', 'v')}</g>,
    readout: [`standard coordinates = (${vector.x.toFixed(2)}, ${vector.y.toFixed(2)})`, `B-coordinates = (${alpha.toFixed(2)}, ${beta.toFixed(2)})`],
  };
}

function FitLineGraph({ values }) {
  const points = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }];
  let sse = 0;
  const line = [{ x: 0, y: values.slope * 0 + values.intercept }, { x: 4, y: values.slope * 4 + values.intercept }];
  return {
    content: <g><path className="line-a" d={linePath(line)} />{points.map((point, index) => { const prediction = values.slope * point.x + values.intercept; const residual = point.y - prediction; sse += residual ** 2; return <g key={index}><path className="residual" d={`M ${sx(point.x)} ${sy(point.y)} L ${sx(point.x)} ${sy(prediction)}`} /><circle className="point-b" cx={sx(point.x)} cy={sy(point.y)} r="7" /></g>; })}<text className="graph-note" x="44" y="48">red bars are residuals</text></g>,
    readout: [`model: y = ${values.slope.toFixed(2)}x + ${values.intercept.toFixed(2)}`, `sum of squared residuals = ${sse.toFixed(4)}`, 'best here: slope 0.50, intercept 0.67, loss 0.1667'],
  };
}

function ShrinkageGraph({ values }) {
  const { w, lambda } = values;
  const lasso = (l) => Math.sign(w) * Math.max(Math.abs(w) - l, 0);
  const ridge = (l) => w / (1 + l);
  const toX = (l) => l * 2 - 5;
  const ridgeCurve = Array.from({ length: 101 }, (_, index) => { const l = index / 20; return { x: toX(l), y: ridge(l) }; });
  const lassoCurve = Array.from({ length: 101 }, (_, index) => { const l = index / 20; return { x: toX(l), y: lasso(l) }; });
  if ('l2' in values) {
    // Elastic net for one standardized feature: soft-threshold by lambda_1, then shrink by 1 + lambda_2.
    const elastic = (l) => lasso(l) / (1 + values.l2);
    const elasticCurve = Array.from({ length: 101 }, (_, index) => { const l = index / 20; return { x: toX(l), y: elastic(l) }; });
    return {
      content: <g><path className="tick" d={`M ${sx(-5)} ${sy(0)} L ${sx(5)} ${sy(0)}`} /><path className="line-b" d={linePath(lassoCurve)} /><path className="elastic-line" d={linePath(elasticCurve)} /><path className="tick" strokeDasharray="4 4" d={`M ${sx(toX(lambda))} ${sy(-4.6)} L ${sx(toX(lambda))} ${sy(4.6)}`} />{circlePoint({ x: toX(lambda), y: lasso(lambda) }, 'point-b', 'lasso')}{circlePoint({ x: toX(lambda), y: elastic(lambda) }, 'active-dot', 'elastic net')}</g>,
      readout: [`lasso weight = ${lasso(lambda).toFixed(3)} (orange)`, `elastic net weight = ${elastic(lambda).toFixed(3)} (purple) = lasso / (1 + ${values.l2.toFixed(1)})`],
    };
  }
  return {
    content: <g><path className="tick" d={`M ${sx(-5)} ${sy(0)} L ${sx(5)} ${sy(0)}`} /><path className="line-a" d={linePath(ridgeCurve)} /><path className="line-b" d={linePath(lassoCurve)} /><path className="tick" strokeDasharray="4 4" d={`M ${sx(toX(lambda))} ${sy(-4.6)} L ${sx(toX(lambda))} ${sy(4.6)}`} />{circlePoint({ x: toX(lambda), y: ridge(lambda) }, 'point-a', 'ridge')}{circlePoint({ x: toX(lambda), y: lasso(lambda) }, 'point-b', 'lasso')}</g>,
    readout: [`ridge weight = ${ridge(lambda).toFixed(3)} (blue, never exactly 0)`, `lasso weight = ${lasso(lambda).toFixed(3)} (orange${lasso(lambda) === 0 ? ', exactly 0: feature dropped' : ''})`],
  };
}

// Twenty fixed examples: predicted probability and true label.
const thresholdData = [0.03, 0.08, 0.12, 0.18, 0.22, 0.27, 0.31, 0.36, 0.41, 0.45, 0.52, 0.57, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.93, 0.97]
  .map((p, index) => ({ p, y: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1][index] }));

function ThresholdGraph({ values }) {
  const { threshold } = values;
  const counts = { TP: 0, FP: 0, TN: 0, FN: 0 };
  thresholdData.forEach(({ p, y }) => {
    const predicted = p >= threshold ? 1 : 0;
    counts[predicted ? (y ? 'TP' : 'FP') : (y ? 'FN' : 'TN')] += 1;
  });
  const ratio = (a, b) => (b ? (a / b).toFixed(2) : 'undefined');
  const toX = (p) => p * 9 - 4.1;
  return {
    content: <g><rect className="positive-region" x={sx(toX(threshold))} y={sy(4.6)} width={sx(toX(1)) - sx(toX(threshold))} height={sy(-4.6) - sy(4.6)} /><path className="boundary" d={`M ${sx(toX(threshold))} ${sy(4.6)} L ${sx(toX(threshold))} ${sy(-4.6)}`} />{thresholdData.map(({ p, y }, index) => <circle key={index} className={y ? 'class-pos' : 'class-neg'} cx={sx(toX(p))} cy={sy(y ? 1.2 : -1.2)} r="7" />)}<text x={sx(-4.95)} y={sy(1.2) + 4}>y = 1</text><text x={sx(-4.95)} y={sy(-1.2) + 4}>y = 0</text><text className="graph-note" x={sx(toX(threshold)) + 6} y="48">predict 1</text></g>,
    readout: [`TP ${counts.TP}, FP ${counts.FP}, TN ${counts.TN}, FN ${counts.FN}`, `precision ${ratio(counts.TP, counts.TP + counts.FP)}, recall ${ratio(counts.TP, counts.TP + counts.FN)}`, `accuracy ${ratio(counts.TP + counts.TN, thresholdData.length)}`],
  };
}

// ---- Graphs for subtopic pages ----

function VennGraph({ values }) {
  // Elements of U = {1,...,5} placed by membership in A = {1,2,3} and B = {3,4}.
  const elements = [{ n: 1, x: -2.6, y: 0.8 }, { n: 2, x: -2.2, y: -0.9 }, { n: 3, x: 0, y: 0 }, { n: 4, x: 2.2, y: 0.2 }, { n: 5, x: 3.6, y: -3.2 }];
  const inA = (n) => n <= 3;
  const inB = (n) => n === 3 || n === 4;
  const operations = [
    { name: 'A union B', keep: (n) => inA(n) || inB(n) },
    { name: 'A intersection B', keep: (n) => inA(n) && inB(n) },
    { name: 'A minus B', keep: (n) => inA(n) && !inB(n) },
    { name: 'complement of A', keep: (n) => !inA(n) },
  ];
  const op = operations[values.operation] ?? operations[0];
  const kept = elements.filter((element) => op.keep(element.n)).map((element) => element.n);
  return {
    content: <g><rect className="venn-universe" x={sx(-4.8)} y={sy(4.4)} width={sx(4.8) - sx(-4.8)} height={sy(-4.4) - sy(4.4)} rx="12" /><text x={sx(-4.6)} y={sy(4.4) + 18}>U</text><ellipse className="venn-a" cx={sx(-1.3)} cy={sy(0)} rx={sx(2.6) - sx(0)} ry={sy(0) - sy(2.6)} /><ellipse className="venn-b" cx={sx(1.3)} cy={sy(0)} rx={sx(2.3) - sx(0)} ry={sy(0) - sy(2.3)} /><text className="matrix-title" x={sx(-3.2)} y={sy(2.4)}>A</text><text className="matrix-title" x={sx(3.2)} y={sy(2.2)}>B</text>{elements.map((element) => <g key={element.n}><circle className={op.keep(element.n) ? 'active-dot' : 'muted-dot'} cx={sx(element.x)} cy={sy(element.y)} r="13" /><text x={sx(element.x)} y={sy(element.y) + 4} textAnchor="middle" className="venn-label">{element.n}</text></g>)}</g>,
    readout: [`${op.name} = {${kept.join(', ')}}`],
  };
}

const functionPresets = [
  { name: 'neither injective nor surjective', left: [1, 2, 3], right: ['a', 'b', 'c'], map: [0, 0, 1] },
  { name: 'injective, not surjective', left: [1, 2], right: ['a', 'b', 'c'], map: [0, 2] },
  { name: 'surjective, not injective', left: [1, 2, 3], right: ['a', 'b'], map: [0, 1, 1] },
  { name: 'bijective', left: [1, 2, 3], right: ['a', 'b', 'c'], map: [1, 2, 0] },
];

function FunctionMapGraph({ values }) {
  const preset = functionPresets[values.preset] ?? functionPresets[0];
  const inverse = Boolean(values.inverse);
  const y = (index, count) => 2.6 - (index * 5.2) / Math.max(1, count - 1);
  const hits = preset.right.map((_, index) => preset.map.filter((target) => target === index).length);
  const injective = hits.every((count) => count <= 1);
  const surjective = hits.every((count) => count >= 1);
  const invertible = injective && surjective;
  return {
    content: (
      <g>
        <defs><marker id="fnArrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M 1 1 L 11 6 L 1 11 z" fill="#b23a48" /></marker></defs>
        <ellipse className="venn-a" cx={sx(-2.8)} cy={sy(0)} rx="70" ry="130" /><ellipse className="venn-b" cx={sx(2.8)} cy={sy(0)} rx="70" ry="130" />
        <text className="matrix-title" x={sx(-2.8)} y={sy(3.9)} textAnchor="middle">A (inputs)</text><text className="matrix-title" x={sx(2.8)} y={sy(3.9)} textAnchor="middle">B (outputs)</text>
        {preset.map.map((target, index) => {
          const from = { x: -2.5, y: y(index, preset.left.length) };
          const to = { x: 2.5, y: y(target, preset.right.length) };
          const [start, end] = inverse && invertible ? [to, from] : [from, to];
          return <path key={index} className="map-arrow" markerEnd="url(#fnArrow)" d={`M ${sx(start.x)} ${sy(start.y)} L ${sx(end.x)} ${sy(end.y)}`} />;
        })}
        {preset.left.map((label, index) => <g key={`l${label}`}><circle className="point-a" cx={sx(-2.8)} cy={sy(y(index, preset.left.length))} r="12" /><text className="venn-label" x={sx(-2.8)} y={sy(y(index, preset.left.length)) + 4} textAnchor="middle">{label}</text></g>)}
        {preset.right.map((label, index) => <g key={`r${label}`}><circle className={hits[index] === 0 ? 'muted-dot' : 'point-b'} cx={sx(2.8)} cy={sy(y(index, preset.right.length))} r="12" /><text className="venn-label" x={sx(2.8)} y={sy(y(index, preset.right.length)) + 4} textAnchor="middle">{label}</text></g>)}
      </g>
    ),
    readout: [
      `injective: ${injective ? 'yes' : 'no, two inputs share an output'}`,
      `surjective: ${surjective ? 'yes' : 'no, an output is never reached (grey)'}`,
      inverse ? (invertible ? 'arrows reversed: this is the inverse function' : 'no inverse: only bijections can be reversed') : `so the function is ${preset.name}`,
    ],
  };
}

function SpanGraph({ values }) {
  const v1 = { x: 2, y: 2 };
  const radians = (values.angle * Math.PI) / 180;
  const v2 = { x: 2.5 * Math.cos(radians), y: 2.5 * Math.sin(radians) };
  const cross = v1.x * v2.y - v1.y * v2.x;
  const dependent = Math.abs(cross) < 1e-6;
  return {
    content: <g>{dependent ? <path className="span-line" d={linePath([{ x: -5, y: -5 }, { x: 5, y: 5 }])} /> : <rect className="span-plane" x={sx(-xHalf)} y={sy(5)} width={sx(xHalf) - sx(-xHalf)} height={sy(-5) - sy(5)} />}<path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(v1.x)} ${sy(v1.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(v2.x)} ${sy(v2.y)}`} />{circlePoint(v1, 'point-a', 'v1')}{circlePoint(v2, 'point-b', 'v2')}</g>,
    readout: dependent
      ? ['v2 is a multiple of v1: dependent', 'span = a line through the origin, dimension 1']
      : ['v1 and v2 point in different directions: independent', 'span = the whole plane (shaded), dimension 2'],
  };
}

function SubspaceTestGraph({ values }) {
  const { slope, offset } = values;
  const onLine = (x) => ({ x, y: slope * x + offset });
  const p = onLine(0.5);
  const q = onLine(1);
  const sum = { x: p.x + q.x, y: p.y + q.y };
  const sumOnLine = Math.abs(sum.y - (slope * sum.x + offset)) < 1e-9;
  return {
    content: <g><path className="boundary" d={linePath([onLine(-xHalf), onLine(xHalf)])} /><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(p.x)} ${sy(p.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(q.x)} ${sy(q.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(sum.x)} ${sy(sum.y)}`} />{circlePoint(p, 'point-a', 'u')}{circlePoint(q, 'point-b', 'w')}{circlePoint(sum, sumOnLine ? 'active-dot' : 'class-neg', 'u + w')}</g>,
    readout: [`contains the origin: ${offset === 0 ? 'yes' : 'no'}`, `u + w stays on the line: ${sumOnLine ? 'yes' : 'no'}`, offset === 0 ? 'a subspace (a line through the origin)' : 'not a subspace (an affine line)'],
  };
}

// Each curve has its own vertical scale and shift so it fits on the canvas without clipping.
const convexCurves = [
  { name: 'x^2', f: (x) => x * x, convex: true, scale: 0.8, shift: -3 },
  { name: '|x|', f: (x) => Math.abs(x) * 1.5, convex: true, scale: 0.8, shift: -3 },
  { name: 'x^3', f: (x) => (x * x * x) / 3, convex: false, scale: 0.8, shift: 0 },
  { name: 'wavy', f: (x) => Math.sin(2 * x) + 0.2 * x * x, convex: false, scale: 0.8, shift: -1 },
];

function ConvexChordGraph({ values }) {
  const curve = convexCurves[values.curve] ?? convexCurves[0];
  // Rescaling the height keeps the picture on the canvas; it does not change which chords lie above the curve.
  const toY = (v) => curve.scale * v + curve.shift;
  const points = Array.from({ length: 101 }, (_, index) => { const x = -2.5 + index * 0.05; return { x, y: toY(curve.f(x)) }; });
  const a = Math.min(values.a, values.b);
  const b = Math.max(values.a, values.b);
  const chord = [{ x: a, y: toY(curve.f(a)) }, { x: b, y: toY(curve.f(b)) }];
  let above = true;
  for (let k = 1; k < 50; k += 1) {
    const t = k / 50;
    const x = a + t * (b - a);
    if (curve.f(x) > (1 - t) * curve.f(a) + t * curve.f(b) + 1e-9) above = false;
  }
  return {
    content: <g><path className="loss-line" d={linePath(points)} /><path className="chord-line" d={linePath(chord)} />{circlePoint(chord[0], 'point-a', 'a')}{circlePoint(chord[1], 'point-a', 'b')}</g>,
    readout: [`chord between a and b stays on or above ${curve.name}: ${above ? 'yes' : 'no'}`, curve.convex ? `${curve.name} is convex: every chord works` : `${curve.name} is not convex: some chords dip below`],
  };
}

function SubgradientGraph({ values }) {
  const { x0, g } = values;
  const f = (x) => Math.abs(x);
  const valid = x0 === 0 ? Math.abs(g) <= 1 : g === Math.sign(x0);
  const line = [{ x: -5, y: f(x0) + g * (-5 - x0) }, { x: 5, y: f(x0) + g * (5 - x0) }];
  const curve = [{ x: -5, y: 5 }, { x: 0, y: 0 }, { x: 5, y: 5 }];
  return {
    content: <g><path className="loss-line" d={linePath(curve)} /><path className={valid ? 'tangent-ok' : 'tangent-bad'} d={linePath(line)} />{circlePoint({ x: x0, y: f(x0) }, 'active-dot', 'x_0')}</g>,
    readout: [`slope g = ${g.toFixed(2)} at x_0 = ${x0.toFixed(2)}`, valid ? 'valid subgradient: the line stays on or below |x|' : 'not a subgradient: the line crosses above |x| somewhere', x0 === 0 ? 'at the corner, any g in [-1, 1] works' : `away from the corner, only g = ${Math.sign(x0)} works`],
  };
}

function KFoldGraph({ values }) {
  const k = values.k;
  const width = 9 / k;
  const rowHeight = Math.min(0.8, 8 / k);
  return {
    content: <g>{Array.from({ length: k }, (_, run) => Array.from({ length: k }, (_, fold) => <rect key={`${run}-${fold}`} className={fold === run ? 'fold-val' : 'fold-train'} x={sx(-4.5 + fold * width) + 1} y={sy(4.3 - run * (rowHeight + 0.15))} width={sx(width) - sx(0) - 2} height={sy(0) - sy(rowHeight)} rx="4" />))}</g>,
    readout: [`${k} runs; each trains on ${k - 1} folds and validates on 1`, `each example is validated exactly once; each run trains on ${Math.round((100 * (k - 1)) / k)}% of the data`],
  };
}

function PageRankGraph({ values }) {
  const M = [[0, 0.5, 1 / 3], [0.5, 0, 1 / 3], [0.5, 0.5, 1 / 3]];
  const d = values.damping;
  let r = [1, 0, 0];
  for (let step = 0; step < values.steps; step += 1) {
    r = M.map((row) => d * row.reduce((sum, entry, j) => sum + entry * r[j], 0) + (1 - d) / 3);
  }
  const base = sy(-4);
  return {
    content: <g>{r.map((value, index) => { const height = value * 8; return <g key={index}><rect className={index === 2 ? 'bar-b' : 'bar-a'} x={sx(-3 + index * 2.4)} y={sy(-4 + height)} width="80" height={base - sy(-4 + height)} rx="6" /><text x={sx(-3 + index * 2.4) + 40} y={base + 18} textAnchor="middle">page {index + 1}</text><text x={sx(-3 + index * 2.4) + 40} y={sy(-4 + height) - 6} textAnchor="middle">{value.toFixed(3)}</text></g>; })}</g>,
    readout: [`start: surfer on page 1; after ${values.steps} steps with d = ${d.toFixed(2)}`, `without damping the ranks settle to 2/7, 2/7, 3/7 = 0.286, 0.286, 0.429`],
  };
}

function MatrixFactorsGraph({ values }) {
  const fmt = (value) => (Number.isFinite(value) ? value : NaN);
  if (values.factor === 'cholesky') {
    const { a, b, d } = values;
    const l11 = a > 0 ? Math.sqrt(a) : NaN;
    const l21 = b / l11;
    const inside = d - l21 * l21;
    const ok = a > 0 && inside > 0;
    const L = [[fmt(l11), 0], [fmt(l21), ok ? Math.sqrt(inside) : NaN]];
    return {
      content: <g><MatrixCells x={40} y={110} values={[[a, b], [b, d]]} title="A" />{ok && <><MatrixCells x={210} y={110} values={L} title="L" /><MatrixCells x={380} y={110} values={[[L[0][0], L[1][0]], [0, L[1][1]]]} title="L^T" /></>}</g>,
      readout: ok ? ['A = L L^T with positive diagonal in L', `A is positive definite: a = ${a} > 0 and d - b^2/a = ${inside.toFixed(2)} > 0`] : ['no Cholesky factor: A is not positive definite', a <= 0 ? 'a must be positive' : `d - b^2/a = ${inside.toFixed(2)} is not positive`],
    };
  }
  const { a, b, c, d } = values;
  if (a === 0 && c === 0) {
    return { content: <g><MatrixCells x={40} y={110} values={[[a, b], [c, d]]} title="A" /><MatrixCells x={210} y={110} values={[[1, 0], [0, 1]]} title="L" /><MatrixCells x={380} y={110} values={[[a, b], [c, d]]} title="U" /></g>, readout: ['first column is zero: A is already upper triangular, so L = I and U = A', 'the zero pivot means A is singular'] };
  }
  if (a === 0) {
    return { content: <g><MatrixCells x={40} y={110} values={[[a, b], [c, d]]} title="A" /></g>, readout: ['the first pivot a is 0: swap the rows first (P A = L U)'] };
  }
  const m = c / a;
  return {
    content: <g><MatrixCells x={40} y={110} values={[[a, b], [c, d]]} title="A" /><MatrixCells x={210} y={110} values={[[1, 0], [m, 1]]} title="L" /><MatrixCells x={380} y={110} values={[[a, b], [0, d - m * b]]} title="U" /></g>,
    readout: [`multiplier c/a = ${m.toFixed(2)} goes into L`, `U row 2 = row 2 - ${m.toFixed(2)} x row 1`, d - m * b === 0 ? 'U has a zero pivot: A is singular' : `pivots ${a} and ${(d - m * b).toFixed(2)}`],
  };
}
