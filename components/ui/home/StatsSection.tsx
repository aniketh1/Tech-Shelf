'use client';

import { useStats } from '@/hooks/useStats';

export const StatsSection = () => {
  const stats = useStats();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl backdrop-blur-sm border border-white/10">
          <h3 className="text-4xl font-bold text-white mb-2">{stats.totalArticles}+</h3>
          <p className="text-gray-400">Published Articles</p>
        </div>
        <div className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl backdrop-blur-sm border border-white/10">
          <h3 className="text-4xl font-bold text-white mb-2">{stats.totalAuthors}+</h3>
          <p className="text-gray-400">Expert Writers</p>
        </div>
        <div className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl backdrop-blur-sm border border-white/10">
          <h3 className="text-4xl font-bold text-white mb-2">{stats.totalViews}+</h3>
          <p className="text-gray-400">Total Readers</p>
        </div>
      </div>
    </div>
  );
};