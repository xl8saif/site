/* Saif AI Skills — fast browser localization runtime (GitHub Pages) */
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";

env.allowLocalModels = false;
env.useBrowserCache = true;

const FALLBACK_MODEL = "Xenova/nllb-200-distilled-600M";
const PAIR_MODELS = {
  "en>ur":"R4kSo1997/opus-mt-en-ur-onnx-int8",
  "ur>en":"R4kSo1997/opus-mt-ur-en-onnx-int8",
  "ar>en":"Xenova/opus-mt-ar-en",
  "en>ar":"Xenova/opus-mt-en-ar"
};
const LANG = { ur:"urd_Arab", ar:"arb_Arab", en:"eng_Latn", fa:"pes_Arab" };
const REMOTE_API = "https://api.mymemory.translated.net/get";
const REMOTE_TIMEOUT = 10000;
const MAX_REMOTE_CHARS = 450;
const RUNTIME_VERSION = "2.3.0-stable-browser";
const RT_I18N={
  en:{fast:"Fast translation engine…",fallback:"Fast engine unavailable; switching to private local translation…",loading:"Fast engine unavailable; loading private local engine…",specialized:"Specialized local engine failed; trying NLLB fallback…",download:"Downloading local translation engine… ",preparing:"Preparing local translation engine…",progress:"Fast translation ",translating:"Translating ",tag:"XML/HTML tags changed during localization.",placeholder:"Placeholders changed during localization.",linebreak:"Line-break count changed during localization.",unsupported:"Unsupported target language: ",sourceUnsupported:"Unsupported source language: "},
  ar:{fast:"محرك الترجمة السريع…",fallback:"محرك الترجمة السريع غير متاح؛ جارٍ التحويل إلى محرك الترجمة المحلي الخاص…",loading:"محرك الترجمة السريع غير متاح؛ جارٍ تحميل المحرك المحلي…",specialized:"تعذّر تشغيل المحرك المحلي المتخصص؛ جارٍ تجربة محرك NLLB الاحتياطي…",download:"جارٍ تنزيل محرك الترجمة المحلي… ",preparing:"جارٍ تجهيز محرك الترجمة المحلي…",progress:"الترجمة السريعة ",translating:"جارٍ الترجمة ",tag:"تم تغيير وسوم XML/HTML أثناء التوطين.",placeholder:"تم تغيير العناصر النائبة أثناء التوطين.",linebreak:"تغيّر عدد فواصل الأسطر أثناء التوطين.",unsupported:"لغة الهدف غير مدعومة: ",sourceUnsupported:"لغة المصدر غير مدعومة: "},
  ur:{fast:"تیز ترجمہ انجن…",fallback:"تیز انجن دستیاب نہیں؛ نجی مقامی ترجمہ انجن پر منتقل ہو رہے ہیں…",loading:"تیز انجن دستیاب نہیں؛ نجی مقامی انجن لوڈ ہو رہا ہے…",specialized:"خصوصی مقامی انجن ناکام رہا؛ NLLB متبادل آزمایا جا رہا ہے…",download:"مقامی ترجمہ انجن ڈاؤن لوڈ ہو رہا ہے… ",preparing:"مقامی ترجمہ انجن تیار ہو رہا ہے…",progress:"تیز ترجمہ ",translating:"ترجمہ ہو رہا ہے ",tag:"لوکلائزیشن کے دوران XML/HTML ٹیگز تبدیل ہو گئے۔",placeholder:"لوکلائزیشن کے دوران پلیس ہولڈرز تبدیل ہو گئے۔",linebreak:"لوکلائزیشن کے دوران لائن بریکس کی تعداد تبدیل ہو گئی۔",unsupported:"ہدف زبان معاونت یافتہ نہیں: ",sourceUnsupported:"ماخذ زبان معاونت یافتہ نہیں: "},
  fa:{fast:"موتور ترجمه سریع…",fallback:"موتور سریع در دسترس نیست؛ در حال انتقال به موتور ترجمه محلی خصوصی…",loading:"موتور ترجمه سریع در دسترس نیست؛ موتور محلی در حال بارگذاری است…",specialized:"موتور محلی تخصصی اجرا نشد؛ در حال آزمایش موتور جایگزین NLLB…",download:"در حال دانلود موتور ترجمه محلی… ",preparing:"در حال آماده‌سازی موتور ترجمه محلی…",progress:"ترجمه سریع ",translating:"در حال ترجمه ",tag:"برچسب‌های XML/HTML هنگام بومی‌سازی تغییر کرده‌اند.",placeholder:"جای‌نگهدارها هنگام بومی‌سازی تغییر کرده‌اند.",linebreak:"تعداد شکست‌های خط هنگام بومی‌سازی تغییر کرده است.",unsupported:"زبان مقصد پشتیبانی نمی‌شود: ",sourceUnsupported:"زبان مبدأ پشتیبانی نمی‌شود: "}
};
function rt(key){const lang=document.documentElement.lang||"en";return RT_I18N[lang]?.[key]??RT_I18N.en[key]??key}


