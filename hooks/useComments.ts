import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    imageUrl: string;
  };
  article: {
    title: string;
  };
};

type CommentsData = {
  totalComments: number;
  avgCommentsPerArticle: number;
  activeUsers: number;
  recentComments: Comment[];
};

export const useComments = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [commentsData, setCommentsData] = useState<CommentsData>({
    totalComments: 0,
    avgCommentsPerArticle: 0,
    activeUsers: 0,
    recentComments: []
  });

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socket',
      transports: ['websocket', 'polling']
    });
    setSocket(socketInstance);

    // Listen for new comments
    socketInstance.on('newComment', (comment: Comment) => {
      setCommentsData(prev => ({
        ...prev,
        totalComments: prev.totalComments + 1,
        recentComments: [comment, ...prev.recentComments.slice(0, 4)]
      }));
    });

    // Initial fetch
    fetch('/api/comments/analytics')
      .then(res => res.json())
      .then(data => setCommentsData(data))
      .catch(error => console.error('Error fetching comments data:', error));

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return commentsData;
}; 