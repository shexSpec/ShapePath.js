"use strict";
/* parser generated by jison 0.3.0 */
/**
 * Returns a Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapePathLexer = exports.ShapePathParser = exports.predicateShortCut = exports.shapeLabelShortCut = void 0;
const ShapePathAst_1 = require("./ShapePathAst");
function makeFunction(assertionP, firstArg, comp = { op: ShapePathAst_1.FuncName.ebv, r: null }) {
    const { op, r } = comp;
    const args = [firstArg];
    if (r)
        args.push(r);
    const ret = new ShapePathAst_1.Filter(op, args);
    return assertionP
        ? new ShapePathAst_1.Assertion(ret)
        : ret;
}
function filterTermType(type, filters) {
    if (type)
        filters.unshift(new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.equal, [
            new ShapePathAst_1.Path([new ShapePathAst_1.ChildStep(ShapePathAst_1.t_attribute.type)]),
            type
        ]));
    return filters.length > 0 ? filters : undefined;
}
const newIri = (s) => s;
function pnameToUrl(pname, yy) {
    const idx = pname.indexOf(':');
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
                label
            ]),
            new ShapePathAst_1.Assertion(new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.equal, [
                new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.count, []),
                1
            ]))
        ]),
        new ShapePathAst_1.ChildStep(ShapePathAst_1.t_shapeDeclAttr.shapeExpr),
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
                label
            ])
        ]))
    ];
}
exports.predicateShortCut = predicateShortCut;
const parser_1 = require("@ts-jison/parser");
const $V0 = [37, 39, 41, 42, 43, 44, 45, 46, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 102, 103, 104, 105, 106, 107, 108, 111, 112, 114, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 140, 141, 142, 143, 144], $V1 = [2, 21], $V2 = [1, 11], $V3 = [1, 12], $V4 = [1, 13], $V5 = [1, 14], $V6 = [5, 9, 38, 50, 65, 66, 67], $V7 = [5, 9, 13, 38, 50, 65, 66, 67], $V8 = [5, 9, 13, 17, 38, 50, 65, 66, 67], $V9 = [5, 9, 13, 17, 25, 26, 29, 30, 38, 50, 65, 66, 67], $Va = [46, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 102, 103, 104, 105, 106, 107, 108, 111, 112, 114, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 140, 141, 142, 143, 144], $Vb = [2, 32], $Vc = [1, 23], $Vd = [1, 24], $Ve = [1, 25], $Vf = [1, 26], $Vg = [1, 27], $Vh = [1, 28], $Vi = [1, 29], $Vj = [1, 31], $Vk = [1, 33], $Vl = [1, 34], $Vm = [145, 147, 148], $Vn = [1, 49], $Vo = [1, 50], $Vp = [1, 51], $Vq = [1, 54], $Vr = [1, 55], $Vs = [1, 56], $Vt = [1, 57], $Vu = [1, 58], $Vv = [1, 59], $Vw = [1, 60], $Vx = [1, 61], $Vy = [1, 62], $Vz = [1, 63], $VA = [1, 64], $VB = [1, 65], $VC = [1, 66], $VD = [1, 67], $VE = [1, 68], $VF = [1, 69], $VG = [1, 70], $VH = [5, 9, 13, 17, 25, 26, 29, 30, 38, 48, 50, 65, 66, 67], $VI = [2, 36], $VJ = [5, 9, 13, 17, 25, 26, 29, 30, 38, 48, 50, 65, 66, 67, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], $VK = [2, 34], $VL = [1, 137], $VM = [25, 26, 29, 30, 37, 39, 41, 42, 43, 44, 45, 46, 57, 58, 59, 60, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 102, 103, 104, 105, 106, 107, 108, 111, 112, 114, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 140, 141, 142, 143, 144], $VN = [2, 51], $VO = [1, 156], $VP = [1, 157], $VQ = [1, 158], $VR = [62, 145, 147, 148], $VS = [50, 65, 66, 67];
class ShapePathParser extends parser_1.JisonParser {
    $;
    constructor(yy = {}, lexer = new ShapePathLexer(yy)) {
        super(yy, lexer);
    }
    symbols_ = { "error": 2, "top": 3, "shapePath": 4, "EOF": 5, "sequenceStep": 6, "Q_O_QGT_COMMA_E_S_QsequenceStep_E_C_E_Star": 7, "O_QGT_COMMA_E_S_QsequenceStep_E_C": 8, "GT_COMMA": 9, "unionStep": 10, "Q_O_QIT_union_E_S_QunionStep_E_C_E_Star": 11, "O_QIT_union_E_S_QunionStep_E_C": 12, "IT_UNION": 13, "intersectionStep": 14, "Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star": 15, "O_QIT_intersection_E_S_QintersectionStep_E_C": 16, "IT_INTERSECTION": 17, "startStep": 18, "QnextStep_E_Star": 19, "nextStep": 20, "Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt": 21, "step": 22, "shortcut": 23, "O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C": 24, "GT_DIVIDE": 25, "GT_DIVIDEDIVIDE": 26, "O_QGT_AT_E_Or_QGT_TILDE_E_C": 27, "iri": 28, "GT_AT": 29, "GT_TILDE": 30, "QIT_child_E_Opt": 31, "termType": 32, "Qfilter_E_Star": 33, "attributeOrAny": 34, "QtermType_E_Opt": 35, "nonChildAxis": 36, "GT_LPAREN": 37, "GT_RPAREN": 38, "IT_child": 39, "filter": 40, "IT_thisShapeExpr": 41, "IT_thisTripleExpr": 42, "IT_self": 43, "IT_parent": 44, "IT_ancestor": 45, "GT_STAR": 46, "attribute": 47, "GT_LBRACKET": 48, "filterExpr": 49, "GT_RBRACKET": 50, "QIT_ASSERT_E_Opt": 51, "Qcomparison_E_Opt": 52, "function": 53, "numericExpr": 54, "IT_ASSERT": 55, "comparison": 56, "IT_index": 57, "IT_count": 58, "IT_foo1": 59, "IT_foo2": 60, "fooArg": 61, "INTEGER": 62, "comparitor": 63, "rvalue": 64, "GT_EQUAL": 65, "GT_LT": 66, "GT_GT": 67, "shapeExprType": 68, "tripleExprType": 69, "valueType": 70, "IT_Schema": 71, "IT_SemAct": 72, "IT_Annotation": 73, "IT_ShapeAnd": 74, "IT_ShapeOr": 75, "IT_ShapeNot": 76, "IT_NodeConstraint": 77, "IT_Shape": 78, "IT_ShapeExternal": 79, "IT_EachOf": 80, "IT_OneOf": 81, "IT_TripleConstraint": 82, "IT_IriStem": 83, "IT_IriStemRange": 84, "IT_LiteralStem": 85, "IT_LiteralStemRange": 86, "IT_Language": 87, "IT_LanguageStem": 88, "IT_LanguageStemRange": 89, "IT_Wildcard": 90, "IT_type": 91, "IT_id": 92, "IT_semActs": 93, "IT_annotations": 94, "IT_predicate": 95, "schemaAttr": 96, "shapeExprAttr": 97, "tripleExprAttr": 98, "valueSetValueAttr": 99, "semActAttr": 100, "annotationAttr": 101, "GT_atContext": 102, "IT_startActs": 103, "IT_start": 104, "IT_imports": 105, "IT_shapes": 106, "IT_shapeExprs": 107, "IT_shapeExpr": 108, "nodeConstraintAttr": 109, "shapeAttr": 110, "IT_nodeKind": 111, "IT_datatype": 112, "xsFacetAttr": 113, "IT_values": 114, "stringFacetAttr": 115, "numericFacetAttr": 116, "IT_length": 117, "IT_minlength": 118, "IT_maxlength": 119, "IT_pattern": 120, "IT_flags": 121, "IT_mininclusive": 122, "IT_minexclusive": 123, "IT_maxinclusive": 124, "IT_maxexclusive": 125, "IT_totaldigits": 126, "IT_fractiondigits": 127, "IT_value": 128, "IT_language": 129, "IT_stem": 130, "IT_exclusions": 131, "IT_languageTag": 132, "IT_closed": 133, "IT_extra": 134, "IT_expression": 135, "IT_expressions": 136, "IT_min": 137, "IT_max": 138, "tripleConstraintAttr": 139, "IT_inverse": 140, "IT_valueExpr": 141, "IT_name": 142, "IT_code": 143, "IT_object": 144, "IRIREF": 145, "prefixedName": 146, "PNAME_LN": 147, "PNAME_NS": 148, "$accept": 0, "$end": 1 };
    terminals_ = { 2: "error", 5: "EOF", 9: "GT_COMMA", 13: "IT_UNION", 17: "IT_INTERSECTION", 25: "GT_DIVIDE", 26: "GT_DIVIDEDIVIDE", 29: "GT_AT", 30: "GT_TILDE", 37: "GT_LPAREN", 38: "GT_RPAREN", 39: "IT_child", 41: "IT_thisShapeExpr", 42: "IT_thisTripleExpr", 43: "IT_self", 44: "IT_parent", 45: "IT_ancestor", 46: "GT_STAR", 48: "GT_LBRACKET", 50: "GT_RBRACKET", 55: "IT_ASSERT", 57: "IT_index", 58: "IT_count", 59: "IT_foo1", 60: "IT_foo2", 62: "INTEGER", 65: "GT_EQUAL", 66: "GT_LT", 67: "GT_GT", 71: "IT_Schema", 72: "IT_SemAct", 73: "IT_Annotation", 74: "IT_ShapeAnd", 75: "IT_ShapeOr", 76: "IT_ShapeNot", 77: "IT_NodeConstraint", 78: "IT_Shape", 79: "IT_ShapeExternal", 80: "IT_EachOf", 81: "IT_OneOf", 82: "IT_TripleConstraint", 83: "IT_IriStem", 84: "IT_IriStemRange", 85: "IT_LiteralStem", 86: "IT_LiteralStemRange", 87: "IT_Language", 88: "IT_LanguageStem", 89: "IT_LanguageStemRange", 90: "IT_Wildcard", 91: "IT_type", 92: "IT_id", 93: "IT_semActs", 94: "IT_annotations", 95: "IT_predicate", 102: "GT_atContext", 103: "IT_startActs", 104: "IT_start", 105: "IT_imports", 106: "IT_shapes", 107: "IT_shapeExprs", 108: "IT_shapeExpr", 111: "IT_nodeKind", 112: "IT_datatype", 114: "IT_values", 117: "IT_length", 118: "IT_minlength", 119: "IT_maxlength", 120: "IT_pattern", 121: "IT_flags", 122: "IT_mininclusive", 123: "IT_minexclusive", 124: "IT_maxinclusive", 125: "IT_maxexclusive", 126: "IT_totaldigits", 127: "IT_fractiondigits", 128: "IT_value", 129: "IT_language", 130: "IT_stem", 131: "IT_exclusions", 132: "IT_languageTag", 133: "IT_closed", 134: "IT_extra", 135: "IT_expression", 136: "IT_expressions", 137: "IT_min", 138: "IT_max", 140: "IT_inverse", 141: "IT_valueExpr", 142: "IT_name", 143: "IT_code", 144: "IT_object", 145: "IRIREF", 147: "PNAME_LN", 148: "PNAME_NS" };
    productions_ = [0, [3, 2], [4, 2], [8, 2], [7, 0], [7, 2], [6, 2], [12, 2], [11, 0], [11, 2], [10, 2], [16, 2], [15, 0], [15, 2], [14, 2], [19, 0], [19, 2], [18, 2], [18, 1], [24, 1], [24, 1], [21, 0], [21, 1], [20, 2], [20, 1], [23, 2], [27, 1], [27, 1], [22, 3], [22, 4], [22, 3], [22, 5], [31, 0], [31, 1], [33, 0], [33, 2], [35, 0], [35, 1], [36, 1], [36, 1], [36, 1], [36, 1], [36, 1], [34, 1], [34, 1], [40, 3], [49, 3], [49, 3], [49, 1], [51, 0], [51, 1], [52, 0], [52, 1], [53, 3], [53, 3], [53, 4], [53, 4], [61, 2], [61, 1], [61, 1], [56, 2], [63, 1], [63, 1], [63, 1], [64, 1], [64, 1], [54, 1], [32, 1], [32, 1], [32, 1], [32, 1], [32, 1], [32, 1], [68, 1], [68, 1], [68, 1], [68, 1], [68, 1], [68, 1], [69, 1], [69, 1], [69, 1], [70, 1], [70, 1], [70, 1], [70, 1], [70, 1], [70, 1], [70, 1], [70, 1], [47, 1], [47, 1], [47, 1], [47, 1], [47, 1], [47, 1], [47, 1], [47, 1], [47, 1], [47, 1], [47, 1], [96, 1], [96, 1], [96, 1], [96, 1], [96, 1], [97, 1], [97, 1], [97, 1], [97, 1], [109, 1], [109, 1], [109, 1], [109, 1], [113, 1], [113, 1], [115, 1], [115, 1], [115, 1], [115, 1], [115, 1], [116, 1], [116, 1], [116, 1], [116, 1], [116, 1], [116, 1], [99, 1], [99, 1], [99, 1], [99, 1], [99, 1], [110, 1], [110, 1], [110, 1], [98, 1], [98, 1], [98, 1], [98, 1], [139, 1], [139, 1], [100, 1], [100, 1], [101, 1], [28, 1], [28, 1], [146, 1], [146, 1]];
    table = [(0, parser_1.o)($V0, $V1, { 3: 1, 4: 2, 6: 3, 10: 4, 14: 5, 18: 6, 21: 7, 23: 8, 24: 9, 27: 10, 25: $V2, 26: $V3, 29: $V4, 30: $V5 }), { 1: [3] }, { 5: [1, 15] }, (0, parser_1.o)($V6, [2, 4], { 7: 16 }), (0, parser_1.o)($V7, [2, 8], { 11: 17 }), (0, parser_1.o)($V8, [2, 12], { 15: 18 }), (0, parser_1.o)($V9, [2, 15], { 19: 19 }), (0, parser_1.o)($Va, $Vb, { 22: 20, 31: 21, 36: 22, 37: $Vc, 39: $Vd, 41: $Ve, 42: $Vf, 43: $Vg, 44: $Vh, 45: $Vi }), (0, parser_1.o)($V9, [2, 18]), (0, parser_1.o)($V0, [2, 22]), { 28: 30, 145: $Vj, 146: 32, 147: $Vk, 148: $Vl }, (0, parser_1.o)($V0, [2, 19]), (0, parser_1.o)($V0, [2, 20]), (0, parser_1.o)($Vm, [2, 26]), (0, parser_1.o)($Vm, [2, 27]), { 1: [2, 1] }, (0, parser_1.o)([5, 38, 50, 65, 66, 67], [2, 2], { 8: 35, 9: [1, 36] }), (0, parser_1.o)($V6, [2, 6], { 12: 37, 13: [1, 38] }), (0, parser_1.o)($V7, [2, 10], { 16: 39, 17: [1, 40] }), (0, parser_1.o)($V8, [2, 14], { 27: 10, 20: 41, 24: 42, 23: 43, 25: $V2, 26: $V3, 29: $V4, 30: $V5 }), (0, parser_1.o)($V9, [2, 17]), { 32: 44, 34: 45, 46: [1, 52], 47: 53, 68: 46, 69: 47, 70: 48, 71: $Vn, 72: $Vo, 73: $Vp, 74: $Vq, 75: $Vr, 76: $Vs, 77: $Vt, 78: $Vu, 79: $Vv, 80: $Vw, 81: $Vx, 82: $Vy, 83: $Vz, 84: $VA, 85: $VB, 86: $VC, 87: $VD, 88: $VE, 89: $VF, 90: $VG, 91: [1, 71], 92: [1, 72], 93: [1, 73], 94: [1, 74], 95: [1, 75], 96: 76, 97: 77, 98: 78, 99: 79, 100: 80, 101: 81, 102: [1, 82], 103: [1, 83], 104: [1, 84], 105: [1, 85], 106: [1, 86], 107: [1, 87], 108: [1, 88], 109: 89, 110: 90, 111: [1, 103], 112: [1, 104], 113: 105, 114: [1, 106], 115: 112, 116: 113, 117: [1, 114], 118: [1, 115], 119: [1, 116], 120: [1, 117], 121: [1, 118], 122: [1, 119], 123: [1, 120], 124: [1, 121], 125: [1, 122], 126: [1, 123], 127: [1, 124], 128: [1, 95], 129: [1, 96], 130: [1, 97], 131: [1, 98], 132: [1, 99], 133: [1, 107], 134: [1, 108], 135: [1, 109], 136: [1, 91], 137: [1, 92], 138: [1, 93], 139: 94, 140: [1, 110], 141: [1, 111], 142: [1, 100], 143: [1, 101], 144: [1, 102] }, (0, parser_1.o)($VH, $VI, { 68: 46, 69: 47, 70: 48, 35: 125, 32: 126, 71: $Vn, 72: $Vo, 73: $Vp, 74: $Vq, 75: $Vr, 76: $Vs, 77: $Vt, 78: $Vu, 79: $Vv, 80: $Vw, 81: $Vx, 82: $Vy, 83: $Vz, 84: $VA, 85: $VB, 86: $VC, 87: $VD, 88: $VE, 89: $VF, 90: $VG }), (0, parser_1.o)($V0, $V1, { 6: 3, 10: 4, 14: 5, 18: 6, 21: 7, 23: 8, 24: 9, 27: 10, 4: 127, 25: $V2, 26: $V3, 29: $V4, 30: $V5 }), (0, parser_1.o)($Va, [2, 33]), (0, parser_1.o)($VJ, [2, 38]), (0, parser_1.o)($VJ, [2, 39]), (0, parser_1.o)($VJ, [2, 40]), (0, parser_1.o)($VJ, [2, 41]), (0, parser_1.o)($VJ, [2, 42]), (0, parser_1.o)($V9, [2, 25]), (0, parser_1.o)($V9, [2, 144]), (0, parser_1.o)($V9, [2, 145]), (0, parser_1.o)($V9, [2, 146]), (0, parser_1.o)($V9, [2, 147]), (0, parser_1.o)($V6, [2, 5]), (0, parser_1.o)($V0, $V1, { 10: 4, 14: 5, 18: 6, 21: 7, 23: 8, 24: 9, 27: 10, 6: 128, 25: $V2, 26: $V3, 29: $V4, 30: $V5 }), (0, parser_1.o)($V7, [2, 9]), (0, parser_1.o)($V0, $V1, { 14: 5, 18: 6, 21: 7, 23: 8, 24: 9, 27: 10, 10: 129, 25: $V2, 26: $V3, 29: $V4, 30: $V5 }), (0, parser_1.o)($V8, [2, 13]), (0, parser_1.o)($V0, $V1, { 18: 6, 21: 7, 23: 8, 24: 9, 27: 10, 14: 130, 25: $V2, 26: $V3, 29: $V4, 30: $V5 }), (0, parser_1.o)($V9, [2, 16]), (0, parser_1.o)($Va, $Vb, { 31: 21, 36: 22, 22: 131, 37: $Vc, 39: $Vd, 41: $Ve, 42: $Vf, 43: $Vg, 44: $Vh, 45: $Vi }), (0, parser_1.o)($V9, [2, 24]), (0, parser_1.o)($VH, $VK, { 33: 132 }), (0, parser_1.o)($VH, $VI, { 68: 46, 69: 47, 70: 48, 32: 126, 35: 133, 71: $Vn, 72: $Vo, 73: $Vp, 74: $Vq, 75: $Vr, 76: $Vs, 77: $Vt, 78: $Vu, 79: $Vv, 80: $Vw, 81: $Vx, 82: $Vy, 83: $Vz, 84: $VA, 85: $VB, 86: $VC, 87: $VD, 88: $VE, 89: $VF, 90: $VG }), (0, parser_1.o)($VH, [2, 67]), (0, parser_1.o)($VH, [2, 68]), (0, parser_1.o)($VH, [2, 69]), (0, parser_1.o)($VH, [2, 70]), (0, parser_1.o)($VH, [2, 71]), (0, parser_1.o)($VH, [2, 72]), (0, parser_1.o)($VJ, [2, 43]), (0, parser_1.o)($VJ, [2, 44]), (0, parser_1.o)($VH, [2, 73]), (0, parser_1.o)($VH, [2, 74]), (0, parser_1.o)($VH, [2, 75]), (0, parser_1.o)($VH, [2, 76]), (0, parser_1.o)($VH, [2, 77]), (0, parser_1.o)($VH, [2, 78]), (0, parser_1.o)($VH, [2, 79]), (0, parser_1.o)($VH, [2, 80]), (0, parser_1.o)($VH, [2, 81]), (0, parser_1.o)($VH, [2, 82]), (0, parser_1.o)($VH, [2, 83]), (0, parser_1.o)($VH, [2, 84]), (0, parser_1.o)($VH, [2, 85]), (0, parser_1.o)($VH, [2, 86]), (0, parser_1.o)($VH, [2, 87]), (0, parser_1.o)($VH, [2, 88]), (0, parser_1.o)($VH, [2, 89]), (0, parser_1.o)($VJ, [2, 90]), (0, parser_1.o)($VJ, [2, 91]), (0, parser_1.o)($VJ, [2, 92]), (0, parser_1.o)($VJ, [2, 93]), (0, parser_1.o)($VJ, [2, 94]), (0, parser_1.o)($VJ, [2, 95]), (0, parser_1.o)($VJ, [2, 96]), (0, parser_1.o)($VJ, [2, 97]), (0, parser_1.o)($VJ, [2, 98]), (0, parser_1.o)($VJ, [2, 99]), (0, parser_1.o)($VJ, [2, 100]), (0, parser_1.o)($VJ, [2, 101]), (0, parser_1.o)($VJ, [2, 102]), (0, parser_1.o)($VJ, [2, 103]), (0, parser_1.o)($VJ, [2, 104]), (0, parser_1.o)($VJ, [2, 105]), (0, parser_1.o)($VJ, [2, 106]), (0, parser_1.o)($VJ, [2, 107]), (0, parser_1.o)($VJ, [2, 108]), (0, parser_1.o)($VJ, [2, 109]), (0, parser_1.o)($VJ, [2, 135]), (0, parser_1.o)($VJ, [2, 136]), (0, parser_1.o)($VJ, [2, 137]), (0, parser_1.o)($VJ, [2, 138]), (0, parser_1.o)($VJ, [2, 127]), (0, parser_1.o)($VJ, [2, 128]), (0, parser_1.o)($VJ, [2, 129]), (0, parser_1.o)($VJ, [2, 130]), (0, parser_1.o)($VJ, [2, 131]), (0, parser_1.o)($VJ, [2, 141]), (0, parser_1.o)($VJ, [2, 142]), (0, parser_1.o)($VJ, [2, 143]), (0, parser_1.o)($VJ, [2, 110]), (0, parser_1.o)($VJ, [2, 111]), (0, parser_1.o)($VJ, [2, 112]), (0, parser_1.o)($VJ, [2, 113]), (0, parser_1.o)($VJ, [2, 132]), (0, parser_1.o)($VJ, [2, 133]), (0, parser_1.o)($VJ, [2, 134]), (0, parser_1.o)($VJ, [2, 139]), (0, parser_1.o)($VJ, [2, 140]), (0, parser_1.o)($VJ, [2, 114]), (0, parser_1.o)($VJ, [2, 115]), (0, parser_1.o)($VJ, [2, 116]), (0, parser_1.o)($VJ, [2, 117]), (0, parser_1.o)($VJ, [2, 118]), (0, parser_1.o)($VJ, [2, 119]), (0, parser_1.o)($VJ, [2, 120]), (0, parser_1.o)($VJ, [2, 121]), (0, parser_1.o)($VJ, [2, 122]), (0, parser_1.o)($VJ, [2, 123]), (0, parser_1.o)($VJ, [2, 124]), (0, parser_1.o)($VJ, [2, 125]), (0, parser_1.o)($VJ, [2, 126]), (0, parser_1.o)($VH, $VK, { 33: 134 }), (0, parser_1.o)($VH, [2, 37]), { 38: [1, 135] }, (0, parser_1.o)($V6, [2, 3]), (0, parser_1.o)($V7, [2, 7]), (0, parser_1.o)($V8, [2, 11]), (0, parser_1.o)($V9, [2, 23]), (0, parser_1.o)($V9, [2, 28], { 40: 136, 48: $VL }), (0, parser_1.o)($VH, $VK, { 33: 138 }), (0, parser_1.o)($V9, [2, 30], { 40: 136, 48: $VL }), (0, parser_1.o)($VH, $VI, { 68: 46, 69: 47, 70: 48, 32: 126, 35: 139, 71: $Vn, 72: $Vo, 73: $Vp, 74: $Vq, 75: $Vr, 76: $Vs, 77: $Vt, 78: $Vu, 79: $Vv, 80: $Vw, 81: $Vx, 82: $Vy, 83: $Vz, 84: $VA, 85: $VB, 86: $VC, 87: $VD, 88: $VE, 89: $VF, 90: $VG }), (0, parser_1.o)($VH, [2, 35]), (0, parser_1.o)($VM, [2, 49], { 49: 140, 51: 141, 54: 142, 55: [1, 143], 62: [1, 144] }), (0, parser_1.o)($V9, [2, 29], { 40: 136, 48: $VL }), (0, parser_1.o)($VH, $VK, { 33: 145 }), { 50: [1, 146] }, (0, parser_1.o)($V0, $V1, { 6: 3, 10: 4, 14: 5, 18: 6, 21: 7, 23: 8, 24: 9, 27: 10, 4: 147, 53: 148, 25: $V2, 26: $V3, 29: $V4, 30: $V5, 57: [1, 149], 58: [1, 150], 59: [1, 151], 60: [1, 152] }), { 50: [2, 48] }, (0, parser_1.o)($VM, [2, 50]), { 50: [2, 66] }, (0, parser_1.o)($V9, [2, 31], { 40: 136, 48: $VL }), (0, parser_1.o)($VH, [2, 45]), { 50: $VN, 52: 153, 56: 154, 63: 155, 65: $VO, 66: $VP, 67: $VQ }, { 50: $VN, 52: 159, 56: 154, 63: 155, 65: $VO, 66: $VP, 67: $VQ }, { 37: [1, 160] }, { 37: [1, 161] }, { 37: [1, 162] }, { 37: [1, 163] }, { 50: [2, 46] }, { 50: [2, 52] }, { 28: 166, 62: [1, 165], 64: 164, 145: $Vj, 146: 32, 147: $Vk, 148: $Vl }, (0, parser_1.o)($VR, [2, 61]), (0, parser_1.o)($VR, [2, 62]), (0, parser_1.o)($VR, [2, 63]), { 50: [2, 47] }, { 38: [1, 167] }, { 38: [1, 168] }, { 28: 169, 145: $Vj, 146: 32, 147: $Vk, 148: $Vl }, { 28: 172, 61: 170, 62: [1, 171], 145: $Vj, 146: 32, 147: $Vk, 148: $Vl }, { 50: [2, 60] }, { 50: [2, 64] }, { 50: [2, 65] }, (0, parser_1.o)($VS, [2, 53]), (0, parser_1.o)($VS, [2, 54]), { 38: [1, 173] }, { 38: [1, 174] }, { 28: 175, 38: [2, 58], 145: $Vj, 146: 32, 147: $Vk, 148: $Vl }, { 38: [2, 59] }, (0, parser_1.o)($VS, [2, 55]), (0, parser_1.o)($VS, [2, 56]), { 38: [2, 57] }];
    defaultActions = { 15: [2, 1], 142: [2, 48], 144: [2, 66], 153: [2, 46], 154: [2, 52], 159: [2, 47], 164: [2, 60], 165: [2, 64], 166: [2, 65], 172: [2, 59], 175: [2, 57] };
    performAction(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
        /* this == yyval */
        var $0 = $$.length - 1;
        switch (yystate) {
            case 1:
                return $$[$0 - 1];
            case 2:
                this.$ = $$[$0].length ? new ShapePathAst_1.Sequence([$$[$0 - 1]].concat($$[$0])) : $$[$0 - 1];
                break;
            case 3:
            case 7:
            case 11:
                this.$ = $$[$0];
                break;
            case 4:
            case 8:
            case 12:
            case 15:
            case 34:
                this.$ = [];
                break;
            case 5:
            case 9:
            case 13:
            case 35:
                this.$ = $$[$0 - 1].concat([$$[$0]]);
                break;
            case 6:
                this.$ = $$[$0].length ? new ShapePathAst_1.Union([$$[$0 - 1]].concat($$[$0])) : $$[$0 - 1];
                break;
            case 10:
                this.$ = $$[$0].length ? new ShapePathAst_1.Intersection([$$[$0 - 1]].concat($$[$0])) : $$[$0 - 1];
                break;
            case 14:
                this.$ = new ShapePathAst_1.Path($$[$0 - 1].concat($$[$0]));
                break;
            case 16:
                this.$ = $$[$0 - 1].concat($$[$0]);
                break;
            case 17:
            case 23:
            case 59:
                this.$ = [$$[$0]];
                break;
            case 21:
            case 32:
            case 33:
            case 36:
            case 51:
                this.$ = null;
                break;
            case 25:
                this.$ = $$[$0 - 1] === '@' ? shapeLabelShortCut($$[$0]) : predicateShortCut($$[$0]);
                break;
            case 28:
                this.$ = new ShapePathAst_1.ChildStep(ShapePathAst_1.t_attribute.Any, filterTermType($$[$0 - 1], $$[$0]));
                break;
            case 29:
                this.$ = new ShapePathAst_1.ChildStep($$[$0 - 2], filterTermType($$[$0 - 1], $$[$0]));
                break;
            case 30:
                this.$ = new ShapePathAst_1.AxisStep($$[$0 - 2], filterTermType($$[$0 - 1], $$[$0]));
                break;
            case 31:
                this.$ = new ShapePathAst_1.PathExprStep($$[$0 - 3], filterTermType($$[$0 - 1], $$[$0]));
                break;
            case 38:
                this.$ = ShapePathAst_1.Axis.thisShapeExpr;
                break;
            case 39:
                this.$ = ShapePathAst_1.Axis.thisTripleExpr;
                break;
            case 40:
                this.$ = ShapePathAst_1.Axis.self;
                break;
            case 41:
                this.$ = ShapePathAst_1.Axis.parent;
                break;
            case 42:
                this.$ = ShapePathAst_1.Axis.ancestor;
                break;
            case 43:
                this.$ = ShapePathAst_1.t_attribute.Any;
                break;
            case 45:
                this.$ = $$[$0 - 1];
                break;
            case 46:
            case 47:
                this.$ = makeFunction($$[$0 - 2], $$[$0 - 1], $$[$0] ? $$[$0] : undefined);
                break;
            case 48:
                this.$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.index, [$$[$0]]);
                break;
            case 49:
                this.$ = false;
                break;
            case 50:
                this.$ = true;
                break;
            case 53:
                this.$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.index, []);
                break;
            case 54:
            case 55:
            case 56:
                this.$ = new ShapePathAst_1.Filter(ShapePathAst_1.FuncName.count, []);
                break;
            case 57:
                this.$ = [parseInt($$[$0 - 1]), $$[$0]];
                break;
            case 58:
                this.$ = [parseInt($$[$0])];
                break;
            case 60:
                this.$ = { op: $$[$0 - 1], r: $$[$0] };
                break;
            case 61:
                this.$ = ShapePathAst_1.FuncName.equal;
                break;
            case 62:
                this.$ = ShapePathAst_1.FuncName.lessThan;
                break;
            case 63:
                this.$ = ShapePathAst_1.FuncName.greaterThan;
                break;
            case 64:
            case 66:
                this.$ = parseInt($$[$0]);
                break;
            case 70:
                this.$ = ShapePathAst_1.t_termType.Schema;
                break;
            case 71:
                this.$ = ShapePathAst_1.t_termType.SemAct;
                break;
            case 72:
                this.$ = ShapePathAst_1.t_termType.Annotation;
                break;
            case 73:
                this.$ = ShapePathAst_1.t_shapeExprType.ShapeAnd;
                break;
            case 74:
                this.$ = ShapePathAst_1.t_shapeExprType.ShapeOr;
                break;
            case 75:
                this.$ = ShapePathAst_1.t_shapeExprType.ShapeNot;
                break;
            case 76:
                this.$ = ShapePathAst_1.t_shapeExprType.NodeConstraint;
                break;
            case 77:
                this.$ = ShapePathAst_1.t_shapeExprType.Shape;
                break;
            case 78:
                this.$ = ShapePathAst_1.t_shapeExprType.ShapeExternal;
                break;
            case 79:
                this.$ = ShapePathAst_1.t_tripleExprType.EachOf;
                break;
            case 80:
                this.$ = ShapePathAst_1.t_tripleExprType.OneOf;
                break;
            case 81:
                this.$ = ShapePathAst_1.t_tripleExprType.TripleConstraint;
                break;
            case 82:
                this.$ = ShapePathAst_1.t_valueType.IriStem;
                break;
            case 83:
                this.$ = ShapePathAst_1.t_valueType.IriStemRange;
                break;
            case 84:
                this.$ = ShapePathAst_1.t_valueType.LiteralStem;
                break;
            case 85:
                this.$ = ShapePathAst_1.t_valueType.LiteralStemRange;
                break;
            case 86:
                this.$ = ShapePathAst_1.t_valueType.Language;
                break;
            case 87:
                this.$ = ShapePathAst_1.t_valueType.LanguageStem;
                break;
            case 88:
                this.$ = ShapePathAst_1.t_valueType.LanguageStemRange;
                break;
            case 89:
                this.$ = ShapePathAst_1.t_valueType.Wildcard;
                break;
            case 90:
                this.$ = ShapePathAst_1.t_attribute.type;
                break;
            case 91:
                this.$ = ShapePathAst_1.t_attribute.id;
                break;
            case 92:
                this.$ = ShapePathAst_1.t_attribute.semActs;
                break;
            case 93:
                this.$ = ShapePathAst_1.t_attribute.annotations;
                break;
            case 94:
                this.$ = ShapePathAst_1.t_attribute.predicate;
                break;
            case 101:
                this.$ = ShapePathAst_1.t_schemaAttr.atContext;
                break;
            case 102:
                this.$ = ShapePathAst_1.t_schemaAttr.startActs;
                break;
            case 103:
                this.$ = ShapePathAst_1.t_schemaAttr.start;
                break;
            case 104:
                this.$ = ShapePathAst_1.t_schemaAttr.imports;
                break;
            case 105:
                this.$ = ShapePathAst_1.t_schemaAttr.shapes;
                break;
            case 106:
                this.$ = ShapePathAst_1.t_shapeExprAttr.shapeExprs;
                break;
            case 107:
                this.$ = ShapePathAst_1.t_shapeExprAttr.shapeExpr;
                break;
            case 110:
                this.$ = ShapePathAst_1.t_nodeConstraintAttr.nodeKind;
                break;
            case 111:
                this.$ = ShapePathAst_1.t_nodeConstraintAttr.datatype;
                break;
            case 113:
                this.$ = ShapePathAst_1.t_nodeConstraintAttr.values;
                break;
            case 116:
                this.$ = ShapePathAst_1.t_stringFacetAttr.length;
                break;
            case 117:
                this.$ = ShapePathAst_1.t_stringFacetAttr.minlength;
                break;
            case 118:
                this.$ = ShapePathAst_1.t_stringFacetAttr.maxlength;
                break;
            case 119:
                this.$ = ShapePathAst_1.t_stringFacetAttr.pattern;
                break;
            case 120:
                this.$ = ShapePathAst_1.t_stringFacetAttr.flags;
                break;
            case 121:
                this.$ = ShapePathAst_1.t_numericFacetAttr.mininclusive;
                break;
            case 122:
                this.$ = ShapePathAst_1.t_numericFacetAttr.minexclusive;
                break;
            case 123:
                this.$ = ShapePathAst_1.t_numericFacetAttr.maxinclusive;
                break;
            case 124:
                this.$ = ShapePathAst_1.t_numericFacetAttr.maxexclusive;
                break;
            case 125:
                this.$ = ShapePathAst_1.t_numericFacetAttr.totaldigits;
                break;
            case 126:
                this.$ = ShapePathAst_1.t_numericFacetAttr.fractiondigits;
                break;
            case 127:
                this.$ = ShapePathAst_1.t_valueSetValueAttr.value;
                break;
            case 128:
                this.$ = ShapePathAst_1.t_valueSetValueAttr.language;
                break;
            case 129:
                this.$ = ShapePathAst_1.t_valueSetValueAttr.stem;
                break;
            case 130:
                this.$ = ShapePathAst_1.t_valueSetValueAttr.exclusions;
                break;
            case 131:
                this.$ = ShapePathAst_1.t_valueSetValueAttr.languageTag;
                break;
            case 132:
                this.$ = ShapePathAst_1.t_shapeAttr.closed;
                break;
            case 133:
                this.$ = ShapePathAst_1.t_shapeAttr.extra;
                break;
            case 134:
                this.$ = ShapePathAst_1.t_shapeAttr.expression;
                break;
            case 135:
                this.$ = ShapePathAst_1.t_tripleExprAttr.expressions;
                break;
            case 136:
                this.$ = ShapePathAst_1.t_tripleExprAttr.min;
                break;
            case 137:
                this.$ = ShapePathAst_1.t_tripleExprAttr.max;
                break;
            case 139:
                this.$ = ShapePathAst_1.t_tripleConstraintAttr.inverse;
                break;
            case 140:
                this.$ = ShapePathAst_1.t_tripleConstraintAttr.valueExpr;
                break;
            case 141:
                this.$ = ShapePathAst_1.t_semActAttr.name;
                break;
            case 142:
                this.$ = ShapePathAst_1.t_semActAttr.code;
                break;
            case 143:
                this.$ = ShapePathAst_1.t_annotationAttr.object;
                break;
            case 144:
                this.$ = newIri(new URL($$[$0].substr(1, $$[$0].length - 2), yy.base).href);
                break;
            case 146:
            case 147:
                this.$ = pnameToUrl($$[$0], yy);
                break;
        }
    }
}
exports.ShapePathParser = ShapePathParser;
/* generated by ts-jison-lex 0.3.0 */
const lexer_1 = require("@ts-jison/lexer");
class ShapePathLexer extends lexer_1.JisonLexer {
    options = { "moduleName": "ShapePath" };
    constructor(yy = {}) {
        super(yy);
    }
    rules = [/^(?:\s+|(#[^\u000a\u000d]*|<!--([^-]|-[^-]|--[^>])*-->))/, /^(?:([Uu][Nn][Ii][Oo][Nn]))/, /^(?:([Ii][Nn][Tt][Ee][Rr][Ss][Ee][Cc][Tt][Ii][Oo][Nn]))/, /^(?:([Aa][Ss][Ss][Ee][Rr][Tt]))/, /^(?:child::)/, /^(?:thisShapeExpr::)/, /^(?:thisTripleExpr::)/, /^(?:self::)/, /^(?:parent::)/, /^(?:ancestor::)/, /^(?:index\b)/, /^(?:count\b)/, /^(?:foo1\b)/, /^(?:foo2\b)/, /^(?:Schema\b)/, /^(?:SemAct\b)/, /^(?:Annotation\b)/, /^(?:ShapeAnd\b)/, /^(?:ShapeOr\b)/, /^(?:ShapeNot\b)/, /^(?:NodeConstraint\b)/, /^(?:Shape\b)/, /^(?:ShapeExternal\b)/, /^(?:EachOf\b)/, /^(?:OneOf\b)/, /^(?:TripleConstraint\b)/, /^(?:IriStem\b)/, /^(?:IriStemRange\b)/, /^(?:LiteralStem\b)/, /^(?:LiteralStemRange\b)/, /^(?:Language\b)/, /^(?:LanguageStem\b)/, /^(?:LanguageStemRange\b)/, /^(?:Wildcard\b)/, /^(?:type\b)/, /^(?:id\b)/, /^(?:semActs\b)/, /^(?:annotations\b)/, /^(?:predicate\b)/, /^(?:@context\b)/, /^(?:startActs\b)/, /^(?:start\b)/, /^(?:imports\b)/, /^(?:shapes\b)/, /^(?:shapeExprs\b)/, /^(?:shapeExpr\b)/, /^(?:nodeKind\b)/, /^(?:datatype\b)/, /^(?:values\b)/, /^(?:length\b)/, /^(?:minlength\b)/, /^(?:maxlength\b)/, /^(?:pattern\b)/, /^(?:flags\b)/, /^(?:mininclusive\b)/, /^(?:minexclusive\b)/, /^(?:maxinclusive\b)/, /^(?:maxexclusive\b)/, /^(?:totaldigits\b)/, /^(?:fractiondigits\b)/, /^(?:value\b)/, /^(?:language\b)/, /^(?:stem\b)/, /^(?:exclusions\b)/, /^(?:languageTag\b)/, /^(?:closed\b)/, /^(?:extra\b)/, /^(?:expression\b)/, /^(?:expressions\b)/, /^(?:min\b)/, /^(?:max\b)/, /^(?:inverse\b)/, /^(?:valueExpr\b)/, /^(?:name\b)/, /^(?:code\b)/, /^(?:object\b)/, /^(?:(<([^\u0000-\u0020<>\"{}|^`\\]|(\\u([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])|\\U([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])))*>))/, /^(?:(((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])((((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.)*((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040]))?)?:)(((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|:|[0-9]|((%([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f]))|(\\(_|~|\.|-|!|\$|&|'|\(|\)|\*|\+|,|;|=|\/|\?|#|@|%))))(((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.|:|((%([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f]))|(\\(_|~|\.|-|!|\$|&|'|\(|\)|\*|\+|,|;|=|\/|\?|#|@|%))))*)))/, /^(?:((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])((((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.)*((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040]))?)?:))/, /^(?:(([+-])?([0-9])+))/, /^(?:,)/, /^(?:@)/, /^(?:~)/, /^(?:\*)/, /^(?:\()/, /^(?:\))/, /^(?:\[)/, /^(?:\])/, /^(?:\/\/)/, /^(?:\/)/, /^(?:=)/, /^(?:<)/, /^(?:>)/, /^(?:[a-zA-Z0-9_-]+)/, /^(?:.)/, /^(?:$)/];
    conditions = { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95], "inclusive": true } };
    performAction(yy, yy_, $avoiding_name_collisions, YY_START) {
        var YYSTATE = YY_START;
        switch ($avoiding_name_collisions) {
            case 0: /*skip*/
                break;
            case 1: return 13;
            case 2: return 17;
            case 3: return 55;
            case 4: return 39;
            case 5: return 41;
            case 6: return 42;
            case 7: return 43;
            case 8: return 44;
            case 9: return 45;
            case 10: return 57;
            case 11: return 58;
            case 12: return 59;
            case 13: return 60;
            case 14: return 71;
            case 15: return 72;
            case 16: return 73;
            case 17: return 74;
            case 18: return 75;
            case 19: return 76;
            case 20: return 77;
            case 21: return 78;
            case 22: return 79;
            case 23: return 80;
            case 24: return 81;
            case 25: return 82;
            case 26: return 83;
            case 27: return 84;
            case 28: return 85;
            case 29: return 86;
            case 30: return 87;
            case 31: return 88;
            case 32: return 89;
            case 33: return 90;
            case 34: return 91;
            case 35: return 92;
            case 36: return 93;
            case 37: return 94;
            case 38: return 95;
            case 39: return 102;
            case 40: return 103;
            case 41: return 104;
            case 42: return 105;
            case 43: return 106;
            case 44: return 107;
            case 45: return 108;
            case 46: return 111;
            case 47: return 112;
            case 48: return 114;
            case 49: return 117;
            case 50: return 118;
            case 51: return 119;
            case 52: return 120;
            case 53: return 121;
            case 54: return 122;
            case 55: return 123;
            case 56: return 124;
            case 57: return 125;
            case 58: return 126;
            case 59: return 127;
            case 60: return 128;
            case 61: return 129;
            case 62: return 130;
            case 63: return 131;
            case 64: return 132;
            case 65: return 133;
            case 66: return 134;
            case 67: return 135;
            case 68: return 136;
            case 69: return 137;
            case 70: return 138;
            case 71: return 140;
            case 72: return 141;
            case 73: return 142;
            case 74: return 143;
            case 75: return 144;
            case 76: return 145;
            case 77: return 147;
            case 78: return 148;
            case 79: return 62;
            case 80: return 9;
            case 81: return 29;
            case 82: return 30;
            case 83: return 46;
            case 84: return 37;
            case 85: return 38;
            case 86: return 48;
            case 87: return 50;
            case 88: return 26;
            case 89: return 25;
            case 90: return 65;
            case 91: return 66;
            case 92: return 67;
            case 93: return 'unexpected word "' + yy_.yytext + '"';
            case 94: return 'invalid character ' + yy_.yytext;
            case 95: return 5;
        }
    }
}
exports.ShapePathLexer = ShapePathLexer;
//# sourceMappingURL=ShapePathParser.js.map