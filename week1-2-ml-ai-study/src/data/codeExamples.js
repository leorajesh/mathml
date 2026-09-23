export const codeExamples = {
  'ml-workflow': `import numpy as np

X = np.array([[1, 2], [0, 0], [1, 1]])
y = np.array([1, -1, 1])
theta = np.array([2, 1])
theta0 = -2
scores = X @ theta + theta0
pred = np.where(scores >= 0, 1, -1)
train_error = np.mean(pred != y)
print(scores, pred, train_error)`,
  'sets-functions': `U = {1, 2, 3, 4, 5}
A = {1, 2, 3}
B = {3, 4}
print(A | B)      # union
print(A & B)      # intersection
print(A - B)      # difference
print(U - A)      # complement in U

f = {1: 2, 2: 3}
f_inv = {v: k for k, v in f.items()}
print(f_inv[3])`,
  'feature-vectors': `import numpy as np

x = np.array([2.0, 3.0])
theta = np.array([4.0, -1.0])
score = theta @ x
print(score)`,
  'matrix-operations': `import numpy as np

A = np.array([[1, 2], [3, 4]])
print(2 * A)
print(A.T)
print(A + A.T)`,
  'matrix-multiplication-outer-product': `import numpy as np

A = np.array([[1, 2], [-2, 1]])
B = np.array([[3, 5], [-1, 4]])
print(A @ B)

a = np.array([1, 2, -1])
b = np.array([2, 1])
print(np.outer(a, b))`,
  'matrix-systems': `import numpy as np

A = np.array([[2, 1], [1, -1]], dtype=float)
b = np.array([5, 1], dtype=float)
x = np.linalg.solve(A, b)
print(x)`,
  'gaussian-elimination': `import numpy as np

M = np.array([[1, 2, 1, 4], [2, 1, 1, 5], [1, 1, 2, 5]], dtype=float)
M[1] = M[1] - 2 * M[0]
M[2] = M[2] - M[0]
M[2] = M[2] - (1 / 3) * M[1]
print(M)`,
  'solution-structure': `import sympy as sp

A = sp.Matrix([[1, 2, -1], [2, 4, -2]])
b = sp.Matrix([3, 6])
print(A.rank(), A.nullspace())
print(sp.linsolve((A, b)))`,
  'vector-spaces-bases': `import numpy as np

e1 = np.array([1, 0])
e2 = np.array([0, 1])
v = 3 * e1 - 2 * e2
print(v)
B = np.column_stack([e1, e2])
print(np.linalg.matrix_rank(B))`,
  'linear-independence-subspaces': `import sympy as sp

V = sp.Matrix([[1, 3, 5], [2, 8, 6], [1, 2, 7]])
print(V.rref())
print('rank =', V.rank())
print('dependent?', V.rank() < V.shape[1])`,
  'linear-transformations': `import numpy as np

A = np.array([[2, 0], [0, 1]])
x = np.array([1, 3])
print(A @ x)`,
  'transformation-matrix': `import numpy as np

def T(x):
    return np.array([x[0], -x[1]])

e1 = np.array([1, 0])
e2 = np.array([0, 1])
T_matrix = np.column_stack([T(e1), T(e2)])
print(T_matrix)`,
  'composition-of-transformations': `import numpy as np

R = np.array([[0, -1], [1, 0]])
F = np.array([[1, 0], [0, -1]])
print(F @ R)  # rotate then reflect
print(R @ F)  # reflect then rotate`,
  'change-of-basis': `import numpy as np

P = np.array([[1, 1], [1, -1]], dtype=float)
v_std = np.array([3, 1], dtype=float)
v_B = np.linalg.solve(P, v_std)
print(v_B)`,
  'invertible-transformations': `import numpy as np

A = np.array([[3, 5], [-1, 4]], dtype=float)
print(np.linalg.det(A))
A_inv = np.linalg.inv(A)
print(A_inv)
print(A @ A_inv)`,
  'affine-dimensionality-reduction': `import numpy as np

x = np.array([3.0, 1.0])
u = np.array([1.0, 1.0]) / np.sqrt(2)
z = u @ x
x_hat = z * u
error = np.sum((x - x_hat) ** 2)
print(z, x_hat, error)`,
  'rank-inverse-determinant': `import numpy as np

A = np.array([[2, 1], [1, 1]], dtype=float)
print('rank', np.linalg.matrix_rank(A))
print('det', np.linalg.det(A))
print('inverse', np.linalg.inv(A))`,
  'determinants-cofactor-row-ops': `import sympy as sp

A = sp.Matrix([[3, 2, 2], [2, 3, 2], [2, 2, 3]])
print(A.det())
# Cofactor expansion along first row
print(A[0, 0] * A.minor_submatrix(0, 0).det()
      - A[0, 1] * A.minor_submatrix(0, 1).det()
      + A[0, 2] * A.minor_submatrix(0, 2).det())`,
  'linear-classifier': `import numpy as np

def predict(X, theta, theta0):
    scores = X @ theta + theta0
    return np.where(scores >= 0, 1, -1)

X = np.array([[1, 2], [1, 0]])
theta = np.array([1, 2])
print(predict(X, theta, -3))`,
  'linear-classifier-through-origin': `import numpy as np

X = np.array([[2, 1], [1, 2]])
theta = np.array([1, -1])
scores = X @ theta
pred = np.where(scores >= 0, 1, -1)
print(scores, pred)`,
  'linear-separability': `import numpy as np

X = np.array([[1.0], [3.0]])
y = np.array([-1, 1])
theta = np.array([1.0])
theta0 = -2.0
margins = y * (X @ theta + theta0)
print(margins, np.all(margins > 0))`,
  'perceptron': `import numpy as np

X = np.array([[2, 1], [-1, -1], [1, 2]], dtype=float)
y = np.array([1, -1, 1])
theta = np.zeros(2)
theta0 = 0.0
for _ in range(10):
    for x_i, y_i in zip(X, y):
        if y_i * (theta @ x_i + theta0) <= 0:
            theta += y_i * x_i
            theta0 += y_i
print(theta, theta0)`,
  'perceptron-convergence': `import numpy as np

R = 3.0       # max ||x||
gamma = 0.5   # separating margin
mistake_bound = (R / gamma) ** 2
print(mistake_bound)`,
  'empirical-risk-zero-one': `import numpy as np

margins = np.array([2.0, -0.5, 0.1, -3.0])
zero_one_loss = (margins <= 0).astype(float)
print(zero_one_loss, zero_one_loss.mean())`,
  'hinge-loss': `import numpy as np

margins = np.array([1.5, 0.2, -1.0])
hinge = np.maximum(0, 1 - margins)
print(hinge, hinge.mean())`,
  'convexity-surrogate-losses': `import numpy as np

z = np.linspace(-2, 3, 6)
zero_one = (z <= 0).astype(float)
hinge = np.maximum(0, 1 - z)
print(np.c_[z, zero_one, hinge])`,
  'gradient-descent': `theta = 0.0
alpha = 0.2
for _ in range(5):
    grad = 2 * (theta - 3)
    theta = theta - alpha * grad
    print(theta)`,
  'stochastic-subgradient-descent': `import numpy as np

x = np.array([2.0, 1.0])
y = 1
theta = np.zeros(2)
eta = 0.2
if y * (theta @ x) <= 1:
    theta = theta + eta * y * x
print(theta)`,
  'linear-regression': `import numpy as np

x = np.array([3.0])
theta1 = 2.0
theta0 = 1.0
y_hat = theta1 * x + theta0
print(y_hat)`,
  'polynomial-regression': `import numpy as np

x = 2.0
features = np.array([x, x**2, x**3])
a = np.array([1.0, 0.0, 3.0])
b = 5.0
print(b + a @ features)`,
  'least-squares-normal-equation': `import numpy as np

X = np.array([[1.0], [2.0]])
y = np.array([2.0, 3.0])
theta = np.linalg.inv(X.T @ X) @ X.T @ y
print(theta)`,
  'ridge-regularization': `import numpy as np

X = np.array([[1.0], [2.0]])
y = np.array([2.0, 3.0])
lam = 0.5
n, d = X.shape
theta = np.linalg.inv(X.T @ X + n * lam * np.eye(d)) @ X.T @ y
print(theta)`,
  'lasso-elastic-net': `import numpy as np

theta = np.array([3.0, 0.0])
l1 = np.sum(np.abs(theta))
l2 = np.sum(theta ** 2)
print(l1, l2)
# In practice use sklearn.linear_model.Lasso or ElasticNet for fitting.`,
  'model-complexity-generalization': `train_loss = 0.05
test_loss = 0.80
gap = test_loss - train_loss
print(gap, 'overfitting warning' if gap > 0.2 else 'ok')`,
  'validation-cross-validation': `import numpy as np

fold_scores = np.array([0.22, 0.25, 0.20, 0.24])
cv_score = fold_scores.mean()
print(cv_score)`,
  'logistic-regression': `import numpy as np

score = 2.0
prob = 1 / (1 + np.exp(-score))
pred = int(prob >= 0.5)
print(prob, pred)`,
  'logistic-loss': `import numpy as np

y = np.array([1, 1])
h = np.array([0.8, 0.2])
loss = -(y * np.log(h) + (1 - y) * np.log(1 - h))
print(loss)`,
  'classification-metrics': `TP, FP, TN, FN = 8, 2, 90, 10
accuracy = (TP + TN) / (TP + TN + FP + FN)
precision = TP / (TP + FP)
recall = TP / (TP + FN)
specificity = TN / (TN + FP)
print(accuracy, precision, recall, specificity)`,
  'eigenvalues-eigenvectors': `import numpy as np

A = np.array([[2, 0], [0, 3]], dtype=float)
values, vectors = np.linalg.eig(A)
print(values)
print(vectors)`,
  'diagonalization-pagerank': `import numpy as np

A = np.diag([2.0, 3.0])
print(np.linalg.matrix_power(A, 3))`,
  'orthogonality-spectral-theorem': `import numpy as np

u = np.array([1.0, 1.0])
v = np.array([1.0, -1.0])
print(u @ v)
Q = np.column_stack([u / np.linalg.norm(u), v / np.linalg.norm(v)])
print(Q.T @ Q)`,
  'matrix-decompositions': `import numpy as np

A = np.array([[4, 2], [2, 3]], dtype=float)
L = np.linalg.cholesky(A)
U, s, Vt = np.linalg.svd(A)
print(L)
print(s)`,
};
