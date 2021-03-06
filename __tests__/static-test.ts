const Fs = require('fs')
const Path = require('path')
import { ShapePathParser, ShapePathLexer } from '../src/ShapePathParser'
const Base = 'http://a.example/some/path/' // 'file://'+__dirname



function parse(text: string): object {
  const yy = {
    base: new URL(Base),
    prefixes: {
      '': 'http://a.example/default',
      pre: 'http://a.example/pre',
    }
  }
  const parsed = new ShapePathParser(yy).parse(text)
  const stripped = JSON.parse(JSON.stringify(parsed))
  return stripped
}

describe('parser coverage', () => {
  test('junction', () => {
    parse('/*, /* union /* intersection /*')
  })
  test('separator', () => {
    parse('/*, //*, */*, *//*')
  })
  test('shortcut', () => {
    parse('@<i>, .<i>')
  })
  test('axes', () => {
    parse('child::*, thisShapeExpr::, thisTripleExpr::, self::, parent::, ancestor::')
  })
  test('axis type', () => {
    parse('thisShapeExpr::Shape')
  })
  test('function', () => {
    parse('*[index() = 1], *[count()], *[foo1(<n>) = <n>], *[foo2(<n>) = <n>], *[foo2(1) = 1], *[foo2(1 <n>) = 1]')
  })
  test('assert', () => {
    parse('*[assert index() = 1]')
  })
  test('numericExpr', () => {
    parse('*[1]')
  })
  test('comparison', () => {
    parse('*[assert index() = 1], *[assert index() < 1], *[assert index() > 1]')
  })
  test('termType', () => {
    parse('Schema, SemAct, Annotation')
  })
  test('shapeExprType', () => {
    parse('ShapeAnd, ShapeOr, ShapeNot, NodeConstraint, Shape, ShapeExternal')
  })
  test('tripleExprType', () => {
    parse('EachOf, OneOf, TripleConstraint')
  })
  test('valueType', () => {
    parse('IriStem, IriStemRange')
    parse('LiteralStem, LiteralStemRange')
    parse('Language, LanguageStem, LanguageStemRange')
    parse('Wildcard')
  })
  test('attributeType', () => {
    parse('type, id, semActs, annotations, predicate')
  })
  test('schemaAttr', () => {
    parse('@context, startActs, start, imports, shapes')
  })
  test('shapeExprAttr', () => {
    parse('shapeExprs, shapeExpr')
  })
  test('nodeConstraintAttr', () => {
    parse('nodeKind, datatype, values')
  })
  test('stringFacetAttr', () => {
    parse('length, minlength, maxlength, pattern, flags')
  })
  test('numericFacetAttr', () => {
    parse('mininclusive,  minexclusive, maxinclusive,  maxexclusive, totaldigits, fractiondigits')
  })
  test('valueSetValueAttr', () => {
    parse('value, language, language, stem, exclusions, languageTag')
  })
  test('shapeAttr', () => {
    parse('closed, extra, expression')
  })
  test('tripleExprAttr', () => {
    parse('expressions, min, max')
  })
  test('tripleConstraintAttr', () => {
    parse('inverse, valueExpr')
  })
  test('semActAttr', () => {
    parse('name, code')
  })
  test('annotationAttr', () => {
    parse('object')
  })
  test('prefixedName', () => {
    parse('*[id = :lname], *[id = pre:], *[id = pre:lname]')
  })
  test('values', () => {
    parse('*[id = <i>], *[id = 123]')
  })
  test('PathExprStep', () => {
    parse('(*, *), (*, *)[id = 123]')
  })

  test('lexer', () => {
    const l = new ShapePathLexer()
    l.setInput('*', {})
    expect(l.lex()).toBeGreaterThan(0)
    expect(l.lex()).toBeGreaterThan(0) // why two tokens?
    expect(l.lex()).toEqual(1) // EOF
  })
})

