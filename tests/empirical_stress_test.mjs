// tests/empirical_stress_test.mjs
import fs from 'node:fs';
import path from 'node:path';
import {
  classifyAgentIntent,
  isGreetingOrStatusQuery,
  generateLiveStateGreeting,
  sanitizeAiResponse,
  AGENT_REGISTRY,
} from '../src/services/groq.ts';

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`[PASS] ${testName}`);
  } else {
    failed++;
    console.error(`[FAIL] ${testName}: ${details}`);
    failures.push({ testName, details });
  }
}

console.log('====================================================');
console.log('1. STRESS-TESTING isGreetingOrStatusQuery');
console.log('====================================================');

const validGreetings = [
  'hi',
  'hello',
  'hey',
  'greetings',
  'howdy',
  'yo',
  'sup',
  'good morning',
  'good afternoon',
  'good evening',
  'status',
  'my status',
  'current status',
  'how am i doing',
  'how is my progress',
  "how's my progress",
  'what is my status',
  "what's my status",
  'where do i stand',
  'show my status',
  'HI',
  'Hello!',
  'hey???',
  'what is my status?',
  "how's my progress?",
  'yo!',
  'Hi there',
  'Hello mentor',
];

for (const g of validGreetings) {
  assert(isGreetingOrStatusQuery(g) === true, `isGreetingOrStatusQuery for "${g}"`, `Expected true, got false`);
}

const nonGreetings = [
  'Can you analyze my GitHub repository commits?',
  'Explain async promises using Python asyncio as a direct analogy.',
  'What are the 3 highest ROI full-stack projects for my resume?',
  'How does React Virtual DOM differ from direct DOM manipulation?',
  'I failed the assessment quiz, can you help me debug?',
  'What is the DAG dependency for Node.js?',
];

for (const ng of nonGreetings) {
  assert(isGreetingOrStatusQuery(ng) === false, `isGreetingOrStatusQuery for non-greeting "${ng}"`, `Expected false, got true`);
}

console.log('\n====================================================');
console.log('2. STRESS-TESTING classifyAgentIntent');
console.log('====================================================');

const intentCases = [
  // Greetings -> routed to adaptiveMentor
  { q: 'hi', expected: 'adaptiveMentor' },
  { q: 'hello', expected: 'adaptiveMentor' },
  { q: 'hey', expected: 'adaptiveMentor' },
  { q: 'what is my status', expected: 'adaptiveMentor' },
  { q: 'how am i doing', expected: 'adaptiveMentor' },
  { q: "how's my progress", expected: 'adaptiveMentor' },
  { q: 'where do i stand', expected: 'adaptiveMentor' },

  // Profiler-01 queries
  { q: 'Can you audit my github repository and git commit history?', expected: 'profiler' },
  { q: 'Inspect my AST analysis and verified strengths vs weaknesses.', expected: 'profiler' },
  { q: 'What certifications and verified skills are on my passport profile?', expected: 'profiler' },
  { q: 'Scan my past projects and existing python stack on github.', expected: 'profiler' },
  { q: 'Review my resume and verified strengths.', expected: 'profiler' },

  // GapArchitect-02 queries
  { q: 'What is my career delta and target role requirements for full stack?', expected: 'gapArchitect' },
  { q: 'Show my missing skill dependencies in the topological DAG roadmap.', expected: 'gapArchitect' },
  { q: 'What is my current readiness percentage and career match path?', expected: 'gapArchitect' },
  { q: 'Show the missing gaps and ROI for my target role.', expected: 'gapArchitect' },
  { q: 'Analyze my market job path and dependency roadmap.', expected: 'gapArchitect' },

  // PolyglotCurator-03 queries
  { q: 'Explain async promises using Python asyncio as a direct analogy.', expected: 'polyglotCurator' },
  { q: 'How does React Virtual DOM differ from direct DOM manipulation in JS?', expected: 'polyglotCurator' },
  { q: 'Explain closures, event loop, and middleware syntax.', expected: 'polyglotCurator' },
  { q: 'Give me courses, tutorials, and practical exercises comparing python to react.', expected: 'polyglotCurator' },
  { q: 'Show me the brain diff code comparison between python and javascript.', expected: 'polyglotCurator' },

  // AdaptiveMentor-04 queries
  { q: 'I failed the assessment quiz, can you help me debug my mistake?', expected: 'adaptiveMentor' },
  { q: 'Give me a socratic hint for this evaluation error and bug.', expected: 'adaptiveMentor' },
  { q: 'How should I prepare for my upcoming mock technical interview?', expected: 'adaptiveMentor' },
  { q: 'What remedial adjustments should I make for my assessment grade?', expected: 'adaptiveMentor' },
  { q: 'Guide my coaching sprint and interview prep.', expected: 'adaptiveMentor' },

  // Fallbacks and edge cases
  { q: '', expected: 'adaptiveMentor' },
  { q: '   ', expected: 'adaptiveMentor' },
  { q: '???', expected: 'adaptiveMentor' },
  { q: 'qwertyuiop asdfghjkl zxcvbnm', expected: 'adaptiveMentor' },
];

