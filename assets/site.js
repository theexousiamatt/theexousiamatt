(function(){
'use strict';
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
if(!projects.length)return;
const root=document.getElementById('app');
const shell=document.getElementById('shell');
const overlay=document.getElementById('navigation');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const categories=['All','Digital','Branding','Web','Art Direction'];
let lastFocus=null;
const clean=(str)=>String(str??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
const projectUrl=p=>'/projects/'+encodeURIComponent(p.slug)+'/';
const findProject=slug=>projects.find(p=>p.slug===slug);
const img=(path,alt,extra='')=>'<img src="'+clean(path)+'" alt="'+clean(alt)+'" '+extra+'>';
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
     (kind==='archive'?'<span class="archive-info"><strong>'+clean(p.title)+'</strong><span>'+clean(p.category)+' ↗</span></span>'
     :'<span class="tile-label"><span><strong class="tile-name">'+clean(p.title)+'</strong><small class="tile-type">'+clean(p.category)+' · '+clean(p.year)+'</small></span><span class="tile-arrow" aria-hidden="true">↗</span></span>')+
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
  const filters=categories.map(cat=>'<button type="button" class="filter" aria-pressed="false" data-filter="'+clean(cat)+'">'+clean(cat)+'</button>').join('');
  root.innerHTML='<main id="main-content" tabindex="-1"><section class="hero"><h1 class="hero-intro">Product designer and design engineer based in Lagos.</h1></section>'+
    '<section aria-label="Selected projects"><div class="filterbar"><nav class="filters" aria-label="Project categories">'+filters+'</nav><span class="count" role="status"></span></div>'+
    '<div class="work-grid"></div><p class="no-results" hidden>No published projects in this category yet.</p></section></main>';
  const buttons=[...root.querySelectorAll('[data-filter]')];
  const count=root.querySelector('.count');
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
  root.querySelector('.hero-intro').classList.add('reveal');
}
function renderArchive(){
root.innerHTML='<main id="main-content" tabindex="-1" class="archive-page"><div class="archive-head"><h1>Archive</h1><p>A visual collection of digital products, websites, brand systems and ideas made along the way.</p></div>'+
'<div class="archive-count"><span>INDEX / SELECTED WORK</span><span>'+String(projects.length).padStart(2,'0')+' PROJECTS</span></div>'+
'<section class="archive-grid" aria-label="Archive projects">'+projects.map((p,i)=>card(p,'archive',i)).join('')+'</section>'+
'<div class="archive-bottom"><a href="/">← BACK TO SELECTED WORK</a></div></main>';
root.querySelector('.archive-head').classList.add('reveal');
}
function renderCase(p){
const idx=projects.findIndex(x=>x.slug===p.slug);
const next=projects[(idx+1)%projects.length];
const media=p.gallery||[];
const lead=p.cover ? cover(p,{lead:true}) : cover(p);
const gallery=media.map((g,i)=>'<figure class="media-frame '+clean(g.ratio==='landscape'?'wide':'portrait')+'">'+img(g.src,g.caption||p.title+' design image','loading="lazy" decoding="async"')+'<figcaption>'+String(i+1).padStart(2,'0')+' / '+clean(g.caption)+'</figcaption></figure>').join('');
root.innerHTML='<main id="main-content" tabindex="-1" class="case-page"><div class="case-cover">'+lead+'</div>'+
'<section class="case-heading"><h1>'+clean(p.title)+'</h1><p class="headline-overview">'+clean(p.overview)+'</p></section>'+
'<section class="case-facts" aria-label="Project facts"><div><span class="mini-label">DATE</span><p>'+clean(p.year)+'</p></div>'+
'<div><span class="mini-label">LOCATION</span><p>'+clean(p.location||'Nigeria')+'</p></div>'+
'<div><span class="mini-label">SERVICES</span><p>'+p.services.map(x=>'<span>'+clean(x)+'</span>').join('')+'</p>'+
(p.url?'<p style="margin-top:18px"><a href="'+clean(p.url)+'" target="_blank" rel="noopener noreferrer">VISIT WEBSITE ↗</a></p>':'')+'</div></section>'+
'<section class="case-story"><h2>THE BRIEF</h2><div class="story-copy"><h3>'+clean(p.overview)+'</h3><div class="story-columns"><div><h4>THE CHALLENGE</h4><p>'+clean(p.challenge)+'</p></div><div><h4>OUR APPROACH</h4><p>'+clean(p.approach)+'</p></div></div></div></section>'+
(media.length?'<section class="media-sequence" aria-label="'+clean(p.title)+' selected visuals">'+gallery+'</section>':p.url?'<section class="case-live"><p>EXPLORE THE PROJECT</p><a href="'+clean(p.url)+'" target="_blank" rel="noopener noreferrer">VIEW LIVE EXPERIENCE <span aria-hidden="true">↗</span></a></section>':'')+
'<section class="story-note"><h2>THE WORK</h2><div class="note-copy"><strong>Made to move the work forward.</strong><p>'+clean(p.outcome)+'</p></div></section>'+
'<section class="next-wrap" aria-label="Next project"><div class="next-overline"><span>UP NEXT</span><span>'+clean(next.category)+' / '+clean(next.year)+'</span></div>'+
'<a class="next-project" href="'+projectUrl(next)+'" aria-label="View next project: '+clean(next.title)+'">'+cover(next)+'<span class="next-title"><strong>'+clean(next.title)+'</strong><span>↗</span></span><span class="next-progress" aria-hidden="true"></span></a></section></main>';
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
const themeGlyphs={
  dark:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M20.2 16.4A8.7 8.7 0 0 1 7.6 3.8a8.8 8.8 0 1 0 12.6 12.6Z"/></svg>',
  light:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17-7-1.5 1.5M6.5 17.5 5 19m14 0-1.5-1.5M6.5 6.5 5 5"/></svg>'
};
const lagosTime=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Africa/Lagos'});
function formatClock(){
const node=document.getElementById('clock');if(!node)return;
node.textContent=lagosTime.format(new Date()).toLowerCase();
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
  themeControl.innerHTML=themeGlyphs.dark;
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
const icon=document.getElementById('header-theme-toggle');if(icon){icon.innerHTML=themeGlyphs[theme];icon.setAttribute('aria-label','Switch to '+(theme==='light'?'dark':'light')+' mode');}
document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#f1f1ed':'#0f0f0f');
}
paintTheme();
document.getElementById('theme-toggle')?.addEventListener('click',()=>{theme=theme==='light'?'dark':'light';try{localStorage.setItem('matt-portfolio-theme',theme)}catch(e){}paintTheme()});
function openMenu(){
lastFocus=document.activeElement;
overlay.classList.add('open');overlay.inert=false;overlay.removeAttribute('aria-hidden');shell.inert=true;document.body.classList.add('locked');
document.getElementById('menu-trigger').setAttribute('aria-expanded','true');document.getElementById('menu-close').focus();
}
function closeMenu(){
if(!overlay.classList.contains('open'))return;
overlay.classList.remove('open');shell.inert=false;document.body.classList.remove('locked');
document.getElementById('menu-trigger').setAttribute('aria-expanded','false');lastFocus?.focus();
overlay.inert=true;overlay.setAttribute('aria-hidden','true');
}
const menuTrigger=document.getElementById('menu-trigger');
menuTrigger.hidden=false;
menuTrigger.addEventListener('click',openMenu);
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
const path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/+$/,'')||'/';
if(path==='/archive')renderArchive();
else if(path.startsWith('/projects/')){const slug=path.split('/')[2];const p=findProject(slug);if(p)renderCase(p);else {renderArchive();document.title='Project not found — Matthew Exousia®';}}
else renderHome();
enhanceMaskedRollovers();
})();
