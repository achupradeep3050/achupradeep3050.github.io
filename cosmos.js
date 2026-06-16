// ============================================================
//  cosmos.js — the persistent 3D "Command Cosmos"
//  core · particle dust · orbit rings · project constellation
//  candlestick field · scroll-driven camera · bloom
// ============================================================
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const GOLD = 0xF5B301, GOLD_BR = 0xFFCB45, CYAN = 0x27E1C1;
const lerp = (a, b, t) => a + (b - a) * t;

// camera keyframes per section ---------------------------------
const CAM = {
  hero:       { pos:[0, 0.1, 10],   look:[-1.15, 0.05, 0] },
  about:      { pos:[2.4, 0.5, 8.4], look:[0.6, 0.1, 0] },
  skills:     { pos:[0, 0.6, 12.5], look:[0, 0, 0] },
  projects:   { pos:[0, 0.4, 9.3],  look:[0, 0.4, 0] },
  trading:    { pos:[0, -0.15, 6.4], look:[0, -0.45, -3.2] },
  experience: { pos:[-2.2, 0.4, 9.5], look:[-0.5, 0, 0] },
  contact:    { pos:[0, 0, 11],     look:[0, 0, 0] },
};

const PLANET_POS = [
  [-3.4, 1.7, 0.3], [0.1, 2.2, -0.7], [3.4, 1.5, 0.2],
  [-2.6, -0.7, 0.6], [0.7, -1.4, -0.3], [3.1, -0.8, 0.5],
];

