/** Filters, over a schema written here rather than fetched.
 *
 * The positional filter had no evaluation test -- `parseAndPrint-test`
 * checks that `*[1]` parses to `Filter(index, [1])` and nothing checked what
 * that then selected -- so `[0]`, `[1]` and `[2]` all quietly returned the
 * same thing.  These tests are self-contained on purpose: an evaluator is
 * easier to pin down against a schema you can see than against a corpus.
 */
import { EvalContext, NodeSet, SchemaNode } from '../src/ShapePathAst'
import { ShapePathParser } from '../src/ShapePathParser'
import { Schema } from 'shexj'

const Base = 'http://a.example/'

/**
 * <S1> { <p1> . ; <p2> . ; <p3> . }
 * <S2> { <p4> . ; <p5> . }
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
            {type: 'TripleConstraint', predicate: Base + 'p1'},
            {type: 'TripleConstraint', predicate: Base + 'p2'},
            {type: 'TripleConstraint', predicate: Base + 'p3'},
          ],
        },
      },
    },
    {
      type: 'ShapeDecl',
      id: Base + 'S2',
      shapeExpr: {
        type: 'Shape',
        expression: {
          type: 'EachOf',
          expressions: [
            {type: 'TripleConstraint', predicate: Base + 'p4'},
            {type: 'TripleConstraint', predicate: Base + 'p5'},
          ],
        },
      },
    },
  ],
} as any as Schema

function evaluate (pathStr: string): NodeSet {
  const yy = {base: new URL(Base), prefixes: {}}
  return new ShapePathParser(yy).parse(pathStr)
    .evalPathExpr([schema] as NodeSet, new EvalContext(schema))
}

/** the predicates of the TripleConstraints a path selected */
function predicates (pathStr: string): string[] {
  return evaluate(pathStr).map(
    (n: SchemaNode) => (n as any).predicate as string)
}

/** the three constraints of <S1>, in the order the schema lists them */
const CONSTRAINTS = '@<http://a.example/S1>/expression/expressions/*'
/** all five, from both shapes, so a position spans more than one input node */
const ALL = '/shapes/*/shapeExpr/expression/expressions/*'

describe('the positional filter', () => {

  it('selects everything without one', () => {
    expect(predicates(CONSTRAINTS))
      .toEqual([Base + 'p1', Base + 'p2', Base + 'p3'])
  })

  /* `[N]` is the grammar's shorthand for `[index() = N]`, and index() has
   * always reported the 0-based position, so the first is [0].  If ShapePath
   * would rather count from 1 the way XPath does, index() has to move with
   * it -- the two mean the same thing and have to keep meaning it. */
  it('picks one node, counting from 0', () => {
    expect(predicates(CONSTRAINTS + '[0]')).toEqual([Base + 'p1'])
    expect(predicates(CONSTRAINTS + '[1]')).toEqual([Base + 'p2'])
    expect(predicates(CONSTRAINTS + '[2]')).toEqual([Base + 'p3'])
  })

  it('picks nothing when there is no such position', () => {
    expect(predicates(CONSTRAINTS + '[3]')).toEqual([])
    expect(predicates(CONSTRAINTS + '[-1]')).toEqual([])
  })

  it('means the same as the index() it abbreviates', () => {
    expect(predicates(CONSTRAINTS + '[index() = 0]')).toEqual([Base + 'p1'])
    expect(predicates(CONSTRAINTS + '[index() = 1]')).toEqual([Base + 'p2'])
    expect(predicates(CONSTRAINTS + '[index() = 2]')).toEqual([Base + 'p3'])
  })

  it('applies to the nodes left by the filter before it', () => {
    // [1] over what [1] left is [1] over a one-node set: only [0] survives
    expect(predicates(CONSTRAINTS + '[1][0]')).toEqual([Base + 'p2'])
    expect(predicates(CONSTRAINTS + '[1][1]')).toEqual([])
  })

  /* The position is in the node set the step produced, not in whichever
   * input node contributed it: <S2>'s first constraint is the fourth. */
  it('counts across everything the step selected', () => {
    expect(predicates(ALL)).toEqual(
      [Base + 'p1', Base + 'p2', Base + 'p3', Base + 'p4', Base + 'p5'])
    expect(predicates(ALL + '[0]')).toEqual([Base + 'p1'])
    expect(predicates(ALL + '[3]')).toEqual([Base + 'p4'])
    expect(predicates(ALL + '[4]')).toEqual([Base + 'p5'])
  })
})

describe('the aggregates a filter can call', () => {

  it('counts the node set, not the arguments', () => {
    expect(predicates(CONSTRAINTS + '[count() = 3]'))
      .toEqual([Base + 'p1', Base + 'p2', Base + 'p3'])
    expect(predicates(CONSTRAINTS + '[count() = 2]')).toEqual([])
  })

  /* index() inside a comparison used to be handed its own position in the
   * argument list -- always 0 -- rather than the node's, so `[index() = 0]`
   * matched everything and every other comparison matched nothing. */
  it('reports the node position to a comparison, not the argument position', () => {
    expect(predicates(CONSTRAINTS + '[index() = 0]').length).toEqual(1)
    expect(predicates(CONSTRAINTS + '[index() = 2]')).toEqual([Base + 'p3'])
  })

  it('is truthy for every position but the first, called bare', () => {
    // ebv(index()) -- 0 is false, everything else is true.  Not useful, but
    // it is what `[index()]` has always meant and `[0]` no longer is.
    expect(predicates(CONSTRAINTS + '[index()]'))
      .toEqual([Base + 'p2', Base + 'p3'])
  })
})

describe('assertions', () => {

  it('passes when the aggregate says what it should', () => {
    expect(predicates(CONSTRAINTS + '[assert count() = 3]').length).toEqual(3)
  })

  it('throws when it does not', () => {
    expect(() => predicates(CONSTRAINTS + '[assert count() = 2]'))
      .toThrow(/failed assertion/)
  })
})

describe('attribute filters', () => {

  it('selects by a named attribute', () => {
    expect(evaluate('/shapes/*[id=<http://a.example/S2>]').length).toEqual(1)
    expect((evaluate('/shapes/*[id=<http://a.example/S2>]')[0] as any).id)
      .toEqual(Base + 'S2')
    expect(predicates('@<http://a.example/S2>/expression/expressions/*'))
      .toEqual([Base + 'p4', Base + 'p5'])
  })

  it('selects nothing when nothing has that value', () => {
    expect(evaluate('/shapes/*[id=<http://a.example/nope>]')).toEqual([])
  })
})
