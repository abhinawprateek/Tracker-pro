// src/lib/studyContent.ts
// Practice problems, study resources and test actions for each task in the 14-day plan.
// Content is keyed by task id (for example "d1_1"), so your saved progress is never affected.

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Problem = { slug: string; title: string; difficulty: Difficulty };
export type Resource = { title: string; url: string };

export type TestAction =
  | { type: 'quiz'; topic: string; label: string }
  | { type: 'mock'; preset: string; label: string }
  | { type: 'interview'; kind: 'All' | 'HR' | 'Technical'; count: number; label: string }
  | { type: 'gd'; topicId?: string; label: string };

export type TaskContent = { problems?: Problem[]; resources?: Resource[]; actions?: TestAction[] };

export const leetcodeUrl = (slug: string) => `https://leetcode.com/problems/${slug}/`;

const catalog: Record<string, [string, Difficulty]> = {
  'two-sum': ['Two Sum', 'Easy'],
  'best-time-to-buy-and-sell-stock': ['Best Time to Buy and Sell Stock', 'Easy'],
  'contains-duplicate': ['Contains Duplicate', 'Easy'],
  'maximum-subarray': ['Maximum Subarray', 'Medium'],
  'valid-palindrome': ['Valid Palindrome', 'Easy'],
  'two-sum-ii-input-array-is-sorted': ['Two Sum II - Input Array Is Sorted', 'Medium'],
  'container-with-most-water': ['Container With Most Water', 'Medium'],
  '3sum': ['3Sum', 'Medium'],
  'valid-anagram': ['Valid Anagram', 'Easy'],
  'group-anagrams': ['Group Anagrams', 'Medium'],
  'top-k-frequent-elements': ['Top K Frequent Elements', 'Medium'],
  'longest-substring-without-repeating-characters': ['Longest Substring Without Repeating Characters', 'Medium'],
  'permutation-in-string': ['Permutation in String', 'Medium'],
  'longest-repeating-character-replacement': ['Longest Repeating Character Replacement', 'Medium'],
  'valid-parentheses': ['Valid Parentheses', 'Easy'],
  'min-stack': ['Min Stack', 'Medium'],
  'daily-temperatures': ['Daily Temperatures', 'Medium'],
  'implement-queue-using-stacks': ['Implement Queue using Stacks', 'Easy'],
  'reverse-linked-list': ['Reverse Linked List', 'Easy'],
  'merge-two-sorted-lists': ['Merge Two Sorted Lists', 'Easy'],
  'linked-list-cycle': ['Linked List Cycle', 'Easy'],
  'remove-nth-node-from-end-of-list': ['Remove Nth Node From End of List', 'Medium'],
  'binary-search': ['Binary Search', 'Easy'],
  'search-in-rotated-sorted-array': ['Search in Rotated Sorted Array', 'Medium'],
  'sort-an-array': ['Sort an Array (implement Merge Sort)', 'Medium'],
  'kth-largest-element-in-an-array': ['Kth Largest Element in an Array', 'Medium'],
  'powx-n': ['Pow(x, n)', 'Medium'],
  'subsets': ['Subsets', 'Medium'],
  'permutations': ['Permutations', 'Medium'],
  'generate-parentheses': ['Generate Parentheses', 'Medium'],
  'maximum-depth-of-binary-tree': ['Maximum Depth of Binary Tree', 'Easy'],
  'invert-binary-tree': ['Invert Binary Tree', 'Easy'],
  'binary-tree-level-order-traversal': ['Binary Tree Level Order Traversal', 'Medium'],
  'validate-binary-search-tree': ['Validate Binary Search Tree', 'Medium'],
  'number-of-islands': ['Number of Islands', 'Medium'],
  'flood-fill': ['Flood Fill', 'Easy'],
  'rotting-oranges': ['Rotting Oranges', 'Medium'],
  'clone-graph': ['Clone Graph', 'Medium'],
  'climbing-stairs': ['Climbing Stairs', 'Easy'],
  'house-robber': ['House Robber', 'Medium'],
  'coin-change': ['Coin Change', 'Medium'],
  'move-zeroes': ['Move Zeroes', 'Easy'],
  'find-all-anagrams-in-a-string': ['Find All Anagrams in a String', 'Medium'],
  'evaluate-reverse-polish-notation': ['Evaluate Reverse Polish Notation', 'Medium'],
  'product-of-array-except-self': ['Product of Array Except Self', 'Medium'],
  'merge-intervals': ['Merge Intervals', 'Medium'],
  'lru-cache': ['LRU Cache', 'Medium'],
  'course-schedule': ['Course Schedule', 'Medium'],
  'longest-consecutive-sequence': ['Longest Consecutive Sequence', 'Medium'],
  'binary-tree-right-side-view': ['Binary Tree Right Side View', 'Medium'],
  'min-cost-climbing-stairs': ['Min Cost Climbing Stairs', 'Easy'],
};

