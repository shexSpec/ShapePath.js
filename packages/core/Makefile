NPMPATH=./node_modules/.bin
NODE=node
# NODE=node --inspect-brk
# DEBUG=--debug

test: tyson jest spgrep.shortcut spgrep.longcut

src/ShapePathParser.ts: src/ShapePathParser.jison
	$(NODE) $(NPMPATH)/ts-jison -n ShapePath -t typescript -o src/ShapePathParser.ts src/ShapePathParser.jison
	./scripts/redundantBreaks ./src/ShapePathParser.ts

src/ShapePathParser.typecheck.ts: src/ShapePathParser.ts src/ShapePathAst.ts src/ShapePathParserInternals.ts
	$(NODE) $(NPMPATH)/tyson ./src/ShapePathParser.jison ./src/ShapePathParser.typedict.ts --out ./src/ShapePathParser.typecheck.ts
	./scripts/fixupNames ./src/ShapePathParser.typecheck.ts

tyson: src/ShapePathParser.typecheck.ts
	$(NODE) $(NPMPATH)/tsc --noEmit ./src/ShapePathParser.typecheck.ts

shortcuts: src/ShapePathParser.ts src/ShapePathAst.ts
	$(NODE) $(NPMPATH)/ts-node ./src/parseAndPrint.ts ./__tests__/spz/shortcuts.sp

SPGREP=$(NODE) $(NPMPATH)/ts-node ./src/spgrep.ts $(DEBUG)

spgrep.H: src/ShapePathParser.ts src/ShapePathAst.ts
	$(SPGREP) -H /shapes --resolve src/resolve.json ../shexTest/schemas/3Eachdot*.json

spgrep.shortcut: src/ShapePathParser.ts src/ShapePathAst.ts
	$(SPGREP) '@<http://a.example/S1>.<http://a.example/p1>' schema.json

spgrep.longcut: src/ShapePathParser.ts src/ShapePathAst.ts
	$(SPGREP) '/shapes/*[id=<http://a.example/S1>][assert count() = 1]/thisShapeExpr::Shape/expression/thisTripleExpr::TripleConstraint[predicate=<http://a.example/p1>]' schema.json

spgrep.issue: examples/issue/Issue.json examples/issue/Issue2.ttl
	$(SPGREP) '@<http://project.example/schema#DiscItem>.<http://project.example/ns#href>,@<http://project.example/schema#Issue>.<http://project.example/ns#spec>/valueExpr/shapeExprs.<http://project.example/ns#href>' examples/issue/Issue.json --data examples/issue/Issue2.ttl --shape-map '<http://instance.example/project1/Issue2>@<http://project.example/schema#Issue>'

jest: src/ShapePathParser.ts src/ShapePathAst.ts
	$(NODE) $(NPMPATH)/jest

