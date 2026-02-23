/**
 * Seed script — Creates a comprehensive blog post using ALL block editor widgets.
 *
 * Usage:
 *   npx tsx scripts/seed-blog-post.ts
 *
 * Requires MONGODB_URI in .env.local (loaded automatically).
 */

import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  const Blog = (await import('../src/models/Blog')).default;

  // Delete existing post with same slug to allow re-seeding
  await Blog.deleteMany({
    slug: { $in: ['complete-guide-to-modern-web-development-2026', 'mastering-fullstack-development-tools-and-techniques'] },
  });

  const blogPosts = [
    {
      title: 'The Complete Guide to Modern Web Development in 2026',
      slug: 'complete-guide-to-modern-web-development-2026',
      excerpt:
        'An in-depth exploration of modern web development practices, covering frameworks, tools, design patterns, and deployment strategies for building production-ready applications.',
      coverImage: '/shahreer_irfan.jpg',
      category: 'Web Development',
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Full Stack', 'DevOps'],
      author: 'MD Shahreer Irfan',
      published: true,
      featured: true,
      readTime: 12,
      metaTitle: 'The Complete Guide to Modern Web Development in 2026 | MD Shahreer Irfan',
      metaDescription:
        'Master modern web development with this comprehensive guide covering Next.js, React, TypeScript, databases, APIs, and deployment.',
      blocks: [
        // ── 1. HEADING (H1) ──
        {
          id: 'blk_h1_intro',
          type: 'heading',
          data: { text: 'The Complete Guide to Modern Web Development', level: 1 },
        },

        // ── 2. PARAGRAPH ──
        {
          id: 'blk_p_intro',
          type: 'paragraph',
          data: {
            text: 'Web development has evolved dramatically over the past few years. In 2026, the landscape is dominated by powerful frameworks, type-safe languages, and AI-enhanced tooling. Whether you\'re a beginner or a seasoned developer, this guide will walk you through everything you need to know to build modern, production-ready web applications.',
          },
        },

        // ── 3. IMAGE ──
        {
          id: 'blk_img_hero',
          type: 'image',
          data: {
            url: '/shahreer_irfan2.jpg',
            alt: 'Modern web development workspace',
            caption: 'A modern developer workspace — where the magic happens',
            width: 'full',
          },
        },

        // ── 4. SPACER ──
        {
          id: 'blk_spacer_1',
          type: 'spacer',
          data: { height: 30 },
        },

        // ── 5. HEADING (H2) ──
        {
          id: 'blk_h2_frontend',
          type: 'heading',
          data: { text: 'Frontend Frameworks & Libraries', level: 2 },
        },

        // ── 6. PARAGRAPH ──
        {
          id: 'blk_p_frontend',
          type: 'paragraph',
          data: {
            text: 'The frontend ecosystem continues to be dominated by React and its meta-frameworks. Next.js has become the de facto standard for building production React applications, offering server-side rendering, static generation, and the powerful App Router. Alongside React, Vue.js and Svelte continue to grow, each offering unique approaches to reactivity and state management.',
          },
        },

        // ── 7. LIST (Unordered) ──
        {
          id: 'blk_list_frameworks',
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              'Next.js 15 — Server Components, Streaming, and Turbopack',
              'React 19 — Use hook, Server Actions, and improved Suspense',
              'Vue 4 — Vapor Mode for superior performance',
              'Svelte 5 — Runes for fine-grained reactivity',
              'Astro 5 — Islands architecture for content-heavy sites',
              'Remix — Nested routes and progressive enhancement',
            ],
          },
        },

        // ── 8. CALLOUT (Info) ──
        {
          id: 'blk_callout_tip',
          type: 'callout',
          data: {
            type: 'info',
            title: 'Pro Tip',
            text: 'If you\'re starting a new project in 2026, Next.js with TypeScript and Tailwind CSS is the most battle-tested combination. It gives you SSR, SSG, API routes, and a massive ecosystem of tools and libraries.',
          },
        },

        // ── 9. DIVIDER (solid) ──
        {
          id: 'blk_divider_1',
          type: 'divider',
          data: { style: 'solid' },
        },

        // ── 10. HEADING (H2) ──
        {
          id: 'blk_h2_typescript',
          type: 'heading',
          data: { text: 'TypeScript: The Language of the Web', level: 2 },
        },

        // ── 11. PARAGRAPH ──
        {
          id: 'blk_p_typescript',
          type: 'paragraph',
          data: {
            text: 'TypeScript has become non-negotiable for serious web development. Its type system catches bugs at compile time, improves IDE auto-completion, and makes refactoring large codebases a breeze. Let\'s look at a practical example of type-safe API handling:',
          },
        },

        // ── 12. CODE ──
        {
          id: 'blk_code_ts',
          type: 'code',
          data: {
            language: 'typescript',
            code: `// Type-safe API response handler
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

// Usage — fully type-safe!
const { data: user } = await fetchUser('123');
console.log(user.name); // ✅ TypeScript knows this is a string
console.log(user.role); // ✅ TypeScript knows this is 'admin' | 'user' | 'editor'`,
          },
        },

        // ── 13. CALLOUT (Warning) ──
        {
          id: 'blk_callout_warning',
          type: 'callout',
          data: {
            type: 'warning',
            title: 'Common Pitfall',
            text: 'Avoid using "any" type in TypeScript. It defeats the entire purpose of type checking. Use "unknown" instead when the type is truly unknown, and narrow it down with type guards.',
          },
        },

        // ── 14. SPACER ──
        {
          id: 'blk_spacer_2',
          type: 'spacer',
          data: { height: 20 },
        },

        // ── 15. HEADING (H2) ──
        {
          id: 'blk_h2_styling',
          type: 'heading',
          data: { text: 'Styling: Tailwind CSS & Beyond', level: 2 },
        },

        // ── 16. PARAGRAPH ──
        {
          id: 'blk_p_styling',
          type: 'paragraph',
          data: {
            text: 'Tailwind CSS has revolutionized how we write styles. Its utility-first approach, combined with JIT compilation and excellent dark mode support, makes it the go-to CSS framework for modern applications. But there are also great alternatives depending on your needs.',
          },
        },

        // ── 17. TABLE ──
        {
          id: 'blk_table_css',
          type: 'table',
          data: {
            headers: ['Framework', 'Approach', 'Bundle Size', 'Best For'],
            rows: [
              ['Tailwind CSS', 'Utility-first', '~10KB (purged)', 'Custom designs at scale'],
              ['CSS Modules', 'Scoped classes', '0KB overhead', 'Component-level isolation'],
              ['Styled Components', 'CSS-in-JS', '~12KB', 'Dynamic theming'],
              ['Vanilla Extract', 'Zero-runtime CSS-in-TS', '0KB runtime', 'Type-safe styles'],
              ['Panda CSS', 'Static CSS-in-JS', '~5KB', 'Design system tokens'],
            ],
          },
        },

        // ── 18. QUOTE ──
        {
          id: 'blk_quote_design',
          type: 'quote',
          data: {
            text: 'Good design is obvious. Great design is transparent. The best interfaces feel so natural that users never think about them — they just work.',
            attribution: 'Joe Sparano',
          },
        },

        // ── 19. GALLERY ──
        {
          id: 'blk_gallery_projects',
          type: 'gallery',
          data: {
            images: [
              {
                url: '/shahreer_irfan3.jpg',
                alt: 'Project showcase 1',
                caption: 'Full-stack e-commerce platform',
              },
              {
                url: '/shahreer_irfan4.jpg',
                alt: 'Project showcase 2',
                caption: 'Portfolio with dark mode',
              },
              {
                url: '/shahreer_irfan5.jpg',
                alt: 'Project showcase 3',
                caption: 'Dashboard analytics UI',
              },
            ],
          },
        },

        // ── 20. DIVIDER (dashed) ──
        {
          id: 'blk_divider_2',
          type: 'divider',
          data: { style: 'dashed' },
        },

        // ── 21. HEADING (H2) ──
        {
          id: 'blk_h2_backend',
          type: 'heading',
          data: { text: 'Backend & Database Architecture', level: 2 },
        },

        // ── 22. PARAGRAPH ──
        {
          id: 'blk_p_backend',
          type: 'paragraph',
          data: {
            text: 'Modern backends are all about choosing the right tool for the job. Whether you\'re building REST APIs, GraphQL endpoints, or real-time systems, the choices you make at the database and API layer will define your application\'s performance and scalability.',
          },
        },

        // ── 23. LIST (Ordered) ──
        {
          id: 'blk_list_backend_steps',
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              'Define your data models and relationships clearly',
              'Choose between SQL (PostgreSQL) and NoSQL (MongoDB) based on your data shape',
              'Implement proper authentication with JWT or session-based auth',
              'Add rate limiting, CORS, and input validation for security',
              'Set up database indexing for frequently queried fields',
              'Implement caching with Redis for hot data paths',
              'Write comprehensive API tests before deploying',
            ],
          },
        },

        // ── 24. CODE ──
        {
          id: 'blk_code_api',
          type: 'code',
          data: {
            language: 'typescript',
            code: `// Next.js API Route with MongoDB
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(req: NextRequest) {
  await dbConnect();
  
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  
  const filter: Record<string, unknown> = { published: true };
  if (category) filter.category = category;
  
  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  
  return NextResponse.json({ projects });
}`,
          },
        },

        // ── 25. HEADING (H3) ──
        {
          id: 'blk_h3_mongo',
          type: 'heading',
          data: { text: 'Why MongoDB for Modern Apps?', level: 3 },
        },

        // ── 26. PARAGRAPH ──
        {
          id: 'blk_p_mongo',
          type: 'paragraph',
          data: {
            text: 'MongoDB\'s flexible document model makes it perfect for content-heavy applications, blogs, and portfolios. Documents naturally map to JavaScript objects, making it incredibly intuitive to work with in a Node.js/Next.js stack. Combined with Mongoose for schema validation and indexing, you get the flexibility of NoSQL with the safety nets of a structured schema.',
          },
        },

        // ── 27. CALLOUT (Success) ──
        {
          id: 'blk_callout_success',
          type: 'callout',
          data: {
            type: 'success',
            title: 'Performance Win',
            text: 'By using MongoDB compound indexes and the lean() method on Mongoose queries, we reduced our API response times from 200ms to under 15ms for most endpoints. Always index your most queried fields!',
          },
        },

        // ── 28. DIVIDER (dotted) ──
        {
          id: 'blk_divider_3',
          type: 'divider',
          data: { style: 'dotted' },
        },

        // ── 29. HEADING (H2) ──
        {
          id: 'blk_h2_deploy',
          type: 'heading',
          data: { text: 'Deployment & DevOps', level: 2 },
        },

        // ── 30. PARAGRAPH ──
        {
          id: 'blk_p_deploy',
          type: 'paragraph',
          data: {
            text: 'Getting your app deployed is just as important as building it. Modern deployment platforms like Vercel, Railway, and Fly.io make it easier than ever to ship production-ready applications with CI/CD, edge functions, and global CDN distribution.',
          },
        },

        // ── 31. VIDEO ──
        {
          id: 'blk_video_deploy',
          type: 'video',
          data: {
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            caption: 'Watch: Deploying a Next.js App to Vercel in 5 Minutes',
          },
        },

        // ── 32. CALLOUT (Error) ──
        {
          id: 'blk_callout_error',
          type: 'callout',
          data: {
            type: 'error',
            title: 'Critical Security Reminder',
            text: 'NEVER commit your .env files, API keys, or database credentials to version control. Use environment variables in your deployment platform and rotate keys regularly. A single leaked secret can compromise your entire application.',
          },
        },

        // ── 33. SPACER ──
        {
          id: 'blk_spacer_3',
          type: 'spacer',
          data: { height: 40 },
        },

        // ── 34. HEADING (H2) ──
        {
          id: 'blk_h2_conclusion',
          type: 'heading',
          data: { text: 'Conclusion & Resources', level: 2 },
        },

        // ── 35. PARAGRAPH ──
        {
          id: 'blk_p_conclusion',
          type: 'paragraph',
          data: {
            text: 'Modern web development is an exciting field that\'s constantly evolving. By mastering the fundamentals — HTML, CSS, JavaScript, and TypeScript — and building on top of them with frameworks like Next.js, you can create incredible experiences for users worldwide. The key is to never stop learning and always be willing to experiment with new tools and approaches.',
          },
        },

        // ── 36. HTML ──
        {
          id: 'blk_html_newsletter',
          type: 'html',
          data: {
            code: `<div style="text-align:center; padding:20px; border-radius:12px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; margin:20px 0;">
  <h3 style="margin:0 0 8px 0; font-size:1.3rem;">📬 Enjoyed this article?</h3>
  <p style="margin:0; opacity:0.9; font-size:0.95rem;">Follow me on GitHub for more web development content, open-source projects, and tutorials.</p>
</div>`,
          },
        },

        // ── 37. BUTTON ──
        {
          id: 'blk_button_github',
          type: 'button',
          data: {
            text: '⭐ Follow on GitHub',
            url: 'https://github.com/shahreerirfan',
            style: 'primary',
          },
        },

        // ── 38. BUTTON (outline) ──
        {
          id: 'blk_button_portfolio',
          type: 'button',
          data: {
            text: 'View My Portfolio →',
            url: '/',
            style: 'outline',
          },
        },

        // ── 39. IMAGE (medium width) ──
        {
          id: 'blk_img_author',
          type: 'image',
          data: {
            url: '/Irfan.png',
            alt: 'MD Shahreer Irfan',
            caption: 'MD Shahreer Irfan — Full-Stack Developer & Designer',
            width: 'medium',
          },
        },
      ],
    },

    // ── SECOND BLOG POST ──
    {
      title: 'Mastering Full-Stack Development: Tools & Techniques',
      slug: 'mastering-fullstack-development-tools-and-techniques',
      excerpt:
        'Dive deep into the tools, workflows, and techniques that professional full-stack developers use daily to ship high-quality products.',
      coverImage: '/shahreer_irfan5.jpg',
      category: 'Full Stack',
      tags: ['Full Stack', 'React', 'Node.js', 'MongoDB', 'DevOps', 'Git'],
      author: 'MD Shahreer Irfan',
      published: true,
      featured: true,
      readTime: 10,
      metaTitle: 'Mastering Full-Stack Development: Tools & Techniques | MD Shahreer Irfan',
      metaDescription:
        'Learn the essential tools, techniques, and workflows that professional full-stack developers use to build and ship high-quality products.',
      blocks: [
        {
          id: 'blk2_h1',
          type: 'heading',
          data: { text: 'Mastering Full-Stack Development', level: 1 },
        },
        {
          id: 'blk2_p1',
          type: 'paragraph',
          data: {
            text: 'Being a full-stack developer means wearing many hats — from crafting pixel-perfect UIs to designing scalable database schemas, from writing secure APIs to configuring deployment pipelines. In this post, I\'ll share the tools and techniques I use daily to ship high-quality products efficiently.',
          },
        },
        {
          id: 'blk2_img1',
          type: 'image',
          data: {
            url: '/shahreer_irfan3.jpg',
            alt: 'Full-stack development tools',
            caption: 'The full-stack developer\'s everyday toolkit',
            width: 'wide',
          },
        },
        {
          id: 'blk2_h2_tools',
          type: 'heading',
          data: { text: 'Essential Developer Tools', level: 2 },
        },
        {
          id: 'blk2_table_tools',
          type: 'table',
          data: {
            headers: ['Tool', 'Category', 'Why I Use It'],
            rows: [
              ['VS Code', 'Editor', 'Extensions, integrated terminal, GitHub Copilot'],
              ['Git + GitHub', 'Version Control', 'Branching, PRs, code review, CI/CD'],
              ['Docker', 'Containerization', 'Consistent environments across dev and prod'],
              ['Postman', 'API Testing', 'Collection-based API testing and documentation'],
              ['Figma', 'Design', 'UI/UX design and developer handoff'],
              ['MongoDB Compass', 'Database GUI', 'Visual query building and schema analysis'],
            ],
          },
        },
        {
          id: 'blk2_callout_tip',
          type: 'callout',
          data: {
            type: 'info',
            title: 'Productivity Hack',
            text: 'Set up keyboard shortcuts and snippets in VS Code for your most common patterns. I save roughly 30 minutes per day just from custom snippets for React components, API routes, and Mongoose models.',
          },
        },
        {
          id: 'blk2_divider1',
          type: 'divider',
          data: { style: 'dashed' },
        },
        {
          id: 'blk2_h2_workflow',
          type: 'heading',
          data: { text: 'My Development Workflow', level: 2 },
        },
        {
          id: 'blk2_list_workflow',
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              'Plan the feature with a wireframe or quick sketch in Figma',
              'Create a feature branch from the main development branch',
              'Build the UI components first with mock data',
              'Implement the API endpoints and database models',
              'Connect frontend to backend and test end-to-end',
              'Write unit tests for critical business logic',
              'Create a pull request with a detailed description',
              'Deploy to staging for final QA before merging',
            ],
          },
        },
        {
          id: 'blk2_quote',
          type: 'quote',
          data: {
            text: 'First, solve the problem. Then, write the code. The best developers spend 80% of their time thinking and 20% coding.',
            attribution: 'John Johnson',
          },
        },
        {
          id: 'blk2_h2_code',
          type: 'heading',
          data: { text: 'Code Architecture Patterns', level: 2 },
        },
        {
          id: 'blk2_p_code',
          type: 'paragraph',
          data: {
            text: 'A well-organized codebase is crucial for maintainability. Here\'s how I typically structure a Next.js full-stack project:',
          },
        },
        {
          id: 'blk2_code_structure',
          type: 'code',
          data: {
            language: 'bash',
            code: `src/
├── app/                  # Next.js App Router pages
│   ├── api/              # API route handlers
│   ├── (auth)/           # Auth route group
│   └── (dashboard)/      # Dashboard route group
├── components/           # Reusable UI components
│   ├── ui/               # Primitive components (Button, Input...)
│   └── features/         # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & configs
├── models/               # Mongoose/Prisma models
├── data/                 # Static data & type definitions
└── styles/               # Global styles & themes`,
          },
        },
        {
          id: 'blk2_h3_patterns',
          type: 'heading',
          data: { text: 'React Component Patterns', level: 3 },
        },
        {
          id: 'blk2_code_react',
          type: 'code',
          data: {
            language: 'typescript',
            code: `// Custom hook pattern for data fetching
function useProjects(category?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = category ? \`?category=\${category}\` : '';
        const res = await fetch(\`/api/projects\${params}\`);
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [category]);

  return { projects, loading, error };
}`,
          },
        },
        {
          id: 'blk2_gallery',
          type: 'gallery',
          data: {
            images: [
              { url: '/shahreer_irfan.jpg', alt: 'GitHub profile', caption: 'Active GitHub contributions' },
              { url: '/shahreer_irfan2.jpg', alt: 'Project demo', caption: 'Live project demonstration' },
              { url: '/screencapture-github-shahreerirfan-2026-02-18-12_24_09.png', alt: 'GitHub overview', caption: 'GitHub contributions overview' },
              { url: '/shahreer_irfan4.jpg', alt: 'Code review', caption: 'Code review workflow' },
            ],
          },
        },
        {
          id: 'blk2_callout_warn',
          type: 'callout',
          data: {
            type: 'warning',
            title: 'Avoid Over-Engineering',
            text: 'Don\'t introduce complex patterns like micro-frontends or event-driven architecture unless your project truly needs them. Start simple, measure, and optimize only when you have real data to back the decision.',
          },
        },
        {
          id: 'blk2_divider2',
          type: 'divider',
          data: { style: 'solid' },
        },
        {
          id: 'blk2_h2_deploy',
          type: 'heading',
          data: { text: 'Shipping to Production', level: 2 },
        },
        {
          id: 'blk2_p_deploy',
          type: 'paragraph',
          data: {
            text: 'The gap between local development and production is where many developers struggle. Here are the critical steps I follow for every deployment:',
          },
        },
        {
          id: 'blk2_list_deploy',
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              'Run full test suite and type checking before every deploy',
              'Use environment-specific configurations (.env.local, .env.production)',
              'Enable error monitoring with Sentry or LogRocket',
              'Set up proper CORS, rate limiting, and CSP headers',
              'Configure database connection pooling for production loads',
            ],
          },
        },
        {
          id: 'blk2_video',
          type: 'video',
          data: {
            url: 'https://www.youtube.com/watch?v=Sklc_fQBmcs',
            caption: 'Watch: Full-Stack Project Deployment Walkthrough',
          },
        },
        {
          id: 'blk2_callout_success',
          type: 'callout',
          data: {
            type: 'success',
            title: 'Milestone Achieved',
            text: 'Following these practices, I successfully deployed over 15 production applications with 99.9% uptime. The key is consistency — treat every deployment with the same rigor, regardless of the project size.',
          },
        },
        {
          id: 'blk2_callout_error',
          type: 'callout',
          data: {
            type: 'error',
            title: 'Deployment Gotcha',
            text: 'Always verify that your environment variables are properly set in the deployment platform BEFORE deploying. Missing env vars are the #1 cause of production crashes after deployment.',
          },
        },
        {
          id: 'blk2_spacer',
          type: 'spacer',
          data: { height: 30 },
        },
        {
          id: 'blk2_html',
          type: 'html',
          data: {
            code: `<div style="text-align:center; padding:24px; border-radius:16px; background:linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%); color:white; margin:24px 0;">
  <h3 style="margin:0 0 10px 0; font-size:1.4rem; font-weight:700;">🚀 Let's Build Something Amazing</h3>
  <p style="margin:0; opacity:0.92; font-size:1rem; line-height:1.6;">I'm available for freelance projects, consulting, and collaboration. Let's turn your ideas into reality.</p>
</div>`,
          },
        },
        {
          id: 'blk2_button_contact',
          type: 'button',
          data: {
            text: '💬 Get In Touch',
            url: '/contact',
            style: 'primary',
          },
        },
        {
          id: 'blk2_button_projects',
          type: 'button',
          data: {
            text: 'View My Projects →',
            url: '/portfolio',
            style: 'outline',
          },
        },
        {
          id: 'blk2_img_author',
          type: 'image',
          data: {
            url: '/Irfan.png',
            alt: 'MD Shahreer Irfan',
            caption: 'MD Shahreer Irfan — Full-Stack Developer & Designer',
            width: 'small',
          },
        },
      ],
    },
  ];

  for (const post of blogPosts) {
    const blog = await Blog.create(post);
    console.log(`✅  Created blog: "${blog.title}" (slug: ${blog.slug})`);
  }

  console.log(`\n🎉  Successfully seeded ${blogPosts.length} blog posts with ALL block types!`);
  console.log('   Block types used: heading, paragraph, image, gallery, list, quote, code, table, video, divider, callout, button, html, spacer');

  await mongoose.disconnect();
  console.log('🔌  Disconnected from MongoDB');
}

main().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
