import React from 'react';

const width = 640;
const height = 360;
const padding = 38;
const yMin = -5;
const yMax = 5;
// Geometric graphs (angles, rotations, perpendicular lines) use the same pixel scale on both axes,
// so the x range is widened to match the canvas shape; the others keep x in [-5, 5].
const EQUAL_X_HALF = (5 * (width - padding * 2)) / (height - padding * 2);
const EQUAL_ASPECT = new Set(['dotProduct', 'basis', 'transform', 'determinant', 'perceptron', 'eigen', 'spectral', 'decomposition', 'lineProjection', 'basisCoords', 'span', 'subspaceTest', 'linearBoundary', 'linearSystem', 'rowOpLines', 'normBall', 'innerProductBall', 'complement', 'gramSchmidt', 'pca', 'momentum', 'lagrange', 'gradientField', 'jacobianMap', 'maxMargin', 'scaling', 'perceptronMistakes']);
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
  ssgdHinge: { x: 'step k', y: 'training hinge risk R_n (0 to 1.2)' },
  surrogate: { x: 'margin z = y (theta . x)', y: 'loss' },
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
  innerProductBall: { x: 'drawn 3 times larger', y: '' },
  traceEigen: { x: 'the real number line', y: '' },
  svdCompression: { x: '', y: '' },
  jacobianMap: { x: 'drawn 1.6 times larger', y: '' },
  lossSurface: { x: 'slope a', y: 'intercept b' },
  computationGraph: { x: '', y: '' },
  biasVariance: { x: 'polynomial degree (0 to 9)', y: 'error' },
  roc: { x: '', y: '' },
  driftRetrain: { x: 'months after deployment (0 to 24)', y: 'accuracy (%)' },
  mlopsPhases: { x: '', y: '' },
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
    case 'surrogate': return SurrogateGraph({ values });
    case 'ssgdHinge': return SsgdHingeGraph({ values });
    case 'perceptronMistakes': return PerceptronMistakesGraph({ values });
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
    case 'normBall': return NormBallGraph({ values });
    case 'innerProductBall': return InnerProductBallGraph({ values });
    case 'complement': return ComplementGraph({ values });
    case 'gramSchmidt': return GramSchmidtGraph({ values });
    case 'traceEigen': return TraceEigenGraph({ values });
    case 'pca': return PcaGraph({ values });
    case 'momentum': return MomentumGraph({ values });
    case 'lagrange': return LagrangeGraph({ values });
    case 'svdCompression': return SvdCompressionGraph({ values });
    case 'tangentLine': return TangentLineGraph({ values });
    case 'gradientField': return GradientFieldGraph({ values });
    case 'jacobianMap': return JacobianMapGraph({ values });
    case 'lossSurface': return LossSurfaceGraph({ values });
    case 'computationGraph': return ComputationGraphGraph({ values });
    case 'taylor': return TaylorGraph({ values });
    case 'maxMargin': return MaxMarginGraph({ values });
    case 'scaling': return ScalingGraph({ values });
    case 'biasVariance': return BiasVarianceGraph({ values });
    case 'roc': return RocGraph({ values });
    case 'driftRetrain': return DriftRetrainGraph({ values });
    case 'mlopsPhases': return MlopsPhasesGraph({ values });
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
  // Labels here are y = +1, so the update theta <- theta + x happens only on a mistake: theta . x <= 0.
  const before = { x: values.theta1, y: values.theta2 };
  const x = { x: values.x1, y: values.x2 };
  const agreement = before.x * x.x + before.y * x.y;
  const mistake = agreement <= 0;
  const after = mistake ? { x: before.x + x.x, y: before.y + x.y } : before;
  const content = mistake
    ? <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(before.x)} ${sy(before.y)}`} /><path className="vector-b" d={`M ${sx(before.x)} ${sy(before.y)} L ${sx(after.x)} ${sy(after.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(after.x)} ${sy(after.y)}`} />{circlePoint(x, 'point-b', 'x')}{circlePoint(after, 'active-dot', 'theta new')}</g>
    : <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(before.x)} ${sy(before.y)}`} />{circlePoint(x, 'point-b', 'x')}{circlePoint(before, 'active-dot', 'theta (unchanged)')}</g>;
  return {
    content,
    readout: [
      `y (theta . x) before = ${agreement.toFixed(2)}`,
      mistake ? `mistake (<= 0), so theta += x; after = ${(agreement + x.x ** 2 + x.y ** 2).toFixed(2)}` : 'already correct (> 0): no update',
    ],
  };
}

// Zero-one, hinge, and base-2 logistic loss as functions of the margin z; both surrogates lie on or above zero-one.
function SurrogateGraph({ values }) {
  const zs = Array.from({ length: 121 }, (_, index) => -3 + index * 0.05);
  const hinge = (z) => Math.max(0, 1 - z);
  const logistic = (z) => Math.log2(1 + Math.exp(-z));
  const zeroOne = [{ x: -3, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 3, y: 0 }];
  const z = values.margin;
  return {
    content: <g><path className="zero-one-line" d={linePath(zeroOne)} /><path className="loss-line" d={linePath(zs.map((v) => ({ x: v, y: clamp(hinge(v), 0, 4.5) })))} /><path className="line-a" d={linePath(zs.map((v) => ({ x: v, y: clamp(logistic(v), 0, 4.5) })))} />{circlePoint({ x: z, y: clamp(hinge(z), 0, 4.5) }, 'active-dot')}{circlePoint({ x: z, y: clamp(logistic(z), 0, 4.5) }, 'point-a')}<text className="graph-note" x="44" y="48">dashed: zero-one, berry: hinge, blue: logistic (base 2)</text></g>,
    readout: [`at z = ${z.toFixed(2)}: zero-one ${z <= 0 ? 1 : 0}, hinge ${hinge(z).toFixed(3)}, logistic ${logistic(z).toFixed(3)}`, z <= 0 ? 'a mistake: both surrogates charge at least 1' : z < 1 ? 'correct but not confident: hinge still charges, logistic too' : 'confident and correct: hinge is 0, logistic is small but positive'],
  };
}

// The course's stochastic subgradient descent on the hinge risk of a small non-separable dataset,
// with a constant step or eta_k = 1/(k + 1), tracking the best theta seen so far.
const ssgdData = [[2, 1, 1], [1, 2, 1], [3, 0.5, 1], [0.5, 3, 1], [1.5, 1.5, 1], [-2, -1, -1], [-1, -2.5, -1], [-3, -0.5, -1], [-1, -1, -1], [1, 0.2, -1], [-0.5, 1, 1]];
function hingeRisk(theta) { return ssgdData.reduce((sum, [a, b, y]) => sum + Math.max(0, 1 - y * (theta[0] * a + theta[1] * b)), 0) / ssgdData.length; }
function SsgdHingeGraph({ values }) {
  let seed = 11;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let theta = [0, 0];
  const risks = [hingeRisk(theta)];
  let best = risks[0];
  let bestStep = 0;
  const bestSoFar = [best];
  for (let k = 0; k < values.steps; k += 1) {
    const [a, b, y] = ssgdData[Math.floor(random() * ssgdData.length)];
    const eta = values.schedule >= 1 ? 1 / (k + 1) : values.eta;
    if (y * (theta[0] * a + theta[1] * b) <= 1) theta = [theta[0] + eta * y * a, theta[1] + eta * y * b];
    const r = hingeRisk(theta);
    risks.push(r);
    if (r < best) { best = r; bestStep = k + 1; }
    bestSoFar.push(best);
  }
  const X = (k) => -4.6 + (9.2 * k) / values.steps;
  const Y = (r) => -4.5 + 7.5 * clamp(r, 0, 1.2);
  return {
    content: <g><path className="line-b" d={linePath(risks.map((r, k) => ({ x: X(k), y: Y(r) })))} /><path className="line-a" d={linePath(bestSoFar.map((r, k) => ({ x: X(k), y: Y(r) })))} />{circlePoint({ x: X(bestStep), y: Y(best) }, 'active-dot', 'best so far')}<text className="graph-note" x="44" y="48">{values.schedule >= 1 ? 'step size eta_k = 1/(k + 1)' : `constant step size eta = ${values.eta.toFixed(2)}`}; orange: R_n after each step, blue: best so far</text></g>,
    readout: [`final R_n = ${risks[risks.length - 1].toFixed(3)}, best R_n = ${best.toFixed(3)} (step ${bestStep})`, `final theta = [${theta.map((v) => v.toFixed(2)).join(', ')}]`],
  };
}

