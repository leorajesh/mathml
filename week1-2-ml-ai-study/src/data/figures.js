// Static "Picture it" figures shown under a page's intuition. Titles, captions, and alt text live
// here (so scripts/check-content.mjs can verify them); the drawings are in components/Figures.jsx.
// All figures are drawn for this site. Where the course book, Mathematics for Machine Learning,
// has a figure with the same idea, `mml` names it so students can compare.

export const figures = {
  'row-column-picture': {
    title: 'Two ways to read Ax = b',
    caption: 'Row picture (left): each equation is a line, and the solution is where the lines cross. Column picture (right): the same solution says how much of each column to add to reach b: 2 times [2, 1] plus 1 times [1, -1] equals [5, 1].',
    alt: 'Left: the lines 2a + b = 5 and a - b = 1 crossing at (2, 1). Right: arrows 2 times column one and 1 times column two placed tip to tail, ending at b = (5, 1).',
    mml: 'Figure 2.3 and §2.1',
  },
  'l1-l2-balls': {
    title: 'Why L1 gives exact zeros and L2 does not',
    caption: 'The ellipses are level curves of the squared error around the least-squares solution. Growing them until they first touch the allowed region gives the constrained answer, which equals the penalized (regularized) one for a matching lambda. The L1 diamond (left) is usually touched at a corner, where one weight is exactly 0. The L2 circle (right) has no corners, so both weights typically stay nonzero.',
    alt: 'Two panels. Left: a diamond centered at the origin and an ellipse touching it at the top corner, on the vertical axis. Right: a circle and an ellipse touching it at a point off both axes.',
    mml: 'Figure 3.3 (unit balls) and §9.2.4',
  },
  'projection-plane': {
    title: 'Projection onto a plane is the closest point',
    caption: 'The shaded plane is a subspace (for least squares: the column space of X, every prediction vector the model can make). The projection is where the perpendicular from the target meets the plane, and the error is perpendicular to the plane. Worked example: x = [1, 2, 6] projects to [2, 3, 5] with error [-1, -1, 1].',
    alt: 'A tilted shaded plane through the origin, a vector x above it, its projection lying in the plane, and a dashed error segment from the projection up to x meeting the plane at a right angle.',
    mml: 'Figures 3.10-3.11 and Figure 9.12',
  },
  'svd-circle-ellipse': {
    title: 'The SVD turns the unit circle into an ellipse',
    caption: 'Every matrix A = W Sigma V^T acts in three steps: V^T rotates (or reflects) the circle (it still looks the same, but v1 and v2 now lie on the axes), Sigma stretches the axes by sigma_1 and sigma_2, and W rotates the result. The ellipse\'s half-axes are sigma_1 w1 and sigma_2 w2.',
    alt: 'Four panels left to right: a unit circle with two perpendicular vectors v1 and v2; the circle after rotation with the vectors on the axes; an axis-aligned ellipse with half-axes sigma1 and sigma2; the same ellipse rotated, with half-axes sigma1 w1 and sigma2 w2.',
    mml: 'Figure 4.8',
  },
  'four-subspaces': {
    title: 'The four fundamental subspaces of an m by n matrix',
    caption: 'In the input space R^n, the row space and the null space are perpendicular and their dimensions add to n. In the output space R^m, the column space and the left null space are perpendicular and add to m. A maps the row space one-to-one onto the column space and sends the whole null space to 0.',
    alt: 'Two boxes. The left box, R^n, holds the row space of dimension r and the null space of dimension n minus r at right angles. The right box, R^m, holds the column space of dimension r and the left null space of dimension m minus r at right angles. An arrow maps the row space onto the column space, another maps the null space to the zero vector.',
    mml: 'Figure 2.12 and §3.6',
  },
  'gd-zigzag': {
    title: 'Zig-zag versus momentum',
    caption: 'On a long, narrow bowl, plain gradient descent (grey) bounces across the valley and crawls along it. With momentum (orange), the back-and-forth parts of successive steps cancel and the along-the-valley parts add up, so it heads for the minimum far more directly. Same step size, same number of steps.',
    alt: 'Elliptical contour lines of a stretched bowl. A grey path zig-zags steeply up and down while moving slowly right; an orange path curves smoothly toward the center.',
    mml: 'Figure 7.3 and §7.1.2',
  },
  'lagrange-tangent': {
    title: 'At the constrained minimum the level curve touches the constraint',
    caption: 'Circles are level curves of f = x^2 + y^2, and the line is the constraint x + y = 1. At a point that is not optimal (grey), the line crosses a level curve, so moving along it lowers f. At the minimum (orange), the line only touches the smallest reachable circle, and grad f is parallel to grad h.',
    alt: 'Concentric circles around the origin and a straight line x + y = 1. The line is tangent to one circle at (0.5, 0.5), where two parallel arrows (the gradients) point away from the origin. At another point on the line the arrows point in different directions.',
    mml: 'Figure 7.4',
  },
  'computation-graph': {
    title: 'Forward pass, then backward pass, through a small network',
    caption: 'Top (blue): the forward pass computes each layer from the one before and stores the results. Bottom (orange): the backward pass starts with dL/dL = 1 at the loss and moves right to left, multiplying by the transpose of each step\'s local Jacobian (gradients are written here as column vectors). The gradient for each layer\'s weights comes from the backward signal arriving at that layer and the value stored there in the forward pass.',
    alt: 'A chain of boxes from the input x through a hidden layer h = sigma(W1 x + b1) and an output y-hat = W2 h + b2 to the loss L. Blue arrows run left to right labelled forward. Orange arrows run right to left labelled with dL/dy-hat, dL/dh, and dL/dz1, and short orange arrows branch off to the weight gradients dL/dW2 and dL/dW1.',
    mml: 'Figures 5.8-5.9',
  },
  'bias-variance-targets': {
    title: 'Bias and variance as throws at a target',
    caption: 'Each dot is the prediction, at one fixed input x, of a model trained on a different training set; the centre is the true value. Bias is how far the cloud\'s centre is from the bullseye, variance is how spread out the cloud is. Rigid models behave like the second target (tight but off-centre), very flexible models like the third (centred but scattered).',
    alt: 'Four targets in a row. First: dots tightly clustered on the bullseye (low bias, low variance). Second: dots tightly clustered away from the centre (high bias, low variance). Third: dots scattered widely around the centre (low bias, high variance). Fourth: dots scattered and off-centre (high bias, high variance).',
    ml: 'the same idea shown as curves in Bishop §3.2 (Figures 3.5-3.6) and ISL §2.2.2 (Figure 2.12)',
  },
  'ml-lifecycle': {
    title: 'The production ML lifecycle',
    caption: 'A model in production is one stage of a loop: scope the problem and the business metric, collect and validate data, engineer features, train and evaluate offline, deploy, and monitor. Monitoring feeds back into new data and retraining. As Sculley et al. point out, the model code is only a small part of the whole system.',
    alt: 'Six boxes arranged in a loop: Scope, Data, Features, Train and evaluate, Deploy, Monitor. Arrows go around the loop, and a return arrow from Monitor to Data is labelled retrain when the data drifts.',
    ml: 'Huyen Ch. 1-2; Sculley et al. (2014), and Figure 1 of Sculley et al. (2015)',
  },
};

export const figureIds = Object.keys(figures);
