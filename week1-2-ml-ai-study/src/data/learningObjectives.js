export const learningObjectives = [
  {
    area: 'Introduction to ML Modelling',
    items: [
      { objective: 'Explain what machine learning is and what kinds of prediction problems it solves.', concepts: ['ml-workflow'], check: 'Can you explain why memorizing the training set is not the same as learning?' },
      { objective: 'Identify the essential components of an ML model: data, features, hypothesis class, loss, optimization, and generalization.', concepts: ['ml-workflow', 'feature-representation', 'model-complexity-generalization'], check: 'Given a new task, can you name the input, output, model family, loss, and optimizer?' },
      { objective: 'Distinguish classification from regression.', concepts: ['linear-classifier', 'linear-regression', 'logistic-regression'], check: 'Is the target a label or a real number, and how does that change the loss?' },
    ],
  },
  {
    area: 'Linear Classification: Perceptron and Hinge Loss',
    items: [
      { objective: 'Define classification, linear classifiers, and linear classifiers through the origin.', concepts: ['linear-classifier', 'linear-classifier-through-origin'], check: 'What changes when the bias term theta_0 is removed?' },
      { objective: 'Explain linearly separable examples and why perceptron needs separability.', concepts: ['linear-separability', 'perceptron-convergence'], check: 'Can you state what must be true for every signed margin?' },
      { objective: 'Describe how the perceptron algorithm works and state its convergence guarantee.', concepts: ['perceptron', 'perceptron-convergence'], check: 'What triggers an update, and what does separability guarantee?' },
      { objective: 'Compare hinge loss with 0-1 loss.', concepts: ['empirical-risk-zero-one', 'hinge-loss', 'surrogate-losses'], check: 'Why can a correct prediction still have positive hinge loss?' },
    ],
  },
  {
    area: 'Gradient Descent, Linear Regression, and Ridge Regression',
    items: [
      { objective: 'Check convexity and explain why convex objectives are easier to optimize.', concepts: ['convex-functions', 'gradient-descent-method'], check: 'Which convexity test would you use for a twice-differentiable one-variable function?' },
      { objective: 'Implement stochastic (sub-)gradient descent conceptually.', concepts: ['stochastic-subgradient-descent', 'subgradients', 'gradient-descent-method'], check: 'How does the hinge-loss SSGD update differ from perceptron?' },
      { objective: 'Explain linear regression and least-squares learning.', concepts: ['linear-regression', 'least-squares-normal-equation'], check: 'How does the normal equation arise from squared residuals?' },
      { objective: 'Explain ridge regression, regularization, and why regularization improves generalization.', concepts: ['ridge-regularization', 'lasso', 'elastic-net', 'model-complexity-generalization'], check: 'Why can increasing training loss improve test performance?' },
    ],
  },
  {
    area: 'Logistic Regression',
    items: [
      { objective: 'Explain what logistic regression is and which problem class it solves.', concepts: ['logistic-regression'], check: 'Why is logistic regression a classifier despite its name?' },
      { objective: 'Explain why log-likelihood/log-loss is optimized instead of raw likelihood.', concepts: ['logistic-loss'], check: 'Why does taking logs preserve the maximizer but make optimization easier?' },
      { objective: 'Perform prediction and describe learning under logistic regression.', concepts: ['logistic-regression', 'logistic-loss', 'classification-metrics'], check: 'How do you turn a sigmoid probability into a class prediction?' },
    ],
  },
  {
    area: 'Mathematics Learning Outcomes',
    items: [
      { objective: 'Use sets, set operations, functions, inverses, and composition.', concepts: ['sets', 'functions', 'inverse-composition'], check: 'What extra properties does a function need before an inverse exists?' },
      { objective: 'Perform matrix operations and represent linear systems in matrix form.', concepts: ['matrix-operations', 'matrix-multiplication-outer-product', 'matrix-systems'], check: 'Why must shapes match for addition but inner dimensions match for multiplication?' },
      { objective: 'Use Gaussian elimination, REF, and RREF to solve systems and test independence.', concepts: ['gaussian-elimination', 'solution-structure', 'linear-independence'], check: 'What do pivot and free columns tell you?' },
      { objective: 'Understand vector spaces, linear combinations, bases, dimension, and subspaces.', concepts: ['vector-spaces', 'span-linear-combinations', 'linear-independence', 'subspaces', 'basis-coordinates', 'dimension'], check: 'Why does a basis make coordinates unique?' },
      { objective: 'Understand linear transformations, transformation matrices, composition, invertibility, and change of basis.', concepts: ['linear-transformations', 'transformation-matrix', 'composition-of-transformations', 'invertible-transformations', 'change-of-basis'], check: 'Why do matrix products represent composed transformations?' },
      { objective: 'Find inverses, rank, nullity, and determinants, including cofactor and row-operation methods.', concepts: ['rank-nullity', 'determinant-geometry', 'determinants-cofactor-row-ops', 'invertible-transformations'], check: 'Which row operations change a determinant, and how?' },
    ],
  },
];

export const selfChecksByConcept = learningObjectives
  .flatMap((section) => section.items)
  .reduce((checks, item) => {
    item.concepts.forEach((id) => {
      checks[id] = [...(checks[id] ?? []), item.check];
    });
    return checks;
  }, {});
