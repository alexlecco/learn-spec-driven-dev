/*
SPEC: Module Progress Tracking
Goal: Persist and expose which learning modules a user has completed so that
      the UI can accurately reflect progress across sessions.
Users: Returning visitors who have previously completed modules
Acceptance criteria:
- AC1: Progress stored in localStorage under key 'sdd_progress'
- AC2: getProgress() returns { m1, m2, m3, m4, m5 } with boolean values
- AC3: markComplete(id) updates localStorage and triggers a UI refresh
- AC4: getCompletedCount() returns number of completed modules (0-5)
- AC5: resetProgress() clears all progress
Out of scope:
- Server-side sync
- Per-module sub-progress tracking
*/

const PROGRESS_KEY = 'sdd_progress';

function getProgress() {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return { m1: false, m2: false, m3: false, m4: false, m5: false };
    return JSON.parse(stored);
  } catch {
    return { m1: false, m2: false, m3: false, m4: false, m5: false };
  }
}

function markComplete(moduleId) {
  const progress = getProgress();
  progress[moduleId] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  refreshProgressUI();
}

function getCompletedCount() {
  const progress = getProgress();
  return Object.values(progress).filter(Boolean).length;
}

function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
  refreshProgressUI();
}

function refreshProgressUI() {
  const progress = getProgress();
  const count = getCompletedCount();
  const total = 5;
  const pct = Math.round((count / total) * 100);

  const fill = document.querySelector('.progress-bar__fill');
  if (fill) fill.style.width = `${pct}%`;

  const countEl = document.querySelector('.progress-label__count');
  if (countEl) countEl.textContent = `${count}/${total} complete`;

  Object.entries(progress).forEach(([id, done]) => {
    const card = document.querySelector(`[data-module="${id}"]`);
    if (!card) return;
    const cta = card.querySelector('.module-card__cta');
    if (!cta) return;
    if (done) {
      cta.textContent = 'Completed ✓';
      cta.classList.add('btn--ghost');
      cta.classList.remove('btn--primary');
      card.classList.add('module-card--completed');
    }
  });
}

function initProgress() {
  refreshProgressUI();
}
