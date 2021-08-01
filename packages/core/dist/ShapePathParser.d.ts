/**
 * Returns a Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */
import { ChildStep, AxisStep } from './ShapePathAst';
declare type Iri = string;
export declare function shapeLabelShortCut(label: Iri): ChildStep[];
export declare function predicateShortCut(label: Iri): (ChildStep | AxisStep)[];
import { JisonParser, JisonParserApi, StateType, SymbolsType, TerminalsType, ProductionsType } from '@ts-jison/parser';
import { JisonLexer, JisonLexerApi } from '@ts-jison/lexer';
export declare class ShapePathParser extends JisonParser implements JisonParserApi {
    Parser?: ShapePathParser;
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
export declare class ShapePathLexer extends JisonLexer implements JisonLexerApi {
    options: any;
    constructor(yy?: {});
    rules: RegExp[];
    conditions: any;
    performAction(yy: any, yy_: any, $avoiding_name_collisions: any, YY_START: any): any;
}
export {};
//# sourceMappingURL=ShapePathParser.d.ts.map