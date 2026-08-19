# ShapePath.js
A typescript library for executing ShapePaths

This is a monorepo which holds:
* the [shape-path-core](https://github.com/shexSpec/ShapePath.js/tree/main/packages/core) module and
* a playground ([live webapp](https://shexspec.github.io/ShapePath.js/packages/playground/dist/?manifestURL=examples/issue/manifest.yaml) | [source](https://github.com/shexSpec/ShapePath.js/tree/main/packages/playground))

## language/evaluation changes

2021-07-17 ericP: changed predicate separator for `::thisTripleExpr` from `.` to `~` because `.` is legal in localNames

2026-08-19: `[N]` selects the node at position N, counting from **0**.

It is the grammar's shorthand for `[index() = N]` (`filterExpr -> Filter(index,
[numericExpr])`), and `index()` has always reported the 0-based position, so
the two have to agree.  This is not XPath's `[1]`-is-first: XPath's aggregate
is `position()`, ShapePath's is `index()`, and the rename is the signal.  If
ShapePath would rather count from 1, `index()` moves with it.

Until this was written down, `[N]` ignored N and passed every node whose
position was truthy, so `[0]`, `[1]` and `[2]` all selected the same thing --
everything but the first.
