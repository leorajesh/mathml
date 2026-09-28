// Bonus worked examples for each track section, for students who want to go further. Each one is
// modelled on a worked example (or section) of the course reference book, Mathematics for Machine
// Learning (Deisenroth, Faisal and Ong), so students can compare with the original: the setup follows
// the book, but the numbers, wording and working are our own (the book is cited, never copied).
// Every number was computed and checked with a script. Keys are track section keys (see sectionKey).

const mml = (label, title, page) => ({ book: 'mml', label, title, page });
const huyen = (label, title) => ({ book: 'huyen', label, title });

export const bonusExamples = {
  'math/foundations': [
    {
      id: 'norms-two-ways', title: 'One vector, two lengths', source: mml('Examples 3.1 and 3.2', 'Manhattan Norm; Euclidean Norm', 71), pages: ['norms'],
      task: 'Find the Manhattan (L1) and Euclidean (L2) lengths of x = [2, -1, 2]. Which is larger, and why must it be?',
      steps: ['L1 adds the absolute values: |2| + |-1| + |2| = 5.', 'L2 is the straight-line length: sqrt(2² + (-1)² + 2²) = sqrt(9) = 3.', 'L1 walks along the axes, like a taxi on a grid, while L2 cuts straight across, so L1 ≥ L2 always.'],
      answer: '||x||₁ = 5 and ||x||₂ = 3.',
    },
    {
      id: 'angle-between', title: 'The angle between two vectors', source: mml('Example 3.6', 'Angle between Vectors', 77), pages: ['vectors-dot-product'],
      task: 'Find the angle between x = [1, 0, 1] and y = [1, 1, 0].',
      steps: ['Dot product: 1·1 + 0·1 + 1·0 = 1.', 'Lengths: ||x|| = sqrt(2) and ||y|| = sqrt(2).', 'cos ω = 1 / (sqrt(2)·sqrt(2)) = 1/2, so ω = 60°.'],
      answer: 'ω = 60° (cos ω = 1/2).',
    },
  ],
  'math/matrices-and-linear-systems': [
    {
      id: 'rref-system', title: 'Solving a system through its reduced row echelon form', source: mml('Example 2.7', 'Reduced Row Echelon Form', 31), pages: ['gaussian-elimination', 'solution-structure'],
      task: 'Solve x1 + 2x2 + x4 = 3, 2x1 + 4x2 + x3 = 4, x1 + 2x2 + x3 - x4 = 1. Which variables are free?',
      steps: ['Augmented matrix rows: [1, 2, 0, 1 | 3], [2, 4, 1, 0 | 4], [1, 2, 1, -1 | 1].', 'R2 - 2R1 gives [0, 0, 1, -2 | -2]; R3 - R1 gives [0, 0, 1, -2 | -2]; then R3 - R2 gives a zero row.', 'RREF: [1, 2, 0, 1 | 3] and [0, 0, 1, -2 | -2]. The pivots are in columns 1 and 3, so x2 and x4 are free.', 'Setting the free variables to 0 gives a particular solution x = [3, 0, -2, 0]. Check the second equation: 2·3 + 1·(-2) = 4.'],
      answer: 'Pivots in columns 1 and 3; free variables x2, x4; particular solution [3, 0, -2, 0].',
    },
    {
      id: 'minus-one-trick', title: 'All solutions with the minus-1 trick', source: mml('Example 2.8', 'Minus-1 Trick', 33), pages: ['solution-structure', 'rank-nullity'],
      task: 'For the system above, find a basis of the solutions of Ax = 0 and write the general solution.',
      steps: ['Take the RREF rows [1, 2, 0, 1] and [0, 0, 1, -2] and insert a row with -1 on the diagonal for each free column (2 and 4), giving a 4 by 4 matrix with rows [1, 2, 0, 1], [0, -1, 0, 0], [0, 0, 1, -2], [0, 0, 0, -1].', 'The columns that hold a -1 on the diagonal solve Ax = 0: [2, -1, 0, 0] and [1, 0, -2, -1].', 'Check the second: row 3 of A gives 1 + 0 - 2 + 1 = 0.', 'General solution = particular + null space: [3, 0, -2, 0] + a[2, -1, 0, 0] + b[1, 0, -2, -1].'],
      answer: 'x = [3, 0, -2, 0] + a[2, -1, 0, 0] + b[1, 0, -2, -1].',
    },
  ],
  'math/vector-spaces': [
    {
      id: 'dependent-vectors', title: 'Spotting linear dependence', source: mml('Example 2.13', 'Linearly Dependent Vectors', 40), pages: ['linear-independence'],
      task: 'Are x1 = [1, 2, 3], x2 = [2, 5, 7] and x3 = [1, 3, 4] linearly independent? If not, find a combination that gives 0.',
      steps: ['Look for x3 as a combination of the others: x2 - x1 = [1, 3, 4] = x3.', 'So x1 - x2 + x3 = 0, a combination with coefficients not all zero.', 'Row reduction agrees: the matrix with these columns has only 2 pivots.'],
      answer: 'Dependent: x1 - x2 + x3 = 0.',
    },
    {
      id: 'basis-of-span', title: 'Finding a basis of a span', source: mml('Example 2.17', 'Determining a Basis', 46), pages: ['basis-coordinates', 'dimension'],
      task: 'Find a basis of the span of x1 = [1, 2, 3, 1], x2 = [2, 4, 1, 3], x3 = [3, 6, 4, 4], x4 = [0, 0, 5, -1]. What is its dimension?',
      steps: ['Put the vectors as columns and reduce to row echelon form: pivots appear only in columns 1 and 2.', 'The pivot columns of the original matrix form a basis: {x1, x2}.', 'The others are combinations: x3 = x1 + x2 and x4 = 2x1 - x2 (check: 2[1, 2, 3, 1] - [2, 4, 1, 3] = [0, 0, 5, -1]).'],
      answer: 'Basis {x1, x2}; the span has dimension 2.',
    },
  ],
  'math/linear-transformations': [
    {
      id: 'matrix-from-images', title: 'A transformation matrix from the images of a basis', source: mml('Example 2.21', 'Transformation Matrix', 52), pages: ['transformation-matrix'],
      task: 'Φ maps a space with basis (b1, b2, b3) to one with basis (c1, c2): Φ(b1) = 2c1 - c2, Φ(b2) = c1 + 3c2, Φ(b3) = 4c2. Find its matrix and Φ(2b1 - b2 + b3).',
      steps: ['Each column holds the C-coordinates of one image: [2, -1], [1, 3] and [0, 4].', 'So A = [[2, 1, 0], [-1, 3, 4]], a 2 by 3 matrix.', 'The input has B-coordinates [2, -1, 1], so its image has C-coordinates A[2, -1, 1] = [4 - 1 + 0, -2 - 3 + 4] = [3, -1].'],
      answer: 'A = [[2, 1, 0], [-1, 3, 4]]; Φ(2b1 - b2 + b3) = 3c1 - c2.',
    },
    {
      id: 'image-kernel', title: 'Image and kernel of a map', source: mml('Example 2.25', 'Image and Kernel of a Linear Mapping', 59), pages: ['rank-nullity', 'subspaces'],
      task: 'For Φ(x) = Ax with A = [[1, 2, 0, 1], [0, 1, 1, 1]] from R⁴ to R², find the image and a basis of the kernel.',
      steps: ['The first two columns [1, 0] and [2, 1] are independent, so the columns span R²: the image is all of R² (rank 2).', 'Kernel: x1 + 2x2 + x4 = 0 and x2 + x3 + x4 = 0, with x3 and x4 free.', 'x3 = 1, x4 = 0 gives [2, -1, 1, 0]; x3 = 0, x4 = 1 gives [1, -1, 0, 1].', 'Check rank-nullity: 2 + 2 = 4 columns.'],
      answer: 'Image = R²; kernel = span{[2, -1, 1, 0], [1, -1, 0, 1]}.',
    },
  ],
  'math/rank-determinants-and-inverses': [
    {
      id: 'inverse-gauss', title: 'An inverse by Gaussian elimination', source: mml('Example 2.9', 'Calculating an Inverse Matrix by Gaussian Elimination', 34), pages: ['invertible-transformations'],
      task: 'Find the inverse of A = [[1, 0, 2], [2, 1, 3], [0, 1, 1]] by reducing [A | I].',
      steps: ['R2 - 2R1: [0, 1, -1 | -2, 1, 0]. Then R3 - R2: [0, 0, 2 | 2, -1, 1], and halve it: [0, 0, 1 | 1, -1/2, 1/2].', 'Clear column 3 upwards: R2 + R3 gives [0, 1, 0 | -1, 1/2, 1/2]; R1 - 2R3 gives [1, 0, 0 | -1, 1, -1].', 'The right block is A⁻¹. Check one entry of AA⁻¹: row 1 of A times column 1 of A⁻¹ is 1·(-1) + 0 + 2·1 = 1.'],
      answer: 'A⁻¹ = [[-1, 1, -1], [-1, 1/2, 1/2], [1, -1/2, 1/2]].',
    },
    {
      id: 'laplace-3x3', title: 'A 3 by 3 determinant by Laplace expansion', source: mml('Example 4.3', 'Laplace Expansion', 102), pages: ['determinants-cofactor-row-ops'],
      task: 'Find det A for A = [[2, 1, 3], [0, 4, 1], [5, 2, 0]], expanding along a row, and check with a second row.',
      steps: ['Along row 1: 2·det[[4, 1], [2, 0]] - 1·det[[0, 1], [5, 0]] + 3·det[[0, 4], [5, 2]] = 2(-2) - 1(-5) + 3(-20) = -59.', 'Along row 2, which has a zero, one term vanishes: -0 + 4·det[[2, 3], [5, 0]] - 1·det[[2, 1], [5, 2]] = 4(-15) - (-1) = -59.'],
      answer: 'det A = -59, so A is invertible.',
    },
  ],
  'math/analytic-geometry-angles-and-projections': [
    {
      id: 'other-inner-product', title: 'An inner product that is not the dot product', source: mml('Example 3.3', 'Inner Product That Is Not the Dot Product', 73), pages: ['inner-products'],
      task: 'Use <x, y> = 2x1y1 + x1y2 + x2y1 + 3x2y2. Are x = [1, 1] and y = [1, -1] orthogonal under it? Find the angle between them.',
      steps: ['This is xᵀAy with A = [[2, 1], [1, 3]], which is symmetric positive definite, so it is an inner product.', '<x, y> = 2 - 1 + 1 - 3 = -1, so they are not orthogonal here, although x · y = 0 under the dot product.', '||x||² = 2 + 1 + 1 + 3 = 7 and ||y||² = 2 - 1 - 1 + 3 = 3, so cos ω = -1/sqrt(21) ≈ -0.218 and ω ≈ 102.6°.'],
      answer: 'Not orthogonal: <x, y> = -1 and the angle is about 102.6°.',
    },
    {
      id: 'projection-matrix-line', title: 'The projection matrix onto a line', source: mml('Example 3.10', 'Projection onto a Line', 85), pages: ['orthogonal-projections'],
      task: 'Find the matrix that projects onto the line spanned by b = [2, 1, 2], and project x = [1, 1, 1] with it.',
      steps: ['P = bbᵀ / (bᵀb), and bᵀb = 4 + 1 + 4 = 9, so P = (1/9)[[4, 2, 4], [2, 1, 2], [4, 2, 4]].', 'Px = (1/9)[10, 5, 10] = (5/9)b, a multiple of b as it must be.', 'Projecting twice changes nothing: P(Px) = Px, because the result already lies on the line.'],
      answer: 'P = bbᵀ/9 and Px = (5/9)[2, 1, 2].',
    },
  ],
  'math/eigenvalues-and-eigenvectors': [
    {
      id: 'eigen-by-hand', title: 'Eigenvalues, eigenvectors and eigenspaces', source: mml('Example 4.5', 'Computing Eigenvalues, Eigenvectors, and Eigenspaces', 107), pages: ['eigenvalues-eigenvectors', 'eigenspaces-multiplicity'],
      task: 'Find the eigenvalues and eigenspaces of A = [[5, 4], [1, 2]].',
      steps: ['Characteristic polynomial: (5 - λ)(2 - λ) - 4 = λ² - 7λ + 6 = (λ - 6)(λ - 1).', 'λ = 6: A - 6I = [[-1, 4], [1, -4]] gives x1 = 4x2, so E₆ = span{[4, 1]}.', 'λ = 1: A - I = [[4, 4], [1, 1]] gives x1 = -x2, so E₁ = span{[1, -1]}.', 'Check: A[4, 1] = [24, 6] = 6[4, 1].'],
      answer: 'λ = 6 with E₆ = span{[4, 1]}; λ = 1 with E₁ = span{[1, -1]}.',
    },
    {
      id: 'eigendecomposition-power', title: 'Eigendecomposition and a matrix power', source: mml('Example 4.11', 'Eigendecomposition', 117), pages: ['diagonalization', 'spectral-theorem'],
      task: 'Write A = [[3, -1], [-1, 3]] as PDPᵀ with an orthogonal P, and use it to compute A⁵.',
      steps: ['Eigenvalues: trace 6, determinant 8, so λ = 2 and 4.', 'Eigenvectors: [1, 1]/sqrt(2) for 2 and [1, -1]/sqrt(2) for 4; they are orthonormal because A is symmetric.', 'A⁵ = P diag(2⁵, 4⁵) Pᵀ = P diag(32, 1024) Pᵀ.', 'With these eigenvectors this is [[(32 + 1024)/2, (32 - 1024)/2], [(32 - 1024)/2, (32 + 1024)/2]].'],
      answer: 'A⁵ = [[528, -496], [-496, 528]].',
    },
  ],
  'math/matrix-decompositions': [
    {
      id: 'svd-2x3', title: 'An SVD computed by hand', source: mml('Example 4.13', 'Computing the SVD', 125), pages: ['svd'],
      task: 'Find a singular value decomposition of the 2 by 3 matrix A = [[2, 0, 1], [0, 1, 0]].',
      steps: ['AAᵀ = [[5, 0], [0, 1]], so the singular values are sqrt(5) and 1, with left singular vectors u1 = [1, 0] and u2 = [0, 1].', 'Right singular vectors: v1 = Aᵀu1/σ1 = [2, 0, 1]/sqrt(5) and v2 = Aᵀu2/σ2 = [0, 1, 0]. Complete with v3 = [1, 0, -2]/sqrt(5), orthogonal to both.', 'Check: σ1 u1 v1ᵀ + σ2 u2 v2ᵀ = [[2, 0, 1], [0, 0, 0]] + [[0, 0, 0], [0, 1, 0]] = A.'],
      answer: 'σ1 = sqrt(5), σ2 = 1; U = I, V = [v1, v2, v3] as above.',
    },
    {
      id: 'cholesky-3x3-bonus', title: 'A Cholesky factor with a negative entry', source: mml('Example 4.10', 'Cholesky Factorization', 114), pages: ['cholesky-decomposition', 'positive-definite'],
      task: 'Find the Cholesky factor L of A = [[4, -2, 2], [-2, 10, -4], [2, -4, 6]].',
      steps: ['Column 1: l11 = sqrt(4) = 2, l21 = -2/2 = -1, l31 = 2/2 = 1.', 'Column 2: l22 = sqrt(10 - 1) = 3 and l32 = (-4 - (1)(-1))/3 = -1.', 'Column 3: l33 = sqrt(6 - 1 - 1) = 2. All diagonal entries are positive, so A is positive definite.'],
      answer: 'L = [[2, 0, 0], [-1, 3, 0], [1, -1, 2]], and det A = (2·3·2)² = 144.',
    },
  ],
  'math/vector-calculus': [
    {
      id: 'partials-chain', title: 'Partial derivatives with the chain rule', source: mml('Example 5.6', 'Partial Derivatives Using the Chain Rule', 146), pages: ['partial-derivatives-gradient', 'jacobian-chain-rule'],
      task: 'For f(x, y) = (2x + y²)³, find both partial derivatives and evaluate them at (1, 1).',
      steps: ['Outer function u³ with inner u = 2x + y², so each partial is 3u² times the partial of u.', '∂f/∂x = 3(2x + y²)²·2 and ∂f/∂y = 3(2x + y²)²·2y.', 'At (1, 1), u = 3: ∂f/∂x = 3·9·2 = 54 and ∂f/∂y = 3·9·2 = 54.'],
      answer: 'Gradient [54, 54] at (1, 1).',
    },
    {
      id: 'least-squares-gradient', title: 'The gradient of a least-squares loss', source: mml('Example 5.11', 'Gradient of a Least-Squares Loss in a Linear Model', 154), pages: ['loss-gradients', 'least-squares-normal-equation'],
      task: 'For L(θ) = ||y - Φθ||² with Φ = [[1, 1], [1, 2], [1, 3]] and y = [1, 2, 2], find the gradient at θ = 0 and the θ where it vanishes.',
      steps: ['dL/dθ = -2(y - Φθ)ᵀΦ. At θ = 0 this is -2yᵀΦ = -2[5, 11] = [-10, -22].', 'Setting it to zero gives the normal equation ΦᵀΦθ = Φᵀy with ΦᵀΦ = [[3, 6], [6, 14]] and Φᵀy = [5, 11].', 'det = 6, so θ = (1/6)[[14, -6], [-6, 3]][5, 11] = (1/6)[4, 3].'],
      answer: 'Gradient [-10, -22] at 0; minimum at θ = [2/3, 1/2].',
    },
  ],
  'math/probability-and-statistics': [
    {
      id: 'table-marginals', title: 'Marginal and conditional probabilities from counts', source: mml('Example 6.2', '', 179), pages: ['probability-basics'],
      task: 'X has states x1, x2 and Y has states y1, y2, y3. Out of 100 events the counts are x1: (10, 20, 10) and x2: (5, 25, 30). Find P(X = x1), P(Y = y2), P(Y = y3 | X = x2) and P(X = x2 | Y = y3).',
      steps: ['Row sums 40 and 60 give P(X = x1) = 0.4 and P(X = x2) = 0.6.', 'Column sums 15, 45 and 40 give P(Y = y2) = 0.45.', 'Condition on a row: P(Y = y3 | X = x2) = 30/60 = 0.5. Condition on a column: P(X = x2 | Y = y3) = 30/40 = 0.75.'],
      answer: '0.4, 0.45, 0.5 and 0.75.',
    },
    {
      id: 'binomial', title: 'The binomial distribution', source: mml('Example 6.9', 'Binomial Distribution', 206), pages: ['expectation-variance', 'likelihood-mle'],
      task: 'A model is wrong on 30% of inputs, independently. Out of N = 5 inputs, what is the probability of exactly 2 mistakes, and what are the mean and variance of the number of mistakes?',
      steps: ['P(m = 2) = C(5, 2)·0.3²·0.7³ = 10·0.09·0.343 ≈ 0.309.', 'Mean Nμ = 5·0.3 = 1.5.', 'Variance Nμ(1 - μ) = 5·0.3·0.7 = 1.05.'],
      answer: 'P(2 mistakes) ≈ 0.309; mean 1.5; variance 1.05.',
    },
  ],
  'math/dimensionality-reduction': [
    {
      id: 'code-coordinates', title: 'A code is a set of coordinates', source: mml('Example 10.1', 'Coordinate Representation/Code', 318), pages: ['dimensionality-reduction'],
      task: 'Compress x = [3, -1, 4] onto the subspace spanned by e1 and e2. Find the code, the reconstruction and the squared error.',
      steps: ['The code is the pair of coordinates along e1 and e2: z = [3, -1].', 'The reconstruction is 3e1 - e2 = [3, -1, 0].', 'The error is the part we dropped: ||[0, 0, 4]||² = 16.'],
      answer: 'z = [3, -1]; reconstruction [3, -1, 0]; error 16.',
    },
    {
      id: 'pca-steps', title: 'PCA in its practical steps', source: mml('Section 10.6', 'Key Steps of PCA in Practice', 336), pages: ['pca'],
      task: 'For the points (3, 1), (1, 3), (-1, -1), (-3, -3), centre the data, find the covariance matrix and the first principal component, and say how much variance it keeps.',
      steps: ['The mean is (0, 0), so the data are already centred.', 'S = (1/4)Σ x xᵀ = [[5, 4], [4, 5]].', 'Eigenvalues 9 and 1, with the first principal component b1 = [1, 1]/sqrt(2).', 'Codes z = b1·x: 2.83, 2.83, -1.41, -4.24. One component keeps 9/10 = 90% of the variance.'],
      answer: 'b1 = [1, 1]/sqrt(2), keeping 90% of the variance.',
    },
  ],
  'ml/the-learning-problem': [
    {
      id: 'data-as-vectors', title: 'Turning a record into a feature vector', source: mml('Section 8.1.1', 'Data as Vectors', 252), pages: ['feature-representation', 'feature-scaling'],
      task: 'Encode an employee record (degree: MSc from {BSc, MSc, PhD}, age 36, salary 60,000) as numbers, one-hot encoding the degree and standardizing age with training mean 40 and standard deviation 8.',
      steps: ['Degree becomes a one-hot vector over (BSc, MSc, PhD): [0, 1, 0].', 'Age standardized: (36 - 40)/8 = -0.5.', 'Salary in thousands: 60. The feature vector is [0, 1, 0, -0.5, 60].'],
      answer: 'x = [0, 1, 0, -0.5, 60].',
    },
    {
      id: 'empirical-risk', title: 'Empirical risk of a predictor', source: mml('Examples 8.1 and 8.2', 'Least-Squares Loss', 259), pages: ['ml-workflow', 'linear-regression'],
      task: 'For the predictor f(x) = θ0 + θ1x with θ = (1, 1), find the empirical risk (mean squared error) on (0, 1), (1, 2), (2, 4).',
      steps: ['Predictions: 1, 2 and 3.', 'Errors y - f(x): 0, 0 and 1.', 'Empirical risk = (0 + 0 + 1)/3 ≈ 0.333.'],
      answer: 'R = 1/3.',
    },
  ],
  'ml/linear-classification': [
    {
      id: 'distance-to-hyperplane', title: 'Which side, and how far?', source: mml('Section 12.1', 'Separating Hyperplanes', 372), pages: ['linear-classifier'],
      task: 'With w = [3, 4] and b = -10, classify (4, 2) and (1, 1) and find each point\'s signed distance to the hyperplane wᵀx + b = 0.',
      steps: ['Scores: 3·4 + 4·2 - 10 = 10 and 3 + 4 - 10 = -3, so the classes are +1 and -1.', 'Signed distance = score / ||w||, with ||w|| = 5.', 'Distances: 10/5 = 2 on the positive side and -3/5 = -0.6 on the negative side.'],
      answer: '(4, 2): class +1, distance 2. (1, 1): class -1, distance -0.6.',
    },
    {
      id: 'margin-of-data', title: 'The margin of a data set', source: mml('Section 12.2.1', 'Concept of the Margin', 374), pages: ['linear-separability', 'max-margin-svm'],
      task: 'With w = [1, 1] and b = -3, find the margin of the data (4, 2) and (3, 3) labelled +1, and (1, 1) and (0, 2) labelled -1.',
      steps: ['Signed distances y(wᵀx + b)/||w||, with ||w|| = sqrt(2): (4, 2) gives 3/sqrt(2); (3, 3) gives 3/sqrt(2).', 'For the negatives: (1, 1) gives -1·(-1)/sqrt(2) = 1/sqrt(2); (0, 2) gives 1/sqrt(2).', 'All are positive, so the data are separated, and the margin is the smallest: 1/sqrt(2) ≈ 0.707.'],
      answer: 'Margin ≈ 0.707, set by (1, 1) and (0, 2).',
    },
  ],
  'ml/losses-and-convexity': [
    {
      id: 'convexity-two-points', title: 'Checking convexity at two points', source: mml('Example 7.3', '', 237), pages: ['convex-functions'],
      task: 'Check the convexity inequality for f(x) = eˣ at x = 0 and x = 2 with θ = 1/2, then prove convexity everywhere.',
      steps: ['Left side: f(1) = e ≈ 2.718.', 'Right side: (f(0) + f(2))/2 = (1 + 7.389)/2 ≈ 4.195.', '2.718 ≤ 4.195, as convexity requires. For every x, f\'\'(x) = eˣ > 0, so f is convex everywhere.'],
      answer: 'The inequality holds (2.718 ≤ 4.195), and f\'\' > 0 proves convexity.',
    },
    {
      id: 'soft-margin-objective', title: 'The soft-margin objective', source: mml('Section 12.2.5', 'Soft Margin SVM: Loss Function View', 380), pages: ['hinge-loss', 'max-margin-svm'],
      task: 'For w = [1, 1], b = -3 and C = 1, compute the hinge losses and the objective ½||w||² + C·Σ hinge on (3, 1) +1, (1, 1) -1, (2, 1) +1, (2.5, 1) -1.',
      steps: ['Scores: 1, -1, 0 and 0.5; margins y·score: 1, 1, 0 and -0.5.', 'Hinge max(0, 1 - margin): 0, 0, 1 and 1.5.', 'Objective: ½·2 + (0 + 0 + 1 + 1.5) = 1 + 2.5 = 3.5.'],
      answer: 'Hinge losses 0, 0, 1, 1.5; objective 3.5.',
    },
  ],
  'ml/optimization': [
    {
      id: 'gd-quadratic-2d', title: 'Gradient descent on a stretched bowl', source: mml('Example 7.1', '', 228), pages: ['gradient-descent-method'],
      task: 'Minimize f(x) = ½xᵀ[[2, 0], [0, 10]]x - [2, 5]ᵀx from x = [0, 0] with step 0.1. Take two steps. What happens with step 0.25?',
      steps: ['The gradient is [2x1 - 2, 10x2 - 5], so the minimum is at [1, 0.5].', 'Step 1: gradient [-2, -5], so x = [0.2, 0.5]. Step 2: gradient [-1.6, 0], so x = [0.36, 0.5].', 'Each step multiplies the error in x1 by 1 - 0.1·2 = 0.8, while x2 is solved in one step (1 - 0.1·10 = 0).', 'With step 0.25 the x2 factor is 1 - 2.5 = -1.5: x2 overshoots further each time and diverges.'],
      answer: 'x = [0.36, 0.5] after two steps; step 0.25 diverges along x2.',
    },
    {
      id: 'lagrange-bonus', title: 'A Lagrange multiplier by hand', source: mml('Section 7.2', 'Constrained Optimization and Lagrange Multipliers', 233), pages: ['lagrange-multipliers'],
      task: 'Minimize x² + 2y² subject to x + y = 3.',
      steps: ['Lagrangian: x² + 2y² + λ(x + y - 3). Its derivatives give 2x + λ = 0 and 4y + λ = 0.', 'So 2x = 4y, that is x = 2y. The constraint gives 3y = 3, so y = 1 and x = 2, with λ = -4.', 'The minimum value is 4 + 2 = 6.'],
      answer: '(x, y) = (2, 1), minimum value 6.',
    },
  ],
  'ml/regression': [
    {
      id: 'fit-line-ml', title: 'Fitting a line by maximum likelihood', source: mml('Example 9.2', 'Fitting Lines', 295), pages: ['least-squares-normal-equation', 'linear-regression'],
      task: 'Fit y = θ0 + θ1x to (0, 1), (1, 3), (2, 4) by least squares (the maximum likelihood fit under Gaussian noise).',
      steps: ['Φ = [[1, 0], [1, 1], [1, 2]], so ΦᵀΦ = [[3, 3], [3, 5]] and Φᵀy = [8, 11].', 'det = 6, so θ = (1/6)[[5, -3], [-3, 3]][8, 11] = (1/6)[7, 9].', 'Predictions: 1.17, 2.67 and 4.17.'],
      answer: 'θ = [7/6, 3/2], so y ≈ 1.17 + 1.5x.',
    },
    {
      id: 'poly-feature-matrix', title: 'The feature matrix of a quadratic model', source: mml('Example 9.4', 'Feature Matrix for Second-order Polynomials', 296), pages: ['polynomial-regression'],
      task: 'Build the feature matrix for inputs x = -1, 0, 2 and features (1, x, x²), then predict at x = 1 and x = 2 with θ = [1, 2, -1].',
      steps: ['Rows (1, x, x²): [1, -1, 1], [1, 0, 0] and [1, 2, 4].', 'At x = 1: 1 + 2·1 - 1·1 = 2.', 'At x = 2: 1 + 2·2 - 1·4 = 1. The model is linear in θ even though it is curved in x.'],
      answer: 'Φ = [[1, -1, 1], [1, 0, 0], [1, 2, 4]]; predictions 2 and 1.',
    },
  ],
  'ml/generalization-and-regularization': [
    {
      id: 'regularized-ls', title: 'Regularized least squares', source: mml('Example 8.3', 'Regularized Least Squares', 262), pages: ['ridge-regularization'],
      task: 'Refit the line through (0, 1), (1, 3), (2, 4) with the penalty λ||θ||², λ = 1, and compare with the unregularized fit [7/6, 3/2].',
      steps: ['θ = (ΦᵀΦ + λI)⁻¹Φᵀy with ΦᵀΦ + I = [[4, 3], [3, 6]] and Φᵀy = [8, 11].', 'det = 15, so θ = (1/15)[[6, -3], [-3, 4]][8, 11] = (1/15)[15, 20].', 'Both weights shrink: the slope falls from 1.5 to 1.33. (This penalizes the intercept too, as the book\'s formula does; in practice the intercept is often left unpenalized.)'],
      answer: 'θ = [1, 4/3].',
    },
    {
      id: 'loo-cv', title: 'Leave-one-out cross-validation', source: mml('Section 8.2.4', 'Cross-Validation to Assess the Generalization Performance', 263), pages: ['cross-validation'],
      task: 'The "model" predicts the mean of its training labels. Estimate its squared error on y = 2, 4, 9 by leave-one-out cross-validation.',
      steps: ['Leave out 2: predict (4 + 9)/2 = 6.5, error 4.5² = 20.25.', 'Leave out 4: predict 5.5, error 2.25. Leave out 9: predict 3, error 36.', 'CV estimate = (20.25 + 2.25 + 36)/3 = 19.5, much larger than the training error, because 9 is unlike the others.'],
      answer: 'CV estimate 19.5.',
    },
  ],
  'ml/logistic-regression': [
    {
      id: 'bernoulli-log-odds', title: 'The sigmoid from the Bernoulli distribution', source: mml('Example 6.14', 'Bernoulli as Exponential Family', 212), pages: ['logistic-regression', 'exp-log'],
      task: 'Write the Bernoulli probability μ = 0.2 as a natural parameter (log-odds), and recover μ from it with the sigmoid.',
      steps: ['The natural parameter is the log-odds: η = ln(μ/(1 - μ)) = ln(0.25) ≈ -1.386.', 'Inverting gives μ = 1/(1 + e^(-η)) = σ(η).', 'σ(-1.386) = 1/(1 + 4) = 0.2, as expected. This is why logistic regression models the log-odds as a linear function.'],
      answer: 'η ≈ -1.386 and σ(η) = 0.2.',
    },
    {
      id: 'logistic-mle-step', title: 'One maximum-likelihood step', source: mml('Section 8.3.1', 'Maximum Likelihood Estimation', 265), pages: ['logistic-loss'],
      task: 'Two examples: x = [1, 1] with y = 1 and x = [1, -1] with y = 0 (the first feature is the offset). From θ = [0, 0], find the negative log-likelihood, its gradient, and the NLL after one step with α = 1.',
      steps: ['Both predictions are σ(0) = 0.5, so the NLL is 2 ln 2 ≈ 1.386.', 'Gradient Σ(h - y)x = (0.5 - 1)[1, 1] + (0.5 - 0)[1, -1] = [0, -1].', 'Step: θ = [0, 0] - 1·[0, -1] = [0, 1]. Now h = σ(1) ≈ 0.731 for the first example and σ(-1) ≈ 0.269 for the second.', 'New NLL = -ln 0.731 - ln(1 - 0.269) ≈ 0.627, much lower.'],
      answer: 'NLL 1.386 → 0.627 after one step to θ = [0, 1].',
    },
  ],
  'ml/ml-in-production': [
    {
      id: 'feature-drift', title: 'Is this feature drifting?', source: huyen('Ch. 8', 'Data Distribution Shifts and Monitoring'), pages: ['ml-in-production', 'feature-scaling'],
      task: 'A feature had training mean 50 and standard deviation 10. This week its live mean is 58. The alert fires when the mean moves more than 0.5 standard deviations. Should it fire?',
      steps: ['Measure the shift in training standard deviations: (58 - 50)/10 = 0.8.', '0.8 > 0.5, so the alert fires.', 'Next steps: check whether the input pipeline changed, and whether live accuracy (once labels arrive) has dropped.'],
      answer: 'Yes: a shift of 0.8 standard deviations.',
    },
    {
      id: 'prediction-shift', title: 'Monitoring predictions before labels arrive', source: huyen('Ch. 8', 'Data Distribution Shifts and Monitoring'), pages: ['ml-in-production', 'probability-basics'],
      task: 'In validation, 5% of predictions were positive. Today, 90 of 1,000 predictions are positive. Is that a real change?',
      steps: ['Expected positives: 1000 × 0.05 = 50, with standard deviation sqrt(1000 × 0.05 × 0.95) ≈ 6.9.', 'z = (90 - 50)/6.9 ≈ 5.8, far beyond chance.', 'The input distribution or the world has likely shifted. This signal is available immediately, long before true labels are.'],
      answer: 'Yes: z ≈ 5.8.',
    },
  ],
};
