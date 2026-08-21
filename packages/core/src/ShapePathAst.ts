/** ShapePath types
 */

import * as ShExJ from 'shexj';

export type SchemaNode = ShExJ.Schema
  | ShExJ.ShapeDecl
  | ShExJ.shapeExpr
  | ShExJ.ShapeOr
  | ShExJ.ShapeAnd
  | ShExJ.ShapeNot
  | ShExJ.ShapeExternal
  | ShExJ.shapeDeclRef
  | ShExJ.shapeDeclLabel
  | ShExJ.NodeConstraint
  | ShExJ.xsFacets
  | ShExJ.stringFacets
  | ShExJ.numericFacets
  | ShExJ.numericLiteral
  | ShExJ.valueSetValue
  | ShExJ.objectValue
  | ShExJ.ObjectLiteral
  | ShExJ.IriStem
  | ShExJ.IriStemRange
  | ShExJ.LiteralStem
  | ShExJ.LiteralStemRange
  | ShExJ.Language
  | ShExJ.LanguageStem
  | ShExJ.LanguageStemRange
  | ShExJ.Wildcard
  | ShExJ.Shape
  | ShExJ.tripleExpr
  | ShExJ.tripleExprBase
  | ShExJ.EachOf
  | ShExJ.OneOf
  | ShExJ.TripleConstraint
  | ShExJ.tripleExprRef
  | ShExJ.tripleExprLabel
  | ShExJ.SemAct
  | ShExJ.Annotation
  | ShExJ.IRIREF
  | ShExJ.BNODE
  | ShExJ.INTEGER
  | ShExJ.STRING
  | ShExJ.DECIMAL
  | ShExJ.DOUBLE
  | ShExJ.LANGTAG
  | ShExJ.BOOL
  | ShExJ.IRI

export type NodeSet = Array<SchemaNode>

export abstract class Serializable {
  abstract t: string
}

type ParentMap = Map<SchemaNode, SchemaNode | null>
export class EvalContext {
  constructor(
    public schema: ShExJ.Schema,
  ) { }

  // lazy eval of parents
  parents: ParentMap | null = null
  getParents(): ParentMap {
    if (this.parents === null) {
      this.parents = new Map()
      populateParents(this.parents, this.schema, null)
    }
    return this.parents

    function populateParents(parents: ParentMap, node: SchemaNode, parent: SchemaNode | null) {
      parents.set(node, parent)
      if (typeof node === 'object')
        Object.values(node).forEach(n2 => populateParents(parents, n2, node))
    }
  }
}

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

export abstract class PathExpr extends Serializable {
  abstract evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet
}

export abstract class Junction extends PathExpr {
  constructor(
    public exprs: Array<Path | Junction>
  ) {
    super()
  }
}

export class Sequence extends Junction {
  t = "Sequence"
  evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet {
    return this.exprs.reduce(
      (ret, expr) => ret.concat(expr.evalPathExpr(nodes, ctx))
      , [] as NodeSet
    )
  }
}

export class Union extends Junction {
  t = "Union"
  evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet {
    const seen: string[] = []
    return this.exprs.reduce(
      (ret, expr) => {
        const res = expr.evalPathExpr(nodes, ctx)
        res.forEach((elt) => {
          const str = JSON.stringify(elt)
          if (seen.indexOf(str) !== -1)
            return ret
          ret.push(elt)
          seen.push(str)
        })
        return ret
      }, [] as NodeSet
    )
  }
}

export class Intersection extends Junction {
  t = "Intersection"
  evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet {
    const [first, ...rest] = this.exprs
    const firstRes = first.evalPathExpr(nodes, ctx)
    let seen: Map<string, SchemaNode> = new Map()
    firstRes.forEach((elt) => {
      const str = JSON.stringify(elt)
      if (!(seen.has(str)))
        seen.set(str, elt)
    })
    return rest.reduce(
      (ret, expr) => {
        const res = expr.evalPathExpr(nodes, ctx)
        let next: Map<string, SchemaNode> = new Map()
        res.forEach((elt) => {
          const str = JSON.stringify(elt)
          if (seen.has(str) && !(next.has(str)))
            next.set(str, elt)
        })
        seen = next
        return ret
      }, firstRes
    )
  }
}

