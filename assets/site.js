(function(){
'use strict';
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
const root=document.getElementById('app');
const shell=document.getElementById('shell');
const overlay=document.getElementById('navigation');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const categories=['All','Digital','Branding','Web','Art Direction'];
let selected='All', lastFocus=null, previousOverflow='';
const clean=(str)=>String(str??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
const projectUrl=p=>'/projects/'+encodeURIComponent(p.slug)+'/';
const findProject=slug=>projects.find(p=>p.slug===slug);
const img=(path,alt,extra='')=>'<img src="'+clean(path)+'" alt="'+clean(alt)+'" '+extra+'>';
function cover(p,opts={}){
  if(p.cover){
    const mode=p.slug==='botswana-tech-fund'?'website':'photo';
    return '<div class="cover cover-'+clean(p.slug)+'" data-cover="'+mode+'">'+img(p.cover,p.title+' portfolio artwork',opts.lead?'data-first="true" fetchpriority="high"':'loading="lazy"')+'</div>';
  }
  return '<div class="cover cover-'+clean(p.art||p.slug)+'">'+
  '<span class="cover-kicker"><span>MATTHEW EXOUSIA®</span><span>'+clean(p.year)+'</span></span>'+
  '<span class="cover-title">'+clean(p.title)+'</span>'+
  '<span class="cover-statement">'+clean(p.services.slice(0,2).join(' / '))+'</span></div>';
}
function card(p,kind='work',i=0){
  const cls=kind==='archive'?'archive-tile':'project-tile';
  return '<a class="'+cls+'" href="'+projectUrl(p)+'" aria-label="Explore '+clean(p.title)+' case study">'+cover(p,{lead:i===0})+
     (kind==='archive'?'<span class="archive-info"><strong>'+clean(p.title)+'</strong><span>'+clean(p.category)+' ↗</span></span>'
     :'<span class="tile-label"><span><strong class="tile-name">'+clean(p.title)+'</strong><small class="tile-type">'+clean(p.tags.join(' / '))+' · '+clean(p.year)+'</small></span><span class="tile-arrow">↗</span></span>')+
     '</a>';
}
function renderHome(){
const filtered=projects.filter(p=>p.featured&& (selected==='All'||p.tags.includes(selected)));
const allCount=projects.filter(p=>p.featured).length;
const filters=categories.map(cat=>'<button type="button" class="filter'+(selected===cat?' selected':'')+'" aria-pressed="'+String(selected===cat)+'" data-filter="'+clean(cat)+'">'+clean(cat)+'</button>').join('');
root.innerHTML='<main id="main-content"><section class="hero"><h1 class="hero-intro">A product designer and design engineer creating thoughtful digital experiences, identities, and systems for ambitious brands.</h1></section>'+
'<section aria-label="Selected projects"><div class="filterbar"><nav class="filters" aria-label="Project categories">'+filters+'</nav><span class="count" aria-live="polite">'+String(filtered.length).padStart(2,'0')+' / '+String(allCount).padStart(2,'0')+' PROJECTS</span></div>'+
(filtered.length?'<div class="work-grid">'+filtered.map((p,i)=>card(p,'work',i)).join('')+'</div>':'<div class="no-results" style="display:block">No published projects in this category yet.</div>')+'</section>'+
'<section class="intro-end"><p>A growing collection of projects, selected experiments and work from the studio and beyond.</p><a class="underline-link" href="/archive/">VIEW FULL ARCHIVE ↗</a></section></main>';
root.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.filter;renderHome()}));
addReveal();setMeta('Matthew Exousia® — Selected Work','A product designer and design engineer based in Lagos. Selected digital, web and brand work.');
}
function renderArchive(){
root.innerHTML='<main id="main-content" class="archive-page"><div class="archive-head"><h1>Archive</h1><p>A visual collection of digital products, websites, brand systems and ideas made along the way.</p></div>'+
'<div class="archive-count"><span>INDEX / SELECTED WORK</span><span>'+String(projects.length).padStart(2,'0')+' PROJECTS</span></div>'+
'<section class="archive-grid" aria-label="Archive projects">'+projects.map((p,i)=>card(p,'archive',i)).join('')+'</section>'+
'<div class="archive-bottom"><a href="/">← BACK TO SELECTED WORK</a></div></main>';
addReveal();setMeta('Archive — Matthew Exousia®','Explore selected brand identity, digital product and website work by Matthew Exousia.');
}
function renderCase(p){
const idx=projects.findIndex(x=>x.slug===p.slug);
const next=projects[(idx+1)%projects.length];
const media=p.gallery||[];
const lead=p.cover ? cover(p,{lead:true}) : cover(p);
const gallery=media.map((g,i)=>'<figure class="media-frame '+clean(g.ratio==='landscape'?'wide':'portrait')+'">'+img(g.src,g.caption||p.title+' design image','loading="lazy" decoding="async"')+'<figcaption>'+String(i+1).padStart(2,'0')+' / '+clean(g.caption)+'</figcaption></figure>').join('');
root.innerHTML='<main id="main-content" class="case-page"><div class="case-cover">'+lead+'</div>'+
'<section class="case-heading"><h1>'+clean(p.title)+'</h1><p class="headline-overview">'+clean(p.overview)+'</p></section>'+
'<section class="case-facts" aria-label="Project facts"><div><span class="mini-label">DATE</span><p>'+clean(p.year)+'</p></div>'+
'<div><span class="mini-label">LOCATION</span><p>'+clean(p.location||'Nigeria')+'</p></div>'+
'<div><span class="mini-label">SERVICES</span><p>'+p.services.map(x=>'<span>'+clean(x)+'</span>').join('')+'</p>'+
(p.url?'<p style="margin-top:18px"><a href="'+clean(p.url)+'" target="_blank" rel="noopener noreferrer">VISIT WEBSITE ↗</a></p>':'')+'</div></section>'+
'<section class="case-story"><h2>THE BRIEF</h2><div class="story-copy"><h3>'+clean(p.overview)+'</h3><div class="story-columns"><div><h4>THE CHALLENGE</h4><p>'+clean(p.challenge)+'</p></div><div><h4>OUR APPROACH</h4><p>'+clean(p.approach)+'</p></div></div></div></section>'+
(media.length?'<section class="media-sequence" aria-label="'+clean(p.title)+' selected visuals">'+gallery+'</section>':!p.cover?'<section class="media-pending"><h3>Work in progress.</h3><p>Approved project imagery is being prepared for this case study. The story and project information remain available here.</p></section>':'')+
'<section class="story-note"><h2>THE WORK</h2><div class="note-copy"><strong>Made to move the work forward.</strong><p>'+clean(p.outcome)+'</p></div></section>'+
'<section class="next-wrap" aria-label="Next project"><div class="next-overline"><span>UP NEXT</span><span>'+clean(next.category)+' / '+clean(next.year)+'</span></div>'+
'<a class="next-project" href="'+projectUrl(next)+'" aria-label="View next project: '+clean(next.title)+'">'+cover(next)+'<span class="next-title"><strong>'+clean(next.title)+'</strong><span>↗</span></span><span class="next-progress" aria-hidden="true"></span></a></section></main>';
const nextEl=root.querySelector('.next-project');
if(nextEl&&!reduced){let ticking=false;window.addEventListener('scroll',function update(){if(!root.contains(nextEl)){window.removeEventListener('scroll',update);return;}if(ticking)return;ticking=true;requestAnimationFrame(()=>{const b=nextEl.getBoundingClientRect();const range=window.innerHeight+b.height;const val=Math.max(0,Math.min(1,(window.innerHeight-b.top)/range));const bar=nextEl.querySelector('.next-progress');if(bar)bar.style.width=(val*100).toFixed(1)+'%';nextEl.style.setProperty('--reveal',val.toFixed(3));ticking=false})},{passive:true})}
addReveal();setMeta(p.title+' — Matthew Exousia®',p.overview,p.cover);
}
function setMeta(title,description,coverUrl){
document.title=title;
let d=document.querySelector('meta[name="description"]');if(d)d.content=description;
let canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=location.origin+location.pathname;
const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=title;
const ogDesc=document.querySelector('meta[property="og:description"]');if(ogDesc)ogDesc.content=description;
if(coverUrl){let o=document.querySelector('meta[property="og:image"]');if(!o){o=document.createElement('meta');o.setAttribute('property','og:image');document.head.appendChild(o)}o.content=location.origin+coverUrl;}
}
function addReveal(){
if(reduced||!('IntersectionObserver' in window))return;
const targets=[...root.querySelectorAll('.case-story,.story-note,.media-frame,.archive-head,.hero-intro')];
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}},{threshold:0.07,rootMargin:'0px 0px 65px 0px'});
targets.forEach(t=>{t.classList.add('reveal');observer.observe(t)});
}
function formatClock(){
const node=document.getElementById('clock');if(!node)return;
node.textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,timeZone:'Africa/Lagos'}).format(new Date())+' · LAGOS';
}
formatClock();setInterval(formatClock,1000);
let stored='';
try{stored=localStorage.getItem('matt-portfolio-theme')||''}catch(e){}
let theme=stored||((new Date().getHours()>=7&&new Date().getHours()<18)?'light':'dark');
function paintTheme(){
document.documentElement.dataset.theme=theme;
const label=document.getElementById('theme-value');if(label)label.textContent=theme;
document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#f1f1ed':'#111210');
}
paintTheme();
document.getElementById('theme-toggle')?.addEventListener('click',()=>{theme=theme==='light'?'dark':'light';try{localStorage.setItem('matt-portfolio-theme',theme)}catch(e){}paintTheme()});
function openMenu(){
lastFocus=document.activeElement;previousOverflow=document.body.style.overflow;
overlay.classList.add('open');overlay.removeAttribute('aria-hidden');shell.inert=true;document.body.classList.add('locked');
document.getElementById('menu-trigger').setAttribute('aria-expanded','true');document.getElementById('menu-close').focus();
}
function closeMenu(){
if(!overlay.classList.contains('open'))return;
overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');shell.inert=false;document.body.classList.remove('locked');document.body.style.overflow=previousOverflow;
document.getElementById('menu-trigger').setAttribute('aria-expanded','false');if(lastFocus?.focus)lastFocus.focus();
}
document.getElementById('menu-trigger')?.addEventListener('click',openMenu);
document.getElementById('menu-close')?.addEventListener('click',closeMenu);
overlay.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{
if(!overlay.classList.contains('open'))return;
if(e.key==='Escape'){e.preventDefault();closeMenu();return}
if(e.key==='Tab'){
const focusables=[...overlay.querySelectorAll('button:not([disabled]),a[href]')].filter(x=>x.offsetParent!==null);
if(!focusables.length)return;
const first=focusables[0],last=focusables[focusables.length-1];
if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
}});
const path=decodeURIComponent(location.pathname).replace(/\/+$/,'')||'/';
if(path==='/archive')renderArchive();
else if(path.startsWith('/projects/')){const slug=path.split('/')[2];const p=findProject(slug);if(p)renderCase(p);else {renderArchive();document.title='Project not found — Matthew Exousia®';}}
else renderHome();
function loader(){
const screen=document.getElementById('load-screen');if(!screen)return;
const bar=document.getElementById('load-bar'),label=document.getElementById('load-label');
const first=root.querySelector('img[data-first="true"]');
let ready=false,started=performance.now();
const imageReady=(first&&typeof first.decode==='function')?first.decode().catch(()=>{}):Promise.resolve();
Promise.race([imageReady,new Promise(r=>setTimeout(r,1300))]).then(()=>{ready=true});
function update(now){
const elapsed=now-started;
const p=Math.min(1,elapsed/820);
const n=Math.min(100,ready?Math.floor(p*100):Math.floor(p*93));
if(bar)bar.style.width=n+'%';
if(label)label.textContent=n+'%';
if(n<100)requestAnimationFrame(update);
else setTimeout(()=>{screen.classList.add('hidden');setTimeout(()=>screen.remove(),420)},160);
}
requestAnimationFrame(update);
}
if(reduced){document.getElementById('load-screen')?.remove()}else loader();
})();