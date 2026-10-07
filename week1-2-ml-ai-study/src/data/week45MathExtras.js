// Companion content for the Mathematics for AI Week 4 and Week 5 pages (see week45MathConcepts.js):
// quizzes, Python starter code, key ideas, worked-example tasks, "Start here" cards, book references,
// stories, homework, bonus examples, and the class-activities reading guide. Each data file merges its
// part in, so this file imports nothing. Every number was checked by script; the examples are our own.

const tex = String.raw;
const py = String.raw;
const idea = (label, text) => ({ label, text });
const ref = (section, title, page) => ({ section, title, page });
const rosen = (section, title) => ({ book: 'rosen', section, title });

const ids = {
  metric: 'metric-spaces', cosine: 'cosine-similarity', directSum: 'direct-sum',
  graphs: 'graphs-basics', special: 'special-graphs', matrices: 'graph-matrices',
  paths: 'graph-connectivity-paths', euler: 'euler-hamilton', shortest: 'shortest-paths', colouring: 'graph-coloring',
};

export const week45Quizzes = {
  [ids.metric]: [
    { question: 'Which rule is NOT one of the metric axioms?', answer: 'd(2x, 2y) = 2 d(x, y)', wrong: ['d(x, y) = d(y, x)', 'd(x, z) <= d(x, y) + d(y, z)', 'd(x, y) = 0 exactly when x = y'], why: 'Scaling is a property of distances that come from norms. The discrete metric breaks it but is still a metric.' },
    { question: 'Every norm gives a metric by d(x, y) = ...', answer: '||x - y||', wrong: ['||x|| - ||y||', '||x|| ||y||', '||x + y||'], why: 'The induced metric is the norm of the difference; with the L2 norm it is the Euclidean distance.' },
    { question: 'What is a Cauchy sequence?', answer: 'One whose later terms are all within any tolerance of each other', wrong: ['One whose consecutive steps shrink', 'One that is bounded', 'One that converges to 0'], why: 'Shrinking steps are not enough (the harmonic sums diverge); all later terms must be close to one another.' },
    { question: 'Why are the rational numbers not complete?', answer: 'A Cauchy sequence of rationals, such as decimal approximations of sqrt(2), can have an irrational limit', wrong: ['They are not a vector space', 'There are only finitely many of them', 'Their distances can be negative'], why: 'Completeness asks every Cauchy sequence to converge inside the space; the rationals have gaps.' },
    { question: 'A Hilbert space is ...', answer: 'An inner product space that is complete in the metric of its induced norm', wrong: ['Any normed space', 'A space with the discrete metric', 'A space of finite dimension only'], why: 'Banach is complete plus normed; Hilbert is complete plus an inner product. R^n with the dot product is both.' },
  ],
  [ids.cosine]: [
    { question: 'Two nonzero vectors have cosine similarity 0. What does that mean?', answer: 'They are perpendicular: no shared direction', wrong: ['They are identical', 'They point in opposite directions', 'One of them is the zero vector'], why: 'cos 90 degrees = 0; opposite directions give -1.' },
    { question: 'You multiply y by 10. What happens to cos(x, y)?', answer: 'Nothing: the cosine only depends on directions', wrong: ['It is multiplied by 10', 'It is divided by 10', 'It becomes 1'], why: 'Both the inner product and ||y|| grow by 10, and the factors cancel.' },
    { question: 'Why can Euclidean distance mislead when comparing word count vectors?', answer: 'Rare words have small counts, so they all sit near the origin and look close', wrong: ['It can be negative', 'It ignores the counts', 'It only works in two dimensions'], why: 'Distance mixes how often a word is used with how it is used; cosine keeps only the second.' },
    { question: 'Which inequality guarantees that the cosine of the angle is between -1 and 1?', answer: 'Cauchy-Schwarz', wrong: ['The triangle inequality for metrics', 'Hall\'s condition', 'The handshaking theorem'], why: '|<x, y>| <= ||x|| ||y|| is exactly the statement that the ratio lies in [-1, 1].' },
  ],
  [ids.directSum]: [
    { question: 'V = U + W. What else is needed for V = U ⊕ W?', answer: 'U ∩ W = {0}', wrong: ['U and W are perpendicular', 'dim U = dim W', 'U and W are both lines'], why: 'With only 0 in common, each vector has exactly one split u + w.' },
    { question: 'In R³, the xy-plane plus the yz-plane is ...', answer: 'All of R³, but not a direct sum: they share the y-axis', wrong: ['A direct sum, since every vector is reached', 'Only the y-axis', 'A 4-dimensional space'], why: 'dim(U + W) = 2 + 2 - 1 = 3: the shared line is counted twice.' },
    { question: 'R² = U ⊕ W with U = span{[1, 0]} and W = span{[1, 2]}. Split v = [5, 4].', answer: 'u = [3, 0], w = [2, 4]', wrong: ['u = [5, 0], w = [0, 4]', 'u = [1, 0], w = [4, 4]', 'There is no unique split, because U and W are not perpendicular'], why: 'Solve a[1, 0] + b[1, 2] = [5, 4]: b = 2, a = 3.' },
    { question: 'If V = U ⊕ W, what is dim V?', answer: 'dim U + dim W', wrong: ['dim U × dim W', 'The larger of dim U and dim W', 'dim U + dim W - 1'], why: 'A basis of U together with a basis of W is a basis of V.' },
  ],
  [ids.graphs]: [
    { question: 'A graph has 9 edges. What do its degrees add up to?', answer: '18', wrong: ['9', '27', 'It depends on the number of vertices'], why: 'Handshaking: the sum of degrees is twice the number of edges.' },
    { question: 'How much does a loop add to the degree of its vertex in an undirected graph?', answer: '2', wrong: ['1', '0', 'It depends on the other edges'], why: 'Both ends of the loop are at that vertex.' },
    { question: 'Can a graph have exactly three vertices of odd degree?', answer: 'No: the number of odd-degree vertices is always even', wrong: ['Yes, if it has a loop', 'Yes, if it is directed', 'Only if it has three edges'], why: 'The degree sum is even, so the odd degrees must come in pairs.' },
    { question: 'In a directed graph, the in-degrees add up to ...', answer: 'The number of edges, the same as the out-degrees', wrong: ['Twice the number of edges', 'The number of vertices', 'The sum of the out-degrees minus the edges'], why: 'Each directed edge has exactly one head and one tail.' },
  ],
  [ids.special]: [
    { question: 'How many edges does K_6 have?', answer: '15', wrong: ['30', '6', '36'], why: '6 × 5 / 2 = 15: every pair once.' },
    { question: 'Which of these graphs is bipartite?', answer: 'C_6', wrong: ['C_5', 'K_3', 'W_4'], why: 'Even cycles can be 2-coloured; odd cycles, triangles and wheels cannot.' },
    { question: 'Hall\'s condition for a complete matching from jobs to workers says ...', answer: 'Every set of jobs has at least as many qualified workers as jobs', wrong: ['There are at least as many workers as jobs', 'Every worker can do at least one job', 'Every job can be done by at least one worker'], why: 'Each of the other conditions can hold while two jobs still depend on one single worker.' },
    { question: 'K_{3,4} has how many edges?', answer: '12', wrong: ['7', '21', '6'], why: 'Every one of the 3 is joined to every one of the 4.' },
  ],
  [ids.matrices]: [
    { question: 'For an undirected graph without loops, what is the sum of row i of the adjacency matrix?', answer: 'The degree of vertex i', wrong: ['The number of edges', 'Always 2', 'The number of vertices'], why: 'Row i has a 1 for each neighbour of v_i.' },
    { question: 'What does each column of an (undirected) incidence matrix add up to?', answer: '2, one for each endpoint (1 for a loop)', wrong: ['The degree of the vertex', 'The number of vertices', '0'], why: 'A column is an edge, and an edge has two endpoints.' },
    { question: 'Two graphs have the same number of vertices and edges. Are they isomorphic?', answer: 'Not necessarily: compare invariants such as the degree lists', wrong: ['Yes, always', 'Only if both are connected', 'Yes, if their adjacency matrices have the same size'], why: 'The 4-cycle and the triangle with a tail both have 4 vertices and 4 edges but different degrees.' },
    { question: 'Relabelling the vertices changes the adjacency matrix A into ...', answer: 'P A Pᵀ for a permutation matrix P', wrong: ['A + P', 'A²', 'Aᵀ'], why: 'The same permutation reorders the rows and the columns.' },
  ],
  [ids.paths]: [
    { question: 'What does entry (i, j) of A³ count?', answer: 'Routes of exactly 3 edges from v_i to v_j', wrong: ['Routes of at most 3 edges', 'Triangles containing v_i', 'Simple paths with 3 vertices'], why: 'Each matrix product extends every route by one edge.' },
    { question: 'In a simple graph, the diagonal entry (A²)_ii equals ...', answer: 'The degree of v_i', wrong: ['0', 'The number of triangles at v_i', '1'], why: 'Going out along an edge and straight back is a route of length 2 from v_i to itself.' },
    { question: 'A directed graph is weakly but not strongly connected. That means ...', answer: 'It is connected when directions are ignored, but some vertex cannot reach some other vertex', wrong: ['It has two components', 'It has no circuits at all', 'Every vertex reaches every other'], why: 'Weak connectivity ignores directions; strong connectivity needs routes both ways.' },
    { question: 'How can you test whether a graph on n vertices is connected using matrices?', answer: 'Check that (I + A)^(n - 1) has no zero entry', wrong: ['Check that det A is not 0', 'Check that A is symmetric', 'Check that the trace of A is positive'], why: 'Connected vertices are joined by a route of at most n - 1 edges, and the I lets shorter routes count.' },
  ],
  [ids.euler]: [
    { question: 'A connected multigraph has degrees 4, 2, 3, 3, 2. What does it have?', answer: 'An Euler path between the two vertices of degree 3, but no Euler circuit', wrong: ['An Euler circuit', 'Neither an Euler path nor a circuit', 'An Euler path starting anywhere'], why: 'Exactly two odd vertices: the path must start at one and end at the other.' },
    { question: 'When does a connected multigraph have an Euler circuit?', answer: 'When every vertex has even degree', wrong: ['When every vertex has degree at least n/2', 'When it has a Hamilton circuit', 'When it has an even number of edges'], why: 'Each pass through a vertex uses two edges there.' },
    { question: 'How many different Hamilton circuits does K_5 have?', answer: '12', wrong: ['120', '24', '5'], why: 'Fix a start: 4! orders of the rest, halved because each circuit can be travelled both ways.' },
    { question: 'Which statement about Dirac\'s theorem (every degree at least n/2 gives a Hamilton circuit) is true?', answer: 'It is sufficient but not necessary', wrong: ['It is necessary and sufficient', 'It is necessary but not sufficient', 'It applies only to Euler circuits'], why: 'C_5 has a Hamilton circuit although every degree is 2 < 5/2.' },
  ],
  [ids.shortest]: [
    { question: 'Which vertex does Dijkstra\'s algorithm settle next?', answer: 'The unsettled vertex with the smallest label', wrong: ['The neighbour joined by the cheapest edge', 'The vertex with the most neighbours', 'The target vertex'], why: 'With positive weights that label can never be improved later.' },
    { question: 'Why must the weights be positive?', answer: 'A negative edge could lower a label after its vertex was settled', wrong: ['Otherwise the graph is disconnected', 'Otherwise there are too many paths to count', 'Negative weights make the graph directed'], why: 'Settling assumes no later detour can be cheaper.' },
    { question: 'With s–a 4, s–b 2 and a–b 1, what is the shortest distance from s to a?', answer: '3', wrong: ['4', '1', '5'], why: 'The detour s–b–a costs 2 + 1 = 3, less than the direct road.' },
    { question: 'The travelling salesperson problem asks for ...', answer: 'The cheapest circuit that visits every vertex exactly once', wrong: ['The shortest path between two vertices', 'A circuit that uses every edge once', 'The fewest colours for the vertices'], why: 'It is a cheapest Hamilton circuit, for which no fast algorithm is known.' },
  ],
  [ids.colouring]: [
    { question: 'What is the chromatic number of C_7?', answer: '3', wrong: ['2', '7', '4'], why: 'Odd cycles cannot be 2-coloured, and 3 colours suffice.' },
    { question: 'A graph contains K_4. What can you say about its chromatic number?', answer: 'It is at least 4', wrong: ['It is exactly 4', 'It is at most 4', 'It is 2'], why: 'The four vertices of the clique need four different colours; other parts may need more.' },
    { question: 'What does the four colour theorem say?', answer: 'Every planar graph can be coloured with at most 4 colours', wrong: ['Every graph needs 4 colours', 'Every graph with 4 vertices is planar', 'K_4 is not planar'], why: 'It concerns graphs drawable without crossings, such as maps.' },
    { question: 'Exam scheduling: what do the colours stand for?', answer: 'Time slots; exams sharing a student must get different slots', wrong: ['Students', 'Rooms of different sizes', 'Courses with no students in common'], why: 'Vertices are exams, edges are clashes, and the colours are slots.' },
  ],
};

