import { Metadata } from 'next'
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Tech Insights Hub',
    template: '%s | Tech Insights Hub'
  },
  description: 'Discover the latest technology trends, in-depth articles, and innovative insights',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    let user = null;
    
    try {
        user = await currentUser();  
        if (user) {
            try {
                await prisma.user.upsert({
                    where: { clerkUserId: user.id },
                    update: {},
                    create: {
                        clerkUserId: user.id,
                        email: user.emailAddresses[0]?.emailAddress || '',
                        name: user.fullName || 'User',
                        imageUrl: user.imageUrl || '',
                    }
                });
            } catch (error) {
                console.error('Database operation failed:', error);
            }
        }
    } catch (error) {
        console.error('Authentication error:', error);
    }

    return <>{children}</>;
}