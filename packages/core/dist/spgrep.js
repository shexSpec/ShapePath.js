#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.report = exports.cmd = exports.log = void 0;
const Fs = require('fs');
const ShapePathParser_1 = require("./ShapePathParser");
const ShapePathAst_1 = require("./ShapePathAst");
const Base = 'file://' + __dirname;
const { Command } = require('commander'); // include commander in git clone of commander repo
let log = (...args) => { };
exports.log = log;
exports.cmd = new Command()
    .arguments('<pathStr> <files...>')
    .option('-r, --resolve <resolve.json>', 'JSON resolve file to use for URI resolution')
    .option('-H, --with-filename', 'Print the file name for each match.  This is the default when there is more than one file to search.')
    .option('-D, --debug', 'display some debugging');
if (require.main === module || process.env._INCLUDE_DEPTH === '0') {
    // test() // uncomment to run a basic test
    exports.cmd.action(report).parse();
    process.exit(0);
}
function test() {
    console.log(run('@<http://project.example/schema#DiscItem>'
        + '~<http://project.example/ns#href>'
        + ',@<http://project.example/schema#Issue>'
        + '~<http://project.example/ns#spec>/valueExpr/shapeExprs'
        + '~<http://project.example/ns#href>', ['examples/issue/Issue.json'], {}, null)[0][2]);
}
function report(pathStr, files, command, commander) {
    run(pathStr, files, command, commander).forEach(([leader, schema, schemaNodes]) => {
        console.log(leader + JSON.stringify(schemaNodes, null, 2));
    });
}
exports.report = report;
function run(pathStr, files, command, commander) {
    if (command.debug) {
        exports.log = console.warn;
        (0, exports.log)('Executing %s with options %o on files %s', pathStr, command, files.join(','));
    }
    let yy = {
        base: new URL(Base),
        prefixes: {}
    };
    if (command.resolve) {
        yy = readJson(command.resolve);
        (0, exports.log)('Loaded URI resolution spec from %s', command.resolve);
    }
    const pathExpr = new ShapePathParser_1.ShapePathParser(yy).parse(pathStr);
    (0, exports.log)('%s compiles to %s', pathStr, JSON.stringify(pathExpr));
    return files.map(filePath => {
        (0, exports.log)('Executing %s on %s', pathStr, filePath);
        const schema = readJson(filePath);
        const leader = command['with-filename'] ? filePath + ': ' : '';
        const schemaNodes = pathExpr.evalPathExpr([schema], new ShapePathAst_1.EvalContext(schema));
        return [leader, schema, schemaNodes];
    });
}
exports.run = run;
function readJson(filePath) {
    return JSON.parse(Fs.readFileSync(filePath, 'utf8'));
}
//# sourceMappingURL=spgrep.js.map