export const week45CodeExamples = {
  [ids.metric]: py`import numpy as np

x, y = np.array([1.0, 2.0]), np.array([4.0, 6.0])
print("Euclidean:", np.linalg.norm(x - y))           # 5
print("L1:", np.abs(x - y).sum(), " max:", np.abs(x - y).max())

def discrete(u, v):
    return 0.0 if np.array_equal(u, v) else 1.0
print("discrete d(x, 0) =", discrete(x, 0 * x), " d(2x, 0) =", discrete(2 * x, 0 * x))
print("a norm would give d(2x, 0) = 2 d(x, 0); the discrete metric does not")

# Convergence: x_n = [1/n, 2 - 1/n] -> [0, 2]
limit = np.array([0.0, 2.0])
eps = 0.01
N = next(n for n in range(1, 10_000) if np.linalg.norm(np.array([1 / n, 2 - 1 / n]) - limit) < eps)
print("first n within", eps, ":", N)                 # 142

# A Cauchy sequence of rationals whose limit is irrational
approx = [int(2 ** 0.5 * 10 ** k) / 10 ** k for k in range(1, 8)]   # 1.4, 1.41, 1.414, ...
print("decimal approximations:", approx)
print("gaps between neighbours:", [round(b - a, 8) for a, b in zip(approx, approx[1:])])

# Try: change eps to 0.001. How does N grow?`,

  [ids.cosine]: py`import numpy as np

words = {"dog": [6, 0, 15], "puppy": [1, 0, 3], "kiwi": [2, 1, 0]}   # counts with eat, sweet, bark
V = {w: np.array(c, dtype=float) for w, c in words.items()}

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

for a, b in [("puppy", "dog"), ("puppy", "kiwi"), ("dog", "kiwi")]:
    print(f"{a:>5} vs {b:<5} cos = {cosine(V[a], V[b]):.3f}   distance = {np.linalg.norm(V[a] - V[b]):.2f}")

print("cos(puppy, 2 * puppy-ish counts) unchanged:", round(cosine(2 * V["puppy"], V["dog"]), 3))

unit = {w: v / np.linalg.norm(v) for w, v in V.items()}
print("after normalizing, distance puppy-dog:", round(np.linalg.norm(unit["puppy"] - unit["dog"]), 3))

# Try: add a context word that every word co-occurs with a lot (e.g. append 50 to each vector).
# What happens to all the cosine similarities?`,

  [ids.directSum]: py`import numpy as np

# R^2 = U (+) W with U = span{[1, 0]}, W = span{[1, 2]}
basis = np.array([[1.0, 1.0],
                  [0.0, 2.0]])          # columns: [1, 0] and [1, 2]
v = np.array([5.0, 4.0])
a, b = np.linalg.solve(basis, v)
print("u =", a * basis[:, 0], " w =", b * basis[:, 1], " sum =", a * basis[:, 0] + b * basis[:, 1])

# Not a direct sum: xy-plane + yz-plane in R^3 share the y-axis
xy = np.array([[1, 0, 0], [0, 1, 0]]).T
yz = np.array([[0, 1, 0], [0, 0, 1]]).T
together = np.hstack([xy, yz])
print("dim(U + W) =", np.linalg.matrix_rank(together), "= 2 + 2 - dim(U n W), so dim(U n W) = 1")

# The perpendicular split W (+) W-perp
w = np.array([1.0, 2.0])
p = (v @ w) / (w @ w) * w
print("projection onto W:", p, " rest:", v - p, " rest . w =", round((v - p) @ w, 10))

# Try: make W = span{[2, 0]}. What does np.linalg.solve say, and why?`,

  [ids.graphs]: py`from collections import Counter

edges = [("Ana", "Ben"), ("Ana", "Cai"), ("Ben", "Cai"), ("Cai", "Dee"), ("Cai", "Eli")]
degree = Counter()
for u, v in edges:
    degree[u] += 1
    degree[v] += 1
print("degrees:", dict(degree))
print("sum of degrees =", sum(degree.values()), "= 2 x", len(edges))
print("odd-degree vertices:", [v for v, d in degree.items() if d % 2])

neighbours = {v: sorted({b if a == v else a for a, b in edges if v in (a, b)}) for v in degree}
print("N(Cai) =", neighbours["Cai"])

follows = [("Ana", "Ben"), ("Ben", "Ana"), ("Ana", "Cai"), ("Cai", "Dee"), ("Eli", "Cai"), ("Dee", "Eli")]
out_deg = Counter(u for u, _ in follows)
in_deg = Counter(v for _, v in follows)
print("out:", dict(out_deg), " in:", dict(in_deg), " both sum to", len(follows))

# Try: can 7 people each have exactly 3 friends? Check the parity of 7 * 3.`,

  [ids.special]: py`from itertools import combinations

# Hall's condition: jobs -> workers who can do them
can_do = {"Data": {"Pat", "Quinn"}, "Design": {"Quinn"}, "Docs": {"Quinn", "Raj"}}

def hall_ok(can_do):
    jobs = list(can_do)
    for k in range(1, len(jobs) + 1):
        for group in combinations(jobs, k):
            workers = set().union(*(can_do[j] for j in group))
            if len(workers) < len(group):
                return False, group, workers
    return True, None, None

print(hall_ok(can_do))
can_do["Docs"] = {"Quinn"}          # Raj leaves
print(hall_ok(can_do))

# Bipartite test by 2-colouring a cycle C_n
def two_colour_cycle(n):
    colour = [i % 2 for i in range(n)]
    return all(colour[i] != colour[(i + 1) % n] for i in range(n))
print({n: two_colour_cycle(n) for n in range(3, 9)})

print("edges of K_n:", {n: n * (n - 1) // 2 for n in range(2, 8)})

# Try: write a function that finds an actual matching (try every assignment with itertools.permutations).`,

  [ids.matrices]: py`import numpy as np

V = ["a", "b", "c", "d"]
E = [("a", "b"), ("b", "c"), ("c", "a"), ("c", "d")]
n, m = len(V), len(E)
A = np.zeros((n, n), dtype=int)
M = np.zeros((n, m), dtype=int)
for k, (u, w) in enumerate(E):
    i, j = V.index(u), V.index(w)
    A[i, j] = A[j, i] = 1
    M[i, k] = M[j, k] = 1
print("A =\n", A, "\nrow sums (degrees):", A.sum(axis=1))
print("M =\n", M, "\ncolumn sums:", M.sum(axis=0))
D = np.diag(A.sum(axis=1))
print("M M^T == D + A:", np.array_equal(M @ M.T, D + A))

# Isomorphism: relabel with a permutation matrix
order = [0, 2, 1, 3]                  # a->1, b->3, c->2, d->4
P = np.eye(n, dtype=int)[order]
print("P A P^T =\n", P @ A @ P.T)
print("degree lists:", sorted(A.sum(axis=1).tolist()), sorted((P @ A @ P.T).sum(axis=1).tolist()))

# Try: build the 4-cycle a-b-c-d-a. Compare its sorted degree list with this graph's.`,

  [ids.paths]: py`import numpy as np
from itertools import product

V = ["a", "b", "c", "d"]
A = np.array([[0, 1, 1, 1],
              [1, 0, 1, 0],
              [1, 1, 0, 1],
              [1, 0, 1, 0]])
A2, A3 = A @ A, A @ A @ A
print("A^2 =\n", A2)
print("(A^2)[b, d] =", A2[1, 3], "  (A^3)[a, a] =", A3[0, 0])

def routes(start, end, r):
    found = []
    for middle in product(range(4), repeat=r - 1):
        walk = (start, *middle, end)
        if all(A[walk[k], walk[k + 1]] for k in range(r)):
            found.append("".join(V[v] for v in walk))
    return found
print("routes of length 2 from b to d:", routes(1, 3, 2))
print("routes of length 3 from a to a:", routes(0, 0, 3))

n = len(V)
reach = np.linalg.matrix_power(np.eye(n, dtype=int) + A, n - 1)
print("connected:", bool((reach > 0).all()))

# Try: delete the edge c-d and d-a (set those entries to 0). Is the graph still connected?`,

  [ids.euler]: py`from collections import Counter, defaultdict

bridges = [("A", "B"), ("A", "B"), ("A", "C"), ("B", "C"), ("C", "D"), ("C", "D"), ("B", "D")]
degree = Counter(v for e in bridges for v in e)
odd = [v for v, d in degree.items() if d % 2]
print("degrees:", dict(degree), " odd:", odd)

def euler_route(edges):
    adjacency = defaultdict(list)
    for k, (u, v) in enumerate(edges):
        adjacency[u].append((v, k))
        adjacency[v].append((u, k))
    deg = Counter(v for e in edges for v in e)
    odd = [v for v in deg if deg[v] % 2]
    start = odd[0] if odd else edges[0][0]
    used, stack, route = set(), [start], []
    while stack:                       # Hierholzer: walk until stuck, then back up
        v = stack[-1]
        while adjacency[v] and adjacency[v][-1][1] in used:
            adjacency[v].pop()
        if adjacency[v]:
            w, k = adjacency[v].pop()
            used.add(k)
            stack.append(w)
        else:
            route.append(stack.pop())
    return route[::-1]

print("Euler path:", "-".join(euler_route(bridges)))
print("with A-D added:", "-".join(euler_route(bridges + [("A", "D")])))

from math import factorial
print("Hamilton circuits of K_n:", {n: factorial(n - 1) // 2 for n in range(3, 11)})

# Try: add the bridge B-C as well. How many odd vertices now, and where must the route start?`,

  [ids.shortest]: py`import heapq

roads = {("s", "a"): 4, ("s", "b"): 2, ("a", "b"): 1, ("a", "c"): 5, ("b", "c"): 8,
         ("b", "d"): 10, ("c", "d"): 2, ("c", "t"): 6, ("d", "t"): 3}
graph = {}
for (u, v), w in roads.items():
    graph.setdefault(u, {})[v] = w
    graph.setdefault(v, {})[u] = w

def dijkstra(graph, source):
    label = {v: float("inf") for v in graph}
    label[source] = 0
    previous, settled = {}, set()
    queue = [(0, source)]
    while queue:
        d, u = heapq.heappop(queue)
        if u in settled:
            continue
        settled.add(u)
        print(f"settle {u} at {d}")
        for v, w in graph[u].items():
            if v not in settled and d + w < label[v]:
                label[v], previous[v] = d + w, u
                heapq.heappush(queue, (label[v], v))
    return label, previous

label, previous = dijkstra(graph, "s")
route = ["t"]
while route[-1] != "s":
    route.append(previous[route[-1]])
print("shortest s -> t:", label["t"], "via", "-".join(reversed(route)))

# Try: change the weight of s-a to 1. Which route wins now?`,

  [ids.colouring]: py`clashes = [("Math", "ML"), ("Math", "Stats"), ("ML", "Stats"),
           ("ML", "Physics"), ("Stats", "Physics"), ("Physics", "Art")]
neighbours = {}
for u, v in clashes:
    neighbours.setdefault(u, set()).add(v)
    neighbours.setdefault(v, set()).add(u)

def greedy(order):
    colour = {}
    for v in order:
        taken = {colour[u] for u in neighbours[v] if u in colour}
        colour[v] = next(c for c in range(1, len(order) + 1) if c not in taken)
    return colour

slots = greedy(["Math", "ML", "Stats", "Physics", "Art"])
print("slots:", slots, " number used:", max(slots.values()))

# Order matters: the path a-b-c-d
neighbours = {"a": {"b"}, "b": {"a", "c"}, "c": {"b", "d"}, "d": {"c"}}
print("order a, b, c, d:", greedy(["a", "b", "c", "d"]))
print("order a, d, b, c:", greedy(["a", "d", "b", "c"]))

# King's graph: colour seat (r, c) by (r % 2, c % 2)
rows, cols = 4, 6
colour = {(r, c): 2 * (r % 2) + (c % 2) + 1 for r in range(rows) for c in range(cols)}
ok = all(colour[(r, c)] != colour[(r + dr, c + dc)]
         for (r, c) in colour for dr in (-1, 0, 1) for dc in (-1, 0, 1)
         if (dr, dc) != (0, 0) and (r + dr, c + dc) in colour)
print("4-version seating works:", ok)

# Try: K_5 has v = 5 and e = 10. Check e <= 3v - 6 to see why it cannot be drawn without crossings.`,
};

