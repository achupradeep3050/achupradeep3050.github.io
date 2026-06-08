// ============================================================
//  app.js — orchestration: data · boot · scroll · interactions
// ============================================================
import { createCosmos } from './cosmos.js';

/* ---------------- DATA ---------------- */
const ROLES = ['Linux DevOps Engineer', 'AI-Agent Developer', 'Algorithmic-Trading Systems Builder'];

const SKILLS = [
  { t:'Linux & Systems',  c:'#FFCB45', items:['RHEL','CentOS','Fedora','Kali','systemd','SELinux','LVM','kernel tuning'] },
  { t:'Containers & CI/CD',c:'#27E1C1', items:['Docker','Jenkins','Git','blue-green deploy'] },
  { t:'Cloud',            c:'#FFCB45', items:['AWS EC2','S3','IAM'] },
  { t:'Observability',    c:'#27E1C1', items:['Prometheus','Grafana','Loki','Zabbix','alerting','incident response'] },
  { t:'Security / SOC',   c:'#F5B301', items:['Wazuh SIEM','OpenVAS / GVM','ClamAV','ModSecurity','fail2ban','RBAC'] },
  { t:'AI / Agents',      c:'#27E1C1', items:['Python','CrewAI','tool-use','Claude Code','Cursor','Copilot'] },
  { t:'App / Data',       c:'#FFCB45', items:['FastAPI','React','MySQL / MariaDB','Redis'] },
  { t:'Trading Tech',     c:'#F5B301', items:['Pine Script v5','TradingView','SMC / ICT','FVG','EMA / SMA','OANDA','MetaTrader 5'] },
];

const PROJECT_ICONS = {
  usb:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='20' r='1.5'/><path d='M12 20V4'/><path d='M10 6.5 12 3l2 3.5z' fill='currentColor' stroke='none'/><path d='M12 13 8.5 11V8.5'/><rect x='7' y='6.6' width='3' height='2.4' rx='.4'/><path d='M12 15.5 15.5 13v-2'/><circle cx='15.5' cy='10' r='1.3' fill='currentColor' stroke='none'/></svg>",
  agent:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect x='4.5' y='8' width='15' height='11' rx='2.5'/><path d='M12 8V4.5'/><circle cx='12' cy='3.2' r='1.3'/><circle cx='9.4' cy='13' r='1.1' fill='currentColor' stroke='none'/><circle cx='14.6' cy='13' r='1.1' fill='currentColor' stroke='none'/><path d='M9.5 16h5'/><path d='M2.5 12v3M21.5 12v3'/></svg>",
  shield:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2.5 20 6v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6z'/><path d='M8.5 11.5 11 14l4.5-5'/></svg>",
  candle:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M8 3v4M8 14v7'/><rect x='6' y='7' width='4' height='7' rx='.6'/><path d='M16 3v6M16 16v5'/><rect x='14' y='9' width='4' height='7' rx='.6'/></svg>",
  bolt:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M13 2 4.5 13.5H10l-1 8.5L19.5 10H14z'/></svg>",
  chart:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4v16h16'/><rect x='7' y='12' width='2.6' height='5' rx='.4'/><rect x='11.5' y='8' width='2.6' height='9' rx='.4'/><rect x='16' y='14' width='2.6' height='3' rx='.4'/></svg>",
};