const pr = (...slugs: string[]): Problem[] =>
  slugs.map((slug) => ({ slug, title: catalog[slug][0], difficulty: catalog[slug][1] }));

const R = {
  neetcode: { title: 'NeetCode roadmap: topic-wise problem list with video explanations', url: 'https://neetcode.io/roadmap' },
  bigO: { title: 'Big-O cheat sheet', url: 'https://www.bigocheatsheet.com/' },
  mdnOverview: { title: 'MDN: An overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
  mdnMethods: { title: 'MDN: HTTP request methods', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' },
  mdnStatus: { title: 'MDN: HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
  dns: { title: 'Cloudflare: What is DNS?', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
  fastapi: { title: 'FastAPI tutorial (Python)', url: 'https://fastapi.tiangolo.com/tutorial/' },
  spring: { title: 'Spring guide: building a RESTful web service (Java)', url: 'https://spring.io/guides/gs/rest-service/' },
  rest: { title: 'REST API tutorial', url: 'https://restfulapi.net/' },
  idem: { title: 'REST API tutorial: idempotent methods', url: 'https://restfulapi.net/idempotent-rest-apis/' },
  json: { title: 'Introducing JSON', url: 'https://www.json.org/json-en.html' },
  sqlbolt: { title: 'SQLBolt: interactive SQL lessons', url: 'https://sqlbolt.com/' },
  w3join: { title: 'W3Schools: SQL joins', url: 'https://www.w3schools.com/sql/sql_join.asp' },
  pgTutorial: { title: 'PostgreSQL tutorial', url: 'https://www.postgresqltutorial.com/' },
  indexLuke: { title: 'Use The Index, Luke: how indexes work', url: 'https://use-the-index-luke.com/' },
  pgExplain: { title: 'PostgreSQL docs: using EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html' },
  acid: { title: 'GeeksforGeeks: ACID properties in DBMS', url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/' },
  normal: { title: 'GeeksforGeeks: normal forms in DBMS', url: 'https://www.geeksforgeeks.org/normal-forms-in-dbms/' },
  jwt: { title: 'jwt.io: introduction to JSON Web Tokens', url: 'https://jwt.io/introduction' },
  owaspPw: { title: 'OWASP: password storage cheat sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
  ostep: { title: 'Operating Systems: Three Easy Pieces (free book)', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
  tls: { title: 'Cloudflare: what happens in a TLS handshake', url: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/' },
  udp: { title: 'Cloudflare: User Datagram Protocol (UDP)', url: 'https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/' },
  lb: { title: 'Cloudflare: what is load balancing?', url: 'https://www.cloudflare.com/learning/performance/what-is-load-balancing/' },
  rate: { title: 'Cloudflare: what is rate limiting?', url: 'https://www.cloudflare.com/learning/bots/what-is-rate-limiting/' },
  caching: { title: 'AWS: caching overview', url: 'https://aws.amazon.com/caching/' },
  sdp: { title: 'System Design Primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' },
  stripeIdem: { title: 'Stripe docs: idempotent requests (a payments example)', url: 'https://stripe.com/docs/api/idempotent_requests' },
  pytest: { title: 'pytest: getting started (Python)', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
  junit: { title: 'JUnit 5 user guide (Java)', url: 'https://junit.org/junit5/docs/current/user-guide/' },
  readme: { title: 'Make a README', url: 'https://www.makeareadme.com/' },
};

const quiz = (topic: string): TestAction => ({ type: 'quiz', topic, label: topic === 'Mixed' ? 'Take a mixed quiz' : `Take the ${topic} quiz` });
const gd = (topicId?: string): TestAction => ({ type: 'gd', topicId, label: 'Start a GD practice' });
const interview = (kind: 'All' | 'HR' | 'Technical', count: number): TestAction => ({
  type: 'interview',
  kind,
  count,
  label: kind === 'All' ? `Start a ${count}-question mock interview` : `Practise ${kind} interview questions`,
});
const mock = (preset: string, label: string): TestAction => ({ type: 'mock', preset, label });

export const taskContent: Record<string, TaskContent> = {
  // Day 1
  d1_1: { problems: pr('two-sum', 'best-time-to-buy-and-sell-stock', 'contains-duplicate', 'maximum-subarray'), resources: [R.neetcode, R.bigO] },
  d1_2: { resources: [R.mdnOverview, R.mdnMethods, R.mdnStatus, R.dns] },
  d1_3: { resources: [R.fastapi, R.spring] },
  d1_4: { problems: pr('two-sum', 'contains-duplicate'), actions: [quiz('DSA and Big-O')] },
  // Day 2
  d2_1: { problems: pr('valid-palindrome', 'two-sum-ii-input-array-is-sorted', 'container-with-most-water', '3sum'), resources: [R.neetcode] },
  d2_2: { resources: [R.rest, R.json, R.mdnMethods] },
  d2_3: { resources: [R.fastapi, R.spring] },
  d2_4: { problems: pr('valid-palindrome', 'two-sum-ii-input-array-is-sorted'), actions: [quiz('HTTP and REST')] },
  // Day 3
  d3_1: { problems: pr('valid-anagram', 'group-anagrams', 'top-k-frequent-elements'), resources: [R.neetcode] },
  d3_2: { resources: [R.idem, R.rest, R.mdnStatus] },
  d3_4: { problems: pr('valid-anagram', 'group-anagrams'), actions: [quiz('HTTP and REST')] },
  // Day 4
  d4_1: { problems: pr('longest-substring-without-repeating-characters', 'permutation-in-string', 'longest-repeating-character-replacement'), resources: [R.neetcode] },
  d4_2: { resources: [R.sqlbolt, R.w3join] },
  d4_3: { resources: [R.pgTutorial] },
  d4_4: { problems: pr('longest-substring-without-repeating-characters'), actions: [quiz('SQL and databases')] },
  d4_5: { actions: [gd('digital-payments')] },
  // Day 5
  d5_1: { problems: pr('valid-parentheses', 'min-stack', 'daily-temperatures', 'implement-queue-using-stacks'), resources: [R.neetcode] },
  d5_2: { resources: [R.indexLuke, R.pgExplain] },
  d5_4: { problems: pr('valid-parentheses', 'daily-temperatures'), actions: [quiz('SQL and databases')] },
  d5_5: { actions: [gd('credit-trust')] },
  // Day 6
  d6_1: { problems: pr('reverse-linked-list', 'merge-two-sorted-lists', 'linked-list-cycle', 'remove-nth-node-from-end-of-list'), resources: [R.neetcode] },
  d6_2: { resources: [R.acid, R.normal] },
  d6_4: { problems: pr('reverse-linked-list', 'linked-list-cycle'), actions: [quiz('SQL and databases')] },
  d6_5: { actions: [interview('HR', 5)] },
  // Day 7
  d7_1: { problems: pr('move-zeroes', 'find-all-anagrams-in-a-string', 'evaluate-reverse-polish-notation'), actions: [mock('day7', 'Start the 45-minute timed mock')] },
  d7_2: { actions: [quiz('Mixed')] },
  d7_3: { resources: [R.readme] },
  d7_5: { actions: [interview('HR', 5)] },
  // Day 8
  d8_1: { problems: pr('binary-search', 'search-in-rotated-sorted-array', 'sort-an-array', 'kth-largest-element-in-an-array'), resources: [R.neetcode] },
  d8_2: { resources: [R.jwt, R.owaspPw] },
  d8_4: { problems: pr('binary-search', 'search-in-rotated-sorted-array'), actions: [quiz('Auth and security')] },
  d8_5: { actions: [gd('ai-workplace')] },
  // Day 9
  d9_1: { problems: pr('powx-n', 'subsets', 'permutations', 'generate-parentheses'), resources: [R.neetcode] },
  d9_2: { resources: [R.ostep] },
  d9_4: { problems: pr('subsets', 'permutations'), actions: [quiz('OS and networking')] },
  d9_5: { actions: [interview('Technical', 5)] },
  // Day 10
  d10_1: { problems: pr('maximum-depth-of-binary-tree', 'invert-binary-tree', 'binary-tree-level-order-traversal', 'validate-binary-search-tree'), resources: [R.neetcode] },
  d10_2: { resources: [R.tls, R.dns, R.udp] },
  d10_3: { resources: [R.pytest, R.junit] },
  d10_4: { problems: pr('maximum-depth-of-binary-tree', 'binary-tree-level-order-traversal'), actions: [quiz('OS and networking')] },
  d10_5: { actions: [interview('All', 5)] },
  // Day 11
  d11_1: { problems: pr('number-of-islands', 'flood-fill', 'rotting-oranges', 'clone-graph'), resources: [R.neetcode] },
  d11_2: { resources: [R.caching, R.lb, R.rate] },
  d11_4: { problems: pr('number-of-islands'), actions: [quiz('System design')] },
  d11_5: { actions: [gd()] },
  // Day 12
  d12_1: { problems: pr('climbing-stairs', 'house-robber', 'coin-change'), resources: [R.neetcode] },
  d12_2: { resources: [R.sdp, R.stripeIdem] },
  d12_4: { problems: pr('climbing-stairs', 'house-robber'), actions: [quiz('System design')] },
  d12_5: { actions: [interview('HR', 5)] },
  // Day 13
  d13_1: { problems: pr('product-of-array-except-self', 'merge-intervals', 'lru-cache', 'course-schedule'), actions: [mock('day13', 'Start the 90-minute timed mock')] },
  d13_2: { resources: [R.pytest, R.junit] },
  d13_4: { actions: [quiz('Mixed')] },
  d13_5: { actions: [interview('All', 8), gd()] },
  // Day 14
  d14_1: { problems: pr('longest-consecutive-sequence', 'binary-tree-right-side-view', 'min-cost-climbing-stairs'), actions: [mock('day14', 'Start the 60-minute final mock')] },
  d14_2: { actions: [interview('Technical', 5)] },
  d14_4: { actions: [quiz('Mixed')] },
  d14_6: { actions: [interview('HR', 5)] },
};

export type MockPreset = { id: string; title: string; minutes: number; problems: Problem[] };

export const mockPresets: MockPreset[] = [
  { id: 'day7', title: 'Mock 1: foundations (Days 1 to 6)', minutes: 45, problems: pr('move-zeroes', 'find-all-anagrams-in-a-string', 'evaluate-reverse-polish-notation') },
  { id: 'day13', title: 'Mock 2: mixed medium set', minutes: 90, problems: pr('product-of-array-except-self', 'merge-intervals', 'lru-cache', 'course-schedule') },
  { id: 'day14', title: 'Final mock', minutes: 60, problems: pr('longest-consecutive-sequence', 'binary-tree-right-side-view', 'min-cost-climbing-stairs') },
];

// Every distinct problem used anywhere in the plan, for the progress summary and random mocks.
export const allProblems: Problem[] = (() => {
  const seen: Record<string, boolean> = {};
  const out: Problem[] = [];
  const add = (list?: Problem[]) =>
    (list || []).forEach((p) => {
      if (!seen[p.slug]) {
        seen[p.slug] = true;
        out.push(p);
      }
    });
  Object.keys(taskContent).forEach((k) => add(taskContent[k].problems));
  mockPresets.forEach((m) => add(m.problems));
  return out;
})();

// Same content applies to a task that was carried over to a later day (its id gets a _cf suffix).
export const contentFor = (id: string): TaskContent | undefined => taskContent[id.replace(/(_cf)+$/, '')];
