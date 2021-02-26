const Fs = require('fs')
const Path = require('path')
import { ShapePathParser } from '../ShapePathJison'
const Base = 'http://a.example/some/path/' // 'file://'+__dirname

describe("ShapePathParser", () => {
  test("txt", () => {
    const yy = {
      base: new URL(Base),
      prefixes: {
        '': 'http://a.example/default',
        bar: 'http://a.example/bar',
      }
    }
    const txt = Fs.readFileSync(Path.join(__dirname, '../txt'), "utf8")
    const parsed = new ShapePathParser(yy).parse(txt)
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
              "op": "equal",
              "r": "http://a.example/some/path/S1"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "count",
                  "t": "Filter",
                },
                "op": "equal",
                "r": 1
              }
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
              "op": "equal",
              "r": "http://a.example/some/path/p1"
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
              "op": "equal",
              "r": "http://a.example/some/path/S2"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "count",
                  "t": "Filter",
                },
                "op": "equal",
                "r": 1
              }
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
              "op": "equal",
              "r": "http://a.example/some/path/S1"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "count",
                  "r": "@@",
                  "t": "Filter",
                },
                "op": "equal",
                "r": 1
              }
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
              "op": "equal",
              "r": "http://a.example/some/path/p1"
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
              "op": "equal",
              "r": "http://a.example/some/path/S2"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "count",
                  "r": "@@",
                  "t": "Filter",
                },
                "op": "equal",
                "r": 1
              }
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
                  "t": "Filter",
                  "op": "index",
                  "l": 1,
                  "r": "@@"
                }
              ]
            },
            {
              "t": "Step",
              "selector": "*",
              "filters": [
                {
                  "t": "Filter",
                  "op": "index",
                  "l": 2,
                  "r": "@@"
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
                  "t": "Filter",
                  "op": "index",
                  "l": 2,
                  "r": "@@"
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
                  "t": "Filter",
                  "op": "index",
                  "l": 1,
                  "r": "@@"
                }
              ]
            },
            {
              "t": "Step",
              "selector": "*",
              "filters": [
                {
                  "t": "Filter",
                  "op": "index",
                  "l": 2,
                  "r": "@@"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
