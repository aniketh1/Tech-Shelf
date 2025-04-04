import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { articleId, content } = body;

    // Find the user in our database using clerkUserId
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        body: content,
        articleId,
        authorId: dbUser.id,
      },
      include: {
        author: {
          select: {
            name: true,
            imageUrl: true,
            clerkUserId: true
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        articleId,
      },
      include: {
        author: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}