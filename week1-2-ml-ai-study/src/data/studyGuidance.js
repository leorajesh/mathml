export const advancedConceptIds = new Set([
  'jacobian-chain-rule',
  'backpropagation',
  'taylor-hessian',
  'orthogonal-complement',
  'gram-schmidt',
  'trace',
  'pca',
  'lagrange-multipliers',
  'projections-gram-schmidt',
  'lasso',
  'elastic-net',
  'train-validation-test',
  'cross-validation',
  'affine-maps',
  'dimensionality-reduction',
  'diagonalization',
  'pagerank',
  'orthogonality',
  'spectral-theorem',
  'lu-decomposition',
  'cholesky-decomposition',
  'svd',
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
  'overview-optimization': ['convexity-surrogate-losses', 'gradient-descent', 'stochastic-subgradient-descent', 'lagrange-multipliers'],
  'overview-regression': ['linear-regression', 'least-squares-normal-equation', 'gradient-descent', 'polynomial-regression', 'ridge-regularization', 'lasso-elastic-net'],
  'overview-generalization': ['model-complexity-generalization', 'validation-cross-validation', 'logistic-regression', 'logistic-loss', 'classification-metrics'],
  'overview-vector-calculus': ['vector-calculus', 'gradient-descent', 'least-squares-normal-equation', 'logistic-loss'],
  'overview-analytic-geometry': ['norms-inner-products', 'orthogonality-spectral-theorem', 'projections-gram-schmidt', 'least-squares-normal-equation'],
  'overview-advanced-math': ['affine-dimensionality-reduction', 'eigenvalues-eigenvectors', 'trace', 'diagonalization-pagerank', 'orthogonality-spectral-theorem', 'matrix-decompositions', 'pca'],
};

export const guidedSelfChecks = {
  derivatives: [
    { question: 'Why does the chain rule multiply the two derivatives instead of adding them?', answer: 'Rates of change compound. If f grows 2 times as fast as x and g grows 3 times as fast as f, then g grows 3 * 2 = 6 times as fast as x.' },
  ],
  'partial-derivatives-gradient': [
    { question: 'Why does gradient descent step against the gradient rather than along a coordinate axis?', answer: 'Among all directions of the same length, the negative gradient decreases f the fastest (to first order): the slope along u is grad f dot u, which is most negative when u points opposite the gradient.' },
  ],
  'jacobian-chain-rule': [
    { question: 'In the chain rule for g(f(x)), why is it (Jacobian of g) times (Jacobian of f) and not the other way round?', answer: 'The shapes force it: dg/df is k by m and df/dx is m by n, so only (dg/df)(df/dx) is defined and gives the k by n Jacobian of the composition. It mirrors the order of composition: f acts first, on the right.' },
  ],
  'loss-gradients': [
    { question: 'How can you check a hand-derived gradient?', answer: 'Compare it with finite differences: nudge one coordinate by a small eps in each direction and compute (L(theta + eps e_i) - L(theta - eps e_i)) / (2 eps). The two should agree to several digits.' },
  ],
  backpropagation: [
    { question: 'Why is backpropagation much faster than finite differences for a model with a million weights?', answer: 'Finite differences need about one extra loss evaluation per weight, so a million forward passes. Backpropagation gets every derivative from one forward and one backward pass, and it is exact rather than approximate.' },
  ],
  'taylor-hessian': [
    { question: 'Why does gradient descent zig-zag on some bowls, and what does the Hessian have to do with it?', answer: 'When the Hessian\'s eigenvalues differ a lot, the bowl is steep in one direction and flat in another. A step size small enough for the steep direction is tiny for the flat one, so the iterates bounce across the steep walls while creeping along the valley.' },
  ],
  norms: [
    { question: 'Why does lasso use the L1 norm rather than the L2 norm to get sparse weights?', answer: 'The L1 unit ball is a diamond with corners on the axes, and the loss contours usually first touch it at a corner, where some weights are exactly 0. The round L2 ball has no corners, so weights shrink but rarely hit 0.' },
  ],
  'inner-products': [
    { question: 'Is <x, y> = x^T A y with A = [[1, 2], [2, 1]] an inner product?', answer: 'No. A is symmetric but not positive definite (its eigenvalues are 3 and -1): for x = [1, -1], x^T A x = 1 - 4 + 1 = -2 < 0, so some nonzero vector would get a negative "squared length".' },
  ],
  'orthogonal-complement': [
    { question: 'Why must Ax = b have no solution when b has a nonzero component in the left null space of A?', answer: 'Every Ax lies in the column space, which is perpendicular to the left null space. If b has a part in the left null space, no combination of the columns can produce that part.' },
  ],
  'orthogonal-projections': [
    { question: 'How does the projection formula simplify when the columns of B are orthonormal?', answer: 'B^T B = I, so lambda = B^T x (just dot products) and P = B B^T. This is why orthonormal bases, from Gram-Schmidt or the SVD, make projections cheap.' },
  ],
  'gram-schmidt': [
    { question: 'What is R in A = QR, and why is it upper triangular?', answer: 'R = Q^T A holds the dot products q_j . a_k. Column a_k is built only from q_1 to q_k, so q_j . a_k = 0 whenever j > k, and every entry below the diagonal is zero.' },
  ],
  trace: [
    { question: 'Can two matrices with the same trace and determinant have different eigenvalues?', answer: 'Not for 2 by 2 matrices: the eigenvalues solve lambda^2 - tr(A) lambda + det(A) = 0, so trace and determinant fix them. For larger matrices they can differ, because more coefficients of the characteristic polynomial are needed.' },
  ],
  pca: [
    { question: 'Why do the maximum-variance and minimum-reconstruction-error views of PCA give the same answer?', answer: 'For each centered point, the squared length splits into the part kept by the projection and the part lost (Pythagoras). The total is fixed, so maximizing the kept variance is the same as minimizing the average lost error.' },
  ],
  momentum: [
    { question: 'Why can momentum converge faster than plain gradient descent with the same step size?', answer: 'In a narrow valley, plain descent zig-zags across and creeps along the valley. Momentum adds alpha times the last step, so the across-the-valley parts cancel and the along-the-valley parts accumulate into a larger effective step in the useful direction.' },
  ],
  'lagrange-multipliers': [
    { question: 'How is ridge regression related to a constrained problem?', answer: 'Minimizing the squared error subject to ||theta||^2 <= t has Lagrangian error + lambda(||theta||^2 - t). For each t with an active constraint there is a lambda >= 0 giving the same minimizer, which is the ridge objective up to a constant.' },
  ],
  functions: [
    { question: 'Is f(x) = x^2 from the real numbers to the real numbers injective? Surjective?', answer: 'Neither. f(2) = f(-2) = 4, so it is not injective, and no real x gives a negative output such as -1, so it is not surjective.' },
  ],
  'inverse-composition': [
    { question: 'Why is (g after f) inverse equal to f inverse after g inverse, not g inverse after f inverse?', answer: 'The last step applied must be undone first. g acted last, so undo g first, then undo f, like taking off shoes before socks.' },
  ],
  'span-linear-combinations': [
    { question: 'How do you check whether b is in the span of some vectors?', answer: 'Put the vectors as columns of a matrix and solve Ax = b. If the system is consistent, the solution gives the amounts; if it is inconsistent, b is not in the span.' },
  ],
  'linear-independence': [
    { question: 'Can three vectors in R^2 be independent?', answer: 'No. R^2 has dimension 2, so any three vectors in it are dependent: elimination leaves at most two pivots for three columns.' },
  ],
  subspaces: [
    { question: 'Is the set of solutions of Ax = b a subspace?', answer: 'Only when b = 0. For b not zero it does not contain the origin; it is an affine set, a particular solution plus the null space.' },
  ],
  'vector-spaces': [
    { question: 'Is the set of 2 by 2 matrices a vector space?', answer: 'Yes. Adding two 2 by 2 matrices or scaling one gives another 2 by 2 matrix, the zero matrix is included, and the arithmetic rules hold entry by entry.' },
  ],
  dimension: [
    { question: 'What is the dimension of the null space of a 3 by 5 matrix with rank 3?', answer: 'By rank-nullity, nullity = 5 - 3 = 2, so the null space is a plane inside R^5.' },
  ],
  'affine-maps': [
    { question: 'How can an affine map f(x) = Ax + b be written as a single matrix product?', answer: 'Append a 1 to x. Then [f(x); 1] = [[A, b], [0, 1]] [x; 1]. This is the same trick as adding a constant feature to absorb the bias.' },
  ],
  'dimensionality-reduction': [
    { question: 'Why can a projection onto fewer dimensions never be undone exactly?', answer: 'Different points with the same projection, such as points along the discarded direction, get the same compressed coordinates, so the map is not injective.' },
  ],
  'rank-nullity': [
    { question: 'A 4 by 6 matrix has rank 4. What is its nullity, and can Ax = b always be solved?', answer: 'Nullity = 6 - 4 = 2. Rank 4 equals the number of rows, so the columns span R^4 and every b has solutions (infinitely many, because of the 2 free directions).' },
  ],
  'determinant-geometry': [
    { question: 'If det(A) = 3, what is det(2A) for a 2 by 2 matrix A?', answer: 'Scaling a 2 by 2 matrix by 2 scales each of its 2 rows, so det(2A) = 2^2 * 3 = 12.' },
  ],
  'surrogate-losses': [
    { question: 'Why not train directly on the zero-one loss?', answer: 'It is flat almost everywhere, so its gradient gives no direction to move, and minimizing it exactly is computationally hard. A convex surrogate gives useful slopes and still upper-bounds the error.' },
  ],
  'gradient-descent-method': [
    { question: 'For J(theta) = (theta - 3)^2, which learning rates converge?', answer: 'Each step multiplies the distance to 3 by (1 - 2 alpha). It converges when |1 - 2 alpha| < 1, that is 0 < alpha < 1; alpha = 0.5 lands on the minimum in one step.' },
  ],
  subgradients: [
    { question: 'What are the subgradients of hinge loss max(0, 1 - z) at z = 1?', answer: 'Every slope between -1 and 0. The left piece has slope -1 and the right piece slope 0, and any value between them gives a line that stays below the loss.' },
  ],
  lasso: [
    { question: 'Why does lasso set weights exactly to zero while ridge does not?', answer: 'The L1 penalty pulls with constant strength lambda no matter how small the weight is, so small weights are pulled all the way to zero. The L2 pull is proportional to the weight and fades near zero.' },
  ],
  'elastic-net': [
    { question: 'When would you prefer elastic net over lasso?', answer: 'When groups of features are strongly correlated. Lasso tends to keep one of them arbitrarily; elastic net\'s L2 part spreads weight across the group while still allowing exact zeros.' },
  ],
  'train-validation-test': [
    { question: 'Why can\'t the validation score be reported as the final performance?', answer: 'The validation set was used to choose the hyperparameter, so the chosen model is slightly tuned to it. Its score is optimistic; only the untouched test set gives an honest estimate.' },
  ],
  'cross-validation': [
    { question: 'What does increasing k in k-fold cross-validation change?', answer: 'Each run trains on more data (a fraction (k - 1)/k), so the estimate is closer to the full-data model, but you train k times, which costs more.' },
  ],
  diagonalization: [
    { question: 'Why do distinct eigenvalues guarantee diagonalizability?', answer: 'Eigenvectors for different eigenvalues are linearly independent, so n distinct eigenvalues give n independent eigenvectors, enough to form an invertible P.' },
  ],
  pagerank: [
    { question: 'What does the damping factor d do?', answer: 'With probability 1 - d the surfer jumps to a random page. This makes every page reachable, guarantees one steady state, and speeds up convergence.' },
  ],
  orthogonality: [
    { question: 'Why is solving Qx = b easy when Q is orthogonal?', answer: 'Q inverse equals Q transpose, so x = Q^T b: just dot products with the columns, no elimination needed.' },
  ],
  'spectral-theorem': [
    { question: 'Are the eigenvalues of a real symmetric matrix always real?', answer: 'Yes. The spectral theorem guarantees real eigenvalues and an orthonormal set of eigenvectors for every real symmetric matrix.' },
  ],
  'lu-decomposition': [
    { question: 'Why factor A = LU instead of running elimination each time?', answer: 'Elimination costs about n^3 operations, but two triangular solves cost about n^2. With many right-hand sides b, you pay for elimination once and reuse L and U.' },
  ],
  'cholesky-decomposition': [
    { question: 'How can Cholesky tell you whether a symmetric matrix is positive definite?', answer: 'Run the algorithm: it succeeds with positive diagonal entries exactly when the matrix is positive definite, and fails with a non-positive number under a square root otherwise.' },
  ],
  svd: [
    { question: 'How are singular values related to eigenvalues?', answer: 'The singular values of A are the square roots of the eigenvalues of A^T A. For a symmetric positive semidefinite A they equal its eigenvalues.' },
  ],

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
  'convex-functions': [
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
  sets: [
    { question: 'What extra properties does a function need before an inverse exists?', answer: 'It must be bijective: injective so no two inputs share an output, and surjective so every target output is reached.' },
  ],
  'gaussian-elimination': [
    { question: 'What do pivot columns tell you?', answer: 'Pivot columns identify basic variables and independent directions. Missing pivots create free variables.' },
  ],
  'basis-coordinates': [
    { question: 'Why does a basis make coordinates unique?', answer: 'A basis spans the space and is linearly independent, so every vector has exactly one linear-combination representation.' },
  ],
  'composition-of-transformations': [
    { question: 'Why do matrix products represent composed transformations?', answer: 'The right matrix maps the input first, and the left matrix maps that output. The row-column rule is exactly the coordinate calculation for this composition.' },
  ],
  'determinants-cofactor-row-ops': [
    { question: 'Which row operations change a determinant?', answer: 'Swapping rows flips the sign; scaling a row by c scales the determinant by c; adding a multiple of one row to another does not change it.' },
  ],
};
