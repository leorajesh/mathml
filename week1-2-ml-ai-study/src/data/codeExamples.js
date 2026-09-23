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

  'sets-functions': py`U = {1, 2, 3, 4, 5}
A = {1, 2, 3}
B = {3, 4}

print("A union B        =", A | B)
print("A intersection B =", A & B)
print("A minus B        =", A - B)
print("complement of A  =", U - A)

# f(x) = x + 1 from {1, 2} to {2, 3}, stored as a dictionary
f = {1: 2, 2: 3}
is_bijective = len(set(f.values())) == len(f)
f_inv = {output: x for x, output in f.items()}
print("f is bijective:", is_bijective)
print("f_inv(3) =", f_inv[3])

# Try: set f = {1: 2, 2: 2}. Is it still invertible?`,

  'feature-vectors': py`import numpy as np

x = np.array([2.0, 3.0])
theta = np.array([4.0, -1.0])

contributions = theta * x
score = theta @ x
print("per-feature contributions theta_i * x_i:", contributions)
print("score theta . x =", score)
print("predicted class:", "+1" if score > 0 else "-1")

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

  'vector-spaces-bases': py`import numpy as np

e1 = np.array([1, 0])
e2 = np.array([0, 1])
v = 3 * e1 - 2 * e2
print("v = 3 e1 - 2 e2 =", v)

B = np.column_stack([e1, e2])
print("rank of [e1 e2] =", np.linalg.matrix_rank(B), "-> e1, e2 form a basis of R^2")
coeffs = np.linalg.solve(B, v)
print("coordinates of v in this basis:", coeffs)

