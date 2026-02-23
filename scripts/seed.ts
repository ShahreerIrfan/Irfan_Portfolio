/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script — populates MongoDB with initial data for the portfolio.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires MONGODB_URI in .env.local (loaded automatically).
 */

import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not found in .env.local');
  process.exit(1);
}

// ---------- helpers ----------
async function getModel(name: string) {
  // Dynamic import so models register only after mongoose.connect()
  const mod = await import(`../src/models/${name}`);
  return mod.default as mongoose.Model<unknown>;
}

// ---------- seed data ----------

const blogs = [
  {
    title: 'Getting Started with Next.js 14 App Router',
    slug: 'getting-started-nextjs-14-app-router',
    excerpt: 'Learn how to build modern web applications using the Next.js 14 App Router with server components, layouts, and more.',
    content: `<h2>Why Next.js 14?</h2><p>Next.js 14 brings incredible improvements to the developer experience with the stable App Router. In this guide, we'll walk through setting up a project, using server and client components, and deploying to Vercel.</p><h3>Setting Up</h3><p>Run <code>npx create-next-app@latest</code> and choose the App Router option. Next.js will scaffold a project with TypeScript, Tailwind CSS, and ESLint already configured.</p><h3>Server Components</h3><p>By default, all components inside the <code>app/</code> directory are React Server Components. This means they render on the server and send zero JavaScript to the client unless you opt in with <code>'use client'</code>.</p><h3>Layouts & Loading States</h3><p>Create a <code>layout.tsx</code> file in any route folder to share UI across child routes. Add <code>loading.tsx</code> for automatic Suspense boundaries.</p><p>Happy coding!</p>`,
    coverImage: '/shahreer_irfan.jpg',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'TypeScript', 'App Router'],
    published: true,
    featured: true,
    readTime: 6,
    metaTitle: 'Getting Started with Next.js 14 App Router | MD Shahreer Irfan',
    metaDescription: 'A complete guide to building modern web apps with Next.js 14 App Router, server components, and Tailwind CSS.',
  },
  {
    title: 'Building REST APIs with Django REST Framework',
    slug: 'building-rest-apis-django-rest-framework',
    excerpt: 'A practical walkthrough of building scalable RESTful APIs using Django REST Framework with serializers, viewsets, and authentication.',
    content: `<h2>Django REST Framework</h2><p>Django REST Framework (DRF) makes it incredibly simple to build powerful APIs. Combined with Django's ORM and admin panel, you get a full-featured backend in no time.</p><h3>Serializers</h3><p>Serializers convert complex querysets and model instances into native Python data types that can be rendered into JSON. They also handle deserialization and validation.</p><h3>ViewSets & Routers</h3><p>ViewSets combine the logic for a set of related views in a single class. Routers automatically generate URL patterns for your ViewSets.</p><h3>Authentication</h3><p>DRF supports Token, Session, and JWT authentication out of the box. For production, I recommend combining JWT tokens with Django's permission system.</p><p>Check out the official docs at <a href="https://www.django-rest-framework.org">django-rest-framework.org</a>.</p>`,
    coverImage: '/shahreer_irfan2.jpg',
    category: 'Backend',
    tags: ['Django', 'Python', 'REST API', 'DRF'],
    published: true,
    featured: true,
    readTime: 8,
    metaTitle: 'Building REST APIs with Django REST Framework | MD Shahreer Irfan',
    metaDescription: 'Learn to build scalable REST APIs with Django REST Framework, serializers, viewsets, and JWT authentication.',
  },
  {
    title: 'WordPress Development: From Theme to Plugin',
    slug: 'wordpress-development-theme-to-plugin',
    excerpt: 'Explore the fundamentals of WordPress development, from creating custom themes with Elementor to building your own plugins.',
    content: `<h2>WordPress Still Powers the Web</h2><p>Over 40% of the web runs on WordPress, and for good reason. It's flexible, extensible, and has a massive ecosystem of themes and plugins.</p><h3>Custom Themes</h3><p>Start with a starter theme or build from scratch using the Template Hierarchy. Use Elementor for drag-and-drop page building while keeping things performant.</p><h3>WooCommerce</h3><p>For e-commerce projects, WooCommerce is the go-to solution. It provides product management, cart, checkout, and payment gateway integrations.</p><h3>Plugin Development</h3><p>WordPress plugins follow a hook-based architecture. Use actions and filters to extend functionality without modifying core files. Always sanitize inputs and escape outputs for security.</p>`,
    coverImage: '/shahreer_irfan3.jpg',
    category: 'WordPress',
    tags: ['WordPress', 'Elementor', 'WooCommerce', 'PHP'],
    published: true,
    featured: false,
    readTime: 5,
    metaTitle: 'WordPress Development: From Theme to Plugin | MD Shahreer Irfan',
    metaDescription: 'Master WordPress development from custom themes and Elementor to WooCommerce and plugin development.',
  },
  {
    title: 'Tailwind CSS Tips for Better UI Design',
    slug: 'tailwind-css-tips-better-ui-design',
    excerpt: 'Practical Tailwind CSS tips and tricks to build beautiful, responsive interfaces faster.',
    content: `<h2>Level Up Your Tailwind CSS</h2><p>Tailwind CSS is a utility-first CSS framework that lets you build custom designs without leaving your HTML. Here are my top tips for working with it effectively.</p><h3>1. Use the @apply Directive Sparingly</h3><p>While @apply can be useful for component classes, overusing it defeats the purpose of utility-first CSS. Reserve it for truly reusable patterns.</p><h3>2. Dark Mode Made Easy</h3><p>Configure <code>darkMode: 'class'</code> in your tailwind config and prefix utilities with <code>dark:</code>. Combine with a ThemeProvider for automatic system preference detection.</p><h3>3. Custom Gradients</h3><p>Use <code>bg-gradient-to-r from-blue-500 to-purple-600</code> for beautiful gradient backgrounds. Add hover variants for interactive elements.</p>`,
    coverImage: '/shahreer_irfan4.jpg',
    category: 'Frontend',
    tags: ['Tailwind CSS', 'CSS', 'UI Design', 'Frontend'],
    published: true,
    featured: false,
    readTime: 4,
    metaTitle: 'Tailwind CSS Tips for Better UI Design | MD Shahreer Irfan',
    metaDescription: 'Practical tips and tricks for Tailwind CSS to design better, responsive user interfaces faster.',
  },
];

