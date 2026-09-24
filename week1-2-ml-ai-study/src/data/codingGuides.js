// "From formula to code": the practical steps a student needs to turn a page's formulas into a working
// program (shapes, preprocessing, numerical safety, step sizes, stopping, evaluation). Shown above the
// runnable Python. Added where a student test of the site found that the formulas alone were not enough.
// Each step has a short label, one or two sentences, and optionally a few lines of Python.

const step = (label, text, code) => ({ label, text, code });

export const codingGuides = {
  'logistic-loss': [
    step('Build the design matrix', 'Stack the examples as the rows of X and put a column of 1s first, so theta[0] plays the role of theta_0. Then all scores are X @ theta, and the sum (1/n) sum (h - y) x becomes X.T @ (h - y) / n. Shapes: X is n by (d + 1), h and y have n entries, the gradient has d + 1.',
      'Xb = np.c_[np.ones(len(X)), X]      # n x (d + 1)\nh = sigmoid(Xb @ theta)             # n probabilities\ngrad = Xb.T @ (h - y) / len(y)      # d + 1 numbers'),
    step('Split first, then standardize', 'Split into training and test sets, then standardize with the training mean and standard deviation only and apply the same numbers to the test set. With unscaled features a step size like 0.5 can blow up and the loss becomes nan.',
      'mu, sd = X_train.mean(axis=0), X_train.std(axis=0)\nX_train_s = (X_train - mu) / sd\nX_test_s = (X_test - mu) / sd     # training statistics, never the test set\'s own'),
    step('Choose the step size', 'With standardized features a step size alpha between 0.1 and 1 usually works. Print the loss every few hundred steps: if it rises or becomes nan, halve alpha; if it barely moves, double it.'),
    step('Compute the loss safely', 'np.exp(-s) overflows for very negative s, and log(0) is minus infinity when a prediction is exactly 0 or 1. Write the loss with np.logaddexp: it is log(1 + e^(-s)) when y = 1 and log(1 + e^s) when y = 0, and never overflows.',
      'def sigmoid(s):\n    return 1 / (1 + np.exp(-np.clip(s, -500, 500)))\n\ndef logistic_loss(theta, Xb, y):\n    s = Xb @ theta\n    return np.mean(np.where(y == 1, np.logaddexp(0, -s), np.logaddexp(0, s)))'),
    step('Decide when to stop', 'Stop when the loss changes by less than a small tolerance between steps (or the gradient is tiny), with a maximum number of steps as a safety net. A fixed number of steps may stop too early or waste time.',
      'old = logistic_loss(theta, Xb, y)\nfor k in range(20_000):\n    theta -= alpha * Xb.T @ (sigmoid(Xb @ theta) - y) / len(y)\n    new = logistic_loss(theta, Xb, y)\n    if abs(old - new) < 1e-9:\n        break\n    old = new'),
    step('Add a small L2 penalty', 'Minimize J(theta) + (lambda/2)||w||^2, where w is theta without theta_0 (the offset is not penalized). The gradient gains lambda w. This keeps theta finite on separable data. scikit-learn\'s LogisticRegression does this by default, with C = 1/(n lambda) and C = 1.0, so its weights are smaller than unpenalized gradient descent gives.',
      'grad = Xb.T @ (sigmoid(Xb @ theta) - y) / len(y)\ngrad[1:] += lam * theta[1:]          # no penalty on theta_0'),
    step('Evaluate on the test set', 'Predict 1 when h >= 0.5 and count the four outcomes on the test set, not the training set, whose scores are optimistic. The Confusion Matrix page shows the counting code.',
      'y_hat = (sigmoid(Xb_test @ theta) >= 0.5).astype(int)\nprint("test accuracy", np.mean(y_hat == y_test))'),
  ],
  'logistic-regression': [
    step('Make a toy dataset', 'Two overlapping clouds of points, one per class, are enough to practise on: draw each class from a normal distribution with its own centre.',
      'rng = np.random.default_rng(0)\nX = np.r_[rng.normal([0, 0], 1, (100, 2)), rng.normal([2, 2], 1, (100, 2))]\ny = np.r_[np.zeros(100), np.ones(100)]'),
    step('One-vs-rest with K classes', 'For each class k, relabel the data as 1 for class k and 0 for the rest, and train an ordinary logistic regression. To predict, compute all K probabilities and pick the largest (argmax).',
      'thetas = [train(Xb, (y == k).astype(float)) for k in range(K)]   # train = your gradient descent\nP = np.column_stack([sigmoid(Xb_test @ t) for t in thetas])      # n x K\ny_hat = P.argmax(axis=1)'),
    step('The K probabilities need not add up to 1', 'Each classifier was trained on its own yes/no question, so a row of P can sum to less or more than 1. Only the largest matters for the prediction. Softmax regression (beyond this course) models all classes together so the probabilities sum to 1.'),
    step('Evaluate with a K by K confusion matrix', 'Rows are the actual class, columns the predicted class, and the diagonal holds the correct predictions. Precision for class k is the diagonal entry over its column sum; recall is the diagonal entry over its row sum.',
      'C = np.zeros((K, K), dtype=int)\nfor a, p in zip(y_test.astype(int), y_hat):\n    C[a, p] += 1\nprecision = np.diag(C) / C.sum(axis=0)\nrecall = np.diag(C) / C.sum(axis=1)'),
  ],
  'classification-metrics': [
    step('Count from label arrays', 'With arrays y (actual) and y_hat (predicted) of 0s and 1s, each count is a sum of a boolean condition.',
      'TP = np.sum((y == 1) & (y_hat == 1)); FN = np.sum((y == 1) & (y_hat == 0))\nFP = np.sum((y == 0) & (y_hat == 1)); TN = np.sum((y == 0) & (y_hat == 0))'),
    step('Lay out the matrix the usual way', 'Rows are the actual class and columns the predicted class: [[TN, FP], [FN, TP]] for labels 0 and 1. This matches scikit-learn\'s confusion_matrix(y, y_hat). Some books transpose it, so always check the labels.'),
    step('Handle 0/0', 'If the model never predicts positive, TP + FP = 0 and precision is undefined. Report it as undefined or 0 (scikit-learn warns and uses 0 by default) rather than letting the program crash.',
      'precision = TP / (TP + FP) if TP + FP > 0 else float("nan")'),
    step('Use held-out data', 'Compute the metrics on the test set. The same metrics on the training set are optimistic, because the model was fitted to those examples.'),
  ],
  'roc-auc': [
    step('AUC by counting pairs', 'Compare every positive score with every negative score: count 1 when the positive is higher and 1/2 for a tie, then average. This is exactly the probability that a random positive outranks a random negative.',
      'pos, neg = scores[y == 1], scores[y == 0]\nauc = np.mean((pos[:, None] > neg[None, :]) + 0.5 * (pos[:, None] == neg[None, :]))'),
    step('The ROC curve and the trapezoid rule', 'Sweep the threshold from above the highest score (nothing predicted positive, the point (0, 0)) down past the lowest (everything positive, (1, 1)). The area under the resulting broken line is the sum of trapezoids between consecutive points, which gives the same AUC as counting pairs.',
      'ts = np.r_[np.inf, np.sort(scores)[::-1]]\nfpr = [np.mean(neg >= t) for t in ts]; tpr = [np.mean(pos >= t) for t in ts]\nauc = np.sum(np.diff(fpr) * (np.array(tpr[1:]) + np.array(tpr[:-1])) / 2)'),
    step('Use test-set scores', 'Compute the ROC curve and AUC from predicted probabilities on held-out data; roc_auc_score(y, scores) in scikit-learn gives the same number.'),
  ],
};
