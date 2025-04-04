import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get or create analytics for the article
    const analytics = await prisma.articleAnalytics.upsert({
      where: {
        articleId: id
      },
      create: {
        articleId: id,
        views: 1,
        uniqueVisitors: 1,
        engagementRate: 0
      },
      update: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error updating article analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update article analytics' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const analytics = await prisma.articleAnalytics.findUnique({
      where: {
        articleId: id
      }
    });

    if (!analytics) {
      return NextResponse.json({
        views: 0,
        uniqueVisitors: 0,
        engagementRate: 0
      });
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching article analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article analytics' },
      { status: 500 }
    );
  }
}