// How each machine learning page uses the mathematics pages: the "Math behind this page" box on an
// ML page, and (read in reverse) the "Where machine learning uses this" box on a math page.
// Every id on the left is an ML Track page and every linked id is a Math Track page
// (checked by scripts/check-content.mjs).

const use = (id, why) => ({ id, why });

export const mathLinks = {
  'ml-landscape': [
    use('probability-basics', 'Supervised learning estimates p(y | x), the probability of a label given the inputs.'),
    use('expectation-variance', 'Reinforcement learning maximizes an expected total reward.'),
    use('functions', 'Supervised learning looks for a function h from the input space X to the output space Y.'),
    use('vectors-dot-product', 'Each example, such as a tumour with 30 measurements, becomes a vector in R^30.'),
  ],
  'ml-workflow': [
    use('functions', 'A model is a function h from inputs to labels; learning picks one h from a family of functions (the hypothesis class).'),
    use('sets', 'The training set S_n and the hypothesis class are sets, and the labels come from a small set such as {-1, +1}.'),
  ],
  'feature-representation': [
    use('vectors-dot-product', 'Each example becomes a vector in R^d, and the model\'s score theta . x is a dot product.'),
    use('vector-spaces', 'Feature vectors can be added and scaled, which is what lets averages, gradients, and weight updates make sense.'),
  ],
  'linear-classifier': [
    use('vectors-dot-product', 'The class is the sign of theta . x + theta_0; the dot product measures how far x points along theta.'),
    use('affine-maps', 'The score theta . x + theta_0 is an affine function, so the boundary is a line, plane, or hyperplane.'),
    use('orthogonal-projections', 'The distance from x to the boundary is |theta . x + theta_0| / ||theta||, the length of a projection onto the normal theta.'),
  ],
  'linear-classifier-through-origin': [
    use('orthogonal-complement', 'The boundary theta . x = 0 is exactly the set of vectors perpendicular to theta: a subspace through the origin.'),
    use('subspaces', 'Without theta_0 the boundary must contain 0, which is why it is a subspace rather than a shifted plane.'),
  ],
  'linear-separability': [
    use('vectors-dot-product', 'Separable means one theta makes every signed margin y (theta . x + theta_0) positive.'),
    use('norms', 'Dividing the signed margin by ||theta|| turns it into a distance; the smallest such distance over the data is the geometric margin gamma.'),
  ],
  perceptron: [
    use('vectors-dot-product', 'A mistake adds y x to theta, which raises y theta . x by x . x = ||x||^2.'),
  ],
  'perceptron-convergence': [
    use('inner-products', 'The proof compares how fast theta . theta* grows with how slowly ||theta|| grows, using the Cauchy-Schwarz inequality.'),
    use('norms', 'The bound (R/gamma)^2 is a ratio of lengths: the largest ||x|| and the margin.'),
  ],
  'empirical-risk-zero-one': [
    use('functions', 'The zero-one loss is an indicator function: 1 for a mistake, 0 otherwise.'),
    use('expectation-variance', 'Empirical risk is an average of losses. On fresh examples it estimates the expected error; on the data a model was fitted to, it is optimistic.'),
  ],
  'hinge-loss': [
    use('derivatives', 'Hinge loss is piecewise linear with a corner at margin 1: slope -1 on one side, 0 on the other.'),
  ],
  'max-margin-svm': [
    use('norms', 'The margin width is 2/||theta||, so a wide margin means a small ||theta||^2, the penalty in the objective.'),
    use('orthogonal-projections', 'The distance from x to the boundary is the length of the projection of x - x0 onto theta, for any point x0 on the boundary: |theta . x + theta_0| / ||theta||.'),
  ],
  'convex-functions': [
    use('taylor-hessian', 'A twice-differentiable function is convex exactly when its second derivative (Hessian) is nonnegative (positive semidefinite) everywhere.'),
    use('derivatives', 'In one variable, f\'\' >= 0 everywhere is the quick convexity test.'),
  ],
  'surrogate-losses': [
    use('exp-log', 'The logistic surrogate log_2(1 + e^(-z)) is the natural-log loss divided by ln 2.'),
    use('derivatives', 'Hinge and logistic losses have useful slopes where the zero-one loss is flat, which is what gradient methods need.'),
  ],
  'gradient-descent-method': [
    use('partial-derivatives-gradient', 'The update steps against the gradient, the direction in which the loss rises fastest.'),
    use('eigenvalues-eigenvectors', 'On a quadratic loss, the step size must stay below 2 divided by the largest eigenvalue of the Hessian.'),
    use('taylor-hessian', 'How large a step is safe depends on the curvature, the Hessian\'s largest eigenvalue.'),
  ],
  momentum: [
    use('taylor-hessian', 'A narrow valley is a Hessian whose eigenvalues differ a lot (a large condition number kappa).'),
    use('eigenvalues-eigenvectors', 'Along each eigenvector of a quadratic loss, a plain gradient step multiplies the error by 1 - gamma lambda_i, so gamma < 2/lambda_max; the flat directions (small lambda_i) then shrink slowly, and momentum speeds them up.'),
  ],
  subgradients: [
    use('derivatives', 'A subgradient extends the derivative to corners, where a whole range of slopes fits under the function.'),
  ],
  'stochastic-subgradient-descent': [
    use('loss-gradients', 'Each step uses a subgradient of one example\'s hinge loss (plus lambda theta if the SVM penalty is added); the hinge has a corner.'),
    use('expectation-variance', 'If t is picked uniformly, the expected one-example gradient equals the full gradient, so the steps point downhill on average.'),
  ],
  'lagrange-multipliers': [
    use('partial-derivatives-gradient', 'At a constrained minimum the gradients of f and of the constraint are parallel.'),
  ],
  'linear-regression': [
    use('likelihood-mle', 'With Gaussian noise, least squares is maximum likelihood.'),
    use('matrix-multiplication-outer-product', 'All predictions at once are one matrix-vector product, y_hat = X theta.'),
    use('matrix-systems', 'With more examples than features, X theta = y usually has no exact solution, so we minimize the error instead.'),
    use('loss-gradients', 'The gradient of the squared error is what gradient descent follows.'),
  ],
  'polynomial-regression': [
    use('vector-spaces', 'Polynomials of degree at most K form a vector space, and 1, x, ..., x^K are a basis for it: the features.'),
    use('linear-independence', 'Repeated or collinear features make X^T X singular, so the normal equation has no unique solution.'),
  ],
  'least-squares-normal-equation': [
    use('orthogonal-projections', 'The fitted values X theta_hat are the orthogonal projection of y onto the column space of X.'),
    use('loss-gradients', 'Setting the gradient -(1/n) X^T (y - X theta) of R_n to zero gives the normal equation X^T X theta = X^T y.'),
    use('invertible-transformations', 'The formula (X^T X)^(-1) X^T y needs X^T X to be invertible, which holds when the columns of X are linearly independent (full column rank).'),
    use('rank-nullity', 'X^T X is invertible exactly when rank(X) equals the number of features.'),
  ],
  'feature-scaling': [
    use('expectation-variance', 'Standardizing subtracts the mean and divides by the standard deviation, giving mean 0 and spread 1.'),
    use('taylor-hessian', 'Rescaling a feature changes the curvature of the loss, and so how fast gradient descent converges.'),
    use('norms', 'Penalties and distances add up coordinates, so they depend on the units of each feature.'),
    use('pca', 'PCA looks for directions of largest variance, so features must be standardized first or the largest-unit feature wins.'),
  ],
  'ridge-regularization': [
    use('norms', 'The penalty (lambda/2)||theta||_2^2 is half a squared Euclidean norm.'),
    use('eigenvalues-eigenvectors', 'X^T X has eigenvalues >= 0; adding n lambda I (lambda > 0) raises each by n lambda, since A + cI has eigenvalues lambda_i + c, so the matrix is always invertible.'),
    use('spectral-theorem', 'X^T X is symmetric, so it has orthogonal eigenvectors; ridge shrinks the fit most along the directions with small eigenvalues.'),
  ],
  lasso: [
    use('norms', 'The L1 norm\'s diamond-shaped ball has corners on the axes, where weights are exactly zero.'),
  ],
  'elastic-net': [
    use('norms', 'The penalty mixes the L1 and squared L2 norms.'),
  ],
  'model-complexity-generalization': [
    use('expectation-variance', 'Test error is an expectation over the data distribution. For a fixed model, the average loss on fresh examples estimates it; the training error of a fitted model is optimistic.'),
    use('dimension', 'Model complexity often grows with the number of free parameters, the dimension of the hypothesis space.'),
  ],
  'logistic-regression': [
    use('exp-log', 'The sigmoid 1/(1 + e^(-s)) and its inverse, the logit ln(p/(1 - p)), connect scores and probabilities.'),
    use('probability-basics', 'h(x) = p(y = 1 | x) is a conditional probability, and Bayes\' rule is what a generative model uses instead.'),
    use('derivatives', 'The sigmoid\'s derivative is sigma(1 - sigma), which keeps the gradients simple.'),
    use('vectors-dot-product', 'The probability depends on x only through the score theta . x + theta_0.'),
  ],
  'logistic-loss': [
    use('loss-gradients', 'The gradient of the average logistic loss is (1/n) sum (h - y) x, prediction error times input, and its Hessian (1/n) X^T S X with S = diag(h(1 - h)) is positive semidefinite, so the loss is convex.'),
    use('backpropagation', 'The chain rule through the sigmoid is backpropagation on a two-step computation graph.'),
    use('likelihood-mle', 'The logistic loss is the average negative log-likelihood of Bernoulli labels.'),
  ],
  'roc-auc': [
    use('functions', 'The ROC curve is a function from a threshold to a pair (FPR, TPR); sweeping the threshold traces it.'),
    use('probability-basics', 'TPR and FPR are conditional probabilities: P(score >= t | positive) and P(score >= t | negative).'),
    use('covariance-gaussian', 'AUC is P(positive score > negative score); with the graph\'s Gaussian scores, the difference of two independent Gaussians gives AUC = Phi(d / sqrt 2).'),
  ],
  'classification-metrics': [
    use('probability-basics', 'Recall is P(predict yes | truly yes) and precision is P(truly yes | predict yes): the same counts, conditioned differently.'),
  ],
  'bias-variance': [
    use('expectation-variance', 'E[(Z - c)^2] = (E Z - c)^2 + Var Z gives bias^2 + variance; noise in the labels, independent of the training set, adds its variance sigma^2.'),
  ],
  'train-validation-test': [
    use('expectation-variance', 'A held-out error is an average over examples drawn like future data, so it estimates the expected error.'),
  ],
  'cross-validation': [
    use('expectation-variance', 'Averaging k fold scores gives a steadier estimate than one split, because averages have smaller variance (by less than 1/k, since the folds share training data).'),
  ],
  'ml-in-production': [
    use('probability-basics', 'Drift is a change in the joint distribution P(x, y) = P(x) P(y | x): covariate shift changes P(x), concept drift P(y | x).'),
  ],
  'multicollinearity': [
    use('eigenvalues-eigenvectors', 'The eigenvalues of the feature correlation matrix show which combinations of features the data barely vary along.'),
    use('spectral-theorem', 'C is symmetric, so its eigenvectors are orthogonal and the least-squares solution splits into independent pieces, one per eigen-direction.'),
    use('covariance-gaussian', 'The weight estimates have covariance (sigma^2/n) C^-1, so a small eigenvalue of C is a large variance of the weights.'),
    use('taylor-hessian', 'C is the Hessian of the squared loss on standardized data, so its condition number also sets how fast gradient descent converges.'),
  ],
  'bootstrap': [
    use('expectation-variance', 'The bootstrap estimates the standard deviation of a statistic, the square root of its variance, by simulation.'),
    use('probability-basics', 'Each resample makes n independent, uniform draws from the data, with replacement.'),
    use('exp-log', '(1 - 1/n)^n approaches e^-1, so about 36.8% of the examples are left out of each resample.'),
  ],
};

// Reverse lookup for a math page: every ML page that uses it, with the same explanation.
export function mlUsesOf(mathId) {
  return Object.entries(mathLinks).flatMap(([mlId, links]) => links.filter((link) => link.id === mathId).map((link) => ({ id: mlId, why: link.why })));
}
