(function(){
  const menuBtn=document.querySelector('[data-menu]');
  const mobile=document.getElementById('mobile-nav');
  if(menuBtn && mobile){
    menuBtn.addEventListener('click',()=>{
      const open=mobile.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open?'true':'false');
    });
  }
  // Model page
  const modelRoot=document.getElementById('model-app');
  if(modelRoot && window.BuklodEcon){
    const E=window.BuklodEcon;
    const state={...E.DEFAULTS};
    const els={
      users:document.getElementById('m-users'),
      price:document.getElementById('m-price'),
      plan:document.getElementById('m-plan'),
      host:document.getElementById('m-host'),
      opex:document.getElementById('m-opex'),
      capex:document.getElementById('m-capex'),
      usersVal:document.getElementById('m-users-val'),
      priceVal:document.getElementById('m-price-val'),
      hostVal:document.getElementById('m-host-val'),
      opexVal:document.getElementById('m-opex-val'),
      capexVal:document.getElementById('m-capex-val'),
      revenue:document.getElementById('m-revenue'),
      costs:document.getElementById('m-costs'),
      profit:document.getElementById('m-profit'),
      payback:document.getElementById('m-payback'),
      breakeven:document.getElementById('m-breakeven'),
      costnote:document.getElementById('m-costnote'),
      hint:document.getElementById('m-hint'),
      chart:document.getElementById('m-chart'),
      scale:document.getElementById('m-scale')
    };
    function sync(){
      state.users=+els.users.value; state.price=+els.price.value; state.plan=els.plan.value;
      state.host=+els.host.value; state.opex=+els.opex.value; state.capex=+els.capex.value;
      els.usersVal.textContent=state.users;
      els.priceVal.textContent=E.peso(state.price);
      els.hostVal.textContent=E.peso(state.host);
      els.opexVal.textContent=E.peso(state.opex);
      els.capexVal.textContent=E.peso(state.capex);
      const m=E.monthMath(state);
      els.revenue.textContent=E.peso(m.netRevenue);
      els.costs.textContent=E.peso(m.cost);
      els.profit.textContent=E.peso(m.profit);
      els.profit.style.color=m.profit>=0?'#1c5a3a':'#9b2c2c';
      const pb=E.payback(m.profit,state.capex);
      els.payback.textContent=pb==null?'—':pb.toFixed(1)+' months';
      els.breakeven.textContent=String(m.breakEvenUsers===Infinity?'—':m.breakEvenUsers);
      els.costnote.textContent=`Starlink ${E.peso(m.starlink)} · host ${E.peso(m.host)} · upkeep ${E.peso(m.opex)}`;
      const hint=E.planHint(state.users,state.plan);
      els.hint.textContent=hint||'Guide base: 100 users at ₱500, 1 TB plan, ₱2,000 host, ₱2,000 upkeep.';
      els.hint.style.display='block';
      // profit curve
      const points=[];
      for(let u=0;u<=150;u+=5){ points.push(E.monthMath({...state,users:u}).profit); }
      const max=Math.max(...points.map(Math.abs),1);
      els.chart.innerHTML=points.map(p=>{
        const h=Math.max(4, Math.round((Math.abs(p)/max)*140));
        const color=p>=0?'var(--navy)':'#9b2c2c';
        return `<span title="${uUsers(p)}" style="height:${h}px;background:${color}"></span>`;
      }).join('');
      function uUsers(p){return E.peso(p);}
      const sites=[1,10,30,100,1000];
      els.scale.innerHTML=sites.map(n=>`<div class="metric"><span class="small muted">${n.toLocaleString('en-PH')} site${n>1?'s':''}</span><b>${E.peso(m.profit*n)}</b><span class="small muted">monthly profit · capital ${E.peso(state.capex*n)}</span></div>`).join('');
    }
    ['users','price','plan','host','opex','capex'].forEach(k=>{
      els[k].addEventListener('input',sync);
      els[k].addEventListener('change',sync);
    });
    document.querySelectorAll('[data-preset]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const p=btn.getAttribute('data-preset');
        if(p==='base'){ Object.assign(state,E.DEFAULTS); }
        if(p==='open'){ Object.assign(state,{...E.DEFAULTS,users:25,plan:'500'}); }
        if(p==='lean'){ Object.assign(state,{...E.DEFAULTS,users:40,price:400,plan:'500',host:1500}); }
        if(p==='floor'){ Object.assign(state,{...E.DEFAULTS,price:400}); }
        els.users.value=state.users; els.price.value=state.price; els.plan.value=state.plan;
        els.host.value=state.host; els.opex.value=state.opex; els.capex.value=state.capex;
        sync();
      });
    });
    sync();
  }

  // Apply form local-only
  const form=document.getElementById('inquiry-form');
  if(form){
    let role='Host a site';
    form.querySelectorAll('.choice').forEach(btn=>{
      btn.addEventListener('click',()=>{
        form.querySelectorAll('.choice').forEach(b=>b.setAttribute('aria-pressed','false'));
        btn.setAttribute('aria-pressed','true');
        role=btn.dataset.role;
      });
    });
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const data=new FormData(form);
      const text=[
        'Buklod inquiry (local draft — nothing was uploaded)',
        'Role: '+role,
        'Name: '+(data.get('name')||''),
        'Organization: '+(data.get('org')||''),
        'Location: '+(data.get('location')||''),
        'Phone: '+(data.get('phone')||''),
        'Email: '+(data.get('email')||''),
        'Detail: '+(data.get('detail')||''),
        'Notes: '+(data.get('notes')||'')
      ].join('\n');
      const out=document.getElementById('inquiry-out');
      out.value=text;
      out.hidden=false;
      document.getElementById('inquiry-help').hidden=false;
      try{ navigator.clipboard.writeText(text); document.getElementById('copy-status').textContent='Copied to clipboard.'; }
      catch(_){ document.getElementById('copy-status').textContent='Select the text below and copy it.'; }
    });
  }
})();
