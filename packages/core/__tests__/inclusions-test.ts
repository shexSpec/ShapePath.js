/** An Inclusion is part of the body that includes it.
 *
 * ShExC's `&<#label>` compiles to a bare label where a triple expression
 * would be, and the matcher treats the expression it names as part of the
 * shape.  `thisTripleExpr::` used to stop there, so `~<iri>` -- which is
 * built from it -- reported a shape's body as smaller than the matcher
 * does: a constraint the shape included by reference could not be
 * addressed through the shape at all, only at its declaration.
 */
import { EvalContext, NodeSet, SchemaNode } from '../src/ShapePathAst'
import { ShapePathParser } from '../src/ShapePathParser'
import { Schema } from 'shexj'

const Base = 'http://a.example/'

/**
 * <S1> { &<grp> ; :p9 . }
 * <Holder> { $<grp> ( :p1 . ; :p2 . ) }
 * <Cycle> { $<loop> ( &<loop> | :p3 . ) }
 */
const schema: Schema = {
  type: 'Schema',
  shapes: [
    {
      type: 'ShapeDecl',
      id: Base + 'S1',
      shapeExpr: {
        type: 'Shape',
        expression: {
          type: 'EachOf',
          expressions: [
            Base + 'grp',               // an Inclusion: the label, not the expression
            {type: 'TripleConstraint', predicate: Base + 'p9'},
          ],
        },
      },
    },
    {
      type: 'ShapeDecl',
      id: Base + 'Holder',
      shapeExpr: {
        type: 'Shape',
        expression: {
          type: 'EachOf',
          id: Base + 'grp',
          expressions: [
            {type: 'TripleConstraint', predicate: Base + 'p1'},
            {type: 'TripleConstraint', predicate: Base + 'p2'},
          ],
        },
      },
    },
    {
      type: 'ShapeDecl',
      id: Base + 'Cycle',
      shapeExpr: {
        type: 'Shape',
        expression: {
          type: 'OneOf',
          id: Base + 'loop',
          expressions: [
            Base + 'loop',              // an inclusion of the expression it is in
            {type: 'TripleConstraint', predicate: Base + 'p3'},
          ],
        },
      },
    },
  ],
} as any as Schema

function evaluate (pathStr: string, over: Schema = schema): NodeSet {
  const yy = {base: new URL(Base), prefixes: {'': Base}}
  return new ShapePathParser(yy).parse(pathStr)
    .evalPathExpr([over] as NodeSet, new EvalContext(over))
}

/** what a path selected, as "type" or "type(predicate-or-id)" */
function selected (pathStr: string, over?: Schema): string[] {
  return evaluate(pathStr, over).map((n: SchemaNode) => {
    const o = n as any
    const name = o.predicate || o.id
    return typeof o === 'string' ? JSON.stringify(String(o).replace(Base, ':'))
      : o.type + (name ? `(${String(name).replace(Base, ':')})` : '')
  })
}

describe('thisTripleExpr:: over an Inclusion', () => {

  it('should reach a constraint the shape includes by reference', () => {
    expect(selected('@<http://a.example/S1>~<http://a.example/p1>'))
      .toEqual(['TripleConstraint(:p1)'])
  })

  it('should still reach the ones written in the shape', () => {
    expect(selected('@<http://a.example/S1>~<http://a.example/p9>'))
      .toEqual(['TripleConstraint(:p9)'])
  })

  it('should walk into the included expression from the axis itself', () => {
    expect(selected('@<http://a.example/S1>/expression/thisTripleExpr::TripleConstraint'))
      .toEqual(['TripleConstraint(:p1)', 'TripleConstraint(:p2)', 'TripleConstraint(:p9)'])
  })

  it('should give the included group as well as its constraints', () => {
    expect(selected('@<http://a.example/S1>/expression/thisTripleExpr::'))
      .toEqual(['EachOf', 'EachOf(:grp)',
                'TripleConstraint(:p1)', 'TripleConstraint(:p2)',
                'TripleConstraint(:p9)'])
  })

  /* An inclusion may name the expression it is in, and a walk that followed
   * it twice would not come back. */
  it('should follow a label once, so a cycle terminates', () => {
    expect(selected('@<http://a.example/Cycle>/expression/thisTripleExpr::TripleConstraint'))
      .toEqual(['TripleConstraint(:p3)'])
  })

  it('should select nothing for an inclusion of a label nothing declares', () => {
    const dangling = JSON.parse(JSON.stringify(schema))
    dangling.shapes[0].shapeExpr.expression.expressions[0] = Base + 'nope'
    expect(selected('@<http://a.example/S1>/expression/thisTripleExpr::TripleConstraint',
                    dangling))
      .toEqual(['TripleConstraint(:p9)'])
  })

  /* The label is still a label: $<#grp> reaches it where it is declared,
   * and the two paths reach the same node. */
  it('should reach the same node as the label does', () => {
    const byInclusion = evaluate('@<http://a.example/S1>~<http://a.example/p1>')
    const byLabel = evaluate('$<http://a.example/grp>/expressions/*[0]')
    expect(byInclusion.length).toEqual(1)
    expect(byInclusion[0]).toBe(byLabel[0])
  })
})
