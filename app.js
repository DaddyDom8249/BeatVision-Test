const stages = [
  { name: 'The Song', kicker: 'STAGE 01', status: 'READY' },
  { name: 'Reveal the World', kicker: 'STAGE 02', status: 'APPROVAL GATE' },
  { name: 'World Assets', kicker: 'STAGE 03', status: 'APPROVAL GATE' },
  { name: 'Storyboard', kicker: 'STAGE 04', status: 'READY' },
  { name: 'Scene Direction', kicker: 'STAGE 05', status: 'PROVIDER READY' },
  { name: 'Visual Scenes', kicker: 'STAGE 06', status: 'PROVIDER READY' },
  { name: 'Motion & Edit', kicker: 'STAGE 07', status: 'PREVIEW' },
  { name: 'The Pitch', kicker: 'STAGE 08', status: 'PARTNERSHIP' }
];

const demo = {
  project: 'Midnight Static',
  current: 0,
  approved: JSON.parse(localStorage.getItem('beatvision-demo-approvals') || '{}'),
  providerPanelOpen: false
};

const $ = (selector) => document.querySelector(selector);

function saveState() {
  localStorage.setItem('beatvision-demo-approvals', JSON.stringify(demo.approved));
}

function approvalLabel(index) {
  if (demo.approved[index]) return 'APPROVED';
  return stages[index].status;
}

function renderNav() {
  const nav = $('#stageNav');
  nav.innerHTML = stages.map((stage, index) => {
    const done = Boolean(demo.approved[index]) || index < demo.current;
    return `<button class="stage-item ${index === demo.current ? 'active' : ''} ${done ? 'done' : ''}" data-stage="${index}" type="button">
      <span>${String(index + 1).padStart(2, '0')}</span><span>${stage.name}</span>
    </button>`;
  }).join('');

  nav.querySelectorAll('[data-stage]').forEach((button) => {
    button.addEventListener('click', () => setStage(Number(button.dataset.stage)));
  });

  $('#progressText').textContent = `${demo.current + 1} / ${stages.length}`;
}

function setStage(index) {
  demo.current = Math.max(0, Math.min(stages.length - 1, index));
  renderNav();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const stage = stages[demo.current];
  const views = [song, world, assets, storyboard, prompts, scenes, motion, pitch];

  $('#stageKicker').textContent = stage.kicker;
  $('#stageTitle').textContent = stage.name;
  $('#stageStatus').textContent = approvalLabel(demo.current);
  $('#backBtn').style.visibility = demo.current ? 'visible' : 'hidden';
  $('#nextBtn').textContent = demo.current === stages.length - 1 ? 'Restart demo →' : 'Continue →';
  $('#stageContent').innerHTML = views[demo.current]();

  if ([1, 2, 3, 4, 5].includes(demo.current)) {
    $('#stageContent').querySelectorAll('.reveal').forEach((element, n) => {
      setTimeout(() => element.classList.remove('reveal'), 80 + n * 90);
    });
  }

  bindStageActions();
}

function approvalButton(index, label) {
  const approved = Boolean(demo.approved[index]);
  return `<button class="primary-btn approval-btn" data-approve="${index}" type="button">${approved ? '✓ ' + label + ' Approved' : label}</button>`;
}

function song() {
  return `<div class="song-card card"><div class="art">BV</div><div class="meta"><span class="meta-label">DEMO TRACK</span><h3>Midnight Static</h3><p>Original demonstration track • 03:42</p><div class="input-row"><span class="meta-label">CREATIVE DIRECTION</span><div class="fake-input">Neon-noir • emotional • cinematic • industrial pulse</div></div><div class="input-row"><span class="meta-label">LYRICS</span><div class="fake-input">A city breathing electricity...<br>Every shadow knows my name...<br>We disappear into the static.</div></div></div></div><div class="card" style="margin-top:14px"><span class="meta-label">THE IDEA</span><p>BeatVision does not ask the creator to become a prompt engineer. The creator supplies the song and intent. The system builds the visual language.</p><div class="tag-row"><span class="tag">DEMO MODE</span><span class="tag">NO PAID API CALLS</span><span class="tag">PROVIDER NEUTRAL</span></div></div>`;
}

