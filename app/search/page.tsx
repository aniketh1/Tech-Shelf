'use client'

import React, { useEffect, useState, useCallback, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { User, FileImage, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import debounce from 'lodash/debounce'

// Define types based on Prisma schema
type Article = {
  id: string
  title: string
  content: string
  category: string
  featuredImage: string
  authorId: string
  createdAt: Date
  author?: {
    name: string
    imageUrl: string
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const query = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value !== searchTerm) {
        startTransition(() => {
          router.push(value ? `/search?q=${encodeURIComponent(value)}` : '/search')
        })
      }
    }, 300),
    [router, searchTerm]
  )

  useEffect(() => {
    const fetchArticles = async () => {
      if (!query) {
        setSearchResults([])
        return
      }
      
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${currentPage}`)
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        const data = await response.json()
        setSearchResults(data.articles)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.totalCount)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [query])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    router.push('/search')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="relative mb-8">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search articles..."
              className="pl-10 pr-10 w-full h-12 text-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 rounded-xl shadow-lg transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {loading ? 'Searching...' : (
            searchResults.length > 0 
              ? `Search results for "${query}"` 
              : `No results found for "${query}"`
          )}
        </h1>

        <div className="space-y-6">
          {loading && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Searching for articles...</p>
            </div>
          )}

          {!loading && totalCount > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing {searchResults.length} of {totalCount} results
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-2 my-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          <AnimatePresence>
            {!loading && searchResults.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/articles/${article.id}`}>
                  <Card className="hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <div className="relative h-48 md:h-full bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-xl flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none overflow-hidden">
                          {article.featuredImage ? (
                            <div className="w-full h-full relative group">
                              <Image
                                src={article.featuredImage.startsWith('http') ? article.featuredImage : `/images/${article.featuredImage}`}
                                alt={article.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-700/50">
                              <FileImage className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <CardHeader>
                          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{article.title}</CardTitle>
                          {article.author && (
                            <div className="flex items-center mt-2">
                              <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-xl flex items-center justify-center">
                                {article.author.imageUrl ? (
                                  <img 
                                    src={article.author.imageUrl}
                                    alt={article.author.name}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-gray-500" />
                                )}
                                <div className="hidden absolute inset-0 flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-500" />
                                </div>
                              </div>
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                {article.author.name}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(article.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div 
                            className="text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: article.content.length > 150
                                ? `${article.content.substring(0, 150)}...`
                                : article.content
                            }}
                          />
                          <div className="mt-2">
                            <span className="text-xs bg-blue-100/50 dark:bg-blue-900/50 backdrop-blur-xl text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                              {article.category}
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && searchResults.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                Try searching for a different term or browse our categories below.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link href="/articles?category=Technology">
                  <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 backdrop-blur-xl text-blue-800 dark:text-blue-200 rounded-full cursor-pointer hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-colors">
                    Technology
                  </span>
                </Link>
                <Link href="/articles?category=Gadgets">
                  <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 backdrop-blur-xl text-blue-800 dark:text-blue-200 rounded-full cursor-pointer hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-colors">
                    Gadgets
                  </span>
                </Link>
                <Link href="/articles?category=Programming">
                  <span className="px-4 py-2 bg-blue-100/50 dark:bg-blue-900/50 backdrop-blur-xl text-blue-800 dark:text-blue-200 rounded-full cursor-pointer hover:bg-blue-200/50 dark:hover:bg-blue-800/50 transition-colors">
                    Programming
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}