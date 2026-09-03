// Mock data for the LevelUp learning plan.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`studyChecklists`) and the
// `StudyChecklist` / `StudyChecklistItem` types in
// `levelup-frontend/src/types/index.ts` (MIKK-37) so the API contract
// matches the current Learning Plan UI: one per-certification study
// checklist made up of plain todo items.
//
// Superseded model (removed as of MIKK-46): development goals, generic
// study tasks, weekly plan and calendar events — the frontend page no
// longer renders any of that.

const studyChecklists = [
  {
    id: 'plan-az-305',
    certificationId: 'az-305',
    certificationName: 'AZ-305 — Azure Solutions Architect Expert',
    items: [
      { id: 'az-305-1', label: 'Complete Design Identity module', done: true },
      { id: 'az-305-2', label: 'Complete Governance module', done: true },
      { id: 'az-305-3', label: 'Complete Storage module', done: false },
      { id: 'az-305-4', label: 'Complete Business Continuity module', done: false },
      { id: 'az-305-5', label: 'Take Practice Exam', done: false },
      { id: 'az-305-6', label: 'Schedule Certification Exam', done: false },
      { id: 'az-305-7', label: 'Pass Certification Exam', done: false },
    ],
  },
];

module.exports = { studyChecklists };
