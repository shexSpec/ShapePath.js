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
  test('separator', () => {
    parse('/* union //* union */* union *//*')
  })
  test('shortcut', () => {
    parse('@<i> union .<i>')
  })
  test('axes', () => {
    parse('child::* union thisShapeExpr::* union thisTripleExpr::* union self::* union parent::* union ancestor::*')
  })
  test('function', () => {
    parse('*[index() = 1] union *[count()] union *[foo1(<n>) = <n>] union *[foo2(<n>) = <n>] union *[foo2(1) = 1] union *[foo2(1 <n>) = 1]')
  })
  test('assert', () => {
    parse('*[assert index() = 1]')
  })
  test('comparison', () => {
    parse('*[assert index() = 1] union *[assert index() < 1] union *[assert index() > 1]')
  })
  test('termType', () => {
    parse('Schema union SemAct union Annotation')
  })
  test('shapeExprType', () => {
    parse('ShapeAnd union ShapeOr union ShapeNot union NodeConstraint union Shape union ShapeExternal')
  })
  test('tripleExprType', () => {
    parse('EachOf union OneOf union TripleConstraint')
  })
  test('valueType', () => {
    parse('IriStem union IriStemRange')
    parse('LiteralStem union LiteralStemRange')
    parse('Language union LanguageStem union LanguageStemRange')
    parse('Wildcard')
  })
  test('attributeType', () => {
    parse('type union id union semActs union annotations union predicate')
  })
  test('schemaAttr', () => {
    parse('@context union startActs union start union imports union shapes')
  })
  test('shapeExprAttr', () => {
    parse('shapeExprs union shapeExpr')
  })
  test('nodeConstraintAttr', () => {
    parse('nodeKind union datatype union values')
  })
  test('stringFacetAttr', () => {
    parse('length union minlength union maxlength union pattern union flags')
  })
  test('numericFacetAttr', () => {
    parse('mininclusive union  minexclusive union maxinclusive union  maxexclusive union totaldigits union fractiondigits')
  })
  test('valueSetValueAttr', () => {
    parse('value union language union language union stem union exclusions union languageTag')
  })
  test('shapeAttr', () => {
    parse('closed union extra union expression')
  })
  test('tripleExprAttr', () => {
    parse('expressions union min union max')
  })
  test('tripleConstraintAttr', () => {
    parse('inverse union valueExpr')
  })
  test('semActAttr', () => {
    parse('name union code')
  })
  test('annotationAttr', () => {
    parse('object')
  })
  test('prefixedName', () => {
    parse('*[self::* = :lname] union *[self::* = pre:] union *[self::* = pre:lname]')
  })
  test('values', () => {
    parse('*[self::* = <i>] union *[self::* = 123]')
  })
  // test('PathExprStep', () => {
  //   parse('(* union *)[self::* = 123]')
  // })

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
      parse('*[self::* = pre999:lname]')
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
      new ShapePathParser().parse('*[self::* = pre:lname]')
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
