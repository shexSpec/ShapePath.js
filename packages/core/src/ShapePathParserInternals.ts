/** parser internals not needed after ShapePaths are parsed
 *
 */

import { FuncName } from './ShapePathAst'
type Iri = string // annotate IRIs

export type rvalue = number | Iri
export interface comparison {
  op: FuncName;
  r: rvalue | null
}

