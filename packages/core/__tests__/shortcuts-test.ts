/** The three label shortcuts, over a schema written here rather than fetched.
 *
 *   @<label>  the shape expression declared with that label
 *   ~<iri>    the triple constraint on that predicate
 *   $<label>  the triple expression declared with that label
 *
 * The first two had no evaluation test outside the shexTest corpus, whose
 * Manifest currently straddles two ShExJ generations; these say what they
 * select against a schema you can read on this page.
 */
import { EvalContext, NodeSet, SchemaNode } from '../src/ShapePathAst'
import { ShapePathParser } from '../src/ShapePathParser'
import { Schema } from 'shexj'

const Base = 'http://a.example/'

/**
 * <S1> {
 *   $<grp> ( $<t1> :p1 . ; :p2 @<S2> ; :p3 { $<nested> :p4 . } )
 * }
 * <S2> IRI
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
          id: Base + 'grp',
          expressions: [
            {type: 'TripleConstraint', id: Base + 't1', predicate: Base + 'p1'},
            {type: 'TripleConstraint', predicate: Base + 'p2', valueExpr: Base + 'S2'},
            {
              type: 'TripleConstraint',
              predicate: Base + 'p3',
              // a triple expression label inside a nested inline shape, which
              // is why the lookup can't just walk one shape's expression
              valueExpr: {
                type: 'Shape',
                expression: {type: 'TripleConstraint', id: Base + 'nested',
                             predicate: Base + 'p4'},
              },
            },
          ],
        },
      },
    },
    {type: 'ShapeDecl', id: Base + 'S2', shapeExpr: {type: 'NodeConstraint', nodeKind: 'iri'}},
  ],
} as any as Schema

function evaluate (pathStr: string): NodeSet {
  const yy = {base: new URL(Base), prefixes: {'': Base}}
  return new ShapePathParser(yy).parse(pathStr)
    .evalPathExpr([schema] as NodeSet, new EvalContext(schema))
}

/** what a path selected, as "type" or "type(id-or-predicate)" */
function selected (pathStr: string): string[] {
  return evaluate(pathStr).map((n: SchemaNode) => {
    const o = n as any
    const name = o.id || o.predicate
    return o.type + (name ? `(${String(name).replace(Base, ':')})` : '')
  })
}

describe('$<label>, the triple expression shortcut', () => {

  it('selects a labelled triple constraint', () => {
    expect(selected('$<http://a.example/t1>')).toEqual(['TripleConstraint(:t1)'])
  })

  it('selects a labelled group', () => {
    expect(selected('$<http://a.example/grp>')).toEqual(['EachOf(:grp)'])
  })

  /* ShExJ has no top-level list of triple expressions, and a label may sit
   * anywhere -- including inside the inline shape of some constraint's value
   * expression, which walking one shape's expression never reaches. */
  it('finds one inside a nested inline shape', () => {
    expect(selected('$<http://a.example/nested>')).toEqual(['TripleConstraint(:nested)'])
  })

  it('takes a prefixed name', () => {
    expect(selected('$:t1')).toEqual(['TripleConstraint(:t1)'])
  })

  /* Both shortcuts carry `[assert count() = 1]`, and both are inert here: a
   * step's filters run per node, so on an empty node set no filter -- and no
   * assertion -- runs at all.  So an undeclared label selects nothing rather
   * than complaining.  Pre-existing, and shared with @<label>; a caller that
   * wants to be told (shex.js's sa:path does) checks the result. */
  it('selects nothing for a label the schema does not declare', () => {
    expect(evaluate('$<http://a.example/nope>')).toEqual([])
  })

  /* A schema in hand is not always a tree.  shex.js parks its index on the
   * schema as `_index`, pointing at the very nodes `shapes` already holds,
   * so a naive walk reaches each labelled expression three times -- through
   * shapes, through _index.tripleExprs and through _index.shapeExprs -- and
   * `[assert count() = 1]` then fails on a schema that is perfectly fine. */
  it('counts a node once however many ways the schema reaches it', () => {
    const indexed = JSON.parse(JSON.stringify(schema))
    const decl = (indexed as any).shapes[0]
    const grp = decl.shapeExpr.expression
    ;(indexed as any)._index = {
      shapeExprs: {[Base + 'S1']: decl},
      tripleExprs: {[Base + 'grp']: grp, [Base + 't1']: grp.expressions[0]},
    }
    const yy = {base: new URL(Base), prefixes: {'': Base}}
    const found = new ShapePathParser(yy).parse('$<http://a.example/t1>')
          .evalPathExpr([indexed] as NodeSet, new EvalContext(indexed))
    expect(found.length).toEqual(1)
    expect((found[0] as any).predicate).toEqual(Base + 'p1')
  })

  it('goes on being a path afterwards', () => {
    expect(selected('$<http://a.example/grp>/expressions/*'))
      .toEqual(['TripleConstraint(:t1)', 'TripleConstraint(:p2)', 'TripleConstraint(:p3)'])
    expect(evaluate('$<http://a.example/t1>/predicate')).toEqual([Base + 'p1'])
  })
})

describe('the shortcuts it joins', () => {

  it('@<label> selects the shape expression, through the declaration', () => {
    expect(selected('@<http://a.example/S1>')).toEqual(['Shape'])
    expect(selected('@<http://a.example/S2>')).toEqual(['NodeConstraint'])
  })

  it('~<iri> selects the constraint on that predicate', () => {
    expect(selected('@<http://a.example/S1>~<http://a.example/p2>'))
      .toEqual(['TripleConstraint(:p2)'])
  })

  it('selects nothing for a shape label the schema does not declare', () => {
    expect(evaluate('@<http://a.example/nope>')).toEqual([])
  })

  /* One sigil each, and they don't collide: :p1 is a predicate, :t1 is a
   * triple expression label, and neither answers to the other's. */
  it('keeps the three namespaces apart', () => {
    expect(selected('$<http://a.example/t1>')).toEqual(['TripleConstraint(:t1)'])
    expect(selected('@<http://a.example/S1>~<http://a.example/p1>'))
      .toEqual(['TripleConstraint(:t1)'])       // same node, reached by predicate
    // a predicate is not a triple expression label
    expect(evaluate('$<http://a.example/p1>')).toEqual([])
  })
})