describe('parser errors', () => {
  test('missing namespace', () => {
    expect(() => {
      parse('*[id = pre999:lname]')
    }).toThrow('unknown prefix in pre999:lname')
  })
  test('unexpected word', () => {
    expect(() => {
      parse('asdf')
    }).toThrow(/unexpected word "asdf"/)
  })
  test('invalid character %', () => {
    expect(() => {
      parse('%123')
    }).toThrow('invalid character %')
  })
  test('invalid character %', () => {
    expect(() => {
      new ShapePathParser().parse('*[id = pre:lname]')
    }).toThrow('Cannot use \'in\' operator to search for \'pre\' in undefined')
  })
})

function parseFile(filename: string): object {
  const txt = Fs.readFileSync(Path.join(__dirname, filename), 'utf8')
  return parse(txt)
}

describe('ShapePathParser', () => {
  test('shortcuts', () => {
    expect(parseFile('spz/shortcuts.sp')).toEqual(Ref1)
  })
})

const Ref1 = {
  "t": "Union",
  "exprs": [
    {
      "t": "Path",
      "steps": [
        {
          "t": "ChildStep",
          "attribute": "shapes"
        },
        {
          "t": "ChildStep",
          "attribute": "*",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "id"
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
          "t": "AxisStep",
          "axis": "thisShapeExpr::",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "type"
                    }
                  ]
                },
                "Shape"
              ]
            }
          ]
        },
        {
          "t": "ChildStep",
          "attribute": "expression"
        },
        {
          "t": "AxisStep",
          "axis": "thisTripleExpr::",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "type"
                    }
                  ]
                },
                "TripleConstraint"
              ]
            },
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "predicate"
                    }
                  ]
                },
                "http://a.example/some/path/p1"
              ]
            }
          ]
        },
        {
          "t": "ChildStep",
          "attribute": "shapes"
        },
        {
          "t": "ChildStep",
          "attribute": "*",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "id"
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
          "t": "ChildStep",
          "attribute": "shapes"
        },
        {
          "t": "ChildStep",
          "attribute": "*",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "id"
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
          "t": "AxisStep",
          "axis": "thisShapeExpr::",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "type"
                    }
                  ]
                },
                "Shape"
              ]
            }
          ]
        },
        {
          "t": "ChildStep",
          "attribute": "expression"
        },
        {
          "t": "AxisStep",
          "axis": "thisTripleExpr::",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "type"
                    }
                  ]
                },
                "TripleConstraint"
              ]
            },
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "predicate"
                    }
                  ]
                },
                "http://a.example/some/path/p1"
              ]
            }
          ]
        },
        {
          "t": "ChildStep",
          "attribute": "shapes"
        },
        {
          "t": "ChildStep",
          "attribute": "*",
          "filters": [
            {
              "t": "Filter",
              "op": "equal",
              "args": [
                {
                  "t": "Path",
                  "steps": [
                    {
                      "t": "ChildStep",
                      "attribute": "id"
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
              "t": "ChildStep",
              "attribute": "shapes"
            },
            {
              "t": "ChildStep",
              "attribute": "*",
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
              "t": "ChildStep",
              "attribute": "*",
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
              "t": "ChildStep",
              "attribute": "shapes"
            },
            {
              "t": "ChildStep",
              "attribute": "*",
              "filters": [
                {
                  "t": "Filter",
                  "op": "equal",
                  "args": [
                    {
                      "t": "Path",
                      "steps": [
                        {
                          "t": "ChildStep",
                          "attribute": "type"
                        }
                      ]
                    },
                    "ShapeAnd"
                  ]
                },
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
              "t": "ChildStep",
              "attribute": "*",
              "filters": [
                {
                  "t": "Filter",
                  "op": "equal",
                  "args": [
                    {
                      "t": "Path",
                      "steps": [
                        {
                          "t": "ChildStep",
                          "attribute": "type"
                        }
                      ]
                    },
                    "ShapeOr"
                  ]
                },
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
              "t": "ChildStep",
              "attribute": "*",
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
