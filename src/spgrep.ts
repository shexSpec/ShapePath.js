#!/usr/bin/env ts-node
const Fs = require('fs')
import { Schema } from 'shexj'
import { ShapePathParser } from './ShapePathParser'
import { EvalContext, NodeSet } from './ShapePathAst'

// data query
const ShExValidator = require('@shexjs/validator')
const ShExUtil = require('@shexjs/util')
const ShExTerm = require('@shexjs/term')
const ShExMap = require('@shexjs/extension-map')
const ShapeMap = require('shape-map')
const MapModule = ShExMap(ShExTerm)
import { Store as RdfStore, Parser as TurtleParser } from 'n3'


const Base = 'file://' + __dirname

const { Command } = require('commander') // include commander in git clone of commander repo

let log = (...args: any) => { }

class QueryValidator {
  graph: any
  constructor (
    public dataFile: string,
    public shapeMap: string
  ) {
    this.graph = readTurtle(dataFile)
  }
  query (schema: Schema, schemaNodes: NodeSet) {
    // Add ShExMap annotations to each element of the nodeSet.
    // ShExMap binds variables which we use to capture schema matches.
    const vars = schemaNodes.map((shexNode) => {
      const idx = schemaNodes.indexOf(shexNode); // first occurance of shexNode
      const varName = 'http://a.example/binding-' + idx;
      // Pretend it's a TripleConstraint. Could be any shapeExpr or tripleExpr.
      // @ts-ignore
      shexNode.semActs = [{
        "type": "SemAct",
        "name": MapModule.url,
        "code": `<${varName}>`
      }]
      return varName
    })

    // Construct validator with ShapeMap semantic action handler.
    const validator = ShExValidator.construct(schema, ShExUtil.rdfjsDB(this.graph), {});
    const mapper = MapModule.register(validator, { ShExTerm })

    try {
      // Validate data against schema.
      const schemaMeta = {
        base: Base,
        prefixes: {}
      };
      const dataMeta = schemaMeta; // cheat 'cause we're not populating them
      const smap = ShapeMap.Parser.construct(Base, schemaMeta, dataMeta)
        .parse(this.shapeMap);
      const valRes = validator.validate(smap)
      if ("errors" in valRes) {
        throw Error(JSON.stringify(valRes, undefined, 2))
      } else {
        // Show values extracted from data.
        const resultBindings = ShExUtil.valToExtension(valRes, MapModule.url);
        const values = vars.map(v => resultBindings[v])
        console.log(JSON.stringify(values, undefined, 2));
      }
    } catch (e) {
      if (e instanceof Error)
        throw e;
      throw Error(String(e));
    }
  }
}

new Command()
  .arguments('<pathStr> <files...>')
  .option('-r, --resolve <resolve.json>', 'JSON resolve file to use for URI resolution')
  .option('-H, --with-filename', 'Print the file name for each match.  This is the default when there is more than one file to search.')
  .option('-D, --debug', 'display some debugging')
  .option('-d, --data <dataFile>', 'data file')
  .option('-m, --shape-map <shapeMap>', 'shape map')
  .action(run)
  .parse()

function test (): void {
  run(
    '@<http://project.example/schema#DiscItem>~<http://project.example/ns#href>,@<http://project.example/schema#Issue>~<http://project.example/ns#spec>/valueExpr/shapeExprs~<http://project.example/ns#href>',
    ['examples/issue/Issue.json'],
    { },
    null
  )
  run(
    '@<http://project.example/schema#DiscItem>~<http://project.example/ns#href>,@<http://project.example/schema#Issue>~<http://project.example/ns#spec>/valueExpr/shapeExprs~<http://project.example/ns#href>',
    ['examples/issue/Issue.json'],
    {
      data: 'examples/issue/Issue2.ttl',
      shapeMap: '<http://instance.example/project1/Issue2>@<http://project.example/schema#Issue>'
    },
    null
  )
}

export function run (pathStr: string, files: string[], command: any, commander: any) {
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
  const querier = command.data && command.shapeMap
    ? new QueryValidator(command.data, command.shapeMap)
    : null

  const pathExpr = new ShapePathParser(yy).parse(pathStr)
  log('%s compiles to %s', pathStr, JSON.stringify(pathExpr))
  files.forEach(filePath => {
    log('Executing %s on %s', pathStr, filePath)
    const schema: Schema = readJson(filePath)
    const leader = command['with-filename'] ? filePath + ': ' : ''

    const schemaNodes: NodeSet = pathExpr.evalPathExpr([schema], new EvalContext(schema))
    if (querier)
      querier.query(schema, schemaNodes)
    else
      console.log(leader + JSON.stringify(schemaNodes, null, 2))
  })
  process.exit(0)
}

function readJson(filePath: string): any {
  return JSON.parse(Fs.readFileSync(filePath, 'utf8'))
}

function readTurtle(filePath: string): any {
  const graph = new RdfStore()
  const turtleStr = Fs.readFileSync(filePath, 'utf8')
  const parser = new TurtleParser({baseIRI: 'http://a.example/'})
  graph.addQuads(parser.parse(turtleStr))
  return graph
}