export const week45IntuitionDetails = {
  [ids.metric]: {
    keyIdeas: [
      idea('Three rules', 'A metric is never negative (and zero only for equal points), is symmetric, and obeys the triangle inequality. Nothing else is required.'),
      idea('Norms give metrics', 'd(x, y) = ||x - y|| is a metric for every norm. The discrete metric shows the converse fails: it scales wrongly for a norm.'),
      idea('Converge versus Cauchy', 'Converging means approaching a limit; Cauchy means the terms approach each other. In a complete space the two are the same.'),
      idea('Banach and Hilbert', 'A complete normed space is Banach; a complete inner product space is Hilbert. R^n is both, which is why limits behave.'),
    ],
    courseNotes: ['The Week 4 Class 1 appendix defines metric spaces, convergence, Cauchy sequences and completeness, and names Banach and Hilbert spaces. These ideas guarantee that iterative methods such as gradient descent have something to converge to.'],
  },
  [ids.cosine]: {
    keyIdeas: [
      idea('Direction only', 'Cosine similarity divides the inner product by both lengths, so only the angle remains. Scaling either vector changes nothing.'),
      idea('Words as vectors', 'Count how often a word appears near each context word. Words used in similar contexts get vectors pointing in similar directions.'),
      idea('Why not distance', 'Raw distances mix frequency with meaning: rare words crowd near the origin. After normalizing, distance and cosine rank pairs the same way.'),
      idea('Good context words', 'Function words and one dominant name make everything look alike. Pick informative content words and use plenty of text.'),
    ],
    courseNotes: ['The Week 4 Class 1 slides build co-occurrence vectors from a book with an AI assistant and show how a shared dominant context word distorts the similarities. Compositional meaning for whole sentences is left to later courses.'],
  },
  [ids.directSum]: {
    keyIdeas: [
      idea('Exactly one split', 'U ⊕ W means every vector is u + w in exactly one way. That happens when U + W is everything and U and W share only 0.'),
      idea('Dimensions add', 'The bases of U and W together form a basis, so dim(U ⊕ W) = dim U + dim W. An overlap is counted twice and must be subtracted.'),
      idea('Perpendicular is special', 'Any two different lines split the plane. The split V = W ⊕ W⊥ is the special one whose pieces are orthogonal projections.'),
    ],
  },
  [ids.graphs]: {
    keyIdeas: [
      idea('Vertices and edges', 'Vertices are the things; edges are relationships. Edges may be directed, repeated (multigraph) or loops; a simple graph has neither repeats nor loops.'),
      idea('Degree', 'The degree counts edge-ends at a vertex, a loop counting twice. Directed graphs split it into in-degree and out-degree.'),
      idea('Handshaking', 'Every edge has two ends, so the degrees sum to twice the number of edges and odd degrees come in pairs.'),
      idea('Models', 'Friendship graphs, influence graphs, word networks, web links and road maps are all graphs with different kinds of edges.'),
    ],
  },
  [ids.special]: {
    keyIdeas: [
      idea('Named shapes', 'K_n (every pair joined, n(n - 1)/2 edges), C_n (a ring), W_n (ring plus hub) and K_m,n (two complete sides).'),
      idea('Bipartite', 'Two sides with every edge across. Equivalent tests: two colours suffice, or there is no cycle of odd length.'),
      idea('Matchings', 'A matching pairs vertices without sharing. Hall: every set of jobs needs at least as many qualified workers for all jobs to be filled.'),
      idea('Subgraphs', 'A subgraph keeps some vertices and some edges; the induced subgraph keeps every edge between the chosen vertices.'),
    ],
  },
  [ids.matrices]: {
    keyIdeas: [
      idea('Adjacency', 'A_ij counts the edges from vertex i to vertex j. Undirected graphs give symmetric matrices, and row sums are degrees when there are no loops.'),
      idea('Incidence', 'One row per vertex and one column per edge, marking the endpoints. For directed graphs the tail gets -1 and the head +1.'),
      idea('Linear algebra link', 'M Mᵀ = D + A for a simple graph, and the signed version gives the Laplacian D - A used in spectral methods and graph neural networks.'),
      idea('Isomorphism', 'Same graph, different labels: A changes to P A Pᵀ. Invariants such as the degree list can prove two graphs are different.'),
    ],
  },
  [ids.paths]: {
    keyIdeas: [
      idea('Paths and circuits', 'A path follows edges end to end; a circuit returns to its start. Simple means no edge is used twice.'),
      idea('Components', 'A graph is connected if every pair is joined by a path; otherwise it splits into connected components.'),
      idea('Directed connectivity', 'Strongly connected: every vertex reaches every other along the directions. Weakly connected: connected once directions are ignored.'),
      idea('Counting with A^r', 'Entry (i, j) of A^r counts the routes of length r from i to j, because each multiplication adds one more edge.'),
    ],
  },
  [ids.euler]: {
    keyIdeas: [
      idea('Euler', 'Use every edge once. Connected with all degrees even gives a circuit; exactly two odd vertices give a path between them.'),
      idea('Finding one', 'Walk until you return, then splice in detours through unused edges (Hierholzer\'s method) until every edge is used.'),
      idea('Hamilton', 'Visit every vertex once. No simple test is known; Dirac\'s and Ore\'s degree conditions are sufficient, and backtracking works for small graphs.'),
      idea('Travelling salesperson', 'The cheapest Hamilton circuit. Trying all (n - 1)!/2 tours is hopeless beyond a few dozen cities.'),
    ],
  },
  [ids.shortest]: {
    keyIdeas: [
      idea('Labels', 'Each vertex carries the length of the best route found so far. The start has 0 and every other vertex starts at infinity.'),
      idea('Greedy step', 'Settle the unsettled vertex with the smallest label, then try to improve its neighbours through it.'),
      idea('Why it works', 'With positive weights any other route to the settled vertex passes a vertex with a label at least as large, so it cannot be shorter.'),
      idea('Limits', 'Negative weights break it. The travelling salesperson problem is a different and much harder question.'),
    ],
  },
  [ids.colouring]: {
    keyIdeas: [
      idea('Proper colouring', 'Neighbours get different colours. The chromatic number is the fewest colours that work.'),
      idea('Lower and upper bounds', 'A clique of size k forces k colours; colouring one by one never needs more than the largest degree plus one.'),
      idea('Planar graphs', 'Drawable without crossings. They need at most 4 colours, and they have at most 3v - 6 edges, which rules out K_5.'),
      idea('Applications', 'Exam timetables, radio frequencies, seating plans with different test versions, and register allocation in compilers.'),
    ],
  },
};