function detectSourceLanguage(text){
  const t=String(text||"");
  if(/[ٹڈڑںےہھچژگپکڑ]/u.test(t)) return "ur";
  if(/[ؠ-ۿ]/u.test(t)) return "ar";
  return "en";
}
const TERMINOLOGY={
  "pubg-urdu-lqa":{"Official":"آفیشل","Esports":"ای سپورٹس","Hidden Leaf Center":"پوشیدہ پتّا سینٹر","Valley of the End":"اختتام کی وادی","Brainrot":"برین راٹ","Creation Mode":"تخلیق موڈ","Creator":"کریئٹر","Creation":"کریئیشن","World of Wonder (WOW)":"ورلڈ آف ونڈر (WOW)","Creation Shop":"کریئیشن شاپ"},
  "arabic-urdu-localization":{"ترجمة":"ترجمہ","مترجم":"مترجم","لغة":"زبان","لغات":"زبانیں","نص":"متن","محتوى":"مواد","مصطلحات":"اصطلاحات","وزارة":"وزارت","حكومة":"حکومت","قرار":"فیصلہ","قانون":"قانون","محكمة":"عدالت","حكم":"فیصلہ","دعوى":"دعویٰ"}
};
function enforceTerminology(text,skillId,targetLanguage){
  if(targetLanguage!=="ur") return text;
  let out=String(text);
  for(const [from,to] of Object.entries(TERMINOLOGY[skillId]||{})) out=out.split(from).join(to);
  return out;
}
function cleanText(text){ return String(text??"").replace(/\r\n?/g,"\n"); }

function protectedParts(text){
  const tokens=[];
  const marked=String(text).replace(/<[^>]+>|\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%/g,m=>{
    const key="__SAIF_TOKEN_"+tokens.length+"__";
    tokens.push([key,m]);
    return " "+key+" ";
  });
  return {marked,tokens};
}
function restore(text,tokens){
  let out=String(text);
  for(const [key,value] of tokens) out=out.split(key).join(value);
  return out.replace(/[ \t]+\n/g,"\n").replace(/\n[ \t]+/g,"\n");
}
function tokenCounts(text){
  const tags=String(text).match(/<[^>]+>/g)||[];
  const ph=String(text).match(/\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%/g)||[];
  const count=a=>a.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
  return {tags:count(tags),placeholders:count(ph),linebreaks:(String(text).match(/\n/g)||[]).length};
}
function sameCounts(a,b){const keys=new Set([...Object.keys(a),...Object.keys(b)]);return [...keys].every(k=>a[k]===b[k]);}
function qaText(source,target){
  const a=tokenCounts(source),b=tokenCounts(target),findings=[];
  if(!sameCounts(a.tags,b.tags)) findings.push({severity:"critical",code:"TAG_MISMATCH",issue:rt("tag")});
  if(!sameCounts(a.placeholders,b.placeholders)) findings.push({severity:"critical",code:"PLACEHOLDER_MISMATCH",issue:rt("placeholder")});
  if(a.linebreaks!==b.linebreaks) findings.push({severity:"major",code:"LINEBREAK_MISMATCH",issue:rt("linebreak")});
  return findings;
}

