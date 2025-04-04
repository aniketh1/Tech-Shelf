'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import dynamic from 'next/dynamic'
import { Button } from '../ui/button'
import 'react-quill-new/dist/quill.snow.css';
import { createArticle } from '@/actions/create-article'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

function CreateArticlePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = React.useTransition();
  const [formState, setFormState] = React.useState({ errors: {} });

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        // Extract form data for client-side validation
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const featuredImageFile = formData.get('featured-image') as File;

        // Client-side validation
        const errors: Record<string, string[]> = {};

        if (!title) errors.title = ['Title is required'];
        if (!category) errors.category = ['Category is required'];
        if (!content || content.replace(/<[^>]*>/g, '').trim().length < 10) {
          errors.content = ['Content must be at least 10 characters (excluding HTML tags)'];
        }
        if (!featuredImageFile || featuredImageFile.size === 0) {
          errors.featuredImage = ['Featured image is required'];
        }

        // If there are client-side validation errors, show them
        if (Object.keys(errors).length > 0) {
          setFormState({ errors });
          return;
        }

        // For now, use a placeholder for the image URL
        // In a real app, you would upload the image to a storage service and get the URL
        const imagePlaceholder = featuredImageFile.name;

        // Create a new FormData to send to the server
        const serverFormData = new FormData();
        serverFormData.append('title', title);
        serverFormData.append('category', category);
        serverFormData.append('content', content);
        serverFormData.append('featuredImage', imagePlaceholder);

        const result = await createArticle(serverFormData);
        
        if (result.success) {
          toast.success('Article published successfully!');
          router.push('/dashboard');
        } else {
          setFormState({ errors: result.errors || {} });
          if (result.error) {
            toast.error(result.error);
          }
        }
      } catch (error) {
        toast.error('Failed to publish article');
        console.error(error);
      }
    });
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Create Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor="title">Title</Label>
              <Input
                type='text'
                id="title"
                name='title'
                placeholder='Enter the Article Title'
              />
              {formState?.errors?.title && (
                <p className="text-sm text-red-500">{formState.errors.title}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor="category">Category</Label>
              <select
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground'
                name="category"
                id="category"
              >
                <option value="">Select Category</option>
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="app-development">App Development</option>
                <option value="web-development">Web Development</option>
                <option value="laptop">Laptop</option>
                <option value="smart-phone">Smart Phone</option>
                <option value="ai-ml">AI/ML</option>
                <option value="tools">Tools</option>
              </select>
              {formState?.errors?.category && (
                <p className="text-sm text-red-500">{formState.errors.category}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='featured-image'>Featured Image</Label>
              <Input
                type='file'
                id='featured-image'
                name='featured-image'
                accept='image/*'
                placeholder='Upload Featured Image'
                className='cursor-pointer'
              />
              {formState?.errors?.featuredImage && (
                <p className="text-sm text-red-500">{formState.errors.featuredImage}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor="editor">Content</Label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className='min-h-100'
                id="editor"
              />
              {formState?.errors?.content && (
                <p className="text-sm text-red-500">{formState.errors.content}</p>
              )}
            </div>
            <div className='flex justify-end gap-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Publishing...' : 'Publish'}
              </Button>
              <Button variant='secondary' type="button" onClick={() => router.push('/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateArticlePage