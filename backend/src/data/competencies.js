// Mock data for LevelUp competencies.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`competencyAreas`) and
// `levelup-frontend/src/types/index.ts` (`CompetencyEntry`) so the API contract
// matches the existing Competency UI.

const competencies = [
  {
    area: 'Sales',
    label: 'Sales',
    description:
      'Driving business development, identifying opportunities and winning work for Sopra Steria and clients.',
    current: 3,
    target: 4,
    previous: 2,
  },
  {
    area: 'Delivery',
    label: 'Delivery',
    description:
      'Delivering high-quality outcomes for clients with solid project and product execution.',
    current: 4,
    target: 4,
    previous: 4,
  },
  {
    area: 'Manage',
    label: 'Manage',
    description:
      'Leading teams, people development, stakeholder management and running project delivery.',
    current: 3,
    target: 4,
    previous: 3,
  },
  {
    area: 'Entrepreneurship',
    label: 'Entrepreneurship',
    description:
      'Innovating, building new offerings and taking ownership of commercial opportunities.',
    current: 3,
    target: 4,
    previous: 2,
  },
  {
    area: 'Develop',
    label: 'Develop',
    description:
      'Growing the competence, career and wellbeing of the people you work with.',
    current: 4,
    target: 4,
    previous: 3,
  },
];

module.exports = { competencies };
