import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tech Articles - Latest Technology Insights and News',
  description: 'Explore our collection of in-depth technology articles, expert insights, and latest tech news. Stay informed about digital transformation, innovation, and tech trends.',
  openGraph: {
    title: 'Tech Articles - Latest Technology Insights and News',
    description: 'Explore our collection of in-depth technology articles, expert insights, and latest tech news.',
    type: 'website',
    images: ['/images/tech-shelf-og.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Articles - Latest Technology Insights and News',
    description: 'Explore our collection of in-depth technology articles, expert insights, and latest tech news.',
    images: ['/images/tech-shelf-og.jpg']
  }
};

async function ArticlesPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  const [articles, totalCount] = await Promise.all([
    prisma.articles.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.articles.count()
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-3  text-left bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Featured Articles
      </h1>
      <hr/>
      <div className="grid mt-8 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id} className="group relative overflow-hidden transition-all hover:scale-[1.02] border border-gray-200/50 dark:border-white/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl">
            <div className="p-6">
              <Link href={`/articles/${article.id}`}>
                {article.featuredImage && (
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                    <Image
                      src={article.featuredImage.startsWith('http') ? article.featuredImage : `/images/${article.featuredImage}`}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  {article.author?.imageUrl && (
                    <Image
                      src={article.author.imageUrl}
                      alt={article.author.name || 'Author'}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  )}
                  <span>{article.author.name}</span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {article.title}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                  {article.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </p>
                <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  <span>5 min read</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 my-6">
          <Link
            href={`/articles?page=${Math.max(page - 1, 1)}`}
            className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Previous
          </Link>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/articles?page=${Math.min(page + 1, totalPages)}`}
            className={`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}

export default ArticlesPage;