import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    const article = await prisma.articles.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const article = await prisma.articles.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (article.author.clerkUserId !== user.id) {
      return NextResponse.json({ error: 'Not authorized to edit this article' }, { status: 403 });
    }

    const data = await request.json();
    const { title, content, featuredImage } = data;

    const updatedArticle = await prisma.articles.update({
      where: { id },
      data: {
        title,
        content,
        featuredImage,
      },
      include: {
        author: true,
        comments: true,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id || typeof id !== 'string') {
      console.warn('Invalid article ID format:', id);
      return NextResponse.json({ 
        error: 'Invalid article ID format',
        details: 'The provided ID is either missing or not in the correct format'
      }, { status: 400 });
    }
    console.log(`Attempting to delete article with ID: ${id}`);

    const user = await currentUser();
    if (!user) {
      console.warn('Unauthorized deletion attempt - no user found');
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    const article = await prisma.articles.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!article) {
      console.warn(`Article not found with ID: ${id}`);
      return NextResponse.json({ 
        error: 'Article not found',
        details: `The article with ID ${id} does not exist in the database`
      }, { status: 404 });
    }

    if (article.author.clerkUserId !== user.id) {
      console.warn(`Unauthorized deletion attempt by user ${user.id} for article ${id}`);
      return NextResponse.json({ error: 'You are not authorized to delete this article' }, { status: 403 });
    }

    // Delete all comments associated with the article first
    const deletedComments = await prisma.comment.deleteMany({
      where: { articleId: id }
    });
    console.log(`Deleted ${deletedComments.count} comments for article ${id}`);

    // Then delete the article
    await prisma.articles.delete({
      where: { id }
    });
    console.log(`Successfully deleted article ${id}`);

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detailed error:', errorMessage);
    
    if (errorMessage.includes('Record to delete does not exist') || errorMessage.includes('RecordNotFound')) {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      return NextResponse.json({ 
        error: 'Article not found',
        details: `The article with ID ${id} could not be found in the database`
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to delete article',
      details: errorMessage
    }, { status: 500 });
  }
}