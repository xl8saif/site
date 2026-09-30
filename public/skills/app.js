// Browser OCR helper for scanned PDFs. OCR output is kept in memory and sent as text.
let ocrSourceFile = null;
let ocrTargetFile = null;

async function extractScannedPdf(file, label) {
  if (!file || !file.name.toLowerCase().endsWith(".pdf")) return null;
  if (!window.pdfjsLib || !window.Tesseract) {
    throw new Error("مكتبات PDF/OCR لم تُحمّل بعد. أعد تحميل الصفحة ثم جرّب مرة أخرى.");
  }
  if (!window.pdfjsLib.GlobalWorkerOptions) {
    throw new Error("PDF.js Worker configuration is unavailable. أعد تحميل الصفحة ثم جرّب مرة أخرى.");
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
      status.textContent = label + " — rendering page " + i + "/" + pdf.numPages;
    }

    const result = await window.Tesseract.recognize(
      canvas,
      "eng+ara+urd",
      {
        logger: m => {
          if (!status) return;
          const pct = Math.round((m.progress || 0) * 100);
          status.hidden = false;
          status.textContent = label + " — OCR " + pct + "% — page " + i + "/" + pdf.numPages;
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
      status.textContent = "اختر ملف " + (kind === "source" ? "Source" : "Target") + " PDF أولاً.";
    }
    return;
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    if (status) {
      status.hidden = false;
      status.textContent = "OCR متاح لملفات PDF فقط.";
    }
    return;
  }

  btn.disabled = true;
  try {
    const text = await extractScannedPdf(file, kind === "source" ? "Source" : "Target");
    if (!text) throw new Error("تعذر استخراج نص من ملف PDF.");
    const ocrFile = makeOcrFile(file, text);
    if (kind === "source") ocrSourceFile = ocrFile;
    else ocrTargetFile = ocrFile;
    if (status) {
      status.hidden = false;
      status.textContent =
        (kind === "source" ? "Source" : "Target") +
        " OCR جاهز. سيتم استخدام النص المستخرج تلقائياً عند تشغيل المهمة.";
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
  ["pubg-urdu-lqa","PUBG Urdu LQA","pubg|wow|world of wonder|urdu lqa|mission card|wow tokens|creation mode"],
  ["arabic-urdu-localization","Arabic ↔ Urdu Localization","arabic to urdu|arabic-urdu|عربي|عربی اردو|localization|translation"],
  ["multilingual-translation-mtpe","Multilingual Translation / MTPE","mtpe|multilingual|terminology|translation"],
  ["legal-translation-qa","Legal Translation QA","legal|contract|court|case law|judgment|محكمة|قانون|دعوى|عقد"],
  ["indus-kohistani-research","Indus-Kohistani Research","indus-kohistani|mvy|dardic|duber|kandia|common voice|corpus|کوہستانی|کارپس"]
];
const $ = id => document.getElementById(id);

function stages(state) {
  $("pipeline").hidden = false;
  ["router","planner","execution","review"].forEach(x => {
    const e = document.querySelector('[data-stage="' + x + '"]');
    if (e) e.className = "stage " + (state[x] || "pending");
  });
}

const API_BASE = (window.SAIF_SKILLS_API_BASE ||
  (location.hostname.endsWith("github.io") ? "http://127.0.0.1:8787" : ""));
const task = $("task");
const detected = $("detected");

skills.forEach(s => {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "skill";
  el.dataset.skillId = s[0];
  el.innerHTML = '<strong>' + s[1] + '</strong><span>' + s[0] + '</span>';
  el.addEventListener("click", () => {
    task.value = s[1] + " — " + s[0] + " task";
    detect(task.value);
    task.focus();
    task.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  $("skills").appendChild(el);
});

function detect(v) {
  const t = v.toLowerCase();
  let best = null;
  for (const s of skills) {
    const score = s[2].split("|").reduce(
      (n, k) => n + (t.includes(k.toLowerCase()) ? 1 : 0), 0
    );
    if (score && (!best || score > best.score)) best = { s, score };
  }
  detected.textContent = best
    ? best.s[1] + " · " + best.s[0]
    : "سيتم الاكتشاف تلقائياً";
  return best;
}

task.addEventListener("input", () => detect(task.value));

$("source").addEventListener("change", e => {
  ocrSourceFile = null;
  $("sourceName").textContent = e.target.files[0]?.name || "اختر ملف المصدر";
});
$("target").addEventListener("change", e => {
  ocrTargetFile = null;
  $("targetName").textContent = e.target.files[0]?.name || "اختر ملف الهدف";
});
$("knowledge").addEventListener("change", e => {
  $("knowledgeName").textContent = e.target.files[0]?.name || "اختياري للبحث";
});

$("ocr-source-btn").onclick = () => runOcr("source");
$("ocr-target-btn").onclick = () => runOcr("target");

$("clear").onclick = () => {
  task.value = "";
  $("source").value = "";
  $("target").value = "";
  $("knowledge").value = "";
  ocrSourceFile = null;
  ocrTargetFile = null;
  $("sourceName").textContent = "اختر ملف المصدر";
  $("targetName").textContent = "اختر ملف الهدف";
  $("knowledgeName").textContent = "اختياري للبحث";
  $("result").hidden = true;
  $("pipeline").hidden = true;
  $("ocr-status").hidden = true;
  detected.textContent = "سيتم الاكتشاف تلقائياً";
};

$("run").onclick = async () => {
  if (!task.value.trim()) {
    alert("اكتب وصف المهمة أولاً.");
    return;
  }

  const sf = ocrSourceFile || $("source").files[0];
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
        issue: "إجمالي حجم الملفات كبير جداً لطلب Vercel. استخدم ملفات نصية أصغر أو نفّذ المهمة على دفعات."
      }]
    });
    return;
  }

  $("progress").hidden = false;
  $("run").disabled = true;
  stages({ router: "active", planner: "pending", execution: "pending", review: "pending" });

  try {
    const fd = new FormData();
    fd.append("task", task.value);
    if (sf) fd.append("source", sf);
    if (tf) fd.append("target", tf);
    if (kf) fd.append("knowledge", kf);

    const r = await fetch(API_BASE + "/api/skills/run", {
      method: "POST",
      body: fd
    });

    let data = {};
    try {
      data = await r.json();
    } catch (_) {
      data = {
        status: "REVIEW",
        decision: "HUMAN_REVIEW_REQUIRED",
        summary: { critical: 0, major: 0, minor: 0, query: 1 },
        findings: [{ severity: "query", issue: "API أعادت استجابة غير قابلة للقراءة." }]
      };
    }

    if (!r.ok && data.status !== "REVIEW") {
      data.status = "REVIEW";
      data.decision = "HUMAN_REVIEW_REQUIRED";
      data.findings = [
        ...(data.findings || []),
        { severity: "query", issue: "تعذر تنفيذ الطلب على الخادم (HTTP " + r.status + ")." }
      ];
    }

    stages({
      router: "done",
      planner: "done",
      execution: data.execution ? "done" : "active",
      review: data.status === "PASS" || data.status === "FAIL" ? "done" : "active"
    });
    render(data);
  } catch (e) {
    stages({ router: "done", planner: "done", execution: "review", review: "active" });
    render({
      status: "REVIEW",
      decision: "HUMAN_REVIEW_REQUIRED",
      summary: { critical: 0, major: 0, minor: 0, query: 0 },
      findings: [{
        severity: "query",
        issue: "واجهة API غير متاحة حالياً. شغّل النظام محلياً بالأمر الموجود أدناه."
      }]
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
      issue: "للتنفيذ الفعلي، ارفع المدخلات المطلوبة للمهمة. للترجمة وLQA يلزم Source وTarget، وللبحث يمكن استخدام Knowledge / Research Data."
    }],
    traceability: { router_rule: null, agent: null, validators: [] }
  });
}

