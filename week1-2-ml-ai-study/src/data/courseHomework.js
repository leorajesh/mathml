// Reading guides for the course's own homework sheets: for each problem, the topic in our words and the
// pages that teach what it needs. No problem text or solutions are reproduced; the pages' worked
// examples use different numbers, so the homework is still the student's own work.

export const courseHomework = [
  {
    id: 'math-hw1',
    track: 'math',
    course: '99.512 Mathematics for AI',
    title: 'Homework 1',
    note: 'Checked by working the sheet by hand with only this site (no code): every problem can be solved from these pages. Read the worked examples; they use different numbers from the sheet.',
    items: [
      { problems: '1', topic: 'When a product of matrices is defined, its size, and computing products and transposes', pages: ['matrix-operations', 'matrix-multiplication-outer-product'] },
      { problems: '2', topic: 'Testing linear independence by Gaussian elimination', pages: ['linear-independence', 'gaussian-elimination'] },
      { problems: '3', topic: 'The standard basis of a space of matrices (E_ij) and stretching a matrix into a vector', pages: ['dimension', 'vector-spaces', 'basis-coordinates'] },
      { problems: '4', topic: 'Matrices of projections and reflections in R³', pages: ['transformation-matrix', 'orthogonal-projections'] },
      { problems: '5', topic: 'The matrix of differentiation between polynomial spaces, and basis order', pages: ['transformation-matrix', 'vector-spaces', 'derivatives'] },
      { problems: '6', topic: 'Inverting a matrix by Gauss-Jordan on [A | I]', pages: ['invertible-transformations', 'gaussian-elimination'] },
      { problems: '7', topic: 'Reading the matrix of a map off its formula; rank and nullity', pages: ['transformation-matrix', 'rank-nullity'] },
      { problems: '8', topic: 'Large determinants by row reduction to triangular form', pages: ['determinants-cofactor-row-ops', 'determinant-geometry'] },
      { problems: '9', topic: 'Change of basis between two non-standard bases, [I]_{BB~}', pages: ['change-of-basis', 'basis-coordinates'] },
      { problems: '10', topic: 'Checking that n vectors form a basis of Rⁿ; the change of basis to the standard basis, [I]_{SC}', pages: ['dimension', 'linear-independence', 'change-of-basis'] },
      { problems: '11', topic: 'Examples of linear (and affine, not linear) maps', pages: ['linear-transformations', 'affine-maps'] },
      { problems: '12', topic: 'Proofs from the vector space axioms', pages: ['vector-spaces'] },
      { problems: '13', topic: 'Proving that a set is a subspace', pages: ['subspaces', 'sets'] },
      { problems: '14', topic: 'tr(AB) = tr(BA) for rectangular A and B', pages: ['trace', 'matrix-multiplication-outer-product'] },
      { problems: '15', topic: 'Matrices of a map with respect to different bases, [T]_{CB}, and converting between them', pages: ['transformation-matrix', 'change-of-basis', 'composition-of-transformations'] },
    ],
  },
];
