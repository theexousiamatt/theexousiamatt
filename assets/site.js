(function(){
'use strict';
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
if(!projects.length)return;
const root=document.getElementById('app');
const overlay=document.getElementById('navigation');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
// Ease wheel input while keeping the document's native scroll position.
function enableSmoothWheel(){
  const documentScroller=document.scrollingElement;
  let frame=0, target=0, position=0, lastScroll=0, lastTime=0;
  const maxScroll=()=>Math.max(0,documentScroller.scrollHeight-documentScroller.clientHeight);
  const clamp=value=>Math.min(maxScroll(),Math.max(0,value));
  function stop(){
    cancelAnimationFrame(frame);
    frame=0;
  }
  function step(now){
    if(motionPreference.matches||document.body.classList.contains('locked')||Math.abs(window.scrollY-lastScroll)>1){
      stop();
      return;
    }
    target=clamp(target);
    const elapsed=lastTime?Math.min(now-lastTime,48):1000/60;
    lastTime=now;
    position+=(target-position)*(1-Math.exp(-elapsed/320));
    const settled=Math.abs(position-target)<0.75;
    window.scrollTo({top:settled?target:position,behavior:'instant'});
    lastScroll=window.scrollY;
    frame=settled?0:requestAnimationFrame(step);
  }
  function usesNativeScroll(event){
    for(const node of event.composedPath()){
      if(node===document.body||node===documentScroller)break;
      if(!(node instanceof Element))continue;
      if(node.matches('select,input[type="range"],input[type="number"]'))return true;
      if(node.scrollHeight>node.clientHeight+1&&/^(auto|scroll)$/.test(getComputedStyle(node).overflowY))return true;
    }
    return false;
  }
  window.addEventListener('wheel',event=>{
    if(event.defaultPrevented||!event.cancelable||motionPreference.matches||document.body.classList.contains('locked')||
      event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||Math.abs(event.deltaX)>=Math.abs(event.deltaY)||usesNativeScroll(event)){
      stop();
      return;
    }
    const current=window.scrollY;
    if(!frame||Math.abs(current-lastScroll)>1){
      stop();
      position=target=lastScroll=current;
      lastTime=0;
    }
    const unit=event.deltaMode===1?32:event.deltaMode===2?documentScroller.clientHeight:1;
    const delta=event.deltaY*unit;
    // Drop residual momentum when the user reverses direction.
    if((target-position)*delta<0)target=position;
    target=clamp(target+delta);
    event.preventDefault();
    if(!frame&&Math.abs(target-current)>=0.5)frame=requestAnimationFrame(step);
  },{passive:false});
  window.addEventListener('scroll',()=>{if(frame&&Math.abs(window.scrollY-lastScroll)>1)stop()},{passive:true});
  for(const event of ['pointerdown','touchstart','keydown','pagehide'])window.addEventListener(event,stop,{passive:true});
  motionPreference.addEventListener('change',stop);
}
enableSmoothWheel();
const categories=['All','Digital','Branding','Web','Art Direction'];
const clean=(str)=>String(str??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
const projectUrl=p=>'/projects/'+encodeURIComponent(p.slug)+'/';
const findProject=slug=>projects.find(p=>p.slug===slug);
const img=(path,alt,extra='')=>'<img src="'+clean(path)+'" alt="'+clean(alt)+'" '+extra+'>';
// Reuse the 24-unit pixel grid from the mattt.wtf work gallery.
const leftArrow='<path d="M3 11h17v2H3zM5 9h2v2H5zM7 7h2v2H7zM9 5h2v2H9zM5 13h2v2H5zM7 15h2v2H7zM9 17h2v2H9z"/>';
const pixelIcons={
  left:leftArrow,
  right:'<g transform="translate(24 0) scale(-1 1)">'+leftArrow+'</g>',
  close:'<path d="M5 5h3v3H5zM8 8h3v3H8zM11 11h2v2h-2zM13 8h3v3h-3zM16 5h3v3h-3zM8 13h3v3H8zM5 16h3v3H5zM13 13h3v3h-3zM16 16h3v3h-3z"/>',
  external:'<path d="M10 5h9v2h-9zM17 7h2v7h-2zM15 7h2v2h-2zM13 9h2v2h-2zM11 11h2v2h-2zM9 13h2v2H9zM7 15h2v2H7zM5 17h2v2H5z"/>',
  menu:'<path d="M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z"/>',
  moon:'<path d="M10 4h6v2h-4v2h-2v8h2v2h6v-2h2v4h-4v2H8v-2H6v-2H4V8h2V6h4zm-2 4H6v8h2v2h2v-2H8z"/>',
  sun:'<path d="M10 7h4v2h3v6h-3v2h-4v-2H7V9h3zm0 3v4h4v-4zM11 2h2v3h-2zM11 19h2v3h-2zM2 11h3v2H2zM19 11h3v2h-3zM5 5h2v2H5zM17 5h2v2h-2zM5 17h2v2H5zM17 17h2v2h-2z" fill-rule="evenodd"/>'
};
function pixelIcon(name){
  return '<svg class="pixel-icon" data-pixel-icon="'+name+'" viewBox="0 0 24 24" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true" focusable="false">'+pixelIcons[name]+'</svg>';
}
document.querySelectorAll('[data-icon]').forEach(node=>{node.innerHTML=pixelIcon(node.dataset.icon)});
function cover(p,opts={}){
  if(p.cover){
    const loading=opts.lead?'data-first="true" fetchpriority="high"':'loading="lazy" decoding="async"';
    if(p.slug==='ivy'){
      return '<div class="cover cover-ivy" data-cover="portrait"><span class="ivy-type">Ivy.</span><div class="ivy-portrait">'+
        img(p.cover,'Ivy Elebesunu — approved website portrait',loading)+'</div><span class="ivy-caption">FINANCE / TECH / CAREERS</span></div>';
    }
    if(p.slug==='lora'){
      return '<div class="cover cover-lora" data-cover="studio"><span class="lora-ambient"></span>'+
        '<span class="lora-head">Lora.</span><span class="lora-badge">3D STUDIO®</span><div class="lora-mark">'+
        img(p.cover,'Original Lora 3D Studio brand mark',loading)+'</div>'+
        '<span class="lora-sub">MATERIAL / FORM<br>LIGHT / COMPOSITION</span></div>';
    }
    if(p.slug==='jerin'){
      return '<div class="cover cover-jerin" data-cover="product"><span class="jerin-overline"><span>JERIN®</span><span>WORKSPACE / 2026</span></span>'+
        '<div class="jerin-interface">'+img(p.cover,'Earlier Ordo workspace UI, from before its rebrand to Jerin',loading)+'</div>'+
        '<span class="jerin-footnote">EARLIER PRODUCT DESIGN STUDY · ORDO</span></div>';
    }
    const mode=p.slug==='botswana-tech-fund'?'website':'photo';
    return '<div class="cover cover-'+clean(p.slug)+'" data-cover="'+mode+'">'+img(p.cover,p.coverAlt||p.title+' project image',loading)+'</div>';
  }
  return '<div class="cover cover-'+clean(p.art||p.slug)+'">'+
   '<span class="cover-kicker"><span>MATTHEW EXOUSIA®</span><span>'+clean(p.year)+'</span></span>'+
   '<span class="cover-title">'+clean(p.title)+'</span>'+
   '<span class="cover-statement">'+clean(p.services.slice(0,2).join(' / '))+'</span></div>';
}
function card(p,kind='work',i=0){
  const cls=kind==='archive'?'archive-tile':'project-tile';
  return '<a class="'+cls+'" href="'+projectUrl(p)+'" aria-label="Explore '+clean(p.title)+' case study">'+(kind==='archive'?cover(p,{lead:i===0}):'<div class="tile-media">'+cover(p,{lead:i===0})+'</div>')+
     (kind==='archive'?'<span class="archive-info"><strong>'+clean(p.title)+'</strong><span>'+clean(p.category)+' '+pixelIcon('external')+'</span></span>'
     :'<span class="tile-label"><strong class="tile-name">'+clean(p.title)+'</strong><small class="tile-type">'+clean(p.category)+' '+clean(p.year)+'</small></span>')+
     '</a>';
}
function enhanceMaskedRollovers(){
  const elements=document.querySelectorAll('.site-header .wordmark,.site-header .header-mail,.site-header .nav-archive,.site-footer .socials a,.filter');
  elements.forEach(el=>{
    if(el.classList.contains('roll-link'))return;
    const label=(el.textContent||'').trim();
    if(!label)return;
    const mask=document.createElement('span'),track=document.createElement('span');
    mask.className='roll-window';track.className='roll-track';
    for(let i=0;i<2;i++){
      const copy=document.createElement('span');
      copy.className='roll-copy';
      copy.textContent=label;
      if(i===1)copy.setAttribute('aria-hidden','true');
      track.appendChild(copy);
    }
    mask.appendChild(track);el.textContent='';el.appendChild(mask);el.classList.add('roll-link');
  });
}
function renderHome(){
  const featured=projects.filter(p=>p.featured);
  const filters=categories.map(cat=>'<button type="button" class="filter" aria-pressed="false" aria-label="'+clean(cat)+'" data-filter="'+clean(cat)+'">'+clean(cat)+'</button>').join('');
  root.innerHTML='<main id="main-content" tabindex="-1"><section class="hero"><h1 class="hero-intro">A multidisciplinary designer creating distinct brand identities, engaging websites, and thoughtfully designed digital products.</h1></section>'+
    '<section aria-label="Selected projects"><div class="filterbar"><nav class="filters" aria-label="Project categories">'+filters+'</nav><span class="sr-only project-status" role="status"></span></div>'+
    '<div class="work-grid"></div><p class="no-results" hidden>No published projects in this category yet.</p></section></main>';
  const buttons=[...root.querySelectorAll('[data-filter]')];
  const count=root.querySelector('.project-status');
  const grid=root.querySelector('.work-grid');
  const empty=root.querySelector('.no-results');
  function select(category){
    const shown=featured.filter(p=>category==='All'||p.tags.includes(category));
    for(const button of buttons){
      const active=button.dataset.filter===category;
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
    }
    grid.innerHTML=shown.map((p,i)=>card(p,'work',i)).join('');
    empty.hidden=shown.length>0;
    count.textContent=shown.length+' of '+featured.length+' projects';
  }
  for(const button of buttons)button.addEventListener('click',()=>select(button.dataset.filter));
  select('All');

}
function renderArchive(){
  root.innerHTML='<main id="main-content" tabindex="-1" class="archive-page">'+
    '<div class="archive-head"><h1>Archive</h1><label class="archive-density"><span>Columns</span>'+
    '<select aria-label="Archive columns"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label></div>'+
    '<section class="archive-grid" aria-label="Archive projects">'+projects.map((p,i)=>card(p,'archive',i)).join('')+'</section></main>';
  const grid=root.querySelector('.archive-grid');
  const density=root.querySelector('select');
  density.addEventListener('change',()=>grid.style.setProperty('--archive-columns',density.value));
}
function renderCase(p){
  const next=projects[(projects.indexOf(p)+1)%projects.length];
  const media=(p.gallery||[]).filter(item=>item.src!==p.cover);
  const gallery=media.map(item=>{
    const layout=item.ratio==='landscape'?'wide':'portrait';
    const caption=item.caption?'<figcaption>'+clean(item.caption)+'</figcaption>':'';
    return '<figure class="media-frame '+layout+'"><div class="media-image">'+
      img(item.src,item.caption||p.title+' design image','loading="lazy" decoding="async"')+'</div>'+caption+'</figure>';
  }).join('');
  const website=p.url?'<a class="case-website" href="'+clean(p.url)+'" target="_blank" rel="noopener noreferrer">Visit website '+pixelIcon('external')+'</a>':'';

  root.innerHTML='<main id="main-content" tabindex="-1" class="case-page">'+
    '<div class="case-heading case-inner"><h1>'+clean(p.title)+'</h1><p class="headline-overview">'+clean(p.overview)+'</p>'+
    '<dl class="case-facts"><div><dt>Year</dt><dd>'+clean(p.year)+'</dd></div>'+
    (p.location?'<div><dt>Location</dt><dd>'+clean(p.location)+'</dd></div>':'')+
    '<div><dt>Services</dt><dd>'+clean(p.services.join(' / '))+'</dd></div></dl>'+website+'</div>'+
    (p.cover?'<div class="case-cover">'+cover(p,{lead:true})+'</div>':'')+
    '<section class="case-story case-inner" aria-label="Project brief">'+
    '<div><h2>The challenge</h2><p>'+clean(p.challenge)+'</p></div>'+
    '<div><h2>The approach</h2><p>'+clean(p.approach)+'</p></div></section>'+
    (media.length?'<section class="media-sequence" aria-label="'+clean(p.title)+' selected visuals">'+gallery+'</section>':'')+
    (p.outcome?'<section class="story-note case-inner"><h2>Outcome</h2><p>'+clean(p.outcome)+'</p></section>':'')+
    '<section class="next-wrap" aria-label="Next project"><div class="next-overline"><span>Up next</span><span>'+clean(next.category)+' / '+clean(next.year)+'</span></div>'+
    '<a class="next-project" href="'+projectUrl(next)+'" aria-label="View next project: '+clean(next.title)+'">'+cover(next)+
    '<span class="next-title"><strong>'+clean(next.title)+'</strong>'+pixelIcon('right')+'</span><span class="next-progress" aria-hidden="true"></span></a></section></main>';
const nextEl=root.querySelector('.next-project');
if(nextEl){
  let frame=0;
  const bar=nextEl.querySelector('.next-progress');
  function update(){
    frame=0;
    if(motionPreference.matches)return;
    const bounds=nextEl.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,(innerHeight-bounds.top)/(innerHeight+bounds.height)));
    bar.style.width=(progress*100)+'%';
    nextEl.style.setProperty('--reveal',progress);
  }
  function schedule(){if(!frame&&!motionPreference.matches)frame=requestAnimationFrame(update)}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  motionPreference.addEventListener('change',schedule);
  schedule();
}
}
const localTime=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true});
function formatClock(){
const node=document.getElementById('clock');if(!node)return;
node.textContent=localTime.format(new Date()).toLowerCase();
}
const clockNode=document.getElementById('clock');
if(clockNode){
  const wrapper=document.createElement('span');
  wrapper.className='header-appearance';
  clockNode.parentNode.insertBefore(wrapper,clockNode);
  const themeControl=document.createElement('button');
  themeControl.type='button';
  themeControl.id='header-theme-toggle';
  themeControl.className='header-theme-toggle';
  themeControl.innerHTML=pixelIcon('moon');
  themeControl.setAttribute('aria-label','Switch between dark and light mode');
  themeControl.addEventListener('click',()=>document.getElementById('theme-toggle')?.click());
  wrapper.appendChild(themeControl);
  wrapper.appendChild(clockNode);
}
formatClock();setInterval(formatClock,1000);
let stored='';
try{stored=localStorage.getItem('matt-portfolio-theme')||''}catch(e){}
let theme=stored==='light'?'light':'dark';
function paintTheme(){
document.documentElement.dataset.theme=theme;
const label=document.getElementById('theme-value');if(label)label.textContent=theme;
const icon=document.getElementById('header-theme-toggle');if(icon){icon.innerHTML=pixelIcon(theme==='light'?'sun':'moon');icon.setAttribute('aria-label','Switch to '+(theme==='light'?'dark':'light')+' mode');}
document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#ffffff':'#0f0f0f');
}
paintTheme();
document.getElementById('theme-toggle')?.addEventListener('click',()=>{theme=theme==='light'?'dark':'light';try{localStorage.setItem('matt-portfolio-theme',theme)}catch(e){}paintTheme()});
const menuTrigger=document.getElementById('menu-trigger');
const siteHeader=document.querySelector('.site-header');
const backgroundContent=[root,document.querySelector('.site-footer'),document.querySelector('.skip-link')];
function setMenu(open){
  if(overlay.classList.contains('open')===open)return;
  if(!open)menuTrigger.focus({preventScroll:true});
  overlay.classList.toggle('open',open);
  overlay.inert=!open;
  overlay.setAttribute('aria-hidden',String(!open));
  document.body.classList.toggle('locked',open);
  for(const part of backgroundContent)part.inert=open;
  menuTrigger.setAttribute('aria-expanded',String(open));
  menuTrigger.innerHTML=(open?'CLOSE ':'MENU ')+pixelIcon(open?'close':'menu');
}
menuTrigger.hidden=false;
menuTrigger.addEventListener('click',()=>setMenu(!overlay.classList.contains('open')));
window.matchMedia('(min-width: 621px)').addEventListener('change',event=>{if(event.matches)setMenu(false)});
for(const link of [...siteHeader.querySelectorAll('a'),...overlay.querySelectorAll('a')]){
  link.addEventListener('click',event=>{
    if(!overlay.classList.contains('open'))return;
    const internal=link.origin===location.origin && !link.target && !event.metaKey &&
      !event.ctrlKey && !event.shiftKey && !event.altKey && event.button===0;
    setMenu(false);
    if(!internal || motionPreference.matches)return;
    event.preventDefault();
    const fade=overlay.getAnimations().find(animation=>animation.transitionProperty==='opacity');
    if(!fade){location.assign(link.href);return}
    fade.finished.then(()=>location.assign(link.href),()=>{});
  });
}
document.addEventListener('keydown',event=>{
  if(!overlay.classList.contains('open'))return;
  if(event.key==='Escape'){
    event.preventDefault();
    setMenu(false);
  }else if(event.key==='Tab'){
    const focusables=[...siteHeader.querySelectorAll('a[href],button'),...overlay.querySelectorAll('a[href],button')]
      .filter(element=>element.getClientRects().length);
    const first=focusables[0],last=focusables.at(-1);
    if((event.shiftKey&&document.activeElement===first)||(!event.shiftKey&&document.activeElement===last)){
      event.preventDefault();
      (event.shiftKey?last:first).focus({preventScroll:true});
    }
  }
});
const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'')||'/';
if(path==='/archive')renderArchive();
else if(path.startsWith('/projects/')){const slug=path.split('/')[2];const p=findProject(slug);if(p)renderCase(p);else {renderArchive();document.title='Project not found — Matthew Exousia®';}}
else renderHome();
enhanceMaskedRollovers();
})();

