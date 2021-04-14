"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShapePathParser_1 = require("./ShapePathParser");
const Base = 'http://a.example/some/path/'; // 'file://'+__dirname
const yy = {
    base: new URL(Base),
    prefixes: {
        '': 'http://a.example/default',
        bar: 'http://a.example/bar',
    }
};
const p = new ShapePathParser_1.ShapePathParser(yy);
const i = require('fs').readFileSync(process.argv[2], 'utf8');
const r = p.parse(i);
console.log(JSON.stringify(r));
