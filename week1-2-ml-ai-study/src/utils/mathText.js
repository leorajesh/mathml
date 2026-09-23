const exactSymbolMap = new Map([
  ['theta', '\\theta'],
  ['theta_0', '\\theta_0'],
  ['theta_1', '\\theta_1'],
  ['lambda', '\\lambda'],
  ['alpha', '\\alpha'],
  ['sigma', '\\sigma'],
  ['Lambda', '\\Lambda'],
  ['Sigma', '\\Sigma'],
  ['nabla R_n(theta)', '\\nabla R_n(\\theta)'],
  ['partial R_n', '\\partial R_n'],
  ['theta dot x', '\\theta \\cdot x'],
  ['theta dot x^(t)', '\\theta \\cdot x^{(t)}'],
  ['theta dot x + theta_0', '\\theta \\cdot x + \\theta_0'],
  ['y^(t)(theta dot x^(t))', 'y^{(t)}(\\theta \\cdot x^{(t)})'],
  ['E_test', 'E_{\\text{test}}'],
  ['E_train', 'E_{\\text{train}}'],
  ['L_0/1', 'L_{0/1}'],
  ['1{...}', '\\mathbb{1}\\{\\cdots\\}'],
  ['||theta||_2^2', '\\lVert\\theta\\rVert_2^2'],
  ['n lambda I', 'n\\lambda I'],
  ['dim(V)', '\\dim(V)'],
  ['rank(A)', '\\operatorname{rank}(A)'],
  ['nullity(A)', '\\operatorname{nullity}(A)'],
  ['det(A)', '\\det(A)'],
  ['max', '\\max'],
  ['log', '\\log'],
  ['gap', '\\text{gap}'],
  ['decision boundary', '\\text{decision boundary}'],
  ['large positive gap', '\\text{large positive gap}'],
  ['SVD', '\\text{SVD}'],
]);

export function normalizeDefinitionSymbol(symbol) {
  if (exactSymbolMap.has(symbol)) {
    return exactSymbolMap.get(symbol);
  }

  let normalized = symbol
    .replace(/\^\(([^)]+)\)/g, '^{$1}')
    .replace(/\btheta\b/g, '\\theta')
    .replace(/\blambda\b/g, '\\lambda')
    .replace(/\balpha\b/g, '\\alpha')
    .replace(/\bsigma\b/g, '\\sigma')
    .replace(/\bLambda\b/g, '\\Lambda')
    .replace(/\bSigma\b/g, '\\Sigma')
    .replace(/\bdot\b/g, '\\cdot')
    .replace(/\bnabla\b/g, '\\nabla')
    .replace(/\bpartial\b/g, '\\partial')
    .replace(/\brank\(/g, '\\operatorname{rank}(')
    .replace(/\bnullity\(/g, '\\operatorname{nullity}(')
    .replace(/\bdet\(/g, '\\det(')
    .replace(/\bdim\(/g, '\\dim(')
    .replace(/\bmax\b/g, '\\max')
    .replace(/\blog\b/g, '\\log');

  if (/^[A-Za-z][A-Za-z\s-]+$/.test(normalized) && normalized.includes(' ')) {
    normalized = `\\text{${normalized}}`;
  }

  return normalized;
}