// The structured part of "Plain-Language Intuition" on the machine learning pages. The short hook
// stays in each concept's `intuition`; here each page gets two to five labelled key ideas and,
// optionally, notes tied to the course notes and slides (shown collapsed). Lengths are checked by
// scripts/check-content.mjs so the section stays quick to read.

const idea = (label, text) => ({ label, text });

export const intuitionDetails = {
  "ml-landscape": {
    keyIdeas: [
      idea("AI, ML, DL", "AI is the broad goal of machines acting smart. ML is the part that learns from data. Deep learning is the part of ML built from layered neural networks."),
      idea("Kinds of learning", "Supervised: labelled examples, with classification for categories (binary or multi-class) and regression for numbers. Unsupervised: patterns without labels. Reinforcement: actions that earn reward. Semi-supervised: a few labels, many unlabelled examples."),
      idea("Why now?", "Large datasets, better models, and cheap computation all arrived together."),
      idea("Why MLOps?", "A model can get worse without any code changing, because the data changes. MLOps grew out of DevOps to make the ML lifecycle reproducible, trackable, testable, and maintainable."),
      idea("Three phases", "Data (understand the business and data), model (engineer data and model, deliver a stable model), and operations (deploy, test, version, deliver continuously, monitor)."),
    ],
    courseNotes: [
      "Shortcuts that are easy now but costly to rework later are technical debt. Lesson 1 suggests choosing tools by the 4 Cs: cost, coverage, complexity, and community.",
      "An MLOps engineer mixes software development, machine learning, and data engineering.",
      "Notation warning: the slides write m examples with n attributes (sometimes with y in {0, 1}); the lecture notes and this site write n examples with d features and y in {-1, +1}.",
    ],
  },
  "ml-workflow": {
    keyIdeas: [
      idea("The pieces", "Inputs and labels, features, a hypothesis class (the kind of rule allowed), a loss (how mistakes are scored), and an optimizer (how the rule improves)."),
      idea("The goal", "Generalization: doing well on new examples, not just the ones used for training."),
      idea("Mitchell's definition", "A program learns from experience E at task T, measured by performance P, if its performance at T improves with E."),
      idea("It does not stop at training", "In production the model is deployed, monitored, and retrained as the data changes."),
    ],
  },
  "feature-representation": {
    keyIdeas: [
      idea("Encoding choices", "Yes/no facts become 0 or 1, categories become one-hot lists with a single 1, and features on very different scales are often standardized."),
      idea("Scoring", "Give each feature a weight, multiply, and add up: the dot product theta . x. Big and positive means strong yes; negative means lean no."),
      idea("Good features do the heavy lifting", "They make the label easy to reach. The notes describe face images by simple detectors (edges, colour patches, textures) rather than raw pixels."),
      idea("Same recipe, representative data", "Encode new examples exactly like training ones, and train on data that resembles future data: a tumour classifier trained on one tumour type may fail on another."),
    ],
  },
  "linear-classifier": {
    keyIdeas: [
      idea("The score", "Each example gets theta . x + theta_0. Positive means one side, negative the other, and the boundary is where the score is exactly 0."),
      idea("What the parameters do", "theta points perpendicular to the line and sets its tilt; theta_0 slides it."),
      idea("Ties", "A score of exactly 0 needs a tie-break (the code uses +1), but during training a margin of 0 always counts as a mistake."),
    ],
  },
  "linear-classifier-through-origin": {
    keyIdeas: [
      idea("The boundary", "All points with theta . x = 0, which always includes the origin."),
      idea("Un-pinning it", "Adding theta_0 lets the line slide parallel to itself, which can separate data the pinned line cannot."),
    ],
  },
  "linear-separability": {
    keyIdeas: [
      idea("It depends on the features", "The same data can be separable with one choice of features and not with another."),
      idea("Margin = breathing room", "The distance from the best separator to the closest point. Wider is safer."),
      idea("Overlap means no line", "When the classes overlap, no line works, and the perceptron never settles."),
      idea("Through the origin is stricter", "A negative at x = 1 and a positive at x = 3 need an offset: without theta_0, theta x has the same sign at both points."),
    ],
  },
  "perceptron": {
    keyIdeas: [
      idea("The nudge", "On a mistake (or a point exactly on the line), add y x to theta and y to theta_0. That raises this example's score in the right direction."),
      idea("When it stops", "On separable data the nudges eventually stop, because every example ends up on the right side."),
      idea("The offset is just a feature", "Updating theta_0 by y is the same rule applied to an extra feature that is always 1."),
    ],
    courseNotes: [
      "The notes start from theta = 0; the Lesson 2 slides start from random weights. Different starts can end at different separators, since separable data usually has many.",
      "In the notes, theta^(k) means the parameters after k mistakes, not after k examples.",
    ],
  },
  "perceptron-convergence": {
    keyIdeas: [
      idea("Each fix helps", "A correction raises the mistaken example's score by its squared length (plus 1 when theta_0 is also updated)."),
      idea("The guarantee", "On linearly separable data the perceptron makes only finitely many mistakes."),
      idea("Wide gap, few mistakes", "If every example has length at most R and some separator has margin gamma, there are at most (R/gamma)^2 mistakes."),
      idea("Overlap breaks it", "When the classes overlap, fixing one example can break another, so the corrections can go on forever."),
    ],
    courseNotes: [
      "The Week 1 notes state only the finite-mistakes theorem. The (R/gamma)^2 form is Novikoff's bound, which goes beyond the notes (they define the margin later).",
    ],
  },
  "empirical-risk-zero-one": {
    keyIdeas: [
      idea("Easy to read", "A training error of 0.1 means 10% of the training examples are misclassified."),
      idea("Hard to learn from", "It cannot tell a near miss from a disaster, so it gives the algorithm no hint about which way to improve."),
    ],
  },
  "hinge-loss": {
    keyIdeas: [
      idea("Its shape", "The cost falls in a straight line as the margin grows, then stays at zero once the margin reaches 1."),
      idea("Why it helps", "Unlike the zero-one loss, its slope tells the algorithm which way to move."),
      idea("Why a margin of 1?", "Combined with a penalty on ||theta||, it makes the classifier prefer the widest gap between the classes: the support vector machine."),
    ],
  },
  "max-margin-svm": {
    keyIdeas: [
      idea("Distance to the line", "A point x is |theta . x + theta_0| / ||theta|| away from the boundary."),
      idea("Width = 2/||theta||", "Scale theta so the closest points score exactly +1 or -1. The two margin lines are then 2/||theta|| apart, so a wide margin means a small ||theta||."),
      idea("Soft margin", "Real data overlaps, so violations are allowed and paid for with the hinge loss: minimize (lambda/2)||theta||^2 plus the average hinge loss."),
      idea("lambda sets the trade-off", "A large lambda prefers a wide margin and tolerates more violations; a small lambda fits the training points more tightly."),
      idea("Support vectors", "Only the points on or inside the margin decide where the boundary goes."),
    ],
  },
  "convex-functions": {
    keyIdeas: [
      idea("Definition", "The straight chord between any two points on the graph never dips below the graph."),
      idea("Quick test", "In one variable, a smooth function is convex when its second derivative is never negative, so its slope only increases."),
      idea("Building blocks", "Sums and maximums of convex functions are convex, so losses built from them are too."),
      idea("Non-convex is harder", "An optimizer can get stuck in a local minimum, or slow down at a saddle point, which curves up in one direction and down in another."),
    ],
    courseNotes: [
      "As the Week 1 notes point out, every local minimum of a convex function has the same, lowest value, but that value can be reached at several parameter settings (a flat-bottomed bowl).",
    ],
  },
  "surrogate-losses": {
    keyIdeas: [
      idea("The stand-in", "A surrogate sits on or above the mistake count, so lowering it tends to lower the real error."),
      idea("Two common choices", "Hinge loss charges for wrong or barely-right answers; logistic loss charges smoothly and never quite reaches zero."),
      idea("Why not count mistakes directly?", "The zero-one loss is non-convex, and on non-separable data finding the classifier with the fewest mistakes is NP-hard (Lesson 2). Convex problems can be solved efficiently."),
    ],
  },
  "gradient-descent-method": {
    keyIdeas: [
      idea("Step against the gradient", "The gradient points uphill, so each step goes the other way: theta <- theta - alpha times the gradient."),
      idea("Learning rate = step size", "Too small is slow; too large overshoots, or even climbs out of the valley."),
      idea("Local or global?", "It only uses slopes (a first-order method), so it finds a local minimum, which is the global one when the loss is convex."),
      idea("The stochastic version", "Estimate the gradient from one random example: each step is much cheaper and often gets close faster, but the path is erratic."),
    ],
  },
  "momentum": {
    keyIdeas: [
      idea("A memory of past steps", "Each step adds a fraction alpha of the previous step."),
      idea("Cancel and add up", "Across the valley, consecutive steps point opposite ways and cancel; along it, they agree and add up."),
      idea("Too much momentum", "With alpha close to 1, the ball overshoots and swings back and forth for a long time."),
    ],
  },
  "subgradients": {
    keyIdeas: [
      idea("Away from corners", "The only subgradient is the ordinary slope."),
      idea("At a corner", "There is a whole range of valid slopes, and any one of them can be used for the descent step."),
      idea("Why we need it", "Hinge loss and absolute value have corners, and we still want to run gradient-style descent on them."),
    ],
  },
  "stochastic-subgradient-descent": {
    keyIdeas: [
      idea("Like the perceptron, but...", "It also learns from correct but unconfident examples (agreement at most 1, not at most 0), and it uses step sizes that shrink over time."),
      idea("Random order", "Picking examples at random, rather than cycling through them in order, stops the updates from oscillating."),
      idea("Keep the best", "The loss falls only noisily, so remember the best theta seen so far and report that one."),
      idea("With a penalty", "Adding the SVM regularizer makes every step also shrink theta slightly."),
    ],
    courseNotes: [
      "The Week 1 notes present the unregularized version with step sizes eta_k = 1/(k + 1) (a constant such as 0.1 in practice); the regularized SVM version is an extension.",
    ],
  },
  "lagrange-multipliers": {
    keyIdeas: [
      idea("Tangency", "At that point the gradients are parallel: grad f = -lambda grad h."),
      idea("The multiplier", "lambda tells how fast the best value would change if the constraint were loosened."),
      idea("The Lagrangian", "L = f + lambda h. Setting all its partial derivatives to zero gives the tangency condition and the constraint together."),
      idea("Inequalities", "For g(x) <= 0 the multiplier must be nonnegative, and it is zero when the constraint is not active at the answer."),
      idea("Link to ridge and lasso", "Minimizing the loss inside a ball ||theta|| <= t gives the same answer as adding a penalty lambda ||theta|| (squared for ridge) for a matching lambda >= 0."),
    ],
  },
  "linear-regression": {
    keyIdeas: [
      idea("Not as limited as it sounds", "Feed in transformed features, such as squares, and the same method fits curves."),
      idea("Why square the errors?", "Squaring stops positive and negative errors from cancelling, and punishes big misses much more than small ones."),
      idea("Two ways to learn", "Solve directly with the normal equation, or take gradient steps: theta <- theta + eta (y - theta . x) x."),
      idea("Self-correcting", "If a prediction is too low, theta moves toward x, so the next prediction is higher. Even small errors cause small updates, unlike the perceptron."),
      idea("Regression or classification?", "It depends on the output: a stock's future price is regression; buy, sell, or hold is classification."),
    ],
    courseNotes: [
      "Lesson 3 frames every ML problem by its elements: task, inputs and outputs, model with trainable parameters, and loss. For the apartment data: supervised regression, area in, price out, y ≈ a x + b, mean squared error.",
      "The slides write the loss without the 1/2 used in the notes, so their gradients carry a factor 2. The best line is the same.",
      "With several features the model is y ≈ a_1 x_1 + ... + a_K x_K + b.",
      "Early stopping: quit gradient descent when a and b change by less than a small threshold delta, or after a maximum number of iterations.",
      "With one feature, y = a x + b is a line: a hyperplane of the (x, y) plane, one dimension less than the space (strictly an affine one, since it need not pass through the origin).",
    ],
  },
  "polynomial-regression": {
    keyIdeas: [
      idea("Still linear regression", "The prediction is linear in the weights, so every linear regression tool still works."),
      idea("Degree = flexibility dial", "Too low and the curve is too stiff to follow the pattern (underfitting); too high and it wiggles through every noisy point (overfitting)."),
      idea("Beware outside the data", "A high degree can match the training points yet behave wildly beyond their range, for example for an apartment larger than any seen in training."),
    ],
    courseNotes: [
      "Lesson 3 does this with scikit-learn's PolynomialFeatures: build the columns x, x^2, ..., x^K, then run ordinary multi-feature linear regression on them.",
    ],
  },
  "least-squares-normal-equation": {
    keyIdeas: [
      idea("The geometric picture", "The model can only produce prediction vectors in the column space of X. Least squares picks the one closest to y: its orthogonal projection."),
      idea("A perpendicular leftover", "The residual y - y_hat is perpendicular to every feature column, which is exactly the normal equation X^T (y - X theta) = 0."),
    ],
  },
  "feature-scaling": {
    keyIdeas: [
      idea("Why it matters", "Unscaled features create a long, narrow valley that gradient descent zig-zags through, and make ridge or lasso penalties unfair to some features."),
      idea("Standardize or min-max", "Standardizing gives each feature mean 0 and spread 1; min-max scaling squeezes each into [0, 1]."),
      idea("Other encodings", "Categories become one-hot vectors, and a feature cross (the product of two features) lets a linear model use an interaction."),
      idea("The golden rule", "Compute means and spreads on the training set only, then apply them unchanged to validation and test data. Anything else is data leakage and flatters the evaluation."),
    ],
  },
  "ridge-regularization": {
    keyIdeas: [
      idea("It fixes the normal equation", "When X^T X is not invertible, the data say nothing about some parameter directions; the penalty sets them to zero on purpose."),
      idea("lambda has a sweet spot", "As lambda grows, training error always rises, while test error usually falls and then rises again: a U shape. Choose lambda on validation data."),
      idea("In practice", "Leave the intercept unpenalized and standardize the features first (both go beyond the notes)."),
    ],
    courseNotes: [
      "The Week 2 notes call the non-invertible case ill-posed. Starting stochastic gradient descent at theta = 0 keeps those directions at zero, but does not fix the broader problem.",
    ],
  },
  "lasso": {
    keyIdeas: [
      idea("Versus ridge", "Ridge's pull weakens as a weight gets small, so its weights shrink but rarely reach zero."),
      idea("Picture it", "The L1 penalty's diamond has corners on the axes, and the best fit often lands on a corner, where some weights are exactly zero."),
    ],
  },
  "elastic-net": {
    keyIdeas: [
      idea("Correlated features", "Lasso tends to keep one of two correlated features almost at random; the L2 part makes elastic net share the weight between them (the grouping effect)."),
      idea("With one feature", "Soft-threshold like lasso, then shrink like ridge."),
    ],
  },
  "model-complexity-generalization": {
    keyIdeas: [
      idea("Judge on unseen data", "Doing well on new data is the goal, so compare training and test error and watch the gap."),
      idea("The memorizer", "With 50 face images, some single pixel probably differs in every image. Looking it up gets every training label right and is useless on new faces."),
      idea("Model selection", "The hypothesis class must not be so large that it contains memorizers, nor so small that nothing fits."),
      idea("Causes of overfitting", "Too many features, imbalanced data, or a model far more complex than the pattern (such as a high polynomial degree): it memorizes the noise."),
      idea("Causes of underfitting", "Too few features, or a model not powerful enough for the task, such as a straight line for a cubic trend."),
    ],
    courseNotes: [
      "The memorizer example is from the Week 1 notes. They add that any one fixed classifier does about as well on new data as on training data; the danger comes from choosing among very many.",
      "At the other extreme, a class with a single classifier learns nothing, but its training error honestly predicts its test error.",
      "The Lesson 3 slides also list too little data as a cause of underfitting. In practice little data forces a simple model, while a flexible model trained on little data tends to overfit.",
    ],
  },
  "bias-variance": {
    keyIdeas: [
      idea("Bias", "A straight line fitted to a curve is wrong in the same way every time."),
      idea("Variance", "A wiggly degree-9 polynomial changes a lot when a few training points move."),
      idea("The decomposition", "For squared error, expected test error = bias^2 + variance + noise, where noise is randomness in the labels that no model can remove."),
      idea("The trade-off", "More complexity lowers bias but raises variance. More data lowers variance without adding bias; regularization lowers variance at the cost of some bias."),
    ],
    courseNotes: [
      "The Week 2 notes call bias the structural error (the model family cannot express the truth, however much data you have) and variance the estimation error (a small, noisy training set pins down the parameters only roughly).",
    ],
  },
  "train-validation-test": {
    keyIdeas: [
      idea("Why three sets", "Validation chooses settings such as the polynomial degree or lambda; the test set gives an honest final score."),
      idea("Do not peek", "Tuning while peeking at the test score slowly fits to it, and it stops predicting performance on truly new data."),
      idea("Same source", "All three sets should come from the same kind of data the model will see in use."),
    ],
  },
  "cross-validation": {
    keyIdeas: [
      idea("The loop", "Train k times, each time holding out a different fold for validation, and average the k validation scores."),
      idea("Less waste", "Every example is used for validation exactly once."),
      idea("Then finish", "Pick the setting with the best average, refit on all the non-test data, and test once."),
    ],
  },
  "logistic-regression": {
    keyIdeas: [
      idea("Read it as a probability", "h(x) = p(y = 1 | x). An output of 0.7 for a tumour means an estimated 70% chance that it is malignant."),
      idea("Still a straight boundary", "h(x) >= 0.5 exactly when theta . x + theta_0 >= 0, so the boundary is a line (a hyperplane). Squared features let it curve."),
      idea("Why not linear regression?", "One far-away but clearly positive example tilts a regression line, shifts its 0.5 crossing, and breaks predictions that were right before."),
      idea("Discriminative", "It learns only how to tell the classes apart; a generative model learns what each class looks like."),
      idea("More than two classes", "One-vs-rest trains one classifier per class (cat vs not cat, dog vs not dog, fish vs not fish) and picks the most probable class."),
    ],
  },
  "logistic-loss": {
    keyIdeas: [
      idea("Case by case", "The cost is -log h when y = 1 and -log(1 - h) when y = 0: zero for a perfect answer, unbounded for a confident wrong one."),
      idea("Why not squared error?", "With the sigmoid inside, squared error is not convex, so gradient descent can stall. Cross-entropy is convex, though it has no closed-form solution."),
      idea("Where it comes from", "Minimizing it picks the most likely parameters (maximum likelihood). The minus sign turns maximizing the log-likelihood into minimizing a non-negative loss."),
      idea("A familiar update", "theta <- theta - alpha times the average of (h - y) x: the same form as linear regression, with a different h."),
    ],
    courseNotes: [
      "Lesson 4 also asks whether MSE or R^2 suit logistic regression. They measure how far the probabilities are from the 0/1 labels, not how many classes come out right, so classifiers are usually judged with confusion-matrix metrics.",
    ],
  },
  "classification-metrics": {
    keyIdeas: [
      idea("Precision", "When the model says yes, how often is it right?"),
      idea("Recall (sensitivity)", "Of all the real yeses, how many did it catch?"),
      idea("Specificity", "Of all the real nos, how many did it correctly reject? It measures how well the model avoids false alarms."),
      idea("The threshold trade-off", "Raising the threshold usually means fewer false alarms but more misses; the right balance depends on which mistake costs more."),
      idea("Many classes", "The matrix gets one row and one column per class, with correct predictions on the diagonal. Each class gets its own precision and recall (it versus the rest)."),
    ],
    courseNotes: [
      "Lesson 4 writes the four cases with y and y_hat in {0, 1}: (1, 1) is a true positive, (1, 0) a false negative, (0, 1) a false positive, and (0, 0) a true negative.",
    ],
  },
  "roc-auc": {
    keyIdeas: [
      idea("The axes", "True positive rate (recall) against false positive rate (1 - specificity)."),
      idea("Reading it", "A perfect ranker hugs the top-left corner; random guessing follows the diagonal."),
      idea("AUC", "The probability that a randomly chosen positive gets a higher score than a randomly chosen negative."),
      idea("Rare positives", "A point that looks good on the ROC curve can still have poor precision, so precision-recall curves are often reported too."),
    ],
  },
  "ml-in-production": {
    keyIdeas: [
      idea("The system", "Collect and validate data, compute features, serve predictions within a time budget, and log the results."),
      idea("Drift", "Inputs can move away from the training data (covariate shift), or the link between inputs and labels can change (concept drift). Accuracy then decays quietly unless monitored."),
      idea("Technical debt", "Entangled features, glue code, tangled pipelines, and predictions that feed back into their own future training data (Sculley et al.)."),
      idea("Good practice", "Start from the business objective, keep a simple baseline, version data and models, monitor inputs and outputs, and retrain on a schedule or when drift appears."),
    ],
  },
};
