// ============================================================
// src/data/scenarios.ts — All career path scenario data
// ============================================================
import type { ScenarioConfig, NodeContent, CohortStudent } from '../types';

// ─── FULL STACK DEVELOPER ────────────────────────────────────
export const FULLSTACK_SCENARIO: ScenarioConfig = {
  id: 'fullstack',
  label: 'Full Stack Developer',
  description: 'Python + SQL + HTML → React, Node.js, Full Stack',
  targetRole: 'Full Stack Developer',
  readiness: 42,
  radarData: [
    { axis: 'Frontend\nReactivity', current: 15, target: 85 },
    { axis: 'Backend\nRuntime', current: 55, target: 90 },
    { axis: 'Data & SQL', current: 70, target: 75 },
    { axis: 'System\nDesign', current: 30, target: 80 },
    { axis: 'Async/APIs', current: 25, target: 90 },
  ],
  nodes: [
    { id: 'python', label: 'Python', sublabel: 'Advanced', status: 'mastered', x: 160, y: 80 },
    { id: 'sql', label: 'SQL', sublabel: 'Intermediate', status: 'mastered', x: 320, y: 80 },
    { id: 'html', label: 'HTML/CSS', sublabel: 'Foundation', status: 'mastered', x: 240, y: 180 },
    { id: 'js', label: 'JavaScript ES6+', sublabel: 'Missing Core', status: 'active', x: 240, y: 300 },
    { id: 'react', label: 'React UI Architecture', sublabel: 'Missing Core', status: 'locked', x: 160, y: 420 },
    { id: 'node', label: 'Node.js & Express APIs', sublabel: 'Missing Core', status: 'locked', x: 320, y: 420 },
    { id: 'capstone', label: 'Full Stack Capstone', sublabel: 'Portfolio Project', status: 'locked', x: 240, y: 540 },
  ],
  edges: [
    { from: 'python', to: 'js' },
    { from: 'sql', to: 'js' },
    { from: 'html', to: 'js' },
    { from: 'js', to: 'react' },
    { from: 'js', to: 'node' },
    { from: 'react', to: 'capstone' },
    { from: 'node', to: 'capstone' },
  ],
};

// ─── AI/ML SYSTEMS ENGINEER ──────────────────────────────────
export const AIML_SCENARIO: ScenarioConfig = {
  id: 'aiml',
  label: 'AI/ML Systems Engineer',
  description: 'Python + SQL → NumPy, PyTorch, MLOps',
  targetRole: 'AI/ML Systems Engineer',
  readiness: 55,
  radarData: [
    { axis: 'Frontend\nReactivity', current: 10, target: 30 },
    { axis: 'Backend\nRuntime', current: 55, target: 70 },
    { axis: 'Data & SQL', current: 70, target: 95 },
    { axis: 'System\nDesign', current: 30, target: 85 },
    { axis: 'Async/APIs', current: 40, target: 80 },
  ],
  nodes: [
    { id: 'python', label: 'Python', sublabel: 'Advanced', status: 'mastered', x: 240, y: 80 },
    { id: 'sql', label: 'SQL & Pandas', sublabel: 'Intermediate', status: 'mastered', x: 160, y: 180 },
    { id: 'numpy', label: 'NumPy / Linear Algebra', sublabel: 'Missing Core', status: 'active', x: 320, y: 180 },
    { id: 'ml', label: 'ML Fundamentals', sublabel: 'Missing Core', status: 'locked', x: 240, y: 300 },
    { id: 'pytorch', label: 'PyTorch Deep Learning', sublabel: 'Missing Core', status: 'locked', x: 160, y: 420 },
    { id: 'mlops', label: 'MLOps & Model Serving', sublabel: 'Missing Core', status: 'locked', x: 320, y: 420 },
    { id: 'capstone', label: 'AI/ML System Capstone', sublabel: 'Portfolio Project', status: 'locked', x: 240, y: 540 },
  ],
  edges: [
    { from: 'python', to: 'numpy' },
    { from: 'python', to: 'sql' },
    { from: 'sql', to: 'ml' },
    { from: 'numpy', to: 'ml' },
    { from: 'ml', to: 'pytorch' },
    { from: 'ml', to: 'mlops' },
    { from: 'pytorch', to: 'capstone' },
    { from: 'mlops', to: 'capstone' },
  ],
};

