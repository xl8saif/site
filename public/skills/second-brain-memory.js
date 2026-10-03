/* Saif AI — local-first Second Brain vault. No network calls. */
(function(){
  const KEY="saif-second-brain-v1";
  const now=()=>new Date().toISOString();
  const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
  const clean=v=>String(v??"").trim();
  const empty=()=>({version:1,updatedAt:now(),memories:[],decisions:[]});
  function load(){
    try{
      const x=JSON.parse(localStorage.getItem(KEY)||"null");
      return x&&x.version===1?x:empty();
    }catch(_){return empty();}
  }
  function save(db){db.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(db));return db;}
  function normalizeTags(v){return Array.isArray(v)?v.map(clean).filter(Boolean):clean(v).split(",").map(clean).filter(Boolean);}
  function addMemory(input){
    const db=load(), item={
      id:input.id||uid(),type:input.type||"semantic",content:clean(input.content),
      summary:clean(input.summary),domain:clean(input.domain),project:clean(input.project),
      tags:normalizeTags(input.tags),status:input.status||"tentative",
      confidence:Number.isFinite(Number(input.confidence))?Number(input.confidence):0.5,
      source:input.source||{kind:"human",locator:"browser-capture"},
      created_at:input.created_at||now(),updated_at:now(),valid_from:input.valid_from||now(),
      valid_until:input.valid_until||null,related_ids:Array.isArray(input.related_ids)?input.related_ids:[],
      supersedes:Array.isArray(input.supersedes)?input.supersedes:[]
    };
    if(!item.content)return null;
    if(item.status==="verified"&&item.confidence<0.8)item.confidence=0.8;
    const existing=db.memories.find(x=>x.id===item.id);
    if(existing)Object.assign(existing,item);else db.memories.unshift(item);
    save(db);return item;
  }
  function addDecision(input){
    const db=load(), item={
      id:input.id||uid(),type:"decision",question:clean(input.question),decision:clean(input.decision),
      alternatives:Array.isArray(input.alternatives)?input.alternatives:[],
      rationale:Array.isArray(input.rationale)?input.rationale:[clean(input.rationale)].filter(Boolean),
      scope:Array.isArray(input.scope)?input.scope:[],status:input.status||"active",
      confidence:Number.isFinite(Number(input.confidence))?Number(input.confidence):0.8,
      source:input.source||{kind:"human",locator:"browser-capture"},
      project:clean(input.project),domain:clean(input.domain),tags:normalizeTags(input.tags),
      created_at:input.created_at||now(),updated_at:now(),superseded_by:input.superseded_by||null,
      review_after:input.review_after||null
    };
    if(!item.question||!item.decision)return null;
    const existing=db.decisions.find(x=>x.id===item.id);
    if(existing)Object.assign(existing,item);else db.decisions.unshift(item);
    save(db);return item;
  }
  function tokenize(s){return clean(s).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>1);}
  function score(query,item){
    const q=tokenize(query), text=tokenize([
      item.content,item.summary,item.question,item.decision,item.domain,item.project,
      (item.tags||[]).join(" "),typeof item.source==="string"?item.source:JSON.stringify(item.source||{})
    ].join(" "));
    if(!q.length)return 0;
    let hits=0;for(const t of q)if(text.includes(t))hits++;
    return hits/q.length;
  }
  function search(query,opts={}){
    const db=load(), rows=[
      ...db.memories.map(x=>({...x,_kind:"memory",_text:x.content})),
      ...db.decisions.map(x=>({...x,_kind:"decision",_text:x.question+" "+x.decision+" "+(x.rationale||[]).join(" ")}))
    ].filter(x=>(!opts.type||x._kind===opts.type)&&(!opts.status||x.status===opts.status));
    const q=clean(query);
    if(!q)return rows.sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at))).slice(0,opts.limit||50);
    return rows.map(x=>({...x,_score:score(q,x)})).filter(x=>x._score>0)
      .sort((a,b)=>b._score-(a._score||0)||String(b.updated_at).localeCompare(String(a.updated_at))).slice(0,opts.limit||50);
  }
  function download(name,data,type="application/json"){
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type}));
    a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function exportVault(){download("saif-second-brain.json",JSON.stringify(load(),null,2));}
  async function importVault(file){
    const raw=await file.text();let parsed;
    try{parsed=JSON.parse(raw);}catch(_){parsed=raw.split(/\r?\n/).filter(Boolean).map(line=>JSON.parse(line));}
    const memories=Array.isArray(parsed)?parsed:(parsed.memories||[]);
    const decisions=Array.isArray(parsed)?[]:(parsed.decisions||[]);
    for(const x of memories){
      if(x.question&&x.decision)addDecision(x);else addMemory(x);
    }
    for(const x of decisions)addDecision(x);
    return load();
  }
  function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
  const COPY={
    en:{mem:"knowledge",dec:"decisions",local:"local only",private:"PRIVATE · BROWSER ONLY",intro:"A private browser vault for durable knowledge, terminology, decisions and project context. Nothing in this memory layer is sent to a server.",capture:"Capture durable knowledge",hint:"Save only information you want the system to remember across sessions.",knowledge:"Knowledge",decision:"Decision",question:"Decision question",questionPlaceholder:"What did we decide?",decisionText:"Decision",status:"Status",confidence:"Confidence",project:"Project / domain",tags:"Tags",source:"Source / provenance",save:"Save to Brain",export:"Export vault",import:"Import vault",clear:"Clear local brain",library:"Knowledge library",libraryHint:"Search by content, project, terminology, status or provenance.",search:"Search your stored knowledge, decisions, terminology or projects…",allTypes:"All types",allStatuses:"All statuses",ready:"Your private knowledge library is ready. Search or save a durable item above.",empty:"No stored item matched this search.",saved:"Saved to your private browser brain.",need:"Add some content before saving.",needDecision:"Add both the decision question and decision.",sourcePlaceholder:"Human decision, project note, source file…",memoryPlaceholder:"Write a durable fact, terminology choice, workflow rule or project detail…",decisionPlaceholder:"Record the accepted decision and its scope…"},
    ar:{mem:"معرفة",dec:"قرارات",local:"محلي فقط",private:"خاص · داخل المتصفح",intro:"خزنة خاصة في المتصفح للمعرفة الدائمة والمصطلحات والقرارات وسياق المشاريع. لا تُرسل هذه الذاكرة إلى خادم.",capture:"حفظ معرفة دائمة",hint:"احفظ فقط ما تريد أن يتذكره النظام عبر الجلسات.",knowledge:"معرفة",decision:"قرار",question:"سؤال القرار",questionPlaceholder:"ما القرار الذي اتخذناه؟",decisionText:"القرار",status:"الحالة",confidence:"الثقة",project:"المشروع / المجال",tags:"الوسوم",source:"المصدر / التتبع",save:"حفظ في الذاكرة",export:"تصدير الخزنة",import:"استيراد الخزنة",clear:"مسح الذاكرة المحلية",library:"مكتبة المعرفة",libraryHint:"ابحث في المحتوى والمشروع والمصطلحات والحالة والمصدر.",search:"ابحث في المعرفة والقرارات والمصطلحات والمشاريع المحفوظة…",allTypes:"كل الأنواع",allStatuses:"كل الحالات",ready:"مكتبة المعرفة الخاصة جاهزة. ابحث أو احفظ عنصراً دائماً أعلاه.",empty:"لم يطابق البحث أي عنصر محفوظ.",saved:"تم الحفظ في الذاكرة الخاصة داخل المتصفح.",need:"أضف محتوى قبل الحفظ.",needDecision:"أضف سؤال القرار والقرار معاً.",sourcePlaceholder:"قرار بشري، ملاحظة مشروع، ملف مصدر…",memoryPlaceholder:"اكتب حقيقة دائمة أو مصطلحاً أو قاعدة عمل أو تفاصيل مشروع…",decisionPlaceholder:"سجّل القرار المعتمد ونطاقه…"},
    ur:{mem:"علم",dec:"فیصلے",local:"مقامی",private:"نجی · صرف براؤزر میں",intro:"محفوظ علم، اصطلاحات، فیصلوں اور منصوبوں کے سیاق کے لیے نجی براؤزر والٹ۔ یہ میموری کسی سرور کو نہیں بھیجی جاتی۔",capture:"مستقل علم محفوظ کریں",hint:"صرف وہ معلومات محفوظ کریں جنہیں آپ آئندہ سیشنز میں یاد رکھنا چاہتے ہیں۔",knowledge:"علم",decision:"فیصلہ",question:"فیصلے کا سوال",questionPlaceholder:"ہم نے کیا فیصلہ کیا؟",decisionText:"فیصلہ",status:"حیثیت",confidence:"اعتماد",project:"منصوبہ / شعبہ",tags:"ٹیگز",source:"ماخذ / provenance",save:"برین میں محفوظ کریں",export:"والٹ برآمد کریں",import:"والٹ درآمد کریں",clear:"مقامی برین صاف کریں",library:"علم کی لائبریری",libraryHint:"مواد، منصوبے، اصطلاحات، حیثیت یا ماخذ سے تلاش کریں۔",search:"محفوظ علم، فیصلوں، اصطلاحات یا منصوبوں میں تلاش کریں…",allTypes:"تمام اقسام",allStatuses:"تمام حیثیتیں",ready:"آپ کی نجی علم لائبریری تیار ہے۔ اوپر تلاش کریں یا مستقل معلومات محفوظ کریں۔",empty:"اس تلاش سے کوئی محفوظ اندراج نہیں ملا۔",saved:"نجی براؤزر برین میں محفوظ کر دیا گیا۔",need:"محفوظ کرنے سے پہلے کچھ مواد درج کریں۔",needDecision:"فیصلے کا سوال اور فیصلہ دونوں درج کریں۔",sourcePlaceholder:"انسانی فیصلہ، منصوبے کی نوٹ، ماخذ فائل…",memoryPlaceholder:"مستقل حقیقت، اصطلاحی انتخاب، ورک فلو اصول یا منصوبے کی تفصیل لکھیں…",decisionPlaceholder:"منظور شدہ فیصلہ اور اس کا دائرہ درج کریں…"},
    fa:{mem:"دانش",dec:"تصمیم‌ها",local:"محلی",private:"خصوصی · فقط مرورگر",intro:"یک خزانه خصوصی در مرورگر برای دانش پایدار، اصطلاحات، تصمیم‌ها و زمینه پروژه‌ها. این لایه به هیچ سروری ارسال نمی‌شود.",capture:"ثبت دانش پایدار",hint:"فقط اطلاعاتی را ذخیره کنید که می‌خواهید سیستم در نشست‌های بعدی به خاطر بسپارد.",knowledge:"دانش",decision:"تصمیم",question:"پرسش تصمیم",questionPlaceholder:"چه تصمیمی گرفتیم؟",decisionText:"تصمیم",status:"وضعیت",confidence:"اطمینان",project:"پروژه / حوزه",tags:"برچسب‌ها",source:"منبع / منشأ",save:"ذخیره در برین",export:"خروجی خزانه",import:"ورود خزانه",clear:"پاک‌کردن برین محلی",library:"کتابخانه دانش",libraryHint:"بر اساس محتوا، پروژه، اصطلاحات، وضعیت یا منبع جست‌وجو کنید.",search:"در دانش، تصمیم‌ها، اصطلاحات یا پروژه‌های ذخیره‌شده جست‌وجو کنید…",allTypes:"همه انواع",allStatuses:"همه وضعیت‌ها",ready:"کتابخانه خصوصی دانش آماده است. در بالا جست‌وجو کنید یا موردی پایدار ذخیره کنید.",empty:"هیچ مورد ذخیره‌شده‌ای با این جست‌وجو مطابقت ندارد.",saved:"در برین خصوصی مرورگر ذخیره شد.",need:"پیش از ذخیره، مقداری محتوا وارد کنید.",needDecision:"پرسش تصمیم و خود تصمیم را هر دو وارد کنید.",sourcePlaceholder:"تصمیم انسانی، یادداشت پروژه، فایل منبع…",memoryPlaceholder:"یک واقعیت پایدار، اصطلاح، قاعده کاری یا جزئیات پروژه بنویسید…",decisionPlaceholder:"تصمیم پذیرفته‌شده و دامنه آن را ثبت کنید…"}
  };
  function copy(){return COPY[document.documentElement.lang]||COPY.en;}
  function setCopy(){
    const c=copy(), map={brainIntro:c.intro,brainCaptureLabel:c.capture,brainCaptureHint:c.hint,brainTypeMemory:c.knowledge,brainTypeDecision:c.decision,brainMemoryLabel:c.knowledge,brainQuestionLabel:c.question,brainDecisionLabel:c.decisionText,brainStatusLabel:c.status,brainConfidenceLabel:c.confidence,brainProjectLabel:c.project,brainTagsLabel:c.tags,brainSourceLabel:c.source,brainRemember:c.save,brainExport:c.export,brainImportText:c.import,brainClear:c.clear,brainLibraryLabel:c.library,brainLibraryHint:c.libraryHint};
    Object.entries(map).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v;});
    const q=document.getElementById("brainSearch");if(q)q.placeholder=c.search;
    const m=document.getElementById("brainMemory");if(m)m.placeholder=c.memoryPlaceholder;
    const dq=document.getElementById("brainQuestion");if(dq)dq.placeholder=c.questionPlaceholder||c.question;
    const d=document.getElementById("brainDecision");if(d)d.placeholder=c.decisionPlaceholder;
    const s=document.getElementById("brainSource");if(s)s.placeholder=c.sourcePlaceholder;
  }
  let captureType="memory";
  function setCaptureType(type){
    captureType=type==="decision"?"decision":"memory";
    document.querySelectorAll(".brain-type").forEach(b=>{const active=b.dataset.brainType===captureType;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
    const mf=document.getElementById("brainMemoryField"),df=document.getElementById("brainDecisionField");
    if(mf)mf.hidden=captureType!=="memory";if(df)df.hidden=captureType!=="decision";
  }
  function render(){
    const root=document.getElementById("secondBrain");if(!root)return;
    const db=load(),q=clean(document.getElementById("brainSearch")?.value),type=document.getElementById("brainFilterType")?.value,status=document.getElementById("brainFilterStatus")?.value;
    const results=search(q,{type,status,limit:50}),c=copy();
    document.getElementById("brainStats").textContent=db.memories.length+" "+c.mem+" · "+db.decisions.length+" "+c.dec+" · "+c.local;
    document.getElementById("brainResultCount").textContent=results.length+" / "+(db.memories.length+db.decisions.length);
    const out=document.getElementById("brainResults");
    if(!results.length){out.innerHTML='<div class="brain-empty">'+esc(c.empty)+'</div>';return;}
    out.innerHTML=results.map(x=>{
      const isDecision=x._kind==="decision",title=isDecision?x.question:(x.summary||x.content),body=isDecision?x.decision:x.content;
      const tags=(x.tags||[]).map(t=>'<span class="brain-tag">'+esc(t)+'</span>').join("");
      const source=typeof x.source==="string"?x.source:(x.source?.locator||x.source?.kind||"");
      const pct=Math.round((Number(x.confidence)||0)*100);
      return '<article class="brain-result"><div class="brain-result-top"><div class="brain-result-type '+(isDecision?"decision":"memory")+'">'+esc(isDecision?c.decision:c.mem)+'</div><span class="brain-confidence">'+pct+'%</span></div><h4>'+esc(title)+'</h4><p>'+esc(body)+'</p><div class="brain-result-meta"><span>'+esc(x.status||"")+'</span><span>'+esc(x.project||x.domain||"")+'</span><span>'+esc(source)+'</span></div>'+(tags?'<div class="brain-tags">'+tags+'</div>':"")+'</article>';
    }).join("");
  }
  function setMessage(message,kind=""){
    const el=document.getElementById("brainMessage");if(!el)return;
    el.textContent=message;el.className="brain-message"+(kind?" "+kind:"");
    if(message)setTimeout(()=>{if(el.textContent===message){el.textContent="";el.className="brain-message";}},3500);
  }
  function remember(){
    const c=copy(),status=document.getElementById("brainStatus").value,confidence=Number(document.getElementById("brainConfidence").value),project=document.getElementById("brainProject").value,tags=document.getElementById("brainTags").value,sourceText=document.getElementById("brainSource").value;
    const source=sourceText?{kind:"human",locator:sourceText}: {kind:"human",locator:"browser-capture"};
    if(captureType==="decision"){
      const question=clean(document.getElementById("brainQuestion").value),decision=clean(document.getElementById("brainDecision").value);
      if(!question||!decision){setMessage(c.needDecision,"warn");return;}
      addDecision({question,decision,status:status==="tentative"?"active":status,confidence,project,tags,source});
      document.getElementById("brainQuestion").value="";document.getElementById("brainDecision").value="";
    }else{
      const content=clean(document.getElementById("brainMemory").value);
      if(!content){setMessage(c.need,"warn");return;}
      addMemory({content,status,confidence,project,tags,source});
      document.getElementById("brainMemory").value="";
    }
    setMessage(c.saved,"ok");render();
  }
  function init(){
    const root=document.getElementById("secondBrain");if(!root)return;
    setCopy();setCaptureType("memory");
    document.querySelectorAll(".brain-type").forEach(b=>b.addEventListener("click",()=>setCaptureType(b.dataset.brainType)));
    document.getElementById("brainRemember")?.addEventListener("click",remember);
    document.getElementById("brainSearch")?.addEventListener("input",render);
    document.getElementById("brainFilterType")?.addEventListener("change",render);
    document.getElementById("brainFilterStatus")?.addEventListener("change",render);
    document.getElementById("brainExport")?.addEventListener("click",exportVault);
    document.getElementById("brainImport")?.addEventListener("change",async e=>{if(e.target.files[0]){try{await importVault(e.target.files[0]);setMessage(copy().saved,"ok");render();}catch(err){setMessage("Import failed: "+err.message,"warn");}e.target.value="";}});
    document.getElementById("brainClear")?.addEventListener("click",()=>{if(confirm(copy().clear+"?")){localStorage.removeItem(KEY);render();}});
    render();
    window.addEventListener("saif-skills-language",()=>{setCopy();render();});
  }
  window.SaifSecondBrain={load,save,addMemory,addDecision,search,exportVault,importVault,render};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();