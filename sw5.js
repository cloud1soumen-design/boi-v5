const V='brd5-v9',MAIN='v5.html',OPT=['manifest5.json','icon5-192.png','icon5-512.png','my-glossary.txt'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.add(MAIN);for(const f of OPT){try{await c.add(f)}catch(x){}}await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k.startsWith('brd5-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 if(/manifest5\.json$/.test(u.pathname))return;
 if(/\.(txt|csv|json)$/.test(u.pathname)){
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||Response.error())));
  return;
 }
 e.respondWith((async()=>{
  const hit=await caches.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>null);
  return hit||(await net)||(await caches.match('v5.html'));
 })());
});
