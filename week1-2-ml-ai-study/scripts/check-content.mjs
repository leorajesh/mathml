// Structural checks for the study content: links resolve, graph types exist, worked-example math
// lines up with its steps, every concept has starter code, topics are consistent, and KaTeX renders.
import fs from 'node:fs';
import katex from 'katex';
import { codeExamples } from '../src/data/codeExamples.js';
import { conceptMap, concepts, entryFor, topics } from '../src/data/concepts.js';
import { workedExampleMath } from '../src/data/workedExampleMath.js';
import { normalizeDefinitionSymbol } from '../src/utils/mathText.js';

const problems = [];
const graphSource = fs.readFileSync(new URL('../src/components/ConceptGraph.jsx', import.meta.url), 'utf8');
const graphTypes = new Set([...graphSource.matchAll(/case '(\w+)':/g)].map((match) => match[1]));

function renders(tex, where) {
  try {
    katex.renderToString(tex, { throwOnError: true });
  } catch (error) {
    problems.push(`${where}: KaTeX error ${error.message.split('\n')[0]}`);
  }
}

for (const concept of concepts) {
  const where = concept.id;
  for (const field of ['prerequisites', 'followOns']) {
    for (const id of concept[field]) if (!entryFor(id)) problems.push(`${where}: ${field} "${id}" does not exist`);
  }
  if (!graphTypes.has(concept.graph.type)) problems.push(`${where}: unknown graph type "${concept.graph.type}"`);
  if (!codeExamples[concept.id]) problems.push(`${where}: no Python starter code`);
  const math = workedExampleMath[concept.id] ?? [];
  if (math.length > concept.example.length) problems.push(`${where}: ${math.length} worked-example formulas for ${concept.example.length} steps`);
  math.forEach((tex, index) => tex && renders(tex, `${where} example step ${index + 1}`));
  for (const formula of concept.formulas) {
    renders(formula.tex, `${where} formula`);
    for (const definition of formula.definitions) {
      const separator = definition.indexOf(':');
      if (separator < 0) continue;
      renders(normalizeDefinitionSymbol(definition.slice(0, separator).trim()), `${where} symbol`);
      if (definition.slice(separator + 1).includes('\\')) problems.push(`${where}: LaTeX inside plain definition text "${definition.slice(0, 50)}"`);
    }
  }
}

const parentOf = new Map();
for (const topic of topics) {
  if (conceptMap[topic.id]) problems.push(`topic "${topic.id}" has the same id as a concept`);
  for (const child of topic.children) {
    if (!conceptMap[child]) problems.push(`topic "${topic.id}": child "${child}" is not a concept`);
    if (parentOf.has(child)) problems.push(`"${child}" is in two topics`);
    parentOf.set(child, topic.id);
  }
}
for (const key of Object.keys(codeExamples)) if (!conceptMap[key]) problems.push(`code for unknown concept "${key}"`);
for (const key of Object.keys(workedExampleMath)) if (!conceptMap[key]) problems.push(`worked math for unknown concept "${key}"`);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Content OK: ${concepts.length} concepts, ${topics.length} topics, ${graphTypes.size} graph types.`);