const PROJECTS = [
  { name:'Hermes-USB-Portable', kind:'PORTABLE AGENT', icon:'usb', color:'#27E1C1', cover:'hermes', repo:'Hermes-USB-Portable',
    desc:'A portable AI agent that runs from a USB stick on Windows, macOS and Linux with zero host installs — multi-provider model switching plus a guardrailed CLI (dry-run + audit).',
    tags:['Python','Multi-provider','Guardrailed CLI','Cross-platform'] },
  { name:'jobmind-agent', kind:'MULTI-AGENT', icon:'agent', color:'#3BE0C8', cover:'jobmind', repo:'jobmind-agent',
    desc:'A CrewAI multi-agent job-application pipeline — scrape → score → tailor → generate — wrapped in a Streamlit UI.',
    tags:['CrewAI','Multi-agent','Streamlit','Python'] },
  { name:'VA-Opensource-Audit', kind:'SOC / SECURITY', icon:'shield', color:'#5BE8B0', cover:'vaaudit', repo:'VA-Opensource-Audit',
    desc:'A self-hosted SOC dashboard for agentless vulnerability auditing (OpenVAS / GVM + ClamAV) across Linux servers, with JWT + TOTP access control.',
    tags:['OpenVAS / GVM','ClamAV','JWT + TOTP','SOC'] },
  { name:'xauusd-fvg-algo', kind:'GOLD TRADING', icon:'candle', color:'#FFCB45', cover:'xauusd', repo:'xauusd-fvg-algo',
    desc:'A 24/7 multi-broker automated gold (XAUUSD) trading system — FastAPI + React dashboard with Telegram alerts.',
    tags:['FastAPI','React','FVG','Telegram','Multi-broker'] },
  { name:'sma_cross_scalp_bot', kind:'FOREX SCALPER', icon:'bolt', color:'#F5A201', cover:'sma', repo:'sma_cross_scalp_bot',
    desc:'A 24/7 forex / CFD scalping bot — FastAPI + React + MariaDB with automated risk controls.',
    tags:['FastAPI','React','MariaDB','Risk controls'] },
  { name:'OBStat', kind:'MARKET ANALYTICS', icon:'chart', color:'#9AE6FF', cover:'obstat', repo:'OBStat',
    desc:'Order-book & market-microstructure analytics for algorithmic-trading research.',
    tags:['Order book','Microstructure','Analytics','Research'] },
];

const EXPERIENCE = [
  { when:'2024 — present', role:'DevOps Engineer', co:'PanApps Inc.', note:'CI/CD, observability and hardened infrastructure for production workloads.' },
  { when:'2021 — 2023', role:'System Administrator', co:'Leadership Domestic Workers Service Center', note:'Owned systems administration, uptime and security operations.' },
  { when:'2017 — 2018', role:'Linux System Administrator', co:'IPSR Solutions Ltd', note:'Administered RHEL/CentOS estates and core Linux services.' },
  { when:'2014 — 2017', role:'Network Administrator', co:'Ravis Agencies', note:'Managed networks, infrastructure and day-to-day operations.' },
];

const CERTS = [
  { abbr:'RHCSA', name:'Red Hat Certified System Administrator', by:'Red Hat', logo:'redhat', accent:'#EE0000' },
  { abbr:'RHCE',  name:'Red Hat Certified Engineer', by:'Red Hat', logo:'redhat', accent:'#EE0000' },
  { abbr:'CEH',   name:'Certified Ethical Hacker', by:'EC-Council', logo:'shield', accent:'#27E1C1' },
];

const ICONS = {
  mail:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3.5 6.5 12 13l8.5-6.5'/></svg>",
  gh:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><path d='M9 8 5 12l4 4'/><path d='M15 8l4 4-4 4'/></svg>",
  in:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='3.2'/><path d='M5 20a7 7 0 0 1 14 0'/></svg>",
  ph:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><path d='M6 3h3l1.6 5-2 1.4a12 12 0 0 0 6 6l1.4-2L21 18v3a2 2 0 0 1-2 2A16 16 0 0 1 3 7a2 2 0 0 1 2-2z'/></svg>",
};

/* ---------------- ENV ---------------- */
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = matchMedia('(max-width: 760px)').matches;
const isTouch = matchMedia('(hover: none)').matches;
const STATIC = prefersReduced;            // mobile now gets the full 3D world
const HYPER = 1.65;                        // default motion intensity
let cosmos = null;

