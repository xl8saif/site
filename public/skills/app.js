// Browser OCR helper for scanned PDFs. OCR output is kept in memory and sent as text.
let ocrSourceFile = null;
let ocrTargetFile = null;

async function extractScannedPdf(file, label) {
  if (!file || !file.name.toLowerCase().endsWith(".pdf")) return null;
  if (!window.pdfjsLib || !window.Tesseract) {
    throw new Error(tr("ocrLib"));
  }
  if (!window.pdfjsLib.GlobalWorkerOptions) {
    throw new Error(tr("ocrWorker"));
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";
  const status = document.getElementById("ocr-status");

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.6 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport
    }).promise;

    if (status) {
      status.hidden = false;
      status.textContent = label + " — " + (uiLang==="ur" ? "صفحہ دکھایا جا رہا ہے " : uiLang==="ar" ? "عرض الصفحة " : "rendering page ") + i + "/" + pdf.numPages;
    }

    const result = await window.Tesseract.recognize(
      canvas,
      "eng+ara+urd",
      {
        logger: m => {
          if (!status) return;
          const pct = Math.round((m.progress || 0) * 100);
          status.hidden = false;
          status.textContent = label + " — OCR " + pct + "% — " + (uiLang==="ur" ? "صفحہ " : uiLang==="ar" ? "الصفحة " : "page ") + i + "/" + pdf.numPages;
        }
      }
    );
    text += (text ? "\n" : "") + result.data.text;
    canvas.width = 1;
    canvas.height = 1;
  }

  return text.trim();
}

function makeOcrFile(original, text) {
  return new File(
    [text],
    original.name.replace(/\.pdf$/i, "") + ".ocr.txt",
    { type: "text/plain" }
  );
}

async function runOcr(kind) {
  const input = document.getElementById(kind === "source" ? "source" : "target");
  const btn = document.getElementById(kind === "source" ? "ocr-source-btn" : "ocr-target-btn");
  const status = document.getElementById("ocr-status");
  const file = input && input.files && input.files[0];

  if (!file) {
    if (status) {
      status.hidden = false;
      status.textContent = tr("selectPdf").replace("{label}", kind === "source" ? "Source" : "Target");
    }
    return;
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    if (status) {
      status.hidden = false;
      status.textContent = tr("ocrPdfOnly");
    }
    return;
  }

  btn.disabled = true;
  try {
    const text = await extractScannedPdf(file, kind === "source" ? "Source" : "Target");
    if (!text) throw new Error(tr("ocrFailed"));
    const ocrFile = makeOcrFile(file, text);
    if (kind === "source") ocrSourceFile = ocrFile;
    else ocrTargetFile = ocrFile;
    if (status) {
      status.hidden = false;
      status.textContent =
        tr("ocrReady").replace("{label}", kind === "source" ? tr("source") : tr("target"));
    }
  } catch (e) {
    if (status) {
      status.hidden = false;
      status.textContent = e.message || String(e);
    }
  } finally {
    btn.disabled = false;
  }
}

const skills = [
  ["pubg-urdu-lqa","PUBG Urdu LQA","فحص جودة PUBG بالأردية","PUBG اردو LQA","pubg|wow|world of wonder|urdu lqa|mission card|wow tokens|creation mode"],
  ["arabic-urdu-localization","Arabic ↔ Urdu Localization","التوطين من العربية إلى الأردية والعكس","عربی ↔ اردو لوکلائزیشن","arabic to urdu|arabic-urdu|عربي|عربی اردو|localization|translation"],
  ["multilingual-translation-mtpe","Multilingual Translation / MTPE","الترجمة متعددة اللغات / المعالجة اللاحقة للترجمة الآلية","کثیر لسانی ترجمہ / MTPE","mtpe|multilingual|terminology|translation"],
  ["legal-translation-qa","Legal Translation QA","فحص جودة الترجمة القانونية","قانونی ترجمہ کی معیار جانچ","legal|contract|court|case law|judgment|محكمة|قانون|دعوى|عقد"],
  ["indus-kohistani-research","Indus-Kohistani Research","أبحاث الإندوس-كوهستانية","انڈس کوہستانی تحقیق","indus-kohistani|mvy|dardic|duber|kandia|common voice|corpus|کوہستانی|کارپس"]
];
const $ = selector => /^[A-Za-z][A-Za-z0-9_-]*$/.test(selector) ? document.getElementById(selector) : document.querySelector(selector);

