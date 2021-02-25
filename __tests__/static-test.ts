const Fs = require('fs')
const Path = require('path')
import { ShapePathParser } from '../ShapePathJison'

describe("ShapePathParser", () => {
  test("txt", () => {
    const yy = {
      base: new URL('file://' + __dirname),
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
              "r": "file:///home/eric/checkouts/shexSpec/ShapePath.js/S1"
            },
            {
              "t": "Assertion",
              // "l": {
              //   "t": "Path",
              //   "steps": [
              //     {
              //       "t": "Step",
              //       "selector": "length()"
              //     }
              //   ]
              // },
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "length",
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
              "r": "file:///home/eric/checkouts/shexSpec/ShapePath.js/p1"
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
              "r": "file:///home/eric/checkouts/shexSpec/ShapePath.js/S2"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "length",
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
              "r": "file:///home/eric/checkouts/shexSpec/ShapePath.js/S1"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "length",
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
              "r": "file:///home/eric/checkouts/shexSpec/ShapePath.js/p1"
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
              "r": "file:///home/eric/checkouts/shexSpec/ShapePath.js/S2"
            },
            {
              "t": "Assertion",
              "l": {
                "t": "Filter",
                "l": {
                  "l": "@@",
                  "op": "length",
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
