'use client';

import { GitBranch, GitCommit, Star, GitPullRequest, AlertCircle, Flame, Trophy, Activity } from 'lucide-react';
import { useGsapReveal, useGsapStagger, useCountUp } from '@/hooks/useGsap';
import profile from '@/data/profile';

const stats = [
  { icon: GitCommit, label: 'Contributions', value: profile.githubStats.totalContributions, color: 'from-green-500 to-emerald-400' },
  { icon: GitBranch, label: 'Repositories', value: profile.githubStats.repositories, color: 'from-blue-500 to-cyan-400' },
  { icon: GitPullRequest, label: 'Pull Requests', value: profile.githubStats.pullRequests, color: 'from-purple-500 to-pink-400' },
  { icon: Star, label: 'Stars Earned', value: profile.githubStats.stars, color: 'from-amber-500 to-yellow-400' },
];

function ContributionGraph() {
  const { contributionData } = profile.githubStats;

  // Pad to 52 weeks × 7 days
  const padded = [...contributionData];
  while (padded.length < 52 * 7) padded.push(0);

  const getLevel = (val: number) => {
    if (val === 0) return 0;
    if (val <= 1) return 1;
    if (val <= 2) return 2;
    if (val <= 3) return 3;
    if (val <= 4) return 4;
    return 5;
  };

  const weeks: number[][] = [];
  for (let w = 0; w < 52; w++) {
    weeks.push(padded.slice(w * 7, w * 7 + 7));
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px] min-w-[700px]">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[3px]">
            {week.map((day, dIdx) => (
              <div
                key={dIdx}
                className={`w-[13px] h-[13px] contrib-cell contrib-${getLevel(day)}`}
                title={`${day} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-[#49454F]/60 dark:text-dark-text-secondary/60">
        <span>Less</span>
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <div key={level} className={`w-[13px] h-[13px] rounded-[3px] contrib-${level}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function GitHubShowcase() {
  const titleRef = useGsapReveal({ y: 40 });
  const statsRef = useGsapStagger({ stagger: 0.08, scale: true });
  const graphRef = useGsapReveal({ y: 30, delay: 0.2 });
  const streakRef = useGsapReveal({ y: 30, delay: 0.3 });

  const countContrib = useCountUp(profile.githubStats.totalContributions, 2);
  const countRepos = useCountUp(profile.githubStats.repositories, 1.5);
  const countPRs = useCountUp(profile.githubStats.pullRequests, 1.5);
  const countStars = useCountUp(profile.githubStats.stars, 1.5);

  const countRefs = [countContrib, countRepos, countPRs, countStars];

  return (
    <section id="github" className="relative overflow-hidden section-animated-bg">
      <div className="section-container">
        <div ref={titleRef}>
          <h2 className="section-title">GitHub Activity</h2>
          <p className="section-subtitle">Open source contributions and coding activity overview</p>
        </div>

        {/* Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-10">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="glass-card-hover p-5 md:p-6 text-center group">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="stat-number mb-1">
                <span ref={countRefs[idx]}>{stat.value}</span>
              </p>
              <p className="text-sm font-medium text-[#49454F] dark:text-dark-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contribution Graph */}
        <div ref={graphRef} className="glass-card p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[var(--active-accent)]" />
              <h3 className="text-lg font-bold text-[#1B1B1F] dark:text-dark-text">Contribution Graph</h3>
            </div>
            <a
              href={`https://github.com/${profile.socials.find(s => s.icon === 'github')?.url.split('/').pop() || 'shahreerirfan'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--active-accent)] hover:underline"
            >
              View on GitHub →
            </a>
          </div>
          <ContributionGraph />
        </div>

        {/* Streak Cards */}
        <div ref={streakRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card-hover p-6 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-[#1B1B1F] dark:text-dark-text">{profile.githubStats.currentStreak}</p>
            <p className="text-sm text-[#49454F] dark:text-dark-text-secondary">Current Streak</p>
            <p className="text-xs text-[#49454F]/50 mt-1">days</p>
          </div>
          <div className="glass-card-hover p-6 text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-[#1B1B1F] dark:text-dark-text">{profile.githubStats.longestStreak}</p>
            <p className="text-sm text-[#49454F] dark:text-dark-text-secondary">Longest Streak</p>
            <p className="text-xs text-[#49454F]/50 mt-1">days</p>
          </div>
          <div className="glass-card-hover p-6 text-center">
            <AlertCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-[#1B1B1F] dark:text-dark-text">{profile.githubStats.issues}</p>
            <p className="text-sm text-[#49454F] dark:text-dark-text-secondary">Issues Opened</p>
            <p className="text-xs text-[#49454F]/50 mt-1">contributions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
