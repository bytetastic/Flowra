import React, { useState, useRef, useEffect, useCallback, useId } from "react";

const API_BASE = "http://localhost:9876/api";

// ─── CSS (Mesh Gradient + Glass + 5 Themes + Animations) ──────────────────
const CSS = `
  /* Fonts: System-Stack – kein Internet nötig */
  :root {
    --bg:#080a14; --bg-canvas:#0a0c17; --ink:#f2f5fc;
    --glass:rgba(255,255,255,0.035); --glass-strong:rgba(255,255,255,0.06); --glass-hover:rgba(255,255,255,0.10);
    --border:rgba(255,255,255,0.09); --border-strong:rgba(255,255,255,0.18); --blur:30px;
    --text:#eef1f9; --muted:#a3acc2; --faint:#646e88; --dim:#3a4156; --edge:#6e7894;
    --accent:#7c8dff; --accent-2:#38d6e6; --accent-soft:rgba(124,141,255,0.16); --accent-glow:rgba(124,141,255,0.55);
    --mesh-1:rgba(124,141,255,0.55); --mesh-2:rgba(56,214,230,0.40); --mesh-3:rgba(176,124,255,0.45); --mesh-4:rgba(63,214,176,0.32);
    --shadow:0 30px 70px rgba(0,0,0,0.55),0 6px 22px rgba(0,0,0,0.40); --shadow-pop:0 14px 40px rgba(0,0,0,0.45);
    --r-xl:22px; --r-lg:18px; --r-md:12px; --r-sm:9px;
    --c-ereignis:#5fd07a; --c-funktion:#5b93ff; --c-orgeinheit:#b07cff; --c-infoobjekt:#34cfe0; --c-dokument:#2fd6c0; --c-prozesspfad:#ff7a8a; --c-operator:#ffc24b;
    /* Legacy-Aliasse für bestehenden Code */
    --emerald:var(--accent); --rose:var(--c-prozesspfad); --violet:var(--c-orgeinheit); --blue:var(--c-infoobjekt); --teal:var(--c-dokument); --cyan:var(--c-prozesspfad); --amber:var(--c-operator);
  }
  [data-theme="nocturne"] {
    --bg:#0a0712; --bg-canvas:#0c0917; --accent:#b37bff; --accent-2:#ff5fa6; --accent-soft:rgba(179,123,255,0.18); --accent-glow:rgba(179,123,255,0.6);
    --mesh-1:rgba(157,93,255,0.55); --mesh-2:rgba(255,77,158,0.42); --mesh-3:rgba(86,120,255,0.42); --mesh-4:rgba(56,200,224,0.30);
    --c-ereignis:#4be3a0; --c-funktion:#6e8bff; --c-orgeinheit:#c77dff; --c-infoobjekt:#3ad6ff; --c-dokument:#2fe0c8; --c-prozesspfad:#ff5f9e; --c-operator:#ffce4a; --edge:#73688f;
  }
  [data-theme="graphite"] {
    --bg:#0b0b0d; --bg-canvas:#0d0d10; --glass:rgba(255,255,255,0.03); --glass-strong:rgba(255,255,255,0.055); --border:rgba(255,255,255,0.08);
    --text:#f0f1f4; --muted:#a0a3ad; --faint:#62656f; --accent:#c6f24e; --accent-2:#c6f24e; --accent-soft:rgba(198,242,78,0.16); --accent-glow:rgba(198,242,78,0.5);
    --mesh-1:rgba(255,255,255,0.07); --mesh-2:rgba(198,242,78,0.16); --mesh-3:rgba(255,255,255,0.05); --mesh-4:rgba(198,242,78,0.08); --edge:#6b6e78;
  }
  [data-theme="matte"] {
    --bg:#101118; --bg-canvas:#13141c; --ink:#eceef4; --glass:rgba(255,255,255,0.04); --glass-strong:rgba(255,255,255,0.055); --glass-hover:rgba(255,255,255,0.085);
    --border:rgba(255,255,255,0.08); --border-strong:rgba(255,255,255,0.15); --blur:24px; --text:#e7e9f0; --muted:#9aa0b2; --faint:#646a7c;
    --accent:#8b93bf; --accent-2:#8b93bf; --accent-soft:rgba(139,147,191,0.16); --accent-glow:rgba(139,147,191,0.32);
    --shadow:0 24px 56px rgba(0,0,0,0.5),0 5px 18px rgba(0,0,0,0.4);
    --c-ereignis:#84ad8b; --c-funktion:#7e9ec4; --c-orgeinheit:#a496c0; --c-infoobjekt:#79b0b9; --c-dokument:#7fb6a8; --c-prozesspfad:#c8929a; --c-operator:#cbb27e; --edge:#6d7283;
  }
  [data-theme="matte"] #mesh span { opacity:.42; mix-blend-mode:normal; filter:blur(120px); }
  [data-theme="matte"] #mesh .grain { opacity:.35; }
  [data-theme="bloom"] {
    --bg:#18171d; --bg-canvas:#1d1b24; --ink:#f6f5fa; --glass:rgba(255,255,255,0.045); --glass-strong:rgba(255,255,255,0.065); --glass-hover:rgba(255,255,255,0.10);
    --border:rgba(255,255,255,0.10); --border-strong:rgba(255,255,255,0.18); --blur:26px; --text:#f0eef4; --muted:#b1aab9; --faint:#756e80;
    --accent:#a3e0bd; --accent-2:#f4c4ac; --accent-soft:rgba(163,224,189,0.20); --accent-glow:rgba(163,224,189,0.38);
    --mesh-1:rgba(166,228,191,0.32); --mesh-2:rgba(246,196,172,0.30); --mesh-3:rgba(208,188,240,0.26); --mesh-4:rgba(247,223,160,0.24);
    --c-ereignis:#9fe3b3; --c-funktion:#aac6f0; --c-orgeinheit:#cdb8ef; --c-infoobjekt:#a6e2e0; --c-dokument:#a8e6c9; --c-prozesspfad:#f6b3a4; --c-operator:#f6dd9c; --edge:#837c8e;
  }
  [data-theme="bloom"] #mesh span { opacity:.6; mix-blend-mode:screen; filter:blur(105px); }
  * { box-sizing:border-box; }
  html,body { margin:0; padding:0; height:100%; }
  body { background:var(--bg); color:var(--text); font-family:system-ui,'Segoe UI',Inter,Arial,sans-serif; overflow:hidden; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; transition:background .5s ease; }
  ::selection { background:var(--accent-soft); }
  input { font-family:inherit; } input:focus { outline:none; }
  #mesh { position:fixed; inset:0; z-index:0; overflow:hidden; background:var(--bg); pointer-events:none; }
  #mesh span { position:absolute; border-radius:50%; filter:blur(90px); opacity:.85; will-change:transform; mix-blend-mode:screen; }
  #mesh .m1 { width:58vw; height:58vw; left:-10vw; top:-14vw; background:radial-gradient(circle at 35% 35%,var(--mesh-1),transparent 68%); animation:drift1 28s ease-in-out infinite; }
  #mesh .m2 { width:50vw; height:50vw; right:-12vw; top:4vh; background:radial-gradient(circle at 60% 40%,var(--mesh-2),transparent 68%); animation:drift2 34s ease-in-out infinite; }
  #mesh .m3 { width:54vw; height:54vw; left:22vw; bottom:-26vw; background:radial-gradient(circle at 50% 50%,var(--mesh-3),transparent 68%); animation:drift3 40s ease-in-out infinite; }
  #mesh .m4 { width:40vw; height:40vw; right:14vw; bottom:-10vw; background:radial-gradient(circle at 50% 50%,var(--mesh-4),transparent 70%); animation:drift1 46s ease-in-out infinite reverse; }
  #mesh .grain { position:absolute; inset:0; opacity:.5; background-image:radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px); background-size:3px 3px; mix-blend-mode:overlay; }
  #mesh .veil { position:absolute; inset:0; background:radial-gradient(130% 100% at 50% 38%,transparent 42%,rgba(0,0,0,0.5) 100%); }
  @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(9vw,7vh) scale(1.18)} 66%{transform:translate(-5vw,11vh) scale(.92)} }
  @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-10vw,9vh) scale(1.14)} 70%{transform:translate(6vw,-5vh) scale(.88)} }
  @keyframes drift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-8vw,-12vh) scale(1.22)} }
  .glass { background:var(--glass); backdrop-filter:blur(var(--blur)) saturate(1.6); -webkit-backdrop-filter:blur(var(--blur)) saturate(1.6); border:1px solid var(--border); box-shadow:var(--shadow), inset 0 1px 0 rgba(255,255,255,0.06); }
  .tbtn { background:var(--glass-strong); border:1px solid var(--border); color:var(--muted); border-radius:var(--r-sm); cursor:pointer; padding:8px 12px; font-size:13px; font-weight:600; font-family:inherit; display:inline-flex; align-items:center; justify-content:center; gap:7px; position:relative; transition:background .2s,color .2s,border-color .2s,transform .16s cubic-bezier(.34,1.56,.64,1),box-shadow .2s; }
  .tbtn svg { width:15px; height:15px; flex-shrink:0; }
  .tbtn:hover { background:var(--glass-hover); color:var(--text); border-color:var(--border-strong); transform:translateY(-2px); box-shadow:var(--shadow-pop); }
  .tbtn:active { transform:translateY(0) scale(.95); }
  .tbtn.accent { color:#fff; border-color:transparent; background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 20px var(--accent-glow); }
  .tbtn.accent:hover { box-shadow:0 10px 30px var(--accent-glow); }
  [data-theme="graphite"] .tbtn.accent { color:#0b0b0d; }
  [data-theme="bloom"] .tbtn.accent { color:#1d2a22; }
  .tbtn.danger { color:var(--c-prozesspfad); border-color:color-mix(in oklab,var(--c-prozesspfad) 35%,transparent); background:color-mix(in oklab,var(--c-prozesspfad) 12%,transparent); }
  .tbtn.danger:hover { background:color-mix(in oklab,var(--c-prozesspfad) 20%,transparent); color:#fff; }
  .zoom-group { display:flex; align-items:center; gap:2px; background:var(--glass-strong); border:1px solid var(--border); border-radius:var(--r-sm); padding:3px; }
  .zoom-group .tbtn { border:none; background:transparent; padding:6px 10px; box-shadow:none; }
  .zoom-group .tbtn:hover { background:var(--glass-hover); transform:none; }
  .zoom-label { font-family:'Consolas','Monaco','Courier New',monospace; font-size:12px; color:var(--muted); min-width:48px; text-align:center; font-weight:500; }
  .logo-mark { width:30px; height:30px; display:grid; place-items:center; filter:drop-shadow(0 2px 9px var(--accent-glow)); animation:logobreath 16s linear infinite; }
  .logo-mark svg { display:block; }
  @keyframes logobreath { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
  .logo-title { font-weight:700; font-size:17px; letter-spacing:.4px; }
  .name-chip { font-size:12.5px; color:var(--muted); cursor:pointer; padding:6px 11px; border-radius:var(--r-sm); border:1px solid transparent; transition:background .18s,border-color .18s,color .18s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:230px; }
  .name-chip:hover { background:var(--glass-strong); border-color:var(--border); color:var(--text); }
  .panel-title { font-size:10.5px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:var(--faint); margin:0 0 11px 6px; }
  .pal-item { cursor:grab; display:flex; align-items:center; gap:12px; padding:8px 10px; border-radius:var(--r-md); border:1px solid transparent; transition:background .22s,border-color .22s,transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .22s; margin-bottom:3px; position:relative; }
  .pal-item::before { content:""; position:absolute; left:0; top:16%; bottom:16%; width:3px; border-radius:3px; background:var(--pc); opacity:0; transform:scaleY(.3); transition:opacity .22s,transform .22s; }
  .pal-item:hover { background:var(--glass-strong); border-color:var(--border); transform:translateX(5px); box-shadow:var(--shadow-pop); }
  .pal-item:hover::before { opacity:1; transform:scaleY(1); }
  .pal-item:hover .pal-preview { filter:drop-shadow(0 0 7px var(--pc)); transform:scale(1.06); }
  .pal-item:active { cursor:grabbing; transform:translateX(5px) scale(.97); }
  .pal-preview { flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:filter .25s,transform .2s cubic-bezier(.34,1.56,.64,1); }
  [data-theme="matte"] .pal-item:hover .pal-preview { filter:none; }
  .canvas-shell { flex:1; border-radius:var(--r-xl); position:relative; overflow:hidden; background:radial-gradient(120% 90% at 50% 0%, color-mix(in oklab,var(--accent) 7%,transparent), transparent 55%), var(--bg-canvas); border:1px solid var(--border); box-shadow:var(--shadow), inset 0 1px 0 rgba(255,255,255,0.05); }
  .grid-dot { fill:var(--border); }
  .hint { position:absolute; bottom:14px; left:50%; transform:translateX(-50%); font-size:11.5px; color:var(--muted); background:color-mix(in oklab,var(--bg) 72%,transparent); padding:7px 16px; border-radius:22px; border:1px solid var(--border); backdrop-filter:blur(10px); box-shadow:var(--shadow-pop); white-space:nowrap; pointer-events:none; z-index:5; }
  .hint b { color:var(--text); font-weight:600; }
  .prop-input { width:100%; background:var(--glass-strong); border:1px solid var(--border); border-radius:var(--r-sm); color:var(--text); padding:9px 11px; font-size:13px; font-family:inherit; transition:border-color .2s,box-shadow .2s,background .2s; }
  .prop-input:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); background:var(--glass-hover); }
  input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:6px; background:var(--glass-hover); outline:none; cursor:pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent-2)); cursor:pointer; box-shadow:0 0 0 4px var(--accent-soft), 0 2px 8px rgba(0,0,0,.4); transition:transform .15s cubic-bezier(.34,1.56,.64,1); }
  input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.18); }
  input[type=range]::-moz-range-thumb { width:18px; height:18px; border:none; border-radius:50%; background:var(--accent); cursor:pointer; box-shadow:0 0 0 4px var(--accent-soft); }
  .toggle-track { width:42px; height:23px; border-radius:12px; background:var(--glass-hover); border:1px solid var(--border); position:relative; cursor:pointer; transition:background .25s,border-color .25s,box-shadow .25s; flex-shrink:0; }
  .toggle-track.on { background:linear-gradient(135deg,var(--accent),var(--accent-2)); border-color:transparent; box-shadow:0 0 14px var(--accent-glow); }
  [data-theme="matte"] .toggle-track.on { box-shadow:none; }
  .toggle-knob { width:17px; height:17px; border-radius:50%; background:#fff; position:absolute; top:2px; left:2px; box-shadow:0 2px 5px rgba(0,0,0,.4); transition:left .26s cubic-bezier(.34,1.56,.64,1); }
  .toggle-track.on .toggle-knob { left:21px; }
  .swatch { cursor:pointer; transition:transform .16s cubic-bezier(.34,1.56,.64,1),box-shadow .2s; }
  .swatch:hover { transform:scale(1.12) translateY(-1px); box-shadow:0 6px 16px rgba(0,0,0,.4); }
  .stat-card { background:var(--glass-strong); border:1px solid var(--border); border-radius:var(--r-md); padding:11px 13px; }
  .stat-row { display:flex; justify-content:space-between; align-items:center; font-size:12px; padding:3px 0; }
  .stat-label { color:var(--faint); } .stat-val { color:var(--text); font-weight:700; font-family:'Consolas','Monaco','Courier New',monospace; } .stat-val.ok { color:var(--accent); }
  .menu-item { transition:background .14s,color .14s; cursor:pointer; }
  .menu-item:hover { background:var(--glass-hover); color:var(--text) !important; }
  .theme-pick { border:1px solid var(--border); cursor:pointer; font-family:inherit; font-size:12px; font-weight:600; color:var(--muted); padding:8px 12px; border-radius:24px; background:var(--glass); display:flex; align-items:center; gap:8px; transition:color .2s,background .2s,border-color .2s,transform .15s cubic-bezier(.34,1.56,.64,1); }
  .theme-pick:hover { color:var(--text); transform:translateY(-1px); background:var(--glass-hover); }
  .theme-pick.on { color:var(--text); background:var(--glass-hover); border-color:var(--border-strong); box-shadow:0 0 0 2px var(--accent-soft); }
  .theme-pick .dot { width:9px; height:9px; border-radius:50%; box-shadow:0 0 8px currentColor; flex-shrink:0; }
  .sel-ring { animation:ringpulse 1.9s ease-in-out infinite; }
  @keyframes ringpulse { 0%,100%{opacity:.95} 50%{opacity:.4} }
  .dash-flow { stroke-dasharray:7 6; animation:dashmove .8s linear infinite; }
  @keyframes dashmove { to{stroke-dashoffset:-13} }
  .port-dot { cursor:crosshair; transition:r .14s cubic-bezier(.34,1.56,.64,1); }
  .pop-in { animation:popIn .42s cubic-bezier(.34,1.56,.64,1); }
  @keyframes popIn { 0%{opacity:0; transform:translateY(8px) scale(.96)} 100%{opacity:1; transform:translateY(0) scale(1)} }
  .ob-fade{animation:obFade .8s ease both;} @keyframes obFade{from{opacity:0}to{opacity:1}}
  .ob-fly{animation:obFade .7s ease both;}
  .ob-pulse{animation:obPulse 2.4s ease-in-out infinite;} @keyframes obPulse{0%,100%{box-shadow:0 8px 30px var(--accent-glow)}50%{box-shadow:0 8px 46px var(--accent-glow)}}
  ::-webkit-scrollbar { width:9px; height:9px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--glass-hover); border-radius:9px; border:2px solid transparent; background-clip:content-box; }
  ::-webkit-scrollbar-thumb:hover { background:var(--border-strong); background-clip:content-box; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; } }
`;

