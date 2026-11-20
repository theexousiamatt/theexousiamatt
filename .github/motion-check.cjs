const {chromium}=require("playwright");
const assert=require("node:assert/strict");
(async()=>{
 const b=await chromium.launch({args:["--no-sandbox"]});
 try {
 const p=await b.newPage();
 await p.route('https://fonts.googleapis.com/**',r=>r.abort());
 for(const width of [320,390,620,1440]){
  await p.setViewportSize({width,height:800});
  await p.goto('https://theexousiamatt.com/');
  assert(await p.locator('script[src*="site.js?v=20261120j"]').count());
  if(width<=620){
   const logo=p.locator('.wordmark'),button=p.locator('#menu-trigger'),a=p.locator('.overlay-main a').first();
   const pos=await logo.boundingBox();await button.click();await p.waitForTimeout(650);
   assert.deepEqual(await logo.boundingBox(),pos);assert((await a.boundingBox()).y<140);
   await button.click();await p.waitForTimeout(400);assert.deepEqual(await logo.boundingBox(),pos);assert(!(await a.isVisible())); await button.click();await p.locator('.overlay-main a[href="/archive/"]').click();await p.waitForURL('**/archive/');
  }
  await p.goto('https://theexousiamatt.com/archive/');
  const links=await p.locator('.archive-grid a').evaluateAll(as=>as.map(a=>a.href));
  assert.equal(links.length,9);
  for(const url of [...links,'https://theexousiamatt.com/','https://theexousiamatt.com/archive/']){
   await p.goto(url);assert.equal(await p.locator('#main-content > :first-child').evaluate(e=>getComputedStyle(e).animationName),'page-arrive');
   assert.equal(await p.evaluate(()=>scrollY),0);await p.evaluate(()=>window.scrollTo({top:150,behavior:'instant'}));assert(await p.evaluate(()=>scrollY>0));
  }
 }
 await p.emulateMedia({reducedMotion:"reduce"});await p.reload();assert.equal(await p.locator('.archive-head').evaluate(e=>getComputedStyle(e).animationName),'none');
 console.log('Portfolio routes and menu passed');
 await p.emulateMedia({reducedMotion:"no-preference"});
 await p.setViewportSize({width:1440,height:900});await p.goto('https://theexousiamatt.com/');const card=p.locator('.project-tile').first();await card.hover();await p.waitForTimeout(650);const label=card.locator('.tile-label');const s=await label.evaluate(e=>{const s=getComputedStyle(e);return [s.backgroundColor,s.color,s.backdropFilter,s.opacity,s.padding,s.borderRadius]});assert.deepEqual(s,['rgba(255, 255, 255, 0.15)','rgba(255, 255, 255, 0.88)','blur(1px)','1','8px 12px','2px']);await p.mouse.move(0,0);await p.waitForTimeout(600);assert.equal(await label.evaluate(e=>getComputedStyle(e).opacity),'0');console.log('Live hover, scroll and menu link checks passed');}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});