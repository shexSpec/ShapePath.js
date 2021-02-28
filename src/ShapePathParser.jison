/** ShapePath parser
 *
 */

%{
import {Union, Intersection, Path, UnitStep, PathExprStep, Axis, t_Selector,
        Assertion, Filter, Function, FuncArg, FuncName,
        t_termType, t_shapeExprType, t_tripleExprType, t_valueType, t_attribute,
        t_schemaAttr, t_shapeExprAttr, t_nodeConstraintAttr, t_stringFacetAttr,
        t_numericFacetAttr, t_valueSetValueAttr, t_shapeAttr, t_tripleExprAttr,
        t_tripleConstraintAttr, t_semActAttr, t_annotationAttr
       } from './ShapePathAst'

import {comparison, rvalue} from './ShapePathParserInternals'

function makeFunction (assertionP: boolean, firstArg: FuncArg, comp: comparison = { op: FuncName.ebv, r: null }): Function {
  const { op, r } = comp
  const args = [firstArg]
  if (r) args.push(r)
  const ret = new Filter(op, args)
  return assertionP
    ? new Assertion(ret)
    : ret
}

function pnameToUrl (pname: string, yy: any): URL {
  const idx = pname.indexOf(':')
  const pre = pname.substr(0, idx)
  const lname = pname.substr(idx+1)
  if (!(pre in yy.prefixes))
    throw Error(`unknown prefix in ${pname}`)
  const ns = yy.prefixes[pre]
  return new URL(ns + lname, yy.base)
}

export function shapeLabelShortCut(label: URL) {
  return [
    new UnitStep(t_schemaAttr.shapes),
    new UnitStep(t_Selector.Any, undefined, [
      new Filter(FuncName.equal, [
        new Path([new UnitStep(t_attribute.id)]),
        label
      ]),
      new Assertion(
        new Filter(FuncName.equal, [
          new Filter(FuncName.count, []),
          1
        ])
      )
    ])
  ]
}


export function predicateShortCut(label: URL) {
  return [
    new UnitStep(t_shapeExprType.Shape, Axis.thisShapeExpr),
    new UnitStep(t_shapeAttr.expression),
    new UnitStep(
      t_tripleExprType.TripleConstraint,
      Axis.thisTripleExpr,
      [
        new Filter(FuncName.equal, [
          new Path([new UnitStep(t_attribute.predicate)]),
          label
        ])
      ]
    )
  ];
}

%}

/* lexical grammar */
%lex