export const week45ExampleTasks = {
  [ids.metric]: 'For x = [1, 2], y = [4, 6], z = [4, 2], find d(x, y) in three metrics and check the triangle inequality through z. Show the discrete metric comes from no norm, find N for x_n = [1/n, 2 - 1/n] with tolerance 0.01, and explain why the rationals are not complete.',
  [ids.cosine]: 'Words dog [6, 0, 15], puppy [1, 0, 3] and kiwi [2, 1, 0] are co-occurrence counts with eat, sweet and bark. Compare Euclidean distance with cosine similarity, and find the distance after normalizing.',
  [ids.directSum]: 'Split v = [5, 4] along U = span{[1, 0]} and W = span{[1, 2]}. Then show the xy-plane and yz-plane of R³ do not form a direct sum, and split v along W = span{[1, 2]} and its orthogonal complement.',
  [ids.graphs]: 'For five students with friendships Ana–Ben, Ana–Cai, Ben–Cai, Cai–Dee, Cai–Eli, find every degree, check the handshaking theorem, and find in- and out-degrees of a "follows" graph. Can 7 people each have exactly 3 friends?',
  [ids.special]: 'Jobs Data (Pat or Quinn), Design (Quinn) and Docs (Quinn or Raj): check Hall\'s condition and find a complete matching, then see what fails when Raj leaves. Count the edges of K_5 and decide whether C_5 and C_6 are bipartite.',
  [ids.matrices]: 'For the triangle a, b, c with the extra edge c–d, write the adjacency and incidence matrices, check M Mᵀ = D + A, and decide which of two other 4-edge graphs is isomorphic to it.',
  [ids.paths]: 'For the 4-cycle a–b–c–d–a with chord a–c, compute A², read off the routes of length 2 from b to d and the degrees, find (A³)_aa, and find the strongly connected components of a directed graph.',
  [ids.euler]: 'Four districts are joined by seven bridges (A–B twice, A–C, B–C, C–D twice, B–D). Decide whether an Euler circuit or path exists, find one, and see what one extra bridge changes. Then count the tours a salesperson faces.',
  [ids.shortest]: 'Run Dijkstra\'s algorithm from s on roads s–a 4, s–b 2, a–b 1, a–c 5, b–c 8, b–d 10, c–d 2, c–t 6, d–t 3, and recover the shortest route to t.',
  [ids.colouring]: 'Schedule five exams with six clashes using as few time slots as possible, find how many test versions a seating grid with diagonal neighbours needs, and show that colouring one by one can depend on the order.',
};