const I18N={ar:{taskLabel:"المهمة",consoleKicker:"وحدة مهارات الذكاء الاصطناعي · v1.20",sourceLabel:"المصدر",targetLabel:"الهدف",knowledgeLabel:"المعرفة / بيانات البحث",skillAgent:"المهارة / الوكيل",skillsTitle:"المهارات",taskPlaceholder:"مثال: PUBG MOBILE Urdu LQA for a WOW event",auto:"سيتم الاكتشاف تلقائياً",source:"اختر ملف المصدر",target:"اختر ملف الهدف",knowledge:"اختياري للبحث",run:"تشغيل المهمة",clear:"مسح",progress:"جاري تنفيذ المسار الموحد…",how:"طريقة العمل",howText:"النظام لا يغيّر ملفاتك. المدخلات تُستخدم للفحص فقط؛ والقرار النهائي يبقى للمراجعة البشرية.",pipeline:"مسار التنفيذ",router:"تحديد Agent",planner:"اختيار Skill",execution:"تشغيل Validator",review:"قرار المراجعة",result:"النتيجة",evidence:"EVIDENCE",trace:"التتبع",raw:"Raw JSON",cli:"إذا كنت تعمل محلياً",cliText:"يمكن تشغيل نفس المسار من الطرفية:",pdf:"لملفات PDF الممسوحة ضوئياً: نفّذ OCR أولاً ثم استخدم النص الناتج كملف Source أو Target.",ocr:"PDF ممسوح",introTitle:"نفّذ مهام الترجمة والتوطين وفحص الجودة من واجهة واحدة",introText:"اكتب المهمة، ارفع المصدر والهدف، ثم دع النظام يمرّرها عبر Router → Planner → Execution → Human Review Gate. ملفات PDF النصية تُستخرج تلقائياً؛ ملفات PDF الممسوحة ضوئياً تحتاج OCR قبل الفحص.",framework:"الإطار",frameworkText:"تنسيق حتمي لسير العمل",ocrText:"استخراج النص من PDF الممسوح ضوئياً يتم محلياً في المتصفح. بعد الاستخراج يصبح النص جاهزاً مباشرةً عند الضغط على تشغيل المهمة.",ocrSource:"OCR Source PDF",ocrTarget:"OCR Target PDF",noFindings:"يمكن الانتقال إلى المراجعة البشرية النهائية.",finding:"ملاحظة",critical:"حرج",major:"رئيسي",minor:"طفيف",query:"استفسار",taskError:"أدخل وصف المهمة أولاً.",needFiles:"ارفع المدخلات المطلوبة للتنفيذ. الترجمة وLQA تحتاجان إلى Source وTarget؛ ويمكن استخدام Knowledge / Research Data للبحث.",apiUnreadable:"أعادت الواجهة البرمجية استجابة غير قابلة للقراءة.",serverError:"تعذّر إكمال الطلب على الخادم (HTTP {status}).",apiUnavailable:"الواجهة البرمجية غير متاحة حالياً. شغّل النظام محلياً باستخدام الأمر أدناه.",browserFallback:"وضع المتصفح فعال. لا تتوفر المصادقة الكاملة من جهة الخادم على GitHub Pages؛ تم توجيه المهمة وهي جاهزة للمراجعة البشرية.",runtimeError:"تعذّر إكمال المهمة في المتصفح. راجع المدخلات وحاول مرة أخرى.",fileTooLarge:"الملف {name} يتجاوز حد 4 MB. خفّض حجم الملف ثم أعد المحاولة.",totalTooLarge:"الحجم الإجمالي للملفات كبير جداً بالنسبة إلى حد حجم طلب المتصفح. استخدم ملفات نصية أصغر أو شغّل المهمة على دفعات.",selectPdf:"اختر ملف PDF لـ {label} أولاً.",ocrPdfOnly:"OCR متاح لملفات PDF فقط.",ocrFailed:"تعذّر استخراج النص من ملف PDF.",ocrReady:"أصبح OCR لـ {label} جاهزاً. سيُستخدم النص المستخرج تلقائياً عند تشغيل المهمة.",ocrLib:"لم تُحمّل مكتبات PDF/OCR بعد. أعد تحميل الصفحة وحاول مرة أخرى.",ocrWorker:"إعداد PDF.js Worker غير متاح. أعد تحميل الصفحة وحاول مرة أخرى.",localizeNeedSource:"اختر ملف المصدر أو الصق النص أولاً.",localizeEngineMissing:"محرك التوطين في المتصفح لم يتم تحميله بعد. أعد تحميل الصفحة وحاول مرة أخرى.",localizeLoading:"جاري تحميل محرك الترجمة المحلي…",localizeReady:"تم إنشاء الترجمة بنجاح:",localizeError:"فشلت عملية التوطين:"},en:{taskLabel:"Task",consoleKicker:"AI SKILLS CONSOLE · v1.20",sourceLabel:"Source",targetLabel:"Target",knowledgeLabel:"Knowledge / Research Data",skillAgent:"Skill / Agent",skillsTitle:"Skills",taskPlaceholder:"Example: PUBG MOBILE Urdu LQA for a WOW event",auto:"Auto-detection",source:"Choose source file",target:"Choose target file",knowledge:"Optional research data",run:"Run Task",clear:"Clear",progress:"Running the unified pipeline…",how:"How it works",howText:"Your files are not modified. Inputs are used for validation only; the final decision remains with human review.",pipeline:"Execution Pipeline",router:"Select Agent",planner:"Select Skill",execution:"Run Validator",review:"Review Decision",result:"Result",evidence:"EVIDENCE",trace:"Traceability",raw:"Raw JSON",cli:"If you are working locally",cliText:"Run the same pipeline from the terminal:",pdf:"For scanned PDFs: run OCR first, then use the extracted text as the Source or Target file.",ocr:"Scanned PDF",introTitle:"Run translation, localization, and quality assurance tasks from one console",introText:"Enter the task, upload source and target files, then let the system route them through Router → Planner → Execution → Human Review Gate. Text PDFs are extracted automatically; scanned PDFs require OCR before validation.",framework:"Framework",frameworkText:"Deterministic orchestration",ocrText:"Scanned PDF text is extracted locally in the browser. After extraction, the text is used automatically when you run the task.",ocrSource:"OCR Source PDF",ocrTarget:"OCR Target PDF",noFindings:"The task can proceed to final human review.",finding:"Finding",critical:"Critical",major:"Major",minor:"Minor",query:"Query",taskError:"Enter a task description first.",needFiles:"Upload the inputs required for execution. Translation and LQA require Source and Target; research can use Knowledge / Research Data.",apiUnreadable:"The API returned an unreadable response.",serverError:"The server could not complete the request (HTTP {status}).",apiUnavailable:"The API is currently unavailable. Run the system locally using the command below.",browserFallback:"Browser mode is active. Full server-side validation is unavailable on GitHub Pages; the task has been routed and is ready for human review.",runtimeError:"The task could not be completed in the browser. Review the input and try again.",fileTooLarge:"File {name} exceeds the 4 MB limit. Reduce the file size and try again.",totalTooLarge:"The combined file size is too large for the browser request-size limit. Use smaller text files or run the task in batches.",selectPdf:"Select a {label} PDF file first.",ocrPdfOnly:"OCR is available for PDF files only.",ocrFailed:"Could not extract text from the PDF.",ocrReady:"{label} OCR is ready. The extracted text will be used automatically when you run the task.",ocrLib:"PDF/OCR libraries have not loaded yet. Reload the page and try again.",ocrWorker:"PDF.js Worker configuration is unavailable. Reload the page and try again.",localizeNeedSource:"Select a source file or paste source text first.",localizeEngineMissing:"The browser localization engine has not loaded yet. Reload the page and try again.",localizeLoading:"Loading the local translation engine…",localizeReady:"Localization generated successfully:",localizeError:"Localization failed:"},ur:{taskLabel:"کام",consoleKicker:"AI SKILLS CONSOLE · v1.20",sourceLabel:"ماخذ",targetLabel:"ہدف",knowledgeLabel:"علم / تحقیقی ڈیٹا",skillAgent:"Skill / Agent",skillsTitle:"Skills",taskPlaceholder:"مثال: PUBG MOBILE Urdu LQA for a WOW event",auto:"خودکار شناخت",source:"ماخذ فائل منتخب کریں",target:"ہدف فائل منتخب کریں",knowledge:"تحقیق کے لیے اختیاری",run:"کام چلائیں",clear:"صاف کریں",progress:"متحدہ پائپ لائن چل رہی ہے…",how:"طریقۂ کار",howText:"آپ کی فائلوں میں کوئی تبدیلی نہیں کی جاتی۔ ان پٹ صرف جانچ کے لیے استعمال ہوتے ہیں؛ حتمی فیصلہ انسانی جائزے کا ہے۔",pipeline:"عمل درآمد کی پائپ لائن",router:"Agent منتخب کریں",planner:"Skill منتخب کریں",execution:"Validator چلائیں",review:"جائزے کا فیصلہ",result:"نتیجہ",evidence:"شواہد",trace:"تتبّع",raw:"خام JSON",cli:"اگر آپ مقامی طور پر کام کر رہے ہیں",cliText:"اسی پائپ لائن کو ٹرمینل سے چلائیں:",pdf:"اسکین شدہ PDF کے لیے پہلے OCR چلائیں، پھر حاصل شدہ متن کو Source یا Target فائل کے طور پر استعمال کریں۔",ocr:"اسکین شدہ PDF",introTitle:"ایک ہی کنسول سے ترجمہ، لوکلائزیشن اور معیار کی جانچ کے کام چلائیں",introText:"کام درج کریں، ماخذ اور ہدف فائلیں اپ لوڈ کریں، پھر نظام انہیں Router → Planner → Execution → Human Review Gate کے ذریعے چلائے گا۔ متنی PDF خودکار طور پر نکالی جاتی ہیں؛ اسکین شدہ PDF کے لیے جانچ سے پہلے OCR ضروری ہے۔",framework:"فریم ورک",frameworkText:"مقررہ ورک فلو آرکیسٹریشن",ocrText:"اسکین شدہ PDF سے متن براؤزر میں مقامی طور پر نکالا جاتا ہے۔ نکالنے کے بعد کام چلانے پر یہی متن خودکار طور پر استعمال ہوگا۔",ocrSource:"OCR ماخذ PDF",ocrTarget:"OCR ہدف PDF",noFindings:"کام کو حتمی انسانی جائزے کے لیے آگے بڑھایا جا سکتا ہے۔",finding:"ملاحظہ",critical:"اہم",major:"بڑا",minor:"معمولی",query:"استفسار",taskError:"پہلے کام کی وضاحت درج کریں۔",needFiles:"عمل درآمد کے لیے مطلوبہ ان پٹ فائلیں اپ لوڈ کریں۔ ترجمہ اور LQA کے لیے Source اور Target درکار ہیں؛ تحقیق کے لیے Knowledge / Research Data استعمال کیا جا سکتا ہے۔",apiUnreadable:"API نے ناقابلِ مطالعہ جواب دیا۔",serverError:"سرور پر درخواست مکمل نہیں ہو سکی (HTTP {status})۔",apiUnavailable:"API فی الحال دستیاب نہیں۔ نیچے دیا گیا کمانڈ استعمال کرتے ہوئے نظام مقامی طور پر چلائیں۔",browserFallback:"براؤزر موڈ فعال ہے۔ GitHub Pages پر مکمل سرور سائیڈ جانچ دستیاب نہیں؛ کام کو درست Skill کی طرف بھیج دیا گیا ہے اور انسانی جائزے کے لیے تیار ہے۔",runtimeError:"کام براؤزر میں مکمل نہیں ہو سکا۔ ان پٹ کی جانچ کریں اور دوبارہ کوشش کریں۔",fileTooLarge:"فائل {name} مقررہ حد (4 MB) سے بڑی ہے۔ فائل کا حجم کم کریں اور دوبارہ کوشش کریں۔",totalTooLarge:"فائلوں کا مجموعی حجم براؤزر کی درخواست کی حد کے لیے بہت زیادہ ہے۔ چھوٹی متنی فائلیں استعمال کریں یا کام کو حصوں میں چلائیں۔",selectPdf:"پہلے {label} PDF فائل منتخب کریں۔",ocrPdfOnly:"OCR صرف PDF فائلوں کے لیے دستیاب ہے۔",ocrFailed:"PDF فائل سے متن نکالا نہیں جا سکا۔",ocrReady:"{label} OCR تیار ہے۔ کام چلانے پر نکالا گیا متن خودکار طور پر استعمال ہوگا۔",ocrLib:"PDF/OCR لائبریریاں ابھی لوڈ نہیں ہوئیں۔ صفحہ دوبارہ لوڈ کریں اور دوبارہ کوشش کریں۔",ocrWorker:"PDF.js Worker configuration دستیاب نہیں۔ صفحہ دوبارہ لوڈ کریں اور دوبارہ کوشش کریں۔",localizeNeedSource:"پہلے ماخذ فائل منتخب کریں یا ماخذ متن پیسٹ کریں۔",localizeEngineMissing:"براؤزر کا لوکلائزیشن انجن ابھی لوڈ نہیں ہوا۔ صفحہ دوبارہ لوڈ کریں اور دوبارہ کوشش کریں۔",localizeLoading:"مقامی ترجمہ انجن لوڈ ہو رہا ہے…",localizeReady:"لوکلائزیشن کامیابی سے تیار ہو گئی:",localizeError:"لوکلائزیشن ناکام ہو گئی:"}};
I18N.fa={taskLabel:"وظیفه",consoleKicker:"اے آئی اسکلز کنسول · v1.20",sourceLabel:"ماخذ",targetLabel:"ہدف",knowledgeLabel:"علم / تحقیقی ڈیٹا",skillAgent:"اسکل / ایجنٹ",skillsTitle:"اسکلز",taskPlaceholder:"مثال: PUBG MOBILE Urdu LQA for a WOW event",auto:"خودکار شناخت",source:"ماخذ فائل منتخب کریں",target:"ہدف فائل منتخب کریں",knowledge:"اختیاری تحقیقی ڈیٹا",run:"کام چلائیں",clear:"صاف کریں",progress:"متحدہ پائپ لائن چل رہی ہے…",pipeline:"عمل درآمد کی پائپ لائن",router:"ایجنٹ منتخب کریں",planner:"اسکل منتخب کریں",execution:"ویلیڈیٹر چلائیں",review:"جائزے کا فیصلہ",result:"نتیجہ",evidence:"شواہد",trace:"تتبّع",raw:"خام JSON",ocr:"اسکین شدہ PDF",introTitle:"ایک ہی کنسول سے ترجمہ، لوکلائزیشن اور معیار کی جانچ کے کام چلائیں",introText:"کام درج کریں، ماخذ اور ہدف فائلیں اپ لوڈ کریں، پھر نظام انہیں Router → Planner → Execution → Human Review Gate کے ذریعے چلائے گا۔ متنی PDF خودکار طور پر نکالی جاتی ہیں؛ اسکین شدہ PDF کے لیے جانچ سے پہلے OCR ضروری ہے۔",framework:"فریم ورک",frameworkText:"مقررہ ورک فلو آرکیسٹریشن",ocrText:"اسکین شدہ PDF سے متن براؤزر میں مقامی طور پر نکالا جاتا ہے۔ نکالنے کے بعد کام چلانے پر یہی متن خودکار طور پر استعمال ہوگا۔",ocrSource:"OCR ماخذ PDF",ocrTarget:"OCR ہدف PDF",noFindings:"کام کو حتمی انسانی جائزے کے لیے آگے بڑھایا جا سکتا ہے۔",finding:"ملاحظہ",critical:"اہم",major:"بڑا",minor:"معمولی",query:"استفسار",taskError:"پہلے کام کی وضاحت درج کریں۔",needFiles:"عمل درآمد کے لیے مطلوبہ ان پٹ فائلیں اپ لوڈ کریں۔ ترجمہ اور LQA کے لیے Source اور Target درکار ہیں؛ تحقیق کے لیے Knowledge / Research Data استعمال کیا جا سکتا ہے۔",apiUnreadable:"API نے ناقابلِ مطالعہ جواب دیا۔",serverError:"سرور پر درخواست مکمل نہیں ہو سکی (HTTP {status})۔",apiUnavailable:"API فی الحال دستیاب نہیں۔ GitHub Pages پر براؤزر موڈ استعمال کریں۔",browserFallback:"براؤزر موڈ فعال ہے۔ GitHub Pages پر مکمل سرور سائیڈ جانچ دستیاب نہیں؛ کام کو متعلقہ اسکل کی طرف بھیج دیا گیا ہے اور انسانی جائزے کے لیے تیار ہے۔",runtimeError:"کام براؤزر میں مکمل نہیں ہو سکا۔ ان پٹ کی جانچ کریں اور دوبارہ کوشش کریں۔",fileTooLarge:"فائل {name} مقررہ حد (4 MB) سے بڑی ہے۔ فائل کا حجم کم کریں اور دوبارہ کوشش کریں۔",totalTooLarge:"فائلوں کا مجموعی حجم بہت زیادہ ہے۔ چھوٹی متنی فائلیں استعمال کریں یا کام کو حصوں میں چلائیں۔",selectPdf:"ابتدا میں {label} کی PDF فائل منتخب کریں۔",ocrPdfOnly:"OCR صرف PDF فائلوں کے لیے دستیاب ہے۔",ocrFailed:"PDF فائل سے متن نکالا نہیں جا سکا۔",ocrReady:"{label} کے لیے OCR تیار ہے۔ کام چلانے پر نکالا گیا متن خودکار طور پر استعمال ہوگا۔",ocrLib:"PDF/OCR لائبریریاں ابھی لوڈ نہیں ہوئیں۔ صفحہ دوبارہ لوڈ کریں اور دوبارہ کوشش کریں۔",ocrWorker:"PDF.js Worker دستیاب نہیں۔ صفحہ دوبارہ لوڈ کریں اور دوبارہ کوشش کریں۔",localizeNeedSource:"پہلے ماخذ فائل منتخب کریں یا ماخذ متن پیسٹ کریں۔",localizeEngineMissing:"براؤزر کا لوکلائزیشن انجن ابھی لوڈ نہیں ہوا۔ صفحہ دوبارہ لوڈ کریں اور دوبارہ کوشش کریں۔",localizeLoading:"مقامی ترجمہ انجن لوڈ ہو رہا ہے…",localizeReady:"لوکلائزیشن کامیابی سے تیار ہو گئی:",localizeError:"لوکلائزیشن ناکام ہو گئی:"};
const LOC_I18N={
  ar:{workTitle:"محرّك التوطين",workIntro:"ألصق النص أو أرفق المستند، اختر اللغة الهدف، وسيتم اختيار المهارة تلقائياً من المدخلات وسياق المهمة.",source:"المصدر",paste:"ألصق النص هنا",pasteHint:"يمكنك اللصق مباشرة من أدوات CAT أو الجداول أو المستندات أو المحادثات.",target:"الهدف",autoRoute:"التوجيه الذكي للمهارة",targetLanguage:"اللغة الهدف",selectedSkill:"المهارة المختارة",waiting:"بانتظار المصدر واللغة الهدف",knowledge:"المعرفة / البحث",knowledgeHint:"ملف اختياري للمصطلحات أو المراجع أو السياق",next:"التالي",nextReady:"شغّل المهمة؛ ستظهر النتيجة أدناه للمراجعة.",nextWait:"أضف النص المصدر واختر اللغة الهدف.",run:"تشغيل",runSkill:"توطين بالمهارة المختارة",export:"تصدير النتيجة",result:"النتيجة",review:"جاهز للمراجعة",noAttachment:"لا يوجد مرفق",attach:"إرفاق مستند",chars:"حرف",waitingSource:"ألصق النص أو أرفق المصدر",ready:"جاهز — تم اختيار المهارة لـ "},
  en:{workTitle:"Localization Workbench",workIntro:"Paste text or attach a document, choose the target language, and the console will automatically select the most relevant Skill from the actual input and context.",source:"Source",paste:"Paste text here",pasteHint:"Paste directly from CAT tools, spreadsheets, documents or chat.",target:"Target",autoRoute:"Smart Skill Routing",targetLanguage:"Target language",selectedSkill:"Selected Skill",waiting:"Waiting for source + target",knowledge:"Knowledge / research",knowledgeHint:"Optional terminology, reference or context file",next:"Next",nextReady:"Run it; the result will appear below for review.",nextWait:"Add source text and choose a target language.",run:"Run",runSkill:"Localize with selected Skill",export:"Export result",result:"Result",review:"Ready for review",noAttachment:"No attachment",attach:"Attach document",chars:"chars",waitingSource:"Paste or attach source",ready:"Ready — Skill selected for "},

  fa:{workTitle:"میز کار بومی‌سازی",workIntro:"متن را جای‌گذاری یا سند را پیوست کنید، زبان مقصد را انتخاب کنید تا کنسول مناسب‌ترین مهارت را بر اساس ورودی و زمینه به‌صورت خودکار انتخاب کند.",source:"مبدأ",paste:"متن را اینجا جای‌گذاری کنید",pasteHint:"متن را مستقیماً از ابزارهای CAT، صفحه‌گسترده، سند یا گفت‌وگو جای‌گذاری کنید.",target:"مقصد",autoRoute:"مسیریابی هوشمند مهارت",targetLanguage:"زبان مقصد",selectedSkill:"مهارت انتخاب‌شده",waiting:"در انتظار مبدأ و مقصد",knowledge:"دانش / پژوهش",knowledgeHint:"فایل اختیاری اصطلاحات، مرجع یا زمینه",next:"مرحله بعد",nextReady:"اجرا کنید؛ نتیجه برای بررسی در پایین نمایش داده می‌شود.",nextWait:"متن مبدأ را اضافه کنید و زبان مقصد را انتخاب کنید.",run:"اجرا",runSkill:"بومی‌سازی با مهارت انتخاب‌شده",export:"خروجی گرفتن از نتیجه",result:"نتیجه",review:"آماده بررسی",noAttachment:"بدون پیوست",attach:"پیوست سند",chars:"حرف",waitingSource:"متن مبدأ را جای‌گذاری یا پیوست کنید",ready:"آماده — مهارت انتخاب شد برای "},  ur:{workTitle:"لوکلائزیشن ورک بینچ",workIntro:"متن چسپاں کریں یا دستاویز منسلک کریں، ہدف زبان منتخب کریں، اور کنسول اصل ان پٹ اور سیاق کے مطابق متعلقہ Skill خودکار طور پر منتخب کرے گا۔",source:"ماخذ",paste:"متن یہاں چسپاں کریں",pasteHint:"CAT ٹولز، اسپریڈ شیٹس، دستاویز یا چیٹ سے براہِ راست متن چسپاں کریں۔",target:"ہدف",autoRoute:"اسمارٹ Skill Routing",targetLanguage:"ہدف زبان",selectedSkill:"منتخب Skill",waiting:"ماخذ اور ہدف کا انتظار",knowledge:"علم / تحقیق",knowledgeHint:"اصطلاحات، حوالہ یا سیاق کی اختیاری فائل",next:"اگلا مرحلہ",nextReady:"کام چلائیں؛ نتیجہ نیچے جائزے کے لیے ظاہر ہوگا۔",nextWait:"ماخذ متن شامل کریں اور ہدف زبان منتخب کریں۔",run:"چلائیں",runSkill:"منتخب Skill سے لوکلائز کریں",export:"نتیجہ برآمد کریں",result:"نتیجہ",review:"جائزے کے لیے تیار",noAttachment:"کوئی منسلکہ نہیں",attach:"دستاویز منسلک کریں",chars:"حروف",waitingSource:"ماخذ متن چسپاں یا منسلک کریں",ready:"تیار — اس زبان کے لیے Skill منتخب ہے: "}
};
let savedLang = null;
try { savedLang = localStorage.getItem("saif-skills-lang"); } catch (_) {}
let uiLang=["ar","en","ur","fa"].includes(savedLang)?savedLang:(["ar","en","ur","fa"].includes(document.documentElement.lang)?document.documentElement.lang:"ar");
function tr(key){return I18N[uiLang][key]||key}
function setText(el,key){if(el)el.textContent=tr(key)}
const nextLang={ar:"en",en:"ur",ur:"fa",fa:"ar"};
const langNames={ar:"English",en:"اردو",ur:"فارسی",fa:"العربية"};
function setLanguage(lang){if(!["ar","en","ur","fa"].includes(lang))lang="ar";uiLang=lang;try { localStorage.setItem("saif-skills-lang",lang); } catch (_) {}document.documentElement.lang=lang;document.documentElement.dir=(lang==="ar"||lang==="ur"||lang==="fa")?"rtl":"ltr";setText(document.querySelector('label[for="task"]'),"taskLabel");setText($("#source-label"),"sourceLabel");setText($("#target-label"),"targetLabel");setText($("#knowledge-label"),"knowledgeLabel");setText($("#detected-label"),"skillAgent");setText($("#skills-title"),"skillsTitle");setText($("task-label"),"taskLabel");setText($("[data-i18n=\"consoleKicker\"]"),"consoleKicker");setText($("pipeline-title"),"pipeline");setText($("evidence-label"),"evidence");setText($("trace-label"),"trace");setText($("raw-label"),"raw");setText($("ocr-text"),"ocrText");setText($("intro-title"),"introTitle");setText($("#intro-text"),"introText");setText($("#framework-label"),"framework");setText($("#framework-text"),"frameworkText");task.placeholder=tr("taskPlaceholder");setText($("run"),"run");setText($("clear"),"clear");setText($(".progress p"),"progress");setText($("#pipeline h2"),"pipeline");["router","planner","execution","review"].forEach(k=>setText(document.querySelector('[data-stage="'+k+'"] span'),k));setText($("#resultTitle"),"result");setText(document.querySelector("#result .kicker"),"evidence");setText(document.querySelector("#result details:nth-of-type(1) summary"),"trace");setText(document.querySelector("#result details:nth-of-type(2) summary"),"raw");setText($("ocr-type"),"ocr");setText($("#ocr-panel p"),"ocrText");setText($("#ocr-source-btn"),"ocrSource");setText($("#ocr-target-btn"),"ocrTarget");document.querySelectorAll(".drop").forEach((el,i)=>{setText(el.querySelector("b"),i===0?"sourceLabel":i===1?"targetLabel":"knowledgeLabel");setText(el.querySelector("span"),i===0?"source":i===1?"target":"knowledge");});setText($("#detected"),"auto");setText($("langBtn"),langNames[lang]);setText($("portfolioLink"),lang==="ar"?"المحفظة":lang==="ur"?"پورٹ فولیو":lang==="fa"?"نمونه‌کارها":"Portfolio");setText($("localize-kicker"),lang==="ar"?"محرّك التوطين":lang==="ur"?"لوکلائزیشن ورک بینچ":lang==="fa"?"میز کار بومی‌سازی":"LOCALIZATION WORKBENCH");setText($("localizeRunLabel"),"run");setText($("exportLocalized"),"export");if (Object.keys(currentResult).length) render(currentResult); setLocalizationCopy(); renderSkills(); if (typeof updateLocalizationWorkbench === "function") updateLocalizationWorkbench(); window.dispatchEvent(new CustomEvent("saif-skills-language"));}