// ─── Constants & helpers ───────────────────────────────────────────────────
// ─── Theme-System (5 Themes mit FX-Parametern) ──────────────────────────────
const THEMES = {
  bloom: {
    id:"bloom", name:"Bloom", dot:"#a3e0bd", accent:"#a3e0bd", accent2:"#f4c4ac", ink:"#f6f5fa", danger:"#f6b3a4",
    bg:"#18171d", bgCanvas:"#1d1b24", edge:"#837c8e",
    fx:{ fill:0.22, strokeW:2.2, glow:5, glowAmt:0.45 },
    elements:{ ereignis:"#9fe3b3", funktion:"#aac6f0", organisationseinheit:"#cdb8ef", informationsobjekt:"#a6e2e0", dokument:"#3dd6b5", prozesspfad:"#f6b3a4", operator:"#f6dd9c" },
  },
  eclipse: {
    id:"eclipse", name:"Eclipse", dot:"#7c8dff", accent:"#7c8dff", accent2:"#38d6e6", ink:"#f2f5fc", danger:"#ff7a8a",
    bg:"#080a14", bgCanvas:"#0a0c17", edge:"#6e7894",
    fx:{ fill:0.14, strokeW:1.9, glow:6, glowAmt:0.55 },
    elements:{ ereignis:"#5fd07a", funktion:"#5b93ff", organisationseinheit:"#b07cff", informationsobjekt:"#34cfe0", dokument:"#1fc8a8", prozesspfad:"#ff7a8a", operator:"#ffc24b" },
  },
  nocturne: {
    id:"nocturne", name:"Nocturne", dot:"#b37bff", accent:"#b37bff", accent2:"#ff5fa6", ink:"#f2f5fc", danger:"#ff5f9e",
    bg:"#0a0712", bgCanvas:"#0c0917", edge:"#73688f",
    fx:{ fill:0.14, strokeW:1.9, glow:7, glowAmt:0.6 },
    elements:{ ereignis:"#4be3a0", funktion:"#6e8bff", organisationseinheit:"#c77dff", informationsobjekt:"#3ad6ff", dokument:"#2fe0c8", prozesspfad:"#ff5f9e", operator:"#ffce4a" },
  },
  graphite: {
    id:"graphite", name:"Graphite", dot:"#c6f24e", accent:"#c6f24e", accent2:"#c6f24e", ink:"#f0f1f4", danger:"#ff7a8a",
    bg:"#0b0b0d", bgCanvas:"#0d0d10", edge:"#6b6e78",
    fx:{ fill:0.13, strokeW:1.9, glow:5, glowAmt:0.5 },
    elements:{ ereignis:"#5fd07a", funktion:"#5b93ff", organisationseinheit:"#b07cff", informationsobjekt:"#34cfe0", dokument:"#1fc8a8", prozesspfad:"#ff7a8a", operator:"#ffc24b" },
  },
  matte: {
    id:"matte", name:"Matte", dot:"#8b93bf", accent:"#8b93bf", accent2:"#8b93bf", ink:"#eceef4", danger:"#c8929a",
    bg:"#101118", bgCanvas:"#13141c", edge:"#6d7283",
    fx:{ fill:0.17, strokeW:2.0, glow:0, glowAmt:0 },
    elements:{ ereignis:"#84ad8b", funktion:"#7e9ec4", organisationseinheit:"#a496c0", informationsobjekt:"#79b0b9", dokument:"#5bbfaa", prozesspfad:"#c8929a", operator:"#cbb27e" },
  },
};
const THEME_ORDER = ["bloom","eclipse","nocturne","graphite","matte"];
const DEFAULT_FX = { fill:0.22, strokeW:2.2, glow:5, glowAmt:0.45 };

function themeColors(themeId){
  const t = THEMES[themeId] || THEMES.bloom; const e = t.elements;
  return {
    ereignis:{accent:e.ereignis,text:t.ink}, funktion:{accent:e.funktion,text:t.ink},
    organisationseinheit:{accent:e.organisationseinheit,text:t.ink}, informationsobjekt:{accent:e.informationsobjekt,text:t.ink},
    dokument:{accent:e.dokument,text:t.ink}, prozesspfad:{accent:e.prozesspfad,text:t.ink},
    operator_and:{accent:e.operator,text:t.ink}, operator_or:{accent:e.operator,text:t.ink}, operator_xor:{accent:e.operator,text:t.ink},
  };
}
function loadTheme(){ try{ const t=localStorage.getItem("flowra-theme"); if(t&&THEMES[t]) return t; }catch(e){} return "bloom"; }
function persistTheme(id){ if(id==="eclipse")document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme",id); try{localStorage.setItem("flowra-theme",id);}catch(e){} }

const DEFAULT_COLORS = themeColors("bloom");
const NODE_W=140, NODE_H=64, PADDING=60, GRID=5;
const FONT="system-ui,'Segoe UI',Inter,Arial,sans-serif";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rgba=(hex,a)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;};

// ─── Trio Logo (Trifoil) ───────────────────────────────────────────────────
// Three petal-shaped leaves rotated 0/120/240° around center, gold radial gradient.
function TrioLogo({size=40, glow=true}){
  // FlowraMark: drei Petals mit theme-reaktivem Akzent-Gradient
  const gid=useId().replace(/:/g,"");
  const petal="M0 0 C 27 -15.12, 14.85 -36, 0 -36 C -14.85 -36, -27 -15.12, 0 0 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{display:"block",overflow:"visible"}}>
      <defs>
        <linearGradient id={`fm${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{stopColor:"var(--accent)"}}/>
          <stop offset="1" style={{stopColor:"var(--accent-2)"}}/>
        </linearGradient>
      </defs>
      <g transform="translate(50 50)">
        <path d={petal} transform="rotate(0)"   fill="none" stroke={`url(#fm${gid})`} strokeWidth="7" strokeLinejoin="round"/>
        <path d={petal} transform="rotate(120)" fill="none" stroke={`url(#fm${gid})`} strokeWidth="7" strokeLinejoin="round"/>
        <path d={petal} transform="rotate(240)" fill="none" stroke={`url(#fm${gid})`} strokeWidth="7" strokeLinejoin="round"/>
        <circle r="5" style={{fill:"var(--accent)"}}/>
      </g>
    </svg>
  );
}

// ─── Stroke-Icons (lucide-artig) ────────────────────────────────────────────
const ICON_PATHS={
  undo:<path d="M3 7v6h6M3 13a9 9 0 1 0 3-7.7L3 8"/>,
  redo:<path d="M21 7v6h-6M21 13a9 9 0 1 1-3-7.7L21 8"/>,
  settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  trash:<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>,
  download:<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>,
  plus:<path d="M12 5v14M5 12h14"/>, minus:<path d="M5 12h14"/>, close:<path d="M18 6 6 18M6 6l12 12"/>,
  chevDown:<path d="m6 9 6 6 6-6"/>, chevUp:<path d="m18 15-6-6-6 6"/>,
  save:<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8"/>,
  folder:<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>,
  palette:<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.012 17.5 2 12 2z"/></>,
};
function Icon({name,size=15,strokeWidth=2}){
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON_PATHS[name]}</svg>);
}



function getNodeSize(node){const isOp=node.type.startsWith("operator");return{w:node.w||(isOp?48:NODE_W),h:node.h||(isOp?48:NODE_H)};}

function getPortPoint(node,dir){
  const{w,h}=getNodeSize(node);
  const cx=node.x+w/2,cy=node.y+h/2;
  if(node.type.startsWith("operator")){
    const r=Math.min(w,h)/2-2;
    if(dir==="top")    return{x:cx,y:cy-r};
    if(dir==="bottom") return{x:cx,y:cy+r};
    if(dir==="left")   return{x:cx-r,y:cy};
    if(dir==="right")  return{x:cx+r,y:cy};
    return{x:cx,y:cy};
  }
  if(dir==="top")    return{x:cx,y:node.y};
  if(dir==="bottom") return{x:cx,y:node.y+h};
  if(dir==="left")   return{x:node.x,y:cy};
  if(dir==="right")  return{x:node.x+w,y:cy};
  return{x:cx,y:cy};
}

function getCircleEdge(node,toX,toY){
  const{w,h}=getNodeSize(node);
  const cx=node.x+w/2,cy=node.y+h/2;
  const r=Math.min(w,h)/2-2;
  const dx=toX-cx,dy=toY-cy,len=Math.sqrt(dx*dx+dy*dy)||1;
  return{x:cx+dx/len*r,y:cy+dy/len*r};
}

function getClosestPorts(a,b){
  const{w:aw,h:ah}=getNodeSize(a);
  const{w:bw,h:bh}=getNodeSize(b);
  const acx=a.x+aw/2,acy=a.y+ah/2;
  const bcx=b.x+bw/2,bcy=b.y+bh/2;
  const p1=a.type.startsWith("operator")?getCircleEdge(a,bcx,bcy):null;
  const p2=b.type.startsWith("operator")?getCircleEdge(b,acx,acy):null;
  if(p1&&p2)return{p1,p2};
  const dirs=["top","bottom","left","right"];
  let best=null,bestDist=Infinity;
  for(const d1 of dirs)for(const d2 of dirs){
    const pp1=getPortPoint(a,d1),pp2=getPortPoint(b,d2);
    const dist=Math.hypot(pp2.x-pp1.x,pp2.y-pp1.y);
    if(dist<bestDist){bestDist=dist;best={p1:pp1,p2:pp2};}
  }
  return best;
}


function getAllPorts(node){
  const{w,h}=getNodeSize(node);
  const cx=node.x+w/2,cy=node.y+h/2;
  if(node.type.startsWith("operator")){
    const r=Math.min(w,h)/2-2;
    return[
      {dir:"top",    x:cx,   y:cy-r},
      {dir:"bottom", x:cx,   y:cy+r},
      {dir:"left",   x:cx-r, y:cy},
      {dir:"right",  x:cx+r, y:cy},
    ];
  }
  return[
    {dir:"top",    x:cx,        y:node.y},
    {dir:"bottom", x:cx,        y:node.y+h},
    {dir:"left",   x:node.x,    y:cy},
    {dir:"right",  x:node.x+w,  y:cy},
  ];
}

function snapAngle(fromX,fromY,toX,toY){
  const dx=toX-fromX,dy=toY-fromY;
  const len=Math.sqrt(dx*dx+dy*dy);
  if(len<10)return{x:toX,y:toY};
  const angle=Math.atan2(dy,dx);
  const snap=Math.PI/4;
  const snapped=Math.round(angle/snap)*snap;
  const diff=Math.abs(angle-snapped);
  if(diff<0.18)return{x:fromX+Math.cos(snapped)*len,y:fromY+Math.sin(snapped)*len};
  return{x:toX,y:toY};
}

// ─── ShapeRenderer (transluzente Füllung + Glow, theme-FX-gesteuert) ───────
function ShapeRenderer({type,label,width=NODE_W,height=NODE_H,selected,dimmed,colors,preview,override,fx}){
  const F=fx||DEFAULT_FX;
  const base=(colors&&colors[type])||DEFAULT_COLORS[type]||{accent:"#aac6f0",text:"#f6f5fa"};
  const c=override?{...base,accent:override}:base;
  const accent=c.accent,txt=c.text;
  const gid=useId().replace(/:/g,"");
  const fillId=`f${gid}`,sheenId=`s${gid}`;
  const opacity=dimmed?0.28:1;
  const isOp=type.startsWith("operator");
  const fontSize=isOp?13:(label&&label.length>16?11:12.5);
  const baseShadow=`drop-shadow(0 2px 6px rgba(0,0,0,0.35))`;
  const glow=selected
    ?`drop-shadow(0 0 2px ${rgba(accent,0.75)}) drop-shadow(0 0 11px ${rgba(accent,0.4)})`
    :(F.glow>0?`${baseShadow} drop-shadow(0 0 ${F.glow}px ${rgba(accent,preview?F.glowAmt*0.55:F.glowAmt)})`:baseShadow);
  const fAmt=preview?F.fill*0.85:F.fill;
  const defs=(<defs>
    <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor={accent} stopOpacity={Math.min(0.55,fAmt*1.4)}/>
      <stop offset="100%" stopColor={accent} stopOpacity={fAmt*0.72}/>
    </linearGradient>
    <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.14"/>
      <stop offset="16%" stopColor="#ffffff" stopOpacity="0"/>
    </linearGradient>
  </defs>);
  const fill=`url(#${fillId})`;
  const strokeW=F.strokeW;
  const ss={filter:glow,opacity,transition:"filter .22s ease"};
  const lines=(label||"").split("\n");
  const lineH=fontSize*1.45;
  const textEl=lines.length<=1
    ?(<text x={width/2} y={height/2+fontSize*0.38} textAnchor="middle"
        fill={txt} fontSize={fontSize} fontWeight="600" fontFamily={FONT}
        style={{pointerEvents:"none",userSelect:"none",letterSpacing:"0.2px"}}>{label}</text>)
    :(()=>{
        const totalH=(lines.length-1)*lineH;
        const startY=height/2 - totalH/2 + fontSize*0.38;
        return(<text x={width/2} textAnchor="middle"
          fill={txt} fontSize={fontSize} fontWeight="600" fontFamily={FONT}
          style={{pointerEvents:"none",userSelect:"none",letterSpacing:"0.2px"}}>
          {lines.map((l,i)=><tspan key={i} x={width/2} y={startY+i*lineH}>{l}</tspan>)}
        </text>);
      })();
  const selRing=selected?(isOp
    ?<circle className="sel-ring" cx={width/2} cy={height/2} r={Math.min(width,height)/2+6}
        fill="none" strokeWidth={1.6} opacity={0.9} style={{stroke:"var(--accent)",filter:"drop-shadow(0 0 8px var(--accent-glow))"}}/>
    :<rect className="sel-ring" x={-7} y={-7} width={width+14} height={height+14}
        rx={16} fill="none" strokeWidth={1.6} opacity={0.9} style={{stroke:"var(--accent)",filter:"drop-shadow(0 0 8px var(--accent-glow))"}}/>
  ):null;
  switch(type){
    case "ereignis":{
      const ind=20;
      const pts=[[ind,0],[width-ind,0],[width,height/2],[width-ind,height],[ind,height],[0,height/2]].map(p=>p.join(",")).join(" ");
      return <svg width={width} height={height} overflow="visible">{defs}{selRing}
        <polygon points={pts} fill={fill} stroke={accent} strokeWidth={strokeW} strokeLinejoin="round" style={ss}/>
        <polygon points={pts} fill={`url(#${sheenId})`} opacity={opacity}/>
        {textEl}</svg>;
    }
    case "funktion":
      return <svg width={width} height={height} overflow="visible">{defs}{selRing}
        <rect x={0} y={0} width={width} height={height} rx={14} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/>
        <rect x={0} y={0} width={width} height={height} rx={14} fill={`url(#${sheenId})`} opacity={opacity}/>
        {textEl}</svg>;
    case "organisationseinheit":
      return <svg width={width} height={height} overflow="visible">{defs}{selRing}
        <ellipse cx={width/2} cy={height/2} rx={width/2} ry={height/2} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/>
        <line x1={width*0.2} y1={height*0.06} x2={width*0.2} y2={height*0.94} stroke={rgba(accent,0.6)} strokeWidth={1.5} opacity={opacity}/>
        {textEl}</svg>;
    case "informationsobjekt":
      return <svg width={width} height={height} overflow="visible">{defs}{selRing}
        <rect x={0} y={0} width={width} height={height} rx={4} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/>
        <line x1={width*0.2} y1={0} x2={width*0.2} y2={height} stroke={rgba(accent,0.55)} strokeWidth={1.3} opacity={opacity}/>
        <line x1={width*0.8} y1={0} x2={width*0.8} y2={height} stroke={rgba(accent,0.55)} strokeWidth={1.3} opacity={opacity}/>
        {textEl}</svg>;
    case "dokument":{
      const wH=11;
      const path=`M 3 0 L ${width-3} 0 Q ${width} 0 ${width} 4 L ${width} ${height-wH} Q ${width*0.75} ${height+wH*0.5} ${width*0.5} ${height-wH} Q ${width*0.25} ${height-wH*2.5} 0 ${height-wH} L 0 4 Q 0 0 3 0 Z`;
      return <svg width={width} height={height+wH} overflow="visible">{defs}{selRing}
        <path d={path} fill={fill} stroke={accent} strokeWidth={strokeW} strokeLinejoin="round" style={ss}/>
        {(()=>{const dlines=(label||"").split("\n");const dlH=fontSize*1.45;const cy=(height-wH)/2+1;
          return dlines.length<=1
            ?<text x={width/2} y={cy+fontSize*0.38} textAnchor="middle" fill={txt} fontSize={fontSize} fontWeight="600" fontFamily={FONT} style={{pointerEvents:"none",userSelect:"none"}}>{label}</text>
            :(()=>{ const totalH2=(dlines.length-1)*dlH; const startY2=cy-totalH2/2+fontSize*0.38; return <text x={width/2} textAnchor="middle" fill={txt} fontSize={fontSize} fontWeight="600" fontFamily={FONT} style={{pointerEvents:"none",userSelect:"none"}}>{dlines.map((l,i)=><tspan key={i} x={width/2} y={startY2+i*dlH}>{l}</tspan>)}</text>; })();
        })()}</svg>;
    }
    case "prozesspfad":{
      const aW=22;
      const pts=[[0,0],[width-aW,0],[width,height/2],[width-aW,height],[0,height]].map(p=>p.join(",")).join(" ");
      return <svg width={width} height={height} overflow="visible">{defs}{selRing}
        <polygon points={pts} fill={fill} stroke={accent} strokeWidth={strokeW} strokeLinejoin="round" style={ss}/>
        <polygon points={pts} fill={`url(#${sheenId})`} opacity={opacity}/>
        {textEl}</svg>;
    }
    case "operator_and": case "operator_or": case "operator_xor":{
      const lm={operator_and:"AND",operator_or:"OR",operator_xor:"XOR"};
      const r=Math.min(width,height)/2-2;
      return <svg width={width} height={height} overflow="visible">{defs}{selRing}
        <circle cx={width/2} cy={height/2} r={r} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/>
        <circle cx={width/2} cy={height/2} r={r} fill={`url(#${sheenId})`} opacity={opacity}/>
        <text x={width/2} y={height/2+0.5} textAnchor="middle" dominantBaseline="middle"
          fill={txt} fontSize={r>16?12.5:10.5} fontWeight="700" fontFamily={FONT}
          style={{pointerEvents:"none",userSelect:"none",letterSpacing:"0.5px"}}>{lm[type]}</text></svg>;
    }
    default: return null;
  }
}

