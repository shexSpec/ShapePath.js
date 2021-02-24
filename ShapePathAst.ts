export abstract class Junction {
  abstract t: string
  constructor(
    public exprs: Array<Path | Intersection | Union>
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
export enum axes {
  thisShapeExpr, thisTripleExpr
}
export enum selectors {
  shapes = 'shapes',
  Any = '*',
  id = 'id',
  Shape = 'Shape',
  expression = 'expression',
  TripleConstraint = 'TripleConstraint',
  predicate = 'predicate',
  ShapeAnd = 'ShapeAnd',
  ShapeOr = 'ShapeOr',
  F_length = 'length()',
}
export class Step {
  t = 'Step'
  constructor(
    public selector: selectors | string,
    public axis?: axes | string,
    public filters?: any
  ) { }
}

export function shapeLabelShortCut(label: string) {
  debugger
  return [
    {
      "t": "Step",
      "selector": "shapes"
    },
    {
      "t": "Step",
      "selector": "*",
      "filters": [
        {
          "t": "Filter",
          "l": new Path([
            new Step(selectors.id)
          ]),
          "op": "=",
          "r": label
        },
        {
          "t": "Assertion",
          "l": new Path([
            new Step(selectors.F_length)
          ]),
          "op": "=",
          "r": "1"
        }
      ]
    }
  ];
}

export function predicateShortCut(label: string) {
  return [
    {
      "t": "Step",
      "axis": "thisShapeExpr::",
      "selector": "Shape"
    },
    {
      "t": "Step",
      "selector": "expression"
    },
    {
      "t": "Step",
      "axis": "thisTripleExpr::",
      "selector": "TripleConstraint",
      "filters": [
        {
          "t": "Filter",
          "l": new Path([
            new Step(selectors.predicate)
          ]),
          "op": "=",
          "r": label
        }
      ]
    }
  ];
}
