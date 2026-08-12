
(function(){
'use strict';

/* ══════════════════════════════════════════════════════
   MAP  (36×36)
   0=floor  1=wall-concrete  2=wall-brick  3=glass
   4=terminal  5=exit  6=pillar  7=health-pickup
   8=dark-server  9=neon-strip
   10=art-data-sovereignty  11=art-zero-exfil  12=art-nerdiversity
   ══════════════════════════════════════════════════════ */
const MAP_W=36, MAP_H=36;
const M=[
//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],//0
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//1
  [ 1, 0,10,10, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,11,11, 0, 0, 0, 1],//2
  [ 1, 0,10, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,11, 0, 0, 0, 1],//3
  [ 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],//4
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//5
  [ 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 1],//6
  [ 1, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1],//7
  [ 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],//8
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//9
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//10
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//11
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//12
  [ 1, 0, 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0, 0, 0, 1],//13
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//14
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 7, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//15
  [ 1,11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,10, 1, 1],//16
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//17
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//18 CENTER
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//19
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 7, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//20
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//21
  [ 1, 0, 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12, 0, 0, 0, 1],//22
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//23
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//24
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//25
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//26
  [ 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],//27
  [ 1, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1],//28
  [ 1, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 1],//29
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//30
  [ 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],//31
  [ 1, 0, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 0, 0, 1],//32
  [ 1, 0,11,11, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,10,10, 2, 0, 0, 1],//33
  [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//34
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],//35
];

/* ── WALL ART DEFINITIONS ── */
const WALL_ART = {
  10: { // DATA SOVEREIGNTY art
    lines: [
      { text: 'DATA', color: '#ff6b00', size: 0.22, y: 0.18, bold: true },
      { text: 'SOVEREIGNTY', color: '#ff9a3c', size: 0.12, y: 0.35, bold: true },
      { text: 'YOUR DATA', color: 'rgba(255,255,255,0.7)', size: 0.09, y: 0.52, bold: false },
      { text: 'YOUR HARDWARE', color: 'rgba(255,255,255,0.7)', size: 0.09, y: 0.63, bold: false },
      { text: 'ZERO EXFILTRATION', color: '#ff6b00', size: 0.08, y: 0.78, bold: false },
    ],
    bg: 'rgba(0,20,30,0.9)',
    border: 'rgba(255,107,0,0.6)',
    icon: '🔒',
  },
  11: { // ZERO EXFILTRATION art
    lines: [
      { text: 'ZERO', color: '#e74c3c', size: 0.2, y: 0.18, bold: true },
      { text: 'EXFILTRATION', color: '#ff9a9a', size: 0.11, y: 0.35, bold: true },
      { text: 'NO DATA LEAVES', color: 'rgba(255,255,255,0.65)', size: 0.085, y: 0.52, bold: false },
      { text: 'THIS MACHINE', color: 'rgba(255,255,255,0.65)', size: 0.085, y: 0.62, bold: false },
      { text: '— POCONO AI —', color: 'rgba(255,100,100,0.7)', size: 0.075, y: 0.78, bold: false },
    ],
    bg: 'rgba(20,5,5,0.9)',
    border: 'rgba(231,76,60,0.55)',
    icon: '🛡️',
  },
  12: { // NERDIVERSITY ROCKS art
    lines: [
      { text: 'NERDIVERSITY', color: '#9b59b6', size: 0.15, y: 0.18, bold: true },
      { text: 'ROCKS', color: '#d7aefb', size: 0.22, y: 0.38, bold: true },
      { text: '◈ neurodivergent', color: 'rgba(200,180,255,0.7)', size: 0.085, y: 0.56, bold: false },
      { text: '+ technically fierce', color: 'rgba(200,180,255,0.7)', size: 0.085, y: 0.67, bold: false },
      { text: 'poconoai.com', color: 'rgba(155,89,182,0.5)', size: 0.072, y: 0.82, bold: false },
    ],
    bg: 'rgba(10,5,20,0.9)',
    border: 'rgba(155,89,182,0.55)',
    icon: '⚡',
  },
};

/* ── WALL ART MESSAGES (shown as toast when player faces art) ── */
const ART_MSGS = {
  10: '[ DATA SOVEREIGNTY ] Your AI, your hardware, your rules.',
  11: '[ ZERO EXFILTRATION ] No data leaves this machine. Not a byte.',
  12: '[ NERDIVERSITY ROCKS ] The neurodivergent build the future.',
};

/* ── WALL DEFINITIONS ── */
const WALL_DEF = {
  1:  { dark:'#0a2a40', light:'#0e3a58', tex:'concrete' },
  2:  { dark:'#1a2808', light:'#243810', tex:'brick'    },
  3:  { dark:'#1e1e06', light:'#2e2e0c', tex:'glass'    },
  4:  { dark:'#0a2030', light:'#0f3040', tex:'server'   },
  5:  { dark:'#003018', light:'#004822', tex:'exit'     },
  6:  { dark:'#0d0d1e', light:'#181835', tex:'pillar'   },
  7:  { dark:'#003030', light:'#005050', tex:'health'   },
  8:  { dark:'#080818', light:'#10102e', tex:'server'   },
  9:  { dark:'#001428', light:'#001e3c', tex:'neon'     },
  10: { dark:'#001a20', light:'#002a38', tex:'art_ds'   },
  11: { dark:'#1a0808', light:'#280e0e', tex:'art_ze'   },
  12: { dark:'#0e0518', light:'#18083a', tex:'art_nd'   },
};

/* ── ENEMY TYPES ── */
const ETYPE = {
  CLOUD_LIABILITY: { name:'CLOUD LIABILITY', hp:3,  speed:0.015, color:'#9b59b6', accent:'#d7aefb', size:0.55, reward:25, glyph:'☁',  dmg:9  },
  EXFILTRATION:    { name:'EXFILTRATION',    hp:4,  speed:0.022, color:'#e74c3c', accent:'#ff9a9a', size:0.5,  reward:35, glyph:'⬡',  dmg:12 },
  ZERO_TELEMETRY:  { name:'ZERO-TELEMETRY',  hp:2,  speed:0.009, color:'#1abc9c', accent:'#7cf7d6', size:0.6,  reward:20, glyph:'◈',  dmg:6  },
  ZAPSIM:          { name:'ZAPSIM',          hp:2,  speed:0.028, color:'#f39c12', accent:'#ffe08a', size:0.45, reward:20, glyph:'⚡', dmg:8  },
  DATA_LEAK:       { name:'DATA LEAK',       hp:1,  speed:0.020, color:'#e67e22', accent:'#ffa07a', size:0.4,  reward:10, glyph:'▼',  dmg:4  },
  AI_BOT:          { name:'AI BOT',          hp:5,  speed:0.012, color:'#3498db', accent:'#85c1e9', size:0.65, reward:50, glyph:'⬢',  dmg:10 },
};

const ENEMIES_INIT = [
  {t:'CLOUD_LIABILITY', mx:3.5,  my:30.5},
  {t:'CLOUD_LIABILITY', mx:32.5, my:5.5 },
  {t:'CLOUD_LIABILITY', mx:32.5, my:30.5},
  {t:'EXFILTRATION',    mx:17.5, my:7.5 },
  {t:'EXFILTRATION',    mx:17.5, my:28.5},
  {t:'EXFILTRATION',    mx:5.5,  my:17.5},
  {t:'EXFILTRATION',    mx:30.5, my:17.5},
  {t:'ZERO_TELEMETRY',  mx:8.5,  my:12.5},
  {t:'ZERO_TELEMETRY',  mx:26.5, my:12.5},
  {t:'ZERO_TELEMETRY',  mx:8.5,  my:23.5},
  {t:'ZERO_TELEMETRY',  mx:26.5, my:23.5},
  {t:'ZAPSIM',          mx:6.5,  my:5.5 },
  {t:'ZAPSIM',          mx:28.5, my:5.5 },
  {t:'ZAPSIM',          mx:6.5,  my:30.5},
  {t:'ZAPSIM',          mx:28.5, my:30.5},
  {t:'ZAPSIM',          mx:17.5, my:17.5},
  {t:'DATA_LEAK',       mx:4.5,  my:9.5 },
  {t:'DATA_LEAK',       mx:30.5, my:9.5 },
  {t:'DATA_LEAK',       mx:4.5,  my:26.5},
  {t:'DATA_LEAK',       mx:30.5, my:26.5},
  {t:'DATA_LEAK',       mx:12.5, my:17.5},
  {t:'DATA_LEAK',       mx:22.5, my:17.5},
  {t:'AI_BOT',          mx:3.5,  my:3.5 },
  {t:'AI_BOT',          mx:32.5, my:32.5},
];

const TERMINAL_MSGS = [
  'NODE SECURED — Local AI sovereignty +1',
  'ENCRYPTION KEY INSTALLED — Exfiltration risk -40%',
  'ZERO-TELEMETRY CONFIRMED — No data leaves this machine',
  'HARDWARE ATTESTATION VALIDATED — Sentinel Node nominal',
  'HIPAA SHIELD ACTIVE — Patient data locked on-premises',
  'SHADOW IT PURGED — Cloud dependencies eliminated',
  'SENTINEL NODE ONLINE — Autonomous defense engaged',
  'BREACH VECTORS CLOSED — Network perimeter hardened',
  'NERDIVERSITY ACTIVE — Neurodivergent builders in the stack',
  'DATA SOVEREIGNTY RESTORED — Your AI, your rules',
];

/* ── GAME STATE ── */
const canvas   = document.getElementById('game-canvas');
const ctx      = canvas.getContext('2d');
const mm       = document.getElementById('hud-minimap');
const mmCtx    = mm.getContext('2d');
const hitFlashEl  = document.getElementById('hit-flash');
const healFlashEl = document.getElementById('heal-flash');
const msgBoxEl    = document.getElementById('msg-box');
const graceEl     = document.getElementById('grace-overlay');
const graceCount  = document.getElementById('grace-count');
const artToast    = document.getElementById('wall-art-toast');
const hudscore    = document.getElementById('hud-score');
const hudhp       = document.getElementById('hud-hp');
const hudhpfill   = document.getElementById('hud-hp-fill');
const hudwave     = document.getElementById('hud-wave-num');
const hudalive    = document.getElementById('hud-alive');
const hudammo     = document.getElementById('hud-ammo-dots');
const hudweapon   = document.getElementById('hud-weapon');
const startScreen = document.getElementById('start-screen');
const winScreen   = document.getElementById('win-screen');
const overScreen  = document.getElementById('over-screen');

let W, H, running=false, gameOver=false, won=false;
let msgTimer=0;
let graceTimer=0, graceActive=false;
let artToastTimer=0, lastArtType=-1;

// Player — start in open space away from walls
let px=2.5, py=2.5, pAngle=0.8;
let pHealth=100, score=0, wave=1;
let shootCooldown=0;
const MAX_AMMO=10;
let ammo=MAX_AMMO, reloading=false, reloadTimer=0;
const RELOAD_TIME=1.5;

let enemies=[];
let termVisited=new Set();

const keys={};
// Touch delta — named properties to avoid confusion
let touchDelta={ fw:0, strafe:0, rot:0, fire:false };
let touchLookStart=null, touchLookDX=0;

let wBob=0, wBobDir=1, shootAnim=0;

const FOV=Math.PI/3;
const HF=FOV/2;
// Slightly faster movement for better feel
const MOVE_SPEED=3.6;
const ROT_SPEED=2.6;
const MOUSE_SENS=0.0028;

/* ── TEXTURE CACHE ── */
const TEX_SIZE=128;
const texCache={};

function getTexCanvas(wallType){
  if(texCache[wallType]) return texCache[wallType];
  const tc=document.createElement('canvas');
  tc.width=tc.height=TEX_SIZE;
  const tx=tc.getContext('2d');
  const def=WALL_DEF[wallType]||WALL_DEF[1];
  paintTexture(tx, TEX_SIZE, def.tex, def.dark, def.light, wallType);
  texCache[wallType]=tc;
  return tc;
}

function paintTexture(tx, sz, type, dark, light, wallType){
  tx.fillStyle=dark;
  tx.fillRect(0,0,sz,sz);

  if(type==='brick'){
    const bW=32, bH=16;
    tx.fillStyle=light;
    for(let row=0;row<sz/bH;row++){
      const offX=(row%2===0)?0:bW/2;
      for(let col=-1;col<sz/bW+1;col++){
        const x=col*bW+offX, y=row*bH;
        tx.fillRect(x+1,y+1,bW-2,bH-2);
      }
    }
    tx.fillStyle='rgba(0,0,0,0.4)';
    for(let row=0;row<=sz/bH;row++) tx.fillRect(0,row*bH,sz,2);
    tx.fillStyle='rgba(0,0,0,0.12)';
    for(let i=0;i<8;i++){
      const row=Math.floor(Math.random()*sz/bH), col=Math.floor(Math.random()*sz/bW);
      const offX=(row%2===0)?0:bW/2;
      tx.fillRect(col*bW+offX+1,row*bH+1,bW-2,bH-2);
    }
    for(let i=0;i<40;i++){
      tx.fillStyle=`rgba(0,0,0,${Math.random()*0.25})`;
      tx.fillRect(Math.random()*sz, Math.random()*sz, 2+Math.random()*4, 2+Math.random()*4);
    }
  } else if(type==='concrete'){
    tx.fillStyle=light;
    for(let row=0;row<6;row++) tx.fillRect(0,row*(sz/6),sz,1);
    tx.strokeStyle='rgba(0,0,0,0.3)'; tx.lineWidth=1;
    for(let i=0;i<5;i++){
      tx.beginPath();
      let cx=Math.random()*sz, cy=Math.random()*sz;
      tx.moveTo(cx,cy);
      for(let j=0;j<6;j++){
        cx+=(Math.random()-0.5)*18; cy+=Math.random()*12;
        tx.lineTo(cx,cy);
      }
      tx.stroke();
    }
  } else if(type==='glass'){
    tx.fillStyle='rgba(0,180,255,0.07)'; tx.fillRect(0,0,sz,sz);
    tx.strokeStyle='rgba(0,200,255,0.3)'; tx.lineWidth=2;
    for(let x=0;x<sz;x+=sz/4){ tx.beginPath();tx.moveTo(x,0);tx.lineTo(x,sz);tx.stroke(); }
    for(let y=0;y<sz;y+=sz/3){ tx.beginPath();tx.moveTo(0,y);tx.lineTo(sz,y);tx.stroke(); }
    const g=tx.createLinearGradient(0,0,sz,sz);
    g.addColorStop(0,'rgba(255,255,255,0)');
    g.addColorStop(0.4,'rgba(255,255,255,0.06)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    tx.fillStyle=g; tx.fillRect(0,0,sz,sz);
  } else if(type==='server'){
    for(let unit=0;unit<8;unit++){
      const y=unit*(sz/8);
      tx.fillStyle=unit%2===0?light:'rgba(0,0,0,0.3)';
      tx.fillRect(0,y+1,sz,sz/8-2);
      const ledColor=unit%3===0?'#ff6b00':unit%3===1?'#ff9a3c':'#1abc9c';
      tx.fillStyle=ledColor; tx.fillRect(4,y+sz/20,6,6);
    }
    tx.fillStyle='rgba(255,154,60,0.25)';
    tx.fillRect(0,0,3,sz); tx.fillRect(sz-3,0,3,sz);
  } else if(type==='pillar'){
    const cx=sz/2,cy=sz/2,r=sz*0.4;
    tx.fillStyle=light;
    tx.beginPath();
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4-Math.PI/8;
      const x=cx+r*Math.cos(a), y=cy+r*Math.sin(a);
      if(i===0)tx.moveTo(x,y); else tx.lineTo(x,y);
    }
    tx.closePath(); tx.fill();
    tx.strokeStyle='rgba(255,154,60,0.4)'; tx.lineWidth=2; tx.stroke();
  } else if(type==='health'){
    const g=tx.createRadialGradient(sz/2,sz/2,0,sz/2,sz/2,sz/2);
    g.addColorStop(0,'rgba(255,107,0,0.4)'); g.addColorStop(1,'rgba(255,107,0,0)');
    tx.fillStyle=g; tx.fillRect(0,0,sz,sz);
    tx.fillStyle='rgba(255,107,0,0.85)';
    tx.fillRect(sz*0.4,sz*0.15,sz*0.2,sz*0.7);
    tx.fillRect(sz*0.15,sz*0.4,sz*0.7,sz*0.2);
  } else if(type==='exit'){
    const g=tx.createRadialGradient(sz/2,sz/2,0,sz/2,sz/2,sz/2);
    g.addColorStop(0,'rgba(255,107,0,0.6)'); g.addColorStop(1,'rgba(255,107,0,0.05)');
    tx.fillStyle=g; tx.fillRect(0,0,sz,sz);
    tx.strokeStyle='rgba(255,107,0,0.9)'; tx.lineWidth=6;
    tx.beginPath();
    tx.moveTo(sz*0.3,sz*0.5); tx.lineTo(sz*0.7,sz*0.5);
    tx.moveTo(sz*0.55,sz*0.35); tx.lineTo(sz*0.7,sz*0.5); tx.lineTo(sz*0.55,sz*0.65);
    tx.stroke();
  } else if(type==='art_ds'||type==='art_ze'||type==='art_nd'){
    // Wall art — painted procedurally with text
    const artKey = type==='art_ds'?10:type==='art_ze'?11:12;
    const art=WALL_ART[artKey];
    // Background
    tx.fillStyle=art.bg; tx.fillRect(0,0,sz,sz);
    // Border glow
    tx.strokeStyle=art.border; tx.lineWidth=3;
    tx.strokeRect(2,2,sz-4,sz-4);
    // Inner border
    tx.strokeStyle=art.border.replace('0.55','0.25').replace('0.6','0.2'); tx.lineWidth=1;
    tx.strokeRect(6,6,sz-12,sz-12);
    // Text lines
    art.lines.forEach(line=>{
      tx.fillStyle=line.color;
      tx.font=`${line.bold?'bold ':''}`+Math.floor(sz*line.size)+'px monospace';
      tx.textAlign='center'; tx.textBaseline='middle';
      tx.fillText(line.text, sz/2, sz*line.y);
    });
    // Decorative grid lines
    tx.globalAlpha=0.06; tx.strokeStyle='#ffffff'; tx.lineWidth=1;
    for(let y=0;y<sz;y+=sz/12){ tx.beginPath();tx.moveTo(0,y);tx.lineTo(sz,y);tx.stroke(); }
    tx.globalAlpha=1;
  } else {
    tx.strokeStyle='rgba(255,154,60,0.2)'; tx.lineWidth=1;
    for(let y=0;y<sz;y+=8){ tx.beginPath();tx.moveTo(0,y);tx.lineTo(sz,y);tx.stroke(); }
  }
}

/* ── RESIZE ── */
function resize(){
  const r=canvas.getBoundingClientRect();
  W=canvas.width=Math.round(r.width);
  H=canvas.height=Math.round(r.height);
}

/* ── RESET ── */
function reset(){
  // Safe starting position — open floor at (2.5, 2.5)
  px=2.5; py=2.5; pAngle=0.8;
  pHealth=100; score=0; wave=1;
  ammo=MAX_AMMO; reloading=false; reloadTimer=0;
  shootCooldown=0;
  termVisited.clear();
  gameOver=false; won=false;
  lastArtType=-1;
  enemies=ENEMIES_INIT.map(e=>({
    ...ETYPE[e.t],
    typeName:e.t,
    mx:e.mx, my:e.my,
    hp:ETYPE[e.t].hp,
    maxHp:ETYPE[e.t].hp,
    alive:true,
    hitFlash:0,
  }));
  updateHUD();
}

/* ── HUD ── */
function updateHUD(){
  if(hudscore) hudscore.textContent=score;
  if(hudwave) hudwave.textContent=wave;
  const alive=enemies.filter(e=>e.alive).length;
  if(hudalive) hudalive.textContent=alive;
  const hp=Math.max(0,Math.round(pHealth));
  if(hudhp) hudhp.textContent=hp+'%';
  if(hudhpfill){
    hudhpfill.style.width=hp+'%';
    hudhpfill.style.background=hp>50?'linear-gradient(90deg,#ff6b00,#ff9a3c)':hp>25?'linear-gradient(90deg,#f39c12,#e74c3c)':'#e74c3c';
  }
  if(hudammo){
    hudammo.innerHTML='';
    for(let i=0;i<MAX_AMMO;i++){
      const d=document.createElement('div');
      d.className='ammo-dot'+(i>=ammo?' empty':'');
      hudammo.appendChild(d);
    }
  }
  if(hudweapon) hudweapon.textContent=reloading?'RELOADING…':'NODE WEAVER';
}

/* ── MESSAGES ── */
function showMsg(t,d){
  if(!msgBoxEl)return;
  msgBoxEl.textContent=t;
  msgBoxEl.style.display='block';
  msgTimer=d||3;
}

function showArtToast(wallType){
  if(!artToast||!ART_MSGS[wallType]||wallType===lastArtType)return;
  lastArtType=wallType;
  artToast.textContent=ART_MSGS[wallType];
  artToast.style.display='block';
  artToastTimer=3.5;
}

/* ── RAYCASTING ── */
function castRay(angle){
  const sinA=Math.sin(angle), cosA=Math.cos(angle);
  let mx=Math.floor(px), my=Math.floor(py);
  const ddx=Math.abs(1/cosA), ddy=Math.abs(1/sinA);
  let sx,sy,sdx,sdy,side=0;
  if(cosA<0){ sx=-1; sdx=(px-mx)*ddx; } else { sx=1; sdx=(mx+1-px)*ddx; }
  if(sinA<0){ sy=-1; sdy=(py-my)*ddy; } else { sy=1; sdy=(my+1-py)*ddy; }
  let wallType=0, hitWallType=-1;
  for(let i=0;i<72;i++){
    if(sdx<sdy){ sdx+=ddx; mx+=sx; side=0; }
    else        { sdy+=ddy; my+=sy; side=1; }
    if(mx<0||mx>=MAP_W||my<0||my>=MAP_H){ wallType=1; break; }
    wallType=M[my][mx];
    if(wallType>0){ hitWallType=wallType; break; }
  }
  const dist=side===0?(mx-px+(1-sx)/2)/cosA:(my-py+(1-sy)/2)/sinA;
  let wallX;
  if(side===0) wallX=py+dist*sinA; else wallX=px+dist*cosA;
  wallX-=Math.floor(wallX);
  return { dist:Math.max(0.05,dist), side, wallType:hitWallType>=0?hitWallType:wallType, wallX };
}

/* ── DRAW FRAME ── */
let zBuf;
function drawFrame(dt, now){
  if(!ctx)return;
  if(!zBuf||zBuf.length!==W) zBuf=new Float32Array(W);

  // Sky
  const skyG=ctx.createLinearGradient(0,0,0,H*0.5);
  skyG.addColorStop(0,'#030710'); skyG.addColorStop(1,'#070d1a');
  ctx.fillStyle=skyG; ctx.fillRect(0,0,W,H*0.5);

  // Floor
  const flrG=ctx.createLinearGradient(0,H*0.5,0,H);
  flrG.addColorStop(0,'#050c18'); flrG.addColorStop(1,'#020408');
  ctx.fillStyle=flrG; ctx.fillRect(0,H*0.5,W,H*0.5);

  // Floor grid
  ctx.globalAlpha=0.04; ctx.strokeStyle='#ff9a3c'; ctx.lineWidth=1;
  for(let fy=1;fy<6;fy++){
    ctx.beginPath(); ctx.moveTo(0,H*0.5+fy*H*0.08); ctx.lineTo(W,H*0.5+fy*H*0.08); ctx.stroke();
  }
  ctx.globalAlpha=1;

  // Track nearest art wall for toast
  let nearestArtWall=-1, nearestArtDist=Infinity;

  // Walls
  for(let x=0;x<W;x++){
    const rayAngle=pAngle-HF+(x/W)*FOV;
    const { dist, side, wallType, wallX }=castRay(rayAngle);
    const wallH=Math.min(H,Math.floor(H/dist));
    const wallY=Math.floor((H-wallH)/2);
    zBuf[x]=dist;

    const fog=Math.min(1,dist/20);

    // Check if this is an art wall within range
    if((wallType===10||wallType===11||wallType===12)&&dist<5&&dist<nearestArtDist){
      nearestArtDist=dist; nearestArtWall=wallType;
    }

    const tc=getTexCanvas(wallType);
    const texX=Math.floor(wallX*TEX_SIZE);

    ctx.globalAlpha=side?0.6:1.0;
    ctx.globalAlpha*=(1-fog*0.75);
    ctx.drawImage(tc,texX,0,1,TEX_SIZE,x,wallY,1,wallH);
    ctx.globalAlpha=1;

    if(fog>0.05){
      ctx.fillStyle=`rgba(3,7,18,${fog*0.65})`;
      ctx.fillRect(x,wallY,1,wallH);
    }

    // Special FX
    if(wallType===3){
      ctx.fillStyle=`rgba(0,180,255,${0.04+0.03*Math.sin(now*0.002+x*0.05)})`;
      ctx.fillRect(x,wallY,1,wallH);
    }
    if(wallType===5){
      ctx.fillStyle=`rgba(255,107,0,${0.1+0.08*Math.sin(now*0.003)})`;
      ctx.fillRect(x,wallY,1,wallH);
    }
    if(wallType===4){
      const period=Math.floor(wallH/8);
      if(period>0){
        ctx.fillStyle=`rgba(255,107,0,${0.07+0.04*Math.sin(now*0.005+x)})`;
        for(let sy=wallY;sy<wallY+wallH;sy+=period) ctx.fillRect(x,sy,1,2);
      }
    }
    // Art wall glow
    if(wallType===10){
      ctx.fillStyle=`rgba(255,107,0,${0.06+0.04*Math.sin(now*0.002)})`;
      ctx.fillRect(x,wallY,1,wallH);
    }
    if(wallType===11){
      ctx.fillStyle=`rgba(231,76,60,${0.05+0.03*Math.sin(now*0.003+x*0.02)})`;
      ctx.fillRect(x,wallY,1,wallH);
    }
    if(wallType===12){
      ctx.fillStyle=`rgba(155,89,182,${0.06+0.04*Math.sin(now*0.0025+x*0.03)})`;
      ctx.fillRect(x,wallY,1,wallH);
    }
  }

  // Show art toast if player is facing art wall
  if(nearestArtWall>0&&nearestArtDist<4) showArtToast(nearestArtWall);

  // Sprites
  const alive=enemies.filter(e=>e.alive);
  alive.sort((a,b)=>{
    const da=(a.mx-px)**2+(a.my-py)**2;
    const db=(b.mx-px)**2+(b.my-py)**2;
    return db-da;
  });
  alive.forEach(e=>{
    const dx=e.mx-px, dy=e.my-py;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<0.2)return;
    let angle=Math.atan2(dy,dx)-pAngle;
    while(angle>Math.PI)angle-=Math.PI*2;
    while(angle<-Math.PI)angle+=Math.PI*2;
    if(Math.abs(angle)>HF*1.5)return;
    const sprW=Math.min(W,Math.floor((H/dist)*e.size));
    const sprH=Math.floor(sprW*1.3);
    const screenX=Math.floor(W/2+(angle/HF)*(W/2))-sprW/2;
    const screenY=Math.floor(H/2-sprH*0.6);
    if(screenX+sprW<0||screenX>W)return;
    const cx2=Math.floor(screenX+sprW/2);
    if(cx2>=0&&cx2<W&&zBuf[cx2]<dist)return;

    const fogF=Math.min(0.85,dist/20);
    const alpha=(1-fogF*0.7)*(graceActive?0.4:1);
    const hfP=e.hp/e.maxHp;

    ctx.save();
    ctx.globalAlpha=alpha;

    const flash=e.hitFlash>0;
    const bodyColor=flash?'#ffffff':e.color;

    // Shadow
    ctx.globalAlpha=alpha*0.25;
    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.ellipse(screenX+sprW/2,screenY+sprH+4,sprW*0.4,sprH*0.06,0,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha=alpha;

    // Enemy shapes
    if(e.typeName==='CLOUD_LIABILITY'){
      ctx.fillStyle=bodyColor;
      ctx.beginPath();
      ctx.arc(screenX+sprW*0.5,screenY+sprH*0.55,sprW*0.35,0,Math.PI*2);
      ctx.arc(screenX+sprW*0.28,screenY+sprH*0.65,sprW*0.25,0,Math.PI*2);
      ctx.arc(screenX+sprW*0.72,screenY+sprH*0.65,sprW*0.25,0,Math.PI*2);
      ctx.fill();
      ctx.fillRect(screenX+sprW*0.2,screenY+sprH*0.6,sprW*0.6,sprH*0.25);
    } else if(e.typeName==='EXFILTRATION'){
      ctx.fillStyle=bodyColor;
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3-Math.PI/6;
        const x=screenX+sprW*0.5+sprW*0.4*Math.cos(a);
        const y=screenY+sprH*0.5+sprH*0.4*Math.sin(a);
        if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath(); ctx.fill();
    } else if(e.typeName==='ZAPSIM'){
      ctx.fillStyle=bodyColor;
      ctx.beginPath();
      ctx.moveTo(screenX+sprW*0.55,screenY+sprH*0.1);
      ctx.lineTo(screenX+sprW*0.3, screenY+sprH*0.55);
      ctx.lineTo(screenX+sprW*0.5, screenY+sprH*0.55);
      ctx.lineTo(screenX+sprW*0.25,screenY+sprH*0.9);
      ctx.lineTo(screenX+sprW*0.65,screenY+sprH*0.45);
      ctx.lineTo(screenX+sprW*0.45,screenY+sprH*0.45);
      ctx.closePath(); ctx.fill();
    } else if(e.typeName==='AI_BOT'){
      ctx.fillStyle=bodyColor;
      ctx.fillRect(screenX+sprW*0.15,screenY+sprH*0.2,sprW*0.7,sprH*0.6);
      ctx.fillStyle=e.accent;
      ctx.fillRect(screenX+sprW*0.25,screenY+sprH*0.1,sprW*0.5,sprH*0.2);
      ctx.fillStyle='rgba(0,0,0,0.8)';
      ctx.fillRect(screenX+sprW*0.3, screenY+sprH*0.3,sprW*0.15,sprH*0.12);
      ctx.fillRect(screenX+sprW*0.55,screenY+sprH*0.3,sprW*0.15,sprH*0.12);
      ctx.fillStyle=flash?'#fff':e.accent;
      ctx.fillRect(screenX+sprW*0.32,screenY+sprH*0.31,sprW*0.1,sprH*0.08);
      ctx.fillRect(screenX+sprW*0.57,screenY+sprH*0.31,sprW*0.1,sprH*0.08);
    } else {
      ctx.fillStyle=bodyColor;
      roundRect(ctx,screenX+sprW*0.1,screenY+sprH*0.1,sprW*0.8,sprH*0.8,sprW*0.12);
      ctx.fill();
    }

    // Glyph
    ctx.fillStyle=e.hitFlash>0?'#000':e.accent;
    ctx.font=`bold ${Math.max(10,Math.floor(sprW*0.38))}px monospace`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(e.glyph,screenX+sprW/2,screenY+sprH*0.5);

    // Health bar
    if(dist<12){
      const bbW=Math.max(22,sprW*0.9), bbH=5;
      const bbX=screenX+(sprW-bbW)/2, bbY=screenY-10;
      ctx.globalAlpha=alpha*0.8;
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(bbX,bbY,bbW,bbH);
      ctx.fillStyle=hfP>0.5?'#ff6b00':hfP>0.25?'#f39c12':'#e74c3c';
      ctx.fillRect(bbX,bbY,bbW*hfP,bbH);
      if(dist<7){
        ctx.globalAlpha=alpha*0.7;
        ctx.fillStyle=e.accent;
        ctx.font=`bold ${Math.max(7,Math.floor(sprW*0.18))}px monospace`;
        ctx.textAlign='center';
        ctx.fillText(e.name,screenX+sprW/2,bbY-7);
      }
    }
    ctx.restore();
  });

  drawWeapon(dt,now);
  drawMinimap();
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r); ctx.lineTo(x+w,y+h-r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r); ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}

function drawWeapon(dt,now){
  wBob+=dt*3*wBobDir;
  if(Math.abs(wBob)>0.9) wBobDir*=-1;
  const isMoving=keys['w']||keys['s']||keys['arrowup']||keys['arrowdown']||touchDelta.fw!==0;
  const bob=isMoving?wBob*8:0;
  const shake=shootAnim>0?(Math.random()-0.5)*12*shootAnim:0;
  const wW=Math.floor(W*0.35);
  const wH=Math.floor(wW*1.1);
  const wX=Math.floor(W/2-wW/2+shake);
  const wY=H-wH+Math.floor(wH*0.3)+Math.floor(bob)+(shootAnim>0?-wH*0.06:0);

  ctx.save();
  const bodyColor=shootAnim>0?'rgba(255,107,0,0.92)':'rgba(8,28,48,0.92)';
  ctx.fillStyle=bodyColor;
  roundRect(ctx,wX,wY+wH*0.28,wW,wH*0.72,10); ctx.fill();

  ctx.fillStyle='rgba(255,154,60,0.3)';
  ctx.fillRect(wX+wW*0.05,wY+wH*0.35,wW*0.08,wH*0.5);
  ctx.fillRect(wX+wW*0.87,wY+wH*0.35,wW*0.08,wH*0.5);

  ctx.fillStyle=shootAnim>0?'#ff6b00':'rgba(255,154,60,0.85)';
  roundRect(ctx,wX+wW*0.37,wY,wW*0.26,wH*0.38,5); ctx.fill();

  ctx.fillStyle='rgba(0,0,0,0.8)';
  ctx.beginPath(); ctx.arc(wX+wW*0.5,wY+2,wW*0.06,0,Math.PI*2); ctx.fill();

  const cellColors=['#ff6b00','#ff9a3c','#1abc9c','#3498db'];
  for(let i=0;i<4;i++){
    ctx.fillStyle=i<(ammo/MAX_AMMO*4)?cellColors[i]:'rgba(255,255,255,0.08)';
    ctx.fillRect(wX+wW*0.2+i*wW*0.06,wY+wH*0.5,wW*0.04,wH*0.15);
  }

  if(shootAnim>0){
    ctx.globalAlpha=shootAnim*0.9;
    const grd=ctx.createRadialGradient(wX+wW*0.5,wY-wH*0.05,0,wX+wW*0.5,wY-wH*0.05,wW*0.25);
    grd.addColorStop(0,'rgba(255,255,255,0.9)');
    grd.addColorStop(0.4,'rgba(255,107,0,0.7)');
    grd.addColorStop(1,'rgba(255,107,0,0)');
    ctx.fillStyle=grd;
    ctx.beginPath(); ctx.arc(wX+wW*0.5,wY-wH*0.05,wW*0.25,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
  if(shootAnim>0) shootAnim=Math.max(0,shootAnim-dt*5);
}

function drawMinimap(){
  if(!mmCtx)return;
  const mW=mm.width, mH=mm.height;
  const cW=mW/MAP_W, cH=mH/MAP_H;
  mmCtx.clearRect(0,0,mW,mH);
  mmCtx.fillStyle='rgba(0,0,0,0.8)'; mmCtx.fillRect(0,0,mW,mH);
  for(let my2=0;my2<MAP_H;my2++){
    for(let mx2=0;mx2<MAP_W;mx2++){
      const t=M[my2][mx2];
      if(t===0)continue;
      mmCtx.fillStyle=
        t===1?'rgba(0,60,110,0.75)':
        t===2?'rgba(30,70,20,0.75)':
        t===3?'rgba(0,130,180,0.45)':
        t===4?'rgba(0,160,130,0.75)':
        t===5?'rgba(0,180,80,0.9)':
        t===6?'rgba(60,60,120,0.75)':
        t===7?'rgba(0,180,120,0.6)':
        t===8?'rgba(20,20,60,0.75)':
        t===10?'rgba(0,150,120,0.8)':
        t===11?'rgba(180,40,40,0.8)':
        t===12?'rgba(120,60,160,0.8)':'#555';
      mmCtx.fillRect(mx2*cW+0.5,my2*cH+0.5,cW-1,cH-1);
    }
  }
  enemies.forEach(e=>{
    if(!e.alive)return;
    mmCtx.fillStyle=e.color;
    mmCtx.beginPath();
    mmCtx.arc(e.mx*cW,e.my*cH,2,0,Math.PI*2);
    mmCtx.fill();
  });
  mmCtx.fillStyle='#ff6b00';
  mmCtx.beginPath(); mmCtx.arc(px*cW,py*cH,3,0,Math.PI*2); mmCtx.fill();
  mmCtx.strokeStyle='rgba(255,107,0,0.35)'; mmCtx.lineWidth=1;
  mmCtx.beginPath();
  mmCtx.moveTo(px*cW,py*cH);
  mmCtx.lineTo((px+Math.cos(pAngle-HF)*4)*cW,(py+Math.sin(pAngle-HF)*4)*cH);
  mmCtx.moveTo(px*cW,py*cH);
  mmCtx.lineTo((px+Math.cos(pAngle+HF)*4)*cW,(py+Math.sin(pAngle+HF)*4)*cH);
  mmCtx.stroke();
}

/* ── COLLISION — bigger margin for smoother movement ── */
function canMove(nx,ny){
  const m=0.22; // tighter for Doom feel
  const check=(x,y)=>{
    const tx=Math.floor(x), ty=Math.floor(y);
    if(tx<0||tx>=MAP_W||ty<0||ty>=MAP_H) return false;
    return M[ty][tx]===0;
  };
  return check(nx+m,ny+m) && check(nx-m,ny+m) && check(nx+m,ny-m) && check(nx-m,ny-m);
}

/* ── SHOOT ── */
function shoot(){
  if(ammo<=0||reloading||shootCooldown>0)return;
  ammo--; shootCooldown=0.18; shootAnim=1.0; updateHUD();
  let best=Infinity, hit=null;
  enemies.forEach(e=>{
    if(!e.alive)return;
    const dx=e.mx-px, dy=e.my-py;
    const dist=Math.sqrt(dx*dx+dy*dy);
    let angle=Math.atan2(dy,dx)-pAngle;
    while(angle>Math.PI)angle-=Math.PI*2;
    while(angle<-Math.PI)angle+=Math.PI*2;
    if(Math.abs(angle)<0.22&&dist<best&&dist<20){ best=dist; hit=e; }
  });
  if(hit){
    hit.hp--; hit.hitFlash=1.0;
    if(hit.hp<=0){
      hit.alive=false; score+=hit.reward;
      showMsg('[ '+hit.name+' ] NEUTRALIZED  +'+hit.reward+' pts', 2.5);
      updateHUD();
      if(enemies.every(e=>!e.alive)) showMsg('ALL THREATS CLEARED — reach the EXIT [ E near glowing door ]', 5);
    } else {
      showMsg('HIT — '+hit.name+' integrity: '+hit.hp+'/'+hit.maxHp, 1.2);
    }
  }
}

/* ── UPDATE ── */
function update(dt,now){
  if(!running||gameOver||won)return;

  if(graceActive){
    graceTimer-=dt;
    const sec=Math.ceil(graceTimer);
    if(graceCount) graceCount.textContent=sec<1?'GO!':sec;
    if(graceTimer<=0){
      graceActive=false;
      if(graceEl) graceEl.style.display='none';
      showMsg('EMPIRE ONLINE — Neutralize all threats. E=interact.', 4);
    }
    // Still allow movement during grace
  }

  // Art toast timer
  if(artToastTimer>0){
    artToastTimer-=dt;
    if(artToastTimer<=0&&artToast) artToast.style.display='none';
  }

  // Touch look
  pAngle+=touchLookDX*MOUSE_SENS*2.5;
  touchLookDX=0;

  // Movement — Doom-style strafe
  let fw=0, strafe=0, rot=0;
  if(keys['w']||keys['arrowup'])   fw+=1;
  if(keys['s']||keys['arrowdown']) fw-=1;
  if(keys['a']) strafe-=1;
  if(keys['d']) strafe+=1;
  if(keys['arrowleft'])  rot-=1;
  if(keys['arrowright']) rot+=1;
  fw+=touchDelta.fw;
  strafe+=touchDelta.strafe||0;
  rot+=touchDelta.rot;

  pAngle+=rot*ROT_SPEED*dt;

  // Slide along walls instead of stopping completely
  const moveX = Math.cos(pAngle)*fw + Math.cos(pAngle+Math.PI/2)*strafe;
  const moveY = Math.sin(pAngle)*fw + Math.sin(pAngle+Math.PI/2)*strafe;
  const nx=px+moveX*MOVE_SPEED*dt;
  const ny=py+moveY*MOVE_SPEED*dt;
  if(canMove(nx,py)) px=nx;
  if(canMove(px,ny)) py=ny;

  // Interact E
  if(keys['e']){
    const ix=Math.floor(px), iy=Math.floor(py);
    for(let dy2=-2;dy2<=2;dy2++) for(let dx2=-2;dx2<=2;dx2++){
      const cx2=ix+dx2, cy2=iy+dy2;
      if(cx2<0||cx2>=MAP_W||cy2<0||cy2>=MAP_H)continue;
      const t=M[cy2][cx2];
      if(t===4){
        const key=cx2+','+cy2;
        if(!termVisited.has(key)){
          const ddx=cx2+0.5-px, ddy=cy2+0.5-py;
          if(Math.sqrt(ddx*ddx+ddy*ddy)<2.0){
            termVisited.add(key);
            const msg=TERMINAL_MSGS[termVisited.size%TERMINAL_MSGS.length];
            score+=20; updateHUD();
            showMsg('[ TERMINAL ] '+msg, 4.5);
            healFlashEl.classList.add('on');
            setTimeout(()=>healFlashEl.classList.remove('on'),400);
          }
        }
      }
      if(t===5){
        const ddx=cx2+0.5-px, ddy=cy2+0.5-py;
        if(Math.sqrt(ddx*ddx+ddy*ddy)<2.2){
          if(enemies.every(e=>!e.alive)){ triggerWin(); return; }
          else showMsg('Neutralize all threats first. '+enemies.filter(e=>e.alive).length+' remain.', 3);
        }
      }
    }
  }

  // Health pickups
  const hix=Math.floor(px), hiy=Math.floor(py);
  const hKey=hix+','+hiy;
  if(M[hiy]&&M[hiy][hix]===7&&!termVisited.has('hp_'+hKey)){
    termVisited.add('hp_'+hKey);
    pHealth=Math.min(100,pHealth+30);
    updateHUD();
    showMsg('[ MEDKIT ] Node integrity restored +30 HP', 2.5);
    healFlashEl.classList.add('on');
    setTimeout(()=>healFlashEl.classList.remove('on'),400);
  }

  if(graceActive) return; // no damage or enemy movement during grace

  // Shoot
  if((keys[' ']||touchDelta.fire)&&!reloading&&ammo>0&&shootCooldown<=0) shoot();
  if(shootCooldown>0) shootCooldown-=dt;

  // Reload
  if(keys['r']&&!reloading&&ammo<MAX_AMMO){
    reloading=true; reloadTimer=RELOAD_TIME;
    showMsg('RELOADING NODE WEAVER…', RELOAD_TIME);
  }
  if(reloading){
    reloadTimer-=dt;
    if(reloadTimer<=0){ ammo=MAX_AMMO; reloading=false; updateHUD(); showMsg('NODE WEAVER READY',1); }
  }
  if(ammo===0&&!reloading){ reloading=true; reloadTimer=RELOAD_TIME; showMsg('RELOADING NODE WEAVER…',RELOAD_TIME); }

  // Enemy AI
  enemies.forEach(e=>{
    if(!e.alive)return;
    if(e.hitFlash>0) e.hitFlash-=dt*6;
    const ddx=px-e.mx, ddy=py-e.my;
    const dist=Math.sqrt(ddx*ddx+ddy*ddy);
    if(dist<0.01)return;
    const jFactor=e.typeName==='ZAPSIM'?0.022:0.005;
    const jx=(Math.random()-0.5)*jFactor*dist;
    const jy=(Math.random()-0.5)*jFactor*dist;
    const speed=e.speed*60;
    const nx2=e.mx+(ddx/dist)*speed*dt+jx;
    const ny2=e.my+(ddy/dist)*speed*dt+jy;
    // Enemy also slides along walls
    const etx=Math.floor(nx2), ety=Math.floor(e.my);
    const etx2=Math.floor(e.mx), ety2=Math.floor(ny2);
    if(etx>=0&&etx<MAP_W&&ety>=0&&ety<MAP_H&&M[ety][etx]===0) e.mx=nx2;
    if(etx2>=0&&etx2<MAP_W&&ety2>=0&&ety2<MAP_H&&M[ety2][etx2]===0) e.my=ny2;
    // Damage
    if(dist<0.75){
      pHealth-=e.dmg*dt;
      hitFlashEl.classList.add('on');
      setTimeout(()=>hitFlashEl.classList.remove('on'),70);
      if(pHealth<=0){ pHealth=0; triggerDeath(); }
      updateHUD();
    }
  });

  if(enemies.every(e=>!e.alive)&&!won){
    showMsg('ALL THREATS CLEARED — find the EXIT node (E key near glowing door)', 5);
  }
  updateHUD();
}

function triggerWin(){
  won=true; running=false;
  const ws=document.getElementById('win-score');
  if(ws) ws.textContent='EMPIRE SCORE: '+score;
  if(winScreen) winScreen.style.display='flex';
}
function triggerDeath(){
  gameOver=true; running=false;
  const os=document.getElementById('over-score');
  if(os) os.textContent='FINAL SCORE: '+score;
  if(overScreen) overScreen.style.display='flex';
}

/* ── GAME LOOP ── */
let lastTime=0, rafId=null;
function loop(ts){
  rafId=requestAnimationFrame(loop);
  const dt=Math.min(0.05,(ts-lastTime)/1000);
  lastTime=ts;
  if(!running&&!graceActive)return;
  if(msgTimer>0){ msgTimer-=dt; if(msgTimer<=0&&msgBoxEl) msgBoxEl.style.display='none'; }
  update(dt,ts);
  drawFrame(dt,ts);
}

/* ── START ── */
function startGame(){
  if(startScreen) startScreen.style.display='none';
  if(winScreen)   winScreen.style.display='none';
  if(overScreen)  overScreen.style.display='none';
  reset(); resize();
  running=true;
  graceActive=true; graceTimer=8;
  if(graceEl)    graceEl.style.display='flex';
  if(graceCount) graceCount.textContent='8';
  canvas.focus();
}

/* ── KEYBOARD ── */
document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  keys[k]=true;
  if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key)) e.preventDefault();
});
document.addEventListener('keyup',e=>{ keys[e.key.toLowerCase()]=false; });

