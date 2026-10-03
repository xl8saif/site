/* Saif AI — local-first Second Brain vault. No network calls. */
(function(){
  const KEY="saif-second-brain-v1";
  const now=()=>new Date().toISOString();
  const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
  const clean=v=>String(v??"").trim();
  const empty=()=>({version:1,updatedAt:now(),memories:[],decisions:[]});
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");return x&&x.version===1?x:empty();}catch(_){return empty();}}
  function save(db){db.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(db));return db;}
  function addMemory(input){
    const db=load(), item={
      id:input.id||uid(),type:input.type||"semantic",content:clean(input.content),
      summary:clean(input.summary),domain:clean(input.domain),project:clean(input.project),
      tags:Array.isArray(input.tags)?input.tags.map(clean).filter(Boolean):[],
      status:input.status||"tentative",confidence:Number.isFinite(Number(input.confidence))?Number(input.confidence):0.5,
      source:input.source||{kind:"human",locator:"browser-capture"},
      created_at:input.created_at||now(),updated_at:now(),
      valid_from:input.valid_from||now(),valid_until:input.valid_until||null,
      related_ids:Array.isArray(input.related_ids)?input.related_ids:[],
      supersedes:Array.isArray(input.supersedes)?input.supersedes:[]
    };
    if(!item.content)return null; if(item.status==="verified" && item.confidence<0.8)item.confidence=0.8;
    const existing=db.memories.find(x=>x.id===item.id);
    if(existing)Object.assign(existing,item);else db.memories.unshift(item);
    save(db);return item;
  }
  function addDecision(input){
    const db=load(), item={
      id:input.id||uid(),question:clean(input.question),decision:clean(input.decision),
      alternatives:Array.isArray(input.alternatives)?input.alternatives:[],
      rationale:Array.isArray(input.rationale)?input.rationale:[clean(input.rationale)].filter(Boolean),
      scope:Array.isArray(input.scope)?input.scope:[],
      status:input.status||"active",confidence:Number.isFinite(Number(input.confidence))?Number(input.confidence):0.8,
      source:input.source||{kind:"human",locator:"browser-capture"},created_at:input.created_at||now(),updated_at:now(),
      superseded_by:input.superseded_by||null,review_after:input.review_after||null
    };
    if(!item.question||!item.decision)return null;
    const existing=db.decisions.find(x=>x.id===item.id);
    if(existing)Object.assign(existing,item);else db.decisions.unshift(item);
    save(db);return item;
  }
  function tokenize(s){return clean(s).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>1);}
  function score(query,item){
    const q=tokenize(query), text=tokenize([item.content,item.summary,item.domain,item.project,(item.tags||[]).join(" ")].join(" "));
    if(!q.length)return 0;
    let hits=0;for(const t of q)if(text.includes(t))hits++;
    return hits/q.length;
  }
  function search(query,opts={}){
    const db=load(), rows=[
      ...db.memories.map(x=>({...x,_kind:"memory",_text:x.content})),
      ...db.decisions.map(x=>({...x,_kind:"decision",_text:x.question+" "+x.decision+" "+(x.rationale||[]).join(" ")}))
    ].filter(x=>!opts.status||x.status===opts.status);
    return rows.map(x=>({...x,_score:score(query,x)})).filter(x=>x._score>0).sort((a,b)=>b._score-(a._score||0)||String(b.updated_at).localeCompare(String(a.updated_at))).slice(0,opts.limit||20);
  }
  function download(name,data,type="application/json"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  function exportVault(){download("saif-second-brain.json",JSON.stringify(load(),null,2));}
  async function importVault(file){
    const raw=await file.text(); let parsed; try{parsed=JSON.parse(raw);}catch(_){parsed=raw.split(/\\r?\\n/).filter(Boolean).map(line=>JSON.parse(line));} const db=load();
    const memories=Array.isArray(parsed)?parsed:(parsed.memories||[]);
    const decisions=Array.isArray(parsed)?[]:(parsed.decisions||[]);
    for(const x of memories)addMemory(x);
    for(const x of decisions)addDecision(x);
    return load();
  }
  function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
  function brainCopy(){
    const l=document.documentElement.lang||"en";
    return {
      ar:{mem:"ذاكرة",dec:"قرارات",local:"محلي فقط",empty:"ابحث في المعرفة والقرارات والمصطلحات والمشاريع المحفوظة.",none:"لا توجد ذاكرة مطابقة لهذا البحث."},
      en:{mem:"memories",dec:"decisions",local:"local only",empty:"Search stored knowledge, decisions, terminology or projects.",none:"No stored memory matched this query."},
      ur:{mem:"یادداشتیں",dec:"فیصلے",local:"مقامی",empty:"محفوظ علم، فیصلوں، اصطلاحات یا منصوبوں میں تلاش کریں۔",none:"اس تلاش سے کوئی محفوظ یادداشت نہیں ملی۔"},
      fa:{mem:"خاطرات",dec:"تصمیم‌ها",local:"محلی",empty:"در دانش، تصمیم‌ها، اصطلاحات یا پروژه‌های ذخیره‌شده جست‌وجو کنید.",none:"هیچ حافظه ذخیره‌شده‌ای با این جست‌وجو مطابقت ندارد."}
    }[l]||arguments[0];
  }
  function render(){
    const root=document.getElementById("secondBrain");if(!root)return;
    const db=load(), q=root.querySelector("#brainSearch").value.trim(), results=q?search(q):[];
    const bc=brainCopy(); root.querySelector("#brainStats").textContent=db.memories.length+" "+bc.mem+" · "+db.decisions.length+" "+bc.dec+" · "+bc.local;
    const out=root.querySelector("#brainResults");
    if(!q){out.innerHTML='<div class="brain-empty">'+bc.empty+'</div>';return;}
    if(!results.length){out.innerHTML='<div class="brain-empty">'+bc.none+'</div>';return;}
    out.innerHTML=results.map(x=>{
      const title=x._kind==="decision"?x.question:x.summary||x.content;
      const body=x._kind==="decision"?x.decision:x.content;
      return '<article class="brain-result"><div class="brain-result-meta">'+esc(x._kind)+" · "+esc(x.status||"")+" · "+Math.round((x.confidence||0)*100)+"%</div><h4>"+esc(title)+"</h4><p>"+esc(body)+"</p><small>"+esc(x.project||x.domain||"")+"</small></article>";
    }).join("");
  }
  function init(){
    const root=document.getElementById("secondBrain");if(!root)return;
    const remember=()=>{
      const content=root.querySelector("#brainMemory").value.trim();if(!content)return;
      addMemory({content,status:root.querySelector("#brainStatus").value,confidence:Number(root.querySelector("#brainConfidence").value),project:root.querySelector("#brainProject").value});
      root.querySelector("#brainMemory").value="";render();
    };
    root.querySelector("#brainRemember").onclick=remember;
    root.querySelector("#brainSearch").oninput=render;
    root.querySelector("#brainExport").onclick=exportVault;
    root.querySelector("#brainImport").onchange=async e=>{if(e.target.files[0]){try{await importVault(e.target.files[0]);render();}catch(err){alert("Invalid Second Brain file: "+err.message);}e.target.value="";}};
    root.querySelector("#brainClear").onclick=()=>{if(confirm("Clear this browser's private Second Brain?")){localStorage.removeItem(KEY);render();}};
    render();
  }
  window.SaifSecondBrain={load,save,addMemory,addDecision,search,exportVault,importVault,render};\n  window.addEventListener("saif-skills-language",render);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();