function render(d) {
  $("result").hidden = false;
  $("resultTitle").textContent = d.decision || "النتيجة";
  const b = $("badge");
  b.textContent = d.status || "REVIEW";
  b.className = "badge " + String(d.status || "REVIEW").toLowerCase();
  const s = d.summary || {};
  $("summary").innerHTML = [
    ["Critical", s.critical || 0],
    ["Major", s.major || 0],
    ["Minor", s.minor || 0],
    ["Query", s.query || 0]
  ].map(x => '<div class="metric"><b>' + x[1] + '</b><span>' + x[0] + '</span></div>').join("");

  $("findings").innerHTML = (d.findings || []).length
    ? (d.findings || []).map(f =>
      '<div class="finding"><div class="finding-top"><span class="sev">' +
      (f.severity || "unknown") + '</span><strong>' +
      esc(f.code || f.skill_id || "Finding") + '</strong></div><p>' +
      esc(f.issue || f.message || "") + '</p></div>'
    ).join("")
    : '<div class="finding"><strong>No findings.</strong><p>يمكن الانتقال إلى المراجعة البشرية النهائية.</p></div>';

  $("trace").textContent = JSON.stringify(d.traceability || {}, null, 2);
  $("raw").textContent = JSON.stringify(d, null, 2);
  $("result").scrollIntoView({ behavior: "smooth", block: "start" });
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  }[c]));
}

$("langBtn").onclick = () => {
  document.documentElement.dir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
  document.documentElement.lang = document.documentElement.lang === "ar" ? "en" : "ar";
  $("langBtn").textContent = document.documentElement.lang === "ar" ? "English" : "العربية";
};
