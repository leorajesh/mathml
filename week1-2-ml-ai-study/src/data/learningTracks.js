// Two linear study paths through the same concept pages. The concept map and the prerequisite /
// follow-on links are unchanged; a track only fixes an order in which to read the pages.
// Within a track every concept comes after its same-track prerequisites (checked by the test in
// scripts/check-tracks.mjs). Prerequisites from the other track are shown as "you will also use".

export const tracks = {
  math: {
    id: 'math',
    title: 'Math Track',
    short: 'Math',
    description: 'Linear algebra from sets and vectors to eigenvectors and matrix decompositions, in an order where each page only needs the ones before it.',
    sections: [
      { title: 'Foundations', concepts: ['sets-functions', 'feature-vectors'] },
      { title: 'Matrices and linear systems', concepts: ['matrix-operations', 'matrix-multiplication-outer-product', 'matrix-systems', 'gaussian-elimination', 'solution-structure'] },
      { title: 'Vector spaces', concepts: ['vector-spaces-bases', 'linear-independence-subspaces'] },
      { title: 'Linear transformations', concepts: ['linear-transformations', 'transformation-matrix', 'composition-of-transformations'] },
      { title: 'Rank, determinants and inverses', concepts: ['rank-inverse-determinant', 'determinants-cofactor-row-ops', 'invertible-transformations', 'change-of-basis', 'affine-dimensionality-reduction'] },
      { title: 'Eigenvectors and decompositions', concepts: ['eigenvalues-eigenvectors', 'diagonalization-pagerank', 'orthogonality-spectral-theorem', 'matrix-decompositions'] },
    ],
  },
  ml: {
    id: 'ml',
    title: 'ML Track',
    short: 'ML',
    description: 'Machine learning from the supervised workflow through classifiers, losses, optimization, regression, generalization and logistic regression.',
    sections: [
      { title: 'The learning problem', concepts: ['ml-workflow', 'feature-vectors'] },
      { title: 'Linear classification', concepts: ['linear-classifier', 'linear-classifier-through-origin', 'linear-separability', 'perceptron', 'perceptron-convergence'] },
      { title: 'Losses and optimization', concepts: ['empirical-risk-zero-one', 'hinge-loss', 'convexity-surrogate-losses', 'gradient-descent', 'stochastic-subgradient-descent'] },
      { title: 'Regression and regularization', concepts: ['linear-regression', 'polynomial-regression', 'least-squares-normal-equation', 'ridge-regularization', 'lasso-elastic-net'] },
      { title: 'Generalization', concepts: ['model-complexity-generalization', 'validation-cross-validation'] },
      { title: 'Logistic regression', concepts: ['logistic-regression', 'logistic-loss', 'classification-metrics'] },
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

// Tracks that include a concept (feature vectors belong to both).
export function tracksContaining(conceptId) {
  return trackIds.filter((trackId) => trackOrder(trackId).includes(conceptId));
}