// ─── Arrow / Edge Renderer ─────────────────────────────────────────────────
function Arrow({from,to,selected,label,onClickEdge,onDblClickLabel,drawing,lineStyle,isSnapped,waypoints,ortho}){
  const ls=lineStyle||"arrow";
  const isDashed=ls==="dashed"||ls==="dashed-line";
  const hasArrow=ls==="arrow"||ls==="dashed";
  const colorVar=selected?"var(--accent)":(drawing?(isSnapped?"var(--accent-2)":"#64748b"):"var(--edge)");
  const glow=selected?"drop-shadow(0 0 6px var(--accent-glow))":"none";

  // Build path through waypoints, or auto-L if ortho mode and no waypoints
  let pts;
  if(ortho&&(waypoints||[]).length===0&&!drawing){
    const dx=Math.abs(to.x-from.x), dy=Math.abs(to.y-from.y);
    // Wenn fast gleiche X oder Y → gerade Linie (kein L nötig)
    if(dx<4||dy<4){
      pts=[from,to];
    } else {
      // Wähle Richtung die den längeren letzten Abschnitt ergibt → Pfeil zeigt korrekt
      const viaV={x:from.x,y:to.y}; // vertikal zuerst
      const viaH={x:to.x,y:from.y}; // horizontal zuerst
      const lastSegV=Math.hypot(to.x-viaV.x,to.y-viaV.y);
      const lastSegH=Math.hypot(to.x-viaH.x,to.y-viaH.y);
      const via=lastSegV>=lastSegH?viaV:viaH;
      pts=[from,via,to];
    }
  } else {
    pts=[from,...(waypoints||[]),to];
  }
  const pathD=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");

  // Arrow direction: last segment
  const last=pts[pts.length-1], prev=pts[pts.length-2];
  const dx=last.x-prev.x, dy=last.y-prev.y;
  const len=Math.sqrt(dx*dx+dy*dy)||1;
  const ux=dx/len, uy=dy/len, as=11;
  const ax=to.x-ux*as, ay=to.y-uy*as;
  const px=-uy*(as/2.4), py=ux*(as/2.4);

  // Label: geometric midpoint between from and to (ignoring waypoints for label placement)
  const labelX=(from.x+to.x)/2, labelY=(from.y+to.y)/2;

  return(
    <g onClick={onClickEdge} style={{cursor:"pointer"}}>
      <path d={pathD} stroke="transparent" strokeWidth={16} fill="none"/>
      <path d={pathD} fill="none"
        strokeWidth={selected?2.4:1.9}
        strokeDasharray={isDashed?"7 5":undefined}
        strokeLinejoin="round" strokeLinecap="round"
        style={{stroke:colorVar,filter:glow,transition:"stroke .15s ease"}}/>
      {hasArrow&&<polygon points={`${to.x},${to.y} ${ax+px},${ay+py} ${ax-px},${ay-py}`}
        style={{fill:colorVar,filter:glow}}/>}
      {label&&(
        <g onDoubleClick={e=>{e.stopPropagation();onDblClickLabel&&onDblClickLabel();}}>
          <rect x={labelX-label.length*3.6-7} y={labelY-11} width={label.length*7.2+14} height={21}
            rx={10} style={{fill:"var(--bg-canvas)",stroke:"var(--border-strong)",strokeWidth:1}}/>
          <text x={labelX} y={labelY+0.5} textAnchor="middle" dominantBaseline="middle"
            fontSize={10.5} fontFamily={FONT} fontWeight={500}
            style={{fill:"var(--muted)",pointerEvents:"none",userSelect:"none"}}>{label}</text>
        </g>
      )}
    </g>
  );
}

// ─── Export (theme-getreu + fromDir/toDir + lineStyle + per-node color) ─────
function exportDiagram(nodes, edges, format, colors, diagramName, theme){
  if(nodes.length===0){ alert("Canvas ist leer!"); return; }
  const T = theme || (typeof THEMES!=="undefined"?THEMES.bloom:null);
  const BG = T?T.bgCanvas:"#1d1b24";
  const INK = T?T.ink:"#f6f5fa";
  const EDGE = T?T.edge:"#837c8e";
  const FX = T?T.fx:DEFAULT_FX;

  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  nodes.forEach(n=>{const{w,h}=getNodeSize(n);minX=Math.min(minX,n.x);minY=Math.min(minY,n.y);maxX=Math.max(maxX,n.x+w);maxY=Math.max(maxY,n.y+h);});
  const W=maxX-minX+PADDING*2, H=maxY-minY+PADDING*2;
  const offX=-minX+PADDING, offY=-minY+PADDING;
  const nodeMap=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const col=(t)=>(colors&&colors[t])||DEFAULT_COLORS[t]||{accent:"#aac6f0",text:INK};

  const edgeSVG=edges.map(edge=>{
    const a=nodeMap[edge.from],b=nodeMap[edge.to];
    if(!a||!b)return "";
    const cp=getClosestPorts(a,b);
    const p1=edge.fromDir?getPortPoint(a,edge.fromDir):cp.p1;
    const p2=edge.toDir?getPortPoint(b,edge.toDir):cp.p2;
    const wps=(edge.waypoints||[]);
    const dx=p2.x-p1.x,dy=p2.y-p1.y,len=Math.sqrt(dx*dx+dy*dy)||1;
    const ux=dx/len,uy=dy/len,as=11;
    const ax=p2.x-ux*as,ay=p2.y-uy*as,px=-uy*(as/2.4),py=ux*(as/2.4);
    const midX=(p1.x+p2.x)/2+offX,midY=(p1.y+p2.y)/2+offY;
    const ls=edge.lineStyle||"arrow";
    const dash=(ls==="dashed"||ls==="dashed-line")?` stroke-dasharray="7 5"`:"";
    const hasArrow=(ls==="arrow"||ls==="dashed");
    const pts=[p1,...wps,p2];
    const pathData=pts.map((p,i)=>`${i===0?"M":"L"}${p.x+offX},${p.y+offY}`).join(" ");
    const lineSVG=`<path d="${pathData}" fill="none" stroke="${EDGE}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"${dash}/>`;
    const arrowSVG=hasArrow?`<polygon points="${p2.x+offX},${p2.y+offY} ${ax+px+offX},${ay+py+offY} ${ax-px+offX},${ay-py+offY}" fill="${EDGE}"/>`:"";
    const labelSVG=edge.label?`<rect x="${midX-edge.label.length*3.6-5}" y="${midY-10}" width="${edge.label.length*7.2+10}" height="18" rx="6" fill="${BG}" stroke="${rgba('#ffffff',0.16)}"/><text x="${midX}" y="${midY+1}" text-anchor="middle" dominant-baseline="middle" fill="${INK}" font-size="10.5" font-family="system-ui,Segoe UI,Arial,sans-serif">${edge.label}</text>`:"";
    return lineSVG+arrowSVG+labelSVG;
  }).join("");

  const shapeSVG=nodes.map(node=>{
    const{w,h}=getNodeSize(node);
    const cBase=col(node.type); const accent=node.color||cBase.accent;
    const x=node.x+offX,y=node.y+offY;
    const fillCol=rgba(accent,FX.fill);
    const sw=FX.strokeW;
    let shape="";
    switch(node.type){
      case "ereignis":{const ind=20;const pts=[[ind,0],[w-ind,0],[w,h/2],[w-ind,h],[ind,h],[0,h/2]].map(p=>`${p[0]+x},${p[1]+y}`).join(" ");shape=`<polygon points="${pts}" fill="${fillCol}" stroke="${accent}" stroke-width="${sw}" stroke-linejoin="round"/>`;break;}
      case "funktion":shape=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fillCol}" stroke="${accent}" stroke-width="${sw}"/>`;break;
      case "organisationseinheit":shape=`<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" fill="${fillCol}" stroke="${accent}" stroke-width="${sw}"/><line x1="${x+w*0.2}" y1="${y+h*0.06}" x2="${x+w*0.2}" y2="${y+h*0.94}" stroke="${accent}" stroke-width="1.5" opacity="0.6"/>`;break;
      case "informationsobjekt":shape=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fillCol}" stroke="${accent}" stroke-width="${sw}"/><line x1="${x+w*0.2}" y1="${y}" x2="${x+w*0.2}" y2="${y+h}" stroke="${accent}" stroke-width="1.3" opacity="0.55"/><line x1="${x+w*0.8}" y1="${y}" x2="${x+w*0.8}" y2="${y+h}" stroke="${accent}" stroke-width="1.3" opacity="0.55"/>`;break;
      case "dokument":{const wH=11;shape=`<path d="M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h-wH} Q ${x+w*0.75} ${y+h+wH*0.5} ${x+w*0.5} ${y+h-wH} Q ${x+w*0.25} ${y+h-wH*2.5} ${x} ${y+h-wH} Z" fill="${fillCol}" stroke="${accent}" stroke-width="${sw}" stroke-linejoin="round"/>`;break;}
      case "prozesspfad":{const aW=22;const pts=[[0,0],[w-aW,0],[w,h/2],[w-aW,h],[0,h]].map(p=>`${p[0]+x},${p[1]+y}`).join(" ");shape=`<polygon points="${pts}" fill="${fillCol}" stroke="${accent}" stroke-width="${sw}" stroke-linejoin="round"/>`;break;}
      default:{const lm={operator_and:"AND",operator_or:"OR",operator_xor:"XOR"};const r=Math.min(w,h)/2-2;return `<circle cx="${x+w/2}" cy="${y+h/2}" r="${r}" fill="${fillCol}" stroke="${accent}" stroke-width="${sw}"/><text x="${x+w/2}" y="${y+h/2+1}" text-anchor="middle" dominant-baseline="middle" fill="${INK}" font-size="12.5" font-weight="700" font-family="system-ui,Segoe UI,Arial,sans-serif" letter-spacing="0.5">${lm[node.type]||""}</text>`;}
    }
    const ty=node.type==="dokument"?y+(h-11)/2:y+h/2;
    const lines=(node.label||"").split("\n");
    const lineH=14*1.4;
    const labelSVG=lines.length<=1
      ?`<text x="${x+w/2}" y="${ty+1}" text-anchor="middle" dominant-baseline="middle" fill="${INK}" font-size="12.5" font-weight="600" font-family="system-ui,Segoe UI,Arial,sans-serif">${node.label||""}</text>`
      :`<text x="${x+w/2}" text-anchor="middle" fill="${INK}" font-size="12.5" font-weight="600" font-family="system-ui,Segoe UI,Arial,sans-serif">${lines.map((l,i)=>`<tspan x="${x+w/2}" y="${ty-(lines.length-1)*lineH/2+i*lineH}">${l}</tspan>`).join("")}</text>`;
    return shape+labelSVG;
  }).join("\n");

  const svgStr=`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${BG}"/>${edgeSVG}${shapeSVG}</svg>`;
  const fname=(diagramName||"flowra-diagram").replace(/\s+/g,"-").toLowerCase();

  if(format==="svg"){
    // SVG: Base64 ans Backend schicken zum Speichern
    const b64=btoa(unescape(encodeURIComponent(svgStr)));
    fetch(`${API_BASE}/export`,{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({data:b64,filename:fname+".svg",mime:"image/svg+xml"})});
    return;}
  const img=new Image(),scale=2;const blob=new Blob([svgStr],{type:"image/svg+xml"});
  // Base64 Data URL statt Object URL – funktioniert zuverlässig in Qt-WebEngine
  const reader=new FileReader();
  reader.onload=()=>{
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      canvas.width=W*scale;canvas.height=H*scale;
      const ctx=canvas.getContext("2d");
      if(format==="jpeg"){ctx.fillStyle=BG;ctx.fillRect(0,0,canvas.width,canvas.height);}
      ctx.scale(scale,scale);ctx.drawImage(img,0,0);
      canvas.toBlob(b=>{
        // PNG/JPEG: Base64 ans Backend zum Speichern
        const fr=new FileReader();
        fr.onload=()=>{
          const b64=fr.result.split(",")[1];
          const ext=format==="jpeg"?"jpg":"png";
          fetch(`${API_BASE}/export`,{method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({data:b64,filename:`${fname}.${ext}`,mime:format==="jpeg"?"image/jpeg":"image/png"})});
        };
        fr.readAsDataURL(b);
      },format==="jpeg"?"image/jpeg":"image/png",0.95);
    };
    img.src=reader.result;
  };
  reader.readAsDataURL(blob);
}

