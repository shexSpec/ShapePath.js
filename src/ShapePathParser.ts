/* parser generated by jison 0.0.6 */
/**
 * Returns a Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */

import {Union, Intersection, Path, UnitStep, PathExprStep, Axis, t_Selector,
        Assertion, Filter, Function, FuncArg, FuncName, Iri, BNode,
        t_termType, t_shapeExprType, t_tripleExprType, t_valueType, t_attribute,
        t_schemaAttr, t_shapeExprAttr, t_nodeConstraintAttr, t_stringFacetAttr,
        t_numericFacetAttr, t_valueSetValueAttr, t_shapeAttr, t_tripleExprAttr,
        t_tripleConstraintAttr, t_semActAttr, t_annotationAttr
       } from './ShapePathAst'

import {comparison, rvalue} from './ShapePathParserInternals'

function makeFunction (assertionP: boolean, firstArg: FuncArg, comp: comparison = { op: FuncName.ebv, r: null }): Function {
  const { op, r } = comp
  const args = [firstArg]
  if (r) args.push(r)
  const ret = new Filter(op, args)
  return assertionP
    ? new Assertion(ret)
    : ret
}

function pnameToUrl (pname: string, yy: any): Iri {
  const idx = pname.indexOf(':')
  const pre = pname.substr(0, idx)
  const lname = pname.substr(idx+1)
  if (!(pre in yy.prefixes))
    throw Error(`unknown prefix in ${pname}`)
  const ns = yy.prefixes[pre]
  return new Iri(new URL(ns + lname, yy.base).href)
}

export function shapeLabelShortCut(label: Iri) {
  return [
    new UnitStep(t_schemaAttr.shapes),
    new UnitStep(t_Selector.Any, undefined, [
      new Filter(FuncName.equal, [
        new Path([new UnitStep(t_attribute.id)]),
        label
      ]),
      new Assertion(
        new Filter(FuncName.equal, [
          new Filter(FuncName.count, []),
          1
        ])
      )
    ])
  ]
}


export function predicateShortCut(label: Iri) {
  return [
    new UnitStep(t_shapeExprType.Shape, Axis.thisShapeExpr),
    new UnitStep(t_shapeAttr.expression),
    new UnitStep(
      t_tripleExprType.TripleConstraint,
      Axis.thisTripleExpr,
      [
        new Filter(FuncName.equal, [
          new Path([new UnitStep(t_attribute.predicate)]),
          label
        ])
      ]
    )
  ];
}


import { JisonParser, JisonParserApi, StateType, SymbolsType, TerminalsType, ProductionsType, o } from '@ts-jison/parser';
import { JisonLexer, JisonLexerApi } from '@ts-jison/lexer';

const $V0=[30,34,35,36,37,38,39,40,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,106,107,109,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,135,136,137,138,139],$V1=[2,17],$V2=[1,10],$V3=[1,11],$V4=[1,12],$V5=[1,13],$V6=[5,9,31,45,60,61,62],$V7=[5,9,13,31,45,60,61,62],$V8=[5,9,13,21,22,25,26,31,45,60,61,62],$V9=[40,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,106,107,109,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,135,136,137,138,139],$Va=[2,26],$Vb=[1,20],$Vc=[1,22],$Vd=[1,23],$Ve=[1,24],$Vf=[1,25],$Vg=[1,26],$Vh=[1,27],$Vi=[1,29],$Vj=[1,31],$Vk=[1,32],$Vl=[140,142,143],$Vm=[5,9,13,21,22,25,26,31,43,45,60,61,62],$Vn=[2,28],$Vo=[1,128],$Vp=[21,22,25,26,30,34,35,36,37,38,39,40,52,53,54,55,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,106,107,109,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,135,136,137,138,139],$Vq=[2,45],$Vr=[1,145],$Vs=[1,146],$Vt=[1,147],$Vu=[57,140,142,143],$Vv=[45,60,61,62];

export class ShapePathParser extends JisonParser implements JisonParserApi {
  public Parser?: ShapePathParser;
  $?: any;

  constructor (yy = {}, lexer = new ShapePathLexer(yy)) {
    super(yy, lexer);
  }

