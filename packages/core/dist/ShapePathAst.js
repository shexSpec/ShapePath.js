"use strict";
/** ShapePath types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.t_annotationAttr = exports.t_semActAttr = exports.t_tripleConstraintAttr = exports.t_tripleExprAttr = exports.t_shapeAttr = exports.t_valueSetValueAttr = exports.t_numericFacetAttr = exports.t_stringFacetAttr = exports.t_xsFacetAttr = exports.t_nodeConstraintAttr = exports.t_shapeExprAttr = exports.t_schemaAttr = exports.t_attribute = exports.t_valueType = exports.t_tripleExprType = exports.t_shapeExprType = exports.t_termType = exports.Assertion = exports.Filter = exports.FuncName = exports.Function = exports.Axis = exports.PathExprStep = exports.AxisStep = exports.ChildStep = exports.Step = exports.Path = exports.Intersection = exports.Union = exports.Sequence = exports.Junction = exports.PathExpr = exports.EvalContext = exports.Serializable = void 0;
class Serializable {
}
exports.Serializable = Serializable;
class EvalContext {
    schema;
    constructor(schema) {
        this.schema = schema;
    }
    // lazy eval of parents
    parents = null;
    getParents() {
        if (this.parents === null) {
            this.parents = new Map();
            populateParents(this.parents, this.schema, null);
        }
        return this.parents;
        function populateParents(parents, node, parent) {
            parents.set(node, parent);
            if (typeof node === 'object')
                Object.values(node).forEach(n2 => populateParents(parents, n2, node));
        }
    }
}
exports.EvalContext = EvalContext;
/* class hierarchy
 *   Serializable
 *     PathExpr
 *       Junction
 *         Sequence
 *         Union
 *         Intersection
 *       Path
 *     Step
 *       UnitStep
 *       PathExprStep
 *     Function
 *       Filter
 *       Assertion
 */
