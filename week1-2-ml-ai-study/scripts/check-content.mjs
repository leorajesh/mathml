// Structural checks for the study content: links resolve, graph types exist, worked-example math
// lines up with its steps, every concept has starter code, topics are consistent, KaTeX renders,
// figures exist, and every page the reference book covers cites it.
import fs from 'node:fs';
import katex from 'katex';
import { codeExamples } from '../src/data/codeExamples.js';
import { conceptMap, concepts, entryFor, topics } from '../src/data/concepts.js';
import { workedExampleMath } from '../src/data/workedExampleMath.js';
import { quizzes } from '../src/data/quizzes.js';
import { figures } from '../src/data/figures.js';
import { mmlReferences } from '../src/data/mmlReferences.js';
import { normalizeDefinitionSymbol } from '../src/utils/mathText.js';

const problems = [];
const graphSource = fs.readFileSync(new URL('../src/components/ConceptGraph.jsx', import.meta.url), 'utf8');
const graphTypes = new Set([...graphSource.matchAll(/case '(\w+)':/g)].map((match) => match[1]));
const figureSource = fs.readFileSync(new URL('../src/components/Figures.jsx', import.meta.url), 'utf8');
const drawnFigures = new Set([...figureSource.slice(figureSource.indexOf('const drawings')).matchAll(/'([\w-]+)':/g)].map((match) => match[1]));
// Pages the reference book does not cover; every other page must cite a section of it.
const notInBook = new Set(['sets', 'perceptron', 'perceptron-convergence', 'elastic-net', 'lu-decomposition', 'classification-metrics']);

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
  if (concept.figure && !figures[concept.figure]) problems.push(`${where}: unknown figure "${concept.figure}"`);
  const references = mmlReferences[concept.id] ?? [];
  if (!references.length && !notInBook.has(concept.id)) problems.push(`${where}: no MML book reference`);
  if (references.length && notInBook.has(concept.id)) problems.push(`${where}: listed as not in the book but has a reference`);
  for (const item of references) {
    if (!/^\d+(\.\d+)*$/.test(item.section) || !item.title || !(item.page >= 1 && item.page <= 400)) problems.push(`${where}: malformed MML reference ${JSON.stringify(item)}`);
  }
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
for (const concept of concepts) {
  const questions = quizzes[concept.id] ?? [];
  if (questions.length < 3) problems.push(`${concept.id}: quiz needs at least 3 questions (has ${questions.length})`);
  questions.forEach((q, index) => {
    const where = `${concept.id} quiz question ${index + 1}`;
    if (!q.question || !q.answer || !q.why) problems.push(`${where}: missing question, answer, or explanation`);
    if (!Array.isArray(q.wrong) || q.wrong.length !== 3) problems.push(`${where}: needs exactly 3 wrong options`);
    else if (new Set([q.answer, ...q.wrong]).size !== 4) problems.push(`${where}: options are not all different`);
  });
}
for (const key of Object.keys(quizzes)) if (!conceptMap[key]) problems.push(`quiz for unknown concept "${key}"`);
for (const key of Object.keys(codeExamples)) if (!conceptMap[key]) problems.push(`code for unknown concept "${key}"`);
for (const key of Object.keys(workedExampleMath)) if (!conceptMap[key]) problems.push(`worked math for unknown concept "${key}"`);
for (const key of Object.keys(mmlReferences)) if (!conceptMap[key]) problems.push(`MML reference for unknown concept "${key}"`);
for (const [id, figure] of Object.entries(figures)) {
  if (!drawnFigures.has(id)) problems.push(`figure "${id}" has no drawing in Figures.jsx`);
  if (!figure.title || !figure.caption || !figure.alt) problems.push(`figure "${id}" needs a title, caption, and alt text`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Content OK: ${concepts.length} concepts, ${topics.length} topics, ${graphTypes.size} graph types, ${Object.keys(figures).length} figures, ${Object.values(quizzes).flat().length} quiz questions, ${Object.keys(mmlReferences).length} pages with MML book references.`);