  symbols_: SymbolsType = {"error":2,"top":3,"shapePath":4,"EOF":5,"unionStep":6,"Q_O_QIT_union_E_S_QunionStep_E_C_E_Star":7,"O_QIT_union_E_S_QunionStep_E_C":8,"IT_UNION":9,"intersectionStep":10,"Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star":11,"O_QIT_intersection_E_S_QintersectionStep_E_C":12,"IT_INTERSECTION":13,"startStep":14,"QnextStep_E_Star":15,"nextStep":16,"Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt":17,"step":18,"shortcut":19,"O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C":20,"GT_DIVIDE":21,"GT_DIVIDEDIVIDE":22,"O_QGT_AT_E_Or_QGT_DOT_E_C":23,"iri":24,"GT_AT":25,"GT_DOT":26,"Qaxis_E_Opt":27,"selector":28,"Qfilter_E_Star":29,"GT_LPAREN":30,"GT_RPAREN":31,"axis":32,"filter":33,"IT_child":34,"IT_thisShapeExpr":35,"IT_thisTripleExpr":36,"IT_self":37,"IT_parent":38,"IT_ancestor":39,"GT_STAR":40,"termType":41,"attribute":42,"GT_LBRACKET":43,"filterExpr":44,"GT_RBRACKET":45,"QIT_ASSERT_E_Opt":46,"Qcomparison_E_Opt":47,"function":48,"numericExpr":49,"IT_ASSERT":50,"comparison":51,"IT_index":52,"IT_count":53,"IT_foo1":54,"IT_foo2":55,"fooArg":56,"INTEGER":57,"comparitor":58,"rvalue":59,"GT_EQUAL":60,"GT_LT":61,"GT_GT":62,"shapeExprType":63,"tripleExprType":64,"valueType":65,"IT_Schema":66,"IT_SemAct":67,"IT_Annotation":68,"IT_ShapeAnd":69,"IT_ShapeOr":70,"IT_ShapeNot":71,"IT_NodeConstraint":72,"IT_Shape":73,"IT_ShapeExternal":74,"IT_EachOf":75,"IT_OneOf":76,"IT_TripleConstraint":77,"IT_IriStem":78,"IT_IriStemRange":79,"IT_LiteralStem":80,"IT_LiteralStemRange":81,"IT_Language":82,"IT_LanguageStem":83,"IT_LanguageStemRange":84,"IT_Wildcard":85,"IT_type":86,"IT_id":87,"IT_semActs":88,"IT_annotations":89,"IT_predicate":90,"schemaAttr":91,"shapeExprAttr":92,"tripleExprAttr":93,"valueSetValueAttr":94,"semActAttr":95,"annotationAttr":96,"GT_atContext":97,"IT_startActs":98,"IT_start":99,"IT_imports":100,"IT_shapes":101,"IT_shapeExprs":102,"IT_shapeExpr":103,"nodeConstraintAttr":104,"shapeAttr":105,"IT_nodeKind":106,"IT_datatype":107,"xsFacetAttr":108,"IT_values":109,"stringFacetAttr":110,"numericFacetAttr":111,"IT_length":112,"IT_minlength":113,"IT_maxlength":114,"IT_pattern":115,"IT_flags":116,"IT_mininclusive":117,"IT_minexclusive":118,"IT_maxinclusive":119,"IT_maxexclusive":120,"IT_totaldigits":121,"IT_fractiondigits":122,"IT_value":123,"IT_language":124,"IT_stem":125,"IT_exclusions":126,"IT_languageTag":127,"IT_closed":128,"IT_extra":129,"IT_expression":130,"IT_expressions":131,"IT_min":132,"IT_max":133,"tripleConstraintAttr":134,"IT_inverse":135,"IT_valueExpr":136,"IT_name":137,"IT_code":138,"IT_object":139,"IRIREF":140,"prefixedName":141,"PNAME_LN":142,"PNAME_NS":143,"$accept":0,"$end":1};
  terminals_: TerminalsType = {2:"error",5:"EOF",9:"IT_UNION",13:"IT_INTERSECTION",21:"GT_DIVIDE",22:"GT_DIVIDEDIVIDE",25:"GT_AT",26:"GT_DOT",30:"GT_LPAREN",31:"GT_RPAREN",34:"IT_child",35:"IT_thisShapeExpr",36:"IT_thisTripleExpr",37:"IT_self",38:"IT_parent",39:"IT_ancestor",40:"GT_STAR",43:"GT_LBRACKET",45:"GT_RBRACKET",50:"IT_ASSERT",52:"IT_index",53:"IT_count",54:"IT_foo1",55:"IT_foo2",57:"INTEGER",60:"GT_EQUAL",61:"GT_LT",62:"GT_GT",66:"IT_Schema",67:"IT_SemAct",68:"IT_Annotation",69:"IT_ShapeAnd",70:"IT_ShapeOr",71:"IT_ShapeNot",72:"IT_NodeConstraint",73:"IT_Shape",74:"IT_ShapeExternal",75:"IT_EachOf",76:"IT_OneOf",77:"IT_TripleConstraint",78:"IT_IriStem",79:"IT_IriStemRange",80:"IT_LiteralStem",81:"IT_LiteralStemRange",82:"IT_Language",83:"IT_LanguageStem",84:"IT_LanguageStemRange",85:"IT_Wildcard",86:"IT_type",87:"IT_id",88:"IT_semActs",89:"IT_annotations",90:"IT_predicate",97:"GT_atContext",98:"IT_startActs",99:"IT_start",100:"IT_imports",101:"IT_shapes",102:"IT_shapeExprs",103:"IT_shapeExpr",106:"IT_nodeKind",107:"IT_datatype",109:"IT_values",112:"IT_length",113:"IT_minlength",114:"IT_maxlength",115:"IT_pattern",116:"IT_flags",117:"IT_mininclusive",118:"IT_minexclusive",119:"IT_maxinclusive",120:"IT_maxexclusive",121:"IT_totaldigits",122:"IT_fractiondigits",123:"IT_value",124:"IT_language",125:"IT_stem",126:"IT_exclusions",127:"IT_languageTag",128:"IT_closed",129:"IT_extra",130:"IT_expression",131:"IT_expressions",132:"IT_min",133:"IT_max",135:"IT_inverse",136:"IT_valueExpr",137:"IT_name",138:"IT_code",139:"IT_object",140:"IRIREF",142:"PNAME_LN",143:"PNAME_NS"};
  productions_: ProductionsType = [0,[3,2],[4,2],[8,2],[7,0],[7,2],[6,2],[12,2],[11,0],[11,2],[10,2],[15,0],[15,2],[14,2],[14,1],[20,1],[20,1],[17,0],[17,1],[16,2],[16,1],[19,2],[23,1],[23,1],[18,3],[18,4],[27,0],[27,1],[29,0],[29,2],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[28,1],[28,1],[28,1],[33,3],[44,3],[44,3],[44,1],[46,0],[46,1],[47,0],[47,1],[48,3],[48,3],[48,4],[48,4],[56,2],[56,1],[56,1],[51,2],[58,1],[58,1],[58,1],[59,1],[59,1],[49,1],[41,1],[41,1],[41,1],[41,1],[41,1],[41,1],[63,1],[63,1],[63,1],[63,1],[63,1],[63,1],[64,1],[64,1],[64,1],[65,1],[65,1],[65,1],[65,1],[65,1],[65,1],[65,1],[65,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[91,1],[91,1],[91,1],[91,1],[91,1],[92,1],[92,1],[92,1],[92,1],[104,1],[104,1],[104,1],[104,1],[108,1],[108,1],[110,1],[110,1],[110,1],[110,1],[110,1],[111,1],[111,1],[111,1],[111,1],[111,1],[111,1],[94,1],[94,1],[94,1],[94,1],[94,1],[105,1],[105,1],[105,1],[93,1],[93,1],[93,1],[93,1],[134,1],[134,1],[95,1],[95,1],[96,1],[24,1],[24,1],[141,1],[141,1]];
  table: Array<StateType> = [o($V0,$V1,{3:1,4:2,6:3,10:4,14:5,17:6,19:7,20:8,23:9,21:$V2,22:$V3,25:$V4,26:$V5}),{1:[3]},{5:[1,14]},o($V6,[2,4],{7:15}),o($V7,[2,8],{11:16}),o($V8,[2,11],{15:17}),o($V9,$Va,{18:18,27:19,32:21,30:$Vb,34:$Vc,35:$Vd,36:$Ve,37:$Vf,38:$Vg,39:$Vh}),o($V8,[2,14]),o($V0,[2,18]),{24:28,140:$Vi,141:30,142:$Vj,143:$Vk},o($V0,[2,15]),o($V0,[2,16]),o($Vl,[2,22]),o($Vl,[2,23]),{1:[2,1]},o([5,31,45,60,61,62],[2,2],{8:33,9:[1,34]}),o($V6,[2,6],{12:35,13:[1,36]}),o($V7,[2,10],{23:9,16:37,20:38,19:39,21:$V2,22:$V3,25:$V4,26:$V5}),o($V8,[2,13]),{28:40,40:[1,41],41:42,42:43,63:44,64:45,65:46,66:[1,47],67:[1,48],68:[1,49],69:[1,61],70:[1,62],71:[1,63],72:[1,64],73:[1,65],74:[1,66],75:[1,67],76:[1,68],77:[1,69],78:[1,70],79:[1,71],80:[1,72],81:[1,73],82:[1,74],83:[1,75],84:[1,76],85:[1,77],86:[1,50],87:[1,51],88:[1,52],89:[1,53],90:[1,54],91:55,92:56,93:57,94:58,95:59,96:60,97:[1,78],98:[1,79],99:[1,80],100:[1,81],101:[1,82],102:[1,83],103:[1,84],104:85,105:86,106:[1,99],107:[1,100],108:101,109:[1,102],110:108,111:109,112:[1,110],113:[1,111],114:[1,112],115:[1,113],116:[1,114],117:[1,115],118:[1,116],119:[1,117],120:[1,118],121:[1,119],122:[1,120],123:[1,91],124:[1,92],125:[1,93],126:[1,94],127:[1,95],128:[1,103],129:[1,104],130:[1,105],131:[1,87],132:[1,88],133:[1,89],134:90,135:[1,106],136:[1,107],137:[1,96],138:[1,97],139:[1,98]},o($V0,$V1,{6:3,10:4,14:5,17:6,19:7,20:8,23:9,4:121,21:$V2,22:$V3,25:$V4,26:$V5}),o($V9,[2,27]),o($V9,[2,30]),o($V9,[2,31]),o($V9,[2,32]),o($V9,[2,33]),o($V9,[2,34]),o($V9,[2,35]),o($V8,[2,21]),o($V8,[2,138]),o($V8,[2,139]),o($V8,[2,140]),o($V8,[2,141]),o($V6,[2,5]),o($V0,$V1,{10:4,14:5,17:6,19:7,20:8,23:9,6:122,21:$V2,22:$V3,25:$V4,26:$V5}),o($V7,[2,9]),o($V0,$V1,{14:5,17:6,19:7,20:8,23:9,10:123,21:$V2,22:$V3,25:$V4,26:$V5}),o($V8,[2,12]),o($V9,$Va,{27:19,32:21,18:124,30:$Vb,34:$Vc,35:$Vd,36:$Ve,37:$Vf,38:$Vg,39:$Vh}),o($V8,[2,20]),o($Vm,$Vn,{29:125}),o($Vm,[2,36]),o($Vm,[2,37]),o($Vm,[2,38]),o($Vm,[2,61]),o($Vm,[2,62]),o($Vm,[2,63]),o($Vm,[2,64]),o($Vm,[2,65]),o($Vm,[2,66]),o($Vm,[2,84]),o($Vm,[2,85]),o($Vm,[2,86]),o($Vm,[2,87]),o($Vm,[2,88]),o($Vm,[2,89]),o($Vm,[2,90]),o($Vm,[2,91]),o($Vm,[2,92]),o($Vm,[2,93]),o($Vm,[2,94]),o($Vm,[2,67]),o($Vm,[2,68]),o($Vm,[2,69]),o($Vm,[2,70]),o($Vm,[2,71]),o($Vm,[2,72]),o($Vm,[2,73]),o($Vm,[2,74]),o($Vm,[2,75]),o($Vm,[2,76]),o($Vm,[2,77]),o($Vm,[2,78]),o($Vm,[2,79]),o($Vm,[2,80]),o($Vm,[2,81]),o($Vm,[2,82]),o($Vm,[2,83]),o($Vm,[2,95]),o($Vm,[2,96]),o($Vm,[2,97]),o($Vm,[2,98]),o($Vm,[2,99]),o($Vm,[2,100]),o($Vm,[2,101]),o($Vm,[2,102]),o($Vm,[2,103]),o($Vm,[2,129]),o($Vm,[2,130]),o($Vm,[2,131]),o($Vm,[2,132]),o($Vm,[2,121]),o($Vm,[2,122]),o($Vm,[2,123]),o($Vm,[2,124]),o($Vm,[2,125]),o($Vm,[2,135]),o($Vm,[2,136]),o($Vm,[2,137]),o($Vm,[2,104]),o($Vm,[2,105]),o($Vm,[2,106]),o($Vm,[2,107]),o($Vm,[2,126]),o($Vm,[2,127]),o($Vm,[2,128]),o($Vm,[2,133]),o($Vm,[2,134]),o($Vm,[2,108]),o($Vm,[2,109]),o($Vm,[2,110]),o($Vm,[2,111]),o($Vm,[2,112]),o($Vm,[2,113]),o($Vm,[2,114]),o($Vm,[2,115]),o($Vm,[2,116]),o($Vm,[2,117]),o($Vm,[2,118]),o($Vm,[2,119]),o($Vm,[2,120]),{31:[1,126]},o($V6,[2,3]),o($V7,[2,7]),o($V8,[2,19]),o($V8,[2,24],{33:127,43:$Vo}),o($Vm,$Vn,{29:129}),o($Vm,[2,29]),o($Vp,[2,43],{44:130,46:131,49:132,50:[1,133],57:[1,134]}),o($V8,[2,25],{33:127,43:$Vo}),{45:[1,135]},o($V0,$V1,{6:3,10:4,14:5,17:6,19:7,20:8,23:9,4:136,48:137,21:$V2,22:$V3,25:$V4,26:$V5,52:[1,138],53:[1,139],54:[1,140],55:[1,141]}),{45:[2,42]},o($Vp,[2,44]),{45:[2,60]},o($Vm,[2,39]),{45:$Vq,47:142,51:143,58:144,60:$Vr,61:$Vs,62:$Vt},{45:$Vq,47:148,51:143,58:144,60:$Vr,61:$Vs,62:$Vt},{30:[1,149]},{30:[1,150]},{30:[1,151]},{30:[1,152]},{45:[2,40]},{45:[2,46]},{24:155,57:[1,154],59:153,140:$Vi,141:30,142:$Vj,143:$Vk},o($Vu,[2,55]),o($Vu,[2,56]),o($Vu,[2,57]),{45:[2,41]},{31:[1,156]},{31:[1,157]},{24:158,140:$Vi,141:30,142:$Vj,143:$Vk},{24:161,56:159,57:[1,160],140:$Vi,141:30,142:$Vj,143:$Vk},{45:[2,54]},{45:[2,58]},{45:[2,59]},o($Vv,[2,47]),o($Vv,[2,48]),{31:[1,162]},{31:[1,163]},{24:164,31:[2,52],140:$Vi,141:30,142:$Vj,143:$Vk},{31:[2,53]},o($Vv,[2,49]),o($Vv,[2,50]),{31:[2,51]}];
  defaultActions: {[key:number]: any} = {14:[2,1],132:[2,42],134:[2,60],142:[2,40],143:[2,46],148:[2,41],153:[2,54],154:[2,58],155:[2,59],161:[2,53],164:[2,51]};

  performAction (yytext:string, yyleng:number, yylineno:number, yy:any, yystate:number /* action[1] */, $$:any /* vstack */, _$:any /* lstack */): any {
/* this == yyval */
    var $0 = $$.length - 1;
    switch (yystate) {
case 1:
 return $$[$0-1]; 
case 2:
this.$ = $$[$0].length ? new Union([$$[$0-1]].concat($$[$0])) : $$[$0-1];
break;
case 3: case 7:
this.$ = $$[$0];
break;
case 4: case 8: case 11: case 28:
this.$ = [];
break;
case 5: case 9: case 29:
this.$ = $$[$0-1].concat([$$[$0]]);
break;
case 6:
this.$ = $$[$0].length ? new Intersection([$$[$0-1]].concat($$[$0])) : $$[$0-1];
break;
case 10:
this.$ = new Path($$[$0-1].concat($$[$0]));
break;
case 12:
this.$ = $$[$0-1].concat($$[$0]);
break;
case 13: case 19: case 53:
this.$ = [$$[$0]];
break;
case 17: case 26: case 45:
this.$ = null;
break;
case 21:
this.$ = $$[$0-1] === '@' ? shapeLabelShortCut($$[$0]) : predicateShortCut($$[$0]);
break;
case 24:
this.$ = new UnitStep($$[$0-1], $$[$0-2] ? $$[$0-2] : undefined, $$[$0].length > 0 ? $$[$0] : undefined);
break;
case 25:
this.$ = new PathExprStep($$[$0-2], $$[$0].length > 0 ? $$[$0] : undefined);
break;
case 30:
this.$ = Axis.child;
break;
case 31:
this.$ = Axis.thisShapeExpr;
break;
case 32:
this.$ = Axis.thisTripleExpr;
break;
case 33:
this.$ = Axis.self;
break;
case 34:
this.$ = Axis.parent;
break;
case 35:
this.$ = Axis.ancestor;
break;
case 36:
this.$ = t_Selector.Any;
break;
case 39:
this.$ = $$[$0-1];
break;
case 40: case 41:
this.$ = makeFunction($$[$0-2], $$[$0-1], $$[$0] ? $$[$0] : undefined);
break;
case 42:
this.$ = new Filter(FuncName.index, [$$[$0]]);
break;
case 43:
this.$ = false;
break;
case 44:
this.$ = true;
break;
case 47:
this.$ = new Filter(FuncName.index, []);
break;
case 48: case 49: case 50:
this.$ = new Filter(FuncName.count, []);
break;
case 51:
this.$ = [parseInt($$[$0-1]), $$[$0]];
break;
case 52:
this.$ = [parseInt($$[$0])];
break;
case 54:
this.$ = { op: $$[$0-1], r: $$[$0] };
break;
case 55:
this.$ = FuncName.equal;
break;
case 56:
this.$ = FuncName.lessThan;
break;
case 57:
this.$ = FuncName.greaterThan;
break;
case 58: case 60:
this.$ = parseInt($$[$0]);
break;
case 64:
this.$ = t_termType.Schema;
break;
case 65:
this.$ = t_termType.SemAct;
break;
case 66:
this.$ = t_termType.Annotation;
break;
case 67:
this.$ = t_shapeExprType.ShapeAnd;
break;
case 68:
this.$ = t_shapeExprType.ShapeOr;
break;
case 69:
this.$ = t_shapeExprType.ShapeNot;
break;
case 70:
this.$ = t_shapeExprType.NodeConstraint;
break;
case 71:
this.$ = t_shapeExprType.Shape;
break;
case 72:
this.$ = t_shapeExprType.ShapeExternal;
break;
case 73:
this.$ = t_tripleExprType.EachOf;
break;
case 74:
this.$ = t_tripleExprType.OneOf;
break;
case 75:
this.$ = t_tripleExprType.TripleConstraint;
break;
case 76:
this.$ = t_valueType.IriStem;
break;
case 77:
this.$ = t_valueType.IriStemRange;
break;
case 78:
this.$ = t_valueType.LiteralStem;
break;
case 79:
this.$ = t_valueType.LiteralStemRange;
break;
case 80:
this.$ = t_valueType.Language;
break;
case 81:
this.$ = t_valueType.LanguageStem;
break;
case 82:
this.$ = t_valueType.LanguageStemRange;
break;
case 83:
this.$ = t_valueType.Wildcard;
break;
case 84:
this.$ = t_attribute.type;
break;
case 85:
this.$ = t_attribute.id;
break;
case 86:
this.$ = t_attribute.semActs;
break;
case 87:
this.$ = t_attribute.annotations;
break;
case 88:
this.$ = t_attribute.predicate;
break;
case 95:
this.$ = t_schemaAttr.atContext;
break;
case 96:
this.$ = t_schemaAttr.startActs;
break;
case 97:
this.$ = t_schemaAttr.start;
break;
case 98:
this.$ = t_schemaAttr.imports;
break;
case 99:
this.$ = t_schemaAttr.shapes;
break;
case 100:
this.$ = t_shapeExprAttr.shapeExprs;
break;
case 101:
this.$ = t_shapeExprAttr.shapeExpr;
break;
case 104:
this.$ = t_nodeConstraintAttr.nodeKind;
break;
case 105:
this.$ = t_nodeConstraintAttr.datatype;
break;
case 107:
this.$ = t_nodeConstraintAttr.values;
break;
case 110:
this.$ = t_stringFacetAttr.length;
break;
case 111:
this.$ = t_stringFacetAttr.minlength;
break;
case 112:
this.$ = t_stringFacetAttr.maxlength;
break;
case 113:
this.$ = t_stringFacetAttr.pattern;
break;
case 114:
this.$ = t_stringFacetAttr.flags;
break;
case 115:
this.$ = t_numericFacetAttr.mininclusive;
break;
case 116:
this.$ = t_numericFacetAttr.minexclusive;
break;
case 117:
this.$ = t_numericFacetAttr.maxinclusive;
break;
case 118:
this.$ = t_numericFacetAttr.maxexclusive;
break;
case 119:
this.$ = t_numericFacetAttr.totaldigits;
break;
case 120:
this.$ = t_numericFacetAttr.fractiondigits;
break;
case 121:
this.$ = t_valueSetValueAttr.value;
break;
case 122:
this.$ = t_valueSetValueAttr.language;
break;
case 123:
this.$ = t_valueSetValueAttr.stem;
break;
case 124:
this.$ = t_valueSetValueAttr.exclusions;
break;
case 125:
this.$ = t_valueSetValueAttr.languageTag;
break;
case 126:
this.$ = t_shapeAttr.closed;
break;
case 127:
this.$ = t_shapeAttr.extra;
break;
case 128:
this.$ = t_shapeAttr.expression;
break;
case 129:
this.$ = t_tripleExprAttr.expressions;
break;
case 130:
this.$ = t_tripleExprAttr.min;
break;
case 131:
this.$ = t_tripleExprAttr.max;
break;
case 133:
this.$ = t_tripleConstraintAttr.inverse;
break;
case 134:
this.$ = t_tripleConstraintAttr.valueExpr;
break;
case 135:
this.$ = t_semActAttr.name;
break;
case 136:
this.$ = t_semActAttr.code;
break;
case 137:
this.$ = t_annotationAttr.object;
break;
case 138:
this.$ = new Iri(new URL($$[$0].substr(1, $$[$0].length - 2), yy.base).href);
break;
case 140: case 141:
this.$ = pnameToUrl($$[$0], yy);
break;
    }
  }
}

/* generated by ts-jison-lex 0.0.6 */
export class ShapePathLexer extends JisonLexer implements JisonLexerApi {
  options: any = {"moduleName":"ShapePath"};
  constructor (yy = {}) {
    super(yy);
  }

