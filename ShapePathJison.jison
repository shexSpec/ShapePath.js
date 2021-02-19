/** ShapePath parser
 *
 */

%{
  /*
    ShEx parser in the Jison parser generator format.
  */

  function shapeLabelShortCut (label) {
    return [
      {
        "t": "Step",
        "selector": "shapes"
      },
      {
        "t": "Step",
        "selector": "*",
        "filters": [
          {
            "t": "Filter",
            "l": {
              "t": "Path",
              "steps": [
                {
                  "t": "Step",
                  "selector": "id"
                }
              ]
            },
            "op": "=",
            "r": label
          },
          {
            "t": "Assertion",
            "l": {
              "t": "Path",
              "steps": [
                {
                  "t": "Step",
                  "selector": "length()"
                }
              ]
            },
            "op": "=",
            "r": "1"
          }
        ]
      }
    ];
  }

  function predicateShortCut (label) {
    return [
      {
        "t": "Step",
        "axis": "thisShapeExpr::",
        "selector": "Shape"
      },
      {
        "t": "Step",
        "selector": "expression"
      },
      {
        "t": "Step",
        "axis": "thisTripleExpr::",
        "selector": "TripleConstraint",
        "filters": [
          {
            "t": "Filter",
            "l": {
              "t": "Path",
              "steps": [
                {
                  "t": "Step",
                  "selector": "predicate"
                }
              ]
            },
            "op": "=",
            "r": label
          }
        ]
      }
    ];
  }
%}

/* lexical grammar */
%lex