// Perceptron through the origin on data whose true separator (the diagonal) has margin gamma:
// counts the mistakes until a full pass is clean and compares them with the bound (R/gamma)^2.
const mistakeBase = [[-3, 0.2, 1], [-1.5, 0.9, 1], [0, 0, 1], [1.2, 0.5, 1], [2.8, 1.1, 1], [-2.5, 0.4, -1], [-0.8, 0, -1], [0.7, 1, -1], [2, 0.3, -1], [3, 0.7, -1]];
function PerceptronMistakesGraph({ values }) {
  const gamma = values.gamma;
  const h = Math.SQRT1_2;
  const points = mistakeBase.map(([t, s, y]) => ({ x: -t * h + y * (gamma + s) * h, y: t * h + y * (gamma + s) * h, label: y }));
  let theta = [0, 0];
  let mistakes = 0;
  for (let pass = 0; pass < 2000; pass += 1) {
    let passMistakes = 0;
    for (const p of points) if (p.label * (theta[0] * p.x + theta[1] * p.y) <= 0) { theta = [theta[0] + p.label * p.x, theta[1] + p.label * p.y]; mistakes += 1; passMistakes += 1; }
    if (!passMistakes) break;
  }
  const R = Math.max(...points.map((p) => Math.hypot(p.x, p.y)));
  const norm = Math.hypot(theta[0], theta[1]) || 1;
  const along = [-theta[1] / norm, theta[0] / norm];
  const learned = [{ x: -9 * along[0], y: -9 * along[1] }, { x: 9 * along[0], y: 9 * along[1] }];
  return {
    content: <g><path className="tick" strokeDasharray="6 6" d={linePath([{ x: -6, y: 6 }, { x: 6, y: -6 }])} /><path className="boundary" d={linePath(learned)} />{points.map((p, index) => <circle key={index} className={p.label > 0 ? 'class-pos' : 'class-neg'} cx={sx(p.x)} cy={sy(p.y)} r="6" />)}<text className="graph-note" x="44" y="48">dashed: true separator with margin gamma; berry: the perceptron's final boundary</text></g>,
    readout: [`margin gamma = ${gamma.toFixed(2)}, R = ${R.toFixed(2)}`, `mistakes made: ${mistakes}; bound (R/gamma)^2 = ${((R / gamma) ** 2).toFixed(1)}`, 'smaller margin: more mistakes allowed; the bound is a worst case, often far above the actual count'],
  };
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

function LinearRegressionGraph({ values }) {
  const data = [{ x: -3, y: -2.5 }, { x: -1, y: -0.4 }, { x: 1, y: 2 }, { x: 3, y: 3.2 }];
  const predict = (x) => values.slope * x + values.intercept;
  const mse = (slope, intercept) => data.reduce((sum, p) => sum + (p.y - slope * p.x - intercept) ** 2, 0) / data.length;
  // Least-squares line for these four points (closed form for one feature with an intercept).
  const meanX = data.reduce((sum, p) => sum + p.x, 0) / data.length;
  const meanY = data.reduce((sum, p) => sum + p.y, 0) / data.length;
  const bestSlope = data.reduce((sum, p) => sum + (p.x - meanX) * (p.y - meanY), 0) / data.reduce((sum, p) => sum + (p.x - meanX) ** 2, 0);
  const bestIntercept = meanY - bestSlope * meanX;
  const line = [{ x: -5, y: predict(-5) }, { x: 5, y: predict(5) }];
  return {
    content: <g><path className="line-a" d={linePath(line)} />{data.map((p, index) => <g key={index}><path className="residual" d={`M ${sx(p.x)} ${sy(p.y)} L ${sx(p.x)} ${sy(clamp(predict(p.x), -5, 5))}`} /><circle className="point-b" cx={sx(p.x)} cy={sy(p.y)} r="7" /></g>)}</g>,
    readout: [
      `mean squared error (1/n) sum (y - y_hat)^2 = ${mse(values.slope, values.intercept).toFixed(3)}`,
      `least-squares best: slope ${bestSlope.toFixed(3)}, intercept ${bestIntercept.toFixed(3)}, error ${mse(bestSlope, bestIntercept).toFixed(3)}`,
    ],
  };
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
  const heldOut = values.validation ? 'validation' : 'test';
  let best = 0;
  for (let k = 0; k <= 100; k += 1) if (testAt(k / 10) < testAt(best)) best = k / 10;
  return {
    content: <g><path className="line-a" d={linePath(train)} /><path className="line-b" d={linePath(test)} /><path className="tick" strokeDasharray="4 4" d={`M ${sx(best - 5)} ${sy(-4.6)} L ${sx(best - 5)} ${sy(4.6)}`} />{circlePoint({ x: c - 5, y: toY(trainAt(c)) }, 'point-a', 'train')}{circlePoint({ x: c - 5, y: toY(clamp(testAt(c), 0, 5.8)) }, 'point-b', heldOut)}</g>,
    readout: [`train loss ${trainAt(c).toFixed(2)}, ${heldOut} loss ${testAt(c).toFixed(2)}, gap ${(testAt(c) - trainAt(c)).toFixed(2)}`, c < best - 0.5 ? 'underfitting: both losses are high' : c > best + 0.5 ? 'overfitting: the gap keeps growing' : 'near the best complexity (dashed line)'],
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

// ---------- Graphs for the MML-book pages (norms, inner products, projections, trace, PCA, momentum, Lagrange, SVD) ----------

function arrow(from, to, className) {
  return <path className={className} d={`M ${sx(from.x)} ${sy(from.y)} L ${sx(to.x)} ${sy(to.y)}`} />;
}

// Boundary of the ball of radius r in the L1 (1), L2 (2), or max (3) norm.
function normBallShape(norm, r, className, key) {
  if (norm === 2) return <ellipse key={key} className={className} cx={sx(0)} cy={sy(0)} rx={sx(r) - sx(0)} ry={sy(0) - sy(r)} />;
  const corners = norm === 1
    ? [{ x: r, y: 0 }, { x: 0, y: r }, { x: -r, y: 0 }, { x: 0, y: -r }, { x: r, y: 0 }]
    : [{ x: r, y: r }, { x: -r, y: r }, { x: -r, y: -r }, { x: r, y: -r }, { x: r, y: r }];
  return <path key={key} className={className} d={linePath(corners)} />;
}

function NormBallGraph({ values }) {
  const { norm, px, py } = values;
  const lengths = { 1: Math.abs(px) + Math.abs(py), 2: Math.hypot(px, py), 3: Math.max(Math.abs(px), Math.abs(py)) };
  const names = { 1: 'L1', 2: 'L2', 3: 'max' };
  const point = { x: px, y: py };
  return {
    content: <g>{[1, 2, 3].map((n) => normBallShape(n, 1, 'norm-ball', `unit-${n}`))}{lengths[norm] > 0 && normBallShape(norm, lengths[norm], 'norm-ball-active', 'active')}{arrow({ x: 0, y: 0 }, point, 'vector-a')}{circlePoint(point, 'point-a', 'x')}<text className="graph-note" x="44" y="48">{names[norm]} length of x = {lengths[norm].toFixed(2)}</text></g>,
    readout: [`L1 = ${lengths[1].toFixed(2)}, L2 = ${lengths[2].toFixed(2)}, max = ${lengths[3].toFixed(2)}`, 'faint outlines: the unit balls (length 1) of each norm', `bold outline: every vector with the same ${names[norm]} length as x`],
  };
}

function InnerProductBallGraph({ values }) {
  const { a, b, d } = values;
  const scale = 3;
  const spd = a > 0 && a * d - b * b > 0;
  const circle = <ellipse className="norm-ball" cx={sx(0)} cy={sy(0)} rx={sx(scale) - sx(0)} ry={sy(0) - sy(scale)} />;
  if (!spd) {
    return {
      content: <g>{circle}<text className="graph-note" x="44" y="48">not positive definite: x^T A x is not an inner product</text></g>,
      readout: [`A = [[${a}, ${b}], [${b}, ${d}]]`, a <= 0 ? 'A_11 must be positive' : `det(A) = ${(a * d - b * b).toFixed(2)} must be positive`, 'some nonzero vector would get length 0, or an imaginary length'],
    };
  }
  const mean = (a + d) / 2;
  const spread = Math.hypot((a - d) / 2, b);
  const l1 = mean + spread;
  const l2 = mean - spread;
  const angle = 0.5 * Math.atan2(2 * b, a - d);
  const lengthA = (v) => Math.sqrt(a * v.x * v.x + 2 * b * v.x * v.y + d * v.y * v.y);
  const unitA = (v) => ({ x: (scale * v.x) / lengthA(v), y: (scale * v.y) / lengthA(v) });
  const e1 = unitA({ x: 1, y: 0 });
  const e2 = unitA({ x: 0, y: 1 });
  const z = unitA({ x: -b, y: a });
  const cosine = b / Math.sqrt(a * d);
  return {
    content: <g>{circle}<ellipse className="spectral-ellipse" cx={sx(0)} cy={sy(0)} rx={sx(scale / Math.sqrt(l1)) - sx(0)} ry={sy(0) - sy(scale / Math.sqrt(l2))} transform={`rotate(${(-angle * 180) / Math.PI} ${sx(0)} ${sy(0)})`} />{arrow({ x: 0, y: 0 }, e1, 'vector-a')}{arrow({ x: 0, y: 0 }, e2, 'vector-a')}{arrow({ x: 0, y: 0 }, z, 'vector-b')}{circlePoint(e1, 'point-a', 'e1')}{circlePoint(e2, 'point-a', 'e2')}{circlePoint(z, 'point-b', 'z')}<text className="graph-note" x="44" y="48">unit ellipse of x^T A y</text></g>,
    readout: [`<e1, e2> = ${b.toFixed(2)}, so e1 and e2 meet at ${((Math.acos(clamp(cosine, -1, 1)) * 180) / Math.PI).toFixed(1)} degrees under A`, `orange z = [${-b}, ${a}] (rescaled) is orthogonal to e1 under A`, 'blue arrows: e1 and e2 rescaled to length 1 under A'],
  };
}

function ComplementGraph({ values }) {
  const radians = (values.theta * Math.PI) / 180;
  const u = { x: Math.cos(radians), y: Math.sin(radians) };
  const w = { x: -u.y, y: u.x };
  const point = { x: values.px, y: values.py };
  const cu = point.x * u.x + point.y * u.y;
  const cw = point.x * w.x + point.y * w.y;
  const partU = { x: cu * u.x, y: cu * u.y };
  const partW = { x: cw * w.x, y: cw * w.y };
  const far = 12;
  return {
    content: <g><path className="span-line" d={linePath([{ x: -far * u.x, y: -far * u.y }, { x: far * u.x, y: far * u.y }])} /><path className="shape-original" d={linePath([{ x: -far * w.x, y: -far * w.y }, { x: far * w.x, y: far * w.y }])} /><path className="residual" d={`M ${sx(partU.x)} ${sy(partU.y)} L ${sx(point.x)} ${sy(point.y)} L ${sx(partW.x)} ${sy(partW.y)}`} />{arrow({ x: 0, y: 0 }, partU, 'vector-a')}{arrow({ x: 0, y: 0 }, partW, 'vector-b')}{arrow({ x: 0, y: 0 }, point, 'result-vector')}{circlePoint(point, 'active-dot', 'x')}<text x={sx(4.2 * u.x) + 6} y={sy(4.2 * u.y) - 6}>U</text><text x={sx(4.2 * w.x) + 6} y={sy(4.2 * w.y) - 6}>U-perp</text></g>,
    readout: [`part in U (blue) = (${partU.x.toFixed(2)}, ${partU.y.toFixed(2)})`, `part in U-perp (orange) = (${partW.x.toFixed(2)}, ${partW.y.toFixed(2)}); the parts' dot product is 0`, `|x|^2 = ${(cu * cu + cw * cw).toFixed(2)} = ${(cu * cu).toFixed(2)} + ${(cw * cw).toFixed(2)}`],
  };
}

function GramSchmidtGraph({ values }) {
  const radians = (values.theta * Math.PI) / 180;
  const b1 = { x: 3 * Math.cos(radians), y: 3 * Math.sin(radians) };
  const b2 = { x: values.bx, y: values.by };
  const coefficient = (b1.x * b2.x + b1.y * b2.y) / 9;
  const along = { x: coefficient * b1.x, y: coefficient * b1.y };
  const u2 = { x: b2.x - along.x, y: b2.y - along.y };
  const length = Math.hypot(u2.x, u2.y);
  const far = 12;
  return {
    content: <g><path className="shape-original" d={linePath([{ x: -far * b1.x / 3, y: -far * b1.y / 3 }, { x: far * b1.x / 3, y: far * b1.y / 3 }])} /><path className="residual" d={`M ${sx(0)} ${sy(0)} L ${sx(along.x)} ${sy(along.y)} L ${sx(b2.x)} ${sy(b2.y)}`} />{arrow({ x: 0, y: 0 }, b1, 'result-vector')}{arrow({ x: 0, y: 0 }, b2, 'vector-a')}{length > 1e-9 && arrow({ x: 0, y: 0 }, u2, 'vector-b')}{circlePoint(b1, 'active-dot', 'b1 = u1')}{circlePoint(b2, 'point-a', 'b2')}{length > 1e-9 && circlePoint(u2, 'point-b', 'u2')}</g>,
    readout: length > 1e-9
      ? [`projection coefficient (u1 . b2)/(u1 . u1) = ${coefficient.toFixed(3)}`, `u2 = b2 - ${coefficient.toFixed(3)} u1 = (${u2.x.toFixed(2)}, ${u2.y.toFixed(2)})`, `u1 . u2 = ${Math.abs(b1.x * u2.x + b1.y * u2.y) < 1e-9 ? '0' : (b1.x * u2.x + b1.y * u2.y).toFixed(6)}: perpendicular`]
      : ['b2 lies on the line of b1: nothing is left over', 'the vectors are dependent, so there is no second direction'],
  };
}

function TraceEigenGraph({ values }) {
  const { a, b, c, d } = values;
  const trace = a + d;
  const det = a * d - b * c;
  const disc = trace * trace - 4 * det;
  const real = disc >= 0;
  const root = Math.sqrt(Math.abs(disc)) / 2;
  const eig = real ? [trace / 2 + root, trace / 2 - root] : [trace / 2, trace / 2];
  const lineY = -3;
  // The number line runs from -8 to 8, drawn at 0.6 scale to fit the canvas.
  const place = (value) => 0.6 * clamp(value, -8, 8);
  const format = (value) => (Math.abs(value) < 1e-9 ? '0.00' : value.toFixed(2));
  return {
    content: <g><MatrixCells x={70} y={60} values={[[a, b], [c, d]]} title="A" /><text className="graph-note" x="190" y="92">trace = a + d = {format(trace)}</text><text className="graph-note" x="190" y="118">det = ad - bc = {format(det)}</text><path className="axis" d={`M ${sx(-5)} ${sy(lineY)} L ${sx(5)} ${sy(lineY)}`} />{[-8, -4, 0, 4, 8].map((tick) => <g key={tick}><path className="tick" d={`M ${sx(place(tick))} ${sy(lineY - 0.15)} L ${sx(place(tick))} ${sy(lineY + 0.15)}`} /><text x={sx(place(tick))} y={sy(lineY) + 20} textAnchor="middle">{tick}</text></g>)}<path className="chord-line" d={`M ${sx(place(trace / 2))} ${sy(lineY - 0.6)} L ${sx(place(trace / 2))} ${sy(lineY + 0.6)}`} /><text x={sx(place(trace / 2))} y={sy(lineY + 0.8)} textAnchor="middle">average = trace/2</text>{real ? eig.map((value, index) => <circle key={index} className={index ? 'point-a' : 'active-dot'} cx={sx(place(value))} cy={sy(lineY)} r="8" />) : <circle className="muted-dot" cx={sx(place(trace / 2))} cy={sy(lineY)} r="8" />}</g>,
    readout: real
      ? [`eigenvalues ${format(eig[0])} and ${format(eig[1])}${Math.abs(eig[0]) > 8 || Math.abs(eig[1]) > 8 ? ' (clipped to the line)' : ''}`, `sum = ${format(eig[0] + eig[1])} = trace, product = ${format(eig[0] * eig[1])} = det`]
      : [`complex pair ${format(trace / 2)} +/- ${format(root)}i (the grey dot is the real part)`, `sum = ${format(trace)} = trace (imaginary parts cancel), product = ${format(trace * trace / 4 + root * root)} = det`],
  };
}

// A fixed, centered point cloud for the PCA graph (seeded, so it is the same on every visit).
const pcaBase = (() => {
  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const points = Array.from({ length: 36 }, () => ({ x: 3.8 * (2 * random() - 1), y: 1.2 * (2 * random() - 1) }));
  const mean = points.reduce((sum, p) => ({ x: sum.x + p.x / points.length, y: sum.y + p.y / points.length }), { x: 0, y: 0 });
  return points.map((p) => ({ x: p.x - mean.x, y: p.y - mean.y }));
})();

function PcaGraph({ values }) {
  const tilt = (values.tilt * Math.PI) / 180;
  const points = pcaBase.map((p) => ({ x: p.x * Math.cos(tilt) - p.y * Math.sin(tilt), y: p.x * Math.sin(tilt) + p.y * Math.cos(tilt) }));
  const radians = (values.angle * Math.PI) / 180;
  const u = { x: Math.cos(radians), y: Math.sin(radians) };
  const n = points.length;
  let kept = 0;
  let lost = 0;
  const sxx = points.reduce((sum, p) => sum + (p.x * p.x) / n, 0);
  const syy = points.reduce((sum, p) => sum + (p.y * p.y) / n, 0);
  const sxy = points.reduce((sum, p) => sum + (p.x * p.y) / n, 0);
  const total = sxx + syy;
  const best = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const bestDegrees = (((best * 180) / Math.PI) % 180 + 180) % 180;
  const lambda1 = total / 2 + Math.hypot((sxx - syy) / 2, sxy);
  const far = 12;
  const marks = points.map((p, index) => {
    const z = p.x * u.x + p.y * u.y;
    const q = { x: z * u.x, y: z * u.y };
    kept += (z * z) / n;
    lost += ((p.x - q.x) ** 2 + (p.y - q.y) ** 2) / n;
    return <g key={index}><path className="residual thin" d={`M ${sx(p.x)} ${sy(p.y)} L ${sx(q.x)} ${sy(q.y)}`} /><circle className="point-a" cx={sx(p.x)} cy={sy(p.y)} r="4" /><circle className="active-dot small" cx={sx(q.x)} cy={sy(q.y)} r="3.5" /></g>;
  });
  return {
    content: <g><path className="span-line" d={linePath([{ x: -far * u.x, y: -far * u.y }, { x: far * u.x, y: far * u.y }])} />{marks}<text className="graph-note" x="44" y="48">kept {kept.toFixed(2)} + lost {lost.toFixed(2)} = {total.toFixed(2)}</text></g>,
    readout: [`variance kept along this direction: ${kept.toFixed(3)} (${((100 * kept) / total).toFixed(1)}% of ${total.toFixed(3)})`, `average squared reconstruction error (red): ${lost.toFixed(3)}`, `best direction: ${bestDegrees.toFixed(0)} degrees, keeping lambda_1 = ${lambda1.toFixed(3)}`],
  };
}

function MomentumGraph({ values }) {
  const { gamma, alpha, steps } = values;
  const kappa = 20;
  const start = { x: -8, y: 2 };
  const f = (p) => 0.5 * (p.x * p.x + kappa * p.y * p.y);
  const run = (momentum) => {
    let point = { ...start };
    let previous = { ...start };
    const path = [point];
    for (let step = 0; step < steps; step += 1) {
      const next = { x: point.x - gamma * point.x + momentum * (point.x - previous.x), y: point.y - gamma * kappa * point.y + momentum * (point.y - previous.y) };
      previous = point;
      point = next;
      path.push(point);
      if (!Number.isFinite(point.x) || Math.abs(point.x) + Math.abs(point.y) > 1e6) break;
    }
    return path;
  };
  const plain = run(0);
  const heavy = run(alpha);
  const visible = (path) => path.filter((p) => Math.abs(p.x) < 11 && Math.abs(p.y) < 6);
  const levels = [1, 2.5, 5, 8, 12];
  const last = (path) => path[path.length - 1];
  const describe = (path) => (Math.abs(last(path).x) + Math.abs(last(path).y) > 1e5 ? 'diverged' : `f = ${f(last(path)).toExponential(2)}${f(last(path)) > f(start) ? ', growing: diverging' : ''}`);
  return {
    content: <g>{levels.map((level) => <ellipse key={level} className="contour" cx={sx(0)} cy={sy(0)} rx={sx(level) - sx(0)} ry={sy(0) - sy(level / Math.sqrt(kappa))} />)}<path className="path-plain" d={linePath(visible(plain))} /><path className="path-momentum" d={linePath(visible(heavy))} />{visible(heavy).map((p, index) => <circle key={index} className="active-dot small" cx={sx(p.x)} cy={sy(p.y)} r="3" />)}{circlePoint(start, 'point-a', 'start')}{circlePoint({ x: 0, y: 0 }, 'muted-dot', 'minimum')}</g>,
    readout: [`after ${steps} steps, plain gradient descent (grey): ${describe(plain)}`, `with momentum alpha = ${alpha.toFixed(2)} (orange): ${describe(heavy)}`, gamma > 2 / kappa + 1e-9 ? `gamma > 2/kappa = ${(2 / kappa).toFixed(2)}: plain descent diverges across the valley` : Math.abs(gamma - 2 / kappa) < 1e-9 ? `gamma = 2/kappa = ${(2 / kappa).toFixed(2)}: plain descent bounces across the valley forever` : `plain descent is stable across the valley because gamma < 2/kappa = ${(2 / kappa).toFixed(2)}`],
  };
}

function LagrangeGraph({ values }) {
  const { s, c } = values;
  const direction = { x: Math.SQRT1_2, y: -Math.SQRT1_2 };
  const point = { x: c / 2 + s * direction.x, y: c / 2 + s * direction.y };
  const radius = Math.hypot(point.x, point.y);
  const gradF = { x: 2 * point.x, y: 2 * point.y };
  const gradFLength = Math.hypot(gradF.x, gradF.y);
  const cosine = gradFLength > 0 ? (gradF.x + gradF.y) / (gradFLength * Math.SQRT2) : 1;
  const angle = (Math.acos(clamp(cosine, -1, 1)) * 180) / Math.PI;
  const tip = (vector, length) => {
    const size = Math.hypot(vector.x, vector.y) || 1;
    return { x: point.x + (length * vector.x) / size, y: point.y + (length * vector.y) / size };
  };
  const atMinimum = Math.abs(s) < 1e-9;
  return {
    content: <g><path className="boundary" d={linePath([{ x: -xHalf, y: c + xHalf }, { x: xHalf, y: c - xHalf }])} />{radius > 0 && <ellipse className="contour strong" cx={sx(0)} cy={sy(0)} rx={sx(radius) - sx(0)} ry={sy(0) - sy(radius)} />}{arrow(point, tip(gradF, 2.2), 'vector-a')}{arrow(point, tip({ x: 1, y: 1 }, 1.6), 'vector-b')}{circlePoint(point, 'active-dot', atMinimum ? 'constrained minimum' : 'x')}{circlePoint({ x: 0, y: 0 }, 'muted-dot', '')}<text className="graph-note" x="44" y="48">x + y = {c.toFixed(1)}</text></g>,
    readout: [`f(x) = x^2 + y^2 = ${(radius * radius).toFixed(3)} (smallest possible on this line: ${(c * c / 2).toFixed(3)})`, `angle between grad f (blue) and grad h (orange): ${angle.toFixed(1)} degrees`, atMinimum ? `parallel: grad f + lambda grad h = 0 with lambda = ${(-c).toFixed(1)}` : 'not parallel: moving along the line can still lower f'],
  };
}

// A synthetic grayscale image (48 by 48, values 0 to 1) and its singular vectors, computed once.
const svdImage = (() => {
  const size = 48;
  const image = Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => {
    let value = 0.12 + 0.25 * (j / (size - 1));
    if ((i - 15) ** 2 + (j - 15) ** 2 < 90) value = 0.95;
    if (Math.abs(i - 32) + Math.abs(j - 31) < 11) value = 0.7;
    if (Math.abs(i + j - 47) < 2) value = 0.85;
    if (i > 36 && i < 42 && j > 4 && j < 20) value = 0.05;
    return value;
  }));
  // Eigenvectors of A^T A by cyclic Jacobi rotations; A A^T is never needed because A_k = A V_k V_k^T.
  const gram = Array.from({ length: size }, (_, p) => Array.from({ length: size }, (_, q) => image.reduce((sum, row) => sum + row[p] * row[q], 0)));
  const vectors = Array.from({ length: size }, (_, p) => Array.from({ length: size }, (_, q) => (p === q ? 1 : 0)));
  for (let sweep = 0; sweep < 12; sweep += 1) {
    for (let p = 0; p < size - 1; p += 1) {
      for (let q = p + 1; q < size; q += 1) {
        if (Math.abs(gram[p][q]) < 1e-12) continue;
        const theta = (gram[q][q] - gram[p][p]) / (2 * gram[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const cos = 1 / Math.sqrt(t * t + 1);
        const sin = t * cos;
        for (let k = 0; k < size; k += 1) {
          const gkp = gram[k][p];
          const gkq = gram[k][q];
          gram[k][p] = cos * gkp - sin * gkq;
          gram[k][q] = sin * gkp + cos * gkq;
        }
        for (let k = 0; k < size; k += 1) {
          const gpk = gram[p][k];
          const gqk = gram[q][k];
          gram[p][k] = cos * gpk - sin * gqk;
          gram[q][k] = sin * gpk + cos * gqk;
        }
        for (let k = 0; k < size; k += 1) {
          const vkp = vectors[k][p];
          const vkq = vectors[k][q];
          vectors[k][p] = cos * vkp - sin * vkq;
          vectors[k][q] = sin * vkp + cos * vkq;
        }
      }
    }
  }
  const order = gram.map((row, index) => [Math.max(row[index], 0), index]).sort((x, y) => y[0] - x[0]);
  const singular = order.map(([value]) => Math.sqrt(value));
  const basis = order.map(([, index]) => vectors.map((row) => row[index]));
  const projections = basis.map((v) => image.map((row) => row.reduce((sum, entry, j) => sum + entry * v[j], 0)));
  return { size, image, singular, basis, projections };
})();

const svdPictureCache = new Map();

function svdPicture(matrix, key) {
  if (svdPictureCache.has(key)) return svdPictureCache.get(key);
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = svdImage.size;
  canvas.height = svdImage.size;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const pixels = context.createImageData(svdImage.size, svdImage.size);
  matrix.forEach((row, i) => row.forEach((value, j) => {
    const shade = Math.round(255 * clamp(value, 0, 1));
    const offset = 4 * (i * svdImage.size + j);
    pixels.data[offset] = shade;
    pixels.data[offset + 1] = shade;
    pixels.data[offset + 2] = shade;
    pixels.data[offset + 3] = 255;
  }));
  context.putImageData(pixels, 0, 0);
  const url = canvas.toDataURL();
  svdPictureCache.set(key, url);
  return url;
}

function SvdCompressionGraph({ values }) {
  const k = Math.round(values.k);
  const { size, image, singular, basis, projections } = svdImage;
  // A_k = sum over the top k of (A v_i) v_i^T.
  const approx = Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => {
    let value = 0;
    for (let index = 0; index < k; index += 1) value += projections[index][i] * basis[index][j];
    return value;
  }));
  const energy = singular.reduce((sum, value) => sum + value * value, 0);
  const keptEnergy = singular.slice(0, k).reduce((sum, value) => sum + value * value, 0);
  const pixel = 5;
  const side = size * pixel;
  const original = svdPicture(image, 'original');
  const rebuilt = svdPicture(approx, `k${k}`);
  const panel = (x, url, label) => (
    <g>
      <rect x={x - 2} y={52} width={side + 4} height={side + 4} rx="4" fill="none" stroke="#cdbfae" />
      {url && <image href={url} x={x} y={54} width={side} height={side} preserveAspectRatio="none" style={{ imageRendering: 'pixelated' }} />}
      <text x={x + side / 2} y={40} textAnchor="middle" className="matrix-title">{label}</text>
    </g>
  );
  return {
    content: <g>{panel(60, original, 'original A (48 by 48)')}{panel(340, rebuilt, `A_k with k = ${k}`)}</g>,
    readout: [`stores k(48 + 48 + 1) = ${k * (size + size + 1)} numbers instead of ${size * size}`, `keeps ${((100 * keptEnergy) / energy).toFixed(1)}% of the energy (sum of squared singular values)`, `relative error ||A - A_k||_F / ||A||_F = ${Math.sqrt(Math.max(energy - keptEnergy, 0) / energy).toFixed(3)}; the next singular value is ${(singular[k] ?? 0).toFixed(2)}`],
  };
}

// ---------- Graphs for the vector calculus pages (MML book Ch. 5) ----------

// Samples a curve and breaks it wherever it leaves the plotting area, so steep curves are clipped cleanly.
function clippedPath(f, from, to, samples = 240) {
  let d = '';
  let pen = false;
  for (let index = 0; index <= samples; index += 1) {
    const x = from + ((to - from) * index) / samples;
    const y = f(x);
    if (!Number.isFinite(y) || Math.abs(y) > 5.2) { pen = false; continue; }
    d += `${pen ? 'L' : 'M'} ${sx(x)} ${sy(y)} `;
    pen = true;
  }
  return d;
}

function TangentLineGraph({ values }) {
  const f = (x) => (x ** 3) / 4 - x;
  const df = (x) => (3 * x * x) / 4 - 1;
  const { x0, h } = values;
  const slope = df(x0);
  const chordSlope = Math.abs(h) < 1e-9 ? slope : (f(x0 + h) - f(x0)) / h;
  const tangent = (x) => f(x0) + slope * (x - x0);
  const chord = (x) => f(x0) + chordSlope * (x - x0);
  return {
    content: <g><path className="fn-curve" d={clippedPath(f, -4.2, 4.2)} /><path className="boundary" d={clippedPath(tangent, -5, 5, 400)} /><path className="chord-line" d={clippedPath(chord, -5, 5, 400)} />{circlePoint({ x: x0, y: f(x0) }, 'active-dot', 'x0')}{Math.abs(f(x0 + h)) <= 5 && Math.abs(h) > 1e-9 && circlePoint({ x: x0 + h, y: f(x0 + h) }, 'point-a', 'x0 + h')}</g>,
    readout: [`difference quotient (chord slope) = ${chordSlope.toFixed(4)}`, `derivative f'(x0) = 3x0^2/4 - 1 = ${slope.toFixed(4)}`, `gap = ${Math.abs(chordSlope - slope).toFixed(4)}; for small h it shrinks roughly in proportion to |h| (like h^2 at x0 = 0)`],
  };
}

function GradientFieldGraph({ values }) {
  const { px, py, angle } = values;
  const f = (x, y) => (x * x) / 2 + y * y;
  const level = f(px, py);
  const grad = { x: px, y: 2 * py };
  const radians = (angle * Math.PI) / 180;
  const u = { x: Math.cos(radians), y: Math.sin(radians) };
  const slope = grad.x * u.x + grad.y * u.y;
  const size = Math.hypot(grad.x, grad.y);
  const point = { x: px, y: py };
  const contours = [0.5, 2, 4.5, 8, 12.5];
  return {
    content: <g>{contours.map((c) => <ellipse key={c} className="contour" cx={sx(0)} cy={sy(0)} rx={sx(Math.sqrt(2 * c)) - sx(0)} ry={sy(0) - sy(Math.sqrt(c))} />)}{level > 0 && <ellipse className="contour strong" cx={sx(0)} cy={sy(0)} rx={sx(Math.sqrt(2 * level)) - sx(0)} ry={sy(0) - sy(Math.sqrt(level))} />}{size > 0 && arrow(point, { x: px + grad.x / 2, y: py + grad.y / 2 }, 'result-vector')}{arrow(point, { x: px + 1.5 * u.x, y: py + 1.5 * u.y }, 'vector-a')}{circlePoint(point, 'active-dot', '')}</g>,
    readout: [`gradient at (${px.toFixed(2)}, ${py.toFixed(2)}) = [${grad.x.toFixed(2)}, ${grad.y.toFixed(2)}], length ${size.toFixed(2)}`, `slope along u = grad f . u = ${slope.toFixed(3)}`, size > 0 ? `largest possible slope is ${size.toFixed(2)} (along the gradient); 0 along the contour` : 'at the minimum the gradient is zero: every direction is flat'],
  };
}

function JacobianMapGraph({ values }) {
  const { px, py, size } = values;
  const zoom = 1.6;
  const map = (x, y) => ({ x: x + 0.2 * y * y, y: y + 0.2 * x * x });
  const show = (p) => ({ x: zoom * p.x, y: zoom * p.y });
  const J = [[1, 0.4 * py], [0.4 * px, 1]];
  const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
  const half = size / 2;
  const corners = [[-half, -half], [half, -half], [half, half], [-half, half]];
  const boundary = [];
  for (let side = 0; side < 4; side += 1) {
    const [ax, ay] = corners[side];
    const [bx, by] = corners[(side + 1) % 4];
    for (let k = 0; k < 20; k += 1) {
      const t = k / 20;
      boundary.push(map(px + ax + t * (bx - ax), py + ay + t * (by - ay)));
    }
  }
  boundary.push(boundary[0]);
  const image = map(px, py);
  const linear = [...corners, corners[0]].map(([dx, dy]) => ({ x: image.x + J[0][0] * dx + J[0][1] * dy, y: image.y + J[1][0] * dx + J[1][1] * dy }));
  const square = [...corners, corners[0]].map(([dx, dy]) => ({ x: px + dx, y: py + dy }));
  let area = 0;
  for (let k = 0; k < boundary.length - 1; k += 1) area += boundary[k].x * boundary[k + 1].y - boundary[k + 1].x * boundary[k].y;
  area = Math.abs(area) / 2;
  return {
    content: <g><path className="shape-original" d={linePath(square.map(show))} /><path className="shape-result" d={linePath(boundary.map(show))} /><path className="linear-approx" d={linePath(linear.map(show))} />{circlePoint(show({ x: px, y: py }), 'point-a', 'p')}{circlePoint(show(image), 'active-dot', 'f(p)')}</g>,
    readout: [`J = [[1, ${J[0][1].toFixed(2)}], [${J[1][0].toFixed(2)}, 1]], det J = ${det.toFixed(3)}`, `area of the curved image / area of the square = ${(area / (size * size)).toFixed(3)}`, 'smaller squares: the ratio approaches |det J| and the dashed parallelogram fits the image'],
  };
}

// Least squares for the line y = a x + b on (1, 1), (2, 2), (3, 2), drawn in (a, b) coordinates.
const lsPoints = [[1, 1], [2, 2], [3, 2]];
const lsBest = { a: 0.5, b: 2 / 3 };
function lsLoss(a, b) { return lsPoints.reduce((sum, [x, y]) => sum + (y - a * x - b) ** 2, 0); }
function lsGrad(a, b) { return lsPoints.reduce((g, [x, y]) => { const r = y - a * x - b; return { a: g.a - 2 * r * x, b: g.b - 2 * r }; }, { a: 0, b: 0 }); }

function LossSurfaceGraph({ values }) {
  // (a, b) plane mapped onto the canvas: a in [-1.5, 2.5] across, b in [-2, 3.2] up.
  const toCanvas = (a, b) => ({ x: -4.6 + ((a + 1.5) / 4) * 9.2, y: -4.6 + ((b + 2) / 5.2) * 9.2 });
  const { steps } = values;
  let a = values.a;
  let b = values.b;
  const path = [toCanvas(a, b)];
  for (let k = 0; k < steps; k += 1) {
    const g = lsGrad(a, b);
    a -= 0.03 * g.a;
    b -= 0.03 * g.b;
    path.push(toCanvas(a, b));
  }
  // Contours: L = Lmin + c along the ellipse (p - p*)^T M (p - p*) = c, M = sum [[x^2, x], [x, 1]].
  const m11 = 14;
  const m12 = 6;
  const m22 = 3;
  const minLoss = lsLoss(lsBest.a, lsBest.b);
  const contour = (c) => {
    const pts = [];
    for (let k = 0; k <= 240; k += 1) {
      const t = (2 * Math.PI * k) / 240;
      const dir = { a: Math.cos(t), b: Math.sin(t) };
      const q = m11 * dir.a * dir.a + 2 * m12 * dir.a * dir.b + m22 * dir.b * dir.b;
      const r = Math.sqrt(c / q);
      pts.push(toCanvas(lsBest.a + r * dir.a, lsBest.b + r * dir.b));
    }
    return linePath(pts);
  };
  const start = toCanvas(values.a, values.b);
  const g0 = lsGrad(values.a, values.b);
  const scale = 0.03;
  const arrowEnd = toCanvas(values.a - scale * g0.a, values.b - scale * g0.b);
  return {
    content: <g>{[0.1, 0.5, 1.5, 4, 9].map((c) => <path key={c} className="contour" d={contour(c)} />)}{arrow(start, arrowEnd, 'result-vector')}<path className="path-momentum" d={linePath(path)} />{path.slice(1).map((p, index) => <circle key={index} className="active-dot small" cx={sx(p.x)} cy={sy(p.y)} r="3" />)}{circlePoint(start, 'point-a', 'start')}{circlePoint(toCanvas(lsBest.a, lsBest.b), 'muted-dot', 'minimum')}</g>,
    readout: [`gradient at start: dL/da = ${g0.a.toFixed(2)}, dL/db = ${g0.b.toFixed(2)} (loss ${lsLoss(values.a, values.b).toFixed(3)})`, `after ${steps} steps: a = ${a.toFixed(3)}, b = ${b.toFixed(3)}, loss ${lsLoss(a, b).toFixed(4)} (minimum ${minLoss.toFixed(4)})`, 'the valley is long and narrow, so progress along it is slow: the Hessian eigenvalues differ by a factor of about 46'],
  };
}

function ComputationGraphGraph({ values }) {
  const { w, b, x, y } = values;
  const z = w * x + b;
  const m = y * z;
  const loss = Math.log1p(Math.exp(-m));
  const dm = -1 / (1 + Math.exp(m));
  const dz = dm * y;
  const dw = dz * x;
  const db = dz;
  const lossAt = (wv) => Math.log1p(Math.exp(-y * (wv * x + b)));
  const numeric = (lossAt(w + 1e-5) - lossAt(w - 1e-5)) / 2e-5;
  const nodes = [
    { id: 'x', label: 'x', value: x, grad: null, px: 50, py: 60 },
    { id: 'w', label: 'w', value: w, grad: dw, px: 50, py: 150 },
    { id: 'b', label: 'b', value: b, grad: db, px: 50, py: 240 },
    { id: 'z', label: 'z = wx + b', value: z, grad: dz, px: 215, py: 150 },
    { id: 'y', label: 'y', value: y, grad: null, px: 215, py: 260 },
    { id: 'm', label: 'm = y z', value: m, grad: dm, px: 375, py: 150 },
    { id: 'L', label: 'L = log(1 + e^-m)', value: loss, grad: 1, px: 520, py: 150 },
  ];
  const at = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges = [['x', 'z'], ['w', 'z'], ['b', 'z'], ['z', 'm'], ['y', 'm'], ['m', 'L']];
  const boxW = 104;
  const boxH = 54;
  return {
    content: (
      <g>
        {edges.map(([from, to]) => <line key={`${from}-${to}`} className="graph-edge" x1={at[from].px + boxW / 2} y1={at[from].py} x2={at[to].px - boxW / 2} y2={at[to].py} />)}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect className="graph-node" x={n.px - boxW / 2} y={n.py - boxH / 2} width={boxW} height={boxH} rx="8" />
            <text x={n.px} y={n.py - 10} textAnchor="middle" className="node-label">{n.label}</text>
            <text x={n.px} y={n.py + 7} textAnchor="middle" className="node-value">{n.value.toFixed(3)}</text>
            {n.grad !== null && <text x={n.px} y={n.py + 22} textAnchor="middle" className="node-grad">dL/d{n.id} = {n.grad.toFixed(3)}</text>}
          </g>
        ))}
        <text className="graph-note" x="320" y="330" textAnchor="middle">forward: left to right; backward: right to left</text>
      </g>
    ),
    readout: [`loss L = ${loss.toFixed(4)}`, `backprop: dL/dw = ${dw.toFixed(4)}, dL/db = ${db.toFixed(4)}`, `finite-difference check of dL/dw: ${numeric.toFixed(4)}`],
  };
}