/* ── MOUSE ── */
canvas.addEventListener('click',()=>{
  canvas.focus();
  if(running&&canvas.requestPointerLock) canvas.requestPointerLock();
  if(!graceActive&&!reloading&&ammo>0&&shootCooldown<=0) shoot();
});
document.addEventListener('mousemove',e=>{
  if(document.pointerLockElement===canvas) pAngle+=e.movementX*MOUSE_SENS;
});

/* ── TOUCH LOOK (swipe on canvas) ── */
let touchLookId=null;
canvas.addEventListener('touchstart',e=>{
  if(e.touches.length>0){ touchLookId=e.touches[0].identifier; touchLookStart=e.touches[0].clientX; }
},{passive:true});
canvas.addEventListener('touchmove',e=>{
  for(let i=0;i<e.touches.length;i++){
    if(e.touches[i].identifier===touchLookId&&touchLookStart!==null){
      touchLookDX=e.touches[i].clientX-touchLookStart;
      touchLookStart=e.touches[i].clientX;
    }
  }
},{passive:true});
canvas.addEventListener('touchend',()=>{ touchLookStart=null; touchLookDX=0; },{passive:true});

/* ── D-PAD — improved with mouseleave ── */
function setupDpad(id, prop, val){
  const el=document.getElementById(id);
  if(!el)return;
  const on=()=>{ touchDelta[prop]=val; };
  const off=()=>{ touchDelta[prop]=0; };
  el.addEventListener('touchstart',e=>{ e.preventDefault(); e.stopPropagation(); on(); },{passive:false});
  el.addEventListener('touchend',  e=>{ e.preventDefault(); e.stopPropagation(); off(); },{passive:false});
  el.addEventListener('touchcancel',e=>{ e.preventDefault(); e.stopPropagation(); off(); },{passive:false});
  el.addEventListener('mousedown',  ()=>on());
  el.addEventListener('mouseup',    ()=>off());
  el.addEventListener('mouseleave', ()=>off());
}
setupDpad('btn-up',    'fw',  1);
setupDpad('btn-down',  'fw', -1);
setupDpad('btn-left',  'strafe',-1);
setupDpad('btn-right', 'strafe', 1);

