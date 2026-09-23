# ML & Mathematics for AI Study Map

A Vite + React 18 study app built from the attached Production ML and Mathematics for AI notes. It is designed for conceptual understanding: every concept page follows the same sequence from problem statement through intuition, formulas, numeric example, interactive graph, misconception, and prerequisite/follow-on links.

## Run locally

```bash
npm install
npm run dev
```

The app uses KaTeX through `katex` and `react-katex` from npm. There is no CDN dependency for math rendering, so formulas work offline after dependencies are installed.

## Build

```bash
npm run build
```

## Edit content

Most content lives in `src/data/concepts.js`:

- `concepts`: concept pages, formulas, examples, graph settings, misconceptions, links, and source labels.
- `mindMapNodes`: visual positions for concept nodes on the landing-page SVG map.
- `mindMapEdges`: dependency arrows between concepts.
- `notCovered`: explicit list of topics omitted and why.

Worked-example KaTeX blocks live in `src/data/workedExampleMath.js`. Keep those arrays aligned with each concept's `example` array in `src/data/concepts.js`; use `null` for a text-only step.

To change layouts or rendering behavior, edit:

- `src/components/MindMap.jsx` for the landing mind map.
- `src/components/ConceptGraph.jsx` for interactive SVG graph types.
- `src/App.jsx` for page ordering and navigation.
- `src/styles.css` for visual styling.

## Source scope

Covered from the attached material:

- Production ML Week 1: ML workflow, feature vectors, linear classifiers, perceptron, zero-one loss, hinge loss, subgradient descent, generalization framing.
- Production ML Week 2: linear regression, least squares, normal equation, gradient descent for regression, ridge regression, overfitting/generalization, logistic regression, sigmoid probabilities, logistic loss.
- Mathematics for AI Week 1-2: matrices, linear systems, vector spaces, bases, linear transformations, change of basis, invertibility, rank/nullity, determinants.
- Mathematics for AI Week 3: eigenvalues, eigenvectors, diagonalization, PageRank intuition, orthogonality, spectral theorem, Cholesky, LU, and SVD.

Not covered:

- Administrative course logistics and syllabus items.
- Later Production ML topics such as SVMs, clustering, decision trees, ensemble methods, HMMs, reinforcement learning, and anomaly detection because they are outside Week 1-2.
- The full Mathematics for Machine Learning book, except where Week 1-2 lecture concepts require standard linear algebra context.
- Full formal theorem proofs; the app prioritizes intuition, formulas, and worked numeric examples.