export function createCosmos(canvas, projects, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance', preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050A14, 0.034);

  const camera = new THREE.PerspectiveCamera(52, window.innerWidth/window.innerHeight, 0.1, 200);
  camera.fov = (window.innerWidth < 760 || window.innerHeight > window.innerWidth) ? 64 : 52;
  camera.updateProjectionMatrix();

  scene.add(new THREE.AmbientLight(0x223355, 0.55));
  const key = new THREE.PointLight(GOLD, 1.6, 60); key.position.set(4, 5, 6); scene.add(key);
  const fill = new THREE.PointLight(CYAN, 1.0, 60); fill.position.set(-6, -3, 4); scene.add(fill);

  // ---------- starfield ----------
  function makeStars(count, spread, size, color, op){
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count*3);
    for (let i=0;i<count*3;i++) pos[i] = (Math.random()-0.5)*spread;
    g.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const m = new THREE.PointsMaterial({ size, color, map:DOT, alphaTest:0.02, transparent:true, opacity:op, depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true });
    return new THREE.Points(g, m);
  }
  let density = opts.density ?? 1;
  const DOT = radialTex(0xffffff);
  const stars = makeStars(Math.floor(1700*density), 90, 0.15, 0xbfd0ff, 0.7); scene.add(stars);
  const dustGold = makeStars(Math.floor(420*density), 34, 0.10, GOLD_BR, 0.55); scene.add(dustGold);
  const dustCyan = makeStars(Math.floor(360*density), 30, 0.09, CYAN, 0.5); scene.add(dustCyan);

  // ---------- the CORE ----------
  const core = new THREE.Group(); scene.add(core);
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.05, 1),
    new THREE.MeshBasicMaterial({ color:GOLD, wireframe:true, transparent:true, opacity:0.42 })
  );
  core.add(wire);
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 1),
    new THREE.MeshStandardMaterial({ color:0x0a1326, emissive:GOLD, emissiveIntensity:0.34, metalness:0.6, roughness:0.34, flatShading:true, transparent:true, opacity:0.92 })
  );
  core.add(shell);
  const innerGlow = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.58, 2),
    new THREE.MeshBasicMaterial({ color:GOLD_BR, transparent:true, opacity:0.62 })
  );
  core.add(innerGlow);
  // halo sprite
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map:radialTex(GOLD_BR), transparent:true, opacity:0.16, blending:THREE.AdditiveBlending, depthWrite:false }));
  halo.scale.set(4.4,4.4,1); core.add(halo);

  // ---------- orbit rings (skills) ----------
  const rings = new THREE.Group(); scene.add(rings);
  const ringDefs = [ [3.1, 0.018, CYAN, 0.38], [3.9, 0.016, GOLD, 0.3], [4.7, 0.014, CYAN, 0.24] ];
  ringDefs.forEach(([r, tube, col, op], i)=>{
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 8, 140), new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:op }));
    ring.rotation.x = 1.2 + i*0.35; ring.rotation.y = i*0.5;
    ring.userData.spin = 0.06 - i*0.015;
    rings.add(ring);
    // node beads on ring
    const beads = 5 + i;
    for (let b=0;b<beads;b++){
      const a = (b/beads)*Math.PI*2;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.07,12,12), new THREE.MeshBasicMaterial({ color:col }));
      const v = new THREE.Vector3(Math.cos(a)*r, Math.sin(a)*r, 0).applyEuler(ring.rotation);
      node.position.copy(v); rings.add(node);
    }
  });

  // ---------- project constellation ----------
  const planets = new THREE.Group(); scene.add(planets);
  const planetMeshes = [];
  projects.forEach((p, i)=>{
    const grp = new THREE.Group();
    grp.position.set(...PLANET_POS[i]);
    const col = new THREE.Color(p.color);
    const body = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 4),
      new THREE.MeshStandardMaterial({ color:0x070c18, emissive:col, emissiveIntensity:0.65, metalness:0.7, roughness:0.35, flatShading:false })
    );
    const wireO = new THREE.Mesh(new THREE.IcosahedronGeometry(0.66, 1), new THREE.MeshBasicMaterial({ color:col, wireframe:true, transparent:true, opacity:0.4 }));
    const g2 = new THREE.Sprite(new THREE.SpriteMaterial({ map:radialTex(p.color), transparent:true, opacity:0.5, blending:THREE.AdditiveBlending, depthWrite:false }));
    g2.scale.set(2.6,2.6,1);
    grp.add(body, wireO, g2);
    if (i % 2 === 0){
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.01, 8, 80), new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:0.5 }));
      ring.rotation.x = 1.1; grp.add(ring);
    }
    grp.userData = { i, body, wireO, glow:g2, baseEmissive:0.65, hover:0, float:Math.random()*Math.PI*2 };
    planets.add(grp); planetMeshes.push(grp);
  });

  // ---------- trading candlestick field ----------
  const trading = new THREE.Group(); scene.add(trading); trading.visible = false; planets.visible = false;
  trading.position.set(0, -0.35, -1.8);

  // real chart texture on a floating 3D plane (back layer)
  let chartPlane = null;
  if (opts.chartUrl){
    new THREE.TextureLoader().load(opts.chartUrl, tex=>{
      tex.colorSpace = THREE.SRGBColorSpace;
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(13, 7.3),
        new THREE.MeshBasicMaterial({ map:tex, transparent:true, opacity:0.0, depthWrite:false })
      );
      plane.position.set(0, 0.6, -1.6); trading.add(plane); chartPlane = plane;
      // subtle reflected echo
      const echo = new THREE.Mesh(new THREE.PlaneGeometry(13,7.3), new THREE.MeshBasicMaterial({ map:tex, transparent:true, opacity:0.0, depthWrite:false, blending:THREE.AdditiveBlending }));
      echo.position.set(0, 0.6, -2.4); echo.scale.set(1.15,1.15,1); trading.add(echo); chartPlane.userData.echo = echo;
    });
  }
  const candleData = [];
  let prev = 0;
  for (let i=0;i<26;i++){
    const up = Math.random() > 0.45;
    const h = 0.25 + Math.random()*0.9;
    const x = (i - 13) * 0.42;
    const yBase = prev + (Math.random()-0.5)*0.5;
    const col = up ? CYAN : GOLD;
    const candle = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.18), new THREE.MeshStandardMaterial({ color:0x0a1326, emissive:col, emissiveIntensity:0, metalness:0.5, roughness:0.4 }));
    candle.position.set(x, yBase + h/2, 0);
    const wickH = h + 0.3 + Math.random()*0.3;
    const wick = new THREE.Mesh(new THREE.BoxGeometry(0.02, wickH, 0.02), new THREE.MeshBasicMaterial({ color:col, transparent:true, opacity:0 }));
    wick.position.set(x, yBase + h/2, 0);
    trading.add(candle, wick);
    candleData.push({ candle, wick, phase:Math.random()*Math.PI*2, baseY:yBase + h/2, glow:0.28 + Math.random()*0.1 });
    prev = yBase;
  }
  // FVG bands
  const fvgBands = [];
  [[0.9, CYAN],[ -1.1, GOLD]].forEach(([y,c])=>{
    const band = new THREE.Mesh(new THREE.PlaneGeometry(11, 0.5), new THREE.MeshBasicMaterial({ color:c, transparent:true, opacity:0, side:THREE.DoubleSide }));
    band.position.set(0, y, -0.2); trading.add(band); fvgBands.push(band);
  });
  // EMA line
  const emaPts = [];
  for (let i=0;i<=52;i++){ const x=(i/2-13)*0.42; emaPts.push(new THREE.Vector3(x, Math.sin(i*0.28)*0.7 + Math.cos(i*0.11)*0.3, 0.15)); }
  const ema = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(emaPts), 120, 0.018, 6, false), new THREE.MeshBasicMaterial({ color:GOLD_BR, transparent:true, opacity:0 }));
  trading.add(ema);

  // ---------- bloom ----------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.42, 0.45, 0.32);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.setSize(window.innerWidth, window.innerHeight);

  // ---------- state ----------
  const state = {
    active:'hero', camPos:new THREE.Vector3(0,0,9.2), camLook:new THREE.Vector3(0,0,0),
    targetPos:new THREE.Vector3(0,0,9.2), targetLook:new THREE.Vector3(0,0,0),
    mouse:new THREE.Vector2(0,0), targetMouse:new THREE.Vector2(0,0),
    vis:{ core:1, rings:1, planets:0, trading:0 },
    targetVis:{ core:1, rings:1, planets:0, trading:0 },
    motion:opts.motion ?? 1, hovered:-1,
  };
  const MOBILE = !!opts.mobile;
  function applyTarget(name){
    const c = CAM[name] || CAM.hero;
    let pos = [...c.pos], look = [...c.look];
    if (MOBILE){
      // pull back + recenter so the scene frames inside a portrait viewport
      pos = [ pos[0]*0.35, pos[1]*0.8, pos[2]*1.32 ];
      look = [ look[0]*0.3, look[1]*0.8, look[2] ];
    }
    state.targetPos.set(...pos); state.targetLook.set(...look);
    const v = state.targetVis;
    v.core = (name==='trading') ? 0 : (name==='projects') ? 0.07 : 1;
    v.rings = (name==='hero'||name==='skills'||name==='about') ? 1 : (name==='contact'?0.4:0);
    v.planets = (name==='projects') ? 1 : 0;
    v.trading = (name==='trading') ? 1 : 0;
  }
  applyTarget('hero');
  state.camPos.copy(state.targetPos); state.camLook.copy(state.targetLook);

  // ---------- helpers ----------
  function setGroupOpacity(group, mul){
    group.traverse(o=>{ if (o.material){ const mats=Array.isArray(o.material)?o.material:[o.material]; mats.forEach(m=>{ if(m.userData._base===undefined) m.userData._base=m.opacity; m.opacity=m.userData._base*mul; m.transparent=true; }); } });
  }

  // ---------- raycaster (projects) ----------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(clientX, clientY){
    if (state.targetVis.planets < 0.5) return -1;
    ndc.x = (clientX/window.innerWidth)*2 - 1;
    ndc.y = -(clientY/window.innerHeight)*2 + 1;
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(planetMeshes.map(g=>g.userData.body), false);
    return hits.length ? hits[0].object.parent.userData.i : -1;
  }

  // ---------- animation loop ----------
  const clock = new THREE.Clock();
  let raf = null, running = false;
  function update(){
    const t = clock.getElapsedTime();
    const dt = Math.min(clock.getDelta()+0.0001, 0.05);
    const m = state.motion;

    // camera ease (slow, cinematic)
    state.camPos.lerp(state.targetPos, 0.034);
    state.camLook.lerp(state.targetLook, 0.034);
    state.mouse.lerp(state.targetMouse, 0.055);
    const px = state.mouse.x * 0.9 * m, py = state.mouse.y * 0.6 * m;
    camera.position.set(state.camPos.x + px, state.camPos.y + py, state.camPos.z);
    camera.lookAt(state.camLook);

    // visibility ease (slower for movie-style cross-fades)
    for (const k in state.vis){ state.vis[k] = lerp(state.vis[k], state.targetVis[k], 0.042); }
    setGroupOpacity(core, state.vis.core); core.visible = state.vis.core > 0.02;
    halo.material.opacity = 0.16 * state.vis.core;
    setGroupOpacity(rings, state.vis.rings); rings.visible = state.vis.rings > 0.02;
    planets.visible = state.vis.planets > 0.02;
    trading.visible = state.vis.trading > 0.02;

    // motion
    core.rotation.y += 0.0023*m; core.rotation.x = Math.sin(t*0.2)*0.12;
    wire.rotation.y -= 0.0014*m; wire.rotation.z += 0.0006*m;
    innerGlow.scale.setScalar(1 + Math.sin(t*1.6)*0.08);
    rings.children.forEach(c=>{ if(c.userData.spin) c.rotation.z += c.userData.spin*0.02*m; });
    rings.rotation.y += 0.0008*m;
    stars.rotation.y += 0.00015*m; dustGold.rotation.y -= 0.0004*m; dustCyan.rotation.x += 0.0003*m;

    // planets float + scale-in + hover
    planetMeshes.forEach((g,i)=>{
      const sc = state.vis.planets;
      g.scale.setScalar(lerp(0.001, 1, sc));
      g.position.y = PLANET_POS[i][1] + Math.sin(t*0.7 + g.userData.float)*0.12*m;
      g.rotation.y += (0.004 + i*0.0006)*m;
      const target = (state.hovered===i) ? 1 : 0;
      g.userData.hover = lerp(g.userData.hover, target, 0.15);
      g.userData.body.material.emissiveIntensity = g.userData.baseEmissive + g.userData.hover*0.9;
      const hs = 1 + g.userData.hover*0.18;
      g.userData.body.scale.setScalar(hs); g.userData.wireO.scale.setScalar(hs);
    });

    // trading scene — cinematic glow-in + chart push-in
    const tv = state.vis.trading;
    const ease = tv*tv*(3-2*tv);            // smoothstep
    if (trading.visible){
      candleData.forEach(c=>{
        c.candle.position.y = c.baseY + Math.sin(t*0.55 + c.phase)*0.05*m;
        c.candle.material.emissiveIntensity = c.glow * ease;
        c.wick.material.opacity = 0.45 * ease;
      });
      fvgBands.forEach(b=> b.material.opacity = 0.09 * ease);
      ema.material.opacity = 0.9 * ease;
      trading.rotation.y = Math.sin(t*0.09)*0.07;
      trading.scale.setScalar(lerp(0.92, 1.0, ease));
      if (chartPlane){
        chartPlane.material.opacity = 0.72 * ease;
        chartPlane.position.z = lerp(-3.4, -1.4, ease);          // slow dolly toward camera
        chartPlane.position.x = Math.sin(t*0.07)*0.16*m;
        chartPlane.position.y = 0.6 + Math.cos(t*0.05)*0.08*m;
        chartPlane.scale.setScalar(lerp(1.28, 1.0, ease));
        const echo = chartPlane.userData.echo;
        if (echo){ echo.material.opacity = 0.14 * ease; echo.position.z = chartPlane.position.z - 0.9; echo.position.x = -Math.sin(t*0.07)*0.2*m; }
      }
    } else if (chartPlane){ chartPlane.material.opacity = 0; if(chartPlane.userData.echo) chartPlane.userData.echo.material.opacity = 0; }

    composer.render();
  }
  function loop(){ update(); if (running) raf = requestAnimationFrame(loop); }

  function start(){ if(!running){ running=true; clock.start(); raf=requestAnimationFrame(loop); } }
  function stop(){ running=false; if(raf) cancelAnimationFrame(raf); }
  function renderOnce(){ update(); }

  function resize(){
    const w=window.innerWidth, h=window.innerHeight;
    camera.aspect=w/h;
    // widen FOV on portrait / phone so the core stays framed
    camera.fov = (w < 760 || h > w) ? 64 : 52;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h); composer.setSize(w,h); bloom.setSize(w,h);
    if(!running) renderOnce();
  }
  window.addEventListener('resize', resize);

  // ---------- public API ----------
  return {
    flyTo(name){ state.active=name; applyTarget(name); },
    setMouse(nx, ny){ state.targetMouse.set(nx, ny); },
    pick,
    setHover(i){ state.hovered=i; },
    start, stop, renderOnce, resize,
    setDensity(d){ /* density baked at build; noop live */ },
    setMotion(v){ state.motion=v; },
    setAccent(hex){
      const c = new THREE.Color(hex);
      wire.material.color.set(c); shell.material.emissive.set(c); innerGlow.material.color.set(c);
      key.color.set(c); halo.material.map = radialTex(hex); halo.material.needsUpdate=true;
    },
  };
}

// radial gradient sprite texture
function radialTex(color){
  const c = document.createElement('canvas'); c.width=c.height=128;
  const x = c.getContext('2d');
  const col = new THREE.Color(color);
  const r = Math.round(col.r*255), g = Math.round(col.g*255), b = Math.round(col.b*255);
  const grd = x.createRadialGradient(64,64,0,64,64,64);
  grd.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grd.addColorStop(0.4, `rgba(${r},${g},${b},0.5)`);
  grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
  x.fillStyle=grd; x.fillRect(0,0,128,128);
  const tex = new THREE.CanvasTexture(c); tex.needsUpdate=true; return tex;
}