/* ---------------- BUILD DOM ---------------- */
function buildDOM(){
  // skills — bold cards in a horizontal rail
  const sg = document.getElementById('skillgrid');
  sg.innerHTML = SKILLS.map((s,i)=>`
    <article class="skill-card" style="--card-accent:${s.c}">
      <div class="skill-card__top">
        <span class="skill-card__no">0${i+1}</span>
        <span class="skill-node"></span>
      </div>
      <h3>${s.t}</h3>
      <ul class="tags">${s.items.map(x=>`<li>${x}</li>`).join('')}</ul>
      <span class="skill-card__count">${s.items.length} tools</span>
    </article>`).join('');

  // projects
  const pg = document.getElementById('projgrid');
  pg.innerHTML = PROJECTS.map((p,i)=>`
    <article class="proj-card reveal" data-i="${i}" style="--pc:${p.color}">
      <div class="proj-card__media">
        <img src="assets/cover-${p.cover}.jpg" alt="${p.name} cover" loading="lazy" />
        <span class="proj-card__scan"></span>
        <span class="proj-card__cat">${p.kind}</span>
        <div class="proj-card__icon">${PROJECT_ICONS[p.icon]||''}</div>
      </div>
      <div class="proj-card__body">
        <span class="proj-card__idx">0${i+1}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <ul class="tags">${p.tags.slice(0,4).map(t=>`<li>${t}</li>`).join('')}</ul>
        <span class="proj-card__open">open module <i>→</i></span>
      </div>
    </article>`).join('');

  // timeline
  document.getElementById('timeline').innerHTML = EXPERIENCE.map(e=>`
    <li class="tl-item reveal"><span class="tl-dot"></span>
      <div class="tl-when">${e.when}</div>
      <div class="tl-role">${e.role}</div>
      <div class="tl-co"><b>${e.co}</b> — ${e.note}</div>
    </li>`).join('');

  // certs
  document.getElementById('badges').innerHTML = CERTS.map(c=>{
    const mark = c.logo==='redhat'
      ? `<div class="badge__mark badge__mark--rh"><img src="assets/redhat.webp" alt="Red Hat" /><span class="badge__halo"></span></div>`
      : `<div class="badge__mark badge__mark--shield"><svg viewBox="0 0 48 54" fill="none"><path d="M24 2 44 10v18c0 13-9 20-20 24C13 48 4 41 4 28V10z" stroke="#27E1C1" stroke-width="2"/><path d="M16 27l6 6 11-12" stroke="#27E1C1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="badge__halo badge__halo--cy"></span></div>`;
    return `<div class="badge reveal" style="--bc:${c.accent}">${mark}
      <div class="badge__meta"><span class="badge__abbr">${c.abbr}</span><h3>${c.name}</h3><p>${c.by}</p></div></div>`;
  }).join('');

  // icons (inline svg, currentColor)
  document.querySelectorAll('[data-i]').forEach(el=>{
    const k = el.dataset.i; if(!ICONS[k]) return;
    el.innerHTML = ICONS[k];
  });
}

/* ---------------- BOOT SEQUENCE ---------------- */
const BOOT_LINES = [
  '> booting command-cosmos v4.0 ...',
  '> mount /dev/core ............... <span class="ok">ok</span>',
  '> load particle field .......... <span class="ok">ok</span>',
  '> link ai-agent orbs ........... <span class="ok">ok</span>',
  '> arm security shields ......... <span class="ok">ok</span>',
  '> sync market-signal feed ...... <span class="ok">ok</span>',
  '> operator: <span class="ok">achu pradeep</span>',
  '> system ready.',
];
function runBoot(done){
  const log = document.getElementById('bootlog');
  const bar = document.getElementById('bootbar');
  const boot = document.getElementById('boot');
  document.body.classList.add('booting');
  let i = 0;
  const step = ()=>{
    if (i < BOOT_LINES.length){
      log.innerHTML += (i?'\n':'') + BOOT_LINES[i];
      bar.style.width = Math.round(((i+1)/BOOT_LINES.length)*100) + '%';
      i++;
      setTimeout(step, STATIC ? 90 : 150 + Math.random()*90);
    } else {
      setTimeout(finish, 420);
    }
  };
  let finished = false;
  function finish(){
    if (finished) return; finished = true;
    boot.classList.add('done');
    document.body.classList.remove('booting');
    setTimeout(()=>{ boot.remove(); }, 820);
    done();
  }
  document.getElementById('bootskip').addEventListener('click', finish);
  step();
}

