'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface DeleteButtonProps {
  articleId: string;
  onDelete?: () => void;
}

export function DeleteButton({ articleId, onDelete }: DeleteButtonProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      toast({
        title: 'Success',
        description: 'Article deleted successfully',
      });

      // Emit socket event for real-time updates
      const socket = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
        path: '/api/socket',
        transports: ['websocket', 'polling']
      });
      socket.emit('articleDeleted', articleId);
      socket.disconnect();

      onDelete?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete article',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}