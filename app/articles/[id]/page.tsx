import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Comments } from '@/components/articles/Comments';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const article = await prisma.articles.findUnique({
    where: { id },
    include: { author: true }
  });

  if (!article) {
    return {
      title: 'Article Not Found'
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article.title,
    description: article.excerpt || article.content.substring(0, 160),
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      type: 'article',
      publishedTime: article.createdAt.toISOString(),
      authors: [article.author.name],
      images: article.featuredImage
        ? [article.featuredImage, ...previousImages]
        : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: article.featuredImage ? [article.featuredImage] : []
    }
  };
}

async function trackArticleView(articleId: string) {
  try {
    await fetch(`/api/articles/${articleId}/analytics`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error tracking article view:', error);
  }
}

async function ArticlePage({ params }: { params: { id: string } }) {
  // Await params before using its properties
  const { id } = await params;
  const article = await prisma.articles.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  // Track the article view
  await trackArticleView(id);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-left text-red-600">Article not found</h1>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-left text-white">
        {article.title}
      </h1>
      
      {article.featuredImage && (
        <div className="aspect-video w-full overflow-hidden relative rounded-lg mb-8">
          <Image
            src={article.featuredImage.startsWith('http') ? article.featuredImage : `/images/${article.featuredImage}`}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}

      <div className="flex items-center justify-between mb-8 border-b border-purple-500/20 pb-4">
        <div className="flex items-center space-x-4">
          {article.author?.imageUrl && (
            <Image
              src={article.author.imageUrl}
              alt={article.author.name || 'Author'}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold">{article.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600">
            {article.category}
          </span>
        </div>
      </div>

      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <Comments articleId={article.id} />
    </article>
  );
}

export default ArticlePage;