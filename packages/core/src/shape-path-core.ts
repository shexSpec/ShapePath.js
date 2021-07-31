let to = (f: string) => '../' + f

if (typeof window === 'undefined') {
  to = (f: string) => require('path').join(__dirname, f)
}

import * as Ast from './ShapePathAst'
import * as Parser from './ShapePathParser'
const spgrep = to('spgrep.js')
const examples = to('../examples')
const scripts = {
  spgrep
}

export {
  Ast,
  Parser,
  scripts,
  examples
}