COMMENT                 '#' [^\u000a\u000d]* | "<--" ([^-] | '-' [^-] | '--' [^>])* "-->"
IRIREF                  '<' ([^\u0000-\u0020<>\"{}|^`\\] | {UCHAR})* '>' /* #x00=NULL #01-#x1F=control codes #x20=space */
PNAME_NS                {PN_PREFIX}? ':'
PNAME_LN                {PNAME_NS} {PN_LOCAL}
PN_LOCAL_ESC            '\\' ('_' | '~' | '.' | '-' | '!' | '$' | '&' | "'" | '(' | ')' | '*' | '+' | ',' | ';' | '=' | '/' | '?' | '#' | '@' | '%')
PLX                     {PERCENT} | {PN_LOCAL_ESC}
PN_LOCAL                ({PN_CHARS_U} | ':' | [0-9] | {PLX}) ({PN_CHARS} | '.' | ':' | {PLX})*
LANK_NODE_LABEL        '_:' ({PN_CHARS_U} | [0-9]) (({PN_CHARS} | '.')* {PN_CHARS})?
INTEGER                 ([+-])?([0-9])+
STRING_LITERAL1         "'" ([^\u0027\u005c\u000a\u000d] | {ECHAR} | {UCHAR})* "'" /* #x27=' #x5C=\ #xA=new line #xD=carriage return */
STRING_LITERAL2         '"' ([^\u0022\u005c\u000a\u000d] | {ECHAR} | {UCHAR})* '"' /* #x22=" #x5C=\ #xA=new line #xD=carriage return */
UCHAR                   '\\u' {HEX} {HEX} {HEX} {HEX} | '\\U' {HEX} {HEX} {HEX} {HEX} {HEX} {HEX} {HEX} {HEX}
ECHAR                   "\\"[\"\'\\bfnrt]
PN_CHARS_BASE           [A-Z] | [a-z] | [\u00c0-\u00d6] | [\u00d8-\u00f6] | [\u00f8-\u02ff] | [\u0370-\u037d] | [\u037f-\u1fff] | [\u200c-\u200d] | [\u2070-\u218f] | [\u2c00-\u2fef] | [\u3001-\ud7ff] | [\uf900-\ufdcf] | [\ufdf0-\ufffd] | [\uD800-\uDB7F][\uDC00-\uDFFF] // UTF-16 surrogates for [\U00010000-\U000effff]
PN_CHARS_U              {PN_CHARS_BASE} | '_' | '_' /* !!! raise jison bug */
PN_CHARS                {PN_CHARS_U} | '-' | [0-9] | [\u00b7] | [\u0300-\u036f] | [\u203f-\u2040]
PN_PREFIX               {PN_CHARS_BASE} (({PN_CHARS} | '.')* {PN_CHARS})?
HEX                     [0-9] | [A-F] | [a-f]
PERCENT                 '%' {HEX} {HEX}
IT_UNION                [Uu][Nn][Ii][Oo][Nn]
IT_INTERSECTION         [Ii][Nn][Tt][Ee][Rr][Ss][Ee][Cc][Tt][Ii][Oo][Nn]
IT_ASSERT               [Aa][Ss][Ss][Ee][Rr][Tt]

%%

\s+|{COMMENT}           /*skip*/
{IT_UNION}              return 'IT_UNION';
{IT_INTERSECTION}       return 'IT_INTERSECTION';
{IT_ASSERT}             return 'IT_ASSERT';
"child::"               return 'IT_child';
"thisShapeExpr::"       return 'IT_thisShapeExpr';
"thisTripleExpr::"      return 'IT_thisTripleExpr';
"self::"                return 'IT_self';
"parent::"              return 'IT_parent';
"ancestor::"            return 'IT_ancestor';
"index"                 return 'IT_index';
"count"                 return 'IT_count';
"foo1"                  return 'IT_foo1';
"foo2"                  return 'IT_foo2';
"Schema"                return 'IT_Schema';
"SemAct"                return 'IT_SemAct';
"Annotation"            return 'IT_Annotation';
"ShapeAnd"              return 'IT_ShapeAnd';
"ShapeOr"               return 'IT_ShapeOr';
"ShapeNot"              return 'IT_ShapeNot';
"NodeConstraint"        return 'IT_NodeConstraint';
"Shape"                 return 'IT_Shape';
"ShapeExternal"         return 'IT_ShapeExternal';
"EachOf"                return 'IT_EachOf';
"OneOf"                 return 'IT_OneOf';
"TripleConstraint"      return 'IT_TripleConstraint';
"IriStem"               return 'IT_IriStem';
"IriStemRange"          return 'IT_IriStemRange';
"LiteralStem"           return 'IT_LiteralStem';
"LiteralStemRange"      return 'IT_LiteralStemRange';
"Language"              return 'IT_Language';
"LanguageStem"          return 'IT_LanguageStem';
"LanguageStemRange"     return 'IT_LanguageStemRange';
"Wildcard"              return 'IT_Wildcard';
"type"                  return 'IT_type';
"id"                    return 'IT_id';
"semActs"               return 'IT_semActs';
"annotations"           return 'IT_annotations';
"predicate"             return 'IT_predicate';
"@context"              return 'GT_atContext';
"startActs"             return 'IT_startActs';
"start"                 return 'IT_start';
"imports"               return 'IT_imports';
"shapes"                return 'IT_shapes';
"shapeExprs"            return 'IT_shapeExprs';
"shapeExpr"             return 'IT_shapeExpr';
"nodeKind"              return 'IT_nodeKind';
"datatype"              return 'IT_datatype';
"values"                return 'IT_values';
"length"                return 'IT_length';
"minlength"             return 'IT_minlength';
"maxlength"             return 'IT_maxlength';
"pattern"               return 'IT_pattern';
"flags"                 return 'IT_flags';
"mininclusive"          return 'IT_mininclusive';
"minexclusive"          return 'IT_minexclusive';
"maxinclusive"          return 'IT_maxinclusive';
"maxexclusive"          return 'IT_maxexclusive';
"totaldigits"           return 'IT_totaldigits';
"fractiondigits"        return 'IT_fractiondigits';
"value"                 return 'IT_value';
"language"              return 'IT_language';
"stem"                  return 'IT_stem';
"exclusions"            return 'IT_exclusions';
"languageTag"           return 'IT_languageTag';
"closed"                return 'IT_closed';
"extra"                 return 'IT_extra';
"expression"            return 'IT_expression';
"expressions"           return 'IT_expressions';
"min"                   return 'IT_min';
"max"                   return 'IT_max';
"inverse"               return 'IT_inverse';
"valueExpr"             return 'IT_valueExpr';
"name"                  return 'IT_name';
"code"                  return 'IT_code';
"object"                return 'IT_object';

{IRIREF}                return 'IRIREF';
{PNAME_LN}              return 'PNAME_LN';
{PNAME_NS}              return 'PNAME_NS';
// {BLANK_NODE_LABEL}      return 'BLANK_NODE_LABEL';
{INTEGER}               return 'INTEGER';
//{STRING_LITERAL1}       return 'STRING_LITERAL1';
//{STRING_LITERAL2}       return 'STRING_LITERAL2';
//{UCHAR}               return 'UCHAR';
//{ECHAR}               return 'ECHAR';
//{PN_CHARS_BASE}       return 'PN_CHARS_BASE';
//{PN_CHARS_U}          return 'PN_CHARS_U';
//{PN_CHARS}            return 'PN_CHARS';
//{PN_PREFIX}           return 'PN_PREFIX';
//{PN_LOCAL_ESC}        return 'PN_LOCAL_ESC';
//{PLX}                 return 'PLX';
//{PN_LOCAL}            return 'PN_LOCAL';
//{HEX}                 return 'HEX';
//{PERCENT}             return 'PERCENT';

"@"                     return 'GT_AT';
"."                     return 'GT_DOT';
"*"                     return 'GT_STAR';
"("                     return 'GT_LPAREN';
")"                     return 'GT_RPAREN';
"["                     return 'GT_LBRACKET';
"]"                     return 'GT_RBRACKET';
"//"                    return 'GT_DIVIDEDIVIDE';
"/"                     return 'GT_DIVIDE';
"="                     return 'GT_EQUAL';
"<"                     return 'GT_LT';
">"                     return 'GT_GT';

[a-zA-Z0-9_-]+          return 'unexpected word "'+yytext+'"';
.                       return 'invalid character '+yytext;
<<EOF>>                 return 'EOF';

/lex

/* operator associations and precedence */

// %left 'intersection'
// %left 'union'
// %right '!'
// %right '%'
// %left UMINUS

%start top

%% /* language grammar */

top: shapePath EOF { return $1; };

shapePath:
    unionStep _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star	-> $2.length ? new Union([$1].concat($2)) : $1
;

_O_QIT_union_E_S_QunionStep_E_C:
    IT_UNION unionStep	-> $2
;

_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star:
    	-> []
  | _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star _O_QIT_union_E_S_QunionStep_E_C	-> $1.concat([$2])
;

unionStep:
    intersectionStep _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star	-> $2.length ? new Intersection([$1].concat($2)) : $1
;

_O_QIT_intersection_E_S_QintersectionStep_E_C:
    IT_INTERSECTION intersectionStep	-> $2
;

_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star:
    	-> []
  | _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star _O_QIT_intersection_E_S_QintersectionStep_E_C	-> $1.concat([$2])
;

intersectionStep:
    startStep _QnextStep_E_Star	-> new Path($1.concat($2))
;

_QnextStep_E_Star:
    	-> []
  | _QnextStep_E_Star nextStep	-> $1.concat($2)
;

startStep:
    _Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt step	-> [$2]
  | shortcut	
;

_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C:
    GT_DIVIDE
  | GT_DIVIDEDIVIDE	
;

_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt:
    	-> null
  | _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C	
;

nextStep:
    _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C step	-> [$2]
  | shortcut	
;

shortcut:
    _O_QGT_AT_E_Or_QGT_DOT_E_C iri	-> $1 === '@' ? shapeLabelShortCut($2) : predicateShortCut($2)
;

_O_QGT_AT_E_Or_QGT_DOT_E_C:
    GT_AT	
  | GT_DOT	
;

step:
    _Qaxis_E_Opt selector _Qfilter_E_Star	-> new UnitStep($2, $1 ? $1 : undefined, $3.length > 0 ? $3 : undefined)
  | GT_LPAREN shapePath GT_RPAREN _Qfilter_E_Star	-> new PathExprStep($2, $4.length > 0 ? $4 : undefined)
;

_Qaxis_E_Opt:
    	-> null
  | axis	
;

_Qfilter_E_Star:
    	-> []
  | _Qfilter_E_Star filter	-> $1.concat([$2])
;

axis:
    IT_child	-> Axis.child
  | IT_thisShapeExpr	-> Axis.thisShapeExpr
  | IT_thisTripleExpr	-> Axis.thisTripleExpr
  | IT_self	-> Axis.self
  | IT_parent	-> Axis.parent
  | IT_ancestor	-> Axis.ancestor
;

selector:
    GT_STAR	-> t_Selector.Any
  | termType	
  | attribute	
;

filter:
    GT_LBRACKET filterExpr GT_RBRACKET	-> $2
;

filterExpr:
    _QIT_ASSERT_E_Opt shapePath _Qcomparison_E_Opt	-> makeFunction($1, $2, $3 ? $3 : undefined)
  | _QIT_ASSERT_E_Opt function _Qcomparison_E_Opt	-> makeFunction($1, $2, $3 ? $3 : undefined)
  | numericExpr	-> new Filter(FuncName.index, [$1])
;

_QIT_ASSERT_E_Opt:
    	-> false
  | IT_ASSERT	-> true
;

_Qcomparison_E_Opt:
    	-> null
  | comparison	
;

function:
    IT_index GT_LPAREN GT_RPAREN	-> new Filter(FuncName.index, [])
  | IT_count GT_LPAREN GT_RPAREN	-> new Filter(FuncName.count, [])
  | IT_foo1 GT_LPAREN iri GT_RPAREN	-> new Filter(FuncName.count, [])
  | IT_foo2 GT_LPAREN fooArg GT_RPAREN	-> new Filter(FuncName.count, [])
;

fooArg:
    INTEGER iri	-> [parseInt($1), $2]
  | INTEGER	-> [parseInt($1)]
  | iri	-> [$1]
;

comparison:
    comparitor rvalue	-> { op: $1, r: $2 }
;

comparitor:
    GT_EQUAL	-> FuncName.equal
  | GT_LT	-> FuncName.lessThan
  | GT_GT	-> FuncName.greaterThan
;

rvalue:
    INTEGER	-> parseInt($1)
  | iri	
;

numericExpr:
    INTEGER	-> parseInt($1)
;

termType:
    shapeExprType	
  | tripleExprType	
  | valueType	
  | IT_Schema	-> t_termType.Schema
  | IT_SemAct	-> t_termType.SemAct
  | IT_Annotation	-> t_termType.Annotation
;

shapeExprType:
    IT_ShapeAnd	-> t_shapeExprType.ShapeAnd
  | IT_ShapeOr	-> t_shapeExprType.ShapeOr
  | IT_ShapeNot	-> t_shapeExprType.ShapeNot
  | IT_NodeConstraint	-> t_shapeExprType.NodeConstraint
  | IT_Shape	-> t_shapeExprType.Shape
  | IT_ShapeExternal	-> t_shapeExprType.ShapeExternal
;

tripleExprType:
    IT_EachOf	-> t_tripleExprType.EachOf
  | IT_OneOf	-> t_tripleExprType.OneOf
  | IT_TripleConstraint	-> t_tripleExprType.TripleConstraint
;

valueType:
    IT_IriStem	-> t_valueType.IriStem
  | IT_IriStemRange	-> t_valueType.IriStemRange
  | IT_LiteralStem	-> t_valueType.LiteralStem
  | IT_LiteralStemRange	-> t_valueType.LiteralStemRange
  | IT_Language	-> t_valueType.Language
  | IT_LanguageStem	-> t_valueType.LanguageStem
  | IT_LanguageStemRange	-> t_valueType.LanguageStemRange
  | IT_Wildcard	-> t_valueType.Wildcard
;

attribute:
    IT_type	-> t_attribute.type
  | IT_id	-> t_attribute.id
  | IT_semActs	-> t_attribute.semActs
  | IT_annotations	-> t_attribute.annotations
  | IT_predicate	-> t_attribute.predicate
  | schemaAttr	
  | shapeExprAttr	
  | tripleExprAttr	
  | valueSetValueAttr	
  | semActAttr	
  | annotationAttr	
;

schemaAttr:
    GT_atContext	-> t_schemaAttr.atContext
  | IT_startActs	-> t_schemaAttr.startActs
  | IT_start	-> t_schemaAttr.start
  | IT_imports	-> t_schemaAttr.imports
  | IT_shapes	-> t_schemaAttr.shapes
;

shapeExprAttr:
    IT_shapeExprs	-> t_shapeExprAttr.shapeExprs
  | IT_shapeExpr	-> t_shapeExprAttr.shapeExpr
  | nodeConstraintAttr	
  | shapeAttr	
;

nodeConstraintAttr:
    IT_nodeKind	-> t_nodeConstraintAttr.nodeKind
  | IT_datatype	-> t_nodeConstraintAttr.datatype
  | xsFacetAttr	
  | IT_values	-> t_nodeConstraintAttr.values
;

xsFacetAttr:
    stringFacetAttr	
  | numericFacetAttr	
;

stringFacetAttr:
    IT_length	-> t_stringFacetAttr.length
  | IT_minlength	-> t_stringFacetAttr.minlength
  | IT_maxlength	-> t_stringFacetAttr.maxlength
  | IT_pattern	-> t_stringFacetAttr.pattern
  | IT_flags	-> t_stringFacetAttr.flags
;

numericFacetAttr:
    IT_mininclusive	-> t_numericFacetAttr.mininclusive
  | IT_minexclusive	-> t_numericFacetAttr.minexclusive
  | IT_maxinclusive	-> t_numericFacetAttr.maxinclusive
  | IT_maxexclusive	-> t_numericFacetAttr.maxexclusive
  | IT_totaldigits	-> t_numericFacetAttr.totaldigits
  | IT_fractiondigits	-> t_numericFacetAttr.fractiondigits
;

valueSetValueAttr:
    IT_value	-> t_valueSetValueAttr.value
  | IT_language	-> t_valueSetValueAttr.language
  | IT_stem	-> t_valueSetValueAttr.stem
  | IT_exclusions	-> t_valueSetValueAttr.exclusions
  | IT_languageTag	-> t_valueSetValueAttr.languageTag
;

shapeAttr:
    IT_closed	-> t_shapeAttr.closed
  | IT_extra	-> t_shapeAttr.extra
  | IT_expression	-> t_shapeAttr.expression
;

tripleExprAttr:
    IT_expressions	-> t_tripleExprAttr.expressions
  | IT_min	-> t_tripleExprAttr.min
  | IT_max	-> t_tripleExprAttr.max
  | tripleConstraintAttr	
;

tripleConstraintAttr:
    IT_inverse	-> t_tripleConstraintAttr.inverse
  | IT_valueExpr	-> t_tripleConstraintAttr.valueExpr
;

semActAttr:
    IT_name	-> t_semActAttr.name
  | IT_code	-> t_semActAttr.code
;

annotationAttr:
    IT_object	-> t_annotationAttr.object
;

iri:
    IRIREF	-> new URL($1.substr(1, $1.length - 2), yy.base)
  | prefixedName	
;

prefixedName:
    PNAME_LN	-> pnameToUrl($1, yy)
  | PNAME_NS	-> pnameToUrl($1, yy)
;
