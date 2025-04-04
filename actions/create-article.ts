'use server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

const createArticleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters').max(50, 'Category cannot exceed 50 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  featuredImage: z.string().min(1, 'Featured image is required')
})

type ValidationErrors = {
  title?: string[]
  category?: string[]
  content?: string[]
  featuredImage?: string[]
}

export const createArticle = async (formData: FormData) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { error: 'Unauthorized' };
        }
        
        const dbUser = await prisma.user.findUnique({
            where: { clerkUserId: user.id }
        });
        
        if (!dbUser) {
            return { error: 'User not found' };
        }
        
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const content = formData.get('content') as string;
        const featuredImage = formData.get('featuredImage') as string;
        
        // Log the data for debugging
        console.log("Form data received:", { title, category, content: content.substring(0, 50), featuredImage });
        
        const result = createArticleSchema.safeParse({
            title,
            category,
            content,
            featuredImage
        });
        
        if (!result.success) {
            const errors: ValidationErrors = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as keyof ValidationErrors;
                if (!errors[path]) {
                    errors[path] = [];
                }
                errors[path]?.push(issue.message);
            });
            
            console.log("Validation errors:", errors);
            
            return {
                error: 'Validation failed',
                errors
            };
        }
        
        // Create the article
        const article = await prisma.articles.create({
            data: {
                title: result.data.title,
                content: result.data.content,
                category: result.data.category,
                featuredImage: result.data.featuredImage,
                authorId: dbUser.id
            }
        });
        
        return { success: true, article };
    } catch (error) {
        console.error('Error creating article:', error);
        return { error: 'Internal Server Error' };
    }
}