/* Saif AI Skills — browser-local translation engine
 * GitHub Pages compatible: no API key, no server.
 * Uses Transformers.js + NLLB-200 in-browser with WebGPU/WASM fallback.
 */
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";

env.allowLocalModels = false;
env.useBrowserCache = true;

const FALLBACK_MODEL = "Xenova/nllb-200-distilled-600M";
const PAIR_MODELS = {"en>ur":"R4kSo1997/opus-mt-en-ur-onnx-int8","ur>en":"R4kSo1997/opus-mt-ur-en-onnx-int8","ar>en":"Xenova/opus-mt-ar-en","en>ar":"Xenova/opus-mt-en-ar"};
const LANG = { ur:"urd_Arab", ar:"arb_Arab", en:"eng_Latn", fa:"pes_Arab" };
function detectSourceLanguage(text){
  const t=String(text||"");
  if(/[ٹڈڑںےہھچژگپکڑ]/u.test(t)) return "ur";
  if(/[پچژگ]/u.test(t) && !/[ٹڈڑںے]/u.test(t)) return "fa";
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
function tokenCounts(text){
  const tags=String(text).match(/<[^>]+>/g)||[];
  const ph=String(text).match(/\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%/g)||[];
  const count=a=>a.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
  return {tags:count(tags),placeholders:count(ph),linebreaks:(String(text).match(/\n/g)||[]).length};
}
function sameCounts(a,b){const ka=Object.keys(a),kb=Object.keys(b);return ka.length===kb.length&&ka.every(k=>a[k]===b[k]);}
function qaText(source,target){
  const a=tokenCounts(source),b=tokenCounts(target),findings=[];
  if(!sameCounts(a.tags,b.tags)) findings.push({severity:"critical",code:"TAG_MISMATCH",issue:"XML/HTML tags changed during localization."});
  if(!sameCounts(a.placeholders,b.placeholders)) findings.push({severity:"critical",code:"PLACEHOLDER_MISMATCH",issue:"Placeholders changed during localization."});
  if(a.linebreaks!==b.linebreaks) findings.push({severity:"major",code:"LINEBREAK_MISMATCH",issue:"Line-break count changed during localization."});
  return findings;
}
const translators = new Map();
const loadings = new Map();
async function getTranslator(src,tgt,onProgress){
  const key=src+">"+tgt;
  if(translators.has(key)) return translators.get(key);
  if(loadings.has(key)) return loadings.get(key);
  const model=PAIR_MODELS[key]||FALLBACK_MODEL;
  const loading=(async()=>{
    const device=navigator.gpu?"webgpu":"wasm";
    const dtype=device==="webgpu"?"q4f16":"q8";
    onProgress?.("Loading "+(PAIR_MODELS[key]?"specialized":"fallback")+" translation engine ("+device+")…");
    const options={device,dtype,progress_callback:p=>{
      if(p?.status==="progress"&&Number.isFinite(p.progress)) onProgress?.("Downloading translation engine… "+Math.round(p.progress)+"%");
      else if(p?.status==="ready") onProgress?.("Preparing translation engine…");
    }};
    try{
      const pipe=await pipeline("translation",model,options);
      translators.set(key,pipe); return pipe;
    }catch(error){
      if(device==="webgpu"&&dtype==="q4f16"){
        try{
          const pipe=await pipeline("translation",model,{...options,dtype:"q4"});
          translators.set(key,pipe); return pipe;
        }catch(_){}
      }
      if(model!==FALLBACK_MODEL){
        onProgress?.("Specialized model unavailable; using NLLB fallback…");
        const pipe=await pipeline("translation",FALLBACK_MODEL,{device,dtype:device==="webgpu"?"q4f16":"q8",progress_callback:options.progress_callback});
        translators.set(key,pipe); return pipe;
      }
      throw error;
    }
  })();
  loadings.set(key,loading);
  try{return await loading;}finally{loadings.delete(key);}
}
async function translateChunk(text,src,tgt,pipe,onProgress){
  const s=String(text);
  if(!s.trim()||src===tgt) return s;
  const localPipe=pipe||await getTranslator(src,tgt,onProgress);
  const {marked,tokens}=protectedParts(s);
  const result=await localPipe(marked,{src_lang:LANG[src],tgt_lang:LANG[tgt],max_new_tokens:512});
  const value=Array.isArray(result)?result[0]?.translation_text??"":result?.translation_text??"";
  return restore(value,tokens);
}
async function translateText(text,{sourceLanguage="auto",targetLanguage="ur",skillId,onProgress}={}){
  const src=sourceLanguage==="auto" ? detectSourceLanguage(text) : sourceLanguage;
  if(!LANG[targetLanguage]) throw new Error("Unsupported target language: "+targetLanguage);
  if(!LANG[src]) throw new Error("Unsupported source language: "+sourceLanguage);
  if(src===targetLanguage) return cleanText(text);
  const pipe=await getTranslator(src,targetLanguage,onProgress);
  const input=cleanText(text);
  const paragraphs=input.split(/(?<=\n)/);
  const out=[];
  for(let i=0;i<paragraphs.length;i++){
    const p=paragraphs[i];
    if(!p.trim()){out.push(p);continue;}
    const nl=p.endsWith("\n")?"\n":"";
    const body=p.slice(0,nl? -1:undefined);
    out.push(enforceTerminology(await translateChunk(body,src,targetLanguage,pipe,onProgress),skillId,targetLanguage)+nl);
    onProgress?.("Translating "+(i+1)+"/"+paragraphs.length);
  }
  return out.join("");
}
function isTextCell(v){return typeof v==="string" && v.trim() && !v.startsWith("=");}
async function localizeWorkbook(file,{sourceLanguage="auto",targetLanguage="ur",skillId,onProgress}={}){
  if(!window.XLSX) throw new Error("Spreadsheet engine is not loaded.");
  const data=await file.arrayBuffer();
  const wb=XLSX.read(data,{type:"array",cellFormula:false});
  const firstSrc=sourceLanguage==="auto"?null:sourceLanguage;
  const pipe=firstSrc&&firstSrc!==targetLanguage?await getTranslator(firstSrc,targetLanguage,onProgress):null;
  for(const wsName of wb.SheetNames){
    const ws=wb.Sheets[wsName];
    const range=XLSX.utils.decode_range(ws["!ref"]||"A1:A1");
    let total=0;
    for(let r=range.s.r;r<=range.e.r;r++) for(let c=range.s.c;c<=range.e.c;c++){
      const addr=XLSX.utils.encode_cell({r,c}),cell=ws[addr];
      if(cell && isTextCell(cell.v)) total++;
    }
    let done=0;
    for(let r=range.s.r;r<=range.e.r;r++) for(let c=range.s.c;c<=range.e.c;c++){
      const addr=XLSX.utils.encode_cell({r,c}),cell=ws[addr];
      if(!cell || !isTextCell(cell.v)) continue;
      cell.v=enforceTerminology(await translateChunk(cell.v,sourceLanguage==="auto"?detectSourceLanguage(cell.v):sourceLanguage,targetLanguage,pipe,onProgress),skillId,targetLanguage);
      cell.t="s"; done++;
      onProgress?.("Translating "+wsName+" "+done+"/"+total);
    }
  }
  const ext=file.name.toLowerCase().endsWith(".csv")?"csv":"xlsx";
  const type=ext==="csv"?"text/csv":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const bytes=XLSX.write(wb,{bookType:ext,type:"array",compression:true});
  return {blob:new Blob([bytes],{type}),name:file.name.replace(/\.[^.]+$/,"")+"_localized."+ext,preview:null};
}
async function localizeFile(file,opts={}){
  const name=file.name.toLowerCase();
  const target=opts.targetLanguage||"ur";
  if(name.endsWith(".txt")||name.endsWith(".json")||name.endsWith(".xml")||name.endsWith(".xliff")){
    const source=await file.text();
    const translated=await translateText(source,{...opts,targetLanguage:target});
    const qa=qaText(source,translated);
    const type=name.endsWith(".json")?"application/json":name.endsWith(".xml")||name.endsWith(".xliff")?"application/xml":"text/plain";
    return {blob:new Blob([translated],{type}),name:file.name.replace(/\.[^.]+$/,"")+"_localized"+file.name.slice(file.name.lastIndexOf(".")),preview:translated};
  }
  if(name.endsWith(".csv")||name.endsWith(".xlsx")) return localizeWorkbook(file,opts);
  throw new Error("Supported browser localization formats: TXT, CSV, XLSX, JSON, XML and XLIFF. DOCX/PDF require an extraction step first.");
}
window.SaifLocalizer={version:"2.1.0-specialized-pairs",translateText,localizeFile,engine:"specialized-pair-models-with-nllb-fallback"};