// ─── CLOUD BACKEND ARCHITECT ─────────────────────────────────
export const CLOUD_SCENARIO: ScenarioConfig = {
  id: 'cloud',
  label: 'Cloud Backend Architect',
  description: 'Python + SQL → Docker, Kubernetes, Cloud APIs',
  targetRole: 'Cloud Backend Architect',
  readiness: 38,
  radarData: [
    { axis: 'Frontend\nReactivity', current: 10, target: 20 },
    { axis: 'Backend\nRuntime', current: 55, target: 95 },
    { axis: 'Data & SQL', current: 70, target: 80 },
    { axis: 'System\nDesign', current: 30, target: 95 },
    { axis: 'Async/APIs', current: 25, target: 95 },
  ],
  nodes: [
    { id: 'python', label: 'Python', sublabel: 'Advanced', status: 'mastered', x: 240, y: 80 },
    { id: 'sql', label: 'SQL & Databases', sublabel: 'Intermediate', status: 'mastered', x: 160, y: 180 },
    { id: 'linux', label: 'Linux & Bash', sublabel: 'Missing Core', status: 'active', x: 320, y: 180 },
    { id: 'docker', label: 'Docker & Containers', sublabel: 'Missing Core', status: 'locked', x: 240, y: 300 },
    { id: 'k8s', label: 'Kubernetes Orchestration', sublabel: 'Missing Core', status: 'locked', x: 160, y: 420 },
    { id: 'cloud', label: 'AWS / GCP Cloud APIs', sublabel: 'Missing Core', status: 'locked', x: 320, y: 420 },
    { id: 'capstone', label: 'Cloud Architecture Capstone', sublabel: 'Portfolio Project', status: 'locked', x: 240, y: 540 },
  ],
  edges: [
    { from: 'python', to: 'linux' },
    { from: 'python', to: 'sql' },
    { from: 'sql', to: 'docker' },
    { from: 'linux', to: 'docker' },
    { from: 'docker', to: 'k8s' },
    { from: 'docker', to: 'cloud' },
    { from: 'k8s', to: 'capstone' },
    { from: 'cloud', to: 'capstone' },
  ],
};

export const SCENARIOS: Record<string, ScenarioConfig> = {
  fullstack: FULLSTACK_SCENARIO,
  aiml: AIML_SCENARIO,
  cloud: CLOUD_SCENARIO,
};

// ─── REMEDIAL NODE TEMPLATE ───────────────────────────────────
export const REMEDIAL_NODE = {
  id: 'remedial-async',
  label: 'Remedial Module: Async Execution',
  sublabel: 'Async Promises via Python Asyncio Analogy',
  status: 'remedial' as const,
  x: 350,
  y: 300,
  isRemedial: true,
};

export const REMEDIAL_EDGE_FROM = 'js';
export const REMEDIAL_EDGE_TO = 'react';

