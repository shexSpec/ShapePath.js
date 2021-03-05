/** parser internals not needed after ShapePaths are parsed
 *
 */

import { FuncName, Iri } from './ShapePathAst'

export type rvalue = number | Iri
export interface comparison {
  op: FuncName;
  r: rvalue | null
}

