// DOM-level regression harness for the Marcus public Living Echo page.
// Loads the live page from the local server, executes its inline scripts,
// clicks every tailored-question chip, then clicks the Ask button, and
// reports exactly what a real browser would do.
const { JSDOM } = require('jsdom');

const BASE = process.env.BASE || 'http://127.0.0.1:8001';

(async () => {
  const res = await fetch(BASE + '/living-echo/marcus-odell');
  const html = await res.text();

  const errors = [];
  const dom = new JSDOM(html, {
    url: BASE + '/living-echo/marcus-odell',
    runScripts: 'dangerously',
    resources: 'usable',
    beforeParse(window) {
      // real network fetch proxied to the live server
      window.fetch = (url, opts) => fetch(new URL(url, BASE).href, opts);
      window.speechSynthesis = { cancel(){}, speak(){} };
      window.SpeechSynthesisUtterance = function(){};
      window.Audio = function(){ return { play: async()=>{}, pause(){}, }; };
      window.addEventListener('error', (e) => errors.push('window.onerror: ' + e.message));
    },
  });
  const { window } = dom;
  const doc = window.document;
  await new Promise(r => setTimeout(r, 300));

  let fail = 0;
  const chips = [...doc.querySelectorAll('.sq-chip')];
  console.log('chips found:', chips.length);
  const box = doc.getElementById('chat-query');
  for (const chip of chips) {
    box.value = '';
    errors.length = 0;
    chip.click();
    const expected = chip.textContent.trim();
    const got = box.value;
    const ok = got === expected;
    if (!ok) fail++;
    console.log((ok ? 'PASS' : 'FAIL'), JSON.stringify(expected), '=>', JSON.stringify(got), errors.join(' | '));
  }

  // Ask flow: type hello, click Ask, wait for transcript turn
  box.value = 'hello';
  errors.length = 0;
  doc.getElementById('ask-btn').click();
  await new Promise(r => setTimeout(r, 1500));
  const transcript = doc.getElementById('chat-transcript');
  const turns = transcript ? transcript.querySelectorAll('.turn').length : -1;
  const askOk = turns > 0;
  if (!askOk) fail++;
  console.log((askOk ? 'PASS' : 'FAIL'), 'askEcho turns:', turns, errors.join(' | '));
  if (transcript && turns > 0) {
    console.log('first turn text:', transcript.querySelector('.turn').textContent.slice(0, 160).replace(/\s+/g,' '));
  }
  console.log(fail === 0 ? 'ALL PASS' : ('FAILURES: ' + fail));
  process.exit(fail === 0 ? 0 : 1);
})();