for (const c of intentCases) {
  const result = classifyAgentIntent(c.q);
  assert(
    result.key === c.expected,
    `classifyAgentIntent("${c.q}") -> ${result.key}`,
    `Expected ${c.expected}, got ${result.key}`
  );
}

// Adversarial intent case: null / undefined safety
try {
  // @ts-expect-error testing runtime robustness
  classifyAgentIntent(null);
  assert(true, 'classifyAgentIntent(null) handles null safely');
} catch (err) {
  assert(false, 'classifyAgentIntent(null) threw uncaught exception', String(err));
}

try {
  // @ts-expect-error testing runtime robustness
  classifyAgentIntent(undefined);
  assert(true, 'classifyAgentIntent(undefined) handles undefined safely');
} catch (err) {
  assert(false, 'classifyAgentIntent(undefined) threw uncaught exception', String(err));
}

console.log('\n====================================================');
console.log('3. STRESS-TESTING generateLiveStateGreeting');
console.log('====================================================');

const sampleCtxRemediation = {
  learnerName: 'Aarav Sharma',
  targetRole: 'Full Stack Developer',
  readiness: 42,
  currentSkills: ['Python', 'SQL'],
  hasRemediation: true,
  remedialTopic: 'JavaScript ES6+',
};

const greeting1 = generateLiveStateGreeting(AGENT_REGISTRY.adaptiveMentor, sampleCtxRemediation);
console.log('Greeting (with remediation):', JSON.stringify(greeting1));

// Sentence count: exactly 2 sentences
const sentences1 = greeting1.trim().split(/(?<=[.?!])\s+/);
assert(sentences1.length === 2, 'Greeting has exactly 2 sentences (with remediation)', `Found ${sentences1.length}: ${JSON.stringify(sentences1)}`);

// Live state inclusions
assert(greeting1.includes('Aarav'), 'Greeting includes learner name Aarav');
assert(greeting1.includes('Full Stack Developer'), 'Greeting includes target role Full Stack Developer');
assert(greeting1.includes('42%'), 'Greeting includes readiness percentage 42%');
assert(greeting1.includes('JavaScript ES6+'), 'Greeting includes active remediation topic JavaScript ES6+');
assert(greeting1.includes('active remediation flag'), 'Greeting includes active remediation flag text');

// Agent routing options mentioned
assert(greeting1.includes('Profiler-01'), 'Greeting mentions Profiler-01');
assert(greeting1.includes('GapArchitect-02'), 'Greeting mentions GapArchitect-02');
assert(greeting1.includes('PolyglotCurator-03'), 'Greeting mentions PolyglotCurator-03');

// Absence of code blocks or tutorial dumps
assert(!greeting1.includes('```'), 'Greeting contains NO triple backticks');
assert(!greeting1.includes('function') && !greeting1.includes('const ') && !greeting1.includes('let '), 'Greeting contains NO code constructs');

// Without remediation
const sampleCtxClean = {
  learnerName: 'Priya Patel',
  targetRole: 'AI/ML Engineer',
  readiness: 65,
  currentSkills: ['Python', 'PyTorch'],
  hasRemediation: false,
};

const greeting2 = generateLiveStateGreeting(AGENT_REGISTRY.adaptiveMentor, sampleCtxClean);
console.log('Greeting (clean):', JSON.stringify(greeting2));
const sentences2 = greeting2.trim().split(/(?<=[.?!])\s+/);
assert(sentences2.length === 2, 'Greeting has exactly 2 sentences (clean)', `Found ${sentences2.length}: ${JSON.stringify(sentences2)}`);
assert(greeting2.includes('Priya'), 'Greeting includes Priya');
assert(greeting2.includes('AI/ML Engineer'), 'Greeting includes AI/ML Engineer');
assert(greeting2.includes('65%'), 'Greeting includes 65%');
assert(!greeting2.includes('active remediation flag'), 'Greeting does not include remediation flag when false');

console.log('\n====================================================');
console.log('4. STRESS-TESTING sanitizeAiResponse (Emoji Purge)');
console.log('====================================================');

const emojiTestCases = [
  { raw: 'Hello Aarav 👋! Ready to code? 🚀', expected: 'Hello Aarav ! Ready to code?' },
  { raw: 'Dean Intervention 🏛️ approved.', expected: 'Dean Intervention  approved.' },
  { raw: 'Step 1️⃣: Setup 2️⃣: Run 3️⃣: Test', expected: 'Step 1: Setup 2: Run 3: Test' },
  { raw: 'Great work! 👍🏽 Keep it up! 💡🔥✨🎉🧠', expected: 'Great work!  Keep it up!' },
  { raw: 'Complex family: 👨‍👩‍👧‍👦 and coder: 🧑‍💻', expected: 'Complex family:  and coder:' },
  { raw: 'Symbols: ⚡ ⚙️ ⚠️ ❌ ✅ ⏳ ✈️', expected: 'Symbols:' },
  { raw: 'Pure clean text without emojis should remain identical.', expected: 'Pure clean text without emojis should remain identical.' },
  {
    raw: 'Code block test:\n```typescript\nconst x = 42;\n```\nDone.',
    expected: 'Code block test:\n```typescript\nconst x = 42;\n```\nDone.',
  },
  {
    raw: 'Bold and markdown: **Bold title** and *italic* and `inline`',
    expected: 'Bold and markdown: **Bold title** and *italic* and `inline`',
  },
  {
    raw: 'Non-latin unicode: 日本語 中文 العربية हिन्दी café naïve résumé',
    expected: 'Non-latin unicode: 日本語 中文 العربية हिन्दी café naïve résumé',
  },
];

