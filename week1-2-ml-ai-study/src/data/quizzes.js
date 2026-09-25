// Multiple-choice quizzes for each concept page. In each question the first option listed is
// the correct one; the page shuffles options deterministically so the answer is not always first.
// Topic pages combine the questions of their subtopics. Checked by scripts/check-content.mjs.

export const quizzes = {
  "exp-log": [
    {"question": "What is ln(a b) for positive a and b?", "answer": "ln a + ln b", "wrong": ["ln a × ln b", "ln(a + b)", "b ln a"], "why": "Logs turn products into sums; that is why log-likelihoods are sums."},
    {"question": "sigma(2) ≈ 0.881. What is sigma(-2)?", "answer": "0.119", "wrong": ["-0.881", "0.881", "0.5"], "why": "sigma(-s) = 1 - sigma(s), so 1 - 0.881 = 0.119."},
    {"question": "Why can we maximize ln L instead of L?", "answer": "ln is strictly increasing, so the same parameter maximizes both", "wrong": ["ln L is always larger than L", "The log removes the need for data", "The log makes every function convex"], "why": "An increasing transform never changes where the maximum is."},
    {"question": "What is logit(0.5)?", "answer": "0", "wrong": ["0.5", "1", "ln 0.5"], "why": "ln(0.5/0.5) = ln 1 = 0, matching sigma(0) = 0.5."},
  ],
  "probability-basics": [
    {"question": "TP = 8, FP = 2, TN = 90, FN = 10. What is P(y_hat = 1 | y = 1)?", "answer": "8/18 ≈ 0.444 (the recall)", "wrong": ["8/10 = 0.8", "18/110 ≈ 0.164", "10/110 ≈ 0.091"], "why": "Condition on the 18 real positives: 8 of them were predicted positive."},
    {"question": "A disease has 1% prevalence; a test has 90% sensitivity and 5% false positives. About what is P(disease | positive)?", "answer": "0.15", "wrong": ["0.90", "0.95", "0.01"], "why": "0.009/(0.009 + 0.0495) ≈ 0.154: most positives come from the large healthy group."},
    {"question": "Why is the probability of an i.i.d. training set a product of per-example probabilities?", "answer": "The examples are independent, so the joint probability factors", "wrong": ["Probabilities always multiply", "The examples are disjoint events", "Bayes' rule requires it"], "why": "Independence means p(x, y) = p(x) p(y), and likewise for n examples."},
    {"question": "Which rule turns p(x | y) and p(y) into p(y | x)?", "answer": "Bayes' rule", "wrong": ["The sum rule alone", "The complement rule", "Independence"], "why": "p(y | x) = p(x | y) p(y) / p(x)."},
  ],
  "expectation-variance": [
    {"question": "If Var X = 3, what is Var(2X + 5)?", "answer": "12", "wrong": ["6", "11", "17"], "why": "Var(aX + b) = a^2 Var X = 4 × 3; the shift adds nothing."},
    {"question": "A die roll has variance 2.917. What is the variance of the average of 4 independent rolls?", "answer": "About 0.729", "wrong": ["2.917", "11.67", "About 1.458"], "why": "Var of an average of n independent draws is sigma^2/n = 2.917/4."},
    {"question": "What is E[X^2] - (E[X])^2?", "answer": "The variance of X", "wrong": ["Always 0", "The standard deviation of X", "The bias"], "why": "Var X = E[X^2] - mu^2, so E[X^2] and (E X)^2 differ unless X is constant."},
    {"question": "Why does stochastic gradient descent point downhill on average?", "answer": "With t chosen uniformly, the expected one-example gradient equals the full average gradient", "wrong": ["Each single gradient is exact", "The learning rate cancels the noise", "Random examples always have larger gradients"], "why": "E_t[grad loss_t] = (1/n) sum of the gradients = grad R_n."},
  ],
  "covariance-gaussian": [
    {"question": "What range can a correlation take?", "answer": "From -1 to 1", "wrong": ["From 0 to 1", "Any real number", "From 0 to infinity"], "why": "Dividing the covariance by both standard deviations bounds it by the Cauchy-Schwarz inequality."},
    {"question": "S = [[2, 0.5], [0.5, 3.5]]. What is the variance along b = [1, 1]/sqrt 2?", "answer": "3.25", "wrong": ["2.75", "6", "2.5"], "why": "b^T S b = (2 + 3.5 + 2 × 0.5)/2 = 3.25."},
    {"question": "If Cov(X, Y) = 0, are X and Y independent?", "answer": "Not necessarily", "wrong": ["Yes, always", "Only if both are positive", "Yes, if they have the same variance"], "why": "Y = X^2 with symmetric X has zero covariance with X but depends on it completely. (For jointly Gaussian variables it does imply independence.)"},
    {"question": "About what share of a Gaussian lies within one standard deviation of the mean?", "answer": "About 68%", "wrong": ["About 50%", "About 95%", "About 99.7%"], "why": "68% within 1 sigma, 95% within 1.96 sigma, 99.7% within 3 sigma."},
  ],
  "likelihood-mle": [
    {"question": "7 ones in 10 coin flips. What is the maximum likelihood estimate of mu?", "answer": "0.7", "wrong": ["0.5", "0.3", "1"], "why": "mu_hat = k/n = 7/10."},
    {"question": "Why do we usually maximize the log-likelihood?", "answer": "It has the same maximizer and turns a product into a sum that is easier to handle", "wrong": ["It gives a different, better estimate", "It makes the likelihood a probability", "It removes the need for derivatives"], "why": "ln is increasing, so the maximizer is unchanged."},
    {"question": "Minimizing the average logistic loss is the same as what?", "answer": "Maximizing the Bernoulli likelihood of the labels", "wrong": ["Minimizing the squared error", "Maximizing the number of correct predictions", "Maximizing the margin"], "why": "The average NLL of Bernoulli labels with mu_t = sigma(theta . x_t + theta_0) is exactly the logistic loss."},
    {"question": "What is the likelihood L(mu)?", "answer": "The probability of the observed data, viewed as a function of mu", "wrong": ["The probability that mu is correct", "A probability distribution over mu", "The error rate of the model"], "why": "The data are fixed and the parameter varies; it is not a distribution over mu."},
  ],
  "ml-workflow": [
    {"question": "Why is a model judged on data it did not train on?", "answer": "Because the goal is to predict well on new examples, not to memorize the training set", "wrong": ["Because training data is always mislabeled", "Because the test set is larger", "Because the loss cannot be computed on training data"], "why": "Generalization to unseen examples is the real target; a model can score perfectly on training data by memorizing it."},
    {"question": "In the spam example, theta = [2, 1] and theta_0 = -2. What is the score of x = [1, 1]?", "answer": "1", "wrong": ["3", "-1", "0"], "why": "2*1 + 1*1 - 2 = 1, so the email is predicted as spam (+1)."},
    {"question": "Which of these is a choice about the hypothesis class?", "answer": "Deciding to use a linear classifier sign(theta dot x + theta_0)", "wrong": ["Deciding that a mistake costs 1", "Deciding to count the word 'free' as a feature", "Deciding to run gradient descent for 100 steps"], "why": "The hypothesis class is the family of models you search over; the other options are the loss, the features, and the optimizer."},
  ],
  "feature-representation": [
    {"question": "An email has x = [2, 3] and the weights are theta = [4, -1]. What is the score theta dot x?", "answer": "5", "wrong": ["11", "8", "-3"], "why": "4*2 + (-1)*3 = 8 - 3 = 5."},
    {"question": "How should the category 'work' from {personal, work, unknown} usually be encoded?", "answer": "As the one-hot vector [0, 1, 0]", "wrong": ["As the number 2", "As the number 1.5", "As the text 'work' inside the vector"], "why": "One-hot encoding avoids inventing an order or distances between categories, which the numbers 1, 2, 3 would suggest."},
    {"question": "A feature has a negative weight. What does that mean for the score?", "answer": "Larger values of that feature push the score down", "wrong": ["That feature is ignored", "That feature always makes the prediction negative", "The feature must be wrong and should be removed"], "why": "Each feature contributes weight times value, so a negative weight lowers the score as the feature grows."},
  ],
  "sets": [
    {"question": "With A = {1, 2, 3} and B = {3, 4}, what is A intersection B?", "answer": "{3}", "wrong": ["{1, 2, 3, 4}", "{1, 2}", "{4}"], "why": "The intersection keeps only elements in both sets, and only 3 is in both."},
    {"question": "With universe U = {1, 2, 3, 4, 5} and A = {1, 2, 3}, what is the complement of A?", "answer": "{4, 5}", "wrong": ["{1, 2, 3}", "{ } (the empty set)", "{1, 2, 3, 4, 5}"], "why": "The complement is everything in U that is not in A."},
    {"question": "Which statement about sets is true?", "answer": "{1, 2, 2, 3} and {3, 2, 1} are the same set", "wrong": ["The order of elements changes the set", "A set can contain the same element twice", "A minus B always equals B minus A"], "why": "Sets ignore order and repeats; difference is not symmetric ({1,2,3} minus {3,4} is {1,2}, while {3,4} minus {1,2,3} is {4})."},
  ],
  "functions": [
    {"question": "f maps 1 -> a, 2 -> a, 3 -> b from {1, 2, 3} to {a, b, c}. Which is true?", "answer": "It is neither injective nor surjective", "wrong": ["It is injective but not surjective", "It is surjective but not injective", "It is bijective"], "why": "1 and 2 share the output a (not injective) and c is never reached (not surjective)."},
    {"question": "What does it mean for a function to be injective?", "answer": "Different inputs always give different outputs", "wrong": ["Every output in the codomain is reached", "Every input gives exactly one output", "The function can be graphed as a straight line"], "why": "Injective (one-to-one) means no two inputs share an output. 'Every output reached' is surjective; 'exactly one output per input' is what makes it a function at all."},
    {"question": "Is f(x) = x^2 from the real numbers to the real numbers injective?", "answer": "No, because f(2) = f(-2)", "wrong": ["Yes, because each x gives one output", "Yes, because squares are never negative", "No, because it is not a function"], "why": "Two different inputs, 2 and -2, give the same output 4."},
  ],
  "inverse-composition": [
    {"question": "With f(x) = x + 1 and g(x) = 2x, what is g(f(3))?", "answer": "8", "wrong": ["7", "6", "9"], "why": "First f(3) = 4, then g(4) = 8. Note f(g(3)) = 7, so order matters."},
    {"question": "Which functions have an inverse function?", "answer": "Exactly the bijections (injective and surjective)", "wrong": ["All functions", "Only linear functions", "Only functions from numbers to numbers"], "why": "Undoing needs every output to come from exactly one input, which is bijectivity."},
    {"question": "What is the inverse of g after f?", "answer": "f inverse after g inverse", "wrong": ["g inverse after f inverse", "f after g", "1 / (g(f(x)))"], "why": "Undo the last step first: g was applied last, so g inverse comes first."},
  ],
  "vectors-dot-product": [
    {"question": "What is u dot v for u = [2, 3] and v = [4, -1]?", "answer": "5", "wrong": ["11", "[8, -3]", "-5"], "why": "Multiply matching entries and add: 8 + (-3) = 5. A dot product is a single number."},
    {"question": "Two nonzero vectors have dot product 0. What does that tell you?", "answer": "They are perpendicular", "wrong": ["One of them must be the zero vector", "They point in the same direction", "They have the same length"], "why": "u dot v = |u||v|cos(angle), and cos(angle) = 0 exactly at 90 degrees."},
    {"question": "What is the length of u = [3, 4]?", "answer": "5", "wrong": ["7", "25", "12"], "why": "|u| = sqrt(u dot u) = sqrt(9 + 16) = 5."},
  ],
  "matrix-operations": [
    {"question": "If A = [[1, 2], [3, 4]], what is A transpose?", "answer": "[[1, 3], [2, 4]]", "wrong": ["[[4, 3], [2, 1]]", "[[1, 2], [3, 4]]", "[[2, 4], [6, 8]]"], "why": "Transposing turns rows into columns: the first row [1, 2] becomes the first column."},
    {"question": "Can a 2 by 3 matrix be added to a 3 by 2 matrix?", "answer": "No, addition needs exactly the same shape", "wrong": ["Yes, both have 6 entries", "Yes, after transposing automatically", "Only if both are symmetric"], "why": "Addition is entry by entry, so rows and columns must match."},
    {"question": "For any square matrix A, which matrix is always symmetric?", "answer": "A + A transpose", "wrong": ["A minus 2A", "2A", "A with its first row removed"], "why": "(A + A^T)^T = A^T + A, the same matrix, so it equals its own transpose."},
  ],
  "matrix-multiplication-outer-product": [
    {"question": "A is 2 by 3 and B is 3 by 4. What is the shape of AB?", "answer": "2 by 4", "wrong": ["3 by 3", "2 by 3", "The product is not defined"], "why": "The inner sizes (3 and 3) must match; the result takes the outer sizes."},
    {"question": "What is the rank of an outer product a b^T when a and b are nonzero?", "answer": "1", "wrong": ["The length of a", "The length of b", "It depends on the entries"], "why": "Every row of a b^T is a multiple of b^T, so there is only one independent direction."},
    {"question": "For square matrices A and B, which is true in general?", "answer": "AB and BA can be different", "wrong": ["AB always equals BA", "AB is always the zero matrix", "AB is only defined when A equals B"], "why": "Matrix multiplication is not commutative; the page's example gives different AB and BA."},
  ],
  "matrix-systems": [
    {"question": "What is the solution of 2a + b = 5 and a - b = 1?", "answer": "a = 2, b = 1", "wrong": ["a = 1, b = 2", "a = 3, b = -1", "There is no solution"], "why": "Adding the equations gives 3a = 6, so a = 2, then b = 1."},
    {"question": "What does solving Ax = b ask?", "answer": "Which input vector x produces the output b", "wrong": ["Which matrix A turns b into x", "What the determinant of A is", "Which entries of A are zero"], "why": "A combines the entries of x; solving finds the x that A turns into b."},
    {"question": "Which operation does NOT change the solutions of a system?", "answer": "Adding a multiple of one equation to a different equation", "wrong": ["Multiplying an equation by 0", "Deleting an equation", "Adding a number to only one side of an equation"], "why": "Row replacement is reversible, so it keeps exactly the same solutions."},
  ],
  "gaussian-elimination": [
    {"question": "Which is an allowed elementary row operation?", "answer": "Swap two rows", "wrong": ["Multiply a row by 0", "Replace a row by itself squared", "Delete a row of zeros and a nonzero row together"], "why": "The three operations are: swap rows, scale a row by a nonzero number, and add a multiple of one row to a different row."},
    {"question": "What extra property does reduced row echelon form (RREF) have over REF?", "answer": "Every pivot is 1 and has zeros above and below it", "wrong": ["It has no zero rows", "Its entries are all integers", "It is always the identity matrix"], "why": "RREF normalizes pivots and clears their columns, so solutions can be read off."},
    {"question": "In the page's example, what is z after elimination?", "answer": "3/2", "wrong": ["1/2", "2", "4/3"], "why": "The last row reads (4/3) z = 2, so z = 3/2."},
  ],
  "solution-structure": [
    {"question": "After elimination a row reads [0 0 0 | 5]. What does it mean?", "answer": "The system has no solution", "wrong": ["The system has exactly one solution", "The system has infinitely many solutions", "The variable in column 3 equals 5"], "why": "That row says 0 = 5, a contradiction."},
    {"question": "A consistent system has 3 unknowns but only 1 pivot. How many free variables are there?", "answer": "2", "wrong": ["1", "3", "0"], "why": "Each variable column without a pivot is free: 3 - 1 = 2."},
    {"question": "How can every solution of a consistent system Ax = b be written?", "answer": "One particular solution plus any vector in the null space of A", "wrong": ["Only the particular solution", "Any vector in the column space of A", "The zero vector plus b"], "why": "Adding a null-space vector does not change Ax, so all solutions are x_p + x_h."},
  ],
  "vector-spaces": [
    {"question": "Which set is a vector space?", "answer": "All polynomials a + bx + cx^2 with real coefficients", "wrong": ["Polynomials with constant term 1", "Vectors in R^2 with positive entries", "The line y = x + 1 in R^2"], "why": "It is closed under addition and scaling and contains the zero polynomial; the others fail closure or miss zero."},
    {"question": "What must every vector space contain?", "answer": "The zero vector", "wrong": ["The vector [1, 1, ..., 1]", "At least two vectors", "A basis of exactly 3 vectors"], "why": "Scaling any vector by 0 must stay inside, so the zero vector is always there."},
    {"question": "What does 'closed under addition' mean?", "answer": "Adding two members always gives another member", "wrong": ["The set has no members", "Adding members eventually reaches zero", "Only the zero vector can be added"], "why": "Closure means you can never leave the set by adding (or scaling) its members."},
  ],
  "span-linear-combinations": [
    {"question": "Is b = [4, 7] in the span of v1 = [1, 2] and v2 = [2, 3]?", "answer": "Yes, b = 2 v1 + 1 v2", "wrong": ["No, it needs a third vector", "Yes, b = v1 + v2", "No, because b is longer than both"], "why": "Solving c1 + 2c2 = 4 and 2c1 + 3c2 = 7 gives c1 = 2, c2 = 1."},
    {"question": "What is the span of a single nonzero vector in R^2?", "answer": "A line through the origin", "wrong": ["The whole plane", "Just that one vector", "A circle"], "why": "All multiples c v form a line through the origin."},
    {"question": "Which vector is in the span of any set of vectors?", "answer": "The zero vector", "wrong": ["The sum of all entries", "The vector [1, 1]", "None in general"], "why": "Take every amount equal to 0."},
  ],
  "linear-independence": [
    {"question": "When are vectors linearly independent?", "answer": "When the only combination giving zero uses all-zero amounts", "wrong": ["When no two of them are equal", "When they all have length 1", "When they are all nonzero"], "why": "Independence means no nontrivial combination is zero, so none is built from the others."},
    {"question": "Can three vectors in R^2 be independent?", "answer": "No, at most two vectors in R^2 can be independent", "wrong": ["Yes, if they are all different", "Yes, if none is a multiple of another", "Only if one of them is zero"], "why": "R^2 has dimension 2, so any three vectors are dependent."},
    {"question": "For v1 = [1,2,1], v2 = [3,8,2], v3 = [5,6,7], which relation holds?", "answer": "-11 v1 + 2 v2 + v3 = 0", "wrong": ["v1 + v2 = v3", "2 v1 = v2", "They are independent, so no relation holds"], "why": "Checking entry by entry: -11 + 6 + 5 = 0, -22 + 16 + 6 = 0, -11 + 4 + 7 = 0."},
  ],
  "subspaces": [
    {"question": "Which set is a subspace of R^3?", "answer": "The plane x + y + z = 0", "wrong": ["The plane x + y + z = 1", "All vectors with x > 0", "The single point (1, 1, 1)"], "why": "It contains the origin and is closed under addition and scaling; the others fail."},
    {"question": "What is the null space of a matrix A?", "answer": "All vectors x with Ax = 0", "wrong": ["All outputs Ax", "The rows of A that are zero", "All vectors with zero entries"], "why": "The null space collects every input sent to zero; the set of outputs is the column space."},
    {"question": "When is the solution set of Ax = b a subspace?", "answer": "Only when b = 0", "wrong": ["Always", "Never", "Only when A is square"], "why": "For b not zero the solution set misses the origin, so it is an affine set, not a subspace."},
  ],
  "basis-coordinates": [
    {"question": "What two properties make a set of vectors a basis?", "answer": "It spans the space and is linearly independent", "wrong": ["It has unit vectors and they are perpendicular", "It contains the zero vector and spans the space", "It has exactly two vectors"], "why": "Spanning reaches everything; independence makes the coordinates unique."},
    {"question": "In the basis b1 = [1, 1], b2 = [1, -1], what are the coordinates of v = [3, -2]?", "answer": "[1/2, 5/2]", "wrong": ["[3, -2]", "[5/2, 1/2]", "[1, 2]"], "why": "c1 + c2 = 3 and c1 - c2 = -2 give c1 = 1/2 and c2 = 5/2."},
    {"question": "Why are coordinates in a basis unique?", "answer": "Because the basis vectors are independent", "wrong": ["Because the basis vectors have length 1", "Because every space has only one basis", "Because coordinates are always integers"], "why": "Two different recipes for the same vector would give a nonzero combination equal to zero, contradicting independence."},
  ],
  "dimension": [
    {"question": "What is the dimension of the plane x + y + z = 0 inside R^3?", "answer": "2", "wrong": ["3", "1", "0"], "why": "It has a basis of two vectors, such as [-1,1,0] and [-1,0,1]."},
    {"question": "In a space of dimension 3, what is true of any 4 vectors?", "answer": "They are linearly dependent", "wrong": ["They always span the space", "They are always independent", "At least one of them is zero"], "why": "More vectors than the dimension must be dependent."},
    {"question": "What is the dimension of P2, the polynomials of degree at most 2?", "answer": "3", "wrong": ["2", "Infinite", "1"], "why": "A basis is 1, x, x^2, three vectors."},
  ],
  "linear-transformations": [
    {"question": "Which map from R^2 to R^2 is linear?", "answer": "T(x, y) = (2x, y)", "wrong": ["S(x, y) = (x + 1, y)", "Q(x, y) = (x^2, y)", "R(x, y) = (xy, y)"], "why": "T keeps addition and scaling; S moves the origin, and Q and R are not linear in the inputs."},
    {"question": "What must every linear transformation do to the zero vector?", "answer": "Send it to the zero vector", "wrong": ["Send it to [1, 1]", "Leave it undefined", "Send it to the first basis vector"], "why": "T(0) = T(0 * v) = 0 * T(v) = 0."},
    {"question": "What is the kernel of a linear map T?", "answer": "All inputs that T sends to zero", "wrong": ["All outputs T can produce", "The largest input", "The matrix of T"], "why": "The kernel (null space) is {v : T(v) = 0}; the set of outputs is the image."},
  ],
  "transformation-matrix": [
    {"question": "How do you build the matrix of a linear map T on R^2?", "answer": "Put T(e1) and T(e2) as its columns", "wrong": ["Put T(e1) and T(e2) as its rows", "Apply T to the vector [1, 1] only", "Write the formula of T on the diagonal"], "why": "Every input is a combination of e1 and e2, so their images, as columns, determine T."},
    {"question": "What is the matrix of the reflection T(x, y) = (x, -y)?", "answer": "[[1, 0], [0, -1]]", "wrong": ["[[-1, 0], [0, 1]]", "[[0, 1], [1, 0]]", "[[1, 1], [1, -1]]"], "why": "T(e1) = [1, 0] and T(e2) = [0, -1] become the columns."},
    {"question": "Why does a linear map not need infinitely many examples to be known?", "answer": "Knowing the images of a basis determines all other images", "wrong": ["Linear maps only act on finitely many vectors", "Every linear map is the identity", "Computers round the answers"], "why": "Linearity carries the basis images to every combination of the basis."},
  ],
  "composition-of-transformations": [
    {"question": "In the product AB applied to a vector x, which matrix acts first?", "answer": "B, then A", "wrong": ["A, then B", "Both at the same time", "Whichever is larger"], "why": "ABx = A(Bx): B is closest to x, so it acts first."},
    {"question": "With R = rotate 90 degrees and F = reflect across the x-axis, is FR equal to RF?", "answer": "No, the order changes the result", "wrong": ["Yes, always", "Yes, because both are 2 by 2", "Only for vectors on the x-axis"], "why": "The page computes FR = [[0,-1],[-1,0]] and RF = [[0,1],[1,0]]."},
    {"question": "Why can stacking linear layers without nonlinearities not add power?", "answer": "Their product is a single linear map", "wrong": ["Each layer cancels the previous one", "Linear layers cannot be multiplied", "Deep networks must use exactly one layer"], "why": "A composition of linear maps is linear, with matrix equal to the product."},
  ],
  "change-of-basis": [
    {"question": "P has the new basis vectors as columns. How do you get new-basis coordinates from standard ones?", "answer": "Multiply by P inverse", "wrong": ["Multiply by P", "Multiply by P transpose, always", "Add P"], "why": "P turns new coordinates into standard ones, so P inverse goes back."},
    {"question": "In the basis {[1,1], [1,-1]}, what are the coordinates of v = [3, 1]?", "answer": "[2, 1]", "wrong": ["[3, 1]", "[1, 2]", "[4, 2]"], "why": "2[1,1] + 1[1,-1] = [3, 1]."},
    {"question": "What does changing the basis change?", "answer": "The coordinates used to describe a vector", "wrong": ["The vector itself", "The length of every vector", "The dimension of the space"], "why": "The arrow stays put; only its numerical description changes."},
  ],
  "rank-nullity": [
    {"question": "A = [[1, 2, 3], [2, 4, 6]]. What is the rank of A?", "answer": "1", "wrong": ["2", "3", "0"], "why": "Row 2 is twice row 1, so elimination leaves one pivot."},
    {"question": "A 3 by 5 matrix has rank 3. What is its nullity?", "answer": "2", "wrong": ["3", "5", "0"], "why": "Rank + nullity = number of columns: 5 - 3 = 2."},
    {"question": "What does the nullity count?", "answer": "Input directions that the matrix sends to zero", "wrong": ["The number of zero entries", "The number of rows", "Output directions the matrix produces"], "why": "Nullity is the dimension of the null space; rank counts output directions."},
  ],
  "determinant-geometry": [
    {"question": "What is det([[2, 1], [1, 1]])?", "answer": "1", "wrong": ["3", "0", "-1"], "why": "ad - bc = 2*1 - 1*1 = 1."},
    {"question": "What does det(A) = 0 tell you about a square matrix A?", "answer": "A flattens some direction and has no inverse", "wrong": ["A is the identity", "A has only zero entries", "A doubles all areas"], "why": "Zero area or volume scaling means a direction collapsed, so A cannot be undone."},
    {"question": "If det(A) = 2 and det(B) = -3 (same size), what is det(AB)?", "answer": "-6", "wrong": ["-1", "6", "It cannot be known"], "why": "Determinants multiply: det(AB) = det(A) det(B)."},
  ],
  "determinants-cofactor-row-ops": [
    {"question": "How does swapping two rows change the determinant?", "answer": "It flips the sign", "wrong": ["It leaves it unchanged", "It doubles it", "It sets it to zero"], "why": "A swap reverses orientation, so det becomes -det."},
    {"question": "How does replacing row i by row i plus 5 times row j (i different from j) change the determinant?", "answer": "It does not change it", "wrong": ["It multiplies it by 5", "It adds 5 to it", "It flips the sign"], "why": "Row replacement with a different row keeps the determinant."},
    {"question": "What is the determinant of [[3,2,2],[2,3,2],[2,2,3]] from the page?", "answer": "7", "wrong": ["5", "15", "0"], "why": "Cofactor expansion: 3(5) - 2(2) + 2(-2) = 15 - 4 - 4 = 7."},
  ],
  "invertible-transformations": [
    {"question": "Which statement is equivalent to a square matrix A being invertible?", "answer": "det(A) is not zero", "wrong": ["A has no zero entries", "A is symmetric", "A has more rows than columns"], "why": "For square matrices, invertible, nonzero determinant, full rank, and trivial null space all mean the same thing."},
    {"question": "What is the inverse of [[3, 5], [-1, 4]]?", "answer": "(1/17) [[4, -5], [1, 3]]", "wrong": ["(1/17) [[3, 5], [-1, 4]]", "[[4, -5], [1, 3]]", "(1/7) [[4, 5], [-1, 3]]"], "why": "For [[a, b], [c, d]] the inverse is (1/(ad - bc)) [[d, -b], [-c, a]], with ad - bc = 17."},
    {"question": "To solve Ax = b in practice, what is usually preferred?", "answer": "Elimination or a factorization such as LU", "wrong": ["Computing A inverse and multiplying", "Guessing x", "Transposing A"], "why": "Forming the inverse is slower and less numerically stable than solving directly."},
  ],
  "affine-maps": [
    {"question": "Why is f(x) = 2x + 1 not linear in the linear-algebra sense?", "answer": "It sends 0 to 1, not to 0", "wrong": ["It is a curve", "It has a negative slope", "It has two variables"], "why": "Linear maps must send 0 to 0; the + 1 shift makes it affine."},
    {"question": "In a model, what plays the role of the shift b in f(x) = Ax + b?", "answer": "The bias or intercept term", "wrong": ["The learning rate", "The number of features", "The loss function"], "why": "The bias lets a line or boundary move away from the origin."},
    {"question": "What does the solution set of Ax = b look like when b is not zero and a solution exists?", "answer": "A particular solution plus the null space: a shifted subspace", "wrong": ["A subspace through the origin", "Always a single point", "Always empty"], "why": "It is an affine set: x_p + Null(A)."},
  ],
  "linear-classifier": [
    {"question": "With theta = [1, 2] and theta_0 = -3, what is predicted for x = [1, 0]?", "answer": "-1, because the score is -2", "wrong": ["+1, because the score is 2", "+1, because theta_0 is negative", "It lies exactly on the boundary"], "why": "1*1 + 2*0 - 3 = -2, which is negative."},
    {"question": "How is the weight vector theta related to the decision boundary?", "answer": "It is perpendicular to the boundary", "wrong": ["It lies along the boundary", "It is the boundary's midpoint", "It has no relation to the boundary"], "why": "Points on the boundary satisfy theta dot x = -theta_0, so theta is the boundary's normal direction."},
    {"question": "What is the decision boundary of a linear classifier?", "answer": "The set of points where theta dot x + theta_0 = 0", "wrong": ["The set of training points", "The line through the two closest points", "Where the loss is largest"], "why": "Points with score exactly zero separate the positive and negative sides."},
  ],
  "linear-classifier-through-origin": [
    {"question": "What can a classifier without a bias term NOT do?", "answer": "Shift its boundary away from the origin", "wrong": ["Rotate its boundary", "Use negative weights", "Use more than two features"], "why": "The boundary theta dot x = 0 always contains the origin."},
    {"question": "With theta = [1, -1] and no bias, what is predicted for x = [2, 1]?", "answer": "+1", "wrong": ["-1", "0", "It cannot be classified"], "why": "Score = 2 - 1 = 1 > 0."},
    {"question": "Can a through-origin classifier put [1, 1] and [2, 2] in different classes?", "answer": "No, both scores have the same sign because [2, 2] = 2 [1, 1]", "wrong": ["Yes, with the right theta", "Yes, if theta has negative entries", "Only if one point is on the boundary"], "why": "theta dot [2,2] = 2 (theta dot [1,1]), so the signs always agree (unless both are 0)."},
  ],
  "linear-separability": [
    {"question": "When is a dataset linearly separable?", "answer": "When some line (hyperplane) puts every positive example strictly on one side and every negative on the other", "wrong": ["When it has the same number of positives and negatives", "When the perceptron makes at least one mistake", "When all features are positive"], "why": "Separability means some parameters give every signed margin y(theta dot x + theta_0) > 0."},
    {"question": "Points: negative at x = 1, positive at x = 3, and positive at x = 0.5 (one feature). Are they separable by a threshold?", "answer": "No, the negative point sits between two positives", "wrong": ["Yes, at x = 2", "Yes, at x = 0.75", "Yes, any threshold works"], "why": "Any single threshold puts 0.5 and 1 on the same side, or 1 and 3 on the same side."},
    {"question": "What is the geometric margin of a separator?", "answer": "The distance from the boundary to the closest training point", "wrong": ["The number of training points", "The largest score", "The length of theta"], "why": "It is min over t of y(theta dot x + theta_0) / |theta|, which does not change when theta is rescaled."},
  ],
  "perceptron": [
    {"question": "When does the perceptron update theta?", "answer": "When an example has y (theta dot x + theta_0) <= 0", "wrong": ["After every example, no matter what", "Only when the score is exactly 1", "When the loss increases"], "why": "It updates on mistakes, including points exactly on the boundary."},
    {"question": "What is the perceptron update after a mistake on (x, y)?", "answer": "theta <- theta + y x and theta_0 <- theta_0 + y", "wrong": ["theta <- theta - y x", "theta <- 0", "theta <- y theta"], "why": "Adding y x moves the score of that example in the correct direction."},
    {"question": "Starting from theta = [0, 0], theta_0 = 0, the perceptron sees x = [2, 1] with y = +1. What is theta afterwards?", "answer": "[2, 1] with theta_0 = 1", "wrong": ["[0, 0] with theta_0 = 0", "[-2, -1] with theta_0 = -1", "[1, 1] with theta_0 = 1"], "why": "The score is 0, which counts as a mistake, so theta becomes [0,0] + [2,1]."},
  ],
  "perceptron-convergence": [
    {"question": "On data separable through the origin with margin gamma and |x| <= R, how many mistakes can the perceptron make at most?", "answer": "(R / gamma)^2", "wrong": ["R + gamma", "Infinitely many", "gamma / R"], "why": "The convergence theorem bounds the mistakes by (R/gamma)^2 for a through-origin unit-norm separator."},
    {"question": "What happens on data that is not linearly separable?", "answer": "The perceptron keeps making updates and does not settle", "wrong": ["It converges faster", "It stops after one pass", "It finds the best possible line"], "why": "Fixing one example can break another forever."},
    {"question": "If the margin gamma gets smaller, what happens to the mistake bound?", "answer": "It gets larger", "wrong": ["It gets smaller", "It stays the same", "It becomes zero"], "why": "(R/gamma)^2 grows as gamma shrinks: tight gaps mean more corrections."},
  ],
  "empirical-risk-zero-one": [
    {"question": "Signed margins are [2, -0.5, 0.1, -3]. What is the training error?", "answer": "0.5", "wrong": ["0.25", "0.75", "0"], "why": "Two margins are <= 0, so 2 of 4 examples are mistakes."},
    {"question": "What does zero-one loss give for a margin of -0.01 and for -100?", "answer": "1 in both cases", "wrong": ["0.01 and 100", "0 and 1", "It depends on theta"], "why": "Zero-one loss only asks right or wrong, not by how much."},
    {"question": "Why is zero-one loss hard to minimize directly?", "answer": "It is flat almost everywhere, so it gives no direction to improve", "wrong": ["It is always zero", "It can be negative", "It needs the test set"], "why": "Small parameter changes usually do not change the count, so there is no slope to follow."},
  ],
  "hinge-loss": [
    {"question": "The Lesson 2 slides: the true label is -1 and the prediction score is 0.4. What is the hinge loss?", "answer": "1.4", "wrong": ["1", "0.6", "0"], "why": "The agreement is y times score = -0.4, so the loss is max(0, 1 - (-0.4)) = 1.4, more than the zero-one loss of 1."},
    {"question": "What is the hinge loss for a signed margin z = 0.2?", "answer": "0.8", "wrong": ["0", "0.2", "1.2"], "why": "max(0, 1 - 0.2) = 0.8."},
    {"question": "For which margins is the hinge loss exactly 0?", "answer": "z >= 1", "wrong": ["z > 0", "z = 0 only", "Never"], "why": "The loss becomes zero once the margin clears 1."},
    {"question": "Why can a correctly classified example still have positive hinge loss?", "answer": "Its margin is between 0 and 1: correct but not confident", "wrong": ["Hinge loss ignores the label", "Correct examples always have loss 1", "Because the bias is negative"], "why": "Hinge loss asks for margin at least 1, not just the right sign."},
  ],
  "convex-functions": [
    {"question": "What is a saddle point?", "answer": "A point with zero gradient where the function curves up in one direction and down in another", "wrong": ["The global minimum of a convex function", "A point where the function is not differentiable", "Any point where the loss is zero"], "why": "It is neither a minimum nor a maximum; non-convex losses can have them, and gradient methods slow down near them."},
    {"question": "Which function is convex?", "answer": "f(x) = x^2", "wrong": ["f(x) = x^3", "f(x) = sin(x)", "f(x) = -x^2"], "why": "x^2 has f''(x) = 2 >= 0 everywhere; the others curve downward somewhere."},
    {"question": "Why are convex losses convenient to minimize?", "answer": "Every local minimum is a global minimum", "wrong": ["They are always zero at the optimum", "They are always smooth", "They have exactly one input"], "why": "Convex functions have no false valleys, so descent cannot get stuck in the wrong dip."},
    {"question": "Is |x| convex?", "answer": "Yes, even though it has a corner at 0", "wrong": ["No, because it is not smooth", "No, because it has a minimum", "Only for x > 0"], "why": "The chord test holds everywhere; convex does not require smoothness."},
  ],
  "surrogate-losses": [
    {"question": "Why train with hinge or logistic loss instead of zero-one loss?", "answer": "They are convex and give useful slopes, while still upper-bounding the error", "wrong": ["They always give higher accuracy on the test set", "They are the metric we report", "They never reach zero"], "why": "A convex surrogate is easy to optimize, and pushing it down pushes the mistake count down."},
    {"question": "For z = -0.4, what are the zero-one and hinge losses?", "answer": "1 and 1.4", "wrong": ["0 and 0.4", "1 and 0.6", "0 and 1.4"], "why": "The prediction is wrong (loss 1), and max(0, 1 + 0.4) = 1.4."},
    {"question": "Which is true of hinge loss compared with zero-one loss?", "answer": "Hinge loss is on or above zero-one loss for every margin", "wrong": ["Hinge loss is always below zero-one loss", "They are equal for all margins", "Hinge loss is not defined for negative margins"], "why": "max(0, 1 - z) >= 1 when z <= 0 and >= 0 otherwise."},
  ],
  "gradient-descent-method": [
    {"question": "For J(theta) = (theta - 3)^2, starting at theta = 0 with alpha = 0.2, what is theta after one step?", "answer": "1.2", "wrong": ["0.6", "3", "-1.2"], "why": "The gradient at 0 is 2(0 - 3) = -6, and 0 - 0.2(-6) = 1.2."},
    {"question": "Which direction does gradient descent step in?", "answer": "Opposite to the gradient", "wrong": ["Along the gradient", "Perpendicular to the gradient", "Toward the origin"], "why": "The gradient points uphill, so we step the other way."},
    {"question": "For J(theta) = (theta - 3)^2, what happens with learning rate alpha = 1.1?", "answer": "The iterates diverge", "wrong": ["It converges in one step", "It converges slowly", "It stays at the starting point"], "why": "Each step multiplies the distance to 3 by (1 - 2 alpha) = -1.2, which grows in size."},
    {"question": "A quadratic loss has Hessian eigenvalues 10 and 0.1. With step 1/L, about how many steps cut the error to 1e-6 of its start?", "answer": "About 100 × ln(10^6) ≈ 1,400", "wrong": ["About 14", "About 100", "About 1,000,000"], "why": "kappa = 10/0.1 = 100, and the error shrinks by 1 - 1/kappa per step, so k ≈ kappa ln(1/epsilon) = 100 × 13.8."},
  ],
  "subgradients": [
    {"question": "What is the set of subgradients of |x| at x = 0?", "answer": "Every slope between -1 and 1", "wrong": ["Only 0", "Only 1", "No subgradient exists"], "why": "Any line through the origin with slope in [-1, 1] stays below |x|."},
    {"question": "What is the subgradient of |x| at x = 2?", "answer": "1", "wrong": ["Any value in [-1, 1]", "2", "0"], "why": "Away from the corner the only valid slope is the ordinary derivative, 1."},
    {"question": "Why are subgradients needed for hinge loss?", "answer": "Hinge loss has a corner at margin 1 where the ordinary slope does not exist", "wrong": ["Hinge loss is not convex", "Hinge loss has no minimum", "Gradients are too expensive to compute"], "why": "At a corner we can still use any valid subgradient for the descent step."},
  ],
  "stochastic-subgradient-descent": [
    {"question": "What does one stochastic step use?", "answer": "One randomly chosen training example", "wrong": ["The whole training set", "Only the test set", "The largest example"], "why": "Using one example makes each step cheap but noisy."},
    {"question": "How does hinge-loss SGD differ from the perceptron?", "answer": "It updates whenever the agreement is at most 1 (not just on mistakes), uses a decreasing learning rate, and picks examples at random", "wrong": ["It never updates on mistakes", "It ignores the labels", "It only works on separable data"], "why": "These are the three differences listed in the Week 1 notes: the hinge loss asks for agreement above 1, the step size eta_k shrinks over time, and random selection stops the updates from oscillating."},
    {"question": "Why can the training loss go up on some SGD steps?", "answer": "Each step follows one noisy example, not the full average", "wrong": ["The learning rate is always too large", "The loss is not convex", "SGD maximizes the loss"], "why": "On average the steps go downhill, but individual steps can go up."},
  ],
  "linear-regression": [
    {"question": "With theta_1 = 2 and theta_0 = 1, what is the prediction for x = 3?", "answer": "7", "wrong": ["6", "5", "9"], "why": "2*3 + 1 = 7."},
    {"question": "If the true y is 9 and the prediction is 7, what is the residual y - y_hat?", "answer": "2", "wrong": ["-2", "16", "63"], "why": "9 - 7 = 2."},
    {"question": "What does 'linear' in linear regression refer to?", "answer": "Linear in the parameters theta", "wrong": ["The data must lie on a line", "Only one feature is allowed", "The residuals must be zero"], "why": "Features can be transformed (for example x^2) and the model stays linear in theta."},
    {"question": "The Lesson 3 slides use L = (1/N) sum (a x_i + b - y_i)^2, the notes use (1/n) sum (y - theta . x)^2 / 2. What changes?", "answer": "Only a constant factor: the gradients differ by 2, and the best parameters are the same", "wrong": ["The best line is different", "Only the slides' loss is convex", "The notes' loss cannot be minimized by gradient descent"], "why": "Multiplying a loss by a positive constant rescales its gradient (like changing the learning rate) but not its minimizer."},
    {"question": "When does the Lesson 3 stopping rule (called early stopping in the slides) end gradient descent?", "answer": "When the parameters change by less than a small threshold delta, or after a maximum number of iterations", "wrong": ["As soon as the loss increases once", "When the loss reaches exactly zero", "After one pass over the data"], "why": "Tiny changes mean the parameters have settled; the iteration cap guards against running forever."},
  ],
  "polynomial-regression": [
    {"question": "With features [x, x^2, x^3], weights a = [1, 0, 3] and b = 5, what is the prediction at x = 2?", "answer": "31", "wrong": ["19", "11", "29"], "why": "5 + 1*2 + 0*4 + 3*8 = 31."},
    {"question": "Why is polynomial regression still linear regression?", "answer": "The prediction is a weighted sum of features, so it is linear in the weights", "wrong": ["It only fits straight lines", "Polynomials are linear functions of x", "It uses gradient descent"], "why": "Nonlinear features, linear parameters."},
    {"question": "What usually happens as the degree gets very high?", "answer": "Training error keeps falling but test error eventually rises", "wrong": ["Both errors always fall", "Training error rises", "The model becomes linear"], "why": "High-degree curves can chase noise: overfitting."},
  ],
  "least-squares-normal-equation": [
    {"question": "Fitting y = theta x through the origin to (1, 2) and (2, 3), what is theta_hat?", "answer": "1.6", "wrong": ["1.5", "2", "1.25"], "why": "X^T X = 1 + 4 = 5 and X^T y = 2 + 6 = 8, so theta = 8/5."},
    {"question": "What is the normal equation?", "answer": "X^T X theta = X^T y", "wrong": ["X theta = 0", "theta = y / X", "X X^T = I"], "why": "Setting the gradient of the squared error to zero gives X^T X theta = X^T y."},
    {"question": "When does the formula theta = (X^T X)^-1 X^T y work?", "answer": "When X^T X is invertible, which holds when the columns of X are independent", "wrong": ["Always", "Only with one feature", "Only when y is zero"], "why": "Dependent columns make X^T X singular."},
    {"question": "A model has test R^2 = -0.02. What does that mean?", "answer": "It predicts the test data slightly worse than always predicting the mean", "wrong": ["It explains 2% of the variation", "The features are negatively correlated with y", "It cannot happen for a least-squares model"], "why": "R^2 = 1 - SSE/SST is below 0 exactly when the squared error is larger than that of predicting the mean, which can happen on data the model was not fitted to."},
  ],
  "ridge-regularization": [
    {"question": "What does ridge regularization penalize?", "answer": "Large weights, through (lambda/2) times the sum of squared weights", "wrong": ["The number of training examples", "The size of the residuals only", "The bias term, always"], "why": "The penalty (lambda/2)||theta||^2 in the Week 2 notes pulls weights toward zero."},
    {"question": "In the page's example (X^T X = 5, X^T y = 8, n = 2, lambda = 0.5), what is theta_ridge?", "answer": "8/6 = 1.333", "wrong": ["8/5 = 1.6", "8/7 = 1.143", "0"], "why": "theta = X^T y / (X^T X + n lambda) = 8 / (5 + 1)."},
    {"question": "Why can ridge improve test performance even though training error rises?", "answer": "It reduces overfitting by discouraging extreme weights", "wrong": ["It adds more training data", "It removes all features", "It changes the test labels"], "why": "Trading a little training fit for stability often generalizes better."},
  ],
  "lasso": [
    {"question": "What can lasso do that ridge usually cannot?", "answer": "Set some weights exactly to zero", "wrong": ["Make weights larger", "Fit nonlinear curves", "Use no penalty at all"], "why": "The L1 penalty's soft-thresholding reaches exactly zero."},
    {"question": "For one standardized feature with least-squares weight w = 3 and lambda = 1, what is the lasso weight?", "answer": "2", "wrong": ["1.5", "3", "0"], "why": "sign(3) max(3 - 1, 0) = 2."},
    {"question": "Two models have theta = [3, 0] and [1.5, 1.5]. How do their L1 norms compare?", "answer": "They are equal (both 3)", "wrong": ["[3, 0] has the larger L1 norm", "[1.5, 1.5] has the larger L1 norm", "L1 norms cannot be compared"], "why": "|3| + |0| = 3 and |1.5| + |1.5| = 3; it is the L2 norm that differs (9 versus 4.5)."},
  ],
  "elastic-net": [
    {"question": "What penalty does elastic net use?", "answer": "An L1 part plus an L2 part", "wrong": ["Only an L1 part", "Only an L2 part", "The number of nonzero weights squared"], "why": "It combines lasso's L1 penalty with ridge's L2 penalty."},
    {"question": "For one standardized feature with least-squares weight w = 3, lambda_1 = 1 and lambda_2 = 1, what is the elastic net weight?", "answer": "1", "wrong": ["2", "1.5", "0"], "why": "Soft-threshold then shrink: (3 - 1) / (1 + 1) = 1."},
    {"question": "When is elastic net especially useful compared with lasso?", "answer": "When features are strongly correlated", "wrong": ["When there is only one feature", "When no regularization is wanted", "When all weights must be nonzero"], "why": "The L2 part spreads weight across correlated features instead of picking one arbitrarily."},
  ],
  "model-complexity-generalization": [
    {"question": "Model A: train 0.40, test 0.42. Model B: train 0.05, test 0.80. Which generalizes better?", "answer": "Model A", "wrong": ["Model B", "They are equal", "It cannot be told without more models"], "why": "A has the lower test loss and a small gap; B memorized the training data."},
    {"question": "What is overfitting?", "answer": "Fitting noise in the training data so that new data is predicted poorly", "wrong": ["Having too few parameters", "Training for too short a time", "Using a convex loss"], "why": "An overly flexible model learns quirks of the training set."},
    {"question": "How is overfitting detected?", "answer": "By comparing performance on held-out data with training performance", "wrong": ["By looking at the training loss alone", "By counting the parameters only", "By checking that the loss is convex"], "why": "A large gap between training and held-out error signals overfitting."},
    {"question": "Fitting a straight line to prices that follow a cubic trend is an example of what?", "answer": "Underfitting: the model is not powerful enough for the pattern", "wrong": ["Overfitting", "Data leakage", "Regularization"], "why": "A degree-1 model cannot bend to follow a cubic trend, so it misses the pattern on training and test data alike."},
  ],
  "train-validation-test": [
    {"question": "What is the validation set used for?", "answer": "Choosing hyperparameters such as lambda or the polynomial degree", "wrong": ["Fitting the weights", "Reporting the final score", "Replacing the training set"], "why": "Training fits the weights, validation chooses the settings, and test reports once."},
    {"question": "Why should the test set be used only once, at the end?", "answer": "Tuning on it makes its score optimistic and no longer an honest estimate", "wrong": ["It is too small to use twice", "It has no labels", "Using it twice changes the data"], "why": "Every decision based on the test set leaks it into model selection."},
    {"question": "Validation errors for lambda = 0.01, 0.1, 1 are 0.30, 0.22, 0.25. Which lambda is chosen?", "answer": "0.1", "wrong": ["0.01", "1", "The average lambda, 0.37"], "why": "Pick the setting with the lowest validation error."},
  ],
  "cross-validation": [
    {"question": "In 4-fold cross-validation, how many times is each example used for validation?", "answer": "Exactly once", "wrong": ["Four times", "Never", "Three times"], "why": "Each fold is held out in exactly one of the four runs."},
    {"question": "Validation errors across 4 folds are 0.22, 0.25, 0.20, 0.24. What is the CV score?", "answer": "0.2275", "wrong": ["0.25", "0.91", "0.22"], "why": "The average: 0.91 / 4 = 0.2275."},
    {"question": "Does cross-validation replace the test set?", "answer": "No, the final score must still come from data never used for choosing", "wrong": ["Yes, always", "Yes, when k is large", "Only for classification"], "why": "CV chooses settings, so its score is part of the selection process."},
  ],
  "logistic-regression": [
    {"question": "What is sigma(0), the sigmoid of a score of 0?", "answer": "0.5", "wrong": ["0", "1", "e"], "why": "sigma(0) = 1 / (1 + e^0) = 1/2."},
    {"question": "With a score of 2, sigma(2) is about 0.881. What is predicted with a 0.5 threshold?", "answer": "Class 1", "wrong": ["Class 0", "Undecided", "Class 2"], "why": "0.881 >= 0.5, so predict y = 1."},
    {"question": "Why does logistic regression use the sigmoid?", "answer": "To turn any real score into a probability between 0 and 1", "wrong": ["To make the decision boundary curved", "To remove the bias term", "To make the loss zero"], "why": "Bigger scores give higher probabilities, always between 0 and 1."},
    {"question": "theta_0 = -3, theta_1 = 1, theta_2 = 1. What is predicted at (x_1, x_2) = (1, 1)?", "answer": "y = 0, with P(y = 1) = sigma(-1) ≈ 0.269", "wrong": ["y = 1, with P(y = 1) ≈ 0.731", "y = 1, with P(y = 1) = 0.5", "y = 0, with P(y = 1) = 0"], "why": "The score is -3 + 1 + 1 = -1 < 0, so h(x) < 0.5."},
    {"question": "Why is linear regression on 0/1 labels a poor classifier?", "answer": "One extra far-away example can tilt the line and move its 0.5 crossing, misclassifying points that were right before", "wrong": ["Linear regression cannot use two features", "Its predictions are always between 0 and 1", "It has no closed-form solution"], "why": "Squared error pulls the line toward outliers, even correctly labelled ones, so the threshold point shifts."},
  ],
  "logistic-loss": [
    {"question": "True label y = 1. Which prediction has the larger logistic loss?", "answer": "h = 0.2", "wrong": ["h = 0.8", "They are equal", "h = 0.99"], "why": "-log(0.2) = 1.609 is much larger than -log(0.8) = 0.223."},
    {"question": "Why maximize the log-likelihood instead of the likelihood?", "answer": "Log is increasing, so the best parameters are the same, and sums of logs are easier and numerically safer than products", "wrong": ["The log-likelihood has a different maximizer", "Products of probabilities are always 1", "Logs make the loss non-convex"], "why": "The maximizer is unchanged; products of many small probabilities underflow."},
    {"question": "What happens to the loss as a confident prediction h approaches 0 when y = 1?", "answer": "It grows without bound", "wrong": ["It approaches 0", "It approaches 1", "It becomes negative"], "why": "-log(h) goes to infinity as h goes to 0: confident mistakes are punished hard."},
    {"question": "Why not train logistic regression with the squared error of linear regression?", "answer": "With the sigmoid inside, it is not convex, so gradient descent may stop at a poor local minimum", "wrong": ["It has a closed-form solution that is too slow", "It cannot be differentiated", "It always gives probabilities above 1"], "why": "Cross-entropy is convex in theta; squared error on sigmoid outputs is not."},
  ],
  "classification-metrics": [
    {"question": "TP = 8, FP = 2, TN = 90, FN = 10. What is the recall?", "answer": "8 / 18 = 0.444", "wrong": ["8 / 10 = 0.8", "98 / 110 = 0.891", "90 / 92 = 0.978"], "why": "Recall = TP / (TP + FN)."},
    {"question": "With the same numbers, what is the precision?", "answer": "8 / 10 = 0.8", "wrong": ["8 / 18 = 0.444", "90 / 100 = 0.9", "10 / 18 = 0.556"], "why": "Precision = TP / (TP + FP)."},
    {"question": "Why can high accuracy be misleading?", "answer": "When positives are rare, predicting 'negative' for everything scores well but catches nothing", "wrong": ["Accuracy ignores the true negatives", "Accuracy is always above 0.5", "Accuracy only works for regression"], "why": "A model that never predicts positive can have high accuracy and zero recall."},
    {"question": "A cat detector has TP = 11, FN = 3, FP = 2, TN = 9. What is its specificity?", "answer": "9 / 11 ≈ 0.818", "wrong": ["11 / 14 ≈ 0.786", "11 / 13 ≈ 0.846", "20 / 25 = 0.8"], "why": "Specificity = TN / (TN + FP): the share of real negatives correctly rejected. The wrong options are recall, precision, and accuracy."},
  ],
  "eigenvalues-eigenvectors": [
    {"question": "A v = 3 v for a nonzero vector v. What is v?", "answer": "An eigenvector with eigenvalue 3", "wrong": ["A basis of the null space", "The zero vector", "A row of A"], "why": "That is the definition of an eigenvector and its eigenvalue."},
    {"question": "What are the eigenvalues of [[2, 1], [1, 2]]?", "answer": "3 and 1", "wrong": ["2 and 2", "2 and 1", "4 and 0"], "why": "(2 - l)^2 - 1 = 0 gives l = 3 or l = 1."},
    {"question": "What does a negative eigenvalue do to its eigenvector?", "answer": "Flips it to point the opposite way along the same line", "wrong": ["Rotates it by 90 degrees", "Makes it zero", "Nothing; negative eigenvalues are impossible"], "why": "Av = lambda v with lambda < 0 reverses direction but stays on the same line."},
  ],
  "diagonalization": [
    {"question": "If A = P D P^-1 with D diagonal, what is A^5?", "answer": "P D^5 P^-1", "wrong": ["P^5 D P^-5", "5 P D P^-1", "D^5"], "why": "The inner P^-1 P pairs cancel, leaving P D^5 P^-1."},
    {"question": "When is an n by n matrix diagonalizable?", "answer": "When it has n linearly independent eigenvectors", "wrong": ["When all its entries are positive", "Always", "When it is upper triangular"], "why": "Those eigenvectors form the invertible matrix P."},
    {"question": "Is [[1, 1], [0, 1]] diagonalizable?", "answer": "No, it has only one independent eigenvector", "wrong": ["Yes, it is already triangular", "Yes, its eigenvalues are 1 and 1", "No, because its determinant is 0"], "why": "The only eigenvalue is 1, with eigenvectors only along [1, 0]."},
  ],
  "pagerank": [
    {"question": "In the link matrix M, what must each column add up to?", "answer": "1", "wrong": ["0", "The number of pages", "The number of links on the page"], "why": "Each column holds the probabilities of moving from one page to each page."},
    {"question": "Which vector is the PageRank ranking?", "answer": "The eigenvector of the link matrix with eigenvalue 1, scaled to sum to 1", "wrong": ["The eigenvector with the smallest eigenvalue", "The number of links pointing to each page", "The first column of M"], "why": "The steady state satisfies r = Mr."},
    {"question": "Why does PageRank add damping (random jumps)?", "answer": "It guarantees a single steady state that the iteration always reaches", "wrong": ["It makes every page rank equally", "It removes pages with no links", "It makes the matrix symmetric"], "why": "Without damping, some link graphs oscillate or have several steady states."},
  ],
  "orthogonality": [
    {"question": "Are u = [1, 1] and v = [1, -1] orthogonal?", "answer": "Yes, their dot product is 0", "wrong": ["No, they have the same length", "No, v has a negative entry", "Only after normalizing"], "why": "1*1 + 1*(-1) = 0."},
    {"question": "In an orthonormal basis q1, q2, how do you find the coordinates of x?", "answer": "Take the dot products q1 dot x and q2 dot x", "wrong": ["Solve a system with elimination", "Add the entries of x", "Multiply x by the determinant"], "why": "Orthonormality makes each coordinate a simple dot product."},
    {"question": "For a square orthogonal matrix Q, what is Q inverse?", "answer": "Q transpose", "wrong": ["Q itself, always", "-Q", "It has no inverse"], "why": "Q^T Q = I, so the transpose undoes Q."},
  ],
  "dimensionality-reduction": [
    {"question": "Projecting x = [3, 1] onto the line of u = [1, 1]/sqrt(2), what is the reconstruction?", "answer": "[2, 2]", "wrong": ["[3, 1]", "[4, 4]", "[1, 3]"], "why": "z = u dot x = 4/sqrt(2), and z u = [2, 2]."},
    {"question": "Why can a projection onto fewer dimensions not be undone exactly?", "answer": "Different points can have the same projection", "wrong": ["Projections always output zero", "Computers cannot store the coordinates", "The basis vectors are not unit length"], "why": "Points that differ only along a discarded direction get the same compressed coordinates."},
    {"question": "Which directions does PCA keep?", "answer": "The directions in which the data varies most", "wrong": ["The directions with the least variation", "The original coordinate axes", "Random directions"], "why": "Keeping high-variance directions loses the least information."},
  ],
  "spectral-theorem": [
    {"question": "What does the spectral theorem guarantee for a real symmetric matrix A?", "answer": "A = Q Lambda Q^T with orthonormal eigenvectors and real eigenvalues", "wrong": ["A is always invertible", "All entries of A are positive", "A has only one eigenvalue"], "why": "Symmetric matrices diagonalize with an orthogonal matrix of eigenvectors."},
    {"question": "For A = [[2, 1], [1, 2]], which pair are its unit eigenvectors?", "answer": "[1, 1]/sqrt(2) and [1, -1]/sqrt(2)", "wrong": ["[1, 0] and [0, 1]", "[2, 1] and [1, 2]", "[1, 1] and [2, 2]"], "why": "A[1,1] = [3,3] and A[1,-1] = [1,-1]; normalized they are orthonormal."},
    {"question": "Does the theorem apply to [[1, 1], [0, 2]]?", "answer": "No, that matrix is not symmetric, and its eigenvectors are not perpendicular", "wrong": ["Yes, every 2 by 2 matrix qualifies", "Yes, because its eigenvalues are real", "No, because it is not invertible"], "why": "The theorem needs symmetry; this matrix's eigenvectors [1,0] and [1,1] are not orthogonal."},
  ],
  "lu-decomposition": [
    {"question": "For A = [[2, 1], [4, 5]], what is L in A = LU?", "answer": "[[1, 0], [2, 1]]", "wrong": ["[[2, 0], [4, 1]]", "[[1, 2], [0, 1]]", "[[1, 0], [0, 1]]"], "why": "Elimination subtracts 2 times row 1 from row 2, and the multiplier 2 goes into L."},
    {"question": "Why is LU useful when solving Ax = b for many different b?", "answer": "Elimination is done once; each b then needs only two cheap triangular solves", "wrong": ["It makes A symmetric", "It removes the need for b", "It always gives integer answers"], "why": "Triangular solves cost about n^2 operations instead of n^3."},
    {"question": "Why is the general form PA = LU instead of A = LU?", "answer": "Some matrices need row swaps first, for example when a pivot is 0", "wrong": ["P makes the answer positive", "P stands for the pivot values", "LU never exists without P"], "why": "[[0, 1], [1, 0]] has no LU factorization without a swap."},
  ],
  "cholesky-decomposition": [
    {"question": "Which matrices have a Cholesky factorization A = L L^T?", "answer": "Symmetric positive definite matrices", "wrong": ["All square matrices", "All symmetric matrices", "Only diagonal matrices"], "why": "Positive definiteness keeps every square root in the algorithm positive."},
    {"question": "For A = [[4, 2], [2, 3]], what is the Cholesky factor L?", "answer": "[[2, 0], [1, sqrt(2)]]", "wrong": ["[[4, 0], [2, 3]]", "[[2, 1], [0, sqrt(2)]]", "[[2, 0], [2, 1]]"], "why": "L L^T = [[4, 2], [2, 1 + 2]] = A."},
    {"question": "What happens if you run Cholesky on [[1, 2], [2, 1]]?", "answer": "It fails: the matrix is symmetric but not positive definite", "wrong": ["It succeeds with L = [[1, 0], [2, 1]]", "It returns the identity", "It succeeds because the matrix is symmetric"], "why": "Its eigenvalues are 3 and -1, so a square root of a negative number appears."},
  ],
  "svd": [
    {"question": "Which matrices have a singular value decomposition?", "answer": "Every real matrix, of any shape", "wrong": ["Only square matrices", "Only symmetric matrices", "Only invertible matrices"], "why": "Unlike eigendecomposition, the SVD always exists."},
    {"question": "How are the singular values of A related to A^T A?", "answer": "They are the square roots of the eigenvalues of A^T A", "wrong": ["They equal the diagonal entries of A", "They are the eigenvalues of A plus 1", "They are the entries of A^T A"], "why": "For A = [[3,0],[4,5]], A^T A has eigenvalues 45 and 5, giving sqrt(45) and sqrt(5)."},
    {"question": "What is the best rank-1 approximation of A?", "answer": "sigma_1 w1 v1^T, using the largest singular value", "wrong": ["The first row of A", "sigma_2 w2 v2^T, using the smallest singular value", "A with all small entries set to zero"], "why": "Keeping the largest singular terms gives the best low-rank approximation (Eckart-Young)."},
  ],
  "norms": [
    {"question": "What are the L1, L2, and max norms of x = [3, -4]?", "answer": "7, 5, and 4", "wrong": ["7, 25, and 4", "-1, 5, and 3", "5, 5, and 5"], "why": "L1 = |3| + |-4| = 7, L2 = sqrt(9 + 16) = 5, max = the largest |x_i| = 4."},
    {"question": "What shape is the set of vectors in R^2 with L1 norm equal to 1?", "answer": "A diamond (a square turned 45 degrees) with corners on the axes", "wrong": ["A circle", "An axis-aligned square with corners at (1, 1)", "A straight line"], "why": "|x1| + |x2| = 1 is four straight edges joining (1, 0), (0, 1), (-1, 0), and (0, -1). The axis-aligned square is the max norm's unit ball."},
    {"question": "Which rule must every norm satisfy?", "answer": "||x + y|| <= ||x|| + ||y|| (the triangle inequality)", "wrong": ["||x + y|| = ||x|| + ||y|| for all x and y", "||x|| can be negative for some x", "||2x|| = 4 ||x||"], "why": "A detour is never shorter than the direct route. Equality holds only in special cases, lengths are never negative, and ||2x|| = 2||x||."},
  ],
  "inner-products": [
    {"question": "When does <x, y> = x^T A y define an inner product on R^n?", "answer": "When A is symmetric and positive definite", "wrong": ["For every square matrix A", "When A is invertible", "When all entries of A are positive"], "why": "Symmetry makes <x, y> = <y, x>, and positive definiteness makes <x, x> > 0 for every nonzero x. An invertible or entrywise-positive matrix can fail both."},
    {"question": "With A = [[2, 1], [1, 2]], what is <x, y> for x = [1, 0] and y = [0, 1]?", "answer": "1", "wrong": ["0", "2", "3"], "why": "x^T A y picks the entry A_12 = 1. So these vectors are not orthogonal under this inner product, although their dot product is 0."},
    {"question": "Why is the Cauchy-Schwarz inequality needed to define angles?", "answer": "It guarantees <x, y>/(||x|| ||y||) lies between -1 and 1, so it is the cosine of some angle", "wrong": ["It makes every pair of vectors orthogonal", "It shows every inner product is the dot product", "It makes all lengths equal to 1"], "why": "|<x, y>| <= ||x|| ||y|| keeps the ratio in [-1, 1], exactly the range of cosine."},
  ],
  "orthogonal-complement": [
    {"question": "A is a 3 by 5 matrix of rank 2. What are the dimensions of its null space and left null space?", "answer": "3 and 1", "wrong": ["2 and 2", "3 and 3", "1 and 3"], "why": "Null space: n - r = 5 - 2 = 3, inside R^5. Left null space: m - r = 3 - 2 = 1, inside R^3."},
    {"question": "Why is every vector in the null space of A orthogonal to every row of A?", "answer": "Ax = 0 says the dot product of x with each row is 0", "wrong": ["Because the null space is always empty", "Because the rows of A are always orthonormal", "Because A is symmetric"], "why": "Each entry of Ax is (row i) . x, so Ax = 0 means x is perpendicular to every row and hence to the whole row space."},
    {"question": "U is a plane through the origin in R^3. What is its orthogonal complement?", "answer": "The line through the origin along the plane's normal vector", "wrong": ["All vectors not in the plane", "The plane itself", "Only the zero vector"], "why": "The complement is a subspace of dimension 3 - 2 = 1: the normal line. Most vectors are in neither; they split into a part in each."},
  ],
  "orthogonal-projections": [
    {"question": "What is the projection of x = [3, 1] onto the line spanned by b = [1, 1]?", "answer": "[2, 2]", "wrong": ["[3, 0]", "[4, 4]", "[1, 1]"], "why": "(b . x)/(b . b) b = (4/2)[1, 1] = [2, 2]. The error [1, -1] is perpendicular to b."},
    {"question": "Which condition determines the projection of x onto the subspace spanned by the columns of B?", "answer": "The error x - B lambda is perpendicular to every column of B", "wrong": ["The projection has the same length as x", "The error is parallel to the first column of B", "The coordinates lambda are all positive"], "why": "B^T(x - B lambda) = 0 is the normal equation B^T B lambda = B^T x."},
    {"question": "What happens if you apply a projection matrix P twice?", "answer": "Nothing more changes: P^2 = P", "wrong": ["The vector shrinks to zero", "You get the reflection of the vector", "The error doubles"], "why": "After the first projection the vector already lies in the subspace, and projecting a vector of the subspace leaves it unchanged."},
  ],
  "gram-schmidt": [
    {"question": "Gram-Schmidt on b1 = [3, 1], b2 = [2, 2]: what is u2 before normalizing?", "answer": "[-0.4, 1.2]", "wrong": ["[2, 2]", "[-1, 3]", "[0.4, -1.2] + [3, 1]"], "why": "u2 = b2 - (8/10) b1 = [2 - 2.4, 2 - 0.8] = [-0.4, 1.2]. Normalizing gives [-1, 3]/sqrt(10)."},
    {"question": "What does each Gram-Schmidt step subtract from the next vector?", "answer": "Its projections onto the directions already built", "wrong": ["The previous vector itself", "Its length", "Its projection onto the next vector"], "why": "Removing every component along earlier directions leaves only the part perpendicular to all of them."},
    {"question": "What happens if the input vectors are linearly dependent?", "answer": "Some step leaves the zero vector, which cannot be normalized", "wrong": ["The algorithm still produces an orthonormal basis of the same size", "The result is a set of parallel vectors", "Nothing changes; order does not matter"], "why": "A dependent vector lies in the span of the earlier ones, so removing its projections leaves nothing; it should be skipped."},
  ],
  "trace": [
    {"question": "A 2 by 2 matrix has trace 7 and determinant 10. What are its eigenvalues?", "answer": "5 and 2", "wrong": ["7 and 10", "3.5 and 3.5", "10 and -3"], "why": "They solve lambda^2 - 7 lambda + 10 = 0: sum 7 = trace and product 10 = determinant, so 5 and 2."},
    {"question": "Which identity is true for all square matrices A and B of the same size?", "answer": "tr(AB) = tr(BA)", "wrong": ["tr(AB) = tr(A) tr(B)", "AB = BA", "tr(A^-1) = 1/tr(A)"], "why": "The trace is cyclic even though AB and BA are usually different matrices. It does not multiply, and it does not invert."},
    {"question": "What does the trace of a data covariance matrix measure?", "answer": "The total variance: the sum of the variances of all features", "wrong": ["The number of features", "The correlation between the first two features", "The largest single variance"], "why": "The diagonal of a covariance matrix holds each feature's variance, so the trace adds them up. It also equals the sum of the eigenvalues, which PCA divides among its components."},
  ],
  "pca": [
    {"question": "Which direction does the first principal component point in?", "answer": "The unit eigenvector of the covariance matrix with the largest eigenvalue", "wrong": ["The direction of the largest single data point", "The first coordinate axis", "The eigenvector with the smallest eigenvalue"], "why": "b^T S b is the variance along b, and over unit vectors it is largest at the top eigenvector, where it equals lambda_1."},
    {"question": "Covariance eigenvalues are 4 and 1. Keeping one component, what is the average squared reconstruction error?", "answer": "1", "wrong": ["4", "5", "0"], "why": "The error equals the sum of the eigenvalues left out. Kept 4 + lost 1 = total variance 5, so one component explains 80%."},
    {"question": "Why should features usually be standardized before PCA?", "answer": "Otherwise a feature with large units dominates the variance and the components", "wrong": ["PCA only works on values between 0 and 1", "Standardizing makes the covariance matrix diagonal", "It is required for the eigenvectors to be orthogonal"], "why": "Variance depends on units: measuring one feature in millimetres instead of metres multiplies its variance by a million."},
  ],
  "momentum": [
    {"question": "With f(x) = x^2, gamma = 0.1, momentum alpha = 0.5, x_0 = 10 and x_1 = 8, what is x_2?", "answer": "5.4", "wrong": ["6.4", "7.0", "4.4"], "why": "x_2 = 8 - 0.1(16) + 0.5(8 - 10) = 8 - 1.6 - 1 = 5.4."},
    {"question": "Why does momentum help in a long, narrow valley?", "answer": "Back-and-forth steps across the valley cancel, while steps along it add up", "wrong": ["It makes each gradient more accurate", "It lets the step size grow without limit", "It removes the need to compute gradients"], "why": "Adding a fraction of the previous step averages recent steps: oscillating directions cancel, consistent ones build speed."},
    {"question": "What happens if the momentum coefficient alpha is set close to 1?", "answer": "The iterates overshoot and swing back and forth for a long time", "wrong": ["It becomes plain gradient descent", "It always converges in one step", "The steps become zero"], "why": "With little damping the heavy ball keeps rolling past the minimum. alpha = 0 is plain gradient descent."},
  ],
  "lagrange-multipliers": [
    {"question": "Minimize x^2 + y^2 subject to x + y = 1. Where is the minimum?", "answer": "x = y = 1/2", "wrong": ["x = y = 0", "x = 1, y = 0", "x = y = 1"], "why": "2x + lambda = 0 and 2y + lambda = 0 give x = y, and x + y = 1 gives 1/2 each (with lambda = -1)."},
    {"question": "At a constrained minimum on a smooth equality constraint (with grad h not zero), how are grad f and grad h related?", "answer": "They are parallel: grad f = -lambda grad h", "wrong": ["grad f is always zero", "They are always perpendicular", "grad h is always zero"], "why": "The level curve of f just touches the constraint there, so both gradients are normal to the same curve."},
    {"question": "For an inequality constraint g(x) <= 0 that is not active at the solution, what is its multiplier?", "answer": "0", "wrong": ["Any negative number", "1", "It is undefined"], "why": "Complementary slackness: lambda g(x*) = 0. If g(x*) < 0 the constraint does not bind, so lambda = 0."},
  ],
  "derivatives": [
    {"question": "What is the derivative of f(x) = (2x + 1)^3 at x = 1?", "answer": "54", "wrong": ["27", "18", "6"], "why": "Chain rule: f'(x) = 3(2x + 1)^2 * 2 = 6(2x + 1)^2, and 6 * 9 = 54."},
    {"question": "What does the difference quotient (f(x + h) - f(x))/h measure?", "answer": "The slope of the chord from x to x + h, which tends to the derivative as h shrinks", "wrong": ["The area under f between x and x + h", "The exact derivative for any h", "The average value of f on [x, x + h]"], "why": "It is rise over run for a short chord; its limit as h goes to 0 is f'(x)."},
    {"question": "The derivative of the sigmoid can be written in terms of sigma itself. Which formula is right?", "answer": "sigma'(s) = sigma(s)(1 - sigma(s))", "wrong": ["sigma'(s) = sigma(s)^2", "sigma'(s) = 1 - sigma(s)", "sigma'(s) = e^s"], "why": "Differentiating 1/(1 + e^(-s)) gives e^(-s)/(1 + e^(-s))^2, which equals sigma(1 - sigma). At s = 0 it is 0.25."},
  ],
  "partial-derivatives-gradient": [
    {"question": "For f(x, y) = x^2 y + 3y, what is the gradient at (1, 2)?", "answer": "[4, 4]", "wrong": ["[2, 4]", "[4, 3]", "[8, 4]"], "why": "df/dx = 2xy = 4 and df/dy = x^2 + 3 = 4."},
    {"question": "How is the gradient related to the level curve (contour) through a point?", "answer": "It is perpendicular to the contour and points toward higher values", "wrong": ["It is tangent to the contour", "It points toward the minimum", "It has no fixed relation to the contour"], "why": "Moving along the contour keeps f constant, so the slope there, grad f dot u, is 0: u is perpendicular to the gradient."},
    {"question": "The gradient at a point is [3, 4]. What is the largest slope of f among all unit directions?", "answer": "5", "wrong": ["7", "4", "12"], "why": "The directional derivative grad f dot u is largest along the gradient, where it equals ||grad f|| = sqrt(9 + 16) = 5."},
  ],
  "jacobian-chain-rule": [
    {"question": "f maps R^3 to R^2. What is the shape of its Jacobian?", "answer": "2 by 3", "wrong": ["3 by 2", "3 by 3", "2 by 2"], "why": "One row per output (2) and one column per input (3)."},
    {"question": "What is the Jacobian of the linear map f(x) = Ax?", "answer": "A itself", "wrong": ["A^T", "The identity matrix", "det(A)"], "why": "Output i is row i of A dotted with x, so its gradient is row i of A."},
    {"question": "For the polar map f(r, theta) = [r cos theta, r sin theta], what is det J?", "answer": "r", "wrong": ["1", "r^2", "cos theta"], "why": "det J = r cos^2 theta + r sin^2 theta = r, so small areas grow in proportion to the distance from the origin."},
  ],
  "loss-gradients": [
    {"question": "What is the gradient of L(theta) = ||y - X theta||^2 with respect to theta (as a row vector)?", "answer": "-2 (y - X theta)^T X", "wrong": ["2 (y - X theta)", "X^T X", "-2 X (y - X theta)^T"], "why": "Chain rule: the outer function ||e||^2 has gradient 2e^T, and e = y - X theta has Jacobian -X."},
    {"question": "When is the gradient of x^T A x equal to 2 x^T A?", "answer": "When A is symmetric", "wrong": ["Always", "When A is invertible", "When x is a unit vector"], "why": "In general the gradient is x^T (A + A^T), which equals 2 x^T A only if A = A^T."},
    {"question": "For logistic loss with labels in {0, 1}, what is the gradient contributed by one example?", "answer": "(sigma(theta dot x) - y) x", "wrong": ["(y - sigma(theta dot x)) x^2", "sigma(theta dot x) x", "-y log(sigma(theta dot x)) x"], "why": "The sigmoid's derivative sigma(1 - sigma) cancels against the log terms, leaving prediction error times input."},
  ],
  "backpropagation": [
    {"question": "In which order does backpropagation compute derivatives?", "answer": "From the output back toward the inputs, reusing the values stored in the forward pass", "wrong": ["From the inputs forward to the output, one input at a time", "In random order", "All at once by finite differences"], "why": "Starting from dL/dL = 1, each node multiplies the incoming derivative by its local derivative and passes it back."},
    {"question": "A value feeds two later nodes. How is its derivative computed in the backward pass?", "answer": "The contributions from both paths are added", "wrong": ["Only the larger contribution is kept", "The contributions are multiplied", "It is set to zero"], "why": "The multivariate chain rule sums over every path by which the value affects the output."},
    {"question": "With x = 2, y = +1, w = 0.5, b = -0.5 and L = log(1 + e^(-y(wx + b))), what is dL/dw?", "answer": "About -0.755", "wrong": ["About 0.474", "About -0.378", "About 0.755"], "why": "dL/dm = -e^(-0.5)/(1 + e^(-0.5)) ≈ -0.378, then dL/dw = dL/dm * y * x ≈ -0.755. (-0.378 is dL/db.)"},
  ],
  "taylor-hessian": [
    {"question": "What is the second-order Taylor polynomial of e^x around 0?", "answer": "1 + x + x^2/2", "wrong": ["1 + x + x^2", "x + x^2/2", "1 + x^2/2"], "why": "Every derivative of e^x is 1 at 0, and the k-th term is f^(k)(0) x^k / k!."},
    {"question": "At a point with zero gradient, the Hessian has eigenvalues 5 and -1. What kind of point is it?", "answer": "A saddle point", "wrong": ["A local minimum", "A local maximum", "The test cannot say"], "why": "Positive curvature in one direction and negative in another: f goes up one way and down another."},
    {"question": "Which Hessian condition, holding everywhere, makes a twice-differentiable function convex?", "answer": "The Hessian is positive semidefinite everywhere", "wrong": ["The Hessian is invertible everywhere", "All entries of the Hessian are positive", "The Hessian has trace zero"], "why": "Nonnegative curvature in every direction at every point is the multivariable version of f'' >= 0."},
  ],
  "max-margin-svm": [
    {"question": "The margin lines are theta . x + theta_0 = +1 and -1. How far apart are they?", "answer": "2 / ||theta||", "wrong": ["2 ||theta||", "1 / ||theta||^2", "||theta|| / 2"], "why": "Each line is 1/||theta|| from the boundary, one on each side."},
    {"question": "In the soft-margin objective (lambda/2)||theta||^2 + average hinge loss, what does a larger lambda do?", "answer": "Widens the margin and tolerates more points inside it", "wrong": ["Narrows the margin and forbids violations", "Has no effect on the margin", "Removes the need for the hinge loss"], "why": "A larger lambda pushes ||theta|| down, and the margin width 2/||theta|| goes up; more points then fall inside the margin."},
    {"question": "Which training points determine the SVM boundary?", "answer": "Only the support vectors: points on or inside the margin", "wrong": ["All points equally", "Only the points farthest from the boundary", "Only the misclassified points"], "why": "Points well outside the margin have zero hinge loss and zero gradient, so moving them slightly changes nothing."},
  ],
  "feature-scaling": [
    {"question": "Training values 1000, 1500, 2000 have mean 1500 and standard deviation about 408.2. What is the standardized value of a test point 2500?", "answer": "About 2.45", "wrong": ["1", "0", "About 1.22"], "why": "(2500 - 1500)/408.2 ≈ 2.45, using the training mean and standard deviation unchanged."},
    {"question": "Which of these is data leakage?", "answer": "Computing the standardization mean and standard deviation on all data, including the test set", "wrong": ["Standardizing with training-set statistics", "One-hot encoding a category", "Using cross-validation on the training set"], "why": "Statistics from the test set sneak information about it into training, so the test score is optimistic."},
    {"question": "Why does standardizing features often speed up gradient descent?", "answer": "It makes the loss contours rounder (a smaller condition number), so one step size suits every direction", "wrong": ["It reduces the number of features", "It makes the loss non-convex", "It removes the need for a learning rate"], "why": "Very different feature scales make a long, narrow valley; the step size must suit the steep direction and is then tiny for the flat one."},
  ],
  "bias-variance": [
    {"question": "For squared error, what is the expected test error made of?", "answer": "Bias squared plus variance plus irreducible noise", "wrong": ["Bias plus variance", "Training error plus test error", "Variance minus bias squared"], "why": "The decomposition E[(y - h(x))^2] = bias^2 + variance + sigma^2 holds exactly for squared error."},
    {"question": "A degree-9 polynomial fitted to 12 points changes a lot when a few labels change. Which term is large?", "answer": "Variance", "wrong": ["Bias", "Noise", "None; flexible models have no error"], "why": "Sensitivity to the particular training set is variance; flexible models usually have low bias but high variance."},
    {"question": "Predictions at one input from three training sets are 1.5, 1.6, 1.4 and the truth is 2. What is the bias squared?", "answer": "0.25", "wrong": ["0.5", "0.0067", "4"], "why": "The average prediction is 1.5, so bias^2 = (1.5 - 2)^2 = 0.25."},
  ],
  "roc-auc": [
    {"question": "What do the axes of an ROC curve show?", "answer": "False positive rate (x) against true positive rate (y)", "wrong": ["Precision (x) against recall (y)", "Threshold (x) against accuracy (y)", "Training error (x) against test error (y)"], "why": "Each threshold gives one (FPR, TPR) point; sweeping it traces the curve."},
    {"question": "Positive scores are 0.9, 0.8, 0.4 and negative scores 0.7, 0.3, 0.2. What is the AUC?", "answer": "8/9", "wrong": ["1", "2/3", "1/2"], "why": "In 8 of the 9 positive-negative pairs the positive scores higher; only 0.4 < 0.7 fails."},
    {"question": "What AUC does a classifier that guesses at random have?", "answer": "0.5", "wrong": ["0", "1", "It depends on the threshold"], "why": "A random score ranks a positive above a negative half the time; its ROC curve is the diagonal."},
  ],
  "ml-in-production": [
    {"question": "What is covariate shift?", "answer": "The distribution of the inputs changes while the relationship between inputs and labels stays the same", "wrong": ["The labels become noisier", "The model's weights change during deployment", "The test set is smaller than the training set"], "why": "P(x) moves but P(y | x) does not; concept drift is when P(y | x) itself changes."},
    {"question": "Accuracy falls 1.5 points per month from 92%, and the model is retrained every 3 months. What is the average accuracy?", "answer": "89.75%", "wrong": ["92%", "87.5%", "74%"], "why": "Accuracy saws between 92% and 87.5%, so the average is 92 - 1.5*3/2 = 89.75%."},
    {"question": "Sculley et al. describe 'changing anything changes everything'. What does it mean?", "answer": "Features and settings are entangled, so changing one input or hyperparameter can change the behaviour of the whole model", "wrong": ["Models must be retrained every day", "Any code change requires a new dataset", "Changing the test set changes the model"], "why": "ML models mix all their inputs, so no change is truly local; this is one source of technical debt."},
  ],
  "ml-landscape": [
    {"question": "A model learns to predict the time until a tumour recurs from 30 measurements. What kind of problem is this?", "answer": "Supervised regression", "wrong": ["Supervised classification", "Unsupervised learning", "Reinforcement learning"], "why": "Labels are given (supervised) and the target is a number (a time), so it is regression; predicting recurrence yes/no from the same table would be classification."},
    {"question": "Which set lists the three phases of MLOps in the Lesson 1 slides?", "answer": "Data phase, model phase, operations phase", "wrong": ["Train, validate, test", "Collect, clean, label", "Design, code, compile"], "why": "The data phase covers business and data understanding, the model phase data and model engineering, and the operations phase deployment, testing, versioning, delivery, and monitoring."},
    {"question": "Why is DevOps alone not enough for machine learning systems?", "answer": "Because data changes everything: a model can get worse when the data changes even if no code changes", "wrong": ["Because ML code cannot be version-controlled", "Because ML models never need testing", "Because DevOps only works for websites"], "why": "ML behaviour depends on data as well as code, so data and models must be versioned, tested, and monitored too."},
  ],
  "multicollinearity": [
    {"question": "Two standardized features have correlation 0.9. What is the variance inflation factor of each?", "answer": "1/(1 - 0.81) ≈ 5.3", "wrong": ["0.9", "1.9", "10"], "why": "VIF = 1/(1 - R_j^2), and with only two features R_j^2 = rho^2 = 0.81."},
    {"question": "The feature correlation matrix has eigenvalues 3.1, 1.2, 0.6 and 0.01. What does the 0.01 tell you?", "answer": "Some combination of the features is almost constant, so the weights along its eigenvector are very uncertain", "wrong": ["One feature is useless for prediction", "The model will predict new data badly", "The learning rate is too small"], "why": "The weight variance along an eigenvector is sigma^2/(n lambda_i), here 100 times larger than for an eigenvalue of 1."},
    {"question": "What does strong multicollinearity mostly harm?", "answer": "The individual weights and any interpretation of them", "wrong": ["Predictions for data like the training data", "The training error", "The number of features you may use"], "why": "The uncertain direction is one the features barely vary along, so predictions hardly depend on it; the split of credit between features does."},
    {"question": "C has eigenvalues 1.95 and 0.05. What is the condition number after adding a ridge penalty lambda = 0.1?", "answer": "2.05/0.15 ≈ 13.7", "wrong": ["39", "1.95/0.15 = 13", "19.5"], "why": "Ridge adds lambda to every eigenvalue: (1.95 + 0.1)/(0.05 + 0.1)."},
  ],
  "bootstrap": [
    {"question": "How many examples does a bootstrap resample of a dataset with n examples contain?", "answer": "n, drawn with replacement, so some repeat and some are missing", "wrong": ["n/2, drawn without replacement", "n - 1, leaving one example out", "The n original examples in a new order"], "why": "Drawing with replacement is what makes the resamples differ from each other and from the data."},
    {"question": "For large n, about what fraction of the distinct examples appears in one bootstrap resample?", "answer": "About 63%", "wrong": ["About 37%", "About 50%", "All of them"], "why": "Each is missing with probability (1 - 1/n)^n ≈ e^-1 ≈ 0.368, so about 1 - 0.368 = 0.632 appear."},
    {"question": "RMSE(OLS) - RMSE(ridge) on a test set is -0.12, with 95% bootstrap interval [-2.54, 2.00]. What do you conclude?", "answer": "The two models are tied: the interval contains 0", "wrong": ["OLS is clearly better", "Ridge is clearly better", "The test set was used too often"], "why": "A difference this small compared with its uncertainty could easily go either way on another test set."},
    {"question": "To compare two models on one test set, how should you resample?", "answer": "Draw one resample of test examples and score both models on it", "wrong": ["Draw separate resamples for each model", "Resample the features instead of the examples", "Resample only the examples the models disagree on"], "why": "Pairing removes the variation that comes from some examples being hard for both models, so the interval for the difference is much narrower."},
  ],
};