export const week45PlainGuide = {
  [ids.metric]: { question: 'What does it mean to get close to something?', idea: 'A metric is any fair rule for distance. With one, "the sequence gets as close as you like to its limit" becomes a precise test.', tryIt: 'Shrink epsilon and watch N move right. However small the band, the dots eventually stay inside it.', realWorld: 'Guarantees that training algorithms and numerical methods have a limit to converge to.' },
  [ids.cosine]: { question: 'How alike are two words or documents?', idea: 'Compare the directions of their count vectors, not their sizes: the cosine of the angle is 1 for the same direction and 0 for unrelated.', tryIt: 'Stretch b. The distance between the tips changes a lot, but the cosine stays put until you turn a vector.', realWorld: 'Search engines, recommendation and retrieval for chatbots all rank by cosine similarity.' },
  [ids.directSum]: { question: 'Can a space be split into two clean pieces?', idea: 'When two subspaces share only zero and together reach everything, every vector splits into one piece from each in exactly one way.', tryIt: 'Turn W towards U. The split stays unique until the two lines coincide.', realWorld: 'Splitting a signal into a trend and noise, or data into explained and unexplained parts.' },
  [ids.graphs]: { question: 'How do we describe a network of relationships?', idea: 'Draw things as dots and relationships as lines. Counting the lines at each dot (its degree) already reveals a lot.', tryIt: 'Add edges one at a time and watch the degree total: it always goes up by two.', realWorld: 'Social networks, web links, road maps and molecules are all graphs.' },
  [ids.special]: { question: 'Can every job get its own qualified worker?', idea: 'Workers and jobs form a two-sided graph. Every job can be filled exactly when each group of jobs has enough different workers between them.', tryIt: 'Change the ring size n. Even rings take two colours; odd ones always leave one clash.', realWorld: 'Assigning staff to shifts, students to projects and organ donors to patients.' },
  [ids.matrices]: { question: 'How does a computer store a network?', idea: 'A table with a 1 where two things are joined. Relabelling the dots shuffles the table but leaves the network the same.', tryIt: 'Relabel the vertices. The matrix changes, but the list of degrees never does.', realWorld: 'Graph databases, chemistry software comparing molecules, and graph neural networks.' },
  [ids.paths]: { question: 'Can everyone reach everyone, and in how many ways?', idea: 'Follow edges to see who can reach whom. Multiplying the adjacency table by itself counts the routes of each length.', tryIt: 'Pick a start, an end and a length. The count is one entry of A to that power, and every route is listed.', realWorld: 'Checking that a network has no cut-off parts, and counting connections in social networks.' },
  [ids.euler]: { question: 'Can you cross every bridge exactly once?', idea: 'Yes exactly when at most two places have an odd number of bridges. Visiting every place once is a much harder question.', tryIt: 'Build extra bridges and trace the route. Count the odd degrees before you press play.', realWorld: 'Planning snow-plough, street-sweeping and postal routes, and delivery tours.' },
  [ids.shortest]: { question: 'What is the quickest route from here to there?', idea: 'Grow outwards from the start, always fixing the closest unfinished place next and updating its neighbours.', tryIt: 'Press play and watch the labels shrink as better routes are found. The final route is highlighted.', realWorld: 'Every navigation app and internet routing protocol uses this idea.' },
  [ids.colouring]: { question: 'How few time slots can we use without clashes?', idea: 'Give clashing things different colours. Groups that all clash with each other set the minimum number needed.', tryIt: 'Grow the seating grid and switch to the chessboard pattern. The diagonal neighbours clash.', realWorld: 'Exam timetables, radio frequency allocation and seating different test versions.' },
};

export const week45WorkedExampleMath = {
  [ids.cosine]: [
    tex`\text{dog}=\begin{bmatrix}6\\0\\15\end{bmatrix},\ \ \text{puppy}=\begin{bmatrix}1\\0\\3\end{bmatrix},\ \ \text{kiwi}=\begin{bmatrix}2\\1\\0\end{bmatrix}`,
    tex`d(\text{puppy},\text{dog})=13,\qquad d(\text{puppy},\text{kiwi})=\sqrt{11}\approx3.32`,
    tex`\cos(\text{puppy},\text{dog})=\frac{51}{\sqrt{10}\,\sqrt{261}}\approx0.998,\qquad \cos(\text{puppy},\text{kiwi})=\frac{2}{\sqrt{10}\,\sqrt5}\approx0.283`,
  ],
  [ids.directSum]: [
    null,
    tex`a\begin{bmatrix}1\\0\end{bmatrix}+b\begin{bmatrix}1\\2\end{bmatrix}=\begin{bmatrix}5\\4\end{bmatrix}\ \Rightarrow\ b=2,\ a=3`,
    tex`\dim(U+W)=2+2-1=3`,
    tex`\tfrac{13}{5}\begin{bmatrix}1\\2\end{bmatrix}+\tfrac65\begin{bmatrix}2\\-1\end{bmatrix}=\begin{bmatrix}5\\4\end{bmatrix}`,
  ],
  [ids.matrices]: [
    null,
    tex`A=\begin{bmatrix}0&1&1&0\\1&0&1&0\\1&1&0&1\\0&0&1&0\end{bmatrix}`,
    tex`M=\begin{bmatrix}1&0&1&0\\1&1&0&0\\0&1&1&1\\0&0&0&1\end{bmatrix}`,
    tex`MM^T=\begin{bmatrix}2&1&1&0\\1&2&1&0\\1&1&3&1\\0&0&1&1\end{bmatrix}=D+A`,
  ],
  [ids.paths]: [
    tex`A=\begin{bmatrix}0&1&1&1\\1&0&1&0\\1&1&0&1\\1&0&1&0\end{bmatrix}`,
    tex`A^2=\begin{bmatrix}3&1&2&1\\1&2&1&2\\2&1&3&1\\1&2&1&2\end{bmatrix}`,
  ],
};

export const week45MmlReferences = {
  [ids.metric]: [ref('3.3', 'Lengths and Distances (Definition 3.6, metric)', 75)],
  [ids.cosine]: [ref('3.4', 'Angles and Orthogonality', 76), ref('3.3', 'Lengths and Distances (Cauchy-Schwarz inequality)', 75)],
  [ids.directSum]: [ref('3.6', 'Orthogonal Complement', 79), ref('2.4.3', 'Vector Subspaces', 39)],
};

// Graph theory is not in the reference book; the Week 5 slides follow Rosen's Chapter 10.
export const week45NotInBook = [ids.graphs, ids.special, ids.matrices, ids.paths, ids.euler, ids.shortest, ids.colouring];

export const week45CourseBooks = {
  rosen: {
    short: 'Rosen',
    citation: 'K. H. Rosen, Discrete Mathematics and Its Applications, 8th ed. McGraw-Hill, 2019 (Chapter 10, Graphs, covers the Week 5 material in the same order).',
    area: 'math',
  },
};

export const week45CourseReferences = {
  [ids.graphs]: [rosen('10.1', 'Graphs and Graph Models'), rosen('10.2', 'Graph Terminology and Special Types of Graphs (degrees, handshaking)')],
  [ids.special]: [rosen('10.2', 'Graph Terminology and Special Types of Graphs (bipartite graphs and matchings)')],
  [ids.matrices]: [rosen('10.3', 'Representing Graphs and Graph Isomorphism')],
  [ids.paths]: [rosen('10.4', 'Connectivity')],
  [ids.euler]: [rosen('10.5', 'Euler and Hamilton Paths')],
  [ids.shortest]: [rosen('10.6', 'Shortest-Path Problems')],
  [ids.colouring]: [rosen('10.7', 'Planar Graphs'), rosen('10.8', 'Graph Coloring')],
};

export const week45Stories = {
  [ids.metric]: 'An algorithm produces better and better approximations, and you want to say it "converges". Close in what sense? For vectors, functions or even words you need some notion of distance, and only three rules really matter: never negative, symmetric, and no shortcut beats the direct route. Then a worse problem appears: the approximations can get ever closer to each other while the thing they approach is missing from your space, as decimal approximations of sqrt(2) are among fractions. Spaces with no such holes are called complete.',
  [ids.cosine]: 'You want a computer to know that "puppy" is like "dog". Count, over a large text, how often each word appears near informative context words, and every word becomes a vector. But "dog" is common and "puppy" rare, so their count vectors differ hugely in size even though they are used alike. Measuring the gap between the vectors would call puppy closer to any rare word. Comparing only their directions, the angle between them, fixes this.',
  [ids.graphs]: 'In 1736 the people of Königsberg asked whether they could walk across each of their seven bridges exactly once. Drawing the town in detail did not help; what mattered was only which land masses each bridge joined. Replace each land mass by a dot and each bridge by a line, and the question becomes one about dots and lines. The same abstraction fits friendships, web links, flights and molecules: whenever only the connections matter, you have a graph.',
  [ids.shortest]: 'Your phone must find the quickest route across a city with thousands of junctions. Listing every route is impossible: there are far too many. But the quickest route to the destination passes through junctions whose quickest routes you could have found first. So grow outwards from the start, always finishing the closest unfinished junction next. If no road has negative length, a finished junction can never improve later. That is Dijkstra\'s algorithm.',
  [ids.colouring]: 'A university must fit 300 final exams into as few days as possible, and no student may sit two exams at once. Draw each exam as a dot and join two dots when some student takes both. Now give each dot a day so that joined dots get different days. The question "how few days?" is the same question a mapmaker asks about colouring countries so that neighbours differ, and the answer for maps, at most four, took more than a century to prove.',
};