function world() {
  const approved = Boolean(demo.approved[1]);
  return `<div class="card reveal"><div style="display:flex;justify-content:space-between;gap:20px"><div><span class="meta-label">VISUAL WORLD REPORT</span><h3>NEON AFTERIMAGE</h3></div><span class="tag">${approved ? 'APPROVED OUTPUT' : 'DEMO OUTPUT'}</span></div><p>A rain-slick midnight city where memory behaves like electricity. Human emotion appears as colored interference across glass, skin and architecture. The camera feels intimate even when the world is enormous.</p><div class="tag-row"><span class="tag">NEON NOIR</span><span class="tag">RAIN</span><span class="tag">CHROMATIC GHOSTS</span><span class="tag">35MM GRAIN</span><span class="tag">HIGH CONTRAST</span></div></div><div class="report-grid" style="margin-top:14px"><div class="card reveal"><span class="meta-label">EMOTIONAL ARC</span><p>Isolation → pursuit → confrontation → release</p></div><div class="card reveal"><span class="meta-label">VISUAL RULE</span><p>Keep the protagonist warm against a cold, electrically alive city.</p></div></div><div class="card" style="margin-top:14px;border-color:#4a3a25"><span class="meta-label">APPROVAL GATE</span><p>In the full product, this is where the creator confirms: <b>“Yes, that’s my world.”</b></p>${approvalButton(1, 'Approve World')}</div>`;
}

function assets() {
  const approved = Boolean(demo.approved[2]);
  return `<div class="assets-grid"><div class="card reveal asset"><div class="asset-img"></div><span class="meta-label">01 • WORLD STYLE BIBLE</span><h3>Neon Afterimage</h3><p>Palette, texture, lens language, lighting and continuity rules.</p></div><div class="card reveal asset"><div class="asset-img"></div><span class="meta-label">02 • CHARACTER</span><h3>The Runner</h3><p>Consistent silhouette, wardrobe, age, expression and visual identity.</p></div><div class="card reveal asset"><div class="asset-img"></div><span class="meta-label">03 • ENVIRONMENT</span><h3>Electric City</h3><p>Rain, glass towers, underpasses and luminous signage.</p></div></div><div class="card" style="margin-top:14px"><span class="meta-label">CONSISTENCY ENGINE</span><p>These assets become shared creative constraints for every downstream scene, giving providers a structured target instead of isolated image prompts.</p>${approvalButton(2, approved ? 'Assets' : 'Approve Assets')}</div>`;
}

function storyboard() {
  const beats = ['Signal', 'The City Wakes', 'Running Blind', 'The Memory', 'Crossing', 'Confrontation', 'Breakthrough', 'Afterimage'];
  return `<div class="story-list">${beats.map((beat, i) => `<div class="story-row reveal"><b>0${i + 1}</b><span>${beat}</span><small>${['Intro', 'Verse', 'Verse', 'Hook', 'Bridge', 'Hook', 'Finale', 'Outro'][i]}</small></div>`).join('')}</div><div class="card" style="margin-top:14px"><span class="meta-label">STORY LOGIC</span><p>Eight production-ready beats give a video model clear temporal structure while preserving one visual world.</p></div>`;
}

function prompts() {
  return `<div class="card reveal"><span class="meta-label">SCENE PROMPT SYSTEM</span><h3>One world. Eight directions.</h3><p>Every scene prompt inherits the approved world bible, character continuity, environment continuity and musical beat. This is the bridge between creative intent and provider APIs.</p><div class="story-list"><div class="story-row"><b>SCENE 01</b><span>Close tracking shot through rain-soaked neon</span><small>CAMERA</small></div><div class="story-row"><b>SCENE 04</b><span>Memory fractures across reflective glass</span><small>EMOTION</small></div><div class="story-row"><b>SCENE 07</b><span>Warm figure emerges from electrical storm</span><small>PAYOFF</small></div></div></div>`;
}

function scenes() {
  const names = ['SIGNAL', 'CITY', 'RUN', 'MEMORY', 'CROSSING', 'FIGHT', 'BREAKTHROUGH', 'AFTERIMAGE'];
  return `<div class="scene-grid">${names.map((name, i) => `<div class="card scene reveal"><div class="scene-thumb">SCENE ${String(i + 1).padStart(2, '0')}</div><div class="scene-info"><b>${name}</b><p>Provider-ready visual frame</p></div></div>`).join('')}</div><div class="card" style="margin-top:14px"><span class="meta-label">REFERENCE PHOTO SUPPORT</span><p>Creator reference images can be assigned to individual scenes. The architecture tracks reference IDs separately from prompts so providers can later receive actual image inputs where supported.</p></div>`;
}

