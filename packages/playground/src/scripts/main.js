import '../styles/main.scss';

import $ from 'jquery';

const Yaml = require('js-yaml')
import { Ast, Parser } from 'shape-path-core' // shape-path-core'
const ShapeMap = require('shape-map')
const ShExUtil = require('@shexjs/util')
const SPQuery = require('@shexjs/shape-path-query');
import { Store as RdfStore, Parser as TurtleParser } from 'n3'

const Base = 'http://a.example/some/path/' // 'file://'+__dirname
let Me = null

// ShapePath Online Evaluator
class ShapePathOnlineEvaluator {
  constructor() {Me = this
    this.schema = { type: "Schema" };
    this.nodeSet = [];

    this.updateShapePathResults = this.updateShapePathResults.bind(this);
    this.updateQueryResults = this.updateQueryResults.bind(this);

    this.shexjEditor = ace.edit('shexj-editor');
    this.shexjEditor.setTheme('ace/theme/solarized_dark');
    this.shexjEditor.getSession().setMode('ace/mode/json');

    this.shapepathResultEditor = ace.edit('shapepath-results-editor');
    this.shapepathResultEditor.setTheme('ace/theme/solarized_dark');
    this.shapepathResultEditor.getSession().setMode('ace/mode/json');
    this.shapepathResultEditor.setReadOnly(true);

    $('#shape-path-input').on('input', this.updateShapePathResults);
    $('#show-shape-path-ast').on('change', this.updateShapePathResults);
    this.shexjEditor.on('change', this.updateShapePathResults);

    this.turtleEditor = ace.edit('turtle-editor');
    this.turtleEditor.setTheme('ace/theme/solarized_dark');
    // this.turtleEditor.getSession().setMode('ace/mode/plain');

    this.queryResultEditor = ace.edit('query-results-editor');
    this.queryResultEditor.setTheme('ace/theme/solarized_dark');
    // this.queryResultEditor.getSession().setMode('ace/mode/plain');
    this.queryResultEditor.setReadOnly(true);

    $('#shape-map-input').on('input', this.updateQueryResults);
    $('#show-parsed-triples').on('change', this.updateQueryResults);
    this.turtleEditor.on('change', this.updateQueryResults);

    this.updateShapePathResults();
  }

  updateShapePathResults() { // one early return
    let currentAction;
    document.querySelector('#shapepath-results-editor').classList.remove('error');
    const shapepathResultsSession = this.shapepathResultEditor.getSession();

    try {
      currentAction = 'Parsing ShapePath';
      const shapePath = $('#shape-path-input').val();
      const yy = {
        base: new URL(Base),
        prefixes: {}
      }
      const pathExpr = new Parser.ShapePathParser(yy).parse(shapePath)
      if ($('#show-shape-path-ast').is(':checked')) {
        shapepathResultsSession.setValue(JSON.stringify(pathExpr, null, 2));
      } else {

        const shexjStr = this.shexjEditor.getValue();

        try {
          this.schema = JSON.parse(shexjStr.replace(/(\r\n|\n|\r)/gm, ''));
          $('#shape-area').removeClass('has-error');
          $('#shape-alert').text('');
        } catch (error) {
          shapepathResultsSession.setValue('Shape Parse Error');
          return;
        }

        // Resolve path against schema
        const inp = [this.schema];
        this.nodeSet = pathExpr.evalPathExpr(inp, new Ast.EvalContext(this.schema))

        if (this.nodeSet.length === 0) {
          shapepathResultsSession.setValue('No match');
        } else {
          shapepathResultsSession
            .setValue(JSON.stringify(this.nodeSet, undefined, 2));
          this.updateQueryResults(this.schema, this.nodeSet);
        }
      }
    } catch (e) {
      const errorMessage = 'Error while ' + currentAction + String(e);
      console.error(new Date().toISOString() + ' ' + (typeof e === 'object' && 'stack' in e ? e.stack : errorMessage));
      document.querySelector('#shapepath-results-editor').classList.add('error');
      shapepathResultsSession.setValue(errorMessage);
    }
  }

