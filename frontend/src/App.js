import React, { useState, useRef, useEffect, useCallback, useId } from "react";

const API_BASE = "http://localhost:9876/api";

// ─── CSS (Aurora + Glass + Animations) ────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  :root {
    --bg:#050507;--bg-canvas:#07080b;
    --glass:rgba(255,255,255,0.045);--glass-strong:rgba(255,255,255,0.075);--glass-hover:rgba(255,255,255,0.10);
    --border:rgba(255,255,255,0.085);--border-strong:rgba(255,255,255,0.15);
    --text:#e9ecf1;--muted:#9aa0ab;--faint:#5b616c;--dim:#3a3f49;
    --emerald:#ddb878;--cyan:#dd9189;--violet:#bda7d6;--blue:#8fb1cf;--teal:#84bcaa;--rose:#dd9189;--amber:#e6c079;
    --accent:#ddb878;--accent-soft:rgba(221,184,120,0.16);
    --shadow:0 24px 60px rgba(0,0,0,0.55),0 4px 16px rgba(0,0,0,0.4);
    --r-lg:18px;--r-md:12px;--r-sm:8px;
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;height:100%;background:var(--bg);color:var(--text);font-family:'Space Grotesk',system-ui,sans-serif;overflow:hidden;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:8px;height:8px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.10);border-radius:4px;}
  ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.18);}
  .glass{background:var(--glass);backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5);border:1px solid var(--border);}
  .tbtn{background:var(--glass);border:1px solid var(--border);color:var(--muted);border-radius:var(--r-sm);cursor:pointer;transition:background .18s,color .18s,border-color .18s,transform .12s cubic-bezier(.34,1.56,.64,1),box-shadow .18s;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;}
  .tbtn:hover{background:var(--glass-hover);color:var(--text);border-color:var(--border-strong);transform:translateY(-1px);}
  .tbtn:active{transform:translateY(0) scale(.95);}
  .pal-item{cursor:grab;transition:background .2s,transform .16s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;border-radius:var(--r-md);border:1px solid transparent;}
  .pal-item:hover{background:var(--glass-strong);border-color:var(--border);transform:translateX(4px);box-shadow:0 8px 24px rgba(0,0,0,0.3);}
  .pal-item:active{cursor:grabbing;transform:translateX(4px) scale(.98);}
  .port-dot{cursor:crosshair;transition:r .14s cubic-bezier(.34,1.56,.64,1);}
  .menu-item{transition:background .14s,color .14s;cursor:pointer;}
  .menu-item:hover{background:var(--glass-hover);color:var(--text)!important;}
  .name-chip{transition:background .18s,border-color .18s,color .18s;border:1px solid transparent;}
  .name-chip:hover{background:var(--glass);border-color:var(--border);color:var(--text)!important;}
  .sel-ring{animation:ringpulse 1.8s ease-in-out infinite;}
  @keyframes ringpulse{0%,100%{opacity:.9}50%{opacity:.45}}
  .dash-flow{stroke-dasharray:7 5;animation:dashmove .7s linear infinite;}
  @keyframes dashmove{to{stroke-dashoffset:-12}}
  .pop-in{animation:popIn .42s cubic-bezier(.34,1.56,.64,1);}
  @keyframes popIn{0%{opacity:0;transform:translateY(8px) scale(.96)}100%{opacity:1;transform:translateY(0) scale(1)}}
  .swatch{cursor:pointer;transition:transform .14s,box-shadow .18s;}
  .swatch:hover{transform:scale(1.12);}
  .toggle-track{transition:background .22s;cursor:pointer;}
  .toggle-knob{transition:left .24s cubic-bezier(.34,1.56,.64,1);}
  input{font-family:inherit;}input:focus{outline:none;}
  #aurora{position:fixed;inset:0;z-index:0;overflow:hidden;background:var(--bg);pointer-events:none;}
  #aurora::before,#aurora::after,#aurora .blob{content:"";position:absolute;border-radius:50%;filter:blur(100px);opacity:0.34;will-change:transform;}
  #aurora::before{width:52vw;height:52vw;left:-8vw;top:-12vw;background:radial-gradient(circle at 30% 30%,rgba(226,161,124,0.55),rgba(226,161,124,0) 70%);animation:drift1 26s ease-in-out infinite;}
  #aurora::after{width:46vw;height:46vw;right:-10vw;top:8vh;background:radial-gradient(circle at 60% 40%,rgba(230,192,121,0.46),rgba(230,192,121,0) 70%);animation:drift2 32s ease-in-out infinite;}
  #aurora .blob{width:44vw;height:44vw;left:28vw;bottom:-22vw;background:radial-gradient(circle at 50% 50%,rgba(221,145,137,0.42),rgba(221,145,137,0) 70%);animation:drift3 38s ease-in-out infinite;}
  #aurora .veil{position:absolute;inset:0;filter:none;opacity:1;border-radius:0;background:radial-gradient(120% 90% at 50% 40%,rgba(5,5,7,0) 40%,rgba(5,5,7,0.55) 100%);}
  @keyframes drift1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(8vw,6vh) scale(1.15)}66%{transform:translate(-4vw,10vh) scale(0.95)}}
  @keyframes drift2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-9vw,8vh) scale(1.12)}70%{transform:translate(5vw,-4vh) scale(0.9)}}
  @keyframes drift3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-7vw,-10vh) scale(1.2)}}
  @media(prefers-reduced-motion:reduce){#aurora::before,#aurora::after,#aurora .blob{animation:none}}
`;

// ─── Constants & helpers ───────────────────────────────────────────────────
const DEFAULT_COLORS = {
  ereignis:             { accent:"#9fc08c", text:"#f4f7ee" },
  funktion:             { accent:"#e2a17c", text:"#fcf1ea" },
  organisationseinheit: { accent:"#bda7d6", text:"#f6f1fb" },
  informationsobjekt:   { accent:"#8fb1cf", text:"#eef4fa" },
  dokument:             { accent:"#84bcaa", text:"#ecf8f3" },
  prozesspfad:          { accent:"#dd9189", text:"#fdf0ee" },
  operator_and:         { accent:"#e6c079", text:"#fdf6e6" },
  operator_or:          { accent:"#e6c079", text:"#fdf6e6" },
  operator_xor:         { accent:"#e6c079", text:"#fdf6e6" },
};
const NODE_W=140, NODE_H=64, PADDING=60, GRID=10;
const FONT="'Space Grotesk',sans-serif";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rgba=(hex,a)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;};

// ─── Trio Logo (Trifoil) ───────────────────────────────────────────────────
// Three petal-shaped leaves rotated 0/120/240° around center, gold radial gradient.
function TrioLogo({size=40, glow=true}){
  const gid = useId().replace(/:/g,"");
  const gradId = `trifoil${gid}`;
  const blurId = `tblur${gid}`;
  // petal path from reference (drawn around origin, pointing up), scaled to viewBox 0..100
  const petal = "M0 0 C 27 -15.12, 14.85 -36, 0 -36 C -14.85 -36, -27 -15.12, 0 0 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{display:"block",overflow:"visible"}}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#f3dca8"/>
          <stop offset="100%" stopColor="#ddb878"/>
        </radialGradient>
        {glow&&<filter id={blurId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6"/>
        </filter>}
      </defs>
      {glow&&<circle cx="50" cy="49" r="30" fill="rgba(221,184,120,0.4)" filter={`url(#${blurId})`} opacity="0.7"/>}
      <g transform="translate(50 50)">
        <path d={petal} transform="rotate(0)"   fill="none" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
        <path d={petal} transform="rotate(120)" fill="none" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
        <path d={petal} transform="rotate(240)" fill="none" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
        <circle r="5" fill="#ddb878" opacity="0.92"/>
      </g>
    </svg>
  );
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

// ─── ShapeRenderer ────────────────────────────────────────────────────────
function ShapeRenderer({type,label,width=NODE_W,height=NODE_H,selected,dimmed,colors,preview}){
  const gid=useId().replace(/:/g,"");
  const c=(colors&&colors[type])||DEFAULT_COLORS[type]||DEFAULT_COLORS.funktion;
  const accent=c.accent,txt=c.text;
  const fillId=`f${gid}`,sheenId=`s${gid}`;
  const opacity=dimmed?0.28:1;
  const fontSize=type.startsWith("operator")?13:(label&&label.length>16?11:12.5);
  const glow=selected?`drop-shadow(0 0 2px ${rgba(accent,0.7)}) drop-shadow(0 0 10px ${rgba(accent,0.38)})`:
    `drop-shadow(0 2px 6px rgba(0,0,0,0.45)) drop-shadow(0 0 5px ${rgba(accent,preview?0.16:0.2)})`;
  const defs=(<defs>
    <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor={accent} stopOpacity="0.26"/>
      <stop offset="48%"  stopColor="#0b0e14" stopOpacity="0.86"/>
      <stop offset="100%" stopColor="#070910" stopOpacity="0.94"/>
    </linearGradient>
    <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.16"/>
      <stop offset="14%" stopColor="#ffffff" stopOpacity="0"/>
    </linearGradient>
  </defs>);
  const fill=`url(#${fillId})`,strokeW=1.8;
  const ss={filter:glow,opacity,transition:"filter .22s ease"};
  const lines=(label||"").split("\n");
  const lineH=fontSize*1.4;
  // For dokument the wave eats into bottom, so visual center shifts up slightly
  const centerY = type==="dokument" ? (height-11)/2 : height/2;
  const textEl=(
    <text x={width/2} textAnchor="middle"
      fill={txt} fontSize={fontSize} fontWeight="600" fontFamily={FONT}
      style={{pointerEvents:"none",userSelect:"none",letterSpacing:"0.2px"}}>
      {lines.map((l,i)=>{
        const startY=centerY-(lines.length-1)*lineH/2;
        return<tspan key={i} x={width/2} y={startY+i*lineH} dominantBaseline="middle">{l||" "}</tspan>;
      })}
    </text>
  );
  const isOp=type.startsWith("operator");
  const selRing=selected?(isOp
    ?<circle className="sel-ring" cx={width/2} cy={height/2} r={Math.min(width,height)/2+5}
        fill="none" stroke={accent} strokeWidth={1.4} opacity={0.85}
        style={{filter:`drop-shadow(0 0 6px ${rgba(accent,0.7)})`}}/>
    :<rect className="sel-ring" x={-6} y={-6} width={width+12} height={height+12}
        rx={14} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.85}
        style={{filter:`drop-shadow(0 0 6px ${rgba(accent,0.7)})`}}/>
  ):null;
  switch(type){
    case"ereignis":{const ind=20;const pts=[[ind,0],[width-ind,0],[width,height/2],[width-ind,height],[ind,height],[0,height/2]].map(p=>p.join(",")).join(" ");
      return<svg width={width} height={height} overflow="visible">{defs}{selRing}<polygon points={pts} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/><polygon points={pts} fill={`url(#${sheenId})`} opacity={opacity}/>{textEl}</svg>;}
    case"funktion":
      return<svg width={width} height={height} overflow="visible">{defs}{selRing}<rect x={0} y={0} width={width} height={height} rx={14} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/><rect x={0} y={0} width={width} height={height} rx={14} fill={`url(#${sheenId})`} opacity={opacity}/>{textEl}</svg>;
    case"organisationseinheit":
      return<svg width={width} height={height} overflow="visible">{defs}{selRing}<ellipse cx={width/2} cy={height/2} rx={width/2} ry={height/2} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/><line x1={width*0.2} y1={0} x2={width*0.2} y2={height} stroke={rgba(accent,0.55)} strokeWidth={1.4} opacity={opacity}/>{textEl}</svg>;
    case"informationsobjekt":
      return<svg width={width} height={height} overflow="visible">{defs}{selRing}<rect x={0} y={0} width={width} height={height} rx={3} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/><line x1={width*0.2} y1={0} x2={width*0.2} y2={height} stroke={rgba(accent,0.5)} strokeWidth={1.2} opacity={opacity}/><line x1={width*0.8} y1={0} x2={width*0.8} y2={height} stroke={rgba(accent,0.5)} strokeWidth={1.2} opacity={opacity}/>{textEl}</svg>;
    case"dokument":{const wH=11;const path=`M 3 0 L ${width-3} 0 Q ${width} 0 ${width} 4 L ${width} ${height-wH} Q ${width*0.75} ${height+wH*0.5} ${width*0.5} ${height-wH} Q ${width*0.25} ${height-wH*2.5} 0 ${height-wH} L 0 4 Q 0 0 3 0 Z`;
      return<svg width={width} height={height+wH} overflow="visible">{defs}{selRing}<path d={path} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/><text x={width/2} y={(height-wH)/2+1} textAnchor="middle" dominantBaseline="middle" fill={txt} fontSize={fontSize} fontWeight="600" fontFamily={FONT} style={{pointerEvents:"none",userSelect:"none",letterSpacing:"0.2px"}}>{label}</text></svg>;}
    case"prozesspfad":{const aW=22;const pts=[[0,0],[width-aW,0],[width,height/2],[width-aW,height],[0,height]].map(p=>p.join(",")).join(" ");
      return<svg width={width} height={height} overflow="visible">{defs}{selRing}<polygon points={pts} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/><polygon points={pts} fill={`url(#${sheenId})`} opacity={opacity}/>{textEl}</svg>;}
    case"operator_and":case"operator_or":case"operator_xor":{const lm={operator_and:"AND",operator_or:"OR",operator_xor:"XOR"};const r=Math.min(width,height)/2-2;
      return<svg width={width} height={height} overflow="visible">{defs}{selRing}<circle cx={width/2} cy={height/2} r={r} fill={fill} stroke={accent} strokeWidth={strokeW} style={ss}/><circle cx={width/2} cy={height/2} r={r} fill={`url(#${sheenId})`} opacity={opacity}/><text x={width/2} y={height/2+0.5} textAnchor="middle" dominantBaseline="middle" fill={txt} fontSize={r>16?12.5:10.5} fontWeight="700" fontFamily={FONT} style={{pointerEvents:"none",userSelect:"none",letterSpacing:"0.5px"}}>{lm[type]}</text></svg>;}
    default:return null;
  }
}