/* ---------------- HERO TYPEWRITER ---------------- */
function heroTyper(){
  const el = document.getElementById('role-type');
  if (STATIC){ el.textContent = ROLES[0]; return; }
  let r = 0, ch = 0, deleting = false;
  function tick(){
    const word = ROLES[r];
    el.textContent = word.slice(0, ch);
    if (!deleting){
      ch++;
      if (ch > word.length){ deleting = true; return setTimeout(tick, 1500); }
    } else {
      ch--;
      if (ch < 0){ deleting = false; ch = 0; r = (r+1)%ROLES.length; }
    }
    setTimeout(tick, deleting ? 38 : 70);
  }
  tick();
}

/* ---------------- TERMINAL (contact) ---------------- */
let terminalDone = false;
function runTerminal(){
  if (terminalDone) return; terminalDone = true;
  const body = document.getElementById('terminalbody');
  const seq = [
    {c:'p', t:'achu@cosmos:~$ '}, {c:'o', t:'connect --to achu\n'},
    {c:'c', t:'[ ok ] '}, {c:'o', t:'opening secure channel...\n'},
    {c:'c', t:'  email    '}, {c:'o', t:'achupradeep3050@gmail.com\n'},
    {c:'c', t:'  github   '}, {c:'o', t:'github.com/achupradeep3050\n'},
    {c:'c', t:'  linkedin '}, {c:'o', t:'achu-pradeep-702667404\n'},
    {c:'c', t:'  phone    '}, {c:'o', t:'+91 70557 77055\n'},
    {c:'p', t:'> '}, {c:'o', t:'channel open. say hello.'},
  ];
  if (STATIC){ body.innerHTML = seq.map(s=>`<span class="${s.c}">${s.t}</span>`).join(''); return; }
  let si = 0, ci = 0;
  function tick(){
    if (si >= seq.length) return;
    const s = seq[si];
    if (ci === 0) body.innerHTML += `<span class="${s.c}"></span>`;
    const span = body.lastChild;
    span.textContent += s.t[ci]; ci++;
    if (ci >= s.t.length){ si++; ci = 0; }
    setTimeout(tick, 14);
  }
  tick();
}

