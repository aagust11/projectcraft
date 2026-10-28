'use strict';
// Resource identities and assignments are independent of visual row numbers.
function ensureResources(){
 if(!Array.isArray(project.resources))project.resources=[];
 project.nextTaskUid=Math.max(Number(project.nextTaskUid)||1,...project.tasks.map(t=>(Number(t.uid)||0)+1));
 project.nextResourceUid=Math.max(Number(project.nextResourceUid)||1,...project.resources.map(r=>(Number(r.uid)||0)+1));
 for(const t of project.tasks){
  if(!t.id)t.id=crypto.randomUUID();if(!Number.isSafeInteger(t.uid)||t.uid<1)t.uid=project.nextTaskUid++;
  if(!Array.isArray(t.assignments)){
   t.assignments=[];const name=String(t.resource||'').trim();
   if(name){let r=project.resources.find(r=>r.name.toLocaleLowerCase()===name.toLocaleLowerCase());if(!r){r={id:crypto.randomUUID(),name,type:'work',group:'',email:'',maxUnits:100,rate:0,unit:''};project.resources.push(r)}t.assignments.push({resourceId:r.id,units:100})}
  }
  t.resource=t.assignments.map(a=>project.resources.find(r=>r.id===a.resourceId)?.name).filter(Boolean).join(', ');
 }
 for(const r of project.resources){if(!r.id)r.id=crypto.randomUUID();if(!Number.isSafeInteger(r.uid)||r.uid<1)r.uid=project.nextResourceUid++;r.type=['work','material','cost'].includes(r.type)?r.type:'work';r.rate=Number.isFinite(Number(r.rate))&&Number(r.rate)>=0?Number(r.rate):0;r.maxUnits=Number.isFinite(Number(r.maxUnits))&&Number(r.maxUnits)>0?Number(r.maxUnits):100;}
}
function assignmentCost(t,a){const r=project.resources.find(r=>r.id===a.resourceId);if(!r)return 0;return r.type==='work'?Number(t.duration)*8*a.units/100*r.rate:r.type==='material'?a.units*r.rate:a.units}
function projectTotalCost(){return project.tasks.reduce((sum,t)=>sum+(Number(t.cost)||0)+(t.assignments||[]).reduce((n,a)=>n+assignmentCost(t,a),0),0)}
function resourceStats(resource,schedule){
 const rows=[];let total=0,cost=0;const loads=new Map();
 project.tasks.forEach((t,i)=>{for(const a of t.assignments||[]){if(a.resourceId!==resource.id)continue;rows.push(i);cost+=assignmentCost(t,a);total+=resource.type==='work'?Number(t.duration)*8*a.units/100:a.units;
 if(resource.type==='work'&&schedule[i]&&Number(t.duration)>0){let d=schedule[i].start;for(let n=0;d<=schedule[i].end&&n<20000;n++,d=shift(d,1))if(work(d))loads.set(d,(loads.get(d)||0)+a.units)}}});
 const overloaded=[...loads].filter(([,v])=>v>resource.maxUnits+0.00001);return {rows,total,cost,overloaded,peak:[...loads.values()].reduce((a,b)=>Math.max(a,b),0)};
}
function renderResources(){
 const types={work:'Treball',material:'Material',cost:'Cost'};$('#resourceRows').innerHTML=project.resources.map((r,i)=>{const st=resourceStats(r,result);return `<tr><td>${i+1}</td><td>${esc(r.name)}</td><td>${types[r.type]||'Treball'}</td><td>${esc(r.group||'')}</td><td>${r.type==='work'?r.maxUnits+'%':'—'}</td><td>${r.type==='cost'?'Per assignació':r.rate.toLocaleString('ca-ES',{style:'currency',currency:'EUR'})+(r.type==='work'?'/h':'/'+esc(r.unit||'unitat'))}</td><td>${esc(r.email||'')}</td><td>${st.rows.length}</td><td>${st.total.toLocaleString('ca-ES',{maximumFractionDigits:2})} ${r.type==='work'?'h':r.type==='material'?esc(r.unit||'unitats'):'€'}</td><td>${st.cost.toLocaleString('ca-ES',{style:'currency',currency:'EUR'})}</td><td class="${st.overloaded.length?'deadline-warning':''}" title="${esc(st.overloaded.slice(0,10).map(([d,n])=>d+': '+n+'%').join('\n'))}">${st.overloaded.length?st.overloaded.length+' dies en excés':r.type==='work'?'Dins la capacitat':'—'}</td><td><button data-resource-edit="${i}">Editar</button> <button data-resource-delete="${i}" class="remove">Eliminar</button></td></tr>`}).join('');
 $('#resourcesEmpty').hidden=project.resources.length>0;
}
let editingResource=null;
function openResource(index=null){editingResource=index;const r=index===null?{name:'',type:'work',maxUnits:100,rate:0,email:'',group:'',unit:''}:project.resources[index];$('#resourceTitle').textContent=index===null?'Nou recurs':'Editar recurs '+(index+1);for(const key of ['name','type','maxUnits','rate','email','group','unit'])$('#res-'+key).value=r[key]??'';$('#resourceError').textContent='';$('#resourceModal').classList.add('open');updateResourceFields();$('#res-name').focus()}
function updateResourceFields(){const type=$('#res-type').value;$('#res-capacity-label').hidden=type!=='work';$('#res-unit-label').hidden=type!=='material';$('#res-rate-label').hidden=type==='cost';$('#res-rate-description').textContent=type==='work'?'Tarifa per hora (€)':'Preu per unitat (€)'}
function renderTaskAssignments(list){
 const rows=list.length?list:[{resourceId:'',units:100}];$('#taskAssignments').innerHTML=rows.map(a=>`<div class="assignment-row"><select class="assignment-resource" aria-label="Recurs assignat"><option value="">Sense assignar</option>${project.resources.map(r=>`<option value="${esc(r.id)}" ${a.resourceId===r.id?'selected':''}>${esc(r.name)} · ${{work:'treball',material:'material',cost:'cost'}[r.type]}</option>`).join('')}</select><input class="assignment-units" type="number" min="0" step="any" value="${a.units}" aria-label="Unitats d’assignació"><span class="assignment-unit"></span><button type="button" class="remove remove-assignment" aria-label="Treure assignació">✕</button></div>`).join('');updateAssignmentLabels();
}
function updateAssignmentLabels(){document.querySelectorAll('.assignment-row').forEach(row=>{const r=project.resources.find(r=>r.id===row.querySelector('select').value);row.querySelector('.assignment-unit').textContent=r?.type==='material'?(r.unit||'unitats'):r?.type==='cost'?'€':'%';})}
function readTaskAssignments(){const result=[],seen=new Set();document.querySelectorAll('.assignment-row').forEach(row=>{const id=row.querySelector('select').value,units=Number(row.querySelector('input').value);if(!id)return;if(!project.resources.some(r=>r.id===id))throw Error('El recurs seleccionat ja no existeix.');if(seen.has(id))throw Error('Un recurs només pot aparèixer una vegada a la mateixa tasca.');if(!Number.isFinite(units)||units<0)throw Error('Les unitats han de ser un nombre positiu o zero.');seen.add(id);result.push({resourceId:id,units})});return result}
function initResources(){
 $('#newResource').onclick=()=>{setView('resources');openResource()};$('#resourcesAdd').onclick=()=>openResource();$('#closeResource').onclick=()=>$('#resourceModal').classList.remove('open');$('#res-type').onchange=updateResourceFields;
 $('#resourceForm').addEventListener('submit',e=>{e.preventDefault();const name=$('#res-name').value.trim(),rate=Number($('#res-rate').value),maxUnits=Number($('#res-maxUnits').value);if(!name||!Number.isFinite(rate)||rate<0||!Number.isFinite(maxUnits)||maxUnits<=0){$('#resourceError').textContent='Revisa el nom, la tarifa i la capacitat del recurs.';return}const old=editingResource===null?null:project.resources[editingResource];const value={...(old||{id:crypto.randomUUID()}),name,type:$('#res-type').value,rate,maxUnits,email:$('#res-email').value.trim(),group:$('#res-group').value.trim(),unit:$('#res-unit').value.trim()};if(editingResource===null)project.resources.push(value);else project.resources[editingResource]=value;$('#resourceModal').classList.remove('open');render()});
 $('#resourceRows').addEventListener('click',e=>{const edit=e.target.closest('[data-resource-edit]'),del=e.target.closest('[data-resource-delete]');if(edit){openResource(Number(edit.dataset.resourceEdit));return}if(!del)return;const i=Number(del.dataset.resourceDelete),r=project.resources[i],count=project.tasks.filter(t=>(t.assignments||[]).some(a=>a.resourceId===r.id)).length;if(!confirm(`Eliminar «${r.name}»?${count?' Es traurà de '+count+' tasques i es recalcularan els costos.':''}`))return;project.resources.splice(i,1);for(const t of project.tasks)t.assignments=(t.assignments||[]).filter(a=>a.resourceId!==r.id);render()});
 $('#addAssignment').onclick=()=>{try{const list=readTaskAssignments();list.push({resourceId:'',units:100});renderTaskAssignments(list)}catch(err){$('#taskError').textContent=err.message}};$('#taskAssignments').addEventListener('change',updateAssignmentLabels);$('#taskAssignments').addEventListener('click',e=>{const b=e.target.closest('.remove-assignment');if(b)b.closest('.assignment-row').remove()});
}