const projects = [
  {
    title: 'EezzyMart',
    slug: 'eezzymart',
    description: 'A full-stack e-commerce platform built with Django backend and Next.js frontend, featuring product management, cart system, user authentication, and payment integration.',
    longDescription: 'EezzyMart is a comprehensive e-commerce solution with a Django REST Framework backend providing robust API endpoints and a Next.js frontend delivering a fast, SEO-friendly shopping experience. Features include product catalog with filtering, shopping cart, user authentication, order management, and responsive design.',
    category: 'Full Stack',
    stack: ['Django', 'Next.js', 'Django REST Framework', 'PostgreSQL', 'Tailwind CSS'],
    githubUrl: 'https://github.com/shahreerirfan/eezzymart',
    featured: true,
    published: true,
    order: 1,
    image: '/shahreer_irfan.jpg',
  },
  {
    title: 'Roofing & Siding Website',
    slug: 'roofing-siding-website',
    description: 'A professional business website for a roofing and siding company, built with WordPress and Elementor, featuring service showcases, testimonials, and contact forms.',
    longDescription: 'A complete business website built for a roofing and siding company. Developed using WordPress and Elementor with a focus on local SEO, fast loading speed, and conversion optimization. Includes service pages, before/after galleries, testimonials, and an integrated contact form.',
    category: 'WordPress',
    stack: ['WordPress', 'Elementor', 'CSS', 'JavaScript'],
    featured: true,
    published: true,
    order: 2,
    image: '/shahreer_irfan2.jpg',
  },
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'This portfolio website built with Next.js, TypeScript, Tailwind CSS, and GSAP animations. Features dark mode, command palette, AI chat, and smooth scroll effects.',
    longDescription: 'A modern developer portfolio built from scratch with Next.js 14, TypeScript, and Tailwind CSS. Features include 12 color themes, AI-powered chat, command palette with keyboard shortcuts, GSAP animations, dynamic blog, admin dashboard, and full MongoDB backend.',
    category: 'Frontend',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP', 'MongoDB'],
    githubUrl: 'https://github.com/shahreerirfan/portfolio',
    featured: true,
    published: true,
    order: 3,
    image: '/shahreer_irfan3.jpg',
  },
  {
    title: 'Django Blog Platform',
    slug: 'django-blog-platform',
    description: 'A full-featured blogging platform built with Django, featuring rich text editing, categories, tags, comments, and an admin panel.',
    longDescription: 'A complete blogging platform with Django backend featuring a rich text editor, image uploads, category and tag management, SEO-friendly URLs, comment system with moderation, and a custom admin dashboard for content management.',
    category: 'Full Stack',
    stack: ['Django', 'Python', 'PostgreSQL', 'Bootstrap', 'JavaScript'],
    featured: false,
    published: true,
    order: 4,
    image: '/shahreer_irfan4.jpg',
  },
];