export const week45LearningObjectives = [
  { objective: 'Use metrics, convergence and completeness, and know which norms come from inner products.', concepts: ['metric-spaces', 'norms'], check: 'Why does the discrete metric come from no norm?' },
  { objective: 'Write the matrix of an inner product, relate it to the Cholesky factor, and use the Frobenius and function inner products.', concepts: ['inner-products', 'cholesky-decomposition'], check: 'How does A = LLᵀ turn <v, w> = vᵀAw into an ordinary dot product?' },
  { objective: 'Compute cosine similarity and explain how it compares words through co-occurrence vectors.', concepts: ['cosine-similarity'], check: 'Why does cosine similarity ignore how common a word is?' },
  { objective: 'Recognize direct sums and orthogonal complements, and use them to split vectors.', concepts: ['direct-sum', 'orthogonal-complement'], check: 'Why is the xy-plane plus the yz-plane not a direct sum?' },
  { objective: 'Find orthogonal projections, including onto affine subspaces, and least-squares solutions of inconsistent systems.', concepts: ['orthogonal-projections', 'gram-schmidt', 'least-squares-normal-equation'], check: 'Why is the projection the closest point of the subspace?' },
];

export const week45GraphObjectives = {
  area: 'Graph Theory (Mathematics for AI, Week 5)',
  items: [
    { objective: 'Model relationships as graphs, and use degrees and the handshaking theorem.', concepts: ['graphs-basics'], check: 'Why must the number of odd-degree vertices be even?' },
    { objective: 'Recognize complete, cycle, wheel and bipartite graphs, and decide when a complete matching exists.', concepts: ['special-graphs'], check: 'Which subset of jobs breaks Hall\'s condition when two jobs rely on one worker?' },
    { objective: 'Write adjacency and incidence matrices, and use invariants to compare graphs.', concepts: ['graph-matrices'], check: 'What do the row sums of an adjacency matrix tell you?' },
    { objective: 'Decide connectivity and count routes with powers of the adjacency matrix.', concepts: ['graph-connectivity-paths'], check: 'What does entry (i, j) of A³ count?' },
    { objective: 'Decide whether Euler circuits or paths exist and find them; explain why Hamilton circuits are hard.', concepts: ['euler-hamilton'], check: 'How do the odd-degree vertices decide between an Euler circuit and an Euler path?' },
    { objective: 'Find shortest paths with Dijkstra\'s algorithm.', concepts: ['shortest-paths'], check: 'Why does Dijkstra\'s algorithm need positive weights?' },
    { objective: 'Colour graphs with few colours and apply colouring to scheduling.', concepts: ['graph-coloring', 'special-graphs'], check: 'Why does any graph containing K_4 need at least 4 colours?' },
  ],
};

// ---------- Homework ----------
const num = (prompt, answer, hints, why, mistakes, tol = 1e-6) => ({ type: 'number', prompt, answer, hints, why, tol, ...(mistakes ? { mistakes } : {}) });
const vec = (prompt, answer, hints, why, mistakes, tol = 1e-6) => ({ type: 'vector', prompt, answer, hints, why, tol, ...(mistakes ? { mistakes } : {}) });
const choice = (prompt, answer, wrong, hints, why, mistakes) => ({ type: 'choice', prompt, answer, wrong, hints, why, ...(mistakes ? { mistakes } : {}) });
const step = (text) => ({ text });

