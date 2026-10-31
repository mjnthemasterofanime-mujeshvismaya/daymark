// DAYMARK - notifications.js
// ---- reminders / notifications ----
async function askPerm(){if(!('Notification'in window)){toast('This browser doesn’t support notifications. Reminders will show in the app only.');return false}
 if(Notification.permission==='granted')return true;if(Notification.permission==='denied'){toast('Notifications are blocked in browser settings');return false}
 try{return(await Notification.requestPermission())==='granted'}catch(e){toast('Notification permission isn’t available here');return false}}
function nextDate(r){const d=pd(r.date);if(r.repeat==='daily')d.setDate(d.getDate()+1);else if(r.repeat==='weekly')d.setDate(d.getDate()+7);else d.setMonth(d.getMonth()+1);return ymd(d)}
function tick(){const now=Date.now();let ch=false;S.reminders.forEach(r=>{if(r.done||r.fired===r.date+r.time)return;if(new Date(r.date+'T'+(r.time||'00:00')).getTime()<=now&&r.notify&&S.settings.notify){r.fired=r.date+r.time;ch=true;toast('🔔 '+r.title);if('Notification'in window&&Notification.permission==='granted')try{new Notification('DAYMARK',{body:r.title})}catch(e){}}});if(ch){save();if(tab==='rem')render()}}