// ─── NODE CONTENT (Brain Diffs, Resources, Assessments) ──────
export const NODE_CONTENT: Record<string, NodeContent> = {
  js: {
    nodeId: 'js',
    brainDiff: {
      existingLang: 'Python',
      newLang: 'JavaScript ES6+',
      concept: 'Async Execution Model',
      existingCode: `# Python: async/await with asyncio
import asyncio

async def fetch_data(url: str) -> dict:
    """Fetches data asynchronously"""
    await asyncio.sleep(1)  # Non-blocking I/O
    return {"url": url, "data": "result"}

async def main():
    # Run tasks concurrently
    tasks = [
        fetch_data("api/users"),
        fetch_data("api/posts"),
    ]
    results = await asyncio.gather(*tasks)
    return results

# Event loop — same concept in JS!
asyncio.run(main())`,
      newCode: `// JavaScript ES6+: async/await with Promises
// EXACT same concept — different syntax!

async function fetchData(url) {
  // await = Python's "await", Promise = asyncio.Future
  const response = await fetch(url);
  return response.json();
}

async function main() {
  // Promise.all = Python's asyncio.gather()
  const [users, posts] = await Promise.all([
    fetchData('/api/users'),
    fetchData('/api/posts'),
  ]);
  return { users, posts };
}

// Browser event loop runs this — same idea!
main().then(data => console.log(data));`,
      explanation: 'Python\'s asyncio.gather() = JS Promise.all(). Python\'s async def = JS async function. The event loop is identical in concept — JS just had it first! Your Python async skills transfer directly.',
    },
    resources: [
      {
        title: 'JavaScript.info: Promises & Async/Await',
        source: 'javascript.info',
        duration: '25 min read',
        url: 'https://javascript.info/async',
        type: 'article',
      },
      {
        title: 'ES6+ for Python Developers (Fireship)',
        source: 'YouTube',
        duration: '12 min video',
        url: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
        type: 'video',
      },
    ],
    microSpec: {
      title: '15-min Mini Build: Async GitHub Profile Fetcher',
      description: 'Fetch a GitHub user\'s profile and repos concurrently using Promise.all(). Display name, avatar, and top 3 repos by stars.',
      artifact: 'github-fetcher.js — A standalone HTML+JS page that hits the GitHub API and renders results. Add to your portfolio!',
      timeEstimate: '15 minutes',
    },
    assessment: {
      question: 'Your Python code uses `asyncio.gather(task1, task2)`. What is the EXACT JavaScript equivalent?',
      code: `// Python original:
results = await asyncio.gather(fetch_users(), fetch_posts())

// JavaScript equivalent is...?`,
      options: [
        'Promise.all([fetch_users(), fetch_posts()])',
        'Promise.race([fetch_users(), fetch_posts()])',
        'async.parallel([fetch_users, fetch_posts])',
        'await fetch_users(); await fetch_posts();',
      ],
      correctIndex: 0,
      hint: 'Think about how asyncio.gather runs all tasks CONCURRENTLY and waits for ALL to finish...',
      wrongHint: 'The last option runs sequentially (one at a time), not concurrently. asyncio.gather = run ALL at once and wait for ALL to finish. Which JS API does exactly that?',
    },
  },
  react: {
    nodeId: 'react',
    brainDiff: {
      existingLang: 'Python',
      newLang: 'React + TypeScript',
      concept: 'State Management & Reactivity',
      existingCode: `# Python: Stateful class with methods
class UserDashboard:
    def __init__(self):
        self.count = 0        # State
        self.theme = "dark"   # State
    
    def increment(self):      # Mutates state
        self.count += 1
        self._re_render()     # Manual update!
    
    def toggle_theme(self):
        self.theme = "light" if self.theme == "dark" else "dark"
        self._re_render()
    
    def _re_render(self):     # You call this yourself
        print(f"Count: {self.count}, Theme: {self.theme}")`,
      newCode: `// React: useState = Python self.attribute + auto re-render
import { useState } from 'react';

function UserDashboard() {
  // [state, setter] = class attribute + self._re_render()
  const [count, setCount] = useState(0);       // self.count
  const [theme, setTheme] = useState('dark'); // self.theme
  
  // React re-renders automatically when state changes!
  // No need for self._re_render()
  
  return (
    <div className={\`dashboard \${theme}\`}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        +1
      </button>
      <button onClick={() => setTheme(t => 
        t === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </div>
  );
}`,
      explanation: 'React\'s useState() is your Python class self.attribute + automatic re-render. When you call setCount(), React diffs the virtual DOM and updates only what changed — like a smarter self._re_render().',
    },
    resources: [
      {
        title: 'React Docs: Thinking in React',
        source: 'react.dev',
        duration: '20 min read',
        url: 'https://react.dev/learn/thinking-in-react',
        type: 'article',
      },
      {
        title: 'React hooks crash course for Python devs',
        source: 'YouTube',
        duration: '18 min video',
        url: 'https://www.youtube.com/watch?v=4UZrsTqkcW4',
        type: 'video',
      },
    ],
    microSpec: {
      title: '15-min Mini Build: Habit Tracker Component',
      description: 'Build a React component with useState that tracks 3 daily habits with toggle checkboxes and shows completion percentage.',
      artifact: 'HabitTracker.tsx — A fully typed React component. Great portfolio piece!',
      timeEstimate: '15 minutes',
    },
    assessment: {
      question: 'What\'s WRONG with this React code that mutates state directly (like Python)?',
      code: `function Counter() {
  const [count, setCount] = useState(0);
  
  function handleClick() {
    count = count + 1; // ← Python-style mutation
    // Why doesn't the UI update?
  }
  
  return <button onClick={handleClick}>{count}</button>;
}`,
      options: [
        'count is a const — use setCount(count + 1) to trigger re-render',
        'Need to call this.setState() instead',
        'Missing useEffect to watch count changes',
        'React requires class components for mutable state',
      ],
      correctIndex: 0,
      hint: 'In Python you mutate self.attribute directly. In React, state variables are immutable snapshots — you must call the setter function...',
      wrongHint: 'The key insight: React state variables are const — you CAN\'T mutate them directly. The setter function (setCount) tells React "hey, state changed, please re-render!"',
    },
  },
  node: {
    nodeId: 'node',
    brainDiff: {
      existingLang: 'Python Flask',
      newLang: 'Node.js + Express',
      concept: 'REST API Server',
      existingCode: `# Python Flask REST API
from flask import Flask, request, jsonify
from functools import wraps

app = Flask(__name__)
db = {}  # In-memory store

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/users/<int:user_id>', methods=['GET'])
@auth_required
def get_user(user_id: int):
    user = db.get(user_id)
    if not user:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(user), 200

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    user_id = len(db) + 1
    db[user_id] = data
    return jsonify({'id': user_id, **data}), 201`,
      newCode: `// Node.js + Express REST API — same structure!
import express from 'express';
const app = express();
app.use(express.json()); // = Flask's request.json

const db = new Map(); // In-memory store

// Middleware = Python decorator @auth_required
const authRequired = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next(); // = calling the wrapped function
};

// Route = @app.route('/api/users/<int:user_id>', GET)
app.get('/api/users/:userId', authRequired, (req, res) => {
  const user = db.get(Number(req.params.userId));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user); // = jsonify(user), 200
});

app.post('/api/users', (req, res) => {
  const userId = db.size + 1;
  db.set(userId, req.body);
  res.status(201).json({ id: userId, ...req.body });
});

app.listen(3000, () => console.log('Running on :3000'));`,
      explanation: 'Flask decorators = Express middleware. @app.route = app.get/post. request.json = req.body. jsonify() = res.json(). The mental model is identical — you\'re already 70% there!',
    },
    resources: [
      {
        title: 'Express.js: Getting Started Guide',
        source: 'expressjs.com',
        duration: '15 min read',
        url: 'https://expressjs.com/en/starter/hello-world.html',
        type: 'article',
      },
      {
        title: 'Node.js REST API — Full Course (Traversy)',
        source: 'YouTube',
        duration: '20 min video',
        url: 'https://www.youtube.com/watch?v=ENrzD9HAZK4',
        type: 'video',
      },
    ],
    microSpec: {
      title: '15-min Mini Build: Todo REST API',
      description: 'Build a 4-route Express.js REST API (GET all, GET one, POST create, DELETE) for a Todo list with in-memory storage.',
      artifact: 'todo-api.js — A complete Node.js+Express server you can test with curl or Postman.',
      timeEstimate: '15 minutes',
    },
    assessment: {
      question: 'Convert this Flask middleware pattern to Express.js:',
      code: `# Flask: decorator as middleware
@app.before_request
def log_request():
    print(f"[{request.method}] {request.path}")

# Express equivalent?`,
      options: [
        "app.use((req, res, next) => { console.log(`[${req.method}] ${req.path}`); next(); })",
        "app.middleware(() => console.log(req.method))",
        "express.before((req) => console.log(req.method))",
        "@app.use def log_request(): pass",
      ],
      correctIndex: 0,
      hint: 'Flask\'s @before_request runs before every route. In Express, middleware using app.use() with no path prefix runs for every request...',
      wrongHint: 'Flask\'s @app.before_request = Express\'s app.use() with no path. The key: call next() in Express or the request chain stops (like returning from a decorator without calling the wrapped function).',
    },
  },
  'remedial-async': {
    nodeId: 'remedial-async',
    brainDiff: {
      existingLang: 'Python asyncio',
      newLang: 'JavaScript Promises & Event Loop',
      concept: 'Async Execution Deep Dive',
      existingCode: `# Python asyncio — you know this!
import asyncio

async def step1():
    print("Step 1 start")
    await asyncio.sleep(1)  # Yields control
    print("Step 1 done")
    return "result1"

async def step2():
    print("Step 2 start")  
    await asyncio.sleep(0.5)
    print("Step 2 done")
    return "result2"

# asyncio.gather = run BOTH concurrently
async def main():
    r1, r2 = await asyncio.gather(step1(), step2())
    print(r1, r2)
# Output order: Step1 start, Step2 start, Step2 done, Step1 done`,
      newCode: `// JavaScript — exact same event loop behavior!
// The JS event loop predates Python's asyncio

function step1() {
  return new Promise(async (resolve) => {
    console.log("Step 1 start");
    await new Promise(r => setTimeout(r, 1000)); // sleep(1)
    console.log("Step 1 done");
    resolve("result1");
  });
}

function step2() {
  return new Promise(async (resolve) => {
    console.log("Step 2 start");
    await new Promise(r => setTimeout(r, 500)); // sleep(0.5)
    console.log("Step 2 done");
    resolve("result2");
  });
}

// Promise.all = asyncio.gather — same output order!
async function main() {
  const [r1, r2] = await Promise.all([step1(), step2()]);
  console.log(r1, r2);
}
main();`,
      explanation: 'Your Python asyncio knowledge is gold here. The event loop, coroutines, gather — all identical concepts. JS just calls them Promises instead of Coroutines. You\'re rescuing this skill, not learning from scratch!',
    },
    resources: [
      {
        title: 'JavaScript Event Loop Visualized (Jake Archibald)',
        source: 'YouTube',
        duration: '15 min video',
        url: 'https://www.youtube.com/watch?v=cCOL7MC4Pl0',
        type: 'video',
      },
      {
        title: 'Promises for Python Developers',
        source: 'dev.to',
        duration: '8 min read',
        url: 'https://dev.to/pydevsg/mastering-javascript-promises-from-a-python-asyncio-perspective',
        type: 'article',
      },
    ],
    microSpec: {
      title: '10-min Mini Build: Async Race Timer',
      description: 'Write 3 async functions with different delays using Promise.all(), then log which finishes first. Understand concurrency vs. parallelism.',
      artifact: 'async-race.js — Runnable in Node.js or browser console. Proves you understand JS async!',
      timeEstimate: '10 minutes',
    },
    assessment: {
      question: 'Which Promise method mirrors Python\'s asyncio.wait_for() with a timeout?',
      code: `# Python:
async def fetch_with_timeout():
    try:
        result = await asyncio.wait_for(
            fetch_data(), timeout=5.0
        )
    except asyncio.TimeoutError:
        result = "timeout!"`,
      options: [
        'Promise.race([fetch_data(), timeoutPromise(5000)])',
        'Promise.all([fetch_data(), timeoutPromise(5000)])',
        'fetch_data().timeout(5000)',
        'await fetch_data({ timeout: 5000 })',
      ],
      correctIndex: 0,
      hint: 'asyncio.wait_for races the task against a timeout. Which Promise method resolves/rejects with whichever finishes FIRST?',
      wrongHint: 'Promise.race() resolves/rejects as soon as the FIRST promise settles — perfect for implementing timeouts. Create a "timeout promise" with setTimeout that rejects after N ms, then race it against your real fetch.',
    },
  },
  capstone: {
    nodeId: 'capstone',
    brainDiff: {
      existingLang: 'Python Flask + Jinja',
      newLang: 'React + Node.js Full Stack',
      concept: 'Full Stack Architecture',
      existingCode: `# Python Full Stack: Flask + Jinja Templates
# Backend and frontend are coupled

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    users = db.query("SELECT * FROM users")
    # Template rendered server-side
    return render_template('index.html', users=users)

# index.html (Jinja template):
# {% for user in users %}
#   <div>{{ user.name }}</div>
# {% endfor %}
# Full page refresh on every interaction!`,
      newCode: `// Modern Full Stack: React SPA + Node.js API
// Frontend and Backend are DECOUPLED

// === Backend: Node.js + Express ===
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users); // Just JSON, no HTML
});

// === Frontend: React (runs in browser) ===
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers);
  }, []);
  
  return (
    <div>
      {users.map(u => <div key={u.id}>{u.name}</div>)}
    </div>
  );
  // No page refresh! React updates only changed parts.
}`,
      explanation: 'Flask renders HTML server-side (coupled). Modern full stack decouples: Node.js exposes a JSON API, React consumes it in the browser. Result: faster UX, shared backend for web/mobile, and scalability.',
    },
    resources: [
      {
        title: 'Full Stack Open: React + Node.js (University of Helsinki)',
        source: 'fullstackopen.com',
        duration: 'Self-paced course',
        url: 'https://fullstackopen.com',
        type: 'interactive',
      },
      {
        title: 'MERN Stack Crash Course (Traversy Media)',
        source: 'YouTube',
        duration: '45 min video',
        url: 'https://www.youtube.com/watch?v=ktjafK4SgWM',
        type: 'video',
      },
    ],
    microSpec: {
      title: '15-min Mini Build: Full Stack Todo App',
      description: 'Wire a React frontend (useState + fetch) to an Express backend (GET /api/todos, POST /api/todos) with an in-memory store.',
      artifact: 'Full Stack Todo App — deployed locally with 2 terminals. Add a README and push to GitHub for your portfolio!',
      timeEstimate: '15 minutes',
    },
    assessment: {
      question: 'In a React + Node.js full stack app, where should user authentication logic live?',
      code: `// Option A: Validate JWT in React component
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const isValid = verifyJWT(token, SECRET_KEY); // ← client-side
  return isValid ? children : <Redirect to="/login" />;
}

// Option B: Validate JWT in Express middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  verifyJWT(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  });
};`,
      options: [
        'Option B — authentication must be enforced on the server; client-side is bypassable',
        'Option A — faster, no network round-trip needed',
        'Both — verify on client for UX, verify on server for security',
        'Neither — use sessions cookies instead of JWT',
      ],
      correctIndex: 0,
      hint: 'The browser runs client-side code — a user can open DevTools and modify any JavaScript. Where should the actual security gate be?',
      wrongHint: 'Client-side auth is a UX hint, not a security measure. Any user can open DevTools, delete the localStorage check, and bypass it. The JWT MUST be verified on the server for every protected API call.',
    },
  },
};

