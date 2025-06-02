import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        articles: {
          include: {
            analytics: true
          }
        }
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate total views
    const totalViews = dbUser.articles.reduce(
      (sum, article) => sum + (article.analytics?.views || 0),
      0
    );

    // Calculate average engagement rate
    const avgEngagementRate = dbUser.articles.reduce(
      (sum, article) => sum + (article.analytics?.engagementRate || 0),
      0
    ) / (dbUser.articles.length || 1);

    // Get top articles
    const topArticles = dbUser.articles
      .map(article => ({
        title: article.title,
        views: article.analytics?.views || 0,
        engagement: `${(article.analytics?.engagementRate || 0).toFixed(1)}%`
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Calculate monthly views
    const monthlyViews = dbUser.articles.reduce((acc, article) => {
      const month = new Date(article.createdAt).toLocaleString('default', { month: 'short' });
      const views = article.analytics?.views || 0;
      
      const existingMonth = acc.find(m => m.month === month);
      if (existingMonth) {
        existingMonth.views += views;
      } else {
        acc.push({ month, views });
      }
      
      return acc;
    }, [] as Array<{ month: string; views: number }>);

    // Sort monthly views by date
    monthlyViews.sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    // Calculate active readers (unique visitors in the last 24 hours)
    const activeReaders = dbUser.articles.reduce(
      (sum, article) => sum + (article.analytics?.uniqueVisitors || 0),
      0
    );

    return NextResponse.json({
      totalViews,
      avgEngagementRate,
      activeReaders,
      topArticles,
      monthlyViews
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 