const services = [
  {
    title: 'Full Stack Web Development',
    slug: 'full-stack-web-development',
    description: 'End-to-end web application development with modern frameworks and scalable architecture.',
    longDescription: 'I build complete web applications from frontend to backend using Django, Next.js, and modern tech stacks. From database design to deployment, I handle every aspect of your project including API development, authentication, real-time features, and responsive UI.',
    icon: 'Code2',
    gradient: 'from-blue-500 to-cyan-400',
    features: ['Custom web applications', 'RESTful API development', 'Database design & optimization', 'Authentication & authorization', 'Cloud deployment & DevOps', 'Performance optimization'],
    published: true,
    featured: true,
    order: 1,
    price: 'Starting from $500',
  },
  {
    title: 'WordPress Development',
    slug: 'wordpress-development',
    description: 'Professional WordPress websites with custom themes, plugins, and WooCommerce integration.',
    longDescription: 'I create stunning WordPress websites using Elementor and custom themes. Whether you need a business website, blog, or full e-commerce store with WooCommerce, I deliver fast, SEO-optimized sites that convert visitors into customers.',
    icon: 'Globe',
    gradient: 'from-purple-500 to-pink-400',
    features: ['Custom theme development', 'Elementor page building', 'WooCommerce e-commerce', 'Plugin customization', 'SEO optimization', 'Speed optimization'],
    published: true,
    featured: true,
    order: 2,
    price: 'Starting from $300',
  },
  {
    title: 'Frontend Development',
    slug: 'frontend-development',
    description: 'Modern, responsive, and interactive frontend interfaces built with React and Next.js.',
    longDescription: 'I specialize in building beautiful, performant frontend applications using React, Next.js, and TypeScript. With Tailwind CSS and GSAP animations, I create pixel-perfect interfaces that provide exceptional user experiences across all devices.',
    icon: 'Layout',
    gradient: 'from-amber-500 to-orange-400',
    features: ['React & Next.js apps', 'TypeScript development', 'Responsive design', 'Animation & interactions', 'Tailwind CSS styling', 'Performance optimization'],
    published: true,
    featured: true,
    order: 3,
    price: 'Starting from $250',
  },
  {
    title: 'API Development',
    slug: 'api-development',
    description: 'Robust and scalable REST APIs with Django REST Framework and Node.js.',
    longDescription: 'I design and build production-ready REST APIs using Django REST Framework and Node.js. My APIs are well-documented, secured with JWT authentication, include rate limiting, and are optimized for high performance.',
    icon: 'Server',
    gradient: 'from-emerald-500 to-teal-400',
    features: ['REST API design', 'Django REST Framework', 'Node.js/Express', 'JWT authentication', 'API documentation', 'Rate limiting & security'],
    published: true,
    featured: false,
    order: 4,
    price: 'Starting from $400',
  },
  {
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Clean and modern user interface design with focus on user experience and accessibility.',
    longDescription: 'I create intuitive and visually appealing user interfaces with a focus on usability and accessibility. From wireframes to high-fidelity designs, I ensure every interaction is thoughtful and every design decision serves the user.',
    icon: 'Palette',
    gradient: 'from-rose-500 to-red-400',
    features: ['UI design & prototyping', 'User experience research', 'Responsive layouts', 'Design systems', 'Accessibility (WCAG)', 'Figma designs'],
    published: true,
    featured: false,
    order: 5,
    price: 'Starting from $200',
  },
  {
    title: 'Technical Consultation',
    slug: 'technical-consultation',
    description: 'Expert technical advice on architecture, tech stack selection, and best practices.',
    longDescription: 'Need guidance on choosing the right technology stack, architecting your application, or optimizing an existing codebase? I provide expert technical consultation to help you make informed decisions and avoid common pitfalls.',
    icon: 'MessageCircle',
    gradient: 'from-indigo-500 to-violet-400',
    features: ['Architecture review', 'Tech stack selection', 'Code audit & review', 'Performance analysis', 'Security assessment', 'Best practices guidance'],
    published: true,
    featured: false,
    order: 6,
    price: 'Starting from $100/hour',
  },
];