COMMENT                 '#' [^\u000a\u000d]* | "<--" ([^-] | '-' [^-] | '--' [^>])* "-->"
IRIREF                  '<' ([^\u0000-\u0020<>\"{}|^`\\] | {UCHAR})* '>' /* #x00=NULL #01-#x1F=control codes #x20=space */
PNAME_NS                {PN_PREFIX}? ':'
PNAME_LN                {PNAME_NS} {PN_LOCAL}
BLANK_NODE_LABEL        '_:' ({PN_CHARS_U} | [0-9]) (({PN_CHARS} | '.')* {PN_CHARS})?
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
"index()"               return 'IT_index';
"length()"              return 'IT_length';
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
"@context"              return 'IT_@context';
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
{PNAME_NS}              return 'PNAME_NS';
{PNAME_LN}              return 'PNAME_LN';
{BLANK_NODE_LABEL}      return 'BLANK_NODE_LABEL';
{INTEGER}               return 'INTEGER';
{STRING_LITERAL1}       return 'STRING_LITERAL1';
{STRING_LITERAL2}       return 'STRING_LITERAL2';
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

"@"                     return 'IT_AT';
"."                     return 'IT_DOT';
"*"                     return 'IT_STAR';
"["                     return 'IT_LBRACKET';
"]"                     return 'IT_RBRACKET';
"//"                    return 'IT_DIVIDEDIVIDE';
"/"                     return 'IT_DIVIDE';
"="                     return 'IT_EQUAL';
"<"                     return 'IT_LT';
">"                     return 'IT_GT';

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

top: shapePath EOF { console.log(JSON.stringify($1, null, 2)); };

shapePath:
    unionStep _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star	-> $2.length ? {t: 'Union', exprs:[$1].concat($2) } : $1
;

_O_QIT_union_E_S_QunionStep_E_C:
    IT_UNION unionStep	-> $2
;

_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star:
    	-> []
  | _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star _O_QIT_union_E_S_QunionStep_E_C	-> $1.concat([$2])
;

unionStep:
    intersectionStep _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star	-> $2.length ? {t: 'Intersection', exprs:[$1].concat($2) } : $1
;

_O_QIT_intersection_E_S_QintersectionStep_E_C:
    IT_INTERSECTION intersectionStep	-> $2
;

_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star:
    	-> []
  | _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star _O_QIT_intersection_E_S_QintersectionStep_E_C	-> $1.concat([$2])
;

intersectionStep:
    startStep _QnextStep_E_Star	-> { t: "Path", steps: $1.concat($2) }
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
    IT_DIVIDE
  | IT_DIVIDEDIVIDE	
;

_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt:
    
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
    IT_AT	
  | IT_DOT	
;

step:
    _Qaxis_E_Opt selector _Qfilter_E_Star	-> { t: 'Step', axis: $1, selector: $2, filters: ($3.length > 0 ? $3 : undefined) }
;

_Qaxis_E_Opt:
    
  | axis	
;

_Qfilter_E_Star:
    	-> []
  | _Qfilter_E_Star filter	-> $1.concat([$2])
;

axis:
    IT_child	
  | IT_thisShapeExpr	
  | IT_thisTripleExpr	
  | IT_self	
  | IT_parent	
  | IT_ancestor	
;

selector:
    IT_STAR	
  | termType	
  | attribute	
;

filter:
    IT_LBRACKET filterExpr IT_RBRACKET	-> $2
;

filterExpr:
    _QIT_ASSERT_E_Opt shapePath _Qcomparison_E_Opt	-> Object.assign({t: ($1 ? 'Assertion' : 'Filter'), l: $2 }, $3)
  | _QIT_ASSERT_E_Opt function comparison	-> Object.assign({t: ($1 ? 'Assertion' : 'Filter'), l: $2 }, $3)
  | numericExpr	-> { index: $1 }
;

_QIT_ASSERT_E_Opt:
    	-> false
  | IT_ASSERT	-> true
;

_Qcomparison_E_Opt:
    	-> {}
  | comparison	
;

function:
    GT_index_LPAREN_RPAREN	
  | GT_length_LPAREN_RPAREN	
;

comparison:
    comparitor rvalue	-> { op: $1, r: $2 }
;

comparitor:
    IT_EQUAL	
  | IT_LT	
  | IT_GT	
;

rvalue:
    INTEGER	
  | iri	
;

numericExpr:
    INTEGER	
;

termType:
    shapeExprType	
  | tripleExprType	
  | valueType	
  | IT_Schema	
  | IT_SemAct	
  | IT_Annotation	
;

shapeExprType:
    IT_ShapeAnd	
  | IT_ShapeOr	
  | IT_ShapeNot	
  | IT_NodeConstraint	
  | IT_Shape	
  | IT_ShapeExternal	
;

tripleExprType:
    IT_EachOf	
  | IT_OneOf	
  | IT_TripleConstraint	
;

valueType:
    IT_IriStem	
  | IT_IriStemRange	
  | IT_LiteralStem	
  | IT_LiteralStemRange	
  | IT_Language	
  | IT_LanguageStem	
  | IT_LanguageStemRange	
  | IT_Wildcard	
;

attribute:
    IT_type	
  | IT_id	
  | IT_semActs	
  | IT_annotations	
  | IT_predicate	
  | schemaAttr	
  | shapeExprAttr	
  | tripleExprAttr	
  | valueSetValueAttr	
  | semActAttr	
  | annotationAttr	
;

schemaAttr:
    IT_@context	
  | IT_startActs	
  | IT_start	
  | IT_imports	
  | IT_shapes	
;

shapeExprAttr:
    IT_shapeExprs	
  | IT_shapeExpr	
  | nodeConstraintAttr	
  | shapeAttr	
;

nodeConstraintAttr:
    IT_nodeKind	
  | IT_datatype	
  | xsFacetAttr	
  | IT_values	
;

xsFacetAttr:
    stringFacetAttr	
  | numericFacetAttr	
;

stringFacetAttr:
    IT_length	
  | IT_minlength	
  | IT_maxlength	
  | IT_pattern	
  | IT_flags	
;

numericFacetAttr:
    IT_mininclusive	
  | IT_minexclusive	
  | IT_maxinclusive	
  | IT_maxexclusive	
  | IT_totaldigits	
  | IT_fractiondigits	
;

valueSetValueAttr:
    IT_value	
  | IT_language	
  | IT_stem	
  | IT_exclusions	
  | IT_languageTag	
;



shapeAttr:
    IT_closed	
  | IT_extra	
  | IT_expression	
;

tripleExprAttr:
    IT_expressions	
  | IT_min	
  | IT_max	
  | tripleConstraintAttr	
;

tripleConstraintAttr:
    IT_inverse	
  | IT_valueExpr	
;



semActAttr:
    IT_name	
  | IT_code	
;

annotationAttr:
    IT_object	
;



iri:
    IRIREF	
  | prefixedName	
;

prefixedName:
    PNAME_LN	
  | PNAME_NS	
;
