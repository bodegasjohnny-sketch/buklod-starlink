(function(global){
  const PLANS={500:{id:'500',label:'Local Priority 500 GB',data:'500 GB',monthly:4650},1000:{id:'1000',label:'Local Priority 1 TB',data:'1 TB',monthly:8400}};
  const DEFAULTS={users:100,price:500,plan:'1000',host:2000,opex:2000,capex:150000};
  const FILL=[25,40,55,70,85,95,100];
  function fillUsers(monthIndex){ if(monthIndex<0) return 0; return FILL[Math.min(monthIndex, FILL.length-1)]; }
  function monthMath(t){
    const leakRate=Math.min(.95, Math.max(0, t.leak??0));
    const billed=t.users*t.price;
    const leak=billed*leakRate;
    const netRevenue=billed-leak;
    const starlink=PLANS[t.plan].monthly;
    const cost=starlink+t.host+t.opex+(t.extra??0);
    const profit=netRevenue-cost;
    const margin=netRevenue===0?0:profit/netRevenue;
    const effective=t.price*(1-leakRate);
    const breakEvenUsers=effective>0?Math.ceil(cost/effective):Infinity;
    return {users:t.users,price:t.price,plan:t.plan,billed,leak,netRevenue,starlink,host:t.host,opex:t.opex,extra:t.extra??0,cost,profit,margin,breakEvenUsers};
  }
  function planHint(users, plan){
    if(plan==='500' && users>=50) return 'Fifty or more users on 500 GB will congest a barangay that watches video. Moving to 1 TB costs '+(PLANS[1000].monthly-PLANS[500].monthly).toLocaleString('en-PH')+' pesos more a month, and the change waits until the next billing cycle.';
    if(plan==='1000' && users>0 && users<30) return 'Under about 30 users, the 500 GB plan usually covers the month and keeps the standing bill smaller while the site fills.';
    return null;
  }
  const SCENARIOS=[
    {id:'calm',name:'Calm month',detail:'A full book and only the standing bills. This is the month the guide’s profit figure comes from.',users:100,extraOpex:0,extra:0,leak:0},
    {id:'tight',name:'Tight month',detail:'Seventy users pay, 8% of billings never clear, upkeep jumps, and a visit needs parts.',users:70,extraOpex:2500,extra:2000,leak:.08},
    {id:'bad',name:'Bad month',detail:'About 40 users pay. A storm week or a site that never filled, plus an ₱8,000 repair. The satellite bill still arrives in full.',users:40,extraOpex:4000,extra:8000,leak:.05}
  ];
  function scenarioMath(s, base){
    return monthMath({users:s.users,price:base.price,plan:base.plan,host:base.host,opex:base.opex+s.extraOpex,extra:s.extra,leak:s.leak});
  }
  function peso(n){
    const sign=n<0?'-':'';
    return sign+'₱'+Math.round(Math.abs(n)).toLocaleString('en-PH');
  }
  function payback(profit, capex){ return profit<=0?null:capex/profit; }
  global.BuklodEcon={PLANS,DEFAULTS,FILL,fillUsers,monthMath,planHint,SCENARIOS,scenarioMath,peso,payback};
})(window);
