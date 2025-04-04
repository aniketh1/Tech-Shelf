'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from 'next-themes';

interface TopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const topics = [
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'programming', label: 'Programming', icon: '👨‍💻' },
  { id: 'app-development', label: 'App Development', icon: '📱' },
  { id: 'web-development', label: 'Web Development', icon: '🌐' },
  { id: 'laptop', label: 'Laptop', icon: '💻' },
  { id: 'smart-phone', label: 'Smart Phone', icon: '📱' },
  { id: 'ai-ml', label: 'AI/ML', icon: '🤖' },
  { id: 'tools', label: 'Tools', icon: '🛠️' }
];

const TopicDialog = ({ open, onOpenChange }: TopicDialogProps) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const handleTopicSelect = (topicId: string) => {
    router.push(`/search?q=${encodeURIComponent(topicId)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose a Topic
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic.id)}
              className={`p-4 rounded-xl text-left transition-all duration-200 ${resolvedTheme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'} backdrop-blur-lg border border-gray-200/50 dark:border-white/20 group`}
            >
              <div className="text-2xl mb-2 transform transition-transform group-hover:scale-110">
                {topic.icon}
              </div>
              <div className="font-semibold text-sm">{topic.label}</div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicDialog;