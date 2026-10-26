/* 222248.com — Launch in 48 | site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

  /* ---------- Private inbox routing (address is never written in the page) ---------- */
  var _k=[106, 104, 100, 41, 107, 110, 102, 106, 96, 71, 54, 102, 116, 108, 117, 104, 112, 101, 98, 112];
  function inbox(){return String.fromCharCode.apply(null,_k.map(function(c){return c^7})).split('').reverse().join('')}
  var ENDPOINT=function(){return 'https://formsubmit.co/ajax/'+inbox()};

  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var s=a.getAttribute('data-mail')||'Inquiry from 222248.com';
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(s);
    });
  });

  /* ---------- Theme ---------- */
  var root=document.documentElement;
  var saved=store('t48-theme');
  if(saved)root.setAttribute('data-theme',saved);
  var tbtn=$('#themeBtn');
  if(tbtn){tbtn.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme')==='light'?'dark':'light';
    root.setAttribute('data-theme',cur);store('t48-theme',cur);
  })}

  /* ---------- Active nav ---------- */
  var here=location.pathname.replace(/index\.html$/,'');
  $$('#menu a').forEach(function(a){var h=a.getAttribute('href').replace(/index\.html$/,'');if(h===here||(h!=='/'&&h.length>1&&here.indexOf(h.replace(/[^/]*$/,''))===0&&h.indexOf('guides/')>-1)){a.classList.add('active');a.setAttribute('aria-current','page')}});

  /* ---------- Mobile menu ---------- */
  var bg=$('#burger'),menu=$('#menu');
  if(bg&&menu){bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o)})}

  /* ---------- Reveal on scroll ---------- */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12});
    $$('.reveal').forEach(function(el){io.observe(el)});
  }else{$$('.reveal').forEach(function(el){el.classList.add('in')})}

  /* ---------- Cookie notice ---------- */
  var ck=$('#cookie');
  if(ck&&!store('t48-cookie')){ck.classList.add('show')}
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){store('t48-cookie',b.getAttribute('data-cookie'));ck.classList.remove('show')})});

  /* ---------- Year ---------- */
  $$('.year').forEach(function(el){el.textContent=new Date().getFullYear()});

  /* ---------- Hero 48h clock demo ---------- */
  var clock=$('#clockDigits');
  if(clock){
    var phases=[
      ['00–08h','Validate: pick one painful problem, interview 5 people, write a one-line promise.'],
      ['08–16h','Shape: define the smallest product that keeps the promise. Cut everything else.'],
      ['16–24h','Build: landing page + core workflow. Use AI for copy, code and design drafts.'],
      ['24–32h','Wire money: checkout, pricing, analytics, legal pages.'],
      ['32–40h','Launch: post where your buyers already gather. Ship, then listen.'],
      ['40–48h','Learn: measure, reply to every user, decide to double down or pivot.']
    ];
    var total=48*3600,left=total,demoSpeed=1;
    var bars=$$('#phaseBar span'),now=$('#clockNow');
    function render(){
      var h=Math.floor(left/3600),m=Math.floor(left%3600/60),s=left%60;
      clock.textContent=[h,m,s].map(function(n){return (n<10?'0':'')+n}).join(':');
      var elapsed=total-left,idx=Math.min(5,Math.floor(elapsed/(8*3600)));
      bars.forEach(function(b,i){b.classList.toggle('on',i<=idx)});
      if(now)now.innerHTML='<b class="mono">'+phases[idx][0]+'</b> — '+phases[idx][1];
    }
    render();
    setInterval(function(){left-=Math.max(1,demoSpeed*97);if(left<=0)left=total;render()},1000);
  }

  /* ---------- Next challenge countdown (first Friday 18:00 UTC each month) ---------- */
  var cd=$('#challengeCountdown');
  if(cd){
    function nextFriday(){
      var d=new Date(),y=d.getUTCFullYear(),mo=d.getUTCMonth();
      for(var k=0;k<3;k++){
        var f=new Date(Date.UTC(y,mo+k,1,18,0,0));
        while(f.getUTCDay()!==5)f.setUTCDate(f.getUTCDate()+1);
        if(f>d)return f;
      }
    }
    var target=nextFriday();
    var dl=$('#challengeDate');if(dl)dl.textContent=target.toUTCString().replace(':00 GMT',' UTC').replace(/:00 UTC/,' UTC');
    (function tick(){
      var ms=target-new Date();if(ms<0)ms=0;
      var d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);
      cd.textContent=d+'d '+(h<10?'0':'')+h+'h '+(m<10?'0':'')+m+'m '+(s<10?'0':'')+s+'s';
      setTimeout(tick,1000);
    })();
  }

  /* ---------- Forms ---------- */
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f);
      if(f._honey&&f._honey.value){return}
      if(!f.checkValidity()){f.reportValidity();return}
      var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      var data={};
      new FormData(f).forEach(function(v,k){if(k!=='_honey')data[k]=data[k]?data[k]+', '+v:v});
      data._subject=(f.getAttribute('data-subject')||'222248.com form')+' — '+(data.name||data.email||'');
      data._template='table';data._captcha='false';
      data.page=location.pathname;
      fetch(ENDPOINT(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}})})
        .then(function(){
          if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received. You will hear back within 48 hours.'}
          f.reset();resetSteps(f);
        })
        .catch(function(){
          if(msg){msg.className='form-msg err';msg.textContent='Network error — please try again in a minute.'}
        })
        .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
    });
  });

  /* ---------- Multi-step lead form ---------- */
  function resetSteps(f){
    var st=$$('.step',f);if(!st.length)return;
    st.forEach(function(s,i){s.classList.toggle('active',i===0)});
    $$('.steps-ind span',f).forEach(function(s,i){s.classList.toggle('on',i===0)});
  }
  $$('form.multistep').forEach(function(f){
    var steps=$$('.step',f),ind=$$('.steps-ind span',f),i=0;
    function go(n){
      if(n>i){var cur=steps[i];var bad=$$('input,select,textarea',cur).filter(function(x){return !x.checkValidity()});if(bad.length){bad[0].reportValidity();return}}
      i=Math.max(0,Math.min(steps.length-1,n));
      steps.forEach(function(s,k){s.classList.toggle('active',k===i)});
      ind.forEach(function(s,k){s.classList.toggle('on',k<=i)});
    }
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
  });

  /* ---------- YouTube facades (load player only on click) ---------- */
  $$('.video[data-yt]').forEach(function(v){
    var id=v.getAttribute('data-yt');
    v.innerHTML='<img loading="lazy" alt="" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="play"><span>▶</span></div>';
    v.addEventListener('click',function(){
      v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="YouTube video" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>';
    },{once:true});
  });

  /* ---------- 48-hour planner ---------- */
  var planner=$('#planner');
  if(planner){
    var KEY='t48-planner';
    var state={};try{state=JSON.parse(store(KEY)||'{}')}catch(e){state={}}
    var boxes=$$('input[type=checkbox]',planner);
    function upd(){
      var done=boxes.filter(function(b){return b.checked}).length;
      var pct=Math.round(done/boxes.length*100);
      $('#planPct').textContent=pct+'%';$('#planBar').style.width=pct+'%';
      $('#planCount').textContent=done+' / '+boxes.length+' tasks';
      boxes.forEach(function(b){b.closest('li').classList.toggle('done',b.checked)});
    }
    boxes.forEach(function(b){
      b.checked=!!state[b.id];
      b.addEventListener('change',function(){state[b.id]=b.checked;store(KEY,JSON.stringify(state));upd()});
    });
    upd();
    var rs=$('#planReset');if(rs)rs.addEventListener('click',function(){if(confirm('Reset all tasks?')){state={};store(KEY,'{}');boxes.forEach(function(b){b.checked=false});upd()}});
    var pr=$('#planPrint');if(pr)pr.addEventListener('click',function(){$$('.phase').forEach(function(d){d.open=true});window.print()});
    var startBtn=$('#planStart'),startOut=$('#planStartOut');
    if(startBtn){
      function showDeadline(){var t=store('t48-start');if(!t){startOut.textContent='Clock not started.';return}var end=new Date(+t+48*3600e3);var ms=end-new Date();if(ms<=0){startOut.textContent='Your 48 hours are up — ship it.';return}var h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4);startOut.textContent=h+'h '+m+'m left · deadline '+end.toLocaleString()}
      startBtn.addEventListener('click',function(){store('t48-start',String(Date.now()));showDeadline()});
      showDeadline();setInterval(showDeadline,30000);
    }
  }

  /* ---------- Calculators ---------- */
  $$('.tool-tabs button').forEach(function(b){
    b.addEventListener('click',function(){
      $$('.tool-tabs button').forEach(function(x){x.classList.toggle('on',x===b)});
      $$('.tool').forEach(function(t){t.classList.toggle('on',t.id===b.getAttribute('data-tool'))});
      history.replaceState(null,'','#'+b.getAttribute('data-tool'));
    });
  });
  if(location.hash){var hb=$('.tool-tabs button[data-tool="'+location.hash.slice(1)+'"]');if(hb)hb.click()}
  function num(id){var el=document.getElementById(id);return el?parseFloat(el.value)||0:0}
  function money(n){return (n<0?'-':'')+'$'+Math.abs(n).toLocaleString(undefined,{maximumFractionDigits:0})}
  function bind(ids,fn){ids.forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('input',fn)});fn()}

  if($('#t-cost')){
    bind(['c-domain','c-host','c-tools','c-ai','c-design','c-legal','c-ads','c-runway'],function(){
      var oneOff=num('c-domain')+num('c-design')+num('c-legal');
      var monthly=num('c-host')+num('c-tools')+num('c-ai')+num('c-ads');
      var months=num('c-runway');
      var total=oneOff+monthly*months;
      $('#cost-total').textContent=money(total);
      $('#cost-oneoff').textContent=money(oneOff);
      $('#cost-monthly').textContent=money(monthly)+'/mo';
      $('#cost-runway').textContent=money(monthly*months);
      $('#cost-note').textContent=total<500?'Lean. This is a true 48-hour budget.':total<3000?'Reasonable for a validated idea. Cut tools you will not use in month one.':'Heavy. Validate demand before spending at this level.';
    });
  }
  if($('#t-break')){
    bind(['b-fixed','b-price','b-var'],function(){
      var fixed=num('b-fixed'),price=num('b-price'),v=num('b-var');
      var margin=price-v;
      var units=margin>0?Math.ceil(fixed/margin):Infinity;
      $('#be-units').textContent=isFinite(units)?units.toLocaleString():'∞';
      $('#be-rev').textContent=isFinite(units)?money(units*price):'—';
      $('#be-margin').textContent=price>0?Math.round(margin/price*100)+'%':'—';
      $('#be-day').textContent=isFinite(units)?(Math.ceil(units/30)).toLocaleString()+' / day':'—';
    });
  }
  if($('#t-ads')){
    bind(['a-views','a-rpm','a-aff','a-epc','a-leads','a-lv'],function(){
      var pv=num('a-views'),rpm=num('a-rpm');
      var ads=pv/1000*rpm,aff=pv*num('a-aff')/100*num('a-epc'),leads=num('a-leads')*num('a-lv');
      var t=ads+aff+leads;
      $('#ad-total').textContent=money(t)+'/mo';
      $('#ad-ads').textContent=money(ads);$('#ad-aff').textContent=money(aff);$('#ad-leads').textContent=money(leads);
      $('#ad-year').textContent=money(t*12);
      $('#ad-bar').style.width=Math.min(100,t/100)+'%';
    });
  }
  if($('#t-hours')){
    bind(['h-mon','h-tue','h-wed','h-thu','h-fri','h-sat','h-sun','h-weeks','h-avg'],function(){
      var week=['h-mon','h-tue','h-wed','h-thu','h-fri','h-sat','h-sun'].reduce(function(a,id){return a+num(id)},0);
      var prevAvg=num('h-avg'),weeks=Math.max(1,num('h-weeks'));
      var rolling=(prevAvg*(weeks-1)+week)/weeks;
      $('#hr-week').textContent=week.toFixed(1)+' h';
      $('#hr-roll').textContent=rolling.toFixed(1)+' h';
      var over=rolling-48;
      $('#hr-status').textContent=over>0?'Above a 48-hour average by '+over.toFixed(1)+' h':'Within a 48-hour average ('+(48-rolling).toFixed(1)+' h headroom)';
      $('#hr-status').style.color=over>0?'var(--red)':'var(--lime)';
      $('#hr-bar').style.width=Math.min(100,rolling/60*100)+'%';
    });
  }
  if($('#t-names')){
    var pre=['Ship','Swift','Bright','Nova','Pilot','Spark','Forge','Flow','Pulse','North','Clear','Prime','Echo','Lumen','Snap'];
    var suf=['ly','io','lab','hq','kit','stack','base','works','loop','dock','craft','wave','mint','nest','path'];
    function gen(){
      var kw=($('#n-kw').value||'launch').trim().replace(/[^a-z0-9]/gi,'').toLowerCase()||'launch';
      var cap=kw.charAt(0).toUpperCase()+kw.slice(1);
      var out=[],used={};
      while(out.length<12){
        var r=Math.random(),n;
        if(r<.33)n=pre[Math.floor(Math.random()*pre.length)]+cap;
        else if(r<.66)n=cap+suf[Math.floor(Math.random()*suf.length)];
        else n=cap+pre[Math.floor(Math.random()*pre.length)];
        if(!used[n]){used[n]=1;out.push(n)}
      }
      $('#n-out').innerHTML=out.map(function(n){return '<button type="button" title="Copy">'+n+'.com</button>'}).join('');
      $$('#n-out button').forEach(function(b){b.addEventListener('click',function(){try{navigator.clipboard.writeText(b.textContent)}catch(e){}b.textContent='Copied ✓'})});
    }
    $('#n-go').addEventListener('click',gen);gen();
  }

  /* ---------- Guide filter ---------- */
  var gs=$('#guideSearch');
  if(gs){gs.addEventListener('input',function(){var q=gs.value.toLowerCase();$$('[data-guide]').forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(q)>-1?'':'none'})})}
})();
