// ============================================================
//  app.js — orchestration: data · boot · scroll · interactions
// ============================================================
import { createCosmos } from './cosmos.js';

/* ---------------- DATA ---------------- */
const ROLES = ['Linux DevOps Engineer', 'AI-Agent Developer', 'Algorithmic-Trading Systems Builder'];

const SKILLS = [
  { t:'Linux & Systems',  c:'#7FB8FF', items:['RHEL','CentOS','Fedora','Kali','systemd','SELinux','LVM','kernel tuning'] },
  { t:'Containers & CI/CD',c:'#DCE7F5', items:['Docker','Jenkins','Git','blue-green deploy'] },
  { t:'Cloud',            c:'#7FB8FF', items:['AWS EC2','S3','IAM'] },
  { t:'Observability',    c:'#DCE7F5', items:['Prometheus','Grafana','Loki','Zabbix','alerting','incident response'] },
  { t:'Security / SOC',   c:'#4D9FFF', items:['Wazuh SIEM','OpenVAS / GVM','ClamAV','ModSecurity','fail2ban','RBAC'] },
  { t:'AI / Agents',      c:'#DCE7F5', items:['Python','CrewAI','tool-use','Claude Code','Cursor','Copilot'] },
  { t:'App / Data',       c:'#7FB8FF', items:['FastAPI','React','MySQL / MariaDB','Redis'] },
  { t:'Trading Tech',     c:'#4D9FFF', items:['Pine Script v5','TradingView','SMC / ICT','FVG','EMA / SMA','OANDA','MetaTrader 5'] },
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
  { name:'Hermes-USB-Portable', kind:'PORTABLE AGENT', icon:'usb', color:'#6FB5FF', cover:'hermes', repo:'Hermes-USB-Portable',
    desc:'A portable AI agent that runs from a USB stick on Windows, macOS and Linux with zero host installs — multi-provider model switching plus a guardrailed CLI (dry-run + audit).',
    tags:['Python','Multi-provider','Guardrailed CLI','Cross-platform'] },
  { name:'jobmind-agent', kind:'MULTI-AGENT', icon:'agent', color:'#A9C9EE', cover:'jobmind', repo:'jobmind-agent',
    desc:'A CrewAI multi-agent job-application pipeline — scrape → score → tailor → generate — wrapped in a Streamlit UI.',
    tags:['CrewAI','Multi-agent','Streamlit','Python'] },
  { name:'VA-Opensource-Audit', kind:'SOC / SECURITY', icon:'shield', color:'#7DD3FF', cover:'vaaudit', repo:'VA-Opensource-Audit',
    desc:'A self-hosted SOC dashboard for agentless vulnerability auditing (OpenVAS / GVM + ClamAV) across Linux servers, with JWT + TOTP access control.',
    tags:['OpenVAS / GVM','ClamAV','JWT + TOTP','SOC'] },
  { name:'xauusd-fvg-algo', kind:'GOLD TRADING', icon:'candle', color:'#CFE3FA', cover:'xauusd', repo:'xauusd-fvg-algo',
    desc:'A 24/7 multi-broker automated gold (XAUUSD) trading system — FastAPI + React dashboard with Telegram alerts.',
    tags:['FastAPI','React','FVG','Telegram','Multi-broker'] },
  { name:'sma_cross_scalp_bot', kind:'FOREX SCALPER', icon:'bolt', color:'#8FA3BD', cover:'sma', repo:'sma_cross_scalp_bot',
    desc:'A 24/7 forex / CFD scalping bot — FastAPI + React + MariaDB with automated risk controls.',
    tags:['FastAPI','React','MariaDB','Risk controls'] },
  { name:'OBStat', kind:'MARKET ANALYTICS', icon:'chart', color:'#BFD9F2', cover:'obstat', repo:'OBStat',
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
  { abbr:'CEH',   name:'Certified Ethical Hacker', by:'EC-Council', logo:'shield', accent:'#DCE7F5' },
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
      : `<div class="badge__mark badge__mark--shield"><svg viewBox="0 0 48 54" fill="none"><path d="M24 2 44 10v18c0 13-9 20-20 24C13 48 4 41 4 28V10z" stroke="#DCE7F5" stroke-width="2"/><path d="M16 27l6 6 11-12" stroke="#DCE7F5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="badge__halo badge__halo--cy"></span></div>`;
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

/* ---------------- NAV ROLE TYPEWRITER ---------------- */
function navTyper(){
  const el = document.getElementById('navRole');
  if (!el || el.dataset.on) return;
  el.dataset.on = '1';
  const words = [ROLES[1], ROLES[2], ROLES[0]];   // lead with AI-Agent Developer
  if (STATIC){ el.textContent = words[0]; return; }
  let r = 0, ch = 0, deleting = false;
  function tick(){
    const word = words[r];
    el.textContent = word.slice(0, ch);
    if (!deleting){
      ch++;
      if (ch > word.length){ deleting = true; return setTimeout(tick, 2100); }
    } else {
      ch--;
      if (ch < 0){ deleting = false; ch = 0; r = (r+1)%words.length; return setTimeout(tick, 380); }
    }
    setTimeout(tick, deleting ? 32 : 62);
  }
  tick();
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
    lenis = new Lenis({ duration:1.45, smoothWheel:true, easing: t => 1 - Math.pow(1 - t, 4) });
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

  // reveal + counters + timeline (staggered for smoother rhythm)
  const revIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (en.isIntersecting){
        const el = en.target;
        const sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(Math.max(sib,0)*70, 420) + 'ms';
        el.classList.add('in');
        el.addEventListener('transitionend', ()=>{ el.style.transitionDelay=''; }, { once:true });
        el.querySelectorAll?.('.count').forEach(animCount);
        if (el.classList.contains('count')) animCount(el);
        revIO.unobserve(el);
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
  let railDist = 0, secTop = 0, secTotal = 1;          // cached layout (no per-scroll reflow)
  let lastX = null, lastBar = null;
  function remeasure(){
    railDist = Math.max(0, rail.scrollWidth - rail.clientWidth);
    secTop = section.offsetTop;
    secTotal = Math.max(1, section.offsetHeight - window.innerHeight);
  }
  function onScroll(){
    if (!enabled) return;
    const p = Math.min(1, Math.max(0, (window.scrollY - secTop) / secTotal));
    const x = (-p * railDist).toFixed(1);
    if (x !== lastX){ rail.style.transform = `translate3d(${x}px,0,0)`; lastX = x; }
    if (bar){ const w = (p*100).toFixed(1) + '%'; if (w !== lastBar){ bar.style.width = w; lastBar = w; } }
  }
  function syncMode(){
    enabled = !STATIC;
    rail.classList.toggle('rail-on', enabled);
    remeasure();
    if (!enabled){ rail.style.transform = ''; lastX = null; }
    else onScroll();
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  if (window.__lenis) window.__lenis.on('scroll', onScroll);
  window.addEventListener('resize', syncMode);
  // re-measure once everything (fonts/images) has settled
  window.addEventListener('load', remeasure);
  setTimeout(remeasure, 1200);
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

/* ---------------- ANIMATED AI PORTRAIT (scroll-driven) ---------------- */
let setPortraitFrame = null;
function initPortrait(){
  const frame = document.getElementById('pframe'); if (!frame) return;
  const imgs = [...frame.querySelectorAll('.pframe__img')];
  const fno = document.getElementById('pfno');
  const tc = document.getElementById('ptc');
  let cur = 0, tmr = null;
  imgs[0].classList.add('active');

  // glitch-cut to a given frame; safe under rapid scroll scrubbing
  setPortraitFrame = (idx)=>{
    if (idx === cur || !imgs[idx]) return;
    if (tmr){
      clearTimeout(tmr); tmr = null;
      imgs.forEach((im,k)=>{ if (k!==cur) im.classList.remove('active'); im.classList.remove('in'); });
      frame.classList.remove('glitching');
    }
    cur = idx;
    const next = imgs[cur];
    next.classList.add('active','in');
    frame.classList.add('glitching');
    if (fno) fno.textContent = `FRM 0${cur+1}/0${imgs.length}`;
    tmr = setTimeout(()=>{
      tmr = null;
      imgs.forEach((im,k)=>{ if (k!==cur) im.classList.remove('active'); });
      next.classList.remove('in');
      frame.classList.remove('glitching');
    }, 640);
  };

  if (STATIC || imgs.length < 2) return;   // reduced motion: hold first frame

  // running timecode (25fps style)
  let f = 0;
  setInterval(()=>{
    f++;
    const ff = String(f % 25).padStart(2,'0');
    const ss = String(Math.floor(f/25) % 60).padStart(2,'0');
    const mm = String(Math.floor(f/1500) % 60).padStart(2,'0');
    if (tc) tc.textContent = `00:${mm}:${ss}:${ff}`;
  }, 40);

  // cinematic 3D tilt
  frame.addEventListener('pointermove', e=>{
    const r = frame.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    frame.style.transform = `rotateY(${(x*7).toFixed(2)}deg) rotateX(${(-y*7).toFixed(2)}deg)`;
  });
  frame.addEventListener('pointerleave', ()=>{ frame.style.transform = ''; });
}

/* ---------------- SCROLL-SCRUBBED 3D NAME FLIGHT ---------------- */
function initNameFlight(){
  const fly = document.getElementById('flyName');
  const navSlot = document.getElementById('navName');
  const heroSlot = document.querySelector('#heroNameSlot .slot-ghost');
  const dock = document.getElementById('nameDock');
  const about = document.getElementById('about');
  if (!fly || !navSlot || !heroSlot || !dock || !about) return;
  if (STATIC) return;                       // reduced motion: static headline

  document.body.classList.add('name-flying');
  const inner = fly.querySelector('.fly-name__inner');
  const persp = document.querySelector('.portrait-persp');

  let baseW = 1, baseH = 1;
  function measure(){
    fly.style.transform = 'none'; inner.style.transform = 'none';
    const r = inner.getBoundingClientRect();
    baseW = r.width || 1; baseH = r.height || 1;
    // reserve dock height to fit the docked name
    dock.style.height = Math.ceil(dock.clientWidth / baseW * baseH) + 'px';
  }
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener('resize', measure);

  const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
  const smooth = t=>t*t*(3-2*t);
  const R = el=>{ const r = el.getBoundingClientRect(); return { x:r.left, y:r.top, w:r.width }; };
  const cur = { x:0, y:0, s:1, rx:0, rz:0, b:0, nav:0 };
  let primed = false, lastPP = -1, lastNavT = -1;

  function loop(){
    const vh = window.innerHeight;
    const aboutTop = about.getBoundingClientRect().top;
    const p1 = clamp(window.scrollY / (vh*0.45), 0, 1);                 // nav -> hero fall (page pinned)
    const p2 = clamp((vh*0.60 - aboutTop) / (vh*0.48), 0, 1);           // hero -> dock fall

    let from, to, p, drama;
    if (p2 > 0){ from = R(heroSlot); to = R(dock); p = p2; drama = 1; }
    else { from = R(navSlot); to = R(heroSlot); p = p1; drama = 0.55; }
    const e = smooth(p);
    const arc = Math.sin(Math.PI * e);

    const sF = from.w / baseW, sT = to.w / baseW;
    const t = {
      x: from.x + (to.x - from.x) * e,
      y: from.y + (to.y - from.y) * e + arc * 26 * drama,               // gravity arc
      s: sF + (sT - sF) * e,
      rx: -150 * arc * drama,                                           // 3D tumble
      rz: -12 * arc * drama,
      b: 5 * arc * drama,                                               // motion blur
    };

    if (!primed){ Object.assign(cur, t); primed = true; }
    const k = 0.16;                                                      // cinematic damping
    cur.x += (t.x-cur.x)*k; cur.y += (t.y-cur.y)*k; cur.s += (t.s-cur.s)*k;
    cur.rx += (t.rx-cur.rx)*k; cur.rz += (t.rz-cur.rz)*k; cur.b += (t.b-cur.b)*k;

    fly.style.transform = `translate3d(${cur.x.toFixed(2)}px,${cur.y.toFixed(2)}px,0) scale(${cur.s.toFixed(4)})`;
    inner.style.transform = `perspective(900px) rotateX(${cur.rx.toFixed(2)}deg) rotate(${cur.rz.toFixed(2)}deg)`;
    inner.style.filter = cur.b > 0.2 ? `blur(${cur.b.toFixed(2)}px)` : '';
    fly.style.zIndex = (p2 >= 0.985) ? '5' : '60';                       // docked name slides under nav
    fly.style.visibility = (cur.y < -baseH*cur.s - 120 || cur.y > vh + 240) ? 'hidden' : 'visible';
    const dockY = (p2 > 0) ? to.y : dock.getBoundingClientRect().top;
    const navTarget = (dockY < -20) ? 1 : 0;                            // name returns home past About
    if (navTarget !== lastNavT){
      lastNavT = navTarget;
      if (navTarget === 1){                                              // gesture: name lands back in the header
        navSlot.classList.remove('returning');
        void navSlot.offsetWidth;                                        // restart animation
        navSlot.classList.add('returning');
      } else {
        navSlot.classList.remove('returning');
      }
    }
    cur.nav += (navTarget - cur.nav) * 0.10;
    navSlot.style.opacity = (cur.nav < 0.005) ? '0' : (cur.nav > 0.995 ? '1' : cur.nav.toFixed(3));

    // --- scroll-driven portrait effects (reversible) ---
    const pp = clamp((vh*0.96 - aboutTop) / (vh*1.0), 0, 1);
    if (setPortraitFrame && Math.abs(pp - lastPP) > 0.001){
      lastPP = pp;
      setPortraitFrame(pp < 0.34 ? 0 : pp < 0.67 ? 1 : 2);
    }
    if (persp){
      const py = ((0.5-pp)*34).toFixed(1);
      if (py !== loop._lastPy){ persp.style.transform = `translateY(${py}px)`; loop._lastPy = py; }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ---------------- THEME ENGINE (auto-rotates every 60s) ---------------- */
const THEMES = [
  { name:'Midnight',
    vars:{ bg:'#0A0D12', bg2:'#0E1218', navy:'#131A24', panel:'rgba(19,26,36,0.55)', panelLine:'rgba(77,159,255,0.16)', line:'rgba(234,240,255,0.08)',
      gold:'#4D9FFF', goldBr:'#7FB8FF', cyan:'#DCE7F5', ink:'#EAF0FF', inkSoft:'#AAB3C8', inkMute:'#66708A',
      nameA:'#FFFFFF', nameB:'#C9D3EC', vignette:'rgba(0,0,0,0.55)', onAccent:'#0A0D12' },
    cosmos:{ accent:'#4D9FFF', accentBr:'#7FB8FF', accent2:'#DCE7F5', stars:'#BFD0FF', fog:'#0A0D12', bloom:0.42, light:false } },
  { name:'Arctic',
    vars:{ bg:'#0B0D10', bg2:'#101317', navy:'#181C22', panel:'rgba(24,28,34,0.55)', panelLine:'rgba(232,238,246,0.20)', line:'rgba(232,238,246,0.10)',
      gold:'#E8EEF6', goldBr:'#FFFFFF', cyan:'#9AA8BC', ink:'#F2F5FA', inkSoft:'#B6BFCC', inkMute:'#6F7886',
      nameA:'#FFFFFF', nameB:'#C9D2DE', vignette:'rgba(0,0,0,0.55)', onAccent:'#0B0D10' },
    cosmos:{ accent:'#E8EEF6', accentBr:'#FFFFFF', accent2:'#9AA8BC', stars:'#D5DEEA', fog:'#0B0D10', bloom:0.34, light:false } },
  { name:'Crimson',
    vars:{ bg:'#0F090C', bg2:'#140C10', navy:'#1D1117', panel:'rgba(29,17,23,0.55)', panelLine:'rgba(255,77,94,0.20)', line:'rgba(255,235,238,0.09)',
      gold:'#FF4D5E', goldBr:'#FF7585', cyan:'#FFB35C', ink:'#FAEDEF', inkSoft:'#C5A9B0', inkMute:'#82686F',
      nameA:'#FFFFFF', nameB:'#EBC9D0', vignette:'rgba(0,0,0,0.55)', onAccent:'#FFF7F7' },
    cosmos:{ accent:'#FF4D5E', accentBr:'#FF7585', accent2:'#FFB35C', stars:'#E2BFC9', fog:'#0F090C', bloom:0.40, light:false } },
  { name:'Nebula',
    vars:{ bg:'#0C0A14', bg2:'#100D1B', navy:'#171228', panel:'rgba(23,18,40,0.55)', panelLine:'rgba(157,123,255,0.20)', line:'rgba(235,230,250,0.09)',
      gold:'#9D7BFF', goldBr:'#B79CFF', cyan:'#5BD8C8', ink:'#EFEAFB', inkSoft:'#B0A8C6', inkMute:'#6E6890',
      nameA:'#FFFFFF', nameB:'#D2C8EA', vignette:'rgba(0,0,0,0.55)', onAccent:'#140B26' },
    cosmos:{ accent:'#9D7BFF', accentBr:'#B79CFF', accent2:'#5BD8C8', stars:'#CCC2EE', fog:'#0C0A14', bloom:0.42, light:false } },
];

function parseColor(s){
  s = s.trim();
  if (s[0] === '#'){
    const h = s.slice(1);
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16), 1];
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  const p = m[1].split(',').map(Number);
  return [p[0], p[1], p[2], p[3] == null ? 1 : p[3]];
}
const fmtC = c => `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${(+c[3]).toFixed(3)})`;
const parseTheme = t => { const o = {}; for (const k in t.vars) o[k] = parseColor(t.vars[k]); return o; };

function applyTokens(o){
  const set = (k,v)=>document.documentElement.style.setProperty(k,v);
  set('--bg', fmtC(o.bg));        set('--bg-2', fmtC(o.bg2));       set('--navy', fmtC(o.navy));
  set('--panel', fmtC(o.panel));  set('--panel-line', fmtC(o.panelLine)); set('--line', fmtC(o.line));
  set('--gold', fmtC(o.gold));    set('--gold-br', fmtC(o.goldBr)); set('--cyan', fmtC(o.cyan));
  set('--ink', fmtC(o.ink));      set('--ink-soft', fmtC(o.inkSoft)); set('--ink-mute', fmtC(o.inkMute));
  set('--accent', fmtC(o.gold));  set('--accent-2', fmtC(o.cyan));
  set('--name-a', fmtC(o.nameA)); set('--name-b', fmtC(o.nameB));
  set('--vignette', fmtC(o.vignette)); set('--on-accent', fmtC(o.onAccent));
  set('--accent-rgb',  `${o.gold[0]|0},${o.gold[1]|0},${o.gold[2]|0}`);
  set('--accent2-rgb', `${o.cyan[0]|0},${o.cyan[1]|0},${o.cyan[2]|0}`);
  set('--bg-rgb',      `${o.bg[0]|0},${o.bg[1]|0},${o.bg[2]|0}`);
  set('--ink-rgb',     `${o.ink[0]|0},${o.ink[1]|0},${o.ink[2]|0}`);
  set('--glow-gold', `0 0 28px rgba(${o.gold[0]|0},${o.gold[1]|0},${o.gold[2]|0},0.35)`);
  set('--glow-cyan', `0 0 28px rgba(${o.cyan[0]|0},${o.cyan[1]|0},${o.cyan[2]|0},0.30)`);
}

let themeIdx = 0, themeAnim = null;
function setTheme(idx){
  const target = parseTheme(THEMES[idx]);
  const fromIdx = themeIdx;
  themeIdx = idx;
  if (cosmos) cosmos.setThemeTarget(THEMES[idx].cosmos);
  document.body.dataset.theme = THEMES[idx].name.toLowerCase();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = THEMES[idx].vars.bg;
  if (STATIC){ applyTokens(target); return; }          // reduced motion: instant
  const from = themeAnim ? themeAnim.snapshot() : parseTheme(THEMES[fromIdx]);
  if (themeAnim) cancelAnimationFrame(themeAnim.raf);
  const t0 = performance.now(), dur = 3400;
  const state = { raf:0, cur:from, snapshot(){ return JSON.parse(JSON.stringify(state.cur)); } };
  function step(now){
    const p = Math.min((now - t0)/dur, 1);
    const e = p*p*(3-2*p);                              // smoothstep — gentle in/out
    const mixed = {};
    for (const k in target){
      mixed[k] = from[k].map((v,i)=> v + (target[k][i]-v)*e);
    }
    state.cur = mixed;
    applyTokens(mixed);
    if (p < 1) state.raf = requestAnimationFrame(step);
    else themeAnim = null;
  }
  themeAnim = state;
  state.raf = requestAnimationFrame(step);
}

function initThemes(){
  let start = 0;
  try { const saved = parseInt(localStorage.getItem('cc-theme-idx'), 10); if (saved >= 0 && saved < THEMES.length) start = saved; } catch(e){}
  themeIdx = start;
  applyTokens(parseTheme(THEMES[start]));
  document.body.dataset.theme = THEMES[start].name.toLowerCase();
  if (cosmos) cosmos.setThemeTarget(THEMES[start].cosmos);
  window.__setTheme = setTheme;                          // debug / verification hook
  setInterval(()=>{
    const next = (themeIdx + 1) % THEMES.length;
    setTheme(next);
    try { localStorage.setItem('cc-theme-idx', String(next)); } catch(e){}
  }, 15000);
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
  initPortrait();
  initNameFlight();
  initThemes();
  if (cosmos) cosmos.setMotion(HYPER);
  if (STATIC){ heroTyper(); navTyper(); }
}

window.addEventListener('DOMContentLoaded', ()=>{
  runBoot(()=>{
    if (cosmos){ cosmos.start(); cosmos.flyTo('hero'); }
    heroTyper();
    navTyper();
  });
  init();
  if (cosmos) cosmos.start();
  // pause render when tab hidden (perf / battery)
  document.addEventListener('visibilitychange', ()=>{
    if (!cosmos) return;
    if (document.hidden) cosmos.stop(); else cosmos.start();
  });
});
