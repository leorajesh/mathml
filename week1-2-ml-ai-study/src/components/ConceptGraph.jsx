import React from 'react';

const width = 640;
const height = 360;
const padding = 38;
const xMin = -5;
const xMax = 5;
const yMin = -5;
const yMax = 5;

function sx(x) { return padding + ((x - xMin) / (xMax - xMin)) * (width - padding * 2); }
function sy(y) { return height - padding - ((y - yMin) / (yMax - yMin)) * (height - padding * 2); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function linePath(points) { return points.map((point, index) => `${index ? 'L' : 'M'} ${sx(point.x)} ${sy(point.y)}`).join(' '); }
function circlePoint(point, className, label) { return <g><circle className={className} cx={sx(point.x)} cy={sy(point.y)} r="6" />{label && <text x={sx(point.x) + 8} y={sy(point.y) - 8}>{label}</text>}</g>; }

export function ConceptGraph({ graph }) {
  const initial = Object.fromEntries(graph.sliders.map((slider) => [slider.key, slider.value]));
  const [values, setValues] = React.useState(initial);

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: Number(value) }));
  }

  function reset() {
    setValues(initial);
  }

  const rendered = getGraphRender(graph.type, values);

  return (
    <div className="graph-card">
      <div className="graph-title-row">
        <h3>{graph.title}</h3>
        <span>{graph.type}</span>
      </div>
      <div className="graph-body">
        <GraphCanvas content={rendered.content} />
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

function GraphCanvas({ content }) {
  return (
    <svg className="plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Interactive concept graph">
      <rect className="plot-bg" x="0" y="0" width={width} height={height} rx="10" />
      <path className="axis" d={`M ${sx(xMin)} ${sy(0)} L ${sx(xMax)} ${sy(0)}`} />
      <path className="axis" d={`M ${sx(0)} ${sy(yMin)} L ${sx(0)} ${sy(yMax)}`} />
      {[-4, -2, 2, 4].map((tick) => <g key={`x-${tick}`}><path className="tick" d={`M ${sx(tick)} ${sy(-0.12)} L ${sx(tick)} ${sy(0.12)}`} /><text x={sx(tick)} y={sy(0) + 18}>{tick}</text></g>)}
      {[-4, -2, 2, 4].map((tick) => <g key={`y-${tick}`}><path className="tick" d={`M ${sx(-0.12)} ${sy(tick)} L ${sx(0.12)} ${sy(tick)}`} /><text x={sx(0) + 8} y={sy(tick) + 4}>{tick}</text></g>)}
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
    case 'workflow': return <WorkflowGraph values={values} />;
    case 'dotProduct': return <DotProductGraph values={values} />;
    case 'linearSystem': return <LinearSystemGraph values={values} />;
    case 'basis': return <BasisGraph values={values} />;
    case 'transform': return <TransformGraph values={values} />;
    case 'determinant': return <DeterminantGraph values={values} />;
    case 'linearBoundary': return <LinearBoundaryGraph values={values} />;
    case 'perceptron': return <PerceptronGraph values={values} />;
    case 'zeroOne': return <LossCurveGraph values={values} mode="zeroOne" />;
    case 'hinge': return <LossCurveGraph values={values} mode="hinge" />;
    case 'gradient': return <GradientGraph values={values} />;
    case 'linearRegression': return <LinearRegressionGraph values={values} />;
    case 'squaredLoss': return <SquaredLossGraph values={values} />;
    case 'ridge': return <RidgeGraph values={values} />;
    case 'generalization': return <GeneralizationGraph values={values} />;
    case 'sigmoid': return <SigmoidGraph values={values} />;
    case 'logLoss': return <LogLossGraph values={values} />;
    case 'eigen': return <EigenGraph values={values} />;
    case 'diagonalization': return <DiagonalizationGraph values={values} />;
    case 'spectral': return <SpectralGraph values={values} />;
    case 'decomposition': return <DecompositionGraph values={values} />;
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
  return <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(theta.x)} ${sy(theta.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(point.x)} ${sy(point.y)}`} />{circlePoint(point, 'point-b', 'x')}{circlePoint(theta, 'point-a', 'theta')}<text className="graph-note" x="44" y="48">theta dot x = {score.toFixed(2)}</text></g>;
}

function LinearSystemGraph({ values }) {
  const line1 = [{ x: -5, y: values.m1 * -5 + values.b1 }, { x: 5, y: values.m1 * 5 + values.b1 }];
  const line2 = [{ x: -5, y: values.m2 * -5 + values.b2 }, { x: 5, y: values.m2 * 5 + values.b2 }];
  const x = (values.b2 - values.b1) / (values.m1 - values.m2 || 0.0001);
  const y = values.m1 * x + values.b1;
  return <g><path className="line-a" d={linePath(line1)} /><path className="line-b" d={linePath(line2)} />{Number.isFinite(x) && Math.abs(x) < 5 && Math.abs(y) < 5 && circlePoint({ x, y }, 'active-dot', 'solution')}<text className="graph-note" x="44" y="48">intersection approx ({x.toFixed(2)}, {y.toFixed(2)})</text></g>;
}

function BasisGraph({ values }) {
  const e1 = { x: 1, y: 0 };
  const e2 = { x: values.tilt, y: 1 };
  const v = { x: values.c1 * e1.x + values.c2 * e2.x, y: values.c1 * e1.y + values.c2 * e2.y };
  return <g><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(e1.x * values.c1)} ${sy(e1.y * values.c1)}`} /><path className="vector-b" d={`M ${sx(values.c1)} ${sy(0)} L ${sx(v.x)} ${sy(v.y)}`} /><path className="result-vector" d={`M ${sx(0)} ${sy(0)} L ${sx(v.x)} ${sy(v.y)}`} />{circlePoint(v, 'active-dot', 'v')}</g>;
}

function TransformGraph({ values }) {
  const square = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
  const transformed = square.map((p) => ({ x: values.scaleX * p.x + values.shear * p.y, y: values.scaleY * p.y }));
  return <g><path className="shape-original" d={linePath(square)} /><path className="shape-result" d={linePath(transformed)} /><text className="graph-note" x="44" y="48">A = [[{values.scaleX.toFixed(1)}, {values.shear.toFixed(1)}], [0, {values.scaleY.toFixed(1)}]]</text></g>;
}

function DeterminantGraph({ values }) {
  const v1 = { x: values.a, y: values.c };
  const v2 = { x: values.b, y: values.d };
  const det = values.a * values.d - values.b * values.c;
  const poly = [{ x: 0, y: 0 }, v1, { x: v1.x + v2.x, y: v1.y + v2.y }, v2, { x: 0, y: 0 }];
  return <g><path className="area-shape" d={linePath(poly)} /><path className="vector-a" d={`M ${sx(0)} ${sy(0)} L ${sx(v1.x)} ${sy(v1.y)}`} /><path className="vector-b" d={`M ${sx(0)} ${sy(0)} L ${sx(v2.x)} ${sy(v2.y)}`} /><text className="graph-note" x="44" y="48">det = {det.toFixed(2)}</text></g>;
}

function LinearBoundaryGraph({ values }) {
  const points = [{ x: -3, y: 2, yLabel: 1 }, { x: -1, y: 1, yLabel: 1 }, { x: 2, y: -2, yLabel: -1 }, { x: 3, y: 1, yLabel: -1 }, { x: 1, y: 3, yLabel: 1 }];
  const theta2 = Math.abs(values.theta2) < 0.1 ? 0.1 : values.theta2;
  const line = [{ x: -5, y: -(values.theta1 * -5 + values.bias) / theta2 }, { x: 5, y: -(values.theta1 * 5 + values.bias) / theta2 }];
  return <g><path className="boundary" d={linePath(line)} />{points.map((p, index) => <circle key={index} className={p.yLabel > 0 ? 'class-pos' : 'class-neg'} cx={sx(p.x)} cy={sy(p.y)} r="7" />)}</g>;
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
  return <g><path className="loss-line" d={linePath(points)} />{circlePoint({ x: values.margin, y: clamp(loss, 0, 4) }, 'active-dot', `loss ${loss.toFixed(2)}`)}</g>;
}

function GradientGraph({ values }) {
  let theta = values.start;
  const path = [{ x: theta, y: bowl(theta) }];
  for (let step = 0; step < values.steps; step += 1) { theta = theta - values.alpha * 2 * (theta - 3); path.push({ x: theta, y: bowl(theta) }); }
  const curve = Array.from({ length: 121 }, (_, index) => { const x = -4 + index * 0.1; return { x, y: bowl(x) }; });
  return <g><path className="loss-line" d={linePath(curve)} />{path.map((p, index) => <circle key={index} className={index === path.length - 1 ? 'active-dot' : 'muted-dot'} cx={sx(p.x)} cy={sy(clamp(p.y, -5, 5))} r="5" />)}<text className="graph-note" x="44" y="48">final theta {theta.toFixed(2)}</text></g>;
}
function bowl(theta) { return ((theta - 3) ** 2) / 4 - 3; }

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
  const train = Array.from({ length: 101 }, (_, index) => { const c = index / 10; return { x: c - 5, y: 4.2 - 0.55 * c }; });
  const test = Array.from({ length: 101 }, (_, index) => { const c = index / 10; return { x: c - 5, y: 1.1 + ((c - 5) ** 2) / 8 }; });
  const c = values.complexity;
  const trainLoss = 4.2 - 0.55 * c;
  const testLoss = 1.1 + ((c - 5) ** 2) / 8;
  return <g><path className="line-a" d={linePath(train)} /><path className="line-b" d={linePath(test)} />{circlePoint({ x: c - 5, y: trainLoss }, 'point-a', 'train')}{circlePoint({ x: c - 5, y: testLoss }, 'point-b', 'test')}</g>;
}