// ─── Demo EPK for onboarding ───────────────────────────────────────────────
// Clean grid layout. Columns: LEFT=-200, MID=0, RIGHT=200, far L/R=-400/400
const DEMO_NODES = [
  {id:"d1",  type:"ereignis",            label:"Notfall\ngemeldet",        x:0,    y:0},
  {id:"d2",  type:"funktion",            label:"Meldung\nentgegennehmen",  x:0,    y:120},
  {id:"d3",  type:"organisationseinheit",label:"Portier",                  x:230,  y:120},
  {id:"d4",  type:"ereignis",            label:"Meldung\nbewertet",        x:0,    y:240},
  {id:"d5",  type:"operator_or",         label:"OR",                       x:0,    y:350},
  {id:"d6",  type:"ereignis",            label:"Sonder-\nnotfall",         x:-200, y:450},
  {id:"d7",  type:"ereignis",            label:"Med.\nNotfall",            x:200,  y:450},
  {id:"d8",  type:"funktion",            label:"Zuständigen\ninformieren", x:-200, y:570},
  {id:"d9",  type:"funktion",            label:"Zuständigen\ninformieren", x:200,  y:570},
  {id:"d10", type:"organisationseinheit",label:"Betriebs-\nfeuerwehr",     x:-420, y:570},
  {id:"d11", type:"organisationseinheit",label:"Betriebs-\narzt",          x:420,  y:570},
  {id:"d12", type:"ereignis",            label:"Zuständigen\ninformiert",  x:-200, y:690},
  {id:"d13", type:"ereignis",            label:"Zuständigen\ninformiert",  x:200,  y:690},
  {id:"d14", type:"funktion",            label:"Personal\nevakuieren",     x:-200, y:810},
  {id:"d15", type:"informationsobjekt",  label:"Feuerwehr &\nBrandschutz", x:0,    y:810},
  {id:"d16", type:"funktion",            label:"Maßnahmen\nfestlegen",     x:200,  y:810},
  {id:"d17", type:"ereignis",            label:"Personal\nevakuiert",      x:-200, y:930},
  {id:"d18", type:"ereignis",            label:"Maßnahmen\nfestgelegt",    x:200,  y:930},
  {id:"d19", type:"funktion",            label:"Maßnahmen\nfestlegen",     x:-200, y:1050},
  {id:"d20", type:"ereignis",            label:"Maßnahmen\nfestgelegt",    x:-200, y:1170},
  {id:"d21", type:"operator_or",         label:"OR",                       x:0,    y:1270},
  {id:"d22", type:"funktion",            label:"Einsatz\nbeenden",         x:0,    y:1370},
  {id:"d23", type:"ereignis",            label:"Einsatz\nbeendet",         x:0,    y:1490},
];
// lineStyle: "arrow" (default), "line" (no arrow), "dashed", "dashed-line"
const DEMO_EDGES = [
  {id:"e1",  from:"d1",  to:"d2",  fromDir:"bottom",toDir:"top"},
  {id:"e2",  from:"d2",  to:"d3",  fromDir:"right", toDir:"left",  lineStyle:"line"},
  {id:"e3",  from:"d2",  to:"d4",  fromDir:"bottom",toDir:"top"},
  {id:"e4",  from:"d4",  to:"d5",  fromDir:"bottom",toDir:"top"},
  {id:"e5",  from:"d5",  to:"d6",  fromDir:"left",  toDir:"top"},
  {id:"e6",  from:"d5",  to:"d7",  fromDir:"right", toDir:"top"},
  {id:"e7",  from:"d6",  to:"d8",  fromDir:"bottom",toDir:"top"},
  {id:"e8",  from:"d7",  to:"d9",  fromDir:"bottom",toDir:"top"},
  {id:"e9",  from:"d10", to:"d8",  fromDir:"right", toDir:"left",  lineStyle:"line"},
  {id:"e10", from:"d11", to:"d9",  fromDir:"left",  toDir:"right", lineStyle:"line"},
  {id:"e11", from:"d8",  to:"d12", fromDir:"bottom",toDir:"top"},
  {id:"e12", from:"d9",  to:"d13", fromDir:"bottom",toDir:"top"},
  {id:"e13", from:"d12", to:"d14", fromDir:"bottom",toDir:"top"},
  {id:"e14", from:"d13", to:"d16", fromDir:"bottom",toDir:"top"},
  {id:"e15", from:"d15", to:"d14", fromDir:"left",  toDir:"right", lineStyle:"dashed"},
  {id:"e16", from:"d14", to:"d17", fromDir:"bottom",toDir:"top"},
  {id:"e17", from:"d16", to:"d18", fromDir:"bottom",toDir:"top"},
  {id:"e18", from:"d17", to:"d19", fromDir:"bottom",toDir:"top"},
  {id:"e19", from:"d18", to:"d21", fromDir:"bottom",toDir:"top"},
  {id:"e20", from:"d19", to:"d20", fromDir:"bottom",toDir:"top"},
  {id:"e21", from:"d20", to:"d21", fromDir:"bottom",toDir:"top"},
  {id:"e22", from:"d21", to:"d22", fromDir:"bottom",toDir:"top"},
  {id:"e23", from:"d22", to:"d23", fromDir:"bottom",toDir:"top"},
];

// Compute a viewBox that fits all demo nodes with padding
function computeDemoViewBox(){
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for(const n of DEMO_NODES){
    const {w,h}=getNodeSize(n);
    minX=Math.min(minX,n.x-w/2); maxX=Math.max(maxX,n.x+w/2);
    minY=Math.min(minY,n.y-h/2); maxY=Math.max(maxY,n.y+h/2);
  }
  const pad=80;
  return {x:minX-pad, y:minY-pad, w:(maxX-minX)+pad*2, h:(maxY-minY)+pad*2};
}

// Render one demo edge as plain SVG (no animation wrapper)
function DemoEdge({edge}){
  const map=Object.fromEntries(DEMO_NODES.map(n=>[n.id,n]));
  const a=map[edge.from], b=map[edge.to];
  if(!a||!b) return null;
  // DEMO_NODES use CENTER coords; getPortPoint expects TOP-LEFT, so convert
  const toTL = n => { const {w,h}=getNodeSize(n); return {...n, x:n.x-w/2, y:n.y-h/2}; };
  const p1=getPortPoint(toTL(a), edge.fromDir);
  const p2=getPortPoint(toTL(b), edge.toDir);
  const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.sqrt(dx*dx+dy*dy)||1;
  const ux=dx/len, uy=dy/len, as=12;
  const ax=p2.x-ux*as, ay=p2.y-uy*as, px=-uy*(as/2.4), py=ux*(as/2.4);
  const ls=edge.lineStyle||"arrow";
  const dashed = ls==="dashed"||ls==="dashed-line";
  const noArrow = ls==="line"||ls==="dashed-line";
  return (
    <g>
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        stroke="#7a828f" strokeWidth={2} strokeDasharray={dashed?"9 6":"none"} strokeLinecap="round"/>
      {!noArrow && <polygon points={`${p2.x},${p2.y} ${ax+px},${ay+py} ${ax-px},${ay-py}`} fill="#7a828f"/>}
    </g>
  );
}