export class Path extends PathExpr {
  t = 'Path'
  constructor(
    public steps: Step[]
  ) {
    super()
  }
  evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet {
    return this.steps.reduce((ret, step): NodeSet => {
      return step.evalStep(ret, ctx)
    }, nodes as NodeSet)
  }
}

export abstract class Step extends Serializable {
  abstract evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet
}

export class ChildStep extends Step {
  t = 'ChildStep'
  constructor(
    public attribute: Attribute,
    public filters?: Function[]
  ) { super() }
  evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet {
    const selectedNodes = nodes.reduce((ret, node) => {
      let match: NodeSet = []
      if (node instanceof Array && this.attribute === t_attribute.Any) {
        match = node
      } else if (node instanceof Object) {
        if (this.attribute === t_attribute.Any) {
          match = Object.values(node)
        } else {
          const key = this.attribute.toString()
          if (key in node)
            match = [(<any>node)[key]]
        }
      }
      return ret.concat(match)
    }, [] as NodeSet)

    return (this.filters || []).reduce( // For each filter,
      (filteredNodes, f) =>
        filteredNodes.filter( // trim NodeSet to nodes passing filter.
          (node: SchemaNode, idx: number) => // (Aggregates need access to current node list.)
            ebv(f.evalFunction(node, filteredNodes, idx, ctx)) === Pass
        )
      , selectedNodes // Start filter walk from selected nodes.
    )
  }
}

export class AxisStep extends Step {
  t = 'AxisStep'
  constructor(
    public axis: Axis,
    public filters?: Function[]
  ) { super() }
  evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet {
    const selectedNodes = nodes.reduce((ret, node) => {
      let match: NodeSet = []
      switch (this.axis) {
        case Axis.self:
          match = [node]
          break
        case Axis.thisShapeExpr:
          match = walkShapeExpr(node)
          break
        case Axis.thisTripleExpr:
          match = walkTripleExpr(node)
          break
        case Axis.parent: {
          const parentMap: ParentMap = ctx.getParents()
          const parent = parentMap.get(node)!
          match = parent ? [parent] : []
        } break
        case Axis.ancestor:
          const parentMap: ParentMap = ctx.getParents()
          match = walkParents(parentMap, node)
          break
        case Axis.descendant:
          match = walkDescendants(node)
          break
      }
      return ret.concat(match)
    }, [] as NodeSet)

    return (this.filters || []).reduce( // For each filter,
      (filteredNodes, f) =>
        filteredNodes.filter( // trim NodeSet to nodes passing filter.
          (node: SchemaNode, idx: number) => // (Aggregates need access to current node list.)
            ebv(f.evalFunction(node, filteredNodes, idx, ctx)) === Pass
        )
      , selectedNodes // Start filter walk from selected nodes.
    )

    function walkParents(parentMap: ParentMap, node: SchemaNode): NodeSet {
      const parent: SchemaNode | undefined | null = parentMap.get(node)
      if (parent === undefined)
        throw Error(`Should not arrive here: parentMap.get(${node})`)
      if (parent === null) // top of the hieararchy
        return []
      return [parent].concat(walkParents(parentMap, parent))
    }

    /**
     * Every node below this one, not including it -- cf. XPath descendant::.
     *
     * A schema in hand is not always a tree: an implementation may hang its
     * own index off it (shex.js parks `_index` on the schema, pointing at
     * the very nodes `shapes` holds), and a subexpression can be shared.  So
     * two rules that XPath over XML doesn't need: properties whose name
     * begins with "_" are not ShExJ and are not descended into, and a node
     * already seen is not visited twice.
     */
    function walkDescendants(node: SchemaNode): NodeSet {
      const ret: NodeSet = []
      const seen = new Set<SchemaNode>()
      children(node).forEach(collect)
      return ret

      function collect(n: SchemaNode): void {
        if (n === null || typeof n !== 'object' || seen.has(n))
          return
        seen.add(n)
        ret.push(n)
        children(n).forEach(collect)
      }

      function children(n: SchemaNode): NodeSet {
        return Array.isArray(n)
          ? n as NodeSet
          : Object.keys(n as object)
              .filter(k => k[0] !== '_')
              .map(k => (n as any)[k])
      }
    }

    function walkShapeExpr(node: SchemaNode): NodeSet {
      if (node instanceof Array)
        return node.reduce((ret, n2) => ret.concat(walkShapeExpr(n2)), [])
      if (!(node instanceof Object))
        return []
      switch ((<any>node).type) {
        case "ShapeAnd":
        case "ShapeOr":
          return [node].concat(walkShapeExpr((<any>node).shapeExprs))
        case "ShapeNot":
          return [node].concat(walkShapeExpr((<any>node).shapeExpr))
        case "Shape":
        case "NodeConstraint":
          return [node]
        default: return []
      }
    }

    function walkTripleExpr(node: SchemaNode): NodeSet {
      if (node instanceof Array)
        return node.reduce((ret, n2) => ret.concat(walkTripleExpr(n2)), [])
      if (!(node instanceof Object))
        return []
      switch ((<any>node).type) {
        case "EachOf":
        case "OneOf":
          return [node].concat(walkTripleExpr((<any>node).expressions))
        case "TripleConstraint":
          return [node]
        default: return []
      }
    }
  }
}