// ─── COHORT DATA ──────────────────────────────────────────────
export const COHORT_STUDENTS: CohortStudent[] = [
  {
    id: 's1',
    name: 'Priya Kapoor',
    dept: 'CS — Full Stack Track',
    verifiedSkills: ['Python', 'SQL', 'HTML/CSS'],
    missingSkills: ['JavaScript ES6+', 'React', 'Node.js'],
    assessmentVelocity: 2.3,
    readiness: 42,
    aiIntervention: 'Deploy Python→JS Brain-Diff Module',
  },
  {
    id: 's2',
    name: 'Rahul Singh',
    dept: 'CS — Full Stack Track',
    verifiedSkills: ['Python', 'SQL', 'HTML/CSS', 'JavaScript ES6+'],
    missingSkills: ['React', 'Node.js', 'REST APIs'],
    assessmentVelocity: 3.1,
    readiness: 61,
    aiIntervention: 'Accelerate to React Architecture Sprint',
  },
  {
    id: 's3',
    name: 'Anjali Verma',
    dept: 'CS — AI/ML Track',
    verifiedSkills: ['Python', 'SQL', 'NumPy'],
    missingSkills: ['PyTorch', 'MLOps', 'Model Serving'],
    assessmentVelocity: 1.8,
    readiness: 55,
    aiIntervention: 'Reinforce Linear Algebra via NumPy Exercises',
  },
  {
    id: 's4',
    name: 'Dev Patel',
    dept: 'ECE — Cloud Track',
    verifiedSkills: ['Python', 'Linux'],
    missingSkills: ['Docker', 'Kubernetes', 'AWS APIs', 'SQL'],
    assessmentVelocity: 1.2,
    readiness: 31,
    aiIntervention: 'Critical: SQL Foundations + Docker Basics Sprint',
  },
  {
    id: 's5',
    name: 'Meera Nair',
    dept: 'CS — Full Stack Track',
    verifiedSkills: ['Python', 'SQL', 'HTML/CSS', 'JavaScript ES6+', 'React'],
    missingSkills: ['Node.js', 'System Design'],
    assessmentVelocity: 4.2,
    readiness: 78,
    aiIntervention: 'Fast-track: System Design Mock Interviews',
  },
  {
    id: 's6',
    name: 'Arjun Rao',
    dept: 'ECE — Cloud Track',
    verifiedSkills: ['Python', 'Linux', 'Docker'],
    missingSkills: ['Kubernetes', 'AWS APIs', 'Terraform'],
    assessmentVelocity: 2.9,
    readiness: 52,
    aiIntervention: 'Deploy K8s Hands-On Lab Environment',
  },
];

