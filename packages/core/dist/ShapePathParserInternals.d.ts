/** parser internals not needed after ShapePaths are parsed
 *
 */
import { FuncName } from './ShapePathAst';
declare type Iri = string;
export declare type rvalue = number | Iri;
export interface comparison {
    op: FuncName;
    r: rvalue | null;
}
export {};
//# sourceMappingURL=ShapePathParserInternals.d.ts.map