const faqs = [
  {
    question: 'What technologies do you specialize in?',
    answer: 'I specialize in Django (Python), Next.js (React), TypeScript, and WordPress. For databases, I work with PostgreSQL, MySQL, and MongoDB. I also have experience with Docker, Git, and cloud platforms like Vercel and AWS.',
    category: 'General',
    order: 1,
    published: true,
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on complexity. A simple WordPress site takes 1-2 weeks, a custom web application 4-8 weeks, and a full e-commerce platform 8-12 weeks. I always provide detailed timelines during the consultation phase.',
    category: 'Projects',
    order: 2,
    published: true,
  },
  {
    question: 'Do you offer ongoing maintenance and support?',
    answer: 'Yes! I offer monthly maintenance packages that include security updates, bug fixes, performance monitoring, content updates, and technical support. Plans start from $50/month depending on the project.',
    category: 'Services',
    order: 3,
    published: true,
  },
  {
    question: 'What is your development process?',
    answer: 'My process follows: 1) Discovery & consultation, 2) Planning & wireframes, 3) Design mockups, 4) Development sprints, 5) Testing & QA, 6) Launch & deployment, 7) Post-launch support. I keep clients updated throughout every stage.',
    category: 'Process',
    order: 4,
    published: true,
  },
  {
    question: 'Can you work with existing codebases?',
    answer: 'Absolutely! I regularly work with existing projects — whether it\'s fixing bugs, adding features, refactoring code, or migrating to a modern tech stack. I start with a thorough code audit to understand the current state.',
    category: 'General',
    order: 5,
    published: true,
  },
  {
    question: "How do I get started with a project?",
    answer: 'Simply reach out through the contact form or email me at mdshahreerirfan@gmail.com. We\'ll schedule a free consultation to discuss your requirements, timeline, and budget. I\'ll then provide a detailed proposal and quote.',
    category: 'Getting Started',
    order: 6,
    published: true,
  },
  {
    question: 'Do you do competitive programming?',
    answer: 'Yes! I\'m an active competitive programmer with 250+ problems solved on Codeforces and have participated in ICPC. This background in algorithms and data structures helps me write efficient, optimized code for real-world projects.',
    category: 'General',
    order: 7,
    published: true,
  },
  {
    question: 'What are your payment terms?',
    answer: 'I typically work with a 50% upfront and 50% upon completion model for fixed-price projects. For hourly work, I invoice bi-weekly. I accept payments via bank transfer, PayPal, and other popular payment methods.',
    category: 'Business',
    order: 8,
    published: true,
  },
];

