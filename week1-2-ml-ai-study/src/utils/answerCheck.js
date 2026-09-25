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

// A number from what the student typed, or null. A trailing % means "divide by 100", except in parts
// whose answer is itself in percent (unit '%'), where "87%" and "87" both mean 87.
export function parseNumber(text, unit) {
  let source = normalize(text);
  const percent = source.endsWith('%');
  if (percent) source = source.slice(0, -1);
  if (!source) return null;
  const tokens = tokenize(source);
  if (!tokens || tokens.length === 0) return null;
  try {
    const value = parse(tokens);
    if (!Number.isFinite(value)) return null;
    const decimals = /^-?\d*\.?(\d*)$/.test(source.replace(/\s/g, '')) ? (source.split('.')[1] ?? '').length : null;
    return { value: percent && unit !== '%' ? value / 100 : value, decimals };
  } catch {
    return null;
  }
}

export function parseVector(text) {
  const inner = normalize(text).replace(/^[[(]/, '').replace(/[\])]$/, '');
  const pieces = inner.split(/[,;]/).map((piece) => piece.trim()).filter((piece) => piece !== '');
  if (pieces.length === 0) return null;
  const values = pieces.map((piece) => parseNumber(piece));
  return values.every(Boolean) ? values.map((item) => item.value) : null;
}

// Default: 0.5% of the answer, but never tighter than what rounding to 3 decimals needs.
function tolerance(part, value) {
  return part.tol !== undefined ? Math.max(part.tol, 1e-9) : Math.max(0.0006, 0.005 * Math.abs(value));
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

const keyOf = (values) => values.map((value) => Number(value.toPrecision(8))).join(',');

// Returns { valid, correct, message, key }: valid is false when the input could not be read (or was
// rounded too coarsely), and such inputs do not count as attempts. key identifies the answer, so a
// repeated answer can be recognized.
export function checkAnswer(part, input) {
  if (part.type === 'choice') {
    if (!input) return { valid: false, message: 'Choose one option.' };
    const mistake = part.mistakes?.find((item) => item.value === input);
    return { valid: true, correct: input === part.answer, message: input === part.answer ? undefined : mistake?.message, key: input };
  }
  if (part.type === 'vector') {
    const got = parseVector(input);
    if (!got) return { valid: false, message: 'Enter numbers separated by commas, for example 1, -2.5, 3/4.' };
    if (got.length !== part.answer.length) return { valid: false, message: `Enter exactly ${part.answer.length} numbers.` };
    const key = keyOf(part.unordered ? [...got].sort((x, y) => x - y) : got);
    if (vectorsMatch(part, got, part.answer)) return { valid: true, correct: true, key };
    const mistake = part.mistakes?.find((item) => vectorsMatch(part, got, item.value));
    return { valid: true, correct: false, message: mistake?.message, key };
  }
  const got = parseNumber(input, part.unit);
  if (!got) return { valid: false, message: 'Enter a number or a short expression, for example 0.25, 8/5 or sqrt(2).' };
  const key = keyOf([got.value]);
  if (closeTo(part, got.value, part.answer)) return { valid: true, correct: true, key };
  const mistake = part.mistakes?.find((item) => closeTo(part, got.value, item.value));
  if (mistake) return { valid: true, correct: false, message: mistake.message, key };
  // A plain decimal with fewer than 3 decimals that only misses by rounding: ask for more digits
  // instead of marking it wrong (it does not count as an attempt).
  if (got.decimals !== null && got.decimals >= 1 && got.decimals < 3 && Math.abs(got.value - Number(part.answer.toFixed(got.decimals))) < 1e-9) {
    return { valid: false, message: 'Close, but give more decimals (at least 3), or type the exact expression.' };
  }
  return { valid: true, correct: false, key };
}

// The typed form of an answer, used by the content check to confirm every answer passes its own checker.
export function answerAsInput(part) {
  if (part.type === 'choice') return part.answer;
  if (part.type === 'vector') return part.answer.join(', ');
  return String(part.answer);
}
