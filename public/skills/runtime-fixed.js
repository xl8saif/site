/* Saif AI Skills — GitHub Pages browser runtime */
(function () {
  "use strict";
  const PROFILES = {
    agents:[
      {id:"localization-agent",skills:["multilingual-translation-mtpe","arabic-urdu-localization"]},
      {id:"pubg-urdu-lqa-agent",skills:["pubg-urdu-lqa","multilingual-translation-mtpe"]},
      {id:"legal-translation-agent",skills:["legal-translation-qa","arabic-urdu-localization","multilingual-translation-mtpe"]},
      {id:"indus-kohistani-research-agent",skills:["indus-kohistani-research","multilingual-translation-mtpe"]},
      {id:"qa-gate-agent",skills:["pubg-urdu-lqa","arabic-urdu-localization","multilingual-translation-mtpe","legal-translation-qa","indus-kohistani-research"],mode:"validation-only"}
    ],
    routing:[
      {id:"pubg-urdu-lqa",priority:100,agent:"pubg-urdu-lqa-agent",keywords:["pubg","pubg mobile","wow","world of wonder","urdu lqa","live-ops","live ops","mission card","wow tokens","creation mode","کریئٹر","کریئیشن","ورلڈ آف ونڈر","ای سپورٹس"]},
      {id:"legal-translation",priority:90,agent:"legal-translation-agent",keywords:["legal translation","legal qa","legal document","contract","court","case law","lawsuit","judgment","clause","محكمة","قانون","دعوى","قضية","عقد","ترجمة قانونية","قانونی ترجمہ"]},
      {id:"indus-kohistani-research",priority:80,agent:"indus-kohistani-research-agent",keywords:["indus-kohistani","indus kohistani","mvy","dardic","duber","kandia","seo-patan","jijal-kayal","ranolia","bankad","common voice","corpus","language documentation","linguistic research","indus-kohistani research","انڈس کوہستانی","کوہستانی","لسانی تحقیق","کارپس"]},
      {id:"final-qa",priority:70,agent:"qa-gate-agent",keywords:["final qa","final validation","deterministic qa","structural qa","pre-delivery qa","delivery validation","release gate","qa gate"]},
      {id:"arabic-urdu",priority:60,agent:"localization-agent",keywords:["arabic to urdu","arabic-urdu","arabic urdu","عربی اردو","عربی سے اردو","localization","localisation","translation","translator","mtpe","terminology","multilingual translation"]}
    ],
    fallback:{agent:"localization-agent",confidence:"low"}
  };
  const SKILLS={
    "pubg-urdu-lqa":{tool:"scripts/check_lqa.py",inputs:["source","target"],refs:{
      terminology:{
        "Official":["آفیشل",["سرکاری"]],"Esports":["ای سپورٹس",[]],"Hidden Leaf Center":["پوشیدہ پتّا سینٹر",[]],
        "Valley of the End":["اختتام کی وادی",[]],"Brainrot":["برین راٹ",[]],"Creation Mode":["تخلیق موڈ",[]],
        "Creator":["کریئٹر",[]],"Creation":["کریئیشن",[]],"World of Wonder (WOW)":["ورلد آف ونڈر (WOW)",[]],
        "Creation Shop":["کریئیشن شاپ",[]],"Claim":["حاصل کریں",["وصول کریں"]],"Redeem":["وصول کریں",["ریڈیم کریں"]],
        "Equip":["استعمال کریں",["لیس کریں"]],"Loadout":["جنگی سیٹ اپ",["سامان"]],"Revive":["دوبارہ زندہ کریں",["زندہ کریں"]],
        "Knocked":["ناک آؤٹ ہوا",["گر گیا"]],"Finish":["حریف کا خاتمہ کریں",["ختم کریں"]],"Match Result":["مقابلے کا نتیجہ",["میچ کا نتیجہ"]],
        "Limited Time":["محدود مدت",["محدود وقت"]]
      },protected:["Discord","Mission Card","WOW Tokens"]}},
    "arabic-urdu-localization":{tool:"scripts/check_ar_ur.py",inputs:["source","target"],refs:{
      terminology:{"ترجمة":["ترجمہ",[]],"مترجم":["مترجم",[]],"مترجم فوري":["ترجمان",[]],"لغة":["زبان",[]],"لغات":["زبانیں",[]],"نص":["متن",[]],"محتوى":["مواد",[]],"مصطلحات":["اصطلاحات",[]],"وزارة":["وزارت",[]],"حكومة":["حکومت",[]],"قرار":["فیصلہ",[]],"قانون":["قانون",[]],"محكمة":["عدالت",[]],"حكم":["فیصلہ",[]],"دعوى":["دعویٰ",[]]},
      protected:["URL","HTML","XML","JSON","API","AI","OpenAI","ChatGPT"]}},
    "multilingual-translation-mtpe":{tool:"scripts/check_mtpe.py",inputs:["source","target"],refs:{terminology:{},protected:[]}},
    "legal-translation-qa":{tool:"scripts/check_legal.py",inputs:["source","target"],refs:{terminology:{},protected:[]},legal:true},
    "indus-kohistani-research":{tool:"scripts/check_research_data.py",inputs:["knowledge"],research:true}
  };
  const IK={identity:{name:"Indus-Kohistani",iso_639_3:"mvy",family:"Dardic"},orthography:{letters:["چھ","څ","ݜ","ڙ","ݨ"]}};
  function normalize(s){return String(s||"").replace(/\s+/g," ").toLocaleLowerCase().trim();}
  function escRx(s){return s.replace(/[|\\{}()[\]^$+*?.-]/g,"\\$&");}
  function route(task){
    if(!String(task||"").trim())throw new Error("task must be non-empty");
    const t=normalize(task),c=[];
    for(const rule of PROFILES.routing){
      const matches=[];
      for(const keyword of rule.keywords){
        const token=normalize(keyword);
        if(token&&new RegExp("(^|[^\\p{L}\\p{N}_])"+escRx(token)+"(?=$|[^\\p{L}\\p{N}_])","iu").test(t))matches.push(keyword);
      }
      const score=matches.reduce((n,x)=>n+Math.max(1,normalize(x).split(" ").length),0);
      if(score)c.push({priority:rule.priority,score,rule,matches});
    }
    if(!c.length){const a=PROFILES.agents.find(x=>x.id===PROFILES.fallback.agent);return{agent_id:a.id,skills:a.skills,confidence:"low",matched_rules:[],matched_keywords:[],reason:"fallback"};}
    c.sort((a,b)=>b.priority-a.priority||b.score-a.score);const x=c[0],a=PROFILES.agents.find(z=>z.id===x.rule.agent);
    return{agent_id:a.id,skills:a.skills,confidence:x.score>=4?"high":x.score>=2?"medium":"low",matched_rules:[x.rule.id],matched_keywords:x.matches,priority:x.priority,score:x.score};
  }
  function plan(task){
    const r=route(task),a=PROFILES.agents.find(x=>x.id===r.agent_id),selected=a.mode==="validation-only"?r.skills:r.skills.slice(0,1);
    return{task,agent_id:r.agent_id,confidence:r.confidence,matched_rule:(r.matched_rules||[])[0]||null,matched_keywords:r.matched_keywords||[],routing_score:r.score||0,mode:a.mode||"execution",selected_skills:selected.map(id=>({id,...SKILLS[id]})),available_skills:a.skills.map(id=>({id,...SKILLS[id]})),side_effects:"none"};
  }
  function counts(text){
    const tags=String(text).match(/<[^>]+>/g)||[],ph=String(text).match(/\{[^{}]+\}|\\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%/g)||[];
    const count=a=>a.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});return{tags:count(tags),placeholders:count(ph),linebreaks:(String(text).match(/\n/g)||[]).length};
  }
  function same(a,b){const ka=Object.keys(a),kb=Object.keys(b);return ka.length===kb.length&&ka.every(k=>a[k]===b[k]);}
  function f(code,severity,issue,suggested){const x={code,severity,issue};if(suggested)x.suggested_correction=suggested;return x;}
  function loc(source,target,refs){
    const sc=counts(source),tc=counts(target),out=[];
    if(!same(sc.tags,tc.tags))out.push(f("TAG_MISMATCH","critical","XML/HTML tags differ between source and target."));
    if(!same(sc.placeholders,tc.placeholders))out.push(f("PLACEHOLDER_MISMATCH","critical","Placeholders differ between source and target."));
    if(sc.linebreaks!==tc.linebreaks)out.push(f("LINEBREAK_MISMATCH","major","Line-break count differs: source="+sc.linebreaks+", target="+tc.linebreaks+"."));
    for(const term of refs.protected||[])if(source.includes(term)&&!target.includes(term))out.push(f("PROTECTED_TERM_CHANGED","major","Protected term '"+term+"' is missing or changed in the target.",term));
    for(const [term,rule] of Object.entries(refs.terminology||{})){const preferred=rule[0],rejected=rule[1]||[];if(source.includes(term)){if(!target.includes(preferred))out.push(f("TERMINOLOGY_MISSING","major","Preferred terminology for '"+term+"' is not present.",preferred));for(const bad of rejected)if(target.includes(bad))out.push(f("TERMINOLOGY_REJECTED","major","Rejected terminology '"+bad+"' used for '"+term+"'.",preferred));}}
    return out;
  }
  function locResult(sourceName,targetName,findings){const c=new Set(findings.map(x=>x.code));return{status:findings.length?"FAIL":"PASS",source:sourceName,target:targetName,findings,checks:{tags:c.has("TAG_MISMATCH")?"fail":"pass",placeholders:c.has("PLACEHOLDER_MISMATCH")?"fail":"pass",linebreaks:c.has("LINEBREAK_MISMATCH")?"fail":"pass",terminology:[...c].some(x=>x==="TERMINOLOGY_MISSING"||x==="TERMINOLOGY_REJECTED")?"fail":"pass",protected_terms:c.has("PROTECTED_TERM_CHANGED")?"fail":"pass"}};}
  function ids(s){return String(s).match(/\b(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d+)\b/g)||[];}
  function research(data){
    const bad=[],expected={name:"Indus-Kohistani",iso_639_3:"mvy",family:"Dardic"};
    for(const[k,v]of Object.entries(expected))if(data?.identity?.[k]!==v)bad.push("identity."+k+" mismatch");
    const letters=new Set(data?.orthography?.letters||[]);for(const x of IK.orthography.letters)if(!letters.has(x))bad.push("orthography inventory mismatch");
    if(!Array.isArray(data?.research_principles)||!data.research_principles.length)bad.push("research_principles missing");
    for(const k of ["clips","duration_hours","speakers","validated_clips","dataset_id","license"])if(!(k in(data?.common_voice_27||{})))bad.push("common_voice_27."+k+" missing");
    return bad;
  }
  async function execute(task,files){
    const p=plan(task),reports=[];
    for(const skill of p.selected_skills){
      const d=SKILLS[skill.id],missing=(d.inputs||[]).some(k=>!files[k]);
      if(missing){reports.push({status:p.mode==="validation-only"?"SKIP":"REVIEW",skill_id:skill.id,validator:d.tool,exit_code:null,result:null,stderr:p.mode==="validation-only"?"Validator skipped because its required input was not supplied for this QA pass.":"Required execution input is missing.",skipped:p.mode==="validation-only"});continue;}
      let findings=[],result=null;
      if(d.research){
        let data;try{data=JSON.parse(await files.knowledge.text());}catch(e){reports.push({status:"FAIL",skill_id:skill.id,validator:d.tool,exit_code:1,result:{findings:[f("RESEARCH_JSON_INVALID","critical","Research knowledge file is not valid JSON.")]},stderr:String(e)});continue;}
        findings=research(data).map(x=>f("RESEARCH_DATA_INTEGRITY","critical",x));result={status:findings.length?"FAIL":"PASS",findings};
      }else{
        const source=await files.source.text(),target=await files.target.text();findings=loc(source,target,d.refs||{});
        if(d.legal&&JSON.stringify(ids(source))!==JSON.stringify(ids(target)))findings.push(f("CONTROLLED_IDENTIFIER_MISMATCH","critical","Controlled numeric/date identifiers differ between source and target."));
        result=locResult(files.source.name,files.target.name,findings);if(d.legal)result.checks.controlled_identifiers=findings.some(x=>x.code==="CONTROLLED_IDENTIFIER_MISMATCH")?"fail":"pass";
      }
      reports.push({status:findings.length?"FAIL":"PASS",skill_id:skill.id,validator:d.tool,exit_code:findings.length?1:0,result,stderr:""});
    }
    const active=reports.filter(x=>x.status!=="SKIP"),overall=active.some(x=>x.status==="FAIL")?"FAIL":active.some(x=>x.status==="REVIEW")?"REVIEW":"PASS";
    return{status:overall,agent_id:p.agent_id,confidence:p.confidence,matched_rule:p.matched_rule,task,reports,side_effects:"none"};
  }
  async function run(task,files){
    const execution=await execute(task,files),findings=[];
    for(const r of execution.reports){const raw=r.result?.findings;if(Array.isArray(raw))for(const item of raw)if(item&&typeof item==="object")findings.push({...item,skill_id:r.skill_id,validator:r.validator,evidence:{skill_id:r.skill_id,validator:r.validator,deterministic_result:{...item}}});}
    if(execution.status==="FAIL"&&!findings.length)for(const r of execution.reports.filter(x=>x.status==="FAIL"))findings.push({severity:"query",code:"VALIDATOR_FAILED_WITHOUT_FINDINGS",issue:"Validator "+(r.validator||"unknown")+" returned FAIL without structured findings.",skill_id:r.skill_id,validator:r.validator});
    const summary={critical:findings.filter(x=>x.severity==="critical").length,major:findings.filter(x=>x.severity==="major").length,minor:findings.filter(x=>x.severity==="minor").length,query:findings.filter(x=>x.severity==="query").length};const unknown=findings.filter(x=>!["critical","major","minor","query"].includes(x.severity));if(unknown.length)summary.unknown=unknown.length;
    const status=execution.status==="FAIL"||summary.critical||summary.major?"FAIL":execution.status==="REVIEW"||unknown.length||summary.minor||summary.query?"REVIEW":"PASS";
    return{status,decision:status==="FAIL"?"BLOCK_DELIVERY":status==="REVIEW"?"HUMAN_REVIEW_REQUIRED":"READY_FOR_HUMAN_SIGNOFF",task,agent_id:execution.agent_id,confidence:execution.confidence,summary,findings,execution,human_signoff:status!=="FAIL",side_effects:"none",traceability:{router_rule:execution.matched_rule,agent:execution.agent_id,validators:execution.reports.map(x=>x.validator)}};
  }
  window.SaifSkillsBrowser={version:"1.18.0-browser",route,plan,run};
})();