function motion() {
  return `<div class="motion"><div><div class="timeline"><span class="meta-label">MOTION TIMELINE • 03:42</span><div class="track"></div><div class="track"></div><div class="track"></div><div class="playhead"></div></div><div class="card" style="margin-top:14px"><span class="meta-label">VIDEO PROVIDER HANDOFF</span><p>Approved scene images become source frames. A video provider supplies motion, camera movement and temporal consistency. BeatVision owns the creative sequence and final edit logic.</p></div></div><div class="card"><span class="meta-label">EXPORT PLAN</span><h3>Music Video</h3><p>8 scenes • beat-synced transitions • final audio • 16:9 master</p><div class="tag-row"><span class="tag">1080P</span><span class="tag">24 FPS</span><span class="tag">H.264</span></div><button class="primary-btn" style="margin-top:20px" data-preview-render type="button">Preview Render</button><p class="demo-note" data-render-status>Presentation prototype: provider-powered rendering is intentionally simulated.</p></div></div>`;
}

function pitch() {
  return `<div class="card" style="padding:34px"><span class="meta-label">BEATVISION × YOUR TECHNOLOGY</span><h3 style="font-size:34px;margin:12px 0">The product is the creative pipeline. Your API can power the engine.</h3><p style="max-width:720px">BeatVision orchestrates specialized AI capabilities behind one creator experience. We are seeking providers willing to support the prototype with API credits, startup programs, infrastructure or strategic partnership.</p><div class="provider-grid"><article><span class="provider-num">LANGUAGE</span><h3>World + Story</h3><p>Structured interpretation of lyrics and intent.</p><b>Integration point: world report, narrative beats, scene direction.</b></article><article><span class="provider-num">IMAGE</span><h3>Visual Assets</h3><p>Characters, environments and scenes.</p><b>Integration point: reference-aware image generation.</b></article><article><span class="provider-num">VIDEO</span><h3>Motion</h3><p>Animation, temporal consistency and render.</p><b>Integration point: image-to-video and motion generation.</b></article><article><span class="provider-num">INFRA</span><h3>Scale</h3><p>Jobs, storage, compute and delivery.</p><b>Integration point: queues, assets, rendering and distribution.</b></article></div><div class="tag-row" style="margin-top:20px"><span class="tag">API CREDITS</span><span class="tag">STARTUP PROGRAM</span><span class="tag">INFRASTRUCTURE</span><span class="tag">STRATEGIC PARTNERSHIP</span></div></div>`;
}

function bindStageActions() {
  document.querySelectorAll('[data-approve]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.approve);
      demo.approved[index] = true;
      saveState();
      renderNav();
      render();
    });
  });

  const preview = $('[data-preview-render]');
  if (preview) {
    preview.addEventListener('click', () => {
      const status = $('[data-render-status]');
      preview.disabled = true;
      preview.textContent = 'Preparing preview…';
      status.textContent = 'Demo render pipeline staged. No external provider call was made.';
      setTimeout(() => {
        preview.disabled = false;
        preview.textContent = 'Preview Render';
      }, 900);
    });
  }
}

$('#startDemo').onclick = () => {
  $('#hero').classList.add('hidden');
  $('#workspace').classList.remove('hidden');
  setStage(0);
};

$('#watchFlow').onclick = () => $('#workspace').scrollIntoView({ behavior: 'smooth' });

$('#nextBtn').onclick = () => {
  if (demo.current === stages.length - 1) {
    demo.current = 0;
    demo.approved = {};
    saveState();
    renderNav();
    render();
    return;
  }
  setStage(demo.current + 1);
};

$('#backBtn').onclick = () => setStage(demo.current - 1);
$('#providerBtn').onclick = () => $('#providerPanel').classList.remove('hidden');
$('#closeProvider').onclick = () => $('#providerPanel').classList.add('hidden');

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' && !event.ctrlKey && !event.metaKey) setStage(demo.current + 1);
  if (event.key === 'ArrowLeft' && !event.ctrlKey && !event.metaKey && demo.current > 0) setStage(demo.current - 1);
  if (event.key === 'Escape') $('#providerPanel').classList.add('hidden');
});

renderNav();
