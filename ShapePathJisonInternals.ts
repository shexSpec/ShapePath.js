/** parser internals not needed after ShapePaths are parsed
 *
 */

import { FuncName, Filter, Assertion, Path, Step, Axis, t_attribute, t_schemaAttr, t_Selector, t_shapeExprType, t_shapeAttr, t_tripleExprType } from './ShapePathAst'

export type rvalue = number | URL
export interface comparison {
  op: FuncName;
  r: rvalue | null
}

export function shapeLabelShortCut(label: URL) {
  debugger
  return [
    new Step(t_schemaAttr.shapes),
    new Step(t_Selector.Any, undefined, [
      new Filter(FuncName.equal, [
        new Path([new Step(t_attribute.id)]),
        label
      ]),
      new Assertion(
        new Filter(FuncName.equal, [
          new Filter(FuncName.count, []),
          1
        ])
      )
    ])
  ]
}


export function predicateShortCut(label: URL) {
  return [
    new Step(t_shapeExprType.Shape, Axis.thisShapeExpr),
    new Step(t_shapeAttr.expression),
    new Step(
      t_tripleExprType.TripleConstraint,
      Axis.thisTripleExpr,
      [
        new Filter(FuncName.equal, [
          new Path([new Step(t_attribute.predicate)]),
          label
        ])
      ]
    )
  ];
}