function TaylorGraph({ values }) {
  const { x0 } = values;
  const n = Math.round(values.n);
  // Derivatives of sin cycle through sin, cos, -sin, -cos.
  const derivative = (k) => [Math.sin(x0), Math.cos(x0), -Math.sin(x0), -Math.cos(x0)][k % 4];
  let factorial = 1;
  const coefficients = [];
  for (let k = 0; k <= n; k += 1) { if (k > 0) factorial *= k; coefficients.push(derivative(k) / factorial); }
  const T = (x) => coefficients.reduce((sum, c, k) => sum + c * (x - x0) ** k, 0);
  const at = x0 + 1;
  return {
    content: <g><path className="fn-curve" d={clippedPath(Math.sin, -5, 5)} /><path className="boundary" d={clippedPath(T, -5, 5)} />{circlePoint({ x: x0, y: Math.sin(x0) }, 'active-dot', 'x0')}<text className="graph-note" x="44" y="48">degree {n} Taylor polynomial around x0 = {x0.toFixed(1)}</text></g>,
    readout: [`at x0 + 1: sin = ${Math.sin(at).toFixed(4)}, T${n} = ${T(at).toFixed(4)}, error ${Math.abs(Math.sin(at) - T(at)).toExponential(1)}`, `at x0 + 2: error ${Math.abs(Math.sin(x0 + 2) - T(x0 + 2)).toExponential(1)}`],
  };
}

