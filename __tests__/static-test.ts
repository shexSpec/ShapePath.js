const Fs = require('fs')
const Path = require('path')
import { ShapePathParser } from '../src/ShapePathParser'
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
    const txt = Fs.readFileSync(Path.join(__dirname, 'spz/shortcuts.sp'), "utf8")
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
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "Step",
                      "selector": "id"
                    }
                  ]
                },
                "http://a.example/some/path/S1"
              ]
            },
            {
              "t": "Assertion",
              "expect": {
                "t": "Filter",
                "op": "equal",
                "args": [
                  {
                    "t": "Filter",
                    "op": "count",
                    "args": [
                    ]
                  },
                  1
                ]
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
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "Step",
                      "selector": "predicate"
                    }
                  ]
                },
                "http://a.example/some/path/p1"
              ]
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
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "Step",
                      "selector": "id"
                    }
                  ]
                },
                "http://a.example/some/path/S2"
              ]
            },
            {
              "t": "Assertion",
              "expect": {
                "t": "Filter",
                "op": "equal",
                "args": [
                  {
                    "t": "Filter",
                    "op": "count",
                    "args": [
                    ]
                  },
                  1
                ]
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
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "Step",
                      "selector": "id"
                    }
                  ]
                },
                "http://a.example/some/path/S1"
              ]
            },
            {
              "t": "Assertion",
              "expect": {
                "t": "Filter",
                "op": "equal",
                "args": [
                  {
                    "t": "Filter",
                    "op": "count",
                    "args": [
                    ]
                  },
                  1
                ]
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
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "Step",
                      "selector": "predicate"
                    }
                  ]
                },
                "http://a.example/some/path/p1"
              ]
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
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "Step",
                      "selector": "id"
                    }
                  ]
                },
                "http://a.example/some/path/S2"
              ]
            },
            {
              "t": "Assertion",
              "expect": {
                "t": "Filter",
                "op": "equal",
                "args": [
                  {
                    "t": "Filter",
                    "op": "count",
                    "args": [
                    ]
                  },
                  1
                ]
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
                  "args": [
                    1,
                  ]
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
                  "args": [
                    2,
                  ]
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
                  "args": [
                    2,
                  ]
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
                  "args": [
                    1,
                  ]
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
                  "args": [
                    2,
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
