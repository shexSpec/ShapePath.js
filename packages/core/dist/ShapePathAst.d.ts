/** ShapePath types
 */
import * as ShExJ from 'shexj';
export declare type SchemaNode = ShExJ.Schema | ShExJ.ShapeDecl | ShExJ.shapeExpr | ShExJ.ShapeOr | ShExJ.ShapeAnd | ShExJ.ShapeNot | ShExJ.ShapeExternal | ShExJ.shapeExprRef | ShExJ.shapeExprLabel | ShExJ.NodeConstraint | ShExJ.xsFacet | ShExJ.stringFacet | ShExJ.numericFacet | ShExJ.numericLiteral | ShExJ.valueSetValue | ShExJ.objectValue | ShExJ.ObjectLiteral | ShExJ.IriStem | ShExJ.IriStemRange | ShExJ.LiteralStem | ShExJ.LiteralStemRange | ShExJ.Language | ShExJ.LanguageStem | ShExJ.LanguageStemRange | ShExJ.Wildcard | ShExJ.Shape | ShExJ.tripleExpr | ShExJ.tripleExprBase | ShExJ.EachOf | ShExJ.OneOf | ShExJ.TripleConstraint | ShExJ.tripleExprRef | ShExJ.tripleExprLabel | ShExJ.SemAct | ShExJ.Annotation | ShExJ.IRIREF | ShExJ.BNODE | ShExJ.INTEGER | ShExJ.STRING | ShExJ.DECIMAL | ShExJ.DOUBLE | ShExJ.LANGTAG | ShExJ.BOOL | ShExJ.IRI;
export declare type NodeSet = Array<SchemaNode>;
export declare abstract class Serializable {
    abstract t: string;
}
declare type ParentMap = Map<SchemaNode, SchemaNode | null>;
export declare class EvalContext {
    schema: ShExJ.Schema;
    constructor(schema: ShExJ.Schema);
    parents: ParentMap | null;
    getParents(): ParentMap;
}
export declare abstract class PathExpr extends Serializable {
    abstract evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare abstract class Junction extends PathExpr {
    exprs: Array<Path | Junction>;
    constructor(exprs: Array<Path | Junction>);
}
export declare class Sequence extends Junction {
    t: string;
    evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare class Union extends Junction {
    t: string;
    evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare class Intersection extends Junction {
    t: string;
    evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare class Path extends PathExpr {
    steps: Step[];
    t: string;
    constructor(steps: Step[]);
    evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare abstract class Step extends Serializable {
    abstract evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare class ChildStep extends Step {
    attribute: Attribute;
    filters?: Function[] | undefined;
    t: string;
    constructor(attribute: Attribute, filters?: Function[] | undefined);
    evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare class AxisStep extends Step {
    axis: Axis;
    filters?: Function[] | undefined;
    t: string;
    constructor(axis: Axis, filters?: Function[] | undefined);
    evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare class PathExprStep extends Step {
    pathExpr: PathExpr;
    filters?: Function[] | undefined;
    t: string;
    constructor(pathExpr: PathExpr, filters?: Function[] | undefined);
    evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet;
}
export declare enum Axis {
    child = "child::",
    thisShapeExpr = "thisShapeExpr::",
    thisTripleExpr = "thisTripleExpr::",
    self = "self::",
    parent = "parent::",
    ancestor = "ancestor::"
}
export declare abstract class Function extends Serializable {
    abstract evalFunction(node: SchemaNode, allNodes: NodeSet, idx: number, ctx: EvalContext): NodeSet;
}
export declare enum FuncName {
    index = "index",
    count = "count",
    ebv = "ebv",
    equal = "equal",
    lessThan = "lessThan",
    greaterThan = "greaterThan"
}
declare type Iri = string;
export declare type FuncArg = Function | PathExpr | termType | Iri | number;
export declare class Filter extends Function {
    op: FuncName;
    args: FuncArg[];
    t: string;
    constructor(op: FuncName, args: FuncArg[]);
    isAggregate(): boolean;
    evalFunction(node: SchemaNode, allNodes: NodeSet, idx: number, ctx: EvalContext): NodeSet;
}
export declare class Assertion extends Function {
    expect: Filter;
    t: string;
    constructor(expect: Filter);
    evalFunction(node: SchemaNode, allNodes: NodeSet, idx: number, ctx: EvalContext): NodeSet;
}
export declare enum t_termType {
    Schema = "Schema",
    ShapeDecl = "ShapeDecl",
    SemAct = "SemAct",
    Annotation = "Annotation"
}
export declare type termType = t_termType | shapeExprType | tripleExprType | valueType;
export declare enum t_shapeDeclAttr {
    abstract = "abstract",
    shapeExpr = "shapeExpr"
}
export declare type shapeDeclAttr = t_shapeDeclAttr;
export declare enum t_shapeExprType {
    ShapeAnd = "ShapeAnd",
    ShapeOr = "ShapeOr",
    ShapeNot = "ShapeNot",
    NodeConstraint = "NodeConstraint",
    Shape = "Shape",
    ShapeExternal = "ShapeExternal"
}
export declare type shapeExprType = t_shapeExprType;
export declare enum t_tripleExprType {
    EachOf = "EachOf",
    OneOf = "OneOf",
    TripleConstraint = "TripleConstraint"
}
export declare type tripleExprType = t_tripleExprType;
export declare enum t_valueType {
    IriStem = "IriStem",
    IriStemRange = "IriStemRange",
    LiteralStem = "LiteralStem",
    LiteralStemRange = "LiteralStemRange",
    Language = "Language",
    LanguageStem = "LanguageStem",
    LanguageStemRange = "LanguageStemRange",
    Wildcard = "Wildcard"
}
export declare type valueType = t_valueType;
export declare enum t_attribute {
    Any = "*",
    type = "type",
    id = "id",
    semActs = "semActs",
    annotations = "annotations",
    predicate = "predicate"
}
export declare type Attribute = t_attribute | schemaAttr | shapeDeclAttr | shapeExprAttr | tripleExprAttr | valueSetValueAttr | semActAttr | annotationAttr;
export declare enum t_schemaAttr {
    atContext = "@context",
    startActs = "startActs",
    start = "start",
    imports = "imports",
    shapes = "shapes"
}
export declare type schemaAttr = t_schemaAttr;
export declare enum t_shapeExprAttr {
    shapeExprs = "shapeExprs",
    shapeExpr = "shapeExpr"
}
export declare type shapeExprAttr = t_shapeExprAttr | nodeConstraintAttr | shapeAttr;
export declare enum t_nodeConstraintAttr {
    nodeKind = "nodeKind",
    datatype = "datatype",
    values = "values"
}
export declare type nodeConstraintAttr = t_nodeConstraintAttr | xsFacetAttr;
export declare enum t_xsFacetAttr {
}
export declare type xsFacetAttr = t_xsFacetAttr | stringFacetAttr | numericFacetAttr;
export declare enum t_stringFacetAttr {
    length = "length",
    minlength = "minlength",
    maxlength = "maxlength",
    pattern = "pattern",
    flags = "flags"
}
export declare type stringFacetAttr = t_stringFacetAttr;
export declare enum t_numericFacetAttr {
    mininclusive = "mininclusive",
    minexclusive = "minexclusive",
    maxinclusive = "maxinclusive",
    maxexclusive = "maxexclusive",
    totaldigits = "totaldigits",
    fractiondigits = "fractiondigits"
}
export declare type numericFacetAttr = t_numericFacetAttr;
export declare enum t_valueSetValueAttr {
    value = "value",
    language = "language",
    stem = "stem",
    exclusions = "exclusions",
    languageTag = "languageTag"
}
export declare type valueSetValueAttr = t_valueSetValueAttr;
export declare enum t_shapeAttr {
    closed = "closed",
    extra = "extra",
    expression = "expression"
}
export declare type shapeAttr = t_shapeAttr;
export declare enum t_tripleExprAttr {
    expressions = "expressions",
    min = "min",
    max = "max"
}
export declare type tripleExprAttr = t_tripleExprAttr | tripleConstraintAttr;
export declare enum t_tripleConstraintAttr {
    inverse = "inverse",
    valueExpr = "valueExpr"
}
export declare type tripleConstraintAttr = t_tripleConstraintAttr;
export declare enum t_semActAttr {
    name = "name",
    code = "code"
}
export declare type semActAttr = t_semActAttr;
export declare enum t_annotationAttr {
    object = "object"
}
export declare type annotationAttr = t_annotationAttr;
export {};
//# sourceMappingURL=ShapePathAst.d.ts.map