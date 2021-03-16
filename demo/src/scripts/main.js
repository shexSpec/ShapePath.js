import '../styles/main.scss';

import $ from 'jquery';
import _ from 'lodash';
import 'bootstrap';
import { EvalContext } from '../../../dist/ShapePathAst'
import { ShapePathParser, ShapePathLexer } from '../../../dist/ShapePathParser'
const ShExValidator = require('@shexjs/validator')
const ShExUtil = require('@shexjs/util')
const ShExTerm = require('@shexjs/term')
const ShExMap = require('@shexjs/map')
const ShapeMap = require('shape-map')
const MapModule = ShExMap(ShExTerm)
import { Store as RdfStore, Parser as TurtleParser } from 'n3'

ShapeMap.start = ShExValidator.start; // ShapeMap uses ShExValidator's start symbol.

const Base = 'http://a.example/some/path/' // 'file://'+__dirname

// ShapePath Online Evaluator
class ShapePathOnlineEvaluator {
  constructor() {
    this.updateShapePathResults = this.updateShapePathResults.bind(this);
    this.shexjEditor = ace.edit('shexj-editor');
    this.shexjEditor.setTheme('ace/theme/solarized_dark');
    this.shexjEditor.getSession().setMode('ace/mode/json');

    this.shapepathResultEditor = ace.edit('shapepath-results-editor');
    this.shapepathResultEditor.setTheme('ace/theme/solarized_dark');
    this.shapepathResultEditor.getSession().setMode('ace/mode/json');
    this.shapepathResultEditor.setReadOnly(true);

    $('#shape-path-input').on('input', this.updateShapePathResults);
    // $('#show-shape-path-ast').on('change', this.updateShapePathResults);
    this.shexjEditor.on('change', this.updateShapePathResults);

    this.updateQueryResults = this.updateQueryResults.bind(this);
    this.turtleEditor = ace.edit('turtle-editor');
    this.turtleEditor.setTheme('ace/theme/solarized_dark');
    // this.turtleEditor.getSession().setMode('ace/mode/plain');

    this.queryResultEditor = ace.edit('query-results-editor');
    this.queryResultEditor.setTheme('ace/theme/solarized_dark');
    // this.queryResultEditor.getSession().setMode('ace/mode/plain');
    this.queryResultEditor.setReadOnly(true);

    $('#shape-map-input').on('input', this.updateQueryResults);
    // $('#path-switch').on('change', this.updateQueryResults);
    this.shexjEditor.on('change', this.updateQueryResults);

    this.updateShapePathResults();
  }

  updateShapePathResults() {
    let schema;
    const shapePath = $('#shape-path-input').val();
    // const mode = $('#show-shape-path-ast').is(':checked') ? 'PATH' : 'VALUE';
    const shexjStr = this.shexjEditor.getValue();

    try {
      schema = JSON.parse(shexjStr.replace(/(\r\n|\n|\r)/gm, ''));
      $('#shape-area').removeClass('has-error');
      $('#shape-alert').text('');
    } catch (error) {
      this.shapepathResultEditor.getSession().setValue('Shape Parse Error');
      return;
    }

    // Resolve path against schema
    const inp = [schema]
    const yy = {
      base: new URL(Base),
      prefixes: {}
    }
    const pathExpr = new ShapePathParser(yy).parse(shapePath)
    const nodeSet = pathExpr.evalPathExpr(inp, new EvalContext(schema))

    if (!_.isEmpty(nodeSet)) {
      const ret = this.shapepathResultEditor.getSession()
            .setValue(JSON.stringify(nodeSet, undefined, 2));
      this.updateQueryResults(schema, nodeSet);
      return ret;
    } else {
      return this.shapepathResultEditor.getSession().setValue('No match');
    }
  }

  updateQueryResults(schema, nodeSet) {
    const turtleStr = this.turtleEditor.getValue();

    // Parse validation data.
    const graph = new RdfStore()
    graph.addQuads(new TurtleParser({baseIRI: Base}).parse(turtleStr))
    console.log(graph.getQuads())


    // Add ShExMap annotations to each element of the nodeSet.
    // ShExMap binds variables which we use to capture schema matches.
    const vars = nodeSet.map((shexNode) => {
      const varName = 'http://a.example/var' + nodeSet.indexOf(shexNode);
      // Pretend it's a TripleConstraint. Could be any shapeExpr or tripleExpr.
      shexNode.semActs = [{
        "type": "SemAct",
        "name": MapModule.url,
        "code": `<${varName}>`
      }]
      return varName
    })

    // Construct validator with ShapeMap semantic action handler.
    const validator = ShExValidator.construct(schema, ShExUtil.rdfjsDB(graph), {});
    const mapper = MapModule.register(validator, { ShExTerm })

    // Expect successful validation.
    const smapStr = $('#shape-map-input').val();
    const schemaMeta = {
      base: Base,
      prefixes: {}
    };
    const dataMeta = schemaMeta; // cheat 'cause we're not populating them
    const smap = ShapeMap.Parser.construct(Base, schemaMeta, dataMeta)
          .parse(smapStr);
    const valRes = validator.validate(smap)
    const resEditor = this.queryResultEditor.getSession();
    if ("errors" in valRes) {
      resEditor.setValue(JSON.stringify(valRes, undefined, 2))
      return 999;
    } else {
    // Compare to reference.
      const resultBindings = ShExUtil.valToExtension(valRes, MapModule.url);
      const ret = resEditor.setValue(JSON.stringify(resultBindings, undefined, 2));
      return ret;
    }
  }
}

$(() => {
  $('#shape-path-input').focus();
  return new ShapePathOnlineEvaluator();
});