export class PathExprStep extends Step {
  t = 'PathExprStep'
  constructor(
    public pathExpr: PathExpr,
    public filters?: Function[]
  ) { super() }
  evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet {
    throw Error('PatheExprStep.evalStep not yet implemented')
  }
}

export enum Axis {
  child = 'child::',
  thisShapeExpr = 'thisShapeExpr::',
  thisTripleExpr = 'thisTripleExpr::',
  self = 'self::',
  parent = 'parent::',
  ancestor = 'ancestor::',
  /**
   * Every node beneath this one.  ShExJ has no top-level list of triple
   * expressions the way it has `shapes`, so a labelled one is found by
   * looking everywhere -- including inside a nested inline shape, which
   * `thisTripleExpr::` does not reach.  Reachable from the `$<label>`
   * shortcut; there is deliberately no token for it yet.
   */
  descendant = 'descendant::',
}

export abstract class Function extends Serializable {
  abstract evalFunction(node: SchemaNode, allNodes: NodeSet, idx: number, ctx: EvalContext): NodeSet;
}

export enum FuncName {
  index = 'index',
  count = 'count',
  ebv = 'ebv', // implied by 

  // operators
  equal = 'equal',
  lessThan = 'lessThan',
  greaterThan = 'greaterThan',
}

type Iri = string // annotate IRIs
export type FuncArg = Function | PathExpr | termType | Iri | number

export class Filter extends Function {
  t = 'Filter'
  constructor(
    public op: FuncName,
    public args: FuncArg[],
  ) { super() }