for (const link of document.querySelectorAll('.header-mail, .overlay-main a[href^="mailto:"]')) {
  const group=document.createElement('span');
  if(link.matches('.header-mail')) {
    group.className='header-mail';
    link.classList.remove('header-mail');
  }
  group.style.whiteSpace='nowrap';
  link.before(group);
  const row=document.createElement('span');
  row.className='email-copy-row';group.append(row);row.append(link);
  const button=document.createElement('button');
  button.type='button';
  button.ariaLabel='Copy email address';
  button.title='Copy email address';
  button.className='copy-email';
  button.innerHTML='<svg aria-hidden="true" viewBox="0 0 12 12" fill="currentColor"><path d="M1 1h6v1H2v6H1z"/><path class="front-sheet" fill-rule="evenodd" d="M4 3h4v1h1v1h1v6H4zm1 1v6h4V6H7V4z"/></svg>';
  const status=document.createElement('span');
  status.className='sr-only';status.setAttribute('role','status');
  row.append(button,status);
  const icon=button.innerHTML;
  let timer;
  button.onclick=async()=>{
    try {
      await navigator.clipboard.writeText(link.href.slice(7));
      status.textContent='Email address copied';
      button.innerHTML='<svg aria-hidden="true" viewBox="0 0 12 12" fill="currentColor"><path d="M1 6h2v2h2V6h2V4h2V2h2v3H9v2H7v2H5v2H3V9H1z"/></svg>';
      clearTimeout(timer);
      timer=setTimeout(()=>{button.innerHTML=icon;status.textContent=''},1500);
    } catch {window.prompt('Copy email address',link.href.slice(7))}
  };
}
