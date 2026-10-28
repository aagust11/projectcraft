const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const script=fs.readFileSync('app.js','utf8').split("$('#rows').addEventListener")[0];
function run(body){return vm.runInNewContext(script+'\n'+body,{localStorage:{getItem:()=>null},crypto:require('node:crypto').webcrypto,Date});}
const tasks="[{id:'a',name:'A',start:'2026-10-30',duration:2,deps:''},{id:'b',name:'B',start:'2026-10-30',duration:1,deps:'1FC'},{id:'c',name:'C',start:'2026-10-30',duration:1,deps:'1CC'},{id:'d',name:'D',start:'2026-10-30',duration:1,deps:'1FF'},{id:'e',name:'E',start:'2026-10-30',duration:1,deps:'1CF'}]";
test('quatre tipus de dependència i calendari',()=>{let result=run(`project={holidays:['2026-11-02'],tasks:${tasks}}; JSON.stringify(calculate())`);assert.deepEqual(JSON.parse(result).map(x=>x.start),['2026-10-30','2026-11-04','2026-10-30','2026-11-03','2026-10-30']);});
test('cicles rebutjats',()=>assert.throws(()=>run(`project={holidays:[],tasks:${tasks}};project.tasks[0].deps='2FC';calculate()`),/circular/));
test('dependència i fita amb retard',()=>{let r=run(`project={holidays:[],tasks:[{start:'2026-11-02',duration:1,deps:''},{start:'2026-11-02',duration:0,deps:'1FC+2'}]};JSON.stringify(calculate())`);assert.equal(JSON.parse(r)[1].start,'2026-11-05')});
test('dates impossibles rebutjades',()=>assert.throws(()=>run(`project={holidays:[],tasks:[{start:'2026-02-30',duration:1,deps:''}]};calculate()`),/Data invàlida/));
test('retards excessius rebutjats',()=>assert.throws(()=>run(`project={holidays:[],tasks:[{start:'2026-11-02',duration:1,deps:''},{start:'2026-11-02',duration:1,deps:'1FC+100000000'}]};calculate()`),/retard/i));
test('ruta crítica en xarxa amb branques i marge en dies laborables',()=>{let r=run(`project={holidays:[],tasks:[{start:'2026-11-02',duration:2,deps:''},{start:'2026-11-02',duration:4,deps:'1FC'},{start:'2026-11-02',duration:1,deps:'1FC'},{start:'2026-11-02',duration:1,deps:'2FC,3FC'}]};JSON.stringify(criticalPath(calculate()))`);assert.deepEqual(JSON.parse(r).map(t=>t.slack),[0,0,3,0]);});
test('ruta crítica amb festiu i retard',()=>{let r=run(`project={holidays:['2026-11-04'],tasks:[{start:'2026-11-02',duration:1,deps:''},{start:'2026-11-02',duration:2,deps:'1FC+1'}]};JSON.stringify(criticalPath(calculate()))`);assert.deepEqual(JSON.parse(r).map(t=>t.slack),[0,0]);});
test('marges no es presenten amb altres dependències',()=>{let r=run(`project={holidays:[],tasks:[{start:'2026-11-02',duration:1,deps:''},{start:'2026-11-02',duration:1,deps:'1CC'}]};criticalPath(calculate())`);assert.equal(r,null);});
