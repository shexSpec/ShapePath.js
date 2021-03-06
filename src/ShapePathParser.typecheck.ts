import { TysonTypeDictionary, yy } from "./ShapePathParser.typedict";

import {
  Union,
  Intersection,
  Path,
  ChildStep,
  AxisStep,
  PathExprStep,
  Axis,
  Assertion,
  Filter,
  Function,
  FuncArg,
  FuncName,
  Iri,
  BNode,
  termType,
  t_termType,
  t_shapeExprType,
  t_tripleExprType,
  t_valueType,
  t_attribute,
  t_schemaAttr,
  t_shapeExprAttr,
  t_nodeConstraintAttr,
  t_stringFacetAttr,
  t_numericFacetAttr,
  t_valueSetValueAttr,
  t_shapeAttr,
  t_tripleExprAttr,
  t_tripleConstraintAttr,
  t_semActAttr,
  t_annotationAttr,
} from "./ShapePathAst";

import { comparison, rvalue } from "./ShapePathParserInternals";

function makeFunction(
  assertionP: boolean,
  firstArg: FuncArg,
  comp: comparison = { op: FuncName.ebv, r: null }
): Function {
  const { op, r } = comp;
  const args = [firstArg];
  if (r) args.push(r);
  const ret = new Filter(op, args);
  return assertionP ? new Assertion(ret) : ret;
}

function makeFilters(
  type: termType | null,
  filters: Array<Function>
): Array<Function> | undefined {
  if (type)
    filters.unshift(
      new Filter(FuncName.equal, [
        new Path([new ChildStep(t_attribute.type)]),
        type,
      ])
    );
  return filters.length > 0 ? filters : undefined;
}

function pnameToUrl(pname: string, yy: any): Iri {
  const idx = pname.indexOf(":");
  const pre = pname.substr(0, idx);
  const lname = pname.substr(idx + 1);
  if (!(pre in yy.prefixes)) throw Error(`unknown prefix in ${pname}`);
  const ns = yy.prefixes[pre];
  return new Iri(new URL(ns + lname, yy.base).href);
}

export function shapeLabelShortCut(label: Iri) {
  return [
    new ChildStep(t_schemaAttr.shapes),
    new ChildStep(t_attribute.Any, [
      new Filter(FuncName.equal, [
        new Path([new ChildStep(t_attribute.id)]),
        label,
      ]),
      new Assertion(
        new Filter(FuncName.equal, [new Filter(FuncName.count, []), 1])
      ),
    ]),
  ];
}

export function predicateShortCut(label: Iri) {
  return [
    new AxisStep(Axis.thisShapeExpr, makeFilters(t_shapeExprType.Shape, [])),
    new ChildStep(t_shapeAttr.expression),
    new AxisStep(
      Axis.thisTripleExpr,
      makeFilters(t_tripleExprType.TripleConstraint, [
        new Filter(FuncName.equal, [
          new Path([new ChildStep(t_attribute.predicate)]),
          label,
        ]),
      ])
    ),
  ];
}

