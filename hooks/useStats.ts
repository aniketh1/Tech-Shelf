import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

type Stats = {
  totalArticles: number;
  totalAuthors: number;
  totalViews: number;
};

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    totalReaders: 0,
    totalWriters: 0,
    totalViews: 0,
  });

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
    });

    // Listen for stats updates
    socketInstance.on('statsUpdate', (data: Stats) => {
      setStats(data);
    });

    // Initial fetch
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data: Stats) => setStats(data))
      .catch((error) => console.error('Error fetching stats:', error));

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return stats;
};