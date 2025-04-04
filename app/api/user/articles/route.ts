import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Fetch user data
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });

    if (!dbUser) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Fetch user's articles
    const articles = await prisma.articles.findMany({
      where: { authorId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true,
      },
    });

    return new NextResponse(JSON.stringify({ user: dbUser, articles }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching user articles:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}