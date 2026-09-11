/* Sponsor-demo motion orchestration UI.
 * Demonstrates independent scene jobs, partial completion, retryable provider
 * errors, and persistence without pretending that a provider call occurred.
 */
(function () {
  'use strict';
  const J = window.BeatVisionMotionJobs;
  if (!J) return;

  const names = ['SIGNAL','CITY','RUN','MEMORY','CROSSING','FIGHT','BREAKTHROUGH','AFTERIMAGE'];
  const labels = {
    queued: 'QUEUED', submitting: 'SUBMITTING', processing: 'PROCESSING',
    completed: 'COMPLETE', retryable_error: 'RETRYABLE', permanent_error: 'FAILED', cancelled: 'CANCELLED'
  };

  function ensureJobs() {
    const jobs = J.load();
    return jobs.length === 8 ? jobs : J.create(8, 'Pixazo LTX');
  }

  window.motion = function motion() {
    const jobs = ensureJobs();
    const summary = J.summary(jobs);
    return `<div class="motion">
      <div>
        <div class="timeline"><span class="meta-label">MOTION JOB QUEUE • 03:42</span><div class="track"></div><div class="track"></div><div class="track"></div><div class="playhead"></div></div>
        <div class="card" style="margin-top:14px">
          <span class="meta-label">PERSISTENT JOB ORCHESTRATION</span>
          <p>Each scene is an independent job. A slow or failed provider request no longer destroys completed scenes or forces the upstream pipeline to restart.</p>
          <div class="tag-row"><span class="tag">${summary.completed || 0} COMPLETE</span><span class="tag">${summary.retryable_error || 0} RETRYABLE</span><span class="tag">${summary.processing || 0} PROCESSING</span><span class="tag">${summary.queued || 0} QUEUED</span></div>
        </div>
        <div class="card" style="margin-top:14px"><span class="meta-label">SCENE JOBS</span><div id="motionJobs" class="story-list">${jobs.map(job => jobRow(job)).join('')}</div></div>
      </div>
      <div class="card">
        <span class="meta-label">PROVIDER HANDOFF</span>
        <h3>Async video generation</h3>
        <p>Production adapters submit a provider request, persist its request ID, poll or receive a webhook, then store the resulting media URL.</p>
        <div class="tag-row"><span class="tag">NEW REQUEST PER RETRY</span><span class="tag">MAX 3 ATTEMPTS</span><span class="tag">NO FAKE SUCCESS</span></div>
        <button class="primary-btn" style="margin-top:20px" data-motion-demo type="button">Run Failure-Handling Demo</button>
        <button class="ghost-btn" style="margin-top:10px;width:100%" data-motion-reset type="button">Reset Motion Jobs</button>
        <p class="demo-note" data-render-status>Presentation mode: provider calls are not made from this static build.</p>
      </div>
    </div>`;
  };

  function jobRow(job) {
    const error = job.errorMessage ? `<small title="${escapeHtml(job.errorMessage)}">${escapeHtml(job.errorMessage)}</small>` : '';
    const retry = job.status === J.STATUS.RETRYABLE_ERROR ? `<button class="text-btn" data-motion-retry="${job.id}" type="button">Retry scene</button>` : '';
    return `<div class="story-row"><b>SCENE ${String(job.sceneId).padStart(2,'0')}</b><span>${names[job.sceneId - 1] || 'SCENE'} ${error}</span><small>${labels[job.status] || job.status} • ATTEMPT ${job.attempt}/${job.maxAttempts}</small>${retry}</div>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  document.addEventListener('click', function (event) {
    const retry = event.target.closest('[data-motion-retry]');
    if (retry) { J.retry(retry.dataset.motionRetry); renderCurrent(); return; }

    const demo = event.target.closest('[data-motion-demo]');
    if (demo) {
      const jobs = ensureJobs();
      const target = jobs.find(j => j.sceneId === 1) || jobs[0];
      if (target) {
        J.submit(target.id, `demo_${Date.now()}`);
        J.processing(target.id, `demo_${Date.now()}`);
        J.fail(target.id, '502: Pixazo ltx-video job ERROR: Generation failed: the provider ended this request without producing output (prompt not found). No credits were deducted.', 'PROMPT_NOT_FOUND');
      }
      const status = document.querySelector('[data-render-status]');
      if (status) status.textContent = 'Scene 01 classified as retryable. Completed scenes remain preserved; no provider call was made.';
      renderCurrent();
    }

    const reset = event.target.closest('[data-motion-reset]');
    if (reset) { J.create(8, 'Pixazo LTX'); renderCurrent(); }
  });

  function renderCurrent() {
    const content = document.querySelector('#stageContent');
    if (content && typeof window.motion === 'function') content.innerHTML = window.motion();
  }
})();
