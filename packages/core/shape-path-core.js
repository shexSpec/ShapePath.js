const Path = require('path')
const to = f => Path.join(__dirname, f)

module.exports = {
  Ast: require('./dist/ShapePathAst'),
  Parser: require('./dist/ShapePathParser'),
  scripts: {
    spgrep: to('dist/spgrep.js'),
  },
  examples: to('examples'),
}
