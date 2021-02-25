/** ShapePath types
 *
 */

export type PathExpr = Path | Intersection | Union

export abstract class Junction {
  abstract t: string
  constructor(
    public exprs: Array<Path | Junction>
  ) { }
}

export class Union extends Junction { t = "Union" }

export class Intersection extends Junction { t = "Intersection" }

export class Path {
  t = 'Path'
  constructor(
    public steps: Step[]
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

export enum t_Selector {
  Any = '*',
}

export enum FuncName {
  ebv = 'ebv',
  index = 'index',
  length = 'length',
  // operators
  equal = 'equal',
  lessThan = 'lessThan',
  greaterThan = 'greaterThan',
}

export type FuncArg = Func | Path | number | '@@'

export abstract class Func {
  abstract t: string
}

export class Filter extends Func {
  t = 'Filter'
  constructor(
    public l: FuncArg,
    public op: string,
    public r?: number | URL | '@@'
  ) { super() }
}

export class Assertion extends Func {
  t = 'Assertion'
  constructor(
    public l: Func,
  ) { super() }
}

export class Step {
  t = 'Step'
  constructor(
    public selector: Selector,
    public axis?: Axis,
    public filters?: Func[]
  ) { }
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

