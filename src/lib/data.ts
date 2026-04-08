export type Session = {
  id: string;
  topic: string;
  details: string;
  timeSlot: string;
  completed: boolean;
};

export type DayPlan = {
  day: string;
  sessions: Session[];
};

export const defaultTimetable: DayPlan[] = [
  {
    day: 'MONDAY',
    sessions: [
      { id: 'm1', topic: 'DSA -> Arrays', details: '2-3 problems', timeSlot: '6-8 PM', completed: false },
      { id: 'm2', topic: 'Backend -> APIs / Routing', details: 'Practice building APIs', timeSlot: '9-11 PM', completed: false },
      { id: 'm3', topic: 'Project -> Implement API feature', details: 'Work on actual project', timeSlot: '11:30-12:30 AM', completed: false },
    ],
  },
  {
    day: 'TUESDAY',
    sessions: [
      { id: 't1', topic: 'DSA -> Strings', details: 'Practice string algorithms', timeSlot: 'Session 1', completed: false },
      { id: 't2', topic: 'Database -> Joins practice', details: 'SQL queries', timeSlot: 'Session 2', completed: false },
      { id: 't3', topic: 'Frontend -> HTML/CSS', details: 'UI basics', timeSlot: 'Session 3', completed: false },
    ],
  },
  {
    day: 'WEDNESDAY',
    sessions: [
      { id: 'w1', topic: 'DSA -> Recursion', details: 'Basic recursion problems', timeSlot: 'Session 1', completed: false },
      { id: 'w2', topic: 'Backend -> MVC / Architecture', details: 'Design patterns', timeSlot: 'Session 2', completed: false },
      { id: 'w3', topic: 'Core -> OS / CN', details: 'Theory', timeSlot: 'Session 3', completed: false },
    ],
  },
  {
    day: 'THURSDAY',
    sessions: [
      { id: 'th1', topic: 'DSA -> Linked List', details: 'Pointers and structure', timeSlot: 'Session 1', completed: false },
      { id: 'th2', topic: 'Database -> Normalization', details: '1NF to 3NF', timeSlot: 'Session 2', completed: false },
      { id: 'th3', topic: 'Project -> Build feature', details: 'Continue on project', timeSlot: 'Session 3', completed: false },
    ],
  },
  {
    day: 'FRIDAY',
    sessions: [
      { id: 'f1', topic: 'DSA -> Stack / Queue', details: 'Implementation and problems', timeSlot: 'Session 1', completed: false },
      { id: 'f2', topic: 'Backend -> Auth / Advanced', details: 'JWT and Sessions', timeSlot: 'Session 2', completed: false },
      { id: 'f3', topic: 'Project -> Debug / Improve', details: 'Refactor code', timeSlot: 'Session 3', completed: false },
    ],
  },
  {
    day: 'SATURDAY',
    sessions: [
      { id: 's1', topic: 'DSA -> Trees / Hard problems', details: 'BST and Traversals', timeSlot: 'Session 1', completed: false },
      { id: 's2', topic: 'Backend -> Full system build', details: 'Integration', timeSlot: 'Session 2', completed: false },
      { id: 's3', topic: 'Project -> Major progress', details: 'Feature push', timeSlot: 'Session 3', completed: false },
    ],
  },
  {
    day: 'SUNDAY',
    sessions: [
      { id: 'su1', topic: 'DSA -> Revision / Mock', details: 'Test', timeSlot: 'Session 1', completed: false },
      { id: 'su2', topic: 'Core -> Weak topics', details: 'Review failing areas', timeSlot: 'Session 2', completed: false },
      { id: 'su3', topic: 'Language -> Practice', details: 'Core lang concepts', timeSlot: 'Session 3', completed: false },
    ],
  },
];
