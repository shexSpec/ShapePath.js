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

export abstract class Serializable {
  abstract t: string
}

export abstract class PathExpr extends Serializable {
}

export abstract class Junction extends PathExpr {
  constructor(
    public exprs: Array<Path | Junction>
  ) {
    super()
  }
}

export class Union extends Junction { t = "Union" }

export class Intersection extends Junction { t = "Intersection" }

export class Path extends PathExpr {
  t = 'Path'
  constructor(
    public steps: Step[]
  ) {
    super()
  }
}

export abstract class Step extends Serializable {
}

export class UnitStep {
  t = 'UnitStep'
  constructor(
    public selector: Selector,
    public axis?: Axis,
    public filters?: Function[]
  ) { }
}

export class PathExprStep {
  t = 'PathExprStep'
  constructor(
    public pathExpr: PathExpr,
    public filters?: Function[]
  ) { }
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
}

export class Assertion extends Function {
  t = 'Assertion'
  constructor(
    public expect: Function,
  ) { super() }
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

