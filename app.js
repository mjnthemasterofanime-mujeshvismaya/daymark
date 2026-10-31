// DAYMARK - app.js
// ---- actions ----
const A={
 tab(e){tab=e.dataset.k;render()},filt(e){filt=e.dataset.k;render()},close,
 newTask(e){taskSheet(null,e.dataset.d)},newRem(){remSheet()},newNote(){noteSheet()},
 quick(){const i=$('#qa');if(!i.value.trim())return toast('Type a task first');S.tasks.push({id:uid(),title:i.value.trim(),desc:'',priority:'Normal',cat:'Personal',date:today(),time:'',done:false});save();render();toast('Task added')},
 toggle(e,ev){ev.stopPropagation();const t=S.tasks.find(x=>x.id===e.dataset.id);t.done=!t.done;t.doneAt=t.done?today():null;save();render()},
 editTask(e){taskSheet(S.tasks.find(x=>x.id===e.dataset.id))},
 saveTask(e){const v=$('#f_t').value.trim();if(!v)return toast('Give the task a title');const o={title:v,desc:$('#f_d').value,priority:$('#f_p').value,cat:$('#f_c').value,date:$('#f_dt').value,time:$('#f_tm').value};
  if(e.dataset.id)Object.assign(S.tasks.find(x=>x.id===e.dataset.id),o);else S.tasks.push({id:uid(),done:false,...o});save();close();render();toast('Task saved')},
 delTask(e){S.tasks=S.tasks.filter(x=>x.id!==e.dataset.id);save();close();render();toast('Task deleted')},
 togRem(e,ev){ev.stopPropagation();const r=S.reminders.find(x=>x.id===e.dataset.id);if(!r.done&&r.repeat!=='none'){r.date=nextDate(r);toast('Next: '+fmtD(r.date))}else r.done=!r.done;save();render()},
 editRem(e){remSheet(S.reminders.find(x=>x.id===e.dataset.id))},
 async saveRem(e){const v=$('#f_t').value.trim();if(!v)return toast('Give the reminder a title');const o={title:v,date:$('#f_dt').value,time:$('#f_tm').value,repeat:$('#f_r').value,notify:$('#f_n').value==='1',fired:null};
  if(e.dataset.id)Object.assign(S.reminders.find(x=>x.id===e.dataset.id),o);else S.reminders.push({id:uid(),done:false,...o});save();close();render();
  if(o.notify){const ok=await askPerm();toast(ok?'Reminder saved. Alerts work while DAYMARK is open.':'Reminder saved without a system notification')}else toast('Reminder saved')},
 delRem(e){S.reminders=S.reminders.filter(x=>x.id!==e.dataset.id);save();close();render();toast('Reminder deleted')},
 editNote(e){noteSheet(S.notes.find(x=>x.id===e.dataset.id))},
 doneNote(e){const n=S.notes.find(x=>x.id===e.dataset.id);if(!n.title.trim()&&!n.body.trim())S.notes=S.notes.filter(x=>x!==n);save();close();render()},
 pin(e){const n=S.notes.find(x=>x.id===e.dataset.id);n.pinned=!n.pinned;save();close();render()},
 delNote(e){S.notes=S.notes.filter(x=>x.id!==e.dataset.id);save();close();render();toast('Note deleted')},
 mon(e){calM=new Date(calM.getFullYear(),calM.getMonth()+ +e.dataset.d,1);render()},pick(e){calSel=e.dataset.k;render()},
 async perm(){await askPerm();render()},
 data:dataSheet,copy(){const t=$('#js');t.select();navigator.clipboard?.writeText(t.value).then(()=>toast('Copied'),()=>toast('Press and hold to copy the selected text'))},
 imp(){try{const o=JSON.parse($('#js').value);if(!Array.isArray(o.tasks)||!Array.isArray(o.reminders)||!Array.isArray(o.notes))throw 0;confirmSheet('This replaces everything currently in DAYMARK.','doImp');window._imp=o}catch(x){toast('That doesn’t look like a DAYMARK backup')}},
 doImp(){S={...S,...window._imp,settings:{...S.settings,...window._imp.settings}};save();applyTheme();close();render();toast('Data imported')},
 clear(){confirmSheet('This permanently deletes all tasks, reminders and notes.','doClear')},
 doClear(){S.tasks=[];S.reminders=[];S.notes=[];save();close();render();toast('All data cleared')}
};
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(el&&A[el.dataset.a]){A[el.dataset.a](el,e)}else if(e.target.id==='ov')close()});
document.addEventListener('change',e=>{const k=e.target.dataset.s;if(!k)return;let v=e.target.value;if(v==='true')v=true;if(v==='false')v=false;if(k==='fdow')v=+v;S.settings[k]=v;save();applyTheme();render()});
document.addEventListener('input',e=>{if(e.target.id==='ns'){nq=e.target.value;const p=e.target.selectionStart;render();const i=$('#ns');i.focus();i.setSelectionRange(p,p)}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='qa')A.quick();if(e.key==='Escape')close()});
(async()=>{try{db=await open();const s=await load();if(s)S={...S,...s,settings:{...S.settings,...s.settings}}}catch(e){toast('Storage unavailable: changes won’t be kept')}
 if(!S.tasks.length&&!S.notes.length&&!S.reminders.length&&!localStorage.getItem('dm_seen')){S.tasks=[['Read 10 pages','Study'],['Study Python','Study'],['Workout','Health'],['Plan tomorrow','Personal']].map(([title,cat],i)=>({id:uid(),title,desc:'',priority:'Normal',cat,date:today(),time:'',done:i<2,doneAt:i<2?today():null}));try{localStorage.setItem('dm_seen','1')}catch(e){}save()}
 applyTheme();render();setInterval(tick,20000);tick()})();

// Offline support (needs HTTPS or localhost)
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