/* ---------------- COUNTERS ---------------- */
function animCount(el){
  const to = +el.dataset.to, suf = el.dataset.suffix || '';
  if (STATIC){ el.textContent = to + suf; return; }
  let v = 0; const t0 = performance.now(), dur = 1100;
  function step(now){
    const p = Math.min((now-t0)/dur, 1);
    el.textContent = Math.round(to * (1-Math.pow(1-p,3))) + suf;
    if (p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------------- MODAL ---------------- */
let modalOpen = false;
function openModal(i){
  const p = PROJECTS[i]; if(!p) return;
  document.getElementById('modal-idx').textContent = `MODULE 0${i+1} · ${p.kind}`;
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.desc;
  document.getElementById('modal-tags').innerHTML = p.tags.map(t=>`<li>${t}</li>`).join('');
  const gh = document.getElementById('modal-gh');
  gh.href = `https://github.com/achupradeep3050/${p.repo}`;
  document.getElementById('modal-media').innerHTML =
    `<img class="modal-cover" src="assets/cover-${p.cover}.jpg" alt="${p.name} cover" />
     <span class="modal-cover__scan"></span>
     <div class="modal-orb" style="--pc:${p.color}"><span class="modal-orb__glow"></span><span class="modal-orb__icon">${PROJECT_ICONS[p.icon]||''}</span></div>
     <div class="viz-tag" style="position:absolute;bottom:14px;left:16px;z-index:3">module preview — drop a real demo capture (MP4 / WebM)</div>`;
  const m = document.getElementById('modal');
  m.classList.add('open'); m.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-lock');
  modalOpen = true;
  if (cosmos) cosmos.setHover(-1);
  document.getElementById('cosmos')?.classList.remove('interactive');
}
function closeModal(){
  const m = document.getElementById('modal');
  m.classList.remove('open'); m.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-lock');
  modalOpen = false;
  // restore canvas interactivity if still on projects
  document.getElementById('cosmos')?.classList.toggle('interactive', document.querySelector('.nav__links a.active')?.dataset.fly==='projects');
}

/* ---------------- SCROLL / NAV / OBSERVERS ---------------- */
function initScroll(){
  const nav = document.getElementById('nav');
  const sections = [...document.querySelectorAll('section[data-cam]')];
  const navLinks = [...document.querySelectorAll('.nav__links a')];

  // smooth scroll (Lenis) unless static
  let lenis = null;
  if (!STATIC && window.Lenis){
    lenis = new Lenis({ duration:1.2, smoothWheel:true });
    window.__lenis = lenis;
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  function scrollTo(target){
    const el = document.querySelector(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset:0 });
    else el.scrollIntoView({ behavior:'smooth' });
  }
  document.querySelectorAll('[data-fly]').forEach(a=>{
    a.addEventListener('click', e=>{ e.preventDefault(); scrollTo('#'+a.dataset.fly); closeMenu(); });
  });

  // nav scrolled state
  const onScroll = ()=>{ nav.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive:true }); onScroll();

  // active section → cosmos camera + nav highlight (scroll-driven, handles tall sections)
  let lastCam = null, lastId = null;
  function updateActive(){
    const mid = window.scrollY + window.innerHeight * 0.45;
    let cur = sections[0];
    for (const s of sections){ if (s.offsetTop <= mid) cur = s; }
    const id = cur.id, cam = cur.dataset.cam;
    if (id !== lastId){
      lastId = id;
      navLinks.forEach(l=>l.classList.toggle('active', l.dataset.fly===id));
      document.getElementById('cosmos')?.classList.toggle('interactive', id==='projects');
      if (id==='contact') runTerminal();
    }
    if (cam !== lastCam){ lastCam = cam; if (cosmos) cosmos.flyTo(cam); }
  }
  window.addEventListener('scroll', updateActive, { passive:true });
  if (lenis) lenis.on('scroll', updateActive);
  updateActive();

  // reveal + counters + timeline
  const revIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (en.isIntersecting){
        en.target.classList.add('in');
        en.target.querySelectorAll?.('.count').forEach(animCount);
        if (en.target.classList.contains('count')) animCount(en.target);
        revIO.unobserve(en.target);
      }
    });
  }, { threshold:0.25, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el=>revIO.observe(el));
  document.querySelectorAll('.count').forEach(el=>revIO.observe(el));

  // timeline ignite
  const tlIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if (en.isIntersecting) en.target.classList.add('lit'); });
  }, { threshold:0.5 });
  document.querySelectorAll('.tl-item').forEach(el=>tlIO.observe(el));
}

