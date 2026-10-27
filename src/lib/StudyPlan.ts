// src/lib/studyPlan.ts
// 14-day CRED Backend Intern preparation plan (9 to 22 October 2026).
// Session fields match src/lib/data.ts, with two additions: minutes and block.

export type PlanSession = {
  id: string;
  topic: string;
  details: string;
  timeSlot: string; // human-readable duration, e.g. "90 min"
  completed: boolean;
  minutes: number;
  block: 'DSA' | 'Backend' | 'Project' | 'Revision' | 'Career';
  carriedOver?: boolean; // original task that was moved to a later day
};

export type StudyDay = {
  dayNumber: number;
  date: string; // YYYY-MM-DD (local date)
  label: string; // e.g. "Fri 9 Oct"
  sessions: PlanSession[];
};

export const PLAN_VERSION = 1;
export const REGISTRATION_DEADLINE = '2026-10-22T09:00:00+05:30';
export const REGISTRATION_LINK = 'https://tinyurl.com/cred-backend-intern';

type Block = PlanSession['block'];

const s = (
  day: number,
  n: number,
  block: Block,
  topic: string,
  details: string,
  minutes: number
): PlanSession => ({
  id: `d${day}_${n}`,
  topic,
  details,
  timeSlot: `${minutes} min`,
  completed: false,
  minutes,
  block,
});

type DayInput = {
  date: string;
  label: string;
  dsa: [string, string];
  backend: [string, string];
  project: [string, string];
  revision: [string, string];
  career: [string, string][];
};

