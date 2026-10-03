/* Saif AI Console — UX consistency + agent capability layer */
(function(){
  const copy={
    ar:{agents:"وكلاء جاهزون",local:"محلي",review:"مراجعة بشرية",privacy:"خصوصية محلية",quick:"اختصارات العمل",clearTask:"مسح المهمة",brainTitle:"قاعدة معرفة سيف",brainDesc:"احفظ المعرفة والقرارات الدائمة محلياً في هذا المتصفح. طبقة الذاكرة هذه لا تجري أي اتصالات بالشبكة.",remember:"حفظ",export:"تصدير الذاكرة",import:"استيراد الذاكرة",clearBrain:"مسح الذاكرة المحلية",brainSearch:"ابحث في المعرفة والقرارات والمصطلحات والمشاريع المحفوظة…",brainMemory:"احفظ معلومة دائمة…",brainProject:"المشروع / المجال"},
    en:{agents:"Agents ready",local:"Local",review:"Human review",privacy:"Local privacy",quick:"Work shortcuts",clearTask:"Clear task",brainTitle:"Saif Knowledge Brain",brainDesc:"Store durable knowledge and decisions locally in this browser. No network calls are made by this memory layer.",remember:"Remember",export:"Export vault",import:"Import vault",clearBrain:"Clear local brain",brainSearch:"Search your stored knowledge, decisions, terminology or projects…",brainMemory:"Remember something durable…",brainProject:"Project / domain"},
    ur:{agents:"ایجنٹس تیار",local:"مقامی",review:"انسانی جائزہ",privacy:"مقامی رازداری",quick:"کام کے شارٹ کٹس",clearTask:"کام صاف کریں",brainTitle:"سیف نالج برین",brainDesc:"پائیدار علم اور فیصلے اسی براؤزر میں مقامی طور پر محفوظ کریں۔ یہ میموری لیئر کوئی نیٹ ورک کال نہیں کرتی۔",remember:"محفوظ کریں",export:"والٹ برآمد کریں",import:"والٹ درآمد کریں",clearBrain:"مقامی برین صاف کریں",brainSearch:"محفوظ علم، فیصلوں، اصطلاحات یا منصوبوں میں تلاش کریں…",brainMemory:"کوئی پائیدار معلومات محفوظ کریں…",brainProject:"منصوبہ / شعبہ"},
    fa:{agents:"عامل‌ها آماده‌اند",local:"محلی",review:"بررسی انسانی",privacy:"حریم خصوصی محلی",quick:"میانبرهای کار",clearTask:"پاک کردن وظیفه",brainTitle:"مغز دانش سیف",brainDesc:"دانش و تصمیم‌های پایدار را به‌صورت محلی در این مرورگر ذخیره کنید. این لایه حافظه هیچ تماس شبکه‌ای برقرار نمی‌کند.",remember:"ذخیره",export:"خروجی مخزن",import:"ورودی مخزن",clearBrain:"پاک کردن حافظه محلی",brainSearch:"جست‌وجو در دانش، تصمیم‌ها، اصطلاحات و پروژه‌های ذخیره‌شده…",brainMemory:"یک اطلاعات پایدار ذخیره کنید…",brainProject:"پروژه / حوزه"}
  };
  const surface={
    ar:{
      brand:"مهارات سيف بالذكاء الاصطناعي",portfolio:"المحفظة",skills:"المهارات",skillAgent:"المهارة / الوكيل",
      workbench:"محرّك التوطين",workTitle:"ترجمة وتوطين من مساحة عمل واحدة",workIntro:"ألصق النص أو أرفق ملفاً، اختر اللغة الهدف، وسيختار النظام المهارة المناسبة تلقائياً.",
      waiting:"بانتظار المصدر",targetLanguage:"اللغة الهدف",selectedSkill:"المهارة المختارة",source:"المصدر",paste:"ألصق النص هنا",
      pasteHint:"ألصق مباشرة من أدوات CAT أو الجداول أو المستندات أو المحادثات.",noAttachment:"لا يوجد مرفق",
      attach:"إرفاق ملف",target:"الهدف / النتيجة",output:"مساحة الإخراج",targetAttachment:"لا يوجد ملف هدف",
      attachTarget:"إرفاق الهدف الحالي",result:"النتيجة",readyReview:"جاهز للمراجعة",preview:"معاينة النتيجة",live:"معاينة مباشرة",
      knowledge:"المعرفة / البحث",knowledgeHint:"ملف اختياري للمصطلحات أو المراجع أو السياق",next:"التالي",
      nextReady:"شغّل المهمة؛ ستظهر النتيجة للمراجعة.",nextWait:"أضف النص المصدر واختر اللغة الهدف.",
      run:"ابدأ",runAction:"ابدأ التوطين",export:"تصدير النتيجة",clear:"مسح",pipeline:"مسار التنفيذ",
      router:"تحديد الوكيل",planner:"اختيار المهارة",execution:"تشغيل المدقّق",reviewStage:"قرار المراجعة",
      brainKicker:"قاعدة المعرفة · محلي أولاً",brainTitle:"قاعدة معرفة سيف",brainDesc:"احفظ المعرفة والقرارات الدائمة محلياً في هذا المتصفح. لا تجري طبقة الذاكرة اتصالات بالشبكة.",
      memories:"ذاكرة",decisions:"قرارات",localOnly:"محلي فقط",remember:"حفظ",exportVault:"تصدير الذاكرة",importVault:"استيراد الذاكرة",
      clearBrain:"مسح الذاكرة المحلية",memoryPlaceholder:"احفظ معلومة دائمة…",project:"المشروع / المجال",
      searchPlaceholder:"ابحث في المعرفة والقرارات والمصطلحات والمشاريع…",brainEmpty:"ابحث في المعرفة والقرارات والمصطلحات والمشاريع المحفوظة.",
      tentative:"مؤقت",established:"راسخ",verified:"موثّق",confidence:"درجة الثقة",
      evidence:"الأدلة",trace:"التتبّع",raw:"البيانات الخام",ocr:"PDF ممسوح",ocrSource:"OCR للمصدر",ocrTarget:"OCR للهدف",
      footerVisitors:"زوار الموقع",visitorCountries:"عرض دول الزوار ↗"
    },
    en:{
      brand:"Saif AI Skills",portfolio:"Portfolio",skills:"Skills",skillAgent:"Skill / Agent",
      workbench:"LOCALIZATION WORKBENCH",workTitle:"Translate and localize in one workspace",workIntro:"Paste text or attach a file, choose the target language, and the console will select the relevant Skill automatically.",
      waiting:"Waiting for source",targetLanguage:"Target language",selectedSkill:"Selected Skill",source:"Source",paste:"Paste text here",
      pasteHint:"Paste directly from CAT tools, spreadsheets, documents or chat.",noAttachment:"No attachment",
      attach:"Attach file",target:"Target / Result",output:"Output workspace",targetAttachment:"No target file",
      attachTarget:"Attach existing target",result:"Result",readyReview:"Ready for review",preview:"Target Preview",live:"Live preview",
      knowledge:"Knowledge / research",knowledgeHint:"Optional terminology, reference or context file",next:"Next",
      nextReady:"Run the task; the result will appear for review.",nextWait:"Add source text and choose a target language.",
      run:"Start",runAction:"Start Localization",export:"Export result",clear:"Clear",pipeline:"Execution Pipeline",
      router:"Route agent",planner:"Select skill",execution:"Run validator",reviewStage:"Review decision",
      brainKicker:"KNOWLEDGE BRAIN · LOCAL-FIRST",brainTitle:"Saif Knowledge Brain",brainDesc:"Store durable knowledge and decisions locally in this browser. The memory layer makes no network calls.",
      memories:"memories",decisions:"decisions",localOnly:"local only",remember:"Remember",exportVault:"Export vault",importVault:"Import vault",
      clearBrain:"Clear local brain",memoryPlaceholder:"Remember something durable…",project:"Project / domain",
      searchPlaceholder:"Search stored knowledge, decisions, terminology or projects…",brainEmpty:"Search stored knowledge, decisions, terminology or projects.",
      tentative:"Tentative",established:"Established",verified:"Verified",confidence:"Confidence",
      evidence:"EVIDENCE",trace:"Traceability",raw:"Raw data",ocr:"Scanned PDF",ocrSource:"OCR Source",ocrTarget:"OCR Target",
      footerVisitors:"SITE VISITORS",visitorCountries:"View visitor countries ↗"
    },
    ur:{
      brand:"سیف AI اسکلز",portfolio:"پورٹ فولیو",skills:"اسکلز",skillAgent:"اسکل / ایجنٹ",
      workbench:"لوکلائزیشن ورک بینچ",workTitle:"ایک ہی ورک اسپیس میں ترجمہ اور لوکلائزیشن",workIntro:"متن پیسٹ کریں یا فائل منسلک کریں، ہدف زبان منتخب کریں، اور کنسول متعلقہ Skill خودکار طور پر منتخب کرے گا۔",
      waiting:"ماخذ کا انتظار",targetLanguage:"ہدف زبان",selectedSkill:"منتخب اسکل",source:"ماخذ",paste:"متن یہاں پیسٹ کریں",
      pasteHint:"CAT ٹولز، اسپریڈ شیٹس، دستاویز یا چیٹ سے براہِ راست متن پیسٹ کریں۔",noAttachment:"کوئی منسلکہ نہیں",
      attach:"فائل منسلک کریں",target:"ہدف / نتیجہ",output:"آؤٹ پٹ ورک اسپیس",targetAttachment:"کوئی ہدف فائل نہیں",
      attachTarget:"موجودہ ہدف منسلک کریں",result:"نتیجہ",readyReview:"جائزے کے لیے تیار",preview:"ہدف کی جھلک",live:"براہِ راست جھلک",
      knowledge:"علم / تحقیق",knowledgeHint:"اصطلاحات، حوالہ یا سیاق کی اختیاری فائل",next:"اگلا مرحلہ",
      nextReady:"کام شروع کریں؛ نتیجہ جائزے کے لیے ظاہر ہوگا۔",nextWait:"ماخذ متن شامل کریں اور ہدف زبان منتخب کریں۔",
      run:"شروع کریں",runAction:"لوکلائزیشن شروع کریں",export:"نتیجہ برآمد کریں",clear:"صاف کریں",pipeline:"عمل درآمد کی پائپ لائن",
      router:"ایجنٹ منتخب کریں",planner:"اسکل منتخب کریں",execution:"ویلیڈیٹر چلائیں",reviewStage:"جائزے کا فیصلہ",
      brainKicker:"نالج برین · مقامی",brainTitle:"سیف نالج برین",brainDesc:"پائیدار علم اور فیصلے اسی براؤزر میں مقامی طور پر محفوظ کریں۔ میموری لیئر کوئی نیٹ ورک کال نہیں کرتی۔",
      memories:"یادداشتیں",decisions:"فیصلے",localOnly:"مقامی",remember:"محفوظ کریں",exportVault:"والٹ برآمد کریں",importVault:"والٹ درآمد کریں",
      clearBrain:"مقامی برین صاف کریں",memoryPlaceholder:"کوئی پائیدار معلومات محفوظ کریں…",project:"منصوبہ / شعبہ",
      searchPlaceholder:"محفوظ علم، فیصلوں، اصطلاحات یا منصوبوں میں تلاش کریں…",brainEmpty:"محفوظ علم، فیصلوں، اصطلاحات یا منصوبوں میں تلاش کریں۔",
      tentative:"عارضی",established:"مستند",verified:"تصدیق شدہ",confidence:"اعتماد",
      evidence:"شواہد",trace:"تتبّع",raw:"خام ڈیٹا",ocr:"اسکین شدہ PDF",ocrSource:"ماخذ OCR",ocrTarget:"ہدف OCR",
      footerVisitors:"ویب سائٹ کے وزٹرز",visitorCountries:"وزٹرز کے ممالک دیکھیں ↗"
    },
    fa:{
      brand:"مهارت‌های هوش مصنوعی سیف",portfolio:"نمونه‌کارها",skills:"مهارت‌ها",skillAgent:"مهارت / عامل",
      workbench:"میز کار بومی‌سازی",workTitle:"ترجمه و بومی‌سازی در یک فضای کاری",workIntro:"متن را جای‌گذاری یا فایل را پیوست کنید، زبان مقصد را انتخاب کنید تا کنسول مهارت مناسب را خودکار انتخاب کند.",
      waiting:"در انتظار مبدأ",targetLanguage:"زبان مقصد",selectedSkill:"مهارت انتخاب‌شده",source:"مبدأ",paste:"متن را اینجا جای‌گذاری کنید",
      pasteHint:"متن را مستقیماً از ابزارهای CAT، صفحه‌گسترده، سند یا گفت‌وگو جای‌گذاری کنید.",noAttachment:"بدون پیوست",
      attach:"پیوست فایل",target:"مقصد / نتیجه",output:"فضای خروجی",targetAttachment:"بدون فایل مقصد",
      attachTarget:"پیوست مقصد موجود",result:"نتیجه",readyReview:"آماده بررسی",preview:"پیش‌نمایش مقصد",live:"پیش‌نمایش زنده",
      knowledge:"دانش / پژوهش",knowledgeHint:"فایل اختیاری اصطلاحات، مرجع یا زمینه",next:"مرحله بعد",
      nextReady:"وظیفه را اجرا کنید؛ نتیجه برای بررسی نمایش داده می‌شود.",nextWait:"متن مبدأ را اضافه و زبان مقصد را انتخاب کنید.",
      run:"شروع",runAction:"شروع بومی‌سازی",export:"خروجی نتیجه",clear:"پاک کردن",pipeline:"مسیر اجرا",
      router:"انتخاب عامل",planner:"انتخاب مهارت",execution:"اجرای اعتبارسنج",reviewStage:"تصمیم بررسی",
      brainKicker:"مغز دانش · محلی",brainTitle:"مغز دانش سیف",brainDesc:"دانش و تصمیم‌های پایدار را به‌صورت محلی در این مرورگر ذخیره کنید. لایه حافظه هیچ تماس شبکه‌ای برقرار نمی‌کند.",
      memories:"خاطرات",decisions:"تصمیم‌ها",localOnly:"محلی",remember:"ذخیره",exportVault:"خروجی مخزن",importVault:"ورودی مخزن",
      clearBrain:"پاک کردن حافظه محلی",memoryPlaceholder:"یک اطلاعات پایدار ذخیره کنید…",project:"پروژه / حوزه",
      searchPlaceholder:"جست‌وجو در دانش، تصمیم‌ها، اصطلاحات یا پروژه‌ها…",brainEmpty:"در دانش، تصمیم‌ها، اصطلاحات یا پروژه‌های ذخیره‌شده جست‌وجو کنید.",
      tentative:"موقت",established:"تثبیت‌شده",verified:"تأییدشده",confidence:"اطمینان",
      evidence:"شواهد",trace:"ردیابی",raw:"داده خام",ocr:"PDF اسکن‌شده",ocrSource:"OCR مبدأ",ocrTarget:"OCR مقصد",
      footerVisitors:"بازدیدکنندگان سایت",visitorCountries:"مشاهده کشورهای بازدیدکنندگان ↗"
    }
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
  function localizeSurface(){
    const c=surface[lang()]||surface.en;
    const set=(sel,val,attr)=>{const e=document.querySelector(sel);if(!e)return; if(attr)e.setAttribute(attr,val);else e.textContent=val;};
    set(".brand",c.brand); set("#portfolioLink",c.portfolio); set(".task-skills-head h2",c.skills); set("#detected-label",c.skillAgent);
    set("#localize-kicker",c.workbench); set("#localize-workbench-title",c.workTitle); set("#localize-workbench-intro",c.workIntro);
    set("#locReadinessText",c.waiting); set("#targetLanguage-label",c.targetLanguage); set("#smartSkillLabel",c.selectedSkill);
    set("#loc-source-title",c.source); set("#paste-title",c.paste); set("#paste-hint",c.pasteHint); set("#sourceName",c.noAttachment);
    set("#attach-source-label",c.attach); set("#loc-target-title",c.target); set("#targetContext",c.output); set("#targetName",c.targetAttachment);
    set("#attach-target-label",c.attachTarget); set("#localizedOutput-label",c.result); set("#resultMeta",c.readyReview);
    set("#targetPreviewLabel",c.preview); set("#targetPreviewMeta",c.live); set("#knowledge-label",c.knowledge); set("#knowledgeName",c.knowledgeHint);
    set("#loc-next-title",c.next); set("#locNextText",c.nextWait); set("#localizeRunLabel",c.run); set("#localizeActionText",c.runAction); set("#exportLocalized",c.export);
    set("#pipeline-title",c.pipeline);
    const stageNames={ar:{router:"الموجّه",planner:"المخطّط",execution:"التنفيذ",review:"بوابة المراجعة"},en:{router:"Router",planner:"Planner",execution:"Execution",review:"Review Gate"},ur:{router:"روٹر",planner:"پلانر",execution:"عمل درآمد",review:"جائزہ گیٹ"},fa:{router:"مسیریاب",planner:"برنامه‌ریز",execution:"اجرا",review:"دروازه بررسی"}}[lang()]||{};
    Object.entries(stageNames).forEach(([k,v])=>{const e=document.querySelector('[data-stage="'+k+'"] strong');if(e)e.textContent=v;});
    [["router",c.router],["planner",c.planner],["execution",c.execution],["review",c.reviewStage]].forEach(([k,v])=>set('[data-stage-label="'+k+'"]',v));
    set("#secondBrain .kicker",c.brainKicker); set("#secondBrainTitle",c.brainTitle);
    const desc=document.querySelector("#secondBrain .brain-head p");if(desc)desc.textContent=c.brainDesc;
    set("#brainRemember",c.remember);set("#brainExport",c.exportVault);set("#brainClear",c.clearBrain);
    const imp=document.querySelector("#brainImport")?.parentElement;if(imp)imp.childNodes[0].textContent=c.importVault+" ";
    const bm=document.querySelector("#brainMemory");if(bm)bm.placeholder=c.memoryPlaceholder;
    const bp=document.querySelector("#brainProject");if(bp)bp.placeholder=c.project;
    const bs=document.querySelector("#brainSearch");if(bs)bs.placeholder=c.searchPlaceholder;
    const statuses=document.querySelectorAll("#brainStatus option");if(statuses.length>=3){statuses[0].textContent=c.tentative;statuses[1].textContent=c.established;statuses[2].textContent=c.verified;}
    const conf=document.querySelector("#brainConfidence");if(conf)conf.setAttribute("aria-label",c.confidence);
    const brainEmpty=document.querySelector("#brainResults .brain-empty");if(brainEmpty&&!bs?.value)brainEmpty.textContent=c.brainEmpty;
    set("#evidence-label",c.evidence);set("#trace-label",c.trace);set("#raw-label",c.raw);set("#ocr-title",c.ocr);set("#ocr-type",c.ocr);
    set("#ocr-source-btn",c.ocrSource);set("#ocr-target-btn",c.ocrTarget);set("#footer-visitors",c.footerVisitors);set("#visitor-countries",c.visitorCountries);
    const desc=document.querySelector("#footer-description"); if(desc) desc.textContent=({ar:"أدوات للترجمة والتوطين وفحص الجودة والبحث اللغوي.",en:"AI tools for translation, localization, quality checking and language research.",ur:"ترجمہ، لوکلائزیشن، معیار کی جانچ اور لسانی تحقیق کے لیے AI ٹولز۔",fa:"ابزارهای هوش مصنوعی برای ترجمه، بومی‌سازی، بررسی کیفیت و پژوهش زبانی."})[lang()]||"AI tools for translation, localization, quality checking and language research.";
    const dirs=["en"].includes(lang())?"ltr":"rtl";document.querySelectorAll("#task,#sourceText,#localizedOutput,#brainMemory,#brainProject,#brainSearch").forEach(e=>e.dir=dirs);
  }
  function refresh(){
    document.querySelectorAll(".saif-agent-chip span:last-child").forEach((e,i)=>{
      const keys=["agents","local","review","privacy"];e.textContent=t(keys[i]);
    });
    const b=document.getElementById("saifClearTask");if(b)b.textContent=t("clearTask"); localizeBrain(); localizeSurface();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{mount();localizeSurface();});else {mount();localizeSurface();}
  window.SaifUXSurface={localizeSurface};
  new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();