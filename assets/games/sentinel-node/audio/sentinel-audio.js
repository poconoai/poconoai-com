/* ============================================================================
   SENTINEL NODE: BREACH PROTOCOL — Procedural Audio Engine
   ----------------------------------------------------------------------------
   100% procedural Web Audio API. No external files. No network calls.
   No analytics, no telemetry, no tracking. Fully self-contained.

   ASSET / LICENSE STATUS
   ----------------------
   External assets used .............. NONE
   Source URLs ....................... NONE (nothing fetched)
   Licenses required ................. NONE (all sound is synthesized at runtime)
   Attribution required .............. NONE
   Doom / commercial FPS assets ...... NONE — zero copyrighted audio of any kind
   Network / telemetry / tracking .... NONE

   All ten sounds below are generated live from oscillators, filtered noise
   bursts, gain envelopes, biquad filters, and waveshaper distortion. Because
   nothing is loaded from disk or network, there is zero licensing risk and the
   game stays a single self-contained file (or this one tiny JS companion).

   USAGE
   -----
   1. Include this file:  <script src="sentinel-audio.js"></script>
      (or paste the IIFE contents into a <script> tag in the game HTML)
   2. Audio context must start after a user gesture (browser autoplay policy).
      Call SentinelAudio.unlock() inside your first click/keydown/touch handler.
   3. Then trigger sounds by name:
         SentinelAudio.play('blaster');
         SentinelAudio.play('enemyHit');
         SentinelAudio.play('enemyDefeated');
         SentinelAudio.play('playerDamage');
         SentinelAudio.play('gate');
         SentinelAudio.play('coreActivate');
         SentinelAudio.play('win');
         SentinelAudio.play('lose');
         SentinelAudio.play('lowHealth');
         SentinelAudio.play('uiClick');
   4. Mute / unmute:  SentinelAudio.setMuted(true|false)
      Master volume:  SentinelAudio.setVolume(0..1)

   FALLBACK NOTE
   -------------
   There is no asset to "fail to load" — procedural generation IS the fallback
   and the primary path simultaneously. If Web Audio is unavailable (extremely
   old browser), every call no-ops safely and the game continues silently.
   ============================================================================ */

