// DAYMARK - views.js
// ---- views ----
function render(){
 $('#nav').innerHTML=TABS.map(([k,l])=>`<button data-a="tab" data-k="${k}" class="${tab===k?'on':''}" aria-label="${l}"><svg viewBox="0 0 24 24">${IC[k]}</svg>${l}</button>`).join('');
 const f={today:vToday,rem:vRem,notes:vNotes,cal:vCal,set:vSet}[tab];$('#v').innerHTML=f();
 document.querySelectorAll('.fab').forEach(e=>e.remove());
 if(tab==='today'||tab==='rem'||tab==='notes')$('#app').insertAdjacentHTML('beforeend',`<button class="fab" data-a="${tab==='today'?'newTask':tab==='rem'?'newRem':'newNote'}" aria-label="Add">+</button>`);
}
const taskRow=t=>`<div class="row ${t.done?'done':''}" data-a="editTask" data-id="${t.id}"><button class="chk" data-a="toggle" data-id="${t.id}" aria-label="Toggle done">${t.done?'✓':''}</button><div class="t"><b>${esc(t.title)}</b><span class="mut"><i class="dot ${t.priority}"></i>${t.cat}${t.date&&t.date!==today()?' · '+fmtD(t.date):''}${t.time?' · '+fmtT(t.time):''}</span></div></div>`;
function streak(){const days=new Set(S.tasks.filter(t=>t.doneAt).map(t=>t.doneAt));let d=new Date(),n=0;if(!days.has(ymd(d)))d.setDate(d.getDate()-1);while(days.has(ymd(d))){n++;d.setDate(d.getDate()-1)}return n}
function vToday(){
 const h=new Date().getHours(),g=h<12?'Good morning':h<18?'Good afternoon':'Good evening',td=today();
 const tt=S.tasks.filter(t=>t.date===td),dn=tt.filter(t=>t.done).length,pct=tt.length?Math.round(dn/tt.length*100):0;
 const od=S.tasks.filter(t=>!t.done&&t.date&&t.date<td);
 let list=filt==='today'?tt.slice().sort((a,b)=>a.done-b.done||(a.time||'99').localeCompare(b.time||'99')):filt==='overdue'?od:S.tasks.filter(t=>t.done);
 const wk=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const k=ymd(d);return[d.toLocaleDateString(undefined,{weekday:'narrow'}),S.tasks.filter(t=>t.doneAt===k).length]}),mx=Math.max(1,...wk.map(w=>w[1]));
 return`<div class="brand"><span>◎ DAYMARK</span></div><div class="sub">${g} · ${new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}</div><h1>Make today count.</h1><p class="sub">A little progress, every day.</p>
 <div class="head"><h2>Today’s tasks</h2><span class="sub">${dn} of ${tt.length} completed</span></div><div class="bar"><i style="width:${pct}%"></i></div>
 <div class="chips">${[['today','Today'],['overdue','Overdue'+(od.length?' ('+od.length+')':'')],['done','Completed']].map(([k,l])=>`<button class="chip ${filt===k?'on':''}" data-a="filt" data-k="${k}">${l}</button>`).join('')}</div>
 ${list.map(taskRow).join('')||`<div class="empty"><b>${filt==='today'?'Nothing planned yet':filt==='overdue'?'Nothing overdue':'No completed tasks yet'}</b>${filt==='today'?'Add a task below to start your day.':'You’re all caught up.'}</div>`}
 <div class="quick"><input id="qa" placeholder="Add a task for today…" aria-label="Quick add task"><button class="btn" data-a="quick">Add</button></div>
 <div class="head"><h2>Progress</h2><span class="sub">${pct}% today</span></div>
 <div class="stats" style="margin-top:12px"><div><b>${tt.length}</b><span class="mut">Total</span></div><div><b>${dn}</b><span class="mut">Done</span></div><div><b>${tt.length-dn}</b><span class="mut">Left</span></div></div>
 <div class="week">${wk.map(w=>`<div><i style="height:${w[1]/mx*56}px"></i>${w[0]}</div>`).join('')}</div>
 <p class="mut" style="margin-top:12px">${S.tasks.filter(t=>t.done).length} tasks completed in total · ${streak()}-day streak</p>`}
