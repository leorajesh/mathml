// Machine learning pages added from the course reading list: Bishop (Pattern Recognition and Machine
// Learning), James et al. (An Introduction to Statistical Learning), Duda, Hart & Stork (Pattern
// Classification), Mitchell (Machine Learning), Huyen (Designing Machine Learning Systems), and
// Sculley et al. (Machine Learning: The High-Interest Credit Card of Technical Debt). They fill gaps in
// the Week 1-2 pages: the maximum-margin view of hinge loss, feature scaling and leakage, the
// bias-variance trade-off, ROC curves, and what changes once a model is in production.
// Explanations, numbers, and pictures are our own; the books are cited on each page.

const tex = String.raw;

export const mlConcepts = [
  {
    id: 'max-margin-svm',
    title: 'Maximum Margin and the Regularized Hinge Objective (SVM)',
    group: 'Loss',
    week: 'Production ML W1 · Bishop §7.1 · ISL §9.1-9.2',
    problem: 'Among all boundaries that separate the data, it picks the one with the widest safety gap, which usually generalizes best. It is also the objective that stochastic subgradient descent minimizes with the hinge loss.',
    intuition: 'When two classes can be separated, many lines do it, and some pass uncomfortably close to a point. The distance from a point x to the boundary theta . x + theta_0 = 0 is |theta . x + theta_0| / ||theta||. Scale theta so that the closest points score exactly +1 or -1: they then sit on the two margin lines theta . x + theta_0 = +1 and -1, which are 2/||theta|| apart. So widening the margin means making ||theta|| small while every signed margin stays at least 1. Real data overlaps, so violations are allowed and paid for with the hinge loss: minimize (lambda/2)||theta||^2 plus the average hinge loss. A large lambda prefers a wide margin and tolerates more violations; a small lambda fits the training points more tightly. Only the points on or inside the margin, the support vectors, decide where the boundary goes.',
    formulas: [
      { tex: tex`\text{dist}(x)=\frac{|\theta\cdot x+\theta_0|}{\lVert\theta\rVert}`, definitions: [tex`\text{dist}(x): distance from the point x to the boundary theta dot x + theta_0 = 0`] },
      { tex: tex`\theta\cdot x+\theta_0=\pm1,\qquad \text{margin width}=\frac{2}{\lVert\theta\rVert}`, definitions: ['margin lines: where the score is exactly +1 or -1; points on them are support vectors'] },
      { tex: tex`J(\theta,\theta_0)=\frac{\lambda}{2}\lVert\theta\rVert^2+\frac1n\sum_{t=1}^{n}\max\bigl(0,\ 1-y^{(t)}(\theta\cdot x^{(t)}+\theta_0)\bigr)`, definitions: [tex`\lambda: regularization strength; larger means a wider margin and more violations allowed`, tex`J: regularized hinge objective (the soft-margin support vector machine); it is convex`] },
      { tex: tex`\min_{\theta,\theta_0}\ \tfrac12\lVert\theta\rVert^2\quad\text{s.t.}\quad y^{(t)}(\theta\cdot x^{(t)}+\theta_0)\ge1\ \ \forall t`, definitions: ['hard margin: the separable case, where no point may be inside the margin; it is solved with Lagrange multipliers'] },
    ],
    example: ['Two points: x = [2, 2] with y = +1 and x = [0, 0] with y = -1. Try theta = [0.5, 0.5] and theta_0 = -1.', 'Scores: 0.5*2 + 0.5*2 - 1 = 1 for the positive point and -1 for the negative one. Both signed margins are exactly 1, so both points lie on the margin lines: they are the support vectors.', '||theta|| = sqrt(0.5) ≈ 0.707, so the margin width is 2/0.707 ≈ 2.83. That equals the distance between the two points, sqrt(8) ≈ 2.83: the boundary x1 + x2 = 2 sits exactly halfway.', 'A smaller theta with the same boundary, such as [0.25, 0.25] with theta_0 = -0.5, gives signed margins of only 0.5, so it pays hinge loss 0.5 per point. Requiring margins of at least 1 is what fixes the scale of theta.'],
    graph: { type: 'maxMargin', title: 'Soft-margin SVM: wide margin versus few violations', caption: 'Blue points are y = +1 and orange points y = -1. The solid line is the boundary and the dashed lines are the margin lines (score +1 and -1); ringed points are on or inside the margin. Raise lambda to widen the margin at the cost of more violations.', sliders: [{ key: 'lambda', label: 'regularization lambda', min: 0.02, max: 1.5, step: 0.02, value: 0.1 }] },
    misconception: 'A support vector machine does not draw a different kind of boundary: it is still a linear classifier sign(theta . x + theta_0). What changes is the objective used to choose theta, which rewards a wide margin instead of only counting training mistakes.',
    prerequisites: ['hinge-loss', 'linear-separability', 'norms'],
    followOns: ['convex-functions', 'stochastic-subgradient-descent', 'lagrange-multipliers', 'ridge-regularization'],
    sources: ['Week1_03-HingeLoss.pdf', 'Bishop §7.1', 'James et al. §9.1-9.2'],
  },
  {
    id: 'feature-scaling',
    title: 'Feature Scaling, Encoding, and Data Leakage',
    group: 'Representation',
    week: 'Production ML W2 · Huyen Ch. 5 · ISL §6.2.1',
    problem: 'It puts features on comparable scales and in usable formats, which makes gradient descent faster, makes penalties such as ridge and lasso fair to every feature, and keeps test data from leaking into training.',
    intuition: 'Describe a house by [bedrooms, area in square feet] and one feature is around 3 while the other is around 2000. Penalties and distances treat a unit of each the same, so the large-scale feature dominates, and gradient descent sees a long, narrow valley and zig-zags. Standardizing (subtract the mean, divide by the standard deviation) gives every feature mean 0 and spread 1. Min-max scaling squeezes each feature into [0, 1]. Categories become one-hot vectors, and a feature cross (the product of two features) lets a linear model use an interaction. One rule matters above all: compute means, standard deviations, and any other statistics on the training set only, then apply them unchanged to validation and test data. Using test-set statistics, or features that would not exist at prediction time, is data leakage, and it makes the evaluation look better than the model really is.',
    formulas: [
      { tex: tex`z=\frac{x-\mu}{\sigma},\qquad \mu=\frac1n\sum_{t=1}^{n}x^{(t)},\qquad \sigma=\sqrt{\frac1n\sum_{t=1}^{n}\bigl(x^{(t)}-\mu\bigr)^2}`, definitions: [tex`x: a raw feature value`, tex`\mu: the feature's mean on the training set`, tex`\sigma: the feature's standard deviation on the training set`, tex`z: standardized value (mean 0, standard deviation 1 on the training set)`] },
      { tex: tex`x'=\frac{x-x_{\min}}{x_{\max}-x_{\min}}`, definitions: [tex`x': min-max scaled value, in [0, 1] for the training data`] },
      { tex: tex`X'=XD\ \Rightarrow\ X'^TX'=D\,X^TX\,D,\qquad \kappa=\frac{\lambda_{\max}(X^TX)}{\lambda_{\min}(X^TX)}`, definitions: [tex`D: diagonal matrix of per-feature scale factors`, tex`\kappa: condition number; a large kappa means a narrow valley and slow gradient descent`] },
    ],
    example: ['Training values of a feature: 1000, 1500, 2000 (square feet). The mean is mu = 1500.', 'Standard deviation: sqrt(((-500)^2 + 0^2 + 500^2)/3) = sqrt(166667) ≈ 408.2.', 'Standardized training values: -500/408.2 ≈ -1.22, 0, and 1.22.', 'A test house with 2500 square feet uses the training mu and sigma: (2500 - 1500)/408.2 ≈ 2.45. Recomputing mu and sigma with the test house included would leak test information into the model.'],
    graph: { type: 'scaling', title: 'Unscaled features make a narrow valley', caption: 'Contours of a least-squares loss over two weights when the second feature is s times larger in scale than the first, and the gradient-descent path with step size 1.8/s^2, just under the stability limit 2/s^2. Standardizing makes the contours round and gradient descent fast.', sliders: [{ key: 's', label: 'scale ratio s of feature 2', min: 1, max: 6, step: 0.5, value: 4 }, { key: 'standardize', label: 'standardize (0 = no, 1 = yes)', min: 0, max: 1, step: 1, value: 0 }, { key: 'steps', label: 'gradient steps', min: 1, max: 40, step: 1, value: 15 }] },
    misconception: 'Scaling does not change what a linear model can represent (the weights simply rescale), but it changes how fast gradient descent trains, how ridge and lasso penalize each feature, and how distance-based methods behave.',
    prerequisites: ['feature-representation', 'gradient-descent-method', 'least-squares-normal-equation'],
    followOns: ['ridge-regularization', 'lasso', 'train-validation-test'],
    sources: ['Production ML Slides Lesson 3 - Linear Regression.pdf', 'Huyen Ch. 5', 'James et al. §6.2.1'],
  },
  {
    id: 'bias-variance',
    title: 'The Bias–Variance Trade-off',
    group: 'Generalization',
    week: 'Production ML W2 · ISL §2.2.2 · Bishop §3.2',
    problem: 'It explains why test error is U-shaped in model complexity: error comes from a model that is too rigid (bias), one too sensitive to its particular training set (variance), and noise that no model can remove.',
    intuition: 'Imagine training the same kind of model on many different training sets drawn from the same source, and predicting at one input x each time. Bias is how far the average prediction is from the truth: a straight line fitted to a curve is wrong in the same way every time. Variance is how much the predictions scatter from one training set to the next: a wiggly degree-9 polynomial changes a lot when a few points move. Noise is the randomness in the labels themselves. For squared error, the expected test error is exactly bias squared plus variance plus noise. More complexity lowers bias but raises variance, so the best model sits in between. More training data lowers variance without adding bias; regularization lowers variance at the cost of some extra bias.',
    formulas: [
      { tex: tex`\mathbb{E}\bigl[(y-\hat h(x))^2\bigr]=\underbrace{\bigl(\mathbb{E}[\hat h(x)]-f(x)\bigr)^2}_{\text{bias}^2}+\underbrace{\mathbb{E}\bigl[(\hat h(x)-\mathbb{E}[\hat h(x)])^2\bigr]}_{\text{variance}}+\underbrace{\sigma^2}_{\text{noise}}`, definitions: [tex`f(x): the true regression function`, tex`\hat h(x): prediction of a model trained on a random training set`, tex`\mathbb{E}: average over training sets (and over the label noise)`, tex`\sigma^2: noise variance, the irreducible error`] },
      { tex: tex`y=f(x)+\varepsilon,\qquad \mathbb{E}[\varepsilon]=0,\quad \operatorname{Var}(\varepsilon)=\sigma^2`, definitions: [tex`\varepsilon: label noise, independent of the training set`] },
    ],
    example: ['The true value at some input is f(x) = 2. A simple model trained on three different training sets predicts 1.5, 1.6, and 1.4 there.', 'Its average prediction is 1.5, so bias^2 = (1.5 - 2)^2 = 0.25, and its variance is (0^2 + 0.1^2 + (-0.1)^2)/3 ≈ 0.0067.', 'A flexible model predicts 1.2, 2.9, and 2.0. Its average is about 2.033, so bias^2 ≈ 0.0011, but its variance is ((-0.833)^2 + 0.867^2 + (-0.033)^2)/3 ≈ 0.482.', 'Ignoring noise, the simple model\'s expected squared error is 0.25 + 0.0067 ≈ 0.257 and the flexible model\'s is 0.0011 + 0.482 ≈ 0.483. Here the low-bias model loses because of its variance.'],
    graph: { type: 'biasVariance', title: 'Bias squared, variance, and test error by degree', caption: 'Exact expected values (the average over all possible training sets) for polynomials of degree 0 to 9 fitted by least squares to 12 evenly spaced inputs of a sine curve with noise of standard deviation 0.4, measured at those inputs with fresh noise. Bias squared (blue) never increases with degree (even degrees add nothing here because this sine is odd about x = 0.5), variance (orange) rises, and their sum plus the noise (dark) is roughly U-shaped, lowest at degree 3.', sliders: [{ key: 'degree', label: 'polynomial degree', min: 0, max: 9, step: 1, value: 3 }] },
    figure: 'bias-variance-targets',
    misconception: 'Variance here is not the spread of the data. It is how much the fitted model would change if it were trained on a different sample, so a model can have low training error and still high variance.',
    prerequisites: ['model-complexity-generalization', 'polynomial-regression'],
    followOns: ['ridge-regularization', 'train-validation-test', 'cross-validation'],
    sources: ['Production ML Slides Lesson 3 - Linear Regression.pdf', 'James et al. §2.2.2', 'Bishop §3.2'],
  },
  {
    id: 'roc-auc',
    title: 'ROC Curves and AUC',
    group: 'Generalization',
    week: 'Production ML W2 · ISL §4.4 · Huyen Ch. 4',
    problem: 'It shows how a classifier trades catching positives against raising false alarms as the threshold moves, and summarizes how well its scores rank positives above negatives in one number.',
    intuition: 'A probabilistic classifier gives each example a score, and a threshold turns scores into yes or no. Lowering the threshold catches more positives (a higher true positive rate, also called recall or sensitivity) but also flags more negatives (a higher false positive rate, which is 1 minus specificity). Sweeping the threshold from high to low traces the ROC curve from (0, 0) to (1, 1). A perfect ranker hugs the top-left corner; random guessing follows the diagonal. The area under the curve, AUC, is the probability that a randomly chosen positive gets a higher score than a randomly chosen negative. When positives are rare, a point that looks good on the ROC curve can still have poor precision, so precision-recall curves are often reported as well.',
    formulas: [
      { tex: tex`\operatorname{TPR}=\frac{TP}{TP+FN},\qquad \operatorname{FPR}=\frac{FP}{FP+TN}`, definitions: [tex`\operatorname{TPR}: true positive rate (recall, sensitivity)`, tex`\operatorname{FPR}: false positive rate (1 - specificity)`] },
      { tex: tex`\operatorname{AUC}=P\bigl(s(x^+)>s(x^-)\bigr)\quad(\text{ties count }\tfrac12)`, definitions: [tex`s(x^+): score of a randomly chosen positive example`, tex`s(x^-): score of a randomly chosen negative example`] },
    ],
    example: ['Scores for three positives: 0.9, 0.8, 0.4. Scores for three negatives: 0.7, 0.3, 0.2.', 'Threshold 0.5: two positives score above it (0.9 and 0.8), so TPR = 2/3; one negative does (0.7), so FPR = 1/3.', 'Threshold 0.35 gives TPR = 3/3 = 1 and FPR = 1/3. Threshold 0.75 gives TPR = 2/3 and FPR = 0.', 'AUC: of the 3 x 3 = 9 positive-negative pairs, the positive scores higher in 8 (only 0.4 < 0.7 fails), so AUC = 8/9 ≈ 0.889.'],
    graph: { type: 'roc', title: 'Threshold, score distributions, and the ROC curve', caption: 'Right: scores of negatives (orange) and positives (blue), each normally distributed, and the threshold (dashed). Left: the ROC curve and the point for the current threshold. More separation between the classes pushes the curve toward the top-left and raises AUC.', sliders: [{ key: 'separation', label: 'class separation', min: 0, max: 3, step: 0.1, value: 1.5 }, { key: 'threshold', label: 'threshold', min: -2, max: 4, step: 0.1, value: 0.8 }] },
    misconception: 'A high AUC does not mean the classifier works well at your chosen threshold, and it can hide poor precision when positives are rare. It measures how well scores rank positives above negatives.',
    prerequisites: ['classification-metrics', 'logistic-regression'],
    followOns: ['ml-in-production'],
    sources: ['Production ML Slides Lesson 4 - Logistic Regression.pdf', 'James et al. §4.4', 'Huyen Ch. 4'],
  },
  {
    id: 'ml-in-production',
    title: 'ML in Production: Lifecycle, Monitoring, and Technical Debt',
    group: 'Problem',
    week: 'Production ML W1 · Huyen Ch. 1, 2, 8 · Sculley et al.',
    problem: 'It explains what it takes for a model to keep working after training: clear objectives, reliable data pipelines, deployment, monitoring for changes in the data, and retraining, without hidden maintenance costs piling up.',
    intuition: 'In a course, a model is finished when its test error is low. In production, that is where the work starts. The ML code is a small box inside a much larger system that collects and validates data, computes features, serves predictions within a time budget, and logs the results. The world keeps changing: the inputs can drift away from the training data (covariate shift), or the link between inputs and labels can change (concept drift), and accuracy then decays quietly unless it is monitored. Sculley and colleagues call the extra burden technical debt: changing one feature changes everything (entanglement), glue code and tangled pipelines pile up, and a model\'s predictions can feed back into its own future training data. Good practice is to start from the business objective, keep a simple baseline, version data and models, monitor inputs and outputs, and retrain on a schedule or when drift is detected.',
    formulas: [
      { tex: tex`P_{\text{train}}(x,y)\ne P_{\text{prod}}(x,y)`, definitions: [tex`P_{\text{train}}: distribution of the training data`, tex`P_{\text{prod}}: distribution of the data seen in production; a difference is a distribution shift`] },
      { tex: tex`\text{covariate shift: } P(x)\text{ changes, } P(y\mid x)\text{ stays};\qquad \text{concept drift: } P(y\mid x)\text{ changes}`, definitions: [tex`P(y\mid x): how labels depend on inputs`] },
      { tex: tex`\bar A=A_0-\frac{d\,T}{2}`, definitions: [tex`\bar A: average accuracy when accuracy falls d points per month and the model is retrained every T months`, tex`A_0: accuracy right after training`] },
    ],
    example: ['A fraud model reaches 92% accuracy offline. After deployment, fraud patterns change and accuracy drops by about 1.5 points per month.', 'Never retrained, it is down to 92 - 1.5*12 = 74% after a year.', 'Retrained every 3 months, it moves between 92% and 87.5%, averaging 92 - 1.5*3/2 = 89.75%. Retrained monthly, it averages 91.25%, but needs about three times as many retrains.', 'Monitoring the input distribution and, once labels arrive, the live accuracy shows when to retrain instead of guessing.'],
    graph: { type: 'driftRetrain', title: 'Accuracy decay and retraining', caption: 'Accuracy of a deployed model over two years when the data drifts and the model is retrained every T months (T = 24 means never). Frequent retraining keeps accuracy high but costs more compute and engineering time.', sliders: [{ key: 'decay', label: 'accuracy lost per month (points)', min: 0, max: 3.5, step: 0.1, value: 1.5 }, { key: 'interval', label: 'retrain every T months', min: 1, max: 24, step: 1, value: 3 }] },
    figure: 'ml-lifecycle',
    misconception: 'A model with excellent test accuracy is not finished. Test accuracy measures one snapshot of the data; without monitoring, a shift in the data can make the deployed model quietly worse.',
    prerequisites: ['ml-workflow', 'train-validation-test', 'classification-metrics'],
    followOns: [],
    sources: ['Production ML slides - Introduction Lesson1.pdf', 'Huyen Ch. 1, 2, 8', 'Sculley et al. (2014)'],
  },
];
