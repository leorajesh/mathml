// Starter code for the "Try It in Python" editor on each concept page. Every snippet reproduces the
// page's worked example, prints labeled results, and ends with a "Try" line suggesting an experiment.
// String.raw keeps Python backslashes intact; avoid "${" inside snippets.
const py = String.raw;

export const codeExamples = {
  'ml-workflow': py`import numpy as np

# Features: [contains_free, link_count]; labels: spam = +1, not spam = -1
X = np.array([[1, 2], [0, 0], [1, 1]])
y = np.array([1, -1, 1])

theta = np.array([2, 1])
theta0 = -2

scores = X @ theta + theta0
pred = np.where(scores >= 0, 1, -1)
train_error = np.mean(pred != y)

print("scores:     ", scores)
print("predictions:", pred)
print("labels:     ", y)
print("training error E_n =", train_error)

# Try: set theta0 = -3.5 and see which email becomes a mistake.`,


  'vectors-dot-product': py`import numpy as np

u = np.array([2.0, 3.0])
v = np.array([4.0, -1.0])

print("u . v =", u @ v)
print("|u| =", round(np.linalg.norm(u), 4), " |v| =", round(np.linalg.norm(v), 4))
cos_angle = (u @ v) / (np.linalg.norm(u) * np.linalg.norm(v))
print("cos(angle) =", round(cos_angle, 3), " angle =", round(np.degrees(np.arccos(cos_angle)), 1), "degrees")

w = np.array([3.0, -2.0])
print("u . w =", u @ w, "-> perpendicular" if u @ w == 0 else "")
print("u . u =", u @ u, "= |u|^2")

# Try: change v to [-4, 1]. What happens to the dot product and the angle?`,

  'feature-representation': py`import numpy as np

# Features for one email: [times "free" appears, number of links]
x = np.array([2.0, 3.0])
theta = np.array([4.0, -1.0])

contributions = theta * x
score = theta @ x
print("per-feature contributions theta_i * x_i:", contributions)
print("score theta . x =", score)
print("predicted class:", "+1" if score >= 0 else "-1")

# One-hot encoding of a category
categories = ["personal", "work", "unknown"]
def one_hot(value):
    return np.array([1.0 if c == value else 0.0 for c in categories])
print("work ->", one_hot("work"))

# Try: change theta[1] to -3. Which side does x land on now?`,

  'matrix-operations': py`import numpy as np

A = np.array([[1, 2], [3, 4]])

print("2A =")
print(2 * A)
print("A^T =")
print(A.T)
S = A + A.T
print("A + A^T =")
print(S)
print("A + A^T is symmetric:", np.array_equal(S, S.T))

# Try: add a 2x3 matrix to A and read the error message.`,

  'matrix-multiplication-outer-product': py`import numpy as np

A = np.array([[1, 2], [-2, 1]])
B = np.array([[3, 5], [-1, 4]])
print("AB =")
print(A @ B)
print("BA =")
print(B @ A)
print("AB == BA?", np.array_equal(A @ B, B @ A))

a = np.array([1, 2, -1])
b = np.array([2, 1])
outer = np.outer(a, b)
print("outer product a b^T =")
print(outer)
print("rank of a b^T:", np.linalg.matrix_rank(outer))

# Try: sum two outer products and check the rank again.`,

  'matrix-systems': py`import numpy as np

# 2a + b = 5 and a - b = 1
A = np.array([[2, 1], [1, -1]], dtype=float)
b = np.array([5, 1], dtype=float)

solution = np.linalg.solve(A, b)
print("[a, b] =", solution)
print("check A @ solution =", A @ solution)

# Try: change the second row to [4, 2]. Why does solve() fail now?`,

  'gaussian-elimination': py`from fractions import Fraction as F

# Augmented matrix for x + 2y + z = 4, 2x + y + z = 5, x + y + 2z = 5
M = [[F(1), F(2), F(1), F(4)],
     [F(2), F(1), F(1), F(5)],
     [F(1), F(1), F(2), F(5)]]

def show(title):
    print(title)
    for row in M:
        print("  ", [str(v) for v in row])

M[1] = [r2 - 2 * r1 for r1, r2 in zip(M[0], M[1])]
M[2] = [r3 - r1 for r1, r3 in zip(M[0], M[2])]
show("after clearing column 1:")
factor = M[2][1] / M[1][1]
M[2] = [r3 - factor * r2 for r2, r3 in zip(M[1], M[2])]
show("after clearing column 2 (REF):")

z = M[2][3] / M[2][2]
y = (M[1][3] - M[1][2] * z) / M[1][1]
x = (M[0][3] - M[0][1] * y - M[0][2] * z) / M[0][0]
print("x, y, z =", x, y, z)

# Continuing to RREF gives the identity plus the answer column
from sympy import Matrix
print("RREF:", Matrix([[1, 2, 1, 4], [2, 1, 1, 5], [1, 1, 2, 5]]).rref()[0].tolist())

# Try: change the last equation's right side from 5 to 6.`,

  'solution-structure': py`import sympy as sp

x1, x2, x3 = sp.symbols("x1 x2 x3")
A = sp.Matrix([[1, 2, -1], [2, 4, -2]])
b = sp.Matrix([3, 6])

print("rank(A) =", A.rank(), " nullity(A) =", A.shape[1] - A.rank())
print("null space basis:", [list(v) for v in A.nullspace()])
print("all solutions (x2, x3 are free):", sp.linsolve((A, b), x1, x2, x3))

x_p = sp.Matrix([3, 0, 0])
print("particular solution x_p =", list(x_p), " A x_p =", list(A * x_p))

# Try: change b to [3, 7]. What does linsolve return, and why?`,



  'linear-transformations': py`import numpy as np

T = np.array([[2, 0], [0, 1]])        # T(x, y) = (2x, y)
print("T([1, 3]) =", T @ np.array([1, 3]))

# Linearity: T(a v + b w) == a T(v) + b T(w)
v, w, a, b = np.array([1, 2]), np.array([-3, 5]), 2.0, -1.5
print("linear:", np.allclose(T @ (a * v + b * w), a * (T @ v) + b * (T @ w)))

def S(p):
    return p + np.array([1, 0])        # a shift, not linear
print("S(0) =", S(np.zeros(2)), "-> moves the origin, so S is not linear")

# Kernel: solve T x = 0
print("rank of T:", np.linalg.matrix_rank(T), "-> kernel is only the zero vector")

# Try: T = [[1, 2], [2, 4]]. What is its rank, and which nonzero vector does it send to 0?`,

  'transformation-matrix': py`import numpy as np

def T(v):
    x, y = v
    return np.array([x, -y])   # reflect across the x-axis

e1 = np.array([1, 0])
e2 = np.array([0, 1])
T_matrix = np.column_stack([T(e1), T(e2)])
print("[T] =")
print(T_matrix)

v = np.array([3, 2])
print("T(v) directly:  ", T(v))
print("[T] @ v matches:", T_matrix @ v)

# Try: define T(x, y) = (x + y, 2y) and build its matrix.`,

  'composition-of-transformations': py`import numpy as np

R = np.array([[0, -1], [1, 0]])   # rotate 90 degrees
F = np.array([[1, 0], [0, -1]])   # reflect across the x-axis

print("rotate then reflect, F @ R =")
print(F @ R)
print("reflect then rotate, R @ F =")
print(R @ F)

u = np.array([1, 2])
print("F(R(u)) =", F @ (R @ u), " equals (F @ R) u =", (F @ R) @ u)

# Try: compose R with itself four times. What do you get?`,

  'change-of-basis': py`import numpy as np

P = np.array([[1, 1], [1, -1]], dtype=float)   # columns are the basis B
v_std = np.array([3, 1], dtype=float)

v_B = np.linalg.solve(P, v_std)
print("[v]_B =", v_B)
print("back to standard coordinates:", P @ v_B)

A = np.array([[2, 1], [1, 2]], dtype=float)
print("same map in basis B, P^-1 A P =")
print(np.round(np.linalg.solve(P, A @ P), 6) + 0.0)   # + 0.0 turns -0.0 into 0.0

# Try: the matrix above is diagonal. Why does this basis make A so simple?`,

  'invertible-transformations': py`import numpy as np

A = np.array([[3, 5], [-1, 4]], dtype=float)
print("det(A) =", round(np.linalg.det(A), 6))

A_inv = np.linalg.inv(A)
print("17 * A^-1 =")
print(np.round(17 * A_inv, 6))
print("A @ A^-1 =")
print(np.round(A @ A_inv, 6))

# Solving directly is preferred to forming the inverse:
b = np.array([1, 2], dtype=float)
print("solve(A, b) =", np.linalg.solve(A, b))

# Try: set A = [[2, 4], [1, 2]]. What happens to det and inv?`,



  'determinants-cofactor-row-ops': py`import sympy as sp

A = sp.Matrix([[3, 2, 2], [2, 3, 2], [2, 2, 3]])
minors = [A.minor_submatrix(0, j).det() for j in range(3)]
cofactor_det = sum((-1) ** j * A[0, j] * minors[j] for j in range(3))
print("minors M11, M12, M13 =", minors)
print("cofactor expansion det =", cofactor_det)
print("sympy det =", A.det())

# Row operations: swap flips the sign, scaling scales, replacement keeps det.
swapped = A.copy(); swapped.row_swap(0, 1)
replaced = A.copy(); replaced[1, :] = A[1, :] - 2 * A[0, :]
print("after a row swap:", swapped.det(), " after R2 <- R2 - 2 R1:", replaced.det())

# Try: scale row 1 by 5 and predict the new determinant first.`,

  'linear-classifier': py`import numpy as np
import matplotlib.pyplot as plt

theta = np.array([1, 2])
theta0 = -3

def predict(X):
    return np.where(X @ theta + theta0 >= 0, 1, -1)

X = np.array([[1, 2], [1, 0]])
print("scores:", X @ theta + theta0)
print("predictions:", predict(X))

# Plot the boundary theta . x + theta0 = 0 and the two points
xs = np.linspace(-1, 4, 50)
plt.plot(xs, -(theta[0] * xs + theta0) / theta[1], label="decision boundary")
plt.scatter(X[:, 0], X[:, 1], c=["green" if p > 0 else "red" for p in predict(X)], s=80)
plt.quiver(1, 1, theta[0], theta[1], angles="xy", scale_units="xy", scale=2, label="theta (normal)")
plt.axis("equal"); plt.legend(); plt.title("Linear classifier")

# Try: change theta0 to -6. Which point changes class? (At -5 the first point sits exactly on the boundary.)`,

  'linear-classifier-through-origin': py`import numpy as np

theta = np.array([1, -1])      # no theta0: the boundary passes through (0, 0)
X = np.array([[2, 1], [1, 2]])

scores = X @ theta
print("scores:", scores)
print("predictions:", np.where(scores >= 0, 1, -1))
print("score at the origin is always", theta @ np.array([0, 0]))

# Try: can any theta put both points (1, 1) and (2, 2) in different classes?`,

  'linear-separability': py`import numpy as np

X = np.array([[1.0], [3.0]])
y = np.array([-1, 1])
theta = np.array([1.0])
theta0 = -2.0

margins = y * (X @ theta + theta0)
geometric_margin = margins.min() / np.linalg.norm(theta)
print("signed margins:", margins)
print("all positive (separates the data)?", np.all(margins > 0))
print("geometric margin gamma =", geometric_margin)

# Try: add a point x = 0.5 with label +1. Can any threshold still separate the data?`,

  perceptron: py`import numpy as np

X = np.array([[2, 1], [-1, -1], [1, 2]], dtype=float)
y = np.array([1, -1, 1])
theta = np.zeros(2)
theta0 = 0.0

for epoch in range(10):
    mistakes = 0
    for x_i, y_i in zip(X, y):
        if y_i * (theta @ x_i + theta0) <= 0:     # mistake (or on the boundary)
            theta += y_i * x_i
            theta0 += y_i
            mistakes += 1
    print(f"epoch {epoch + 1}: mistakes = {mistakes}, theta = {theta}, theta0 = {theta0}")
    if mistakes == 0:
        break

# Try: add the point [0.5, 0.5] with label -1 and watch the epochs.`,

  'perceptron-convergence': py`import numpy as np

rng = np.random.default_rng(0)
theta_star = np.array([2.0, -1.0]) / np.sqrt(5)    # a unit-norm separator through the origin
X = rng.uniform(-3, 3, size=(60, 2))
X = X[np.abs(X @ theta_star) > 0.3]                  # keep only points with margin > 0.3
y = np.sign(X @ theta_star)

R = np.linalg.norm(X, axis=1).max()
gamma = (y * (X @ theta_star)).min()
print(f"R = {R:.2f}, gamma = {gamma:.2f}, bound (R/gamma)^2 = {(R / gamma) ** 2:.1f}")

theta = np.zeros(2)
mistakes = 0
for _ in range(100):
    changed = False
    for x_i, y_i in zip(X, y):
        if y_i * (theta @ x_i) <= 0:
            theta += y_i * x_i
            mistakes += 1
            changed = True
    if not changed:
        break
print("actual mistakes:", mistakes)

# Try: change 0.3 to 0.05 (smaller margin). How do the bound and the mistakes change?`,

  'empirical-risk-zero-one': py`import numpy as np

margins = np.array([2.0, -0.5, 0.1, -3.0])     # y * (theta . x) for four examples
zero_one = (margins <= 0).astype(int)
print("zero-one losses:", zero_one)
print("training error E_n =", zero_one.mean())

# Try: change -0.5 to -0.01. Does the loss notice the difference?`,

  'hinge-loss': py`import numpy as np
import matplotlib.pyplot as plt

margins = np.array([1.5, 0.2, -1.0])
hinge = np.maximum(0, 1 - margins)
print("hinge losses:", hinge)
print("average hinge risk:", round(hinge.mean(), 3))

z = np.linspace(-3, 3, 400)
plt.plot(z, np.maximum(0, 1 - z), label="hinge max(0, 1 - z)")
plt.plot(z, (z <= 0).astype(float), "--", label="zero-one")
plt.scatter(margins, hinge, color="black", zorder=3)
plt.xlabel("signed margin z"); plt.ylabel("loss"); plt.legend(); plt.title("Hinge vs zero-one")

# Try: which margins give zero hinge loss? Add one to the array.`,



  'stochastic-subgradient-descent': py`import numpy as np

# The page's single step: theta = 0, x = [2, 1], y = +1, eta = 0.2
theta = np.zeros(2)
x, y_t, eta, lam = np.array([2.0, 1.0]), 1, 0.2, 0.0
if y_t * (theta @ x) <= 1:                    # the notes update when the agreement is at most 1
    theta = (1 - eta * lam) * theta + eta * y_t * x
print("one step:", theta)

# Many random steps on overlapping classes (no line gets every point right)
rng = np.random.default_rng(1)
X = np.array([[2, 1], [1, 3], [-1, -2], [-2, 0], [1.5, 2], [-1.5, -1]], dtype=float)
y = np.array([1, 1, -1, -1, -1, 1])
lam = 0.0                                    # the notes' version; set lam > 0 for the SVM objective (beyond Week 1)
theta = np.zeros(2)
risk = lambda th: np.maximum(0, 1 - y * (X @ th)).mean()
best, best_risk = theta.copy(), risk(theta)
for k in range(1, 501):
    t = rng.integers(len(X))                 # one random example
    eta = 1 / (k + 1)                        # the notes' schedule: sum eta = inf, sum eta^2 < inf
    if y[t] * (theta @ X[t]) <= 1:
        theta = (1 - eta * lam) * theta + eta * y[t] * X[t]
    else:
        theta = (1 - eta * lam) * theta
    if risk(theta) < best_risk:              # keep the best theta seen so far
        best, best_risk = theta.copy(), risk(theta)
    if k in (1, 10, 100, 500):
        print(f"step {k:3d}: theta = {np.round(theta, 3)}, average hinge = {risk(theta):.3f}, best so far = {best_risk:.3f}")

# Try: use a fixed eta = 0.1 (popular in practice). Does the current risk bounce more than the best-so-far?`,

  'linear-regression': py`import numpy as np

theta1, theta0 = 2.0, 1.0
x = 3.0
y_true = 9.0

y_hat = theta1 * x + theta0
print("prediction y_hat =", y_hat)
print("residual y - y_hat =", y_true - y_hat)

# Many inputs at once
xs = np.array([0.0, 1.0, 2.0, 3.0])
print("predictions:", theta1 * xs + theta0)

# Learning theta by gradient descent: fit y = theta x to (1, 2) and (2, 3)
X = np.array([1.0, 2.0])
y = np.array([2.0, 3.0])
theta, alpha = 0.0, 0.2
for step in range(1, 31):
    grad = -np.mean((y - theta * X) * X)         # gradient of R_n with the loss z^2/2 (Week 2 notes)
    theta -= alpha * grad
    if step <= 2 or step % 10 == 0:
        print(f"step {step:2d}: theta = {theta:.4f}")
print("normal equation answer:", (X @ y) / (X @ X))

# Stochastic gradient descent, as in the notes: one random example per step, eta_k = 1/(k+1)
rng = np.random.default_rng(0)
theta = 0.0
for k in range(1, 2001):
    t = rng.integers(len(X))
    theta += (1 / (k + 1)) * (y[t] - theta * X[t]) * X[t]
print("SGD after 2000 steps:", round(theta, 3))

# Try: which theta0 would make the residual at x = 3 zero? Then try alpha = 1.0 in the gradient loop.`,

  'polynomial-regression': py`import numpy as np

x = 2.0
features = np.array([x, x ** 2, x ** 3])
a = np.array([1.0, 0.0, 3.0])
b = 5.0
print("features [x, x^2, x^3] =", features)
print("prediction =", b + a @ features)

# Fit polynomials of different degrees to noisy data
rng = np.random.default_rng(0)
xs = np.linspace(-1, 1, 12)
ys = np.sin(3 * xs) + 0.2 * rng.normal(size=xs.size)
for degree in (1, 3, 6):
    coeffs = np.polyfit(xs, ys, degree)
    mse = np.mean((np.polyval(coeffs, xs) - ys) ** 2)
    print(f"degree {degree}: training MSE = {mse:.4f}")

# Try: add degree 11. With 12 points, why can the training MSE reach almost 0?`,

  'least-squares-normal-equation': py`import numpy as np
import matplotlib.pyplot as plt

X = np.array([[1.0], [2.0]])     # one feature, no intercept
y = np.array([2.0, 3.0])

theta = np.linalg.solve(X.T @ X, X.T @ y)   # normal equation
print("X^T X =", X.T @ X, " X^T y =", X.T @ y)
print("theta_hat =", theta)
print("predictions:", X @ theta)
print("lstsq agrees:", np.linalg.lstsq(X, y, rcond=None)[0])

# Projection view: the residual is perpendicular to every column of X
residual = y - X @ theta
print("residual y - y_hat =", residual, " X^T residual =", X.T @ residual)

xs = np.linspace(0, 3, 10)
plt.scatter(X[:, 0], y, s=80, label="data")
plt.plot(xs, theta[0] * xs, label=f"y = {theta[0]:.2f} x")
plt.vlines(X[:, 0], X @ theta, y, colors="red", linestyles="dashed", label="residuals")
plt.legend(); plt.title("Least squares through the origin")

# Try: add the point (3, 4) to X and y.`,

  'ridge-regularization': py`import numpy as np

X = np.array([[1.0], [2.0]])
y = np.array([2.0, 3.0])
n, d = X.shape

for lam in [0.0, 0.5, 2.0, 10.0]:
    theta = np.linalg.solve(X.T @ X + n * lam * np.eye(d), X.T @ y)
    print(f"lambda = {lam:5.1f}: theta = {theta[0]:.4f}")

# Try: which lambda halves the least-squares slope 1.6?`,


  'model-complexity-generalization': py`import numpy as np

rng = np.random.default_rng(3)
def make_data(n):
    x = rng.uniform(-1, 1, n)
    return x, np.sin(3 * x) + 0.3 * rng.normal(size=n)

x_train, y_train = make_data(30)
x_test, y_test = make_data(200)

for degree in (1, 3, 5, 9, 15):
    coeffs = np.polyfit(x_train, y_train, degree)
    train = np.mean((np.polyval(coeffs, x_train) - y_train) ** 2)
    test = np.mean((np.polyval(coeffs, x_test) - y_test) ** 2)
    print(f"degree {degree:2d}: train {train:.3f}  test {test:.3f}  gap {test - train:.3f}")

# Try: use 200 training points. Does the degree-15 gap shrink?`,


  'logistic-regression': py`import numpy as np
import matplotlib.pyplot as plt

def sigmoid(s):
    return 1 / (1 + np.exp(-s))

score = 2.0                       # theta . x + theta0
prob = sigmoid(score)
print(f"P(y = 1 | x) = {prob:.3f}")
print("predicted class:", int(prob >= 0.5))

s = np.linspace(-8, 8, 200)
plt.plot(s, sigmoid(s))
plt.axhline(0.5, linestyle="--", color="gray")
plt.scatter([score], [prob], color="red", zorder=3)
plt.xlabel("score s"); plt.ylabel("probability"); plt.title("Sigmoid")

# Try: which score gives probability exactly 0.5?`,

  'logistic-loss': py`import numpy as np

def log_loss(y, h):
    return -(y * np.log(h) + (1 - y) * np.log(1 - h))

y = np.array([1, 1])
h = np.array([0.8, 0.2])
losses = log_loss(y, h)
print("losses:", np.round(losses, 3))
print("difference:", round(losses[1] - losses[0], 3))
# Try: set h = [0.99, 0.01]. How big is the second loss?

# Likelihood of many examples underflows; log-likelihood does not
p = np.full(2000, 0.6)
print("product of 2000 probabilities (float64):", np.prod(p), "(stuck at the tiniest float, or 0: the true value is lost)")
print("true value: about 10 **", round(np.sum(np.log10(p)), 1), "-> far below what float64 can store")
print("sum of their logs:", round(np.sum(np.log(p)), 2), "(no problem)")

# Learning: gradient descent with gradient (1/n) sum (h - y) x (a leading 1 in x plays the offset)
X = np.array([[1.0, 0.5], [1.0, 1.5], [1.0, 2.0], [1.0, 2.5], [1.0, 3.0], [1.0, 3.5]])
labels = np.array([0, 0, 1, 0, 1, 1])   # overlapping classes, so the best theta is finite
theta = np.zeros(2)
for step in range(2000):
    probs = 1 / (1 + np.exp(-X @ theta))
    theta -= 0.5 * X.T @ (probs - labels) / len(labels)
probs = 1 / (1 + np.exp(-X @ theta))
print("theta after 2000 steps:", np.round(theta, 3), " average loss:", round(np.mean(log_loss(labels, probs)), 4))

# Try: change the labels to [0, 0, 0, 1, 1, 1] (separable). What happens to theta as you add steps?`,

  'classification-metrics': py`TP, FP, TN, FN = 8, 2, 90, 10

accuracy = (TP + TN) / (TP + TN + FP + FN)
precision = TP / (TP + FP)
recall = TP / (TP + FN)
specificity = TN / (TN + FP)
f1 = 2 * precision * recall / (precision + recall)

print(f"accuracy    = {accuracy:.3f}")
print(f"precision   = {precision:.3f}")
print(f"recall      = {recall:.3f}")
print(f"specificity = {specificity:.3f}")
print(f"F1          = {f1:.3f}")

# Try: a model that always predicts negative has TP = FP = 0. Compute its accuracy and recall.`,

  'eigenvalues-eigenvectors': py`import numpy as np

A = np.array([[2, 0], [0, 3]], dtype=float)
values, vectors = np.linalg.eig(A)
print("eigenvalues:", values)
for lam, v in zip(values, vectors.T):
    print(f"lambda = {lam}: A v = {A @ v}, lambda v = {lam * v}")

w = np.array([1.0, 1.0])
Aw = A @ w
is_eigen = np.isclose(Aw[0] * w[1], Aw[1] * w[0])   # Aw parallel to w?
print("A [1, 1] =", Aw, "->", "an eigenvector" if is_eigen else "not a multiple of [1, 1], so not an eigenvector")

# A matrix that is not diagonal: solve det(B - lambda I) = 0
B = np.array([[2.0, 1.0], [1.0, 2.0]])
print("eigenvalues of B:", np.linalg.eigvalsh(B), " roots of (2 - l)^2 - 1:", np.roots([1, -4, 3]))
print("B [1, 1] =", B @ np.array([1.0, 1.0]), " B [1, -1] =", B @ np.array([1.0, -1.0]))

# Try: A = [[0, 1], [1, 0]]. Find its eigenvalues. Is one negative?`,



  'sets': py`U = {1, 2, 3, 4, 5}
A = {1, 2, 3}
B = {3, 4}

print("A union B        =", A | B)
print("A intersection B =", A & B)
print("A minus B        =", A - B)
print("complement of A  =", U - A)

# Sets ignore order and repeats
print("{1, 2, 2, 3} == {3, 2, 1}:", {1, 2, 2, 3} == {3, 2, 1})

# Try: change U to {1, 2, 3, 4, 5, 6}. Which result changes, and why?`,

  'functions': py`def describe(f, A, B):
    outputs = [f[x] for x in A]
    injective = len(set(outputs)) == len(outputs)       # no two inputs share an output
    surjective = set(outputs) == set(B)                 # every output is reached
    return injective, surjective

A = [1, 2, 3]
B = ["a", "b", "c"]
f = {1: "a", 2: "a", 3: "b"}
g = {1: "a", 2: "b", 3: "c"}

for name, h in [("f", f), ("g", g)]:
    inj, sur = describe(h, A, B)
    print(f"{name}: injective={inj}, surjective={sur}, bijective={inj and sur}")

# Try: add an input 4 to A with g[4] = "a". Is g still injective? Surjective?`,

  'inverse-composition': py`def f(x):
    return x + 1

def g(x):
    return 2 * x

def f_inv(y):
    return y - 1

def g_inv(y):
    return y / 2

print("g(f(3)) =", g(f(3)))      # g after f
print("f(g(3)) =", f(g(3)))      # f after g: a different answer
print("undo g after f:", f_inv(g_inv(g(f(3)))))
print("wrong order:   ", g_inv(f_inv(g(f(3)))))

# Try: define h(x) = x ** 2. Why can h not have an inverse on all real numbers?`,

  'vector-spaces': py`import numpy as np

# Represent a + b x + c x^2 by its coefficients [a, b, c]
p = np.array([1, 2, 0])      # 1 + 2x
q = np.array([3, -1, 1])     # 3 - x + x^2

print("p + q =", p + q, "-> 4 + x + x^2, still degree <= 2")
print("3 p   =", 3 * p, "-> 3 + 6x")
print("zero polynomial:", np.zeros(3, dtype=int))

# A set that is NOT a vector space: polynomials with constant term 1
r = np.array([1, 1, 0])      # 1 + x
s = np.array([1, 0, 1])      # 1 + x^2
print("r + s =", r + s, "-> constant term", (r + s)[0], "so the set is not closed")

# Try: check that the set of polynomials with constant term 0 is closed under addition and scaling.`,

  'span-linear-combinations': py`import numpy as np

v1 = np.array([1.0, 2.0])
v2 = np.array([2.0, 3.0])
b = np.array([4.0, 7.0])

V = np.column_stack([v1, v2])
rank = np.linalg.matrix_rank(V)
print("rank of [v1 v2] =", rank, "-> the span is", "all of R^2" if rank == 2 else "a line")

c, *_ = np.linalg.lstsq(V, b, rcond=None)      # best amounts (exact when b is in the span)
reached = np.allclose(V @ c, b)
print("amounts c1, c2 =", np.round(c, 4), "-> c1 v1 + c2 v2 =", np.round(V @ c, 4))
print("b is in the span:", reached)

# Try: set v2 = [2, 4]. What is the rank now, and is b = [4, 7] still reachable?`,

  'linear-independence': py`import sympy as sp

v1, v2, v3 = sp.Matrix([1, 2, 1]), sp.Matrix([3, 8, 2]), sp.Matrix([5, 6, 7])
V = sp.Matrix.hstack(v1, v2, v3)

rref, pivots = V.rref()
print("RREF:", rref.tolist())
print("pivot columns:", pivots)
print("rank =", V.rank(), "-> dependent?", V.rank() < V.shape[1])
print("null space (the dependence coefficients):", [list(n) for n in V.nullspace()])
print("-11 v1 + 2 v2 + v3 =", list(-11 * v1 + 2 * v2 + v3))

# Try: change v3 to [5, 6, 8]. Are the vectors still dependent?`,

  'subspaces': py`import sympy as sp

A = sp.Matrix([[1, 1, 1]])                 # W = {x : x + y + z = 0} = Null(A)
basis = A.nullspace()
print("basis of W:", [list(v) for v in basis])

u = sp.Matrix([1, -1, 0])
w = sp.Matrix([2, 3, -5])
print("u, w in W:", A * u == sp.zeros(1, 1), A * w == sp.zeros(1, 1))
print("u + w in W:", A * (u + w) == sp.zeros(1, 1))
print("7u in W:", A * (7 * u) == sp.zeros(1, 1))

# The shifted plane x + y + z = 1 is not closed under addition
p, q = sp.Matrix([1, 0, 0]), sp.Matrix([0, 1, 0])
print("p + q =", list(p + q), "has sum", sum(p + q), "(not 1)")

# Try: find the column space of A = [[1, 2], [2, 4]] with A.columnspace(). What shape is it?`,

  'basis-coordinates': py`import numpy as np

e1, e2 = np.array([1.0, 0.0]), np.array([0.0, 1.0])
v = np.array([3.0, -2.0])
print("coordinates in the standard basis:", np.linalg.solve(np.column_stack([e1, e2]), v))

b1, b2 = np.array([1.0, 1.0]), np.array([1.0, -1.0])
B = np.column_stack([b1, b2])
c = np.linalg.solve(B, v)
print("coordinates in the basis b1, b2:", c)
print("check: c1 b1 + c2 b2 =", c[0] * b1 + c[1] * b2)

# Try: use b2 = [2, 2]. Why does solve() fail? (Is {b1, b2} still a basis?)`,

  'dimension': py`import numpy as np
import sympy as sp

vectors = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]]).T   # 4 vectors in R^3
print("rank of 4 vectors in R^3:", np.linalg.matrix_rank(vectors), "-> at most 3, so they are dependent")

plane = sp.Matrix([[1, 1, 1]]).nullspace()          # x + y + z = 0
print("basis of the plane:", [list(v) for v in plane], "-> dimension", len(plane))

# P2 = polynomials of degree <= 2: basis 1, x, x^2
print("dim P2 =", len(["1", "x", "x^2"]))

# Try: find the dimension of the null space of [[1, 2, 3], [2, 4, 6]].`,

  'affine-maps': py`import numpy as np

A = np.array([[2.0, 0.0], [0.0, 1.0]])
b = np.array([1.0, -1.0])

def f(x):
    return A @ x + b

e1, e2 = np.array([1.0, 0.0]), np.array([0.0, 1.0])
print("f(0) =", f(np.zeros(2)), "-> not the origin, so f is not linear")
print("f(e1) + f(e2) =", f(e1) + f(e2), " but f(e1 + e2) =", f(e1 + e2))

# Homogeneous coordinates: one matrix does the whole affine map
H = np.block([[A, b[:, None]], [np.zeros((1, 2)), np.ones((1, 1))]])
x = np.array([3.0, 4.0])
print("H @ [x, 1] =", H @ np.append(x, 1), " f(x) =", f(x))

# Try: set b = [0, 0]. Do f(e1) + f(e2) and f(e1 + e2) agree now?`,

  'dimensionality-reduction': py`import numpy as np

x = np.array([3.0, 1.0])
u = np.array([1.0, 1.0]) / np.sqrt(2)   # unit vector spanning the line

z = u @ x               # encode: one number
x_hat = z * u           # decode: back to 2D
error = np.sum((x - x_hat) ** 2)
print("z =", round(z, 4))
print("reconstruction x_hat =", np.round(x_hat, 4))
print("squared reconstruction error =", round(error, 4))

# PCA picks the direction that keeps the most variance
rng = np.random.default_rng(0)
data = rng.normal(size=(200, 2)) @ np.array([[3.0, 0.0], [1.0, 0.5]])
data -= data.mean(axis=0)
values, vectors = np.linalg.eigh(np.cov(data.T))
print("top principal direction:", np.round(vectors[:, -1], 3), "keeps", f"{values[-1] / values.sum():.1%}", "of the variance")

# Try: use u = [1, 0] for x. Is the error bigger or smaller?`,

  'rank-nullity': py`import sympy as sp

A = sp.Matrix([[1, 2, 3], [2, 4, 6]])
rank = A.rank()
null_basis = A.nullspace()
print("rank(A) =", rank)
print("column space basis:", [list(v) for v in A.columnspace()])
print("null space basis:", [list(v) for v in null_basis])
print("nullity(A) =", len(null_basis))
print("rank + nullity =", rank + len(null_basis), "= number of columns", A.shape[1])

# Try: change the second row to [2, 4, 7]. How do rank and nullity change?`,

  'determinant-geometry': py`import numpy as np

A = np.array([[2.0, 1.0], [1.0, 1.0]])
B = np.array([[2.0, 1.0], [4.0, 2.0]])
F = np.array([[1.0, 0.0], [0.0, -1.0]])

for name, M in [("A", A), ("B", B), ("F", F)]:
    print(f"det({name}) = {np.linalg.det(M):.3f}")

print("det(A F) =", round(np.linalg.det(A @ F), 6), "= det(A) det(F)")

# Area of the image of the unit square = |det|
corners = np.array([[0, 0], [1, 0], [1, 1], [0, 1]], dtype=float)
image = corners @ A.T
area = 0.5 * abs(sum(image[i, 0] * image[i - 1, 1] - image[i - 1, 0] * image[i, 1] for i in range(4)))
print("area of A(unit square) =", round(area, 6))

# Try: compute det(2 * A). Is it 2 det(A) or 4 det(A)?`,

  'convex-functions': py`import numpy as np

def chord_test(f, a, b, steps=11):
    """True if the chord from (a, f(a)) to (b, f(b)) never dips below f."""
    return all(f(l * a + (1 - l) * b) <= l * f(a) + (1 - l) * f(b) + 1e-12 for l in np.linspace(0, 1, steps))

square = lambda x: x ** 2
cube = lambda x: x ** 3

print("x^2 midpoint: f(1) =", square(1), " chord value =", (square(-1) + square(3)) / 2)
print("x^2 chord test on [-1, 3]:", chord_test(square, -1, 3))
print("x^3 chord test on [-2, 0]:", chord_test(cube, -2, 0))

# Second-derivative test with a finite difference
h = 1e-3
for x in [-2.0, 0.0, 2.0]:
    second = (cube(x + h) - 2 * cube(x) + cube(x - h)) / h ** 2
    print(f"x^3: f''({x}) ~ {second:.2f}")

# Try: run chord_test on abs and on np.sin over several intervals.`,

  'surrogate-losses': py`import numpy as np
import matplotlib.pyplot as plt

z = np.array([-2.0, -0.4, 0.0, 0.7, 1.0, 2.0])
zero_one = (z <= 0).astype(float)
hinge = np.maximum(0, 1 - z)
logistic = np.log2(1 + np.exp(-z))
for row in zip(z, zero_one, hinge, logistic):
    print("z = {:5.1f}   zero-one = {:.0f}   hinge = {:.2f}   logistic = {:.2f}".format(*row))
print("both surrogates >= zero-one:", np.all(hinge >= zero_one) and np.all(logistic >= zero_one))

grid = np.linspace(-3, 3, 400)
plt.plot(grid, (grid <= 0).astype(float), "--", label="zero-one")
plt.plot(grid, np.maximum(0, 1 - grid), label="hinge")
plt.plot(grid, np.log2(1 + np.exp(-grid)), label="logistic (base 2)")
plt.xlabel("signed margin z"); plt.ylabel("loss"); plt.legend(); plt.title("Surrogate losses")

# Try: for which z is the hinge loss exactly 0 but the logistic loss still positive?`,

  'gradient-descent-method': py`import numpy as np
import matplotlib.pyplot as plt

def J(theta):
    return (theta - 3) ** 2

def grad(theta):
    return 2 * (theta - 3)

theta = 0.0
alpha = 0.2
path = [theta]
for step in range(5):
    theta = theta - alpha * grad(theta)
    path.append(theta)
    print(f"step {step + 1}: theta = {theta:.4f}, distance to 3 = {abs(theta - 3):.4f}")

ts = np.linspace(-1, 7, 200)
plt.plot(ts, J(ts), label="J(theta) = (theta - 3)^2")
plt.plot(path, [J(t) for t in path], "o--", label="gradient descent path")
plt.xlabel("theta"); plt.legend(); plt.title(f"alpha = {alpha}")

# Try: alpha = 0.5 (one step), 0.9 (overshoots), and 1.1 (diverges).`,

  'subgradients': py`def f(theta):
    return abs(theta - 2)

def subgradient(theta, at_corner=0.0):
    if theta > 2:
        return 1.0
    if theta < 2:
        return -1.0
    return at_corner          # any value in [-1, 1] is valid at the corner

theta, alpha = 0.0, 0.5
for step in range(6):
    g = subgradient(theta)
    theta = theta - alpha * g
    print(f"step {step + 1}: g = {g:+.0f}, theta = {theta:.2f}, f = {f(theta):.2f}")

# Try: call subgradient(theta, at_corner=1.0) instead. What happens after theta reaches 2?`,

  'lasso': py`import numpy as np

theta_A = np.array([3.0, 0.0])
theta_B = np.array([1.5, 1.5])
for name, t in [("A", theta_A), ("B", theta_B)]:
    print(f"{name}: L1 = {np.abs(t).sum():.1f}, L2^2 = {(t ** 2).sum():.2f}")

# One standardized feature with least-squares weight w. Minimizing
#   lasso: 1/2 (theta - w)^2 + lambda |theta|        ->  soft-thresholding
#   ridge: 1/2 (theta - w)^2 + lambda/2 theta^2      ->  w / (1 + lambda)
w = 3.0
for lam in [0.0, 1.0, 2.0, 3.0, 4.0]:
    lasso = np.sign(w) * max(abs(w) - lam, 0.0) + 0.0
    ridge = w / (1 + lam)
    print(f"lambda = {lam}: lasso = {lasso:.3f}, ridge = {ridge:.3f}")

# Try: w = -1.5 and add 1.5 to the lambda list. At which lambda does the lasso weight become exactly 0?`,

  'elastic-net': py`import numpy as np

def elastic_net_1d(w, lam1, lam2):
    """Minimizer of 1/2 (theta - w)^2 + lam1 |theta| + lam2/2 theta^2."""
    return np.sign(w) * max(abs(w) - lam1, 0.0) / (1 + lam2) + 0.0

w = 3.0
print("lasso only  (lam2 = 0):", elastic_net_1d(w, 1.0, 0.0))
print("ridge only  (lam1 = 0):", elastic_net_1d(w, 0.0, 1.0))
print("elastic net (1, 1):    ", elastic_net_1d(w, 1.0, 1.0))
print("large lam1 (3, 1):     ", elastic_net_1d(w, 3.0, 1.0))

# Check the formula against a brute-force search
grid = np.linspace(-5, 5, 200001)
objective = 0.5 * (grid - w) ** 2 + 1.0 * np.abs(grid) + 0.5 * 1.0 * grid ** 2
print("brute-force minimizer:", round(grid[np.argmin(objective)], 4))

# Try: keep lam1 = 1 and raise lam2 to 3. How much does the weight shrink?`,

  'train-validation-test': py`import numpy as np

rng = np.random.default_rng(0)
n = 1000
x = rng.uniform(-1, 1, (n, 5))
y = x @ np.array([2.0, -1.0, 0.0, 0.0, 0.5]) + 0.5 * rng.normal(size=n)

order = rng.permutation(n)
train, val, test = order[:600], order[600:800], order[800:]
print("sizes:", len(train), len(val), len(test))

# The page's example: choose the lambda with the lowest validation error
page_scores = {0.01: 0.30, 0.1: 0.22, 1.0: 0.25}
print("page example -> chosen lambda:", min(page_scores, key=page_scores.get))

# The same procedure on simulated data

def fit_ridge(idx, lam):
    X = x[idx]
    return np.linalg.solve(X.T @ X + len(idx) * lam * np.eye(5), X.T @ y[idx])

def mse(theta, idx):
    return np.mean((x[idx] @ theta - y[idx]) ** 2)

scores = {lam: mse(fit_ridge(train, lam), val) for lam in [0.01, 0.1, 1.0]}
for lam, s in scores.items():
    print(f"lambda = {lam:<5} validation MSE = {s:.3f}")
best = min(scores, key=scores.get)
final = fit_ridge(np.concatenate([train, val]), best)
print("chosen lambda:", best, " test MSE (reported once):", round(mse(final, test), 3))

# Try: pick lambda by the TEST score instead. Why is that number no longer honest?`,

  'cross-validation': py`import numpy as np

rng = np.random.default_rng(0)
x = rng.uniform(-1, 1, 60)
y = np.sin(3 * x) + 0.3 * rng.normal(size=x.size)

order = rng.permutation(len(x))
test, rest = order[:20], order[20:]       # the test set is held out first
K = 4
folds = np.array_split(rest, K)

def cv_score(degree):
    scores = []
    for k in range(K):
        val = folds[k]
        train = np.concatenate([folds[j] for j in range(K) if j != k])
        coeffs = np.polyfit(x[train], y[train], degree)
        scores.append(np.mean((np.polyval(coeffs, x[val]) - y[val]) ** 2))
    return np.mean(scores)

print("page example: CV =", round(np.mean([0.22, 0.25, 0.20, 0.24]), 4))
results = {d: cv_score(d) for d in range(1, 9)}
for d, s in results.items():
    print(f"degree {d}: {K}-fold CV error {s:.3f}")
best = min(results, key=results.get)   # near-ties: many prefer the simpler model (one-standard-error rule)
final = np.polyfit(x[rest], y[rest], best)
print("chosen degree:", best, " test error (once):", round(np.mean((np.polyval(final, x[test]) - y[test]) ** 2), 3))

# Try: set K = 8. Does the chosen degree change?`,

  'diagonalization': py`import numpy as np

B = np.array([[4.0, 1.0], [2.0, 3.0]])
P = np.array([[1.0, 1.0], [1.0, -2.0]])      # eigenvectors as columns
D = np.diag([5.0, 2.0])                        # matching eigenvalues

print("B P == P D:", np.allclose(B @ P, P @ D))
print("P D P^-1 == B:", np.allclose(P @ D @ np.linalg.inv(P), B))

k = 3
Bk = P @ np.diag(np.diag(D) ** k) @ np.linalg.inv(P)
print(f"B^{k} via P D^{k} P^-1 =")
print(np.round(Bk, 6))
print("matches matrix_power:", np.allclose(Bk, np.linalg.matrix_power(B, k)))

# Not every matrix is diagonalizable:
J = np.array([[1.0, 1.0], [0.0, 1.0]])
values, vectors = np.linalg.eig(J)
print("eigenvalues of [[1,1],[0,1]]:", values, " rank of eigenvector matrix:", np.linalg.matrix_rank(vectors, tol=1e-8))

# Try: set k = 10. Which eigenvalue dominates B^k?`,

  'pagerank': py`import numpy as np

# Column j lists where page j links; each column sums to 1
M = np.array([[0.0, 0.5, 1/3],
              [0.5, 0.0, 1/3],
              [0.5, 0.5, 1/3]])
print("column sums:", M.sum(axis=0))

r = np.ones(3) / 3
for _ in range(50):
    r = M @ r
print("steady state:", np.round(r, 4), " (2/7, 2/7, 3/7 =", np.round([2/7, 2/7, 3/7], 4), ")")

values, vectors = np.linalg.eig(M)
top = np.real(vectors[:, np.argmax(np.real(values))])
print("eigenvector for eigenvalue 1, scaled to sum 1:", np.round(top / top.sum(), 4))

d = 0.85
G = d * M + (1 - d) / 3 * np.ones((3, 3))
r = np.ones(3) / 3
for _ in range(50):
    r = G @ r
print("with damping 0.85:", np.round(r, 4))

# Try: make page 1 link only to page 3 (column 0 = [0, 0, 1]). How do the ranks change?`,

  'orthogonality': py`import numpy as np

u = np.array([1.0, 1.0])
v = np.array([1.0, -1.0])
print("u . v =", u @ v)

q1, q2 = u / np.linalg.norm(u), v / np.linalg.norm(v)
x = np.array([3.0, 1.0])
c1, c2 = q1 @ x, q2 @ x
print("coordinates by dot products:", round(c1, 4), round(c2, 4))
print("rebuild x:", c1 * q1 + c2 * q2)

Q = np.column_stack([q1, q2])
print("Q^T Q =")
print(np.round(Q.T @ Q, 6) + 0.0)
print("|Qx| == |x|:", np.isclose(np.linalg.norm(Q @ x), np.linalg.norm(x)))

# Try: use v = [1, -2] (not orthogonal to u). Do dot products still give the right coordinates?`,

  'spectral-theorem': py`import numpy as np

A = np.array([[2.0, 1.0], [1.0, 2.0]])
values, Q = np.linalg.eigh(A)            # eigh is for symmetric matrices
print("eigenvalues:", values)
print("eigenvectors (columns):")
print(np.round(Q, 4))
print("orthogonal? Q^T Q = I:", np.allclose(Q.T @ Q, np.eye(2)))
print("A == Q Lambda Q^T:", np.allclose(Q @ np.diag(values) @ Q.T, A))

outer_sum = sum(values[i] * np.outer(Q[:, i], Q[:, i]) for i in range(2))
print("A == sum of lambda_i q_i q_i^T:", np.allclose(outer_sum, A))

# Try: A = [[1, 1], [0, 2]] (not symmetric) with np.linalg.eig. Are its eigenvectors orthogonal?`,

  'lu-decomposition': py`import numpy as np
import scipy.linalg as la

A = np.array([[2.0, 1.0], [4.0, 5.0]])
b = np.array([3.0, 9.0])

if A[0, 0] == 0:
    print("first pivot is 0: elimination without a row swap is impossible")
else:
    m = A[1, 0] / A[0, 0]                          # the elimination multiplier
    L = np.array([[1.0, 0.0], [m, 1.0]])
    U = np.array([A[0], A[1] - m * A[0]])
    print("L =", L.tolist(), " U =", U.tolist())
    print("L U == A:", np.allclose(L @ U, A))
    y = la.solve_triangular(L, b, lower=True)  # forward substitution
    x = la.solve_triangular(U, y)              # back substitution
    print("y =", y, " x =", x)

P, L2, U2 = la.lu(A)                           # scipy pivots: A = P L U
print("scipy (with pivoting): P^T A == L U:", np.allclose(P.T @ A, L2 @ U2))

# Try: A = [[0, 1], [1, 1]]. The hand-made L U cannot start; does scipy's pivoted version still work?`,

  'cholesky-decomposition': py`import numpy as np

A = np.array([[4.0, 2.0], [2.0, 3.0]])
L = np.linalg.cholesky(A)
print("L =")
print(np.round(L, 4))
print("L L^T == A:", np.allclose(L @ L.T, A))

# By hand for a 2 by 2 matrix [[a, b], [b, d]]
a, b, d = 4.0, 2.0, 3.0
l11 = np.sqrt(a); l21 = b / l11; l22 = np.sqrt(d - l21 ** 2)
print("by hand:", round(l11, 4), round(l21, 4), round(l22, 4))

try:
    np.linalg.cholesky(np.array([[1.0, 2.0], [2.0, 1.0]]))
except np.linalg.LinAlgError as err:
    print("[[1, 2], [2, 1]]:", err)

# Try: check the eigenvalues of [[1, 2], [2, 1]] with np.linalg.eigvalsh. Why does Cholesky fail?`,

  'svd': py`import numpy as np

A = np.array([[3.0, 0.0], [4.0, 5.0]])
W, s, Vt = np.linalg.svd(A, full_matrices=False)   # also works for non-square A
print("singular values:", np.round(s, 4), " (sqrt 45, sqrt 5 =", np.round([np.sqrt(45), np.sqrt(5)], 4), ")")
print("eigenvalues of A^T A:", np.round(np.linalg.eigvalsh(A.T @ A)[::-1], 4))
if A.shape[0] == A.shape[1]:
    print("product of singular values:", round(s.prod(), 4), " |det A| =", round(abs(np.linalg.det(A)), 4))
print("W diag(s) V^T == A:", np.allclose(W @ np.diag(s) @ Vt, A))

A1 = s[0] * np.outer(W[:, 0], Vt[0])
print("best rank-1 approximation:")
print(np.round(A1, 4))
print("approximation error (Frobenius):", round(np.linalg.norm(A - A1), 4), "= sigma_2")

# Image compression: a 48 by 48 "image" of a square and a disc, rebuilt from k singular values
i, j = np.mgrid[0:48, 0:48]
img = ((abs(i - 16) < 9) & (abs(j - 14) < 9)) * 0.9 + (((i - 30) ** 2 + (j - 32) ** 2) < 100) * 0.6
U, S, VT = np.linalg.svd(img)
for k in [1, 5, 20]:
    Ak = U[:, :k] @ np.diag(S[:k]) @ VT[:k]
    kept = (S[:k] ** 2).sum() / (S ** 2).sum()
    print(f"rank {k:2d}: stores {k * (48 + 48 + 1):4d} numbers instead of {48 * 48}, keeps {kept:.1%} of the energy")

# Try: a 3 by 2 matrix such as [[1, 0], [0, 1], [1, 1]]. SVD still works; how many singular values?`,

  'norms': py`import numpy as np

x = np.array([3.0, -4.0])
print("L1  =", np.linalg.norm(x, 1))        # |3| + |-4|
print("L2  =", np.linalg.norm(x))           # sqrt(9 + 16)
print("max =", np.linalg.norm(x, np.inf))   # largest |x_i|

# Triangle inequality: a detour is never shorter
y = np.array([1.0, 1.0])
print("||x + y|| =", np.linalg.norm(x + y), "<=", round(np.linalg.norm(x) + np.linalg.norm(y), 4))

# Distance between two points in each norm
a, b = np.array([1.0, 2.0]), np.array([4.0, 6.0])
for p in [1, 2, np.inf]:
    print(f"distance in norm {p}: {np.linalg.norm(a - b, p):.3f}")

# Try: x = [1, 1, 1, 1]. How do the three norms compare as the dimension grows?`,

  'inner-products': py`import numpy as np

A = np.array([[2.0, 1.0], [1.0, 2.0]])
print("symmetric:", np.allclose(A, A.T), " eigenvalues:", np.linalg.eigvalsh(A), "(all > 0: positive definite)")

def inner(x, y):
    return x @ A @ y

x = np.array([1.0, 0.0])
y = np.array([0.0, 1.0])
print("dot product x . y  =", x @ y)
print("<x, y>_A           =", inner(x, y))

length = lambda v: np.sqrt(inner(v, v))
cos_omega = inner(x, y) / (length(x) * length(y))
print("||x||_A =", round(length(x), 4), " ||y||_A =", round(length(y), 4))
print("angle under A:", round(np.degrees(np.arccos(cos_omega)), 1), "degrees")

z = np.array([1.0, -2.0])
print("<x, z>_A =", inner(x, z), "-> orthogonal under A")

# Try: A = [[1, 0], [0, 1]]. Which of the results turn into the ordinary dot-product ones?`,

  'orthogonal-complement': py`import sympy as sp

A = sp.Matrix([[1, 2, 3], [2, 4, 6]])
m, n = A.shape
r = A.rank()
row = A.T.columnspace()      # row space = column space of A^T
null = A.nullspace()
col = A.columnspace()
left_null = A.T.nullspace()

print("rank r =", r)
print("row space      (R^3):", [list(v) for v in row], " dim", len(row))
print("null space     (R^3):", [list(v) for v in null], " dim", len(null), "= n - r")
print("column space   (R^2):", [list(v) for v in col], " dim", len(col))
print("left null space(R^2):", [list(v) for v in left_null], " dim", len(left_null), "= m - r")

print("row . null:", [(row[0].T * v)[0] for v in null])
print("col . left null:", [(col[0].T * v)[0] for v in left_null])

# Split x into a row-space part and a null-space part
x = sp.Matrix([1, 0, 0])
rv = row[0]
x_row = (rv.dot(x) / rv.dot(rv)) * rv
x_null = x - x_row
print("x_row =", list(x_row), " x_null =", list(x_null), " A x_null =", list(A * x_null))

# Try: A = [[1, 0, 1], [0, 1, 1]] (rank 2). What are the four dimensions now?`,

  'orthogonal-projections': py`import numpy as np

B = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])   # columns b1, b2 span a plane in R^3
x = np.array([1.0, 2.0, 6.0])

lam = np.linalg.solve(B.T @ B, B.T @ x)    # normal equation B^T B lam = B^T x
proj = B @ lam
e = x - proj
print("B^T B =", (B.T @ B).tolist(), " B^T x =", B.T @ x)
print("coordinates lambda =", lam)
print("projection =", proj, " error =", e)
print("error . b1 =", e @ B[:, 0], " error . b2 =", e @ B[:, 1])
print("distance to the plane =", round(np.linalg.norm(e), 4))

P = B @ np.linalg.inv(B.T @ B) @ B.T
print("P^2 == P:", np.allclose(P @ P, P), " P symmetric:", np.allclose(P, P.T))

# Projection onto a line through b
b = np.array([1.0, 2.0, 2.0])
print("projection onto the line through b:", (b @ x) / (b @ b) * b)

# Try: move x to [2, 3, 5]. It is already in the plane: what are the projection and the error?`,

  'gram-schmidt': py`import numpy as np

def gram_schmidt(vectors):
    basis = []
    for b in vectors:
        u = b.astype(float)
        for q in basis:
            u = u - (q @ b) * q          # remove the part along each earlier direction
        basis.append(u / np.linalg.norm(u))
    return np.array(basis)

b1 = np.array([3.0, 1.0])
b2 = np.array([2.0, 2.0])
Q = gram_schmidt([b1, b2])
print("q1 =", np.round(Q[0], 4), " (= [3, 1]/sqrt(10))")
print("q2 =", np.round(Q[1], 4), " (= [-1, 3]/sqrt(10))")
print("Q Q^T == I:", np.allclose(Q @ Q.T, np.eye(2)))

# The same thing as a QR factorization of A = [b1 b2]
A = np.column_stack([b1, b2])
Qm, R = np.linalg.qr(A)
print("QR: R =")
print(np.round(R, 4))
print("(numpy may flip the sign of a column of Q and the matching row of R)")

# Try: swap the order, gram_schmidt([b2, b1]). Do you get the same basis?`,

  'trace': py`import numpy as np

A = np.array([[4.0, 1.0], [2.0, 3.0]])
eig = np.linalg.eigvals(A)
print("trace =", np.trace(A), " det =", round(np.linalg.det(A), 4))
print("eigenvalues:", np.sort(eig)[::-1])
print("sum =", round(eig.sum().real, 4), " product =", round(eig.prod().real, 4))

B = np.array([[1.0, 0.0], [1.0, 1.0]])
print("AB =", (A @ B).tolist(), " BA =", (B @ A).tolist())
print("tr(AB) =", np.trace(A @ B), " tr(BA) =", np.trace(B @ A))

# The trace does not change under a change of basis
P = np.array([[1.0, 2.0], [0.0, 1.0]])
print("tr(P^-1 A P) =", round(np.trace(np.linalg.inv(P) @ A @ P), 4))

# Total variance of data = trace of its covariance matrix
rng = np.random.default_rng(0)
X = rng.normal(size=(500, 3)) * [1.0, 2.0, 3.0]
S = np.cov(X.T)
print("sum of feature variances:", round(X.var(axis=0, ddof=1).sum(), 3), " tr(S):", round(np.trace(S), 3))

# Try: A = [[0, -1], [1, 0]] (a rotation). The eigenvalues are complex: do they still sum to the trace?`,

  'pca': py`import numpy as np
import matplotlib.pyplot as plt

X = np.array([[2.0, 2.0], [-2.0, -2.0], [1.0, -1.0], [-1.0, 1.0]])
X = X - X.mean(axis=0)                  # center (already centered here)
S = X.T @ X / len(X)                    # covariance with 1/N
values, vectors = np.linalg.eigh(S)     # ascending order
order = np.argsort(values)[::-1]
values, vectors = values[order], vectors[:, order]
print("S =", S.tolist())
print("eigenvalues:", values, " trace:", np.trace(S))

b1 = vectors[:, 0]
z = X @ b1                              # 1-number codes
X_tilde = np.outer(z, b1)               # reconstructions
print("first component b1 =", np.round(b1, 4))
print("codes z =", np.round(z, 3), " mean z^2 =", round(np.mean(z ** 2), 4))
print("average squared error =", round(np.mean(np.sum((X - X_tilde) ** 2, axis=1)), 4), "= lambda_2")
print("explained variance:", f"{values[0] / values.sum():.0%}")

# A bigger cloud: PCA via the SVD of the centered data gives the same directions
rng = np.random.default_rng(1)
D = rng.normal(size=(300, 2)) @ np.array([[2.0, 0.0], [1.2, 0.6]])
D = D - D.mean(axis=0)
_, s, Vt = np.linalg.svd(D, full_matrices=False)
print("variances from the SVD:", np.round(s ** 2 / len(D), 3))
plt.scatter(D[:, 0], D[:, 1], s=8, alpha=0.5)
for sv, v in zip(s, Vt):
    L = 2 * sv / np.sqrt(len(D))
    plt.plot([0, L * v[0]], [0, L * v[1]], linewidth=3)
plt.axis("equal"); plt.title("Principal directions")

# Try: multiply the first feature of D by 10 before PCA. Which direction wins now, and why?`,

  'momentum': py`import numpy as np

def run(grad, x0, gamma, alpha, steps):
    x, prev = np.array(x0, float), np.array(x0, float)
    path = [x.copy()]
    for _ in range(steps):
        x, prev = x - gamma * grad(x) + alpha * (x - prev), x
        path.append(x.copy())
    return np.array(path)

# 1D example from the page: f(x) = x^2
grad1 = lambda x: 2 * x
print("plain:   ", np.round(run(grad1, [10.0], 0.1, 0.0, 3)[:, 0], 3))
print("momentum:", np.round(run(grad1, [10.0], 0.1, 0.5, 3)[:, 0], 3))

# Narrow valley: f = (x1^2 + 20 x2^2) / 2
f = lambda x: 0.5 * (x[0] ** 2 + 20 * x[1] ** 2)
grad2 = lambda x: np.array([x[0], 20 * x[1]])
for alpha in [0.0, 0.5, 0.8, 0.95]:
    path = run(grad2, [-7.0, 2.0], 0.09, alpha, 40)
    print(f"alpha = {alpha:.2f}: f after 40 steps = {f(path[-1]):.2e}")

# Try: with alpha = 0, raise gamma to 0.11 (above 2/20). What happens to f?`,

  'lagrange-multipliers': py`import sympy as sp

x, y, lam = sp.symbols("x y lambda", real=True)

# Equality constraint: minimize x^2 + y^2 subject to x + y = 1
f = x ** 2 + y ** 2
h = x + y - 1
L = f + lam * h
sol = sp.solve([sp.diff(L, x), sp.diff(L, y), sp.diff(L, lam)], [x, y, lam], dict=True)[0]
print("solution:", sol, " f =", f.subs(sol))
grad_f = [sp.diff(f, v).subs(sol) for v in (x, y)]
grad_h = [sp.diff(h, v) for v in (x, y)]
print("grad f =", grad_f, " grad h =", grad_h, "(parallel)")

# The multiplier is the price of the constraint: with x + y = c, the best f is c^2/2
c = sp.symbols("c", positive=True)
best = sp.Rational(1, 2) * c ** 2
print("d(best f)/dc at c = 1:", sp.diff(best, c).subs(c, 1), "= -lambda")

# Inequality constraint: minimize (x - 2)^2 subject to x <= 1, i.e. g(x) = x - 1 <= 0
g_obj = (x - 2) ** 2
x_star = 1                                   # the unconstrained minimum x = 2 breaks the constraint
mu = -sp.diff(g_obj, x).subs(x, x_star)      # from d/dx [(x-2)^2 + mu (x - 1)] = 0
print("active constraint at x = 1, multiplier =", mu, "(>= 0, as required)")

# Try: change the inequality to x <= 3. Is the constraint active, and what is the multiplier?`,

  'derivatives': py`import sympy as sp

x = sp.symbols("x")
f = (2 * x + 1) ** 3
df = sp.diff(f, x)
print("f'(x) =", sp.factor(df), " f'(1) =", df.subs(x, 1))

# Difference quotients approach the derivative as h shrinks
fn = sp.lambdify(x, f)
for h in [1.0, 0.1, 0.01, 0.001]:
    print(f"h = {h:<6} (f(1+h) - f(1))/h = {(fn(1 + h) - fn(1)) / h:.4f}")

# The sigmoid's derivative is sigma (1 - sigma)
s = sp.symbols("s")
sigma = 1 / (1 + sp.exp(-s))
print("sigma'(s) - sigma(1 - sigma) simplifies to", sp.simplify(sp.diff(sigma, s) - sigma * (1 - sigma)))
print("slope at s = 0:", sp.diff(sigma, s).subs(s, 0))

# Try: differentiate sp.log(1 + sp.exp(-x)) and compare it with -sigma(-x).`,

  'partial-derivatives-gradient': py`import numpy as np
import sympy as sp

x, y = sp.symbols("x y")
f = x ** 2 * y + 3 * y
grad = [sp.diff(f, v) for v in (x, y)]
g = np.array([float(d.subs({x: 1, y: 2})) for d in grad])
print("gradient formula:", grad, " at (1, 2):", g)

# Numerical check, one coordinate at a time
fn = sp.lambdify((x, y), f)
h = 1e-3
print("numerical:", [round((fn(1 + h, 2) - fn(1, 2)) / h, 3), round((fn(1, 2 + h) - fn(1, 2)) / h, 3)])

# Directional derivatives: largest along the gradient, zero along the contour
for name, u in [("[1, 0]", [1, 0]), ("gradient direction", g / np.linalg.norm(g)), ("[1, -1]/sqrt 2", [1 / np.sqrt(2), -1 / np.sqrt(2)])]:
    print(f"slope along {name}: {g @ np.array(u):.3f}")
print("||grad|| =", round(np.linalg.norm(g), 3))

# Try: f = x**2 + y**2 at (3, 4). Which way does the gradient point?`,

  'jacobian-chain-rule': py`import sympy as sp

r, th = sp.symbols("r theta", positive=True)
f = sp.Matrix([r * sp.cos(th), r * sp.sin(th)])
J = f.jacobian([r, th])
print("J =", J)
print("det J =", sp.simplify(J.det()))
J0 = J.subs({r: 2, th: 0})
print("J at r = 2, theta = 0:", J0.tolist())
print("step dr = 0.01 moves by", [float(v) for v in J0 * sp.Matrix([0.01, 0])], " step dtheta = 0.01 moves by", [float(v) for v in J0 * sp.Matrix([0, 0.01])])

# Chain rule: gradient of g(f(r, theta)) = (gradient of g at f) times J
x, y = sp.symbols("x y")
g = x ** 2 + y ** 2
grad_g = sp.Matrix([[sp.diff(g, x), sp.diff(g, y)]]).subs({x: 2, y: 0})
print("chain rule:", (grad_g * J0).tolist())
print("direct:", [sp.diff(g.subs({x: f[0], y: f[1]}), v).subs({r: 2, th: 0}) for v in (r, th)])

# Try: the Jacobian of the linear map [2x + y, x - 3y]. Is it the matrix of the map?`,

  'loss-gradients': py`import numpy as np

# Least squares through the origin on (1, 2) and (2, 3)
X = np.array([[1.0], [2.0]])
y = np.array([2.0, 3.0])
loss = lambda th: np.sum((y - X @ th) ** 2)
grad = lambda th: -2 * (y - X @ th) @ X          # dL/dtheta = -2 (y - X theta)^T X
th = np.array([0.0])
print("gradient at 0:", grad(th))
eps = 1e-6
print("numerical check:", (loss(th + eps) - loss(th - eps)) / (2 * eps))
print("normal equation:", np.linalg.solve(X.T @ X, X.T @ y))

# Logistic loss for one example x = [1, 2], y = 1 (the leading 1 is the offset)
x1 = np.array([1.0, 2.0])
sigma = lambda s: 1 / (1 + np.exp(-s))
theta = np.zeros(2)
g = (sigma(theta @ x1) - 1) * x1
print("logistic gradient:", g)
theta = theta - 0.5 * g
print("after one step: theta =", theta, " sigma =", round(sigma(theta @ x1), 4))

# The quadratic-form rule: gradient of x^T A x is x^T (A + A^T)
A = np.array([[1.0, 2.0], [0.0, 3.0]])
v = np.array([1.0, -1.0])
f = lambda z: z @ A @ z
numeric = [(f(v + eps * e) - f(v - eps * e)) / (2 * eps) for e in np.eye(2)]
print("x^T (A + A^T):", v @ (A + A.T), " numerical:", np.round(numeric, 6))

# Try: use 2 x^T A instead. Why is it wrong for this A?`,

  'backpropagation': py`import numpy as np

def forward_backward(w, b, x, y):
    # forward pass: store every intermediate value
    z = w * x + b
    m = y * z
    L = np.log1p(np.exp(-m))
    # backward pass: chain rule from the output toward the inputs
    dL_dm = -1 / (1 + np.exp(m))            # = -e^(-m) / (1 + e^(-m)) = -sigma(-m), without overflow
    dL_dz = dL_dm * y
    return L, {"m": dL_dm, "z": dL_dz, "w": dL_dz * x, "b": dL_dz}

L, grads = forward_backward(0.5, -0.5, 2.0, 1.0)
print("loss:", round(float(L), 4))
print("gradients:", {k: round(float(v), 4) for k, v in grads.items()})

# Check against finite differences
eps = 1e-6
num_w = (forward_backward(0.5 + eps, -0.5, 2.0, 1.0)[0] - forward_backward(0.5 - eps, -0.5, 2.0, 1.0)[0]) / (2 * eps)
print("finite-difference dL/dw:", round(num_w, 4))

# Training = gradient descent using these gradients
w, b = 0.5, -0.5
for _ in range(20):
    L, g = forward_backward(w, b, 2.0, 1.0)
    w, b = w - 0.5 * g["w"], b - 0.5 * g["b"]
print("after 20 steps: w =", round(w, 3), " b =", round(b, 3), " loss =", round(forward_backward(w, b, 2.0, 1.0)[0], 4))

# Try: set y = -1. Which way do the gradients point now?`,

  'taylor-hessian': py`import numpy as np
import sympy as sp

x = sp.symbols("x")
print("Taylor series of e^x:", sp.series(sp.exp(x), x, 0, 4))
for n in [1, 2, 3]:
    Tn = sp.series(sp.exp(x), x, 0, n + 1).removeO()
    print(f"T{n}(0.5) = {float(Tn.subs(x, 0.5)):.4f}   error = {float(sp.exp(0.5) - Tn.subs(x, 0.5)):.4f}")

# Hessian and the second-derivative test
a, b = sp.symbols("a b")
f = a ** 2 + 3 * a * b + b ** 2
H = sp.hessian(f, (a, b))
print("gradient:", [sp.diff(f, v) for v in (a, b)], " Hessian:", H.tolist())
eig = np.linalg.eigvalsh(np.array(H, dtype=float))
print("Hessian eigenvalues:", eig, "->", "saddle" if eig.min() < 0 < eig.max() else "minimum or maximum")
t = sp.symbols("t")
print("f along [1, -1]:", sp.expand(f.subs({a: t, b: -t})))

# Newton's method finds the minimum of a quadratic in one step
g = (a - 1) ** 2 + 2 * (b + 2) ** 2
p = sp.Matrix([5, 5])
grad = sp.Matrix([sp.diff(g, v) for v in (a, b)]).subs({a: p[0], b: p[1]})
step = p - sp.hessian(g, (a, b)).inv() * grad
print("Newton step from (5, 5):", list(step))

# Try: f = a**2 + b**2 + a*b. Is the origin now a minimum?`,

  'max-margin-svm': py`import numpy as np

# The two-point example: support vectors on the margin lines
X = np.array([[2.0, 2.0], [0.0, 0.0]])
y = np.array([1, -1])
theta, theta0 = np.array([0.5, 0.5]), -1.0
print("signed margins:", y * (X @ theta + theta0))
print("margin width 2/||theta|| =", round(2 / np.linalg.norm(theta), 4), " distance between points:", round(np.linalg.norm(X[0] - X[1]), 4))

# Soft-margin SVM by subgradient descent on (lambda/2)||theta||^2 + mean hinge loss
rng = np.random.default_rng(0)
pos = rng.normal([2, 2], 0.8, size=(20, 2))
neg = rng.normal([-1, -1], 0.8, size=(20, 2))
X = np.vstack([pos, neg]); y = np.r_[np.ones(20), -np.ones(20)]

def train(lam, steps=6000):
    th, th0 = np.zeros(2), 0.0
    avg, avg0 = np.zeros(2), 0.0
    for k in range(1, steps + 1):
        eta = 1 / (lam * (k + 10))
        viol = y * (X @ th + th0) < 1
        g = lam * th - (y[viol, None] * X[viol]).sum(axis=0) / len(y)
        g0 = -y[viol].sum() / len(y)
        th, th0 = th - eta * g, th0 - eta * g0
        if k > steps // 2:                    # average the second half of the iterates
            avg += th / (steps - steps // 2); avg0 += th0 / (steps - steps // 2)
    return avg, avg0

for lam in [0.01, 0.1, 1.0]:
    th, th0 = train(lam)
    m = y * (X @ th + th0)
    print(f"lambda = {lam:<4}: margin width {2 / np.linalg.norm(th):.2f}, points on or inside margin {np.sum(m <= 1.001)}, training errors {np.sum(m <= 0)}")

# Try: move the negative cloud to [1, 1] so the classes overlap. What happens to the errors?`,

  'feature-scaling': py`import numpy as np

area = np.array([1000.0, 1500.0, 2000.0])     # training values
mu, sigma = area.mean(), area.std()            # statistics from the TRAINING set only
print("mu =", mu, " sigma =", round(sigma, 1))
print("standardized training values:", np.round((area - mu) / sigma, 2))
print("test house 2500 ->", round((2500 - mu) / sigma, 2))

# Leakage: statistics recomputed with the test point shift every value
leaky = np.append(area, 2500.0)
print("with leakage, the same training values become:", np.round((area - leaky.mean()) / leaky.std(), 2))

# Why it matters for gradient descent: count steps to fit y = w1 x1 + w2 x2
rng = np.random.default_rng(0)
x1 = rng.normal(size=200)
x2 = rng.normal(size=200) * 1000               # a feature measured in much larger units
y = 3 * x1 + 0.002 * x2 + rng.normal(scale=0.1, size=200)

def steps_needed(X):
    H = X.T @ X / len(X)
    alpha = 1 / np.linalg.eigvalsh(H).max()    # the largest safe-ish step
    w = np.zeros(2)
    best = np.linalg.lstsq(X, y, rcond=None)[0]
    for k in range(1, 200001):
        w -= alpha * X.T @ (X @ w - y) / len(X)
        if np.linalg.norm(X @ (w - best)) < 1e-3 * np.linalg.norm(X @ best):
            return k
    return "over 200000"

raw = np.column_stack([x1, x2])
std = (raw - raw.mean(axis=0)) / raw.std(axis=0)
print("condition number raw:", round(np.linalg.cond(raw.T @ raw)), " standardized:", round(np.linalg.cond(std.T @ std), 2))
print("gradient steps raw:", steps_needed(raw), " standardized:", steps_needed(std))

# Try: scale x2 by 10 instead of 1000. How do the condition number and the step count change?`,

  'bias-variance': py`import numpy as np

# The three-prediction example from the page
f_true = 2.0
for name, preds in [("simple", [1.5, 1.6, 1.4]), ("flexible", [1.2, 2.9, 2.0])]:
    p = np.array(preds)
    print(f"{name:8s}: bias^2 = {(p.mean() - f_true) ** 2:.4f}, variance = {p.var():.4f}")

# Simulation: fit polynomials to many noisy training sets from a sine curve
rng = np.random.default_rng(1)
f = lambda x: np.sin(2 * np.pi * x)
x = np.linspace(0, 1, 12)                      # 12 fixed, evenly spaced inputs
x_test = x
noise = 0.4
for degree in [0, 1, 3, 5, 9]:
    preds = []
    for _ in range(200):                       # 200 training sets: same inputs, fresh noise
        y = f(x) + rng.normal(scale=noise, size=12)
        coef = np.polyfit(x, y, degree)
        preds.append(np.polyval(coef, x_test))
    preds = np.array(preds)
    bias2 = np.mean((preds.mean(axis=0) - f(x_test)) ** 2)
    var = np.mean(preds.var(axis=0))
    print(f"degree {degree}: bias^2 = {bias2:.3f}  variance = {var:.3f}  expected test error = {bias2 + var + noise ** 2:.3f}")

# Try: use 48 training points instead of 12. Which term shrinks?`,

  'roc-auc': py`import numpy as np

pos = np.array([0.9, 0.8, 0.4])
neg = np.array([0.7, 0.3, 0.2])

for t in [0.75, 0.5, 0.35]:
    print(f"threshold {t}: TPR = {np.mean(pos > t):.3f}, FPR = {np.mean(neg > t):.3f}")

# AUC = fraction of positive-negative pairs ranked correctly (ties count 1/2)
pairs = [(p > n) + 0.5 * (p == n) for p in pos for n in neg]
print("AUC from pairs:", round(np.mean(pairs), 4))

# The ROC curve: sweep the threshold over every score
scores = np.r_[pos, neg]; labels = np.r_[np.ones(3), np.zeros(3)]
points = [(0.0, 0.0)]
for t in sorted(scores, reverse=True):
    points.append((np.mean(neg >= t), np.mean(pos >= t)))
print("ROC points (FPR, TPR):", [(round(float(a), 3), round(float(b), 3)) for a, b in points])
fpr, tpr = zip(*points)
print("AUC by the trapezoid rule:", round(np.trapezoid(tpr, fpr) if hasattr(np, "trapezoid") else np.trapz(tpr, fpr), 4))

# Try: give the third positive a score of 0.75. What happens to the AUC?`,

  'ml-in-production': py`import numpy as np

# Accuracy decay and retraining (the page's example)
A0, decay = 92.0, 1.5
months = np.arange(0, 24, 0.01)
for T in [1, 3, 6, 24]:
    acc = A0 - decay * (months % T)
    print(f"retrain every {T:2d} months: average accuracy {acc.mean():.2f}%, retrains in 2 years: {int(np.ceil(24 / T)) - 1}")

# Covariate shift in action: a model trained on one input range, used on another
rng = np.random.default_rng(0)
def make(n, center):
    x = rng.normal(center, 1.0, n)
    y = (np.sin(x) > 0).astype(int)            # the true rule is not linear
    return x, y
x_tr, y_tr = make(2000, 1.0)
X = np.c_[np.ones_like(x_tr), x_tr]
w = np.zeros(2)
for _ in range(3000):                          # logistic regression by gradient descent
    p = 1 / (1 + np.exp(-X @ w))
    w -= 0.5 * X.T @ (p - y_tr) / len(y_tr)
for center in [1.0, 2.0, 3.0]:
    x, yv = make(2000, center)
    pred = (np.c_[np.ones_like(x), x] @ w > 0).astype(int)
    print(f"inputs centred at {center}: accuracy {np.mean(pred == yv):.3f}")

# Try: retrain on data centred at 3.0. Does the accuracy there recover?`,

  'ml-landscape': py`import numpy as np

# A tiny table in the style of the Lesson 1 case study: rows are tumours, columns are features
rng = np.random.default_rng(0)
n, d = 8, 3                                   # the real data set has 30 features per tumour
X = rng.normal(size=(n, d))
recurred = np.where(X[:, 0] + 0.5 * X[:, 1] > 0, 1, -1)       # classification target: +1 = R, -1 = N
months = np.round(24 + 6 * X[:, 2] - 4 * X[:, 0], 1)          # regression target: months until recurrence
print("feature matrix X: shape", X.shape, "(examples x features)")
print("classification labels:", recurred)
print("regression targets:  ", months)

# Supervised learning fits a mapping for each target
Xb = np.c_[X, np.ones(n)]                                     # a constant feature for the offset
w_reg = np.linalg.lstsq(Xb, months, rcond=None)[0]
print("regression fit (least squares):", np.round(w_reg, 2))
theta = np.zeros(d + 1)
for _ in range(20):                                           # perceptron for the class label
    for t in range(n):
        if recurred[t] * (theta @ Xb[t]) <= 0:
            theta += recurred[t] * Xb[t]
print("classifier training errors:", int(np.sum(recurred * (Xb @ theta) <= 0)))

# Try: shift the new tumours' features by +2 (X + 2). Do the classifier's predictions still make sense?`,
};
