"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predicateShortCut = exports.shapeLabelShortCut = void 0;
const ShapePathParser_typedict_1 = require("./ShapePathParser.typedict");
const ShapePathAst_1 = require("./ShapePathAst");
function makeFunction(assertionP, firstArg, comp = { op: ShapePathAst_1.FuncName.ebv, r: null }) {
    const { op, r } = comp;
    const args = [firstArg];
    if (r)
        args.push(r);
    const ret = new ShapePathAst_1.Filter(op, args);
    return assertionP ? new ShapePathAst_1.Assertion(ret) : ret;
}
function filterTermType(type, filters) {
    if (type)
        filters.unshift(new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.equal, [
            new ShapePathAst_1.Path([new ShapePathAst_1.ChildStep(ShapePathAst_1.t_attribute.type)]),
            type,
        ]));
    return filters.length > 0 ? filters : undefined;
}
const newIri = (s) => s;
function pnameToUrl(pname, yy) {
    const idx = pname.indexOf(":");
    const pre = pname.substr(0, idx);
    const lname = pname.substr(idx + 1);
    if (!(pre in yy.prefixes))
        throw Error(`unknown prefix in ${pname}`);
    const ns = yy.prefixes[pre];
    return newIri(new URL(ns + lname, yy.base).href);
}
function shapeLabelShortCut(label) {
    return [
        new ShapePathAst_1.ChildStep(ShapePathAst_1.t_schemaAttr.shapes),
        new ShapePathAst_1.ChildStep(ShapePathAst_1.t_attribute.Any, [
            new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.equal, [
                new ShapePathAst_1.Path([new ShapePathAst_1.ChildStep(ShapePathAst_1.t_attribute.id)]),
                label,
            ]),
            new ShapePathAst_1.Assertion(new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.equal, [new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.count, []), 1])),
        ]),
    ];
}
exports.shapeLabelShortCut = shapeLabelShortCut;
function predicateShortCut(label) {
    return [
        new ShapePathAst_1.AxisStep(ShapePathAst_1.Axis.thisShapeExpr, filterTermType(ShapePathAst_1.t_shapeExprType.Shape, [])),
        new ShapePathAst_1.ChildStep(ShapePathAst_1.t_shapeAttr.expression),
        new ShapePathAst_1.AxisStep(ShapePathAst_1.Axis.thisTripleExpr, filterTermType(ShapePathAst_1.t_tripleExprType.TripleConstraint, [
            new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.equal, [
                new ShapePathAst_1.Path([new ShapePathAst_1.ChildStep(ShapePathAst_1.t_attribute.predicate)]),
                label,
            ]),
        ])),
    ];
}
exports.predicateShortCut = predicateShortCut;
const semanticActions = {
    "top -> shapePath EOF"($1) {
        let $$;
        return $1;
    },
    "shapePath -> sequenceStep _Q_O_QGT_COMMA_E_S_QsequenceStep_E_C_E_Star"($1, $2) {
        let $$;
        $$ = $2.length ? new ShapePathAst_1.Sequence([$1].concat($2)) : $1;
        return $$;
    },
    "_O_QGT_COMMA_E_S_QsequenceStep_E_C -> GT_COMMA sequenceStep"($2) {
        let $$;
        $$ = $2;
        return $$;
    },
    "_Q_O_QGT_COMMA_E_S_QsequenceStep_E_C_E_Star -> "() {
        let $$;
        $$ = [];
        return $$;
    },
    "_Q_O_QGT_COMMA_E_S_QsequenceStep_E_C_E_Star -> _Q_O_QGT_COMMA_E_S_QsequenceStep_E_C_E_Star _O_QGT_COMMA_E_S_QsequenceStep_E_C"($1, $2) {
        let $$;
        $$ = $1.concat([$2]);
        return $$;
    },
    "sequenceStep -> unionStep _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"($1, $2) {
        let $$;
        $$ = $2.length ? new ShapePathAst_1.Union([$1].concat($2)) : $1;
        return $$;
    },
    "_O_QIT_union_E_S_QunionStep_E_C -> IT_UNION unionStep"($2) {
        let $$;
        $$ = $2;
        return $$;
    },
    "_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star -> "() {
        let $$;
        $$ = [];
        return $$;
    },
    "_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star -> _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star _O_QIT_union_E_S_QunionStep_E_C"($1, $2) {
        let $$;
        $$ = $1.concat([$2]);
        return $$;
    },
    "unionStep -> intersectionStep _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"($1, $2) {
        let $$;
        $$ = $2.length ? new ShapePathAst_1.Intersection([$1].concat($2)) : $1;
        return $$;
    },
    "_O_QIT_intersection_E_S_QintersectionStep_E_C -> IT_INTERSECTION intersectionStep"($2) {
        let $$;
        $$ = $2;
        return $$;
    },
    "_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star -> "() {
        let $$;
        $$ = [];
        return $$;
    },
    "_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star -> _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star _O_QIT_intersection_E_S_QintersectionStep_E_C"($1, $2) {
        let $$;
        $$ = $1.concat([$2]);
        return $$;
    },
    "intersectionStep -> startStep _QnextStep_E_Star"($1, $2) {
        let $$;
        $$ = new ShapePathAst_1.Path($1.concat($2));
        return $$;
    },
    "_QnextStep_E_Star -> "() {
        let $$;
        $$ = [];
        return $$;
    },
    "_QnextStep_E_Star -> _QnextStep_E_Star nextStep"($1, $2) {
        let $$;
        $$ = $1.concat($2);
        return $$;
    },
    "startStep -> _Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt step"($2) {
        let $$;
        $$ = [$2];
        return $$;
    },
    "startStep -> shortcut"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C -> GT_DIVIDE"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C -> GT_DIVIDEDIVIDE"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt -> "() {
        let $$;
        $$ = null;
        return $$;
    },
    "_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt -> _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "nextStep -> _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C step"($2) {
        let $$;
        $$ = [$2];
        return $$;
    },
    "nextStep -> shortcut"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "shortcut -> _O_QGT_AT_E_Or_QGT_DOT_E_C iri"($1, $2) {
        let $$;
        $$ = $1 === "@" ? shapeLabelShortCut($2) : predicateShortCut($2);
        return $$;
    },
    "_O_QGT_AT_E_Or_QGT_DOT_E_C -> GT_AT"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "_O_QGT_AT_E_Or_QGT_DOT_E_C -> GT_DOT"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "step -> _QIT_child_E_Opt termType _Qfilter_E_Star"($2, $3) {
        let $$;
        $$ = new ShapePathAst_1.ChildStep(ShapePathAst_1.t_attribute.Any, filterTermType($2, $3));
        return $$;
    },
    "step -> _QIT_child_E_Opt attributeOrAny _QtermType_E_Opt _Qfilter_E_Star"($2, $3, $4) {
        let $$;
        $$ = new ShapePathAst_1.ChildStep($2, filterTermType($3, $4));
        return $$;
    },
    "step -> nonChildAxis _QtermType_E_Opt _Qfilter_E_Star"($1, $2, $3) {
        let $$;
        $$ = new ShapePathAst_1.AxisStep($1, filterTermType($2, $3));
        return $$;
    },
    "step -> GT_LPAREN shapePath GT_RPAREN _QtermType_E_Opt _Qfilter_E_Star"($2, $4, $5) {
        let $$;
        $$ = new ShapePathAst_1.PathExprStep($2, filterTermType($4, $5));
        return $$;
    },
    "_QIT_child_E_Opt -> "() {
        let $$;
        $$ = null;
        return $$;
    },
    "_QIT_child_E_Opt -> IT_child"() {
        let $$;
        $$ = null;
        return $$;
    },
    "_Qfilter_E_Star -> "() {
        let $$;
        $$ = [];
        return $$;
    },
    "_Qfilter_E_Star -> _Qfilter_E_Star filter"($1, $2) {
        let $$;
        $$ = $1.concat([$2]);
        return $$;
    },
    "_QtermType_E_Opt -> "() {
        let $$;
        $$ = null;
        return $$;
    },
    "_QtermType_E_Opt -> termType"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "nonChildAxis -> IT_thisShapeExpr"() {
        let $$;
        $$ = ShapePathAst_1.Axis.thisShapeExpr;
        return $$;
    },
    "nonChildAxis -> IT_thisTripleExpr"() {
        let $$;
        $$ = ShapePathAst_1.Axis.thisTripleExpr;
        return $$;
    },
    "nonChildAxis -> IT_self"() {
        let $$;
        $$ = ShapePathAst_1.Axis.self;
        return $$;
    },
    "nonChildAxis -> IT_parent"() {
        let $$;
        $$ = ShapePathAst_1.Axis.parent;
        return $$;
    },
    "nonChildAxis -> IT_ancestor"() {
        let $$;
        $$ = ShapePathAst_1.Axis.ancestor;
        return $$;
    },
    "attributeOrAny -> GT_STAR"() {
        let $$;
        $$ = ShapePathAst_1.t_attribute.Any;
        return $$;
    },
    "attributeOrAny -> attribute"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "filter -> GT_LBRACKET filterExpr GT_RBRACKET"($2) {
        let $$;
        $$ = $2;
        return $$;
    },
    "filterExpr -> _QIT_ASSERT_E_Opt shapePath _Qcomparison_E_Opt"($1, $2, $3) {
        let $$;
        $$ = makeFunction($1, $2, $3 ? $3 : undefined);
        return $$;
    },
    "filterExpr -> _QIT_ASSERT_E_Opt function _Qcomparison_E_Opt"($1, $2, $3) {
        let $$;
        $$ = makeFunction($1, $2, $3 ? $3 : undefined);
        return $$;
    },
    "filterExpr -> numericExpr"($1) {
        let $$;
        $$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.index, [$1]);
        return $$;
    },
    "_QIT_ASSERT_E_Opt -> "() {
        let $$;
        $$ = false;
        return $$;
    },
    "_QIT_ASSERT_E_Opt -> IT_ASSERT"() {
        let $$;
        $$ = true;
        return $$;
    },
    "_Qcomparison_E_Opt -> "() {
        let $$;
        $$ = null;
        return $$;
    },
    "_Qcomparison_E_Opt -> comparison"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "function -> IT_index GT_LPAREN GT_RPAREN"() {
        let $$;
        $$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.index, []);
        return $$;
    },
    "function -> IT_count GT_LPAREN GT_RPAREN"() {
        let $$;
        $$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.count, []);
        return $$;
    },
    "function -> IT_foo1 GT_LPAREN iri GT_RPAREN"() {
        let $$;
        $$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.count, []);
        return $$;
    },
    "function -> IT_foo2 GT_LPAREN fooArg GT_RPAREN"() {
        let $$;
        $$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.count, []);
        return $$;
    },
    "fooArg -> INTEGER iri"($1, $2) {
        let $$;
        $$ = [parseInt($1), $2];
        return $$;
    },
    "fooArg -> INTEGER"($1) {
        let $$;
        $$ = [parseInt($1)];
        return $$;
    },
    "fooArg -> iri"($1) {
        let $$;
        $$ = [$1];
        return $$;
    },
    "comparison -> comparitor rvalue"($1, $2) {
        let $$;
        $$ = { op: $1, r: $2 };
        return $$;
    },
    "comparitor -> GT_EQUAL"() {
        let $$;
        $$ = ShapePathAst_1.FuncName.equal;
        return $$;
    },
    "comparitor -> GT_LT"() {
        let $$;
        $$ = ShapePathAst_1.FuncName.lessThan;
        return $$;
    },
    "comparitor -> GT_GT"() {
        let $$;
        $$ = ShapePathAst_1.FuncName.greaterThan;
        return $$;
    },
    "rvalue -> INTEGER"($1) {
        let $$;
        $$ = parseInt($1);
        return $$;
    },
    "rvalue -> iri"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "numericExpr -> INTEGER"($1) {
        let $$;
        $$ = parseInt($1);
        return $$;
    },
    "termType -> shapeExprType"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "termType -> tripleExprType"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "termType -> valueType"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "termType -> IT_Schema"() {
        let $$;
        $$ = ShapePathAst_1.t_termType.Schema;
        return $$;
    },
    "termType -> IT_SemAct"() {
        let $$;
        $$ = ShapePathAst_1.t_termType.SemAct;
        return $$;
    },
    "termType -> IT_Annotation"() {
        let $$;
        $$ = ShapePathAst_1.t_termType.Annotation;
        return $$;
    },
    "shapeExprType -> IT_ShapeAnd"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprType.ShapeAnd;
        return $$;
    },
    "shapeExprType -> IT_ShapeOr"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprType.ShapeOr;
        return $$;
    },
    "shapeExprType -> IT_ShapeNot"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprType.ShapeNot;
        return $$;
    },
    "shapeExprType -> IT_NodeConstraint"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprType.NodeConstraint;
        return $$;
    },
    "shapeExprType -> IT_Shape"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprType.Shape;
        return $$;
    },
    "shapeExprType -> IT_ShapeExternal"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprType.ShapeExternal;
        return $$;
    },
    "tripleExprType -> IT_EachOf"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleExprType.EachOf;
        return $$;
    },
    "tripleExprType -> IT_OneOf"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleExprType.OneOf;
        return $$;
    },
    "tripleExprType -> IT_TripleConstraint"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleExprType.TripleConstraint;
        return $$;
    },
    "valueType -> IT_IriStem"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.IriStem;
        return $$;
    },
    "valueType -> IT_IriStemRange"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.IriStemRange;
        return $$;
    },
    "valueType -> IT_LiteralStem"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.LiteralStem;
        return $$;
    },
    "valueType -> IT_LiteralStemRange"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.LiteralStemRange;
        return $$;
    },
    "valueType -> IT_Language"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.Language;
        return $$;
    },
    "valueType -> IT_LanguageStem"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.LanguageStem;
        return $$;
    },
    "valueType -> IT_LanguageStemRange"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.LanguageStemRange;
        return $$;
    },
    "valueType -> IT_Wildcard"() {
        let $$;
        $$ = ShapePathAst_1.t_valueType.Wildcard;
        return $$;
    },
    "attribute -> IT_type"() {
        let $$;
        $$ = ShapePathAst_1.t_attribute.type;
        return $$;
    },
    "attribute -> IT_id"() {
        let $$;
        $$ = ShapePathAst_1.t_attribute.id;
        return $$;
    },
    "attribute -> IT_semActs"() {
        let $$;
        $$ = ShapePathAst_1.t_attribute.semActs;
        return $$;
    },
    "attribute -> IT_annotations"() {
        let $$;
        $$ = ShapePathAst_1.t_attribute.annotations;
        return $$;
    },
    "attribute -> IT_predicate"() {
        let $$;
        $$ = ShapePathAst_1.t_attribute.predicate;
        return $$;
    },
    "attribute -> schemaAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "attribute -> shapeExprAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "attribute -> tripleExprAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "attribute -> valueSetValueAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "attribute -> semActAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "attribute -> annotationAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "schemaAttr -> GT_atContext"() {
        let $$;
        $$ = ShapePathAst_1.t_schemaAttr.atContext;
        return $$;
    },
    "schemaAttr -> IT_startActs"() {
        let $$;
        $$ = ShapePathAst_1.t_schemaAttr.startActs;
        return $$;
    },
    "schemaAttr -> IT_start"() {
        let $$;
        $$ = ShapePathAst_1.t_schemaAttr.start;
        return $$;
    },
    "schemaAttr -> IT_imports"() {
        let $$;
        $$ = ShapePathAst_1.t_schemaAttr.imports;
        return $$;
    },
    "schemaAttr -> IT_shapes"() {
        let $$;
        $$ = ShapePathAst_1.t_schemaAttr.shapes;
        return $$;
    },
    "shapeExprAttr -> IT_shapeExprs"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprAttr.shapeExprs;
        return $$;
    },
    "shapeExprAttr -> IT_shapeExpr"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeExprAttr.shapeExpr;
        return $$;
    },
    "shapeExprAttr -> nodeConstraintAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "shapeExprAttr -> shapeAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "nodeConstraintAttr -> IT_nodeKind"() {
        let $$;
        $$ = ShapePathAst_1.t_nodeConstraintAttr.nodeKind;
        return $$;
    },
    "nodeConstraintAttr -> IT_datatype"() {
        let $$;
        $$ = ShapePathAst_1.t_nodeConstraintAttr.datatype;
        return $$;
    },
    "nodeConstraintAttr -> xsFacetAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "nodeConstraintAttr -> IT_values"() {
        let $$;
        $$ = ShapePathAst_1.t_nodeConstraintAttr.values;
        return $$;
    },
    "xsFacetAttr -> stringFacetAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "xsFacetAttr -> numericFacetAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "stringFacetAttr -> IT_length"() {
        let $$;
        $$ = ShapePathAst_1.t_stringFacetAttr.length;
        return $$;
    },
    "stringFacetAttr -> IT_minlength"() {
        let $$;
        $$ = ShapePathAst_1.t_stringFacetAttr.minlength;
        return $$;
    },
    "stringFacetAttr -> IT_maxlength"() {
        let $$;
        $$ = ShapePathAst_1.t_stringFacetAttr.maxlength;
        return $$;
    },
    "stringFacetAttr -> IT_pattern"() {
        let $$;
        $$ = ShapePathAst_1.t_stringFacetAttr.pattern;
        return $$;
    },
    "stringFacetAttr -> IT_flags"() {
        let $$;
        $$ = ShapePathAst_1.t_stringFacetAttr.flags;
        return $$;
    },
    "numericFacetAttr -> IT_mininclusive"() {
        let $$;
        $$ = ShapePathAst_1.t_numericFacetAttr.mininclusive;
        return $$;
    },
    "numericFacetAttr -> IT_minexclusive"() {
        let $$;
        $$ = ShapePathAst_1.t_numericFacetAttr.minexclusive;
        return $$;
    },
    "numericFacetAttr -> IT_maxinclusive"() {
        let $$;
        $$ = ShapePathAst_1.t_numericFacetAttr.maxinclusive;
        return $$;
    },
    "numericFacetAttr -> IT_maxexclusive"() {
        let $$;
        $$ = ShapePathAst_1.t_numericFacetAttr.maxexclusive;
        return $$;
    },
    "numericFacetAttr -> IT_totaldigits"() {
        let $$;
        $$ = ShapePathAst_1.t_numericFacetAttr.totaldigits;
        return $$;
    },
    "numericFacetAttr -> IT_fractiondigits"() {
        let $$;
        $$ = ShapePathAst_1.t_numericFacetAttr.fractiondigits;
        return $$;
    },
    "valueSetValueAttr -> IT_value"() {
        let $$;
        $$ = ShapePathAst_1.t_valueSetValueAttr.value;
        return $$;
    },
    "valueSetValueAttr -> IT_language"() {
        let $$;
        $$ = ShapePathAst_1.t_valueSetValueAttr.language;
        return $$;
    },
    "valueSetValueAttr -> IT_stem"() {
        let $$;
        $$ = ShapePathAst_1.t_valueSetValueAttr.stem;
        return $$;
    },
    "valueSetValueAttr -> IT_exclusions"() {
        let $$;
        $$ = ShapePathAst_1.t_valueSetValueAttr.exclusions;
        return $$;
    },
    "valueSetValueAttr -> IT_languageTag"() {
        let $$;
        $$ = ShapePathAst_1.t_valueSetValueAttr.languageTag;
        return $$;
    },
    "shapeAttr -> IT_closed"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeAttr.closed;
        return $$;
    },
    "shapeAttr -> IT_extra"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeAttr.extra;
        return $$;
    },
    "shapeAttr -> IT_expression"() {
        let $$;
        $$ = ShapePathAst_1.t_shapeAttr.expression;
        return $$;
    },
    "tripleExprAttr -> IT_expressions"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleExprAttr.expressions;
        return $$;
    },
    "tripleExprAttr -> IT_min"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleExprAttr.min;
        return $$;
    },
    "tripleExprAttr -> IT_max"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleExprAttr.max;
        return $$;
    },
    "tripleExprAttr -> tripleConstraintAttr"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "tripleConstraintAttr -> IT_inverse"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleConstraintAttr.inverse;
        return $$;
    },
    "tripleConstraintAttr -> IT_valueExpr"() {
        let $$;
        $$ = ShapePathAst_1.t_tripleConstraintAttr.valueExpr;
        return $$;
    },
    "semActAttr -> IT_name"() {
        let $$;
        $$ = ShapePathAst_1.t_semActAttr.name;
        return $$;
    },
    "semActAttr -> IT_code"() {
        let $$;
        $$ = ShapePathAst_1.t_semActAttr.code;
        return $$;
    },
    "annotationAttr -> IT_object"() {
        let $$;
        $$ = ShapePathAst_1.t_annotationAttr.object;
        return $$;
    },
    "iri -> IRIREF"($1) {
        let $$;
        $$ = newIri(new URL($1.substr(1, $1.length - 2), ShapePathParser_typedict_1.yy.base).href);
        return $$;
    },
    "iri -> prefixedName"($1) {
        let $$;
        $$ = $1;
        return $$;
    },
    "prefixedName -> PNAME_LN"($1) {
        let $$;
        $$ = pnameToUrl($1, ShapePathParser_typedict_1.yy);
        return $$;
    },
    "prefixedName -> PNAME_NS"($1) {
        let $$;
        $$ = pnameToUrl($1, ShapePathParser_typedict_1.yy);
        return $$;
    },
};
//# sourceMappingURL=ShapePathParser.typecheck.js.map