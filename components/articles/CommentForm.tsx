'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface CommentFormProps {
  articleId: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ articleId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          content: comment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      setComment('');
      toast({
        title: 'Success',
        description: 'Comment posted successfully',
      });
      onCommentAdded?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        className="min-h-[100px] resize-none"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  );
}