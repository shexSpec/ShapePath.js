import { ShapePathParser } from './ShapePathParser';
const Base = 'http://a.example/some/path/' // 'file://'+__dirname

const yy = {
  base: new URL(Base),
  prefixes: {
    '': 'http://a.example/default',
    bar: 'http://a.example/bar',
  }
}
const p = new ShapePathParser(yy);
const i = require('fs').readFileSync(process.argv[2], 'utf8')
const r = p.parse(i)
console.log(JSON.stringify(r))
process.exit(0)
