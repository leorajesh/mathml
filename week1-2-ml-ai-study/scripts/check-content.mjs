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
import { courseBooks, courseReferences, caseStudies } from '../src/data/courseReferences.js';
import { mathLinks } from '../src/data/mathLinks.js';
import { intuitionDetails } from '../src/data/intuitionDetails.js';
import { codingGuides } from '../src/data/codingGuides.js';
import { projects } from '../src/data/projects.js';
import { sectionKey, trackOrder, tracks } from '../src/data/learningTracks.js';
import { homework } from '../src/data/homework.js';
import { courseHomework } from '../src/data/courseHomework.js';
import { answerAsInput, checkAnswer } from '../src/utils/answerCheck.js';
import { normalizeDefinitionSymbol } from '../src/utils/mathText.js';

const problems = [];
const graphSource = fs.readFileSync(new URL('../src/components/ConceptGraph.jsx', import.meta.url), 'utf8');
const graphTypes = new Set([...graphSource.matchAll(/case '(\w+)':/g)].map((match) => match[1]));
const figureSource = fs.readFileSync(new URL('../src/components/Figures.jsx', import.meta.url), 'utf8');
const drawnFigures = new Set([...figureSource.slice(figureSource.indexOf('const drawings')).matchAll(/'([\w-]+)':/g)].map((match) => match[1]));
// Pages the reference book does not cover; every other page must cite a section of it.
const notInBook = new Set(['sets', 'perceptron', 'perceptron-convergence', 'elastic-net', 'lu-decomposition', 'classification-metrics', 'roc-auc', 'ml-in-production', 'bootstrap']);

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
// Course-book references and case studies point at real pages and books, and every ML page cites a course book
// (momentum and subgradients are covered by the MML book instead).
const mlPages = new Set(trackOrder('ml'));
const mathPages = new Set(trackOrder('math'));
for (const [key, items] of Object.entries(courseReferences)) {
  if (!conceptMap[key]) problems.push(`course reference for unknown concept "${key}"`);
  for (const item of items) {
    if (!courseBooks[item.book]) problems.push(`${key}: unknown course book "${item.book}"`);
    if (!item.title || (item.page !== undefined && !(item.page >= 1 && item.page <= 740))) problems.push(`${key}: malformed course reference ${JSON.stringify(item)}`);
  }
}
for (const id of mlPages) if (!courseReferences[id] && !['momentum', 'subgradients'].includes(id)) problems.push(`${id}: ML page without a course-book reference`);
for (const key of Object.keys(caseStudies)) if (!conceptMap[key]) problems.push(`case study for unknown concept "${key}"`);
// The math-behind links go from an ML Track page to Math Track pages.
for (const [key, links] of Object.entries(mathLinks)) {
  if (!mlPages.has(key)) problems.push(`math link from "${key}", which is not an ML Track page`);
  for (const link of links) {
    if (!mathPages.has(link.id)) problems.push(`${key}: math link to "${link.id}", which is not a Math Track page`);
    if (!link.why || link.why.includes('\\')) problems.push(`${key}: math link to "${link.id}" needs a plain-text reason`);
  }
}
// Every page's intuition: a short hook plus 2-5 labelled key ideas, so the section stays scannable.
const words = (text) => text.trim().split(/\s+/).length;
for (const { id } of concepts) {
  const details = intuitionDetails[id];
  if (!details) { problems.push(`${id}: page without key ideas in intuitionDetails.js`); continue; }
  if (words(conceptMap[id].intuition) > 55) problems.push(`${id}: intuition hook has ${words(conceptMap[id].intuition)} words (max 55)`);
  if (details.keyIdeas.length < 2 || details.keyIdeas.length > 5) problems.push(`${id}: needs 2 to 5 key ideas`);
  for (const item of details.keyIdeas) if (!item.label || words(item.text) > 40) problems.push(`${id}: key idea "${item.label}" needs a label and at most 40 words`);
  for (const note of details.courseNotes ?? []) if (words(note) > 50) problems.push(`${id}: course note over 50 words`);
}
for (const id of Object.keys(intuitionDetails)) if (!conceptMap[id]) problems.push(`intuition details for unknown page "${id}"`);
// "From formula to code" guides: known pages, labelled steps of at most 70 words, code without tabs.
for (const [id, steps] of Object.entries(codingGuides)) {
  if (!conceptMap[id]) problems.push(`coding guide for unknown page "${id}"`);
  for (const item of steps) {
    if (!item.label || !item.text) problems.push(`${id}: coding-guide step needs a label and text`);
    else if (words(item.text) > 70) problems.push(`${id}: coding-guide step "${item.label}" is over 70 words`);
    if (item.code && item.code.includes('\t')) problems.push(`${id}: coding-guide code "${item.label}" uses tabs`);
  }
}
// End-to-end projects: a known anchor page, 3-6 stages linking known pages, code and expected output.
for (const [key, project] of Object.entries(projects)) {
  if (!conceptMap[project.anchor]) problems.push(`project "${key}": unknown anchor page "${project.anchor}"`);
  if (!project.code || !project.expected) problems.push(`project "${key}" needs code and expected output`);
  if (project.steps.length < 3 || project.steps.length > 6) problems.push(`project "${key}" needs 3 to 6 stages`);
  for (const item of project.steps) {
    if (words(item.text) > 45) problems.push(`project "${key}": stage "${item.label}" is over 45 words`);
    for (const id of item.pages) if (!conceptMap[id]) problems.push(`project "${key}": stage "${item.label}" links unknown page "${id}"`);
  }
}
for (const [id, figure] of Object.entries(figures)) {
  if (!drawnFigures.has(id)) problems.push(`figure "${id}" has no drawing in Figures.jsx`);
  if (!figure.title || !figure.caption || !figure.alt) problems.push(`figure "${id}" needs a title, caption, and alt text`);
}

