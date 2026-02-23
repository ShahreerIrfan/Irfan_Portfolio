import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Analytics from '@/models/Analytics';
import Blog from '@/models/Blog';
import Contact from '@/models/Contact';
import Project from '@/models/Project';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/analytics - Track a page view (public)
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';
    const referrer = req.headers.get('referer') || '';

    await Analytics.create({
      page: data.page || '/',
      slug: data.slug || '',
      ip: typeof ip === 'string' ? ip.split(',')[0].trim() : '',
      country: data.country || 'Unknown',
      city: data.city || 'Unknown',
      userAgent,
      referrer,
      sessionId: data.sessionId || '',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET /api/analytics - Get analytics data (admin only)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') || '30');
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [
    totalViews,
    uniqueVisitors,
    viewsByPage,
    viewsByDay,
    topCountries,
    totalBlogs,
    totalProjects,
    totalContacts,
    recentViews,
    topBlogs,
  ] = await Promise.all([
    Analytics.countDocuments({ createdAt: { $gte: since } }),
    Analytics.distinct('sessionId', { createdAt: { $gte: since } }).then(s => s.length),
    Analytics.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Analytics.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Analytics.aggregate([
      { $match: { createdAt: { $gte: since }, country: { $ne: 'Unknown' } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Blog.countDocuments(),
    Project.countDocuments(),
    Contact.countDocuments({ createdAt: { $gte: since } }),
    Analytics.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(20).lean(),
    Blog.find({ published: true }).sort({ views: -1 }).limit(5).select('title slug views').lean(),
  ]);

  return NextResponse.json({
    totalViews,
    uniqueVisitors,
    viewsByPage,
    viewsByDay,
    topCountries,
    totalBlogs,
    totalProjects,
    totalContacts,
    recentViews,
    topBlogs,
  });
}
