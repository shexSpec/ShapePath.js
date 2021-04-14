#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const Fs = require('fs');
const ShapePathParser_1 = require("./ShapePathParser");
const ShapePathAst_1 = require("./ShapePathAst");
// data query
const ShExValidator = require('@shexjs/validator');
const ShExUtil = require('@shexjs/util');
const ShExTerm = require('@shexjs/term');
const ShExMap = require('@shexjs/map');
const ShapeMap = require('shape-map');
const MapModule = ShExMap(ShExTerm);
const n3_1 = require("n3");
const Base = 'file://' + __dirname;
const { Command } = require('commander'); // include commander in git clone of commander repo
let log = (...args) => { };
class QueryValidator {
    constructor(dataFile, shapeMap) {
        this.dataFile = dataFile;
        this.shapeMap = shapeMap;
        this.graph = readTurtle(dataFile);
    }
    query(schema, schemaNodes) {
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
                }];
            return varName;
        });
        // Construct validator with ShapeMap semantic action handler.
        const validator = ShExValidator.construct(schema, ShExUtil.rdfjsDB(this.graph), {});
        const mapper = MapModule.register(validator, { ShExTerm });
        try {
            // Validate data against schema.
            const schemaMeta = {
                base: Base,
                prefixes: {}
            };
            const dataMeta = schemaMeta; // cheat 'cause we're not populating them
            const smap = ShapeMap.Parser.construct(Base, schemaMeta, dataMeta)
                .parse(this.shapeMap);
            const valRes = validator.validate(smap);
            if ("errors" in valRes) {
                throw Error(JSON.stringify(valRes, undefined, 2));
            }
            else {
                // Show values extracted from data.
                const resultBindings = ShExUtil.valToExtension(valRes, MapModule.url);
                const values = vars.map(v => resultBindings[v]);
                console.log(JSON.stringify(values, undefined, 2));
            }
        }
        catch (e) {
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
    .parse();
function test() {
    run('@<http://project.example/schema#DiscItem>.<http://project.example/ns#href>,@<http://project.example/schema#Issue>.<http://project.example/ns#spec>/valueExpr/shapeExprs.<http://project.example/ns#href>', ['__tests__/issue/Issue.json'], {}, null);
    run('@<http://project.example/schema#DiscItem>.<http://project.example/ns#href>,@<http://project.example/schema#Issue>.<http://project.example/ns#spec>/valueExpr/shapeExprs.<http://project.example/ns#href>', ['__tests__/issue/Issue.json'], {
        data: '__tests__/issue/Issue2.ttl',
        shapeMap: '<http://instance.example/project1/Issue2>@<http://project.example/schema#Issue>'
    }, null);
}
function run(pathStr, files, command, commander) {
    if (command.debug) {
        log = console.warn;
        log('Executing %s with options %o on files %s', pathStr, command, files.join(','));
    }
    let yy = {
        base: new URL(Base),
        prefixes: {}
    };
    if (command.resolve) {
        yy = readJson(command.resolve);
        log('Loaded URI resolution spec from %s', command.resolve);
    }
    const querier = command.data && command.shapeMap
        ? new QueryValidator(command.data, command.shapeMap)
        : null;
    const pathExpr = new ShapePathParser_1.ShapePathParser(yy).parse(pathStr);
    log('%s compiles to %s', pathStr, JSON.stringify(pathExpr));
    files.forEach(filePath => {
        log('Executing %s on %s', pathStr, filePath);
        const schema = readJson(filePath);
        const leader = command['with-filename'] ? filePath + ': ' : '';
        const schemaNodes = pathExpr.evalPathExpr([schema], new ShapePathAst_1.EvalContext(schema));
        if (querier)
            querier.query(schema, schemaNodes);
        else
            console.log(leader + JSON.stringify(schemaNodes, null, 2));
    });
}
exports.run = run;
function readJson(filePath) {
    return JSON.parse(Fs.readFileSync(filePath, 'utf8'));
}
function readTurtle(filePath) {
    const graph = new n3_1.Store();
    const turtleStr = Fs.readFileSync(filePath, 'utf8');
    const parser = new n3_1.Parser({ baseIRI: 'http://a.example/' });
    graph.addQuads(parser.parse(turtleStr));
    return graph;
}
