/** ShapePath parser
 *
 */

%{
  /*
    ShEx parser in the Jison parser generator format.
  */

  const UNBOUNDED = -1;
%}

/* lexical grammar */
%lex

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
REGEXP                  '/' ([^\u002f\u005C\u000A\u000D] | '\\' [nrt\\|.?*+(){}$\u002D\u005B\u005D\u005E/] | {UCHAR})+ '/' [smix]*
IT_asdf                 [Aa][Ss][Dd][Ff]
IT_BASE                 [Bb][Aa][Ss][Ee]
COMMENT                 '#' [^\u000a\u000d]* | "/*" ([^*] | '*' ([^/] | '\\/'))* "*/"

%%

\s+|{COMMENT} /*skip*/
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
{REGEXP}                return 'REGEXP';
{IT_asdf}               return 'IT_asdf';
{IT_BASE}               return 'IT_BASE';
<<EOF>>                 return 'EOF';
[a-zA-Z0-9_-]+          return 'unexpected word "'+yytext+'"';
.                       return 'invalid character '+yytext;

/lex

/* operator associations and precedence */

// %left '+' '-'
// %left '*' '/'
// %left '^'
// %right '!'
// %right '%'
// %left UMINUS

%start shapePath

%% /* language grammar */

shapePath:
    IT_asdf intersectionStep _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star	
;

_O_QIT_intersection_E_S_QintersectionStep_E_C:
    "intersection" intersectionStep	
;

_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star:
    
  | _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star _O_QIT_intersection_E_S_QintersectionStep_E_C	
;

intersectionStep:
    unionStep _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star	
;

_O_QIT_union_E_S_QunionStep_E_C:
    "union" unionStep	
;

_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star:
    
  | _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star _O_QIT_union_E_S_QunionStep_E_C	
;

unionStep:
    startStep _QnextStep_E_Star	
;

_QnextStep_E_Star:
    
  | _QnextStep_E_Star nextStep	
;

startStep:
    _Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt step	
  | shortcut	
;

_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C:
    "/"
  | "//"	
;

_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt:
    
  | _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C	
;

nextStep:
    _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C step	
  | shortcut	
;

shortcut:
    _O_QGT_AT_E_Or_QGT_DOT_E_C iri	
;

_O_QGT_AT_E_Or_QGT_DOT_E_C:
    "@"	
  | "."	
;

step:
    _Qaxis_E_Opt selector _Qfilter_E_Star	
;

_Qaxis_E_Opt:
    
  | axis	
;

_Qfilter_E_Star:
    
  | _Qfilter_E_Star filter	
;

axis:
    "child::"	
  | "nested::"	
  | "self::"	
  | "parent::"	
  | "ancestor::"	
;

selector:
    "*"	
  | termType	
  | attribute	
;

filter:
    "[" _O_QshapePath_E_Or_QnumericExpr_E_C "]"	
;

_O_QshapePath_E_Or_QnumericExpr_E_C:
    shapePath	
  | numericExpr	
;

numericExpr:
    INTEGER	
;

termType:
    shapeExprType	
  | tripleExprType	
  | valueType	
  | "Schema"	
  | "SemAct"	
  | "Annotation"	
;

shapeExprType:
    "ShapeAnd"	
  | "ShapeOr"	
  | "ShapeNot"	
  | "NodeConstraint"	
  | "Shape"	
  | "ShapeExternal"	
;

tripleExprType:
    "EachOf"	
  | "OneOf"	
  | "TripleConstraint"	
;

valueType:
    "IriStem"	
  | "IriStemRange"	
  | "LiteralStem"	
  | "LiteralStemRange"	
  | "Language"	
  | "LanguageStem"	
  | "LanguageStemRange"	
  | "Wildcard"	
;

attribute:
    "type"	
  | "id"	
  | "semActs"	
  | "annotations"	
  | "predicate"	
  | schemaAttr	
  | shapeExprAttr	
  | tripleExprAttr	
  | valueSetValueAttr	
  | semActAttr	
  | annotationAttr	
;

schemaAttr:
    "@context"	
  | "startActs"	
  | "start"	
  | "imports"	
  | "shapes"	
;

shapeExprAttr:
    "shapeExprs"	
  | "shapeExpr"	
  | nodeConstraintAttr	
  | shapeAttr	
;

nodeConstraintAttr:
    "nodeKind"	
  | "datatype"	
  | xsFacetAttr	
  | "values"	
;

xsFacetAttr:
    stringFacetAttr	
  | numericFacetAttr	
;

stringFacetAttr:
    "length"	
  | "minlength"	
  | "maxlength"	
  | "pattern"	
  | "flags"	
;

numericFacetAttr:
    "mininclusive"	
  | "minexclusive"	
  | "maxinclusive"	
  | "maxexclusive"	
  | "totaldigits"	
  | "fractiondigits"	
;

valueSetValueAttr:
    "value"	
  | "language"	
  | "stem"	
  | "exclusions"	
  | "languageTag"	
;



shapeAttr:
    "closed"	
  | "extra"	
  | "expression"	
;

tripleExprAttr:
    "expressions"	
  | "min"	
  | "max"	
  | tripleConstraintAttr	
;

tripleConstraintAttr:
    "inverse"	
  | "valueExpr"	
;



semActAttr:
    "name"	
  | "code"	
;

annotationAttr:
    "object"	
;



iri:
    IRIREF	
  | prefixedName	
;

prefixedName:
    PNAME_LN	
  | PNAME_NS	
;
