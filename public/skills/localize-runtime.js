/* Saif AI Skills — browser-local translation engine
 * GitHub Pages compatible: no API key, no server.
 * Uses Transformers.js + NLLB-200 in-browser with WebGPU/WASM fallback.
 */
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0";

env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL = "Xenova/nllb-200-distilled-600M";
const LANG = { ur:"urd_Arab", ar:"arb_Arab", en:"eng_Latn", fa:"pes_Arab" };\nfunction detectSourceLanguage(text){ const t=String(text||""); if(/[ٹڈڑںےہھچژگپکڑ]/u.test(t)) return "ur"; if(/[پچژگ]/u.test(t) && !/[ٹڈڑںے]/u.test(t)) return "fa"; if(/[ؠ-ۿ]/u.test(t)) return "ar"; return "en"; }\nconst TERMINOLOGY={\n  "pubg-urdu-lqa":{"Official":"آفیشل","Esports":"ای سپورٹس","Hidden Leaf Center":"پوشیدہ پتّا سینٹر","Valley of the End":"اختتام کی وادی","Brainrot":"برین راٹ","Creation Mode":"تخلیق موڈ","Creator":"کریئٹر","Creation":"کریئیشن","World of Wonder (WOW)":"ورلڈ آف ونڈر (WOW)","Creation Shop":"کریئیشن شاپ"},\n  "arabic-urdu-localization":{"ترجمة":"ترجمہ","مترجم":"مترجم","لغة":"زبان","لغات":"زبانیں","نص":"متن","محتوى":"مواد","مصطلحات":"اصطلاحات","وزارة":"وزارت","حكومة":"حکومت","قرار":"فیصلہ","قانون":"قانون","محكمة":"عدالت","حكم":"فیصلہ","دعوى":"دعویٰ"}\n};\nfunction enforceTerminology(text,skillId,targetLanguage){ if(targetLanguage!=="ur") return text; let out=String(text); for(const [from,to] of Object.entries(TERMINOLOGY[skillId]||{})) out=out.split(from).join(to); return out; }\nfunction tokenCounts(text){ const tags=String(text).match(/<[^>]+>/g)||[],ph=String(text).match(/\\{[^{}]+\\}|\\$\\{[^{}]+\\}|%(?:\\d+\\$)?[sdif]|%%/g)||[]; const count=a=>a.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{}); return {tags:count(tags),placeholders:count(ph),linebreaks:(String(text).match(/\\n/g)||[]).length}; }\nfunction sameCounts(a,b){ const ka=Object.keys(a),kb=Object.keys(b); return ka.length===kb.length&&ka.every(k=>a[k]===b[k]); }\nfunction qaText(source,target){ const a=tokenCounts(source),b=tokenCounts(target),findings=[]; if(!sameCounts(a.tags,b.tags)) findings.push({severity:"critical",code:"TAG_MISMATCH",issue:"XML/HTML tags changed during localization."}); if(!sameCounts(a.placeholders,b.placeholders)) findings.push({severity:"critical",code:"PLACEHOLDER_MISMATCH",issue:"Placeholders changed during localization."}); if(a.linebreaks!==b.linebreaks) findings.push({severity:"major",code:"LINEBREAK_MISMATCH",issue:"Line-break count changed during localization."}); return findings; }
let translator = null;
let loading = null;

function cleanText(s){ return String(s ?? "").replace(/\r\n/g,"\n").replace(/\r/g,"\n"); }
function protectedParts(text){
  const tokens=[];
  const marked=cleanText(text).replace(/<[^>]+>|\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%/g,m=>{
    const id="\uE000"+tokens.length+"\uE001";
    tokens.push([id,m]);
    return id;
  });
  return {marked,tokens};
}
function restore(text,tokens){
  let out=String(text);
  for(const [id,value] of tokens) out=out.split(id).join(value);
  return out;
}
async function getTranslator(onProgress){
  if(translator) return translator;
  if(loading) return loading;
  loading=(async()=>{
    const device = navigator.gpu ? "webgpu" : "wasm";
    onProgress?.("Loading browser translation model ("+device+")…");
    translator=await pipeline("translation",MODEL,{
      device,
      dtype: device==="webgpu" ? "q4" : "q8",
      progress_callback:p=>{
        if(p?.status==="progress" && Number.isFinite(p.progress))
          onProgress?.("Loading translation model… "+Math.round(p.progress)+"%");
      }
    });
    return translator;
  })();
  try{return await loading;}finally{loading=null;}
}
async function translateChunk(text,src,tgt,pipe){
  const s=String(text);
  if(!s.trim() || src===tgt) return s;
  const {marked,tokens}=protectedParts(s);
  const result=await pipe(marked,{src_lang:LANG[src],tgt_lang:LANG[tgt],max_new_tokens:512});
  const value=Array.isArray(result)?result[0]?.translation_text ?? "":result?.translation_text ?? "";
  return restore(value,tokens);
}
async function translateText(text,{sourceLanguage="auto",targetLanguage="ur",skillId,onProgress}={}){
  const src=sourceLanguage==="auto" ? detectSourceLanguage(text) : sourceLanguage;
  if(!LANG[targetLanguage]) throw new Error("Unsupported target language: "+targetLanguage);
  if(!LANG[src]) throw new Error("Unsupported source language: "+sourceLanguage);
  if(src===targetLanguage) return cleanText(text);
  const pipe=await getTranslator(onProgress);
  const input=cleanText(text);
  const paragraphs=input.split(/(?<=\n)/);
  const out=[];
  for(let i=0;i<paragraphs.length;i++){
    const p=paragraphs[i];
    if(!p.trim()){out.push(p);continue;}
    const nl=p.endsWith("\n")?"\n":"";
    const body=p.slice(0,nl? -1:undefined);
    out.push(enforceTerminology(await translateChunk(body,src,targetLanguage,pipe),skillId,targetLanguage)+nl);
    onProgress?.("Translating "+(i+1)+"/"+paragraphs.length);
  }
  return out.join("");
}
function isTextCell(v){return typeof v==="string" && v.trim() && !v.startsWith("=");}
async function localizeWorkbook(file,{sourceLanguage="auto",targetLanguage="ur",skillId,onProgress}={}){
  if(!window.XLSX) throw new Error("Spreadsheet engine is not loaded.");
  const data=await file.arrayBuffer();
  const wb=XLSX.read(data,{type:"array",cellFormula:false});
  const pipe=await getTranslator(onProgress);
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
      cell.v=enforceTerminology(await translateChunk(cell.v,sourceLanguage==="auto"?detectSourceLanguage(cell.v):sourceLanguage,targetLanguage,pipe),skillId,targetLanguage);
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
    const translated=await translateText(source,{...opts,targetLanguage:target});\n    const qa=qaText(source,translated);
    const type=name.endsWith(".json")?"application/json":name.endsWith(".xml")||name.endsWith(".xliff")?"application/xml":"text/plain";
    return {blob:new Blob([translated],{type}),name:file.name.replace(/\.[^.]+$/,"")+"_localized"+file.name.slice(file.name.lastIndexOf(".")),preview:translated};
  }
  if(name.endsWith(".csv")||name.endsWith(".xlsx")) return localizeWorkbook(file,opts);
  throw new Error("Supported browser localization formats: TXT, CSV, XLSX, JSON, XML and XLIFF. DOCX/PDF require an extraction step first.");
}
window.SaifLocalizer={version:"1.0.0-browser",translateText,localizeFile};