function vRem(){
 const up=S.reminders.filter(r=>!r.done).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)),dn=S.reminders.filter(r=>r.done);
 const row=r=>`<div class="row ${r.done?'done':''}" data-a="editRem" data-id="${r.id}"><button class="chk" data-a="togRem" data-id="${r.id}" aria-label="Toggle done">${r.done?'✓':''}</button><div class="t"><b>${esc(r.title)}</b><span class="mut">${fmtD(r.date)}${r.time?' · '+fmtT(r.time):''}${r.repeat!=='none'?' · '+r.repeat:''}${r.notify?' · 🔔':''}</span></div></div>`;
 return`<div class="brand"><span>Reminders</span></div><h2>Upcoming</h2>${up.map(row).join('')||'<div class="empty"><b>No reminders</b>Tap + to add something to remember.</div>'}${dn.length?'<div class="head"><h2>Completed</h2></div>'+dn.map(row).join(''):''}`}
function vNotes(){
 const ns=S.notes.filter(n=>(n.title+n.body).toLowerCase().includes(nq.toLowerCase())).sort((a,b)=>b.pinned-a.pinned||b.updated-a.updated);
 return`<div class="brand"><span>Notes</span></div><input id="ns" value="${esc(nq)}" placeholder="Search notes" aria-label="Search notes">${ns.map(n=>`<div class="row" data-a="editNote" data-id="${n.id}"><div class="t"><b>${n.pinned?'📌 ':''}${esc(n.title||'Untitled')}</b><span class="mut">${esc(n.body.slice(0,60))}</span></div></div>`).join('')||'<div class="empty"><b>'+(nq?'No matches':'No notes yet')+'</b>Tap + to write your first note.</div>'}`}
function vCal(){
 const y=calM.getFullYear(),m=calM.getMonth(),fd=S.settings.fdow,first=(new Date(y,m,1).getDay()-fd+7)%7,dim=new Date(y,m+1,0).getDate();
 const has=k=>S.tasks.some(t=>t.date===k)||S.reminders.some(r=>r.date===k);
 const hd=[...Array(7)].map((_,i)=>`<span>${'SMTWTFS'[(i+fd)%7]}</span>`).join('');
 let cells='<i></i>'.repeat(first);
 for(let d=1;d<=dim;d++){const k=ymd(new Date(y,m,d));cells+=`<button data-a="pick" data-k="${k}" class="${k===calSel?'sel':''} ${k===today()?'tdy':''}">${d}${has(k)?'<u></u>':''}</button>`}
 const ts=S.tasks.filter(t=>t.date===calSel),rs=S.reminders.filter(r=>r.date===calSel);
 return`<div class="brand"><span>Calendar</span></div><div class="head" style="margin:0"><button class="btn g" data-a="mon" data-d="-1" aria-label="Previous month">‹</button><h2>${calM.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</h2><button class="btn g" data-a="mon" data-d="1" aria-label="Next month">›</button></div>
 <div class="cal">${hd}${cells}</div><div class="head"><h2>${fmtD(calSel)}</h2><button class="btn" data-a="newTask" data-d="${calSel}">Add task</button></div>
 ${ts.map(taskRow).join('')}${rs.map(r=>`<div class="row" data-a="editRem" data-id="${r.id}"><span class="chk" style="border-color:var(--ac)">🔔</span><div class="t"><b>${esc(r.title)}</b><span class="mut">${fmtT(r.time)||'Reminder'}</span></div></div>`).join('')}${ts.length+rs.length?'':'<div class="empty"><b>Free day</b>Nothing scheduled.</div>'}`}
function vSet(){const s=S.settings,sel=(k,o)=>`<select data-s="${k}">${o.map(([v,l])=>`<option value="${v}" ${String(s[k])===String(v)?'selected':''}>${l}</option>`).join('')}</select>`;
 const np='Notification'in window?Notification.permission:'unsupported';
 return`<div class="brand"><span>Settings</span></div>
 <div class="set">Theme${sel('theme',[['dark','Dark'],['light','Light'],['system','System']])}</div>
 <div class="set">First day of week${sel('fdow',[[0,'Sunday'],[1,'Monday']])}</div>
 <div class="set">Time format${sel('h24',[[false,'12-hour'],[true,'24-hour']])}</div>
 <div class="set">Reminder notifications${sel('notify',[[true,'On'],[false,'Off']])}</div>
 <p class="mut" style="margin:8px 0">Browser permission: ${np}. ${np==='denied'?'Allow notifications in your browser settings.':np==='unsupported'?'This browser can’t show notifications; reminders appear in the app only.':''}</p>
 ${np==='default'?'<button class="btn g" data-a="perm" style="width:100%;margin-bottom:8px">Allow notifications</button>':''}
 <div class="acts" style="margin-top:14px"><button class="btn g" data-a="data">Export / import data</button><button class="btn d" data-a="clear">Clear all data</button></div>
 <p class="mut" style="margin-top:26px">DAYMARK · version 1.0<br>Make today count. Your data stays on this device. No accounts, ads or tracking.</p>`}
