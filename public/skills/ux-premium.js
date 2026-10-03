/* Saif AI Console — UX consistency + agent capability layer */
(function(){
  const copy={
    ar:{agents:"وكلاء جاهزون",local:"محلي",review:"مراجعة بشرية",privacy:"خصوصية محلية",quick:"اختصارات العمل",clearTask:"مسح المهمة",sourceReady:"المصدر جاهز",targetReady:"الهدف جاهز"},
    en:{agents:"Agents ready",local:"Local",review:"Human review",privacy:"Local privacy",quick:"Work shortcuts",clearTask:"Clear task",sourceReady:"Source ready",targetReady:"Target ready"},
    ur:{agents:"ایجنٹس تیار",local:"مقامی",review:"انسانی جائزہ",privacy:"مقامی رازداری",quick:"کام کے شارٹ کٹس",clearTask:"کام صاف کریں",sourceReady:"ماخذ تیار",targetReady:"ہدف تیار"}
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
  function refresh(){
    document.querySelectorAll(".saif-agent-chip span:last-child").forEach((e,i)=>{
      const keys=["agents","local","review","privacy"];e.textContent=t(keys[i]);
    });
    const b=document.getElementById("saifClearTask");if(b)b.textContent=t("clearTask");
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
  new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();