async function remoteTranslateChunk(text,src,tgt,onProgress){
  if(src===tgt) return text;
  const {marked,tokens}=protectedParts(text);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),REMOTE_TIMEOUT);
  try{
    const url=new URL(REMOTE_API);
    url.searchParams.set("q",marked);
    url.searchParams.set("langpair",src+"|"+tgt);
    url.searchParams.set("mt","1");
    onProgress?.(rt("fast"));
    const res=await fetch(url,{signal:controller.signal,headers:{"Accept":"application/json"}});
    if(!res.ok) throw new Error("Fast translation service HTTP "+res.status);
    const data=await res.json();
    const value=data?.responseData?.translatedText;
    if(!value || /NO QUERY|MYMEMORY WARNING/i.test(String(value))) throw new Error("Fast translation service returned no translation.");
    return restore(value,tokens);
  }finally{clearTimeout(timer);}
}
async function remoteTranslate(text,src,tgt,onProgress){
  const parts=[];
  for(let i=0;i<text.length;i+=MAX_REMOTE_CHARS){
    parts.push(await remoteTranslateChunk(text.slice(i,i+MAX_REMOTE_CHARS),src,tgt,onProgress));
    onProgress?.(rt("progress")+Math.min(i+MAX_REMOTE_CHARS,text.length)+"/"+text.length);
  }
  return parts.join("");
}