const fireBtn=document.getElementById('fire-btn');
if(fireBtn){
  fireBtn.addEventListener('touchstart',e=>{
    e.preventDefault(); touchDelta.fire=true;
    if(!graceActive) shoot();
  },{passive:false});
  fireBtn.addEventListener('touchend',e=>{ e.preventDefault(); touchDelta.fire=false; },{passive:false});
  fireBtn.addEventListener('touchcancel',e=>{ e.preventDefault(); touchDelta.fire=false; },{passive:false});
  fireBtn.addEventListener('mousedown',()=>{ touchDelta.fire=true; if(!graceActive) shoot(); });
  fireBtn.addEventListener('mouseup',()=>touchDelta.fire=false);
}

const reloadBtn=document.getElementById('reload-btn');
if(reloadBtn){
  const doReload=()=>{ if(!reloading&&ammo<MAX_AMMO){ reloading=true; reloadTimer=RELOAD_TIME; showMsg('RELOADING NODE WEAVER…',RELOAD_TIME); } };
  reloadBtn.addEventListener('touchstart',e=>{ e.preventDefault(); doReload(); },{passive:false});
  reloadBtn.addEventListener('mousedown',()=>doReload());
}

/* ── START / RESTART ── */
document.getElementById('start-btn').addEventListener('click',startGame);
document.getElementById('win-restart').addEventListener('click',startGame);
document.getElementById('over-restart').addEventListener('click',startGame);

/* ── VISIBILITY ── */
document.addEventListener('visibilitychange',()=>{
  if(document.hidden) running=false;
  else if(!gameOver&&!won&&startScreen?.style.display==='none') running=true;
});

/* ── RESIZE ── */
window.addEventListener('resize',()=>{
  clearTimeout(window._resizeTimer);
  window._resizeTimer=setTimeout(resize,100);
});

/* ── BOOT ── */
resize();
lastTime=performance.now();
rafId=requestAnimationFrame(loop);

})();
