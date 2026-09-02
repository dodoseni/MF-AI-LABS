/**
 * Seeded user / progression data (dbo.app_user + owned tables) for the
 * interim mock layer. Three consultants at different career stages so every
 * endpoint tells a coherent, internally-consistent story per user.
 *
 * Ids and shapes mirror `levelup-db/schema.sql`: `user_certification`,
 * `user_competency`, `user_career`, `development_goal` + `goal_milestone`,
 * `study_plan_item`.
 */

const TENANT_ID = "t-sopra-steria-no";

const users = [
  {
    userId: "usr-amalie-berg",
    tenantId: TENANT_ID,
    displayName: "Amalie Berg",
    role: "Senior Consultant",
    office: "Oslo",
    memberSince: 2019,
    currentFamily: "consultant",
    currentLevel: "senior",
    avatarInitials: "AB",

    certifications: [
      { certificationId: "az-900", status: "completed", earnedDate: "2022-03-14" },
      { certificationId: "az-104", status: "completed", earnedDate: "2022-09-02" },
      { certificationId: "az-204", status: "completed", earnedDate: "2023-02-20" },
      { certificationId: "az-305", status: "in-progress", progressPct: 62 },
      { certificationId: "sc-300", status: "missing" },
      { certificationId: "az-400", status: "missing" },
      { certificationId: "dp-203", status: "recommended" },
      { certificationId: "ai-102", status: "recommended" },
      { certificationId: "az-500", status: "missing" },
      { certificationId: "sc-100", status: "recommended" },
    ],

    competencies: [
      { areaCode: "Sales", current: 3, target: 4, previous: 2 },
      { areaCode: "Delivery", current: 4, target: 4, previous: 4 },
      { areaCode: "Manage", current: 3, target: 4, previous: 3 },
      { areaCode: "Entrepreneurship", current: 3, target: 4, previous: 2 },
      { areaCode: "Develop", current: 4, target: 4, previous: 3 },
    ],

    career: {
      progressToNextLevel: 58,
      manualAchievements: {
        min2ClientProjects: true,
        ledDeliveryStream: true,
        principalFor2Years: false,
        recognisedSpecialist: false,
      },
    },

    goals: [
      {
        id: "g1",
        title: "Achieve Azure Solutions Architect Expert",
        category: "Certification",
        status: "in-progress",
        progressPct: 62,
        dueDate: "2026-11-30",
        milestones: [
          { id: "m1", label: "Complete AZ-305 study path (Design)", date: "2026-09-15", done: true },
          { id: "m2", label: "Take practice exams — Score 70%+", date: "2026-10-15", done: false },
          { id: "m3", label: "Book and pass AZ-305 exam", date: "2026-11-30", done: false },
        ],
      },
      {
        id: "g2",
        title: "Strengthen Sales competency to level 4",
        category: "Competency",
        status: "active",
        progressPct: 40,
        dueDate: "2026-12-15",
        milestones: [
          { id: "m1", label: "Complete sales training workshop", date: "2026-09-30", done: true },
          { id: "m2", label: "Co-lead one proposal submission", date: "2026-11-01", done: false },
          { id: "m3", label: "Present at internal sales forum", date: "2026-12-15", done: false },
        ],
      },
      {
        id: "g3",
        title: "Complete DevOps practices deep-dive",
        category: "Learning",
        status: "active",
        progressPct: 20,
        dueDate: "2026-12-01",
        milestones: [
          { id: "m1", label: "Finish Azure DevOps course", date: "2026-10-15", done: false },
          { id: "m2", label: "Implement CI/CD on a demo project", date: "2026-11-15", done: false },
        ],
      },
      {
        id: "g4",
        title: "Mentor two junior consultants",
        category: "Develop",
        status: "completed",
        progressPct: 100,
        dueDate: "2026-06-30",
        milestones: [
          { id: "m1", label: "Monthly 1:1 mentoring sessions", date: "2026-04-01", done: true },
          { id: "m2", label: "Review goals and career plan", date: "2026-06-30", done: true },
        ],
      },
    ],

    studyPlan: [
      {
        id: "s1",
        title: "AZ-305: Design identity, governance and monitoring solutions",
        source: "Microsoft Learn",
        duration: "4h 30m",
        completed: true,
        type: "course",
      },
      {
        id: "s2",
        title: "AZ-305: Design data storage solutions",
        source: "Microsoft Learn",
        duration: "5h 15m",
        completed: true,
        type: "course",
      },
      {
        id: "s3",
        title: "AZ-305: Design business continuity solutions",
        source: "Microsoft Learn",
        duration: "3h 45m",
        completed: false,
        type: "course",
      },
      {
        id: "s4",
        title: "Architecting Microsoft Azure Solutions exam guide",
        source: "Microsoft Press (book)",
        duration: "12h",
        completed: false,
        type: "reading",
      },
      {
        id: "s5",
        title: "AZ-305 practice exam set",
        source: "MeasureUp",
        duration: "2h",
        completed: false,
        type: "practice",
      },
    ],
  },

  {
    userId: "usr-jonas-eide",
    tenantId: TENANT_ID,
    displayName: "Jonas Eide",
    role: "Consultant",
    office: "Bergen",
    memberSince: 2023,
    currentFamily: "consultant",
    currentLevel: "consultant",
    avatarInitials: "JE",

    certifications: [
      { certificationId: "az-900", status: "completed", earnedDate: "2023-06-10" },
      { certificationId: "az-104", status: "in-progress", progressPct: 40 },
      { certificationId: "az-204", status: "missing" },
      { certificationId: "az-305", status: "missing" },
      { certificationId: "sc-300", status: "missing" },
      { certificationId: "az-400", status: "missing" },
      { certificationId: "dp-203", status: "recommended" },
      { certificationId: "ai-102", status: "recommended" },
      { certificationId: "az-500", status: "missing" },
      { certificationId: "sc-100", status: "missing" },
    ],

    competencies: [
      { areaCode: "Sales", current: 2, target: 2, previous: 1 },
      { areaCode: "Delivery", current: 3, target: 2, previous: 2 },
      { areaCode: "Manage", current: 2, target: 2, previous: 1 },
      { areaCode: "Entrepreneurship", current: 1, target: 2, previous: 1 },
      { areaCode: "Develop", current: 2, target: 2, previous: 2 },
    ],

    career: {
      progressToNextLevel: 25,
      manualAchievements: {
        min2ClientProjects: false,
        ledDeliveryStream: false,
        principalFor2Years: false,
        recognisedSpecialist: false,
      },
    },

    goals: [
      {
        id: "g1",
        title: "Achieve Azure Administrator Associate",
        category: "Certification",
        status: "in-progress",
        progressPct: 40,
        dueDate: "2026-10-31",
        milestones: [
          { id: "m1", label: "Complete AZ-104: Manage identities and governance", date: "2026-09-10", done: true },
          { id: "m2", label: "Complete AZ-104: Implement and manage storage", date: "2026-09-25", done: false },
          { id: "m3", label: "Book and pass AZ-104 exam", date: "2026-10-31", done: false },
        ],
      },
      {
        id: "g2",
        title: "Raise Entrepreneurship competency to level 2",
        category: "Competency",
        status: "active",
        progressPct: 20,
        dueDate: "2026-12-01",
        milestones: [
          { id: "m1", label: "Shadow a proposal-writing session", date: "2026-10-01", done: false },
          { id: "m2", label: "Draft one client offering idea", date: "2026-12-01", done: false },
        ],
      },
      {
        id: "g3",
        title: "Shadow a senior consultant on client delivery",
        category: "Develop",
        status: "active",
        progressPct: 50,
        dueDate: "2026-11-15",
        milestones: [
          { id: "m1", label: "Attend weekly delivery stand-ups", date: "2026-09-15", done: true },
          { id: "m2", label: "Own one workstream deliverable", date: "2026-11-15", done: false },
        ],
      },
    ],

    studyPlan: [
      {
        id: "s1",
        title: "AZ-104: Manage identities and governance in Azure",
        source: "Microsoft Learn",
        duration: "3h 20m",
        completed: true,
        type: "course",
      },
      {
        id: "s2",
        title: "AZ-104: Implement and manage storage",
        source: "Microsoft Learn",
        duration: "2h 50m",
        completed: false,
        type: "course",
      },
      {
        id: "s3",
        title: "AZ-104: Deploy and manage Azure compute resources",
        source: "Microsoft Learn",
        duration: "4h 10m",
        completed: false,
        type: "course",
      },
      {
        id: "s4",
        title: "AZ-104 practice exam set",
        source: "MeasureUp",
        duration: "1h 30m",
        completed: false,
        type: "practice",
      },
    ],
  },

  {
    userId: "usr-kristine-solberg",
    tenantId: TENANT_ID,
    displayName: "Kristine Solberg",
    role: "Principal Consultant",
    office: "Trondheim",
    memberSince: 2015,
    currentFamily: "consultant",
    currentLevel: "principal",
    avatarInitials: "KS",

    certifications: [
      { certificationId: "az-900", status: "completed", earnedDate: "2016-02-01" },
      { certificationId: "az-104", status: "completed", earnedDate: "2017-05-15" },
      { certificationId: "az-204", status: "completed", earnedDate: "2018-01-20" },
      { certificationId: "az-305", status: "completed", earnedDate: "2019-11-05" },
      { certificationId: "sc-300", status: "completed", earnedDate: "2020-08-12" },
      { certificationId: "az-400", status: "in-progress", progressPct: 80 },
      { certificationId: "dp-203", status: "recommended" },
      { certificationId: "ai-102", status: "missing" },
      { certificationId: "az-500", status: "completed", earnedDate: "2021-03-09" },
      { certificationId: "sc-100", status: "recommended" },
    ],

    competencies: [
      { areaCode: "Sales", current: 4, target: 4, previous: 3 },
      { areaCode: "Delivery", current: 5, target: 4, previous: 4 },
      { areaCode: "Manage", current: 4, target: 4, previous: 4 },
      { areaCode: "Entrepreneurship", current: 4, target: 4, previous: 3 },
      { areaCode: "Develop", current: 5, target: 4, previous: 4 },
    ],

    career: {
      progressToNextLevel: 74,
      manualAchievements: {
        min2ClientProjects: true,
        ledDeliveryStream: true,
        principalFor2Years: true,
        recognisedSpecialist: false,
      },
    },

    goals: [
      {
        id: "g1",
        title: "Achieve DevOps Engineer Expert",
        category: "Certification",
        status: "in-progress",
        progressPct: 80,
        dueDate: "2026-10-15",
        milestones: [
          { id: "m1", label: "Complete AZ-400: Design a DevOps strategy", date: "2026-08-20", done: true },
          { id: "m2", label: "Complete AZ-400: Implement CI/CD pipelines", date: "2026-09-10", done: true },
          { id: "m3", label: "Book and pass AZ-400 exam", date: "2026-10-15", done: false },
        ],
      },
      {
        id: "g2",
        title: "Mentor three consultants toward Senior level",
        category: "Develop",
        status: "active",
        progressPct: 60,
        dueDate: "2026-12-20",
        milestones: [
          { id: "m1", label: "Set up monthly mentoring cadence", date: "2026-09-01", done: true },
          { id: "m2", label: "Mid-cycle progress review", date: "2026-11-01", done: false },
        ],
      },
      {
        id: "g3",
        title: "Publish an architecture point-of-view on Cybersecurity",
        category: "Learning",
        status: "active",
        progressPct: 30,
        dueDate: "2026-12-31",
        milestones: [
          { id: "m1", label: "Draft outline and review with peers", date: "2026-10-15", done: false },
        ],
      },
      {
        id: "g4",
        title: "Lead enterprise cloud migration engagement",
        category: "Delivery",
        status: "completed",
        progressPct: 100,
        dueDate: "2026-05-31",
        milestones: [
          { id: "m1", label: "Deliver migration assessment", date: "2026-02-28", done: true },
          { id: "m2", label: "Complete phased cutover", date: "2026-05-31", done: true },
        ],
      },
    ],

    studyPlan: [
      {
        id: "s1",
        title: "AZ-400: Design a DevOps strategy",
        source: "Microsoft Learn",
        duration: "3h 40m",
        completed: true,
        type: "course",
      },
      {
        id: "s2",
        title: "AZ-400: Implement CI/CD pipelines",
        source: "Microsoft Learn",
        duration: "4h 55m",
        completed: true,
        type: "course",
      },
      {
        id: "s3",
        title: "AZ-400 practice exam set",
        source: "MeasureUp",
        duration: "2h",
        completed: false,
        type: "practice",
      },
    ],
  },
];

const DEFAULT_USER_ID = "usr-amalie-berg";

function getUser(userId) {
  return users.find((u) => u.userId === userId) || null;
}

module.exports = {
  TENANT_ID,
  DEFAULT_USER_ID,
  users,
  getUser,
};
