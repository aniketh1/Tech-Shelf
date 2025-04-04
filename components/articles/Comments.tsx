'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentForm } from './CommentForm';

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: {
    name: string;
    imageUrl: string;
  };
}

interface CommentsProps {
  articleId: string;
}

export function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-2xl font-bold">Comments</h2>
      <CommentForm articleId={articleId} onCommentAdded={fetchComments} />
      
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4 border-b border-gray-200/20 pb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.imageUrl} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{comment.author.name}</h3>
                  <time className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{comment.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}