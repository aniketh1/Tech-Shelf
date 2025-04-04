import React, { Suspense } from 'react'
import {Card} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import dynamic from 'next/dynamic'

const ImageWithFallback = dynamic(() => import('./ImageWithFallback'), {
  loading: () => <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse"></div>
})

async function TopArticles() {
  const articles = await prisma.articles.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return (
    <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
      {articles.map((article) => (
        <Card key={article.id} className={cn(
          "group relative overflow-hidden transition-all hover:scale-[1.02]",
          "border border-gray-200/50 dark:border-white/20",
          "bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
        )}>
          <div className='p-6'>
            <Link href={`/articles/${article.id}`}>
              {article.featuredImage && (
                <div className='relative mb-4 h-48 w-full overflow-hidden rounded-xl'>
                  <ImageWithFallback
                    src={article.featuredImage.startsWith('http') ? article.featuredImage : `/images/${article.featuredImage}`}
                    fallbackSrc="/images/placeholder.jpg"
                    alt={article.title}
                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    quality={75}
                  />
                </div>
              )}
              <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300'>
                {article.author?.imageUrl && (
                  <ImageWithFallback
                    src={article.author.imageUrl}
                    alt={article.author.name || 'Author'}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                )}
                <span>{article.author.name}</span>
              </div>

              <h2 className='mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100'>
                {article.title}
              </h2>
              <p className='mt-2 text-gray-600 dark:text-gray-300 line-clamp-2'>
                {article.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
              </p>
              <div className='mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <span>5 min read</span>
              </div>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default TopArticles
