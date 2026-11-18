require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── inline models (seed runs standalone, before npm install may finish) ──────
const userSchema = new mongoose.Schema({
  fullName:     { type: String, required: true, trim: true },
  username:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6 },
  profileImage: { type: String, default: '' },
  bio:          { type: String, default: '', maxlength: 300 },
  createdAt:    { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const postSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    description:   { type: String, required: true },
    content:       { type: String, required: true },
    featuredImage: { type: String, default: '' },
    category:      {
      type: String,
      required: true,
      enum: ['Technology', 'Programming', 'Artificial Intelligence', 'Web Development',
             'Cybersecurity', 'Lifestyle', 'Education', 'Other'],
    },
    tags:     [{ type: String, lowercase: true, trim: true }],
    author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    readTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const User    = mongoose.model('User', userSchema);
const Post    = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// ── helpers ──────────────────────────────────────────────────────────────────
function calcReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── seed data ────────────────────────────────────────────────────────────────
const userData = [
  {
    fullName:     'John Doe',
    username:     'johndoe',
    email:        'john@example.com',
    password:     'password123',
    bio:          'Full-stack developer and tech writer',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    fullName:     'Jane Smith',
    username:     'janesmith',
    email:        'jane@example.com',
    password:     'password123',
    bio:          'AI researcher and blogger',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
  },
  {
    fullName:     'Alex Johnson',
    username:     'alexj',
    email:        'alex@example.com',
    password:     'password123',
    bio:          'Cybersecurity expert',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  },
];

function buildPosts(users) {
  const [john, jane, alex] = users;

  return [
    // ── John's posts ──────────────────────────────────────────────────────
    {
      title: 'The Rise of TypeScript: Why Every JavaScript Developer Should Switch',
      description:
        'TypeScript has taken the JavaScript ecosystem by storm. Discover why top teams are adopting it and how it can transform your development workflow.',
      content: `TypeScript, the statically-typed superset of JavaScript developed by Microsoft, has seen explosive growth over the past few years. What started as a niche tool for large enterprise applications has now become a staple in modern web development, embraced by projects of all sizes.\n\nOne of TypeScript's greatest strengths is its ability to catch errors at compile time rather than runtime. When you're working in a large codebase with multiple developers, type annotations serve as living documentation — your IDE can warn you the moment you pass the wrong argument to a function or access a property that doesn't exist on an object. This drastically reduces the number of bugs that make it to production.\n\nBeyond error catching, TypeScript enhances the developer experience through intelligent autocomplete, refactoring support, and clearer code intent. Modern frameworks like Angular, Next.js, and NestJS ship with first-class TypeScript support. Even the React and Vue communities have largely embraced it. If you haven't made the switch yet, 2024 is the perfect time to start — the learning curve is gentler than you think, and the productivity gains are well worth the initial investment.`,
      featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      category: 'Programming',
      tags: ['typescript', 'javascript', 'web development', 'programming'],
      author: john._id,
    },
    {
      title: 'Building Scalable REST APIs with Node.js and Express',
      description:
        'Learn how to architect and build production-ready REST APIs using Node.js, Express, and MongoDB — with best practices for security and performance.',
      content: `Building a REST API is deceptively simple at first glance — a few routes, some middleware, and you're done. But as your application grows, so do the challenges: how do you handle authentication? Rate limiting? Input validation? Error handling in a consistent way? This guide walks you through creating a scalable Express API from the ground up.\n\nWe'll start with a clean project structure that separates concerns: controllers handle business logic, models define data schemas, routes map HTTP verbs to controller methods, and middleware handles cross-cutting concerns like auth and error handling. This layered approach keeps each file focused and your codebase easy to navigate as it grows.\n\nSecurity is non-negotiable in production APIs. We'll cover essential practices: using Helmet to set secure HTTP headers, express-rate-limit to prevent abuse, bcryptjs for password hashing, and JWTs for stateless authentication. We'll also look at input validation with express-validator to protect against malformed data before it ever touches your database. Following these patterns will give you a solid foundation you can build on with confidence.`,
      featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      category: 'Web Development',
      tags: ['nodejs', 'express', 'rest api', 'backend', 'mongodb'],
      author: john._id,
    },
    {
      title: 'Docker for Developers: Containerise Your Apps in 30 Minutes',
      description:
        'A practical, hands-on guide to Docker that gets you from zero to running containerised applications — no prior experience required.',
      content: `Docker has fundamentally changed how we build, ship, and run software. By packaging your application and its dependencies into a lightweight, portable container, you eliminate the classic "it works on my machine" problem and make deployments dramatically more predictable.\n\nAt its core, Docker works by creating containers from images — read-only snapshots that describe a filesystem and configuration. You define an image using a Dockerfile: a simple text file that lists the base image (e.g., node:18-alpine), copies your source code, installs dependencies, and specifies the command to run your app. Building and running that image takes just two commands: docker build and docker run.\n\nFor multi-service applications — say, a React frontend, a Node.js backend, and a MongoDB database — Docker Compose lets you define and start everything with a single docker compose up command. Each service gets its own container, they communicate over a private network, and you can spin the whole stack up or tear it down in seconds. This consistency between development and production environments is one of the most valuable things Docker offers to any modern engineering team.`,
      featuredImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
      category: 'Technology',
      tags: ['docker', 'containers', 'devops', 'deployment'],
      author: john._id,
    },

    // ── Jane's posts ──────────────────────────────────────────────────────
    {
      title: 'Understanding Large Language Models: A Gentle Introduction',
      description:
        'Demystifying LLMs — how transformer architectures, attention mechanisms, and training data combine to produce surprisingly capable AI systems.',
      content: `Large Language Models (LLMs) like GPT-4, Claude, and Gemini have captured the world's imagination, but many people still find the underlying technology mysterious. At their heart, LLMs are neural networks trained on vast amounts of text to predict the next token in a sequence — a seemingly simple objective that gives rise to remarkable emergent capabilities.\n\nThe architectural breakthrough that made modern LLMs possible is the Transformer, introduced in the landmark "Attention Is All You Need" paper from Google in 2017. The key innovation is the self-attention mechanism, which allows the model to weigh the relevance of every other word in the input when processing each individual word. This parallelism makes training far more efficient than the recurrent networks that came before it, enabling models to scale to hundreds of billions of parameters.\n\nTraining an LLM happens in stages. First, the model is pre-trained on a large corpus of web text, books, and code using self-supervised learning — no labels are required, just the text itself. Then it's fine-tuned on curated datasets and refined through Reinforcement Learning from Human Feedback (RLHF) to make it helpful, harmless, and honest. Understanding this pipeline is essential for anyone looking to work with or build on top of these powerful models.`,
      featuredImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
      category: 'Artificial Intelligence',
      tags: ['llm', 'ai', 'machine learning', 'nlp', 'transformers'],
      author: jane._id,
    },
    {
      title: 'Prompt Engineering: The Art of Talking to AI',
      description:
        'Master the techniques that unlock the full potential of AI language models — from zero-shot prompting to chain-of-thought and retrieval-augmented generation.',
      content: `Prompt engineering has emerged as a critical skill in the age of generative AI. The same underlying model can produce wildly different outputs depending on how you phrase your request — understanding why, and how to craft prompts that consistently deliver high-quality results, is both an art and a science.\n\nThe simplest and most powerful technique is adding context. Instead of asking "summarise this article," tell the model who you are, what you need, and how the output will be used: "You are a technical writer. Summarise the following article in three bullet points for a non-technical executive audience." This framing dramatically improves relevance and tone. Zero-shot prompting works for many tasks, but for complex reasoning problems, few-shot examples — providing two or three input-output pairs before your actual query — can dramatically improve accuracy.\n\nFor reasoning-heavy tasks, chain-of-thought prompting is transformative. By adding "Let's think step by step" or providing an example that shows the model's reasoning process explicitly, you encourage the model to break problems into intermediate steps rather than jumping to an answer. This is especially effective for maths, logic, and multi-step planning. Combine it with retrieval-augmented generation (RAG) to ground the model's responses in your own documents or knowledge base, and you have a powerful framework for building reliable AI-powered applications.`,
      featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
      category: 'Artificial Intelligence',
      tags: ['prompt engineering', 'ai', 'chatgpt', 'llm', 'generative ai'],
      author: jane._id,
    },
    {
      title: 'The Future of Work: How AI is Reshaping Every Industry',
      description:
        'From healthcare to finance to creative fields, AI is transforming how we work. Here's what the research says and how to prepare.',
      content: `The debate about AI and jobs is often framed as binary — either AI will take all our jobs or it won't. The reality is far more nuanced. AI is best understood as a capability amplifier: it automates specific tasks within jobs, changing the mix of skills required rather than making entire professions obsolete overnight.\n\nIn healthcare, AI-powered diagnostic tools can analyse medical images with superhuman accuracy, freeing radiologists to focus on complex cases and patient communication. In legal services, AI can review thousands of documents in hours, shifting lawyers from drudge work to higher-value counsel. In software engineering, AI coding assistants boost developer productivity by 30–50% on certain tasks — but someone still needs to understand the problem, review the output, and take responsibility for the result.\n\nThe professionals who will thrive are those who learn to collaborate effectively with AI: understanding its strengths and limitations, knowing when to trust its output and when to push back, and focusing their energy on the genuinely human elements of their work — creativity, empathy, ethical judgment, and relationship-building. Rather than fearing automation, now is the time to audit your own skill set, identify which tasks AI can assist with, and invest in the capabilities that remain stubbornly human.`,
      featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      category: 'Education',
      tags: ['ai', 'future of work', 'automation', 'careers', 'technology'],
      author: jane._id,
    },

    // ── Alex's posts ──────────────────────────────────────────────────────
    {
      title: 'Zero-Trust Security: Never Trust, Always Verify',
      description:
        'The traditional perimeter-based security model is broken. Zero-Trust architecture is the modern answer — here's how to implement it in your organisation.',
      content: `For decades, corporate network security was built on a simple assumption: everything inside the network perimeter is trusted, everything outside is not. This model made sense when employees worked in offices and data lived in on-premises servers. Today, with remote work, cloud services, and sophisticated attackers who can move laterally once they breach a perimeter, that assumption is a liability.\n\nZero Trust flips the model on its head. The core principle is "never trust, always verify" — every request, from every user and device, must be authenticated and authorised before being granted access, regardless of whether it originates inside or outside the corporate network. Identity becomes the new perimeter. This means strong multi-factor authentication, least-privilege access policies, continuous session validation, and micro-segmentation that limits how far an attacker can move even if they do get in.\n\nImplementing Zero Trust is a journey, not a one-time project. Start by inventorying your assets and understanding your data flows. Identify your most sensitive data and applications and enforce strict identity controls around them first. Roll out MFA universally, deploy endpoint detection and response (EDR) tools, and implement network segmentation. Tools like Microsoft Entra ID, Google BeyondCorp, and Cloudflare Access provide mature Zero Trust platforms that can accelerate your implementation significantly.`,
      featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      category: 'Cybersecurity',
      tags: ['zero trust', 'security', 'networking', 'identity', 'enterprise'],
      author: alex._id,
    },
    {
      title: 'Common Web Vulnerabilities Every Developer Should Know',
      description:
        'SQL injection, XSS, CSRF, SSRF — the OWASP Top 10 explained in plain English with practical examples and mitigations for each.',
      content: `Security vulnerabilities aren't just an infosec team problem — they're introduced at the development stage, which means developers are on the front lines of prevention. Understanding the most common classes of web vulnerabilities is a fundamental skill for anyone who writes code that runs in production.\n\nSQL Injection remains one of the most prevalent and damaging vulnerabilities. It occurs when untrusted user input is concatenated directly into a database query, allowing attackers to manipulate the query's logic. The fix is straightforward: always use parameterised queries or prepared statements. Never build queries through string concatenation with user-supplied data. Cross-Site Scripting (XSS) is similarly common and equally preventable: always encode user-supplied data before rendering it in HTML, and use a Content Security Policy (CSP) header to restrict which scripts can run on your page.\n\nCross-Site Request Forgery (CSRF) tricks authenticated users into unknowingly submitting requests to your application. Protect against it by validating a secret, user-specific CSRF token on every state-changing request. Server-Side Request Forgery (SSRF) lets attackers coerce your server into making requests to internal resources — validate and allowlist any user-supplied URLs. By understanding these attack patterns deeply, developers can write defensively by default rather than bolting on security as an afterthought.`,
      featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      category: 'Cybersecurity',
      tags: ['security', 'owasp', 'web security', 'vulnerabilities', 'development'],
      author: alex._id,
    },
    {
      title: 'Digital Wellness in the Age of Constant Connectivity',
      description:
        'Practical strategies for maintaining mental health, focus, and work-life balance in a world where screens and notifications never stop.',
      content: `We carry supercomputers in our pockets that connect us to the entire world's information, our colleagues, our friends, and an endless stream of content engineered to capture and hold our attention. The benefits are real — but so are the costs to our focus, sleep, and mental health if we don't establish intentional boundaries.\n\nThe first step is understanding your own usage patterns. Use your phone's built-in screen time tools to get an honest picture of how much time you're spending on different apps and categories. Most people are genuinely surprised. Once you have the data, you can make informed decisions: perhaps social media only after 6pm, or no screens in the bedroom, or phone-free meals. Small, consistent changes compound into significant improvements in wellbeing.\n\nDeep work — the ability to focus without distraction on cognitively demanding tasks — is becoming both rarer and more valuable. Protect it deliberately. Turn off non-essential notifications. Use website blockers during focus sessions. Create physical separation from your devices when you need to think. And remember that rest is productive: adequate sleep, exercise, and time in nature aren't luxuries you earn — they're inputs that determine the quality of your thinking and creativity. In a world of constant connectivity, the ability to disconnect is a superpower.`,
      featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      category: 'Lifestyle',
      tags: ['digital wellness', 'mental health', 'productivity', 'focus', 'lifestyle'],
      author: alex._id,
    },
  ].map((p) => ({ ...p, readTime: calcReadTime(p.content) }));
}

// ── main ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in backend/.env — aborting seed.');
    }

    console.log('Connecting to MongoDB…');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');

    // Clear existing data
    console.log('Clearing existing data…');
    await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({})]);
    console.log('Collections cleared.');

    // Create users (pre-save hook hashes passwords)
    console.log('Creating users…');
    const users = await User.insertMany(
      await Promise.all(
        userData.map(async (u) => {
          const user = new User(u);
          // Trigger the pre-save hook manually since insertMany bypasses it
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(u.password, salt);
          return user.toObject();
        })
      )
    );
    console.log(`✓ Created ${users.length} users.`);

    // Build and create posts
    console.log('Creating posts…');
    const postData = buildPosts(users);
    const posts = await Post.insertMany(postData);
    console.log(`✓ Created ${posts.length} posts.`);

    // Create 6 sample comments (spread across first 4 posts)
    console.log('Creating comments…');
    const commentData = [
      {
        post:    posts[0]._id,
        user:    users[1]._id,
        content: 'Great article! TypeScript has completely changed how our team writes code — the autocomplete alone saves hours every week.',
      },
      {
        post:    posts[0]._id,
        user:    users[2]._id,
        content: 'Totally agree. The hardest part for us was migrating the existing JavaScript codebase, but it was well worth the effort.',
      },
      {
        post:    posts[1]._id,
        user:    users[1]._id,
        content: 'The section on error handling middleware is gold. We\'ve been using a similar pattern and it makes debugging so much cleaner.',
      },
      {
        post:    posts[3]._id,
        user:    users[0]._id,
        content: 'Excellent breakdown of the Transformer architecture. The analogy to attention as "relevance weighting" finally made it click for me.',
      },
      {
        post:    posts[6]._id,
        user:    users[1]._id,
        content: 'Zero Trust is so important for remote-first companies. We implemented BeyondCorp last year and it\'s been a game changer for our security posture.',
      },
      {
        post:    posts[7]._id,
        user:    users[0]._id,
        content: 'Every junior developer should read this before they write their first database query. Parameterised statements are non-negotiable!',
      },
    ];

    const comments = await Comment.insertMany(commentData);
    console.log(`✓ Created ${comments.length} comments.`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest accounts:');
    console.log('  john@example.com  /  password123');
    console.log('  jane@example.com  /  password123');
    console.log('  alex@example.com  /  password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
