import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalArticles, totalReaders, totalWriters, totalViews] = await Promise.all([
      prisma.articles.count(),
      prisma.user.count(), // All users are readers
      prisma.user.count({
        where: {
          articles: {
            some: {} // Users with at least one article are writers
          }
        }
      }),
      prisma.articleAnalytics.aggregate({
        _sum: {
          views: true
        }
      })
    ]);

    return NextResponse.json({
      totalArticles,
      totalReaders,
      totalWriters,
      totalViews: totalViews._sum.views || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}