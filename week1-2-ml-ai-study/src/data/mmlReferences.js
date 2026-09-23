// Where to read more in the course reference book: M. P. Deisenroth, A. A. Faisal, and C. S. Ong,
// "Mathematics for Machine Learning" (Cambridge University Press, 2020), free PDF at
// https://mml-book.github.io. Pages are the printed page numbers; the PDF has 6 front-matter pages
// before printed page 1, so the link opens PDF page (printed + 6). The book is cited, never copied:
// all text and figures on this site are our own. Pages with no matching section in the book
// (sets, the perceptron, elastic net, LU decomposition, classification metrics) have no entry.

export const MML_BOOK = {
  title: 'Mathematics for Machine Learning',
  authors: 'Deisenroth, Faisal, and Ong',
  url: 'https://mml-book.github.io/book/mml-book.pdf',
  home: 'https://mml-book.github.io',
};

const PDF_PAGE_OFFSET = 6;

export function mmlLink(page) {
  return `${MML_BOOK.url}#page=${page + PDF_PAGE_OFFSET}`;
}

const ref = (section, title, page) => ({ section, title, page });

export const mmlReferences = {
  'ml-workflow': [ref('8.1', 'Data, Models, and Learning', 251)],
  'feature-representation': [ref('8.1.1', 'Data as Vectors', 252)],
  functions: [ref('2.7', 'Linear Mappings (injective, surjective, bijective)', 48)],
  'inverse-composition': [ref('2.2.2', 'Inverse and Transpose', 24), ref('2.7', 'Linear Mappings', 48)],
  'vectors-dot-product': [ref('3.2.1', 'Dot Product', 72), ref('3.4', 'Angles and Orthogonality', 76)],
  norms: [ref('3.1', 'Norms', 71)],
  'matrix-operations': [ref('2.2', 'Matrices', 22)],
  'matrix-multiplication-outer-product': [ref('2.2.1', 'Matrix Addition and Multiplication', 22)],
  'matrix-systems': [ref('2.1', 'Systems of Linear Equations', 19), ref('2.2.4', 'Compact Representations of Systems of Linear Equations', 26)],
  'gaussian-elimination': [ref('2.3.2', 'Elementary Transformations', 28), ref('2.3.4', 'Algorithms for Solving a System of Linear Equations', 34)],
  'solution-structure': [ref('2.3.1', 'Particular and General Solution', 27)],
  'vector-spaces': [ref('2.4.2', 'Vector Spaces', 37)],
  'span-linear-combinations': [ref('2.5', 'Linear Independence (linear combinations)', 40), ref('2.6.1', 'Generating Set and Basis', 44)],
  'linear-independence': [ref('2.5', 'Linear Independence', 40)],
  subspaces: [ref('2.4.3', 'Vector Subspaces', 39)],
  'basis-coordinates': [ref('2.6.1', 'Generating Set and Basis', 44)],
  dimension: [ref('2.6.1', 'Generating Set and Basis (dimension)', 44)],
  'linear-transformations': [ref('2.7', 'Linear Mappings', 48)],
  'transformation-matrix': [ref('2.7.1', 'Matrix Representation of Linear Mappings', 50)],
  'composition-of-transformations': [ref('2.7.1', 'Matrix Representation of Linear Mappings', 50)],
  'change-of-basis': [ref('2.7.2', 'Basis Change', 53)],
  'rank-nullity': [ref('2.6.2', 'Rank', 47), ref('2.7.3', 'Image and Kernel (rank-nullity theorem)', 58)],
  'determinant-geometry': [ref('4.1', 'Determinant and Trace', 99)],
  'determinants-cofactor-row-ops': [ref('4.1', 'Determinant and Trace (Laplace expansion)', 102)],
  'invertible-transformations': [ref('2.2.2', 'Inverse and Transpose', 24), ref('4.1', 'Determinant and Trace', 99)],
  'affine-maps': [ref('2.8', 'Affine Spaces', 61), ref('2.8.2', 'Affine Mappings', 62)],
  'inner-products': [ref('3.2', 'Inner Products', 72), ref('3.2.3', 'Symmetric, Positive Definite Matrices', 73), ref('3.3', 'Lengths and Distances', 75)],
  orthogonality: [ref('3.4', 'Angles and Orthogonality', 76), ref('3.5', 'Orthonormal Basis', 78)],
  'orthogonal-complement': [ref('3.6', 'Orthogonal Complement', 79), ref('2.7.3', 'Image and Kernel', 58)],
  'orthogonal-projections': [ref('3.8', 'Orthogonal Projections', 81), ref('3.8.2', 'Projection onto General Subspaces', 85)],
  'gram-schmidt': [ref('3.8.3', 'Gram-Schmidt Orthogonalization', 89)],
  'eigenvalues-eigenvectors': [ref('4.2', 'Eigenvalues and Eigenvectors', 105)],
  trace: [ref('4.1', 'Determinant and Trace (trace)', 103), ref('4.2', 'Eigenvalues and Eigenvectors (Theorem 4.17)', 113)],
  diagonalization: [ref('4.4', 'Eigendecomposition and Diagonalization', 115)],
  pagerank: [ref('4.2', 'Eigenvalues and Eigenvectors (PageRank example)', 113)],
  'spectral-theorem': [ref('4.2', 'Eigenvalues and Eigenvectors (spectral theorem)', 111)],
  'dimensionality-reduction': [ref('10.1', 'Problem Setting', 318), ref('10.3', 'Projection Perspective', 325)],
  pca: [ref('10.2', 'Maximum Variance Perspective', 320), ref('10.3', 'Projection Perspective', 325), ref('10.4', 'Eigenvector Computation and Low-Rank Approximations', 333), ref('10.6', 'Key Steps of PCA in Practice', 336)],
  'cholesky-decomposition': [ref('4.3', 'Cholesky Decomposition', 114)],
  svd: [ref('4.5', 'Singular Value Decomposition', 119), ref('4.5.1', 'Geometric Intuitions for the SVD', 120), ref('4.6', 'Matrix Approximation', 129)],

  'linear-classifier': [ref('12.1', 'Separating Hyperplanes', 372)],
  'linear-classifier-through-origin': [ref('12.1', 'Separating Hyperplanes', 372)],
  'linear-separability': [ref('12.1', 'Separating Hyperplanes', 372)],
  'empirical-risk-zero-one': [ref('8.2', 'Empirical Risk Minimization', 258), ref('8.2.2', 'Loss Function for Training', 260)],
  'hinge-loss': [ref('12.2', 'Primal Support Vector Machine (hinge loss)', 381)],
  'convex-functions': [ref('7.3', 'Convex Optimization', 236)],
  'surrogate-losses': [ref('8.2.2', 'Loss Function for Training', 260), ref('12.2', 'Primal Support Vector Machine (hinge loss)', 381)],
  'gradient-descent-method': [ref('7.1', 'Optimization Using Gradient Descent', 227), ref('7.1.1', 'Step-size', 229)],
  momentum: [ref('7.1.2', 'Gradient Descent With Momentum', 230)],
  subgradients: [ref('7.4', 'Further Reading (subgradient methods)', 246)],
  'stochastic-subgradient-descent': [ref('7.1.3', 'Stochastic Gradient Descent', 231)],
  'lagrange-multipliers': [ref('7.2', 'Constrained Optimization and Lagrange Multipliers', 233)],
  'linear-regression': [ref('9.1', 'Problem Formulation', 291), ref('9.2.1', 'Maximum Likelihood Estimation', 293)],
  'polynomial-regression': [ref('9.2.2', 'Overfitting in Linear Regression', 298)],
  'least-squares-normal-equation': [ref('9.2.1', 'Maximum Likelihood Estimation', 293), ref('9.4', 'Maximum Likelihood as Orthogonal Projection', 313)],
  'ridge-regularization': [ref('9.2.4', 'MAP Estimation as Regularization', 302), ref('8.2.3', 'Regularization to Reduce Overfitting', 262)],
  lasso: [ref('9.2.4', 'MAP Estimation as Regularization (LASSO)', 303), ref('3.1', 'Norms', 71)],
  'model-complexity-generalization': [ref('8.2.3', 'Regularization to Reduce Overfitting', 262), ref('8.6', 'Model Selection', 283)],
  'train-validation-test': [ref('8.2.4', 'Cross-Validation to Assess the Generalization Performance', 263)],
  'cross-validation': [ref('8.2.4', 'Cross-Validation to Assess the Generalization Performance', 263), ref('8.6.1', 'Nested Cross-Validation', 284)],
  'logistic-regression': [ref('9.5', 'Further Reading (logistic regression)', 315), ref('6.6', 'Conjugacy and the Exponential Family (the sigmoid)', 213)],
  'logistic-loss': [ref('8.3.1', 'Maximum Likelihood Estimation', 265)],
};

// A topic page lists the sections of its subtopics, without repeats.
export function mmlReferencesFor(ids) {
  const seen = new Set();
  return ids.flatMap((id) => mmlReferences[id] ?? []).filter((item) => {
    const key = `${item.section}|${item.page}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
