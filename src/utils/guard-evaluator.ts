// Safe expression parser for guard conditions
// DOES NOT use eval() — only supports comparisons and boolean operators

type Value = number | boolean

interface Variables {
  [key: string]: Value
}

type Token =
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'identifier'; value: string }
  | { type: 'operator'; value: string }
  | { type: 'paren'; value: '(' | ')' }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < expr.length) {
    // Skip whitespace
    if (/\s/.test(expr[i])) { i++; continue }

    // Numbers
    if (/\d/.test(expr[i])) {
      let num = ''
      while (i < expr.length && /\d/.test(expr[i])) { num += expr[i]; i++ }
      tokens.push({ type: 'number', value: parseInt(num, 10) })
      continue
    }

    // Identifiers and boolean literals
    if (/[a-zA-Z_]/.test(expr[i])) {
      let id = ''
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) { id += expr[i]; i++ }
      if (id === 'true') tokens.push({ type: 'boolean', value: true })
      else if (id === 'false') tokens.push({ type: 'boolean', value: false })
      else tokens.push({ type: 'identifier', value: id })
      continue
    }

    // Multi-char operators
    if (i + 1 < expr.length) {
      const two = expr[i] + expr[i + 1]
      if (['>=', '<=', '==', '!=', '&&', '||'].includes(two)) {
        tokens.push({ type: 'operator', value: two })
        i += 2
        continue
      }
    }

    // Single-char operators
    if (['>', '<', '!'].includes(expr[i])) {
      tokens.push({ type: 'operator', value: expr[i] })
      i++
      continue
    }

    // Parentheses
    if (expr[i] === '(' || expr[i] === ')') {
      tokens.push({ type: 'paren', value: expr[i] as '(' | ')' })
      i++
      continue
    }

    // + and - for arithmetic in variable updates
    if (['+', '-', '*'].includes(expr[i])) {
      tokens.push({ type: 'operator', value: expr[i] })
      i++
      continue
    }

    throw new Error(`Unexpected character: ${expr[i]}`)
  }

  return tokens
}

// Recursive descent parser
class Parser {
  private tokens: Token[]
  private pos = 0
  private variables: Variables

  constructor(tokens: Token[], variables: Variables) {
    this.tokens = tokens
    this.variables = variables
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos]
  }

  private consume(): Token {
    return this.tokens[this.pos++]
  }

  // Grammar:
  // expr     = or_expr
  // or_expr  = and_expr ('||' and_expr)*
  // and_expr = cmp_expr ('&&' cmp_expr)*
  // cmp_expr = add_expr (('>' | '<' | '>=' | '<=' | '==' | '!=') add_expr)?
  // add_expr = primary (('+' | '-') primary)*
  // primary  = '!' primary | '(' expr ')' | number | boolean | identifier

  parse(): Value {
    const result = this.orExpr()
    if (this.pos < this.tokens.length) {
      throw new Error(`Unexpected token at position ${this.pos}`)
    }
    return result
  }

  private orExpr(): Value {
    let left = this.andExpr()
    while (this.peek()?.type === 'operator' && this.peek()?.value === '||') {
      this.consume()
      const right = this.andExpr()
      left = Boolean(left) || Boolean(right)
    }
    return left
  }

  private andExpr(): Value {
    let left = this.cmpExpr()
    while (this.peek()?.type === 'operator' && this.peek()?.value === '&&') {
      this.consume()
      const right = this.cmpExpr()
      left = Boolean(left) && Boolean(right)
    }
    return left
  }

  private cmpExpr(): Value {
    const left = this.addExpr()
    const op = this.peek()
    if (op?.type === 'operator' && ['>', '<', '>=', '<=', '==', '!='].includes(op.value)) {
      this.consume()
      const right = this.addExpr()
      switch (op.value) {
        case '>': return (left as number) > (right as number)
        case '<': return (left as number) < (right as number)
        case '>=': return (left as number) >= (right as number)
        case '<=': return (left as number) <= (right as number)
        case '==': return left === right
        case '!=': return left !== right
      }
    }
    return left
  }

  private addExpr(): Value {
    let left = this.primary()
    while (this.peek()?.type === 'operator' && ['+', '-', '*'].includes(this.peek()!.value as string)) {
      const op = this.consume()
      const right = this.primary()
      if (op.value === '+') left = (left as number) + (right as number)
      else if (op.value === '-') left = (left as number) - (right as number)
      else if (op.value === '*') left = (left as number) * (right as number)
    }
    return left
  }

  private primary(): Value {
    const token = this.peek()

    if (!token) throw new Error('Unexpected end of expression')

    // Negation
    if (token.type === 'operator' && token.value === '!') {
      this.consume()
      return !this.primary()
    }

    // Parentheses
    if (token.type === 'paren' && token.value === '(') {
      this.consume()
      const result = this.orExpr()
      const closeParen = this.consume()
      if (closeParen?.type !== 'paren' || closeParen.value !== ')') {
        throw new Error('Expected closing parenthesis')
      }
      return result
    }

    // Number
    if (token.type === 'number') {
      this.consume()
      return token.value
    }

    // Boolean
    if (token.type === 'boolean') {
      this.consume()
      return token.value
    }

    // Identifier (variable)
    if (token.type === 'identifier') {
      this.consume()
      if (!(token.value in this.variables)) {
        throw new Error(`Unknown variable: ${token.value}`)
      }
      return this.variables[token.value]
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`)
  }
}

export function evaluateGuard(expression: string, variables: Variables): boolean {
  try {
    const tokens = tokenize(expression)
    const parser = new Parser(tokens, variables)
    const result = parser.parse()
    return Boolean(result)
  } catch {
    console.error(`Failed to evaluate guard: ${expression}`)
    return false
  }
}

export function evaluateExpression(expression: string, variables: Variables): Value {
  try {
    const tokens = tokenize(expression)
    const parser = new Parser(tokens, variables)
    return parser.parse()
  } catch {
    console.error(`Failed to evaluate expression: ${expression}`)
    return 0
  }
}
