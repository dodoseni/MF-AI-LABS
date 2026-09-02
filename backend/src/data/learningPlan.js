// Mock data for the LevelUp learning plan.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`developmentGoals`, `studyPlan`,
// `calendarEvents`, `weeklyStudyPlan`) and the corresponding types in
// `levelup-frontend/src/types/index.ts` so the API contract matches the
// existing Learning Plan UI (goal cards + milestones, calendar, weekly plan,
// study task list).

const goals = [
  {
    id: 'g1',
    title: 'Achieve Azure Solutions Architect Expert',
    category: 'Certification',
    status: 'in-progress',
    progress: 62,
    dueDate: '2026-11-30',
    milestones: [
      { id: 'm1', label: 'Complete AZ-305 study path (Design)', date: '2026-09-15', done: true },
      { id: 'm2', label: 'Take practice exams — Score 70%+', date: '2026-10-15', done: false },
      { id: 'm3', label: 'Book and pass AZ-305 exam', date: '2026-11-30', done: false },
    ],
  },
  {
    id: 'g2',
    title: 'Strengthen Sales competency to level 4',
    category: 'Competency',
    status: 'active',
    progress: 40,
    dueDate: '2026-12-15',
    milestones: [
      { id: 'm1', label: 'Complete sales training workshop', date: '2026-09-30', done: true },
      { id: 'm2', label: 'Co-lead one proposal submission', date: '2026-11-01', done: false },
      { id: 'm3', label: 'Present at internal sales forum', date: '2026-12-15', done: false },
    ],
  },
  {
    id: 'g3',
    title: 'Complete DevOps practices deep-dive',
    category: 'Learning',
    status: 'active',
    progress: 20,
    dueDate: '2026-12-01',
    milestones: [
      { id: 'm1', label: 'Finish Azure DevOps course', date: '2026-10-15', done: false },
      { id: 'm2', label: 'Implement CI/CD on a demo project', date: '2026-11-15', done: false },
    ],
  },
  {
    id: 'g4',
    title: 'Mentor two junior consultants',
    category: 'Develop',
    status: 'completed',
    progress: 100,
    dueDate: '2026-06-30',
    milestones: [
      { id: 'm1', label: 'Monthly 1:1 mentoring sessions', date: '2026-04-01', done: true },
      { id: 'm2', label: 'Review goals and career plan', date: '2026-06-30', done: true },
    ],
  },
];

const tasks = [
  {
    id: 's1',
    title: 'AZ-305: Design identity, governance and monitoring solutions',
    source: 'Microsoft Learn',
    duration: '4h 30m',
    completed: true,
    type: 'course',
  },
  {
    id: 's2',
    title: 'AZ-305: Design data storage solutions',
    source: 'Microsoft Learn',
    duration: '5h 15m',
    completed: true,
    type: 'course',
  },
  {
    id: 's3',
    title: 'AZ-305: Design business continuity solutions',
    source: 'Microsoft Learn',
    duration: '3h 45m',
    completed: false,
    type: 'course',
  },
  {
    id: 's4',
    title: 'Architecting Microsoft Azure Solutions exam guide',
    source: 'Microsoft Press (book)',
    duration: '12h',
    completed: false,
    type: 'reading',
  },
  {
    id: 's5',
    title: 'AZ-305 practice exam set',
    source: 'MeasureUp',
    duration: '2h',
    completed: false,
    type: 'practice',
  },
];

const weeklyPlan = [
  { day: 'Monday', items: ['AZ-305: Design identity & governance — Module 1'] },
  { day: 'Wednesday', items: ['AZ-305: Design data storage — Module 2'] },
  { day: 'Friday', items: ['Hands-on practice lab (Azure sandbox)'] },
  { day: 'Sunday', items: ['Weekly quiz + recap'] },
];

const calendar = [
  { id: 'e1', date: '2026-09-07', title: 'AZ-305: Design identity & governance — Module 1', type: 'study' },
  { id: 'e2', date: '2026-09-09', title: 'AZ-305: Design data storage — Module 2', type: 'study' },
  { id: 'e3', date: '2026-09-11', title: 'Hands-on practice lab', type: 'study' },
  { id: 'e4', date: '2026-09-13', title: 'Weekly quiz + recap', type: 'study' },
  { id: 'e5', date: '2026-09-15', title: 'Complete AZ-305 Design module', type: 'milestone' },
  { id: 'e6', date: '2026-09-30', title: 'Sales training workshop', type: 'study' },
  { id: 'e7', date: '2026-10-15', title: 'AZ-305 practice exam — target 70%+', type: 'practice' },
  { id: 'e8', date: '2026-10-15', title: 'Finish Azure DevOps course', type: 'study' },
  { id: 'e9', date: '2026-11-01', title: 'Co-lead one proposal submission', type: 'milestone' },
  { id: 'e10', date: '2026-11-15', title: 'Implement CI/CD on a demo project', type: 'study' },
  { id: 'e11', date: '2026-11-30', title: 'AZ-305 certification exam', type: 'exam' },
  { id: 'e12', date: '2026-12-01', title: 'DevOps practices deep-dive due', type: 'milestone' },
  { id: 'e13', date: '2026-12-15', title: 'Present at internal sales forum', type: 'milestone' },
];

module.exports = { goals, tasks, weeklyPlan, calendar };
