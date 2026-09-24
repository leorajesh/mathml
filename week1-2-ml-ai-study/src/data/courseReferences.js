// The machine learning course's reading list, and where each ML page is covered in it.
// Bishop is free to read from Microsoft Research, so its entries carry printed page numbers and link to
// the right PDF page (printed page + 20). Section numbers for the other books follow the editions
// named below; they are cited by chapter and section only. As with the MML book, nothing is copied:
// all text, examples, and figures on this site are our own.

export const courseBooks = {
  bishop: {
    short: 'Bishop',
    citation: 'C. M. Bishop, Pattern Recognition and Machine Learning. Springer, 2006.',
    url: 'https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/',
    pdf: 'https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf',
    pdfOffset: 20,
    area: 'ml',
  },
  isl: {
    short: 'ISL',
    citation: 'G. James, D. Witten, T. Hastie, R. Tibshirani, An Introduction to Statistical Learning. Springer (1st ed. 2013; 2nd ed. 2021; section numbers from the 1st edition).',
    url: 'https://www.statlearning.com/',
    area: 'ml',
  },
  dhs: {
    short: 'Duda, Hart & Stork',
    citation: 'R. Duda, P. Hart, D. Stork, Pattern Classification, 2nd ed. John Wiley & Sons, 2001.',
    area: 'ml',
  },
  mitchell: {
    short: 'Mitchell',
    citation: 'T. Mitchell, Machine Learning. McGraw-Hill, 1997.',
    area: 'ml',
  },
  huyen: {
    short: 'Huyen',
    citation: 'C. Huyen, Designing Machine Learning Systems. O\'Reilly, 2022.',
    url: 'https://github.com/chiphuyen/dmls-book/blob/main/resources.md',
    area: 'mlops',
  },
  mlops: {
    short: 'Introducing MLOps',
    citation: 'M. Treveil et al. (including K. Lefevre), Introducing MLOps. O\'Reilly, 2020.',
    area: 'mlops',
  },
  dsaws: {
    short: 'Data Science on AWS',
    citation: 'C. Fregly, A. Barth, Data Science on AWS: Implementing End-to-End, Continuous AI and Machine Learning Pipelines. O\'Reilly, 2021.',
    area: 'mlops',
  },
  sculley: {
    short: 'Sculley et al.',
    citation: 'D. Sculley et al., Machine Learning: The High-Interest Credit Card of Technical Debt. SE4ML Workshop, NIPS 2014 (now NeurIPS). See also Sculley et al., Hidden Technical Debt in Machine Learning Systems, NIPS 2015.',
    area: 'mlops',
  },
};

const ref = (book, section, title, page) => ({ book, section, title, page });