# Try: use the basis [1, 1] and [1, -1] instead and find v's coordinates.`,

  'linear-independence-subspaces': py`import sympy as sp

v1, v2, v3 = sp.Matrix([1, 2, 1]), sp.Matrix([3, 8, 2]), sp.Matrix([5, 6, 7])
V = sp.Matrix.hstack(v1, v2, v3)

rref, pivots = V.rref()
print("RREF:", rref.tolist())
print("pivot columns:", pivots)
print("rank =", V.rank(), "-> dependent?", V.rank() < V.shape[1])
print("null space (the dependence coefficients):", [list(n) for n in V.nullspace()])
print("-11 v1 + 2 v2 + v3 =", list(-11 * v1 + 2 * v2 + v3))

# Try: change v3 to [5, 6, 8]. Are the vectors still dependent?`,

  'linear-transformations': py`import numpy as np

T = np.array([[2, 0], [0, 1]])        # T(x, y) = (2x, y)
print("T([1, 3]) =", T @ np.array([1, 3]))

P = np.array([[2, 0], [0, 1]], dtype=float)   # basis vectors as columns
v = np.array([4, 3], dtype=float)
v_B = np.linalg.solve(P, v)
print("[v]_B =", v_B)
print("rebuild v from its B-coordinates:", P @ v_B)

# Try: pick another basis for P and check that P @ v_B still gives v.`,

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

  'affine-dimensionality-reduction': py`import numpy as np

x = np.array([3.0, 1.0])
u = np.array([1.0, 1.0]) / np.sqrt(2)   # unit vector spanning the line

z = u @ x               # encode: one number
x_hat = z * u           # decode: back to 2D
error = np.sum((x - x_hat) ** 2)
print("z =", round(z, 4))
print("reconstruction x_hat =", np.round(x_hat, 4))
print("squared reconstruction error =", round(error, 4))

# Try: use u = [1, 0]. Is the error bigger or smaller?`,

  'rank-inverse-determinant': py`import numpy as np

A = np.array([[2, 1], [1, 1]], dtype=float)
n = A.shape[1]
rank = np.linalg.matrix_rank(A)
print("rank =", rank, " nullity =", n - rank)
print("det =", round(np.linalg.det(A), 6))
print("inverse =")
print(np.linalg.inv(A))

# Try: A = [[2, 1], [4, 2]]. Check rank, nullity, and det.`,

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

  'convexity-surrogate-losses': py`import numpy as np

z = np.array([-2.0, -0.4, 0.0, 0.7, 1.0, 2.0])
zero_one = (z <= 0).astype(float)
hinge = np.maximum(0, 1 - z)
for zi, a, b in zip(z, zero_one, hinge):
    print(f"z = {zi:5.1f}   zero-one = {a:.0f}   hinge = {b:.1f}")
print("hinge >= zero-one everywhere:", np.all(hinge >= zero_one))

# Chord test of convexity for hinge between a = -1 and b = 2
f = lambda t: max(0, 1 - t)
a, b = -1.0, 2.0
print("chord test holds:", all(f(l * a + (1 - l) * b) <= l * f(a) + (1 - l) * f(b) + 1e-12 for l in np.linspace(0, 1, 11)))

# Try: run the chord test on the zero-one loss with a = -1, b = 1.`,

  'gradient-descent': py`import numpy as np
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
    print(f"step {step + 1}: theta = {theta:.4f}, J = {J(theta):.4f}")

ts = np.linspace(-1, 7, 200)
plt.plot(ts, J(ts), label="J(theta) = (theta - 3)^2")
plt.plot(path, [J(t) for t in path], "o--", label="gradient descent path")
plt.xlabel("theta"); plt.legend(); plt.title(f"alpha = {alpha}")

# Try: alpha = 0.9 (overshoots) and alpha = 1.1 (diverges).`,

  'stochastic-subgradient-descent': py`import numpy as np

# The page's single step: theta = 0, x = [2, 1], y = +1, eta = 0.2
theta = np.zeros(2)
x, y_t, eta, lam = np.array([2.0, 1.0]), 1, 0.2, 0.0
if y_t * (theta @ x) < 1:
    theta = (1 - eta * lam) * theta + eta * y_t * x
print("one step:", theta)

# Many random steps on overlapping classes (no line gets every point right)
rng = np.random.default_rng(1)
X = np.array([[2, 1], [1, 3], [-1, -2], [-2, 0], [1.5, 2], [-1.5, -1]], dtype=float)
y = np.array([1, 1, -1, -1, -1, 1])
lam = 0.01
theta = np.zeros(2)
for k in range(1, 501):
    t = rng.integers(len(X))                 # one random example
    eta = 0.5 / np.sqrt(k)                   # decaying step size
    if y[t] * (theta @ X[t]) < 1:
        theta = (1 - eta * lam) * theta + eta * y[t] * X[t]
    else:
        theta = (1 - eta * lam) * theta
    if k in (1, 10, 100, 500):
        hinge = np.maximum(0, 1 - y * (X @ theta)).mean()
        print(f"step {k:3d}: theta = {np.round(theta, 3)}, ||theta|| = {np.linalg.norm(theta):.3f}, average hinge = {hinge:.3f}")

# Try: set lam = 1.0. How does ||theta|| at step 500 compare?`,

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

# Try: which theta0 would make the residual at x = 3 zero?`,

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

  'lasso-elastic-net': py`import numpy as np

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

# Try: w = -1.5. At which lambda does the lasso weight become exactly 0?`,

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

  'validation-cross-validation': py`import numpy as np

rng = np.random.default_rng(0)
x = rng.uniform(-1, 1, 60)
y = np.sin(3 * x) + 0.3 * rng.normal(size=x.size)

# Hold out a test set first; it is used exactly once, at the end.
order = rng.permutation(len(x))
test, rest = order[:20], order[20:]
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

results = {d: cv_score(d) for d in range(1, 11)}
for d, s in results.items():
    print(f"degree {d:2d}: {K}-fold CV error {s:.3f}")
best = min(results, key=results.get)
print("chosen degree:", best)

final = np.polyfit(x[rest], y[rest], best)        # refit on all non-test data
test_error = np.mean((np.polyval(final, x[test]) - y[test]) ** 2)
print(f"test error of the chosen model (reported once): {test_error:.3f}")

# Try: set K = 8. Does the chosen degree change?`,

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