const translators=new Map(),loadings=new Map();
async function getTranslator(src,tgt,onProgress){
  const key=src+">"+tgt;
  if(translators.has(key)) return translators.get(key);
  if(loadings.has(key)) return loadings.get(key);
  const model=PAIR_MODELS[key]||FALLBACK_MODEL;
  const loading=(async()=>{
    // R4kSo1997 exports INT8 Marian ONNX files, not q4f16 WebGPU weights.
    // Force WASM q8 for these specialized models; otherwise Chromium can surface
    // the misleading generic "Failed to fetch" when a q4 variant is requested.
    const specialized = model !== FALLBACK_MODEL;
    const device = specialized ? "wasm" : (navigator.gpu ? "webgpu" : "wasm");
    const dtype = specialized ? "q8" : (device === "webgpu" ? "q4f16" : "q8");
    onProgress?.(rt("loading"));
    const options={device,dtype,progress_callback:p=>{
      if(p?.status==="progress"&&Number.isFinite(p.progress)) onProgress?.(rt("download")+Math.round(p.progress)+"%");
      else if(p?.status==="ready") onProgress?.(rt("preparing"));
    }};
    try{
      const pipe=await pipeline("translation",model,options);
      translators.set(key,pipe); return pipe;
    }catch(error){
      if(specialized){
        onProgress?.(rt("specialized"));
        try{
          const fallbackDevice=navigator.gpu?"webgpu":"wasm";
          const fallbackDtype=fallbackDevice==="webgpu"?"q4f16":"q8";
          const pipe=await pipeline("translation",FALLBACK_MODEL,{device:fallbackDevice,dtype:fallbackDtype,progress_callback:options.progress_callback});
          translators.set(key,pipe); return pipe;
        }catch(fallbackError){
          throw new Error("Local translation engine could not load. Specialized: "+(error?.message||error)+" | NLLB: "+(fallbackError?.message||fallbackError));
        }
      }
      throw error;
    }  })();
  loadings.set(key,loading);
  try{return await loading;}finally{loadings.delete(key);}
}
async function localTranslateChunk(text,src,tgt,pipe,onProgress){
  if(!text.trim()||src===tgt) return text;
  const localPipe=pipe||await getTranslator(src,tgt,onProgress);
  const {marked,tokens}=protectedParts(text);
  const result=await localPipe(marked,{src_lang:LANG[src],tgt_lang:LANG[tgt],max_new_tokens:512});
  const value=Array.isArray(result)?result[0]?.translation_text??"":result?.translation_text??"";
  if(!value) throw new Error("Local translation engine returned no text.");
  return restore(value,tokens);
}
async function translateChunk(text,src,tgt,pipe,onProgress){
  try{
    return await remoteTranslate(text,src,tgt,onProgress);
  }catch(error){
    onProgress?.(rt("fallback"));
    return localTranslateChunk(text,src,tgt,pipe,onProgress);
  }
}
async function translateText(text,{sourceLanguage="auto",targetLanguage="ur",skillId,onProgress}={}){
  const input=cleanText(text);
  const src=sourceLanguage==="auto"?detectSourceLanguage(input):sourceLanguage;
  if(!LANG[targetLanguage]) throw new Error(rt("unsupported")+targetLanguage);
  const memory=window.SaifLocalizationMemory;
  const detailed=memory?.lookupDetailed?.(input,src,targetLanguage,skillId)||null;
  if(detailed?.type==="exact" || detailed?.auto){
    onProgress?.(detailed.type==="exact"?"Translation Memory exact match used.":"High-confidence Translation Memory match used.");
    return memory.applyTerms(detailed.target,src,targetLanguage,skillId);
  }
  memory?.renderSuggestion?.(input,src,targetLanguage,skillId);
  if(!LANG[src]) throw new Error(rt("sourceUnsupported")+sourceLanguage);
  if(src===targetLanguage) return enforceTerminology(input,skillId,targetLanguage);
  const out=[];
  const paragraphs=input.split(/(?<=\n)/);
  for(let i=0;i<paragraphs.length;i++){
    const p=paragraphs[i];
    if(!p.trim()){out.push(p);continue;}
    const nl=p.endsWith("\n")?"\n":"";
    const body=p.slice(0,nl?-1:undefined);
    const translated=await translateChunk(body,src,targetLanguage,null,onProgress);
    out.push(enforceTerminology(memory?.applyTerms?.(translated,src,targetLanguage,skillId)||translated,skillId,targetLanguage)+nl);
    onProgress?.(rt("translating")+(i+1)+"/"+paragraphs.length);
  }
  return out.join("");
}
function isTextCell(v){return typeof v==="string"&&v.trim()&&!v.startsWith("=");}
async function localizeWorkbook(file,{sourceLanguage="auto",targetLanguage="ur",skillId,onProgress}={}){
  const memory=window.SaifLocalizationMemory;
  if(!window.XLSX) throw new Error("Spreadsheet engine is not loaded.");
  const wb=XLSX.read(await file.arrayBuffer(),{type:"array",cellFormula:false});
  for(const wsName of wb.SheetNames){
    const ws=wb.Sheets[wsName],range=XLSX.utils.decode_range(ws["!ref"]||"A1:A1");
    let total=0;
    for(let r=range.s.r;r<=range.e.r;r++)for(let c=range.s.c;c<=range.e.c;c++){const cell=ws[XLSX.utils.encode_cell({r,c})];if(cell&&isTextCell(cell.v))total++;}
    let done=0;
    for(let r=range.s.r;r<=range.e.r;r++)for(let c=range.s.c;c<=range.e.c;c++){
      const cell=ws[XLSX.utils.encode_cell({r,c})]; if(!cell||!isTextCell(cell.v))continue;
      const src=sourceLanguage==="auto"?detectSourceLanguage(cell.v):sourceLanguage;
      const detailed=memory?.lookupDetailed?.(String(cell.v),src,targetLanguage,skillId)||null;
      const translated=detailed?.type==="exact"||detailed?.auto?detailed.target:await translateChunk(String(cell.v),src,targetLanguage,null,onProgress);
      cell.v=enforceTerminology(memory?.applyTerms?.(translated,src,targetLanguage,skillId)||translated,skillId,targetLanguage); cell.t="s";
      onProgress?.("Translating "+wsName+" "+(++done)+"/"+total);
    }
  }
  const ext=file.name.toLowerCase().endsWith(".csv")?"csv":"xlsx";
  const type=ext==="csv"?"text/csv":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const bytes=XLSX.write(wb,{bookType:ext,type:"array",compression:true});
  return {blob:new Blob([bytes],{type}),name:file.name.replace(/\.[^.]+$/,"")+"_localized."+ext,preview:null};
}
async function localizeFile(file,opts={}){
  const name=file.name.toLowerCase(),target=opts.targetLanguage||"ur";
  if(name.endsWith(".txt")||name.endsWith(".json")||name.endsWith(".xml")||name.endsWith(".xliff")){
    const source=cleanText(await file.text());
    const translated=await translateText(source,{...opts,targetLanguage:target});
    const qa=qaText(source,translated);
    window.SaifLocalizationMemory?.recordQA?.(source,translated,qa,{sourceLanguage:opts.sourceLanguage||"auto",targetLanguage:target,skillId:opts.skillId||""});
    return {
      blob:new Blob([translated],{type:name.endsWith(".json")?"application/json":name.endsWith(".xml")||name.endsWith(".xliff")?"application/xml":"text/plain"}),
      name:file.name.replace(/\.[^.]+$/,"")+"_localized"+file.name.slice(file.name.lastIndexOf(".")),
      preview:translated,qa
    };
  }
  if(name.endsWith(".csv")||name.endsWith(".xlsx"))return localizeWorkbook(file,opts);
  throw new Error("Supported formats: TXT, CSV, XLSX, JSON, XML and XLIFF. DOCX/PDF require extraction first.");
}
window.SaifLocalizer={version:RUNTIME_VERSION,translateText,localizeFile,engine:"fast-online-with-private-local-fallback"};