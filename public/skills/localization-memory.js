/* Saif AI Skills — persistent browser localization memory */
(function(){
  const KEY="saif-localization-memory-v1";
  const now=()=>new Date().toISOString();
  const uid=()=>Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
  const clean=v=>String(v??"").replace(/\r\n?/g,"\n").trim();
  const norm=v=>clean(v).replace(/[ \t]+/g," ").toLowerCase();
  const empty=()=>({version:1,updatedAt:now(),pairs:[],terms:[],styles:[],stats:{lookups:0,hits:0}});
  function load(){
    try{const x=JSON.parse(localStorage.getItem(KEY)||"null");return x&&x.version===1?x:empty();}
    catch(_){return empty();}
  }
  function save(db){db.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(db));return db;}
  function lookup(source,src,tgt,skillId){
    const db=load(), key=norm(source);
    db.stats.lookups=(db.stats.lookups||0)+1;
    const hit=db.pairs.find(p=>p.sourceLanguage===src&&p.targetLanguage===tgt&&norm(p.source)===key&&(!p.skillId||!skillId||p.skillId===skillId));
    if(hit){hit.uses=(hit.uses||0)+1;db.stats.hits=(db.stats.hits||0)+1;save(db);}
    return hit?hit.target:null;
  }
  function applyTerms(text,src,tgt,skillId){
    let out=String(text??"");
    const db=load();
    const terms=db.terms.filter(t=>(!t.sourceLanguage||t.sourceLanguage===src)&&(!t.targetLanguage||t.targetLanguage===tgt)&&(!t.skillId||!skillId||t.skillId===skillId)&&t.source&&t.target)
      .sort((a,b)=>b.source.length-a.source.length);
    for(const t of terms) out=out.split(t.source).join(t.target);
    return out;
  }
  function addPair(source,target,meta={}){
    source=clean(source);target=clean(target);if(!source||!target)return null;
    const db=load(), src=meta.sourceLanguage||"auto", tgt=meta.targetLanguage||"ur", skillId=meta.skillId||"";
    const hit=db.pairs.find(p=>p.sourceLanguage===src&&p.targetLanguage===tgt&&norm(p.source)===norm(source)&&(!p.skillId||!skillId||p.skillId===skillId));
    if(hit){hit.target=target;hit.skillId=skillId;hit.updatedAt=now();hit.uses=hit.uses||0;}
    else db.pairs.unshift({id:uid(),source,target,sourceLanguage:src,targetLanguage:tgt,skillId,createdAt:now(),updatedAt:now(),uses:0});
    save(db);return db.pairs[0];
  }
  function addTerm(source,target,meta={}){
    source=clean(source);target=clean(target);if(!source||!target)return null;
    const db=load(), src=meta.sourceLanguage||"",tgt=meta.targetLanguage||"",skillId=meta.skillId||"";
    const hit=db.terms.find(t=>t.source===source&&t.targetLanguage===tgt&&t.skillId===skillId);
    if(hit){hit.target=target;hit.updatedAt=now();}else db.terms.unshift({id:uid(),source,target,sourceLanguage:src,targetLanguage:tgt,skillId,createdAt:now(),updatedAt:now()});
    save(db);return db.terms[0];
  }
  function addStyle(text,scope="global"){
    text=clean(text);if(!text)return null;
    const db=load(),hit=db.styles.find(s=>norm(s.text)===norm(text)&&s.scope===scope);
    if(!hit)db.styles.unshift({id:uid(),text,scope,enabled:true,createdAt:now(),updatedAt:now()});
    save(db);return db.styles[0];
  }
  function data(){return load();}
  function clearAll(){localStorage.removeItem(KEY);}
  function exportJson(){
    const blob=new Blob([JSON.stringify(load(),null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="saif-localization-memory.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  async function importJson(file){
    const x=JSON.parse(await file.text());
    if(!x||x.version!==1||!Array.isArray(x.pairs)||!Array.isArray(x.terms)||!Array.isArray(x.styles))throw new Error("Invalid localization memory file.");
    const current=load(), merged=empty();
    merged.pairs=[...x.pairs,...current.pairs].filter((p,i,a)=>a.findIndex(q=>q.sourceLanguage===p.sourceLanguage&&q.targetLanguage===p.targetLanguage&&norm(q.source)===norm(p.source))===i);
    merged.terms=[...x.terms,...current.terms].filter((t,i,a)=>a.findIndex(q=>q.source===t.source&&q.targetLanguage===t.targetLanguage&&q.skillId===t.skillId)===i);
    merged.styles=[...x.styles,...current.styles].filter((s,i,a)=>a.findIndex(q=>norm(q.text)===norm(s.text)&&q.scope===s.scope)===i);
    merged.stats={lookups:current.stats?.lookups||0,hits:current.stats?.hits||0};save(merged);return merged;
  }
  function renderStats(root){
    const db=load();if(!root)return;
    root.querySelector("[data-memory-count]").textContent=db.pairs.length+" TM · "+db.terms.length+" terminology · "+db.styles.length+" style rules";
  }
  function init(){
    const wb=document.querySelector(".localization-workbench");if(!wb||document.getElementById("localizationMemory"))return;
    const panel=document.createElement("section");panel.id="localizationMemory";panel.className="localization-memory";
    panel.innerHTML='<div class="memory-head"><div><span class="kicker">PERSISTENT MEMORY</span><h3>Translation Memory &amp; Style</h3><p>Approved wording, terminology and style rules stay in this browser and are reused on future jobs.</p></div><span class="memory-count" data-memory-count></span></div>'+
      '<div class="memory-grid">'+
      '<div><label>Approved source → target</label><button type="button" id="saveMemoryPair" class="memory-primary">Save current result</button></div>'+
      '<div><label>Terminology: source</label><input id="memoryTermSource" type="text" placeholder="Official"></div>'+
      '<div><label>Terminology: preferred target</label><input id="memoryTermTarget" type="text" placeholder="آفیشل"></div>'+
      '<div><label>Style / wording rule</label><input id="memoryStyle" type="text" placeholder="Use concise Standard Pakistani Urdu"></div>'+
      '</div>'+
      '<div class="memory-actions"><button type="button" id="saveMemoryTerm">Save terminology</button><button type="button" id="saveMemoryStyle">Save style rule</button><button type="button" id="exportMemory">Export memory</button><label class="memory-import">Import memory<input id="importMemory" type="file" accept=".json"></label><button type="button" id="clearMemory">Clear saved memory</button></div>'+
      '<div id="memoryNote" class="memory-note" aria-live="polite"></div>';
    wb.insertBefore(panel,wb.querySelector(".loc-result"));
    const note=msg=>{const n=document.getElementById("memoryNote");if(n)n.textContent=msg;};
    renderStats(panel);
    document.getElementById("saveMemoryPair").onclick=()=>{
      const source=document.getElementById("sourceText")?.value||"";
      const target=document.getElementById("localizedOutput")?.value||"";
      const lang=document.getElementById("targetLanguage")?.value||"ur";
      if(!source.trim()||!target.trim()){note("Enter source and review the result first.");return;}
      addPair(source,target,{sourceLanguage:"auto",targetLanguage:lang,skillId:window.__localizedSkillId||""});
      renderStats(panel);note("Approved translation saved to Translation Memory.");
    };
    document.getElementById("saveMemoryTerm").onclick=()=>{
      const s=document.getElementById("memoryTermSource").value,t=document.getElementById("memoryTermTarget").value,lang=document.getElementById("targetLanguage")?.value||"ur";
      if(!s.trim()||!t.trim()){note("Enter both source and preferred target terminology.");return;}
      addTerm(s,t,{targetLanguage:lang,skillId:window.__localizedSkillId||""});renderStats(panel);note("Terminology saved and will be reused.");
    };
    document.getElementById("saveMemoryStyle").onclick=()=>{
      const s=document.getElementById("memoryStyle").value;if(!s.trim()){note("Enter a style or wording rule.");return;}
      addStyle(s,"global");renderStats(panel);note("Style rule saved.");
    };
    document.getElementById("exportMemory").onclick=exportJson;
    document.getElementById("importMemory").onchange=async e=>{try{await importJson(e.target.files[0]);renderStats(panel);note("Memory imported and merged.");}catch(err){note(err.message||String(err));}e.target.value="";};
    document.getElementById("clearMemory").onclick=()=>{if(confirm("Clear all saved translation memory, terminology and style rules from this browser?")){clearAll();renderStats(panel);note("Saved localization memory cleared.");}};
  }
  window.SaifLocalizationMemory={lookup,applyTerms,addPair,addTerm,addStyle,data,exportJson,importJson,renderStats};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();