const days: DayInput[] = [
  {
    date: '2026-10-09',
    label: 'Fri 9 Oct',
    dsa: ['DSA: Big-O and arrays', 'Two Sum, Best Time to Buy and Sell Stock, Contains Duplicate, Maximum Subarray. Write brute force first, state its Big-O, then optimise.'],
    backend: ['Backend: how the web works', 'DNS, client and server, HTTP request and response, methods and status codes. Write in your own words what happens when a URL is typed.'],
    project: ['Project: setup', 'Choose Java or Python, create the repository, build GET /health returning {"status":"ok"}, push to GitHub.'],
    revision: ['Revision: Day 1', 'Re-solve Two Sum and Contains Duplicate from memory and state the time complexity aloud.'],
    career: [
      ['Register for the CRED drive', 'Complete registration at tinyurl.com/cred-backend-intern and confirm eligibility (60% throughout, no backlogs).'],
      ['CV: collect details', 'List your two or three best projects, skills and certifications. Write one bullet per project: Built X using Y, achieving Z.'],
    ],
  },
  {
    date: '2026-10-10',
    label: 'Sat 10 Oct',
    dsa: ['DSA: two pointers', 'Valid Palindrome, Two Sum II, Container With Most Water, 3Sum (attempt).'],
    backend: ['Backend: HTTP and JSON', 'Headers, request body, JSON structure, REST principles, resource naming.'],
    project: ['Project: first endpoints', 'Define the data model. Build GET /items and POST /items with in-memory storage.'],
    revision: ['Revision: Day 2', 'Re-solve Valid Palindrome and Two Sum II from memory.'],
    career: [['CV: rewrite', 'Rewrite your CV as a clean one-page, ATS-friendly document.']],
  },
  {
    date: '2026-10-11',
    label: 'Sun 11 Oct',
    dsa: ['DSA: hash maps', 'Valid Anagram, Group Anagrams, Top K Frequent Elements.'],
    backend: ['Backend: REST in depth', 'PUT vs PATCH, idempotency, API naming, versioning, correct status codes.'],
    project: ['Project: complete CRUD', 'Add PUT and DELETE with proper status codes (200, 201, 204, 404).'],
    revision: ['Revision: Day 3', 'Re-solve Valid Anagram and Group Anagrams from memory.'],
    career: [['CV: finalise', 'Finish the CV. Make sure every line can be explained in depth.']],
  },
  {
    date: '2026-10-12',
    label: 'Mon 12 Oct',
    dsa: ['DSA: strings and sliding window', 'Longest Substring Without Repeating Characters, Permutation in String, Longest Repeating Character Replacement.'],
    backend: ['Backend: SQL basics', 'SELECT, WHERE, ORDER BY, GROUP BY, INNER and LEFT JOIN. Practise on a sample database.'],
    project: ['Project: database schema', 'Choose SQLite or PostgreSQL. Design tables for items and users.'],
    revision: ['Revision: Day 4', 'Re-solve Longest Substring Without Repeating Characters from memory.'],
    career: [['GD practice 1: digital payments', 'Speak for two minutes on the impact of digital payments. Structure: framing, two or three points, conclusion.']],
  },
  {
    date: '2026-10-13',
    label: 'Tue 13 Oct',
    dsa: ['DSA: stack and queue', 'Valid Parentheses, Min Stack, Daily Temperatures, Implement Queue using Stacks.'],
    backend: ['Backend: SQL indexes', 'What an index is, why it speeds up queries, EXPLAIN, when indexes hurt writes.'],
    project: ['Project: connect the database', 'Replace in-memory storage with the database. Keep all endpoints working.'],
    revision: ['Revision: Day 5', 'Re-solve Valid Parentheses and Daily Temperatures from memory.'],
    career: [['GD practice 2: credit and trust', 'Practise a discussion on credit, trust and financial behaviour in India.']],
  },
  {
    date: '2026-10-14',
    label: 'Wed 14 Oct',
    dsa: ['DSA: linked list', 'Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle, Remove Nth Node From End.'],
    backend: ['Backend: transactions and normalisation', 'ACID properties, transactions, 1NF to 3NF with an example.'],
    project: ['Project: validation', 'Add request validation and return clear error messages.'],
    revision: ['Revision: Day 6', 'Re-solve Reverse Linked List and Linked List Cycle from memory.'],
    career: [['HR: tell me about yourself', 'Write and rehearse a 60-second introduction.']],
  },
  {
    date: '2026-10-15',
    label: 'Thu 15 Oct',
    dsa: ['DSA: timed mock 1', 'Three unseen problems from Days 1 to 6 in 45 minutes. Review every mistake afterwards.'],
    backend: ['Backend: revise Days 1 to 6', 'Write short answers to ten interview questions from your notes (HTTP, REST, SQL, indexes, ACID).'],
    project: ['Project: README', 'Write the README: purpose, stack, how to run, endpoints. Push to GitHub.'],
    revision: ['Revision: mistake log', 'Re-do every problem you got wrong this week.'],
    career: [['HR: strengths and weaknesses', 'Prepare honest answers with one real example for each.']],
  },
  {
    date: '2026-10-16',
    label: 'Fri 16 Oct',
    dsa: ['DSA: binary search and sorting', 'Binary Search, Search in Rotated Sorted Array, implement Merge Sort, Kth Largest Element.'],
    backend: ['Backend: authentication', 'Sessions vs JWT, password hashing with bcrypt or argon2, why plain-text passwords are never stored.'],
    project: ['Project: register and login', 'Add register and login endpoints with hashed passwords and JWT.'],
    revision: ['Revision: Day 8', 'Re-solve Binary Search and Search in Rotated Sorted Array from memory.'],
    career: [['GD practice 3: AI in the workplace', 'Practise a discussion on AI tools in software engineering, including when not to trust them.']],
  },
  {
    date: '2026-10-17',
    label: 'Sat 17 Oct',
    dsa: ['DSA: recursion and backtracking', 'Pow(x, n), Subsets, Permutations, Generate Parentheses.'],
    backend: ['Backend: operating system basics', 'Process vs thread, context switch, deadlock and its four conditions, race conditions.'],
    project: ['Project: error handling', 'Centralised error handling and consistent error response format.'],
    revision: ['Revision: Day 9', 'Re-solve Subsets and Permutations from memory.'],
    career: [['Project explanation', 'Explain your project in three minutes: problem, design, one challenge, one improvement.']],
  },
  {
    date: '2026-10-18',
    label: 'Sun 18 Oct',
    dsa: ['DSA: trees', 'Maximum Depth, Invert Binary Tree, Level Order Traversal, Validate BST.'],
    backend: ['Backend: networking', 'TCP vs UDP, DNS resolution, HTTPS and TLS handshake at a high level.'],
    project: ['Project: unit tests', 'Write at least five tests, including edge cases and invalid input.'],
    revision: ['Revision: Day 10', 'Re-solve Maximum Depth and Level Order Traversal from memory.'],
    career: [['HR mock interview 1', 'Take a mock HR interview with a friend. Record or note feedback.']],
  },
  {
    date: '2026-10-19',
    label: 'Mon 19 Oct',
    dsa: ['DSA: graphs on grids', 'Number of Islands, Flood Fill, Rotting Oranges, Clone Graph.'],
    backend: ['Backend: caching and scaling', 'Caching, cache invalidation, load balancing, rate limiting, horizontal vs vertical scaling.'],
    project: ['Project: pagination and rate limit', 'Add pagination to list endpoints. Add a simple rate limiter or cache.'],
    revision: ['Revision: Day 11', 'Re-solve Number of Islands from memory.'],
    career: [['GD practice 4', 'Practise any topic you found weakest so far.']],
  },
  {
    date: '2026-10-20',
    label: 'Tue 20 Oct',
    dsa: ['DSA: introduction to dynamic programming', 'Climbing Stairs, House Robber, Coin Change.'],
    backend: ['Backend: system design basics', 'Design a URL shortener. Then explain why payment APIs need idempotency keys.'],
    project: ['Project: idempotency', 'Add an Idempotency-Key header to one POST endpoint so repeated requests do not duplicate data.'],
    revision: ['Revision: Day 12', 'Re-solve Climbing Stairs and House Robber from memory.'],
    career: [['HR: why CRED', 'Prepare answers for why CRED, a challenge you overcame, and a failure you learned from. Read cred.club.']],
  },
  {
    date: '2026-10-21',
    label: 'Wed 21 Oct',
    dsa: ['DSA: timed mock 2', 'Four mixed problems in 90 minutes. Review every mistake afterwards.'],
    backend: ['Backend: testing and reliability', 'Edge cases, logging, monitoring, handling failures in production.'],
    project: ['Project: logging and final polish', 'Add logging, update the README, optionally deploy to Render or Railway.'],
    revision: ['Revision: weak topics', 'Revisit the three topics you found hardest.'],
    career: [['HR mock interview 2', 'Take a second mock HR interview and a short GD practice.']],
  },
  {
    date: '2026-10-22',
    label: 'Thu 22 Oct',
    dsa: ['DSA: final mock', 'Three problems in 60 minutes, then review.'],
    backend: ['Backend: explain your project aloud', 'Five minutes: architecture, data model, authentication, one trade-off.'],
    project: ['Project: final cleanup', 'Check the repository is tidy, the README is accurate, and the project runs from a clean clone.'],
    revision: ['Revision: all mistake logs', 'Skim every problem you got wrong during these 14 days.'],
    career: [
      ['Confirm registration', 'Registration closed at 9:00 AM today. Verify that you received a confirmation and check your email and the placement portal.'],
      ['HR: final run-through', 'Rehearse your introduction, project explanation and why CRED once more.'],
    ],
  },
];

export const studyPlan: StudyDay[] = days.map((d, i) => {
  const n = i + 1;
  const sessions: PlanSession[] = [
    s(n, 1, 'DSA', d.dsa[0], d.dsa[1], 90),
    s(n, 2, 'Backend', d.backend[0], d.backend[1], 90),
    s(n, 3, 'Project', d.project[0], d.project[1], 90),
    s(n, 4, 'Revision', d.revision[0], d.revision[1], 60),
    ...d.career.map((c, k) => s(n, 5 + k, 'Career', c[0], c[1], d.career.length > 1 ? 15 : 30)),
  ];
  return { dayNumber: n, date: d.date, label: d.label, sessions };
});