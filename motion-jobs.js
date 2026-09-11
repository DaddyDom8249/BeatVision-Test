/* BeatVision motion job state machine.
 *
 * Provider-neutral orchestration for the presentation prototype. This module
 * deliberately does not fake provider output. It models the state contract
 * that the production backend must persist when connected to a real video API.
 */

const MOTION_JOBS_KEY = 'beatvision-motion-jobs-v1';

export const MOTION_STATUS = Object.freeze({
  QUEUED: 'queued',
  SUBMITTING: 'submitting',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  RETRYABLE_ERROR: 'retryable_error',
  PERMANENT_ERROR: 'permanent_error',
  CANCELLED: 'cancelled'
});

const RETRYABLE_PATTERNS = [
  /prompt not found/i,
  /provider ended this request without producing output/i,
  /timed out/i,
  /timeout/i,
  /temporarily unavailable/i,
  /502/i,
  /503/i,
  /504/i,
  /rate limit/i,
  /too many requests/i
];

function now() { return new Date().toISOString(); }
function uid() { return `motion_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`; }

export function classifyMotionError(error) {
  const message = String(error?.message || error || 'Unknown provider error');
  return RETRYABLE_PATTERNS.some(pattern => pattern.test(message))
    ? MOTION_STATUS.RETRYABLE_ERROR
    : MOTION_STATUS.PERMANENT_ERROR;
}

export function loadMotionJobs() {
  try {
    const raw = localStorage.getItem(MOTION_JOBS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

export function saveMotionJobs(jobs) {
  localStorage.setItem(MOTION_JOBS_KEY, JSON.stringify(jobs));
}

export function createMotionJobs(sceneCount = 8, provider = 'Pixazo LTX') {
  const timestamp = now();
  const jobs = Array.from({ length: sceneCount }, (_, index) => ({
    id: uid(),
    projectId: 'midnight-static',
    generationId: `generation_${Date.now()}`,
    sceneId: index + 1,
    provider,
    model: 'ltx-video',
    status: MOTION_STATUS.QUEUED,
    attempt: 0,
    maxAttempts: 3,
    providerRequestId: null,
    sourceImageUrl: null,
    videoUrl: null,
    errorCode: null,
    errorMessage: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    startedAt: null,
    completedAt: null
  }));
  saveMotionJobs(jobs);
  return jobs;
}

export function updateMotionJob(jobId, patch) {
  const jobs = loadMotionJobs();
  const index = jobs.findIndex(job => job.id === jobId);
  if (index < 0) return jobs;
  jobs[index] = { ...jobs[index], ...patch, updatedAt: now() };
  saveMotionJobs(jobs);
  return jobs;
}

export function markMotionSubmitting(jobId, providerRequestId = null) {
  return updateMotionJob(jobId, {
    status: MOTION_STATUS.SUBMITTING,
    attempt: Math.max(1, (loadMotionJobs().find(j => j.id === jobId)?.attempt || 0) + 1),
    providerRequestId,
    startedAt: now(),
    errorCode: null,
    errorMessage: null
  });
}

export function markMotionProcessing(jobId, providerRequestId) {
  return updateMotionJob(jobId, {
    status: MOTION_STATUS.PROCESSING,
    providerRequestId
  });
}

export function markMotionCompleted(jobId, videoUrl, providerRequestId = null) {
  return updateMotionJob(jobId, {
    status: MOTION_STATUS.COMPLETED,
    videoUrl,
    providerRequestId,
    completedAt: now(),
    errorCode: null,
    errorMessage: null
  });
}

export function markMotionFailed(jobId, error, errorCode = 'PROVIDER_ERROR') {
  const jobs = loadMotionJobs();
  const job = jobs.find(j => j.id === jobId);
  if (!job) return jobs;

  const message = String(error?.message || error || 'Unknown provider error');
  const classified = classifyMotionError(message);
  const exhausted = job.attempt >= job.maxAttempts;

  return updateMotionJob(jobId, {
    status: classified === MOTION_STATUS.RETRYABLE_ERROR && !exhausted
      ? MOTION_STATUS.RETRYABLE_ERROR
      : MOTION_STATUS.PERMANENT_ERROR,
    errorCode,
    errorMessage: message
  });
}

export function retryMotionJob(jobId) {
  const jobs = loadMotionJobs();
  const job = jobs.find(j => j.id === jobId);
  if (!job || job.status !== MOTION_STATUS.RETRYABLE_ERROR || job.attempt >= job.maxAttempts) return jobs;
  return updateMotionJob(jobId, {
    status: MOTION_STATUS.QUEUED,
    providerRequestId: null,
    errorCode: null,
    errorMessage: null
  });
}

export function summarizeMotionJobs(jobs = loadMotionJobs()) {
  return jobs.reduce((summary, job) => {
    summary.total += 1;
    summary[job.status] = (summary[job.status] || 0) + 1;
    return summary;
  }, { total: 0 });
}
