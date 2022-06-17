"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.examples = exports.scripts = exports.Parser = exports.Ast = void 0;
let to = (f) => '../' + f;
if (typeof window === 'undefined') {
    to = (f) => require('path').join(__dirname, f);
}
const Ast = __importStar(require("./ShapePathAst"));
exports.Ast = Ast;
const Parser = __importStar(require("./ShapePathParser"));
exports.Parser = Parser;
const spgrep = to('spgrep.js');
const examples = to('../examples');
exports.examples = examples;
const scripts = {
    spgrep
};
exports.scripts = scripts;
//# sourceMappingURL=shape-path-core.js.map