// ─── AI CHAT RESPONSE TEMPLATES ───────────────────────────────
export const CHAT_RESPONSES: Record<string, string> = {
  default: `Great question! Based on your current profile (Python Advanced, SQL Intermediate), here's my context-aware answer:

**Key Insight:** Your Python background is a superpower for Full Stack development. Here's why:
- Python's asyncio → JS's Promises/async-await (identical mental model)
- Flask decorators → Express middleware (same pattern)
- Python dicts → JavaScript objects (same syntax, nearly)

**Next concrete step:** Complete the JavaScript ES6+ node assessment to unlock React and Node.js simultaneously. Focus on the async module — it's the highest-ROI concept given your asyncio experience.`,

  react: `**Explaining React State via Python Analogies** (Python to React)

Think of React \`useState\` as a Python class attribute with an automatic re-render callback:

\`\`\`python
# Python class (manual)
class Counter:
    def __init__(self):
        self.count = 0  # ← state

    def increment(self):
        self.count += 1
        self.re_render()  # ← you call this!
\`\`\`

\`\`\`javascript
// React (automatic re-render on change)
const [count, setCount] = useState(0);
// setCount(count + 1) automatically re-renders!
\`\`\`

The magic: React's reconciler (like a smart \`re_render()\`) only updates the DOM parts that actually changed — using a "virtual DOM diff" similar to Python's \`deepdiff\` library.`,

  interview: `**Full Stack Interview Prep Roadmap**

Based on your skill vector, focus on these in priority order:

**1. JavaScript Fundamentals (Week 1)**
   - Closures, hoisting, event loop (most common questions)
   - "Explain the event loop" → answer: single-threaded, callback queue, microtask queue

**2. React Patterns (Week 2)**
   - useState vs useReducer (when to use which)
   - useEffect dependency array (common bug source)
   - Component composition vs inheritance

**3. Node.js + Express (Week 3)**  
   - REST API design, status codes, middleware chains
   - Async error handling with try/catch in Express

**4. System Design (Week 4)**
   - Design a URL shortener, chat app, or ride-sharing backend
   - Focus on: load balancing, caching, database choice

**Mock Question:** "Build a React component that fetches user data and handles loading/error states." → This tests: useEffect, useState, conditional rendering.`,

  async: `**Async JS via Your Python asyncio Knowledge**

You already know asyncio — here's the 1:1 mapping:

| Python | JavaScript |
|--------|-----------|
| \`async def\` | \`async function\` |
| \`await coroutine\` | \`await promise\` |
| \`asyncio.gather()\` | \`Promise.all()\` |
| \`asyncio.sleep(1)\` | \`new Promise(r => setTimeout(r, 1000))\` |
| \`asyncio.TimeoutError\` | Race with timeout Promise |
| \`asyncio.Queue\` | Custom async queue / RxJS |

**The key difference:** JS has only ONE event loop per thread (no GIL drama). \`await\` in JS yields to the browser's event loop — which also handles DOM events, setTimeout, fetch — all in one queue. This is why JS UIs feel snappy: async I/O never blocks button clicks.`,
};
