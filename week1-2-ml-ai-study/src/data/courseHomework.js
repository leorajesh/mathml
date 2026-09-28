// Reading guides for the course's own homework sheets: for each problem, the topic in our words and the
// pages that teach what it needs. No problem text or solutions are reproduced; the pages' worked
// examples use different numbers, so the homework is still the student's own work.

export const courseHomework = [
  {
    id: 'math-hw1',
    track: 'math',
    course: '99.512 Mathematics for AI',
    title: 'Homework 1',
    note: 'Checked by working the sheet by hand with only this site (no code): every problem can be solved from these pages. Read the worked examples; they use different numbers from the sheet.',
    items: [
      { problems: '1', topic: 'When a product of matrices is defined, its size, and computing products and transposes', pages: ['matrix-operations', 'matrix-multiplication-outer-product'] },
      { problems: '2', topic: 'Testing linear independence by Gaussian elimination', pages: ['linear-independence', 'gaussian-elimination'] },
      { problems: '3', topic: 'The standard basis of a space of matrices (E_ij) and stretching a matrix into a vector', pages: ['dimension', 'vector-spaces', 'basis-coordinates'] },
      { problems: '4', topic: 'Matrices of projections and reflections in R³', pages: ['transformation-matrix', 'orthogonal-projections'] },
      { problems: '5', topic: 'The matrix of differentiation between polynomial spaces, and basis order', pages: ['transformation-matrix', 'vector-spaces', 'derivatives'] },
      { problems: '6', topic: 'Inverting a matrix by Gauss-Jordan on [A | I]', pages: ['invertible-transformations', 'gaussian-elimination'] },
      { problems: '7', topic: 'Reading the matrix of a map off its formula; rank and nullity', pages: ['transformation-matrix', 'rank-nullity'] },
      { problems: '8', topic: 'Large determinants by row reduction to triangular form', pages: ['determinants-cofactor-row-ops', 'determinant-geometry'] },
      { problems: '9', topic: 'Change of basis between two non-standard bases, [I]_{BB~}', pages: ['change-of-basis', 'basis-coordinates'] },
      { problems: '10', topic: 'Checking that n vectors form a basis of Rⁿ; the change of basis to the standard basis, [I]_{SC}', pages: ['dimension', 'linear-independence', 'change-of-basis'] },
      { problems: '11', topic: 'Examples of linear (and affine, not linear) maps', pages: ['linear-transformations', 'affine-maps'] },
      { problems: '12', topic: 'Proofs from the vector space axioms', pages: ['vector-spaces'] },
      { problems: '13', topic: 'Proving that a set is a subspace', pages: ['subspaces', 'sets'] },
      { problems: '14', topic: 'tr(AB) = tr(BA) for rectangular A and B', pages: ['trace', 'matrix-multiplication-outer-product'] },
      { problems: '15', topic: 'Matrices of a map with respect to different bases, [T]_{CB}, and converting between them', pages: ['transformation-matrix', 'change-of-basis', 'composition-of-transformations'] },
    ],
  },
  {
    id: 'ml-hw1',
    track: 'ml',
    course: '61.501 Production Ready Machine Learning',
    title: 'Homework 1',
    note: 'Checked against the sheet: every part can be done from these pages and their "From formula to code" steps. The pages use different data and numbers, so the results are still your own.',
    items: [
      { problems: '1(a)-(c)', topic: 'The perceptron with offset on a two-feature data file: loading a CSV, mapping labels to +1 and -1, a fixed number of passes in file order, and test accuracy', pages: ['perceptron', 'linear-classifier', 'feature-representation', 'empirical-risk-zero-one'] },
      { problems: '2(a)', topic: 'Closed-form least squares with a column of ones, plotting the line, and the empirical risk with the loss z^2/2', pages: ['least-squares-normal-equation', 'linear-regression'] },
      { problems: '2(b)', topic: 'Batch and stochastic gradient descent with a fixed step for a few epochs, keeping the lowest empirical risk', pages: ['linear-regression', 'gradient-descent-method', 'feature-scaling'] },
      { problems: '2(c)', topic: 'Polynomial features added to the closed form, training error against degree, and why a computed error can rise at high degree', pages: ['polynomial-regression', 'least-squares-normal-equation', 'multicollinearity', 'model-complexity-generalization'] },
      { problems: '3(a)-(b)', topic: 'Ridge regression in the (n lambda I + X^T X) form, a fixed validation split, and training and validation loss over a log-scale range of lambda', pages: ['ridge-regularization', 'train-validation-test', 'bias-variance'] },
      { problems: '4(a)', topic: 'The maximum-margin separator, the role of the hyperplane, regularization for non-separable data, and what a narrow margin would do to generalization', pages: ['max-margin-svm', 'svm-margins', 'hinge-loss', 'model-complexity-generalization'] },
      { problems: '4(b)', topic: 'Slack variables in the soft-margin primal, and choosing C by validation', pages: ['soft-margin-svm', 'cross-validation'] },
      { problems: '4(c)', topic: 'Building kernels with the sum and product rules, and testing whether a function is a valid kernel (feature map, K(x, x) and Gram-matrix checks)', pages: ['valid-kernels', 'kernel-trick', 'positive-definite'] },
      { problems: '5(a)', topic: 'Reading a logistic regression output as P(y = 1 | x) and P(y = 0 | x)', pages: ['logistic-regression'] },
      { problems: '5(b)', topic: 'Logistic regression from scratch on two features: standardizing, gradient descent on the log loss, the loss curve, the decision boundary, and test accuracy', pages: ['logistic-loss', 'logistic-regression', 'feature-scaling', 'classification-metrics'] },
    ],
  },
  {
    id: 'math-w3-activities',
    kind: 'activities',
    track: 'math',
    course: '99.512 Mathematics for AI',
    title: 'Week 3 class activities',
    note: 'The in-class activities of Week 3 (eigenvalues, diagonalization, Cholesky and LU), by topic only. The pages work the same methods on different matrices, and the Eigenvalues and Matrix decompositions homework sets have practice problems of each kind.',
    items: [
      { problems: 'Class 1, Activity 1', topic: 'Eigenvalues and eigenspaces of a triangular matrix with a repeated eigenvalue', pages: ['eigenvalues-eigenvectors', 'eigenspaces-multiplicity'] },
      { problems: 'Class 1, Activity 2', topic: 'Deciding whether 3 by 3 matrices are diagonalizable and finding P and D; row operations before cofactor expansion for the characteristic polynomial', pages: ['eigenspaces-multiplicity', 'diagonalization', 'determinants-cofactor-row-ops'] },
      { problems: 'Class 2, Activity 1', topic: 'Cholesky factor of a 3 by 3 symmetric positive definite matrix, solved entry by entry', pages: ['positive-definite', 'cholesky-decomposition'] },
      { problems: 'Class 2, Activity 2', topic: 'Solving a 4 by 4 system directly and with LU (forward then back substitution)', pages: ['lu-decomposition', 'gaussian-elimination'] },
    ],
  },
];
