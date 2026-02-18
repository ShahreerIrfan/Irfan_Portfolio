export interface Social {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  startYear: number;
  endYear: number | null;
  description?: string;
  highlights?: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  techStack: string[];
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Comfortable' | 'Strong';
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  stack: string[];
  links: {
    live?: string;
    github?: string;
    playStore?: string;
  };
  featured: boolean;
  image?: string;
}

export interface GitHubStats {
  totalContributions: number;
  repositories: number;
  pullRequests: number;
  issues: number;
  stars: number;
  currentStreak: number;
  longestStreak: number;
  contributionData: number[];
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  location: string;
  bio: string;
  resumeUrl: string;
  profileImage: string;
  socials: Social[];
  education: Education[];
  experience: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  githubStats: GitHubStats;
  snippets: {
    yearsExperience: number;
    primaryStack: string;
    problemsSolved: string;
  };
}
