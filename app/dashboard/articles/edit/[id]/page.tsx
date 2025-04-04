'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Import with enhanced error handling
const Editor = dynamic(
  () => import('../../../../../components/Editor')
    .then(mod => {
      // Verify the module is valid
      if (!mod || typeof mod !== 'object' || !mod.default) {
        throw new Error('Invalid Editor module structure');
      }
      return mod;
    })
    .catch(err => {
      console.error('Error loading Editor component:', err);
      // Return a more robust fallback component
      return {
        default: ({ value, onChange, placeholder }: any) => (
          <div className="border p-4 rounded bg-red-50">
            <p className="text-red-500 mb-2">Editor failed to load</p>
            <p className="text-sm text-gray-600 mb-4">Please try refreshing the page. If the problem persists, contact support.</p>
            <textarea 
              value={value || ''} 
              onChange={(e) => onChange && onChange(e.target.value)}
              placeholder={placeholder || 'Write your article content here...'}
              className="w-full h-[500px] p-2 border rounded"
            />
          </div>
        )
      };
    }),
  { 
    ssr: false,
    loading: () => <div className="min-h-[500px] w-full bg-gray-100 animate-pulse flex items-center justify-center">Loading editor...</div>
  }
);

interface Article {
  id: string;
  title: string;
  content: string;
  featuredImage: string;
}

// Helper function to validate image URLs
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.startsWith('http') || 
    url.startsWith('/') || 
    url.startsWith('data:image/') || 
    url.startsWith('blob:')
  );
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleId = params?.id as string;
        if (!articleId) {
          toast.error('Invalid article ID');
          router.push('/dashboard/articles');
          return;
        }

        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch article');
        }
        const data = await response.json();
        
        if (!data || !data.title) {
          throw new Error('Invalid article data received');
        }
        
        setArticle(data);
        setTitle(data.title);
        setContent(data.content);
        setFeaturedImage(data.featuredImage || '');
        
        // Validate the image URL before setting preview
        const imageUrl = data.featuredImage || '';
        if (imageUrl && typeof imageUrl === 'string' && isValidImageUrl(imageUrl)) {
          setImagePreview(imageUrl);
          setImageError(false);
        } else {
          setImagePreview('');
        }
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load article');
        console.error('Error fetching article:', error);
        router.push('/dashboard/articles');
      }
    };

    if (userId) {
      fetchArticle();
    }
  }, [userId, params, router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid image format. Please use JPEG, PNG, GIF or WebP');
      return;
    }

    try {
      // Reset error state when trying a new image
      setImageError(false);
      
      // Create a local preview first
      const localPreview = URL.createObjectURL(file);
      setImagePreview(localPreview);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      if (!data.url) throw new Error('No URL returned from upload');
      
      setFeaturedImage(data.url);
      // Keep using the local preview for display
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Error uploading image:', error);
      // Reset the preview on error
      setImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const articleId = params?.id as string;
      if (!articleId) {
        toast.error('Invalid article ID');
        router.push('/dashboard/articles');
        return;
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          featuredImage,
        }),
      });

      if (!response.ok) throw new Error('Failed to update article');

      toast.success('Article updated successfully');
      router.push('/dashboard/articles');
    } catch (error) {
      toast.error('Failed to update article');
      console.error('Error updating article:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Article not found</h3>
        <Button onClick={() => router.push('/dashboard/articles')}>
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Edit Article
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/articles')}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="featuredImage">Featured Image</Label>
          <div className="flex items-center gap-4">
            <Input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {imagePreview && !imageError ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', imagePreview);
                    // Prevent infinite error loops by removing the src
                    e.currentTarget.src = '';
                    // Set error state to prevent further attempts
                    setImageError(true);
                    setImagePreview('');
                    toast.error('Failed to load image preview');
                  }}
                  unoptimized={true} // Always use unoptimized for previews to avoid Next.js image optimization issues
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <div className="min-h-[500px] border rounded-lg">
            <Editor
              value={content}
              onChange={(value: string) => setContent(value)}
              placeholder="Write your article content here..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/articles')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
