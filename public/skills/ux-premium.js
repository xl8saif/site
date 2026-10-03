/* Saif AI Console — UX consistency + agent capability layer */
(function(){
  const copy={
    ar:{agents:"وكلاء جاهزون",local:"محلي",review:"مراجعة بشرية",privacy:"خصوصية محلية",quick:"اختصارات العمل",clearTask:"مسح المهمة",brainTitle:"قاعدة معرفة سيف",brainDesc:"احفظ المعرفة والقرارات الدائمة محلياً في هذا المتصفح. طبقة الذاكرة هذه لا تجري أي اتصالات بالشبكة.",remember:"حفظ",export:"تصدير الذاكرة",import:"استيراد الذاكرة",clearBrain:"مسح الذاكرة المحلية",brainSearch:"ابحث في المعرفة والقرارات والمصطلحات والمشاريع المحفوظة…",brainMemory:"احفظ معلومة دائمة…",brainProject:"المشروع / المجال"},
    en:{agents:"Agents ready",local:"Local",review:"Human review",privacy:"Local privacy",quick:"Work shortcuts",clearTask:"Clear task",brainTitle:"Saif Knowledge Brain",brainDesc:"Store durable knowledge and decisions locally in this browser. No network calls are made by this memory layer.",remember:"Remember",export:"Export vault",import:"Import vault",clearBrain:"Clear local brain",brainSearch:"Search your stored knowledge, decisions, terminology or projects…",brainMemory:"Remember something durable…",brainProject:"Project / domain"},
    ur:{agents:"ایجنٹس تیار",local:"مقامی",review:"انسانی جائزہ",privacy:"مقامی رازداری",quick:"کام کے شارٹ کٹس",clearTask:"کام صاف کریں",brainTitle:"سیف نالج برین",brainDesc:"پائیدار علم اور فیصلے اسی براؤزر میں مقامی طور پر محفوظ کریں۔ یہ میموری لیئر کوئی نیٹ ورک کال نہیں کرتی۔",remember:"محفوظ کریں",export:"والٹ برآمد کریں",import:"والٹ درآمد کریں",clearBrain:"مقامی برین صاف کریں",brainSearch:"محفوظ علم، فیصلوں، اصطلاحات یا منصوبوں میں تلاش کریں…",brainMemory:"کوئی پائیدار معلومات محفوظ کریں…",brainProject:"منصوبہ / شعبہ"},
    fa:{agents:"عامل‌ها آماده‌اند",local:"محلی",review:"بررسی انسانی",privacy:"حریم خصوصی محلی",quick:"میانبرهای کار",clearTask:"پاک کردن وظیفه",brainTitle:"مغز دانش سیف",brainDesc:"دانش و تصمیم‌های پایدار را به‌صورت محلی در این مرورگر ذخیره کنید. این لایه حافظه هیچ تماس شبکه‌ای برقرار نمی‌کند.",remember:"ذخیره",export:"خروجی مخزن",import:"ورودی مخزن",clearBrain:"پاک کردن حافظه محلی",brainSearch:"جست‌وجو در دانش، تصمیم‌ها، اصطلاحات و پروژه‌های ذخیره‌شده…",brainMemory:"یک اطلاعات پایدار ذخیره کنید…",brainProject:"پروژه / حوزه"}
  };
  function lang(){return document.documentElement.lang||"en"}
  function t(k){return (copy[lang()]||copy.en)[k]||copy.en[k]}
  function mount(){
    const main=document.querySelector(".main-panel");
    if(!main||document.querySelector(".saif-agent-strip"))return;
    const strip=document.createElement("div");
    strip.className="saif-agent-strip";
    [["cloud","agents"],["local","local"],["review","review"],["local","privacy"]].forEach(([state,key])=>{
      const c=document.createElement("span");c.className="saif-agent-chip";c.dataset.state=state;c.innerHTML='<i class="chip-dot"></i><span>'+t(key)+'</span>';strip.appendChild(c);
    });
    const header=main.querySelector(".task-skill-header");
    if(header)main.insertBefore(strip,header);
    const bar=document.createElement("div");bar.className="saif-quickbar";
    bar.innerHTML='<span>'+t("quick")+'</span><button type="button" id="saifClearTask">'+t("clearTask")+'</button>';
    const skills=main.querySelector(".task-skills");
    if(skills)main.insertBefore(bar,skills);
    document.getElementById("saifClearTask")?.addEventListener("click",()=>{
      const task=document.getElementById("task");if(task)task.value="";
      const detected=document.getElementById("detected");if(detected)detected.textContent=(window.uiLang&&window.uiLang==="ar")?"سيتم الاكتشاف تلقائياً":"Auto-detection";
      task?.focus();
      window.dispatchEvent(new Event("input"));
    });
  }
  function localizeBrain(){
    const c=copy[lang()]||copy.en;
    const set=(id,val,attr)=>{
      const e=document.getElementById(id); if(!e)return;
      if(attr)e.setAttribute(attr,val); else e.textContent=val;
    };
    set("secondBrainTitle",c.brainTitle);
    const desc=document.querySelector("#secondBrain .brain-head p"); if(desc)desc.textContent=c.brainDesc;
    set("brainRemember",c.remember); set("brainExport",c.export); set("brainClear",c.clearBrain);
    set("brainImport",c.import);
    set("brainSearch","", "placeholder"); const bs=document.getElementById("brainSearch"); if(bs)bs.placeholder=c.brainSearch;
    const bm=document.getElementById("brainMemory"); if(bm)bm.placeholder=c.brainMemory;
    const bp=document.getElementById("brainProject"); if(bp)bp.placeholder=c.brainProject;
  }
  function refresh(){
    document.querySelectorAll(".saif-agent-chip span:last-child").forEach((e,i)=>{
      const keys=["agents","local","review","privacy"];e.textContent=t(keys[i]);
    });
    const b=document.getElementById("saifClearTask");if(b)b.textContent=t("clearTask"); localizeBrain();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
  new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();