/* ---------------- SKILLS HORIZONTAL RAIL ---------------- */
function initSkillsRail(){
  const section = document.getElementById('skills');
  const rail = document.getElementById('skillgrid');
  const bar = document.getElementById('skillbar');
  if (!section || !rail) return;

  let enabled = !STATIC;
  function dist(){ return Math.max(0, rail.scrollWidth - rail.clientWidth); }
  function onScroll(){
    if (!enabled) return;
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    rail.style.transform = `translate3d(${(-p*dist()).toFixed(1)}px,0,0)`;
    if (bar) bar.style.width = (p*100).toFixed(1) + '%';
  }
  function syncMode(){
    enabled = !STATIC;
    rail.classList.toggle('rail-on', enabled);
    if (!enabled){ rail.style.transform = ''; }
    else onScroll();
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  if (window.__lenis) window.__lenis.on('scroll', onScroll);
  window.addEventListener('resize', syncMode);
  syncMode();
}

/* ---------------- MENU ---------------- */
function closeMenu(){ document.getElementById('nav').classList.remove('open'); }
function initMenu(){
  const btn = document.getElementById('navmenu');
  btn?.addEventListener('click', ()=> document.getElementById('nav').classList.toggle('open'));
}

/* ---------------- POINTER FX + CONSTELLATION ---------------- */
function initPointer(){
  const light = document.getElementById('cursor-light');
  const tip = document.createElement('div'); tip.className='planet-tip'; document.body.appendChild(tip);
  Object.assign(tip.style,{position:'fixed',zIndex:'40',pointerEvents:'none',font:'500 0.78rem var(--mono)',color:'#fff',background:'rgba(8,13,26,0.9)',border:'1px solid var(--accent)',padding:'7px 12px',borderRadius:'8px',transform:'translate(-50%,-150%)',opacity:'0',transition:'opacity .2s',whiteSpace:'nowrap',letterSpacing:'.03em'});

  window.addEventListener('pointermove', e=>{
    light.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    light.style.opacity = '1';
    if (cosmos && !modalOpen){
      cosmos.setMouse((e.clientX/window.innerWidth)*2-1, -((e.clientY/window.innerHeight)*2-1));
      const hit = cosmos.pick(e.clientX, e.clientY);
      cosmos.setHover(hit);
      if (hit >= 0){
        document.body.style.cursor='pointer';
        tip.textContent = PROJECTS[hit].name;
        tip.style.left = e.clientX+'px'; tip.style.top = e.clientY+'px'; tip.style.opacity='1';
      } else { document.body.style.cursor=''; tip.style.opacity='0'; }
    } else if (modalOpen){ tip.style.opacity='0'; document.body.style.cursor=''; }
  }, { passive:true });

  window.addEventListener('click', e=>{
    // never let a 3D pick fire while the modal is open or when clicking UI chrome
    if (modalOpen || e.target.closest('.modal, .nav, .proj-card, a, button')) return;
    if (cosmos){ const hit = cosmos.pick(e.clientX, e.clientY); if (hit>=0){ openModal(hit); } }
  });

  // magnetic buttons
  if (!STATIC) document.querySelectorAll('.magnetic').forEach(b=>{
    b.addEventListener('pointermove', e=>{
      const r=b.getBoundingClientRect();
      b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.25}px, ${(e.clientY-r.top-r.height/2)*0.35}px)`;
    });
    b.addEventListener('pointerleave', ()=> b.style.transform='');
  });
}

/* ---------------- INTERACTIONS (cards, modal) ---------------- */
function initCards(){
  document.querySelectorAll('.proj-card').forEach(card=>{
    const i = +card.dataset.i;
    card.addEventListener('click', ()=> openModal(i));
    card.addEventListener('mouseenter', ()=> cosmos && cosmos.setHover(i));
    card.addEventListener('mouseleave', ()=> cosmos && cosmos.setHover(-1));
  });
  document.querySelectorAll('[data-close]').forEach(el=> el.addEventListener('click', closeModal));
  window.addEventListener('keydown', e=>{ if (e.key==='Escape') closeModal(); });
}

/* ---------------- THEME DEFAULTS (no UI) ---------------- */
function applyDefaults(){
  // fusion accent (bright-gold core + cyan secondary) as default
  document.documentElement.style.setProperty('--accent', '#FFCB45');
  document.documentElement.style.setProperty('--accent-2', '#27E1C1');
  if (cosmos){ cosmos.setAccent('#FFCB45'); cosmos.setMotion(HYPER); }
}

/* ---------------- INIT ---------------- */
function init(){
  buildDOM();

  if (STATIC){
    document.body.classList.add('static-mode');
  } else {
    try {
      cosmos = createCosmos(document.getElementById('cosmos'), PROJECTS, { density: isSmall?0.55:1, motion:HYPER, chartUrl:'assets/trading-chart.jpg', mobile:isSmall });
      window.__cosmos = cosmos;
    } catch(err){
      console.warn('WebGL init failed, falling back to static', err);
      document.body.classList.add('static-mode');
    }
  }

  initScroll();
  initMenu();
  initCards();
  initPointer();
  initSkillsRail();
  applyDefaults();
  if (STATIC) heroTyper();
}

window.addEventListener('DOMContentLoaded', ()=>{
  runBoot(()=>{
    if (cosmos){ cosmos.start(); cosmos.flyTo('hero'); }
    heroTyper();
  });
  init();
  if (cosmos) cosmos.start();
  // pause render when tab hidden (perf / battery)
  document.addEventListener('visibilitychange', ()=>{
    if (!cosmos) return;
    if (document.hidden) cosmos.stop(); else cosmos.start();
  });
});
