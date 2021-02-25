/* parser generated by jison 0.0.5 */
/**
 * Returns a Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */

import {Union, Intersection, Path, Step, Axis, t_Selector, Assertion, Filter,
        Func, FuncArg, FuncName,
        t_termType, t_shapeExprType, t_tripleExprType, t_valueType, t_attribute,
        t_schemaAttr, t_shapeExprAttr, t_nodeConstraintAttr, t_stringFacetAttr,
        t_numericFacetAttr, t_valueSetValueAttr, t_shapeAttr, t_tripleExprAttr,
        t_tripleConstraintAttr, t_semActAttr, t_annotationAttr
       } from './ShapePathAst'
import {comparison, rvalue, shapeLabelShortCut, predicateShortCut
       } from './ShapePathJisonInternals'
function makeFunction (assertionP: boolean, l: FuncArg, comp: comparison): Func {
  const { op, r } = comp
  const ret = new Filter(l, op, r)
  return assertionP
    ? new Assertion(ret)
    : ret
}

function pnameToUrl (pname: string, yy: any): URL {
  const idx = pname.indexOf(':')
  const pre = pname.substr(0, idx)
  const lname = pname.substr(idx+1)
  if (!(pre in yy.prefixes))
    throw Error(`unknown prefix in ${pname}`)
  const ns = yy.prefixes[pre]
  return new URL(ns + lname, yy.base)
}

import { JisonParser, JisonParserApi, StateType, SymbolsType, TerminalsType, ProductionsType, o } from '@ts-jison/parser';
import { JisonLexer, JisonLexerApi } from '@ts-jison/lexer';

const $V0=[32,33,34,35,36,37,38,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,92,93,94,95,96,97,98,101,102,104,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,130,131,132,133,134],$V1=[2,17],$V2=[1,10],$V3=[1,11],$V4=[1,12],$V5=[1,13],$V6=[5,9,43,54,55,56],$V7=[5,9,13,43,54,55,56],$V8=[5,9,13,21,22,25,26,43,54,55,56],$V9=[38,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,92,93,94,95,96,97,98,101,102,104,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,130,131,132,133,134],$Va=[2,25],$Vb=[1,21],$Vc=[1,22],$Vd=[1,23],$Ve=[1,24],$Vf=[1,25],$Vg=[1,26],$Vh=[1,28],$Vi=[1,30],$Vj=[1,31],$Vk=[135,137,138],$Vl=[5,9,13,21,22,25,26,41,43,54,55,56],$Vm=[21,22,25,26,32,33,34,35,36,37,38,50,51,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,92,93,94,95,96,97,98,101,102,104,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,130,131,132,133,134],$Vn=[1,139],$Vo=[1,140],$Vp=[1,141],$Vq=[54,55,56],$Vr=[57,135,137,138];

export class ShapePathParser extends JisonParser implements JisonParserApi {
  public Parser?: ShapePathParser;
  $?: any;

  constructor (yy = {}, lexer = new ShapePathLexer(yy)) {
    super(yy, lexer);
  }

