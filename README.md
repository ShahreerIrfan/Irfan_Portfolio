# MD Shahreer Irfan — Portfolio

A modern, responsive personal portfolio website built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **GSAP** scroll animations.

## Features

- **Microsoft Fluent-inspired** light theme with dark mode toggle
- **GSAP + ScrollTrigger** animations (fade, stagger, timeline draw, parallax)
- **Command Palette** (Ctrl+K) for quick navigation
- **Keyboard shortcuts** (G=GitHub, P=Projects, C=Contact, etc.)
- **Theme accent selector** (Blue / Purple / Teal)
- **Scroll progress indicator** at top
- **Back-to-top** button with smooth scroll
- **Active section highlighting** in navbar
- **Copy-to-clipboard** for email/phone with toast notifications
- **Project filtering** by tech stack + search
- **GitHub Activity** section (static preview + optional live fetch)
- **Responsive** (mobile drawer nav, tablet, desktop)
- **SEO-friendly** (Open Graph, meta tags, semantic HTML)
- **Accessible** (keyboard navigable, ARIA labels, focus rings, contrast)
- **Reduced motion** support (respects `prefers-reduced-motion`)
- **Lazy-loaded** heavy sections (dynamic imports)
- **localStorage** persisted theme + accent preferences

## Tech Stack

| Category   | Technology                       |
| ---------- | -------------------------------- |
| Framework  | Next.js 14 (App Router)          |
| Language   | TypeScript                       |
| Styling    | Tailwind CSS 3                   |
| Animations | GSAP + ScrollTrigger             |
| Icons      | lucide-react                     |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

## How to Edit Content

All content is stored in **`src/data/profile.ts`**. Edit this file to update:

- Name, title, tagline, bio
- Social links (GitHub, LinkedIn, email, phone)
- Education entries
- Work experience entries
- Skills (grouped by category, with skill levels)
- Projects (title, description, stack, links, featured flag)
- GitHub stats (static mock data)

**You don't need to touch any component files to update your content.**

### Adding a New Project

Add an entry to the `projects` array in `src/data/profile.ts`:

```ts
{
  id: 'my-project',
  title: 'My New Project',
  description: 'A short description.',
  category: 'Full Stack',
  stack: ['React', 'Node.js'],
  links: {
    live: 'https://example.com',
    github: 'https://github.com/...',
  },
  featured: true,
}
```

### Updating Resume

Replace `public/Shahreer_Irfan_Resume.pdf` with your updated PDF.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind + custom styles
│   ├── layout.tsx           # Root layout with SEO metadata
│   └── page.tsx             # Main page (all sections)
├── components/
│   ├── Navbar.tsx            # Sticky navbar + mobile drawer
│   ├── Hero.tsx              # Hero section with GSAP intro
│   ├── About.tsx             # Snapshot cards
│   ├── Education.tsx         # Education timeline
│   ├── Experience.tsx        # Work experience timeline
│   ├── TechStack.tsx         # Skills with search/filter
│   ├── GitHubShowcase.tsx    # GitHub activity section
│   ├── Projects.tsx          # Project cards with filtering
│   ├── Contact.tsx           # Contact form + info
│   ├── Footer.tsx            # Footer
│   ├── ThemeProvider.tsx     # Theme context + persistence
│   ├── Toast.tsx             # Toast notification system
│   ├── CommandPalette.tsx    # Ctrl+K command palette
│   ├── ScrollProgress.tsx    # Top scroll progress bar
│   ├── BackToTop.tsx         # Back to top button
│   ├── Card.tsx              # Reusable glass card
│   └── SkeletonLoader.tsx    # Loading skeletons
├── data/
│   ├── profile.ts            # All content data
│   └── types.ts              # TypeScript interfaces
└── hooks/
    └── useGsap.ts            # GSAP animation hooks
```

## Deployment

### Vercel (Recommended)

1. Push your repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Deploy — zero config needed for Next.js

### Netlify

1. Push to GitHub
2. Import at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Install the [Next.js plugin](https://docs.netlify.com/integrations/frameworks/next-js/)

## License

MIT — feel free to use and modify for your own portfolio.
# Irfan_Portfolio
