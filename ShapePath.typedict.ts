import {
  PathExpr, Intersection, Path, Step, Axis, Selector, Func, FuncName,
  termType,
  shapeExprType,
  tripleExprType,
  valueType,
  attribute,
  schemaAttr,
  shapeExprAttr,
  nodeConstraintAttr,
  xsFacetAttr,
  stringFacetAttr,
  numericFacetAttr,
  valueSetValueAttr,
  shapeAttr,
  tripleExprAttr,
  tripleConstraintAttr,
  semActAttr,
  annotationAttr,
} from './ShapePathAst'
import { comparison, rvalue } from './ShapePathJisonInternals'

export interface TysonTypeDictionary {
  top: unknown;
  shapePath: PathExpr;
  _O_QIT_union_E_S_QunionStep_E_C: Intersection | Path;
  _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star: Array<Path | Intersection>;
  unionStep: Path | Intersection;
  _O_QIT_intersection_E_S_QintersectionStep_E_C: Path;
  _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star: Array<Path>;
  intersectionStep: Path;
  _QnextStep_E_Star: Array<Step>;
  startStep: Array<Step>;
  _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C: string;
  _Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt: string | null;
  nextStep: Array<Step>;
  shortcut: Array<Step>;
  _O_QGT_AT_E_Or_QGT_DOT_E_C: string;
  step: Step;
  _Qaxis_E_Opt: Axis | null;
  _Qfilter_E_Star: Array<Func>;
  axis: Axis;
  selector: Selector;
  filter: Func;
  filterExpr: Func
  _QIT_ASSERT_E_Opt: boolean;
  _Qcomparison_E_Opt: comparison | null;
  function: Func;
  comparison: comparison;
  comparitor: FuncName;
  rvalue: rvalue;
  numericExpr: number;
  termType: termType;
  shapeExprType: shapeExprType;
  tripleExprType: tripleExprType;
  valueType: valueType;
  attribute: attribute;
  schemaAttr: schemaAttr;
  shapeExprAttr: shapeExprAttr;
  nodeConstraintAttr: nodeConstraintAttr;
  xsFacetAttr: xsFacetAttr;
  stringFacetAttr: stringFacetAttr;
  numericFacetAttr: numericFacetAttr;
  valueSetValueAttr: valueSetValueAttr;
  shapeAttr: shapeAttr;
  tripleExprAttr: tripleExprAttr;
  tripleConstraintAttr: tripleConstraintAttr;
  semActAttr: semActAttr;
  annotationAttr: annotationAttr;
  iri: URL;
  prefixedName: URL;
  IT_DIVIDE: string;
  IT_DIVIDEDIVIDE: string;
  IT_AT: string;
  IT_DOT: string;
  INTEGER: string;
  IT_shapeExprs: string;
  IT_shapeExpr: string;
  IT_nodeKind: string;
  IT_datatype: string;
  IT_values: string;
  IT_length: string;
  IT_minlength: string;
  IT_maxlength: string;
  IT_pattern: string;
  IT_flags: string;
  IT_mininclusive: string;
  IT_minexclusive: string;
  IT_maxinclusive: string;
  IT_maxexclusive: string;
  IT_totaldigits: string;
  IT_fractiondigits: string;
  IT_value: string;
  IT_language: string;
  IT_stem: string;
  IT_exclusions: string;
  IT_languageTag: string;
  IT_closed: string;
  IT_extra: string;
  IT_expression: string;
  IT_expressions: string;
  IT_min: string;
  IT_max: string;
  IT_inverse: string;
  IT_valueExpr: string;
  IT_name: string;
  IT_code: string;
  IT_object: string;
  IRIREF: string;
  PNAME_LN: string;
  PNAME_NS: string;
}

export type yy = any
