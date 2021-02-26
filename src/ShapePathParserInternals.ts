/** parser internals not needed after ShapePaths are parsed
 *
 */

import { FuncName } from './ShapePathAst'

export type rvalue = number | URL
export interface comparison {
  op: FuncName;
  r: rvalue | null
}

