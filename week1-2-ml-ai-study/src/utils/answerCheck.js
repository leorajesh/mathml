// Checking typed homework answers. Students may type a number, a fraction, or a short expression
// such as "sqrt(13/3)", "1 - 0.64", "2^10", "ln 3" or "4/(3*sqrt(5))"; vectors are numbers separated by
// commas. Parsing is a small recursive-descent evaluator (no eval), so any other input is rejected.

const FUNCTIONS = { sqrt: Math.sqrt, ln: Math.log, log: Math.log, exp: Math.exp, abs: Math.abs, sin: Math.sin, cos: Math.cos };
const CONSTANTS = { pi: Math.PI, e: Math.E };

function normalize(text) {
  return String(text)
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/√/g, 'sqrt')
    .replace(/π/g, 'pi')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .trim()
    .toLowerCase();
}

function tokenize(text) {
  const tokens = [];
  const pattern = /\s*(?:(\d+\.?\d*(?:e[+-]?\d+)?|\.\d+(?:e[+-]?\d+)?)|([a-z]+)|(\*\*|[-+*/^()]))/y;
  let index = 0;
  while (index < text.length) {
    pattern.lastIndex = index;
    const match = pattern.exec(text);
    if (!match) {
      if (/\s/.test(text[index])) { index += 1; continue; }
      return null;
    }
    if (match[1] !== undefined) tokens.push({ type: 'num', value: Number(match[1]) });
    else if (match[2] !== undefined) tokens.push({ type: 'name', value: match[2] });
    else tokens.push({ type: 'op', value: match[3] === '**' ? '^' : match[3] });
    index = pattern.lastIndex;
  }
  return tokens;
}

// expression := term (('+' | '-') term)* ; term := unary (('*' | '/') unary | implicit unary)* ;
// unary := ('-' | '+') unary | power ; power := atom ('^' unary)? ; atom := number | constant | function atom | '(' expression ')'
function parse(tokens) {
  let position = 0;
  const peek = () => tokens[position];
  const take = () => tokens[position++];
  const isOp = (value) => peek()?.type === 'op' && peek().value === value;

  function expression() {
    let value = term();
    while (isOp('+') || isOp('-')) value = take().value === '+' ? value + term() : value - term();
    return value;
  }
  function term() {
    let value = unary();
    for (;;) {
      if (isOp('*')) { take(); value *= unary(); }
      else if (isOp('/')) { take(); value /= unary(); }
      else if (peek() && (peek().type !== 'op' || peek().value === '(')) value *= unary(); // "2pi", "3 sqrt(2)"
      else return value;
    }
  }
  function unary() {
    if (isOp('-')) { take(); return -unary(); }
    if (isOp('+')) { take(); return unary(); }
    return power();
  }
  function power() {
    const base = atom();
    if (isOp('^')) { take(); return base ** unary(); }
    return base;
  }
  function atom() {
    const token = take();
    if (!token) throw new Error('end');
    if (token.type === 'num') return token.value;
    if (token.type === 'name') {
      if (Object.hasOwn(CONSTANTS, token.value)) return CONSTANTS[token.value];
      if (Object.hasOwn(FUNCTIONS, token.value)) return FUNCTIONS[token.value](power());
      throw new Error('name');
    }
    if (token.value === '(') {
      const value = expression();
      if (!isOp(')')) throw new Error('paren');
      take();
      return value;
    }
    throw new Error('token');
  }

  const value = expression();
  if (position !== tokens.length) throw new Error('trailing');
  return value;
}

// A number from what the student typed, or null. A trailing % gives both readings (87% as 87 or 0.87).
export function parseNumber(text) {
  let source = normalize(text);
  const percent = source.endsWith('%');
  if (percent) source = source.slice(0, -1);
  if (!source) return null;
  const tokens = tokenize(source);
  if (!tokens || tokens.length === 0) return null;
  try {
    const value = parse(tokens);
    if (!Number.isFinite(value)) return null;
    return percent ? { value, alternatives: [value, value / 100] } : { value, alternatives: [value] };
  } catch {
    return null;
  }
}

export function parseVector(text) {
  const inner = normalize(text).replace(/^[[(]/, '').replace(/[\])]$/, '');
  const pieces = inner.split(/[,;]/).map((piece) => piece.trim()).filter((piece) => piece !== '');
  if (pieces.length === 0) return null;
  const values = pieces.map(parseNumber);
  return values.every(Boolean) ? values.map((item) => item.value) : null;
}

function tolerance(part, value) {
  return part.tol !== undefined ? Math.max(part.tol, 1e-9) : Math.max(0.005, 0.005 * Math.abs(value));
}

function closeTo(part, got, want) {
  return Math.abs(got - want) <= tolerance(part, want);
}

function vectorsMatch(part, got, want) {
  if (got.length !== want.length) return false;
  const a = part.unordered ? [...got].sort((x, y) => x - y) : got;
  const b = part.unordered ? [...want].sort((x, y) => x - y) : want;
  return a.every((value, index) => closeTo(part, value, b[index]));
}

// Returns { valid, correct, message }: valid is false when the input could not be read.
export function checkAnswer(part, input) {
  if (part.type === 'choice') {
    if (!input) return { valid: false, message: 'Choose one option.' };
    if (input === part.answer) return { valid: true, correct: true };
    const mistake = part.mistakes?.find((item) => item.value === input);
    return { valid: true, correct: false, message: mistake?.message };
  }
  if (part.type === 'vector') {
    const got = parseVector(input);
    if (!got) return { valid: false, message: 'Enter numbers separated by commas, for example 1, -2.5, 3/4.' };
    if (got.length !== part.answer.length) return { valid: false, message: `Enter exactly ${part.answer.length} numbers.` };
    if (vectorsMatch(part, got, part.answer)) return { valid: true, correct: true };
    const mistake = part.mistakes?.find((item) => vectorsMatch(part, got, item.value));
    return { valid: true, correct: false, message: mistake?.message };
  }
  const got = parseNumber(input);
  if (!got) return { valid: false, message: 'Enter a number or a short expression, for example 0.25, 8/5 or sqrt(2).' };
  if (got.alternatives.some((value) => closeTo(part, value, part.answer))) return { valid: true, correct: true };
  const mistake = part.mistakes?.find((item) => got.alternatives.some((value) => closeTo(part, value, item.value)));
  return { valid: true, correct: false, message: mistake?.message };
}

// The typed form of an answer, used by the content check to confirm every answer passes its own checker.
export function answerAsInput(part) {
  if (part.type === 'choice') return part.answer;
  if (part.type === 'vector') return part.answer.join(', ');
  return String(part.answer);
}
