// Two linear study paths through the same concept pages. The concept map and the prerequisite /
// follow-on links are unchanged; a track only fixes an order in which to read the pages.
// Within a track every concept comes after its same-track prerequisites (checked by the test in
// scripts/check-tracks.mjs). Prerequisites from the other track are shown as "you will also use".

export const tracks = {
  math: {
    id: 'math',
    title: 'Math Track',
    short: 'Math',
    description: 'Linear algebra and analytic geometry from sets and vectors to projections, eigenvectors, matrix decompositions, and PCA, in an order where each page only needs the ones before it. Section by section it follows Chapters 2, 3, 4, 5, and 10 of the course reference book, Mathematics for Machine Learning.',
    sections: [
      { title: 'Foundations', concepts: ['sets', 'functions', 'inverse-composition', 'vectors-dot-product', 'norms'] },
      { title: 'Matrices and linear systems', concepts: ['matrix-operations', 'matrix-multiplication-outer-product', 'matrix-systems', 'gaussian-elimination', 'solution-structure'] },
      { title: 'Vector spaces', concepts: ['vector-spaces', 'span-linear-combinations', 'linear-independence', 'subspaces', 'basis-coordinates', 'dimension'] },
      { title: 'Linear transformations', concepts: ['linear-transformations', 'transformation-matrix', 'composition-of-transformations', 'change-of-basis', 'affine-maps'] },
      { title: 'Rank, determinants and inverses', concepts: ['rank-nullity', 'determinant-geometry', 'determinants-cofactor-row-ops', 'invertible-transformations'] },
      { title: 'Analytic geometry: angles and projections', concepts: ['inner-products', 'orthogonality', 'orthogonal-complement', 'orthogonal-projections', 'gram-schmidt'] },
      { title: 'Eigenvalues and eigenvectors', concepts: ['eigenvalues-eigenvectors', 'trace', 'diagonalization', 'pagerank', 'spectral-theorem'] },
      { title: 'Matrix decompositions', concepts: ['lu-decomposition', 'cholesky-decomposition', 'svd'] },
      { title: 'Vector calculus', concepts: ['derivatives', 'partial-derivatives-gradient', 'jacobian-chain-rule', 'loss-gradients', 'backpropagation', 'taylor-hessian'] },
      { title: 'Dimensionality reduction', concepts: ['dimensionality-reduction', 'pca'] },
    ],
  },
  ml: {
    id: 'ml',
    title: 'ML Track',
    short: 'ML',
    description: 'Machine learning from the supervised workflow through classifiers, margins, losses, optimization, regression, generalization, logistic regression, and what changes once a model is in production. Each page lists the course books to read and the math pages it builds on.',
    sections: [
      { title: 'The learning problem', concepts: ['ml-landscape', 'ml-workflow', 'feature-representation'] },
      { title: 'Linear classification', concepts: ['linear-classifier', 'linear-classifier-through-origin', 'linear-separability', 'perceptron', 'perceptron-convergence'] },
      { title: 'Losses and convexity', concepts: ['empirical-risk-zero-one', 'hinge-loss', 'max-margin-svm', 'convex-functions', 'surrogate-losses'] },
      { title: 'Optimization', concepts: ['gradient-descent-method', 'momentum', 'subgradients', 'stochastic-subgradient-descent', 'lagrange-multipliers'] },
      { title: 'Regression and regularization', concepts: ['linear-regression', 'polynomial-regression', 'least-squares-normal-equation', 'feature-scaling', 'ridge-regularization', 'lasso', 'elastic-net'] },
      { title: 'Generalization', concepts: ['model-complexity-generalization', 'bias-variance', 'train-validation-test', 'cross-validation'] },
      { title: 'Logistic regression', concepts: ['logistic-regression', 'logistic-loss', 'classification-metrics', 'roc-auc'] },
      { title: 'ML in production', concepts: ['ml-in-production'] },
    ],
  },
};

export const trackIds = Object.keys(tracks);

export function trackOrder(trackId) {
  return tracks[trackId].sections.flatMap((section) => section.concepts);
}

export function isTrackId(value) {
  return Object.hasOwn(tracks, value);
}

// Tracks that include a concept (a concept may be listed in both when both genuinely need it).
export function tracksContaining(conceptId) {
  return trackIds.filter((trackId) => trackOrder(trackId).includes(conceptId));
}