// ─── Onboarding Screen ────────────────────────────────────────────────────
function OnboardingScreen({onDone}){
  const [phase, setPhase] = useState("welcome"); // welcome | building | done
  const [nNodes, setNNodes] = useState(0);  // how many nodes are visible
  const [nEdges, setNEdges] = useState(0);  // how many edges are visible
  const timers = React.useRef([]);

  useEffect(()=>()=>{ timers.current.forEach(clearTimeout); }, []);

  const vb = React.useMemo(computeDemoViewBox, []);
  const [boxSize, setBoxSize] = useState(null);
  // Compute transform that fits the EPK bbox into the container (with margin)
  let demoTransform = "translate(0,0) scale(1)";
  if(boxSize){
    const sc = Math.min((boxSize.w-40)/vb.w, (boxSize.h-40)/vb.h);
    const tx = boxSize.w/2 - (vb.x + vb.w/2)*sc;
    const ty = boxSize.h/2 - (vb.y + vb.h/2)*sc;
    demoTransform = `translate(${tx},${ty}) scale(${sc})`;
  }

  const startBuild = () => {
    setPhase("building");
    const NODE_STEP = 240;
    const EDGE_STEP = 130;
    // Schedule node reveals
    for(let i=1;i<=DEMO_NODES.length;i++){
      timers.current.push(setTimeout(()=>setNNodes(i), i*NODE_STEP));
    }
    const afterNodes = DEMO_NODES.length*NODE_STEP + 200;
    // Schedule edge reveals
    for(let i=1;i<=DEMO_EDGES.length;i++){
      timers.current.push(setTimeout(()=>setNEdges(i), afterNodes + i*EDGE_STEP));
    }
    // Mark done
    timers.current.push(setTimeout(()=>setPhase("done"),
      afterNodes + DEMO_EDGES.length*EDGE_STEP + 400));
  };

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setNNodes(DEMO_NODES.length);
    setNEdges(DEMO_EDGES.length);
    setPhase("done");
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",background:"var(--bg)",overflow:"hidden",fontFamily:FONT}}>
      <div id="mesh"><span className="m1"/><span className="m2"/><span className="m3"/><span className="m4"/><div className="grain"/><div className="veil"/></div>
      <style>{`
        @keyframes obFly{0%{transform:translateY(-100px) scale(.5) rotate(-10deg);opacity:0}65%{transform:translateY(6px) scale(1.06) rotate(1deg);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes obFade{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes obPulse{0%,100%{box-shadow:0 0 18px rgba(221,184,120,.35)}50%{box-shadow:0 0 36px rgba(221,184,120,.7)}}
        .ob-fly{animation:obFly .85s cubic-bezier(.34,1.56,.64,1) both}
        .ob-fade{animation:obFade .7s ease both}
        .ob-pulse{animation:obPulse 2s ease-in-out infinite}
        .ob-node{opacity:0;animation:obFade .45s cubic-bezier(.34,1.56,.64,1) forwards}
        .ob-edge{opacity:0;animation:obFade .35s ease forwards}
      `}</style>

      {phase==="welcome" ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:30,zIndex:1,textAlign:"center",padding:"0 32px",maxWidth:520}}>
          <div className="ob-fly" style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:60,height:60,borderRadius:20,background:"radial-gradient(circle at 50% 40%, rgba(230,192,121,0.12), rgba(11,14,20,0.9))",
              border:"1px solid rgba(230,192,121,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}><TrioLogo size={40}/></div>
            <span style={{fontSize:40,fontWeight:700,background:"linear-gradient(90deg,#fff,#f1e3d2)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Flowra</span>
          </div>
          <div className="ob-fade" style={{animationDelay:".55s",display:"flex",flexDirection:"column",gap:14}}>
            <h2 style={{margin:0,fontSize:23,fontWeight:700,color:"var(--text)",lineHeight:1.35}}>Willkommen bei Flowra ✦</h2>
            <p style={{margin:0,fontSize:14.5,color:"var(--muted)",lineHeight:1.75}}>
              Dein modernes Tool für visuelle Prozessmodellierung.<br/>
              Starte mit <strong style={{color:"var(--emerald)"}}>EPK</strong> — BPMN, UML und ER folgen bald.
            </p>
            <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:4,flexWrap:"wrap"}}>
              {[["✅","EPK"],["🔜","BPMN"],["🔜","UML"],["🔜","ER"]].map(([ic,lb])=>(
                <span key={lb} style={{fontSize:12.5,color:lb==="EPK"?"var(--emerald)":"var(--faint)",fontWeight:600}}>{ic} {lb}</span>
              ))}
            </div>
          </div>
          <div className="ob-fade" style={{animationDelay:"1.1s"}}>
            <button className="ob-pulse" onClick={startBuild}
              style={{background:"linear-gradient(135deg,rgba(230,192,121,.18),rgba(221,145,137,.18))",
                border:"1.5px solid rgba(221,184,120,.55)",borderRadius:14,color:"#f1e3d2",
                fontSize:15,fontWeight:700,padding:"14px 40px",cursor:"pointer",fontFamily:FONT,letterSpacing:.4}}>
              Los geht's ✦
            </button>
          </div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,zIndex:1,width:"100%",height:"100%",padding:"24px 0"}}>
          <div className="ob-fade" style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:30,height:30,borderRadius:10,background:"radial-gradient(circle at 50% 40%, rgba(230,192,121,0.12), rgba(11,14,20,0.9))",border:"1px solid rgba(230,192,121,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}><TrioLogo size={22} glow={false}/></div>
            <span style={{fontSize:20,fontWeight:700,background:"linear-gradient(90deg,#fff,#f1e3d2)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Flowra</span>
            <span style={{fontSize:12,color:"var(--faint)",marginLeft:6}}>
              {phase==="done" ? "— Fertig!" : "— Beispiel-EPK wird aufgebaut…"}
            </span>
          </div>

          {/* The diagram canvas — fixed svg + transform group (same as editor) */}
          <div style={{flex:1,minHeight:0,width:"min(820px,92vw)",background:"rgba(7,8,11,.7)",
            border:"1px solid var(--border)",borderRadius:16,boxShadow:"0 20px 60px rgba(0,0,0,.55)",
            overflow:"hidden",display:"flex"}} ref={el=>{ if(el && !boxSize) setBoxSize({w:el.clientWidth,h:el.clientHeight}); }}>
            <svg width="100%" height="100%" style={{display:"block"}}>
              <g transform={demoTransform}>
                {/* Edges first (under nodes) */}
                {DEMO_EDGES.map((edge,i)=>{
                  if(i>=nEdges) return null;
                  return <g key={edge.id} style={{opacity:0,animation:"obFade 0.35s ease forwards"}}><DemoEdge edge={edge}/></g>;
                })}
                {/* Nodes — wrap each in a positioned <svg x= y=> so nested ShapeRenderer svg lands correctly */}
                {DEMO_NODES.map((node,i)=>{
                  if(i>=nNodes) return null;
                  const {w,h}=getNodeSize(node);
                  return (
                    <svg key={node.id} x={node.x-w/2} y={node.y-h/2} width={w} height={h+14} overflow="visible"
                       style={{opacity:0,animation:"obFade 0.45s cubic-bezier(.34,1.56,.64,1) forwards"}}>
                      <ShapeRenderer type={node.type} label={node.label} width={w} height={h} colors={DEFAULT_COLORS} fx={DEFAULT_FX}/>
                    </svg>
                  );
                })}
              </g>
            </svg>
          </div>

          <div style={{flexShrink:0,display:"flex",gap:12,alignItems:"center"}}>
            {phase==="building" && (
              <button onClick={skip} style={{background:"var(--glass)",border:"1px solid var(--border)",
                borderRadius:10,color:"var(--muted)",fontSize:12.5,fontWeight:600,padding:"9px 20px",cursor:"pointer",fontFamily:FONT}}>
                Überspringen
              </button>
            )}
            {phase==="done" && (
              <button onClick={onDone} className="ob-fade"
                style={{background:"linear-gradient(135deg,rgba(230,192,121,.2),rgba(221,145,137,.2))",
                  border:"1.5px solid rgba(221,184,120,.5)",borderRadius:12,color:"#f1e3d2",
                  fontSize:14,fontWeight:700,padding:"12px 34px",cursor:"pointer",fontFamily:FONT}}>
                Editor öffnen →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Panel ────────────────────────────────────────────────────────
function Toggle({on,onClick}){
  return(<div className="toggle-track" onClick={onClick} style={{width:46,height:26,borderRadius:13,position:"relative",background:on?"var(--emerald)":"rgba(255,255,255,0.12)",boxShadow:on?`0 0 12px ${rgba("#ddb878",0.5)}`:"none"}}>
    <div className="toggle-knob" style={{position:"absolute",top:3,left:on?23:3,width:20,height:20,borderRadius:10,background:"#fff",boxShadow:"0 2px 4px rgba(0,0,0,0.4)"}}/>
  </div>);
}
function Row({title,sub,children}){
  return(<div style={{marginBottom:14,padding:"14px 16px",background:"var(--glass)",borderRadius:"var(--r-md)",border:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <div><div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{title}</div><div style={{fontSize:11,color:"var(--faint)",marginTop:2}}>{sub}</div></div>
    {children}
  </div>);
}
// ─── FAQ Modal ──────────────────────────────────────────────────────────────
const FAQ_SECTIONS=[
  {title:"Elemente hinzufügen",icon:"✦",items:[
    {q:"Wie füge ich Elemente hinzu?",a:"Ziehe ein Element aus der Palette links auf die Zeichenfläche. Alle 9 EPK-Typen (Ereignis, Funktion, Operatoren usw.) sind dort verfügbar."},
    {q:"Wie benenne ich ein Element?",a:"Doppelklick auf das Element öffnet ein Textfeld. Mit Shift+Enter fügst du einen Zeilenumbruch ein, mit Enter bestätigst du."},
    {q:"Wie ändere ich die Größe eines Elements?",a:"Klicke das Element an und nutze die Breite- und Höhe-Schieberegler im rechten Properties-Panel. Schritte sind 5px."},
    {q:"Wie färbe ich ein einzelnes Element anders ein?",a:"Klicke das Element an → im Properties-Panel unter 'Farbe' eine der Schnellfarben wählen oder das '+'-Feld für eine eigene Farbe. Mit '↺ auf Typfarbe zurücksetzen' geht es zurück zum Standard."},
  ]},
  {title:"Verbindungen zeichnen",icon:"⟶",items:[
    {q:"Wie verbinde ich zwei Elemente?",a:"Fahre mit der Maus über ein Element — es erscheinen Port-Punkte (Kreise) an den Kanten. Ziehe von einem Port-Punkt zum Ziel-Element und lasse auf dessen Port los."},
    {q:"Wie zeichne ich eine L-förmige oder geknickte Linie?",a:"Ziehe vom Port und lasse die Maus auf der leeren Zeichenfläche los — das setzt einen Knickpunkt. Die Linie bleibt aktiv. Weiter ziehen und nochmal loslassen für weitere Knicke. Auf einen Ziel-Port loslassen schließt die Verbindung ab."},
    {q:"Wie mache ich einen Knickpunkt rückgängig?",a:"Drücke Esc während du eine Linie zeichnest — das entfernt den letzten Knickpunkt. Nochmal Esc bricht die ganze Linie ab."},
    {q:"Was ist der 'Gerade Linien' Modus?",a:"In den Einstellungen aktivierbar. Alle Linien rasten automatisch auf 90°-Winkel ein (nur horizontal oder vertikal). Beim Zeichnen erscheinen blaue Hilfslinien die zeigen wo die Linie einrastet."},
    {q:"Wie beschrifte ich eine Verbindung?",a:"Doppelklick auf die Linie (oder auf das Label) öffnet ein Textfeld für die Beschriftung."},
    {q:"Wie ändere ich den Linienstil?",a:"Klicke eine Linie an → im Properties-Panel unter 'Linienstil' zwischen Pfeil, gestrichelt, gestrichelt ohne Pfeil und einfache Linie wählen."},
  ]},
  {title:"Navigation & Ansicht",icon:"⊕",items:[
    {q:"Wie bewege ich die Zeichenfläche?",a:"Klicke auf eine leere Stelle und ziehe (linke Maustaste), oder halte Alt gedrückt und ziehe, oder nutze die mittlere Maustaste. Mit den Pfeiltasten kannst du die Ansicht ebenfalls verschieben."},
    {q:"Wie zoome ich?",a:"Mausrad zum Zoomen (zentriert auf die Mausposition). Oder die +/−-Buttons in der Toolbar. 'Reset' setzt Zoom und Position zurück."},
    {q:"Was sind die Ausrichtungs-Hilfslinien?",a:"Beim Verschieben von Elementen erscheinen automatisch farbige gestrichelte Linien wenn ein Element mit einem anderen auf gleicher Höhe, Mitte oder Kante ausgerichtet ist. Das Element rastet dann leicht ein."},
  ]},
  {title:"Projekte & Speichern",icon:"💾",items:[
    {q:"Wie speichere ich ein Diagramm?",a:"Klicke 'Speichern' in der Toolbar oder drücke Strg+S. Das Diagramm wird unter dem aktuellen Namen gespeichert."},
    {q:"Wie benenne ich das Diagramm?",a:"Doppelklick auf den Diagramm-Namen in der Toolbar (neben dem Logo)."},
    {q:"Wie öffne ich ein anderes Projekt?",a:"Klicke 'Projekte' in der Toolbar. Dort werden alle gespeicherten Diagramme aufgelistet. Klick auf einen Eintrag lädt es."},
    {q:"Wie erstelle ich ein neues Diagramm?",a:"Im Projekte-Dialog auf '+ Neues Diagramm' klicken."},
  ]},
  {title:"Export",icon:"⬇",items:[
    {q:"Wie exportiere ich mein Diagramm?",a:"Klicke 'Export' in der Toolbar und wähle PNG (hohe Auflösung, 2×), JPEG oder SVG. SVG ist ideal für die Weiterverwendung in anderen Programmen."},
    {q:"Werden Waypoints und Linienformen exportiert?",a:"Ja — alle Knickpunkte, Linienstile, Labels und Einzelfärbungen werden im Export korrekt dargestellt."},
  ]},
  {title:"Tastenkürzel",icon:"⌨",items:[
    {q:"Welche Tastenkürzel gibt es?",a:null,shortcuts:[
      ["Strg+S","Speichern"],
      ["Strg+Z","Rückgängig"],
      ["Strg+Y","Wiederholen"],
      ["Strg+C","Element kopieren"],
      ["Strg+V","Element einfügen"],
      ["Entf","Ausgewähltes löschen"],
      ["Esc","Zeichnen abbrechen / Knickpunkt rückgängig"],
      ["Doppelklick","Element/Linie beschriften"],
      ["Shift+Enter","Zeilenumbruch im Text"],
      ["Pfeiltasten","Ansicht verschieben"],
    ]},
  ]},
  {title:"Themes & Einstellungen",icon:"◐",items:[
    {q:"Wie wechsle ich das Theme?",a:"In den Einstellungen (⚙-Button) unter 'THEME' eines der 5 Themes auswählen: Bloom, Eclipse, Nocturne, Graphite oder Matte. Die Auswahl wird gespeichert."},
    {q:"Was ist der Snap-to-Grid Modus?",a:"Elemente rasten beim Loslassen automatisch auf ein 5px-Raster ein. So bleiben alle Elemente sauber ausgerichtet. In den Einstellungen an-/ausschaltbar."},
    {q:"Was ist der Wobble-Effekt?",a:"Ein physikalischer Gummi-Effekt beim Verschieben von Elementen. In den Einstellungen an-/ausschaltbar."},
    {q:"Wie ändere ich die Standardfarben der Elementtypen?",a:"In den Einstellungen unter 'ELEMENT-AKZENTE' auf das Farbfeld neben einem Elementtyp klicken und eine neue Farbe wählen. 'Akzente auf Theme zurücksetzen' stellt die Theme-Standardfarben wieder her."},
  ]},
];

function FAQModal({onClose}){
  const [open,setOpen]=useState(null);
  const [search,setSearch]=useState("");
  const filtered=FAQ_SECTIONS.map(s=>({...s,items:s.items.filter(i=>
    !search||(i.q+( i.a||"")+(i.shortcuts?.flat().join(" ")||"")).toLowerCase().includes(search.toLowerCase())
  )})).filter(s=>s.items.length>0);
  return(
    <div className="pop-in" style={{position:"fixed",inset:0,zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}}>
      <div style={{width:"min(680px,92vw)",maxHeight:"82vh",display:"flex",flexDirection:"column",borderRadius:"var(--r-xl)",overflow:"hidden",background:"color-mix(in oklab,var(--bg) 85%,transparent)",border:"1px solid var(--border-strong)",boxShadow:"var(--shadow)",backdropFilter:"blur(12px)"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"18px 22px",borderBottom:"1px solid var(--border-strong)",flexShrink:0,background:"color-mix(in oklab,var(--bg) 60%,transparent)"}}>
          <span style={{fontSize:20}}>❓</span>
          <span style={{fontWeight:800,fontSize:17,flex:1}}>Hilfe & FAQ</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Suchen…"
            className="prop-input" style={{width:180,padding:"6px 10px",fontSize:13}}/>
          <button className="tbtn" onClick={onClose} style={{width:32,height:32,padding:0,fontSize:16}}>✕</button>
        </div>
        {/* Content */}
        <div style={{overflowY:"auto",padding:"12px 16px 20px"}}>
          {filtered.map((section,si)=>(
            <div key={si} style={{marginBottom:8}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:1.4,color:"var(--faint)",padding:"10px 6px 6px",textTransform:"uppercase"}}>
                {section.icon} {section.title}
              </div>
              {section.items.map((item,ii)=>(
                <div key={ii} style={{borderRadius:"var(--r-md)",border:"1px solid var(--border)",marginBottom:4,overflow:"hidden",background:"color-mix(in oklab,var(--bg) 50%,transparent)"}}>
                  <div onClick={()=>setOpen(open===`${si}-${ii}`?null:`${si}-${ii}`)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",userSelect:"none"}}>
                    <span style={{flex:1,fontSize:13,fontWeight:600,color:"var(--text)"}}>{item.q}</span>
                    <span style={{color:"var(--faint)",fontSize:12,transition:"transform .2s",transform:open===`${si}-${ii}`?"rotate(180deg)":"none"}}>▾</span>
                  </div>
                  {open===`${si}-${ii}`&&(
                    <div style={{padding:"4px 14px 13px",borderTop:"1px solid var(--border)"}}>
                      {item.a&&<p style={{margin:"8px 0 0",fontSize:13,color:"var(--muted)",lineHeight:1.6}}>{item.a}</p>}
                      {item.shortcuts&&<table style={{width:"100%",marginTop:8,borderCollapse:"collapse"}}>
                        {item.shortcuts.map(([key,desc],ki)=>(
                          <tr key={ki}>
                            <td style={{padding:"4px 10px 4px 0",width:140}}>
                              <code style={{background:"var(--glass-strong)",border:"1px solid var(--border)",borderRadius:5,padding:"2px 7px",fontSize:12,fontFamily:"'Consolas','Monaco','Courier New',monospace",color:"var(--text)"}}>{key}</code>
                            </td>
                            <td style={{padding:"4px 0",fontSize:13,color:"var(--muted)"}}>{desc}</td>
                          </tr>
                        ))}
                      </table>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"var(--faint)",fontSize:14}}>Keine Ergebnisse für „{search}"</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Project Manager ───────────────────────────────────────────────────────
function ProjectManager({currentName, onLoad, onNew, onClose}){
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState("");
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      const r = await fetch(`${API_BASE}/diagrams`);
      setProjects(await r.json());
    } catch(e){ setError("Backend nicht erreichbar"); }
    setLoading(false);
  };

  useEffect(()=>{ refresh(); }, []);

  const handleDelete = async (name) => {
    if(!window.confirm(`"${name}" wirklich löschen?`)) return;
    await fetch(`${API_BASE}/diagrams/${encodeURIComponent(name)}`, {method:"DELETE"});
    refresh();
  };

  const handleRename = async (oldName) => {
    if(!renameVal.trim()) return;
    await fetch(`${API_BASE}/diagrams/${encodeURIComponent(oldName)}/rename`, {
      method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:renameVal})
    });
    setRenaming(null); refresh();
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(6px)"}} onClick={onClose}/>
      <div className="glass pop-in" style={{position:"relative",borderRadius:"var(--r-lg)",padding:28,width:520,maxHeight:"78vh",display:"flex",flexDirection:"column",gap:16,boxShadow:"var(--shadow)",background:"rgba(10,12,18,0.88)",border:"1px solid var(--border-strong)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:700,color:"var(--emerald)",letterSpacing:1.5}}>PROJEKTE</span>
          <div style={{display:"flex",gap:8}}>
            <button className="tbtn" onClick={onNew} style={{padding:"6px 14px",fontSize:12.5,fontWeight:600,color:"var(--emerald)",background:rgba("#ddb878",0.12),borderColor:rgba("#ddb878",0.3)}}>+ Neu</button>
            <button className="tbtn" onClick={onClose} style={{width:30,height:30,fontSize:16}}>✕</button>
          </div>
        </div>

        {error && <div style={{color:"var(--rose)",fontSize:12,padding:"8px 12px",background:rgba("#fb7185",0.1),borderRadius:8,border:"1px solid "+rgba("#fb7185",0.3)}}>{error}</div>}

        <div style={{overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
          {loading && <div style={{color:"var(--faint)",fontSize:12,textAlign:"center",padding:24}}>Lade Projekte…</div>}
          {!loading && projects.length===0 && (
            <div style={{color:"var(--faint)",fontSize:12,textAlign:"center",padding:24}}>
              Noch keine Projekte gespeichert.<br/>
              <span style={{color:"var(--dim)"}}>Speichere zuerst ein Diagramm.</span>
            </div>
          )}
          {projects.map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
              background:p.name===currentName?"rgba(221,184,120,0.10)":"var(--glass)",
              border:`1px solid ${p.name===currentName?"rgba(221,184,120,0.35)":"var(--border)"}`,
              borderRadius:"var(--r-md)"}}>
              {renaming===p.name ? (
                <input autoFocus value={renameVal} onChange={e=>setRenameVal(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter")handleRename(p.name);if(e.key==="Escape")setRenaming(null);}}
                  style={{flex:1,background:"var(--glass)",border:"1px solid var(--emerald)",borderRadius:6,color:"var(--text)",padding:"4px 8px",fontSize:12.5,fontFamily:"inherit"}}/>
              ) : (
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:p.name===currentName?"#ddb878":"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                  <div style={{fontSize:10.5,color:"var(--faint)",marginTop:2}}>Zuletzt geändert: {new Date(p.updated).toLocaleString("de-DE")}</div>
                </div>
              )}
              <div style={{display:"flex",gap:5,flexShrink:0}}>
                {renaming===p.name ? (
                  <>
                    <button className="tbtn" onClick={()=>handleRename(p.name)} style={{padding:"4px 10px",fontSize:11.5,color:"var(--emerald)"}}>✓</button>
                    <button className="tbtn" onClick={()=>setRenaming(null)} style={{padding:"4px 10px",fontSize:11.5}}>✕</button>
                  </>
                ) : (
                  <>
                    <button className="tbtn" onClick={()=>onLoad(p.name)} style={{padding:"4px 10px",fontSize:11.5,color:"var(--emerald)"}}>Öffnen</button>
                    <button className="tbtn" onClick={()=>{setRenaming(p.name);setRenameVal(p.name);}} style={{padding:"4px 10px",fontSize:11.5}}>✎</button>
                    <button className="tbtn" onClick={()=>handleDelete(p.name)} style={{padding:"4px 10px",fontSize:11.5,color:"var(--rose)",background:rgba("#fb7185",0.08),borderColor:rgba("#fb7185",0.25)}}>🗑</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function SettingsPanel({theme,onTheme,colors,onColorsChange,snapGrid,onSnapGrid,showGrid,onShowGrid,wobble,onWobble,snapLines,onSnapLines,onClose,onFAQ}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div className="glass pop-in" style={{position:"relative",borderRadius:"var(--r-lg)",padding:26,width:460,maxHeight:"82vh",overflowY:"auto",boxShadow:"var(--shadow)",background:"rgba(12,14,19,0.82)",border:"1px solid var(--border-strong)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontSize:13,fontWeight:700,color:"var(--emerald)",letterSpacing:1.5}}>EINSTELLUNGEN</span>
          <button className="tbtn" onClick={onClose} style={{width:30,height:30,fontSize:16,color:"var(--muted)"}}>✕</button>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:"var(--faint)",letterSpacing:1.4,margin:"0 0 10px 2px"}}>THEME</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
          {THEME_ORDER.map(id=>{const t=THEMES[id];return(
            <button key={id} className={"theme-pick"+(theme===id?" on":"")} onClick={()=>onTheme(id)}>
              <span className="dot" style={{background:t.dot,color:t.dot}}/>{t.name}
            </button>);})}
        </div>
        <Row title="Snap to Grid" sub="Elemente rasten am Raster ein"><Toggle on={snapGrid} onClick={()=>onSnapGrid(!snapGrid)}/></Row>
        <Row title="Gerade Linien" sub="Verbindungen snappen auf 90°"><Toggle on={snapLines} onClick={()=>onSnapLines(!snapLines)}/></Row>
        <Row title="Gitter anzeigen" sub="Punktraster auf dem Canvas"><Toggle on={showGrid} onClick={()=>onShowGrid(!showGrid)}/></Row>
        <Row title="Wobble-Effekt" sub="Gummi-Physik beim Ziehen"><Toggle on={wobble>0} onClick={()=>onWobble(wobble>0?0:10)}/></Row>
        <div style={{fontSize:11,fontWeight:700,color:"var(--faint)",letterSpacing:1.4,margin:"18px 0 10px"}}>ELEMENT-AKZENTE</div>
        {Object.entries(colors).filter(([t])=>t!=="operator_or"&&t!=="operator_xor").map(([type,c])=>(
          <div key={type} style={{display:"flex",alignItems:"center",gap:14,marginBottom:8,padding:"9px 14px",background:"var(--glass)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
            <div style={{width:26,height:26,borderRadius:7,flexShrink:0,background:rgba(c.accent,0.18),border:`1.6px solid ${c.accent}`,boxShadow:`0 0 10px ${rgba(c.accent,0.5)}`}}/>
            <span style={{flex:1,fontSize:12.5,fontWeight:600,color:"var(--text)"}}>{type==="operator_and"?"Operatoren":LABEL_MAP[type]}</span>
            <label style={{position:"relative",cursor:"pointer"}} title="Akzentfarbe">
              <input type="color" value={c.accent} onChange={e=>onColorsChange(type,"accent",e.target.value)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}}/>
              <span className="swatch" style={{display:"block",width:34,height:26,borderRadius:7,background:c.accent,border:"1px solid var(--border-strong)"}}/>
            </label>
          </div>
        ))}
        <button className="tbtn" onClick={()=>onColorsChange("__reset__")} style={{marginTop:12,width:"100%",padding:"10px",color:"var(--rose)",borderColor:rgba("#fb7185",0.3),background:rgba("#fb7185",0.08),fontSize:12.5,fontWeight:600}}>Akzente auf Theme zurücksetzen</button>
        <button className="tbtn" onClick={onFAQ} style={{marginTop:8,width:"100%",padding:"10px",fontSize:12.5,fontWeight:600}}>❓ Hilfe & FAQ öffnen</button>
      </div>
    </div>
  );
}


const PALETTE=[
  {type:"ereignis",label:"Ereignis"},
  {type:"funktion",label:"Funktion"},
  {type:"organisationseinheit",label:"Org.-Einheit"},
  {type:"informationsobjekt",label:"Info.-Objekt"},
  {type:"dokument",label:"Dokument"},
  {type:"prozesspfad",label:"Prozesspfad"},
  {type:"operator_and",label:"AND"},
  {type:"operator_or",label:"OR"},
  {type:"operator_xor",label:"XOR"},
];
const LABEL_MAP=Object.fromEntries(PALETTE.map(p=>[p.type,p.label]));
// ─── Main Editor ───────────────────────────────────────────────────────────
const uid=()=>`n${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
const MAX_HISTORY=50;

export default function FlowraEditor(){
  const [nodes,setNodes]=useState([]);
  const [edges,setEdges]=useState([]);
  const [selected,setSelected]=useState(null);
  const [dragging,setDragging]=useState(null);
  const [editingId,setEditingId]=useState(null);
  const [editText,setEditText]=useState("");
  const [editingEdgeId,setEditingEdgeId]=useState(null);
  const [editEdgeText,setEditEdgeText]=useState("");
  const [canvasOffset,setCanvasOffset]=useState({x:80,y:60});
  const [panStart,setPanStart]=useState(null);
  const [zoom,setZoom]=useState(1);
  const [exportOpen,setExportOpen]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showFAQ,setShowFAQ]=useState(false);
  const [showProjects,setShowProjects]=useState(false);
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [saveStatus,setSaveStatus]=useState('');  // '', 'saving', 'saved', 'error'
  const [colors,setColors]=useState(()=>themeColors(loadTheme()));
  const [snapGrid,setSnapGrid]=useState(true);
  const [snapLines,setSnapLines]=useState(true);
  const [showGrid,setShowGrid]=useState(false);
  const [wobble,setWobble]=useState(10);
  const [diagramName,setDiagramName]=useState("Unbenanntes Diagramm");
  const [editingName,setEditingName]=useState(false);
  const [drawingEdge,setDrawingEdge]=useState(null);
  const setDrawingEdgeSynced=(val)=>{const v=typeof val==='function'?val(drawingEdgeRef.current):val;drawingEdgeRef.current=v;setDrawingEdge(v);};
  const [hoveredPort,setHoveredPort]=useState(null);
  const [hoverNode,setHoverNode]=useState(null);
  const [isPaletteDrag,setIsPaletteDrag]=useState(false);
  const [guides,setGuides]=useState({h:null,v:null});
  const [clipboard,setClipboard]=useState(null);
  const [theme,setTheme]=useState(loadTheme);
  const T=THEMES[theme]||THEMES.bloom;
  const applyTheme=(id)=>{ setTheme(id); persistTheme(id); setColors(themeColors(id)); };

  const historyRef=useRef([{nodes:[],edges:[]}]);
  const historyIdxRef=useRef(0);
  const svgRef=useRef(null);
  const wobbleRefs=useRef({});
  const springs=useRef({});
  const nodesRef=useRef({});
  const wobbleAmt=useRef(0.5);
  const draggingRef=useRef(null);
  const paletteDragRef=useRef(false);
  const portHandledRef=useRef(false);
  const drawingEdgeRef=useRef(null);

  useEffect(()=>{wobbleAmt.current=wobble/10;},[wobble]);
  useEffect(()=>{nodesRef.current=Object.fromEntries(nodes.map(n=>[n.id,n]));},[nodes]);
  useEffect(()=>{draggingRef.current=dragging;},[dragging]);

  const kick=(id,kx,ky)=>{const s=springs.current[id]||{Sx:0,Sy:0,Vx:0,Vy:0,Tx:0,Ty:0};s.Tx=clamp((s.Tx||0)+kx,-80,80);s.Ty=clamp((s.Ty||0)+ky,-80,80);springs.current[id]=s;};

  useEffect(()=>{
    let raf,last=performance.now();
    const tick=(now)=>{
      const dt=Math.min(0.032,(now-last)/1000)||0.016;last=now;
      const W=wobbleAmt.current,k=175,c=13;
      for(const id in springs.current){
        const s=springs.current[id];
        s.Tx*=0.80;s.Ty*=0.80;
        const ax=(s.Tx-s.Sx)*k-s.Vx*c,ay=(s.Ty-s.Sy)*k-s.Vy*c;
        s.Vx+=ax*dt;s.Vy+=ay*dt;s.Sx+=s.Vx*dt;s.Sy+=s.Vy*dt;
        const el=wobbleRefs.current[id];
        const settled=Math.abs(s.Sx)<0.04&&Math.abs(s.Sy)<0.04&&Math.abs(s.Vx)<0.04&&Math.abs(s.Vy)<0.04&&Math.abs(s.Tx)<0.04&&Math.abs(s.Ty)<0.04;
        if(settled&&!(draggingRef.current&&draggingRef.current.id===id)){if(el)el.removeAttribute("transform");delete springs.current[id];continue;}
        if(el){const node=nodesRef.current[id];if(!node)continue;const{w,h}=getNodeSize(node);const cx=w/2,cy=h/2;const skewX=clamp(s.Sx*0.34*W,-24,24),skewY=clamp(s.Sy*0.34*W,-24,24);const sclx=1+clamp(Math.abs(s.Sx)*0.0045*W,0,0.18),scly=1+clamp(Math.abs(s.Sy)*0.0045*W,0,0.18);el.setAttribute("transform",`translate(${cx} ${cy}) skewX(${skewX.toFixed(2)}) skewY(${skewY.toFixed(2)}) scale(${sclx.toFixed(3)} ${scly.toFixed(3)}) translate(${-cx} ${-cy})`);}}
      raf=requestAnimationFrame(tick);};
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[]);

  const pushHistory=useCallback((n,e)=>{const h=historyRef.current.slice(0,historyIdxRef.current+1);h.push({nodes:JSON.parse(JSON.stringify(n)),edges:JSON.parse(JSON.stringify(e))});if(h.length>MAX_HISTORY)h.shift();historyRef.current=h;historyIdxRef.current=h.length-1;},[]);
  // Check first launch
  useEffect(()=>{
    fetch(`${API_BASE}/diagrams`)
      .then(r=>r.json())
      .then(data=>{ if(data.length===0) setShowOnboarding(true); })
      .catch(()=>{}); // backend not running yet → skip
  },[]);

  useEffect(()=>{ persistTheme(theme); },[]);

  // Sync snapLines into active drawingEdge so mousemove always has current value
  useEffect(()=>{
    if(drawingEdgeRef.current){
      setDrawingEdgeSynced(d=>d?({...d,snapLines}):null);
    }
  },[snapLines]);

  // Globaler mouseup-Listener für Waypoints — zuverlässiger als SVG-Event-Bubbling
  useEffect(()=>{
    const onGlobalMouseUp=(e)=>{
      if(portHandledRef.current) return;
      const de=drawingEdgeRef.current;
      if(!de) return;
      // Nicht feuern wenn auf einem Port (hat data-port Attribut)
      if(e.target.closest&&e.target.closest('[data-port]')) return;
      // Nicht feuern wenn Port-Kreise (circle mit className port-dot)
      if(e.target.classList&&e.target.classList.contains('port-dot')) return;
      // Nur auf leerem Canvas
      if(!svgRef.current) return;
      const rect=svgRef.current.getBoundingClientRect();
      // Prüfen ob Klick überhaupt im Canvas-Bereich war
      if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom) return;
      const rawX=(e.clientX-rect.left-de.__ox||0);
      const rawY=(e.clientY-rect.top-de.__oy||0);
      // Benutze den aktuellen mouseX/Y des drawingEdge (bereits korrekt berechnet)
      // mouseX/Y already snapped by mousemove handler — use directly
      setDrawingEdgeSynced(d=>d?({...d,waypoints:[...(d.waypoints||[]),{x:de.mouseX,y:de.mouseY}]}):null);
    };
    document.addEventListener('mouseup',onGlobalMouseUp);
    return ()=>document.removeEventListener('mouseup',onGlobalMouseUp);
  },[snapGrid]);

  const saveDiagram = async () => {
    setSaveStatus('saving');
    try {
      await fetch(`${API_BASE}/diagrams/${encodeURIComponent(diagramName)}`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({nodes, edges})
      });
      setSaveStatus('saved');
      setTimeout(()=>setSaveStatus(''),2000);
    } catch(e) { setSaveStatus('error'); setTimeout(()=>setSaveStatus(''),3000); }
  };

  const loadDiagram = async (name) => {
    try {
      const r = await fetch(`${API_BASE}/diagrams/${encodeURIComponent(name)}`);
      if(!r.ok) return;
      const data = await r.json();
      const snapNodes=(data.nodes||[]).map(n=>{
        const isOp=n.type&&n.type.startsWith("operator");
        const hw=isOp?24:NODE_W/2, hh=isOp?24:NODE_H/2;
        return{...n,
          x:Math.round((n.x+hw)/GRID)*GRID-hw,
          y:Math.round((n.y+hh)/GRID)*GRID-hh
        };
      });
      setNodes(snapNodes);
      setEdges(data.edges||[]);
      setDiagramName(name);
      setSelected(null);
      pushHistory(data.nodes||[], data.edges||[]);
      setShowProjects(false);
    } catch(e) { alert('Fehler beim Laden'); }
  };

  const newDiagram = () => {
    if(nodes.length>0 && !window.confirm('Aktuelles Diagramm verwerfen?')) return;
    setNodes([]); setEdges([]); setDiagramName('Unbenanntes Diagramm');
    setSelected(null); pushHistory([],[]); setShowProjects(false);
  };

  const undo=useCallback(()=>{if(historyIdxRef.current<=0)return;historyIdxRef.current--;const s=historyRef.current[historyIdxRef.current];setNodes(s.nodes);setEdges(s.edges);setSelected(null);},[]);
  const redo=useCallback(()=>{if(historyIdxRef.current>=historyRef.current.length-1)return;historyIdxRef.current++;const s=historyRef.current[historyIdxRef.current];setNodes(s.nodes);setEdges(s.edges);setSelected(null);},[]);

  const toCanvas=(cx,cy)=>({x:(cx-canvasOffset.x)/zoom,y:(cy-canvasOffset.y)/zoom});

  const handleCanvasDrop=e=>{e.preventDefault();paletteDragRef.current=false;setIsPaletteDrag(false);setDrawingEdgeSynced(null);const type=e.dataTransfer.getData("epk-type"),label=e.dataTransfer.getData("epk-label");if(!type)return;const rect=svgRef.current.getBoundingClientRect();let{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);const isOp=type.startsWith("operator");
      // Snap the CENTER of the dropped element to grid, then get top-left
      const hw=isOp?24:NODE_W/2, hh=isOp?24:NODE_H/2;
      if(snapGrid){const g=GRID;x=Math.round(x/g)*g;y=Math.round(y/g)*g;}
      x-=hw; y-=hh;const id=uid();const newNodes=[...nodes,{id,type,label,x,y}];setNodes(newNodes);pushHistory(newNodes,edges);setSelected({type:"node",id});nodesRef.current[id]={id,type,x,y};kick(id,0,26);};

  const handleNodeMouseDown=(e,id)=>{if(e.button!==0)return;e.stopPropagation();setSelected({type:"node",id});const node=nodes.find(n=>n.id===id);const rect=svgRef.current.getBoundingClientRect();const{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);setDragging({id,offX:x-node.x,offY:y-node.y,moved:false});if(!springs.current[id])springs.current[id]={Sx:0,Sy:0,Vx:0,Vy:0,Tx:0,Ty:0};};
  const handlePortMouseDown=(e,nodeId,dir)=>{e.stopPropagation();if(paletteDragRef.current)return;if(drawingEdgeRef.current)return;const rect=svgRef.current.getBoundingClientRect();const{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);setDrawingEdgeSynced({fromId:nodeId,fromDir:dir,mouseX:x,mouseY:y,snapped:false,waypoints:[],snapLines});};
  const handlePortMouseUp=(e,nodeId,dir)=>{e.stopPropagation();portHandledRef.current=true;setTimeout(()=>{portHandledRef.current=false;},50);if(drawingEdge&&drawingEdge.fromId!==nodeId){const newEdges=[...edges,{id:uid(),from:drawingEdge.fromId,to:nodeId,fromDir:drawingEdge.fromDir,toDir:dir,label:"",waypoints:drawingEdge.waypoints||[]}];setEdges(newEdges);pushHistory(nodes,newEdges);kick(nodeId,0,14);}setDrawingEdgeSynced(null);setHoveredPort(null);};

  const handleSVGMouseMove=e=>{const rect=svgRef.current.getBoundingClientRect();const{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);if(dragging){let nx=x-dragging.offX,ny=y-dragging.offY;
      // Alignment guides
      const dn=nodes.find(n=>n.id===dragging.id);
      if(dn){
        const{w:dw,h:dh}=getNodeSize(dn);
        const dcx=nx+dw/2, dcy=ny+dh/2;
        const dl=nx, dr=nx+dw, dt=ny, db=ny+dh;
        let gH=null, gV=null;
        const SNAP=8;
        for(const n of nodes){
          if(n.id===dragging.id)continue;
          const{w,h}=getNodeSize(n);
          const cx=n.x+w/2, cy=n.y+h/2;
          const nl=n.x, nr=n.x+w, nt=n.y, nb=n.y+h;
          // Vertikal: center, linke Kante, rechte Kante
          if(gV===null){
            if(Math.abs(dcx-cx)<SNAP){gV=cx;nx=cx-dw/2;}
            else if(Math.abs(dl-nl)<SNAP){gV=nl;nx=nl;}
            else if(Math.abs(dl-nr)<SNAP){gV=nr;nx=nr;}
            else if(Math.abs(dr-nl)<SNAP){gV=nl;nx=nl-dw;}
            else if(Math.abs(dr-nr)<SNAP){gV=nr;nx=nr-dw;}
          }
          // Horizontal: center, obere Kante, untere Kante
          if(gH===null){
            if(Math.abs(dcy-cy)<SNAP){gH=cy;ny=cy-dh/2;}
            else if(Math.abs(dt-nt)<SNAP){gH=nt;ny=nt;}
            else if(Math.abs(dt-nb)<SNAP){gH=nb;ny=nb;}
            else if(Math.abs(db-nt)<SNAP){gH=nt;ny=nt-dh;}
            else if(Math.abs(db-nb)<SNAP){gH=nb;ny=nb-dh;}
          }
        }
        setGuides({h:gH,v:gV,active:gH!==null||gV!==null});
      }
      setNodes(prev=>prev.map(n=>n.id===dragging.id?{...n,x:nx,y:ny}:n));if(!dragging.moved)setDragging(d=>({...d,moved:true}));const s=springs.current[dragging.id];if(s){s.Tx=clamp((e.movementX/zoom)*1.7,-80,80);s.Ty=clamp((e.movementY/zoom)*1.7,-80,80);}}if(panStart)setCanvasOffset({x:panStart.ox+(e.clientX-panStart.x),y:panStart.oy+(e.clientY-panStart.y)});if(drawingEdge){
    const wps=drawingEdge.waypoints||[];
    const useSnap=drawingEdge.snapLines; // stored at draw-start, no stale closure
    let ref;
    if(wps.length>0){ref=wps[wps.length-1];}
    else{const fn=nodes.find(n=>n.id===drawingEdge.fromId);ref=fn?getPortPoint(fn,drawingEdge.fromDir):{x,y};}
    let snapped;
    if(useSnap){
      const dx=x-ref.x, dy=y-ref.y;
      const isH=Math.abs(dx)>Math.abs(dy);
      let sx=isH?x:ref.x, sy=isH?ref.y:y;
      const PSNAP=28; // Snap-Radius zu Port-Koordinaten
      // Sammle alle Ports anderer Elemente
      const allPortPositions=[];
      for(const n of nodes){
        if(n.id===drawingEdge.fromId)continue;
        for(const p of getAllPorts(n)) allPortPositions.push(p);
      }
      // Auf freier Achse zu nächstem Port snappen
      let snapGuides=[];
      if(isH){
        // Horizontal bewegen → freie Achse = X → snappen wenn Port-x nahe sx
        for(const p of allPortPositions){
          if(Math.abs(p.x-sx)<PSNAP){sx=p.x;snapGuides=[{axis:'v',val:p.x,py:p.y}];break;}
        }
        snapGuides=[{axis:'v',val:sx,portY:null}];
      } else {
        // Vertikal bewegen → freie Achse = Y → snappen wenn Port-y nahe sy
        for(const p of allPortPositions){
          if(Math.abs(p.y-sy)<PSNAP){sy=p.y;snapGuides=[{axis:'h',val:p.y,px:p.x}];break;}
        }
        snapGuides=[{axis:'h',val:sy,portX:null}];
      }
      snapped={x:sx,y:sy,straight:true,axis:isH?'h':'v',val:isH?sy:sx,snapGuides};
    } else {
      snapped={x,y,straight:false};
    }
    setDrawingEdgeSynced(d=>({...d,mouseX:snapped.x,mouseY:snapped.y,snapped:!!snapped.straight,snapAxis:snapped.straight?snapped.axis:null,snapVal:snapped.straight?snapped.val:null}));
  }};
  const handleSVGMouseUp=()=>{
    if(dragging&&dragging.moved){
      // Grid-Snap nur wenn kein Alignment-Guide aktiv war (sonst springt Element weg)
      if(snapGrid&&!guides.active){
        setNodes(prev=>prev.map(n=>{
          if(n.id!==dragging.id)return n;
          const isOp=n.type.startsWith("operator");
          const hw=isOp?24:NODE_W/2, hh=isOp?24:NODE_H/2;
          const sx=Math.round((n.x+hw)/GRID)*GRID-hw;
          const sy=Math.round((n.y+hh)/GRID)*GRID-hh;
          return{...n,x:sx,y:sy};
        }));
      }
      pushHistory(nodes,edges);
    }
    setDragging(null);setPanStart(null);setGuides({h:null,v:null,active:false});
  };
  const handleSVGMouseDown=e=>{
    if(e.button===1||(e.button===0&&e.altKey)){
      setPanStart({x:e.clientX,y:e.clientY,ox:canvasOffset.x,oy:canvasOffset.y});e.preventDefault();
    } else if(e.button===0){
      const tgt=e.target;
      const onBlankCanvas=tgt===svgRef.current||tgt.tagName==="svg"||tgt.classList?.contains("pan-bg");
      if(onBlankCanvas){
        if(!drawingEdgeRef.current) setSelected(null);
        setPanStart({x:e.clientX,y:e.clientY,ox:canvasOffset.x,oy:canvasOffset.y,maybeClick:true});
      } else if(!drawingEdgeRef.current){
        setSelected(null);
      }
    }
  };
  const handleWheel=e=>{
    e.preventDefault();
    const rect=svgRef.current.getBoundingClientRect();
    const mouseX=e.clientX-rect.left;
    const mouseY=e.clientY-rect.top;
    const factor=e.deltaY>0?0.92:1.08;
    setZoom(z=>{
      const newZoom=clamp(z*factor,0.2,3);
      // Shift canvas offset so the point under the mouse stays fixed
      setCanvasOffset(off=>({
        x: mouseX - (mouseX - off.x) * (newZoom/z),
        y: mouseY - (mouseY - off.y) * (newZoom/z),
      }));
      return newZoom;
    });
  };
  useEffect(()=>{const el=svgRef.current;if(!el)return;el.addEventListener("wheel",handleWheel,{passive:false});return()=>el.removeEventListener("wheel",handleWheel);});

  const handleNodeDblClick=(e,id)=>{e.stopPropagation();const node=nodes.find(n=>n.id===id);setEditingId(id);setEditText(node.label);};
  const commitNodeEdit=()=>{if(!editingId)return;const newNodes=nodes.map(n=>n.id===editingId?{...n,label:editText}:n);setNodes(newNodes);pushHistory(newNodes,edges);setEditingId(null);};
  const commitEdgeEdit=()=>{if(!editingEdgeId)return;const newEdges=edges.map(e=>e.id===editingEdgeId?{...e,label:editEdgeText}:e);setEdges(newEdges);pushHistory(nodes,newEdges);setEditingEdgeId(null);};

  const deleteSelected=()=>{if(!selected)return;if(selected.type==="node"){const nn=nodes.filter(n=>n.id!==selected.id);const ne=edges.filter(e=>e.from!==selected.id&&e.to!==selected.id);setNodes(nn);setEdges(ne);pushHistory(nn,ne);}else{const ne=edges.filter(e=>e.id!==selected.id);setEdges(ne);pushHistory(nodes,ne);}setSelected(null);};

  useEffect(()=>{
    const handler=e=>{
      const tag=document.activeElement?.tagName;if(tag==="INPUT"||tag==="TEXTAREA")return;
      // Arrow key panning
      const PAN_STEP=40;
      if(!e.ctrlKey&&!e.metaKey){
        if(e.key==="ArrowLeft"){setCanvasOffset(o=>({...o,x:o.x+PAN_STEP}));return;}
        if(e.key==="ArrowRight"){setCanvasOffset(o=>({...o,x:o.x-PAN_STEP}));return;}
        if(e.key==="ArrowUp"){setCanvasOffset(o=>({...o,y:o.y+PAN_STEP}));return;}
        if(e.key==="ArrowDown"){setCanvasOffset(o=>({...o,y:o.y-PAN_STEP}));return;}
      }
      if((e.ctrlKey||e.metaKey)&&e.key==="s"){e.preventDefault();saveDiagram();return;}
      if((e.ctrlKey||e.metaKey)&&e.key==="z"){e.preventDefault();undo();return;}
      if((e.ctrlKey||e.metaKey)&&(e.key==="y"||(e.shiftKey&&e.key==="z"))){e.preventDefault();redo();return;}
      if((e.ctrlKey||e.metaKey)&&e.key==="c"){if(selected?.type==="node"){const n=nodes.find(n=>n.id===selected.id);if(n)setClipboard({...n});}return;}
      if((e.ctrlKey||e.metaKey)&&e.key==="v"){if(clipboard){const id=uid();const newNode={...clipboard,id,x:clipboard.x+GRID*2,y:clipboard.y+GRID*2};const newNodes=[...nodes,newNode];setNodes(newNodes);pushHistory(newNodes,edges);setSelected({type:"node",id});nodesRef.current[id]=newNode;kick(id,0,26);}return;}
      if(e.key==="Delete"||e.key==="Backspace")deleteSelected();
    };
    window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);
  },[selected,nodes,edges,clipboard,undo,redo]);

  const handleColorsChange=(type,key,val)=>{
    if(type==="__reset__"){setColors(themeColors(theme));return;}
    if(type.startsWith("operator")){
      setColors(prev=>({...prev,
        operator_and:{...prev.operator_and,[key]:val},
        operator_or:{...prev.operator_or,[key]:val},
        operator_xor:{...prev.operator_xor,[key]:val}}));
      return;
    }
    setColors(prev=>({...prev,[type]:{...prev[type],[key]:val}}));
  };
  const nodeMap=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const accentOf=t=>(colors[t]||DEFAULT_COLORS[t]||DEFAULT_COLORS.funktion).accent;

  return(
    <>
      <style>{CSS}</style>
      <div id="mesh"><span className="m1"/><span className="m2"/><span className="m3"/><span className="m4"/><div className="grain"/><div className="veil"/></div>
      <div style={{position:"relative",zIndex:1,display:"flex",height:"100vh",color:"var(--text)",overflow:"hidden",fontFamily:FONT}}>

        {exportOpen&&(
          <div style={{position:"fixed",right:16,top:60,zIndex:9999,minWidth:140,
            borderRadius:"var(--r-md)",overflow:"hidden",
            boxShadow:"0 8px 32px rgba(0,0,0,0.6)",
            background:"rgba(12,14,19,0.99)",border:"1px solid var(--border)"}}>
            {[{fmt:"png",label:"🖼 PNG"},{fmt:"jpeg",label:"🖼 JPEG"},{fmt:"svg",label:"✦ SVG"}].map(({fmt,label})=>(
              <div key={fmt} className="menu-item" onClick={()=>{exportDiagram(nodes,edges,fmt,colors,diagramName,T);setExportOpen(false);}}
                style={{padding:"11px 18px",fontSize:13,fontWeight:600,color:"var(--text)",
                  borderBottom:"1px solid var(--border)",cursor:"pointer"}}>
                {label}
              </div>
            ))}
          </div>
        )}
        {showFAQ&&<FAQModal onClose={()=>setShowFAQ(false)}/>}
        {showOnboarding&&<OnboardingScreen onDone={()=>setShowOnboarding(false)}/>}
        {showProjects&&<ProjectManager currentName={diagramName} onLoad={loadDiagram} onNew={newDiagram} onClose={()=>setShowProjects(false)}/>}
        {showSettings&&<SettingsPanel theme={theme} onTheme={applyTheme} colors={colors} onColorsChange={handleColorsChange} snapGrid={snapGrid} onSnapGrid={setSnapGrid} showGrid={showGrid} onShowGrid={setShowGrid} wobble={wobble} onWobble={setWobble} snapLines={snapLines} onSnapLines={setSnapLines} onClose={()=>setShowSettings(false)} onFAQ={()=>{setShowSettings(false);setShowFAQ(true);}}/>}

        {/* PALETTE */}
        <aside className="glass" style={{width:220,display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0,borderTop:"none",borderBottom:"none",borderLeft:"none",margin:12,marginRight:0,borderRadius:"var(--r-lg)"}}>
          <div style={{padding:"18px 18px 12px",display:"flex",alignItems:"center",gap:9}}>
            <span style={{width:9,height:9,borderRadius:3,background:"var(--emerald)",boxShadow:`0 0 10px ${rgba("#ddb878",0.8)}`}}/>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"var(--muted)"}}>EPK ELEMENTE</span>
          </div>
          <div style={{padding:"4px 10px 10px",display:"flex",flexDirection:"column",gap:2}}>
            {PALETTE.map(item=>{const isOp=item.type.startsWith("operator");const w=isOp?42:92,h=isOp?42:36;return(
              <div key={item.type} className="pal-item" draggable
                onDragStart={e=>{
                  paletteDragRef.current=true;
                  setIsPaletteDrag(true);
                  e.dataTransfer.setData("epk-type",item.type);
                  e.dataTransfer.setData("epk-label",item.label);
                  setDrawingEdgeSynced(null);
                  setDragging(null);
                  setHoveredPort(null);
                }}
                onDragEnd={()=>{paletteDragRef.current=false;setIsPaletteDrag(false);setDrawingEdgeSynced(null);}}
                onMouseDown={e=>e.stopPropagation()} style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{flexShrink:0,width:96,display:"flex",justifyContent:"center"}}><ShapeRenderer type={item.type} label="" width={w} height={h} colors={colors} fx={T.fx} preview/></div>
                <div style={{minWidth:0}}><div style={{fontSize:12.5,fontWeight:600,color:"var(--text)"}}>{item.label}</div><div style={{fontSize:10.5,color:"var(--faint)",marginTop:1}}>{item.desc}</div></div>
              </div>);
            })}
          </div>
          <div style={{marginTop:"auto",padding:"14px 18px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:10,color:"var(--faint)",lineHeight:1.9}}>
              <div style={{color:"var(--muted)",fontWeight:700,marginBottom:5,letterSpacing:1}}>SHORTCUTS</div>
              {[["Drag","→ Canvas"],["Port ziehen","Verbinden"],["Doppelklick","Umbenennen"],["Entf","Löschen"],["Strg+S","Speichern"],["Strg+Z / Y","Undo / Redo"],["Strg+C / V","Kopieren"],["Ziehen / Pfeiltasten","Pan"],["Scroll","Zoom"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",gap:8}}><span>{k}</span><span style={{color:"var(--dim)"}}>{v}</span></div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,padding:12,gap:12}}>

          {/* Toolbar */}
          <div className="glass" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:"var(--r-xl)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:11,paddingRight:14,borderRight:"1px solid var(--border)",marginRight:5}}>
              <div className="logo-mark"><TrioLogo size={27} glow={false}/></div>
              <span className="logo-title"><b style={{fontWeight:800,background:"linear-gradient(120deg,var(--text),var(--accent-2))",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"}}>Flowra</b></span>
            </div>

            {editingName
              ?<input autoFocus value={diagramName} onChange={e=>setDiagramName(e.target.value)} onBlur={()=>setEditingName(false)} onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")setEditingName(false);}} className="prop-input" style={{width:200}}/>
              :<span className="name-chip" onDoubleClick={()=>setEditingName(true)} title="Doppelklick zum Umbenennen">{diagramName}</span>
            }

            <div style={{width:1,height:26,background:"var(--border)",margin:"0 5px",flexShrink:0}}/>
            <button className="tbtn icon" onClick={undo} title="Rückgängig (Strg+Z)"><Icon name="undo"/></button>
            <button className="tbtn icon" onClick={redo} title="Wiederholen (Strg+Y)"><Icon name="redo"/></button>
            <button className="tbtn" onClick={()=>setShowProjects(true)} title="Projekte"><Icon name="folder"/> Projekte</button>
            <button className="tbtn" onClick={saveDiagram} title="Speichern (Strg+S)" style={{
              color:saveStatus==="saved"?"var(--c-dokument)":saveStatus==="error"?"var(--danger,#ff7a8a)":undefined}}>
              <Icon name="save"/>{saveStatus==="saving"?"…":saveStatus==="saved"?"Gespeichert":saveStatus==="error"?"Fehler":"Speichern"}
            </button>
            <button className="tbtn icon" onClick={()=>setShowSettings(true)} title="Einstellungen"><Icon name="settings"/></button>

            <div style={{flex:1}}/>

            <div className="zoom-group">
              <button className="tbtn icon" onClick={()=>setZoom(z=>clamp(z*0.83,0.2,3))} title="Verkleinern"><Icon name="minus" strokeWidth={2.2}/></button>
              <span className="zoom-label">{Math.round(zoom*100)}%</span>
              <button className="tbtn icon" onClick={()=>setZoom(z=>clamp(z*1.2,0.2,3))} title="Vergrößern"><Icon name="plus" strokeWidth={2.2}/></button>
              <button className="tbtn" style={{fontSize:12}} onClick={()=>{setZoom(1);setCanvasOffset({x:80,y:60});}}>Reset</button>
            </div>

            <div style={{position:"relative"}}>
              <button className="tbtn accent" onClick={()=>setExportOpen(o=>!o)}>
                <Icon name="download"/> Export <Icon name={exportOpen?"chevUp":"chevDown"} size={13}/>
              </button>
            </div>

            <button className="tbtn danger icon" onClick={deleteSelected} title="Löschen (Entf)"
              style={{opacity:selected?1:0.35,pointerEvents:selected?"auto":"none"}}>
              <Icon name="trash"/>
            </button>
          </div>

          {/* Canvas */}
          <div className="glass" style={{flex:1,position:"relative",overflow:"hidden",borderRadius:"var(--r-lg)",background:"rgba(7,8,11,0.55)"}}
            onDrop={handleCanvasDrop} onDragOver={e=>{e.preventDefault();if(drawingEdge)setDrawingEdgeSynced(null);}} onClick={()=>setExportOpen(false)}>

            {nodes.length===0&&(
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none",gap:14}}>
                <div style={{width:64,height:64,borderRadius:18,border:"1.5px dashed var(--border-strong)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"var(--dim)"}}>⬡</div>
                <div style={{fontSize:15,fontWeight:600,color:"var(--faint)"}}>EPK-Elemente hierher ziehen</div>
                <div style={{fontSize:12,color:"var(--dim)"}}>Aus der Palette links auswählen</div>
              </div>
            )}

            <svg ref={svgRef} width="100%" height="100%"
              style={{cursor:drawingEdge?"crosshair":(panStart?"grabbing":"grab"),userSelect:"none",display:"block"}}
              onMouseMove={handleSVGMouseMove} onMouseUp={handleSVGMouseUp} onMouseDown={handleSVGMouseDown}>
              <defs>
                <pattern id="grid" width={GRID*zoom} height={GRID*zoom} patternUnits="userSpaceOnUse" x={canvasOffset.x%(GRID*zoom)} y={canvasOffset.y%(GRID*zoom)}>
                  <circle cx={0} cy={0} r={1.1} fill="rgba(255,255,255,0.16)"/>
                </pattern>
              </defs>
              <rect className="pan-bg" width="100%" height="100%" fill="transparent"/>
              {guides.v!=null&&<line x1={guides.v*zoom+canvasOffset.x} y1={0} x2={guides.v*zoom+canvasOffset.x} y2="100%" stroke="var(--accent)" strokeWidth={1} opacity={0.6} strokeDasharray="4 3" style={{pointerEvents:"none"}}/>}
              {guides.h!=null&&<line x1={0} y1={guides.h*zoom+canvasOffset.y} x2="100%" y2={guides.h*zoom+canvasOffset.y} stroke="var(--accent)" strokeWidth={1} opacity={0.6} strokeDasharray="4 3" style={{pointerEvents:"none"}}/>}
              {drawingEdge&&(()=>{
                if(!drawingEdge.snapped)return null;
                const wps=drawingEdge.waypoints||[];
                const ref2=wps.length>0?wps[wps.length-1]:(()=>{const fn=nodes.find(n=>n.id===drawingEdge.fromId);return fn?getPortPoint(fn,drawingEdge.fromDir):null;})();
                if(!ref2)return null;
                // Zeige Hilfslinie auf der gesperrten Achse (wo die Linie gerade verläuft)
                const lockGuide=drawingEdge.snapAxis==='h'
                  ?<line key="lock" x1={0} y1={ref2.y*zoom+canvasOffset.y} x2="100%" y2={ref2.y*zoom+canvasOffset.y} stroke="var(--accent-2)" strokeWidth={1} opacity={0.5} strokeDasharray="5 4" style={{pointerEvents:"none"}}/>
                  :<line key="lock" x1={ref2.x*zoom+canvasOffset.x} y1={0} x2={ref2.x*zoom+canvasOffset.x} y2="100%" stroke="var(--accent-2)" strokeWidth={1} opacity={0.5} strokeDasharray="5 4" style={{pointerEvents:"none"}}/>;
                // Zeige Hilfslinie auf der freien Achse (wo der Mauszeiger ist)
                const freeGuide=drawingEdge.snapAxis==='h'
                  ?<line key="free" x1={drawingEdge.mouseX*zoom+canvasOffset.x} y1={0} x2={drawingEdge.mouseX*zoom+canvasOffset.x} y2="100%" stroke="var(--accent-2)" strokeWidth={1.2} opacity={0.8} strokeDasharray="6 4" style={{pointerEvents:"none"}}/>
                  :<line key="free" x1={0} y1={drawingEdge.mouseY*zoom+canvasOffset.y} x2="100%" y2={drawingEdge.mouseY*zoom+canvasOffset.y} stroke="var(--accent-2)" strokeWidth={1.2} opacity={0.8} strokeDasharray="6 4" style={{pointerEvents:"none"}}/>;
                return <>{lockGuide}{freeGuide}</>;
              })()}
              {showGrid&&<rect className="pan-bg" width="100%" height="100%" fill="url(#grid)"/>}
              <g transform={`translate(${canvasOffset.x},${canvasOffset.y}) scale(${zoom})`}>
                {edges.map(edge=>{const a=nodeMap[edge.from],b=nodeMap[edge.to];if(!a||!b)return null;const p1=edge.fromDir?getPortPoint(a,edge.fromDir):getClosestPorts(a,b).p1;const p2=edge.toDir?getPortPoint(b,edge.toDir):getClosestPorts(a,b).p2;return<Arrow key={edge.id} from={p1} to={p2} selected={selected?.type==="edge"&&selected.id===edge.id} label={edge.label||""} lineStyle={edge.lineStyle||"arrow"} isSnapped={false} waypoints={edge.waypoints||[]} ortho={snapLines} onClickEdge={e=>{e.stopPropagation();setSelected({type:"edge",id:edge.id});}} onDblClickLabel={()=>{setEditingEdgeId(edge.id);setEditEdgeText(edge.label||"");}}/>;
                })}
                {drawingEdge&&(()=>{const fromNode=nodes.find(n=>n.id===drawingEdge.fromId);if(!fromNode)return null;const fp=getPortPoint(fromNode,drawingEdge.fromDir);return<Arrow from={fp} to={{x:drawingEdge.mouseX,y:drawingEdge.mouseY}} drawing selected={false} isSnapped={drawingEdge.snapped} waypoints={drawingEdge.waypoints||[]} label="" onClickEdge={()=>{}}/>;})()}
                {nodes.map(node=>{
                  const{w,h}=getNodeSize(node);
                  const isSel=selected?.type==="node"&&selected.id===node.id;
                  const showPorts=!isPaletteDrag&&(isSel||!!drawingEdge||hoverNode===node.id);
                  const isDrawTarget=drawingEdge&&!isSel&&hoverNode===node.id&&drawingEdge.fromId!==node.id;
                  return(
                    <g key={node.id} transform={`translate(${node.x},${node.y})`}
                      onMouseDown={e=>handleNodeMouseDown(e,node.id)}
                      onDoubleClick={e=>handleNodeDblClick(e,node.id)}
                      onMouseEnter={()=>setHoverNode(node.id)}
                      onMouseLeave={()=>setHoverNode(h=>h===node.id?null:h)}
                      style={{cursor:"move"}}>
                      {isDrawTarget&&(node.type.startsWith("operator")
                      ?<circle cx={(node.w||NODE_W)/2} cy={(node.h||NODE_H)/2} r={(node.w||NODE_W)/2+10} fill="none" stroke="var(--accent)" strokeWidth={2} opacity={0.7} style={{animation:"ringpulse 1s ease-in-out infinite"}}/>
                      :<rect x={-10} y={-10} width={(node.w||NODE_W)+20} height={(node.h||NODE_H)+20} rx={18} fill="none" stroke="var(--accent)" strokeWidth={2} opacity={0.7} style={{animation:"ringpulse 1s ease-in-out infinite"}}/>
                    )}
                    <g ref={el=>{if(el)wobbleRefs.current[node.id]=el;else delete wobbleRefs.current[node.id];}}>
                        <ShapeRenderer type={node.type} label={editingId===node.id?"":node.label} width={w} height={h} selected={isSel} colors={colors} fx={T.fx} override={node.color}/>
                        {showPorts&&getAllPorts(node).map(port=>{
                          const hov=hoveredPort?.nodeId===node.id&&hoveredPort?.dir===port.dir;
                          return(<circle key={port.dir} className="port-dot" cx={port.x-node.x} cy={port.y-node.y} r={hov?8.5:6}
                            fill={drawingEdge?"#dd9189":accentOf(node.type)} stroke="#05060a" strokeWidth={1.6}
                            style={{filter:`drop-shadow(0 0 5px ${rgba(drawingEdge?"#dd9189":accentOf(node.type),0.9)})`}}
                            onMouseDown={e=>handlePortMouseDown(e,node.id,port.dir)}
                            onMouseUp={e=>handlePortMouseUp(e,node.id,port.dir)}
                            onMouseEnter={()=>setHoveredPort({nodeId:node.id,dir:port.dir})}
                            onMouseLeave={()=>setHoveredPort(null)}/>);
                        })}
                      </g>
                    </g>);
                })}
              </g>
            </svg>

            {editingId&&(()=>{const node=nodes.find(n=>n.id===editingId);if(!node)return null;const{w,h}=getNodeSize(node);const sx=node.x*zoom+canvasOffset.x+w*zoom/2,sy=node.y*zoom+canvasOffset.y+h*zoom/2;const lines=(editText.match(/\n/g)||[]).length+1;return<textarea autoFocus value={editText} onChange={e=>setEditText(e.target.value)} onBlur={commitNodeEdit} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();commitNodeEdit();}if(e.key==="Escape")setEditingId(null);}} rows={Math.max(2,lines)} style={{position:"absolute",left:sx-72,top:sy-15,width:144,textAlign:"center",background:"rgba(10,12,18,0.96)",color:"var(--text)",border:"1.5px solid var(--emerald)",borderRadius:8,fontSize:13,fontWeight:600,padding:"5px 8px",zIndex:10,boxShadow:`0 0 14px ${rgba("#ddb878",0.4)}`,resize:"none",lineHeight:1.4}}/>;})()}
            {editingEdgeId&&(()=>{const edge=edges.find(e=>e.id===editingEdgeId);if(!edge)return null;const a=nodeMap[edge.from],b=nodeMap[edge.to];if(!a||!b)return null;const{p1,p2}=getClosestPorts(a,b);const mx=(p1.x+p2.x)/2*zoom+canvasOffset.x,my=(p1.y+p2.y)/2*zoom+canvasOffset.y;return<input autoFocus value={editEdgeText} placeholder="Label…" onChange={e=>setEditEdgeText(e.target.value)} onBlur={commitEdgeEdit} onKeyDown={e=>{if(e.key==="Enter")commitEdgeEdit();if(e.key==="Escape")setEditingEdgeId(null);}} style={{position:"absolute",left:mx-60,top:my-13,width:120,textAlign:"center",background:"rgba(10,12,18,0.96)",color:"var(--text)",border:"1.5px solid var(--cyan)",borderRadius:8,fontSize:12,fontWeight:600,padding:"4px 8px",zIndex:10}}/>;})()}
          </div>
        </div>

        {/* PROPERTIES */}
        <aside className="glass" style={{width:208,display:"flex",flexDirection:"column",gap:12,flexShrink:0,margin:12,marginLeft:0,padding:"18px 16px",borderRadius:"var(--r-lg)"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"var(--muted)"}}>EIGENSCHAFTEN</div>
          {selected?.type==="node"&&(()=>{const node=nodes.find(n=>n.id===selected.id);if(!node)return null;const item=PALETTE.find(p=>p.type===node.type);const acc=accentOf(node.type);return(
            <div className="pop-in" style={{display:"flex",flexDirection:"column",gap:9}}>
              <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",background:"var(--glass)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
                <span style={{width:10,height:10,borderRadius:3,background:acc,boxShadow:`0 0 8px ${rgba(acc,0.8)}`}}/>
                <div><div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{item?.label}</div><div style={{fontSize:10.5,color:"var(--faint)"}}>{item?.desc}</div></div>
              </div>
              <div style={{fontSize:11,color:"var(--faint)",marginTop:2}}>Bezeichnung</div>
              <textarea value={node.label} onChange={e=>setNodes(prev=>prev.map(n=>n.id===node.id?{...n,label:e.target.value}:n))} onBlur={()=>pushHistory(nodes,edges)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey)e.preventDefault();}} rows={Math.max(2,(node.label.match(/\n/g)||[]).length+1)} style={{background:"var(--glass)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)",padding:"8px 10px",fontSize:12.5,width:"100%",resize:"none",lineHeight:1.4,fontFamily:FONT}}/>
              <div style={{fontSize:10,color:"var(--dim)"}}>Shift+Enter = neue Zeile</div>
              <div style={{fontSize:11,color:"var(--faint)",marginTop:4}}>Breite</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="range" min={80} max={300} value={node.w||NODE_W} step={5} onChange={e=>setNodes(prev=>prev.map(n=>n.id===node.id?{...n,w:Number(e.target.value)}:n))} onMouseUp={()=>pushHistory(nodes,edges)} style={{flex:1,accentColor:"var(--emerald)",cursor:"pointer"}}/>
                <span style={{fontSize:11,color:"var(--emerald)",fontFamily:"'Space Mono',monospace",minWidth:28}}>{node.w||NODE_W}</span>
              </div>
              <div style={{fontSize:11,color:"var(--faint)"}}>Höhe</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="range" min={5} max={300} value={node.h||NODE_H} step={5} onChange={e=>setNodes(prev=>prev.map(n=>n.id===node.id?{...n,h:Number(e.target.value)}:n))} onMouseUp={()=>pushHistory(nodes,edges)} style={{flex:1,accentColor:"var(--emerald)",cursor:"pointer"}}/>
                <span style={{fontSize:11,color:"var(--emerald)",fontFamily:"'Space Mono',monospace",minWidth:28}}>{node.h||NODE_H}</span>
              </div>
              <div style={{fontSize:11,color:"var(--faint)",marginTop:4}}>Farbe</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                {["#5fd07a","#5b93ff","#b07cff","#34cfe0","#2fd6c0","#ff7a8a","#ffc24b","#a3e0bd","#f4c4ac"].map(col=>(
                  <div key={col} className="swatch" onClick={()=>{const nn=nodes.map(n=>n.id===node.id?{...n,color:col}:n);setNodes(nn);pushHistory(nn,edges);}}
                    style={{width:24,height:24,borderRadius:7,background:col,
                      border:node.color===col?"2px solid #fff":"2px solid transparent",
                      boxShadow:node.color===col?`0 0 10px ${col}`:"none"}}/>
                ))}
                <label className="swatch" title="Eigene Farbe" style={{width:24,height:24,borderRadius:7,border:"2px dashed var(--border-strong)",display:"grid",placeItems:"center",cursor:"pointer",position:"relative",overflow:"hidden"}}>
                  <span style={{fontSize:13,color:"var(--muted)"}}>+</span>
                  <input type="color" value={node.color||accentOf(node.type)} onChange={e=>{const nn=nodes.map(n=>n.id===node.id?{...n,color:e.target.value}:n);setNodes(nn);}} onBlur={()=>pushHistory(nodes,edges)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
                </label>
              </div>
              {node.color&&<div onClick={()=>{const nn=nodes.map(n=>n.id===node.id?(()=>{const{color,...rest}=n;return rest;})():n);setNodes(nn);pushHistory(nn,edges);}}
                style={{fontSize:10.5,color:"var(--faint)",cursor:"pointer",textDecoration:"underline",marginTop:2}}>↺ auf Typfarbe zurücksetzen</div>}
            </div>);})()}
          {selected?.type==="edge"&&(()=>{const edge=edges.find(e=>e.id===selected.id);if(!edge)return null;
            const ls=edge.lineStyle||"arrow";
            const lineTypes=[{id:"arrow",label:"→ Pfeil"},{id:"dashed",label:"- - → Gestrichelt"},{id:"dashed-line",label:"- - - Gestrichelt (kein Pfeil)"},{id:"line",label:"—— Linie"}];
            return(
            <div className="pop-in" style={{display:"flex",flexDirection:"column",gap:9}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>Kontrollfluss</div>
              <div style={{fontSize:11,color:"var(--faint)"}}>Linientyp</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {lineTypes.map(lt=>(
                  <div key={lt.id} onClick={()=>{const ne=edges.map(ed=>ed.id===edge.id?{...ed,lineStyle:lt.id}:ed);setEdges(ne);pushHistory(nodes,ne);}}
                    style={{padding:"7px 10px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,
                      background:ls===lt.id?rgba("#ddb878",0.15):"var(--glass)",
                      border:`1px solid ${ls===lt.id?"#ddb878":"var(--border)"}`,
                      color:ls===lt.id?"#ddb878":"var(--muted)",transition:"all .15s"}}>
                    {lt.label}
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:"var(--faint)"}}>Label</div>
              <input value={edge.label||""} onChange={e=>setEdges(prev=>prev.map(ed=>ed.id===edge.id?{...ed,label:e.target.value}:ed))} onBlur={()=>pushHistory(nodes,edges)} placeholder="optional…" style={{background:"var(--glass)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)",padding:"8px 10px",fontSize:12.5,width:"100%"}}/>
              <div style={{fontSize:10,color:"var(--dim)",marginTop:1}}>oder Doppelklick auf den Pfeil</div>
            </div>);})()}
          {!selected&&<div style={{fontSize:11.5,color:"var(--dim)",lineHeight:1.9}}>Element auswählen, um Eigenschaften zu bearbeiten.</div>}
          <div style={{marginTop:"auto",borderTop:"1px solid var(--border)",paddingTop:12,display:"flex",flexDirection:"column",gap:6}}>
            {[["Elemente",nodes.length],["Verbindungen",edges.length]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:11.5}}>
                <span style={{color:"var(--faint)"}}>{l}</span>
                <span style={{color:"var(--emerald)",fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{v}</span>
              </div>
            ))}
            <div style={{fontSize:10.5,color:"var(--dim)",marginTop:4,display:"flex",justifyContent:"space-between"}}>
              <span>Snap</span><span style={{color:snapGrid?"var(--emerald)":"var(--faint)"}}>{snapGrid?"AN":"AUS"}</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}