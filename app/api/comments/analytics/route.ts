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
            comments: {
              include: {
                author: true,
                article: true
              }
            }
          }
        }
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate total comments
    const totalComments = dbUser.articles.reduce(
      (sum, article) => sum + (article.comments?.length || 0),
      0
    );

    // Calculate average comments per article
    const avgCommentsPerArticle = dbUser.articles.length > 0
      ? totalComments / dbUser.articles.length
      : 0;

    // Get recent comments
    const recentComments = dbUser.articles
      .flatMap(article => article.comments || [])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(comment => ({
        id: comment.id,
        content: comment.body,
        createdAt: comment.createdAt,
        user: {
          name: comment.author.name,
          imageUrl: comment.author.imageUrl
        },
        article: {
          title: comment.article.title
        }
      }));

    // Calculate active users (unique commenters in the last 24 hours)
    const activeUsers = new Set(
      dbUser.articles
        .flatMap(article => article.comments || [])
        .filter(comment => {
          const commentDate = new Date(comment.createdAt);
          const now = new Date();
          return now.getTime() - commentDate.getTime() <= 24 * 60 * 60 * 1000;
        })
        .map(comment => comment.authorId)
    ).size;

    return NextResponse.json({
      totalComments,
      avgCommentsPerArticle,
      activeUsers,
      recentComments
    });
  } catch (error) {
    console.error('Error fetching comments analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments analytics' },
      { status: 500 }
    );
  }
} 