export const courseReferences = {
  'ml-landscape': [
    ref('mitchell', '1.1', 'Well-Posed Learning Problems'),
    ref('bishop', '1', 'Introduction (supervised, unsupervised, and reinforcement learning)', 1),
    ref('huyen', 'Ch. 1', 'Overview of Machine Learning Systems (ML in research versus production)'),
    ref('mlops', '', 'Why MLOps, and the people and phases of the ML life cycle'),
    ref('sculley', '', 'Technical debt in ML systems'),
  ],
  'ml-workflow': [
    ref('mitchell', '1.1', 'Well-Posed Learning Problems (task T, performance P, experience E)'),
    ref('mitchell', '1.2', 'Designing a Learning System'),
    ref('bishop', '1.1', 'Example: Polynomial Curve Fitting', 4),
    ref('isl', '2.1', 'What Is Statistical Learning?'),
    ref('huyen', 'Ch. 1', 'Overview of Machine Learning Systems'),
  ],
  'feature-representation': [
    ref('bishop', '3.1', 'Linear Basis Function Models', 138),
    ref('dhs', 'Ch. 1', 'Introduction (feature extraction and the design cycle)'),
    ref('huyen', 'Ch. 5', 'Feature Engineering'),
  ],
  'linear-classifier': [
    ref('bishop', '4.1.1', 'Discriminant Functions: Two classes', 181),
    ref('dhs', '5.2', 'Linear Discriminant Functions and Decision Surfaces'),
    ref('isl', '9.1.1', 'What Is a Hyperplane?'),
  ],
  'linear-classifier-through-origin': [
    ref('bishop', '4.1.1', 'Two classes (absorbing the bias with a dummy input x0 = 1)', 182),
    ref('dhs', '5.3', 'Generalized Linear Discriminant Functions (augmented vectors)'),
  ],
  'linear-separability': [
    ref('dhs', '5.4', 'The Two-Category Linearly Separable Case'),
    ref('isl', '9.1.2', 'Classification Using a Separating Hyperplane'),
    ref('bishop', '4.1.7', 'The perceptron algorithm (linearly separable data)', 192),
  ],
  perceptron: [
    ref('bishop', '4.1.7', 'The perceptron algorithm', 192),
    ref('dhs', '5.5', 'Minimizing the Perceptron Criterion Function'),
    ref('mitchell', '4.4.2', 'The Perceptron Training Rule'),
  ],
  'perceptron-convergence': [
    ref('bishop', '4.1.7', 'The perceptron algorithm (convergence theorem, Figure 4.7)', 194),
    ref('dhs', '5.5.2', 'Convergence Proof for Single-Sample Correction'),
    ref('mitchell', '4.4.2', 'The Perceptron Training Rule (convergence stated, without proof)'),
  ],
  'empirical-risk-zero-one': [
    ref('bishop', '1.5.1', 'Minimizing the misclassification rate', 39),
    ref('isl', '2.2.3', 'The Classification Setting (training and test error rates)'),
    ref('mitchell', '5.2', 'Estimating Hypothesis Accuracy (sample error and true error)'),
  ],
  'hinge-loss': [
    ref('bishop', '7.1.2', 'Relation to logistic regression (the hinge error, Figure 7.5)', 337),
    ref('isl', '9.5', 'Relationship to Logistic Regression (hinge loss)'),
  ],
  'max-margin-svm': [
    ref('bishop', '7.1', 'Maximum Margin Classifiers (Figure 7.1)', 326),
    ref('bishop', '7.1.1', 'Overlapping class distributions (slack variables)', 331),
    ref('isl', '9.1.3', 'The Maximal Margin Classifier'),
    ref('isl', '9.2', 'Support Vector Classifiers'),
    ref('dhs', '5.11', 'Support Vector Machines'),
  ],
  'convex-functions': [
    ref('bishop', '1.6.1', 'Relative entropy and mutual information (convex functions, Jensen\'s inequality)', 55),
  ],
  'surrogate-losses': [
    ref('bishop', '7.1.2', 'Relation to logistic regression (hinge, logistic, and misclassification errors compared, Figure 7.5)', 337),
    ref('isl', '9.5', 'Relationship to Logistic Regression'),
  ],
  'gradient-descent-method': [
    ref('bishop', '5.2.4', 'Gradient descent optimization', 240),
    ref('mitchell', '4.4.3', 'Gradient Descent and the Delta Rule'),
    ref('dhs', '5.4.2', 'Gradient Descent Procedures'),
  ],
  'stochastic-subgradient-descent': [
    ref('bishop', '3.1.3', 'Sequential learning (stochastic gradient descent)', 143),
    ref('bishop', '5.2.4', 'Gradient descent optimization (on-line gradient descent)', 240),
    ref('mitchell', '4.4.3', 'Gradient Descent and the Delta Rule (stochastic approximation)'),
  ],
  'lagrange-multipliers': [
    ref('bishop', 'App. E', 'Lagrange Multipliers', 707),
    ref('bishop', '7.1', 'Maximum Margin Classifiers (the SVM as a constrained problem)', 326),
  ],
  'linear-regression': [
    ref('isl', '3.1', 'Simple Linear Regression'),
    ref('isl', '3.2', 'Multiple Linear Regression'),
    ref('bishop', '3.1', 'Linear Basis Function Models', 138),
  ],
  'polynomial-regression': [
    ref('bishop', '1.1', 'Example: Polynomial Curve Fitting (Figures 1.4-1.6)', 4),
    ref('isl', '7.1', 'Polynomial Regression'),
  ],
  'least-squares-normal-equation': [
    ref('bishop', '3.1.1', 'Maximum likelihood and least squares', 140),
    ref('bishop', '3.1.2', 'Geometry of least squares (Figure 3.2)', 143),
    ref('isl', '3.1.1', 'Estimating the Coefficients'),
    ref('dhs', '5.8', 'Minimum Squared-Error Procedures'),
    ref('mitchell', '6.4', 'Maximum Likelihood and Least-Squared Error Hypotheses'),
  ],
  'feature-scaling': [
    ref('huyen', 'Ch. 5', 'Feature Engineering (scaling, encoding, feature crossing, data leakage)'),
    ref('isl', '6.2.1', 'Ridge Regression (standardizing the predictors)'),
  ],
  'ridge-regularization': [
    ref('bishop', '3.1.4', 'Regularized least squares', 144),
    ref('bishop', '1.1', 'Example: Polynomial Curve Fitting (regularization, Figure 1.7)', 10),
    ref('isl', '6.2.1', 'Ridge Regression'),
  ],
  lasso: [
    ref('bishop', '3.1.4', 'Regularized least squares (the lasso, Figures 3.3-3.4)', 145),
    ref('isl', '6.2.2', 'The Lasso'),
  ],
  'elastic-net': [
    ref('bishop', '3.1.4', 'Regularized least squares (the general q-norm penalty, Figure 3.3)', 144),
  ],
  'model-complexity-generalization': [
    ref('bishop', '1.1', 'Example: Polynomial Curve Fitting (over-fitting, Figure 1.5)', 4),
    ref('isl', '2.2.1', 'Measuring the Quality of Fit (training versus test error)'),
    ref('mitchell', '3.7.1', 'Avoiding Overfitting the Data'),
  ],
  'bias-variance': [
    ref('bishop', '3.2', 'The Bias-Variance Decomposition (Figures 3.5-3.6)', 147),
    ref('isl', '2.2.2', 'The Bias-Variance Trade-Off'),
    ref('dhs', '9.3', 'Bias and Variance'),
  ],
  'train-validation-test': [
    ref('bishop', '1.3', 'Model Selection', 32),
    ref('isl', '5.1.1', 'The Validation Set Approach'),
    ref('huyen', 'Ch. 5', 'Feature Engineering (data leakage from how data is split)'),
    ref('huyen', 'Ch. 6', 'Model Development and Offline Evaluation'),
  ],
  'cross-validation': [
    ref('bishop', '1.3', 'Model Selection (S-fold cross-validation, Figure 1.18)', 32),
    ref('isl', '5.1.2', 'Leave-One-Out Cross-Validation'),
    ref('isl', '5.1.3', 'k-Fold Cross-Validation'),
    ref('dhs', '9.6.2', 'Cross-Validation'),
  ],
  'logistic-regression': [
    ref('bishop', '4.3.2', 'Logistic regression', 205),
    ref('isl', '4.3', 'Logistic Regression'),
  ],
  'logistic-loss': [
    ref('bishop', '4.3.2', 'Logistic regression (cross-entropy error and its gradient)', 205),
    ref('bishop', '4.3.3', 'Iterative reweighted least squares (the Hessian is positive definite, so the error is convex; the text\'s word "concave" on p. 208 is a known erratum)', 207),
    ref('isl', '4.3.2', 'Estimating the Regression Coefficients (maximum likelihood)'),
  ],
  'classification-metrics': [
    ref('isl', '4.4.3', 'Linear Discriminant Analysis for p > 1 (confusion matrix, sensitivity, specificity)'),
    ref('bishop', '1.5.2', 'Minimizing the expected loss (unequal costs of errors)', 41),
    ref('huyen', 'Ch. 4', 'Training Data (class imbalance and choosing the right metrics)'),
  ],
  'roc-auc': [
    ref('isl', '4.4.3', 'Linear Discriminant Analysis for p > 1 (the ROC curve and AUC)'),
    ref('huyen', 'Ch. 4', 'Training Data (class imbalance: ROC and precision-recall curves)'),
  ],
  'ml-in-production': [
    ref('huyen', 'Ch. 1', 'Overview of Machine Learning Systems'),
    ref('huyen', 'Ch. 2', 'Introduction to Machine Learning Systems Design'),
    ref('huyen', 'Ch. 8', 'Data Distribution Shifts and Monitoring'),
    ref('sculley', '', 'The whole paper: entanglement, hidden feedback loops, glue code, pipeline jungles'),
    ref('mlops', '', 'The model life cycle: development, deployment, monitoring, and governance'),
    ref('dsaws', '', 'End-to-end pipelines: ingesting data, training, deploying, and monitoring models'),
  ],
};

