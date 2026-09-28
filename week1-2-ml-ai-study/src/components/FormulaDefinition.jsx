import React from 'react';
import { InlineMath } from 'react-katex';
import { normalizeDefinitionSymbol } from '../utils/mathText.js';

// One line under a formula: "symbol: what it means", with the symbol typeset.
export function FormulaDefinition({ definition }) {
  const separatorIndex = definition.indexOf(':');
  if (separatorIndex === -1) return <li>{definition}</li>;
  const symbol = definition.slice(0, separatorIndex).trim();
  const explanation = definition.slice(separatorIndex + 1).trim();
  return (
    <li>
      <span className="definition-symbol"><InlineMath math={normalizeDefinitionSymbol(symbol)} /></span>
      <span className="definition-explanation">{explanation}</span>
    </li>
  );
}
