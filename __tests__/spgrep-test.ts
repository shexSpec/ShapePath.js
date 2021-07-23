const Path = require('path')

const queryResults = [
  "http://instance.example/project1/img1.jpg",
  "http://instance.example/project1/spec3"
]

describe('spgrep script', () => {
  test('query data', () => {
    const {log, error} = run(
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

function run (... command: string[]):
{log:Array<Array<string>>, error:Array<Array<any>>}
{
  const exitErrorString = 'process.exit() was called.'
  const consoleLogSpy = jest.spyOn(console, 'log')
  const consoleErrorSpy = jest.spyOn(process.stderr, 'write')
  jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error(exitErrorString)
  });

  const oldArgv = process.argv
  process.argv = [process.argv[0]].concat(command)
  expect(() => {
    process.env._INCLUDE_DEPTH = '0'
    require(command[0])
  }).toThrow(exitErrorString)
  process.argv = oldArgv

  const ret = {
    log: consoleLogSpy.mock.calls,
    error: consoleErrorSpy.mock.calls,
  }
  // expect(process.exit).toHaveBeenCalledWith(0)
  consoleLogSpy.mockRestore()
  consoleErrorSpy.mockRestore()
  return ret
}