// ---------- Graphs for the ML pages from the course reading list ----------

// A small two-class dataset with one overlapping point, for the soft-margin SVM.
const svmPoints = [
  { x: 2.5, y: 2, label: 1 }, { x: 3.5, y: 3, label: 1 }, { x: 4, y: 1.5, label: 1 }, { x: 2, y: 3.5, label: 1 }, { x: 5, y: 3, label: 1 }, { x: 0.3, y: -0.4, label: 1 },
  { x: -2, y: -1.5, label: -1 }, { x: -3.5, y: -2.5, label: -1 }, { x: -1, y: -3, label: -1 }, { x: -3, y: 0.5, label: -1 }, { x: -4.5, y: -1, label: -1 }, { x: 0.5, y: 0.8, label: -1 },
];
const svmCache = new Map();

// Soft-margin SVM by averaged full-batch subgradient descent (Pegasos-style steps 1/(lambda k)).
function trainSvm(lambda) {
  const key = lambda.toFixed(3);
  if (svmCache.has(key)) return svmCache.get(key);
  let w = [0, 0];
  let b = 0;
  const avg = { w: [0, 0], b: 0 };
  const n = svmPoints.length;
  const iterations = 6000;
  for (let k = 1; k <= iterations; k += 1) {
    const eta = 1 / (lambda * (k + 10));
    let gw0 = lambda * w[0];
    let gw1 = lambda * w[1];
    let gb = 0;
    for (const p of svmPoints) {
      if (p.label * (w[0] * p.x + w[1] * p.y + b) < 1) {
        gw0 -= (p.label * p.x) / n;
        gw1 -= (p.label * p.y) / n;
        gb -= p.label / n;
      }
    }
    w = [w[0] - eta * gw0, w[1] - eta * gw1];
    b -= eta * gb;
    if (k > iterations / 2) {
      avg.w[0] += w[0] / (iterations / 2);
      avg.w[1] += w[1] / (iterations / 2);
      avg.b += b / (iterations / 2);
    }
  }
  svmCache.set(key, avg);
  return avg;
}