// Homework: one set per track section; every part has a prompt, an answer that passes its own checker,
// mistakes that do not, and plain clues; every problem has pages, a solution and a takeaway.
const sectionKeys = new Set(Object.values(tracks).flatMap((track) => track.sections.map((section) => sectionKey(track.id, section))));
for (const key of sectionKeys) if (!homework[key]) problems.push(`no homework for track section "${key}"`);
for (const [key, set] of Object.entries(homework)) {
  if (!sectionKeys.has(key)) problems.push(`homework "${key}" is not a track section`);
  if (set.problems.length < 2) problems.push(`homework "${key}" needs at least 2 problems`);
  const ids = new Set();
  for (const problem of set.problems) {
    const where = `homework ${key} #${problem.id}`;
    if (ids.has(problem.id)) problems.push(`${where}: duplicate problem id`);
    ids.add(problem.id);
    if (!problem.title || !problem.statement || !problem.takeaway || !problem.solution?.length) problems.push(`${where}: needs a title, statement, solution and takeaway`);
    if (!problem.parts.length) problems.push(`${where}: no parts`);
    for (const id of problem.pages) if (!conceptMap[id]) problems.push(`${where}: unknown page "${id}"`);
    if (problem.tex) renders(problem.tex, where);
    for (const item of problem.solution) if (item.tex) renders(item.tex, `${where} solution`);
    problem.parts.forEach((part, index) => {
      const at = `${where} part ${index + 1}`;
      if (!part.prompt || !part.why || !Array.isArray(part.hints)) problems.push(`${at}: needs a prompt, an explanation and a clue list`);
      if (!checkAnswer(part, answerAsInput(part)).correct) problems.push(`${at}: the stored answer fails its own check`);
      for (const mistake of part.mistakes ?? []) {
        const typed = Array.isArray(mistake.value) ? mistake.value.join(', ') : String(mistake.value);
        const result = checkAnswer(part, typed);
        if (result.correct || result.message !== mistake.message) problems.push(`${at}: mistake ${typed} is accepted as correct or not recognized`);
      }
      // Clue ladder: numeric parts need an idea clue before the (locked) worked step; choice parts at least one clue.
      if (part.hints.length < (part.type === 'choice' ? 1 : 2)) problems.push(`${at}: needs ${part.type === 'choice' ? 'a clue' : 'at least two clues'}`);
      // Feedback and the unlocked clues must diagnose, not hand over the answer.
      if (part.type === 'number' && !(Number.isInteger(part.answer) && Math.abs(part.answer) <= 12)) {
        const shown = new Set([1, 2, 3, 4].map((digits) => part.answer.toFixed(digits).replace(/\.?0+$/, '')).filter((text) => text.replace(/[-.0]/g, '').length >= 2));
        const leaks = (text) => [...shown].some((number) => new RegExp(`(^|[^\\d.])${number.replace('.', '\\.').replace('-', '[-−]')}(?![\\d])`).test(text));
        for (const mistake of part.mistakes ?? []) if (leaks(mistake.message)) problems.push(`${at}: a mistake message gives away the answer ${part.answer}`);
        part.hints.slice(0, -1).forEach((hint, hintIndex) => { if (leaks(hint)) problems.push(`${at}: clue ${hintIndex + 1} gives away the answer ${part.answer}`); });
      }
      if (part.type === 'choice') {
        if (new Set([part.answer, ...part.wrong]).size !== part.wrong.length + 1) problems.push(`${at}: repeated options`);
        for (const mistake of part.mistakes ?? []) if (!part.wrong.includes(mistake.value)) problems.push(`${at}: feedback for an option that does not exist`);
      }
    });
  }
}

// Course homework guides link only to existing pages.
for (const guide of courseHomework) for (const item of guide.items) for (const id of item.pages) if (!conceptMap[id]) problems.push(`course homework guide ${guide.id} problem ${item.problems}: unknown page "${id}"`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Content OK: ${concepts.length} concepts, ${topics.length} topics, ${graphTypes.size} graph types, ${Object.keys(figures).length} figures, ${Object.values(quizzes).flat().length} quiz questions, ${Object.keys(mmlReferences).length} pages with MML book references, ${Object.keys(homework).length} homework sets with ${Object.values(homework).reduce((n, set) => n + set.problems.length, 0)} problems.`);
