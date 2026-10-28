'use strict';
// Historial per projecte, només en memòria: les vistes i les amplades no són canvis de dades.
function createHistoryStore(options={}){
 const limit=options.limit??40,maxChars=options.maxChars??8*1024*1024,states=new Map();
 function state(id){return states.get(id)}
 function trim(s){let size=s.past.reduce((n,x)=>n+x.length,0)+s.future.reduce((n,x)=>n+x.length,0);while(s.past.length>limit||size>maxChars&&s.past.length){size-=s.past.shift().length}}
 return {
  record(id,snapshot){if(typeof id!=='string'||typeof snapshot!=='string')throw Error('Estat d’historial invàlid.');let s=state(id);if(!s){states.set(id,{current:snapshot,past:[],future:[]});return false}if(s.current===snapshot)return false;s.past.push(s.current);s.current=snapshot;s.future=[];trim(s);return true},
  undo(id){const s=state(id);if(!s||!s.past.length)return null;s.future.push(s.current);s.current=s.past.pop();return s.current},
  redo(id){const s=state(id);if(!s||!s.future.length)return null;s.past.push(s.current);s.current=s.future.pop();trim(s);return s.current},
  canUndo(id){return !!state(id)?.past.length},canRedo(id){return !!state(id)?.future.length},forget(id){states.delete(id)}
 };
}
function historySnapshot(p){const {ui,mppSource,nextTaskUid,nextResourceUid,...data}=p;return JSON.stringify(data)}
function restoreHistorySnapshot(current,snapshot){const restored=JSON.parse(snapshot);if(!restored||restored.id!==current.id)throw Error('L’historial no pertany a aquest projecte.');for(const key of ['ui','mppSource','nextTaskUid','nextResourceUid'])if(Object.prototype.hasOwnProperty.call(current,key))restored[key]=current[key];return restored}
if(typeof module!=='undefined'&&module.exports)module.exports={createHistoryStore,historySnapshot,restoreHistorySnapshot};