const galleryItems = [
  {
    title: 'Professional Portrait',
    description: 'Professional headshot for portfolio and LinkedIn.',
    imageUrl: '/shahreer_irfan.jpg',
    category: 'Portrait',
    order: 1,
    published: true,
  },
  {
    title: 'At Work',
    description: 'Working on web development projects.',
    imageUrl: '/shahreer_irfan2.jpg',
    category: 'Work',
    order: 2,
    published: true,
  },
  {
    title: 'Casual Photo',
    description: 'Casual photo from a recent event.',
    imageUrl: '/shahreer_irfan3.jpg',
    category: 'Personal',
    order: 3,
    published: true,
  },
  {
    title: 'Team Meetup',
    description: 'Meeting with the development team.',
    imageUrl: '/shahreer_irfan4.jpg',
    category: 'Work',
    order: 4,
    published: true,
  },
  {
    title: 'Conference Photo',
    description: 'At a tech conference in Dhaka.',
    imageUrl: '/shahreer_irfan5.jpg',
    category: 'Events',
    order: 5,
    published: true,
  },
];

const siteSettings = [
  { key: 'siteName', value: 'MD Shahreer Irfan — Portfolio' },
  { key: 'siteDescription', value: 'Full Stack Web Developer specializing in Django, Next.js & WordPress' },
  { key: 'contactEmail', value: 'mdshahreerirfan@gmail.com' },
  { key: 'contactPhone', value: '+880 XXXX XXXXXX' },
  { key: 'location', value: 'Dhaka, Bangladesh' },
  { key: 'socialGithub', value: 'https://github.com/ShahreerIrfan' },
  { key: 'socialLinkedin', value: 'https://bd.linkedin.com/in/md-shahreer-irfan-a574011b6' },
  { key: 'socialFacebook', value: 'https://www.facebook.com/md.shahreer.irfan.2025' },
  { key: 'heroTitle', value: 'MD Shahreer Irfan' },
  { key: 'heroSubtitle', value: 'Django + Next.js Web Developer' },
  { key: 'aboutBio', value: 'Passionate full-stack web developer specializing in Python (Django), Next.js, and WordPress. I build scalable web applications with clean architecture and modern UI/UX.' },
];

// ---------- run ----------
async function seed() {
  console.log('🔌 Connecting to MongoDB …');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!\n');

  const Blog     = await getModel('Blog');
  const Project  = await getModel('Project');
  const Service  = await getModel('Service');
  const FAQ      = await getModel('FAQ');
  const Gallery  = await getModel('Gallery');
  const Settings = await getModel('SiteSettings');

  // Clear existing data
  console.log('🗑️  Clearing existing data …');
  await Promise.all([
    Blog.deleteMany({}),
    Project.deleteMany({}),
    Service.deleteMany({}),
    FAQ.deleteMany({}),
    Gallery.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  // Insert data
  console.log('📝 Seeding blogs …');
  await Blog.insertMany(blogs);
  console.log(`   ✓ ${blogs.length} blog posts`);

  console.log('📦 Seeding projects …');
  await Project.insertMany(projects);
  console.log(`   ✓ ${projects.length} projects`);

  console.log('🔧 Seeding services …');
  await Service.insertMany(services);
  console.log(`   ✓ ${services.length} services`);

  console.log('❓ Seeding FAQs …');
  await FAQ.insertMany(faqs);
  console.log(`   ✓ ${faqs.length} FAQs`);

  console.log('🖼️  Seeding gallery …');
  await Gallery.insertMany(galleryItems);
  console.log(`   ✓ ${galleryItems.length} gallery images`);

  console.log('⚙️  Seeding site settings …');
  for (const setting of siteSettings) {
    await Settings.updateOne({ key: setting.key }, { $set: setting }, { upsert: true });
  }
  console.log(`   ✓ ${siteSettings.length} settings`);

  console.log('\n🎉 Seed complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
