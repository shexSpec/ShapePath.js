const Path = require('path')

const queryResults = [
  "http://instance.example/project1/img1.jpg",
  "http://instance.example/project1/spec3"
]

describe('spgrep script', () => {
  test('query data', () => {
    expect(JSON.parse(run(
      '../dist/spgrep.js',
      '-d', 'examples/issue/Issue2.ttl',
      '-m', '<http://instance.example/project1/Issue2>@<http://project.example/schema#Issue>',
      '@<http://project.example/schema#DiscItem>~<http://project.example/ns#href>'
        +',@<http://project.example/schema#Issue>'
        +'~<http://project.example/ns#spec>/valueExpr/shapeExprs'
        +'~<http://project.example/ns#href>',
      'examples/issue/Issue.json'
    )[0][0])).toEqual([
        "http://instance.example/project1/img1.jpg",
        "http://instance.example/project1/spec3"
    ])
  })
})

function run (... command: string[]): Array<Array<string>> {
  const exitErrorString = 'process.exit() was called.'
  const spy = jest.spyOn(console, 'log')
  jest.spyOn(process, 'exit').mockImplementationOnce(() => {
    throw new Error(exitErrorString)
  });

  const oldArgv = process.argv
  process.argv = [process.argv[0]].concat(command)
  expect(() => {
    require(command[0])
  }).toThrow(exitErrorString)
  process.argv = oldArgv

  const ret = spy.mock.calls
  expect(process.exit).toHaveBeenCalledWith(0)
  spy.mockRestore()
  return ret
}
