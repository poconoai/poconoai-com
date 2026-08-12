// Z2.28.2 DOM harness: browser-voice fallback behavior on the Marcus page.
const { JSDOM } = require('jsdom');
const BASE = process.env.BASE || 'http://127.0.0.1:8003';

(async () => {
  const first = await fetch(BASE + '/living-echo/marcus-odell');
  const cookie = (first.headers.get('set-cookie') || '').split(';')[0];
  const html = await first.text();
  const EXPECT_RENDER = process.env.EXPECT_RENDER === '1';
  const played = [];

  const spoken = [];       // utterance texts, in order
  const fetches = [];      // urls fetched by page JS
  let fail = 0;
  const ok = (cond, name, extra='') => {
    if (!cond) fail++;
    console.log((cond ? 'PASS' : 'FAIL'), name, extra);
  };

  const dom = new JSDOM(html, {
    url: BASE + '/living-echo/marcus-odell',
    runScripts: 'dangerously',
    beforeParse(window) {
      window.fetch = (url, opts) => { fetches.push(String(url));
        opts = opts || {}; opts.headers = Object.assign({}, opts.headers, cookie ? { cookie } : {});
        return fetch(new URL(url, BASE).href, opts); };
      // Fake speechSynthesis engine: fires onend async per utterance.
      window.SpeechSynthesisUtterance = function (t) { this.text = t; };
      window.speechSynthesis = {
        speaking: false, paused: false,
        speak(u) { spoken.push(u.text); this.speaking = true;
          setTimeout(() => { this.speaking = false; if (u.onend) u.onend(); }, 15); },
        cancel() { this.speaking = false; },
        pause() { this.paused = true; }, resume() { this.paused = false; },
      };
      window.Audio = function(u){ played.push(String(u)); return { play: async()=>{}, pause(){} }; };
    },
  });
  const { window } = dom;
  const doc = window.document;
  await new Promise(r => setTimeout(r, 300));

  // 1) Ask a grounded question so _lastEchoAnswer is a LONG answer.
  doc.getElementById('chat-query').value = 'Why did Marcus build Pocono AI?';
  doc.getElementById('ask-btn').click();
  await new Promise(r => setTimeout(r, 1500));
  ok(doc.querySelectorAll('#chat-transcript .turn').length === 1, 'ask renders answer');

  // 2) Click Read in My Voice. Engine not ready (voice_loop_ready=false) →
  //    must NOT call /voice-render-conversation, must start device voice fast.
  fetches.length = 0;
  const t0 = Date.now();
  doc.getElementById('speak-btn').click();
  await new Promise(r => setTimeout(r, 2500));
  const rendered = fetches.some(u => u.includes('voice-render-conversation'));
  if (EXPECT_RENDER) {
    ok(rendered, 'server render attempted when provider active', JSON.stringify(fetches));
    ok(played.length >= 1, 'generated audio played (own-voice path)', JSON.stringify(played));
  } else {
    ok(!rendered, 'no server render attempt when provider disabled', JSON.stringify(fetches));
  }
  if (!EXPECT_RENDER) ok(spoken.length >= 2, 'answer chunked into multiple utterances', 'chunks=' + spoken.length);
  if (!EXPECT_RENDER) ok(spoken.every(c => c.length <= 180), 'every chunk <= 180 chars',
     'max=' + Math.max(...spoken.map(c => c.length)));
  const full = spoken.join(' ').replace(/\s+/g, ' ');
  if (!EXPECT_RENDER) ok(/Pocono AI/.test(full) && /may be incomplete/.test(full) === false || full.length > 400,
     'full answer text queued', 'len=' + full.length);

  // 3) No double read: total spoken text must not exceed ~answer length + slack.
  if (EXPECT_RENDER) { console.log(fail===0?'ALL PASS':'FAILURES: '+fail); process.exit(fail===0?0:1); }
  const answerLen = window._lastEchoAnswer ? window._lastEchoAnswer.length : 0;
  ok(full.length <= answerLen + 50, 'answer spoken exactly once (no repeat)',
     'spoken=' + full.length + ' answer=' + answerLen);

  // 4) Double-click guard: rapid second click while speaking adds nothing.
  spoken.length = 0;
  doc.getElementById('speak-btn').click();
  doc.getElementById('speak-btn').click(); // immediate second tap
  await new Promise(r => setTimeout(r, 2500));
  const full2 = spoken.join(' ');
  ok(full2.length <= answerLen + 50, 'double-tap does not double-read',
     'spoken=' + full2.length + ' answer=' + answerLen);

  // 5) Stop clears the queue mid-read.
  spoken.length = 0;
  doc.getElementById('speak-btn').click();
  await new Promise(r => setTimeout(r, 40)); // let 1-2 chunks out
  window.stopSpeaking();
  const after = spoken.length;
  await new Promise(r => setTimeout(r, 600));
  ok(spoken.length === after, 'stopSpeaking halts remaining chunks',
     'at-stop=' + after + ' final=' + spoken.length);

  console.log(fail === 0 ? 'ALL PASS' : 'FAILURES: ' + fail);
  process.exit(fail === 0 ? 0 : 1);
})();
