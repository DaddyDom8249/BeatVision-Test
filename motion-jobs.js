/* BeatVision motion job state machine.
 * Provider-neutral orchestration for the sponsor prototype.
 * No fake provider output is created. The state contract is designed to map
 * directly to a production persistent job table / queue.
 */
(function (root) {
  'use strict';

  const KEY = 'beatvision-motion-jobs-v1';
  const STATUS = Object.freeze({
    QUEUED: 'queued', SUBMITTING: 'submitting', PROCESSING: 'processing',
    COMPLETED: 'completed', RETRYABLE_ERROR: 'retryable_error',
    PERMANENT_ERROR: 'permanent_error', CANCELLED: 'cancelled'
  });
  const RETRYABLE = [
    /prompt not found/i,
    /provider ended this request without producing output/i,
    /timed out/i, /timeout/i, /temporarily unavailable/i,
    /502/i, /503/i, /504/i, /rate limit/i, /too many requests/i
  ];
  const now = () => new Date().toISOString();
  const uid = () => `motion_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  function load() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }
  function save(jobs) { localStorage.setItem(KEY, JSON.stringify(jobs)); return jobs; }
  function classify(error) {
    const message = String(error && error.message || error || 'Unknown provider error');
    return RETRYABLE.some(pattern => pattern.test(message)) ? STATUS.RETRYABLE_ERROR : STATUS.PERMANENT_ERROR;
  }
  function create(sceneCount, provider) {
    const timestamp = now();
    const generationId = `generation_${Date.now()}`;
    return save(Array.from({ length: sceneCount || 8 }, (_, i) => ({
      id: uid(), projectId: 'midnight-static', generationId, sceneId: i + 1,
      provider: provider || 'Pixazo LTX', model: 'ltx-video', status: STATUS.QUEUED,
      attempt: 0, maxAttempts: 3, providerRequestId: null,
      sourceImageUrl: null, videoUrl: null, errorCode: null, errorMessage: null,
      createdAt: timestamp, updatedAt: timestamp, startedAt: null, completedAt: null
    })));
  }
  function update(jobId, patch) {
    const jobs = load(), index = jobs.findIndex(j => j.id === jobId);
    if (index < 0) return jobs;
    jobs[index] = Object.assign({}, jobs[index], patch, { updatedAt: now() });
    return save(jobs);
  }
  function submit(jobId, providerRequestId) {
    const job = load().find(j => j.id === jobId);
    return update(jobId, {
      status: STATUS.SUBMITTING, attempt: Math.max(1, (job && job.attempt || 0) + 1),
      providerRequestId: providerRequestId || null, startedAt: now(), errorCode: null, errorMessage: null
    });
  }
  function processing(jobId, providerRequestId) { return update(jobId, { status: STATUS.PROCESSING, providerRequestId }); }
  function complete(jobId, videoUrl, providerRequestId) {
    return update(jobId, { status: STATUS.COMPLETED, videoUrl, providerRequestId: providerRequestId || null,
      completedAt: now(), errorCode: null, errorMessage: null });
  }
  function fail(jobId, error, errorCode) {
    const job = load().find(j => j.id === jobId);
    if (!job) return load();
    const classified = classify(error), exhausted = job.attempt >= job.maxAttempts;
    return update(jobId, {
      status: classified === STATUS.RETRYABLE_ERROR && !exhausted ? STATUS.RETRYABLE_ERROR : STATUS.PERMANENT_ERROR,
      errorCode: errorCode || 'PROVIDER_ERROR',
      errorMessage: String(error && error.message || error || 'Unknown provider error')
    });
  }
  function retry(jobId) {
    const job = load().find(j => j.id === jobId);
    if (!job || job.status !== STATUS.RETRYABLE_ERROR || job.attempt >= job.maxAttempts) return load();
    return update(jobId, { status: STATUS.QUEUED, providerRequestId: null, errorCode: null, errorMessage: null });
  }
  function summary(jobs) {
    return (jobs || load()).reduce((s, job) => {
      s.total += 1; s[job.status] = (s[job.status] || 0) + 1; return s;
    }, { total: 0 });
  }

  root.BeatVisionMotionJobs = { STATUS, load, save, create, update, classify, submit, processing, complete, fail, retry, summary };
})(window);
