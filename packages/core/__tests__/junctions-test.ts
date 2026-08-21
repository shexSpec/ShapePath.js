/** The junctions, over a schema written here rather than fetched.
 *
 * `,` and `union` had entries in Manifest.json; `intersection` had none,
 * and it returned the first expression's results whatever the second
 * selected -- so `A intersection B` was A, and nothing said otherwise.
 */
import { EvalContext, NodeSet, SchemaNode } from '../src/ShapePathAst'
import { ShapePathParser } from '../src/ShapePathParser'
import { Schema } from 'shexj'

const Base = 'http://a.example/'

/**
 * <S1> { <p1> . ; <p2> . ; <p3> . }
 * <S2> { <p4> . }
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
        expression: {type: 'TripleConstraint', predicate: Base + 'p4'},
      },
    },
  ],
} as any as Schema

function evaluate (pathStr: string): NodeSet {
  const yy = {base: new URL(Base), prefixes: {}}
  return new ShapePathParser(yy).parse(pathStr)
    .evalPathExpr([schema] as NodeSet, new EvalContext(schema))
}

/** the predicates a path selected, as :pN */
function selected (pathStr: string): string[] {
  return evaluate(pathStr).map((n: SchemaNode) =>
    String((n as any).predicate).replace(Base, ':'))
}

const all = `@<${Base}S1>/expression/expressions/*`
const p1 = `@<${Base}S1>~<${Base}p1>`
const p2 = `@<${Base}S1>~<${Base}p2>`
const p4 = `@<${Base}S2>~<${Base}p4>`

describe('intersection', () => {

  it('should select what both expressions selected', () => {
    expect(selected(`${all} intersection ${p2}`)).toEqual([':p2'])
  })

  it('should select nothing when they share nothing', () => {
    expect(evaluate(`${p1} intersection ${p2}`)).toEqual([])
    expect(evaluate(`${p1} intersection ${p4}`)).toEqual([])
  })

  it('should not care which side is bigger', () => {
    expect(selected(`${p2} intersection ${all}`)).toEqual([':p2'])
  })

  it('should keep the order of the expression it starts from', () => {
    expect(selected(`${all} intersection ${all}`)).toEqual([':p1', ':p2', ':p3'])
  })

  it('should narrow with every further expression', () => {
    expect(selected(`${all} intersection ${all} intersection ${p2}`)).toEqual([':p2'])
  })

  /* `intersection` binds tighter than `union`, which binds tighter than
   * `,`, so this is (all ∩ p1) ∪ (p2 ∩ p2). */
  it('should bind tighter than union', () => {
    expect(selected(`${all} intersection ${p1} union ${p2} intersection ${p2}`))
      .toEqual([':p1', ':p2'])
  })

  /* A path can select one node twice -- two declarations have the same
   * ancestors -- and a set operator answers with it once. */
  it('should say each node once', () => {
    const twice = '/shapes/*/ancestor::'
    expect(evaluate(twice).length).toEqual(4)
    expect(evaluate(`${twice} intersection ${twice}`).length).toEqual(2)
  })
})

describe('the junctions it joins', () => {

  it('union should take either, once', () => {
    expect(selected(`${p1} union ${p2}`)).toEqual([':p1', ':p2'])
    expect(selected(`${p1} union ${p1}`)).toEqual([':p1'])
  })

  /* `,` is the one that isn't a set: it says what each expression selected,
   * however many times they say it. */
  it('a sequence should keep what union drops', () => {
    expect(selected(`${p1} , ${p1}`)).toEqual([':p1', ':p1'])
  })

  it('should bind , loosest and intersection tightest', () => {
    // (p1) , (p1 union (all intersection p2))
    expect(selected(`${p1} , ${p1} union ${all} intersection ${p2}`))
      .toEqual([':p1', ':p1', ':p2'])
  })
})