function SigmoidGraph({ values }) {
  const points = Array.from({ length: 161 }, (_, index) => { const s = -8 + index * 0.1; return { x: s / 1.6, y: values.steepness / (1 + Math.exp(-values.steepness * s)) * 4 - 2 }; });
  const probability = 1 / (1 + Math.exp(-values.steepness * values.score));
  return <g><path className="loss-line" d={linePath(points)} />{circlePoint({ x: values.score / 1.6, y: probability * 4 - 2 }, 'active-dot', `p=${probability.toFixed(2)}`)}</g>;
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
  return <g><rect className="bar-a" x={sx(-2.2)} y={sy(firstHeight - 4)} width="90" height={barBase - sy(firstHeight - 4)} rx="6" /><rect className="bar-b" x={sx(0.7)} y={sy(secondHeight - 4)} width="90" height={barBase - sy(secondHeight - 4)} rx="6" /><text x={sx(-1.5)} y={barBase + 20} textAnchor="middle">lambda_1^k</text><text x={sx(1.4)} y={barBase + 20} textAnchor="middle">lambda_2^k</text><text className="graph-note" x="44" y="48">values: {first.toFixed(3)} and {second.toFixed(3)}</text></g>;
}

function SpectralGraph({ values }) {
  const radians = values.rotation * Math.PI / 180;
  const q1 = { x: Math.cos(radians), y: Math.sin(radians) };
  const q2 = { x: -Math.sin(radians), y: Math.cos(radians) };
  const axis1 = { x: values.lambda1 * q1.x, y: values.lambda1 * q1.y };
  const axis2 = { x: values.lambda2 * q2.x, y: values.lambda2 * q2.y };
  return <g><path className="vector-a" d={`M ${sx(-axis1.x)} ${sy(-axis1.y)} L ${sx(axis1.x)} ${sy(axis1.y)}`} /><path className="vector-b" d={`M ${sx(-axis2.x)} ${sy(-axis2.y)} L ${sx(axis2.x)} ${sy(axis2.y)}`} /><ellipse className="spectral-ellipse" cx={sx(0)} cy={sy(0)} rx={Math.abs(sx(axis1.x) - sx(0))} ry={Math.abs(sy(axis2.y) - sy(0))} transform={`rotate(${-values.rotation} ${sx(0)} ${sy(0)})`} /><text className="graph-note" x="44" y="48">orthogonal axes, independent scaling</text></g>;
}

function DecompositionGraph({ values }) {
  const radians = values.rotation * Math.PI / 180;
  const unit = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
  const transformed = unit.map((p) => {
    const scaled = { x: values.sigma1 * p.x, y: values.sigma2 * p.y };
    return {
      x: scaled.x * Math.cos(radians) - scaled.y * Math.sin(radians),
      y: scaled.x * Math.sin(radians) + scaled.y * Math.cos(radians),
    };
  });
  return <g><path className="shape-original" d={linePath(unit)} /><path className="shape-result" d={linePath(transformed)} /><text className="graph-note" x="44" y="48">singular values scale axes before rotation</text></g>;
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
  const line = (eq) => [{ x: -5, y: (eq.c - eq.a * -5) / eq.b }, { x: 5, y: (eq.c - eq.a * 5) / eq.b }];
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
