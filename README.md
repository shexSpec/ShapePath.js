# ShapePath.js
A typescript library for executing ShapePaths

This is a monorepo which holds:
* the [shape-path-core](https://github.com/shexSpec/ShapePath.js/tree/main/packages/core) module and
* a playground ([live webapp](https://shexspec.github.io/ShapePath.js/packages/playground/dist/?manifestURL=examples/issue/manifest.yaml) | [source](https://github.com/shexSpec/ShapePath.js/tree/main/packages/playground))

## language/evaluation changes

2021-07-17 ericP: changed predicate separator for `::thisTripleExpr` from `.` to `~` because `.` is legal in localNames
