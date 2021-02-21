const Fs = require('fs')
const Path = require('path')
import { ShapePathParser } from '../ShapePathJison'

describe("ShapePathParser", () => {
  test("txt", () => {
    const txt = Fs.readFileSync(Path.join(__dirname, '../txt'), "utf8")
    const parsed = new ShapePathParser().parse(txt)
    const stripped = JSON.parse(JSON.stringify(parsed))
    expect(stripped).toEqual(Ref1)
  })
})

const Ref1 = {
  "t": "Union",
  "exprs": [
    {
      "t": "Path",
      "steps": [
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
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "id"
                  }
                ]
              },
              "op": "=",
              "r": "<S1>"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "length()"
                  }
                ]
              },
              "op": "=",
              "r": "1"
            }
          ]
        },
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
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "predicate"
                  }
                ]
              },
              "op": "=",
              "r": "<p1>"
            }
          ]
        },
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
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "id"
                  }
                ]
              },
              "op": "=",
              "r": "<S2>"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "length()"
                  }
                ]
              },
              "op": "=",
              "r": "1"
            }
          ]
        }
      ]
    },
    {
      "t": "Path",
      "steps": [
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
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "id"
                  }
                ]
              },
              "op": "=",
              "r": "<S1>"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "length()"
                  }
                ]
              },
              "op": "=",
              "r": "1"
            }
          ]
        },
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
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "predicate"
                  }
                ]
              },
              "op": "=",
              "r": "<p1>"
            }
          ]
        },
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
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "id"
                  }
                ]
              },
              "op": "=",
              "r": "<S2>"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Path",
                "steps": [
                  {
                    "t": "Step",
                    "selector": "length()"
                  }
                ]
              },
              "op": "=",
              "r": "1"
            }
          ]
        }
      ]
    },
    {
      "t": "Intersection",
      "exprs": [
        {
          "t": "Path",
          "steps": [
            {
              "t": "Step",
              "selector": "shapes"
            },
            {
              "t": "Step",
              "selector": "*",
              "filters": [
                {
                  "index": "1"
                }
              ]
            },
            {
              "t": "Step",
              "selector": "*",
              "filters": [
                {
                  "index": "2"
                }
              ]
            }
          ]
        },
        {
          "t": "Path",
          "steps": [
            {
              "t": "Step",
              "selector": "shapes"
            },
            {
              "t": "Step",
              "selector": "ShapeAnd",
              "filters": [
                {
                  "index": "2"
                }
              ]
            }
          ]
        },
        {
          "t": "Path",
          "steps": [
            {
              "t": "Step",
              "selector": "ShapeOr",
              "filters": [
                {
                  "index": "1"
                }
              ]
            },
            {
              "t": "Step",
              "selector": "*",
              "filters": [
                {
                  "index": "2"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
