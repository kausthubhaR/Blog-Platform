const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create users (hash passwords manually since insertMany skips pre-save)
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = await User.insertMany([
      {
        fullName: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        bio: 'Full-stack developer and tech writer passionate about web development.',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      {
        fullName: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password: hashedPassword,
        bio: 'AI researcher and blogger exploring the future of technology.',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      },
      {
        fullName: 'Alex Johnson',
        username: 'alexj',
        email: 'alex@example.com',
        password: hashedPassword,
        bio: 'Cybersecurity expert helping organisations stay safe in a digital world.',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      },
    ]);

    const [john, jane, alex] = users;
    console.log('Users created');

    const posts = await Post.insertMany([
      // John's posts
      {
        title: 'Getting Started with React 18: Everything You Need to Know',
        description: 'A comprehensive guide to React 18 new features including concurrent rendering, automatic batching, and the new root API.',
        content: `React 18 represents the biggest release in years, introducing concurrent rendering as a foundational shift in how React works under the hood. Unlike previous versions where rendering was synchronous and uninterruptible, React 18 can now pause, resume, and abandon renders — enabling a whole new class of user experience improvements.\n\nAutomatic batching is one of the most immediately impactful changes. In React 17, state updates inside setTimeout, Promises, or native event handlers were processed one at a time, causing multiple re-renders. React 18 batches all of these automatically, reducing unnecessary renders and improving performance out of the box.\n\nThe new createRoot API replaces ReactDOM.render and is the entry point to all the concurrent features. Migrating is straightforward: replace ReactDOM.render(app, container) with createRoot(container).render(app). Once you do, you unlock Suspense improvements, startTransition for marking non-urgent updates, and the new useId, useDeferredValue, and useTransition hooks that make building responsive UIs much more intuitive.`,
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        category: 'Web Development',
        tags: ['react', 'javascript', 'frontend', 'web development'],
        author: john._id,
        readTime: 5,
      },
      {
        title: 'Building RESTful APIs with Node.js and Express',
        description: 'Learn how to design and build production-ready REST APIs using Node.js, Express, and MongoDB with proper authentication.',
        content: `REST APIs are the backbone of modern web applications, and Node.js with Express is one of the most popular stacks for building them. The combination is fast, flexible, and leverages JavaScript across the full stack — reducing context switching and enabling code sharing between client and server.\n\nA well-designed REST API follows predictable conventions: nouns in URLs rather than verbs, proper HTTP methods (GET for retrieval, POST for creation, PUT for replacement, PATCH for partial updates, DELETE for removal), and meaningful status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error).\n\nSecurity is non-negotiable in production APIs. Always hash passwords with bcrypt, use JWTs with short expiry times and refresh token rotation, validate all incoming data with a library like express-validator, rate-limit authentication endpoints to prevent brute-force attacks, and use helmet to set secure HTTP headers. Add comprehensive error handling middleware that never leaks stack traces to clients, and log everything with a structured logger like Winston or Pino.`,
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        category: 'Programming',
        tags: ['nodejs', 'express', 'api', 'backend', 'javascript'],
        author: john._id,
        readTime: 6,
      },
      {
        title: 'Mastering Tailwind CSS: From Zero to Production',
        description: 'Deep dive into Tailwind CSS utility-first approach, responsive design, custom themes, and performance optimisation techniques.',
        content: `Tailwind CSS has fundamentally changed how developers think about styling. Rather than writing custom CSS or fighting framework overrides, you compose designs directly in your markup using small, single-purpose utility classes. The result is a consistent design system with zero specificity wars and no dead CSS.\n\nThe responsive design system in Tailwind is particularly elegant. Every utility can be prefixed with a breakpoint: sm:, md:, lg:, xl:, 2xl: — and because Tailwind is mobile-first, unprefixed classes apply to all sizes while prefixed classes activate at that breakpoint and above. Combined with the grid and flexbox utilities, building fully responsive layouts requires no custom CSS at all.\n\nFor production, always configure your content paths in tailwind.config.js so the CSS purging process can tree-shake unused classes. A development build can be several megabytes; a production build after purging is typically under 20KB. Extend the default theme via the theme.extend key rather than overwriting it, and use the @layer directive to add custom base styles, components, or utilities that integrate cleanly with Tailwind layering system.`,
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        category: 'Web Development',
        tags: ['tailwindcss', 'css', 'frontend', 'design'],
        author: john._id,
        readTime: 7,
      },

      // Jane's posts
      {
        title: 'Introduction to Machine Learning: Core Concepts Explained',
        description: 'A beginner-friendly introduction to machine learning covering supervised learning, neural networks, and practical applications.',
        content: `Machine learning is the science of getting computers to learn from data without being explicitly programmed. Instead of writing rules by hand, you feed examples to an algorithm and let it discover the patterns itself. This shift from rule-based to data-driven programming has enabled breakthroughs that would have been impossible with traditional software engineering.\n\nSupervised learning is the most common paradigm: you provide labelled training examples (input-output pairs) and the model learns to predict outputs for new inputs. Classification (predicting a category: spam or not spam, cat or dog) and regression (predicting a number: house price, temperature) are the two main supervised tasks. Algorithms range from simple linear regression to complex deep neural networks with billions of parameters.\n\nUnsupervised learning tackles data without labels, discovering hidden structure through clustering (grouping similar items), dimensionality reduction (finding compact representations), and anomaly detection (identifying unusual examples). Reinforcement learning takes a different approach entirely: an agent learns by taking actions in an environment and receiving rewards or penalties — the same paradigm behind game-playing AIs and robotics. Understanding which learning paradigm fits your problem is the first and most important step in any ML project.`,
        featuredImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
        category: 'Artificial Intelligence',
        tags: ['machine learning', 'ai', 'data science', 'python'],
        author: jane._id,
        readTime: 8,
      },
      {
        title: 'Large Language Models: How GPT and Similar AI Systems Work',
        description: 'An accessible technical explanation of transformer architecture, attention mechanisms, and how modern LLMs are trained.',
        content: `Large Language Models like GPT-4 have captured the world imagination, but how do they actually work? At their core, LLMs are trained on the seemingly simple task of predicting the next token given a sequence of previous tokens. Through exposure to vast amounts of text, they develop rich internal representations of language, knowledge, and reasoning patterns.\n\nThe transformer architecture, introduced in the landmark 2017 paper "Attention is All You Need", is the engine powering modern LLMs. The key innovation is the self-attention mechanism, which allows the model to weigh the relevance of every token in the input against every other token — capturing long-range dependencies that previous architectures like RNNs struggled with. Multi-head attention runs this process in parallel with different learned projections, capturing different types of relationships simultaneously.\n\nTraining happens in two phases. Pre-training on hundreds of billions of tokens teaches the model general language understanding. Fine-tuning (often via RLHF — Reinforcement Learning from Human Feedback) aligns the model to be helpful, harmless, and honest. The emergent capabilities that appear as model scale increases — few-shot learning, chain-of-thought reasoning, code generation — remain an active area of research and surprise even the researchers who build these systems.`,
        featuredImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
        category: 'Artificial Intelligence',
        tags: ['llm', 'gpt', 'transformers', 'nlp', 'ai'],
        author: jane._id,
        readTime: 9,
      },
      {
        title: 'The Future of Work: How AI is Reshaping Every Industry',
        description: 'From healthcare to finance to creative fields, AI is transforming how we work. What the research says and how to prepare.',
        content: `The debate about AI and jobs is often framed as binary — either AI will take all jobs or it will not. The reality is far more nuanced. AI is best understood as a capability amplifier: it automates specific tasks within jobs, changing the mix of skills required rather than making entire professions obsolete overnight.\n\nIn healthcare, AI-powered diagnostic tools can analyse medical images with superhuman accuracy, freeing radiologists to focus on complex cases and patient communication. In legal services, AI can review thousands of documents in hours, shifting lawyers from drudge work to higher-value counsel. In software engineering, AI coding assistants boost developer productivity by 30 to 50 percent on certain tasks — but someone still needs to understand the problem, review the output, and take responsibility for the result.\n\nThe professionals who will thrive are those who learn to collaborate effectively with AI: understanding its strengths and limitations, knowing when to trust its output and when to push back, and focusing their energy on the genuinely human elements of their work — creativity, empathy, ethical judgment, and relationship-building. Rather than fearing automation, now is the time to audit your own skill set, identify which tasks AI can assist with, and invest in the capabilities that remain stubbornly human.`,
        featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        category: 'Education',
        tags: ['ai', 'future of work', 'automation', 'careers', 'technology'],
        author: jane._id,
        readTime: 7,
      },

      // Alex's posts
      {
        title: 'Zero-Trust Security: Never Trust, Always Verify',
        description: 'The traditional perimeter-based security model is broken. Zero-Trust architecture is the modern answer and here is how to implement it.',
        content: `The old security model assumed everything inside the corporate network was trustworthy and everything outside was hostile. That assumption is dead. With cloud computing, remote work, and sophisticated phishing attacks, the perimeter has dissolved. Zero-Trust replaces it with a simple principle: never trust, always verify — regardless of whether a request comes from inside or outside the network.\n\nZero-Trust is built on three pillars. Identity is the new perimeter: every user, device, and service must authenticate and be authorised before accessing any resource, using strong multi-factor authentication and least-privilege access control. Network segmentation replaces flat networks with micro-segments, so a compromised device cannot move laterally to access unrelated systems. Continuous monitoring assumes breach at all times, logging all activity and using behavioural analytics to detect anomalies that might indicate an attacker moving through the system.\n\nImplementing Zero-Trust is a journey, not a one-time project. Start with an inventory of users, devices, and applications. Classify data by sensitivity. Implement MFA everywhere — especially for privileged accounts. Deploy an identity provider with conditional access policies. Gradually segment networks and apply application-layer controls. The goal is to make each access decision as granular and verifiable as possible, minimising the blast radius when — not if — something is eventually compromised.`,
        featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
        category: 'Cybersecurity',
        tags: ['cybersecurity', 'zero-trust', 'security', 'networking'],
        author: alex._id,
        readTime: 7,
      },
      {
        title: 'Common Web Vulnerabilities Every Developer Must Know',
        description: 'Understanding OWASP Top 10 vulnerabilities — SQL injection, XSS, CSRF, and more — with practical prevention techniques.',
        content: `Security vulnerabilities in web applications cost organisations billions of dollars every year, yet most of the most common vulnerabilities are entirely preventable with awareness and correct coding practices. The OWASP Top 10 is the definitive guide to the most critical web application security risks and essential reading for every developer.\n\nSQL Injection remains one of the most dangerous vulnerabilities despite being well understood. It occurs when user input is concatenated directly into SQL queries, allowing attackers to manipulate the query logic. The fix is always to use parameterised queries or prepared statements — never string concatenation. Cross-Site Scripting (XSS) lets attackers inject malicious scripts into pages viewed by other users, potentially stealing session cookies or performing actions on their behalf. Prevent it by escaping all output and setting a strict Content Security Policy.\n\nCross-Site Request Forgery (CSRF) tricks authenticated users into unknowingly submitting requests to applications they are logged into. Mitigation involves CSRF tokens — unique values tied to the user session that must be present in state-changing requests. Broken authentication manifests as weak passwords, missing MFA, insecure session management, and credential stuffing vulnerabilities. The solution is a battle-tested authentication library rather than rolling your own. Security is a process, not a feature — integrate security reviews, dependency scanning, and penetration testing into your development lifecycle.`,
        featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
        category: 'Cybersecurity',
        tags: ['security', 'owasp', 'web security', 'vulnerabilities', 'hacking'],
        author: alex._id,
        readTime: 8,
      },
      {
        title: 'Digital Wellness: Staying Healthy in a Hyper-Connected World',
        description: 'Practical strategies for maintaining mental health, focus, and work-life balance in a world where screens and notifications never stop.',
        content: `The average person now spends over seven hours a day looking at screens, and the always-on nature of smartphones means work, social media, and entertainment blur into a continuous stream of stimulation. The result for many is chronic distraction, disrupted sleep, and a background hum of anxiety. Digital wellness is about intentionally designing your relationship with technology rather than letting it design you.\n\nAttention is your scarcest resource, and every app is competing for it using techniques refined through billions of dollars of behavioural research. Variable reward schedules — the same mechanism that makes slot machines addictive — keep us scrolling for the next interesting post. Notification systems create a Pavlovian response that fragments concentration into ever-smaller pieces. Reclaiming your attention starts with ruthless notification hygiene: allow only people, not apps, to interrupt you. Check social media and email on your schedule, not theirs.\n\nSleep is the foundation of cognitive performance, and screens are its enemy in two ways: the blue light they emit suppresses melatonin production, and the content they deliver — especially social media and news — keeps the brain in a stimulated, vigilant state incompatible with sleep. A simple rule: no screens for 60 minutes before bed. Replace them with reading, journaling, or conversation. The payoff — better sleep, improved focus, reduced anxiety — far outweighs the discomfort of breaking the habit.`,
        featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
        category: 'Lifestyle',
        tags: ['wellness', 'mental health', 'productivity', 'lifestyle', 'technology'],
        author: alex._id,
        readTime: 6,
      },
    ]);

    console.log(`${posts.length} posts created`);

    // Add sample comments
    await Comment.insertMany([
      {
        post: posts[0]._id,
        user: jane._id,
        content: 'Great introduction to React 18! The section on automatic batching was especially helpful.',
      },
      {
        post: posts[0]._id,
        user: alex._id,
        content: 'Really clear explanation. I have been putting off upgrading but this convinced me to finally do it.',
      },
      {
        post: posts[1]._id,
        user: jane._id,
        content: 'The security section is gold. Too many tutorials skip JWT best practices entirely.',
      },
      {
        post: posts[3]._id,
        user: john._id,
        content: 'Fantastic beginner-friendly overview. The distinction between supervised and unsupervised learning is crystal clear.',
      },
      {
        post: posts[6]._id,
        user: john._id,
        content: 'Zero-Trust is long overdue in most organisations. The three-pillars framework makes it very approachable.',
      },
      {
        post: posts[7]._id,
        user: jane._id,
        content: 'Every developer should read this before shipping their first feature. Great practical advice.',
      },
    ]);

    console.log('Comments created');
    console.log('\nSeed complete!');
    console.log('Test accounts:');
    console.log('  john@example.com  / password123');
    console.log('  jane@example.com  / password123');
    console.log('  alex@example.com  / password123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
