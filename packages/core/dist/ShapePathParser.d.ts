/**
 * Returns a Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */
import { ChildStep, AxisStep } from './ShapePathAst';
declare type Iri = string;
export declare function shapeLabelShortCut(label: Iri): ChildStep[];
/**
 * `$<label>` -- the triple expression that ShExC declared with that label.
 *
 * ShExJ has no top-level list of triple expressions the way it has `shapes`,
 * and a label may sit on an EachOf, a OneOf or a TripleConstraint at any
 * depth, including inside a nested inline shape.  So this looks everywhere
 * and asserts that it found exactly one, which mirrors `@<label>`.  A label
 * that named both a shape and a triple expression would be ambiguous here,
 * and is already a structural error in ShEx.
 */
export declare function tripleExprLabelShortCut(label: Iri): AxisStep[];
export declare function predicateShortCut(label: Iri): (ChildStep | AxisStep)[];
import { JisonParser, JisonParserApi, StateType, SymbolsType, TerminalsType, ProductionsType } from '@ts-jison/parser';
export declare class ShapePathParser extends JisonParser implements JisonParserApi {
    $?: any;
    constructor(yy?: {}, lexer?: ShapePathLexer);
    symbols_: SymbolsType;
    terminals_: TerminalsType;
    productions_: ProductionsType;
    table: Array<StateType>;
    defaultActions: {
        [key: number]: any;
    };
    performAction(yytext: string, yyleng: number, yylineno: number, yy: any, yystate: number, $$: any, _$: any): any;
}
import { JisonLexer, JisonLexerApi } from '@ts-jison/lexer';
export declare class ShapePathLexer extends JisonLexer implements JisonLexerApi {
    options: any;
    constructor(yy?: {});
    rules: RegExp[];
    conditions: any;
    performAction(yy: any, yy_: any, $avoiding_name_collisions: any, YY_START: any): any;
}
export {};
//# sourceMappingURL=ShapePathParser.d.ts.map