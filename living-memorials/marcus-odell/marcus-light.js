/* Marcus Light — static remembrance simulation.
   No API calls. No tokens. No data leaves the browser.
   This is a lightweight, hand-authored approximation built from public project context and Marcus's stated themes. */
(function(){
  const responses = [
    {
      keys:["who","you","marcus","about"],
      text:"I am not Marcus. I am Marcus Light: a small, static remembrance-style demo built from a light sample of Marcus O’Dell’s current writing themes. I can talk a little about Pocono AI, why he is building Living Memorials, and the way he thinks about systems, illness, memory, and protecting fragile people. I do not know everything he knows. I do not speak for him beyond the notes this page preserves."
    },
    {
      keys:["pocono","company","business","website","project"],
      text:"Marcus sees Pocono AI as governance-native infrastructure: local-first AI for regulated work where the model, the audit trail, and human review stay tied together. He keeps saying the point is not ‘AI magic.’ The point is reducing abandonment, document chaos, liability, and the silent failure modes that happen when fragile people are pushed through broken systems."
    },
    {
      keys:["living memorial","memorial","remember","memory","legacy"],
      text:"For Marcus, a living memorial is not resurrection and not a trick. It is a celebration-of-life archive that can still speak from preserved writings, recordings, notes, and authorized materials. The line he keeps coming back to is simple: people are important, their voices matter, and memory deserves care."
    },
    {
      keys:["sick","ill","pain","dying","weak","screaming"],
      text:"Marcus has been very clear that this is not behavioral and not a lack of will. Some mornings begin with screaming. Some days the body simply will not cooperate. That is part of why this project matters: severe illness can make a person disappear before death, and he is trying to resist that disappearance while he is still here."
    },
    {
      keys:["visit","friends","family","alone","girlfriend"],
      text:"Marcus would rather be visited now. That is the honest sentence. But he also knows some people do not know how to face illness. Some people freeze, avoid, or wait too long. This page is not a replacement for showing up. It is a reminder: do not wait for the memorial if you can reach the person."
    },
    {
      keys:["cory","friend","pettit"],
      text:"Marcus has named Cory Pettit as his best friend, someone he lost more than ten years ago. He wrote, ‘It does not bite any less. I still want to talk to him.’ Any actual remembrance model for Cory would need family permission and enough preserved material. But Cory’s absence is one reason this project has emotional force."
    },
    {
      keys:["grandmother","grandma"],
      text:"Marcus has said his grandmother wrote enough that there may be a meaningful archival remembrance in her own words. Because he does not have her direct permission, the ethical boundary matters: it should speak from the record, not pretend to be a full simulation of her personhood."
    },
    {
      keys:["ethics","consent","permission","guardrails","safe"],
      text:"The guardrails are not there to make the page dull. They are there to keep it honest. Consent first whenever possible. Family permission when needed. Source-grounded answers. Clear labels for quote, paraphrase, and reconstruction. No false resurrection. No grief trap. Dignity after death."
    },
    {
      keys:["model","gpt","chatgpt","frontier","api","tokens"],
      text:"A real interactive Marcus model would probably need a frontier model such as ChatGPT/OpenAI or another leading provider, plus credits and a private backend so no API key is exposed in the browser. This demo is different: it is static JavaScript, costs no tokens, sends no data, and only gives a light taste of the direction."
    },
    {
      keys:["help","what can","ask"],
      text:"You can ask me about Marcus, Pocono AI, Living Memorials, illness and legacy, the ethical boundaries, Cory, his grandmother, or why this page exists. I will answer as a light static simulation, not as Marcus himself."
    }
  ];
  const fallback = [
    "I do not have enough preserved material here to answer that as Marcus. A real remembrance model would need source documents and would label whether an answer is quoted, paraphrased, or reconstructed. The honest answer from this light demo is: I do not know yet.",
    "That question belongs in the future full archive. This static version can only talk about the themes Marcus has placed on this page: illness, memory, Pocono AI, grief, consent, and the wish to be known while still here.",
    "I can try to stay in Marcus’s orbit, but I should not invent private facts. The future version should be more vivid and creative, yes — but still source-grounded and honest about its limits."
  ];
  const starters = [
    "What should I know about Marcus?",
    "Why did Marcus build Living Memorials?",
    "What is Pocono AI?",
    "Why does consent matter?",
    "Tell me about illness and legacy."
  ];
  function pickResponse(q){
    const query = (q || "").toLowerCase();
    let best=null, score=0;
    for(const r of responses){
      const s = r.keys.reduce((n,k)=> n + (query.includes(k) ? 1 : 0), 0);
      if(s>score){score=s; best=r;}
    }
    if(best) return best.text;
    const hash = Array.from(query).reduce((a,c)=>a+c.charCodeAt(0),0);
    return fallback[hash % fallback.length];
  }
  function addMsg(log, who, text){
    const wrap=document.createElement('div');
    wrap.className='lm-live-msg ' + (who==='Visitor'?'lm-live-msg--visitor':'lm-live-msg--model');
    const bubble=document.createElement('div');
    bubble.className='lm-live-bubble';
    const speaker=document.createElement('span');
    speaker.className='lm-live-speaker';
    speaker.textContent=who;
    bubble.appendChild(speaker);
    bubble.appendChild(document.createTextNode(text));
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    log.scrollTop=log.scrollHeight;
  }
  function init(){
    const form=document.querySelector('[data-marcus-light-form]');
    const input=document.querySelector('[data-marcus-light-input]');
    const log=document.querySelector('[data-marcus-light-log]');
    const starterBox=document.querySelector('[data-marcus-light-starters]');
    if(!form || !input || !log) return;
    addMsg(log,'Marcus Light','I am a light static simulation, not Marcus. I can discuss his website projects, Living Memorials, illness and legacy, and the ethical boundaries of preserved presence. I do not use AI tokens and I do not send your words anywhere.');
    if(starterBox){
      starters.forEach(s=>{
        const b=document.createElement('button');
        b.type='button';
        b.className='lm-starter';
        b.textContent=s;
        b.addEventListener('click',()=>{input.value=s; form.requestSubmit();});
        starterBox.appendChild(b);
      });
    }
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const q=input.value.trim();
      if(!q) return;
      addMsg(log,'Visitor',q);
      input.value='';
      window.setTimeout(()=>addMsg(log,'Marcus Light',pickResponse(q)),140);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
