const CHARGES=new Set(["unknown","potential","active","stable"]);
const t=(v,d="")=>typeof v==="string"?v:d;
const n=(v,d=0)=>Number.isFinite(v)?Number(v):d;
const a=v=>Array.isArray(v)?v:[];
const pos=(v,i)=>Object.freeze(v&&typeof v==="object"?{x:n(v.x),y:n(v.y),z:n(v.z)}:{x:(i%12)-6,y:Math.floor(i/12)-6,z:0});

export function normalizeWebGuiModel(value={}){
  const x=value&&typeof value==="object"?value:{},actor=x.actor&&typeof x.actor==="object"?x.actor:{},locus=x.locus&&typeof x.locus==="object"?x.locus:{},witness=x.witness&&typeof x.witness==="object"?x.witness:{};
  const entities=Object.freeze(a(x.entities).map((v,i)=>{const q=v&&typeof v==="object"?v:{},id=t(q.id,`entity-${i+1}`);return Object.freeze({id,name:t(q.name,id),kind:t(q.kind,"locus"),charge:CHARGES.has(q.charge)?q.charge:"unknown",position:pos(q.position,i),height:Math.max(.25,n(q.height,1)),detail:t(q.detail),witness:t(q.witness)})}));
  const ids=new Set(entities.map(v=>v.id));
  return Object.freeze({kind:"web-gui.world-projection",revision:t(x.revision,"unwitnessed"),title:t(x.title,"Witnessed world"),subtitle:t(x.subtitle,"A local perception, not the authoritative world."),
    actor:Object.freeze({id:t(actor.id,"anonymous"),name:t(actor.name,"Wanderer"),condition:t(actor.condition)}),
    locus:Object.freeze({id:t(locus.id,entities[0]?.id||"nowhere"),name:t(locus.name,"Unresolved locus"),description:t(locus.description)}),entities,
    paths:Object.freeze(a(x.paths).map(v=>({from:t(v?.from),to:t(v?.to),charge:CHARGES.has(v?.charge)?v.charge:"unknown"})).filter(v=>ids.has(v.from)&&ids.has(v.to))),
    actions:Object.freeze(a(x.actions).map((v,i)=>({id:t(v?.id,`action-${i+1}`),label:t(v?.label,`Action ${i+1}`),detail:t(v?.detail),command:t(v?.command,t(v?.id,`action-${i+1}`)),enabled:v?.enabled!==false,shortcut:t(v?.shortcut,String(i%9+1))}))),
    journal:Object.freeze(a(x.journal).map((v,i)=>({id:t(v?.id,`entry-${i+1}`),tone:["notice","success","refusal","contradiction"].includes(v?.tone)?v.tone:"notice",summary:t(v?.summary,"An unnamed witness arrived."),detail:t(v?.detail)}))),
    faculties:Object.freeze(a(x.faculties).map((v,i)=>({id:t(v?.id,`faculty-${i+1}`),name:t(v?.name,`Faculty ${i+1}`),level:Math.max(0,Math.min(100,n(v?.level))),voice:t(v?.voice),active:v?.active===true}))),
    contradictions:Object.freeze(a(x.contradictions).map((v,i)=>({id:t(v?.id,`contradiction-${i+1}`),summary:t(v?.summary,"Opposing witnesses are retained."),witnesses:Object.freeze(a(v?.witnesses).map(t).filter(Boolean)),retained:v?.retained!==false}))),
    witness:Object.freeze({status:["live","stale","refused","unwitnessed"].includes(witness.status)?witness.status:"unwitnessed",receipt:t(witness.receipt),observedAt:t(witness.observedAt)})});
}
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;7ç}­¢G§²ÚîÆ­yØ().catch(e=>root.dispatchEvent(new CustomEvent("web-gui:refusal",{detail:{message:e.message}})))})();
`;

const entry=v=>`<article class="entry" data-tone="${escapeHtml(v.tone)}"><strong>${escapeHtml(v.summary)}</strong>${v.detail?`<small>${escapeHtml(v.detail)}</small>`:""}</article>`;
const faculty=v=>`<div class="faculty" data-active="${v.active}"><strong>${escapeHtml(v.name)}</strong><span>${v.level}</span><span class="meter"><i style="width:${v.level}%"></i></span>${v.voice?`<em>${escapeHtml(v.voice)}</em>`:""}</div>`;
const action=v=>`<button class="action" type="button" data-action="${escapeHtml(v.command)}" ${v.enabled?"":"disabled"}><kbd>${escapeHtml(v.shortcut)}</kbd><strong>${escapeHtml(v.label)}</strong>${v.detail?`<small>${escapeHtml(v.detail)}</small>`:""}</button>`;

export function renderWebGuiDocument(value={},options={}){
 const m=normalizeWebGuiModel(value),source=t(options.source),endpoint=t(options.actionEndpoint);
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#07100f"><title>${escapeHtml(t(options.documentTitle,m.title))}</title><style>${WEB_GUI_MATERIAL_CSS}</style></head><body><main class="world" data-web-gui data-source="${escapeHtml(source)}" data-action-endpoint="${escapeHtml(endpoint)}"><canvas id="goo-world" aria-label="Isometric local projection of the witnessed world"></canvas><div class="hud"><header class="brand ceramic"><div class="eyebrow">Jianghu / witnessed material</div><h1>${escapeHtml(m.title)}</h1><p class="subtitle">${escapeHtml(m.subtitle)}</p></header><div class="witness ceramic" data-status="${m.witness.status}"><i class="dot"></i><strong>${m.witness.status}</strong><span class="code">${escapeHtml(m.witness.receipt||m.revision)}</span></div><section class="locus ceramic" data-locus data-charge="unknown"><div class="actor"><span>${escapeHtml(m.actor.name)}</span><span>${escapeHtml(m.actor.condition)}</span></div><div class="label">Focused locus</div><h2 data-locus-name>${escapeHtml(m.locus.name)}</h2><p data-locus-description>${escapeHtml(m.locus.description)}</p><span class="chip" data-locus-charge>unknown</span></section><aside class="right"><section class="scroll ceramic"><h2>Witness ledger</h2><div class="journal">${m.journal.map(entry).join("")||'<article class="entry"><strong>No local events.</strong></article>'}</div></section><section class="cabinet ceramic"><h2>Inner cabinet</h2>${m.faculties.map(faculty).join("")||'<div class="faculty"><strong>Quiet</strong><span>0</span></div>'}</section></aside></div><nav class="actions ceramic" aria-label="Available actions">${m.actions.map(action).join("")||'<button class="action" disabled><strong>No admitted move</strong></button>'}</nav><form class="utterance ceramic" data-utterance><label class="sr" for="utterance">Speak into this locus</label><input id="utterance" maxlength="4096" placeholder="Speak into the focused locusâ€¦"><button type="submit">Articulate</button></form><script id="web-gui-model" type="application/json">${safeJson(m)}</script><script>${WEB_GUI_CLIENT}</script></main></body></html>`;
}