// lineStyle: "arrow" | "dashed" | "line"
// ─── Arrow ─────────────────────────────────────────────────────────────────
function Arrow({from,to,selected,label,onClickEdge,onDblClickLabel,isSnapped,drawing,lineStyle="arrow"}){
  const dx=to.x-from.x,dy=to.y-from.y,len=Math.sqrt(dx*dx+dy*dy)||1;
  const ux=dx/len,uy=dy/len,as=11;
  const ax=to.x-ux*as,ay=to.y-uy*as,px=-uy*(as/2.4),py=ux*(as/2.4);
  const midX=(from.x+to.x)/2,midY=(from.y+to.y)/2;
  const color=selected?"#ddb878":(drawing?"#dd9189":(isSnapped?"#dd9189":"#737b88"));
  const showArrow=drawing||(lineStyle==="arrow"||lineStyle==="dashed");
  const isDashed=!drawing&&(lineStyle==="dashed"||lineStyle==="dashed-line");
  return(
    <g onClick={onClickEdge} style={{cursor:"pointer"}}>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth={16}/>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={color} strokeWidth={selected?2.4:1.9}
        strokeDasharray={isDashed?"8 5":"none"}
        className={drawing?"dash-flow":""}
        style={{filter:selected?`drop-shadow(0 0 5px ${rgba("#ddb878",0.7)})`:"none",transition:"stroke .15s ease"}}/>
      {showArrow&&<polygon points={`${to.x},${to.y} ${ax+px},${ay+py} ${ax-px},${ay-py}`} fill={color}
        style={{filter:selected?`drop-shadow(0 0 4px ${rgba("#ddb878",0.7)})`:"none"}}/>}
      {label&&(
        <g onDoubleClick={e=>{e.stopPropagation();onDblClickLabel&&onDblClickLabel();}}>
          <rect x={midX-label.length*3.6-6} y={midY-11} width={label.length*7.2+12} height={20}
            rx={6} fill="#0d1017" stroke="#2a2f3a" strokeWidth={1}/>
          <text x={midX} y={midY+0.5} textAnchor="middle" dominantBaseline="middle"
            fill="#cfd4dc" fontSize={10.5} fontFamily={FONT}
            style={{pointerEvents:"none",userSelect:"none"}}>{label}</text>
        </g>
      )}
    </g>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────
function exportDiagram(nodes,edges,format,colors,diagramName){
  if(nodes.length===0){alert("Canvas ist leer!");return;}
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  nodes.forEach(n=>{const{w,h}=getNodeSize(n);minX=Math.min(minX,n.x);minY=Math.min(minY,n.y);maxX=Math.max(maxX,n.x+w);maxY=Math.max(maxY,n.y+h);});
  const W=maxX-minX+PADDING*2,H=maxY-minY+PADDING*2,offX=-minX+PADDING,offY=-minY+PADDING;
  const nodeMap=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const col=t=>(colors&&colors[t])||DEFAULT_COLORS[t]||DEFAULT_COLORS.funktion;
  const edgeSVG=edges.map(edge=>{const a=nodeMap[edge.from],b=nodeMap[edge.to];if(!a||!b)return"";
    const cp=getClosestPorts(a,b);
    const p1=edge.fromDir?getPortPoint(a,edge.fromDir):cp.p1;
    const p2=edge.toDir?getPortPoint(b,edge.toDir):cp.p2;const dx=p2.x-p1.x,dy=p2.y-p1.y,len=Math.sqrt(dx*dx+dy*dy)||1;const ux=dx/len,uy=dy/len,as=11;const ax=p2.x-ux*as,ay=p2.y-uy*as,px=-uy*(as/2.4),py=ux*(as/2.4);const midX=(p1.x+p2.x)/2+offX,midY=(p1.y+p2.y)/2+offY;
    const ls=edge.lineStyle||"arrow";
    const dash=(ls==="dashed"||ls==="dashed-line")?` stroke-dasharray="7 5"`:"";
    const hasArrow=(ls==="arrow"||ls==="dashed");
    const lineSVG=`<line x1="${p1.x+offX}" y1="${p1.y+offY}" x2="${p2.x+offX}" y2="${p2.y+offY}" stroke="#7a828f" stroke-width="1.8"${dash}/>`;
    const arrowSVG=hasArrow?`<polygon points="${p2.x+offX},${p2.y+offY} ${ax+px+offX},${ay+py+offY} ${ax-px+offX},${ay-py+offY}" fill="#7a828f"/>`:"";
    const labelSVG=edge.label?`<rect x="${midX-edge.label.length*3.6-5}" y="${midY-10}" width="${edge.label.length*7.2+10}" height="18" rx="5" fill="#11141b" stroke="#2a2f3a"/><text x="${midX}" y="${midY+1}" text-anchor="middle" dominant-baseline="middle" fill="#cfd4dc" font-size="10.5" font-family="Space Grotesk,sans-serif">${edge.label}</text>`:"";
    return lineSVG+arrowSVG+labelSVG;}).join("");
  const shapeSVG=nodes.map(node=>{const{w,h}=getNodeSize(node);const c=col(node.type),accent=c.accent;const x=node.x+offX,y=node.y+offY;const fd="#10141c";let shape="";switch(node.type){case"ereignis":{const ind=20;const pts=[[ind,0],[w-ind,0],[w,h/2],[w-ind,h],[ind,h],[0,h/2]].map(p=>`${p[0]+x},${p[1]+y}`).join(" ");shape=`<polygon points="${pts}" fill="${fd}" stroke="${accent}" stroke-width="2"/>`;break;}case"funktion":shape=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fd}" stroke="${accent}" stroke-width="2"/>`;break;case"organisationseinheit":shape=`<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" fill="${fd}" stroke="${accent}" stroke-width="2"/><line x1="${x+w*0.2}" y1="${y}" x2="${x+w*0.2}" y2="${y+h}" stroke="${accent}" stroke-width="1.4" opacity="0.55"/>`;break;case"informationsobjekt":shape=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fd}" stroke="${accent}" stroke-width="2"/><line x1="${x+w*0.2}" y1="${y}" x2="${x+w*0.2}" y2="${y+h}" stroke="${accent}" stroke-width="1.2" opacity="0.5"/><line x1="${x+w*0.8}" y1="${y}" x2="${x+w*0.8}" y2="${y+h}" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>`;break;case"dokument":{const wH=11;shape=`<path d="M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h-wH} Q ${x+w*0.75} ${y+h+wH*0.5} ${x+w*0.5} ${y+h-wH} Q ${x+w*0.25} ${y+h-wH*2.5} ${x} ${y+h-wH} Z" fill="${fd}" stroke="${accent}" stroke-width="2"/>`;break;}case"prozesspfad":{const aW=22;const pts=[[0,0],[w-aW,0],[w,h/2],[w-aW,h],[0,h]].map(p=>`${p[0]+x},${p[1]+y}`).join(" ");shape=`<polygon points="${pts}" fill="${fd}" stroke="${accent}" stroke-width="2"/>`;break;}default:{const lm={operator_and:"AND",operator_or:"OR",operator_xor:"XOR"};const r=Math.min(w,h)/2-2;return`<circle cx="${x+w/2}" cy="${y+h/2}" r="${r}" fill="${fd}" stroke="${accent}" stroke-width="2"/><text x="${x+w/2}" y="${y+h/2+1}" text-anchor="middle" dominant-baseline="middle" fill="${c.text}" font-size="12.5" font-weight="700" font-family="Space Grotesk,sans-serif">${lm[node.type]||""}</text>`;}}const ty=node.type==="dokument"?y+(h-11)/2:y+h/2;
    const lines=(node.label||"").split("\n");
    const lineH=14*1.4;
    const labelSVG=lines.length<=1
      ?`<text x="${x+w/2}" y="${ty+1}" text-anchor="middle" dominant-baseline="middle" fill="${c.text}" font-size="12.5" font-weight="600" font-family="Space Grotesk,sans-serif">${node.label}</text>`
      :`<text x="${x+w/2}" text-anchor="middle" fill="${c.text}" font-size="12.5" font-weight="600" font-family="Space Grotesk,sans-serif">${lines.map((l,i)=>`<tspan x="${x+w/2}" y="${ty-(lines.length-1)*lineH/2+i*lineH}">${l}</tspan>`).join("")}</text>`;
    return shape+labelSVG;}).join("\n");
  const svgStr=`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#07080b"/>${edgeSVG}${shapeSVG}</svg>`;
  const fname=(diagramName||"flowra-diagram").replace(/\s+/g,"-").toLowerCase();
  if(format==="svg"){const blob=new Blob([svgStr],{type:"image/svg+xml"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${fname}.svg`;a.click();return;}
  const img=new Image(),scale=2;const blob=new Blob([svgStr],{type:"image/svg+xml"});const url=URL.createObjectURL(blob);
  img.onload=()=>{const canvas=document.createElement("canvas");canvas.width=W*scale;canvas.height=H*scale;const ctx=canvas.getContext("2d");if(format==="jpeg"){ctx.fillStyle="#07080b";ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.scale(scale,scale);ctx.drawImage(img,0,0);URL.revokeObjectURL(url);canvas.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`${fname}.${format==="jpeg"?"jpg":"png"}`;a.click();},format==="jpeg"?"image/jpeg":"image/png",0.95);};img.src=url;
}


// ─── Project Manager ──────────────────────────────────────────────────────
function ProjectManager({currentName, onLoad, onNew, onClose}){
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [renaming, setRenaming] = React.useState(null);
  const [renameVal, setRenameVal] = React.useState("");
  const [error, setError] = React.useState("");

  const refresh = async () => {
    try {
      const r = await fetch(`${API_BASE}/diagrams`);
      setProjects(await r.json());
    } catch(e){ setError("Backend nicht erreichbar"); }
    setLoading(false);
  };

  React.useEffect(()=>{ refresh(); }, []);

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
  const [phase, setPhase] = React.useState("welcome"); // welcome | building | done
  const [nNodes, setNNodes] = React.useState(0);  // how many nodes are visible
  const [nEdges, setNEdges] = React.useState(0);  // how many edges are visible
  const timers = React.useRef([]);

  React.useEffect(()=>()=>{ timers.current.forEach(clearTimeout); }, []);

  const vb = React.useMemo(computeDemoViewBox, []);
  const [boxSize, setBoxSize] = React.useState(null);
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
      <div id="aurora"><div className="blob"/><div className="veil"/></div>
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
                      <ShapeRenderer type={node.type} label={node.label} width={w} height={h} colors={DEFAULT_COLORS}/>
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
function SettingsPanel({colors,onColorsChange,snapGrid,onSnapGrid,showGrid,onShowGrid,wobble,onWobble,onClose}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
      <div className="glass pop-in" style={{position:"relative",borderRadius:"var(--r-lg)",padding:26,width:460,maxHeight:"82vh",overflowY:"auto",boxShadow:"var(--shadow)",background:"rgba(12,14,19,0.82)",border:"1px solid var(--border-strong)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <span style={{fontSize:13,fontWeight:700,color:"var(--emerald)",letterSpacing:1.5}}>EINSTELLUNGEN</span>
          <button className="tbtn" onClick={onClose} style={{width:30,height:30,fontSize:16,color:"var(--muted)"}}>✕</button>
        </div>
        <Row title="Snap to Grid" sub={`Elemente rasten am ${GRID}px-Raster ein`}><Toggle on={snapGrid} onClick={()=>onSnapGrid(!snapGrid)}/></Row>
        <Row title="Gitter anzeigen" sub="Punktraster auf dem Canvas"><Toggle on={showGrid} onClick={()=>onShowGrid(!showGrid)}/></Row>
        <div style={{marginBottom:16,padding:"14px 16px",background:"var(--glass)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div><div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>Wobble-Intensität</div><div style={{fontSize:11,color:"var(--faint)",marginTop:2}}>Gummi-Effekt beim Ziehen</div></div>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:13,color:"var(--emerald)",fontWeight:700}}>{wobble}</span>
          </div>
          <input type="range" min={0} max={10} step={1} value={wobble} onChange={e=>onWobble(Number(e.target.value))} style={{width:"100%",accentColor:"var(--emerald)",cursor:"pointer"}}/>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:"var(--faint)",letterSpacing:1.4,margin:"18px 0 10px"}}>ELEMENT-AKZENTE</div>
        {Object.entries(colors).map(([type,c])=>(
          <div key={type} style={{display:"flex",alignItems:"center",gap:14,marginBottom:8,padding:"9px 14px",background:"var(--glass)",borderRadius:"var(--r-md)",border:"1px solid var(--border)"}}>
            <div style={{width:26,height:26,borderRadius:7,flexShrink:0,background:rgba(c.accent,0.18),border:`1.6px solid ${c.accent}`,boxShadow:`0 0 10px ${rgba(c.accent,0.5)}`}}/>
            <span style={{flex:1,fontSize:12.5,fontWeight:600,color:"var(--text)"}}>{LABEL_MAP[type]}</span>
            <label style={{position:"relative",cursor:"pointer"}} title="Akzentfarbe">
              <input type="color" value={c.accent} onChange={e=>onColorsChange(type,"accent",e.target.value)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}}/>
              <span className="swatch" style={{display:"block",width:34,height:26,borderRadius:7,background:c.accent,border:"1px solid var(--border-strong)"}}/>
            </label>
          </div>
        ))}
        <button className="tbtn" onClick={()=>onColorsChange("__reset__")} style={{marginTop:12,width:"100%",padding:"10px",color:"var(--rose)",borderColor:rgba("#fb7185",0.3),background:rgba("#fb7185",0.08),fontSize:12.5,fontWeight:600}}>Akzente zurücksetzen</button>
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
  const [showProjects,setShowProjects]=useState(false);
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [saveStatus,setSaveStatus]=useState('');  // '', 'saving', 'saved', 'error'
  const [colors,setColors]=useState(DEFAULT_COLORS);
  const [snapGrid,setSnapGrid]=useState(true);
  const [showGrid,setShowGrid]=useState(false);
  const [wobble,setWobble]=useState(5);
  const [diagramName,setDiagramName]=useState("Unbenanntes Diagramm");
  const [editingName,setEditingName]=useState(false);
  const [drawingEdge,setDrawingEdge]=useState(null);
  const [hoveredPort,setHoveredPort]=useState(null);
  const [hoverNode,setHoverNode]=useState(null);
  const [isPaletteDrag,setIsPaletteDrag]=useState(false);
  const [clipboard,setClipboard]=useState(null);

  const historyRef=useRef([{nodes:[],edges:[]}]);
  const historyIdxRef=useRef(0);
  const svgRef=useRef(null);
  const wobbleRefs=useRef({});
  const springs=useRef({});
  const nodesRef=useRef({});
  const wobbleAmt=useRef(0.5);
  const draggingRef=useRef(null);
  const paletteDragRef=useRef(false);

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

  const handleCanvasDrop=e=>{e.preventDefault();paletteDragRef.current=false;setIsPaletteDrag(false);setDrawingEdge(null);const type=e.dataTransfer.getData("epk-type"),label=e.dataTransfer.getData("epk-label");if(!type)return;const rect=svgRef.current.getBoundingClientRect();let{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);const isOp=type.startsWith("operator");
      // Snap the CENTER of the dropped element to grid, then get top-left
      const hw=isOp?24:NODE_W/2, hh=isOp?24:NODE_H/2;
      if(snapGrid){x=Math.round(x/GRID)*GRID;y=Math.round(y/GRID)*GRID;}
      x-=hw; y-=hh;const id=uid();const newNodes=[...nodes,{id,type,label,x,y}];setNodes(newNodes);pushHistory(newNodes,edges);setSelected({type:"node",id});nodesRef.current[id]={id,type,x,y};kick(id,0,26);};

  const handleNodeMouseDown=(e,id)=>{if(e.button!==0)return;e.stopPropagation();setSelected({type:"node",id});const node=nodes.find(n=>n.id===id);const rect=svgRef.current.getBoundingClientRect();const{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);setDragging({id,offX:x-node.x,offY:y-node.y,moved:false});if(!springs.current[id])springs.current[id]={Sx:0,Sy:0,Vx:0,Vy:0,Tx:0,Ty:0};};
  const handlePortMouseDown=(e,nodeId,dir)=>{e.stopPropagation();if(paletteDragRef.current)return;const rect=svgRef.current.getBoundingClientRect();const{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);setDrawingEdge({fromId:nodeId,fromDir:dir,mouseX:x,mouseY:y,snapped:false});};
  const handlePortMouseUp=(e,nodeId,dir)=>{e.stopPropagation();if(drawingEdge&&drawingEdge.fromId!==nodeId){const newEdges=[...edges,{id:uid(),from:drawingEdge.fromId,to:nodeId,fromDir:drawingEdge.fromDir,toDir:dir,label:""}];setEdges(newEdges);pushHistory(nodes,newEdges);kick(nodeId,0,14);}setDrawingEdge(null);setHoveredPort(null);};

  const handleSVGMouseMove=e=>{const rect=svgRef.current.getBoundingClientRect();const{x,y}=toCanvas(e.clientX-rect.left,e.clientY-rect.top);if(dragging){let nx=x-dragging.offX,ny=y-dragging.offY;setNodes(prev=>prev.map(n=>n.id===dragging.id?{...n,x:nx,y:ny}:n));if(!dragging.moved)setDragging(d=>({...d,moved:true}));const s=springs.current[dragging.id];if(s){s.Tx=clamp((e.movementX/zoom)*1.7,-80,80);s.Ty=clamp((e.movementY/zoom)*1.7,-80,80);}}if(panStart)setCanvasOffset({x:panStart.ox+(e.clientX-panStart.x),y:panStart.oy+(e.clientY-panStart.y)});if(drawingEdge){const fn=nodes.find(n=>n.id===drawingEdge.fromId);const fp=getPortPoint(fn,drawingEdge.fromDir);const snapped=snapAngle(fp.x,fp.y,x,y);setDrawingEdge(d=>({...d,mouseX:snapped.x,mouseY:snapped.y,snapped:snapped.x!==x||snapped.y!==y}));}};
  const handleSVGMouseUp=()=>{
    if(dragging&&dragging.moved){
      if(snapGrid){
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
    setDragging(null);setPanStart(null);if(drawingEdge)setDrawingEdge(null);
  };
  const handleSVGMouseDown=e=>{if(e.button===1||(e.button===0&&e.altKey)){setPanStart({x:e.clientX,y:e.clientY,ox:canvasOffset.x,oy:canvasOffset.y});e.preventDefault();}else if(e.button===0){setSelected(null);setDrawingEdge(null);}};
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

  const handleColorsChange=(type,key,val)=>{if(type==="__reset__"){setColors(DEFAULT_COLORS);return;}setColors(prev=>({...prev,[type]:{...prev[type],[key]:val}}));};
  const nodeMap=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const accentOf=t=>(colors[t]||DEFAULT_COLORS[t]||DEFAULT_COLORS.funktion).accent;

  return(
    <>
      <style>{CSS}</style>
      <div id="aurora"><div className="blob"/><div className="veil"/></div>
      <div style={{position:"relative",zIndex:1,display:"flex",height:"100vh",color:"var(--text)",overflow:"hidden",fontFamily:FONT}}>

        {exportOpen&&(
          <div style={{position:"fixed",right:16,top:60,zIndex:9999,minWidth:140,
            borderRadius:"var(--r-md)",overflow:"hidden",
            boxShadow:"0 8px 32px rgba(0,0,0,0.6)",
            background:"rgba(12,14,19,0.99)",border:"1px solid var(--border)"}}>
            {[{fmt:"png",label:"🖼 PNG"},{fmt:"jpeg",label:"🖼 JPEG"},{fmt:"svg",label:"✦ SVG"}].map(({fmt,label})=>(
              <div key={fmt} className="menu-item" onClick={()=>{exportDiagram(nodes,edges,fmt,colors,diagramName);setExportOpen(false);}}
                style={{padding:"11px 18px",fontSize:13,fontWeight:600,color:"var(--text)",
                  borderBottom:"1px solid var(--border)",cursor:"pointer"}}>
                {label}
              </div>
            ))}
          </div>
        )}
        {showOnboarding&&<OnboardingScreen onDone={()=>setShowOnboarding(false)}/>}
        {showProjects&&<ProjectManager currentName={diagramName} onLoad={loadDiagram} onNew={newDiagram} onClose={()=>setShowProjects(false)}/>}
        {showSettings&&<SettingsPanel colors={colors} onColorsChange={handleColorsChange} snapGrid={snapGrid} onSnapGrid={setSnapGrid} showGrid={showGrid} onShowGrid={setShowGrid} wobble={wobble} onWobble={setWobble} onClose={()=>setShowSettings(false)}/>}

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
                  setDrawingEdge(null);
                  setDragging(null);
                  setHoveredPort(null);
                }}
                onDragEnd={()=>{paletteDragRef.current=false;setIsPaletteDrag(false);setDrawingEdge(null);}}
                onMouseDown={e=>e.stopPropagation()} style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{flexShrink:0,width:96,display:"flex",justifyContent:"center"}}><ShapeRenderer type={item.type} label="" width={w} height={h} colors={colors} preview/></div>
                <div style={{minWidth:0}}><div style={{fontSize:12.5,fontWeight:600,color:"var(--text)"}}>{item.label}</div><div style={{fontSize:10.5,color:"var(--faint)",marginTop:1}}>{item.desc}</div></div>
              </div>);
            })}
          </div>
          <div style={{marginTop:"auto",padding:"14px 18px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:10,color:"var(--faint)",lineHeight:1.9}}>
              <div style={{color:"var(--muted)",fontWeight:700,marginBottom:5,letterSpacing:1}}>SHORTCUTS</div>
              {[["Drag","→ Canvas"],["Port ziehen","Verbinden"],["Doppelklick","Umbenennen"],["Entf","Löschen"],["Strg+S","Speichern"],["Strg+Z / Y","Undo / Redo"],["Strg+C / V","Kopieren"],["Alt+Drag / Pfeiltasten","Pan"],["Scroll","Zoom"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",gap:8}}><span>{k}</span><span style={{color:"var(--dim)"}}>{v}</span></div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,padding:12,gap:12}}>

          {/* Toolbar */}
          <div className="glass" style={{height:56,borderRadius:"var(--r-lg)",display:"flex",alignItems:"center",gap:8,padding:"0 16px",flexShrink:0}}>
            <span style={{fontSize:16,fontWeight:700,letterSpacing:0.5,display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:26,height:26,borderRadius:8,background:"radial-gradient(circle at 50% 40%, rgba(230,192,121,0.12), rgba(11,14,20,0.85))",border:"1px solid rgba(230,192,121,0.22)",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><TrioLogo size={18} glow={false}/></span>
              <span style={{background:"linear-gradient(90deg,#fff,#f1e3d2)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Flowra</span>
            </span>

            {editingName
              ?<input autoFocus value={diagramName} onChange={e=>setDiagramName(e.target.value)} onBlur={()=>setEditingName(false)} onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")setEditingName(false);}} style={{background:"var(--glass)",border:"1px solid var(--emerald)",borderRadius:8,color:"var(--text)",padding:"6px 10px",fontSize:12.5,width:200,marginLeft:6}}/>
              :<span className="name-chip" onDoubleClick={()=>setEditingName(true)} style={{fontSize:12.5,color:"var(--muted)",cursor:"pointer",padding:"6px 10px",borderRadius:8,marginLeft:6}} title="Doppelklick zum Umbenennen">{diagramName}</span>
            }

            <div style={{width:1,height:26,background:"var(--border)",margin:"0 6px"}}/>
            <button className="tbtn" onClick={undo} title="Rückgängig (Strg+Z)" style={{width:36,height:34,fontSize:15}}>↺</button>
            <button className="tbtn" onClick={redo} title="Wiederholen (Strg+Y)" style={{width:36,height:34,fontSize:15}}>↻</button>
            <button className="tbtn" onClick={()=>setShowProjects(true)} title="Projekte" style={{height:34,padding:"0 12px",fontSize:12.5,fontWeight:600}}>📁 Projekte</button>
            <button className="tbtn" onClick={saveDiagram} title="Speichern (Strg+S)" style={{height:34,padding:"0 12px",fontSize:12.5,fontWeight:600,
              color:saveStatus==="saved"?"#84bcaa":saveStatus==="error"?"var(--rose)":"var(--emerald)",
              background:saveStatus==="saved"?rgba("#84bcaa",0.12):saveStatus==="saving"?rgba("#ddb878",0.08):rgba("#ddb878",0.10),
              borderColor:saveStatus==="saved"?rgba("#84bcaa",0.4):rgba("#ddb878",0.3)}}>
              {saveStatus==="saving"?"…":saveStatus==="saved"?"✓ Gespeichert":saveStatus==="error"?"✗ Fehler":"💾 Speichern"}
            </button>
            <button className="tbtn" onClick={()=>setShowSettings(true)} title="Einstellungen" style={{width:36,height:34,fontSize:15}}>⚙</button>

            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:2,background:"var(--glass)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:2}}>
                <button className="tbtn" onClick={()=>setZoom(z=>clamp(z*1.2,0.2,3))} style={{width:30,height:28,border:"none",background:"transparent"}}>+</button>
                <span style={{fontSize:11,color:"var(--muted)",minWidth:40,textAlign:"center",fontFamily:"'Space Mono',monospace"}}>{Math.round(zoom*100)}%</span>
                <button className="tbtn" onClick={()=>setZoom(z=>clamp(z*0.83,0.2,3))} style={{width:30,height:28,border:"none",background:"transparent"}}>−</button>
              </div>
              <button className="tbtn" onClick={()=>{setZoom(1);setCanvasOffset({x:80,y:60});}} style={{height:34,padding:"0 12px",fontSize:12}}>Reset</button>

              <div style={{position:"relative"}}>
                <button className="tbtn" onClick={()=>setExportOpen(o=>!o)} style={{height:34,padding:"0 14px",fontSize:12.5,fontWeight:600,color:"var(--emerald)",background:rgba("#ddb878",0.10),borderColor:rgba("#ddb878",0.3)}}>
                  Export {exportOpen?"▴":"▾"}</button>
                
              </div>

              {selected&&<button className="tbtn" onClick={deleteSelected} title="Löschen (Entf)" style={{width:36,height:34,fontSize:14,color:"var(--rose)",background:rgba("#fb7185",0.1),borderColor:rgba("#fb7185",0.3)}}>🗑</button>}
            </div>
          </div>

          {/* Canvas */}
          <div className="glass" style={{flex:1,position:"relative",overflow:"hidden",borderRadius:"var(--r-lg)",background:"rgba(7,8,11,0.55)"}}
            onDrop={handleCanvasDrop} onDragOver={e=>{e.preventDefault();if(drawingEdge)setDrawingEdge(null);}} onClick={()=>setExportOpen(false)}>

            {nodes.length===0&&(
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none",gap:14}}>
                <div style={{width:64,height:64,borderRadius:18,border:"1.5px dashed var(--border-strong)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"var(--dim)"}}>⬡</div>
                <div style={{fontSize:15,fontWeight:600,color:"var(--faint)"}}>EPK-Elemente hierher ziehen</div>
                <div style={{fontSize:12,color:"var(--dim)"}}>Aus der Palette links auswählen</div>
              </div>
            )}

            <svg ref={svgRef} width="100%" height="100%"
              style={{cursor:drawingEdge?"crosshair":(panStart?"grabbing":"default"),userSelect:"none",display:"block"}}
              onMouseMove={handleSVGMouseMove} onMouseUp={handleSVGMouseUp} onMouseDown={handleSVGMouseDown}>
              <defs>
                <pattern id="grid" width={GRID*zoom} height={GRID*zoom} patternUnits="userSpaceOnUse" x={canvasOffset.x%(GRID*zoom)} y={canvasOffset.y%(GRID*zoom)}>
                  <circle cx={0} cy={0} r={1.1} fill="rgba(255,255,255,0.16)"/>
                </pattern>
              </defs>
              {showGrid&&<rect width="100%" height="100%" fill="url(#grid)"/>}
              <g transform={`translate(${canvasOffset.x},${canvasOffset.y}) scale(${zoom})`}>
                {edges.map(edge=>{const a=nodeMap[edge.from],b=nodeMap[edge.to];if(!a||!b)return null;const p1=edge.fromDir?getPortPoint(a,edge.fromDir):getClosestPorts(a,b).p1;const p2=edge.toDir?getPortPoint(b,edge.toDir):getClosestPorts(a,b).p2;return<Arrow key={edge.id} from={p1} to={p2} selected={selected?.type==="edge"&&selected.id===edge.id} label={edge.label||""} lineStyle={edge.lineStyle||"arrow"} isSnapped={false} onClickEdge={e=>{e.stopPropagation();setSelected({type:"edge",id:edge.id});}} onDblClickLabel={()=>{setEditingEdgeId(edge.id);setEditEdgeText(edge.label||"");}}/>;
                })}
                {drawingEdge&&(()=>{const fromNode=nodes.find(n=>n.id===drawingEdge.fromId);if(!fromNode)return null;const fp=getPortPoint(fromNode,drawingEdge.fromDir);return<Arrow from={fp} to={{x:drawingEdge.mouseX,y:drawingEdge.mouseY}} drawing selected={false} isSnapped={drawingEdge.snapped} label="" onClickEdge={()=>{}}/>;})()}
                {nodes.map(node=>{
                  const{w,h}=getNodeSize(node);
                  const isSel=selected?.type==="node"&&selected.id===node.id;
                  const showPorts=!isPaletteDrag&&(isSel||!!drawingEdge||hoverNode===node.id);
                  return(
                    <g key={node.id} transform={`translate(${node.x},${node.y})`}
                      onMouseDown={e=>handleNodeMouseDown(e,node.id)}
                      onDoubleClick={e=>handleNodeDblClick(e,node.id)}
                      onMouseEnter={()=>setHoverNode(node.id)}
                      onMouseLeave={()=>setHoverNode(h=>h===node.id?null:h)}
                      style={{cursor:"move"}}>
                      <g ref={el=>{if(el)wobbleRefs.current[node.id]=el;else delete wobbleRefs.current[node.id];}}>
                        <ShapeRenderer type={node.type} label={editingId===node.id?"":node.label} width={w} height={h} selected={isSel} colors={colors}/>
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
                <input type="range" min={80} max={300} value={node.w||NODE_W} onChange={e=>setNodes(prev=>prev.map(n=>n.id===node.id?{...n,w:Number(e.target.value)}:n))} onMouseUp={()=>pushHistory(nodes,edges)} style={{flex:1,accentColor:"var(--emerald)",cursor:"pointer"}}/>
                <span style={{fontSize:11,color:"var(--emerald)",fontFamily:"'Space Mono',monospace",minWidth:28}}>{node.w||NODE_W}</span>
              </div>
              <div style={{fontSize:11,color:"var(--faint)"}}>Höhe</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <input type="range" min={36} max={200} value={node.h||NODE_H} onChange={e=>setNodes(prev=>prev.map(n=>n.id===node.id?{...n,h:Number(e.target.value)}:n))} onMouseUp={()=>pushHistory(nodes,edges)} style={{flex:1,accentColor:"var(--emerald)",cursor:"pointer"}}/>
                <span style={{fontSize:11,color:"var(--emerald)",fontFamily:"'Space Mono',monospace",minWidth:28}}>{node.h||NODE_H}</span>
              </div>
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