  isAggregate() { return [FuncName.index, FuncName.count, FuncName.ebv].indexOf(this.op) !== -1 }
  evalFunction(node: SchemaNode, allNodes: NodeSet, idx: number, ctx: EvalContext): NodeSet {
    // !! separate aggregates in the grammar
    if (this.isAggregate()) {
      switch (this.op) {
        case FuncName.index:
          // `[2]` is shorthand for `[index() = 2]` (grammar: filterExpr ->
          // Filter(index, [numericExpr])), so an index filter given an
          // argument compares rather than reports.  Positions are 0-based,
          // as index() has always reported them.
          return this.args.length === 0
            ? [idx]
            : evalArgs(this.args, node, allNodes)[0] === idx ? [node] : []
        case FuncName.count:
          return [allNodes.length]
        case FuncName.ebv: {
          // the effective boolean value *of the argument*, for this node --
          // `[index()]`, `[/id]`.  It used to answer for the whole node set,
          // so any filter written this way passed everything.
          const arg = this.args[0]
          if (arg === undefined)
            return ebv(allNodes)
          if (arg instanceof PathExpr)
            return ebv(arg.evalPathExpr([node], ctx))
          if (arg instanceof Function)
            return ebv(arg.evalFunction(node, allNodes, idx, ctx))
          return ebv([arg])
        }
        default:
          throw Error(`Not Implemented: Filter ${this.op} ${this.args}`)
      }
    } else {
      const args = evalArgs(this.args, node, allNodes)
      switch (this.op) {
        case FuncName.equal:
          const [l, r] = args
          if (l === r || sameJsonldString(l, r)) // (number, numper), (Iri, Iri), (Object, Object)
            return [node]
          // if (l instanceof Iri && r instanceof Iri && l.toJSON() === r.toJSON()) // (number, numper), (Iri, Iri), (Object, Object)
          //   return [node]
          break
        case FuncName.lessThan:
        case FuncName.greaterThan:
          break
        default:
          throw Error(`Not Implemented: Filter ${this.op} ${this.args}`)
      }
      return []
    }

    function evalArgs(args: FuncArg[], node: SchemaNode, allNodes: NodeSet) {
      // Note: no second parameter on the callback.  It used to be named
      // `idx`, which shadowed the node's position with the argument's, so a
      // nested aggregate -- the `index()` in `[index() = 1]` -- reported
      // where it sat in the argument list instead of where the node sat in
      // the node set.
      return args.map(arg => {
        if (typeof arg === 'number' || typeof arg === 'string' /* || arg instanceof Iri */)
          return arg
        if (arg instanceof Function)
          return arg.evalFunction(node, allNodes, idx, ctx)[0]
        if (arg instanceof PathExpr)
          return arg.evalPathExpr([node], ctx)[0]
      })
    }

  }
}

function sameJsonldString(l: any, r: any): boolean {
  return isPlainObject(l) && isPlainObject(r)
    // test as ShExJ.ObjectLiteral
    && l.value === r.value
    && l.language === r.language
    && l.type === r.type

  function isPlainObject(value: any) {
    return value instanceof Object &&
      Object.getPrototypeOf(value) == Object.prototype;
  }
}

const Pass = [true]
const Fail = [false]

function ebv(nodes: NodeSet): NodeSet {
  if (nodes.length > 1)
    return Pass
  if (nodes.length === 0)
    return Fail
  if (typeof nodes[0] === 'boolean')
    // without this, ebv(Fail) is Pass: a filter that answered "no" and was
    // asked again -- which is what the step does to every filter -- said yes
    return nodes[0] ? Pass : Fail
  if (typeof nodes[0] === 'number')
    return nodes[0] === 0 ? Fail : Pass
  if (typeof nodes[0] === 'string')
    return nodes[0].length === 0 ? Fail : Pass
  return Pass
}

export class Assertion extends Function {
  t = 'Assertion'
  constructor(
    public expect: Filter,
  ) { super() }
  evalFunction(node: SchemaNode, allNodes: NodeSet, idx: number, ctx: EvalContext): NodeSet {
    const val = this.expect.evalFunction(node, allNodes, idx, ctx)
    if (ebv(val) !== Pass)
      throw Error(`failed assertion: ebv(${JSON.stringify(val)}) !== ${JSON.stringify(Pass)} in ${JSON.stringify(this)} on ${JSON.stringify(node)} /  ${JSON.stringify(allNodes)}`)
    return Pass
  }
}

export enum t_termType {
  Schema = 'Schema',
  ShapeDecl = 'ShapeDecl',
  SemAct = 'SemAct',
  Annotation = 'Annotation',
}
export type termType = t_termType | shapeExprType | tripleExprType | valueType

