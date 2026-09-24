// The structured part of "Plain-Language Intuition" on every page. The short hook
// stays in each concept's `intuition`; here each page gets two to five labelled key ideas and,
// optionally, notes on the course notes, slides, or book notation (shown collapsed). Lengths are checked by
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
      "The breast-cancer regression target, time until recurrence, is only a lower bound (a censored value) for patients who had not recurred when follow-up ended; the slides treat it as plain regression for simplicity.",
      "Notation warning: the slides write m examples with n attributes (sometimes with y in {0, 1}); the lecture notes and this site write n examples with d features and y in {-1, +1}.",
    ],
  },
  "ml-workflow": {
    keyIdeas: [
      idea("The pieces", "Inputs and labels, features, a hypothesis class (the kind of rule allowed), a loss (how mistakes are scored), and an optimizer (how the rule improves)."),
      idea("The goal", "Generalization: doing well on new examples, not just the ones used for training."),
      idea("Mitchell's definition", "A program learns from experience E at task T, measured by performance P, if its performance at T improves with E."),
      idea("Why restrict the rules?", "If any rule is allowed, some rule memorizes the training labels (the notes' single-pixel classifier) and fails on new data. If too few are allowed, nothing fits. Choosing the class is model selection."),
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
      idea("Ties", "The notes define sign(0) = +1 (as does the code), but during training a margin of 0 always counts as a mistake."),
    ],
  },
  "linear-classifier-through-origin": {
    keyIdeas: [
      idea("The boundary", "All points with theta . x = 0, which always includes the origin."),
      idea("Un-pinning it", "Adding theta_0 lets the line slide parallel to itself, which can separate data the pinned line cannot."),
      idea("Nothing lost in theory", "Append a constant feature 1: x = [x, 1] and theta = [theta, theta_0]. A through-origin classifier in d + 1 dimensions is then a general one in d dimensions."),
    ],
  },
  "linear-separability": {
    keyIdeas: [
      idea("It depends on the features", "The same data can be separable with one choice of features and not with another."),
      idea("Margin = breathing room", "A separator's margin is the distance from its boundary to the closest point. The data's margin is the largest such value over all separators. Wider is safer."),
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
      idea("Proof in two lines", "After k mistakes, theta . theta*/||theta*|| >= k gamma while ||theta||^2 <= k R^2. Cauchy-Schwarz gives k gamma <= sqrt(k) R, so k <= (R/gamma)^2."),
    ],
    courseNotes: [
      "The Week 1 notes state only the finite-mistakes theorem. The (R/gamma)^2 form is Novikoff's bound, which goes beyond the notes (they define the margin later).",
    ],
  },
  "empirical-risk-zero-one": {
    keyIdeas: [
      idea("Easy to read", "A training error of 0.1 means 10% of the training examples are misclassified."),
      idea("Hard to learn from", "It cannot tell a near miss from a disaster, so it gives no hint about which way to improve. Minimizing it exactly on non-separable data is NP-hard (Lesson 2)."),
    ],
  },
  "hinge-loss": {
    keyIdeas: [
      idea("Its shape", "The cost falls in a straight line as the margin grows, then stays at zero once the margin reaches 1."),
      idea("Why it helps", "It is a convex upper bound on the zero-one loss, so the training risk is convex and simple descent methods find its minimum, even on non-separable data. It also grows with the size of a mistake."),
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
      idea("Local or global?", "It only uses slopes (a first-order method), so it heads to a point where the gradient is zero, usually a local minimum, which is the global one when the loss is convex."),
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
      idea("Random order", "Picking examples at random, rather than cycling in order, stops the updates from oscillating. More precisely, each step is then an unbiased estimate of the full (sub)gradient."),
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
      idea("Link to ridge and lasso", "Minimizing the loss subject to ||theta||_2^2 <= t (ridge) or ||theta||_1 <= t (lasso) gives the same answer as adding lambda ||theta||_2^2 or lambda ||theta||_1, for a matching lambda >= 0."),
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
      "The slides' early stopping: quit gradient descent when a and b change by less than a small threshold delta, or after a maximum number of iterations. Elsewhere in ML, early stopping usually means stopping when the validation error starts rising, which also regularizes; here it is a convergence test.",
      "With one feature, y = a x + b is a line: a hyperplane of the (x, y) plane, one dimension less than the space (strictly an affine one, since it need not pass through the origin).",
    ],
  },
  "polynomial-regression": {
    keyIdeas: [
      idea("Still linear regression", "The prediction is linear in the weights, so every linear regression tool still works."),
      idea("Degree = flexibility dial", "Too low and the curve is too stiff to follow the pattern (underfitting); too high and it wiggles through every noisy point (overfitting)."),
      idea("Beware outside the data", "A high degree can match the training points yet behave wildly beyond their range, for example for an apartment larger than any seen in training."),
      idea("Scale first", "Powers like x^10 of raw values differ by many orders of magnitude and make X^T X badly conditioned, so standardize x before expanding."),
      idea("Features grow fast", "With d inputs, all terms up to degree K give C(d + K, K) features, which is why PolynomialFeatures output grows quickly."),
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
      idea("Same source", "All three sets should come from the same kind of data the model will see in use. If the model will predict the future, split by time rather than at random."),
    ],
  },
  "cross-validation": {
    keyIdeas: [
      idea("The loop", "Train k times, each time holding out a different fold for validation, and average the k validation scores."),
      idea("Less waste", "Every example is used for validation exactly once."),
      idea("Then finish", "Pick the setting with the best average, refit on all the non-test data, and test once."),
      idea("Match the folds to deployment", "Stratified folds for imbalanced classes, grouped folds when examples share a user or patient, time-ordered splits for time series. Leave-one-out is k = n."),
    ],
  },
  "logistic-regression": {
    keyIdeas: [
      idea("Read it as a probability", "h(x) = p(y = 1 | x). An output of 0.7 for a tumour means an estimated 70% chance that it is malignant."),
      idea("Still a straight boundary", "h(x) >= 0.5 exactly when theta . x + theta_0 >= 0, so the boundary is a line (a hyperplane). Squared features let it curve."),
      idea("Why not linear regression?", "One far-away but clearly positive example tilts a regression line, shifts its 0.5 crossing, and breaks predictions that were right before."),
      idea("Discriminative", "It models p(y | x) directly. A generative model instead models p(x | y) and p(y), what each class looks like, then uses Bayes' rule."),
      idea("More than two classes", "One-vs-rest trains one classifier per class (cat vs not cat, dog vs not dog, fish vs not fish) and picks the most probable class."),
    ],
  },
  "logistic-loss": {
    keyIdeas: [
      idea("Case by case", "The cost is -log h when y = 1 and -log(1 - h) when y = 0: zero for a perfect answer, unbounded for a confident wrong one."),
      idea("Why not squared error?", "With the sigmoid inside, squared error is not convex, so gradient descent can stall. Cross-entropy is convex, though it has no closed-form solution."),
      idea("Where it comes from", "Minimizing it picks the most likely parameters (maximum likelihood). The minus sign turns maximizing the log-likelihood into minimizing a non-negative loss."),
      idea("A familiar update", "theta <- theta - alpha times the average of (h - y) x: the same form as linear regression, with a different h."),
      idea("Separable data", "Convex does not guarantee a finite minimizer: on linearly separable data the loss keeps falling as ||theta|| grows, so in practice a small L2 penalty is added."),
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
      idea("Drift", "Inputs can move away from the training data (covariate shift), or the input-label link can change (concept drift). Accuracy can fall unnoticed unless monitored; under covariate shift alone, the harm comes from a model that is wrong or extrapolating."),
      idea("Technical debt", "Entangled features, glue code, tangled pipelines, and predictions that feed back into their own future training data (Sculley et al.)."),
      idea("Good practice", "Start from the business objective, keep a simple baseline, version data and models, monitor inputs and outputs, and retrain on a schedule or when drift appears."),
    ],
  },
  "sets": {
    keyIdeas: [
      idea("Union", "Everything in either bag."),
      idea("Intersection", "Only what is in both bags."),
      idea("Difference", "What is in the first bag but not the second."),
      idea("Complement", "Everything in the universe (the big bag you are working inside) that is not in the set."),
    ],
  },
  "functions": {
    keyIdeas: [
      idea("Injective (one-to-one)", "No two buttons give the same snack, so nothing gets mixed up."),
      idea("Surjective (onto)", "Every snack can be bought with some button, so nothing is missed."),
      idea("Bijective", "Both at once: every snack comes from exactly one button."),
    ],
  },
  "inverse-composition": {
    keyIdeas: [
      idea("Order matters", "g after f is usually not f after g, just as washing then drying differs from drying then washing."),
      idea("Undoing", "Running f and then its inverse returns you to where you started."),
      idea("Only bijections can be undone", "If two inputs share an output, the output cannot tell you which one to go back to."),
    ],
  },
  "vectors-dot-product": {
    keyIdeas: [
      idea("How to compute it", "Multiply matching entries and add them up."),
      idea("How to read it", "Large and positive: same direction. Zero: perpendicular. Negative: pointing apart."),
      idea("Length and angle", "A vector dotted with itself is its length squared; dividing a dot product by both lengths gives the cosine of the angle between them."),
    ],
  },
  "norms": {
    keyIdeas: [
      idea("Three common norms", "L2 is straight-line length; L1 adds the absolute coordinates, like walking city blocks; L-infinity keeps only the largest coordinate."),
      idea("What makes a norm", "Only the zero vector has length 0, doubling a vector doubles its length, and a detour is never shorter than the direct route (triangle inequality)."),
      idea("Unit balls", "The vectors of length 1 form a circle for L2, a diamond for L1, and a square for L-infinity."),
      idea("Why it matters in ML", "The L1 diamond's corners are why a lasso penalty often sets some weights exactly to zero."),
    ],
  },
  "matrix-operations": {
    keyIdeas: [
      idea("Adding and scaling", "Both happen cell by cell, so the grids must have the same shape."),
      idea("Transposing", "Flip the grid so rows become columns, like turning a spreadsheet on its side."),
      idea("Symmetric matrices", "A grid that equals its own flip. The transpose shows up everywhere, from dot products to covariance matrices."),
    ],
  },
  "matrix-multiplication-outer-product": {
    keyIdeas: [
      idea("Row times column", "Entry (i, j) of AB pairs row i of A with column j of B: multiply matching numbers and add."),
      idea("Sizes must match inside", "An m by k grid can only multiply a k by n grid."),
      idea("The outer product", "Two plain lists build a whole grid in which every row is a scaled copy of the same row: the simplest (rank-one) matrix."),
      idea("Why it matters", "Any matrix product is a sum of such rank-one pieces, which powers neural-network layers and image compression."),
    ],
  },
  "matrix-systems": {
    keyIdeas: [
      idea("One compact statement", "Many linear equations become a single matrix equation, solved all together."),
      idea("How to solve it", "Gaussian elimination untangles the equations step by step into simpler ones with exactly the same answers."),
    ],
  },
  "gaussian-elimination": {
    keyIdeas: [
      idea("Three safe moves", "Swap two equations, multiply one by a nonzero number, or add a multiple of one to another. None changes the answers, and each can be undone."),
      idea("Build a staircase", "Clear the numbers below the diagonal to reach row echelon form. Each step of the staircase is a pivot."),
      idea("Read it off", "Make each pivot 1 and clear above it too (reduced row echelon form), and the solution can be read straight off the page."),
    ],
  },
  "solution-structure": {
    keyIdeas: [
      idea("No solution", "A pivot in the answer column means the equations contradict each other, like 0 = 1."),
      idea("Exactly one", "A pivot in every unknown's column (and no contradiction) pins down a single solution."),
      idea("Infinitely many", "Each unknown without a pivot is free, and adds a direction you can slide along while still solving the equations."),
      idea("The full picture", "When solutions exist, they are one particular answer plus every combination of those slide directions (the null space)."),
    ],
  },
  "vector-spaces": {
    keyIdeas: [
      idea("Not just arrows", "Lists of features, matrices of one shape, and polynomials of degree at most 2 are all vector spaces."),
      idea("Why it matters", "Once something is a vector space, span, basis, and dimension all apply to it."),
    ],
  },
  "span-linear-combinations": {
    keyIdeas: [
      idea("Lines and planes", "One arrow spans a line through the origin; two arrows in different directions span a plane."),
      idea("Is b reachable?", "Asking whether b is in the span means solving for the recipe amounts."),
    ],
  },
  "linear-independence": {
    keyIdeas: [
      idea("The test", "Is there a mix of them, with amounts not all zero, that adds up to the zero vector? If so, they are dependent."),
      idea("A subtle case", "With three or more vectors, the set can be dependent even though no two are copies of each other."),
      idea("Row reduction answers it", "A column without a pivot is a mix of the pivot columns before it."),
    ],
  },
  "subspaces": {
    keyIdeas: [
      idea("Must contain the origin", "A line through the origin is a subspace; the same line shifted off the origin is not."),
      idea("Two from every matrix", "The column space (every output Ax can produce) and the null space (every input sent to zero)."),
    ],
  },
  "basis-coordinates": {
    keyIdeas: [
      idea("Spans", "You can reach any point by combining the basis vectors."),
      idea("Independent", "None of them repeats the others, which is why each address is unique."),
    ],
  },
  "dimension": {
    keyIdeas: [
      idea("Well defined", "Every basis of a space has the same number of vectors, and that number is the dimension."),
      idea("Limits", "In n dimensions, more than n vectors must be dependent, and fewer than n cannot span."),
      idea("Inside bigger spaces", "A line through the origin has dimension 1 and a plane dimension 2, even inside a larger space."),
    ],
  },
  "linear-transformations": {
    keyIdeas: [
      idea("Basis directions decide everything", "Knowing where the basic directions go tells you where every vector goes, so every linear map is a matrix."),
      idea("Kernel", "The inputs squashed to zero."),
      idea("Image", "The outputs the map can reach."),
    ],
  },
  "transformation-matrix": {
    keyIdeas: [
      idea("Columns are landing spots", "Write where each basic direction lands as a column; those columns form the matrix."),
      idea("Apply it", "Multiplying the matrix by any vector gives where that vector lands."),
    ],
  },
  "composition-of-transformations": {
    keyIdeas: [
      idea("Right acts first", "In the product AB, B acts first and A acts second."),
      idea("Why row times column", "It is exactly the bookkeeping that tracks where each direction ends up after both steps."),
      idea("Stacked linear layers collapse", "A stack of purely linear neural-network layers is just one matrix, which is why networks need nonlinear activations."),
    ],
  },
  "change-of-basis": {
    keyIdeas: [
      idea("The converter", "Put the new grid's arrows as the columns of P. P turns new-grid coordinates into ordinary ones; P^-1 turns them back."),
      idea("Why bother", "A clever grid can make a messy transformation look simple, such as pure stretching along each axis. That idea underlies diagonalization and PCA."),
    ],
  },
  "affine-maps": {
    keyIdeas: [
      idea("Why models need it", "The shift lets a line or decision boundary sit anywhere, instead of always passing through the origin."),
      idea("Affine sets", "A subspace slid away from the origin, like the solutions of Ax = b."),
    ],
  },
  "rank-nullity": {
    keyIdeas: [
      idea("Rank", "The dimension of the column space: how many independent directions come out."),
      idea("Nullity", "The dimension of the null space: how many input directions are squashed to zero."),
      idea("The theorem", "Rank plus nullity equals the number of columns."),
    ],
  },
  "determinant-geometry": {
    keyIdeas: [
      idea("In 3D", "It is the volume scale factor."),
      idea("Zero means flattened", "Some direction was squashed, so information is lost and the matrix cannot be undone."),
      idea("Multiplies", "Doing two maps in a row multiplies their area scales: det(AB) = det(A) det(B)."),
    ],
  },
  "determinants-cofactor-row-ops": {
    keyIdeas: [
      idea("Cofactor expansion", "Breaks a big determinant into smaller ones."),
      idea("Row operations", "Simplify the matrix first, tracking the effect: a swap flips the sign, scaling a row by c scales the determinant by c, and adding a multiple of one row to another changes nothing."),
    ],
  },
  "invertible-transformations": {
    keyIdeas: [
      idea("Many tests, one answer", "For a square matrix these all agree: a pivot in every column, a nonzero determinant, independent columns, and only 0 maps to 0."),
      idea("In practice", "Use invertibility to check that the answer is uniquely pinned down, but solve Ax = b by elimination rather than computing the inverse."),
    ],
  },
  "inner-products": {
    keyIdeas: [
      idea("The rules", "Symmetric, linear in each vector, and positive definite: a nonzero vector combined with itself always gives a positive number."),
      idea("In R^n", "Every inner product is x^T A y for a symmetric positive definite matrix A. A = I gives the ordinary dot product."),
      idea("A stretched ruler", "Any other A measures some directions more than others, so the unit circle becomes an ellipse and orthogonality changes meaning."),
    ],
  },
  "orthogonality": {
    keyIdeas: [
      idea("Orthonormal basis", "Mutually perpendicular directions of length 1. In such a basis, each coordinate is just a dot product, with no equations to solve."),
      idea("Orthogonal matrices", "A square Q with orthonormal columns rotates or reflects without stretching, and Q^T undoes it."),
    ],
  },
  "orthogonal-complement": {
    keyIdeas: [
      idea("Together they rebuild the space", "Every vector splits in exactly one way into a part in U and a part perpendicular to U, and their dimensions add up to n."),
      idea("In the input space", "The row space and the null space are complements, because Ax = 0 says x is perpendicular to every row."),
      idea("In the output space", "The column space and the left null space (solutions of A^T y = 0) are complements."),
      idea("What A does", "It maps the row space one-to-one onto the column space and sends the null space to zero."),
    ],
  },
  "orthogonal-projections": {
    keyIdeas: [
      idea("One condition finds it", "The leftover error must be perpendicular to the subspace."),
      idea("Onto a line", "For a line spanned by b, the projection is (b . x / b . b) b."),
      idea("Onto a subspace", "For the columns of B, perpendicular error gives the normal equation B^T B lambda = B^T x, and the projection is B lambda."),
      idea("Projecting twice", "Changes nothing, so the projection matrix satisfies P^2 = P."),
    ],
  },
  "gram-schmidt": {
    keyIdeas: [
      idea("One vector at a time", "Keep the first. From each next one, subtract its projections onto the directions already chosen; what is left is perpendicular to all of them."),
      idea("Normalize", "Scale each vector to length 1, at the end or as you go."),
      idea("QR factorization", "Applied to the columns of A, it gives A = QR: Q has orthonormal columns and the upper triangular R records the coefficients."),
    ],
  },
  "eigenvalues-eigenvectors": {
    keyIdeas: [
      idea("The equation", "Av = lambda v, where the number lambda is the eigenvalue."),
      idea("Reading lambda", "2 doubles the arrow, 0.5 halves it, and a negative value flips it backwards."),
      idea("Why they matter", "They reveal a matrix's natural axes, which is why they appear in PCA and in long-run behaviour such as PageRank."),
    ],
  },
  "trace": {
    keyIdeas: [
      idea("With the determinant", "The determinant is the product of the eigenvalues, so for a 2 by 2 matrix trace and determinant pin down both eigenvalues."),
      idea("Stable under change of basis", "tr(P^-1 A P) = tr(A), and products can be rotated inside it: tr(AB) = tr(BA)."),
      idea("In machine learning", "The trace of a covariance matrix is the total variance of the data, which PCA divides among its components."),
    ],
  },
  "diagonalization": {
    keyIdeas: [
      idea("The factorization", "A = P D P^-1: change into eigen-coordinates, stretch by the eigenvalues, change back. It needs n independent eigenvectors."),
      idea("Powers are cheap", "A^k = P D^k P^-1, and D^k just raises each eigenvalue to the power k."),
      idea("Long-run behaviour", "Directions with eigenvalues larger than 1 in size grow; those smaller than 1 fade."),
    ],
  },
  "pagerank": {
    keyIdeas: [
      idea("The link matrix", "M holds the chance of moving from each page to each other page; its columns add up to 1."),
      idea("The steady state", "For well-connected graphs, applying M again and again settles to r with Mr = r: the eigenvector with eigenvalue 1."),
      idea("Damping", "With probability 1 - d the surfer jumps to a random page. This guarantees a single steady state for every graph, even ones that would otherwise cycle."),
    ],
  },
  "spectral-theorem": {
    keyIdeas: [
      idea("The guarantee", "Real eigenvalues and a full set of perpendicular eigenvectors, so A = Q Lambda Q^T."),
      idea("Why PCA works", "Covariance matrices are symmetric, which is why PCA always finds perpendicular principal directions."),
    ],
  },
  "lu-decomposition": {
    keyIdeas: [
      idea("The factors", "Elimination turns A into an upper triangular U; the multipliers used form a lower triangular L with 1s on the diagonal, and A = LU."),
      idea("Two easy solves", "Solve Ly = b from the top down, then Ux = y from the bottom up."),
      idea("Row swaps", "If a zero pivot appears, rows are swapped first, recorded as a permutation: PA = LU."),
    ],
  },
  "cholesky-decomposition": {
    keyIdeas: [
      idea("When it applies", "A must be symmetric with x^T A x > 0 for every nonzero x, such as X^T X in least squares when the features are independent."),
      idea("Why use it", "About half the work of LU, and no row swaps are ever needed."),
      idea("A built-in test", "If the algorithm meets a zero or negative number under a square root, the matrix was not positive definite."),
    ],
  },
  "svd": {
    keyIdeas: [
      idea("The steps", "V^T rotates (or reflects) the input, Sigma stretches along the axes by the singular values, and W rotates into the output space."),
      idea("Singular values", "The square roots of the eigenvalues of A^T A, listed from largest to smallest."),
      idea("Low-rank approximation", "Keeping only the largest few gives the best low-rank approximation: the idea behind image compression and PCA."),
    ],
  },
  "derivatives": {
    keyIdeas: [
      idea("Where it comes from", "The slope of a short chord from x to x + h (the difference quotient), as h shrinks toward 0."),
      idea("Reading the sign", "Positive: rising. Negative: falling. Zero: a flat spot, such as the bottom of a valley."),
      idea("Rules, not limits", "Sum, product, quotient, and chain rules differentiate almost anything built from simple pieces."),
      idea("The chain rule matters most", "The rate of change of g(f(x)) is the rate of g at f(x) times the rate of f at x."),
    ],
  },
  "partial-derivatives-gradient": {
    keyIdeas: [
      idea("Steepest ascent", "The gradient points where f increases fastest, and its length is that fastest rate."),
      idea("Perpendicular to contours", "It is perpendicular to the level curve through the point."),
      idea("Gradient descent", "Walking against the gradient is the steepest way down."),
      idea("Any direction", "The slope along a unit direction u is the dot product of the gradient with u."),
    ],
    notesTitle: "Notes on the book's notation",
    courseNotes: [
      "The MML book writes the gradient as a row vector, which makes the chain rule a plain matrix product; update steps use the matching column vector.",
    ],
  },
  "jacobian-chain-rule": {
    keyIdeas: [
      idea("Local linear map", "A tiny input step dx moves the output by about J dx. For f(x) = Ax the Jacobian is just A."),
      idea("Area scaling", "For a map from R^2 to R^2, the absolute value of det J says how much a tiny square's area is stretched."),
      idea("Chain rule = matrix product", "The Jacobian of g after f is the Jacobian of g (at f(x)) times the Jacobian of f."),
    ],
  },
  "loss-gradients": {
    keyIdeas: [
      idea("Two key identities", "The gradient of a^T x is a^T, and the gradient of x^T A x is x^T (A + A^T)."),
      idea("Least squares", "With the chain rule they give the gradient of ||y - X theta||^2; setting it to zero gives the normal equation."),
      idea("Logistic loss", "The same steps give a memorable shape: prediction error times input, averaged over the data."),
      idea("Check your work", "A numerical check (one difference quotient per coordinate) catches most algebra slips."),
    ],
  },
  "backpropagation": {
    keyIdeas: [
      idea("Forward pass", "Compute and store every intermediate value of the computation graph."),
      idea("Backward pass", "Start at the output with derivative 1. Each node multiplies the incoming derivative by its local derivative (the chain rule) and passes it on."),
      idea("Branches add up", "Where a value feeds several later steps, their contributions are summed."),
      idea("Cheap and exact", "One backward pass costs about as much as a forward pass or two, and automatic differentiation is exact up to rounding, unlike finite differences."),
    ],
  },
  "taylor-hessian": {
    keyIdeas: [
      idea("More terms, better fit", "Each extra term matches one more derivative at the point, so the approximation stays close over a wider range."),
      idea("The Hessian", "The matrix of all second partial derivatives. For smooth functions it is symmetric, and its eigenvalues are the curvatures along its eigenvectors."),
      idea("Classifying flat points", "All eigenvalues positive: a bowl (local minimum). All negative: a dome. Mixed signs: a saddle."),
      idea("Links", "A positive semidefinite Hessian everywhere means convex; Newton's method jumps to the minimum of the quadratic approximation."),
    ],
  },
  "dimensionality-reduction": {
    keyIdeas: [
      idea("How it works", "Project each point onto a few chosen directions (an orthonormal basis U), store only those coordinates, and rebuild an approximation from them."),
      idea("The skill", "Choose directions that lose the least, dropping those in which the data barely varies. That is what PCA does, using eigenvectors."),
    ],
  },
  "pca": {
    keyIdeas: [
      idea("Center first", "Subtract the mean from every point."),
      idea("Most spread", "The first principal component is the direction of largest variance: the top eigenvector of the covariance matrix, with the eigenvalue as the variance kept."),
      idea("Then the next", "Each further component is the most-spread direction perpendicular to the ones before."),
      idea("Two views agree", "Maximizing kept variance is the same as minimizing reconstruction error, because by Pythagoras total variance = kept variance + reconstruction error."),
    ],
  },
};