// Real-world case studies from the Designing Machine Learning Systems resource list.
export const caseStudies = {
  'ml-workflow': [{ title: 'Using Machine Learning to Predict Value of Homes on Airbnb (Airbnb Engineering, 2017)', url: 'https://medium.com/airbnb-engineering/using-machine-learning-to-predict-value-of-homes-on-airbnb-9272d3d4739d' }],
  'logistic-regression': [{ title: 'From shallow to deep learning in fraud (Lyft Engineering, 2018): logistic regression with engineered features as the first fraud model', url: 'https://eng.lyft.com/from-shallow-to-deep-learning-in-fraud-9dafcbcef743' }],
  'ml-in-production': [
    { title: 'Designing Machine Learning Systems: case-study collection', url: 'https://github.com/chiphuyen/dmls-book/blob/main/resources.md' },
    { title: '150 Successful Machine Learning Models: 6 Lessons Learned at Booking.com (Bernardi et al., KDD 2019)', url: 'https://blog.acolyer.org/2019/10/07/150-successful-machine-learning-models/' },
  ],
};

export function courseLink(item) {
  const book = courseBooks[item.book];
  return book.pdf && item.page ? `${book.pdf}#page=${item.page + book.pdfOffset}` : book.url ?? null;
}

export function courseReferencesFor(ids) {
  const seen = new Set();
  return ids.flatMap((id) => courseReferences[id] ?? []).filter((item) => {
    const key = `${item.book}|${item.section}|${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