export enum t_shapeDeclAttr {
  abstract = 'abstract',
  shapeExpr = 'shapeExpr',
}
export type shapeDeclAttr = t_shapeDeclAttr

export enum t_shapeExprType {
  ShapeAnd = 'ShapeAnd',
  ShapeOr = 'ShapeOr',
  ShapeNot = 'ShapeNot',
  NodeConstraint = 'NodeConstraint',
  Shape = 'Shape',
  ShapeExternal = 'ShapeExternal',
}
export type shapeExprType = t_shapeExprType

export enum t_tripleExprType {
  EachOf = 'EachOf',
  OneOf = 'OneOf',
  TripleConstraint = 'TripleConstraint',
}
export type tripleExprType = t_tripleExprType

export enum t_valueType {
  IriStem = 'IriStem',
  IriStemRange = 'IriStemRange',
  LiteralStem = 'LiteralStem',
  LiteralStemRange = 'LiteralStemRange',
  Language = 'Language',
  LanguageStem = 'LanguageStem',
  LanguageStemRange = 'LanguageStemRange',
  Wildcard = 'Wildcard',
}
export type valueType = t_valueType

export enum t_attribute {
  Any = '*',
  type = 'type',
  id = 'id',
  semActs = 'semActs',
  annotations = 'annotations',
  predicate = 'predicate',
}
export type Attribute = t_attribute | schemaAttr | shapeDeclAttr | shapeExprAttr | tripleExprAttr | valueSetValueAttr | semActAttr | annotationAttr

export enum t_schemaAttr {
  atContext = '@context',
  startActs = 'startActs',
  start = 'start',
  imports = 'imports',
  shapes = 'shapes',
}
export type schemaAttr = t_schemaAttr

export enum t_shapeExprAttr {
  shapeExprs = 'shapeExprs',
  shapeExpr = 'shapeExpr',
}
export type shapeExprAttr = t_shapeExprAttr | nodeConstraintAttr | shapeAttr

export enum t_nodeConstraintAttr {
  nodeKind = 'nodeKind',
  datatype = 'datatype',
  values = 'values',
}
export type nodeConstraintAttr = t_nodeConstraintAttr | xsFacetAttr

export enum t_xsFacetAttr {
}
export type xsFacetAttr = t_xsFacetAttr | stringFacetAttr | numericFacetAttr

export enum t_stringFacetAttr {
  length = 'length',
  minlength = 'minlength',
  maxlength = 'maxlength',
  pattern = 'pattern',
  flags = 'flags',
}
export type stringFacetAttr = t_stringFacetAttr

export enum t_numericFacetAttr {
  mininclusive = 'mininclusive',
  minexclusive = 'minexclusive',
  maxinclusive = 'maxinclusive',
  maxexclusive = 'maxexclusive',
  totaldigits = 'totaldigits',
  fractiondigits = 'fractiondigits',
}
export type numericFacetAttr = t_numericFacetAttr

export enum t_valueSetValueAttr {
  value = 'value',
  language = 'language',
  stem = 'stem',
  exclusions = 'exclusions',
  languageTag = 'languageTag',
}
export type valueSetValueAttr = t_valueSetValueAttr

export enum t_shapeAttr {
  closed = 'closed',
  extra = 'extra',
  extends = 'extends',
  expression = 'expression',
}
export type shapeAttr = t_shapeAttr

export enum t_tripleExprAttr {
  expressions = 'expressions',
  min = 'min',
  max = 'max',
}
export type tripleExprAttr = t_tripleExprAttr | tripleConstraintAttr

export enum t_tripleConstraintAttr {
  inverse = 'inverse',
  valueExpr = 'valueExpr',
}
export type tripleConstraintAttr = t_tripleConstraintAttr

export enum t_semActAttr {
  name = 'name',
  code = 'code',
}
export type semActAttr = t_semActAttr

export enum t_annotationAttr {
  object = 'object',
}
export type annotationAttr = t_annotationAttr

