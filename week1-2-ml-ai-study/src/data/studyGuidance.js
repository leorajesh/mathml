export const advancedConceptIds = new Set([
  'lasso-elastic-net',
  'classification-metrics',
  'validation-cross-validation',
  'affine-dimensionality-reduction',
  'eigenvalues-eigenvectors',
  'diagonalization-pagerank',
  'orthogonality-spectral-theorem',
  'matrix-decompositions',
]);

export function conceptLevel(id) {
  return advancedConceptIds.has(id) ? 'Advanced' : 'Fundamental';
}

export const recommendedPaths = {
  'overview-foundations': ['ml-workflow', 'sets-functions', 'feature-vectors'],
  'overview-linear-algebra': ['matrix-operations', 'matrix-multiplication-outer-product', 'matrix-systems', 'gaussian-elimination', 'solution-structure', 'vector-spaces-bases', 'linear-independence-subspaces', 'linear-transformations', 'transformation-matrix', 'composition-of-transformations', 'invertible-transformations', 'rank-inverse-determinant', 'determinants-cofactor-row-ops', 'change-of-basis'],
  'overview-classification': ['linear-classifier', 'linear-classifier-through-origin', 'linear-separability', 'perceptron', 'perceptron-convergence', 'empirical-risk-zero-one', 'hinge-loss'],
  'overview-optimization': ['convexity-surrogate-losses', 'gradient-descent', 'stochastic-subgradient-descent'],
  'overview-regression': ['linear-regression', 'least-squares-normal-equation', 'gradient-descent', 'polynomial-regression', 'ridge-regularization', 'lasso-elastic-net'],
  'overview-generalization': ['model-complexity-generalization', 'validation-cross-validation', 'logistic-regression', 'logistic-loss', 'classification-metrics'],
  'overview-advanced-math': ['affine-dimensionality-reduction', 'eigenvalues-eigenvectors', 'diagonalization-pagerank', 'orthogonality-spectral-theorem', 'matrix-decompositions'],
};

export const guidedSelfChecks = {
  'ml-workflow': [
    { question: 'Can you explain why memorizing the training set is not the same as learning?', answer: 'Memorization can make training error zero without giving a rule that works on unseen examples. Learning means finding a hypothesis that generalizes beyond the sample.' },
    { question: 'Can you name the six ML design choices in order?', answer: 'Problem/input-output definition, feature representation, hypothesis class, loss, optimization method, and generalization/evaluation strategy.' },
  ],
  'linear-classifier-through-origin': [
    { question: 'What changes when the bias term theta_0 is removed?', answer: 'The decision boundary becomes theta dot x = 0, so it must pass through the origin. The classifier can rotate the boundary but cannot shift it.' },
  ],
  'linear-separability': [
    { question: 'What must be true for every signed margin in a linearly separable dataset?', answer: 'There must exist parameters such that every signed margin y(theta dot x + theta_0) is strictly positive.' },
  ],
  perceptron: [
    { question: 'What triggers a perceptron update?', answer: 'An update happens when y(theta dot x + theta_0) <= 0, meaning the example is misclassified or exactly on the boundary.' },
  ],
  'perceptron-convergence': [
    { question: 'What does separability guarantee for perceptron?', answer: 'If the data are linearly separable, perceptron makes finitely many mistakes and eventually finds a separator. The mistake bound scales like (R/gamma)^2.' },
  ],
  'hinge-loss': [
    { question: 'Why can a correct prediction still have positive hinge loss?', answer: 'Hinge loss is zero only when the signed margin is at least 1. Correct predictions with margin between 0 and 1 are still too close to the boundary.' },
  ],
  'convexity-surrogate-losses': [
    { question: 'How can you check convexity in practice?', answer: 'Use the chord definition, check f"(x) >= 0 for one-variable twice-differentiable functions, or check the Hessian is positive semidefinite in multiple dimensions.' },
  ],
  'stochastic-subgradient-descent': [
    { question: 'How does hinge-loss SSGD differ from perceptron?', answer: 'Perceptron updates when margin <= 0. Hinge SSGD updates when margin <= 1, uses a learning rate, and can optimize non-separable data.' },
  ],
  'least-squares-normal-equation': [
    { question: 'How does the normal equation arise from squared residuals?', answer: 'Taking the gradient of the squared-error objective and setting it to zero gives X^T X theta = X^T y.' },
  ],
  'ridge-regularization': [
    { question: 'Why can increasing training loss improve test performance?', answer: 'Regularization deliberately resists fitting noise. It may raise training loss while reducing variance and improving unseen performance.' },
  ],
  'logistic-regression': [
    { question: 'How do you turn a sigmoid probability into a class prediction?', answer: 'Use a threshold, usually 0.5: predict class 1 if h(x) >= 0.5, otherwise predict class 0.' },
  ],
  'logistic-loss': [
    { question: 'Why does taking logs preserve the maximizer but make optimization easier?', answer: 'Log is increasing, so it does not change which theta maximizes likelihood. It turns products into sums and improves numerical stability.' },
  ],
  'sets-functions': [
    { question: 'What extra properties does a function need before an inverse exists?', answer: 'It must be bijective: injective so no two inputs share an output, and surjective so every target output is reached.' },
  ],
  'gaussian-elimination': [
    { question: 'What do pivot columns tell you?', answer: 'Pivot columns identify basic variables and independent directions. Missing pivots create free variables.' },
  ],
  'vector-spaces-bases': [
    { question: 'Why does a basis make coordinates unique?', answer: 'A basis spans the space and is linearly independent, so every vector has exactly one linear-combination representation.' },
  ],
  'composition-of-transformations': [
    { question: 'Why do matrix products represent composed transformations?', answer: 'The right matrix maps the input first, and the left matrix maps that output. The row-column rule is exactly the coordinate calculation for this composition.' },
  ],
  'determinants-cofactor-row-ops': [
    { question: 'Which row operations change a determinant?', answer: 'Swapping rows flips the sign; scaling a row by c scales the determinant by c; adding a multiple of one row to another does not change it.' },
  ],
};
