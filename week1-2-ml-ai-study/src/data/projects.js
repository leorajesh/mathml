// End-to-end worked projects, one per area: a single runnable program that ties the pages of the
// area together, with the stages explained and the output it prints. Each is shown on its anchor page.
// Generated from tested programs; every step links to the pages it uses.

const py = String.raw;

export const projects = {
  "classification": {
    anchor: "stochastic-subgradient-descent",
    title: "Linear classification from data to a tested separator",
    intro: "Train the perceptron and SSGD on the hinge loss, on separable and on noisy data, and compare them on held-out examples.",
    steps: [
      { label: "Data and splits", text: "Two labelled datasets, one separable and one with 10% flipped labels, each split into training and test sets.", pages: ["linear-classifier", "train-validation-test"] },
      { label: "Perceptron with a pocket", text: "Shuffle each pass, stop after a clean pass, and keep the best theta when the data cannot be separated.", pages: ["perceptron"] },
      { label: "SSGD on the hinge loss", text: "The course rule with an offset and optional penalty lambda, keeping the best objective value.", pages: ["stochastic-subgradient-descent", "hinge-loss"] },
      { label: "Compare on the test set", text: "Zero-one error on held-out data for every model: both reach 0 on separable data; on noisy data the perceptron never settles.", pages: ["empirical-risk-zero-one"] },
      { label: "Margins and the bound", text: "The distance margin of the perceptron's separator, and the mistake bound (R/gamma)^2 in the space [x, 1].", pages: ["linear-separability", "perceptron-convergence"] },
    ],
    code: py`# End-to-end: linear classification with the perceptron and SSGD on the hinge loss
import numpy as np
rng = np.random.default_rng(0)

# 1. Data: two classes, labels +1 / -1, split into training and test sets
def make(n, gap):
    X = rng.uniform(-3, 3, (4 * n, 2))
    s = X @ np.array([1.0, 2.0]) - 1.0                 # the true boundary x1 + 2 x2 = 1
    keep = np.abs(s) > gap                             # gap > 0: separable; gap < 0: add label noise below
    X, y = X[keep][:n], np.sign(s[keep][:n])
    return X, y
X_sep, y_sep = make(200, 0.8)
X_mix, y_mix = make(200, 0.0)
flip = rng.random(200) < 0.1; y_mix[flip] *= -1         # 10% of labels flipped: not separable

def split(X, y):
    idx = rng.permutation(len(y)); tr, te = idx[:140], idx[140:]
    return X[tr], y[tr], X[te], y[te]

zero_one = lambda X, y, th, th0: np.mean(y * (X @ th + th0) <= 0)   # a margin of 0 counts as a mistake

# 2. Perceptron with offset: shuffle each pass, stop after a clean pass, keep the best (pocket)
def perceptron(X, y, passes=100):
    th, th0, mistakes = np.zeros(2), 0.0, 0
    best = (1.0, th.copy(), th0)
    for p in range(passes):
        clean = True
        for t in rng.permutation(len(y)):
            if y[t] * (th @ X[t] + th0) <= 0:
                th += y[t] * X[t]; th0 += y[t]; mistakes += 1; clean = False
        err = zero_one(X, y, th, th0)
        if err < best[0]:
            best = (err, th.copy(), th0)
        if clean:
            return th, th0, mistakes, p + 1
    return best[1], best[2], mistakes, passes

# 3. SSGD on the regularized hinge loss (course rule, with offset), keep the best J
def ssgd(X, y, lam, steps=20_000):
    J = lambda th, th0: lam / 2 * th @ th + np.mean(np.maximum(0, 1 - y * (X @ th + th0)))
    th, th0 = np.zeros(2), 0.0
    best = (J(th, th0), th.copy(), th0)
    for k in range(steps):
        t, eta = rng.integers(len(y)), 1 / (k + 1)
        if y[t] * (th @ X[t] + th0) <= 1:
            th = (1 - eta * lam) * th + eta * y[t] * X[t]; th0 += eta * y[t]
        else:
            th = (1 - eta * lam) * th
        if (k % 200 == 0 or k == steps - 1) and J(th, th0) < best[0]:
            best = (J(th, th0), th.copy(), th0)
    return best[1], best[2]

# 4. Train on both datasets and compare on the held-out test sets
for name, X, y in [("separable", X_sep, y_sep), ("noisy", X_mix, y_mix)]:
    Xtr, ytr, Xte, yte = split(X, y)
    th, th0, M, passes = perceptron(Xtr, ytr)
    print(f"{name}: perceptron {passes} passes, {M} mistakes, train {zero_one(Xtr, ytr, th, th0):.3f}, test {zero_one(Xte, yte, th, th0):.3f}")
    for lam in [0.0, 0.01]:
        sth, sth0 = ssgd(Xtr, ytr, lam)
        print(f"   SSGD lambda={lam}: train {zero_one(Xtr, ytr, sth, sth0):.3f}, test {zero_one(Xte, yte, sth, sth0):.3f}")
    if name == "separable":
        # 5. Margins and the mistake bound (augmented space [x, 1])
        dist_margin = np.min(ytr * (Xtr @ th + th0)) / np.linalg.norm(th)
        Xa = np.c_[Xtr, np.ones(len(ytr))]
        w = np.array([1.0, 2.0, -1.0])                  # the true separator gives the tightest bound we know
        R, gamma = np.linalg.norm(Xa, axis=1).max(), np.min(ytr * (Xa @ w)) / np.linalg.norm(w)
        print(f"   perceptron's distance margin {dist_margin:.3f}; bound (R/gamma)^2 = {(R / gamma) ** 2:.0f} >= {M} mistakes")`,
    expected: "separable: perceptron 2 passes, 5 mistakes, train 0.000, test 0.000\n   SSGD lambda=0.0: train 0.000, test 0.000\n   SSGD lambda=0.01: train 0.000, test 0.000\n   perceptron's distance margin 0.106; bound (R/gamma)^2 = 144 >= 5 mistakes\nnoisy: perceptron 100 passes, 3380 mistakes, train 0.121, test 0.167\n   SSGD lambda=0.0: train 0.143, test 0.217\n   SSGD lambda=0.01: train 0.114, test 0.167",
  },
  "regression": {
    anchor: "cross-validation",
    title: "Apartment prices: features, ridge, and cross-validation",
    intro: "Predict prices from floor area with polynomial features and ridge, choosing the degree and lambda by hand-written 5-fold cross-validation.",
    steps: [
      { label: "Data and a locked test set", text: "Lesson 3 style apartment data; the test set is set aside first and used once at the end.", pages: ["linear-regression", "train-validation-test"] },
      { label: "Features inside the folds", text: "Standardize with each fold's training rows, then build powers of z with np.vander.", pages: ["feature-scaling", "polynomial-regression"] },
      { label: "Ridge with a free intercept", text: "Centre X and y so the intercept is not penalized, then solve the ridge system.", pages: ["ridge-regularization", "least-squares-normal-equation"] },
      { label: "Choose by cross-validation", text: "Score every (degree, lambda) on the same folds, then pick the simplest model within one standard error of the best.", pages: ["cross-validation", "model-complexity-generalization"] },
      { label: "Refit and test once", text: "Refit on all non-test data and report the test RMSE a single time.", pages: ["train-validation-test"] },
    ],
    code: py`# End-to-end: apartment prices with polynomial features, ridge, and hand-written cross-validation
import numpy as np
rng = np.random.default_rng(0)

# 1. Data (prices in thousands of SGD): a curved trend with +/- 10% noise, as in Lesson 3
n = 120
area = rng.uniform(40, 150, n)
price = (100 + 14.373 * area + 0.003 * area ** 3) * rng.uniform(0.9, 1.1, n)

# 2. Hold out a test set first and do not touch it until the end
idx = rng.permutation(n); test, rest = idx[:30], idx[30:]

def design(x, mu, sd, K):
    z = (x - mu) / sd                                   # standardize with TRAINING statistics
    return np.vander(z, K + 1, increasing=True)[:, 1:]  # z, z^2, ..., z^K (the intercept is handled apart)

def fit_ridge(X, y, lam):
    xm, ym = X.mean(axis=0), y.mean()                   # centre, so the intercept is not penalized
    w = np.linalg.solve((X - xm).T @ (X - xm) + len(y) * lam * np.eye(X.shape[1]), (X - xm).T @ (y - ym))
    return ym - xm @ w, w

def cv_error(x, y, K, lam, folds):
    k = len(folds); errs = []
    for j in range(k):
        va = folds[j]; tr = np.concatenate([folds[i] for i in range(k) if i != j])
        mu, sd = x[tr].mean(), x[tr].std()             # scaler fitted inside each fold: no leakage
        b, w = fit_ridge(design(x[tr], mu, sd, K), y[tr], lam)
        errs.append(np.mean((y[va] - b - design(x[va], mu, sd, K) @ w) ** 2))
    return np.sqrt(np.mean(errs)), np.std(np.sqrt(errs)) / np.sqrt(k)   # RMSE and its standard error

# 3. Plain linear regression first (degree 1, no penalty) as a baseline
x, y = area[rest], price[rest]
folds = np.array_split(rng.permutation(len(y)), 5)       # the SAME folds for every model, so comparisons are fair
print("degree 1, no penalty: CV RMSE %.0f thousand SGD" % cv_error(x, y, 1, 0.0, folds)[0])

# 4. Search degree and lambda together by 5-fold CV (RMSE, thousands of SGD)
results = {(K, lam): cv_error(x, y, K, lam, folds) for K in [1, 2, 3, 6, 10] for lam in [0.0, 1e-4, 1e-2, 1.0]}
for K in [1, 2, 3, 6, 10]:
    print(f"degree {K:2d}:", "  ".join(f"lam={lam:g}: {results[(K, lam)][0]:5.0f}" for lam in [0.0, 1e-4, 1e-2, 1.0]))
best = min(results, key=lambda key: results[key][0])
# one-standard-error rule: the simplest model whose CV error is within one standard error of the best
limit = results[best][0] + results[best][1]
simple = min((key for key in results if results[key][0] <= limit), key=lambda key: (key[0], -key[1]))
print("lowest CV:", best, " chosen by the one-standard-error rule:", simple)

# 5. Refit the chosen model on all non-test data and report the test error once
K, lam = simple
mu, sd = x.mean(), x.std()
b, w = fit_ridge(design(x, mu, sd, K), y, lam)
test_mse = np.mean((price[test] - b - design(area[test], mu, sd, K) @ w) ** 2)
print(f"test RMSE {np.sqrt(test_mse):.0f} thousand SGD (reported once)")
print(f"predicted price of a 100 sqm apartment: {(b + design(np.array([100.0]), mu, sd, K) @ w)[0]:.0f} thousand SGD")`,
    expected: "degree 1, no penalty: CV RMSE 906 thousand SGD\ndegree  1: lam=0:   906  lam=0.0001:   906  lam=0.01:   906  lam=1:  1911\ndegree  2: lam=0:   436  lam=0.0001:   436  lam=0.01:   438  lam=1:  1876\ndegree  3: lam=0:   426  lam=0.0001:   426  lam=0.01:   431  lam=1:  1359\ndegree  6: lam=0:   434  lam=0.0001:   434  lam=0.01:   443  lam=1:  1261\ndegree 10: lam=0:   448  lam=0.0001:   440  lam=0.01:   441  lam=1:  1235\nlowest CV: (3, 0.0001)  chosen by the one-standard-error rule: (2, 0.01)\ntest RMSE 341 thousand SGD (reported once)\npredicted price of a 100 sqm apartment: 4615 thousand SGD",
  },
  "logistic": {
    anchor: "roc-auc",
    title: "Logistic regression by hand, evaluated like Lesson 4",
    intro: "Train logistic regression with gradient descent, evaluate it with the confusion matrix and AUC, check it against scikit-learn, and extend it to three classes.",
    steps: [
      { label: "Scale, then add the column of ones", text: "Split first, standardize with training statistics, and build the design matrix.", pages: ["feature-scaling", "logistic-loss"] },
      { label: "Train with a safe loss", text: "Batch gradient descent on the logistic loss (written with logaddexp) plus a small L2 penalty, stopping when the loss settles.", pages: ["logistic-loss", "gradient-descent-method"] },
      { label: "Evaluate on the test set", text: "Confusion matrix, accuracy, error rate, precision, recall, specificity, F1, and AUC by counting pairs.", pages: ["classification-metrics", "roc-auc"] },
      { label: "Match scikit-learn", text: "With C = 1/(n lambda), scikit-learn's LogisticRegression gives the same weights.", pages: ["logistic-loss"] },
      { label: "Three classes", text: "One-vs-rest: three yes/no models, argmax of the probabilities, and a 3 by 3 confusion matrix.", pages: ["logistic-regression"] },
    ],
    code: py`# End-to-end: logistic regression by hand, evaluated like Lesson 4, compared with scikit-learn
import numpy as np
rng = np.random.default_rng(0)

# 1. Data: two overlapping clouds; the second feature is on a much larger scale
X = np.r_[rng.normal([0, 0], [1, 100], (150, 2)), rng.normal([1.5, 150], [1, 100], (150, 2))]
y = np.r_[np.zeros(150), np.ones(150)]
idx = rng.permutation(300); tr, te = idx[:210], idx[210:]

# 2. Standardize with training statistics, add the column of ones
mu, sd = X[tr].mean(axis=0), X[tr].std(axis=0)
Xb = lambda rows: np.c_[np.ones(len(rows)), (X[rows] - mu) / sd]
sigmoid = lambda s: 1 / (1 + np.exp(-np.clip(s, -500, 500)))
def loss(theta, A, t, lam):
    s = A @ theta
    return np.mean(np.where(t == 1, np.logaddexp(0, -s), np.logaddexp(0, s))) + lam / 2 * theta[1:] @ theta[1:]

# 3. Batch gradient descent with a small L2 penalty and a stopping rule
def train(A, t, lam=0.01, alpha=0.5, tol=1e-9):
    theta = np.zeros(A.shape[1]); old = loss(theta, A, t, lam)
    for k in range(50_000):
        grad = A.T @ (sigmoid(A @ theta) - t) / len(t)
        grad[1:] += lam * theta[1:]                     # no penalty on theta_0
        theta -= alpha * grad
        new = loss(theta, A, t, lam)
        if abs(old - new) < tol:
            break
        old = new
    return theta, k, new

theta, steps, final = train(Xb(tr), y[tr])
print(f"trained in {steps} steps, training loss {final:.4f}, theta {theta.round(3)}")

# 4. Evaluate on the test set: confusion matrix, metrics, AUC
p = sigmoid(Xb(te) @ theta); yt = y[te]; yh = (p >= 0.5).astype(int)
TP = np.sum((yt == 1) & (yh == 1)); FP = np.sum((yt == 0) & (yh == 1))
TN = np.sum((yt == 0) & (yh == 0)); FN = np.sum((yt == 1) & (yh == 0))
acc = (TP + TN) / len(yt); prec = TP / (TP + FP); rec = TP / (TP + FN)
print(f"test [[TN, FP], [FN, TP]] = [[{TN}, {FP}], [{FN}, {TP}]]")
print(f"accuracy {acc:.3f}, error {1 - acc:.3f}, precision {prec:.3f}, recall {rec:.3f}, specificity {TN / (TN + FP):.3f}, F1 {2 * prec * rec / (prec + rec):.3f}")
pos, neg = p[yt == 1], p[yt == 0]
print(f"AUC {np.mean((pos[:, None] > neg[None, :]) + 0.5 * (pos[:, None] == neg[None, :])):.3f}")

# 5. The same model in scikit-learn: C = 1/(n lambda) gives the same penalty
from sklearn.linear_model import LogisticRegression
sk = LogisticRegression(C=1 / (len(tr) * 0.01)).fit((X[tr] - mu) / sd, y[tr])
print("scikit-learn theta", np.r_[sk.intercept_, sk.coef_[0]].round(3))

# 6. Three classes by one-vs-rest
X3 = np.r_[rng.normal([0, 0], 1, (80, 2)), rng.normal([3, 0], 1, (80, 2)), rng.normal([0, 3], 1, (80, 2))]
y3 = np.repeat(np.arange(3), 80); i3 = rng.permutation(240); tr3, te3 = i3[:180], i3[180:]
A3 = lambda rows: np.c_[np.ones(len(rows)), X3[rows]]
thetas = [train(A3(tr3), (y3[tr3] == k).astype(float))[0] for k in range(3)]
P = np.column_stack([sigmoid(A3(te3) @ t) for t in thetas])
C = np.zeros((3, 3), dtype=int)
for a, b in zip(y3[te3], P.argmax(axis=1)):
    C[a, b] += 1
print("one-vs-rest test confusion matrix\n", C, "\naccuracy", round(np.trace(C) / C.sum(), 3), " (a row of P sums to", P[0].sum().round(2), ")")`,
    expected: "trained in 202 steps, training loss 0.3660, theta [-0.082  1.704  1.208]\ntest [[TN, FP], [FN, TP]] = [[35, 9], [4, 42]]\naccuracy 0.856, error 0.144, precision 0.824, recall 0.913, specificity 0.795, F1 0.866\nAUC 0.944\nscikit-learn theta [-0.082  1.705  1.208]\none-vs-rest test confusion matrix\n [[16  1  2]\n [ 2 19  0]\n [ 2  0 18]] \naccuracy 0.883  (a row of P sums to 1.19 )",
  },
  "optimization": {
    anchor: "lagrange-multipliers",
    title: "One model, every optimizer",
    intro: "Fit the same least-squares model with gradient descent, momentum, and stochastic gradients, then add a constraint and solve it exactly.",
    steps: [
      { label: "Read the curvature", text: "The Hessian's eigenvalues give L, mu, the condition number, and a convexity check.", pages: ["taylor-hessian", "convex-functions"] },
      { label: "Gradient descent", text: "A step above 2/L diverges (and is reported); 1/L works; 2/(mu + L) is the best fixed step.", pages: ["gradient-descent-method"] },
      { label: "Momentum and scaling", text: "Classical heavy-ball settings cut the steps several-fold; rescaling the features rounds the valley instead.", pages: ["momentum", "feature-scaling"] },
      { label: "Stochastic gradients", text: "One example per step with a decreasing step size, keeping the best point.", pages: ["stochastic-subgradient-descent", "subgradients"] },
      { label: "Add a constraint", text: "w1 + w2 = 1, solved exactly from the Lagrange conditions as one linear system.", pages: ["lagrange-multipliers"] },
    ],
    code: py`# End-to-end: training the same least-squares model with every optimizer on the site
import numpy as np
rng = np.random.default_rng(0)

# 1. A regression problem with badly scaled features (so the loss is a narrow valley)
n = 200
X = np.c_[rng.normal(0, 1, n), rng.normal(0, 7, n)]
y = X @ np.array([2.0, -0.5]) + rng.normal(0, 0.5, n)
J = lambda w: np.mean((y - X @ w) ** 2) / 2
grad = lambda w: -X.T @ (y - X @ w) / n
H = X.T @ X / n                                          # the Hessian of J (constant for least squares)
lam = np.linalg.eigvalsh(H); mu, L = lam.min(), lam.max()
w_star = np.linalg.solve(H, X.T @ y / n)
print(f"Hessian eigenvalues {lam.round(2)}, condition number {L / mu:.0f}, convex: {mu > -1e-8}")

def run(step_fn, w0=np.zeros(2), max_steps=20_000, tol=1e-8):
    w, prev, g0 = w0.copy(), w0.copy(), np.linalg.norm(grad(w0))
    for k in range(max_steps):
        g = grad(w)
        if np.linalg.norm(g) < tol * g0:
            return w, k
        if np.linalg.norm(g) > 1e6 * g0:
            return w, "diverged"
        w, prev = step_fn(w, prev, g, k), w
    return w, "did not converge"

# 2. Gradient descent: too large, the edge, and the best fixed step
for name, a in [("1.05 x 2/L", 1.05 * 2 / L), ("1/L", 1 / L), ("best 2/(mu+L)", 2 / (mu + L))]:
    w, k = run(lambda w, prev, g, k, a=a: w - a * g)
    print(f"gradient descent, step {name}:", k if isinstance(k, str) else f"{k} steps")

# 3. Heavy-ball momentum with the classical tuning
gamma = 4 / (np.sqrt(L) + np.sqrt(mu)) ** 2
beta = ((np.sqrt(L / mu) - 1) / (np.sqrt(L / mu) + 1)) ** 2
w, k = run(lambda w, prev, g, k: w - gamma * g + beta * (w - prev))
print(f"momentum: {k} steps, error {np.linalg.norm(w - w_star):.1e}")

# 4. Standardizing the features instead: the valley becomes round
Xs = X / X.std(axis=0); Hs = Xs.T @ Xs / n
print(f"after scaling, condition number {np.linalg.cond(Hs):.2f}")

# 5. Stochastic gradient descent: one example per step, decreasing steps, best point kept
w, best = np.zeros(2), (J(np.zeros(2)), np.zeros(2))
for k in range(20_000):
    t = rng.integers(n)
    w -= 0.5 / (L * (1 + k / 100)) * (-(y[t] - X[t] @ w) * X[t])
    if k % 500 == 0 and J(w) < best[0]:
        best = (J(w), w.copy())
print(f"SGD: J = {best[0]:.4f} vs optimum {J(w_star):.4f}")

# 6. A constraint: require w1 + w2 = 1, solved exactly from the Lagrange conditions
C, d = np.array([[1.0, 1.0]]), np.array([1.0])
K = np.block([[H, C.T], [C, np.zeros((1, 1))]])
sol = np.linalg.solve(K, np.r_[X.T @ y / n, d])
print(f"constrained optimum w = {sol[:2].round(4)}, multiplier {sol[2]:.4f}, J = {J(sol[:2]):.4f}")`,
    expected: "Hessian eigenvalues [ 0.92 51.9 ], condition number 56, convex: True\ngradient descent, step 1.05 x 2/L: diverged\ngradient descent, step 1/L: 882 steps\ngradient descent, step best 2/(mu+L): 520 steps\nmomentum: 88 steps, error 5.3e-09\nafter scaling, condition number 1.14\nSGD: J = 0.1242 vs optimum 0.1240\nconstrained optimum w = [ 1.5096 -0.5096], multiplier 0.4779, J = 0.2525",
  },
  "linalg": {
    anchor: "invertible-transformations",
    title: "A linear-algebra toolkit from one elimination routine",
    intro: "Build RREF with pivoting and a tolerance, and use it to solve systems, find rank and null spaces, change bases, and compute determinants and inverses.",
    steps: [
      { label: "RREF with pivoting", text: "Partial pivoting and a relative zero tolerance; free columns are skipped.", pages: ["gaussian-elimination"] },
      { label: "Classify and solve", text: "No solution, one, or infinitely many: a particular solution plus a null-space basis.", pages: ["solution-structure", "matrix-systems"] },
      { label: "Rank and independence", text: "Rank + nullity = number of columns, and the independence test.", pages: ["rank-nullity", "linear-independence"] },
      { label: "Change of basis", text: "Coordinates in one basis converted to another with a solve, not an inverse.", pages: ["change-of-basis"] },
      { label: "Determinant, inverse, singularity", text: "Determinant by row reduction, Gauss-Jordan inverse with a residual check, and the condition number as the singularity test.", pages: ["determinants-cofactor-row-ops", "invertible-transformations"] },
    ],
    code: py`# End-to-end: a small linear-algebra toolkit built on one elimination routine
import numpy as np

def rref(M, tol=None):
    A = np.array(M, dtype=float); m, n = A.shape
    if tol is None:
        tol = max(m, n) * np.finfo(float).eps * max(np.abs(A).max(), 1e-300)
    row, piv = 0, []
    for c in range(n):
        if row == m:
            break
        p = row + np.argmax(np.abs(A[row:, c]))          # partial pivoting
        if abs(A[p, c]) <= tol:
            continue                                     # free column
        A[[row, p]] = A[[p, row]]; A[row] /= A[row, c]
        for r in range(m):
            if r != row:
                A[r] -= A[r, c] * A[row]
        piv.append(c); row += 1
    A[np.abs(A) <= tol] = 0.0
    return A, piv

def solve_general(A, b):
    """Classify Ax = b and return a particular solution and a null-space basis."""
    A = np.array(A, dtype=float); n = A.shape[1]
    R, piv = rref(np.c_[A, b])
    if n in piv:
        return "no solution", None, None
    free = [j for j in range(n) if j not in piv]
    xp = np.zeros(n); xp[piv] = R[:len(piv), n]
    null = []
    for f in free:
        v = np.zeros(n); v[f] = 1; v[piv] = -R[:len(piv), f]; null.append(v)
    return ("one solution" if not free else "infinitely many"), xp, null

def det(M):
    R = np.array(M, dtype=float); n = len(R); sign = 1.0
    for c in range(n):
        p = c + np.argmax(np.abs(R[c:, c]))
        if abs(R[p, c]) <= n * np.finfo(float).eps * np.abs(R).max():
            return 0.0
        if p != c:
            R[[c, p]] = R[[p, c]]; sign = -sign
        R[c + 1:] -= np.outer(R[c + 1:, c] / R[c, c], R[c])
    return sign * np.prod(np.diag(R))

def inverse(M):
    n = len(M); R, piv = rref(np.c_[M, np.eye(n)])
    if piv[:n] != list(range(n)):
        raise ValueError("singular")
    return R[:, n:]

# 1. Three systems: one, none, infinitely many solutions
for A, b in [([[2, 1, -1], [-3, -1, 2], [-2, 1, 2]], [8, -11, -3]),
             ([[1, 2], [2, 4]], [3, 7]),
             ([[1, 2, -1], [2, 4, -2]], [3, 6])]:
    kind, xp, null = solve_general(A, b)
    print(kind, "" if xp is None else f"x_p = {xp.round(3)}, null space {[v.round(3).tolist() for v in null]}")

# 2. Rank, nullity, independence
V = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]], dtype=float).T   # columns are the vectors
R, piv = rref(V)
print(f"rank {len(piv)} + nullity {V.shape[1] - len(piv)} = {V.shape[1]} columns; independent: {len(piv) == V.shape[1]}")

# 3. Change of basis between two bases B and C
B = np.array([[1.0, 1.0], [0.0, 1.0]]); C = np.array([[2.0, 0.0], [1.0, 1.0]])
vB = np.array([2.0, 1.0]); vC = np.linalg.solve(C, B @ vB)
print(f"B-coordinates {vB} are C-coordinates {vC}; same vector: {np.allclose(B @ vB, C @ vC)}")

# 4. Determinant and inverse, each checked two ways
A = np.array([[3, 2, 2], [2, 3, 2], [2, 2, 3]], dtype=float)
Ainv = inverse(A)
print(f"det {det(A):.4f} (numpy {np.linalg.det(A):.4f}); max |A A^-1 - I| = {np.abs(A @ Ainv - np.eye(3)).max():.1e}")

# 5. Numerically singular? Ask the condition number, not the determinant
for name, M in [("0.1 I", 0.1 * np.eye(8)), ("[[1..9]]", [[1, 2, 3], [4, 5, 6], [7, 8, 9]])]:
    print(f"{name}: det {det(M):.1e}, cond {np.linalg.cond(M):.1e} -> {'singular' if np.linalg.cond(M) > 1e15 else 'invertible'}")`,
    expected: "one solution x_p = [ 2.  3. -1.], null space []\nno solution \ninfinitely many x_p = [3. 0. 0.], null space [[-2.0, 1.0, 0.0], [1.0, 0.0, 1.0]]\nrank 2 + nullity 1 = 3 columns; independent: False\nB-coordinates [2. 1.] are C-coordinates [ 1.5 -0.5]; same vector: True\ndet 7.0000 (numpy 7.0000); max |A A^-1 - I| = 4.4e-16\n0.1 I: det 1.0e-08, cond 1.0e+00 -> invertible\n[[1..9]]: det 0.0e+00, cond 5.1e+16 -> singular",
  },
  "eigen": {
    anchor: "pca",
    title: "From eigenvectors to PCA",
    intro: "Find the main directions of a 5-dimensional dataset by power iteration, eigh, and the SVD, choose how many to keep, and match scikit-learn.",
    steps: [
      { label: "Covariance and power iteration", text: "Centre the data, form the covariance, and find its top eigenvector by power iteration.", pages: ["eigenvalues-eigenvectors", "covariance-gaussian"] },
      { label: "How many components", text: "Sort the eigenvalues and keep enough for 95% of the variance.", pages: ["pca"] },
      { label: "Project and reconstruct", text: "Reconstruction error equals the sum of the dropped eigenvalues.", pages: ["orthogonal-projections", "dimensionality-reduction"] },
      { label: "The same by SVD", text: "Squared singular values of the centred data, divided by N - 1, are the eigenvalues.", pages: ["svd"] },
      { label: "Match scikit-learn", text: "Fix each component's sign, then variances, directions, and reconstructions all agree.", pages: ["pca"] },
    ],
    code: py`# End-to-end: eigenvectors, SVD, and PCA on a small dataset, each checked against numpy
import numpy as np
rng = np.random.default_rng(0)

# 1. Data: 300 points in 5 dimensions that really vary along about 2 directions
Z = rng.normal(size=(300, 2)) * [3.0, 1.5]
W = np.linalg.qr(rng.normal(size=(5, 2)))[0]            # two orthonormal directions in R^5
X = Z @ W.T + 0.2 * rng.normal(size=(300, 5)) + [10, -5, 0, 2, 7]

# 2. Centre, covariance (N - 1 to match scikit-learn), and its top eigenvector by power iteration
mu = X.mean(axis=0); Xc = X - mu
S = Xc.T @ Xc / (len(X) - 1)
v = rng.normal(size=5); v /= np.linalg.norm(v)
for k in range(1000):
    v = S @ v; v /= np.linalg.norm(v)
    lam = v @ S @ v
    if np.linalg.norm(S @ v - lam * v) < 1e-10:
        break
vals, vecs = np.linalg.eigh(S); vals, vecs = vals[::-1], vecs[:, ::-1]   # eigh sorts ascending
print(f"power iteration: lambda_1 = {lam:.4f} in {k} steps; eigh: {vals[0]:.4f}; same direction up to sign: {np.isclose(abs(v @ vecs[:, 0]), 1)}")

# 3. How many components? Cumulative explained variance
ratio = np.cumsum(vals) / vals.sum()
M = int(np.argmax(ratio >= 0.95)) + 1
print("eigenvalues", vals.round(3), " cumulative", ratio.round(3), " -> keep M =", M)

# 4. Project and reconstruct (mean added back); error = sum of dropped eigenvalues
B = vecs[:, :M]
X_rec = mu + (Xc @ B) @ B.T
err = np.sum((X - X_rec) ** 2) / (len(X) - 1)
print(f"reconstruction error {err:.4f} = dropped eigenvalues {vals[M:].sum():.4f}")

# 5. The same through the SVD of the centred data: singular values^2/(N - 1) are the eigenvalues
U_, s, Vt = np.linalg.svd(Xc, full_matrices=False)
print("from the SVD:", (s ** 2 / (len(X) - 1)).round(3))

# 6. Compare with scikit-learn, fixing signs component by component
from sklearn.decomposition import PCA
pca = PCA(n_components=M).fit(X)
signs = np.sign(np.sum(pca.components_ * B.T, axis=1))
print("scikit-learn matches: variances", np.allclose(pca.explained_variance_, vals[:M]),
      " directions", np.allclose(pca.components_, signs[:, None] * B.T),
      " reconstructions", np.allclose(pca.inverse_transform(pca.transform(X)), X_rec))`,
    expected: "power iteration: lambda_1 = 9.1911 in 17 steps; eigh: 9.1911; same direction up to sign: True\neigenvalues [9.191 2.295 0.042 0.04  0.035]  cumulative [0.792 0.99  0.994 0.997 1.   ]  -> keep M = 2\nreconstruction error 0.1168 = dropped eigenvalues 0.1168\nfrom the SVD: [9.191 2.295 0.042 0.04  0.035]\nscikit-learn matches: variances True  directions True  reconstructions True",
  },
  "calculus": {
    anchor: "backpropagation",
    title: "Derive, check, and train a neural network",
    intro: "Write the forward and backward passes of a small network, check every gradient numerically, train it on curved data, and look at the curvature at the end.",
    steps: [
      { label: "Curved data", text: "Two interleaved half-moons that no straight line separates.", pages: ["feature-representation"] },
      { label: "Forward and backward", text: "tanh hidden units and a sigmoid output with cross-entropy; the chain rule layer by layer.", pages: ["backpropagation", "jacobian-chain-rule", "derivatives"] },
      { label: "Check every gradient", text: "Central differences for every parameter entry, reported as a relative error.", pages: ["loss-gradients"] },
      { label: "Train and watch the loss", text: "Gradient descent until the training accuracy reaches 100%.", pages: ["gradient-descent-method"] },
      { label: "Curvature at the end", text: "A second derivative confirms a minimum along one parameter.", pages: ["taylor-hessian"] },
    ],
    code: py`# End-to-end: derive, check, and train a small neural network on a curved dataset
import numpy as np
rng = np.random.default_rng(0)

# 1. Data: two interleaved half-moons, not separable by a line
t = rng.uniform(0, np.pi, 200)
X = np.r_[np.c_[np.cos(t[:100]), np.sin(t[:100])], np.c_[1 - np.cos(t[100:]), 0.5 - np.sin(t[100:])]]
X += 0.1 * rng.normal(size=X.shape)
y = np.r_[np.zeros(100), np.ones(100)].reshape(-1, 1)

# 2. A network 2 -> 8 tanh -> 1 sigmoid, small random initial weights
H = 8
params = {"W1": rng.normal(0, 1, (2, H)), "b1": np.zeros(H), "W2": rng.normal(0, 1, (H, 1)), "b2": np.zeros(1)}
sig = lambda s: 1 / (1 + np.exp(-s))

def forward(p):
    A1 = np.tanh(X @ p["W1"] + p["b1"])
    P = np.clip(sig(A1 @ p["W2"] + p["b2"]), 1e-12, 1 - 1e-12)
    return A1, P, -np.mean(y * np.log(P) + (1 - y) * np.log(1 - P))

def backward(p, A1, P):
    dZ2 = (P - y) / len(X)                        # sigmoid + cross-entropy
    dZ1 = (dZ2 @ p["W2"].T) * (1 - A1 ** 2)       # tanh' = 1 - tanh^2
    return {"W1": X.T @ dZ1, "b1": dZ1.sum(0), "W2": A1.T @ dZ2, "b2": dZ2.sum(0)}

# 3. Gradient check: every parameter entry against a central difference
A1, P, _ = forward(params); g = backward(params, A1, P)
worst = 0.0
for name, arr in params.items():
    for i in np.ndindex(arr.shape):
        old = arr[i]
        arr[i] = old + 1e-5; up = forward(params)[2]
        arr[i] = old - 1e-5; down = forward(params)[2]
        arr[i] = old
        num = (up - down) / 2e-5
        worst = max(worst, abs(num - g[name][i]) / max(abs(num), abs(g[name][i]), 1e-12))
print(f"gradient check: worst relative error {worst:.1e}")

# 4. Train by gradient descent and watch the loss
for epoch in range(3001):
    A1, P, loss = forward(params)
    g = backward(params, A1, P)
    for name in params:
        params[name] -= 1.0 * g[name]
    if epoch % 1000 == 0:
        print(f"epoch {epoch}: loss {loss:.4f}, training accuracy {np.mean((P > 0.5) == y):.3f}")

# 5. Curvature at the end: the Hessian of the loss with respect to the output bias
def loss_b2(b):
    q = dict(params); q["b2"] = np.array([b]); return forward(q)[2]
b = params["b2"][0]; h = 1e-4
second = (loss_b2(b + h) - 2 * loss_b2(b) + loss_b2(b - h)) / h ** 2
print(f"d loss / d b2 = {g['b2'][0]:.1e} (near 0), second derivative {second:.4f} > 0: a minimum along b2")`,
    expected: "gradient check: worst relative error 4.9e-09\nepoch 0: loss 1.0750, training accuracy 0.755\nepoch 1000: loss 0.0085, training accuracy 1.000\nepoch 2000: loss 0.0042, training accuracy 1.000\nepoch 3000: loss 0.0027, training accuracy 1.000\nd loss / d b2 = 2.0e-05 (near 0), second derivative 0.0025 > 0: a minimum along b2",
  },
  "probability": {
    anchor: "likelihood-mle",
    title: "From probabilities to a fitted classifier",
    intro: "Check Bayes' rule and the behaviour of averages by simulation, sample Gaussian classes, and fit logistic regression by maximum likelihood, comparing with theory.",
    steps: [
      { label: "Bayes' rule", text: "A screening test, by formula and by simulating 200,000 people.", pages: ["probability-basics"] },
      { label: "Averages and n - 1", text: "The sample mean's variance falls like sigma^2/n, and dividing by n - 1 removes the bias.", pages: ["expectation-variance"] },
      { label: "Gaussian classes", text: "Two classes sampled with a chosen covariance through Cholesky.", pages: ["covariance-gaussian", "cholesky-decomposition"] },
      { label: "Maximum likelihood", text: "Gradient ascent on the average log-likelihood gives logistic regression; with shared-covariance Gaussians the true weights are Sigma^-1 (mu_1 - mu_0).", pages: ["likelihood-mle", "logistic-loss"] },
      { label: "AUC in theory and practice", text: "The empirical AUC matches the binormal formula Phi(d / sqrt 2).", pages: ["roc-auc", "covariance-gaussian"] },
    ],
    code: py`# End-to-end: from probabilities to a fitted classifier, every step checked by simulation
import numpy as np
from math import erf, sqrt
rng = np.random.default_rng(0)
Phi = lambda v: 0.5 * (1 + erf(v / sqrt(2)))

# 1. Bayes' rule: a screening test, by formula and by simulating 200,000 people
prev, sens, fpr = 0.02, 0.95, 0.03
p_pos = sens * prev + fpr * (1 - prev)                  # law of total probability
sick = rng.random(200_000) < prev
pos = np.where(sick, rng.random(sick.size) < sens, rng.random(sick.size) < fpr)
print(f"P(sick | positive): formula {sens * prev / p_pos:.3f}, simulation {sick[pos].mean():.3f}")

# 2. Averages: the variance of a sample mean falls like sigma^2 / n; 1/n vs 1/(n-1)
for n in [4, 16, 64]:
    means = rng.normal(0, 2, (20_000, n)).mean(axis=1)
    print(f"n = {n:2d}: Var(mean) {means.var():.4f}, sigma^2/n = {4 / n:.4f}")
small = rng.normal(0, 2, (100_000, 5))
print(f"n = 5 variance estimates, true 4: divide by n -> {small.var(axis=1).mean():.2f}, by n - 1 -> {small.var(axis=1, ddof=1).mean():.2f}")

# 3. Two features from a 2D Gaussian with a chosen covariance (Cholesky)
Sigma = np.array([[1.0, 0.6], [0.6, 2.0]])
L = np.linalg.cholesky(Sigma)
pos_x = rng.standard_normal((2000, 2)) @ L.T + [1.0, 1.0]     # class 1
neg_x = rng.standard_normal((2000, 2)) @ L.T + [-1.0, -1.0]   # class 0
print("sample covariance of class 1:", np.cov(pos_x.T).round(2).tolist())

# 4. Maximum likelihood: the class prior, and each class's Gaussian mean
X = np.r_[pos_x, neg_x]; y = np.r_[np.ones(2000), np.zeros(2000)]
print(f"MLE of P(y = 1): {y.mean():.2f};  class means {pos_x.mean(axis=0).round(2)}, {neg_x.mean(axis=0).round(2)}")

# 5. Logistic regression is maximum likelihood: gradient ascent on the average log-likelihood
Xb = np.c_[np.ones(len(y)), X]
w = np.zeros(3)
for k in range(5000):
    p = 1 / (1 + np.exp(-(Xb @ w)))
    g = Xb.T @ (y - p) / len(y)                         # gradient of the average log-likelihood
    if np.linalg.norm(g) < 1e-8:
        break
    w += 1.0 * g
s = Xb @ w
avg_ll = np.mean(-np.logaddexp(0, -(2 * y - 1) * s))    # labels mapped to -1/+1 for logaddexp
print(f"fitted w = {w.round(3)} after {k} steps; average log-likelihood {avg_ll:.4f}")
# For two Gaussians with a shared covariance, the true log-odds are linear with these weights:
Si = np.linalg.inv(Sigma)
w_true = Si @ (np.array([1.0, 1.0]) - np.array([-1.0, -1.0]))
print(f"theory: weights {w_true.round(3)}, intercept 0 (equal priors, symmetric means)")

# 6. AUC of the score, by ranks and by the binormal formula
sp, sn = s[y == 1], s[y == 0]
auc = np.mean(sp[:, None] > sn[None, :])
d = (w_true @ (np.array([1.0, 1.0]) - np.array([-1.0, -1.0]))) / np.sqrt(w_true @ Sigma @ w_true)
print(f"AUC: empirical {auc:.3f}, binormal formula Phi(d / sqrt 2) = {Phi(d / sqrt(2)):.3f}")`,
    expected: "P(sick | positive): formula 0.393, simulation 0.387\nn =  4: Var(mean) 0.9943, sigma^2/n = 1.0000\nn = 16: Var(mean) 0.2502, sigma^2/n = 0.2500\nn = 64: Var(mean) 0.0630, sigma^2/n = 0.0625\nn = 5 variance estimates, true 4: divide by n -> 3.20, by n - 1 -> 3.99\nsample covariance of class 1: [[1.1, 0.69], [0.69, 2.04]]\nMLE of P(y = 1): 0.50;  class means [1.01 1.03], [-1.04 -1.03]\nfitted w = [0.055 1.627 0.504] after 236 steps; average log-likelihood -0.3366\ntheory: weights [1.707 0.488], intercept 0 (equal priors, symmetric means)\nAUC: empirical 0.930, binormal formula Phi(d / sqrt 2) = 0.931",
  },
  "production": {
    anchor: "ml-in-production",
    title: "A churn model from raw table to monitored deployment",
    intro: "Build a leakage-free pipeline, pick a cost-based threshold, version the model, and run it through eight months of drift with alarms and guarded retraining.",
    steps: [
      { label: "Leakage-free pipeline", text: "One-hot encoding and scaling inside a scikit-learn Pipeline, fitted on training rows only.", pages: ["feature-representation", "feature-scaling"] },
      { label: "Baseline, metrics, threshold", text: "Compare with always predicting no churn, then choose the threshold that minimizes 5 FN + FP on validation data.", pages: ["classification-metrics", "roc-auc"] },
      { label: "Version the model", text: "Save the model with a JSON record of version, time, threshold, AUC, and reason.", pages: ["ml-in-production"] },
      { label: "Monitor drift", text: "PSI on an input, with the alarm level set from no-drift noise, plus AUC on labelled data.", pages: ["ml-in-production"] },
      { label: "Retrain with a guard", text: "On an alarm, train a fresh copy and promote it only if it beats the live model on the same new data. Input drift alone does not justify a new model here; the concept change in month 6 does.", pages: ["ml-in-production"] },
    ],
    code: py`# End-to-end: a churn model from raw table to monitored deployment
import numpy as np, json, os, pickle, tempfile, time
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.base import clone
rng = np.random.default_rng(0)

# 1. Raw data: numeric and categorical columns; churn depends on tenure, spend, and plan
def make_month(n, spend_shift=0.0, flip_tenure=False):
    tenure = rng.exponential(24, n); spend = rng.normal(60 + spend_shift, 20, n)
    plan = rng.choice(["basic", "standard", "premium"], n, p=[0.5, 0.3, 0.2])
    score = -1.0 + (0.04 if flip_tenure else -0.04) * tenure + 0.02 * (spend - 60) + (plan == "basic") * 0.8
    churn = (rng.random(n) < 1 / (1 + np.exp(-score))).astype(int)
    X = np.empty((n, 3), dtype=object); X[:, 0], X[:, 1], X[:, 2] = tenure, spend, plan
    return X, churn

X, y = make_month(3000)
idx = rng.permutation(3000); tr, va, te = idx[:1800], idx[1800:2400], idx[2400:]

# 2. A leakage-free pipeline: preprocessing is fitted inside .fit on training rows only
pre = ColumnTransformer([("num", StandardScaler(), [0, 1]), ("cat", OneHotEncoder(handle_unknown="ignore"), [2])])
model = Pipeline([("pre", pre), ("clf", LogisticRegression())]).fit(X[tr], y[tr])

# 3. Baseline, metrics, and a threshold chosen from costs on the validation set
C_FN, C_FP = 5, 1
cost = lambda yt, p, t: C_FN * np.sum((yt == 1) & (p < t)) + C_FP * np.sum((yt == 0) & (p >= t))
p_va = model.predict_proba(X[va])[:, 1]
ts = np.linspace(0.02, 0.9, 89)
t_star = ts[np.argmin([cost(y[va], p_va, t) for t in ts])]
p_te = model.predict_proba(X[te])[:, 1]
yh = (p_te >= t_star).astype(int); yt = y[te]
TP, FP = np.sum((yt == 1) & (yh == 1)), np.sum((yt == 0) & (yh == 1))
TN, FN = np.sum((yt == 0) & (yh == 0)), np.sum((yt == 1) & (yh == 0))
print(f"baseline (predict no churn): accuracy {np.mean(yt == 0):.3f}, cost {cost(yt, np.zeros(len(yt)), 0.5)}")
print(f"model at t* = {t_star:.2f} (formula C_FP/(C_FP+C_FN) = {C_FP / (C_FP + C_FN):.2f}): "
      f"recall {TP / (TP + FN):.3f}, precision {TP / (TP + FP):.3f}, specificity {TN / (TN + FP):.3f}, "
      f"AUC {roc_auc_score(yt, p_te):.3f}, cost {cost(yt, p_te, t_star)}")

# 4. Version the model with its metadata
registry = tempfile.mkdtemp()
def save(model, t, version, reason, auc):
    with open(os.path.join(registry, f"model_v{version:03d}.pkl"), "wb") as fh:
        pickle.dump((model, t), fh)
    with open(os.path.join(registry, f"model_v{version:03d}.json"), "w") as fh:
        json.dump({"version": version, "time": time.strftime("%Y-%m-%d %H:%M"), "threshold": round(float(t), 3), "auc": round(float(auc), 3), "reason": reason}, fh)
save(model, t_star, 1, "initial", roc_auc_score(yt, p_te))

# 5. Deployment: monthly drift checks (PSI on spend) and performance on labelled data
def psi(ref, live, bins=10):
    edges = np.quantile(ref, np.linspace(0, 1, bins + 1)); edges[0], edges[-1] = -np.inf, np.inf
    p = np.clip(np.histogram(ref, edges)[0] / len(ref), 1e-6, None); q = np.clip(np.histogram(live, edges)[0] / len(live), 1e-6, None)
    return np.sum((q - p) * np.log(q / p))
ref_spend = X[tr][:, 1].astype(float)
noise = [psi(ref_spend[i[:900]], ref_spend[i[900:]]) for i in (rng.permutation(1800) for _ in range(200))]
psi_alarm = max(0.1, np.quantile(noise, 0.99))
ref_auc, version = roc_auc_score(yt, p_te), 1
for month in range(1, 9):
    Xm, ym = make_month(800, spend_shift=6 * month, flip_tenure=month >= 6)   # drift, then a concept change
    drift = psi(ref_spend, Xm[:, 1].astype(float))
    auc = roc_auc_score(ym, model.predict_proba(Xm)[:, 1])
    action = "-"
    if auc < ref_auc - 0.05 or drift > psi_alarm:
        cand = clone(model).fit(Xm[:500], ym[:500])     # clone: a fresh, unfitted copy (never refit the live model)
        old_auc = roc_auc_score(ym[500:], model.predict_proba(Xm[500:])[:, 1])
        new_auc = roc_auc_score(ym[500:], cand.predict_proba(Xm[500:])[:, 1])
        if new_auc > old_auc:                          # promote only if it wins on the same fresh data
            version += 1; model = cand; ref_auc = new_auc; ref_spend = Xm[:500, 1].astype(float)
            save(model, t_star, version, f"month {month}: PSI {drift:.2f}, AUC {auc:.3f}", new_auc)
            action = f"retrained -> v{version:03d} (AUC {old_auc:.3f} -> {new_auc:.3f})"
        else:
            action = "alarm, but the old model is still better"
    print(f"month {month}: spend PSI {drift:.3f} (alarm > {psi_alarm:.3f}), AUC {auc:.3f}  {action}")
print("registry:", sorted(f for f in os.listdir(registry) if f.endswith(".json")))`,
    expected: "baseline (predict no churn): accuracy 0.792, cost 625\nmodel at t* = 0.20 (formula C_FP/(C_FP+C_FN) = 0.17): recall 0.736, precision 0.300, specificity 0.547, AUC 0.716, cost 380\nmonth 1: spend PSI 0.089 (alarm > 0.100), AUC 0.707  -\nmonth 2: spend PSI 0.338 (alarm > 0.100), AUC 0.691  alarm, but the old model is still better\nmonth 3: spend PSI 0.691 (alarm > 0.100), AUC 0.700  alarm, but the old model is still better\nmonth 4: spend PSI 1.264 (alarm > 0.100), AUC 0.743  alarm, but the old model is still better\nmonth 5: spend PSI 2.745 (alarm > 0.100), AUC 0.746  alarm, but the old model is still better\nmonth 6: spend PSI 2.741 (alarm > 0.100), AUC 0.481  retrained -> v002 (AUC 0.444 -> 0.696)\nmonth 7: spend PSI 0.049 (alarm > 0.100), AUC 0.721  -\nmonth 8: spend PSI 0.216 (alarm > 0.100), AUC 0.714  alarm, but the old model is still better\nregistry: ['model_v001.json', 'model_v002.json']",
  },
  "diabetes": {
    anchor: "multicollinearity",
    title: "Who will get worse? Diabetes progression on real data",
    intro: "A student capstone on scikit-learn's diabetes data (442 patients, 10 correlated measurements): least squares, curvature, eigenvalues, ridge and the bootstrap, each explaining something the model does, ending in a screening flag checked on held-out patients.",
    steps: [
      { label: "Real data, locked test set", text: "442 patients in raw units; 111 are set aside first, and every scaler, lambda and threshold is chosen from the other 331.", pages: ["feature-scaling", "train-validation-test"] },
      { label: "Least squares and the dot product", text: "Solve the normal equation, check the residual is perpendicular to every column, and split one prediction into its feature terms.", pages: ["least-squares-normal-equation", "vectors-dot-product"] },
      { label: "Curvature forecasts gradient descent", text: "The Hessian's eigenvalues give kappa = 464 after standardizing (5e7 in raw units) and predict the number of steps: 6,408 forecast for step 1/L, 5,883 observed.", pages: ["gradient-descent-method", "taylor-hessian", "convex-functions"] },
      { label: "The hidden near-dependency", text: "The smallest eigenvalue, 0.0088, points at the cholesterol tests; their VIFs reach 58, so their weights are unstable.", pages: ["multicollinearity", "eigenvalues-eigenvectors"] },
      { label: "Ridge, cross-validation and the bootstrap", text: "Choose lambda by 5-fold CV with the one-standard-error rule; kappa falls to 10 and the bootstrap spread of the TC weight from 22.0 to 1.5.", pages: ["ridge-regularization", "cross-validation", "bootstrap", "bias-variance"] },
      { label: "Test once, then screen", text: "RMSE, MAE and R^2 on the test set, a paired bootstrap interval showing OLS and ridge tie, and a screening flag whose recall and precision are linked by Bayes' rule.", pages: ["classification-metrics", "probability-basics", "roc-auc"] },
    ],
    code: py`# End-to-end: who will get worse? One-year diabetes progression, with the maths doing the work
import numpy as np
from sklearn.datasets import load_diabetes

rng = np.random.default_rng(42)
names = ["age", "sex", "BMI", "BP", "TC", "LDL", "HDL", "TCH", "LTG", "GLU"]
rmse = lambda y, p: np.sqrt(np.mean((y - p) ** 2))
mae = lambda y, p: np.mean(np.abs(y - p))
r2 = lambda y, p: 1 - np.sum((y - p) ** 2) / np.sum((y - y.mean()) ** 2)

# 1. Real data in raw units; lock a test set first, standardize with training statistics only
X_all, y_all = load_diabetes(return_X_y=True, scaled=False)
perm = rng.permutation(len(y_all))
Xtr_raw, ytr = X_all[perm[111:]], y_all[perm[111:]]
Xte_raw, yte = X_all[perm[:111]], y_all[perm[:111]]
n, d = Xtr_raw.shape
mu, sd = Xtr_raw.mean(0), Xtr_raw.std(0)
Ztr, Zte = (Xtr_raw - mu) / sd, (Xte_raw - mu) / sd
Xtr, Xte = np.c_[np.ones(n), Ztr], np.c_[np.ones(len(yte)), Zte]
Xtr_rawd = np.c_[np.ones(n), Xtr_raw]
T_high = np.percentile(ytr, 75)                     # "high risk" = top quarter of training targets
print(f"n = {n} training and {len(yte)} test patients, d = {d}; high-risk cut-off T = {T_high:.1f}")

# 2. Least squares: solve the normal equation, check the projection, read one prediction term by term
A, b = Xtr.T @ Xtr / n, Xtr.T @ ytr / n
theta = np.linalg.solve(A, b)
res = ytr - Xtr @ theta
print(f"residual perpendicular to every column: max |X^T r|/n = {np.abs(Xtr.T @ res).max() / n:.1e}")
print(f"train RMSE {rmse(ytr, Xtr @ theta):.2f}, R^2 {r2(ytr, Xtr @ theta):.3f}")
k = int(np.argmax(Xte @ theta))
terms = theta[1:] * Zte[k]
top = np.argsort(-np.abs(terms))[:3]
print(f"patient {k}: {theta[0]:.1f} + {terms.sum():.1f} = {Xte[k] @ theta:.1f} (actual {yte[k]:.0f}); largest terms",
      ", ".join(f"{names[j]} {terms[j]:+.1f}" for j in top))

# 3. Curvature: the Hessian (1/n) X^T X predicts how gradient descent behaves
lam = np.linalg.eigvalsh(A)
L, m = lam.max(), lam.min()
H_raw = Xtr_rawd.T @ Xtr_rawd / n
lam_raw = np.linalg.eigvalsh(H_raw)
print(f"standardized: L = {L:.3f}, mu = {m:.4f}, kappa = {L / m:.0f}; raw units: kappa = {lam_raw.max() / lam_raw.min():.2e}")

def gd(X, alpha, target, start=None, steps=3000):
    th = np.zeros(X.shape[1]) if start is None else start.copy()
    for s in range(steps):
        th = th - alpha * X.T @ (X @ th - ytr) / n
        err = np.linalg.norm(th - target) / np.linalg.norm(target)
        if not np.isfinite(err) or err > 1e6:
            return th, "diverged"
        if err < 1e-6:
            return th, f"{s + 1} steps"
    return th, f"not converged, relative error {err:.1e}"

theta_raw = np.linalg.solve(H_raw, Xtr_rawd.T @ ytr / n)
rate = (L / m - 1) / (L / m + 1)
print(f"GD step 2/(mu+L): forecast {np.log(1e-6) / np.log(rate):.0f} steps, observed", gd(Xtr, 2 / (L + m), theta)[1])
print(f"GD step 1/L: forecast {np.log(1e-6) / np.log(1 - m / L):.0f} steps (rate 1 - mu/L), observed", gd(Xtr, 1 / L, theta, steps=8000)[1])
print("GD step 2.05/L:", gd(Xtr, 2.05 / L, theta)[1], "| raw units, step 1/L_raw:", gd(Xtr_rawd, 1 / lam_raw.max(), theta_raw)[1])
starts = [rng.normal(scale=200, size=d + 1) for _ in range(5)]
print(f"convex: 5 random starts end within {max(np.linalg.norm(gd(Xtr, 2 / (L + m), theta, s0)[0] - theta) for s0 in starts):.1e} of theta_hat")

# 4. Multicollinearity: the smallest eigenvalue and the variance inflation factors
S = Ztr.T @ Ztr / n                                 # correlation matrix of the features
ev, V = np.linalg.eigh(S)
v = V[:, 0]
print(f"smallest eigenvalue {ev[0]:.4f}; its eigenvector loads on",
      ", ".join(f"{names[j]} {v[j]:+.2f}" for j in np.argsort(-np.abs(v))[:4]))
print(f"eigen-expansion: noise along that direction is amplified 1/lambda_min = {1 / ev[0]:.0f} times, vs {1 / ev[-1]:.2f} along the top one")
vif = np.diag(np.linalg.inv(S))
print("VIF = 1/(1 - R_j^2):", ", ".join(f"{names[j]} {vif[j]:.0f}" for j in np.argsort(-vif)[:4]))

# 5. Ridge: choose lambda by 5-fold CV (one-standard-error rule), then measure the variance by bootstrap
def fit_ridge(Xraw, y, lam_):
    m_, s_ = Xraw.mean(0), Xraw.std(0)
    Z = (Xraw - m_) / s_
    w = np.linalg.solve(lam_ * np.eye(d) + Z.T @ Z / len(y), Z.T @ (y - y.mean()) / len(y))
    return (lambda Xn: y.mean() + ((Xn - m_) / s_) @ w), w

lams = np.logspace(-4, 1, 41)
folds = np.array_split(rng.permutation(n), 5)
cv, oof = np.zeros((41, 5)), {}
for i, lam_ in enumerate(lams):
    p = np.zeros(n)
    for f, vi in enumerate(folds):
        ti = np.setdiff1d(np.arange(n), vi)
        p[vi] = fit_ridge(Xtr_raw[ti], ytr[ti], lam_)[0](Xtr_raw[vi])   # scaler fitted inside the fold
        cv[i, f] = rmse(ytr[vi], p[vi])
    oof[i] = p
cv_mean, cv_se = cv.mean(1), cv.std(1, ddof=1) / np.sqrt(5)
best = int(np.argmin(cv_mean))
i_star = max(i for i in range(41) if cv_mean[i] <= cv_mean[best] + cv_se[best])
lam_star = lams[i_star]
print(f"lowest CV RMSE {cv_mean[best]:.2f} at lambda {lams[best]:.4f} (flat curve); one-SE rule: lambda* = {lam_star:.3f}")
print(f"ridge: smallest eigenvalue {ev[0]:.4f} -> {ev[0] + lam_star:.3f}, kappa {ev[-1] / ev[0]:.0f} -> {(ev[-1] + lam_star) / (ev[0] + lam_star):.0f}")
jt = [names.index("TC"), names.index("LDL")]
boot = {"OLS": [], "ridge": []}
for _ in range(500):
    bi = rng.integers(0, n, n)                       # resample patients with replacement
    for key, lam_ in (("OLS", 0.0), ("ridge", lam_star)):
        boot[key].append(fit_ridge(Xtr_raw[bi], ytr[bi], lam_)[1][jt])
for key in boot:
    print(f"bootstrap {key}: sd of the TC weight {np.std(np.array(boot[key])[:, 0]):.1f}, LDL weight {np.std(np.array(boot[key])[:, 1]):.1f}")
wins = []
for _ in range(200):                                 # with only 30 patients, variance dominates
    si = rng.permutation(n)
    e = [rmse(ytr[si[30:]], fit_ridge(Xtr_raw[si[:30]], ytr[si[:30]], l_)[0](Xtr_raw[si[30:]])) for l_ in (0.0, 0.1)]
    wins.append(e[1] < e[0])
print(f"30 training patients: ridge (lambda 0.1) beats OLS in {np.mean(wins):.0%} of 200 repeats")

# 6. The test set, used once: RMSE, MAE, R^2, a paired bootstrap interval, and a screening flag
p_ols = Xte @ theta
p_ridge = fit_ridge(Xtr_raw, ytr, lam_star)[0](Xte_raw)
for label, p in (("training mean", np.full(len(yte), ytr.mean())), ("OLS", p_ols), ("ridge", p_ridge)):
    print(f"  {label:13s} RMSE {rmse(yte, p):6.2f}  MAE {mae(yte, p):6.2f}  R^2 {r2(yte, p):6.3f}")
diffs = []
for _ in range(2000):
    bi = rng.integers(0, len(yte), len(yte))         # the same resampled patients for both models
    diffs.append(rmse(yte[bi], p_ols[bi]) - rmse(yte[bi], p_ridge[bi]))
print(f"RMSE(OLS) - RMSE(ridge) = {rmse(yte, p_ols) - rmse(yte, p_ridge):.2f}, 95% interval [{np.percentile(diffs, 2.5):.2f}, {np.percentile(diffs, 97.5):.2f}]: a tie")
p_oof, high_tr = oof[i_star], ytr > T_high
t_flag = max(t for t in p_oof if np.mean(p_oof[high_tr] >= t) >= 0.80)   # 80% recall on training data
high, flag = yte > T_high, p_ridge >= t_flag
TP, FP, FN = np.sum(flag & high), np.sum(flag & ~high), np.sum(~flag & high)
rec, prec = TP / (TP + FN), TP / (TP + FP)
print(f"flag at {t_flag:.1f}: recall P(flag|high) {rec:.2f}, precision P(high|flag) {prec:.2f}, "
      f"Bayes: recall * P(high) / P(flag) = {rec * high.mean() / flag.mean():.2f}")
pos, neg = p_ridge[high], p_ridge[~high]
print(f"AUC {np.mean(pos[:, None] > neg[None, :]) + 0.5 * np.mean(pos[:, None] == neg[None, :]):.3f}")`,
    expected: "n = 331 training and 111 test patients, d = 10; high-risk cut-off T = 206.0\nresidual perpendicular to every column: max |X^T r|/n = 6.2e-14\ntrain RMSE 52.48, R^2 0.545\npatient 68: 149.9 + 134.2 = 284.0 (actual 230); largest terms LTG +73.0, TC -44.5, BP +29.7\nstandardized: L = 4.070, mu = 0.0088, kappa = 464; raw units: kappa = 5.17e+07\nGD step 2/(mu+L): forecast 3207 steps, observed 2963 steps\nGD step 1/L: forecast 6408 steps (rate 1 - mu/L), observed 5883 steps\nGD step 2.05/L: diverged | raw units, step 1/L_raw: not converged, relative error 1.0e+00\nconvex: 5 random starts end within 8.5e-04 of theta_hat\nsmallest eigenvalue 0.0088; its eigenvector loads on TC -0.71, LDL +0.56, HDL +0.32, LTG +0.26\neigen-expansion: noise along that direction is amplified 1/lambda_min = 114 times, vs 0.25 along the top one\nVIF = 1/(1 - R_j^2): TC 58, LDL 38, HDL 16, LTG 10\nlowest CV RMSE 54.23 at lambda 0.0010 (flat curve); one-SE rule: lambda* = 0.422\nridge: smallest eigenvalue 0.0088 -> 0.430, kappa 464 -> 10\nbootstrap OLS: sd of the TC weight 22.0, LDL weight 17.1\nbootstrap ridge: sd of the TC weight 1.5, LDL weight 1.6\n30 training patients: ridge (lambda 0.1) beats OLS in 98% of 200 repeats\n  training mean RMSE  74.62  MAE  63.42  R^2 -0.015\n  OLS           RMSE  56.83  MAE  47.89  R^2  0.411\n  ridge         RMSE  56.96  MAE  48.84  R^2  0.409\nRMSE(OLS) - RMSE(ridge) = -0.12, 95% interval [-2.54, 2.00]: a tie\nflag at 168.3: recall P(flag|high) 0.69, precision P(high|flag) 0.56, Bayes: recall * P(high) / P(flag) = 0.56\nAUC 0.866",
  },
};
