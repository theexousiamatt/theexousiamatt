const {chromium}=require("playwright");
const assert=require("node:assert/strict");
(async()=>{
 const b=await chromium.launch({args:["--no-sandbox"]});
 try {
 const p=await b.newPage();
 await p.route('https://fonts.googleapis.com/**',r=>r.abort());
 for(const width of [320,390,620,1440]){
  await p.setViewportSize({width,height:800});
  await p.goto('http://localhost:8080/');
  if(width<=620){
   const logo=p.locator('.wordmark'),button=p.locator('#menu-trigger'),a=p.locator('.overlay-main a').first();
   const pos=await logo.boundingBox();await button.click();await p.waitForTimeout(650);
   assert.deepEqual(await logo.boundingBox(),pos);assert((await a.boundingBox()).y<140);
   await button.click();await p.waitForTimeout(400);assert.deepEqual(await logo.boundingBox(),pos);assert(!(await a.isVisible()));
  }
  await p.goto('http://localhost:8080/archive/');
  const links=await p.locator('.archive-grid a').evaluateAll(as=>as.map(a=>a.href));
  assert.equal(links.length,9);
  for(const url of [...links,'http://localhost:8080/','http://localhost:8080/archive/']){
   await p.goto(url);assert.equal(await p.locator('#main-content > :first-child').evaluate(e=>getComputedStyle(e).animationName),'page-arrive');
   assert.equal(await p.evaluate(()=>scrollY),0);
  }
 }
 await p.emulateMedia({reducedMotion:"reduce"});await p.reload();assert.equal(await p.locator('.archive-head').evaluate(e=>getComputedStyle(e).animationName),'none');
 console.log('Portfolio routes and menu passed');
 await p.emulateMedia({reducedMotion:"no-preference"});
 await p.goto('https://slabtemplate.framer.website/',{waitUntil:'domcontentloaded'});
 const link=p.locator('a').filter({has:p.locator('video,img')}).first();await link.hover();await p.waitForTimeout(800);
 await link.scrollIntoViewIfNeeded();const box=await link.boundingBox();await p.mouse.move(0,0);await p.waitForTimeout(700);
 const measure=()=>p.evaluate(()=>{window.trace=[];let start=performance.now();function frame(t){let label=[...document.querySelectorAll('[data-framer-name="Label"]')].find(e=>e.innerText==='Hydra');if(label){let nodes=[label,label.parentElement,label.firstElementChild,label.querySelector('p')];window.trace.push([Math.round(t-start),...nodes.filter(Boolean).map(n=>{let s=getComputedStyle(n);return [s.opacity,s.transform,s.fontWeight,s.letterSpacing]})])}if(t-start<600)requestAnimationFrame(frame)}requestAnimationFrame(frame)});
 await measure();await p.mouse.move(box.x+40,box.y+45);await p.waitForTimeout(650);console.log('ENTER',JSON.stringify(await p.evaluate(()=>trace.filter((_,i)=>i%2===0))));
 await measure();await p.mouse.move(0,0);await p.waitForTimeout(650);console.log('EXIT',JSON.stringify(await p.evaluate(()=>trace.filter((_,i)=>i%2===0))));
 console.log('REFERENCE',JSON.stringify(await link.evaluate(a=>[a,...a.querySelectorAll('*')].slice(0,90).map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect(),b=a.getBoundingClientRect();return [e.tagName,e.getAttribute('data-framer-name'),e.innerText?.slice(0,32),s.backgroundColor,s.color,s.opacity,s.fontSize,s.padding,s.borderRadius,s.mixBlendMode,s.filter,s.backdropFilter,s.transition,[r.x-b.x,r.y-b.y,r.width,r.height]]}))));
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});