class PathExpr extends Serializable {
}
exports.PathExpr = PathExpr;
class Junction extends PathExpr {
    exprs;
    constructor(exprs) {
        super();
        this.exprs = exprs;
    }
}
exports.Junction = Junction;
class Sequence extends Junction {
    t = "Sequence";
    evalPathExpr(nodes, ctx) {
        return this.exprs.reduce((ret, expr) => ret.concat(expr.evalPathExpr(nodes, ctx)), []);
    }
}
exports.Sequence = Sequence;
class Union extends Junction {
    t = "Union";
    evalPathExpr(nodes, ctx) {
        const seen = [];
        return this.exprs.reduce((ret, expr) => {
            const res = expr.evalPathExpr(nodes, ctx);
            res.forEach((elt) => {
                const str = JSON.stringify(elt);
                if (seen.indexOf(str) !== -1)
                    return ret;
                ret.push(elt);
                seen.push(str);
            });
            return ret;
        }, []);
    }
}
exports.Union = Union;
class Intersection extends Junction {
    t = "Intersection";
    evalPathExpr(nodes, ctx) {
        const [first, ...rest] = this.exprs;
        const firstRes = first.evalPathExpr(nodes, ctx);
        let seen = new Map();
        firstRes.forEach((elt) => {
            const str = JSON.stringify(elt);
            if (!(seen.has(str)))
                seen.set(str, elt);
        });
        return rest.reduce((ret, expr) => {
            const res = expr.evalPathExpr(nodes, ctx);
            let next = new Map();
            res.forEach((elt) => {
                const str = JSON.stringify(elt);
                if (seen.has(str) && !(next.has(str)))
                    next.set(str, elt);
            });
            seen = next;
            return ret;
        }, firstRes);
    }
}
exports.Intersection = Intersection;
class Path extends PathExpr {
    steps;
    t = 'Path';
    constructor(steps) {
        super();
        this.steps = steps;
    }
    evalPathExpr(nodes, ctx) {
        return this.steps.reduce((ret, step) => {
            return step.evalStep(ret, ctx);
        }, nodes);
    }
}
exports.Path = Path;
class Step extends Serializable {
}
exports.Step = Step;
class ChildStep extends Step {
    attribute;
    filters;
    t = 'ChildStep';
    constructor(attribute, filters) {
        super();
        this.attribute = attribute;
        this.filters = filters;
    }
    evalStep(nodes, ctx) {
        const selectedNodes = nodes.reduce((ret, node) => {
            let match = [];
            if (node instanceof Array && this.attribute === t_attribute.Any) {
                match = node;
            }
            else if (node instanceof Object) {
                if (this.attribute === t_attribute.Any) {
                    match = Object.values(node);
                }
                else {
                    const key = this.attribute.toString();
                    if (key in node)
                        match = [node[key]];
                }
            }
            return ret.concat(match);
        }, []);
        return (this.filters || []).reduce(// For each filter,
        (filteredNodes, f) => filteredNodes.filter(// trim NodeSet to nodes passing filter.
        (node, idx) => // (Aggregates need access to current node list.)
         ebv(f.evalFunction(node, filteredNodes, idx, ctx)) === Pass), selectedNodes // Start filter walk from selected nodes.
        );
    }
}
exports.ChildStep = ChildStep;
class AxisStep extends Step {
    axis;
    filters;
    t = 'AxisStep';
    constructor(axis, filters) {
        super();
        this.axis = axis;
        this.filters = filters;
    }
    evalStep(nodes, ctx) {
        const selectedNodes = nodes.reduce((ret, node) => {
            let match = [];
            switch (this.axis) {
                case Axis.self:
                    match = [node];
                    break;
                case Axis.thisShapeExpr:
                    match = walkShapeExpr(node);
                    break;
                case Axis.thisTripleExpr:
                    match = walkTripleExpr(node);
                    break;
                case Axis.parent:
                    {
                        const parentMap = ctx.getParents();
                        const parent = parentMap.get(node);
                        match = parent ? [parent] : [];
                    }
                    break;
                case Axis.ancestor:
                    const parentMap = ctx.getParents();
                    match = walkParents(parentMap, node);
                    break;
            }
            return ret.concat(match);
        }, []);
        return (this.filters || []).reduce(// For each filter,
        (filteredNodes, f) => filteredNodes.filter(// trim NodeSet to nodes passing filter.
        (node, idx) => // (Aggregates need access to current node list.)
         ebv(f.evalFunction(node, filteredNodes, idx, ctx)) === Pass), selectedNodes // Start filter walk from selected nodes.
        );
        function walkParents(parentMap, node) {
            const parent = parentMap.get(node);
            if (parent === undefined)
                throw Error(`Should not arrive here: parentMap.get(${node})`);
            if (parent === null) // top of the hieararchy
                return [];
            return [parent].concat(walkParents(parentMap, parent));
        }
        function walkShapeExpr(node) {
            if (node instanceof Array)
                return node.reduce((ret, n2) => ret.concat(walkShapeExpr(n2)), []);
            if (!(node instanceof Object))
                return [];
            switch (node.type) {
                case "ShapeDecl":
                    return walkShapeExpr(node.shapeExpr);
                case "ShapeAnd":
                case "ShapeOr":
                    return [node].concat(walkShapeExpr(node.shapeExprs));
                case "ShapeNot":
                    return [node].concat(walkShapeExpr(node.shapeExpr));
                case "Shape":
                case "NodeConstraint":
                    return [node];
                default: return [];
            }
        }
        function walkTripleExpr(node) {
            if (node instanceof Array)
                return node.reduce((ret, n2) => ret.concat(walkTripleExpr(n2)), []);
            if (!(node instanceof Object))
                return [];
            switch (node.type) {
                case "EachOf":
                case "OneOf":
                    return [node].concat(walkTripleExpr(node.expressions));
                case "TripleConstraint":
                    return [node];
                default: return [];
            }
        }
    }
}
exports.AxisStep = AxisStep;
class PathExprStep extends Step {
    pathExpr;
    filters;
    t = 'PathExprStep';
    constructor(pathExpr, filters) {
        super();
        this.pathExpr = pathExpr;
        this.filters = filters;
    }
    evalStep(nodes, ctx) {
        throw Error('PatheExprStep.evalStep not yet implemented');
    }
}
exports.PathExprStep = PathExprStep;
var Axis;
(function (Axis) {
    Axis["child"] = "child::";
    Axis["thisShapeExpr"] = "thisShapeExpr::";
    Axis["thisTripleExpr"] = "thisTripleExpr::";
    Axis["self"] = "self::";
    Axis["parent"] = "parent::";
    Axis["ancestor"] = "ancestor::";
})(Axis = exports.Axis || (exports.Axis = {}));
class Function extends Serializable {
}
exports.Function = Function;
var FuncName;
(function (FuncName) {
    FuncName["index"] = "index";
    FuncName["count"] = "count";
    FuncName["ebv"] = "ebv";
    // operators
    FuncName["equal"] = "equal";
    FuncName["lessThan"] = "lessThan";
    FuncName["greaterThan"] = "greaterThan";
})(FuncName = exports.FuncName || (exports.FuncName = {}));
class Filter extends Function {
    op;
    args;
    t = 'Filter';
    constructor(op, args) {
        super();
        this.op = op;
        this.args = args;
    }
    isAggregate() { return [FuncName.index, FuncName.count, FuncName.ebv].indexOf(this.op) !== -1; }
    evalFunction(node, allNodes, idx, ctx) {
        // !! separate aggregates in the grammar
        if (this.isAggregate()) {
            switch (this.op) {
                case FuncName.index:
                    return [idx];
                case FuncName.count:
                    return [allNodes.length];
                case FuncName.ebv:
                    return ebv(allNodes);
                default:
                    throw Error(`Not Implemented: Filter ${this.op} ${this.args}`);
            }
        }
        else {
            const args = evalArgs(this.args, node, allNodes);
            switch (this.op) {
                case FuncName.equal:
                    const [l, r] = args;
                    if (l === r || sameJsonldString(l, r)) // (number, numper), (Iri, Iri), (Object, Object)
                        return [node];
                    // if (l instanceof Iri && r instanceof Iri && l.toJSON() === r.toJSON()) // (number, numper), (Iri, Iri), (Object, Object)
                    //   return [node]
                    break;
                case FuncName.lessThan:
                case FuncName.greaterThan:
                    break;
                default:
                    throw Error(`Not Implemented: Filter ${this.op} ${this.args}`);
            }
            return [];
        }
        function evalArgs(args, node, allNodes) {
            return args.map((arg, idx) => {
                if (typeof arg === 'number' || typeof arg === 'string' /* || arg instanceof Iri */)
                    return arg;
                if (arg instanceof Function)
                    return arg.evalFunction(node, allNodes, idx, ctx)[0];
                if (arg instanceof PathExpr)
                    return arg.evalPathExpr([node], ctx)[0];
            }, []);
        }
    }
}
exports.Filter = Filter;
function sameJsonldString(l, r) {
    return isPlainObject(l) && isPlainObject(r)
        // test as ShExJ.ObjectLiteral
        && l.value === r.value
        && l.language === r.language
        && l.type === r.type;
    function isPlainObject(value) {
        return value instanceof Object &&
            Object.getPrototypeOf(value) == Object.prototype;
    }
}
const Pass = [true];
const Fail = [false];
function ebv(nodes) {
    if (nodes.length > 1)
        return Pass;
    if (nodes.length === 0)
        return Fail;
    if (typeof nodes[0] === 'number')
        return nodes[0] === 0 ? Fail : Pass;
    if (typeof nodes[0] === 'string')
        return nodes[0].length === 0 ? Fail : Pass;
    return Pass;
}
class Assertion extends Function {
    expect;
    t = 'Assertion';
    constructor(expect) {
        super();
        this.expect = expect;
    }
    evalFunction(node, allNodes, idx, ctx) {
        const val = this.expect.evalFunction(node, allNodes, idx, ctx);
        if (ebv(val) !== Pass)
            throw Error(`failed assertion: ebv(${JSON.stringify(val)}) !== ${JSON.stringify(Pass)} in ${JSON.stringify(this)} on ${JSON.stringify(node)} /  ${JSON.stringify(allNodes)}`);
        return Pass;
    }
}
exports.Assertion = Assertion;
var t_termType;
(function (t_termType) {
    t_termType["Schema"] = "Schema";
    t_termType["SemAct"] = "SemAct";
    t_termType["Annotation"] = "Annotation";
})(t_termType = exports.t_termType || (exports.t_termType = {}));
var t_shapeExprType;
(function (t_shapeExprType) {
    t_shapeExprType["ShapeAnd"] = "ShapeAnd";
    t_shapeExprType["ShapeOr"] = "ShapeOr";
    t_shapeExprType["ShapeNot"] = "ShapeNot";
    t_shapeExprType["NodeConstraint"] = "NodeConstraint";
    t_shapeExprType["Shape"] = "Shape";
    t_shapeExprType["ShapeExternal"] = "ShapeExternal";
})(t_shapeExprType = exports.t_shapeExprType || (exports.t_shapeExprType = {}));
var t_tripleExprType;
(function (t_tripleExprType) {
    t_tripleExprType["EachOf"] = "EachOf";
    t_tripleExprType["OneOf"] = "OneOf";
    t_tripleExprType["TripleConstraint"] = "TripleConstraint";
})(t_tripleExprType = exports.t_tripleExprType || (exports.t_tripleExprType = {}));
var t_valueType;
(function (t_valueType) {
    t_valueType["IriStem"] = "IriStem";
    t_valueType["IriStemRange"] = "IriStemRange";
    t_valueType["LiteralStem"] = "LiteralStem";
    t_valueType["LiteralStemRange"] = "LiteralStemRange";
    t_valueType["Language"] = "Language";
    t_valueType["LanguageStem"] = "LanguageStem";
    t_valueType["LanguageStemRange"] = "LanguageStemRange";
    t_valueType["Wildcard"] = "Wildcard";
})(t_valueType = exports.t_valueType || (exports.t_valueType = {}));
var t_attribute;
(function (t_attribute) {
    t_attribute["Any"] = "*";
    t_attribute["type"] = "type";
    t_attribute["id"] = "id";
    t_attribute["semActs"] = "semActs";
    t_attribute["annotations"] = "annotations";
    t_attribute["predicate"] = "predicate";
})(t_attribute = exports.t_attribute || (exports.t_attribute = {}));
var t_schemaAttr;
(function (t_schemaAttr) {
    t_schemaAttr["atContext"] = "@context";
    t_schemaAttr["startActs"] = "startActs";
    t_schemaAttr["start"] = "start";
    t_schemaAttr["imports"] = "imports";
    t_schemaAttr["shapes"] = "shapes";
})(t_schemaAttr = exports.t_schemaAttr || (exports.t_schemaAttr = {}));
var t_shapeExprAttr;
(function (t_shapeExprAttr) {
    t_shapeExprAttr["shapeExprs"] = "shapeExprs";
    t_shapeExprAttr["shapeExpr"] = "shapeExpr";
})(t_shapeExprAttr = exports.t_shapeExprAttr || (exports.t_shapeExprAttr = {}));
var t_nodeConstraintAttr;
(function (t_nodeConstraintAttr) {
    t_nodeConstraintAttr["nodeKind"] = "nodeKind";
    t_nodeConstraintAttr["datatype"] = "datatype";
    t_nodeConstraintAttr["values"] = "values";
})(t_nodeConstraintAttr = exports.t_nodeConstraintAttr || (exports.t_nodeConstraintAttr = {}));
var t_xsFacetAttr;
(function (t_xsFacetAttr) {
})(t_xsFacetAttr = exports.t_xsFacetAttr || (exports.t_xsFacetAttr = {}));
var t_stringFacetAttr;
(function (t_stringFacetAttr) {
    t_stringFacetAttr["length"] = "length";
    t_stringFacetAttr["minlength"] = "minlength";
    t_stringFacetAttr["maxlength"] = "maxlength";
    t_stringFacetAttr["pattern"] = "pattern";
    t_stringFacetAttr["flags"] = "flags";
})(t_stringFacetAttr = exports.t_stringFacetAttr || (exports.t_stringFacetAttr = {}));
var t_numericFacetAttr;
(function (t_numericFacetAttr) {
    t_numericFacetAttr["mininclusive"] = "mininclusive";
    t_numericFacetAttr["minexclusive"] = "minexclusive";
    t_numericFacetAttr["maxinclusive"] = "maxinclusive";
    t_numericFacetAttr["maxexclusive"] = "maxexclusive";
    t_numericFacetAttr["totaldigits"] = "totaldigits";
    t_numericFacetAttr["fractiondigits"] = "fractiondigits";
})(t_numericFacetAttr = exports.t_numericFacetAttr || (exports.t_numericFacetAttr = {}));
var t_valueSetValueAttr;
(function (t_valueSetValueAttr) {
    t_valueSetValueAttr["value"] = "value";
    t_valueSetValueAttr["language"] = "language";
    t_valueSetValueAttr["stem"] = "stem";
    t_valueSetValueAttr["exclusions"] = "exclusions";
    t_valueSetValueAttr["languageTag"] = "languageTag";
})(t_valueSetValueAttr = exports.t_valueSetValueAttr || (exports.t_valueSetValueAttr = {}));
var t_shapeAttr;
(function (t_shapeAttr) {
    t_shapeAttr["closed"] = "closed";
    t_shapeAttr["extra"] = "extra";
    t_shapeAttr["expression"] = "expression";
})(t_shapeAttr = exports.t_shapeAttr || (exports.t_shapeAttr = {}));
var t_tripleExprAttr;
(function (t_tripleExprAttr) {
    t_tripleExprAttr["expressions"] = "expressions";
    t_tripleExprAttr["min"] = "min";
    t_tripleExprAttr["max"] = "max";
})(t_tripleExprAttr = exports.t_tripleExprAttr || (exports.t_tripleExprAttr = {}));
var t_tripleConstraintAttr;
(function (t_tripleConstraintAttr) {
    t_tripleConstraintAttr["inverse"] = "inverse";
    t_tripleConstraintAttr["valueExpr"] = "valueExpr";
})(t_tripleConstraintAttr = exports.t_tripleConstraintAttr || (exports.t_tripleConstraintAttr = {}));
var t_semActAttr;
(function (t_semActAttr) {
    t_semActAttr["name"] = "name";
    t_semActAttr["code"] = "code";
})(t_semActAttr = exports.t_semActAttr || (exports.t_semActAttr = {}));
var t_annotationAttr;
(function (t_annotationAttr) {
    t_annotationAttr["object"] = "object";
})(t_annotationAttr = exports.t_annotationAttr || (exports.t_annotationAttr = {}));
//# sourceMappingURL=ShapePathAst.js.map
