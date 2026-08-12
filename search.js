/* ============================================================================
   Pocono AI — search.js  (v354)  whitepaper-and-global-search
   Self-contained site search as a single asset. Works on every page (root and
   self-contained) by injecting its own styles + command-palette modal.
   - Trigger: any [data-search-open] element, Cmd/Ctrl-K, or "/" (when not typing)
   - Reads window.POCONO_SEARCH_INDEX (from search-index.js)
   - Fuzzy/substring ranking across title > headings > description > url
   - Grouped results, match highlighting, full keyboard nav, ARIA combobox/listbox
   - Recent searches via localStorage (guarded)
   No external dependencies. Root-absolute result links resolve from any page depth.
   ============================================================================ */
(function () {
  "use strict";
  if (window.__poconoSearchLoaded) return;
  window.__poconoSearchLoaded = true;

  var IS_MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
  var KEYHINT = IS_MAC ? "\u2318K" : "Ctrl K";
  var LS_KEY = "pocono.search.recent";
  var MAX_RECENT = 5, MAX_RESULTS = 40;

  /* ---------- styles ---------- */
  var CSS = "" +
  ".pa-search-trigger{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);" +
  "border:1px solid rgba(255,255,255,0.14);color:#90a8ba;border-radius:999px;padding:7px 12px;font:600 13px/1 " +
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;cursor:pointer;transition:all .15s;}" +
  ".pa-search-trigger:hover{border-color:rgba(0,194,168,0.5);color:#cfe0ea;background:rgba(0,194,168,0.08);}" +
  ".pa-search-trigger svg{flex:0 0 auto;}" +
  ".pa-search-trigger .pa-st-label{display:inline;}" +
  ".pa-search-trigger kbd{font:700 11px/1 inherit;color:#7f93a4;background:rgba(255,255,255,0.06);" +
  "border:1px solid rgba(255,255,255,0.14);border-radius:6px;padding:3px 6px;margin-left:2px;}" +
  "@media(max-width:560px){.pa-search-trigger .pa-st-label,.pa-search-trigger kbd{display:none;}.pa-search-trigger{padding:9px;}}" +
  ".pa-search-icon-only{padding:9px;}.pa-search-icon-only .pa-st-label,.pa-search-icon-only kbd{display:none;}" +

  ".pa-search-overlay{position:fixed;inset:0;z-index:2147483600;display:none;align-items:flex-start;justify-content:center;" +
  "background:rgba(2,8,13,0.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);padding:12vh 16px 16px;}" +
  ".pa-search-overlay.pa-open{display:flex;animation:pa-fade .14s ease;}" +
  "@keyframes pa-fade{from{opacity:0}to{opacity:1}}" +
  "@keyframes pa-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
  ".pa-search-box{width:100%;max-width:620px;background:#0a1f2e;border:1px solid rgba(255,255,255,0.12);" +
  "border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,0.55);overflow:hidden;animation:pa-rise .16s ease;" +
  "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;display:flex;flex-direction:column;max-height:74vh;}" +
  ".pa-search-head{display:flex;align-items:center;gap:11px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.09);}" +
  ".pa-search-head svg{flex:0 0 auto;color:#00c2a8;}" +
  ".pa-search-input{flex:1;background:transparent;border:0;outline:0;color:#e7f1f7;font-size:16px;font-weight:500;}" +
  ".pa-search-input::placeholder{color:#5d7080;}" +
  ".pa-search-esc{flex:0 0 auto;font:700 11px/1 inherit;color:#7f93a4;background:rgba(255,255,255,0.05);" +
  "border:1px solid rgba(255,255,255,0.14);border-radius:6px;padding:5px 8px;cursor:pointer;}" +
  ".pa-search-results{overflow-y:auto;padding:6px;flex:1;}" +
  ".pa-search-group{padding:10px 12px 4px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5d7080;}" +
  ".pa-search-opt{display:block;text-decoration:none;padding:9px 12px;border-radius:10px;cursor:pointer;border:1px solid transparent;}" +
  ".pa-search-opt .pa-opt-title{color:#e7f1f7;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;}" +
  ".pa-search-opt .pa-opt-tag{flex:0 0 auto;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;" +
  "color:#7af0dc;background:rgba(0,194,168,0.12);border:1px solid rgba(0,194,168,0.3);border-radius:999px;padding:2px 8px;}" +
  ".pa-search-opt .pa-opt-desc{color:#90a8ba;font-size:12.5px;line-height:1.45;margin-top:3px;overflow:hidden;" +
  "display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}" +
  ".pa-search-opt mark{background:rgba(0,194,168,0.22);color:#bff5ec;border-radius:3px;padding:0 1px;}" +
  ".pa-search-opt.pa-active,.pa-search-opt:hover{background:rgba(0,194,168,0.10);border-color:rgba(0,194,168,0.35);}" +
  ".pa-search-empty{padding:34px 20px;text-align:center;color:#7f93a4;font-size:14px;}" +
  ".pa-search-empty strong{color:#cfe0ea;}" +
  ".pa-recent-head{display:flex;align-items:center;justify-content:space-between;padding:10px 12px 4px;}" +
  ".pa-recent-clear{background:none;border:0;color:#5d7080;font-size:11px;font-weight:600;cursor:pointer;}" +
  ".pa-recent-clear:hover{color:#00c2a8;}" +
  ".pa-search-foot{display:flex;gap:16px;flex-wrap:wrap;padding:10px 16px;border-top:1px solid rgba(255,255,255,0.09);" +
  "font-size:11px;color:#5d7080;}" +
  ".pa-search-foot kbd{font:700 10px/1 inherit;color:#90a8ba;background:rgba(255,255,255,0.06);" +
  "border:1px solid rgba(255,255,255,0.14);border-radius:5px;padding:3px 6px;margin-right:4px;}" +
  ".pa-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;}" +
  "@media(max-width:560px){.pa-search-overlay{padding:0;}.pa-search-box{max-width:none;height:100%;max-height:100%;border-radius:0;}}";

  /* ---------- categorize result by URL ---------- */
  function categorize(url) {
    var u = (url || "").toLowerCase();
    if (/\.pdf($|\?)/.test(u)) return "White paper";
    if (u === "global/" || u.indexOf("global/") === 0) return "Global";
    var seg = [["/clinical","Clinical"],["/legal","Legal"],["/technical","Technical"],["/governance","Governance"],
               ["/tools","Tools"],["/investors","Investors"],["/research","Research"],["/transparency","Transparency"]];
    for (var i=0;i<seg.length;i++){ if (u.indexOf("documentation-hub"+seg[i][0])>=0) return seg[i][1]; }
    if (u === "documentation-hub/") return "Documentation";
    var m = [[/physician|nurse|clinic|medical|ehr|cardio|patient/,"Physicians"],
             [/attorney|legal|deposition|discovery|privilege|law/,"Attorneys"],
             [/pricing|pilot|roi/,"Pricing & Pilot"],
             [/trust|audit|transparen|receipt/,"Trust & Audit"],
             [/architecture|deploy|how-it-works|platform|sentinel/,"How It Works"],
             [/about|team|career|contact|founder/,"Company"]];
    for (var j=0;j<m.length;j++){ if (m[j][0].test(u)) return m[j][1]; }
    return "Pages";
  }
  function hrefFor(url){ return /^https?:/.test(url) ? url : "/" + String(url).replace(/^\//,""); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function highlight(text, tokens){
    var out = esc(text || "");
    tokens.forEach(function(tk){
      if (!tk) return;
      var re = new RegExp("("+tk.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }

  /* ---------- scoring ---------- */
  function score(item, tokens, qRaw){
    var title=(item.title||"").toLowerCase(), desc=(item.desc||"").toLowerCase(),
        url=(item.url||"").toLowerCase(), heads=(item.headings||[]).join(" ").toLowerCase();
    var hay = title+" "+heads+" "+desc+" "+url;
    var s=0;
    for (var i=0;i<tokens.length;i++){
      var tk=tokens[i]; if(!tk) continue;
      if (hay.indexOf(tk)<0) return 0;                 // AND: every token must appear somewhere
      if (title.indexOf(tk)>=0) s+=40;
      if (heads.indexOf(tk)>=0) s+=16;
      if (desc.indexOf(tk)>=0)  s+=8;
      if (url.indexOf(tk)>=0)   s+=6;
      var wb = new RegExp("\\b"+tk.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));
      if (wb.test(title)) s+=14;
    }
    if (qRaw && title.indexOf(qRaw)===0) s+=30;        // prefix match on full query
    if (qRaw && title.indexOf(qRaw)>=0)  s+=12;
    s += Math.max(0, 12 - title.length/8);             // mild preference for concise titles
    return s;
  }
  function search(q){
    var idx = window.POCONO_SEARCH_INDEX || [];
    var qRaw=q.trim().toLowerCase(); if(!qRaw) return [];
    var tokens=qRaw.split(/\s+/).filter(Boolean);
    var scored=[];
    for (var i=0;i<idx.length;i++){ var sc=score(idx[i],tokens,qRaw); if(sc>0) scored.push([sc,idx[i]]); }
    scored.sort(function(a,b){return b[0]-a[0];});
    return scored.slice(0,MAX_RESULTS).map(function(x){return x[1];});
  }

  /* ---------- recents ---------- */
  function getRecent(){ try{return JSON.parse(localStorage.getItem(LS_KEY))||[];}catch(e){return [];} }
  function pushRecent(q){ q=q.trim(); if(!q) return; try{
      var r=getRecent().filter(function(x){return x.toLowerCase()!==q.toLowerCase();});
      r.unshift(q); localStorage.setItem(LS_KEY, JSON.stringify(r.slice(0,MAX_RECENT)));
    }catch(e){} }
  function clearRecent(){ try{localStorage.removeItem(LS_KEY);}catch(e){} }

  /* ---------- suggested when empty ---------- */
  var SUGGEST = ["global/","start-here.html","for-physicians.html","for-attorneys.html","pricing.html",
                 "trust.html","how-it-works.html","documentation-hub/",
                 "assets/papers/pocono-ai-global-federated-rollout-white-paper.pdf"];
  function suggestedItems(){
    var idx=window.POCONO_SEARCH_INDEX||[], byUrl={}; idx.forEach(function(it){byUrl[it.url]=it;});
    var out=[];
    SUGGEST.forEach(function(u){ if(byUrl[u]) out.push(byUrl[u]); });
    return out;
  }

  /* ---------- DOM ---------- */
  var overlay, boxEl, inputEl, resultsEl, liveEl, opts=[], active=-1, lastFocus=null;
  var SVG_SEARCH='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  function build(){
    var s=document.createElement("style"); s.id="pa-search-style"; s.textContent=CSS; document.head.appendChild(s);
    overlay=document.createElement("div"); overlay.className="pa-search-overlay"; overlay.setAttribute("role","dialog");
    overlay.setAttribute("aria-modal","true"); overlay.setAttribute("aria-label","Search Pocono AI");
    overlay.innerHTML =
      '<div class="pa-search-box">' +
        '<div class="pa-search-head">'+SVG_SEARCH+
          '<input class="pa-search-input" type="search" role="combobox" aria-expanded="true" aria-autocomplete="list" '+
          'aria-controls="pa-search-listbox" placeholder="Search Pocono AI\u2026" autocomplete="off" spellcheck="false" enterkeyhint="search" aria-label="Search Pocono AI">' +
          '<button type="button" class="pa-search-esc" aria-label="Close search">Esc</button>' +
        '</div>' +
        '<div class="pa-search-results" id="pa-search-listbox" role="listbox" aria-label="Search results"></div>' +
        '<div class="pa-search-foot"><span><kbd>\u2191</kbd><kbd>\u2193</kbd> navigate</span><span><kbd>\u21B5</kbd> open</span>'+
        '<span><kbd>esc</kbd> close</span><span style="margin-left:auto;color:#3f5260;">Pocono AI search</span></div>' +
        '<div class="pa-sr-only" aria-live="polite"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    boxEl=overlay.querySelector(".pa-search-box");
    inputEl=overlay.querySelector(".pa-search-input");
    resultsEl=overlay.querySelector(".pa-search-results");
    liveEl=overlay.querySelector(".pa-sr-only");
    overlay.addEventListener("mousedown", function(e){ if(e.target===overlay) close(); });
    overlay.querySelector(".pa-search-esc").addEventListener("click", close);
    var deb; inputEl.addEventListener("input", function(){ clearTimeout(deb); deb=setTimeout(render, 90); });
    inputEl.addEventListener("keydown", onKey);
  }

  function groupRows(items){
    resultsEl.innerHTML=""; opts=[]; active=-1;
    if(!items.length) return;
    var groups={}, order=[];
    items.forEach(function(it){ var c=categorize(it.url); if(!groups[c]){groups[c]=[];order.push(c);} groups[c].push(it); });
    var qTokens=(inputEl.value.trim().toLowerCase().split(/\s+/).filter(Boolean));
    var id=0;
    order.forEach(function(cat){
      var gh=document.createElement("div"); gh.className="pa-search-group"; gh.textContent=cat; gh.setAttribute("role","presentation");
      resultsEl.appendChild(gh);
      groups[cat].forEach(function(it){
        var a=document.createElement("a"); a.className="pa-search-opt"; a.href=hrefFor(it.url);
        a.setAttribute("role","option"); a.id="pa-opt-"+(id++); a.setAttribute("aria-selected","false");
        a.innerHTML='<div class="pa-opt-title">'+highlight(it.title||it.url,qTokens)+
                    '<span class="pa-opt-tag">'+esc(cat)+'</span></div>'+
                    (it.desc?'<div class="pa-opt-desc">'+highlight(it.desc,qTokens)+'</div>':'');
        a.addEventListener("mouseenter", function(){ setActive(opts.indexOf(a)); });
        a.addEventListener("click", function(){ pushRecent(inputEl.value); });
        resultsEl.appendChild(a); opts.push(a);
      });
    });
  }

  function render(){
    var q=inputEl.value.trim();
    if(!q){ renderEmpty(); return; }
    var items=search(q);
    if(!items.length){
      resultsEl.innerHTML='<div class="pa-search-empty">No results for <strong>'+esc(q)+'</strong>.<br>'+
        'Try fewer or different words \u2014 or browse the <a href="/documentation-hub/" style="color:#00c2a8;">Documentation Hub</a>.</div>';
      opts=[]; active=-1; announce("No results"); inputEl.setAttribute("aria-expanded","false"); return;
    }
    groupRows(items); inputEl.setAttribute("aria-expanded","true");
    setActive(0); announce(items.length+(items.length===1?" result":" results"));
  }

  function renderEmpty(){
    resultsEl.innerHTML=""; opts=[]; active=-1; inputEl.setAttribute("aria-expanded","true");
    var recent=getRecent();
    if(recent.length){
      var rh=document.createElement("div"); rh.className="pa-recent-head";
      rh.innerHTML='<span class="pa-search-group" style="padding:0;">Recent</span>';
      var cb=document.createElement("button"); cb.className="pa-recent-clear"; cb.type="button"; cb.textContent="Clear";
      cb.addEventListener("click", function(){ clearRecent(); renderEmpty(); inputEl.focus(); });
      rh.appendChild(cb); resultsEl.appendChild(rh);
      recent.forEach(function(q){
        var a=document.createElement("a"); a.className="pa-search-opt"; a.href="#"; a.setAttribute("role","option");
        a.innerHTML='<div class="pa-opt-title">'+SVG_SEARCH.replace('18','13').replace('18','13')+' '+esc(q)+'</div>';
        a.addEventListener("click", function(e){ e.preventDefault(); inputEl.value=q; render(); inputEl.focus(); });
        a.addEventListener("mouseenter", function(){ setActive(opts.indexOf(a)); });
        resultsEl.appendChild(a); opts.push(a);
      });
    }
    var sug=suggestedItems();
    if(sug.length){
      var sh=document.createElement("div"); sh.className="pa-search-group"; sh.textContent=recent.length?"Suggested":"Jump to";
      resultsEl.appendChild(sh);
      sug.forEach(function(it){
        var cat=categorize(it.url);
        var a=document.createElement("a"); a.className="pa-search-opt"; a.href=hrefFor(it.url); a.setAttribute("role","option");
        a.innerHTML='<div class="pa-opt-title">'+esc(it.title||it.url)+'<span class="pa-opt-tag">'+esc(cat)+'</span></div>';
        a.addEventListener("mouseenter", function(){ setActive(opts.indexOf(a)); });
        resultsEl.appendChild(a); opts.push(a);
      });
    }
    if(opts.length) setActive(0);
  }

  function setActive(i){
    if(active>=0 && opts[active]){ opts[active].classList.remove("pa-active"); opts[active].setAttribute("aria-selected","false"); }
    active=i;
    if(active>=0 && opts[active]){ var el=opts[active]; el.classList.add("pa-active"); el.setAttribute("aria-selected","true");
      if(el.id) inputEl.setAttribute("aria-activedescendant", el.id);
      el.scrollIntoView({block:"nearest"});
    } else { inputEl.removeAttribute("aria-activedescendant"); }
  }
  function announce(t){ if(liveEl) liveEl.textContent=t; }

  function onKey(e){
    if(e.key==="ArrowDown"){ e.preventDefault(); if(opts.length) setActive((active+1)%opts.length); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); if(opts.length) setActive((active-1+opts.length)%opts.length); }
    else if(e.key==="Home"){ if(opts.length){ e.preventDefault(); setActive(0); } }
    else if(e.key==="End"){ if(opts.length){ e.preventDefault(); setActive(opts.length-1); } }
    else if(e.key==="Enter"){ if(active>=0 && opts[active]){ e.preventDefault(); opts[active].click(); var h=opts[active].getAttribute("href"); if(h && h!=="#"){ pushRecent(inputEl.value); window.location.href=h; } } }
    else if(e.key==="Escape"){ e.preventDefault(); close(); }
    else if(e.key==="Tab"){ e.preventDefault(); /* trap: keep focus in input */ inputEl.focus(); }
  }

  function open(){
    if(!overlay) build();
    lastFocus=document.activeElement;
    overlay.classList.add("pa-open");
    document.documentElement.style.overflow="hidden";
    inputEl.value=""; renderEmpty();
    setTimeout(function(){ inputEl.focus(); }, 30);
    document.querySelectorAll("[data-search-open]").forEach(function(b){ b.setAttribute("aria-expanded","true"); });
  }
  function close(){
    if(!overlay) return;
    overlay.classList.remove("pa-open");
    document.documentElement.style.overflow="";
    document.querySelectorAll("[data-search-open]").forEach(function(b){ b.setAttribute("aria-expanded","false"); });
    if(lastFocus && lastFocus.focus){ try{lastFocus.focus();}catch(e){} }
  }
  window.PoconoSearch = { open: open, close: close };

  /* ---------- bindings ---------- */
  function bindTriggers(){
    document.querySelectorAll("[data-search-open]").forEach(function(btn){
      if(btn.__paBound) return; btn.__paBound=true;
      btn.addEventListener("click", function(e){ e.preventDefault(); open(); });
    });
  }
  document.addEventListener("keydown", function(e){
    if((e.metaKey||e.ctrlKey) && (e.key==="k"||e.key==="K")){ e.preventDefault(); (overlay&&overlay.classList.contains("pa-open"))?close():open(); return; }
    if(e.key==="/" && !e.metaKey && !e.ctrlKey && !e.altKey){
      var t=e.target, tag=(t&&t.tagName||"").toLowerCase();
      if(tag==="input"||tag==="textarea"||tag==="select"||(t&&t.isContentEditable)) return;
      e.preventDefault(); open();
    }
  });

  function fillKeyhints(){ document.querySelectorAll("[data-pa-keyhint]").forEach(function(k){ k.textContent=KEYHINT; }); }
  function init(){ bindTriggers(); fillKeyhints(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
  // re-bind in case triggers are injected after load
  setTimeout(bindTriggers, 800);
})();
