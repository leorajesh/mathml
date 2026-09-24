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

The build uses relative asset paths (`base: './'` in `vite.config.js`), so the same `dist/` works at a
domain root and under a sub-path such as GitHub Pages' `/mathml/`.

## Topics and subtopics

Titles that name several ideas are **topics** with one page per **subtopic** (74 concept pages, 16 topics),
defined in `src/data/subtopics.js`. A topic keeps its original id, so the concept map, old links, and
map edges point at its overview page, which lists the subtopics in order; each subtopic page shows a
"Part of <topic>" bar with links to its siblings.

After editing content, run `npm run check`. It verifies that every prerequisite / follow-on link
resolves, every graph type exists, worked-example formulas line up with their steps, every concept has
Python starter code, topics are consistent, all KaTeX renders, every figure exists and has alt text,
every page the reference book covers cites it, and the tracks respect prerequisites.

## Quizzes

Section 8 of every concept page is a multiple-choice quiz (3 questions per concept, 222 in all) with a
score, per-question feedback, and an explanation for every answer. Options are shuffled so the correct
answer is not always first, and "Try again" reshuffles. Topic overview pages have a combined quiz of
their subtopics. The best score is saved in the browser and shown in the track lists.

Questions live in `src/data/quizzes.js` as `{ question, answer, wrong: [3 options], why }`;
`npm run check` verifies every concept has at least 3 well-formed questions.

## Learning tracks

Besides the concept map, the app has two step-by-step tracks: the **Math Track** (46 concepts) and the
**ML Track** (28 concepts). No concept is in both: where a page mixed math and ML (Feature Vectors and
Dot Products) it is split into a math page and an ML page, and ML pages link to the math they rely on. They reuse the same concept pages and leave the
map and the prerequisite / follow-on links unchanged; a track only adds an order, previous / next buttons,
and "done" checkmarks saved in the browser. Links: `#track=math`, `#track=ml`, and
`#<concept-id>?track=math` for a concept inside a track.

Tracks are defined in `src/data/learningTracks.js`. After editing them, run `npm run check:tracks`: it
fails if a concept is missing from both tracks or appears before a prerequisite from its own track.

## Reference book: Mathematics for Machine Learning

The course reference is Deisenroth, Faisal, and Ong, *Mathematics for Machine Learning* (free PDF at
https://mml-book.github.io). The app follows it in three ways:

- **Pages from the book.** Norms; inner products; orthogonal complements and the four fundamental
  subspaces; orthogonal projections; Gram-Schmidt; trace; vector calculus (derivatives, gradients,
  Jacobians and the chain rule, loss gradients, backpropagation, Taylor series and the Hessian); PCA
  (Ch. 3, 4, 5, 10) in the Math Track, and
  gradient descent with momentum and Lagrange multipliers (Ch. 7) in the ML Track. Least squares is
  also explained as a projection (§9.4), and the SVD page rebuilds an image from its top singular values.
- **"Read more in the MML book"** at the end of every page and topic: the matching sections, each linking
  to the right page of the PDF. References live in `src/data/mmlReferences.js` (printed page numbers;
  the PDF page is printed + 6). Pages the book does not cover (sets, the perceptron, elastic net, LU,
  classification metrics) have none.
- **"Picture it" figures** under the intuition of some pages (row and column pictures of Ax = b, L1 vs
  L2 balls, projection onto a plane, the SVD circle-to-ellipse, the four subspaces, zig-zag vs momentum,
  Lagrange tangency, forward and backward passes through a network). Captions and alt text are in `src/data/figures.js`, drawings in
  `src/components/Figures.jsx`.

The book's licence allows personal use only and no derivative works, so nothing is copied from it: all
text, examples, and figures here are our own, and the book is cited by section and figure number.

## Runnable Python

Section 6 of every concept page ("Try It in Python") is an editable, runnable Python cell:

- Code runs in the browser with [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly) inside a
  Web Worker (`src/python/pyodideWorker.js`), so the page stays responsive and **Stop** can end runaway loops.
  Pyodide and packages such as numpy, sympy, scipy, and matplotlib load from `cdn.jsdelivr.net` on the first
  run and are cached by the browser afterward. Set `VITE_PYODIDE_BASE` at build time to self-host them.
- Students can edit the code (CodeMirror editor; **Ctrl/Cmd+Enter** runs it). Edits are saved per concept in
  the browser's localStorage. **Reset** restores the original example, and **Versions** keeps the last ten
  versions (saved on each run and before each reset) so earlier code can be restored.
- `print` output, readable tracebacks, and matplotlib figures (as images) appear below the editor.

Starter code lives in `src/data/codeExamples.js`. Each snippet should reproduce the page's worked example
and end with a `# Try:` suggestion.

## Edit content

Most content lives in `src/data/concepts.js`:

- `concepts`: concept pages, formulas, examples, graph settings, misconceptions, links, and source labels.
- `mindMapNodes`: visual positions for concept nodes on the landing-page SVG map.
- `mindMapEdges`: dependency arrows between concepts.
- `notCovered`: explicit list of topics omitted and why.

Python starter code lives in `src/data/codeExamples.js`.

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
- Mathematics for Machine Learning (book): norms, inner products, orthogonal complements, projections, Gram-Schmidt, trace, vector calculus and backpropagation, momentum, Lagrange multipliers, and PCA.

Not covered:

- Administrative course logistics and syllabus items.
- Later Production ML topics such as SVMs, clustering, decision trees, ensemble methods, HMMs, reinforcement learning, and anomaly detection because they are outside Week 1-2.
- Most of the Mathematics for Machine Learning book beyond Chapters 2-5, 7, and 10 (probability, and the Bayesian, mixture-model, and SVM chapters).
- Full formal theorem proofs; the app prioritizes intuition, formulas, and worked numeric examples.
