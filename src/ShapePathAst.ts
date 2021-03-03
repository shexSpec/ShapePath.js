/** ShapePath types
 *
Serializable
  PathExpr
    Junction
      Union
      Intersection
    Path
  Step
    UnitStep
    PathExprStep
  Function
    Filter
    Assertion
 */

import * as ShExJ from 'shexj';

export type SchemaNode = ShExJ.Schema
  | ShExJ.shapeExpr
  | ShExJ.ShapeOr
  | ShExJ.ShapeAnd
  | ShExJ.ShapeNot
  | ShExJ.ShapeExternal
  | ShExJ.shapeExprRef
  | ShExJ.shapeExprLabel
  | ShExJ.NodeConstraint
  | ShExJ.xsFacet
  | ShExJ.stringFacet
  | ShExJ.numericFacet
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

export class EvalContext {
  constructor(
    public schema: ShExJ.Schema,
  ) { }
}

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

export class Union extends Junction {
  t = "Union"
  evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet {
    return nodes
  }
}

export class Intersection extends Junction {
  t = "Intersection"
  evalPathExpr(nodes: NodeSet, ctx: EvalContext): NodeSet {
    return nodes
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
      return ret.concat(step.evalStep(nodes, ctx))
    }, [] as NodeSet)
  }
}

export abstract class Step extends Serializable {
  abstract evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet
}

export class UnitStep {
  t = 'UnitStep'
  constructor(
    public selector: Selector,
    public axis?: Axis,
    public filters?: Function[]
  ) { }
  evalStep(nodes: NodeSet, ctx: EvalContext): NodeSet {
    const axisNodes = nodes // @@
    const selectedNodes = axisNodes.reduce((ret, node) => {
      if (!(node instanceof Object))
        return ret
      if (!(this.selector in node))
        return ret
      const toAdd = this.selector === t_Selector.Any
        ? Object.values(node)
        : (<any>node)[this.selector.toString()]
      if (toAdd instanceof Array)
        ret.push.apply(ret, toAdd)
      else
        ret.push(toAdd)
      return ret
    }, [] as NodeSet)
    const filteredNodes = (this.filters || []).reduce((ret, filter) => filter.evalFunction(ret, ctx), selectedNodes)
    return filteredNodes
  }
}

export class PathExprStep {
  t = 'PathExprStep'
  constructor(
    public pathExpr: PathExpr,
    public filters?: Function[]
  ) { }
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
}

export abstract class Function extends Serializable {
  abstract evalFunction(nodes: NodeSet, ctx: EvalContext): NodeSet;
}

export enum FuncName {
  index = 'index',
  count = 'count',

  // operators
  ebv = 'ebv', // implied by 
  equal = 'equal',
  lessThan = 'lessThan',
  greaterThan = 'greaterThan',
}

export type FuncArg = Function | PathExpr | URL | number

export class Filter extends Function {
  t = 'Filter'
  constructor(
    public op: string,
    public args: FuncArg[],
  ) { super() }
  evalFunction(nodes: NodeSet, ctx: EvalContext): NodeSet {
    return nodes.reduce((ret, node) => {
      const args = this.args.map((arg) => {
        if (arg instanceof URL || typeof arg === 'number')
          return arg
        if (arg instanceof Function)
          return arg.evalFunction([node], ctx)[0]
        if (arg instanceof PathExpr)
          return arg.evalPathExpr([node], ctx)[0]
      }, [])
      switch (this.op) {
        case FuncName.equal:
          const [l, r] = args
          console.warn(`${l} === ${r}`)
          if (l === r) // (number, numper), (URL, URL), (Object, Object)
            return ret.concat(node)
          return ret.concat(node)
        default:
          throw Error(`Not Implemented: Filter ${this.op} ${this.args}`)
      }
      return ret
    }, nodes)
  }
}

export class Assertion extends Function {
  t = 'Assertion'
  constructor(
    public expect: Function,
  ) { super() }
  evalFunction(nodes: NodeSet, ctx: EvalContext): NodeSet {
    return nodes
  }
}

export enum t_Selector {
  Any = '*',
}

export type Selector = t_Selector | termType | attribute // | shapeExprAttr | valueSetValueAttr | tripleExprAttr | semActAttr | annotationAttr

export enum t_termType {
  Schema = 'Schema',
  SemAct = 'SemAct',
  Annotation = 'Annotation',
}
export type termType = t_termType | shapeExprType | tripleExprType | valueType

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
  type = 'type',
  id = 'id',
  semActs = 'semActs',
  annotations = 'annotations',
  predicate = 'predicate',
}
export type attribute = t_attribute | schemaAttr | shapeExprAttr | tripleExprAttr | valueSetValueAttr | semActAttr | annotationAttr

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

