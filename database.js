// DAYMARK - database.js
// ---- storage (IndexedDB) ----
const open=()=>new Promise((ok,no)=>{const r=indexedDB.open('daymark',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const save=()=>{if(!db)return;try{db.transaction('kv','readwrite').objectStore('kv').put(S,'state')}catch(e){toast('Could not save changes')}};
const load=()=>new Promise(ok=>{const q=db.transaction('kv').objectStore('kv').get('state');q.onsuccess=()=>ok(q.result);q.onerror=()=>ok(null)});
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',2600)}
function applyTheme(){const t=S.settings.theme;t==='system'?document.documentElement.removeAttribute('data-theme'):document.documentElement.dataset.theme=t}
const fmtT=t=>{if(!t)return'';if(S.settings.h24)return t;let[h,m]=t.split(':');const p=h>=12?'PM':'AM';return((h%12)||12)+':'+m+' '+p};
const fmtD=d=>pd(d).toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