function MaxMarginGraph({ values }) {
  const { w, b } = trainSvm(values.lambda);
  const norm = Math.hypot(w[0], w[1]);
  const lineAt = (level) => (Math.abs(w[1]) > 1e-9
    ? [{ x: -xHalf, y: (level - b - w[0] * -xHalf) / w[1] }, { x: xHalf, y: (level - b - w[0] * xHalf) / w[1] }]
    : [{ x: (level - b) / w[0], y: -5 }, { x: (level - b) / w[0], y: 5 }]);
  let hinge = 0;
  let inside = 0;
  let errors = 0;
  const dots = svmPoints.map((p, index) => {
    const margin = p.label * (w[0] * p.x + w[1] * p.y + b);
    hinge += Math.max(0, 1 - margin) / svmPoints.length;
    if (margin <= 1.02) inside += 1;
    if (margin <= 0) errors += 1;
    return <g key={index}>{margin <= 1.02 && <circle className="support-ring" cx={sx(p.x)} cy={sy(p.y)} r="11" />}<circle className={p.label > 0 ? 'point-a' : 'point-b'} cx={sx(p.x)} cy={sy(p.y)} r="6" /></g>;
  });
  const objective = (values.lambda / 2) * norm * norm + hinge;
  return {
    content: <g><path className="margin-line" d={linePath(lineAt(1))} /><path className="margin-line" d={linePath(lineAt(-1))} /><path className="boundary" d={linePath(lineAt(0))} />{dots}</g>,
    readout: [`margin width 2/||theta|| = ${(2 / norm).toFixed(2)}`, `${inside} points on or inside the margin (support vectors), ${errors} misclassified`, `objective = lambda/2 ||theta||^2 + mean hinge = ${objective.toFixed(3)}`],
  };
}

