'use strict';
const $=s=>document.querySelector(s), KEY='projectcraft-v1';
const iso=d=>d.toISOString().slice(0,10), date=s=>new Date(s+'T00:00:00Z'), shift=(s,n)=>iso(new Date(date(s).getTime()+n*86400000));
let all, project, result=[], critical=[], historyStore=null, restoringHistory=false;
function create(){return {id:crypto.randomUUID(),name:'Projecte sense títol',start:iso(new Date()),finish:'',holidays:[],tasks:[]}}
try{all=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(all))throw 0}catch{all=[]}if(!all.length)all=[create()]; project=all.find(p=>p.id===localStorage.getItem(KEY+'-active'))||all[0];
function work(s){let n=date(s).getUTCDay();return n!==0&&n!==6&&!project.holidays.includes(s)}
function next(s){let i=0;while(!work(s)){s=shift(s,1);if(++i>3700)throw Error('Calendari sense dies laborables')}return s}
function move(s,n){if(n===0)return s;let step=Math.sign(n),count=0;while(count<Math.abs(n)){s=shift(s,step);if(work(s))count++}return s}
function finish(start,d){return d===0?start:move(start,d-1)}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
// Row numbers are an editable display; dependencyLinks is the authoritative representation.
function parseDependencyText(value,i){
 if(typeof value!=='string')throw Error('Predecessors invàlids a la tasca '+(i+1));if(!value.trim())return [];
 return value.split(',').map(part=>{const m=part.trim().toUpperCase().match(/^(\d+)\s*(FC|CC|FF|CF)?\s*([+-]\s*\d+)?$/);if(!m)throw Error('Predecessor invàlid a la tasca '+(i+1));const lag=Number((m[3]||'0').replace(/\s/g,''));if(!Number.isSafeInteger(lag)||Math.abs(lag)>10000)throw Error('El retard ha de ser entre -10000 i 10000 dies.');const p=Number(m[1])-1;if(p<0||p>=project.tasks.length||p===i)throw Error('Predecessor inexistent o propi a la tasca '+(i+1));return {p,type:m[2]||'FC',lag}});
}
function parseDeps(t,i){
 if(!Object.prototype.hasOwnProperty.call(t,'dependencyLinks'))return parseDependencyText(t.deps,i);
 if(!Array.isArray(t.dependencyLinks))throw Error('Les dependències de la tasca '+(i+1)+' no tenen un format vàlid.');
 return t.dependencyLinks.map(link=>{if(!link||typeof link.predecessorId!=='string'||!['FC','CC','FF','CF'].includes(link.type)||!Number.isSafeInteger(link.lag)||Math.abs(link.lag)>10000)throw Error('Dependència invàlida a la tasca '+(i+1));const p=project.tasks.findIndex(task=>task.id===link.predecessorId);if(p<0||p===i)throw Error('Predecessor inexistent o propi a la tasca '+(i+1));return {p,type:link.type,lag:link.lag}});
}
function dependencyDisplay(deps){return deps.map(d=>(d.p+1)+d.type+(d.lag?(d.lag>0?'+':'')+d.lag:'')).join(', ')}
function setDependencyText(task,i,text){const parsed=parseDependencyText(text,i);const links=parsed.map(d=>{const id=project.tasks[d.p].id;if(typeof id!=='string'||!id)throw Error('El predecessor no té identificador estable.');return {predecessorId:id,type:d.type,lag:d.lag}});task.dependencyLinks=links;task.deps=dependencyDisplay(parsed)}
function migrateProjectDependencies(){
 // Never replace existing links, and do not guess when IDs are missing or duplicated.
 const ids=project.tasks.map(t=>t.id);if(ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)return;
 project.tasks.forEach((t,i)=>{if(!Object.prototype.hasOwnProperty.call(t,'dependencyLinks')){try{setDependencyText(t,i,t.deps)}catch{/* Preserve invalid legacy text so it can be corrected. */}}});
 project.tasks.forEach((t,i)=>{if(Object.prototype.hasOwnProperty.call(t,'dependencyLinks')){try{t.deps=dependencyDisplay(parseDeps(t,i))}catch{/* Keep the cached text; calculate() will report the invalid link. */}}});
}
function prepareProject(){ensureResources();migrateProjectDependencies()}
// The outline uses stable task IDs and requires each subtree to occupy consecutive rows.
function hierarchy(){
 const tasks=project.tasks,children=tasks.map(()=>[]),depth=[],wbs=[],stack=[],counters=new Map(),byId=new Map();
 tasks.forEach((t,i)=>{if(t.id){if(byId.has(t.id))throw Error('Hi ha identificadors de tasca duplicats.');byId.set(t.id,i)}const parent=t.parentId||null;
  if(parent){const at=stack.findIndex(x=>x.id===parent);if(at<0)throw Error('La jerarquia de tasques és invàlida o no és consecutiva.');stack.length=at+1;children[stack[at].i].push(i)}else stack.length=0;
  const n=(counters.get(parent)||0)+1;counters.set(parent,n);depth[i]=stack.length;wbs[i]=stack.length?wbs[stack[stack.length-1].i]+'.'+n:String(n);stack.push({id:t.id,i});
 });return {children,depth,wbs,byId};
}
function workingSpan(start,end){let n=0,d=start;while(d<=end){if(work(d))n++;d=shift(d,1);if(n>100000)throw Error('El resum és massa llarg.')};return n}
function calculate(){
 if(project.start&&!validDate(project.start))throw Error('Data d’inici del projecte invàlida.');if(project.finish&&(!validDate(project.finish)||project.finish<projectStart()))throw Error('Data de final prevista invàlida.');
 const tasks=project.tasks,outline=hierarchy(),out=[],state=[];
 function visit(i){if(state[i]===1)throw Error('Hi ha una dependència circular o una tasca depèn del seu propi resum.');if(state[i]===2)return out[i];state[i]=1;const t=tasks[i],kids=outline.children[i];
  if(kids.length){if(parseDeps(t,i).length)throw Error('La tasca resum '+(i+1)+' no pot tenir predecessors en aquesta versió.');const sub=kids.map(visit),start=sub.reduce((a,b)=>a<b.start?a:b.start,sub[0].start),end=sub.reduce((a,b)=>a>b.end?a:b.end,sub[0].end);let weight=0,done=0;for(let k=0;k<kids.length;k++){const child=sub[k],w=child.weight??Math.max(1,Number(tasks[kids[k]].duration));weight+=w;done+=child.summary?child.done:w*(Number(tasks[kids[k]].progress)||0)}const progress=Math.min(done<weight*100?99:100,Math.round(done/weight));out[i]={start,end,duration:workingSpan(start,end),progress,weight,done,summary:true};state[i]=2;return out[i]}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(t.start)||isNaN(date(t.start))||iso(date(t.start))!==t.start)throw Error('Data invàlida a la tasca '+(i+1));const duration=Number(t.duration);if(!Number.isInteger(duration)||duration<0||duration>10000)throw Error('Durada invàlida a la tasca '+(i+1));let start=next(project.start&&project.start>t.start?project.start:t.start);
  for(const dep of parseDeps(t,i)){const prev=visit(dep.p);let anchor=dep.type[0]==='F'?prev.end:prev.start;if(dep.type==='FC')anchor=move(anchor,1);anchor=move(anchor,dep.lag);anchor=next(anchor);if(dep.type[1]==='F'&&duration>0)anchor=move(anchor,-(duration-1));if(anchor>start)start=anchor}out[i]={start,end:finish(start,duration)};state[i]=2;return out[i];
 }
 for(let i=0;i<tasks.length;i++)visit(i);return out;
}
// Càlcul de marges per a projectes amb dependències FC. Les dates són dies laborables complets.
function criticalPath(schedule){
 const tasks=project.tasks;if(!tasks.length)return [];if(tasks.some(t=>t.parentId))return null;
 const deps=tasks.map((t,i)=>parseDeps(t,i));
 if(deps.some(list=>list.some(d=>d.type!=='FC')))return null;
 const successors=tasks.map(()=>[]),remaining=tasks.map(()=>0);
 deps.forEach((list,i)=>list.forEach(d=>{successors[d.p].push({i,lag:d.lag});remaining[d.p]++}));
 const queue=[];remaining.forEach((n,i)=>{if(!n)queue.push(i)});
 const end=schedule.reduce((a,b)=>a>b.end?a:b.end,schedule[0].end),late=Array(tasks.length);let count=0;
 while(queue.length){const i=queue.pop();let latestEnd=end;
  for(const edge of successors[i]){let limit=move(move(late[edge.i],-edge.lag),-1);if(limit<latestEnd)latestEnd=limit}
  const d=Number(tasks[i].duration);late[i]=d?move(latestEnd,-(d-1)):latestEnd;count++;
  for(const dep of deps[i])if(--remaining[dep.p]===0)queue.push(dep.p);
 }
 if(count!==tasks.length)throw Error('Hi ha una dependència circular.');
 return schedule.map((entry,i)=>{let cur=entry.start,slack=0;while(cur<late[i]){cur=move(cur,1);slack++;if(slack>100000)throw Error('Projecte massa extens per calcular els marges.')}return {latestStart:late[i],slack,critical:slack===0}});
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(all));localStorage.setItem(KEY+'-active',project.id);$('#saved').textContent='Desat al navegador'}catch(e){$('#saved').textContent='Error en desar: descarrega una còpia JSON';}}
let rendering=false,pendingRender=false;
let activeView='gantt',activeMenu='task',query='',taskFilter='all',zoom='fit',visibleIndices=[];
function validDate(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(date(s))&&iso(date(s))===s}
function projectStart(){return project.start||project.tasks.map(t=>t.start).filter(validDate).sort()[0]||iso(new Date())}
function taskProgress(i){return result[i]?.summary?result[i].progress:Number(project.tasks[i]?.progress)||0}
function isHiddenByCollapse(i,outline){if(query||taskFilter!=='all')return false;const collapsed=project.ui?.collapsed||{},byId=outline.byId;let p=project.tasks[i].parentId;while(p){if(collapsed[p])return true;const index=byId.get(p);p=index===undefined?null:project.tasks[index].parentId}return false}
function taskVisible(t,i){const progress=result[i]?.summary?result[i].progress:Number(t.progress)||0;return (!query||(t.name+' '+(t.resource||'')).toLocaleLowerCase().includes(query))&&(taskFilter==='all'||taskFilter==='pending'&&progress===0||taskFilter==='active'&&progress>0&&progress<100||taskFilter==='done'&&progress===100||taskFilter==='critical'&&critical?.[i]?.critical)}
function rangeForChart(){
 const dates=[projectStart(),...(project.finish?[project.finish]:[]),...result.flatMap(r=>[r.start,r.end])];
 for(const b of Object.values(project.baseline||{}))if(validDate(b?.start)&&validDate(b?.end))dates.push(b.start,b.end);
 const from=shift(dates.reduce((a,b)=>a<b?a:b),-2),to=shift(dates.reduce((a,b)=>a>b?a:b),3);
 return {from,to,days:Math.max(7,Math.round((date(to)-date(from))/86400000)+1)};
}
function renderChart(){
 if(activeView!=='gantt')return;
 const {from,days}=rangeForChart(),container=$('.chart'),available=Math.max(100,container.clientWidth-1);
 const scale={day:34,week:12,month:4};
 // Fit always uses the actual viewport width. Other scales are capped to avoid giant scroll areas.
 const unit=zoom==='fit'?available/days:Math.min(scale[zoom]||34,24000/days),width=zoom==='fit'?available:Math.max(available,days*unit);
 let tick=zoom==='day'?1:zoom==='week'?7:zoom==='month'?30:Math.max(1,Math.ceil(days/Math.max(1,Math.floor(available/82))));
 tick=Math.max(tick,Math.ceil(days/1000));
 let html='<div class="days">';for(let i=0;i<days;i+=tick){const d=shift(from,i),w=Math.min(tick,days-i)*unit;html+=`<div class="day ${tick===1&&!work(d)?'weekend':''}" style="width:${w}px" title="${d}">${d.slice(8)}/${d.slice(5,7)}<br>${d.slice(0,4)}</div>`}html+='</div>';
 for(const i of visibleIndices){const t=project.tasks[i],r=result[i],b=(project.baseline||{})[t.id];let inner='';
  if(b&&validDate(b.start)&&validDate(b.end)){const left=Math.round((date(b.start)-date(from))/86400000)*unit,bw=(Math.round((date(b.end)-date(b.start))/86400000)+1)*unit;inner+=`<div class="basebar" style="left:${left}px;width:${Math.max(2,bw)}px" title="Línia base: ${b.start} – ${b.end}"></div>`}
  if(r){const left=Math.round((date(r.start)-date(from))/86400000)*unit,bw=(Math.round((date(r.end)-date(r.start))/86400000)+1)*unit;inner+=`<div role="button" tabindex="0" data-edit="${i}" aria-label="Editar ${esc(t.name)}" class="bar ${r.summary?'summary-bar':+t.duration===0?'milestone':''} ${critical?.[i]?.critical?'critical':''}" style="left:${left}px;width:${Math.max(3,bw)}px" title="${esc(t.name)}: ${r.start} – ${r.end}">${!r.summary&&+t.duration===0?'':`<span class="bar-progress" style="width:${Math.max(0,Math.min(100,taskProgress(i)))}%"></span><span class="bar-text">${esc(t.name)}</span>`}</div>`}
  html+=`<div class="lane" style="background-size:${Math.max(1,tick*unit)}px 100%">${inner}</div>`;
 }
 for(const [d,cls,title] of [[iso(new Date()),'today-line','Avui'],[project.finish,'deadline-line','Final previst']])if(d){const x=Math.round((date(d)-date(from))/86400000)*unit;if(x>=0&&x<width)html+=`<div class="${cls}" style="left:${x}px" title="${title}: ${d}"></div>`}
 $('#timeline').style.width=width+'px';$('#timeline').innerHTML=html;$('#timeline').dataset.from=from;$('#timeline').dataset.unit=unit;
}
function renderBoard(){
 const groups=[['pending','Pendents',p=>p===0],['active','En curs',p=>p>0&&p<100],['done','Completades',p=>p===100]];
 $('#board').innerHTML=groups.map(([key,label,match])=>{const ids=visibleIndices.filter(i=>match(taskProgress(i)));return `<section class="board-column"><h2>${label} · ${ids.length}</h2>${ids.length?ids.map(i=>{const t=project.tasks[i],r=result[i];return `<article class="task-card"><h3>${i+1}. ${esc(t.name)}</h3><p>${r?`${r.start} → ${r.end}`:'Dates pendents de càlcul'}</p><p>${r?.summary?r.duration:t.duration} dies · ${r?.summary?'Tasca resum':esc(t.resource||'Sense recurs')}</p><progress max="100" value="${taskProgress(i)}" aria-label="Avanç de ${esc(t.name)}"></progress><div class="card-footer"><small>${taskProgress(i)}%</small><button data-edit="${i}">Editar</button></div></article>`}).join(''):'<p>Cap tasca.</p>'}</section>`}).join('');
}
function setView(view){activeView=view;$('.workspace').dataset.view=view;$('.workspace').hidden=!['gantt','grid'].includes(view);$('#board').hidden=view!=='board';$('#resourcesView').hidden=view!=='resources';$('#zoomLabel').hidden=view!=='gantt';document.querySelectorAll('[data-view]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.view===view))});$('#viewHint').textContent={gantt:'Gantt sincronitzat amb les files. Clica una barra o el llapis per editar.',grid:'Graella editable: modifica les cel·les o obre la fitxa amb el llapis.',board:'Tasques agrupades segons el percentatge d’avanç.',resources:'Recursos amb identificadors automàtics, assignacions, tarifes i càrrega de treball.'}[view];render()}
function render(){
 prepareProject();
 if(rendering){pendingRender=true;return}rendering=true;try{
 let err='';try{result=calculate();critical=criticalPath(result)}catch(e){result=[];critical=[];err=e.message}
 $('#error').textContent=err;$('#projectName').value=project.name;$('#projects').innerHTML=all.map(p=>`<option value="${esc(p.id)}" ${p===project?'selected':''}>${esc(p.name)}</option>`).join('');
 const outline=hierarchy();
 visibleIndices=project.tasks.map((_,i)=>i).filter(i=>taskVisible(project.tasks[i],i)&&!isHiddenByCollapse(i,outline));
 $('#rows').innerHTML=visibleIndices.map(i=>{const t=project.tasks[i];return `<tr class="${result[i]?.summary?'summary-row':''}"><td class="rownum" title="ID únic automàtic: ${t.uid} · EDT ${outline.wbs[i]}">${i+1}</td><td><div class="task-name-cell" style="padding-left:${Math.min(outline.depth[i]*14,140)}px">${result[i]?.summary?`<button type="button" class="outline-toggle" data-collapse="${i}" aria-expanded="${!project.ui?.collapsed?.[t.id]}" title="Plegar o desplegar">${project.ui?.collapsed?.[t.id]?'▸':'▾'}</button>`:''}<button type="button" class="edit-task" data-edit="${i}" aria-label="Editar tasca ${i+1}" title="Editar tasca">✎</button><span class="outline-wbs" title="Codi EDT">${outline.wbs[i]}</span><input data-i="${i}" data-k="name" value="${esc(t.name)}" aria-label="Nom tasca ${i+1}"><button type="button" class="outline-action" data-indent="${i}" title="Convertir en subtasca" aria-label="Convertir tasca ${i+1} en subtasca">→</button><button type="button" class="outline-action" data-outdent="${i}" title="Treure un nivell" aria-label="Treure nivell de tasca ${i+1}">←</button></div></td><td>${result[i]?.summary?`${result[i].duration} d`:`<input type="number" min="0" max="10000" data-i="${i}" data-k="duration" value="${t.duration}" aria-label="Durada">`}</td><td class="detail">${result[i]?.summary?'Calculat':`<input type="date" data-i="${i}" data-k="start" value="${esc(t.start)}" aria-label="Inici mínim">`}</td><td>${result[i]?.start||'—'}</td><td>${result[i]?.end||'—'}</td><td class="detail" title="Marge total en dies laborables">${critical?.[i]?.slack??'—'}</td><td class="detail">${result[i]?.summary?'—':`<input data-i="${i}" data-k="deps" value="${esc(t.deps)}" placeholder="1FC" aria-label="Predecessors">`}</td><td class="detail">${result[i]?.summary?result[i].progress+'%':`<input type="number" min="0" max="100" data-i="${i}" data-k="progress" value="${Number(t.progress)||0}" aria-label="Avanç percentatge">`}</td><td class="detail"><input data-i="${i}" data-k="resource" readonly title="Edita les assignacions a la fitxa de tasca" value="${esc(t.resource||'')}" aria-label="Recurs"></td><td class="detail">${result[i]?.summary?`<span title="Cost total de les subtasques">${summaryCost(i,outline).toLocaleString('ca-ES',{style:'currency',currency:'EUR'})}</span>`:`<input type="number" min="0" step="0.01" data-i="${i}" data-k="cost" value="${Number(t.cost)||0}" aria-label="Cost">`}</td><td class="detail"><button class="remove" data-delete="${i}" aria-label="Eliminar tasca">✕</button></td></tr>`}).join('');
 $('#emptyState').hidden=visibleIndices.length>0;$('#emptyState').firstChild.textContent=project.tasks.length?'Cap tasca coincideix amb els filtres. ':'Encara no hi ha tasques. ';$('#emptyAdd').hidden=project.tasks.length>0;
 const end=result.length?result.reduce((a,b)=>a>b.end?a:b.end,result[0].end):null;
 $('#projectDates').textContent=`Inici: ${projectStart()} · Final previst: ${project.finish||'sense definir'}`;
 const late=project.finish&&end&&end>project.finish;$('#deadlineStatus').className=late?'deadline-warning':'';$('#deadlineStatus').textContent=end?`Final calculat: ${end}${late?' · ⚠ Supera el termini previst':''}`:'Sense tasques planificades';
 $('#status').textContent=`${visibleIndices.length}/${project.tasks.length} tasques · ${critical===null?'Ruta crítica no disponible amb resums o dependències diferents de FC':'Vermell: tasques crítiques (FC)'} · Cost estimat: ${projectTotalCost().toLocaleString('ca-ES',{style:'currency',currency:'EUR'})} · Les dades són locals`;
 applyColumnWidths();renderChart();renderBoard();renderResources();if(!err)syncProjectHistory();save();
 }finally{rendering=false;if(pendingRender){pendingRender=false;queueMicrotask(render)}}
}
$('#rows').addEventListener('change',e=>{const el=e.target;if(!el.dataset.k)return;const i=+el.dataset.i,t=project.tasks[i],k=el.dataset.k,old=t[k],hadLinks=Object.prototype.hasOwnProperty.call(t,'dependencyLinks'),oldLinks=t.dependencyLinks;let value=el.value;if(['progress','cost','duration'].includes(k)){value=Number(value);if(!Number.isFinite(value)||value<0||(k==='progress'&&value>100)||(k==='duration'&&(!Number.isInteger(value)||value>10000))){alert('Introdueix un valor vàlid.');render();return}}if(k==='name'&&!value.trim()){alert('La tasca ha de tenir un nom.');render();return}try{if(k==='deps')setDependencyText(t,i,value);else t[k]=value;calculate()}catch(err){t[k]=old;if(k==='deps'){if(hadLinks)t.dependencyLinks=oldLinks;else delete t.dependencyLinks}alert(err.message)}render()});function summaryCost(index,outline=hierarchy()){const end=subtreeEnd(index,outline);let sum=0;for(let i=index+1;i<end;i++){const t=project.tasks[i];if(!outline.children[i].length)sum+=(Number(t.cost)||0)+(t.assignments||[]).reduce((n,a)=>n+assignmentCost(t,a),0)}return sum}
function dependencySnapshot(){return project.tasks.map((t,i)=>parseDeps(t,i).map(d=>({id:project.tasks[d.p].id,type:d.type,lag:d.lag})))}
function applyDependencySnapshot(before,oldOrder){const saved=new Map(oldOrder.map((t,i)=>[t.id,before[i]])),positions=new Map(project.tasks.map((t,i)=>[t.id,i+1]));for(const t of project.tasks){const entries=(saved.get(t.id)||[]).filter(d=>positions.has(d.id));t.dependencyLinks=entries.map(d=>({predecessorId:d.id,type:d.type,lag:d.lag}));t.deps=entries.map(d=>positions.get(d.id)+d.type+(d.lag?(d.lag>0?'+':'')+d.lag:'')).join(', ')}}
function subtreeEnd(index,outline){let end=index+1;while(end<project.tasks.length&&outline.depth[end]>outline.depth[index])end++;return end}
function changeOutline(index,direction){
 const list=project.tasks,oldOrder=list.slice(),outline=hierarchy(),task=list[index],oldParent=task.parentId||null;let parent;
 if(direction==='indent'){let p=index-1;while(p>=0&&outline.depth[p]>outline.depth[index])p--;if(p<0||outline.depth[p]!==outline.depth[index]||(list[p].parentId||null)!==oldParent)throw Error('Cal una tasca anterior del mateix nivell per crear una subtasca.');parent=list[p];if(parseDeps(parent,p).length||(parent.assignments||[]).length||Number(parent.cost))throw Error('La tasca que serà resum no pot tenir predecessors, recursos assignats ni cost fix. Retira’ls abans de convertir-la en resum.');}
 else{if(!oldParent)throw Error('Aquesta tasca ja és al nivell superior.');parent=list[outline.byId.get(oldParent)];}
 const deps=dependencySnapshot(),end=subtreeEnd(index,outline);task.parentId=direction==='indent'?parent.id:(parent.parentId||null);
 if(direction==='outdent'){const parentIndex=outline.byId.get(parent.id),parentEnd=subtreeEnd(parentIndex,outline),block=list.splice(index,end-index);list.splice(parentEnd-block.length,0,...block)}
 try{applyDependencySnapshot(deps,oldOrder);calculate()}catch(e){project.tasks=oldOrder;task.parentId=oldParent;applyDependencySnapshot(deps,oldOrder);throw e}
}
function deleteOutline(index){const outline=hierarchy(),oldOrder=project.tasks.slice(),end=subtreeEnd(index,outline),count=end-index;if(!confirm(count>1?`Eliminar aquesta tasca resum i les ${count-1} subtasques? També se’n retiraran les dependències.`:'Eliminar la tasca? Se’n retiraran les dependències.'))return;const snapshot=dependencySnapshot();const removed=project.tasks.splice(index,count);applyDependencySnapshot(snapshot,oldOrder);if(project.baseline)for(const t of removed)delete project.baseline[t.id]}
$('#rows').addEventListener('click',e=>{const edit=e.target.closest('[data-edit]');if(edit){openTask(Number(edit.dataset.edit));return}const toggle=e.target.closest('[data-collapse]');if(toggle){const t=project.tasks[Number(toggle.dataset.collapse)];project.ui=project.ui||{};project.ui.collapsed=project.ui.collapsed||{};project.ui.collapsed[t.id]=!project.ui.collapsed[t.id];render();return}const action=e.target.closest('[data-indent],[data-outdent]');if(action){try{changeOutline(Number(action.dataset.indent??action.dataset.outdent),action.dataset.indent!==undefined?'indent':'outdent');render()}catch(err){alert(err.message)}return}const del=e.target.closest('[data-delete]');if(del){try{deleteOutline(Number(del.dataset.delete));render()}catch(err){alert(err.message)}}});
let editingTask=null,taskTrigger=null;
function openTask(index,duration=1){
 editingTask=index;taskTrigger=document.activeElement;const t=index===null?{name:'',duration,start:projectStart(),deps:'',progress:0,resource:'',cost:0}:project.tasks[index];
 const summary=index!==null&&!!result[index]?.summary;$('#summaryHelp').hidden=!summary;for(const id of ['#taskDuration','#taskStart','#taskFinish','#taskDeps','#taskProgress','#taskCost'])$(id).disabled=summary;$('.assignment-editor').hidden=summary;
 $('#taskTitle').textContent=index===null?(duration===0?'Nova fita':'Nova tasca'):'Editar tasca '+(index+1);$('#taskName').value=t.name;$('#taskDuration').value=t.duration;$('#taskStart').value=t.start;$('#taskDeps').value=t.deps;$('#taskProgress').value=t.progress??0;renderTaskAssignments(t.assignments||[]);$('#taskCost').value=t.cost??0;$('#taskError').textContent='';if(summary){$('#taskDuration').value=result[index].duration;$('#taskStart').value=result[index].start;$('#taskFinish').value=result[index].end;$('#taskProgress').value=result[index].progress}else syncTaskFinish();$('#taskModal').classList.add('open');$('#taskName').focus();
}
function previewTask(){const i=editingTask===null?project.tasks.length:editingTask,old=project.tasks[i],candidate={...(old||{}),name:$('#taskName').value,duration:Number($('#taskDuration').value),start:$('#taskStart').value,deps:$('#taskDeps').value.trim()};if(editingTask===null)project.tasks.push(candidate);else project.tasks[i]=candidate;try{setDependencyText(candidate,i,candidate.deps);return calculate()[i]}finally{if(editingTask===null)project.tasks.pop();else project.tasks[i]=old}}
function syncTaskFinish(){try{const r=previewTask();$('#taskFinish').value=r.end;$('#taskError').textContent=''}catch(err){$('#taskError').textContent=err.message}}
function durationFromRange(start,end){if(!validDate(start)||!validDate(end)||end<start)throw Error('La data de final ha de ser igual o posterior a l’inici planificat.');if(!work(end))throw Error('La data de final ha de ser un dia laborable del calendari.');let cursor=start,n=1;while(cursor<end){cursor=move(cursor,1);if(++n>10000)throw Error('La durada màxima és de 10000 dies laborables.')}return n}
['#taskDuration','#taskStart','#taskDeps'].forEach(id=>$(id).addEventListener('change',syncTaskFinish));
$('#taskFinish').addEventListener('change',()=>{try{const target=$('#taskFinish').value,r=previewTask();$('#taskDuration').value=durationFromRange(r.start,target);const adjusted=previewTask();if(adjusted.end!==target)throw Error('Les dependències fixen un final diferent: '+adjusted.end+'. Revisa els predecessors.');$('#taskError').textContent=''}catch(err){$('#taskError').textContent=err.message}});
function closeTask(){$('#taskModal').classList.remove('open');if(taskTrigger?.isConnected)taskTrigger.focus()}
$('#add').onclick=()=>openTask(null,1);$('#milestone').onclick=()=>openTask(null,0);$('#cancelTask').onclick=closeTask;
$('#taskModal').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeTask()}});
$('#taskForm').addEventListener('submit',e=>{
 e.preventDefault();let name=$('#taskName').value.trim();if(!name){$('#taskError').textContent='Escriu el nom de la tasca.';$('#taskName').focus();return}
 const i=editingTask===null?project.tasks.length:editingTask,original=project.tasks[i];
 const isSummary=editingTask!==null&&!!result[editingTask]?.summary;
 const candidate=isSummary?{...original,name}:{...(original||{id:crypto.randomUUID()}),name,duration:Number($('#taskDuration').value),start:$('#taskStart').value,deps:$('#taskDeps').value.trim(),progress:Number($('#taskProgress').value),assignments:[],resource:'',cost:Number($('#taskCost').value)};
 try{if(!isSummary)candidate.assignments=readTaskAssignments()}catch(err){$('#taskError').textContent=err.message;return}
 if(editingTask===null)project.tasks.push(candidate);else project.tasks[i]=candidate;
 try{if(!isSummary)setDependencyText(candidate,i,candidate.deps);const scheduled=calculate()[i];if(scheduled.end!==$('#taskFinish').value)throw Error('El final calculat és '+scheduled.end+'. Revisa la durada i les dependències.')}catch(err){if(editingTask===null)project.tasks.pop();else project.tasks[i]=original;$('#taskError').textContent=err.message;return}
 closeTask();render();
});
function openProjectSettings(){$('#projectStart').value=projectStart();$('#projectFinish').value=project.finish||'';$('#projectError').textContent='';$('#projectModal').classList.add('open');$('#projectStart').focus()}
$('#projectSettings').onclick=openProjectSettings;$('#summaryDates').onclick=openProjectSettings;$('#cancelProject').onclick=()=>$('#projectModal').classList.remove('open');
$('#projectForm').addEventListener('submit',e=>{e.preventDefault();const start=$('#projectStart').value,end=$('#projectFinish').value;if(!validDate(start)||(end&&(!validDate(end)||end<start))){$('#projectError').textContent='El final previst ha de ser igual o posterior a l’inici del projecte.';return}const oldStart=project.start,oldFinish=project.finish;project.start=start;project.finish=end;try{calculate()}catch(err){project.start=oldStart;project.finish=oldFinish;$('#projectError').textContent=err.message;return}$('#projectModal').classList.remove('open');render()});
function updateHistoryButtons(){if(!historyStore)return;$('#undo').disabled=!historyStore.canUndo(project.id);$('#redo').disabled=!historyStore.canRedo(project.id)}
function syncProjectHistory(){if(!historyStore||restoringHistory)return;historyStore.record(project.id,historySnapshot(project));updateHistoryButtons()}
function applyProjectHistory(direction){
 if(!historyStore||document.querySelector('.modal.open'))return;const current=project,id=current.id,action=direction==='undo'?'undo':'redo',reverse=direction==='undo'?'redo':'undo',snapshot=historyStore[action](id);if(snapshot===null)return;let index=-1;
 try{const restored=restoreHistorySnapshot(current,snapshot);project=restored;prepareProject();calculate();index=all.findIndex(p=>p.id===id);if(index<0)throw Error('El projecte ja no existeix.');all[index]=project;restoringHistory=true;render();$('#historyStatus').textContent=direction==='undo'?'Canvi desfet.':'Canvi refet.'}
 catch(err){if(index>=0)all[index]=current;project=current;historyStore[reverse](id);alert('No s’ha pogut restaurar el canvi: '+err.message)}finally{restoringHistory=false;updateHistoryButtons()}
}
function initHistory(){
 historyStore=createHistoryStore();$('#undo').onclick=()=>applyProjectHistory('undo');$('#redo').onclick=()=>applyProjectHistory('redo');
 document.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey)||e.altKey||e.isComposing)return;const target=e.target;if(target&&((target.closest&&target.closest('input, textarea, select, [contenteditable="true"]'))||target.isContentEditable))return;if(document.querySelector('.modal.open'))return;const key=e.key.toLowerCase();if(key==='z'){e.preventDefault();applyProjectHistory(e.shiftKey?'redo':'undo')}else if(key==='y'){e.preventDefault();applyProjectHistory('redo')}});
}
function setMenu(menu){activeMenu=menu;document.querySelectorAll('[data-menu]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.menu===menu)));document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==menu)}
document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>setMenu(b.dataset.menu));document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#search').oninput=e=>{query=e.target.value.trim().toLocaleLowerCase();render()};$('#taskFilter').onchange=e=>{taskFilter=e.target.value;render()};$('#zoom').onchange=e=>{zoom=e.target.value;renderChart()};$('#fit').onclick=()=>{zoom='fit';$('#zoom').value=zoom;setView('gantt');$('.chart').scrollLeft=0};$('#today').onclick=()=>{setView('gantt');zoom='day';$('#zoom').value=zoom;renderChart();const timeline=$('#timeline'),x=Math.round((date(iso(new Date()))-date(timeline.dataset.from))/86400000)*Number(timeline.dataset.unit);$('.chart').scrollLeft=Math.max(0,x-$('.chart').clientWidth/2)};
$('#emptyAdd').onclick=()=>openTask(null,1);
for(const root of [$('#timeline'),$('#board')]){root.addEventListener('click',e=>{const target=e.target.closest('[data-edit]');if(target)openTask(Number(target.dataset.edit))});root.addEventListener('keydown',e=>{if(e.target.matches('.bar')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openTask(Number(e.target.dataset.edit))}})}
// Both panes share row positions when scrolling vertically in the Gantt view.
let syncingScroll=false;for(const [a,b] of [[$('.grid'),$('.chart')],[$('.chart'),$('.grid')]])a.addEventListener('scroll',()=>{if(activeView!=='gantt'||syncingScroll)return;syncingScroll=true;b.scrollTop=a.scrollTop;requestAnimationFrame(()=>{syncingScroll=false})});
window.addEventListener('resize',()=>{applyColumnWidths();renderChart()});
$('#projectName').onchange=e=>{project.name=e.target.value.trim()||'Projecte sense títol';render()};$('#projects').onchange=e=>{project=all.find(p=>p.id===e.target.value);query='';taskFilter='all';$('#search').value='';$('#taskFilter').value='all';render()};$('#newProject').onclick=()=>{project=create();all.push(project);render()};$('#deleteProject').onclick=()=>{if(!confirm('Eliminar aquest projecte desat en aquest navegador? Aquesta eliminació no es pot desfer.'))return;historyStore?.forget(project.id);all=all.filter(p=>p!==project);if(!all.length)all=[create()];project=all[0];render()};
function report(){
 if(result.length!==project.tasks.length)return alert('Corregeix els errors de planificació abans de generar l’informe.');
 const lines=[`Projecte: ${project.name}`,`Inici del projecte: ${projectStart()}`,`Final previst: ${project.finish||'Sense definir'}`,`Tasques: ${project.tasks.length}`,`Cost total estimat: ${projectTotalCost().toLocaleString('ca-ES',{style:'currency',currency:'EUR'})}`,'','DESVIACIONS DE LA LÍNIA BASE'];
 let baseCount=0;project.tasks.forEach((t,i)=>{let b=(project.baseline||{})[t.id];if(!b)return;baseCount++;let delta=Math.round((date(result[i].end)-date(b.end))/86400000);lines.push(`${i+1}. ${t.name}: final ${result[i].end}; línia base ${b.end}; diferència ${delta>0?'+':''}${delta} dies naturals`)});if(!baseCount)lines.push('No hi ha línia base per a aquestes tasques.');
 lines.push('','CÀRREGA DELS RECURSOS');for(const r of project.resources){const st=resourceStats(r,result);lines.push(r.name+': '+st.rows.length+' tasques; '+st.overloaded.length+' dies per damunt de la capacitat.')}lines.push('','La càrrega es calcula amb una jornada de 8 hores i amb les dates planificades. No hi ha anivellament automàtic.');$('#reportText').textContent=lines.join('\n');$('#reportModal').classList.add('open')
}
$('#report').onclick=report;$('#closeReport').onclick=()=>$('#reportModal').classList.remove('open');
$('#baseline').onclick=()=>{if(result.length!==project.tasks.length||!result.length)return alert('Cal un projecte amb dates vàlides.');if(project.baseline&&!confirm('Substituir la línia base existent?'))return;project.baseline=Object.fromEntries(project.tasks.map((t,i)=>[t.id,{start:result[i].start,end:result[i].end}]));render()};$('#clearBaseline').onclick=()=>{if(project.baseline&&confirm('Esborrar la línia base?')){delete project.baseline;render()}};
$('#calendar').onclick=()=>{$('#holidays').value=project.holidays.join('\n');$('#modal').classList.add('open')};$('#closeCalendar').onclick=()=>$('#modal').classList.remove('open');$('#saveCalendar').onclick=()=>{let h=$('#holidays').value.split(/\s+/).filter(Boolean);if(h.some(s=>!/^\d{4}-\d{2}-\d{2}$/.test(s)||isNaN(date(s))||iso(date(s))!==s))return alert('Revisa el format dels festius.');const previous=project.holidays;project.holidays=h;try{calculate()}catch(err){project.holidays=previous;alert(err.message);return}$('#modal').classList.remove('open');render()};
function download(name,content,type){let a=document.createElement('a'),u=URL.createObjectURL(new Blob([content],{type}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}$('#json').onclick=()=>download('projectcraft.json',JSON.stringify({format:'projectcraft',version:2,project},null,2),'application/json');$('#load').onchange=async e=>{try{let obj=JSON.parse(await e.target.files[0].text()),p=obj.project;if(obj.format!=='projectcraft'||(obj.version!==undefined&&![1,2].includes(obj.version))||!p||!Array.isArray(p.tasks)||!Array.isArray(p.holidays)||p.tasks.some(t=>typeof t.name!=='string'||typeof t.start!=='string'||typeof t.deps!=='string'||!Number.isInteger(t.duration)||t.duration<0||t.duration>10000))throw Error();p.id=crypto.randomUUID();p.name=String(p.name||'Projecte importat');const previous=project;try{project=p;prepareProject();calculate()}finally{project=previous}all.push(p);project=p;render()}catch{alert('El fitxer no és una còpia vàlida de ProjectCraft.')}e.target.value=''};$('#csv').onclick=()=>{let rows=[['ID','Tasca','Durada (dies laborables)','Inici mínim','Inici calculat','Final calculat','Predecessors','Avanç %','Recurs','Cost EUR'],...project.tasks.map((t,i)=>[i+1,t.name,t.duration,t.start,result[i]?.start||'',result[i]?.end||'',t.deps,t.progress||0,t.resource||'',t.cost||0])];download('projectcraft.csv','\ufeff'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(';')).join('\r\n'),'text/csv;charset=utf-8')};$('#print').onclick=()=>window.print();prepareProject();initColumns();initResources();initMpp();initHistory();setMenu('task');setView('gantt');
