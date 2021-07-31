#!/usr/bin/env ts-node
import { Schema } from 'shexj';
import { NodeSet } from './ShapePathAst';
export declare let log: (...args: any) => void;
export declare const cmd: any;
export declare function report(pathStr: string, files: string[], command: any, commander: any): void;
export declare function run(pathStr: string, files: string[], command: any, commander: any): (string | Schema | NodeSet)[][];
//# sourceMappingURL=spgrep.d.ts.map