function ScalingGraph({ values }) {
  const s = values.standardize ? 1 : values.s;
  const kappa = s * s;
  // Loss 0.5 (w1^2 + s^2 w2^2) in the coordinates the optimizer sees. Steps must stay below 2/s^2;
  // 1.8/s^2 is close to that limit, so the steep direction zig-zags while the flat one creeps.
  const alpha = kappa === 1 ? 1 : 1.8 / kappa;
  let w = { x: -7, y: 3 / s };
  const path = [w];
  for (let k = 0; k < values.steps; k += 1) {
    w = { x: w.x - alpha * w.x, y: w.y - alpha * kappa * w.y };
    path.push(w);
  }
  const start = path[0];
  const startLoss = 0.5 * (start.x ** 2 + kappa * start.y ** 2);
  const endLoss = 0.5 * (w.x ** 2 + kappa * w.y ** 2);
  // The loss shrinks by at least rate^2 per step, where rate is the slower of the two directions.
  const rate = Math.max(Math.abs(1 - alpha), Math.abs(1 - alpha * kappa));
  const needed = rate === 0 ? 1 : Math.ceil(Math.log(0.01) / (2 * Math.log(rate)));
  const levels = [1, 2.5, 4.5, 7];
  return {
    content: <g>{levels.map((r) => <ellipse key={r} className="contour" cx={sx(0)} cy={sy(0)} rx={sx(r) - sx(0)} ry={sy(0) - sy(r / s)} />)}<path className="path-momentum" d={linePath(path)} />{path.map((p, index) => <circle key={index} className="active-dot small" cx={sx(p.x)} cy={sy(p.y)} r="3" />)}{circlePoint(start, 'point-a', 'start')}{circlePoint({ x: 0, y: 0 }, 'muted-dot', 'best weights')}</g>,
    readout: [values.standardize ? 'standardized: both features have spread 1, the contours are circles' : `feature 2 is ${values.s} times larger in scale: curvature ratio kappa = ${kappa.toFixed(1)}`, `loss after ${values.steps} steps: ${(100 * endLoss / startLoss).toFixed(2)}% of the start`, `steps for the loss to fall to 1% of its start: about ${needed}`],
  };
}