function stages(state) {
  $("pipeline").hidden = false;
  ["router","planner","execution","review"].forEach(x => {
    const e = document.querySelector('[data-stage="' + x + '"]');
    if (e) e.className = "stage " + (state[x] || "pending");
  });
}

let currentResult={};
const task = $("task");
const detected = $("detected");

function skillLabel(s){return uiLang==="ar"?s[2]:uiLang==="ur"?s[3]:uiLang==="fa"?({
  "pubg-urdu-lqa":"PUBG اردو LQA",
  "arabic-urdu-localization":"عربی ↔ اردو بومی‌سازی",
  "multilingual-translation-mtpe":"ترجمه چندزبانه / MTPE",
  "legal-translation-qa":"کنترل کیفیت ترجمه حقوقی",
  "indus-kohistani-research":"پژوهش هندوکش-کوهستانی"
}[s[0]]||s[1]):s[1]}
function renderSkills(){ $("skills").innerHTML=""; skills.forEach(s => {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "skill";
  el.dataset.skillId = s[0];
  el.innerHTML = '<strong>' + (skillLabel(s)) + '</strong><span>' + s[0] + '</span>';
  el.addEventListener("click", () => {
    task.value = (skillLabel(s)) + " — " + s[0] + (uiLang==="ar"?" — مهمة":uiLang==="ur"?" — کام":" task");
    detect(task.value);
    task.focus();
    task.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $("skills").appendChild(el);
  });
}

function detect(v) {
  const t = String(v || "").toLowerCase();
  let best = null;
  for (const s of skills) {
    let score = s[4].split("|").reduce((n,k)=>n+(t.includes(k.toLowerCase())?1:0),0);
    if (s[0] === "arabic-urdu-localization" && /[\u0600-\u06ff]/.test(t) && /localiz|translate|ترجم|لوکلائز|توطین/.test(t)) score += 4;
    if (s[0] === "multilingual-translation-mtpe" && /localiz|translate|ترجم|لوکلائز|توطین/.test(t)) score += 2;
    if (s[0] === "pubg-urdu-lqa" && /pubg|wow|world of wonder/.test(t)) score += 8;
    if (s[0] === "legal-translation-qa" && /legal|contract|court|case law|judgment|قانون|عدالت|معاہد/.test(t)) score += 6;
    if (score && (!best || score > best.score)) best = {s,score};
  }
  detected.textContent = best ? (uiLang==="ar"?best.s[2]:uiLang==="ur"?best.s[3]:best.s[1])+" · "+best.s[0] : tr("auto");
  return best;
}

function getLocalizationSource() {
  const pasted = ($("sourceText")?.value || "").trim();
  const file = ocrSourceFile || $("source")?.files?.[0] || null;
  return { pasted, file, hasSource: Boolean(pasted || file), text: pasted };
}

function localizationContext() {
  const { pasted, file, hasSource } = getLocalizationSource();
  const language = $("targetLanguage")?.value || "ur";
  const name = file?.name || "";
  const languageHint = language === "ur" ? " Urdu اردو" : language === "ar" ? " Arabic العربية" : language === "fa" ? " Persian فارسی" : " English";
  const taskHints = [pasted, name, languageHint].filter(Boolean).join(" ").toLowerCase();
  const explicitTask = task.value.trim();
  const combined = [explicitTask, taskHints].filter(Boolean).join(" ");
  const best = detect(combined);
  return { language, file, pasted, hasSource, best, name };
}

function localizationCopy() { return LOC_I18N[uiLang] || LOC_I18N.en; }

function setLocalizationCopy() {
  const c = localizationCopy();
  const map = {
    "localize-workbench-title": c.workTitle, "localize-workbench-intro": c.workIntro,
    "loc-source-title": c.source, "paste-title": c.paste, "paste-hint": c.pasteHint,
    "loc-target-title": c.target, "targetLanguage-label": c.targetLanguage,
    "smartSkillLabel": c.selectedSkill, "knowledge-label": c.knowledge,
    "knowledgeName": c.knowledgeHint, "loc-next-title": c.next,
    "localizeActionText": c.runSkill, "exportLocalized": c.export,
    "localizedOutput-label": c.result, "resultMeta": c.review,
    "attach-source-label": c.attach, "attach-target-label": c.attach,
    "targetContext": c.autoRoute
  };
  Object.entries(map).forEach(([id,value]) => { const el=$(id); if(el) el.textContent=value; });
  if($("sourceName") && !$("source").files.length && !ocrSourceFile) $("sourceName").textContent=c.noAttachment;
  if($("targetName") && !$("target").files.length) $("targetName").textContent=c.noAttachment;
  if($("locReadinessText") && !getLocalizationSource().hasSource) $("locReadinessText").textContent=c.waitingSource;
}

function updateLocalizationWorkbench() {
  const ctx = localizationContext();
  if(window.SaifLocalizationMemory?.renderSuggestion && ctx.hasSource){
    const src=ctx.pasted || "";
    const srcLang=/[ٹڈڑںےہھچژگپکڑ]/u.test(src)?"ur":/[ؠ-ۿ]/u.test(src)?"ar":"en";
    if(src && ctx.language) window.SaifLocalizationMemory.renderSuggestion(src,srcLang,ctx.language,ctx.best?.s?.[0]||"multilingual-translation-mtpe");
  }
  const c = localizationCopy();
  const sourceCount = (ctx.pasted || "").length;
  const countEl = $("sourceCount");
  const sourceName = $("sourceName");
  const targetName = $("targetName");
  const skillName = $("smartSkillName");
  const skillId = $("smartSkillId");
  const readiness = $("locReadinessText");
  const next = $("locNextText");
  const runBtn = $("localize");

  if (countEl) countEl.textContent = sourceCount.toLocaleString() + " " + c.chars;

  if (sourceName && ctx.file) sourceName.textContent = ctx.file.name || c.noAttachment;
  if (targetName && $("target")?.files?.[0]) targetName.textContent = $("target").files[0].name;
  if (sourceName && !ctx.file && !ctx.pasted) sourceName.textContent = c.noAttachment;

  const skill = ctx.best;
  if (skillName) {
    skillName.textContent = skill
      ? (uiLang === "ar" ? skill.s[2] : uiLang === "ur" ? skill.s[3] : skill.s[1])
      : c.waiting;
  }
  if (skillId) skillId.textContent = skill ? skill.s[0] : c.waiting;

  const ready = Boolean(ctx.hasSource && ctx.language);
  if (readiness) readiness.textContent = ready
    ? c.ready + (skill ? (uiLang === "ar" ? skill.s[2] : uiLang === "ur" ? skill.s[3] : skill.s[1]) : "Multilingual Translation / MTPE")
    : c.waitingSource;
  if (next) next.textContent = ready ? c.nextReady : c.nextWait;

  if (runBtn) runBtn.disabled = !ready;

  if (ready && !task.value.trim()) {
    const label = ctx.language === "ur" ? "Urdu" : ctx.language === "ar" ? "Arabic" : ctx.language === "fa" ? "Persian" : "English";
    task.value = "Localize source content into " + label + " with terminology, placeholders, tags, punctuation and line-break QA";
    detect(task.value);
  }
}

task.addEventListener("input", () => { detect(task.value); updateLocalizationWorkbench(); });
$("sourceText").addEventListener("input", updateLocalizationWorkbench);
function applyResultLanguageFont(language){
  const resultBox = $("locResult");
  const output = $("localizedOutput");
  if(!resultBox || !output) return;
  resultBox.classList.remove("result-lang-ur","result-lang-ar","result-lang-fa","result-lang-en");
  const lang = ["ur","ar","fa","en"].includes(language) ? language : "en";
  resultBox.classList.add("result-lang-" + lang);
  output.setAttribute("lang", lang);
  output.setAttribute("dir", lang === "en" ? "ltr" : "rtl");
}
applyResultLanguageFont($("targetLanguage")?.value || "ur");

$("targetLanguage").addEventListener("change", () => {
  applyResultLanguageFont($("targetLanguage")?.value || "ur");
  updateLocalizationWorkbench();
});
$("sourceText").addEventListener("paste", () => setTimeout(updateLocalizationWorkbench, 0));

$("source").addEventListener("change", async e => {
  ocrSourceFile = null;
  const file = e.target.files[0];
  $("sourceName").textContent = file?.name || "No attachment";
  if (file?.name?.toLowerCase().endsWith(".pdf")) {
    try {
      const ocrText = await extractScannedPdf(file, "Source");
      if (ocrText) ocrSourceFile = makeOcrFile(file, ocrText);
    } catch (err) {
      $("localizeNote").textContent = err.message || err;
    }
  }
  updateLocalizationWorkbench();
});
$("target").addEventListener("change", e => {
  ocrTargetFile = null;
  $("targetName").textContent = e.target.files[0]?.name || "No target attachment";
  updateLocalizationWorkbench();
});
$("knowledge").addEventListener("change", e => {
  $("knowledgeName").textContent = e.target.files[0]?.name || "Optional terminology, reference or context file";
});

$("localize").onclick = async () => {
  const ctx = localizationContext();
  const detectedSkill = ctx.best?.s?.[0] || "multilingual-translation-mtpe";
  window.__localizedSkillId = detectedSkill;
  const language = $("targetLanguage")?.value || "ur";
  const label = language === "ur" ? "Urdu" : language === "ar" ? "Arabic" : language === "fa" ? "Persian" : "English";
  const source = ctx.file || (ctx.pasted ? new File([ctx.pasted], "pasted-source.txt", {type:"text/plain"}) : null);
  if (!source) {
    $("localizeNote").className = "loc-message warn";
    $("localizeNote").textContent = tr("localizeNeedSource");
    return;
  }
  if (!window.SaifLocalizer?.localizeFile) {
    $("localizeNote").className = "loc-message warn";
    $("localizeNote").textContent = tr("localizeEngineMissing");
    return;
  }
  $("localize").disabled = true;
  $("exportLocalized").disabled = true;
  $("localizedOutput").hidden = true;
  $("localizeNote").className = "loc-message";
  $("localizeNote").textContent = tr("localizeLoading");
  try {
    const result = await window.SaifLocalizer.localizeFile(source, {
      targetLanguage: language,
      sourceLanguage: "auto",
      skillId: detectedSkill,
      onProgress: msg => { $("localizeNote").textContent = msg; }
    });
    window.__localizedResult = result;
    window.__localizedMachineDraft = result.preview != null ? result.preview : "";
    if (result.preview != null) {
      applyResultLanguageFont(language);
      $("localizedOutput").value = result.preview;
      $("localizedOutput").hidden = false;
    }
    $("exportLocalized").disabled = false;
    if (result.preview != null) {
      ocrTargetFile = new File([result.preview], result.name || "localized-target.txt", {type:"text/plain"});
      if (window.SaifSkillsBrowser?.run) {
        const qa = await window.SaifSkillsBrowser.run(task.value || ("Localization under " + detectedSkill), {source, target: ocrTargetFile, knowledge: null});
        stages({router:"done",planner:"done",execution:"done",review:"active"});
        render(qa);
      }
    }
    if(window.SaifLocalizationMemory?.renderSuggestion && ctx.pasted) window.SaifLocalizationMemory.renderSuggestion(ctx.pasted,"en",language,detectedSkill);
    $("localizeNote").className = "loc-message ok";
    $("localizeNote").textContent = tr("localizeReady") + " " + result.name;
    task.value = "Localize source content into " + label + " with terminology, placeholders, tags, punctuation and line-break QA";
    detect(task.value);
    task.focus();
  } catch (e) {
    $("localizeNote").className = "loc-message warn";
    $("localizeNote").textContent = tr("localizeError") + " " + (e.message || e);
  } finally {
    $("localize").disabled = false;
  }
};

$("exportLocalized").onclick = () => {
  const result = window.__localizedResult;
  if (!result?.blob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(result.blob);
  a.download = result.name || "localized-output.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

$("ocr-source-btn").onclick = () => runOcr("source");
$("ocr-target-btn").onclick = () => runOcr("target");

$("clear").onclick = () => {
  task.value = "";
  $("source").value = "";
  $("target").value = "";
  $("knowledge").value = "";
  if ($("sourceText")) $("sourceText").value = "";
  if ($("localizedOutput")) { $("localizedOutput").value = ""; $("localizedOutput").hidden = true; }
  window.__localizedResult = null;
  window.__localizedMachineDraft = "";
  $("exportLocalized").disabled = true;
  ocrSourceFile = null;
  ocrTargetFile = null;
  $("sourceName").textContent = tr("source");
  $("targetName").textContent = tr("target");
  $("knowledgeName").textContent = tr("knowledge");
  $("result").hidden = true;
  $("pipeline").hidden = true;
  $("ocr-status").hidden = true;
  detected.textContent = tr("auto");
};

$("run").onclick = async () => {
  if (!task.value.trim()) {
    alert(tr("taskError"));
    return;
  }

  const pasted = $("sourceText")?.value.trim();
  const sf = ocrSourceFile || $("source").files[0] || (pasted ? new File([pasted], "pasted-source.txt", { type: "text/plain" }) : null);
  const tf = ocrTargetFile || $("target").files[0];
  const kf = $("knowledge").files[0];

  if (!sf && !kf) {
    showLocal();
    return;
  }

  const maxFile = 4 * 1024 * 1024;
  const files = [sf, tf, kf].filter(Boolean);
  const oversized = files.find(f => f.size > maxFile);
  if (oversized) {
    render({
      status: "REVIEW",
      decision: "HUMAN_REVIEW_REQUIRED",
      summary: { critical: 0, major: 0, minor: 0, query: 1 },
      findings: [{
        severity: "query",
        issue: "الملف " + oversized.name +
          " أكبر من الحد المسموح (4 MB). قلّل حجم الملف ثم أعد المحاولة."
      }]
    });
    return;
  }

  if (files.reduce((n, f) => n + f.size, 0) > 4100000) {
    render({
      status: "REVIEW",
      decision: "HUMAN_REVIEW_REQUIRED",
      summary: { critical: 0, major: 0, minor: 0, query: 1 },
      findings: [{
        severity: "query",
        issue: tr("totalTooLarge")
      }]
    });
    return;
  }

  $("progress").hidden = false;
  $("run").disabled = true;
  stages({ router: "active", planner: "pending", execution: "pending", review: "pending" });

  try {
    stages({ router: "done", planner: "active", execution: "pending", review: "pending" });
    let data = null;
    if (window.SaifSkillsBrowser?.run) {
      data = await window.SaifSkillsBrowser.run(task.value, {
        source: sf || null,
        target: tf || null,
        knowledge: kf || null
      });
    } else {
      // GitHub Pages has no server runtime. Use the deterministic browser fallback.
      const d = detect(task.value);
      stages({ router: "done", planner: "done", execution: "active", review: "pending" });
      data = {
        status: "REVIEW",
        decision: "HUMAN_REVIEW_REQUIRED",
        agent_id: d?.s?.[0] || null,
        summary: { critical: 0, major: 0, minor: 0, query: 1 },
        findings: [{
          severity: "query",
          issue: tr("browserFallback")
        }],
        traceability: {
          router_rule: "browser-keyword-routing",
          agent: d?.s?.[0] || null,
          validators: ["browser-input-check"],
          runtime: "GitHub Pages / browser"
        }
      };
    }
    stages({ router: "done", planner: "done", execution: "done", review: "active" });
    render(data);
  } catch (e) {
    stages({ router: "done", planner: "done", execution: "review", review: "active" });
    render({
      status: "REVIEW",
      decision: "HUMAN_REVIEW_REQUIRED",
      summary: { critical: 0, major: 0, minor: 0, query: 1 },
      findings: [{ severity: "query", issue: tr("runtimeError") + " " + String(e.message || e) }]
    });
  } finally {
    $("progress").hidden = true;
    $("run").disabled = false;
  }
};

function showLocal() {
  const d = detect(task.value);
  render({
    status: "REVIEW",
    decision: "HUMAN_REVIEW_REQUIRED",
    agent_id: d?.s?.[0] || null,
    summary: { critical: 0, major: 0, minor: 0, query: 1 },
    findings: [{
      severity: "query",
      issue: tr("needFiles")
    }],
    traceability: { router_rule: null, agent: null, validators: [] }
  });
}

function labelFor(kind, value) {
  const maps = {
    ar: { status:{PASS:"ناجح",FAIL:"فشل",REVIEW:"مراجعة"}, decision:{READY_FOR_HUMAN_SIGNOFF:"جاهز للمراجعة البشرية النهائية",BLOCK_DELIVERY:"حظر التسليم",HUMAN_REVIEW_REQUIRED:"مطلوب مراجعة بشرية"}, severity:{critical:"حرج",major:"رئيسي",minor:"طفيف",query:"استفسار"}, finding:"ملاحظة" },
    en: { status:{PASS:"PASS",FAIL:"FAIL",REVIEW:"REVIEW"}, decision:{READY_FOR_HUMAN_SIGNOFF:"Ready for Human Sign-off",BLOCK_DELIVERY:"Block Delivery",HUMAN_REVIEW_REQUIRED:"Human Review Required"}, severity:{critical:"Critical",major:"Major",minor:"Minor",query:"Query"}, finding:"Finding" },
    fa: { status:{PASS:"موفق",FAIL:"ناموفق",REVIEW:"بررسی"}, decision:{READY_FOR_HUMAN_SIGNOFF:"آماده تأیید نهایی انسانی",BLOCK_DELIVERY:"توقف تحویل",HUMAN_REVIEW_REQUIRED:"نیازمند بررسی انسانی"}, severity:{critical:"بحرانی",major:"اصلی",minor:"جزئی",query:"استعلام"}, finding:"یافته" },
    ur: { status:{PASS:"کامیاب",FAIL:"ناکام",REVIEW:"جائزہ"}, decision:{READY_FOR_HUMAN_SIGNOFF:"حتمی انسانی منظوری کے لیے تیار",BLOCK_DELIVERY:"ترسیل روکیں",HUMAN_REVIEW_REQUIRED:"انسانی جائزہ ضروری ہے"}, severity:{critical:"اہم",major:"بڑا",minor:"معمولی",query:"استفسار"}, finding:"ملاحظہ" }
  };
  return (maps[uiLang]?.[kind]?.[value]) || value || "";
}

function render(d){currentResult=d||{};
  $("result").hidden = false;
  $("resultTitle").textContent = labelFor("decision", d.decision) || tr("result");
  const b = $("badge");
  b.textContent = labelFor("status", d.status) || labelFor("status", "REVIEW");
  b.className = "badge " + String(d.status || "REVIEW").toLowerCase();
  const s = d.summary || {};
  $("summary").innerHTML = [
    ["critical", s.critical || 0],
    ["major", s.major || 0],
    ["minor", s.minor || 0],
    ["query", s.query || 0]
  ].map(x => '<div class="metric"><b>' + x[1] + '</b><span>' + labelFor("severity", x[0]) + '</span></div>').join("");

  $("findings").innerHTML = (d.findings || []).length
    ? (d.findings || []).map(f =>
      '<div class="finding"><div class="finding-top"><span class="sev">' +
      labelFor("severity", f.severity || "query") + '</span><strong>' +
      esc(f.code || f.skill_id || labelFor("finding", "finding")) + '</strong></div><p>' +
      esc(f.issue || f.message || "") + '</p></div>'
    ).join("")
    : '<div class="finding"><strong>' + labelFor("finding", "finding") + '</strong><p>' + tr("noFindings") + '</p></div>';

  $("trace").textContent = JSON.stringify(d.traceability || {}, null, 2);
  $("raw").textContent = JSON.stringify(d, null, 2);
  $("result").scrollIntoView({ behavior: "smooth", block: "start" });
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  }[c]));
}

setLocalizationCopy();
setLanguage(uiLang);
const languageButton=$("langBtn");
if(languageButton){languageButton.type="button";languageButton.setAttribute("aria-label","Change interface language");languageButton.addEventListener("click",()=>setLanguage(nextLang[uiLang]||"ar"));}
