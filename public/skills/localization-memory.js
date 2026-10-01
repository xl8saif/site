/* Saif AI Skills — persistent browser localization memory */
(function(){
  const KEY="saif-localization-memory-v2";
  const LEGACY_KEY="saif-localization-memory-v1";
  const now=()=>new Date().toISOString();
  const uid=()=>Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
  const clean=v=>String(v??"").replace(/\r\n?/g,"\n").trim();
  const norm=v=>clean(v).replace(/[ \t]+/g," ").toLowerCase();
  const tokens=v=>clean(v).split(/\s+/).filter(Boolean);
  const empty=()=>({version:2,updatedAt:now(),pairs:[],terms:[],styles:[],corrections:[],stats:{lookups:0,hits:0,fuzzyLookups:0,fuzzyHits:0}});
  function seed(db){
    if(db.terms.length||db.styles.length)return db;
    const t=[
      ["Official","آفیشل","en","ur","pubg-urdu-lqa"],["Esports","ای سپورٹس","en","ur","pubg-urdu-lqa"],
      ["Hidden Leaf Center","پوشیدہ پتّا سینٹر","en","ur","pubg-urdu-lqa"],["Valley of the End","اختتام کی وادی","en","ur","pubg-urdu-lqa"],
      ["Brainrot","برین راٹ","en","ur","pubg-urdu-lqa"],["Creation Mode","تخلیق موڈ","en","ur","pubg-urdu-lqa"],
      ["Creator","کریئٹر","en","ur","pubg-urdu-lqa"],["Creation","کریئیشن","en","ur","pubg-urdu-lqa"],
      ["World of Wonder (WOW)","ورلڈ آف ونڈر (WOW)","en","ur","pubg-urdu-lqa"],["Creation Shop","کریئیشن شاپ","en","ur","pubg-urdu-lqa"]
    ];
    db.terms=t.map((x,i)=>({id:"seed-"+i,source:x[0],target:x[1],sourceLanguage:x[2],targetLanguage:x[3],skillId:x[4],createdAt:now(),updatedAt:now()}));
    db.styles=[
      "Use concise Standard Pakistani Urdu; keep wording natural, culturally appropriate and production-ready.",
      "Preserve XML/HTML tags, placeholders, variables, punctuation, structure, spaces and line breaks exactly.",
      "Do not add words that are not present in the source unless required by grammar.",
      "Do not add a final period when the source has no final period.",
      "Prefer consistent approved terminology over literal variation."
    ].map((text,i)=>({id:"seed-style-"+i,text,scope:"global",enabled:true,createdAt:now(),updatedAt:now()}));
    return db;
  }
  function migrate(old){
    const db=empty();
    if(!old)return seed(db);
    db.pairs=Array.isArray(old.pairs)?old.pairs:[];
    db.terms=Array.isArray(old.terms)?old.terms:[];
    db.styles=Array.isArray(old.styles)?old.styles:[];
    db.stats=Object.assign(db.stats,old.stats||{});
    return seed(db);
  }
  function load(){
    try{
      const x=JSON.parse(localStorage.getItem(KEY)||"null");
      if(x&&x.version===2)return x;
      const legacy=JSON.parse(localStorage.getItem(LEGACY_KEY)||"null");
      const db=migrate(x||legacy);
      save(db);
      return db;
    }catch(_){const db=seed(empty());save(db);return db;}
  }
  function save(db){db.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(db));return db;}
  function levenshtein(a,b){
    if(a===b)return 0;
    if(!a)return b.length;if(!b)return a.length;
    let prev=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++){
      const cur=[i];
      for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
      prev=cur;
    }
    return prev[b.length];
  }
  function similarity(a,b){
    const x=norm(a),y=norm(b);
    if(!x||!y)return 0;if(x===y)return 1;
    const max=Math.max(x.length,y.length);
    const edit=1-(levenshtein(x,y)/max);
    const A=new Set(tokens(x)),B=new Set(tokens(y));
    const union=new Set([...A,...B]).size;
    const overlap=union?([...A].filter(v=>B.has(v)).length/union):0;
    return Math.max(0,Math.min(1,(edit*0.65)+(overlap*0.35)));
  }
  function eligible(p,src,tgt,skillId){
    return p.sourceLanguage===src&&p.targetLanguage===tgt&&(!p.skillId||!skillId||p.skillId===skillId);
  }
  function lookupDetailed(source,src,tgt,skillId){
    const db=load(),key=norm(source);
    db.stats.lookups=(db.stats.lookups||0)+1;
    const exact=db.pairs.find(p=>eligible(p,src,tgt,skillId)&&norm(p.source)===key);
    if(exact){
      exact.uses=(exact.uses||0)+1;db.stats.hits=(db.stats.hits||0)+1;save(db);
      return {type:"exact",score:1,target:exact.target,pair:exact};
    }
    db.stats.fuzzyLookups=(db.stats.fuzzyLookups||0)+1;
    const candidates=db.pairs.filter(p=>eligible(p,src,tgt,skillId)).map(p=>({p,score:similarity(source,p.source)})).sort((a,b)=>b.score-a.score);
    const best=candidates[0];
    if(best&&best.score>=0.90){
      if(best.score>=0.96){best.p.uses=(best.p.uses||0)+1;db.stats.fuzzyHits=(db.stats.fuzzyHits||0)+1;save(db);}
      else save(db);
      return {type:"fuzzy",score:best.score,target:best.p.target,pair:best.p,auto:best.score>=0.96};
    }
    save(db);
    return null;
  }
  function lookup(source,src,tgt,skillId){
    const hit=lookupDetailed(source,src,tgt,skillId);
    return hit&&hit.type==="exact"?hit.target:(hit&&hit.auto?hit.target:null);
  }
  function suggest(source,src,tgt,skillId){
    const hit=lookupDetailed(source,src,tgt,skillId);
    return hit&&hit.type==="fuzzy"?hit:null;
  }
  function applyTerms(text,src,tgt,skillId){
    let out=String(text??""),db=load();
    const terms=db.terms.filter(t=>(!t.sourceLanguage||t.sourceLanguage===src)&&(!t.targetLanguage||t.targetLanguage===tgt)&&(!t.skillId||!skillId||t.skillId===skillId)&&t.source&&t.target)
      .sort((a,b)=>b.source.length-a.source.length);
    for(const t of terms)out=out.split(t.source).join(t.target);
    return out;
  }
  function addPair(source,target,meta={}){
    source=clean(source);target=clean(target);if(!source||!target)return null;
    const db=load(),src=meta.sourceLanguage||"auto",tgt=meta.targetLanguage||"ur",skillId=meta.skillId||"";
    const hit=db.pairs.find(p=>p.sourceLanguage===src&&p.targetLanguage===tgt&&norm(p.source)===norm(source)&&p.skillId===skillId);
    if(hit){hit.target=target;hit.updatedAt=now();hit.uses=hit.uses||0;hit.approved=true;}
    else db.pairs.unshift({id:uid(),source,target,sourceLanguage:src,targetLanguage:tgt,skillId,createdAt:now(),updatedAt:now(),uses:0,approved:true});
    save(db);return db.pairs.find(p=>p.source===source&&p.target===target)||db.pairs[0];
  }
  function addTerm(source,target,meta={}){
    source=clean(source);target=clean(target);if(!source||!target)return null;
    const db=load(),src=meta.sourceLanguage||"",tgt=meta.targetLanguage||"",skillId=meta.skillId||"";
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
  function addCorrection(source,machineDraft,approvedTarget,meta={}){
    source=clean(source);machineDraft=clean(machineDraft);approvedTarget=clean(approvedTarget);
    if(!source||!approvedTarget)return null;
    const db=load(),item={id:uid(),source,machineDraft,approvedTarget,sourceLanguage:meta.sourceLanguage||"auto",targetLanguage:meta.targetLanguage||"ur",skillId:meta.skillId||"",correctionType:machineDraft&&norm(machineDraft)!==norm(approvedTarget)?"human-correction":"approval",qaFindings:meta.qaFindings||[],createdAt:now()};
    db.corrections.unshift(item);
    addPair(source,approvedTarget,{sourceLanguage:item.sourceLanguage,targetLanguage:item.targetLanguage,skillId:item.skillId});
    save(db);return item;
  }
  function data(){return load();}
  function clearAll(){localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);}
  function downloadJson(name,data,type="application/json"){
    const blob=new Blob([JSON.stringify(data,null,2)],{type}),a=document.createElement("a");
    a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function exportJson(){downloadJson("saif-localization-memory.json",load());}
  function exportCorrections(){downloadJson("saif-approved-corrections.jsonl",load().corrections.map(x=>JSON.stringify(x)).join("\n"),"application/jsonl");}
  async function importJson(file){
    const x=JSON.parse(await file.text());
    if(!x||!Array.isArray(x.pairs)||!Array.isArray(x.terms)||!Array.isArray(x.styles))throw new Error("Invalid localization memory file.");
    const current=load(),merged=empty();
    merged.pairs=[...x.pairs,...current.pairs].filter((p,i,a)=>a.findIndex(q=>q.sourceLanguage===p.sourceLanguage&&q.targetLanguage===p.targetLanguage&&q.skillId===p.skillId&&norm(q.source)===norm(p.source))===i);
    merged.terms=[...x.terms,...current.terms].filter((t,i,a)=>a.findIndex(q=>q.source===t.source&&q.targetLanguage===t.targetLanguage&&q.skillId===t.skillId)===i);
    merged.styles=[...x.styles,...current.styles].filter((s,i,a)=>a.findIndex(q=>norm(q.text)===norm(s.text)&&q.scope===s.scope)===i);
    merged.corrections=[...(x.corrections||[]),...(current.corrections||[])].filter((c,i,a)=>a.findIndex(q=>q.source===c.source&&q.approvedTarget===c.approvedTarget&&q.createdAt===c.createdAt)===i);
    merged.stats=current.stats||merged.stats;save(merged);return merged;
  }
  function renderStats(root){
    const db=load();if(!root)return;
    const el=root.querySelector("[data-memory-count]");
    if(el)el.textContent=db.pairs.length+" TM · "+db.terms.length+" terminology · "+db.styles.length+" style · "+db.corrections.length+" corrections";
  }
  function init(){
    const wb=document.querySelector(".localization-workbench");if(!wb||document.getElementById("localizationMemory"))return;
    const panel=document.createElement("section");panel.id="localizationMemory";panel.className="localization-memory";
    panel.innerHTML='<div class="memory-head"><div><span class="kicker">PERSISTENT MEMORY · v2</span><h3>Translation Memory &amp; Style</h3><p>Only approved wording becomes permanent memory. Similar matches are suggestions unless confidence is very high.</p></div><span class="memory-count" data-memory-count></span></div>'+
      '<div class="memory-grid">'+
      '<div><label>Approved source → target</label><button type="button" id="saveMemoryPair" class="memory-primary">Save approved translation</button></div>'+
      '<div><label>Terminology: source</label><input id="memoryTermSource" type="text" placeholder="Official"></div>'+
      '<div><label>Terminology: preferred target</label><input id="memoryTermTarget" type="text" placeholder="آفیشل"></div>'+
      '<div><label>Style / wording rule</label><input id="memoryStyle" type="text" placeholder="Use concise Standard Pakistani Urdu"></div>'+
      '</div>'+
      '<div class="memory-actions"><button type="button" id="saveMemoryTerm">Save terminology</button><button type="button" id="saveMemoryStyle">Save style rule</button><button type="button" id="exportMemory">Export memory</button><button type="button" id="exportCorrections">Export approved corpus</button><label class="memory-import">Import memory<input id="importMemory" type="file" accept=".json"></label><button type="button" id="clearMemory">Clear saved memory</button></div>'+
      '<div id="memorySuggestion" class="memory-suggestion" aria-live="polite"></div><div id="memoryNote" class="memory-note" aria-live="polite"></div>';
    wb.insertBefore(panel,wb.querySelector(".loc-result"));
    const note=msg=>{const n=document.getElementById("memoryNote");if(n)n.textContent=msg;};
    const copy={
      en:{k:"PERSISTENT MEMORY · v2",h:"Translation Memory & Style",p:"Only approved wording becomes permanent memory. Similar matches are suggestions unless confidence is very high.",save:"Save approved translation",termS:"Terminology: source",termT:"Terminology: preferred target",style:"Style / wording rule",st:"Save terminology",ss:"Save style rule",ex:"Export memory",ec:"Export approved corpus",im:"Import memory",cl:"Clear saved memory"},
      ar:{k:"الذاكرة المستمرة · الإصدار 2",h:"ذاكرة الترجمة والأسلوب",p:"تدخل الصياغات المعتمدة فقط في الذاكرة الدائمة. المطابقات المتشابهة تظل اقتراحات ما لم تكن الثقة مرتفعة جداً.",save:"حفظ الترجمة المعتمدة",termS:"المصطلح: المصدر",termT:"المصطلح: الترجمة المفضلة",style:"قاعدة الأسلوب / الصياغة",st:"حفظ المصطلح",ss:"حفظ قاعدة الأسلوب",ex:"تصدير الذاكرة",ec:"تصدير corpus المعتمد",im:"استيراد الذاكرة",cl:"مسح الذاكرة المحفوظة"},
      ur:{k:"مستقل میموری · ورژن 2",h:"ترجمہ میموری اور اسلوب",p:"صرف منظور شدہ عبارت مستقل میموری میں شامل ہوتی ہے۔ ملتے جلتے نتائج اس وقت تک صرف تجاویز رہتے ہیں جب تک اعتماد بہت زیادہ نہ ہو۔",save:"منظور شدہ ترجمہ محفوظ کریں",termS:"اصطلاح: ماخذ",termT:"اصطلاح: ترجیحی ترجمہ",style:"اسلوب / لفظی اصول",st:"اصطلاح محفوظ کریں",ss:"اسلوب کا اصول محفوظ کریں",ex:"میموری برآمد کریں",ec:"منظور شدہ corpus برآمد کریں",im:"میموری درآمد کریں",cl:"محفوظ میموری صاف کریں"}
    };
    const localizePanel=()=>{
      const lang=document.documentElement.lang==="ur"?"ur":document.documentElement.lang==="ar"?"ar":"en",x=copy[lang];
      const q=(s)=>panel.querySelector(s);
      q(".kicker").textContent=x.k;q("h3").textContent=x.h;q(".memory-head p").textContent=x.p;
      q("#saveMemoryPair").textContent=x.save;q(".memory-grid label:nth-child(1)").textContent="Approved source → target";
      q(".memory-grid label:nth-child(2)").textContent=x.termS;q(".memory-grid label:nth-child(3)").textContent=x.termT;q(".memory-grid label:nth-child(4)").textContent=x.style;
      q("#saveMemoryTerm").textContent=x.st;q("#saveMemoryStyle").textContent=x.ss;q("#exportMemory").textContent=x.ex;q("#exportCorrections").textContent=x.ec;q(".memory-import").childNodes[0].textContent=x.im+" ";
      q("#clearMemory").textContent=x.cl;
    };
    localizePanel(); window.addEventListener("saif-skills-language",localizePanel);
    renderStats(panel);
    document.getElementById("saveMemoryPair").onclick=()=>{
      const source=document.getElementById("sourceText")?.value||"",target=document.getElementById("localizedOutput")?.value||"",lang=document.getElementById("targetLanguage")?.value||"ur";
      if(!source.trim()||!target.trim()){note("Enter source and review the result first.");return;}
      addCorrection(source,window.__localizedMachineDraft||"",target,{sourceLanguage:"auto",targetLanguage:lang,skillId:window.__localizedSkillId||"",qaFindings:window.__localizedResult?.qa||[]});
      renderStats(panel);note("Approved translation saved. The correction corpus and Translation Memory were updated.");
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
    document.getElementById("exportCorrections").onclick=exportCorrections;
    document.getElementById("importMemory").onchange=async e=>{try{if(!e.target.files[0])return;await importJson(e.target.files[0]);renderStats(panel);note("Memory imported and merged.");}catch(err){note(err.message||String(err));}e.target.value="";};
    document.getElementById("clearMemory").onclick=()=>{if(confirm("Clear all saved translation memory, terminology, style rules and correction corpus from this browser?")){clearAll();renderStats(panel);note("Saved localization memory cleared.");}};
    window.SaifLocalizationMemory.renderSuggestion=(source,src,tgt,skillId)=>{
      const box=document.getElementById("memorySuggestion"),hit=suggest(source,src,tgt,skillId);
      if(!box)return hit;
      box.textContent=hit?("Memory suggestion · "+Math.round(hit.score*100)+"%: "+hit.target):"";
      box.dataset.score=hit?String(hit.score):"";
      return hit;
    };
  }
  window.SaifLocalizationMemory={lookup,lookupDetailed,suggest,applyTerms,addPair,addTerm,addStyle,addCorrection,data,exportJson,exportCorrections,importJson,renderStats,similarity};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();