// Exact bias^2 and variance for least-squares polynomials on a fixed design: 12 evenly spaced inputs,
// noise standard deviation 0.4, true function sin(2 pi x). Variance averages sigma^2 (d + 1)/n.
const biasVarianceCurve = (() => {
  const n = 12;
  const noise = 0.4;
  const xs = Array.from({ length: n }, (_, i) => i / (n - 1));
  const f = xs.map((x) => Math.sin(2 * Math.PI * x));
  const basis = [];
  const results = [];
  for (let degree = 0; degree <= 9; degree += 1) {
    // Modified Gram-Schmidt on the column (2x - 1)^degree keeps the projection stable.
    let column = xs.map((x) => (2 * x - 1) ** degree);
    for (const q of basis) {
      const c = column.reduce((sum, v, i) => sum + v * q[i], 0);
      column = column.map((v, i) => v - c * q[i]);
    }
    const length = Math.hypot(...column);
    basis.push(column.map((v) => v / length));
    const fit = xs.map((_, i) => basis.reduce((sum, q) => sum + q[i] * q.reduce((acc, v, j) => acc + v * f[j], 0), 0));
    const bias2 = fit.reduce((sum, v, i) => sum + (v - f[i]) ** 2, 0) / n;
    const variance = (noise * noise * (degree + 1)) / n;
    results.push({ degree, bias2, variance, total: bias2 + variance + noise * noise });
  }
  return { results, noise };
})();

