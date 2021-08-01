const Path = require('path')
import { RunCli } from '../tools/cli-runner'

describe('spgrep script', () => {
  test('query data', () => {
    const {log, error} = RunCli(
      '../dist/spgrep.js',
      '@<http://project.example/schema#DiscItem>~<http://project.example/ns#href>'
        +',@<http://project.example/schema#Issue>'
        +'~<http://project.example/ns#spec>/valueExpr/shapeExprs'
        +'~<http://project.example/ns#href>',
      'examples/issue/Issue.json'
    )
    expect(error).toEqual([])
    expect(JSON.parse(log[0][0])).toEqual([
      {
        "predicate": "http://project.example/ns#href",
        "type": "TripleConstraint",
        "valueExpr": {
          "nodeKind": "iri",
          "type": "NodeConstraint",
        },
      },
      {
        "predicate": "http://project.example/ns#href",
        "type": "TripleConstraint",
        "valueExpr": {
          "nodeKind": "iri",
          "type": "NodeConstraint",
        },
      },
    ])
  })
})

