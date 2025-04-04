'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  content: string;
  featuredImage: string;
  createdAt: string;
  author: {
    name: string;
    imageUrl: string;
  };
}

export default function ArticlesPage() {
  const { userId } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const response = await fetch('/api/user/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        toast.error('Failed to load articles');
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserArticles();
    }
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete article');
      
      setArticles(articles.filter(article => article.id !== id));
      toast.success('Article deleted successfully');
    } catch (error) {
      toast.error('Failed to delete article');
      console.error('Error deleting article:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Articles
        </h1>
        <Link href="/dashboard/articles/create">
          <Button>Create New Article</Button>
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-4">No articles yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start creating your first article!</p>
          <Link href="/dashboard/articles/create">
            <Button>Create Article</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                </Link>

                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  <Link href={`/articles/${article.id}`}>{article.title}</Link>
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                  {article.content.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/articles/edit/${article.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
