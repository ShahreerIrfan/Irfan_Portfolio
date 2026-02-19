import { ProfileData } from './types';

const profile: ProfileData = {
  name: 'MD Shahreer Irfan',
  title: 'Web Design & Developer',
  tagline: 'Django + Next.js Web Developer',
  location: 'Dhaka, Bangladesh',
  bio: 'Passionate full-stack web developer specializing in Python (Django), Next.js, and WordPress. I build scalable web applications with clean architecture and modern UI/UX. With 250+ competitive programming problems solved on Codeforces and ICPC participation, I bring strong problem-solving skills to every project.',
  resumeUrl: '/Shahreer_Irfan_Resume.pdf',
  profileImage: '/Irfan.png',
  socials: [
    {
      platform: 'GitHub',
      url: 'https://github.com/ShahreerIrfan',
      icon: 'github',
      label: 'GitHub Profile',
    },
    {
      platform: 'LinkedIn',
      url: 'https://bd.linkedin.com/in/md-shahreer-irfan-a574011b6',
      icon: 'linkedin',
      label: 'LinkedIn Profile',
    },
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/md.shahreer.irfan.2025',
      icon: 'facebook',
      label: 'Facebook Profile',
    },
    {
      platform: 'Email',
      url: 'mailto:mdshahreerirfan@gmail.com',
      icon: 'mail',
      label: 'Email Me',
    },
  ],
  snippets: {
    yearsExperience: 6,
    primaryStack: 'Django + Next.js',
    problemsSolved: '250+ (Codeforces & ICPC)',
  },
  education: [
    {
      degree: 'BSc in Computer Science & Engineering',
      institution: 'Southeast University',
      location: 'Dhaka, Bangladesh',
      period: '2022 – Present',
      startYear: 2022,
      endYear: null,
      description: 'Pursuing BSc in CSE with focus on software engineering, algorithms, and web technologies.',
      highlights: [
        'Active competitive programmer — 250+ problems on Codeforces',
        'ICPC participant',
        'Focus on Data Structures, Algorithms, and Web Development',
      ],
    },
  ],
  experience: [
    {
      title: 'Web Developer',
      company: 'Jago Tech BD',
      location: 'Dhaka, Bangladesh',
      period: 'Jun 2024 – Nov 2025',
      startDate: '2024-06',
      endDate: '2025-11',
      responsibilities: [
        'Developed and maintained full-stack web applications using Django and Next.js',
        'Built RESTful APIs with Django REST Framework for scalable backend services',
        'Implemented responsive front-end interfaces with React, Next.js, and Tailwind CSS',
        'Collaborated with cross-functional teams to deliver projects on tight deadlines',
        'Optimized application performance and database queries for production workloads',
        'Managed deployment pipelines and server configurations',
      ],
      techStack: ['Django', 'Next.js', 'Django REST Framework', 'Tailwind CSS', 'PostgreSQL', 'React'],
    },
    {
      title: 'Web Developer',
      company: 'EcommerceCare',
      location: 'Remote',
      period: 'Nov 2021 – Dec 2022',
      startDate: '2021-11',
      endDate: '2022-12',
      responsibilities: [
        'Built and customized WordPress websites using Elementor and custom themes',
        'Developed e-commerce solutions with WooCommerce integration',
        'Created responsive landing pages and marketing websites for clients',
        'Provided technical support and maintenance for existing web properties',
        'Implemented SEO best practices and performance optimizations',
      ],
      techStack: ['WordPress', 'Elementor', 'WooCommerce', 'PHP', 'CSS', 'JavaScript'],
    },
  ],
  skills: [
    {
      category: 'Frontend',
      skills: [
        { name: 'React', level: 'Strong' },
        { name: 'Next.js', level: 'Strong' },
        { name: 'TypeScript', level: 'Comfortable' },
        { name: 'JavaScript', level: 'Strong' },
        { name: 'Tailwind CSS', level: 'Strong' },
        { name: 'HTML/CSS', level: 'Strong' },
      ],
    },
    {
      category: 'Backend',
      skills: [
        { name: 'Python', level: 'Strong' },
        { name: 'Django', level: 'Strong' },
        { name: 'Django REST Framework', level: 'Strong' },
        { name: 'PHP', level: 'Comfortable' },
        { name: 'Node.js', level: 'Comfortable' },
      ],
    },
    {
      category: 'Database',
      skills: [
        { name: 'PostgreSQL', level: 'Comfortable' },
        { name: 'MySQL', level: 'Comfortable' },
        { name: 'SQLite', level: 'Comfortable' },
        { name: 'MongoDB', level: 'Beginner' },
      ],
    },
    {
      category: 'Tools & DevOps',
      skills: [
        { name: 'Git', level: 'Strong' },
        { name: 'GitHub', level: 'Strong' },
        { name: 'Docker', level: 'Beginner' },
        { name: 'Linux', level: 'Comfortable' },
        { name: 'VS Code', level: 'Strong' },
        { name: 'Figma', level: 'Beginner' },
      ],
    },
    {
      category: 'CMS & Cloud',
      skills: [
        { name: 'WordPress', level: 'Strong' },
        { name: 'Elementor', level: 'Strong' },
        { name: 'WooCommerce', level: 'Comfortable' },
        { name: 'Vercel', level: 'Comfortable' },
        { name: 'Netlify', level: 'Comfortable' },
        { name: 'AWS (Basic)', level: 'Beginner' },
      ],
    },
  ],
  projects: [
    {
      id: 'eezzymart',
      title: 'EezzyMart',
      description: 'A full-stack e-commerce platform built with Django backend and Next.js frontend, featuring product management, cart system, user authentication, and payment integration.',
      longDescription: 'EezzyMart is a comprehensive e-commerce solution with a Django REST Framework backend providing robust API endpoints and a Next.js frontend delivering a fast, SEO-friendly shopping experience. Features include product catalog with filtering, shopping cart, user authentication, order management, and responsive design.',
      category: 'Full Stack',
      stack: ['Django', 'Next.js', 'Django REST Framework', 'PostgreSQL', 'Tailwind CSS'],
      links: {
        github: 'https://github.com/shahreerirfan/eezzymart',
      },
      featured: true,
    },
    {
      id: 'roofing-siding',
      title: 'Roofing & Siding',
      description: 'A professional business website for a roofing and siding company, built with WordPress and Elementor, featuring service showcases, testimonials, and contact forms.',
      category: 'WordPress',
      stack: ['WordPress', 'Elementor', 'CSS', 'JavaScript'],
      links: {
        live: '#',
      },
      featured: true,
    },
    {
      id: 'portfolio',
      title: 'Personal Portfolio',
      description: 'This portfolio website built with Next.js, TypeScript, Tailwind CSS, and GSAP animations. Features dark mode, command palette, and smooth scroll effects.',
      category: 'Frontend',
      stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP'],
      links: {
        github: 'https://github.com/shahreerirfan/portfolio',
      },
      featured: false,
    },
  ],
  githubStats: {
    totalContributions: 487,
    repositories: 55,
    pullRequests: 38,
    issues: 15,
    stars: 12,
    currentStreak: 7,
    longestStreak: 455,
    contributionData: [
      0, 2, 1, 0, 3, 2, 1, 0, 0, 1, 2, 4, 3, 1,
      0, 1, 0, 2, 3, 1, 0, 0, 2, 1, 3, 5, 2, 1,
      0, 0, 1, 2, 1, 0, 3, 4, 2, 1, 0, 1, 2, 3,
      1, 0, 0, 2, 3, 1, 4, 2, 1, 0,
    ],
  },
};

export default profile;