export const week45Homework = {
  'math/graph-theory': {
    track: 'math',
    section: 'Graph theory',
    intro: 'Degrees and special graphs, adjacency matrices and counting routes, Euler and Hamilton routes, Dijkstra\'s algorithm, matchings and colouring.',
    problems: [
      {
        id: 'degrees',
        title: 'Degrees and edges',
        pages: ['graphs-basics', 'special-graphs'],
        statement: 'Use the handshaking theorem and the edge counts of special graphs.',
        parts: [
          num('A graph has degrees 3, 3, 2, 2, 2, 1, 1. How many edges does it have?', 7, ['Every edge adds 2 to the total of the degrees.', 'The degrees add up to 14; halve it.'], 'The degree sum is 14 = 2|E|, so |E| = 7.', [{ value: 14, message: 'That is the degree sum: each edge was counted once from each end.' }], 0),
          num('How many edges does K₈ have?', 28, ['Every pair of the 8 vertices is joined exactly once.', '8 × 7 / 2.'], 'C(8, 2) = 8 · 7 / 2 = 28.', [{ value: 56, message: 'That counts each edge twice, once from each end.' }], 0),
          choice('Can 9 people each shake hands with exactly 3 of the others?', 'No: the degrees would add up to 27, which is odd', ['Yes, arrange them in a ring', 'Yes, but only if one person shakes 4 hands', 'Only if the graph is bipartite'], ['What would the nine degrees add up to?'], 'A degree sum is always even (twice the edges), and 9 × 3 = 27 is odd.', [{ value: 'Yes, arrange them in a ring', message: 'In a ring everyone has degree 2, not 3.' }]),
          num('How many edges does the complete bipartite graph K₃,₄ have?', 12, ['Every vertex on one side is joined to every vertex on the other, and none within a side.', '3 × 4.'], 'Each of the 3 vertices meets each of the 4: 12 edges.', [{ value: 21, message: 'That is K₇. In K₃,₄ no edge joins two vertices on the same side.' }], 0),
        ],
        solution: [step('Degree sum 14 = 2|E|, so 7 edges.'), step('K₈: 8 · 7 / 2 = 28 edges.'), step('9 people of degree 3 would give the odd sum 27, which is impossible.'), step('K₃,₄: 3 · 4 = 12 edges.')],
        takeaway: 'Counting edge-ends from both sides (the handshaking theorem) settles many questions about networks without drawing them.',
      },
      {
        id: 'walks',
        title: 'Routes with powers of A',
        pages: ['graph-matrices', 'graph-connectivity-paths'],
        statement: 'A triangle 1–2–3 with an extra edge 3–4. Its adjacency matrix is A = [[0, 1, 1, 0], [1, 0, 1, 0], [1, 1, 0, 1], [0, 0, 1, 0]].',
        parts: [
          num('How many routes of length 2 go from vertex 1 to vertex 4, that is, (A²)₁₄?', 1, ['A route of length 2 goes 1 → k → 4 through a middle vertex k joined to both.', 'Only vertex 3 is joined to both 1 and 4.'], 'The only route is 1 → 3 → 4, so (A²)₁₄ = 1.', [{ value: 0, message: '1 and 4 are not neighbours, but a route of two edges can go through a middle vertex.' }], 0),
          num('What is (A²)₃₃?', 3, ['A route of length 2 from 3 back to 3 goes out along an edge and straight back.', 'Count the edges at vertex 3.'], 'Vertex 3 has degree 3, and (A²)₃₃ is its degree.', [{ value: 0, message: 'Routes may return to their start: 3 → 1 → 3 is one of them.' }], 0),
          num('What is (A³)₁₁, the number of routes of length 3 from vertex 1 back to itself?', 2, ['A closed route of length 3 in a simple graph is a triangle.', 'Vertex 1 lies on one triangle, which can be travelled in two directions.'], '1 → 2 → 3 → 1 and 1 → 3 → 2 → 1.', [{ value: 1, message: 'The triangle can be travelled in both directions; each counts.' }], 0),
          num('What is the trace of A²?', 8, ['The diagonal of A² holds the degrees.', 'Add the degrees 2, 2, 3, 1.'], 'trace(A²) = 2 + 2 + 3 + 1 = 8 = 2 × (number of edges).', [{ value: 4, message: 'That is the number of edges; the trace counts each edge twice.' }], 0),
        ],
        solution: [step('A² = [[2, 1, 1, 1], [1, 2, 1, 1], [1, 1, 3, 0], [1, 1, 0, 1]]: (A²)₁₄ = 1 and (A²)₃₃ = 3.'), step('A³ has (A³)₁₁ = 2, the triangle in both directions.'), step('trace(A²) = 8, twice the 4 edges.')],
        takeaway: 'Multiplying adjacency matrices extends routes one edge at a time, so matrix powers count routes and their diagonals detect triangles.',
      },
      {
        id: 'euler',
        title: 'Euler or Hamilton?',
        pages: ['euler-hamilton'],
        statement: 'A connected multigraph on P, Q, R, S, T has edges PQ, QR, RS, ST, TP and two parallel edges PR.',
        parts: [
          num('How many vertices have odd degree?', 0, ['Count the edge-ends at each vertex; the two PR edges both count.', 'P and R have degree 4, the others degree 2.'], 'Degrees: P 4, Q 2, R 4, S 2, T 2. None is odd.', [{ value: 2, message: 'Count both parallel edges PR at P and at R.' }], 0),
          choice('So the graph has ...', 'An Euler circuit', ['An Euler path but no Euler circuit', 'Neither an Euler path nor a circuit', 'An Euler circuit only if it also has a Hamilton circuit'], ['Connected, and every degree even.'], 'Connected with every degree even: an Euler circuit, for example P–Q–R–S–T–P–R–P.'),
          choice('Now add the edge QS. What changes?', 'An Euler path from Q to S, but no circuit', ['It still has an Euler circuit', 'An Euler path from P to R', 'Neither an Euler path nor a circuit'], ['Which degrees become odd?'], 'Q and S now have degree 3, the only odd ones, so the Euler path runs between them.', [{ value: 'It still has an Euler circuit', message: 'Adding QS raises the degrees of Q and S to 3, which is odd.' }]),
          num('A salesperson must visit 6 cities, each exactly once, and return home. How many different circuits are there in K₆?', 60, ['Fix the starting city, order the other 5, then halve, because each circuit can be travelled both ways.', '5! / 2.'], '5!/2 = 120/2 = 60.', [{ value: 120, message: 'Each circuit has been counted twice, once in each direction.' }, { value: 720, message: 'Fixing the starting city removes a factor of 6, and the direction another factor of 2.' }], 0),
        ],
        solution: [step('Degrees P 4, Q 2, R 4, S 2, T 2: all even, so there is an Euler circuit, for example P–Q–R–S–T–P–R–P.'), step('Adding QS makes Q and S odd: now an Euler path from Q to S, and no circuit.'), step('K₆ has (6 − 1)!/2 = 60 Hamilton circuits.')],
        takeaway: 'Euler questions are settled by counting odd degrees; Hamilton questions have no such shortcut and grow factorially.',
      },
      {
        id: 'dijkstra',
        title: 'Dijkstra by hand',
        pages: ['shortest-paths'],
        statement: 'Roads with travel times: s–a 7, s–b 3, a–b 2, a–t 4, b–c 7, c–t 2, b–t 9. Run Dijkstra\'s algorithm from s.',
        parts: [
          num('After settling s and then b, what is the label of a?', 5, ['Settling b lets every neighbour of b try the route through b.', 'Compare 7 (direct) with 3 + 2.'], 'L(a) = min(7, 3 + 2) = 5.', [{ value: 7, message: 'That is the direct road. After settling b, the route s–b–a is cheaper.' }], 0),
          num('What is the length of the shortest route from s to t?', 9, ['After a is settled at 5, compare its route to t with the route through b.', 'Through a: 5 + 4; through b: 3 + 9.'], 'L(t) = min(3 + 9, 5 + 4) = 9; the route through c would cost 3 + 7 + 2 = 12.', [{ value: 12, message: 'That route goes through b directly (or through c). Settle a first: s–b–a–t is shorter.' }, { value: 11, message: 'The road a–t takes 4, so s–a–t takes 7 + 4 = 11, but there is a shorter way to reach a.' }], 0),
          choice('In which order are the vertices settled?', 's, b, a, t, c', ['s, a, b, t, c', 's, b, c, a, t', 's, b, a, c, t'], ['Each time, settle the unsettled vertex with the smallest label.'], 'Labels when settled: s 0, b 3, a 5, t 9, c 10.', [{ value: 's, b, a, c, t', message: 'When a is settled, t gets 9 but c only 10, so t is settled first.' }]),
          choice('Which is the shortest route from s to t?', 's–b–a–t', ['s–a–t', 's–b–t', 's–b–c–t'], ['Trace back from t: which vertex gave t its final label?'], 't got its label 9 from a, and a got its label 5 from b.'),
        ],
        solution: [step('Settle s (0): a = 7, b = 3.'), step('Settle b (3): a = 5, c = 10, t = 12.'), step('Settle a (5): t = 9. Settle t (9), then c (10).'), step('The route is s–b–a–t, of length 3 + 2 + 4 = 9.')],
        takeaway: 'The road that looks most direct is often not the quickest; Dijkstra\'s labels keep track of the best route found so far.',
      },
      {
        id: 'colouring',
        title: 'Colouring and matching',
        pages: ['graph-coloring', 'special-graphs'],
        statement: 'Chromatic numbers of special graphs, a planarity test, and a matching question.',
        parts: [
          num('What is the chromatic number of C₇?', 3, ['Try to alternate two colours around an odd ring.', 'Two colours leave one clash; a third colour fixes it.'], 'Odd cycles need 3 colours.', [{ value: 2, message: 'Alternating two colours around 7 vertices leaves two neighbours with the same colour.' }], 0),
          num('What is the chromatic number of the wheel W₆ (a 6-cycle plus a hub)?', 3, ['The rim C₆ needs 2 colours; the hub touches every rim vertex.', 'The hub cannot reuse either rim colour.'], '2 colours for the even rim plus 1 for the hub.', [{ value: 4, message: 'That is for an odd rim. C₆ is even, so the rim needs only 2 colours.' }], 0),
          choice('Can K₅ be drawn in the plane without crossings?', 'No: it has 10 edges, but a planar graph on 5 vertices has at most 3 · 5 − 6 = 9', ['Yes: every graph with 5 vertices is planar', 'Yes, because its chromatic number is 5', 'No, because it is bipartite'], ['Use e ≤ 3v − 6 for connected planar graphs.'], 'K₅ has e = 10 > 9, so it is not planar.'),
          choice('Jobs X, Y, Z. X can be done by Pat or Quinn, Y only by Pat, Z only by Pat. Is there a complete matching from jobs to workers?', 'No: Y and Z together have only one qualified worker', ['Yes: X–Quinn, Y–Pat, Z–Pat', 'Yes, because there are two workers for three jobs', 'Only if X is dropped'], ['Check Hall\'s condition on each set of jobs.'], '{Y, Z} has neighbourhood {Pat}: 1 < 2.', [{ value: 'Yes: X–Quinn, Y–Pat, Z–Pat', message: 'A matching cannot give Pat two jobs.' }, { value: 'Only if X is dropped', message: 'Even without X, Y and Z both need Pat.' }]),
        ],
        solution: [step('χ(C₇) = 3: odd cycles cannot be 2-coloured.'), step('χ(W₆) = 3: two colours on the even rim, a third for the hub.'), step('K₅: 10 > 3 · 5 − 6 = 9 edges, so not planar.'), step('{Y, Z} has only Pat: Hall\'s condition fails.')],
        takeaway: 'Odd cycles and cliques force extra colours, edge counts can prove a graph is not planar, and Hall\'s condition finds the bottleneck in an assignment.',
      },
    ],
  },
};

export const week45AnalyticProblems = [
  {
    id: 'cosine',
    title: 'Cosine similarity',
    pages: ['cosine-similarity', 'inner-products'],
    statement: 'Word vectors x = [3, 4, 0], y = [4, 3, 0] and z = [0, 0, 5] (counts with three context words).',
    parts: [
      num('What is the cosine similarity of x and y?', 0.96, ['cos = (x · y)/(‖x‖ ‖y‖).', 'x · y = 12 + 12 = 24, and both lengths are 5.'], '24/25 = 0.96.', [{ value: 24, message: 'Divide the inner product by both lengths.' }]),
      num('What is the cosine similarity of x and 10y?', 0.96, ['Scaling y scales both the inner product and its length.', 'The factors of 10 cancel.'], 'Unchanged: cosine similarity only depends on directions.', [{ value: 9.6, message: 'The length of 10y is 50, not 5: divide by it.' }]),
      num('What is the cosine similarity of x and z?', 0, ['Compute x · z first.', 'x and z share no nonzero coordinate.'], 'x · z = 0, so the vectors are perpendicular: no shared context.', null, 0),
      num('Normalize x and y to length 1. How far apart are they?', Math.sqrt(0.08), ['For unit vectors, ‖x̂ − ŷ‖² = 2(1 − cos ω).', '2(1 − 0.96) = 0.08; take the square root.'], 'sqrt(0.08) ≈ 0.283: small, as the high cosine promised.', null, 1e-3),
    ],
    solution: [step('cos(x, y) = 24/25 = 0.96, and scaling y does not change it.'), step('x · z = 0, so cos(x, z) = 0.'), step('Unit vectors: distance sqrt(2(1 − 0.96)) = sqrt(0.08) ≈ 0.283.')],
    takeaway: 'Cosine similarity compares directions only, and after normalizing it ranks pairs exactly as Euclidean distance does.',
  },
  {
    id: 'metric-direct-sum',
    title: 'Metrics and direct sums',
    pages: ['metric-spaces', 'direct-sum'],
    statement: 'Distances that are not norms, and splitting vectors between two subspaces.',
    parts: [
      choice('Which of these is a metric on ℝ but comes from no norm?', 'd(x, y) = 0 if x = y and 1 otherwise', ['d(x, y) = |x − y|', 'd(x, y) = 2|x − y|', 'd(x, y) = (x − y)²'], ['Check the three metric rules first, then ask whether d(2x, 0) = 2 d(x, 0).'], 'The discrete metric satisfies the three rules but gives d(2x, 0) = 1 = d(x, 0) for x ≠ 0.', [{ value: 'd(x, y) = (x − y)²', message: 'That is not a metric at all: d(0, 2) = 4 is more than d(0, 1) + d(1, 2) = 2.' }, { value: 'd(x, y) = 2|x − y|', message: 'That comes from the norm 2|x|.' }]),
      vec('ℝ² = U ⊕ W with U = span{[1, 1]} and W = span{[1, −1]}. Split v = [7, 1] as u + w. Enter u.', [4, 4], ['Solve a[1, 1] + b[1, −1] = [7, 1].', 'Adding the two equations gives 2a = 8.'], 'a = 4 and b = 3, so u = [4, 4] and w = [3, −3].', [{ value: [3, -3], message: 'That is w; enter the piece along [1, 1].' }]),
      num('In ℝ³, what is the dimension of the intersection of the xy-plane and the yz-plane?', 1, ['Which vectors lie in both planes?', 'dim(U + W) = dim U + dim W − dim(U ∩ W), and U + W = ℝ³.'], 'They share the y-axis: 2 + 2 − 1 = 3.', [{ value: 0, message: 'Then the sum would be 4-dimensional. The y-axis lies in both planes.' }], 0),
      choice('Is ℝ³ the direct sum of the xy-plane and the z-axis?', 'Yes: they meet only in 0 and their dimensions add up to 3', ['No: they are not perpendicular', 'No: a plane and a line cannot form a direct sum', 'Only if we use the dot product'], ['Check U ∩ W and the dimensions.'], 'Intersection {0}, dimensions 2 + 1 = 3. (They happen to be perpendicular too, but that is not needed.)'),
    ],
    solution: [step('The discrete metric is a metric that no norm induces.'), step('[7, 1] = 4[1, 1] + 3[1, −1], so u = [4, 4].'), step('xy-plane ∩ yz-plane = y-axis, dimension 1.'), step('xy-plane ⊕ z-axis = ℝ³.')],
    takeaway: 'A direct sum needs only a trivial intersection and enough dimensions; perpendicularity is the special case behind orthogonal projection.',
  },
];

