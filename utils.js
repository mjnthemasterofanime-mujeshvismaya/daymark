// DAYMARK - utils.js
const $=s=>document.querySelector(s),ymd=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')},
today=()=>ymd(new Date()),uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6),
esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
pd=s=>new Date(s+'T00:00:00');
const IC={today:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',rem:'<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20h4"/>',notes:'<path d="M6 3h12v18l-6-4-6 4z"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',set:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'};
const TABS=[['today','Today'],['rem','Reminders'],['notes','Notes'],['cal','Calendar'],['set','Settings']];
let S={tasks:[],reminders:[],notes:[],settings:{theme:'dark',fdow:0,h24:false,notify:true}},tab='today',filt='today',calM=new Date(),calSel=today(),nq='',db=null;
