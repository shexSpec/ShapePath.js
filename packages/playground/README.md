# ShapePath.js
A typescript library for executing ShapePaths

## Online playground
This playground is available online at https://shexspec.github.io/ShapePath.js/packages/playground/dist/

This module depends on:
* [`shape-path-core`](../core/) to select a [ShapePath `NodeSet`](https://github.com/shexSpec/ShapePath.js/blob/main/packages/core/src/ShapePathAst.ts#L50) from a  a schema,
* [`@shexjs/shape-path-query`](https://github.com/shexjs/shex.js/tree/main/packages/shex-shape-path-query) to validate data with that schema and select the parts of the data which match that `NodeSet`. 

## language/evaluation changes

2021-07-17 ericP: changed predicate separator for `::thisTripleExpr` from `.` to `~` because `.` is legal in localNames