window.SentinelAudio = (function () {
  'use strict';

  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  var master = null;
  var muted = false;
  var masterVol = 0.5;
  var supported = !!AC;

  /* ---- Lifecycle -------------------------------------------------------- */
  function ensure() {
    if (!supported) return false;
    if (!ctx) {
      try {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = masterVol;
        master.connect(ctx.destination);
      } catch (e) { supported = false; return false; }
    }
    return true;
  }

  // Call inside a user-gesture handler to satisfy autoplay policy
  function unlock() {
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
  }

  function setMuted(m) {
    muted = !!m;
    if (master) master.gain.setTargetAtTime(muted ? 0 : masterVol, ctx.currentTime, 0.01);
  }
  function setVolume(v) {
    masterVol = Math.max(0, Math.min(1, v));
    if (master && !muted) master.gain.setTargetAtTime(masterVol, ctx.currentTime, 0.01);
  }

  /* ---- Low-level helpers ------------------------------------------------ */
  function now() { return ctx.currentTime; }

  function env(node, t0, peak, attack, decay, sustain, sustainLevel, release) {
    var g = node.gain;
    g.cancelScheduledValues(t0);
    g.setValueAtTime(0.0001, t0);
    g.exponentialRampToValueAtTime(Math.max(0.0001, peak), t0 + attack);
    g.exponentialRampToValueAtTime(Math.max(0.0001, peak * sustainLevel), t0 + attack + decay);
    g.setValueAtTime(Math.max(0.0001, peak * sustainLevel), t0 + attack + decay + sustain);
    g.exponentialRampToValueAtTime(0.0001, t0 + attack + decay + sustain + release);
  }

  function osc(type, freq, t0) {
    var o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    return o;
  }

  // White-ish noise buffer (cached)
  var noiseBuf = null;
  function noiseBuffer() {
    if (noiseBuf) return noiseBuf;
    var len = ctx.sampleRate * 1.0;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function noiseSrc() {
    var s = ctx.createBufferSource();
    s.buffer = noiseBuffer();
    return s;
  }

  // Waveshaper for grit/distortion
  function shaper(amount) {
    var ws = ctx.createWaveShaper();
    var n = 256, curve = new Float32Array(n), k = amount || 40;
    for (var i = 0; i < n; i++) {
      var x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x));
    }
    ws.curve = curve;
    ws.oversample = '4x';
    return ws;
  }

  /* ---- The ten sounds --------------------------------------------------- */

  // 1) Audit Chain Blaster — sharp sci-fi pulse / gun pop
  function sBlaster(t) {
    // Layer A: fast downward pitch zap (square through distortion)
    var o = osc('square', 880, t);
    o.frequency.exponentialRampToValueAtTime(120, t + 0.12);
    var dist = shaper(25);
    var g = ctx.createGain();
    env(g, t, 0.34, 0.002, 0.05, 0, 0.3, 0.07);
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 1.2;
    o.connect(dist); dist.connect(bp); bp.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.2);

    // Layer B: transient noise "pop"
    var n = noiseSrc();
    var ng = ctx.createGain();
    env(ng, t, 0.22, 0.001, 0.03, 0, 0.2, 0.02);
    var hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 1800;
    n.connect(hp); hp.connect(ng); ng.connect(master);
    n.start(t); n.stop(t + 0.08);

    // Layer C: sub thump for body
    var sub = osc('sine', 160, t);
    sub.frequency.exponentialRampToValueAtTime(60, t + 0.1);
    var sg = ctx.createGain();
    env(sg, t, 0.3, 0.002, 0.06, 0, 0.2, 0.06);
    sub.connect(sg); sg.connect(master);
    sub.start(t); sub.stop(t + 0.18);
  }

  // 2) Enemy hit — digital impact glitch
  function sEnemyHit(t) {
    var n = noiseSrc();
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.setValueAtTime(2600, t);
    bp.frequency.exponentialRampToValueAtTime(900, t + 0.08);
    bp.Q.value = 3;
    var g = ctx.createGain();
    env(g, t, 0.28, 0.001, 0.04, 0, 0.2, 0.04);
    var dist = shaper(50);
    n.connect(bp); bp.connect(dist); dist.connect(g); g.connect(master);
    n.start(t); n.stop(t + 0.12);

    // glitch ring — quick FM-ish detuned square
    var o = osc('square', 1400, t);
    o.frequency.setValueAtTime(1400, t);
    o.frequency.setValueAtTime(2100, t + 0.02);
    o.frequency.setValueAtTime(980, t + 0.045);
    var og = ctx.createGain();
    env(og, t, 0.12, 0.001, 0.02, 0, 0.1, 0.03);
    o.connect(og); og.connect(master);
    o.start(t); o.stop(t + 0.09);
  }

  // 3) Enemy defeated — short corrupted shutdown
  function sEnemyDefeated(t) {
    // descending detuned saws into distortion
    [220, 223].forEach(function (f, i) {
      var o = osc('sawtooth', f, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.4);
      var g = ctx.createGain();
      env(g, t, 0.2, 0.003, 0.08, 0.05, 0.4, 0.18);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(3000, t);
      lp.frequency.exponentialRampToValueAtTime(300, t + 0.4);
      var dist = shaper(30);
      o.connect(dist); dist.connect(lp); lp.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.55);
    });
    // bit-crush stutter via gated noise
    var n = noiseSrc();
    var ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    for (var i = 0; i < 6; i++) {
      var tt = t + 0.05 + i * 0.05;
      ng.gain.setValueAtTime(0.12 * (1 - i / 6), tt);
      ng.gain.setValueAtTime(0.0001, tt + 0.02);
    }
    var nf = ctx.createBiquadFilter();
    nf.type = 'bandpass'; nf.frequency.value = 1500; nf.Q.value = 5;
    n.connect(nf); nf.connect(ng); ng.connect(master);
    n.start(t); n.stop(t + 0.45);
  }

  // 4) Player damage — warning thud / shield crack
  function sPlayerDamage(t) {
    // low thud
    var o = osc('sine', 120, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.22);
    var g = ctx.createGain();
    env(g, t, 0.5, 0.002, 0.08, 0.02, 0.3, 0.14);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.3);

    // shield crack — short bright distorted noise crackle
    var n = noiseSrc();
    var hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 2500;
    var dist = shaper(60);
    var ng = ctx.createGain();
    env(ng, t, 0.25, 0.001, 0.05, 0, 0.2, 0.05);
    n.connect(hp); hp.connect(dist); dist.connect(ng); ng.connect(master);
    n.start(t); n.stop(t + 0.12);

    // dissonant ring for "alarm" feel
    var o2 = osc('triangle', 330, t);
    var o2g = ctx.createGain();
    env(o2g, t, 0.12, 0.005, 0.1, 0.02, 0.3, 0.1);
    o2.connect(o2g); o2g.connect(master);
    o2.start(t); o2.stop(t + 0.25);
  }

  // 5) Door / gate activation — hydraulic sci-fi seal
  function sGate(t) {
    // rising filtered noise "hiss-whoosh"
    var n = noiseSrc();
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
    bp.Q.value = 1.5;
    var g = ctx.createGain();
    env(g, t, 0.22, 0.04, 0.1, 0.12, 0.6, 0.18);
    n.connect(bp); bp.connect(g); g.connect(master);
    n.start(t); n.stop(t + 0.6);

    // mechanical "clunk" seal at the end
    var o = osc('square', 90, t + 0.4);
    o.frequency.exponentialRampToValueAtTime(50, t + 0.5);
    var og = ctx.createGain();
    env(og, t + 0.4, 0.35, 0.002, 0.05, 0, 0.3, 0.08);
    var dist = shaper(20);
    o.connect(dist); dist.connect(og); og.connect(master);
    o.start(t + 0.4); o.stop(t + 0.6);

    // servo whine
    var sv = osc('sawtooth', 600, t);
    sv.frequency.exponentialRampToValueAtTime(180, t + 0.4);
    var svg = ctx.createGain();
    env(svg, t, 0.06, 0.02, 0.1, 0.1, 0.5, 0.15);
    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2000;
    sv.connect(lp); lp.connect(svg); svg.connect(master);
    sv.start(t); sv.stop(t + 0.5);
  }

  // 6) Sentinel Core activation — rising power tone
  function sCoreActivate(t) {
    // stacked rising harmonics (power-up)
    var base = 110;
    [1, 2, 3, 4.01].forEach(function (mult, i) {
      var o = osc(i === 0 ? 'sawtooth' : 'sine', base * mult, t);
      o.frequency.exponentialRampToValueAtTime(base * mult * 4, t + 0.9);
      var g = ctx.createGain();
      var peak = 0.16 / (i + 1);
      env(g, t, peak, 0.25, 0.2, 0.25, 0.7, 0.25);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 1.0);
    });
    // shimmer sweep
    var n = noiseSrc();
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(800, t);
    bp.frequency.exponentialRampToValueAtTime(6000, t + 0.9);
    bp.Q.value = 4;
    var ng = ctx.createGain();
    env(ng, t, 0.1, 0.3, 0.2, 0.2, 0.6, 0.25);
    n.connect(bp); bp.connect(ng); ng.connect(master);
    n.start(t); n.stop(t + 1.0);
    // confirming bell at apex
    var bell = osc('sine', 880, t + 0.85);
    var bg = ctx.createGain();
    env(bg, t + 0.85, 0.2, 0.004, 0.15, 0.05, 0.4, 0.2);
    bell.connect(bg); bg.connect(master);
    bell.start(t + 0.85); bell.stop(t + 1.3);
  }

  // 7) Win — clean secure-system confirmation (major arpeggio)
  function sWin(t) {
    var notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    notes.forEach(function (f, i) {
      var tt = t + i * 0.1;
      var o = osc('triangle', f, tt);
      var o2 = osc('sine', f * 2, tt);
      var g = ctx.createGain();
      env(g, tt, 0.22, 0.01, 0.12, 0.06, 0.5, 0.25);
      o.connect(g); o2.connect(g); g.connect(master);
      o.start(tt); o.stop(tt + 0.5);
      o2.start(tt); o2.stop(tt + 0.5);
    });
    // soft pad underneath
    var pad = osc('sine', 261.63, t);
    var pg = ctx.createGain();
    env(pg, t, 0.12, 0.05, 0.2, 0.3, 0.6, 0.4);
    pad.connect(pg); pg.connect(master);
    pad.start(t); pad.stop(t + 1.0);
  }

  // 8) Lose — system compromise alarm
  function sLose(t) {
    // two descending dissonant alarm sweeps
    [0, 0.28].forEach(function (off) {
      var o = osc('sawtooth', 440, t + off);
      o.frequency.exponentialRampToValueAtTime(110, t + off + 0.26);
      var g = ctx.createGain();
      env(g, t + off, 0.28, 0.005, 0.05, 0.08, 0.6, 0.12);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1800;
      var dist = shaper(35);
      o.connect(dist); dist.connect(lp); lp.connect(g); g.connect(master);
      o.start(t + off); o.stop(t + off + 0.28);
    });
    // dissonant low cluster (minor 2nd) for "wrong"
    [98, 104].forEach(function (f) {
      var o = osc('square', f, t + 0.5);
      var g = ctx.createGain();
      env(g, t + 0.5, 0.16, 0.01, 0.15, 0.2, 0.6, 0.4);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 700;
      o.connect(lp); lp.connect(g); g.connect(master);
      o.start(t + 0.5); o.stop(t + 1.2);
    });
  }

  // 9) Low health — subtle warning pulse (call repeatedly on a timer if desired)
  function sLowHealth(t) {
    var o = osc('sine', 660, t);
    var g = ctx.createGain();
    env(g, t, 0.16, 0.01, 0.06, 0.02, 0.4, 0.1);
    var o2 = osc('sine', 990, t);
    var g2 = ctx.createGain();
    env(g2, t, 0.06, 0.01, 0.05, 0.01, 0.3, 0.08);
    o.connect(g); g.connect(master);
    o2.connect(g2); g2.connect(master);
    o.start(t); o.stop(t + 0.22);
    o2.start(t); o2.stop(t + 0.18);
  }

  // 10) Button click — clean UI tick
  function sUiClick(t) {
    var o = osc('square', 1200, t);
    o.frequency.setValueAtTime(1800, t);
    o.frequency.exponentialRampToValueAtTime(900, t + 0.03);
    var g = ctx.createGain();
    env(g, t, 0.14, 0.001, 0.015, 0, 0.2, 0.02);
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.8;
    o.connect(bp); bp.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.05);
  }

  var registry = {
    blaster:        sBlaster,
    enemyHit:       sEnemyHit,
    enemyDefeated:  sEnemyDefeated,
    playerDamage:   sPlayerDamage,
    gate:           sGate,
    coreActivate:   sCoreActivate,
    win:            sWin,
    lose:           sLose,
    lowHealth:      sLowHealth,
    uiClick:        sUiClick
  };

  function play(name) {
    if (!ensure()) return;            // silently no-op if unsupported
    if (ctx.state === 'suspended') ctx.resume();
    var fn = registry[name];
    if (!fn) return;
    try { fn(now()); } catch (e) { /* never let audio crash the game */ }
  }

  return {
    unlock: unlock,
    play: play,
    setMuted: setMuted,
    setVolume: setVolume,
    isSupported: function () { return supported; },
    names: Object.keys(registry)
  };
})();