const comprehensiveEmojiRegex = /\p{Extended_Pictographic}/u;

for (const tc of emojiTestCases) {
  const sanitized = sanitizeAiResponse(tc.raw);
  const containsEmoji = comprehensiveEmojiRegex.test(sanitized);
  assert(!containsEmoji, `Sanitized string contains no Extended_Pictographic: "${tc.raw.slice(0, 30)}..."`, `Got: "${sanitized}"`);
  
  if (tc.expected !== undefined) {
    const normSanitized = sanitized.replace(/\s+/g, ' ').trim();
    const normExpected = tc.expected.replace(/\s+/g, ' ').trim();
    assert(
      normSanitized === normExpected,
      `Sanitization result matches expectation for "${tc.raw.slice(0, 30)}..."`,
      `Expected "${normExpected}", got "${normSanitized}"`
    );
  }
}

// Regional indicator / country flag test
const flags = 'Flag test: 🇺🇸 🇬🇧 🇫🇷 🇩🇪 🇯🇵 🇮🇳';
const sanitizedFlags = sanitizeAiResponse(flags);
const hasUnstrippedFlags = /[\u{1F1E6}-\u{1F1FF}]/u.test(sanitizedFlags);
assert(!hasUnstrippedFlags, 'sanitizeAiResponse strips regional indicator country flags (🇺🇸 etc.)', `Unstripped flags remained: "${sanitizedFlags}"`);

console.log('\n====================================================');
console.log('5. AUDITING ENTIRE REPOSITORY (src/) FOR EMOJIS');
console.log('====================================================');

function walk(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) results = results.concat(walk(p));
    else if (f.endsWith('.ts') || f.endsWith('.tsx')) results.push(p);
  }
  return results;
}

const emojiRegex = /\p{Extended_Pictographic}/u;
let totalEmojisInSrc = 0;
const emojiMatches = [];

for (const file of walk('src')) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Exclude regex definitions in groq.ts
    if (line.includes('Extended_Pictographic') || line.includes('replace(')) return;
    if (emojiRegex.test(line)) {
      totalEmojisInSrc++;
      emojiMatches.push(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

assert(totalEmojisInSrc === 0, 'Zero emojis in src/ source code', `Found ${totalEmojisInSrc} matches: ${emojiMatches.join('; ')}`);

console.log('\n====================================================');
console.log('6. CHAT BUBBLE MARKDOWN RENDERER TEST (renderMessageContent logic)');
console.log('====================================================');

const codeBlockRegex = /(```[\w-]*\r?\n[\s\S]*?```|```[\s\S]*?```)/g;
const boldRegex = /(\*\*[^*]+?\*\*)/g;

function simulateRenderMessageContent(content) {
  if (!content) return [];
  const parts = content.split(codeBlockRegex);
  const elements = [];
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('```') && part.endsWith('```') && part.length >= 6) {
      const inner = part.slice(3, -3);
      const firstLineBreak = inner.indexOf('\n');
      let code = inner;
      if (firstLineBreak !== -1) {
        const potentialLang = inner.slice(0, firstLineBreak).trim();
        if (/^[a-zA-Z0-9_#-]+$/.test(potentialLang)) {
          code = inner.slice(firstLineBreak + 1);
        }
      }
      code = code.replace(/\r?\n$/, '');
      elements.push({ type: 'code_block', code });
    } else {
      const textSegments = part.split(boldRegex);
      for (const seg of textSegments) {
        if (!seg) continue;
        if (seg.startsWith('**') && seg.endsWith('**') && seg.length >= 4) {
          elements.push({ type: 'bold', text: seg.slice(2, -2) });
        } else {
          elements.push({ type: 'text', text: seg });
        }
      }
    }
  }
  return elements;
}

const markdownSample = 'Here is **important** info:\n```typescript\nconst answer = 42;\n```\nAnd **more** details.';
const parsedElements = simulateRenderMessageContent(markdownSample);

assert(parsedElements.some((e) => e.type === 'bold' && e.text === 'important'), 'Markdown renderer extracts bold "important"');
assert(parsedElements.some((e) => e.type === 'bold' && e.text === 'more'), 'Markdown renderer extracts bold "more"');
assert(parsedElements.some((e) => e.type === 'code_block' && e.code === 'const answer = 42;'), 'Markdown renderer strips backticks and language tag');

console.log('\n====================================================');
console.log('SUMMARY');
console.log('====================================================');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failures.length > 0) {
  console.log('\nFailures summary:');
  for (const f of failures) {
    console.log(`- ${f.testName}: ${f.details}`);
  }
}
