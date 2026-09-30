// Social-impact capstone projects: one for the Math Track and one for the ML Track. They reach
// beyond the first weeks into later topics (PCA, SVD, kernels, fairness, monitoring). The starter
// programs run in the page with made-up data; their printed output below was produced by running
// them (numpy only). Data sources are named so students can find them; nothing is copied.

export const impactProjects = [
 {
  "id": "vulnerability-index",
  "track": "math",
  "title": "Where Should Support Go? A Neighbourhood Vulnerability Index",
  "tagline": "Turn public statistics into a fair, explainable map of where help is needed most, then decide where to put support centres.",
  "sdgs": [
   "SDG 3: Good health and well-being",
   "SDG 10: Reduced inequalities",
   "SDG 11: Sustainable cities and communities"
  ],
  "duration": "8 weeks, 4–6 hours a week, solo or pairs",
  "why": "Councils, charities and health services have limited staff and money. They must decide which neighbourhoods to reach first: for heat-wave checks on elderly residents, food support, or a new community clinic. Too often this is decided by who complains loudest. A transparent index built from public data makes the decision explainable, and shows which assumptions change the answer.",
  "whoBenefits": [
   "Residents in neighbourhoods that are easy to overlook",
   "Social-service and public-health planners who must justify priorities",
   "Volunteer groups deciding where to set up outreach"
  ],
  "question": "Which neighbourhoods are most vulnerable on several indicators at once, how confident can we be in that ranking, and where should k support centres go so that the most vulnerable residents travel least?",
  "data": [
   {
    "name": "Census indicators by area",
    "detail": "Share of residents aged 75+, living alone, on low income, renting, without a car; population. In Singapore, look for the Census of Population 2020 tables by planning area from the Department of Statistics (published on SingStat and data.gov.sg). Elsewhere, any national census by district works."
   },
   {
    "name": "Service locations",
    "detail": "Clinics, community centres and bus stops from OpenStreetMap or government open-data portals, to compute distance to the nearest service."
   },
   {
    "name": "Area centroids or boundaries",
    "detail": "Planning-area or district boundaries (GeoJSON) to place each area on a map."
   },
   {
    "name": "Published indices to compare against",
    "detail": "The US CDC/ATSDR Social Vulnerability Index (percentile ranks of census variables) and SoVI (Cutter, Boruff and Shirley, 2003, which uses PCA) show two established ways to build such an index."
   }
  ],
  "skills": [
   {
    "page": "norms",
    "use": "Distances from each area to the nearest service, and why the choice of distance matters."
   },
   {
    "page": "expectation-variance",
    "use": "Standardizing indicators so a percentage and a distance can be combined fairly."
   },
   {
    "page": "covariance-gaussian",
    "use": "The correlation matrix of the indicators: which ones move together."
   },
   {
    "page": "spectral-theorem",
    "use": "Why the correlation matrix has perpendicular eigenvectors and real, non-negative eigenvalues."
   },
   {
    "page": "pca",
    "use": "Finding the few directions that summarize the indicators, and how much variance each explains."
   },
   {
    "page": "svd",
    "use": "Computing PCA stably from the data matrix instead of the covariance."
   },
   {
    "page": "partial-derivatives-gradient",
    "use": "Deriving that each support centre must sit at the need-weighted mean of the areas it serves."
   },
   {
    "page": "bootstrap",
    "use": "Uncertainty in the ranking: resample areas or indicators and see how ranks move."
   }
  ],
  "milestones": [
   {
    "week": "1",
    "title": "Frame the problem with the people it affects",
    "tasks": [
     "Pick a city and one concrete decision (for example, where to run heat-wave checks).",
     "Talk to one person who does this work, or read a public planning report, and list what 'vulnerable' means to them.",
     "Choose 5–8 indicators and write down why each one matters and which direction is 'worse'."
    ],
    "deliverable": "A one-page problem statement with the indicator list and their justifications.",
    "pages": [
     "sets",
     "functions"
    ]
   },
   {
    "week": "2",
    "title": "Collect and clean the data",
    "tasks": [
     "Download the census tables and service locations; join them by area name or code.",
     "Handle missing values and tiny areas (very small populations give noisy percentages).",
     "Compute distance to the nearest clinic for each area."
    ],
    "deliverable": "A clean table: one row per area, one column per indicator, with a data dictionary.",
    "pages": [
     "norms",
     "missing-data-imputation"
    ]
   },
   {
    "week": "3",
    "title": "Explore and standardize",
    "tasks": [
     "Plot each indicator's distribution; decide whether any needs a log transform.",
     "Standardize every indicator (z-scores) and compute the correlation matrix.",
     "Note which indicators are almost duplicates."
    ],
    "deliverable": "A short exploratory report with a correlation heat map.",
    "pages": [
     "expectation-variance",
     "covariance-gaussian",
     "feature-engineering"
    ]
   },
   {
    "week": "4",
    "title": "Principal components",
    "tasks": [
     "Compute the eigenvalues and eigenvectors of the correlation matrix (and check against the SVD).",
     "Decide how many components to keep (for example, 75% of the variance) and name each one from its loadings.",
     "Notice that a component's sign is arbitrary and some mix directions."
    ],
    "deliverable": "A table of loadings with a plain-language name for each kept component.",
    "pages": [
     "eigenvalues-eigenvectors",
     "spectral-theorem",
     "pca",
     "svd"
    ]
   },
   {
    "week": "5",
    "title": "Build the index",
    "tasks": [
     "Weight each indicator by its squared loadings, weighted by variance explained (a standard composite-indicator method).",
     "Compare with equal weights and with the CDC-style percentile-rank method.",
     "Rank the areas and map the result."
    ],
    "deliverable": "The index, a ranked table, and a map with a clear legend.",
    "pages": [
     "dimensionality-reduction",
     "inner-products"
    ]
   },
   {
    "week": "6",
    "title": "Test how robust the ranking is",
    "tasks": [
     "Drop one indicator at a time and compute the rank correlation with the full index.",
     "Bootstrap the areas to put an uncertainty band on each area's rank.",
     "List areas whose rank depends strongly on one choice."
    ],
    "deliverable": "A robustness table and a list of 'uncertain' areas that need local knowledge.",
    "pages": [
     "bootstrap",
     "expectation-variance"
    ]
   },
   {
    "week": "7",
    "title": "Place the support centres",
    "tasks": [
     "Minimize need-weighted squared distance to the nearest centre (weighted k-means), with several random starts.",
     "Compare with centres placed ignoring need.",
     "Check the result against real constraints: sites must be reachable by public transport."
    ],
    "deliverable": "Recommended locations, with the average distance for the 10 most vulnerable areas under each plan.",
    "pages": [
     "partial-derivatives-gradient",
     "gradient-descent-method",
     "lagrange-multipliers"
    ]
   },
   {
    "week": "8",
    "title": "Communicate and hand over",
    "tasks": [
     "Write a two-page brief for a non-technical decision maker.",
     "Include what the index cannot see (for example, informal family support).",
     "Publish the code and data sources so others can reproduce and challenge it."
    ],
    "deliverable": "Brief, map, reproducible notebook, and a 5-minute presentation.",
    "pages": []
   }
  ],
  "deliverables": [
   "A reproducible notebook or script, with every data source cited",
   "A map of the index and of the recommended centres",
   "A robustness table showing which rankings are solid and which are fragile",
   "A two-page brief for decision makers, written in plain language"
  ],
  "evaluation": [
   {
    "criterion": "Mathematical correctness",
    "good": "Standardization, PCA and the centre update are derived and checked (eigenvectors against the SVD, centre formula from the gradient)."
   },
   {
    "criterion": "Robustness",
    "good": "Rank changes under dropped indicators and resampling are reported, not hidden."
   },
   {
    "criterion": "Transparency",
    "good": "Every weight can be explained in one sentence; a reader can recompute the index from the brief."
   },
   {
    "criterion": "Usefulness",
    "good": "The brief answers the decision it was built for, and a practitioner found it understandable."
   }
  ],
  "ethics": [
   {
    "risk": "Labelling a neighbourhood 'vulnerable' can stigmatize residents or lower property values.",
    "mitigation": "Present the index as 'where support should go first', share it with community groups before publishing, and avoid naming areas in headlines."
   },
   {
    "risk": "Census data are years old and averages hide pockets of need inside an area.",
    "mitigation": "State the data year, flag large mixed areas, and ask local workers to review the top and bottom of the list."
   },
   {
    "risk": "Indicators chosen by the analyst quietly encode values (what counts as vulnerable).",
    "mitigation": "Document each choice, test alternatives, and let stakeholders change the indicator set."
   }
  ],
  "stretch": [
   "Use a real road or bus network instead of straight-line distance (shortest paths on a graph).",
   "Rank critical bus stops or roads with PageRank on the transport network.",
   "Model how residents move between areas over a week with a Markov chain.",
   "Build a small interactive map so planners can change the weights themselves."
  ],
  "starterNote": "The starter program uses made-up data for 40 areas so you can run the whole pipeline before collecting real data. Replace the example block with your own table.",
  "code": "import numpy as np\n\n# ---- 1. Example data: 40 neighbourhoods, 6 indicators (made up for practice) ----\n# Two hidden drivers shape the indicators: an ageing population and low income.\nrng = np.random.default_rng(7)\nn = 40\nxy = rng.uniform(0, 10, (n, 2))                        # map position of each area (km)\nageing = rng.normal(0, 1, n) + 0.8 * (xy[:, 0] > 6)    # older areas cluster in the east\nincome = rng.normal(0, 1, n) + 0.8 * (xy[:, 1] < 4)    # lower-income areas cluster in the south\nnames = [\"% aged 75+\", \"% living alone\", \"% low income\", \"% renting\", \"% no car\", \"km to clinic\"]\nX = np.column_stack([\n    20 + 5 * ageing + rng.normal(0, 1.5, n),\n    15 + 4 * ageing + 1.5 * income + rng.normal(0, 1.5, n),\n    18 + 6 * income + rng.normal(0, 2, n),\n    30 + 8 * income + rng.normal(0, 3, n),\n    40 + 5 * income + 3 * ageing + rng.normal(0, 4, n),\n    2 + 0.6 * ageing + 0.4 * income + rng.normal(0, 0.4, n),\n])\n\n# ---- 2. Standardize: every indicator in the same units (standard deviations) ----\nZ = (X - X.mean(0)) / X.std(0)\n\n# ---- 3. PCA: eigenvectors of the covariance (here the correlation) matrix ----\nC = Z.T @ Z / n\nvals, vecs = np.linalg.eigh(C)\norder = np.argsort(vals)[::-1]\nvals, vecs = vals[order], vecs[:, order]\nexplained = vals / vals.sum()\nprint(\"variance explained by each component:\", np.round(explained, 3))\nk = int(np.searchsorted(np.cumsum(explained), 0.75) + 1)    # keep components up to 75% of the variance\nprint(f\"keeping {k} components ({np.cumsum(explained)[k-1]:.0%} of the variance)\")\nfor j in range(k):\n    v = vecs[:, j]\n    top = np.argsort(-np.abs(v))[:3]\n    print(f\"  component {j+1} loads on: \" + \", \".join(f\"{names[i]} ({v[i]:+.2f})\" for i in top))\n# A component's sign is arbitrary, and component 2 mixes directions (ageing up, income down), so\n# adding component scores could make poorer areas look LESS vulnerable. Instead, weight each\n# indicator by its squared loadings, weighted by the variance each kept component explains.\n\n# ---- 4. The index: a weighted sum of the standardized indicators ----\ndef pca_weights(Zs):\n    Cs = Zs.T @ Zs / len(Zs)\n    w, V = np.linalg.eigh(Cs); o = np.argsort(w)[::-1]; w, V = w[o], V[:, o]\n    e = w / w.sum(); kk = int(np.searchsorted(np.cumsum(e), 0.75) + 1)\n    weights = (V[:, :kk] ** 2) @ e[:kk]\n    return weights / weights.sum()\nweights = pca_weights(Z)\nprint(\"indicator weights:\", \", \".join(f\"{names[i]} {weights[i]:.2f}\" for i in range(len(names))))\nindex = Z @ weights\nrank = np.argsort(np.argsort(-index)) + 1                      # 1 = most vulnerable\nprint(\"five most vulnerable areas:\", [f\"area {i} (index {index[i]:+.2f})\" for i in np.argsort(-index)[:5]])\n\n# ---- 5. Robustness: drop one indicator at a time, does the ranking survive? ----\ndef spearman(a, b):\n    ra, rb = np.argsort(np.argsort(a)), np.argsort(np.argsort(b))\n    return np.corrcoef(ra, rb)[0, 1]\ndef build_index(Zs):\n    return Zs @ pca_weights(Zs)\nfor j in range(len(names)):\n    keep = [i for i in range(len(names)) if i != j]\n    print(f\"  without {names[j]:15s} rank correlation with the full index: {spearman(index, build_index(Z[:, keep])):.3f}\")\n\n# ---- 6. Where to put 3 support centres? Weighted k-means ----\n# Minimize the sum over areas of (need weight) x (squared distance to the nearest centre).\n# Setting the gradient to zero shows each centre must sit at the weighted mean of its areas.\nneed = index - index.min() + 0.1                               # positive weights\ndef weighted_kmeans(points, weights, k, iters=100, seed=0):\n    r = np.random.default_rng(seed)\n    centres = points[r.choice(len(points), k, replace=False)]\n    for _ in range(iters):\n        d = ((points[:, None, :] - centres[None]) ** 2).sum(-1)\n        label = d.argmin(1)\n        new = np.array([np.average(points[label == c], axis=0, weights=weights[label == c]) if np.any(label == c) else centres[c] for c in range(k)])\n        if np.allclose(new, centres): break\n        centres = new\n    return centres, label\ndef need_weighted_distance(centres):\n    d = np.sqrt(((xy[:, None, :] - centres[None]) ** 2).sum(-1)).min(1)\n    return (need * d).sum() / need.sum()\nbest_w = min((weighted_kmeans(xy, need, 3, seed=s) for s in range(10)), key=lambda cl: need_weighted_distance(cl[0]))\nbest_u = min((weighted_kmeans(xy, np.ones(n), 3, seed=s) for s in range(10)), key=lambda cl: need_weighted_distance(cl[0]))\nprint(\"need-weighted centres:\", np.round(best_w[0], 1).tolist())\nprint(\"plain centres:        \", np.round(best_u[0], 1).tolist())\nprint(f\"average distance to a centre, weighted by need: {need_weighted_distance(best_w[0]):.2f} km (need-weighted) vs {need_weighted_distance(best_u[0]):.2f} km (plain)\")\ntop10 = np.argsort(-index)[:10]\nfor label, cl in [(\"need-weighted\", best_w), (\"plain\", best_u)]:\n    d = np.sqrt(((xy[top10, None, :] - cl[0][None]) ** 2).sum(-1)).min(1)\n    print(f\"  10 most vulnerable areas, mean distance ({label}): {d.mean():.2f} km\")",
  "expected": "variance explained by each component: [0.604 0.294 0.044 0.033 0.014 0.01 ]\nkeeping 2 components (90% of the variance)\n  component 1 loads on: % no car (-0.47), km to clinic (-0.47), % living alone (-0.42)\n  component 2 loads on: % aged 75+ (-0.58), % low income (+0.50), % renting (+0.47)\nindicator weights: % aged 75+ 0.17, % living alone 0.17, % low income 0.18, % renting 0.17, % no car 0.15, km to clinic 0.16\nfive most vulnerable areas: ['area 39 (index +1.47)', 'area 16 (index +1.29)', 'area 0 (index +1.16)', 'area 27 (index +1.12)', 'area 10 (index +1.04)']\n  without % aged 75+      rank correlation with the full index: 0.978\n  without % living alone  rank correlation with the full index: 0.988\n  without % low income    rank correlation with the full index: 0.968\n  without % renting       rank correlation with the full index: 0.976\n  without % no car        rank correlation with the full index: 0.991\n  without km to clinic    rank correlation with the full index: 0.989\nneed-weighted centres: [[7.3, 2.7], [5.5, 8.3], [2.2, 2.6]]\nplain centres:         [[1.5, 4.8], [6.3, 7.8], [6.3, 2.0]]\naverage distance to a centre, weighted by need: 2.10 km (need-weighted) vs 2.15 km (plain)\n  10 most vulnerable areas, mean distance (need-weighted): 1.86 km\n  10 most vulnerable areas, mean distance (plain): 2.39 km"
 },
 {
  "id": "student-early-support",
  "track": "ml",
  "title": "Early Support for Students at Risk of Dropping Out",
  "tagline": "Predict, at the end of the first semester, which students may leave, so that advisers can reach out early, and check that the model is fair.",
  "sdgs": [
   "SDG 4: Quality education",
   "SDG 10: Reduced inequalities"
  ],
  "duration": "8–10 weeks, 5–6 hours a week, pairs or a team of three",
  "why": "Many students who drop out show early signs: failed units, unpaid fees, falling attendance. Advisers usually notice too late, and they cannot meet everyone. A model that ranks students by risk can help advisers spend their limited time where it matters, if it is accurate, fair across groups, and used to offer help rather than to punish.",
  "whoBenefits": [
   "Students who would otherwise slip through unnoticed",
   "Advisers and counsellors with limited time",
   "Colleges that want to improve completion rates fairly"
  ],
  "question": "Using only what is known at the end of semester 1, how well can we rank students by dropout risk, how many at-risk students can advisers reach with a fixed capacity, and does the model work equally well for different groups?",
  "data": [
   {
    "name": "UCI 'Predict Students' Dropout and Academic Success'",
    "detail": "A public dataset of about 4,400 students from a higher-education institution in Portugal (Realinho and colleagues, 2022), with enrolment details, demographics, fees, scholarships, and units passed and grades in the first two semesters. Labels: dropout, still enrolled, graduated. Available from the UCI Machine Learning Repository."
   },
   {
    "name": "Your own institution's data (only with approval)",
    "detail": "If you later work with real college data, you need ethics approval, a data-protection review (in Singapore, the PDPA) and agreement from the people responsible for student welfare."
   }
  ],
  "skills": [
   {
    "page": "ml-workflow",
    "use": "Framing the task: what is predicted, when, and for what action."
   },
   {
    "page": "feature-engineering",
    "use": "The point-in-time rule: only semester-1 information may be used."
   },
   {
    "page": "feature-scaling",
    "use": "Standardizing with training statistics only, to avoid leakage."
   },
   {
    "page": "missing-data-imputation",
    "use": "Checking for gaps and why they might be missing."
   },
   {
    "page": "logistic-regression",
    "use": "An interpretable risk model whose weights advisers can read."
   },
   {
    "page": "soft-margin-svm",
    "use": "A second model to compare, including an RBF kernel."
   },
   {
    "page": "cross-validation",
    "use": "Tuning the penalty and C without touching the test set."
   },
   {
    "page": "roc-auc",
    "use": "Ranking quality across all thresholds."
   },
   {
    "page": "classification-metrics",
    "use": "Precision and recall at the adviser capacity threshold."
   },
   {
    "page": "ml-in-production",
    "use": "Monitoring drift when a new cohort arrives, and when to retrain."
   }
  ],
  "milestones": [
   {
    "week": "1",
    "title": "Frame the decision, not just the prediction",
    "tasks": [
     "Write down the action the model supports (an adviser invites a student to talk) and what it must never be used for (sanctions, admission decisions).",
     "Decide the prediction time: end of semester 1.",
     "Interview or read about how advisers currently find struggling students."
    ],
    "deliverable": "A one-page problem statement with intended use, forbidden uses and success measures.",
    "pages": [
     "ml-landscape",
     "ml-workflow"
    ]
   },
   {
    "week": "2",
    "title": "Explore the data",
    "tasks": [
     "Load the UCI dataset; check class balance, missing values and data types.",
     "Turn the three labels into one question: dropout vs not.",
     "List every column and mark it 'known at end of semester 1' or 'later'."
    ],
    "deliverable": "A data audit table with the point-in-time mark for each column.",
    "pages": [
     "feature-representation",
     "missing-data-imputation"
    ]
   },
   {
    "week": "3",
    "title": "Baselines first",
    "tasks": [
     "Predict with the majority class and with a simple rule (for example, passed 2 units or fewer).",
     "Split once into training and test sets, stratified by the label, and lock the test set away."
    ],
    "deliverable": "Baseline precision, recall and ROC-AUC on a validation split.",
    "pages": [
     "train-validation-test",
     "classification-metrics"
    ]
   },
   {
    "week": "4",
    "title": "Features and leakage",
    "tasks": [
     "Encode categories (course, application mode) and standardize numbers with training statistics.",
     "Deliberately add a semester-2 column, see the score jump, and explain why that model would fail in practice."
    ],
    "deliverable": "A feature pipeline and a short note on the leakage experiment.",
    "pages": [
     "feature-engineering",
     "feature-scaling"
    ]
   },
   {
    "week": "5",
    "title": "Models",
    "tasks": [
     "Fit L2-regularized logistic regression; tune the penalty with 5-fold cross-validation.",
     "Fit a soft-margin SVM with linear and RBF kernels; tune C and the kernel width.",
     "Compare ROC-AUC on validation folds."
    ],
    "deliverable": "A model comparison table with the chosen model and why.",
    "pages": [
     "logistic-regression",
     "ridge-regularization",
     "soft-margin-svm",
     "valid-kernels",
     "cross-validation"
    ]
   },
   {
    "week": "6",
    "title": "Choose the operating point",
    "tasks": [
     "Ask how many students advisers can meet per term (say 20%).",
     "Flag that top share by predicted risk; report recall and precision at that capacity.",
     "Check calibration: do students given 30% risk drop out about 30% of the time?"
    ],
    "deliverable": "One page for advisers: 'if you meet these students, you reach X of those who would leave'.",
    "pages": [
     "roc-auc",
     "classification-metrics"
    ]
   },
   {
    "week": "7",
    "title": "Fairness audit",
    "tasks": [
     "Compare recall and false-alarm rates across groups (for example, international vs domestic, age bands, scholarship holders).",
     "Retrain without a sensitive feature and compare who is reached and who is missed.",
     "Discuss the trade-off with someone who works with students."
    ],
    "deliverable": "A fairness table and a written recommendation, including what the model cannot see.",
    "pages": [
     "bias-variance",
     "missing-data-imputation"
    ]
   },
   {
    "week": "8",
    "title": "Model card and monitoring plan",
    "tasks": [
     "Write a model card: data, intended use, performance by group, limitations.",
     "Plan monitoring: compare the next cohort's feature distributions with the training data; set a retraining trigger.",
     "Evaluate once on the locked test set and report it honestly."
    ],
    "deliverable": "Model card, monitoring plan, final test results, and a presentation.",
    "pages": [
     "ml-in-production"
    ]
   }
  ],
  "deliverables": [
   "A reproducible pipeline with a locked test set evaluated exactly once",
   "A model comparison and an adviser-capacity analysis",
   "A fairness audit with a written recommendation",
   "A model card and a monitoring plan",
   "A short presentation for advisers, not for data scientists"
  ],
  "evaluation": [
   {
    "criterion": "Honest evaluation",
    "good": "No leakage; the test set is used once; baselines are reported; uncertainty is shown."
   },
   {
    "criterion": "Fit for the decision",
    "good": "Results are expressed at the advisers' real capacity, not only as accuracy."
   },
   {
    "criterion": "Fairness",
    "good": "Group-level recall and false alarms are reported and the trade-offs are discussed openly."
   },
   {
    "criterion": "Responsible use",
    "good": "The model card states intended and forbidden uses, and a human decides every contact."
   }
  ],
  "ethics": [
   {
    "risk": "Flagging a student can become a self-fulfilling label if staff treat them differently.",
    "mitigation": "Use the flag only to offer support; never share scores with lecturers who grade the student; let students opt out."
   },
   {
    "risk": "Features such as nationality or age act as proxies for protected groups.",
    "mitigation": "Audit results by group, test the model without those features, and let people affected by the decision weigh the trade-off."
   },
   {
    "risk": "Student records are sensitive personal data.",
    "mitigation": "Use the public UCI data for the course project; any real deployment needs consent, data protection review and access controls."
   },
   {
    "risk": "The model learns last year's patterns and may not fit a new cohort.",
    "mitigation": "Monitor feature drift each term and re-check performance by group before each use."
   }
  ],
  "stretch": [
   "Predict all three outcomes (dropout, enrolled, graduated) with one-vs-rest models.",
   "Try gradient-boosted trees and compare accuracy and explainability.",
   "Explain individual predictions (which features raised this student's risk) and test whether advisers find the explanations useful.",
   "Simulate the effect of outreach: if support reduces risk by 20%, how many more students graduate?"
  ],
  "starterNote": "The starter program uses made-up data shaped like the UCI dataset, so you can run the whole pipeline first: point-in-time features, a leakage check, a baseline, a capacity threshold and a fairness audit. Then swap in the real dataset.",
  "code": "import numpy as np\n\n# ---- 1. Example data: 3000 first-year students (made up for practice) ----\n# Columns loosely follow the public UCI dataset \"Predict Students' Dropout and Academic Success\".\nrng = np.random.default_rng(3)\nn = 3000\nintl = (rng.random(n) < 0.15).astype(float)                    # international student\nage = np.clip(rng.normal(21, 4, n) + 3 * (rng.random(n) < 0.2), 17, 45)\nscholarship = (rng.random(n) < 0.25).astype(float)\nfees_ok = (rng.random(n) < 0.88 - 0.1 * intl).astype(float)    # tuition fees up to date\nunits1 = np.clip(np.round(rng.normal(4.2, 1.8, n) - 0.8 * (1 - fees_ok)), 0, 6)   # semester-1 units passed (of 6)\ngrade1 = np.where(units1 > 0, np.clip(rng.normal(11 + 0.7 * units1, 1.8), 0, 20), 0)\n# Dropout risk rises with fewer units passed, late fees and age. International students also face a\n# cause the data never records (for example visa or housing problems), so their risk is harder to see.\nhidden = rng.normal(0, 1, n) * (1 + 1.2 * intl)\nlatent = 2.6 - 0.8 * units1 + 0.1 * (age - 21) - 1.4 * fees_ok - 0.7 * scholarship + 0.4 * intl + 0.8 * (units1 == 0) + 1.3 * hidden\ndropout = (latent > 0).astype(float)\nunits2 = np.clip(units1 + rng.normal(0, 0.8, n) - 2.5 * dropout, 0, 6)  # semester 2: not known at prediction time!\nprint(f\"dropout rate {dropout.mean():.1%}; international {intl.mean():.0%}\")\n\n# ---- 2. Point-in-time rule: predict at the END OF SEMESTER 1 ----\nnames = [\"units passed sem 1\", \"grade sem 1\", \"fees up to date\", \"scholarship\", \"age\", \"international\"]\nX = np.column_stack([units1, grade1, fees_ok, scholarship, age, intl])\nX_leaky = np.column_stack([X, units2])        # includes semester 2, which is in the future\n\n# ---- 3. Split once (stratified), standardize with the training rows only ----\nidx = rng.permutation(n)\ntest = np.sort(np.r_[idx[dropout[idx] == 1][: int(0.25 * dropout.sum())], idx[dropout[idx] == 0][: int(0.25 * (n - dropout.sum()))]])\ntrain = np.setdiff1d(np.arange(n), test)\ndef fit_logistic(Xtr, ytr, lam=0.01, steps=3000, lr=0.5):\n    mu, sd = Xtr.mean(0), Xtr.std(0)\n    Z = np.c_[np.ones(len(Xtr)), (Xtr - mu) / sd]\n    w = np.zeros(Z.shape[1])\n    for _ in range(steps):\n        p = 1 / (1 + np.exp(-Z @ w))\n        g = Z.T @ (p - ytr) / len(ytr); g[1:] += lam * w[1:]\n        w -= lr * g\n    return lambda Xn: 1 / (1 + np.exp(-(np.c_[np.ones(len(Xn)), (Xn - mu) / sd] @ w))), w\ndef auc(score, y):\n    order = np.argsort(score); r = np.empty(len(score)); r[order] = np.arange(1, len(score) + 1)\n    pos = y == 1\n    return (r[pos].sum() - pos.sum() * (pos.sum() + 1) / 2) / (pos.sum() * (~pos).sum())\n\npredict, w = fit_logistic(X[train], dropout[train])\nrisk = predict(X[test]); y = dropout[test]\nprint(f\"test ROC-AUC {auc(risk, y):.3f}\")\nleaky_predict, _ = fit_logistic(X_leaky[train], dropout[train])\nprint(f\"with semester-2 data (leakage) {auc(leaky_predict(X_leaky[test]), y):.3f}  <- too good to be true\")\n\n# ---- 4. Baseline: a simple rule counsellors might already use ----\nrule = (units1[test] <= 2).astype(float)\nprint(f\"rule 'passed 2 units or fewer': flags {rule.mean():.0%}, recall {(rule[y == 1]).mean():.0%}, precision {y[rule == 1].mean():.0%}\")\n\n# ---- 5. Capacity: counsellors can meet 20% of students. Flag the top 20% by risk ----\ncut = np.quantile(risk, 0.80)\nflag = risk >= cut\nprint(f\"model top 20%: recall {flag[y == 1].mean():.0%}, precision {y[flag].mean():.0%}\")\n\n# ---- 6. Fairness check: does it work equally well for each group? ----\nfor name, g in [(\"domestic\", intl[test] == 0), (\"international\", intl[test] == 1)]:\n    rec = flag[g & (y == 1)].mean(); fpr = flag[g & (y == 0)].mean()\n    print(f\"  {name:13s}: n={g.sum():4d}, dropout {y[g].mean():.0%}, recall {rec:.0%}, false-alarm rate {fpr:.0%}\")\n\n# ---- 7. Reasons a counsellor can read: standardized weights ----\nfor name, coef in sorted(zip(names, w[1:]), key=lambda t: -abs(t[1])):\n    print(f\"  {name:20s} {coef:+.2f}  ({'raises' if coef > 0 else 'lowers'} risk)\")\n\n# ---- 8. What if the model may not use \"international\"? ----\nkeep = [i for i, name in enumerate(names) if name != \"international\"]\npredict2, _ = fit_logistic(X[train][:, keep], dropout[train])\nrisk2 = predict2(X[test][:, keep]); flag2 = risk2 >= np.quantile(risk2, 0.80)\nprint(f\"without the feature: ROC-AUC {auc(risk2, y):.3f}\")\nfor name, g in [(\"domestic\", intl[test] == 0), (\"international\", intl[test] == 1)]:\n    print(f\"  {name:13s}: recall {flag2[g & (y == 1)].mean():.0%}, false-alarm rate {flag2[g & (y == 0)].mean():.0%}\")\n# Try: which students does each version miss? Discuss with the people the model is meant to help.",
  "expected": "dropout rate 19.4%; international 17%\ntest ROC-AUC 0.876\nwith semester-2 data (leakage) 0.985  <- too good to be true\nrule 'passed 2 units or fewer': flags 19%, recall 53%, precision 55%\nmodel top 20%: recall 61%, precision 59%\n  domestic     : n= 633, dropout 18%, recall 61%, false-alarm rate 7%\n  international: n= 116, dropout 25%, recall 62%, false-alarm rate 29%\n  units passed sem 1   -1.30  (lowers risk)\n  fees up to date      -0.53  (lowers risk)\n  age                  +0.41  (raises risk)\n  international        +0.36  (raises risk)\n  scholarship          -0.33  (lowers risk)\n  grade sem 1          -0.21  (lowers risk)\nwithout the feature: ROC-AUC 0.869\n  domestic     : recall 67%, false-alarm rate 10%\n  international: recall 41%, false-alarm rate 11%"
 }
];
