#!/usr/bin/env ts-node
const Fs = require('fs')
import { Schema } from 'shexj'
import { ShapePathParser } from './ShapePathParser'
import { EvalContext, NodeSet } from './ShapePathAst'

const Base = 'file://' + __dirname

const { Command } = require('commander') // include commander in git clone of commander repo
const program = new Command()

let log = (...args: any) => { }

program
  .arguments('<pathStr> <files...>')
  .option('-r, --resolve <resolve.json>', 'JSON resolve file to use for URI resolution')
  .option('-H, --with-filename', 'Print the file name for each match.  This is the default when there is more than one file to search.')
  .option('-d, --debug', 'display some debugging')
  .action((pathStr: string, files: string[], command: any, commander: any) => {
    if (command.debug) {
      log = console.warn
      log('Executing %s with options %o on files %s', pathStr, command, files.join(','))
    }
    let yy = {
      base: new URL(Base),
      prefixes: {}
    }
    if (command.resolve) {
      yy = readJson(command.resolve)
      log('Loaded URI resolution spec from %s', command.resolve)
    }
    const pathExpr = new ShapePathParser(yy).parse(pathStr)
    log('%s compiles to %s', pathStr, JSON.stringify(pathExpr))
    files.forEach(filePath => {
      log('Executing %s on %s', pathStr, filePath)
      const schema: Schema = readJson(filePath)
      const inp: NodeSet = [schema]
      const leader = command['with-filename'] ? filePath + ': ' : ''

      const res: NodeSet = pathExpr.evalPathExpr(inp, new EvalContext(schema))
      console.log(leader + JSON.stringify(res, null, 2))
    })
  })

program.parse()

function readJson(filePath: string): any {
  return JSON.parse(Fs.readFileSync(filePath, 'utf8'))
}

