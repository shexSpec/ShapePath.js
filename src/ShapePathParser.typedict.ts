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
  FuncArg,
} from './ShapePathAst'
import { comparison, rvalue } from './ShapePathParserInternals'

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
  fooArg: Array<FuncArg>;
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
  GT_DIVIDE: string;
  GT_DIVIDEDIVIDE: string;
  GT_AT: string;
  GT_DOT: string;
  INTEGER: string;
  IRIREF: string;
  PNAME_LN: string;
  PNAME_NS: string;
}

export declare const yy: any