function BiasVarianceGraph({ values }) {
  const { results, noise } = biasVarianceCurve;
  const X = (degree) => -4.4 + degree * (8.8 / 9);
  const Y = (v) => -4.2 + Math.min(v, 0.72) * (8.4 / 0.72);
  const curve = (key) => linePath(results.map((r) => ({ x: X(r.degree), y: Y(r[key]) })));
  const chosen = results[Math.round(values.degree)];
  const best = results.reduce((a, r) => (r.total < a.total ? r : a), results[0]);
  return {
    content: <g><path className="axis" d={`M ${sx(-4.6)} ${sy(-4.2)} L ${sx(4.6)} ${sy(-4.2)}`} />{results.map((r) => <text key={r.degree} x={sx(X(r.degree))} y={sy(-4.2) + 16} textAnchor="middle">{r.degree}</text>)}<path className="noise-line" d={linePath([{ x: X(0), y: Y(noise * noise) }, { x: X(9), y: Y(noise * noise) }])} /><path className="line-a" d={curve('bias2')} /><path className="line-b" d={curve('variance')} /><path className="fn-curve" d={curve('total')} /><path className="chord-line" d={`M ${sx(X(chosen.degree))} ${sy(-4.2)} L ${sx(X(chosen.degree))} ${sy(4.4)}`} /><text className="graph-note" x="44" y="48">blue bias^2, orange variance, dark total, dotted noise</text></g>,
    readout: [`degree ${chosen.degree}: bias^2 = ${chosen.bias2.toFixed(3)}, variance = ${chosen.variance.toFixed(3)}, noise = ${(noise * noise).toFixed(2)}`, `expected error at the training inputs with fresh noise = ${chosen.total.toFixed(3)}`, `lowest expected error at degree ${best.degree} (${best.total.toFixed(3)})`],
  };
}

function normalCdf(z) {
  // Abramowitz and Stegun 7.1.26 approximation of erf, accurate to about 1e-7.
  const t = 1 / (1 + (0.3275911 * Math.abs(z)) / Math.SQRT2);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

function RocGraph({ values }) {
  const d = values.separation;
  const t = values.threshold;
  // Negatives ~ N(0, 1), positives ~ N(d, 1).
  const tpr = (th) => 1 - normalCdf(th - d);
  const fpr = (th) => 1 - normalCdf(th);
  const auc = normalCdf(d / Math.SQRT2);
  const size = 250;
  const left = 50;
  const top = 50;
  const px = (v) => left + v * size;
  const py = (v) => top + size - v * size;
  const roc = Array.from({ length: 121 }, (_, i) => { const th = 6 - (i * 10) / 120; return `${i ? 'L' : 'M'} ${px(fpr(th))} ${py(tpr(th))}`; }).join(' ');
  const dens = (x, mean) => Math.exp(-((x - mean) ** 2) / 2);
  const dx = (x) => 360 + ((x + 3) / 9) * 260;
  const dy = (v) => 300 - v * 200;
  const densityPath = (mean) => Array.from({ length: 181 }, (_, i) => { const x = -3 + (i * 9) / 180; return `${i ? 'L' : 'M'} ${dx(x)} ${dy(dens(x, mean))}`; }).join(' ');
  return {
    content: (
      <g>
        <rect className="roc-box" x={left} y={top} width={size} height={size} />
        <path className="chord-line" d={`M ${px(0)} ${py(0)} L ${px(1)} ${py(1)}`} />
        <path className="boundary" d={roc} />
        <circle className="active-dot" cx={px(fpr(t))} cy={py(tpr(t))} r="7" />
        <text x={left + size / 2} y={top + size + 22} textAnchor="middle">false positive rate</text>
        <text x={left - 12} y={top + size / 2} textAnchor="middle" transform={`rotate(-90 ${left - 12} ${top + size / 2})`}>true positive rate</text>
        <path className="line-b" d={densityPath(0)} />
        <path className="line-a" d={densityPath(d)} />
        <path className="residual" d={`M ${dx(t)} ${dy(0)} L ${dx(t)} ${dy(1.1)}`} />
        <path className="axis" d={`M ${dx(-3)} ${dy(0)} L ${dx(6)} ${dy(0)}`} />
        <text x={dx(t) + 6} y={dy(1.1) + 12}>threshold</text>
        <text x="490" y="324" textAnchor="middle">score</text>
      </g>
    ),
    readout: [`TPR = ${tpr(t).toFixed(3)}, FPR = ${fpr(t).toFixed(3)} at threshold ${t.toFixed(1)}`, `AUC = ${auc.toFixed(3)} (0.5 is random ranking, 1 is perfect)`],
  };
}

function DriftRetrainGraph({ values }) {
  const { decay, interval } = values;
  const A0 = 92;
  const accuracy = (m) => A0 - decay * (m % interval);
  const X = (m) => -4.6 + (m / 24) * 9.2;
  const Y = (a) => -4.2 + (a / 100) * 8.6;
  const points = [];
  for (let m = 0; m <= 24; m += 0.05) points.push({ x: X(m), y: Y(Math.max(accuracy(m), 0)) });
  let sum = 0;
  const samples = 2400;
  for (let k = 0; k < samples; k += 1) sum += accuracy((24 * (k + 0.5)) / samples);
  const retrains = interval >= 24 ? 0 : Math.ceil(24 / interval) - 1;
  return {
    content: <g><path className="axis" d={`M ${sx(X(0))} ${sy(Y(0))} L ${sx(X(24))} ${sy(Y(0))}`} />{[0, 6, 12, 18, 24].map((m) => <text key={m} x={sx(X(m))} y={sy(Y(0)) + 16} textAnchor="middle">{m}</text>)}{[0, 50, 100].map((a) => <text key={a} x={sx(X(0)) - 6} y={sy(Y(a)) + 4} textAnchor="end">{a}</text>)}<path className="noise-line" d={linePath([{ x: X(0), y: Y(A0) }, { x: X(24), y: Y(A0) }])} /><path className="boundary" d={linePath(points)} /></g>,
    readout: [`average accuracy over two years: ${(sum / samples).toFixed(2)}%`, `${retrains} retrains in two years${interval >= 24 ? ' (never retrained)' : ''}`, `accuracy just before each retrain (or at month 24): ${Math.max(A0 - decay * Math.min(interval, 24), 0).toFixed(1)}%`],
  };
}

// The three MLOps phases from the Lesson 1 slides, with the activities of the selected phase.
const mlopsPhases = [
  { name: 'Data phase', items: ['business understanding', 'data understanding', 'design the ML software'], detail: 'business understanding, data understanding, and designing the ML-powered software', skill: 'domain knowledge, data engineering' },
  { name: 'Model phase', items: ['data engineering', 'model engineering', 'a stable, quality model'], detail: 'data engineering and model engineering, delivering a stable, quality model to run in production', skill: 'machine learning' },
  { name: 'Operations phase', items: ['deploy to production', 'testing, versioning', 'delivery, monitoring'], detail: 'deploying the model, testing, versioning, continuous delivery, and monitoring', skill: 'software development, operations' },
];

function MlopsPhasesGraph({ values }) {
  const active = Math.round(values.phase) - 1;
  const boxW = 170;
  const lefts = [40, 235, 430];
  return {
    content: (
      <g>
        {mlopsPhases.map((phase, index) => (
          <g key={phase.name}>
            <rect className={index === active ? 'phase-box active' : 'phase-box'} x={lefts[index]} y={70} width={boxW} height={170} rx="12" />
            <text className="node-label" x={lefts[index] + boxW / 2} y={98} textAnchor="middle">{phase.name}</text>
            {phase.items.map((item, k) => <text key={item} x={lefts[index] + 12} y={130 + k * 26} className={index === active ? 'phase-item active' : 'phase-item'}>• {item}</text>)}
            {index < 2 && <path className="flow-line" d={`M ${lefts[index] + boxW + 4} 155 L ${lefts[index + 1] - 4} 155`} />}
          </g>
        ))}
        <path className="loop-back" d={`M ${lefts[2] + boxW / 2} 244 C ${lefts[2] + boxW / 2} 320, ${lefts[0] + boxW / 2} 320, ${lefts[0] + boxW / 2} 244`} />
        <text className="graph-note" x="320" y="312" textAnchor="middle">monitoring feeds new data and retraining: the lifecycle is a cycle</text>
      </g>
    ),
    readout: [`${mlopsPhases[active].name}: ${mlopsPhases[active].detail}`, `skills most used here: ${mlopsPhases[active].skill}`, 'an MLOps engineer mixes software development, machine learning, and data engineering'],
  };
}