# Likelihood of many examples underflows; log-likelihood does not
p = np.full(2000, 0.6)
print("product of 2000 probabilities (float64):", np.prod(p))
print("true value: about 10 **", round(np.sum(np.log10(p)), 1), "-> far below what float64 can store")
print("sum of their logs:", round(np.sum(np.log(p)), 2), "(no problem)")

# Try: set h = [0.99, 0.01]. How big is the second loss?`,

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

# Try: A = [[0, 1], [1, 0]]. Find its eigenvalues. Is one negative?`,

  'diagonalization-pagerank': py`import numpy as np

# Page example: A is already diagonal, so P = I and D = A
A = np.diag([2.0, 3.0])
print("A^3 [1, 1] =", np.linalg.matrix_power(A, 3) @ np.array([1.0, 1.0]))

# A matrix that is not diagonal: diagonalize it, then use A^k = P D^k P^-1
B = np.array([[4.0, 1.0], [2.0, 3.0]])
values, P = np.linalg.eig(B)
D = np.diag(values)
print("eigenvalues:", values)
print("P D P^-1 equals B:", np.allclose(P @ D @ np.linalg.inv(P), B))
k = 5
print(f"B^{k} via P D^{k} P^-1 matches matrix_power:", np.allclose(P @ np.diag(values ** k) @ np.linalg.inv(P), np.linalg.matrix_power(B, k)))

# PageRank-style: column j lists where page j links (each column sums to 1)
M = np.array([[0.0, 0.5, 1/3],
              [0.5, 0.0, 1/3],
              [0.5, 0.5, 1/3]])
r = np.ones(3) / 3
for _ in range(50):
    r = M @ r
print("ranks after 50 steps:", np.round(r, 4))
print("eigenvalues of M:", np.round(np.linalg.eigvals(M), 4), "-> the others fade as powers of |lambda| < 1")

# Try: set k = 10, or change a column of M (keep it summing to 1). Which page ranks highest?`,

  'orthogonality-spectral-theorem': py`import numpy as np

u = np.array([1.0, 1.0])
v = np.array([1.0, -1.0])
print("u . v =", u @ v)
Q = np.column_stack([u / np.linalg.norm(u), v / np.linalg.norm(v)])
print("Q^T Q =")
print(np.round(Q.T @ Q, 6) + 0.0)

A = np.array([[2.0, 1.0], [1.0, 2.0]])      # symmetric
values, vectors = np.linalg.eigh(A)
print("eigenvalues:", values)
print("Q Lambda Q^T equals A:", np.allclose(vectors @ np.diag(values) @ vectors.T, A))

# Try: a non-symmetric A = [[1, 1], [0, 2]]. Are its eigenvectors orthogonal?`,

  'matrix-decompositions': py`import numpy as np
import scipy.linalg as la

A = np.array([[4, 2], [2, 3]], dtype=float)

try:
    L = np.linalg.cholesky(A)          # needs A symmetric positive definite
    print("Cholesky L =")
    print(np.round(L, 4))
    print("L L^T equals A:", np.allclose(L @ L.T, A))
except np.linalg.LinAlgError as err:
    print("Cholesky failed:", err)

P, L_lu, U = la.lu(A)                  # scipy returns A = P L U, i.e. P^T A = L U
print("U (upper triangular) =")
print(np.round(U, 4))
print("P^T A equals L U:", np.allclose(P.T @ A, L_lu @ U))

W, s, Vt = np.linalg.svd(A)
print("singular values:", np.round(s, 4))
print("W diag(s) V^T equals A:", np.allclose(W @ np.diag(s) @ Vt, A))

# Try: A = [[0, 1], [1, 0]]. Cholesky fails (not positive definite) but LU and SVD still work.`,
};