  symbols_: SymbolsType = {"error":2,"top":3,"shapePath":4,"EOF":5,"unionStep":6,"Q_O_QIT_union_E_S_QunionStep_E_C_E_Star":7,"O_QIT_union_E_S_QunionStep_E_C":8,"IT_UNION":9,"intersectionStep":10,"Q_O_QIT_intersection_E_S_QintersectionStep_E_C_E_Star":11,"O_QIT_intersection_E_S_QintersectionStep_E_C":12,"IT_INTERSECTION":13,"startStep":14,"QnextStep_E_Star":15,"nextStep":16,"Q_O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C_E_Opt":17,"step":18,"shortcut":19,"O_QGT_DIVIDE_E_Or_QGT_DIVIDE_DIVIDE_E_C":20,"IT_DIVIDE":21,"IT_DIVIDEDIVIDE":22,"O_QGT_AT_E_Or_QGT_DOT_E_C":23,"iri":24,"IT_AT":25,"IT_DOT":26,"Qaxis_E_Opt":27,"selector":28,"Qfilter_E_Star":29,"axis":30,"filter":31,"IT_child":32,"IT_thisShapeExpr":33,"IT_thisTripleExpr":34,"IT_self":35,"IT_parent":36,"IT_ancestor":37,"IT_STAR":38,"termType":39,"attribute":40,"IT_LBRACKET":41,"filterExpr":42,"IT_RBRACKET":43,"QIT_ASSERT_E_Opt":44,"Qcomparison_E_Opt":45,"function":46,"comparison":47,"numericExpr":48,"IT_ASSERT":49,"GT_index":50,"GT_length":51,"comparitor":52,"rvalue":53,"IT_EQUAL":54,"IT_LT":55,"IT_GT":56,"INTEGER":57,"shapeExprType":58,"tripleExprType":59,"valueType":60,"IT_Schema":61,"IT_SemAct":62,"IT_Annotation":63,"IT_ShapeAnd":64,"IT_ShapeOr":65,"IT_ShapeNot":66,"IT_NodeConstraint":67,"IT_Shape":68,"IT_ShapeExternal":69,"IT_EachOf":70,"IT_OneOf":71,"IT_TripleConstraint":72,"IT_IriStem":73,"IT_IriStemRange":74,"IT_LiteralStem":75,"IT_LiteralStemRange":76,"IT_Language":77,"IT_LanguageStem":78,"IT_LanguageStemRange":79,"IT_Wildcard":80,"IT_type":81,"IT_id":82,"IT_semActs":83,"IT_annotations":84,"IT_predicate":85,"schemaAttr":86,"shapeExprAttr":87,"tripleExprAttr":88,"valueSetValueAttr":89,"semActAttr":90,"annotationAttr":91,"GT_atContext":92,"IT_startActs":93,"IT_start":94,"IT_imports":95,"IT_shapes":96,"IT_shapeExprs":97,"IT_shapeExpr":98,"nodeConstraintAttr":99,"shapeAttr":100,"IT_nodeKind":101,"IT_datatype":102,"xsFacetAttr":103,"IT_values":104,"stringFacetAttr":105,"numericFacetAttr":106,"IT_length":107,"IT_minlength":108,"IT_maxlength":109,"IT_pattern":110,"IT_flags":111,"IT_mininclusive":112,"IT_minexclusive":113,"IT_maxinclusive":114,"IT_maxexclusive":115,"IT_totaldigits":116,"IT_fractiondigits":117,"IT_value":118,"IT_language":119,"IT_stem":120,"IT_exclusions":121,"IT_languageTag":122,"IT_closed":123,"IT_extra":124,"IT_expression":125,"IT_expressions":126,"IT_min":127,"IT_max":128,"tripleConstraintAttr":129,"IT_inverse":130,"IT_valueExpr":131,"IT_name":132,"IT_code":133,"IT_object":134,"IRIREF":135,"prefixedName":136,"PNAME_LN":137,"PNAME_NS":138,"$accept":0,"$end":1};
  terminals_: TerminalsType = {2:"error",5:"EOF",9:"IT_UNION",13:"IT_INTERSECTION",21:"IT_DIVIDE",22:"IT_DIVIDEDIVIDE",25:"IT_AT",26:"IT_DOT",32:"IT_child",33:"IT_thisShapeExpr",34:"IT_thisTripleExpr",35:"IT_self",36:"IT_parent",37:"IT_ancestor",38:"IT_STAR",41:"IT_LBRACKET",43:"IT_RBRACKET",49:"IT_ASSERT",50:"GT_index",51:"GT_length",54:"IT_EQUAL",55:"IT_LT",56:"IT_GT",57:"INTEGER",61:"IT_Schema",62:"IT_SemAct",63:"IT_Annotation",64:"IT_ShapeAnd",65:"IT_ShapeOr",66:"IT_ShapeNot",67:"IT_NodeConstraint",68:"IT_Shape",69:"IT_ShapeExternal",70:"IT_EachOf",71:"IT_OneOf",72:"IT_TripleConstraint",73:"IT_IriStem",74:"IT_IriStemRange",75:"IT_LiteralStem",76:"IT_LiteralStemRange",77:"IT_Language",78:"IT_LanguageStem",79:"IT_LanguageStemRange",80:"IT_Wildcard",81:"IT_type",82:"IT_id",83:"IT_semActs",84:"IT_annotations",85:"IT_predicate",92:"GT_atContext",93:"IT_startActs",94:"IT_start",95:"IT_imports",96:"IT_shapes",97:"IT_shapeExprs",98:"IT_shapeExpr",101:"IT_nodeKind",102:"IT_datatype",104:"IT_values",107:"IT_length",108:"IT_minlength",109:"IT_maxlength",110:"IT_pattern",111:"IT_flags",112:"IT_mininclusive",113:"IT_minexclusive",114:"IT_maxinclusive",115:"IT_maxexclusive",116:"IT_totaldigits",117:"IT_fractiondigits",118:"IT_value",119:"IT_language",120:"IT_stem",121:"IT_exclusions",122:"IT_languageTag",123:"IT_closed",124:"IT_extra",125:"IT_expression",126:"IT_expressions",127:"IT_min",128:"IT_max",130:"IT_inverse",131:"IT_valueExpr",132:"IT_name",133:"IT_code",134:"IT_object",135:"IRIREF",137:"PNAME_LN",138:"PNAME_NS"};
  productions_: ProductionsType = [0,[3,2],[4,2],[8,2],[7,0],[7,2],[6,2],[12,2],[11,0],[11,2],[10,2],[15,0],[15,2],[14,2],[14,1],[20,1],[20,1],[17,0],[17,1],[16,2],[16,1],[19,2],[23,1],[23,1],[18,3],[27,0],[27,1],[29,0],[29,2],[30,1],[30,1],[30,1],[30,1],[30,1],[30,1],[28,1],[28,1],[28,1],[31,3],[42,3],[42,3],[42,1],[44,0],[44,1],[45,0],[45,1],[46,1],[46,1],[47,2],[52,1],[52,1],[52,1],[53,1],[53,1],[48,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[58,1],[58,1],[58,1],[58,1],[58,1],[58,1],[59,1],[59,1],[59,1],[60,1],[60,1],[60,1],[60,1],[60,1],[60,1],[60,1],[60,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[86,1],[86,1],[86,1],[86,1],[86,1],[87,1],[87,1],[87,1],[87,1],[99,1],[99,1],[99,1],[99,1],[103,1],[103,1],[105,1],[105,1],[105,1],[105,1],[105,1],[106,1],[106,1],[106,1],[106,1],[106,1],[106,1],[89,1],[89,1],[89,1],[89,1],[89,1],[100,1],[100,1],[100,1],[88,1],[88,1],[88,1],[88,1],[129,1],[129,1],[90,1],[90,1],[91,1],[24,1],[24,1],[136,1],[136,1]];
  table: Array<StateType> = [o($V0,$V1,{3:1,4:2,6:3,10:4,14:5,17:6,19:7,20:8,23:9,21:$V2,22:$V3,25:$V4,26:$V5}),{1:[3]},{5:[1,14]},o($V6,[2,4],{7:15}),o($V7,[2,8],{11:16}),o($V8,[2,11],{15:17}),o($V9,$Va,{18:18,27:19,30:20,32:$Vb,33:$Vc,34:$Vd,35:$Ve,36:$Vf,37:$Vg}),o($V8,[2,14]),o($V0,[2,18]),{24:27,135:$Vh,136:29,137:$Vi,138:$Vj},o($V0,[2,15]),o($V0,[2,16]),o($Vk,[2,22]),o($Vk,[2,23]),{1:[2,1]},o([5,43,54,55,56],[2,2],{8:32,9:[1,33]}),o($V6,[2,6],{12:34,13:[1,35]}),o($V7,[2,10],{23:9,16:36,20:37,19:38,21:$V2,22:$V3,25:$V4,26:$V5}),o($V8,[2,13]),{28:39,38:[1,40],39:41,40:42,58:43,59:44,60:45,61:[1,46],62:[1,47],63:[1,48],64:[1,60],65:[1,61],66:[1,62],67:[1,63],68:[1,64],69:[1,65],70:[1,66],71:[1,67],72:[1,68],73:[1,69],74:[1,70],75:[1,71],76:[1,72],77:[1,73],78:[1,74],79:[1,75],80:[1,76],81:[1,49],82:[1,50],83:[1,51],84:[1,52],85:[1,53],86:54,87:55,88:56,89:57,90:58,91:59,92:[1,77],93:[1,78],94:[1,79],95:[1,80],96:[1,81],97:[1,82],98:[1,83],99:84,100:85,101:[1,98],102:[1,99],103:100,104:[1,101],105:107,106:108,107:[1,109],108:[1,110],109:[1,111],110:[1,112],111:[1,113],112:[1,114],113:[1,115],114:[1,116],115:[1,117],116:[1,118],117:[1,119],118:[1,90],119:[1,91],120:[1,92],121:[1,93],122:[1,94],123:[1,102],124:[1,103],125:[1,104],126:[1,86],127:[1,87],128:[1,88],129:89,130:[1,105],131:[1,106],132:[1,95],133:[1,96],134:[1,97]},o($V9,[2,26]),o($V9,[2,29]),o($V9,[2,30]),o($V9,[2,31]),o($V9,[2,32]),o($V9,[2,33]),o($V9,[2,34]),o($V8,[2,21]),o($V8,[2,132]),o($V8,[2,133]),o($V8,[2,134]),o($V8,[2,135]),o($V6,[2,5]),o($V0,$V1,{10:4,14:5,17:6,19:7,20:8,23:9,6:120,21:$V2,22:$V3,25:$V4,26:$V5}),o($V7,[2,9]),o($V0,$V1,{14:5,17:6,19:7,20:8,23:9,10:121,21:$V2,22:$V3,25:$V4,26:$V5}),o($V8,[2,12]),o($V9,$Va,{27:19,30:20,18:122,32:$Vb,33:$Vc,34:$Vd,35:$Ve,36:$Vf,37:$Vg}),o($V8,[2,20]),o($Vl,[2,27],{29:123}),o($Vl,[2,35]),o($Vl,[2,36]),o($Vl,[2,37]),o($Vl,[2,55]),o($Vl,[2,56]),o($Vl,[2,57]),o($Vl,[2,58]),o($Vl,[2,59]),o($Vl,[2,60]),o($Vl,[2,78]),o($Vl,[2,79]),o($Vl,[2,80]),o($Vl,[2,81]),o($Vl,[2,82]),o($Vl,[2,83]),o($Vl,[2,84]),o($Vl,[2,85]),o($Vl,[2,86]),o($Vl,[2,87]),o($Vl,[2,88]),o($Vl,[2,61]),o($Vl,[2,62]),o($Vl,[2,63]),o($Vl,[2,64]),o($Vl,[2,65]),o($Vl,[2,66]),o($Vl,[2,67]),o($Vl,[2,68]),o($Vl,[2,69]),o($Vl,[2,70]),o($Vl,[2,71]),o($Vl,[2,72]),o($Vl,[2,73]),o($Vl,[2,74]),o($Vl,[2,75]),o($Vl,[2,76]),o($Vl,[2,77]),o($Vl,[2,89]),o($Vl,[2,90]),o($Vl,[2,91]),o($Vl,[2,92]),o($Vl,[2,93]),o($Vl,[2,94]),o($Vl,[2,95]),o($Vl,[2,96]),o($Vl,[2,97]),o($Vl,[2,123]),o($Vl,[2,124]),o($Vl,[2,125]),o($Vl,[2,126]),o($Vl,[2,115]),o($Vl,[2,116]),o($Vl,[2,117]),o($Vl,[2,118]),o($Vl,[2,119]),o($Vl,[2,129]),o($Vl,[2,130]),o($Vl,[2,131]),o($Vl,[2,98]),o($Vl,[2,99]),o($Vl,[2,100]),o($Vl,[2,101]),o($Vl,[2,120]),o($Vl,[2,121]),o($Vl,[2,122]),o($Vl,[2,127]),o($Vl,[2,128]),o($Vl,[2,102]),o($Vl,[2,103]),o($Vl,[2,104]),o($Vl,[2,105]),o($Vl,[2,106]),o($Vl,[2,107]),o($Vl,[2,108]),o($Vl,[2,109]),o($Vl,[2,110]),o($Vl,[2,111]),o($Vl,[2,112]),o($Vl,[2,113]),o($Vl,[2,114]),o($V6,[2,3]),o($V7,[2,7]),o($V8,[2,19]),o($V8,[2,24],{31:124,41:[1,125]}),o($Vl,[2,28]),o($Vm,[2,42],{42:126,44:127,48:128,49:[1,129],57:[1,130]}),{43:[1,131]},o($V0,$V1,{6:3,10:4,14:5,17:6,19:7,20:8,23:9,4:132,46:133,21:$V2,22:$V3,25:$V4,26:$V5,50:[1,134],51:[1,135]}),{43:[2,41]},o($Vm,[2,43]),{43:[2,54]},o($Vl,[2,38]),{43:[2,44],45:136,47:137,52:138,54:$Vn,55:$Vo,56:$Vp},{47:142,52:138,54:$Vn,55:$Vo,56:$Vp},o($Vq,[2,46]),o($Vq,[2,47]),{43:[2,39]},{43:[2,45]},{24:145,53:143,57:[1,144],135:$Vh,136:29,137:$Vi,138:$Vj},o($Vr,[2,49]),o($Vr,[2,50]),o($Vr,[2,51]),{43:[2,40]},{43:[2,48]},{43:[2,52]},{43:[2,53]}];
  defaultActions: {[key:number]: any} = {14:[2,1],128:[2,41],130:[2,54],136:[2,39],137:[2,45],142:[2,40],143:[2,48],144:[2,52],145:[2,53]};

  performAction (yytext:string, yyleng:number, yylineno:number, yy:any, yystate:number /* action[1] */, $$:any /* vstack */, _$:any /* lstack */): any {
/* this == yyval */
    var $0 = $$.length - 1;
    switch (yystate) {
case 1:
 return $$[$0-1] 
break;
case 2:
this.$ = $$[$0].length ? new Union([$$[$0-1]].concat($$[$0])) : $$[$0-1];
break;
case 3: case 7:
this.$ = $$[$0];
break;
case 4: case 8: case 11: case 27:
this.$ = [];
break;
case 5: case 9: case 28:
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
case 13: case 19:
this.$ = [$$[$0]];
break;
case 17: case 25: case 44:
this.$ = null;
break;
case 21:
this.$ = $$[$0-1] === '@' ? shapeLabelShortCut($$[$0]) : predicateShortCut($$[$0]);
break;
case 24:
this.$ = new Step($$[$0-1], $$[$0-2] ? $$[$0-2] : undefined, $$[$0].length > 0 ? $$[$0] : undefined);
break;
case 29:
this.$ = Axis.child;
break;
case 30:
this.$ = Axis.thisShapeExpr;
break;
case 31:
this.$ = Axis.thisTripleExpr;
break;
case 32:
this.$ = Axis.self;
break;
case 33:
this.$ = Axis.parent;
break;
case 34:
this.$ = Axis.ancestor;
break;
case 35:
this.$ = t_Selector.Any;
break;
case 38:
this.$ = $$[$0-1];
break;
case 39:
this.$ = makeFunction($$[$0-2], $$[$0-1], $$[$0] ? $$[$0] : { op: FuncName.ebv, r: null });
break;
case 40:
this.$ = makeFunction($$[$0-2], $$[$0-1], $$[$0]);
break;
case 41:
this.$ = new Filter($$[$0], FuncName.index, '@@');
break;
case 42:
this.$ = false;
break;
case 43:
this.$ = true;
break;
case 46:
this.$ = new Filter('@@', FuncName.index, '@@');
break;
case 47:
this.$ = new Filter('@@', FuncName.length, '@@');
break;
case 48:
this.$ = { op: $$[$0-1], r: $$[$0] };
break;
case 49:
this.$ = FuncName.equal;
break;
case 50:
this.$ = FuncName.lessThan;
break;
case 51:
this.$ = FuncName.greaterThan;
break;
case 52: case 54:
this.$ = parseInt($$[$0]);
break;
case 58:
this.$ = t_termType.Schema;
break;
case 59:
this.$ = t_termType.SemAct;
break;
case 60:
this.$ = t_termType.Annotation;
break;
case 61:
this.$ = t_shapeExprType.ShapeAnd;
break;
case 62:
this.$ = t_shapeExprType.ShapeOr;
break;
case 63:
this.$ = t_shapeExprType.ShapeNot;
break;
case 64:
this.$ = t_shapeExprType.NodeConstraint;
break;
case 65:
this.$ = t_shapeExprType.Shape;
break;
case 66:
this.$ = t_shapeExprType.ShapeExternal;
break;
case 67:
this.$ = t_tripleExprType.EachOf;
break;
case 68:
this.$ = t_tripleExprType.OneOf;
break;
case 69:
this.$ = t_tripleExprType.TripleConstraint;
break;
case 70:
this.$ = t_valueType.IriStem;
break;
case 71:
this.$ = t_valueType.IriStemRange;
break;
case 72:
this.$ = t_valueType.LiteralStem;
break;
case 73:
this.$ = t_valueType.LiteralStemRange;
break;
case 74:
this.$ = t_valueType.Language;
break;
case 75:
this.$ = t_valueType.LanguageStem;
break;
case 76:
this.$ = t_valueType.LanguageStemRange;
break;
case 77:
this.$ = t_valueType.Wildcard;
break;
case 78:
this.$ = t_attribute.type;
break;
case 79:
this.$ = t_attribute.id;
break;
case 80:
this.$ = t_attribute.semActs;
break;
case 81:
this.$ = t_attribute.annotations;
break;
case 82:
this.$ = t_attribute.predicate;
break;
case 89:
this.$ = t_schemaAttr.atContext;
break;
case 90:
this.$ = t_schemaAttr.startActs;
break;
case 91:
this.$ = t_schemaAttr.start;
break;
case 92:
this.$ = t_schemaAttr.imports;
break;
case 93:
this.$ = t_schemaAttr.shapes;
break;
case 94:
this.$ = t_shapeExprAttr.shapeExprs;
break;
case 95:
this.$ = t_shapeExprAttr.shapeExpr;
break;
case 98:
this.$ = t_nodeConstraintAttr.nodeKind;
break;
case 99:
this.$ = t_nodeConstraintAttr.datatype;
break;
case 101:
this.$ = t_nodeConstraintAttr.values;
break;
case 104:
this.$ = t_stringFacetAttr.length;
break;
case 105:
this.$ = t_stringFacetAttr.minlength;
break;
case 106:
this.$ = t_stringFacetAttr.maxlength;
break;
case 107:
this.$ = t_stringFacetAttr.pattern;
break;
case 108:
this.$ = t_stringFacetAttr.flags;
break;
case 109:
this.$ = t_numericFacetAttr.mininclusive;
break;
case 110:
this.$ = t_numericFacetAttr.minexclusive;
break;
case 111:
this.$ = t_numericFacetAttr.maxinclusive;
break;
case 112:
this.$ = t_numericFacetAttr.maxexclusive;
break;
case 113:
this.$ = t_numericFacetAttr.totaldigits;
break;
case 114:
this.$ = t_numericFacetAttr.fractiondigits;
break;
case 115:
this.$ = t_valueSetValueAttr.value;
break;
case 116:
this.$ = t_valueSetValueAttr.language;
break;
case 117:
this.$ = t_valueSetValueAttr.stem;
break;
case 118:
this.$ = t_valueSetValueAttr.exclusions;
break;
case 119:
this.$ = t_valueSetValueAttr.languageTag;
break;
case 120:
this.$ = t_shapeAttr.closed;
break;
case 121:
this.$ = t_shapeAttr.extra;
break;
case 122:
this.$ = t_shapeAttr.expression;
break;
case 123:
this.$ = t_tripleExprAttr.expressions;
break;
case 124:
this.$ = t_tripleExprAttr.min;
break;
case 125:
this.$ = t_tripleExprAttr.max;
break;
case 127:
this.$ = t_tripleConstraintAttr.inverse;
break;
case 128:
this.$ = t_tripleConstraintAttr.valueExpr;
break;
case 129:
this.$ = t_semActAttr.name;
break;
case 130:
this.$ = t_semActAttr.code;
break;
case 131:
this.$ = t_annotationAttr.object;
break;
case 132:
this.$ = new URL($$[$0].substr(1, $$[$0].length - 2), yy.base);
break;
case 134: case 135:
this.$ = pnameToUrl($$[$0], yy);
break;
    }
  }
}

/* generated by ts-jison-lex 0.0.5 */
export class ShapePathLexer extends JisonLexer implements JisonLexerApi {
  options: any = {"moduleName":"ShapePath"};
  constructor (yy = {}) {
    super(yy);
  }

  rules: RegExp[] = [/^(?:\s+|(#[^\u000a\u000d]*|<--([^-]|-[^-]|--[^>])*-->))/,/^(?:([Uu][Nn][Ii][Oo][Nn]))/,/^(?:([Ii][Nn][Tt][Ee][Rr][Ss][Ee][Cc][Tt][Ii][Oo][Nn]))/,/^(?:([Aa][Ss][Ss][Ee][Rr][Tt]))/,/^(?:child::)/,/^(?:thisShapeExpr::)/,/^(?:thisTripleExpr::)/,/^(?:self::)/,/^(?:parent::)/,/^(?:ancestor::)/,/^(?:index\(\))/,/^(?:length\(\))/,/^(?:Schema\b)/,/^(?:SemAct\b)/,/^(?:Annotation\b)/,/^(?:ShapeAnd\b)/,/^(?:ShapeOr\b)/,/^(?:ShapeNot\b)/,/^(?:NodeConstraint\b)/,/^(?:Shape\b)/,/^(?:ShapeExternal\b)/,/^(?:EachOf\b)/,/^(?:OneOf\b)/,/^(?:TripleConstraint\b)/,/^(?:IriStem\b)/,/^(?:IriStemRange\b)/,/^(?:LiteralStem\b)/,/^(?:LiteralStemRange\b)/,/^(?:Language\b)/,/^(?:LanguageStem\b)/,/^(?:LanguageStemRange\b)/,/^(?:Wildcard\b)/,/^(?:type\b)/,/^(?:id\b)/,/^(?:semActs\b)/,/^(?:annotations\b)/,/^(?:predicate\b)/,/^(?:@context\b)/,/^(?:startActs\b)/,/^(?:start\b)/,/^(?:imports\b)/,/^(?:shapes\b)/,/^(?:shapeExprs\b)/,/^(?:shapeExpr\b)/,/^(?:nodeKind\b)/,/^(?:datatype\b)/,/^(?:values\b)/,/^(?:length\b)/,/^(?:minlength\b)/,/^(?:maxlength\b)/,/^(?:pattern\b)/,/^(?:flags\b)/,/^(?:mininclusive\b)/,/^(?:minexclusive\b)/,/^(?:maxinclusive\b)/,/^(?:maxexclusive\b)/,/^(?:totaldigits\b)/,/^(?:fractiondigits\b)/,/^(?:value\b)/,/^(?:language\b)/,/^(?:stem\b)/,/^(?:exclusions\b)/,/^(?:languageTag\b)/,/^(?:closed\b)/,/^(?:extra\b)/,/^(?:expression\b)/,/^(?:expressions\b)/,/^(?:min\b)/,/^(?:max\b)/,/^(?:inverse\b)/,/^(?:valueExpr\b)/,/^(?:name\b)/,/^(?:code\b)/,/^(?:object\b)/,/^(?:(<([^\u0000-\u0020<>\"{}|^`\\]|(\\u([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])|\\U([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])([0-9]|[A-F]|[a-f])))*>))/,/^(?:((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])((((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.)*((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040]))?)?:))/,/^(?:(((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])((((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040])|\.)*((([A-Z]|[a-z]|[\u00c0-\u00d6]|[\u00d8-\u00f6]|[\u00f8-\u02ff]|[\u0370-\u037d]|[\u037f-\u1fff]|[\u200c-\u200d]|[\u2070-\u218f]|[\u2c00-\u2fef]|[\u3001-\ud7ff]|[\uf900-\ufdcf]|[\ufdf0-\ufffd]|[\uD800-\uDB7F][\uDC00-\uDFFF])|_|_\b)|-|[0-9]|[\u00b7]|[\u0300-\u036f]|[\u203f-\u2040]))?)?:){PN_LOCAL}))/,/^(?:(([+-])?([0-9])+))/,/^(?:@)/,/^(?:\.)/,/^(?:\*)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\/\/)/,/^(?:\/)/,/^(?:=)/,/^(?:<)/,/^(?:>)/,/^(?:[a-zA-Z0-9_-]+)/,/^(?:.)/,/^(?:$)/];
  conditions: any = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92],"inclusive":true}}
  performAction (yy:any,yy_:any,$avoiding_name_collisions:any,YY_START:any): any {
    var YYSTATE=YY_START;
    switch($avoiding_name_collisions) {
    case 0:/*skip*/
      break;
    case 1:return 9;
      break;
    case 2:return 13;
      break;
    case 3:return 49;
      break;
    case 4:return 32;
      break;
    case 5:return 33;
      break;
    case 6:return 34;
      break;
    case 7:return 35;
      break;
    case 8:return 36;
      break;
    case 9:return 37;
      break;
    case 10:return 50;
      break;
    case 11:return 51;
      break;
    case 12:return 61;
      break;
    case 13:return 62;
      break;
    case 14:return 63;
      break;
    case 15:return 64;
      break;
    case 16:return 65;
      break;
    case 17:return 66;
      break;
    case 18:return 67;
      break;
    case 19:return 68;
      break;
    case 20:return 69;
      break;
    case 21:return 70;
      break;
    case 22:return 71;
      break;
    case 23:return 72;
      break;
    case 24:return 73;
      break;
    case 25:return 74;
      break;
    case 26:return 75;
      break;
    case 27:return 76;
      break;
    case 28:return 77;
      break;
    case 29:return 78;
      break;
    case 30:return 79;
      break;
    case 31:return 80;
      break;
    case 32:return 81;
      break;
    case 33:return 82;
      break;
    case 34:return 83;
      break;
    case 35:return 84;
      break;
    case 36:return 85;
      break;
    case 37:return 92;
      break;
    case 38:return 93;
      break;
    case 39:return 94;
      break;
    case 40:return 95;
      break;
    case 41:return 96;
      break;
    case 42:return 97;
      break;
    case 43:return 98;
      break;
    case 44:return 101;
      break;
    case 45:return 102;
      break;
    case 46:return 104;
      break;
    case 47:return 107;
      break;
    case 48:return 108;
      break;
    case 49:return 109;
      break;
    case 50:return 110;
      break;
    case 51:return 111;
      break;
    case 52:return 112;
      break;
    case 53:return 113;
      break;
    case 54:return 114;
      break;
    case 55:return 115;
      break;
    case 56:return 116;
      break;
    case 57:return 117;
      break;
    case 58:return 118;
      break;
    case 59:return 119;
      break;
    case 60:return 120;
      break;
    case 61:return 121;
      break;
    case 62:return 122;
      break;
    case 63:return 123;
      break;
    case 64:return 124;
      break;
    case 65:return 125;
      break;
    case 66:return 126;
      break;
    case 67:return 127;
      break;
    case 68:return 128;
      break;
    case 69:return 130;
      break;
    case 70:return 131;
      break;
    case 71:return 132;
      break;
    case 72:return 133;
      break;
    case 73:return 134;
      break;
    case 74:return 135;
      break;
    case 75:return 138;
      break;
    case 76:return 137;
      break;
    case 77:return 57;
      break;
    case 78:return 25;
      break;
    case 79:return 26;
      break;
    case 80:return 38;
      break;
    case 81:return 'GT_LPAREN';
      break;
    case 82:return 'GT_RPAREN';
      break;
    case 83:return 41;
      break;
    case 84:return 43;
      break;
    case 85:return 22;
      break;
    case 86:return 21;
      break;
    case 87:return 54;
      break;
    case 88:return 55;
      break;
    case 89:return 56;
      break;
    case 90:return 'unexpected word "'+yy_.yytext+'"';
      break;
    case 91:return 'invalid character '+yy_.yytext;
      break;
    case 92:return 5;
      break;
    }
  }
}