  updateQueryResults() {
    let currentAction;
    document.querySelector('#query-results-editor').classList.remove('error');
    const queryResultsSession = this.queryResultEditor.getSession();
    const turtleStr = this.turtleEditor.getValue();

    // Parse validation data.
    const graph = new RdfStore()
    try {
      currentAction = 'Parsing Turtle';
      graph.addQuads(new TurtleParser({baseIRI: Base}).parse(turtleStr))
      if ($('#show-parsed-triples').is(':checked')) {
        queryResultsSession.setValue(graph.getQuads().map(ntriplify).join('\n'));
      } else {
        currentAction = 'Parsing ShapeMap';
        const smapStr = $('#shape-map-input').val();
        const schemaMeta = {
          base: Base,
          prefixes: {}
        };
        const dataMeta = schemaMeta; // cheat 'cause we're not populating them
        const smap = ShapeMap.Parser.construct(Base, schemaMeta, dataMeta)
              .parse(smapStr);

        currentAction = 'Queridating data';
        const values = SPQuery.shapePathQuery(this.schema, this.nodeSet, ShExUtil.rdfjsDB(graph), smap)
        queryResultsSession.setValue(JSON.stringify(values, undefined, 2));
      }
    } catch (e) {
      const errorMessage = 'Error while ' + currentAction + ': ' + String(e.stack || e);
      console.error(new Date().toISOString() + ' ' + errorMessage);
      document.querySelector('#query-results-editor').classList.add('error');
      queryResultsSession.setValue(errorMessage);
    }

    function ntriplify (q) {
      return `${ntt(q.subject)} ${ntt(q.predicate)} ${ntt(q.object)} .`

      function ntt (t) {
        switch (t.termType) {
        case 'NamedNode': return '<' + t.value + '>'
        case 'BlankNode': return '_:' + t.value
        case 'Literal': return '"' + t.value + '"' + (
          t.language
            ? '@' + t.language
            : '^^' + t.datatype.value
        )
        }
      }
    }
  }

  async loadManifestEntry (entry, base) {
    const loaded = await Promise.all(
      Object.keys(entry).filter(attr => attr.endsWith('URL')).map(async attr => {
        const bare = attr.substr(0, attr.length - 3)
        entry[attr] = new URL(entry[attr], base)
        const resp = await fetch(entry[attr])
        entry[bare] = await resp.text()
        return bare // handy to see which ones were loaded
      }))
    $('#shape-path-input').val(entry.shapePath)
    $('#shape-map-input').val(entry.shapeMap)
    this.shexjEditor.getSession().setValue(entry.schema)
    this.turtleEditor.getSession().setValue(entry.data)
  }

  renderManifest (manifest, baseUrl) {
    // paint manifest selector
    const manSel = $(`<select id="manifest-selector">`)
    const titleToManifestEntry = manifest.reduce((map, entry) => {
      map[entry.title] = entry
      manSel.append($(`<option value="${entry.title}">${entry.title} - ${entry.desc}</option>`))
      return map
    }, {})
    $('#title').after(manSel)
    manSel.change(() => {
      const selectedTitle = $('select option:selected').val()
      console.log(`switching to ${selectedTitle}`)
      this.loadManifestEntry(titleToManifestEntry[selectedTitle], baseUrl)
    })
  }
}

$(async () => {
  $('#shape-path-input').focus();
  const playground = new ShapePathOnlineEvaluator();

  if (location.search === '')
    location.search = 'manifestURL=examples/issue/manifest.yaml'

  const cgiParms = location.search.substr(1).split(/[,&]/).map(
    pair => pair.split("=").map(decodeURIComponent)
  )

  // load manifest(s)
  await cgiParms.map(async p => {
    if (p[0] === "manifestURL") {
      const mURL = new URL(p[1], location)
      const resp = await fetch(mURL)
      const t = await resp.text()
      playground.renderManifest(Yaml.load(t), mURL)
    } else if (p[0] === "manifest") {
      playground.renderManifest(Yaml.load(p[1]), location.href)
    }
  })
});