// ---------- Bonus examples ----------
const rosenSource = (label, title) => ({ book: 'rosen', label, title });
const mml = (label, title, page) => ({ book: 'mml', label, title, page });

export const week45BonusExamples = {
  'math/graph-theory': [
    {
      id: 'components-by-matrix', title: 'Finding components with (I + A)^(n − 1)', source: rosenSource('§10.4', 'Connectivity'), pages: ['graph-connectivity-paths', 'graph-matrices'],
      task: 'A graph on vertices 1 to 5 has edges 12, 23 and 45. Use the matrix (I + A)⁴ to decide whether it is connected and to find its components.',
      steps: ['I + A has a 1 on the diagonal and for each edge: rows [1, 1, 0, 0, 0], [1, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1].', 'Entry (i, j) of (I + A)⁴ is positive exactly when j can be reached from i in at most 4 steps; the I lets a route "wait" at a vertex.', '(I + A)⁴ has positive entries in the block for {1, 2, 3} and in the block for {4, 5}, and zeros between them.'],
      answer: 'Not connected: the components are {1, 2, 3} and {4, 5}, read off the zero pattern of (I + A)⁴.',
    },
    {
      id: 'postman', title: 'A postman who must repeat a street', source: rosenSource('§10.5', 'Euler and Hamilton Paths'), pages: ['euler-hamilton', 'shortest-paths'],
      task: 'Streets (with lengths): A–B 3, B–C 2, C–D 3, D–A 2, A–C 4. A postman starts and ends at A and walks every street at least once. What is the shortest total walk?',
      steps: ['Degrees: A 3, B 2, C 3, D 2. A and C are odd, so there is no Euler circuit: some street must be walked twice.', 'Repeat the cheapest route between the two odd vertices. A to C costs 4 directly, 3 + 2 = 5 via B, or 2 + 3 = 5 via D, so repeat A–C.', 'With A–C doubled every degree is even, so an Euler circuit exists: A–B–C–A–D–C–A, for example.', 'Total length: all streets 3 + 2 + 3 + 2 + 4 = 14, plus the repeated 4.'],
      answer: '18: walk every street once (14) and repeat the street A–C (4).',
    },
  ],
  'math/analytic-geometry-angles-and-projections': [
    {
      id: 'inner-product-cholesky', title: 'An inner product as a dot product in disguise', source: mml('§3.2.3', 'Symmetric, Positive Definite Matrices', 73), pages: ['inner-products', 'cholesky-decomposition'],
      task: 'Let <v, w> = 4v₁w₁ + 2v₁w₂ + 2v₂w₁ + 2v₂w₂. Write its matrix A, factor A = LLᵀ, and use L to find a basis that is orthonormal for this inner product.',
      steps: ['The matrix holds <eᵢ, eⱼ>: A = [[4, 2], [2, 2]]. It is symmetric with positive pivots 4 and 1, so it is positive definite.', 'Cholesky: L₁₁ = 2, L₂₁ = 2/2 = 1, L₂₂ = sqrt(2 − 1) = 1, so L = [[2, 0], [1, 1]].', '<v, w> = vᵀLLᵀw = (Lᵀv) · (Lᵀw): this inner product is the dot product after the change of coordinates Lᵀ.', 'The columns of (Lᵀ)⁻¹ = [[1/2, −1/2], [0, 1]] are u₁ = [1/2, 0] and u₂ = [−1/2, 1]. Check: <u₁, u₁> = 4/4 = 1, <u₂, u₂> = 1 − 2 + 2 = 1 and <u₁, u₂> = −1 + 1 = 0.'],
      answer: 'A = [[4, 2], [2, 2]] = LLᵀ with L = [[2, 0], [1, 1]]; u₁ = [1/2, 0] and u₂ = [−1/2, 1] are orthonormal for this inner product.',
    },
  ],
};

// ---------- Class activities reading guide ----------
export const week45ActivitiesGuide = {
  id: 'math-w4-w5-activities',
  kind: 'activities',
  track: 'math',
  course: '99.512 Mathematics for AI',
  title: 'Weeks 4 and 5 class activities',
  note: 'The in-class and take-home activities of Weeks 4 and 5, by topic only. The pages work the same methods on different examples, and the Analytic geometry and Graph theory homework sets have practice problems of each kind.',
  items: [
    { problems: 'W4 Class 1, Activity 1', topic: 'Showing that a pairing on R² is an inner product (bilinear, symmetric, positive definite) and writing its matrix', pages: ['inner-products', 'positive-definite'] },
    { problems: 'W4 Class 1, take-home', topic: 'Proving that the L1, L2 and max norms satisfy the norm axioms', pages: ['norms', 'metric-spaces'] },
    { problems: 'W4 Class 1, AI activity', topic: 'Co-occurrence vectors from an article and their cosine similarities, and choosing context words', pages: ['cosine-similarity'] },
    { problems: 'W4 Class 2, Activity 1', topic: 'Gram-Schmidt on three vectors in R³, then normalizing to an orthonormal basis', pages: ['gram-schmidt', 'orthogonal-projections'] },
    { problems: 'W4 Class 2, Activity 2', topic: 'The least-squares solution of an inconsistent 3 by 2 system through the normal equation', pages: ['least-squares-normal-equation', 'orthogonal-projections'] },
    { problems: 'W4 Class 2, Activity 3 and take-home', topic: 'Fitting polynomials of increasing degree to five points, and why degree 4 fits them exactly', pages: ['polynomial-regression', 'least-squares-normal-equation'] },
    { problems: 'W4 Class 2, challenging homework', topic: 'Eigenvalues of an idempotent (projection) matrix, and bases of a direct sum', pages: ['orthogonal-projections', 'eigenvalues-eigenvectors', 'direct-sum'] },
    { problems: 'W5 Class 1, Activities 1 and 2', topic: 'Degrees and neighbourhoods, and in- and out-degrees of a directed graph', pages: ['graphs-basics'] },
    { problems: 'W5 Class 1, Activities 3 and 4', topic: 'The number of edges of K_n, and deciding whether graphs are bipartite', pages: ['special-graphs'] },
    { problems: 'W5 Class 1, Activity 5', topic: 'Deciding whether every job can be assigned an employee (Hall\'s condition)', pages: ['special-graphs'] },
    { problems: 'W5 Class 2, Activities 1 and 2', topic: 'Strongly connected components, and using circuits of different lengths to test isomorphism', pages: ['graph-connectivity-paths', 'graph-matrices'] },
    { problems: 'W5 Class 2, Activity 3', topic: 'Deciding whether a graph has an Euler circuit or path, and constructing one', pages: ['euler-hamilton'] },
    { problems: 'W5 Class 2, Activity 4', topic: 'Shortest path lengths in a weighted graph with Dijkstra\'s algorithm', pages: ['shortest-paths'] },
  ],
};