const semanticActions = {
  "top -> shapePath EOF"(
    $1: TysonTypeDictionary["shapePath"]
  ): TysonTypeDictionary["top"] {
    let $$: TysonTypeDictionary["top"];
    return $1;
  },

  "shapePath -> unionStep _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"(
    $1: TysonTypeDictionary["unionStep"],
    $2: TysonTypeDictionary["_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"]
  ): TysonTypeDictionary["shapePath"] {
    let $$: TysonTypeDictionary["shapePath"];
    $$ = $2.length ? new Union([$1].concat($2)) : $1;
    return $$;
  },

  "_O_QIT_union_E_S_QunionStep_E_C -> IT_UNION unionStep"(
    $2: TysonTypeDictionary["unionStep"]
  ): TysonTypeDictionary["_O_QIT_union_E_S_QunionStep_E_C"] {
    let $$: TysonTypeDictionary["_O_QIT_union_E_S_QunionStep_E_C"];
    $$ = $2;
    return $$;
  },

  "_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star -> "(): TysonTypeDictionary["_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"] {
    let $$: TysonTypeDictionary["_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"];
    $$ = [];
    return $$;
  },

  "_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star -> _Q_O_QIT_union_E_S_QunionStep_E_C_E_Star _O_QIT_union_E_S_QunionStep_E_C"(
    $1: TysonTypeDictionary["_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"],
    $2: TysonTypeDictionary["_O_QIT_union_E_S_QunionStep_E_C"]
  ): TysonTypeDictionary["_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"] {
    let $$: TysonTypeDictionary["_Q_O_QIT_union_E_S_QunionStep_E_C_E_Star"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "unionStep -> intersectionStep _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"(
    $1: TysonTypeDictionary["intersectionStep"],
    $2: TysonTypeDictionary["_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"]
  ): TysonTypeDictionary["unionStep"] {
    let $$: TysonTypeDictionary["unionStep"];
    $$ = $2.length ? new Intersection([$1].concat($2)) : $1;
    return $$;
  },

  "_O_QIT_intersection_E_S_QintersectionStep_E_C -> IT_INTERSECTION intersectionStep"(
    $2: TysonTypeDictionary["intersectionStep"]
  ): TysonTypeDictionary["_O_QIT_intersection_E_S_QintersectionStep_E_C"] {
    let $$: TysonTypeDictionary["_O_QIT_intersection_E_S_QintersectionStep_E_C"];
    $$ = $2;
    return $$;
  },

  "_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star -> "(): TysonTypeDictionary["_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"] {
    let $$: TysonTypeDictionary["_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"];
    $$ = [];
    return $$;
  },

  "_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star -> _Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star _O_QIT_intersection_E_S_QintersectionStep_E_C"(
    $1: TysonTypeDictionary["_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"],
    $2: TysonTypeDictionary["_O_QIT_intersection_E_S_QintersectionStep_E_C"]
  ): TysonTypeDictionary["_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"] {
    let $$: TysonTypeDictionary["_Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "intersectionStep -> startStep _QnextStep_E_Star"(
    $1: TysonTypeDictionary["startStep"],
    $2: TysonTypeDictionary["_QnextStep_E_Star"]
  ): TysonTypeDictionary["intersectionStep"] {
    let $$: TysonTypeDictionary["intersectionStep"];
    $$ = new Path($1.concat($2));
    return $$;
  },

  "_QnextStep_E_Star -> "(): TysonTypeDictionary["_QnextStep_E_Star"] {
    let $$: TysonTypeDictionary["_QnextStep_E_Star"];
    $$ = [];
    return $$;
  },

  "_QnextStep_E_Star -> _QnextStep_E_Star nextStep"(
    $1: TysonTypeDictionary["_QnextStep_E_Star"],
    $2: TysonTypeDictionary["nextStep"]
  ): TysonTypeDictionary["_QnextStep_E_Star"] {
    let $$: TysonTypeDictionary["_QnextStep_E_Star"];
    $$ = $1.concat($2);
    return $$;
  },

  "startStep -> _Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt step"(
    $2: TysonTypeDictionary["step"]
  ): TysonTypeDictionary["startStep"] {
    let $$: TysonTypeDictionary["startStep"];
    $$ = [$2];
    return $$;
  },

  "startStep -> shortcut"(
    $1: TysonTypeDictionary["shortcut"]
  ): TysonTypeDictionary["startStep"] {
    let $$: TysonTypeDictionary["startStep"];
    $$ = $1;
    return $$;
  },

  "_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C -> GT_DIVIDE"(
    $1: TysonTypeDictionary["GT_DIVIDE"]
  ): TysonTypeDictionary["_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C"] {
    let $$: TysonTypeDictionary["_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C"];
    $$ = $1;
    return $$;
  },

  "_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C -> GT_DIVIDEDIVIDE"(
    $1: TysonTypeDictionary["GT_DIVIDEDIVIDE"]
  ): TysonTypeDictionary["_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C"] {
    let $$: TysonTypeDictionary["_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C"];
    $$ = $1;
    return $$;
  },

  "_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt -> "(): TysonTypeDictionary["_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt"] {
    let $$: TysonTypeDictionary["_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt"];
    $$ = null;
    return $$;
  },

  "_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt -> _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C"(
    $1: TysonTypeDictionary["_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C"]
  ): TysonTypeDictionary["_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt"] {
    let $$: TysonTypeDictionary["_Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt"];
    $$ = $1;
    return $$;
  },

  "nextStep -> _O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C step"(
    $2: TysonTypeDictionary["step"]
  ): TysonTypeDictionary["nextStep"] {
    let $$: TysonTypeDictionary["nextStep"];
    $$ = [$2];
    return $$;
  },

  "nextStep -> shortcut"(
    $1: TysonTypeDictionary["shortcut"]
  ): TysonTypeDictionary["nextStep"] {
    let $$: TysonTypeDictionary["nextStep"];
    $$ = $1;
    return $$;
  },

  "shortcut -> _O_QGT_AT_E_Or_QGT_DOT_E_C iri"(
    $1: TysonTypeDictionary["_O_QGT_AT_E_Or_QGT_DOT_E_C"],
    $2: TysonTypeDictionary["iri"]
  ): TysonTypeDictionary["shortcut"] {
    let $$: TysonTypeDictionary["shortcut"];
    $$ = $1 === "@" ? shapeLabelShortCut($2) : predicateShortCut($2);
    return $$;
  },

  "_O_QGT_AT_E_Or_QGT_DOT_E_C -> GT_AT"(
    $1: TysonTypeDictionary["GT_AT"]
  ): TysonTypeDictionary["_O_QGT_AT_E_Or_QGT_DOT_E_C"] {
    let $$: TysonTypeDictionary["_O_QGT_AT_E_Or_QGT_DOT_E_C"];
    $$ = $1;
    return $$;
  },

  "_O_QGT_AT_E_Or_QGT_DOT_E_C -> GT_DOT"(
    $1: TysonTypeDictionary["GT_DOT"]
  ): TysonTypeDictionary["_O_QGT_AT_E_Or_QGT_DOT_E_C"] {
    let $$: TysonTypeDictionary["_O_QGT_AT_E_Or_QGT_DOT_E_C"];
    $$ = $1;
    return $$;
  },

  "step -> _QIT_child_E_Opt termType _Qfilter_E_Star"(
    $2: TysonTypeDictionary["termType"],
    $3: TysonTypeDictionary["_Qfilter_E_Star"]
  ): TysonTypeDictionary["step"] {
    let $$: TysonTypeDictionary["step"];
    $$ = new ChildStep(t_attribute.Any, makeFilters($2, $3));
    return $$;
  },

  "step -> _QIT_child_E_Opt attributeOrAny _QtermType_E_Opt _Qfilter_E_Star"(
    $2: TysonTypeDictionary["attributeOrAny"],
    $3: TysonTypeDictionary["_QtermType_E_Opt"],
    $4: TysonTypeDictionary["_Qfilter_E_Star"]
  ): TysonTypeDictionary["step"] {
    let $$: TysonTypeDictionary["step"];
    $$ = new ChildStep($2, makeFilters($3, $4));
    return $$;
  },

  "step -> nonChildAxis _QtermType_E_Opt _Qfilter_E_Star"(
    $1: TysonTypeDictionary["nonChildAxis"],
    $2: TysonTypeDictionary["_QtermType_E_Opt"],
    $3: TysonTypeDictionary["_Qfilter_E_Star"]
  ): TysonTypeDictionary["step"] {
    let $$: TysonTypeDictionary["step"];
    $$ = new AxisStep($1, makeFilters($2, $3));
    return $$;
  },

  "step -> GT_LPAREN shapePath GT_RPAREN _QtermType_E_Opt _Qfilter_E_Star"(
    $2: TysonTypeDictionary["shapePath"],
    $4: TysonTypeDictionary["_QtermType_E_Opt"],
    $5: TysonTypeDictionary["_Qfilter_E_Star"]
  ): TysonTypeDictionary["step"] {
    let $$: TysonTypeDictionary["step"];
    $$ = new PathExprStep($2, makeFilters($4, $5));
    return $$;
  },

  "_QIT_child_E_Opt -> "(): TysonTypeDictionary["_QIT_child_E_Opt"] {
    let $$: TysonTypeDictionary["_QIT_child_E_Opt"];
    $$ = null;
    return $$;
  },

  "_QIT_child_E_Opt -> IT_child"(): TysonTypeDictionary["_QIT_child_E_Opt"] {
    let $$: TysonTypeDictionary["_QIT_child_E_Opt"];
    $$ = null;
    return $$;
  },

  "_QtermType_E_Opt -> "(): TysonTypeDictionary["_QtermType_E_Opt"] {
    let $$: TysonTypeDictionary["_QtermType_E_Opt"];
    $$ = null;
    return $$;
  },

  "_QtermType_E_Opt -> termType"(
    $1: TysonTypeDictionary["termType"]
  ): TysonTypeDictionary["_QtermType_E_Opt"] {
    let $$: TysonTypeDictionary["_QtermType_E_Opt"];
    $$ = $1;
    return $$;
  },

  "_Qfilter_E_Star -> "(): TysonTypeDictionary["_Qfilter_E_Star"] {
    let $$: TysonTypeDictionary["_Qfilter_E_Star"];
    $$ = [];
    return $$;
  },

  "_Qfilter_E_Star -> _Qfilter_E_Star filter"(
    $1: TysonTypeDictionary["_Qfilter_E_Star"],
    $2: TysonTypeDictionary["filter"]
  ): TysonTypeDictionary["_Qfilter_E_Star"] {
    let $$: TysonTypeDictionary["_Qfilter_E_Star"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "nonChildAxis -> IT_thisShapeExpr"(): TysonTypeDictionary["nonChildAxis"] {
    let $$: TysonTypeDictionary["nonChildAxis"];
    $$ = Axis.thisShapeExpr;
    return $$;
  },

  "nonChildAxis -> IT_thisTripleExpr"(): TysonTypeDictionary["nonChildAxis"] {
    let $$: TysonTypeDictionary["nonChildAxis"];
    $$ = Axis.thisTripleExpr;
    return $$;
  },

  "nonChildAxis -> IT_self"(): TysonTypeDictionary["nonChildAxis"] {
    let $$: TysonTypeDictionary["nonChildAxis"];
    $$ = Axis.self;
    return $$;
  },

  "nonChildAxis -> IT_parent"(): TysonTypeDictionary["nonChildAxis"] {
    let $$: TysonTypeDictionary["nonChildAxis"];
    $$ = Axis.parent;
    return $$;
  },

  "nonChildAxis -> IT_ancestor"(): TysonTypeDictionary["nonChildAxis"] {
    let $$: TysonTypeDictionary["nonChildAxis"];
    $$ = Axis.ancestor;
    return $$;
  },

  "attributeOrAny -> GT_STAR"(): TysonTypeDictionary["attributeOrAny"] {
    let $$: TysonTypeDictionary["attributeOrAny"];
    $$ = t_attribute.Any;
    return $$;
  },

  "attributeOrAny -> attribute"(
    $1: TysonTypeDictionary["attribute"]
  ): TysonTypeDictionary["attributeOrAny"] {
    let $$: TysonTypeDictionary["attributeOrAny"];
    $$ = $1;
    return $$;
  },

  "filter -> GT_LBRACKET filterExpr GT_RBRACKET"(
    $2: TysonTypeDictionary["filterExpr"]
  ): TysonTypeDictionary["filter"] {
    let $$: TysonTypeDictionary["filter"];
    $$ = $2;
    return $$;
  },

  "filterExpr -> _QIT_ASSERT_E_Opt shapePath _Qcomparison_E_Opt"(
    $1: TysonTypeDictionary["_QIT_ASSERT_E_Opt"],
    $2: TysonTypeDictionary["shapePath"],
    $3: TysonTypeDictionary["_Qcomparison_E_Opt"]
  ): TysonTypeDictionary["filterExpr"] {
    let $$: TysonTypeDictionary["filterExpr"];
    $$ = makeFunction($1, $2, $3 ? $3 : undefined);
    return $$;
  },

  "filterExpr -> _QIT_ASSERT_E_Opt function _Qcomparison_E_Opt"(
    $1: TysonTypeDictionary["_QIT_ASSERT_E_Opt"],
    $2: TysonTypeDictionary["function"],
    $3: TysonTypeDictionary["_Qcomparison_E_Opt"]
  ): TysonTypeDictionary["filterExpr"] {
    let $$: TysonTypeDictionary["filterExpr"];
    $$ = makeFunction($1, $2, $3 ? $3 : undefined);
    return $$;
  },

  "filterExpr -> numericExpr"(
    $1: TysonTypeDictionary["numericExpr"]
  ): TysonTypeDictionary["filterExpr"] {
    let $$: TysonTypeDictionary["filterExpr"];
    $$ = new Filter(FuncName.index, [$1]);
    return $$;
  },

  "_QIT_ASSERT_E_Opt -> "(): TysonTypeDictionary["_QIT_ASSERT_E_Opt"] {
    let $$: TysonTypeDictionary["_QIT_ASSERT_E_Opt"];
    $$ = false;
    return $$;
  },

  "_QIT_ASSERT_E_Opt -> IT_ASSERT"(): TysonTypeDictionary["_QIT_ASSERT_E_Opt"] {
    let $$: TysonTypeDictionary["_QIT_ASSERT_E_Opt"];
    $$ = true;
    return $$;
  },

  "_Qcomparison_E_Opt -> "(): TysonTypeDictionary["_Qcomparison_E_Opt"] {
    let $$: TysonTypeDictionary["_Qcomparison_E_Opt"];
    $$ = null;
    return $$;
  },

  "_Qcomparison_E_Opt -> comparison"(
    $1: TysonTypeDictionary["comparison"]
  ): TysonTypeDictionary["_Qcomparison_E_Opt"] {
    let $$: TysonTypeDictionary["_Qcomparison_E_Opt"];
    $$ = $1;
    return $$;
  },

  "function -> IT_index GT_LPAREN GT_RPAREN"(): TysonTypeDictionary["function"] {
    let $$: TysonTypeDictionary["function"];
    $$ = new Filter(FuncName.index, []);
    return $$;
  },

  "function -> IT_count GT_LPAREN GT_RPAREN"(): TysonTypeDictionary["function"] {
    let $$: TysonTypeDictionary["function"];
    $$ = new Filter(FuncName.count, []);
    return $$;
  },

  "function -> IT_foo1 GT_LPAREN iri GT_RPAREN"(): TysonTypeDictionary["function"] {
    let $$: TysonTypeDictionary["function"];
    $$ = new Filter(FuncName.count, []);
    return $$;
  },

  "function -> IT_foo2 GT_LPAREN fooArg GT_RPAREN"(): TysonTypeDictionary["function"] {
    let $$: TysonTypeDictionary["function"];
    $$ = new Filter(FuncName.count, []);
    return $$;
  },

  "fooArg -> INTEGER iri"(
    $1: TysonTypeDictionary["INTEGER"],
    $2: TysonTypeDictionary["iri"]
  ): TysonTypeDictionary["fooArg"] {
    let $$: TysonTypeDictionary["fooArg"];
    $$ = [parseInt($1), $2];
    return $$;
  },

  "fooArg -> INTEGER"(
    $1: TysonTypeDictionary["INTEGER"]
  ): TysonTypeDictionary["fooArg"] {
    let $$: TysonTypeDictionary["fooArg"];
    $$ = [parseInt($1)];
    return $$;
  },

  "fooArg -> iri"(
    $1: TysonTypeDictionary["iri"]
  ): TysonTypeDictionary["fooArg"] {
    let $$: TysonTypeDictionary["fooArg"];
    $$ = [$1];
    return $$;
  },

  "comparison -> comparitor rvalue"(
    $1: TysonTypeDictionary["comparitor"],
    $2: TysonTypeDictionary["rvalue"]
  ): TysonTypeDictionary["comparison"] {
    let $$: TysonTypeDictionary["comparison"];
    $$ = { op: $1, r: $2 };
    return $$;
  },

  "comparitor -> GT_EQUAL"(): TysonTypeDictionary["comparitor"] {
    let $$: TysonTypeDictionary["comparitor"];
    $$ = FuncName.equal;
    return $$;
  },

  "comparitor -> GT_LT"(): TysonTypeDictionary["comparitor"] {
    let $$: TysonTypeDictionary["comparitor"];
    $$ = FuncName.lessThan;
    return $$;
  },

  "comparitor -> GT_GT"(): TysonTypeDictionary["comparitor"] {
    let $$: TysonTypeDictionary["comparitor"];
    $$ = FuncName.greaterThan;
    return $$;
  },

  "rvalue -> INTEGER"(
    $1: TysonTypeDictionary["INTEGER"]
  ): TysonTypeDictionary["rvalue"] {
    let $$: TysonTypeDictionary["rvalue"];
    $$ = parseInt($1);
    return $$;
  },

  "rvalue -> iri"(
    $1: TysonTypeDictionary["iri"]
  ): TysonTypeDictionary["rvalue"] {
    let $$: TysonTypeDictionary["rvalue"];
    $$ = $1;
    return $$;
  },

  "numericExpr -> INTEGER"(
    $1: TysonTypeDictionary["INTEGER"]
  ): TysonTypeDictionary["numericExpr"] {
    let $$: TysonTypeDictionary["numericExpr"];
    $$ = parseInt($1);
    return $$;
  },

  "termType -> shapeExprType"(
    $1: TysonTypeDictionary["shapeExprType"]
  ): TysonTypeDictionary["termType"] {
    let $$: TysonTypeDictionary["termType"];
    $$ = $1;
    return $$;
  },

  "termType -> tripleExprType"(
    $1: TysonTypeDictionary["tripleExprType"]
  ): TysonTypeDictionary["termType"] {
    let $$: TysonTypeDictionary["termType"];
    $$ = $1;
    return $$;
  },

  "termType -> valueType"(
    $1: TysonTypeDictionary["valueType"]
  ): TysonTypeDictionary["termType"] {
    let $$: TysonTypeDictionary["termType"];
    $$ = $1;
    return $$;
  },

  "termType -> IT_Schema"(): TysonTypeDictionary["termType"] {
    let $$: TysonTypeDictionary["termType"];
    $$ = t_termType.Schema;
    return $$;
  },

  "termType -> IT_SemAct"(): TysonTypeDictionary["termType"] {
    let $$: TysonTypeDictionary["termType"];
    $$ = t_termType.SemAct;
    return $$;
  },

  "termType -> IT_Annotation"(): TysonTypeDictionary["termType"] {
    let $$: TysonTypeDictionary["termType"];
    $$ = t_termType.Annotation;
    return $$;
  },

  "shapeExprType -> IT_ShapeAnd"(): TysonTypeDictionary["shapeExprType"] {
    let $$: TysonTypeDictionary["shapeExprType"];
    $$ = t_shapeExprType.ShapeAnd;
    return $$;
  },

  "shapeExprType -> IT_ShapeOr"(): TysonTypeDictionary["shapeExprType"] {
    let $$: TysonTypeDictionary["shapeExprType"];
    $$ = t_shapeExprType.ShapeOr;
    return $$;
  },

  "shapeExprType -> IT_ShapeNot"(): TysonTypeDictionary["shapeExprType"] {
    let $$: TysonTypeDictionary["shapeExprType"];
    $$ = t_shapeExprType.ShapeNot;
    return $$;
  },

  "shapeExprType -> IT_NodeConstraint"(): TysonTypeDictionary["shapeExprType"] {
    let $$: TysonTypeDictionary["shapeExprType"];
    $$ = t_shapeExprType.NodeConstraint;
    return $$;
  },

  "shapeExprType -> IT_Shape"(): TysonTypeDictionary["shapeExprType"] {
    let $$: TysonTypeDictionary["shapeExprType"];
    $$ = t_shapeExprType.Shape;
    return $$;
  },

  "shapeExprType -> IT_ShapeExternal"(): TysonTypeDictionary["shapeExprType"] {
    let $$: TysonTypeDictionary["shapeExprType"];
    $$ = t_shapeExprType.ShapeExternal;
    return $$;
  },

  "tripleExprType -> IT_EachOf"(): TysonTypeDictionary["tripleExprType"] {
    let $$: TysonTypeDictionary["tripleExprType"];
    $$ = t_tripleExprType.EachOf;
    return $$;
  },

  "tripleExprType -> IT_OneOf"(): TysonTypeDictionary["tripleExprType"] {
    let $$: TysonTypeDictionary["tripleExprType"];
    $$ = t_tripleExprType.OneOf;
    return $$;
  },

  "tripleExprType -> IT_TripleConstraint"(): TysonTypeDictionary["tripleExprType"] {
    let $$: TysonTypeDictionary["tripleExprType"];
    $$ = t_tripleExprType.TripleConstraint;
    return $$;
  },

  "valueType -> IT_IriStem"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.IriStem;
    return $$;
  },

  "valueType -> IT_IriStemRange"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.IriStemRange;
    return $$;
  },

  "valueType -> IT_LiteralStem"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.LiteralStem;
    return $$;
  },

  "valueType -> IT_LiteralStemRange"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.LiteralStemRange;
    return $$;
  },

  "valueType -> IT_Language"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.Language;
    return $$;
  },

  "valueType -> IT_LanguageStem"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.LanguageStem;
    return $$;
  },

  "valueType -> IT_LanguageStemRange"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.LanguageStemRange;
    return $$;
  },

  "valueType -> IT_Wildcard"(): TysonTypeDictionary["valueType"] {
    let $$: TysonTypeDictionary["valueType"];
    $$ = t_valueType.Wildcard;
    return $$;
  },

  "attribute -> IT_type"(): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = t_attribute.type;
    return $$;
  },

  "attribute -> IT_id"(): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = t_attribute.id;
    return $$;
  },

  "attribute -> IT_semActs"(): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = t_attribute.semActs;
    return $$;
  },

  "attribute -> IT_annotations"(): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = t_attribute.annotations;
    return $$;
  },

  "attribute -> IT_predicate"(): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = t_attribute.predicate;
    return $$;
  },

  "attribute -> schemaAttr"(
    $1: TysonTypeDictionary["schemaAttr"]
  ): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = $1;
    return $$;
  },

  "attribute -> shapeExprAttr"(
    $1: TysonTypeDictionary["shapeExprAttr"]
  ): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = $1;
    return $$;
  },

  "attribute -> tripleExprAttr"(
    $1: TysonTypeDictionary["tripleExprAttr"]
  ): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = $1;
    return $$;
  },

  "attribute -> valueSetValueAttr"(
    $1: TysonTypeDictionary["valueSetValueAttr"]
  ): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = $1;
    return $$;
  },

  "attribute -> semActAttr"(
    $1: TysonTypeDictionary["semActAttr"]
  ): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = $1;
    return $$;
  },

  "attribute -> annotationAttr"(
    $1: TysonTypeDictionary["annotationAttr"]
  ): TysonTypeDictionary["attribute"] {
    let $$: TysonTypeDictionary["attribute"];
    $$ = $1;
    return $$;
  },

  "schemaAttr -> GT_atContext"(): TysonTypeDictionary["schemaAttr"] {
    let $$: TysonTypeDictionary["schemaAttr"];
    $$ = t_schemaAttr.atContext;
    return $$;
  },

  "schemaAttr -> IT_startActs"(): TysonTypeDictionary["schemaAttr"] {
    let $$: TysonTypeDictionary["schemaAttr"];
    $$ = t_schemaAttr.startActs;
    return $$;
  },

  "schemaAttr -> IT_start"(): TysonTypeDictionary["schemaAttr"] {
    let $$: TysonTypeDictionary["schemaAttr"];
    $$ = t_schemaAttr.start;
    return $$;
  },

  "schemaAttr -> IT_imports"(): TysonTypeDictionary["schemaAttr"] {
    let $$: TysonTypeDictionary["schemaAttr"];
    $$ = t_schemaAttr.imports;
    return $$;
  },

  "schemaAttr -> IT_shapes"(): TysonTypeDictionary["schemaAttr"] {
    let $$: TysonTypeDictionary["schemaAttr"];
    $$ = t_schemaAttr.shapes;
    return $$;
  },

  "shapeExprAttr -> IT_shapeExprs"(): TysonTypeDictionary["shapeExprAttr"] {
    let $$: TysonTypeDictionary["shapeExprAttr"];
    $$ = t_shapeExprAttr.shapeExprs;
    return $$;
  },

  "shapeExprAttr -> IT_shapeExpr"(): TysonTypeDictionary["shapeExprAttr"] {
    let $$: TysonTypeDictionary["shapeExprAttr"];
    $$ = t_shapeExprAttr.shapeExpr;
    return $$;
  },

  "shapeExprAttr -> nodeConstraintAttr"(
    $1: TysonTypeDictionary["nodeConstraintAttr"]
  ): TysonTypeDictionary["shapeExprAttr"] {
    let $$: TysonTypeDictionary["shapeExprAttr"];
    $$ = $1;
    return $$;
  },

  "shapeExprAttr -> shapeAttr"(
    $1: TysonTypeDictionary["shapeAttr"]
  ): TysonTypeDictionary["shapeExprAttr"] {
    let $$: TysonTypeDictionary["shapeExprAttr"];
    $$ = $1;
    return $$;
  },

  "nodeConstraintAttr -> IT_nodeKind"(): TysonTypeDictionary["nodeConstraintAttr"] {
    let $$: TysonTypeDictionary["nodeConstraintAttr"];
    $$ = t_nodeConstraintAttr.nodeKind;
    return $$;
  },

  "nodeConstraintAttr -> IT_datatype"(): TysonTypeDictionary["nodeConstraintAttr"] {
    let $$: TysonTypeDictionary["nodeConstraintAttr"];
    $$ = t_nodeConstraintAttr.datatype;
    return $$;
  },

  "nodeConstraintAttr -> xsFacetAttr"(
    $1: TysonTypeDictionary["xsFacetAttr"]
  ): TysonTypeDictionary["nodeConstraintAttr"] {
    let $$: TysonTypeDictionary["nodeConstraintAttr"];
    $$ = $1;
    return $$;
  },

  "nodeConstraintAttr -> IT_values"(): TysonTypeDictionary["nodeConstraintAttr"] {
    let $$: TysonTypeDictionary["nodeConstraintAttr"];
    $$ = t_nodeConstraintAttr.values;
    return $$;
  },

  "xsFacetAttr -> stringFacetAttr"(
    $1: TysonTypeDictionary["stringFacetAttr"]
  ): TysonTypeDictionary["xsFacetAttr"] {
    let $$: TysonTypeDictionary["xsFacetAttr"];
    $$ = $1;
    return $$;
  },

  "xsFacetAttr -> numericFacetAttr"(
    $1: TysonTypeDictionary["numericFacetAttr"]
  ): TysonTypeDictionary["xsFacetAttr"] {
    let $$: TysonTypeDictionary["xsFacetAttr"];
    $$ = $1;
    return $$;
  },

  "stringFacetAttr -> IT_length"(): TysonTypeDictionary["stringFacetAttr"] {
    let $$: TysonTypeDictionary["stringFacetAttr"];
    $$ = t_stringFacetAttr.length;
    return $$;
  },

  "stringFacetAttr -> IT_minlength"(): TysonTypeDictionary["stringFacetAttr"] {
    let $$: TysonTypeDictionary["stringFacetAttr"];
    $$ = t_stringFacetAttr.minlength;
    return $$;
  },

  "stringFacetAttr -> IT_maxlength"(): TysonTypeDictionary["stringFacetAttr"] {
    let $$: TysonTypeDictionary["stringFacetAttr"];
    $$ = t_stringFacetAttr.maxlength;
    return $$;
  },

  "stringFacetAttr -> IT_pattern"(): TysonTypeDictionary["stringFacetAttr"] {
    let $$: TysonTypeDictionary["stringFacetAttr"];
    $$ = t_stringFacetAttr.pattern;
    return $$;
  },

  "stringFacetAttr -> IT_flags"(): TysonTypeDictionary["stringFacetAttr"] {
    let $$: TysonTypeDictionary["stringFacetAttr"];
    $$ = t_stringFacetAttr.flags;
    return $$;
  },

  "numericFacetAttr -> IT_mininclusive"(): TysonTypeDictionary["numericFacetAttr"] {
    let $$: TysonTypeDictionary["numericFacetAttr"];
    $$ = t_numericFacetAttr.mininclusive;
    return $$;
  },

  "numericFacetAttr -> IT_minexclusive"(): TysonTypeDictionary["numericFacetAttr"] {
    let $$: TysonTypeDictionary["numericFacetAttr"];
    $$ = t_numericFacetAttr.minexclusive;
    return $$;
  },

  "numericFacetAttr -> IT_maxinclusive"(): TysonTypeDictionary["numericFacetAttr"] {
    let $$: TysonTypeDictionary["numericFacetAttr"];
    $$ = t_numericFacetAttr.maxinclusive;
    return $$;
  },

  "numericFacetAttr -> IT_maxexclusive"(): TysonTypeDictionary["numericFacetAttr"] {
    let $$: TysonTypeDictionary["numericFacetAttr"];
    $$ = t_numericFacetAttr.maxexclusive;
    return $$;
  },

  "numericFacetAttr -> IT_totaldigits"(): TysonTypeDictionary["numericFacetAttr"] {
    let $$: TysonTypeDictionary["numericFacetAttr"];
    $$ = t_numericFacetAttr.totaldigits;
    return $$;
  },

  "numericFacetAttr -> IT_fractiondigits"(): TysonTypeDictionary["numericFacetAttr"] {
    let $$: TysonTypeDictionary["numericFacetAttr"];
    $$ = t_numericFacetAttr.fractiondigits;
    return $$;
  },

  "valueSetValueAttr -> IT_value"(): TysonTypeDictionary["valueSetValueAttr"] {
    let $$: TysonTypeDictionary["valueSetValueAttr"];
    $$ = t_valueSetValueAttr.value;
    return $$;
  },

  "valueSetValueAttr -> IT_language"(): TysonTypeDictionary["valueSetValueAttr"] {
    let $$: TysonTypeDictionary["valueSetValueAttr"];
    $$ = t_valueSetValueAttr.language;
    return $$;
  },

  "valueSetValueAttr -> IT_stem"(): TysonTypeDictionary["valueSetValueAttr"] {
    let $$: TysonTypeDictionary["valueSetValueAttr"];
    $$ = t_valueSetValueAttr.stem;
    return $$;
  },

  "valueSetValueAttr -> IT_exclusions"(): TysonTypeDictionary["valueSetValueAttr"] {
    let $$: TysonTypeDictionary["valueSetValueAttr"];
    $$ = t_valueSetValueAttr.exclusions;
    return $$;
  },

  "valueSetValueAttr -> IT_languageTag"(): TysonTypeDictionary["valueSetValueAttr"] {
    let $$: TysonTypeDictionary["valueSetValueAttr"];
    $$ = t_valueSetValueAttr.languageTag;
    return $$;
  },

  "shapeAttr -> IT_closed"(): TysonTypeDictionary["shapeAttr"] {
    let $$: TysonTypeDictionary["shapeAttr"];
    $$ = t_shapeAttr.closed;
    return $$;
  },

  "shapeAttr -> IT_extra"(): TysonTypeDictionary["shapeAttr"] {
    let $$: TysonTypeDictionary["shapeAttr"];
    $$ = t_shapeAttr.extra;
    return $$;
  },

  "shapeAttr -> IT_expression"(): TysonTypeDictionary["shapeAttr"] {
    let $$: TysonTypeDictionary["shapeAttr"];
    $$ = t_shapeAttr.expression;
    return $$;
  },

  "tripleExprAttr -> IT_expressions"(): TysonTypeDictionary["tripleExprAttr"] {
    let $$: TysonTypeDictionary["tripleExprAttr"];
    $$ = t_tripleExprAttr.expressions;
    return $$;
  },

  "tripleExprAttr -> IT_min"(): TysonTypeDictionary["tripleExprAttr"] {
    let $$: TysonTypeDictionary["tripleExprAttr"];
    $$ = t_tripleExprAttr.min;
    return $$;
  },

  "tripleExprAttr -> IT_max"(): TysonTypeDictionary["tripleExprAttr"] {
    let $$: TysonTypeDictionary["tripleExprAttr"];
    $$ = t_tripleExprAttr.max;
    return $$;
  },

  "tripleExprAttr -> tripleConstraintAttr"(
    $1: TysonTypeDictionary["tripleConstraintAttr"]
  ): TysonTypeDictionary["tripleExprAttr"] {
    let $$: TysonTypeDictionary["tripleExprAttr"];
    $$ = $1;
    return $$;
  },

  "tripleConstraintAttr -> IT_inverse"(): TysonTypeDictionary["tripleConstraintAttr"] {
    let $$: TysonTypeDictionary["tripleConstraintAttr"];
    $$ = t_tripleConstraintAttr.inverse;
    return $$;
  },

  "tripleConstraintAttr -> IT_valueExpr"(): TysonTypeDictionary["tripleConstraintAttr"] {
    let $$: TysonTypeDictionary["tripleConstraintAttr"];
    $$ = t_tripleConstraintAttr.valueExpr;
    return $$;
  },

  "semActAttr -> IT_name"(): TysonTypeDictionary["semActAttr"] {
    let $$: TysonTypeDictionary["semActAttr"];
    $$ = t_semActAttr.name;
    return $$;
  },

  "semActAttr -> IT_code"(): TysonTypeDictionary["semActAttr"] {
    let $$: TysonTypeDictionary["semActAttr"];
    $$ = t_semActAttr.code;
    return $$;
  },

  "annotationAttr -> IT_object"(): TysonTypeDictionary["annotationAttr"] {
    let $$: TysonTypeDictionary["annotationAttr"];
    $$ = t_annotationAttr.object;
    return $$;
  },

  "iri -> IRIREF"(
    $1: TysonTypeDictionary["IRIREF"]
  ): TysonTypeDictionary["iri"] {
    let $$: TysonTypeDictionary["iri"];
    $$ = new Iri(new URL($1.substr(1, $1.length - 2), yy.base).href);
    return $$;
  },

  "iri -> prefixedName"(
    $1: TysonTypeDictionary["prefixedName"]
  ): TysonTypeDictionary["iri"] {
    let $$: TysonTypeDictionary["iri"];
    $$ = $1;
    return $$;
  },

  "prefixedName -> PNAME_LN"(
    $1: TysonTypeDictionary["PNAME_LN"]
  ): TysonTypeDictionary["prefixedName"] {
    let $$: TysonTypeDictionary["prefixedName"];
    $$ = pnameToUrl($1, yy);
    return $$;
  },

  "prefixedName -> PNAME_NS"(
    $1: TysonTypeDictionary["PNAME_NS"]
  ): TysonTypeDictionary["prefixedName"] {
    let $$: TysonTypeDictionary["prefixedName"];
    $$ = pnameToUrl($1, yy);
    return $$;
  },
};
