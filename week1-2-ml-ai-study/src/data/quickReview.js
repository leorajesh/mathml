import { tracks } from './learningTracks.js';

// Quick review groups every page into subject -> category -> subcategory. Subcategories are the
// track sections (so the review follows the order pages are studied in); categories bundle related
// sections under one name that is easy to recall. scripts/check-content.mjs checks that every page
// appears exactly once.
export const reviewCategories = [
  { subject: 'Mathematics', title: 'Foundations', sections: ['math:Foundations'] },
  { subject: 'Mathematics', title: 'Linear Algebra', sections: ['math:Matrices and linear systems', 'math:Vector spaces', 'math:Linear transformations', 'math:Rank, determinants and inverses'] },
  { subject: 'Mathematics', title: 'Analytic Geometry', sections: ['math:Analytic geometry: angles and projections'] },
  { subject: 'Mathematics', title: 'Eigenvalues and Matrix Decompositions', sections: ['math:Eigenvalues and eigenvectors', 'math:Matrix decompositions', 'math:Dimensionality reduction'] },
  { subject: 'Mathematics', title: 'Calculus', sections: ['math:Vector calculus'] },
  { subject: 'Mathematics', title: 'Probability and Statistics', sections: ['math:Probability and statistics'] },
  { subject: 'Machine Learning', title: 'The Learning Problem', sections: ['ml:The learning problem'] },
  { subject: 'Machine Learning', title: 'Classification', sections: ['ml:Linear classification', 'ml:Logistic regression'] },
  { subject: 'Machine Learning', title: 'Losses and Optimization', sections: ['ml:Losses and convexity', 'ml:Optimization'] },
  { subject: 'Machine Learning', title: 'Regression and Generalization', sections: ['ml:Regression', 'ml:Generalization and regularization'] },
  { subject: 'Machine Learning', title: 'Support Vector Machines and Kernels', sections: ['ml:Support vector machines and kernels'] },
  { subject: 'Machine Learning', title: 'Data and Production', sections: ['ml:Feature engineering and missing data', 'ml:ML in production'] },
];

export const reviewSubjects = ['Mathematics', 'Machine Learning'];

function section(ref) {
  const [trackId, title] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':') + 1)];
  const found = tracks[trackId]?.sections.find((item) => item.title === title);
  return found ? { trackId, title, concepts: found.concepts } : null;
}

// [{ subject, title, id, subcategories: [{ title, trackId, concepts: [ids] }] }]
export const reviewTree = reviewCategories.map((category) => ({
  ...category,
  id: category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  subcategories: category.sections.map(section).filter(Boolean),
}));