  rules: RegExp[] = [/^(?:\s+|(#[^\u000a\u000d]*|<--([^-]|-[^-]|--[^>])*-->))/,/^(?:([Uu][Nn][Ii][Oo][Nn]))/,/^(?:([Ii][Nn][Tt][Ee][Rr][Ss][Ee][Cc][Tt][Ii][Oo][Nn]))/,/^(?:([Aa][Ss][Ss][Ee][Rr][Tt]))/,/^(?:child::)/,/^(?:thisShapeExpr::)/,/^(?:thisTripleExpr::)/,/^(?:self::)/,/^(?:parent::)/,/^(?:ancestor::)/,/^(?:index\b)/,/^(?:count\b)/,/^(?:foo1\b)/,/^(?:foo2\b)/,/^(?:Schema\b)/,/^(?:SemAct\b)/,/^(?:Annotation\b)/,/^(?:ShapeAnd\b)/,/^(?:ShapeOr\b)/,/^(?:ShapeNot\b)/,/^(?:NodeConstraint\b)/,/^(?:Shape\b)/,/^(?:ShapeExternal\b)/,/^(?:EachOf\b)/,/^(?:OneOf\b)/,/^(?:TripleConstraint\b)/,/^(?:IriStem\b)/,/^(?:IriStemRange\b)/,/^(?:LiteralStem\b)/,/^(?:LiteralStemRange\b)/,/^(?:Language\b)/,/^(?:LanguageStem\b)/,/^(?:LanguageStemRange\b)/,/^(?:Wildcard\b)/,/^(?:type\b)/,/^(?:id\b)/,/^(?:semActs\b)/,/^(?:annotations\b)/,/^(?:predicate\b)/,/^(?:@context\b)/,/^(?:startActs\b)/,/^(?:start\b)/,/^(?:imports\b)/,/^(?:shapes\b)/,/^(?:shapeExprs\b)/,/^(?:shapeExpr\b)/,/^(?:nodeKind\b)/,/^(?:datatype\b)/,/^(?:values\b)/,/^(?:length\b)/,/^(?:minlength\b)/,/^(?:maxlength\b)/,/^(?:pattern\b)/,/^(?:flags\b)/,/^(?:mininclusive\b)/,/^(?:minexclusive\b)/,/^(?:maxinclusive\b)/,/^(?:maxexclusive\b)/,/^(?:totaldigits\b)/,/^(?:fractiondigits\b)/,/^(?:value\b)/,/^(?:language\b)/,/^(?:stem\b)/,/^(?:exclusions\b)/,/^(?:languageTag\b)/,/^(?:closed\b)/,/^(?:extra\b)/,/^(?:expression\b)/,/^(?:expressions\b)/,/^(?:min\b)/,/^(?:max\b)/,/^(?:inverse\b)/,/^(?:valueExpr\b)/,/^(?:name\b)/,/^(?:code\b)/,/^(?:object\b)/,/^(?:(<([^\u0000-\u0020<>\"{}|^`\\]|(\\u([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])|\\U([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])))*>))/,/^(?:(((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])((((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.)*((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040]))?)?:)(((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|:|[0-9]|((%([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f]))|(\\(_|~|\.|-|!|\$|&|'|\(|\)|\*|\+|,|;|=|\/|\?|#|@|%))))(((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.|:|((%([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f]))|(\\(_|~|\.|-|!|\$|&|'|\(|\)|\*|\+|,|;|=|\/|\?|#|@|%))))*)))/,/^(?:((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])((((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.)*((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040]))?)?:))/,/^(?:(([+-])?([0-9])+))/,/^(?:@)/,/^(?:\.)/,/^(?:\*)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\/\/)/,/^(?:\/)/,/^(?:=)/,/^(?:<)/,/^(?:>)/,/^(?:[a-zA-Z0-9_-]+)/,/^(?:.)/,/^(?:$)/];
  conditions: any = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94],"inclusive":true}}
  performAction (yy:any,yy_:any,$avoiding_name_collisions:any,YY_START:any): any {
    var YYSTATE=YY_START;
    switch($avoiding_name_collisions) {
    case 0:/*skip*/
      break;
    case 1:return 9;
    case 2:return 13;
    case 3:return 50;
    case 4:return 34;
    case 5:return 35;
    case 6:return 36;
    case 7:return 37;
    case 8:return 38;
    case 9:return 39;
    case 10:return 52;
    case 11:return 53;
    case 12:return 54;
    case 13:return 55;
    case 14:return 66;
    case 15:return 67;
    case 16:return 68;
    case 17:return 69;
    case 18:return 70;
    case 19:return 71;
    case 20:return 72;
    case 21:return 73;
    case 22:return 74;
    case 23:return 75;
    case 24:return 76;
    case 25:return 77;
    case 26:return 78;
    case 27:return 79;
    case 28:return 80;
    case 29:return 81;
    case 30:return 82;
    case 31:return 83;
    case 32:return 84;
    case 33:return 85;
    case 34:return 86;
    case 35:return 87;
    case 36:return 88;
    case 37:return 89;
    case 38:return 90;
    case 39:return 97;
    case 40:return 98;
    case 41:return 99;
    case 42:return 100;
    case 43:return 101;
    case 44:return 102;
    case 45:return 103;
    case 46:return 106;
    case 47:return 107;
    case 48:return 109;
    case 49:return 112;
    case 50:return 113;
    case 51:return 114;
    case 52:return 115;
    case 53:return 116;
    case 54:return 117;
    case 55:return 118;
    case 56:return 119;
    case 57:return 120;
    case 58:return 121;
    case 59:return 122;
    case 60:return 123;
    case 61:return 124;
    case 62:return 125;
    case 63:return 126;
    case 64:return 127;
    case 65:return 128;
    case 66:return 129;
    case 67:return 130;
    case 68:return 131;
    case 69:return 132;
    case 70:return 133;
    case 71:return 135;
    case 72:return 136;
    case 73:return 137;
    case 74:return 138;
    case 75:return 139;
    case 76:return 140;
    case 77:return 142;
    case 78:return 143;
    case 79:return 57;
    case 80:return 25;
    case 81:return 26;
    case 82:return 40;
    case 83:return 30;
    case 84:return 31;
    case 85:return 43;
    case 86:return 45;
    case 87:return 22;
    case 88:return 21;
    case 89:return 60;
    case 90:return 61;
    case 91:return 62;
    case 92:return 'unexpected word "'+yy_.yytext+'"';
    case 93:return 'invalid character '+yy_.yytext;
    case 94:return 5;
    }
  }
}
